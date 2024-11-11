import {
  createUser,
  findUserByUsername,
  verifyUserCredentials,
} from '@/database/users'
import { User } from '@/types/express'
import { cookieConfig } from '@/utils/cookies'
import { createNewToken } from '@/utils/tokens'
import { Request, Response } from 'express'
import { z } from 'zod'

const userSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
})

export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = userSchema.safeParse(req.body)
    if (!result.success) {
      res.status(400).json({
        message: 'Invalid input',
        errors: result.error.errors,
      })
      return
    }

    const { username, password } = result.data

    const existingUser = await findUserByUsername(username)
    if (existingUser) {
      res.status(409).json({ message: 'User already exists' })
      return
    }

    const user = await createUser(username, password)
    if (!user) {
      res.status(500).json({ message: 'Registration error' })
      return
    }

    const token = await createNewToken({
      id: user.id,
      username: user.username,
      role: 'user',
    } as User)

    res.cookie('token', token, cookieConfig)
    res.status(201).json({ message: 'User created successfully' })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = userSchema.safeParse(req.body)
    if (!result.success) {
      res.status(400).json({ message: 'Invalid input' })
      return
    }

    const { username, password } = result.data

    const user = await verifyUserCredentials(username, password)
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    const token = await createNewToken({
      id: user.id,
      username: user.username,
      role: user.role || 'user',
    } as User)

    res
      .status(200)
      .cookie('token', token, cookieConfig)
      .json({ message: 'Login successful' })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
