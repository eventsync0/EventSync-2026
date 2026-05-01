import { Request, Response } from 'express';
import * as QuestionService from '../services/question.service';
import { prisma } from '../config/lib/prisma';
import { computeIsLive } from '../utils/isLive';

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
    console.error(error);
    res.status(500).json({ error: 'Échec de la récupération des questions' });
  }
};

export const create = async (
  req: Request<{}, {}, { content: string; sessionId: string; authorName?: string }>,
  res: Response
) => {
  try {
    const { sessionId, content, authorName } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'La question ne peut pas être vide' });
    }
    if (!sessionId) {
      return res.status(400).json({ error: 'Le sessionId est requis' });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return res.status(404).json({ error: 'Session introuvable' });
    }

    if (!computeIsLive(session.startTime, session.endTime)) {
      return res.status(403).json({
        error: 'Les questions ne peuvent être posées que pendant une session en cours',
      });
    }

    const question = await QuestionService.createQuestion(
      content,
      sessionId,
      authorName
    );

    res.status(201).json({
      data: { ...question, authorName: question.authorName ?? 'Anonyme' },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Échec de la création' });
  }
};

export const upvote = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID invalide' });
    }

    const existing = await prisma.question.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Question introuvable' });
    }

    const updated = await QuestionService.upvoteQuestion(id);

    res.status(200).json({
      data: { ...updated, authorName: updated.authorName ?? 'Anonyme' },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Échec de l'upvote" });
  }
};