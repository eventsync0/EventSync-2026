
import { prisma } from '../config/lib/prisma';

export const createQuestion = async (content: string, sessionId: number | string, authorName?: string) => {
  const trimmedContent = content.trim();
  const normalizedSessionId = String(sessionId).trim();

  return await prisma.question.create({
    data: {
      content: trimmedContent,
      sessionId: normalizedSessionId,
      authorName: authorName?.trim() || null,
    },
  });
};

export const getQuestionsBySession = async (sessionId: number | string) => {
  return await prisma.question.findMany({
    where: { sessionId: String(sessionId).trim() },
    orderBy: [
      { upvotes: 'desc' },
      { createdAt: 'asc' },
    ],
  });
};

export const upvoteQuestion = async (id: number | string) => {
  return await prisma.question.update({
    where: { id: String(id) },
    data: { upvotes: { increment: 1 } },
  });
};