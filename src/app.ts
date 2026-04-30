// app.ts
import express from 'express'
import cors from 'cors'
import "dotenv/config";
import adminRoutes from './routes/admin.route'
import roomRoutes from './routes/rooms.route'
import sessionRoutes from './routes/session.route'

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

export const createApp = () => {
    const app = express()

    app.use(cors({ origin: FRONTEND_URL }))
    app.use(express.json())

    app.get('/api/health', (req, res) => {
        res.json({ status: 'ok' })
    })

    app.use('/admin', adminRoutes)
    app.use('/api/rooms', roomRoutes)
    app.use('/api/sessions', sessionRoutes)

    return app
}