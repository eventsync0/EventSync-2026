import { prisma } from '../config/lib/prisma';

export const createQuestion = async (content: string, sessionId: string, authorName?: string) => {
  return await prisma.question.create({
    data: {
      content: content.trim(),
      sessionId: sessionId, 
      authorName: authorName?.trim() || null,
    },
  });
};

export const upvoteQuestion = async (id: number) => {
  return await prisma.question.update({
    where: { id },
    data: {
      upvotes: { increment: 1 },
    },
  });
};