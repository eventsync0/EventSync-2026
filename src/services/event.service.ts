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

    static async createEvents(data: { 
        title: string;
        description: string;
        startDate: Date; 
        endDate: Date; 
        location: string;
    }[]) {
        const result = await prisma.event.createMany({
            data: data,
            skipDuplicates: true
        });
        
        const createdEvents = await prisma.event.findMany({
            where: {
                title: {
                    in: data.map(d => d.title)
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: data.length
        });
        
        return {
            count: result.count,
            createdIds: createdEvents.map(e => e.id)
        };
    }
    
    static async createEvent(data: { 
        title: string;
        description: string;
        startDate: Date; 
        endDate: Date; 
        location: string;
    }) {
        const result = await this.createEvents([data]);
        const event = await prisma.event.findUnique({
            where: { id: result.createdIds[0] }
        });
        return event;
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