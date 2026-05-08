import { prisma } from "../config/lib/prisma";

export class SessionService {

  async getSessions() {
    return prisma.session.findMany({
      include: {
        room: true,
        speakers: true
      }
    });
  }

  async getSession(id: string) {
    return prisma.session.findUnique({
      where: { id },
      include: {
        room: true,
        speakers: true
      }
    });
  }

  async postSession(
    roomId: string,
    title: string,
    description: string,
    startTime: Date,
    endTime: Date,
    capacity: number
  ) {
    return prisma.session.create({
      data: {
        roomId,
        title,
        description,
        startTime,
        endTime,
        capacity
      }
    });
  }

  async updateSession(id: string, data: any) {
    return prisma.session.update({
      where: { id },
      data
    });
  }

  async deleteSession(id: string) {
    return prisma.session.delete({
      where: { id }
    });
  }
}