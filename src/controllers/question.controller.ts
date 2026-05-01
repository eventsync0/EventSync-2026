import { Request, Response } from 'express';
import * as QuestionService from '../services/question.service';
import { prisma } from '../config/lib/prisma';
import { computeIsLive } from '../utils/isLive';
import { AuthRequest } from '../middlewares/admin.middleware';

export const getBySession = async (
  req: Request<{ sessionId: string }>,
  res: Response
) => {
  try {
    const { sessionId } = req.params;

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return res.status(404).json({ error: 'Session introuvable' });
    }

    const questions = await QuestionService.getQuestionsBySession(sessionId);
    res.json({ data: questions });
  } catch (error) {
    console.error("ERREUR GET_BY_SESSION :", error);
    res.status(500).json({ error: 'Échec de la récupération des questions' });
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId, content } = req.body;
    const userId = req.userId; // Plus besoin de (req as any)

    console.log("DEBUG CREATE - UserID:", userId, "SessionID:", sessionId);

    if (!content?.trim()) {
      return res.status(400).json({ error: 'La question ne peut pas être vide' });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return res.status(404).json({ error: 'Session introuvable' });
    }

    const isLive = computeIsLive(session.startTime, session.endTime);
    console.log("DEBUG IS_LIVE:", isLive);

    if (!isLive) {
      return res.status(403).json({
        error: 'Les questions ne peuvent être posées que pendant une session en cours',
      });
    }

    const admin = await prisma.admin.findUnique({ 
      where: { id: userId } 
    });

    const question = await QuestionService.createQuestion(
      content,
      sessionId,
      admin?.name || "Utilisateur"
    );

    res.status(201).json({
      data: { ...question, authorName: question.authorName ?? 'Anonyme' },
    });
  } catch (error) {
    console.error("ERREUR DÉTAILLÉE CRÉATION :", error); 
    res.status(500).json({ 
      error: 'Échec de la création',
      details: error instanceof Error ? error.message : "Erreur inconnue"
    });
  }
};

export const upvote = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params; 

    const existing = await prisma.question.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Question introuvable' });
    }

    const updated = await QuestionService.upvoteQuestion(id);

    res.status(200).json({
      data: { ...updated, authorName: updated.authorName ?? 'Anonyme' },
    });
  } catch (error) {
    console.error("ERREUR UPVOTE :", error);
    res.status(500).json({ error: "Échec de l'upvote" });
  }
};