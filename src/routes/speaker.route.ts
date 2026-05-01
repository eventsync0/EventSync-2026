import { Router } from "express";
import { prisma } from "../config/lib/prisma";

const router = Router();

/**
 * GET /api/speakers
 * Public route - liste tous les speakers avec leurs liens
 */
router.get("/", async (req, res) => {
  try {
    const speakers = await prisma.speaker.findMany({
      include: {
        links: true,
      },
      orderBy: {
        fullName: "asc",
      },
    });

    return res.json({
      data: speakers,
    });
  } catch (error) {
    console.error("Error fetching speakers:", error);

    return res.status(500).json({
      error: "Erreur lors de la récupération des speakers",
    });
  }
});

/**
 * GET /api/speakers/:id
 * Public route - speaker par ID avec ses liens
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const speaker = await prisma.speaker.findUnique({
      where: { id },
      include: {
        links: true,
      },
    });

    if (!speaker) {
      return res.status(404).json({
        error: "Speaker not found",
      });
    }

    return res.json({
      data: speaker,
    });
  } catch (error) {
    console.error("Error fetching speaker:", error);

    return res.status(500).json({
      error: "Erreur lors de la récupération du speaker",
    });
  }
});

export default router;