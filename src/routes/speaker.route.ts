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
        links: true
      },
      orderBy: {
        fullName: "asc"
      }
    });

    res.json({
      data: speakers
    });
  } catch (error) {
    console.error("Error fetching speakers:", error);
    res.status(500).json({
      error: "Erreur lors de la récupération des speakers"
    });
  }
});

export default router;