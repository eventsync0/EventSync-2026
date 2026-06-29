import { Request, Response } from "express";
import { SpeakerService } from "../services/speaker.service";
import { computeIsLive } from "../utils/isLive";

export class SpeakerController {

    getAllSpeakers = async (_req: Request, res: Response) => {
        try {
            const speakers = await SpeakerService.getSpeakers();

            // ajout du lien session (comme ton ancien code)
            const speakersWithSessionLinks = speakers.map((speaker) => ({
                ...speaker,
                sessions: speaker.sessions.map((session) => ({
                    ...session,
                    sessionUrl: `/sessions/${session.id}`,
                })),
            }));

            return res.status(200).json({
                success: true,
                count: speakers.length,
                data: speakersWithSessionLinks,
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

            const speaker = await SpeakerService.getSpeakerById(id);

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

            const speaker = await SpeakerService.createSpeaker({
                fullName,
                photoUrl,
                bio,
                speakerLinks,
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

            const updatedSpeaker = await SpeakerService.updateSpeaker(id, {
                fullName,
                photoUrl,
                bio,
                links,
            });

            return res.status(200).json({
                success: true,
                data: updatedSpeaker,
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

            const existing = await SpeakerService.getSpeakerById(id);

            if (!existing) {
                return res.status(404).json({
                    success: false,
                    message: "Speaker not found",
                });
            }

            await SpeakerService.deleteSpeaker(id);

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