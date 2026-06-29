import { prisma } from "../config/lib/prisma";

function computeIsLive(startTime: Date, endTime: Date): boolean {
  const now = new Date();
  return now >= startTime && now <= endTime;
}

export class RoomService {
  // ✅ id ajouté dans select — sans lui le backend renvoyait { name } sans id
  async postRoom(name: string) {
    return prisma.room.create({
      data: { name },
      select: { id: true, name: true },
    });
  }

  async getRooms() {
    return prisma.room.findMany({ orderBy: { name: "asc" } });
  }

  // ✅ Nouveau : récupère une seule room par id (nécessaire pour Show et Edit)
  async getRoom(id: string) {
    return prisma.room.findUniqueOrThrow({ where: { id } });
  }

  async deleteRoom(id: string) {
    return prisma.room.delete({ where: { id } });
  }

  async getRoomSessions(id: string) {
    const sessions = await prisma.session.findMany({
      where: { roomId: id },
      include: { room: true },
      orderBy: { startTime: "asc" },
    });
    return sessions.map((s) => ({
      ...s,
      isLive: computeIsLive(s.startTime, s.endTime),
    }));
  }
    async getSessionsWithRoom(id: string) {
        const sessions = await prisma.session.findMany({
            where: { roomId: id },
            include: { room: true },
            orderBy: { startTime: 'asc' }
        });
        return sessions.map(s => ({
            ...s,
            isLive: computeIsLive(s.startTime, s.endTime)
        }));
    }

    async getRoomById(id: string) {
        try {
            const room = await prisma.room.findUnique({
                where: { id }
            });
            return room;
        } catch (error) {
            console.error('Error fetching room:', error);
            throw error;
        }
    }
}