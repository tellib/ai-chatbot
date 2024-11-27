import { cookieConfig } from '@/config/cookies'
import { createToken, encryptToken } from '@/utils/tokens'
import { Request, Response } from 'express'
import { z } from 'zod'
import {
  createUser,
  findUserByUsername,
  verifyUserCredentials,
} from './service'

const userSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(6).max(50),
})

export const getSession = async (
  req: Request,
  res: Response,
): Promise<void> => {
  res.status(200).json(req.session || null)
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

    const token = await createToken(user)
    const encryptedToken = encryptToken(token)
    res
      .status(200)
      .cookie('token', encryptedToken, cookieConfig)
      .json({ message: 'Login successful' })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie('token', {
      ...cookieConfig,
      maxAge: 0,
    })
    req.session = undefined
    res.status(200).json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

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

    const token = await createToken(user)
    const encryptedToken = encryptToken(token)
    res.cookie('token', encryptedToken, cookieConfig)
    res.status(201).json({ message: 'User created successfully' })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
