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
    console.error("ERROR GET_BY_SESSION :", error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { content, sessionId, authorName } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ error: "Question content is required" });
    }
    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required" });
  }

    const session = await prisma.session.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const isLive = computeIsLive(session.startTime, session.endTime);

    if (!isLive) {
      return res.status(400).json({ 
        error: "Questions can only be asked while the session is Live" 
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
    const { action } = req.body;

    const question = await prisma.question.findUnique({
      where: { id },
      include: { session: true }
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const now = new Date();
    const isLive = now >= new Date(question.session.startTime) && now <= new Date(question.session.endTime);

    if (!isLive) {
      return res.status(400).json({ error: "Cannot vote after session has ended" });
    }

    let newUpvotes = question.upvotes;

    if (action === 'downvote') {
      newUpvotes = question.upvotes > 0 ? question.upvotes - 1 : 0;
    } else {
      newUpvotes = question.upvotes + 1;
    }

    const updated = await prisma.question.update({
      where: { id },
      data: { upvotes: newUpvotes }
    });

    return res.status(200).json({
      data: { 
        ...updated, 
        authorName: updated.authorName ?? 'Anonymous' 
      },
    });

  } catch (error) {
    console.error("Erreur lors du vote:", error);
    return res.status(500).json({ error: "Failed to process vote" });
  }
};