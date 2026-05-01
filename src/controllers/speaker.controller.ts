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
    const { id } = req.params;

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