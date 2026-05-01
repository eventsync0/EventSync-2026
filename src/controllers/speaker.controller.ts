import { Request, Response } from "express";
import { prisma } from "../config/lib/prisma";

/**
 * GET /api/speakers
 * Public
 */
export const getAllSpeakers = async (_req: Request, res: Response) => {
  try {
    const speakers = await prisma.speaker.findMany({
      include: {
        speakerLinks: true,
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