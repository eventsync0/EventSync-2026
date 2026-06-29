import { prisma } from "../config/lib/prisma";

export class SpeakerService {
    /**
     * Récupérer tous les speakers
     */
    static async getSpeakers() {
        return prisma.speaker.findMany({
            orderBy: {
                fullName: "asc",
            },
            include: {
                links: true,
                sessions: {
                    orderBy: {
                        startTime: "asc",
                    },
                    include: {
                        event: true,
                        room: true,
                    },
                },
            },
        });
    }

    /**
     * Récupérer un speaker par ID
     */
    static async getSpeakerById(id: string) {
        return prisma.speaker.findUnique({
            where: { id },
            include: {
                links: true,
                sessions: {
                    orderBy: {
                        startTime: "asc",
                    },
                    include: {
                        event: true,
                        room: true,
                        questions: {
                            orderBy: {
                                upvotes: "desc",
                            },
                        },
                    },
                },
            },
        });
    }

    /**
     * Créer un speaker + ses liens externes
     */
    static async createSpeaker(data: {
        fullName: string;
        photoUrl?: string;
        bio?: string;
        speakerLinks?: {
            platform: string;
            url: string;
        }[];
    }) {
        return prisma.speaker.create({
            data: {
                fullName: data.fullName,
                photoUrl: data.photoUrl ?? null,
                bio: data.bio ?? null,

                links: data.speakerLinks?.length
                    ? {
                          create: data.speakerLinks.map((link) => ({
                              platform: link.platform,
                              url: link.url,
                          })),
                      }
                    : undefined,
            },
            include: {
                links: true,
            },
        });
    }

    /**
     * Mettre à jour un speaker + remplacement complet des liens
     */
    static async updateSpeaker(
        id: string,
        data: {
            fullName?: string;
            photoUrl?: string;
            bio?: string;
            links?: {
                platform: string;
                url: string;
            }[];
        }
    ) {
        return prisma.$transaction(async (tx) => {
            // Vérifier existence
            const existing = await tx.speaker.findUnique({
                where: { id },
                include: { links: true },
            });

            if (!existing) {
                throw new Error("Speaker not found");
            }

            // Supprimer anciens liens (clean update)
            await tx.speakerLink.deleteMany({
                where: { speakerId: id },
            });

            // Update speaker + recréation des liens
            const updated = await tx.speaker.update({
                where: { id },
                data: {
                    fullName: data.fullName ?? existing.fullName,
                    photoUrl: data.photoUrl ?? existing.photoUrl,
                    bio: data.bio ?? existing.bio,

                    links: data.links?.length
                        ? {
                              create: data.links.map((link) => ({
                                  platform: link.platform,
                                  url: link.url,
                              })),
                          }
                        : undefined,
                },
                include: {
                    links: true,
                },
            });

            return updated;
        });
    }

    /**
     * Supprimer un speaker (cascade links + sessions via Prisma relation)
     */
    static async deleteSpeaker(id: string) {
        return prisma.speaker.delete({
            where: { id },
        });
    }
}