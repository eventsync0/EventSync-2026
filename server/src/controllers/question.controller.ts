import { Request, Response } from 'express';
import * as QuestionService from '../services/question.service';
import { prisma } from '../config/lib/prisma';
import { computeIsLive } from '../utils/isLive';

export const create = async (
  req: Request<{}, {}, { content: string; sessionId: string; authorName?: string }>,
  res: Response
) => {
  try {
    const { sessionId, content, authorName } = req.body;

    if (!content || !sessionId) {
      return res.status(400).json({ error: "Le contenu et le sessionId sont requis" });
    }

    console.log("-----------------------------------------");
    console.log("Tentative de recherche Session ID :", sessionId);

    const session = await prisma.session.findUnique({
      where: { id: sessionId }
    });

    console.log("Résultat Prisma :", session);
    console.log("-----------------------------------------");

    if (!session) return res.status(404).json({ error: "Session introuvable" });

    if (!computeIsLive(session.startTime, session.endTime)) {
      return res.status(403).json({ 
        error: "Les questions ne peuvent être posées que pendant une session en cours" 
      });
    }

    const question = await QuestionService.createQuestion(content, String(sessionId), authorName);
    
    res.status(201).json({ 
      data: { ...question, authorName: question.authorName ?? 'Anonyme' } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Échec de la création" });
  }
};

export const upvote = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID invalide" });

    const updatedQuestion = await QuestionService.upvoteQuestion(id);
    res.status(200).json({ 
      data: { ...updatedQuestion, authorName: updatedQuestion.authorName ?? 'Anonyme' } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Échec de l'upvote" });
  }
};