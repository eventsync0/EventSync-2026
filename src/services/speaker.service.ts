import { prisma } from "../config/lib/prisma";

export class SpeakerService {
    
    static async getSpeakers() {
        return prisma.speaker.findMany({
            orderBy: { fullName: "asc" },
            include: {
                links: true,
                sessions: {
                    orderBy: { startTime: "asc" },
                    include: {
                        event: true,
                        room: true,
                    },
                },
            },
        });
    }

    static async getSpeakerById(id: string) {
        return prisma.speaker.findUnique({
            where: { id },
            include: {
                links: true,
                sessions: {
                    orderBy: { startTime: "asc" },
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
        // suppression des anciens liens (comme dans ton controller)
        await prisma.speakerLink.deleteMany({
            where: { speakerId: id },
        });

        return prisma.speaker.update({
            where: { id },
            data: {
                fullName: data.fullName,
                photoUrl: data.photoUrl,
                bio: data.bio,
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
    }

    static async deleteSpeaker(id: string) {
        return prisma.speaker.delete({
            where: { id },
        });
    }
}