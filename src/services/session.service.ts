import { prisma } from "../config/lib/prisma";
import {computeIsLive} from "../utils/isLive"
export class SessionService {

    async getSessions() {
        return prisma.session.findMany({
          include: {
            room: true,
            speakers: true
          }
        });
      }
    
    async getSessionById(id: string) {
        const session = await prisma.session.findUnique({
            where: { id },
            include: {
                room: true,
                event: true,
                speakers: {
                    include: { links: true }
                },
                questions: {
                    orderBy: { upvotes: 'desc' }
                }
            }
        });

        if (!session) return null;

        return {
            ...session,
            isLive: computeIsLive(session.startTime, session.endTime),
            questions: session.questions.map(q => ({
                ...q,
                authorName: q.authorName ?? "Anonyme"
            }))
        };
    }
    async postSession(
        eventId: string,
        roomId: string,
        title: string,
        description: string,
        startTime: Date,
        endTime: Date,
        capacity: number,
        speakerIds: string[]
    ) {
        if (!speakerIds || speakerIds.length === 0) {
            throw new Error("At least one speaker is required");
        }

        return prisma.session.create({
            data: {
                eventId,
                roomId, title, description, startTime, endTime, capacity,
                speakers: {
                    connect: speakerIds.map(id => ({ id }))
                }
            },
            include: { speakers: true }
        });
    }

    async putSession(
    id: string,
    eventId: string,
    roomId: string,
    title: string,
    description: string,
    startTime: Date,
    endTime: Date,
    capacity: number,
    speakerIds: string[]
) {
    if (!speakerIds || speakerIds.length === 0) {
        throw new Error("At least one speaker is required");
    }

    return prisma.session.update({
        where: { id },
        data: {
            eventId,
            roomId, title, description, startTime, endTime, capacity,
            speakers: {
                set: speakerIds.map(id => ({ id }))
            }
        },
        include: { speakers: true }
    });
}

async deleteSession(id: string) {
    return prisma.session.delete({
      where: { id }
    });
  }
}