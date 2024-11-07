import { DB_NAME } from '@/utils/secrets'
import { Database, open } from 'sqlite'
import sqlite3 from 'sqlite3'

let db: Database | null = null

export const getDb = async () => {
  if (!db) {
    try {
      db = await open({
        filename: DB_NAME,
        driver: sqlite3.Database,
      })
      console.log('Database connection established')
    } catch (error) {
      console.error('Database connection failed:', error)
      throw new Error('Failed to open database')
    }
  }
  return db
}
