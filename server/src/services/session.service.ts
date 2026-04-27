import { prisma } from "../config/lib/prisma";

export class SessionService {
    async postSession(roomId: string, title: string, description: string, startTime: Date, endTime: Date, capacity: number) {
        return prisma.session.create({
            data: { roomId, title, description, startTime, endTime, capacity}
        })
    }
}