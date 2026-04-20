import express from 'express'
import cors from 'cors'
import "dotenv/config";


const app = express()

const PORT = Number(process.env.PORT) || 3001
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

app.use(cors({ origin: FRONTEND_URL }))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})



app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`)
})
