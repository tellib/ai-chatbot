import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

export const APP_PORT = process.env.APP_PORT || 3001
export const JWT_SECRET = process.env.JWT_SECRET || 'secret'
export const DB_NAME = process.env.DB_NAME || 'userdatabase.db'
export const TOKEN_EXPIRE_TIME = process.env.TOKEN_EXPIRE_TIME || '1h'
