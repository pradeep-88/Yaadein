import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.js'
import uploadRoutes from './routes/upload.js'
import adminRoutes from './routes/admin.js'
import cors from 'cors'

dotenv.config()
const app = express()

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://isp-q3ei.vercel.app",
    ],
    credentials: true,
  })
);
// 50MB limit for JSON (supports base64 image uploads; increase if needed for very large images)
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

app.use('/api/auth', authRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/admin', adminRoutes)

const MONGO_URI = process.env.MONGO_URI
if (!MONGO_URI) {
  console.error('Missing MONGO_URI. Create a .env file in the backend folder with MONGO_URI=mongodb://...')
  process.exit(1)
}

const PORT = process.env.PORT || 5000

mongoose.connect(MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`))
}).catch(err => console.error(err))


