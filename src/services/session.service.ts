import { prisma } from "../config/lib/prisma";
import { computeIsLive } from "../utils/isLive";
export class SessionService {

    async getSessions() {
        return prisma.session.findMany({
            include: {
                room: true,
                speakers: true,
                event: true
            }
        });
    }

    async getSessionById(id: string) {
        try {
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

            if (!session) {
                console.log(`Session ${id} not found`);
                return null;
            }

            console.log(`Session ${id} found:`, {
                title: session.title,
                hasEvent: !!session.event,
                hasRoom: !!session.room,
                speakersCount: session.speakers.length
            });

            return {
                ...session,
                isLive: computeIsLive(session.startTime, session.endTime),
                questions: session.questions.map(q => ({
                    ...q,
                    authorName: q.authorName ?? "Anonyme"
                }))
            };
        } catch (error) {
            console.error(`Error fetching session ${id}:`, error);
            throw error;
        }
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
        try {
            await prisma.session.update({
                where: { id },
                data: {
                    speakers: {
                        set: []
                    }
                }
            });

            await prisma.question.deleteMany({
                where: { sessionId: id }
            });

            return await prisma.session.delete({
                where: { id }
            });
        } catch (error) {
            console.error("Delete session error:", error);
            throw error;
        }
    }


    async getSessionsByRoom(roomId: string) {
        try {
            const sessions = await prisma.session.findMany({
                where: {
                    roomId: roomId
                },
                include: {
                    room: true,
                    speakers: true,
                    event: true
                },
                orderBy: {
                    startTime: 'asc'
                }
            });

            return sessions;
        } catch (error) {
            console.error('Error fetching sessions by room:', error);
            throw error;
        }
    }

    async getLiveSessions() {
        try {
            const now = new Date();
            const sessions = await prisma.session.findMany({
                where: {
                    startTime: { lte: now },
                    endTime: { gte: now }
                },
                include: {
                    room: true,
                    speakers: true,
                    event: true
                },
                orderBy: {
                    startTime: 'asc'
                }
            });

            return sessions;
        } catch (error) {
            console.error('Error fetching live sessions:', error);
            throw error;
        }
    }
}