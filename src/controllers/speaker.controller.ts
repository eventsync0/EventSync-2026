import { Request, Response } from "express";
import { prisma } from "../config/lib/prisma";
import { computeIsLive } from "../utils/isLive";

export class SpeakerController {

    getAllSpeakers = async (_req: Request, res: Response) => {
        try {
            const speakers = await prisma.speaker.findMany({
                include: {
                    links: true, 
                },
                orderBy: {
                    fullName: "asc",
                },
            });

            return res.status(200).json({
                success: true,
                count: speakers.length,
                data: speakers,
            });
        } catch (error) {
            console.error("GET ALL SPEAKERS ERROR:", error);

            return res.status(500).json({
                success: false,
                message: "Server error while fetching speakers",
            });
        }
    };


    getSpeakerById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const speaker = await prisma.speaker.findUnique({
                where: { id } as {id :string},
                include: {
                    links: true,
                    sessions: {
                        include: {
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

            if (!speaker) {
                return res.status(404).json({
                    success: false,
                    message: "Speaker not found",
                });
            }

            const enrichedSessions = speaker.sessions.map((session) => ({
                ...session,

                isLive: computeIsLive(
                    new Date(session.startTime),
                    new Date(session.endTime)
                ),

                questions: session.questions.map((q) => ({
                    ...q,
                    authorName: q.authorName ?? "Anonymous",
                })),
            }));

            return res.status(200).json({
                success: true,
                data: {
                    ...speaker,
                    sessions: enrichedSessions,
                },
            });
        } catch (error) {
            console.error("GET SPEAKER BY ID ERROR:", error);

            return res.status(500).json({
                success: false,
                message: "Server error while fetching speaker",
            });
        }
    };


    createSpeaker = async (req: Request, res: Response) => {
        try {
            const { fullName, photoUrl, bio, speakerLinks } = req.body;

            if (!fullName || fullName.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "fullName is required",
                });
            }

            const speaker = await prisma.speaker.create({
                data: {
                    fullName,
                    photoUrl: photoUrl || null,
                    bio: bio || null,
                    links: speakerLinks?.length
                        ? {
                                create: speakerLinks.map((link: any) => ({
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

            return res.status(201).json({
                success: true,
                data: speaker,
            });
        } catch (error) {
            console.error("CREATE SPEAKER ERROR:", error);

            return res.status(500).json({
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Error while creating speaker",
            });
        }
    };

    updateSpeaker = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { fullName, photoUrl, bio, links } = req.body;

            const existingSpeaker = await prisma.speaker.findUnique({
                where: { id } as {id :string},
            });

            if (!existingSpeaker) {
                return res.status(404).json({
                    success: false,
                    message: "Speaker not found",
                });
            }

            // supprimer anciens liens
            await prisma.speakerLink.deleteMany({
                where: { speakerId: id } as {speakerId :string},
            });

            const speaker = await prisma.speaker.update({
                where: { id } as {id :string},
                data: {
                    fullName,
                    photoUrl,
                    bio,
                    links: links?.length
                        ? {
                                create: links.map((link: any) => ({
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

            return res.status(200).json({
                success: true,
                data: speaker,
            });
        } catch (error) {
            console.error("UPDATE SPEAKER ERROR:", error);

            return res.status(500).json({
                success: false,
                message: "Error while updating speaker",
            });
        }
    };

    deleteSpeaker = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const existingSpeaker = await prisma.speaker.findUnique({
                where: { id } as {id :string},
            });

            if (!existingSpeaker) {
                return res.status(404).json({
                    success: false,
                    message: "Speaker not found",
                });
            }

            await prisma.speaker.delete({
                where: { id } as {id :string},
            });

            return res.status(200).json({
                success: true,
                message: "Speaker deleted successfully",
            });
        } catch (error) {
            console.error("DELETE SPEAKER ERROR:", error);

            return res.status(500).json({
                success: false,
                message: "Error while deleting speaker",
            });
        }
    };
}