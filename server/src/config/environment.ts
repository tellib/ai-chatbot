import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

export const APP_PORT = process.env.APP_PORT || 4000
export const JWT_SECRET = process.env.JWT_SECRET || 'secret'
export const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://username:password@localhost:5432/postgres'
export const TOKEN_EXPIRE_TIME = process.env.TOKEN_EXPIRE_TIME || '1h'
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'
export const COOKIE_ENCRYPTION_KEY =
  process.env.COOKIE_ENCRYPTION_KEY || 'your-32-char-secret-key-here'
