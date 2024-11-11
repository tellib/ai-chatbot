import { getDb } from '@/database/index'
import { compare, hash } from 'bcrypt'

export async function findUserByUsername(username: string) {
  const db = await getDb()
  return db.get(`SELECT * FROM users WHERE username = ?`, username)
}

export async function findUserById(id: string) {
  const db = await getDb()
  return db.get(`SELECT * FROM users WHERE id = ?`, id)
}

export async function createUser(username: string, password: string) {
  const db = await getDb()
  const hashedPassword = await hash(password, 10)

  await db.run(
    `INSERT INTO users (username, password) VALUES (?, ?)`,
    username,
    hashedPassword,
  )

  const user = await db.get(
    `SELECT id, username FROM users WHERE username = ?`,
    username,
  )

  return user || null
}

export async function verifyUserCredentials(
  username: string,
  password: string,
) {
  const user = await findUserByUsername(username)

  if (!user || !(await compare(password, user.password))) {
    return null
  }

  return user
}
