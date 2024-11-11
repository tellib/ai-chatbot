import routes from '@/routes'
import '@/types/express.d.ts'
import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'

const app = express()

app.use(express.json())
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  }),
)
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(
    `${new Date().toISOString()}: ${req.method} ${req.url} - ${req.headers.authorization}`,
  )
  next()
})
app.use('/api', routes)

export default app
