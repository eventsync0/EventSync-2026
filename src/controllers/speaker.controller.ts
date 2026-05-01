import { Request, Response } from "express";
import { prisma } from "../config/lib/prisma";
import { computeIsLive } from "../utils/isLive";

/**
 * GET /api/speakers
 * Public - liste tous les speakers
 */
 export const getAllSpeakers = async (_req: Request, res: Response) => {
  try {
    const speakers = await prisma.speaker.findMany({
      include: {
        links: true, // ✅ seul ce qui est demandé
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
      message: "Erreur serveur lors de la récupération des speakers",
    });
  }
};

/**
 * GET /api/speakers/:id
 * Public - speaker enrichi (sessions + room + questions + isLive)
 */
export const getSpeakerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const speaker = await prisma.speaker.findUnique({
      where: { id },
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
        message: "Speaker introuvable",
      });
    }

    // 🔥 transformation enrichie
    const enrichedSessions = speaker.sessions.map((session) => ({
      ...session,

      isLive: computeIsLive(
        new Date(session.startTime),
        new Date(session.endTime)
      ),

      questions: session.questions.map((q) => ({
        ...q,
        authorName: q.authorName ?? "Anonyme",
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
      message: "Erreur serveur lors de la récupération du speaker",
    });
  }
};

/**
 * POST /api/speakers
 * Protected - création speaker + links
 */
export const createSpeaker = async (req: Request, res: Response) => {
  try {
    const { fullName, photoUrl, bio, speakerLinks } = req.body;

    if (!fullName || fullName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "fullName est requis",
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
          : "Erreur lors de la création du speaker",
    });
  }
};

/**
 * PUT /api/speakers/:id
 * Protected - update + reset links
 */
export const updateSpeaker = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fullName, photoUrl, bio, links } = req.body;

    const existingSpeaker = await prisma.speaker.findUnique({
      where: { id },
    });

    if (!existingSpeaker) {
      return res.status(404).json({
        success: false,
        message: "Speaker introuvable",
      });
    }

    // supprimer anciens liens
    await prisma.speakerLink.deleteMany({
      where: { speakerId: id },
    });

    const speaker = await prisma.speaker.update({
      where: { id },
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
      message: "Erreur lors de la mise à jour du speaker",
    });
  }
};

/**
 * DELETE /api/speakers/:id
 * Protected - delete speaker (cascade links)
 */
export const deleteSpeaker = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingSpeaker = await prisma.speaker.findUnique({
      where: { id },
    });

    if (!existingSpeaker) {
      return res.status(404).json({
        success: false,
        message: "Speaker introuvable",
      });
    }

    await prisma.speaker.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Intervenant supprimé avec succès",
    });
  } catch (error) {
    console.error("DELETE SPEAKER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du speaker",
    });
  }
};