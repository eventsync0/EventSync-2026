import { Request, Response } from "express";
import { prisma } from "../config/lib/prisma";

/**
 * GET /api/speakers
 * Public - liste tous les speakers
 */
export const getAllSpeakers = async (_req: Request, res: Response) => {
  try {
    const speakers = await prisma.speaker.findMany({
      include: {
        speakerLinks: true,
        sessions: true, // optionnel (tu peux enlever si pas encore utile)
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
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération des speakers",
    });
  }
};

/**
 * GET /api/speakers/:id
 * Public - récupérer un speaker par ID avec ses liens
 */
export const getSpeakerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const speaker = await prisma.speaker.findUnique({
      where: { id },
      include: {
        speakerLinks: true,
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
    console.error(error);

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

    // 1. Validation simple
    if (!fullName || fullName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "fullName est requis",
      });
    }

    // 2. Création speaker + liens
    const speaker = await prisma.speaker.create({
      data: {
        fullName,
        photoUrl,
        bio,
        speakerLinks: speakerLinks
          ? {
              create: speakerLinks.map((link: any) => ({
                platform: link.platform,
                url: link.url,
              })),
            }
          : undefined,
      },
      include: {
        speakerLinks: true,
      },
    });

    return res.status(201).json({
      success: true,
      data: speaker,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Erreur lors de la création du speaker",
    });
  }
};