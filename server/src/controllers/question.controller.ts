import { Request, Response } from 'express';
import * as QuestionService from '../services/question.service';

export const create = async (req: Request, res: Response) => {
  try {
    const { content, sessionId, authorName } = req.body;
    
    if (!content || !sessionId) {
      return res.status(400).json({ error: "Content and sessionId are required" });
    }

    const question = await QuestionService.createQuestion(content, sessionId, authorName);
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: "Failed to create question" });
  }
};

export const upvote = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const updatedQuestion = await QuestionService.upvoteQuestion(id);
    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ error: "Failed to upvote question" });
  }
};