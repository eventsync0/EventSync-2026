import { title } from "node:process";
import { prisma } from "../config/lib/prisma";

export class EventService {
    static async getEvents() {
        return prisma.event.findMany({
            orderBy: { startDate: 'asc' },
            include: {
                sessions: {
                    orderBy: { startTime: 'asc' },
                    include: { room: true }
                }
            }
        })  
    }

   static async getEventById(id: string) {
        return prisma.event.findUnique({
            where: { id },
            include: {
                sessions: {
                    orderBy: { startTime: 'asc' },
                    include: { room: true }
                }
            }
        })
    }

   static async createEvent(data: { 
        title: string;
        description: string;
        startDate: Date; 
        endDate: Date; 
        location: string;
    }) {
        return prisma.event.create({ data })
    }

   static async updateEvent(id: string, data: { title: string; description: string; startDate: Date; endDate: Date, location : string }) {
        return prisma.event.update({
            where: { id },
            data
        })
    }

   static async deleteEvent(id: string) {
        return prisma.event.delete({ where: { id } })
    }
}