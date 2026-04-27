import { prisma } from "../config/lib/prisma";

function computeIsLive(startTime: Date, endTime: Date): boolean {
    const now = new Date();
    return now >= startTime && now <= endTime;
}

export class RoomService {
    async postRoom(name: string) {
        return prisma.room.create({
            data: { name },
            select: { name: true }
        })
    }

    async getRooms() {
        return prisma.room.findMany({ orderBy: { name: 'asc' } })
    }

    async deleteRoom(id: string) {
        return prisma.room.delete({ where: { id } })
    }

    async getRoomSessions(id: string) {
        const sessions = await prisma.session.findMany({
            where: { roomId: id },
            include: { room: true },
            orderBy: { startTime: 'asc' }
        })
        return sessions.map(s => ({
            ...s,
            isLive: computeIsLive(s.startTime, s.endTime)
        }))
    }
}