// server.ts
import { createApp } from './app'

const PORT = Number(process.env.PORT) || 3001

const startServer = () => {
    const app = createApp()
    
    app.listen(PORT, () => {
        console.log(`✅ Server is running on http://localhost:${PORT}`)
        console.log(`📋 Health check: http://localhost:${PORT}/api/health`)
        console.log(`🔗 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`)
    })
}

startServer()