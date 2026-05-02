import { Request, Response } from 'express';
import * as QuestionService from '../services/question.service';
import { computeIsLive } from '../utils/isLive';
import { prisma } from '../config/lib/prisma';

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
export const create = async (req: Request, res: Response) => {
    try {
        const { content, sessionId, authorName } = req.body;

        const session = await prisma.session.findUnique({
            where: { id: sessionId }
        });

        if (!session) {
            return res.status(404).json({ error: "Session non trouvée" });
        }

        const now = new Date();
        if (now > session.endTime) {
            return res.status(400).json({ error: "Session terminée" });
        }

        const newQuestion = await QuestionService.createQuestion(content, sessionId, authorName);
        return res.status(201).json(newQuestion);

    } catch (error: any) {
        return res.status(500).json({ 
            error: "Échec de la création", 
            details: error.message 
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