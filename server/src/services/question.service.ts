import {prisma} from '../config/lib/prisma'; 

export const createQuestion = async (content: string, sessionId: string, authorName?: string) => {
  return await prisma.question.create({
    data: {
      content,
      sessionId,
      authorName: authorName || "Anonymous",
    },
  });
};

export const getQuestionsBySession = async (sessionId: string) => {
  return await prisma.question.findMany({
    where: { sessionId },
    orderBy: { upvotes: 'desc' }, 
  });
};

export const upvoteQuestion = async (id: string) => {
  return await prisma.question.update({
    where: { id },
    data: {
      upvotes: { increment: 1 },
    },
  });
};