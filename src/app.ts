import express from 'express'
import cors from 'cors'
import "dotenv/config";
import { prisma } from "./config/lib/prisma";
import adminRoutes from './routes/admin.route'
import roomRoutes from './routes/rooms.route'
import sessionRoutes from './routes/session.route'
import eventRoutes from './routes/event.route'
import speakerRoutes from './routes/speaker.route'
import questionRoutes from './routes/questions.routes'

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'
const allowedOrigins = FRONTEND_URL.split(',').map(origin => origin.trim());


export const createApp = () => {
    const app = express()

    app.use(cors({ 
        origin: allowedOrigins,
        credentials: true,
        exposedHeaders: ['X-Total-Count']
    }))
    app.use(express.json())

    app.get('/api/health', (_req, res) => {
        res.json({ status: 'API is running' })
    })

    app.use('/admin', adminRoutes)
    app.use('/api/rooms', roomRoutes)
    app.use('/api/sessions', sessionRoutes)
    app.use('/api/events', eventRoutes)
    app.use('/api/speakers', speakerRoutes)
    app.use('/api', questionRoutes)
    app.get('/api/stats', async (_req, res) => {
        try {
            const now = new Date();
            
            const [
                totalEvents,
                sessions,
                uniqueCities,
                totalSpeakers,
                upcomingEvents,
                liveEvents,
                totalQuestions
            ] = await Promise.all([
                prisma.event.count(),
                prisma.session.aggregate({ _sum: { capacity: true } }),
                prisma.event.findMany({ 
                    select: { location: true }, 
                    distinct: ['location'] 
                }),
                prisma.speaker.count(),
                prisma.event.count({ 
                    where: { 
                        startDate: { gt: now } 
                    } 
                }),
                prisma.event.count({ 
                    where: { 
                        startDate: { lte: now },
                        endDate: { gte: now }
                    } 
                }),
                prisma.question.count()
            ]);

            res.json({
                success: true,
                data: {
                    totalEvents,
                    totalCapacity: sessions._sum.capacity || 0,
                    totalCities: uniqueCities.length,
                    totalSpeakers,
                    upcomingEvents,
                    liveEvents,
                    totalQuestions
                }
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
            res.status(500).json({ 
                success: false,
                error: 'Failed to fetch statistics' 
            });
        }
    });
    
    return app
}