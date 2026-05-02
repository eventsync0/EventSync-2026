import { prisma } from "../config/lib/prisma";

export class SessionService {
    async postSession(
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
            roomId, title, description, startTime, endTime, capacity,
            speakers: {
                set: speakerIds.map(id => ({ id }))
            }
        },
        include: { speakers: true }
    });
}
}