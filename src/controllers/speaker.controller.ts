import { Request, Response } from "express";
import { prisma } from "../config/lib/prisma";

export const getAllSpeakers = async (_req: Request, res: Response) => {
  try {
    const speakers = await prisma.speaker.findMany({
      include: {
        links: true, 
        sessions: true, 
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


export const getSpeakerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    const speaker = await prisma.speaker.findUnique({
      where: { id },
      include: {
        links: true, // ✅ corrigé
        sessions: true,
      },
    });

    if (!speaker) {
      return res.status(404).json({
        success: false,
        message: "Speaker introuvable",
      });
    }

    return res.status(200).json({
      success: true,
      data: speaker,
    });
  } catch (error) {
    console.error("GET SPEAKER BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération du speaker",
    });
  }
};


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

export const updateSpeaker = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fullName, photoUrl, bio, links } = req.body;

    // 1. Vérifier existence speaker
    const existingSpeaker = await prisma.speaker.findUnique({
      where: { id },
    });

    if (!existingSpeaker) {
      return res.status(404).json({
        success: false,
        message: "Speaker introuvable",
      });
    }

    // 2. Supprimer anciens liens
    await prisma.speakerLink.deleteMany({
      where: {
        speakerId: id,
      },
    });

    // 3. Update speaker + recréer links
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

    return res.json({
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