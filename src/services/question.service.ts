import { prisma } from '../config/lib/prisma';

export const getQuestionsBySession = async (sessionId: string) => {
  const questions = await prisma.question.findMany({
    where: { sessionId },
    orderBy: [{ upvotes: 'desc' }, { createdAt: 'asc' }],
  });

  return questions.map(
    (q: Awaited<ReturnType<typeof prisma.question.findMany>>[number]) => ({
      ...q,
      authorName: q.authorName ?? 'Anonyme',
    })
  );
};

export const createQuestion = async (
  content: string,
  sessionId: string,
  authorName?: string
) => {
  return await prisma.question.create({
    data: {
      content: content.trim(),
      sessionId,
      authorName: authorName?.trim() || null,
    },
  });
};

export const upvoteQuestion = async (id: number) => {
  return await prisma.question.update({
    where: { id },
    data: { upvotes: { increment: 1 } },
  });
};