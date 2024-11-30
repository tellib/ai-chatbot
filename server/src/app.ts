import { router as v1router } from '@/api/v1'
import { CLIENT_URL } from '@/config/environment'
import '@/types/express.d'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import { getSessionFromToken } from './middlewares'

const app = express()

app.use(express.json())
app.use(
  cors({
    origin: CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  }),
)
app.use(cookieParser())
app.use(getSessionFromToken)
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(
    `${new Date().toISOString()}: ${req.method} ${req.url} - ${req.session?.user?.id || 'no user'}`,
  )
  next()
})
app.use('/api/v1', v1router)

export default app
