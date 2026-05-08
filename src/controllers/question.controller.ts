// src/controllers/question.controller.ts
import { Request, Response } from 'express';
import * as QuestionService from '../services/question.service';
import { prisma } from '../config/lib/prisma';
import { computeIsLive } from '../utils/isLive';

export const getBySession = async (req: Request<{ sessionId: string }>, res: Response) => {
  try {
    const { sessionId } = req.params;

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

    if (!content?.trim()) {
      return res.status(400).json({ error: "Le contenu de la question est requis" });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      return res.status(404).json({ error: "Session non trouvée" });
    }

    const isLive = computeIsLive(session.startTime, session.endTime);

    if (!isLive) {
      return res.status(400).json({ 
        error: "Les questions ne peuvent être posées que pendant que la session est en cours (Live)" 
      });
    }

    const newQuestion = await QuestionService.createQuestion(
      content.trim(), 
      sessionId, 
      authorName?.trim() || null
    );

    return res.status(201).json(newQuestion);

  } catch (error: any) {
    console.error("ERREUR CREATE QUESTION :", error);
    return res.status(500).json({ error: error.message });
  }
};

export const upvote = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    const question = await prisma.question.findUnique({
      where: { id },
      include: { session: true }
    });

    if (!question) {
      return res.status(404).json({ error: 'Question introuvable' });
    }
    const isLive = computeIsLive(question.session.startTime, question.session.endTime);

    if (!isLive) {
      return res.status(400).json({ error: "Impossible d'upvoter après la fin de la session" });
    }
    const updated = await QuestionService.upvoteQuestion(id);

    res.status(200).json({
      data: { 
        ...updated, 
        authorName: updated.authorName ?? 'Anonyme' 
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Échec de l'upvote" });
  }
};