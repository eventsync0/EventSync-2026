import { prisma } from "../config/lib/prisma";

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
}