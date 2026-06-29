import { EventCategory } from "../config/generated/prisma/enums";
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
        });
    }

    static async getEventsWithFilters(filters?: {
        category?: EventCategory;
        startDate?: Date;
        endDate?: Date;
        search?: string;
    }) {
        const where: any = {};

        if (filters?.category) {
            where.category = filters.category;
        }

        if (filters?.startDate) {
            where.startDate = {
                gte: filters.startDate
            };
        }

        if (filters?.endDate) {
            where.endDate = {
                lte: filters.endDate
            };
        }

        if (filters?.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } }
            ];
        }

        return prisma.event.findMany({
            where,
            orderBy: { startDate: 'asc' },
            include: {
                sessions: {
                    orderBy: { startTime: 'asc' },
                    include: { room: true }
                }
            }
        });
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
        });
    }

    static async createEvents(data: { 
        title: string;
        description: string;
        category: EventCategory;
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
        category: EventCategory;
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
    
    static async updateEvent(id: string, data: { 
        title?: string; 
        description?: string; 
        category?: EventCategory;
        startDate?: Date; 
        endDate?: Date; 
        location?: string;
    }) {
        return prisma.event.update({
            where: { id },
            data
        });
    }

    static async deleteEvent(id: string) {
        return prisma.event.delete({ where: { id } });
    }


    static async getEventsByCategory(category: EventCategory) {
        return prisma.event.findMany({
            where: { category },
            orderBy: { startDate: 'asc' },
            include: {
                sessions: {
                    orderBy: { startTime: 'asc' },
                    include: { room: true }
                }
            }
        });
    }

    static async getUpcomingEvents() {
        const now = new Date();
        return prisma.event.findMany({
            where: {
                startDate: {
                    gte: now
                }
            },
            orderBy: { startDate: 'asc' },
            include: {
                sessions: {
                    orderBy: { startTime: 'asc' },
                    include: { room: true }
                }
            }
        });
    }

    static async getPastEvents() {
        const now = new Date();
        return prisma.event.findMany({
            where: {
                endDate: {
                    lt: now
                }
            },
            orderBy: { startDate: 'desc' },
            include: {
                sessions: {
                    orderBy: { startTime: 'asc' },
                    include: { room: true }
                }
            }
        });
    }

    static async getEventsCountByCategory() {
        const categories = Object.values(EventCategory);
        const counts = await Promise.all(
            categories.map(async (category) => {
                const count = await prisma.event.count({
                    where: { category }
                });
                return { category, count };
            })
        );
        return counts;
    }

    static async searchEvents(searchTerm: string) {
        return prisma.event.findMany({
            where: {
                OR: [
                    { title: { contains: searchTerm, mode: 'insensitive' } },
                    { description: { contains: searchTerm, mode: 'insensitive' } },
                    { location: { contains: searchTerm, mode: 'insensitive' } }
                ]
            },
            orderBy: { startDate: 'asc' },
            include: {
                sessions: {
                    orderBy: { startTime: 'asc' },
                    include: { room: true }
                }
            }
        });
    }

    static async getEventsInDateRange(startDate: Date, endDate: Date) {
        return prisma.event.findMany({
            where: {
                OR: [
                    {
                        startDate: {
                            gte: startDate,
                            lte: endDate
                        }
                    },
                    {
                        endDate: {
                            gte: startDate,
                            lte: endDate
                        }
                    },
                    {
                        AND: [
                            { startDate: { lte: startDate } },
                            { endDate: { gte: endDate } }
                        ]
                    }
                ]
            },
            orderBy: { startDate: 'asc' },
            include: {
                sessions: {
                    orderBy: { startTime: 'asc' },
                    include: { room: true }
                }
            }
        });
    }
}