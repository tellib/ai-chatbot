import { Session } from '@/types/session'

declare module 'express-serve-static-core' {
  interface Request {
    session?: Session
  }
}
