import { getDb } from '@/database'
import { Session } from '@/models/Session'
import { cookieConfig } from '@/utils/cookies'
import { createNewToken } from '@/utils/tokens'
import { Request, Response } from 'express'

export const signUp = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body
  const db = await getDb()

  const existingUser = await db.get(
    `SELECT * FROM users WHERE username = ?`,
    username,
  )
  if (existingUser) {
    res.status(401).json({
      message: 'User already exists',
    })
    return
  }

  await db.run(
    `INSERT INTO users (username, password) VALUES (?, ?)`,
    username,
    password,
  )
  const user = await db.get(
    `SELECT * FROM users WHERE username = ? AND password = ?`,
    username,
    password,
  )
  if (!user) {
    res.status(500).json({
      message: 'Registration error',
    })
    return
  }

  const token = await createNewToken({
    user_id: user.id,
    username: user.username,
    role: 'user',
  })
  res.cookie('token', token, cookieConfig)
  res.status(201).json({
    user: {
      id: user.id,
      username: user.username,
    },
    token: token,
    isAuthenticated: true,
  } as Session)
}

export const login = async (req: Request, res: Response): Promise<void> => {
  console.log(req.body)
  const { username, password } = req.body
  const db = await getDb()

  const user = await db.get(
    `SELECT * FROM users WHERE username = ? AND password = ?`,
    username,
    password,
  )
  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' })
    return
  }

  const token = await createNewToken({
    user_id: user.id,
    username: user.username,
    role: 'user',
  })
  res.cookie('token', token, cookieConfig)
  res.status(200).json({
    user: {
      id: user.id,
      username: user.username,
    },
    token: token,
    isAuthenticated: true,
  })
}
