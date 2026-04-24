import { prisma } from "../config/lib/prisma";

export class RoomService {
    async postRoom(id: string, name: string) {
        return prisma.room.create({
            data: {id, name},
            select: {id: true, name: true}
        })
    }
}