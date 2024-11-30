import { cookieConfig } from '@/config/cookies'
import { createToken, encryptToken } from '@/utils/tokens'
import { Request, Response } from 'express'
import { z } from 'zod'
import { checkExistingUser, createUser, verifyUserCredentials } from './service'

const userSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(6).max(50),
})

/**
 * Gets the session by sending the session cookie in the response
 */
export const handleGetSession = async (
  req: Request,
  res: Response,
): Promise<void> => {
  res.json(req.session)
}

/**
 * Logs in a user by verifying their credentials and setting the session cookie
 */
export const handleLogin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = userSchema.safeParse(req.body)

    if (!result.success) {
      res.status(400).end()
      return
    }

    const { username, password } = result.data

    const user = await verifyUserCredentials(username, password)
    if (!user) {
      res.status(401).end()
      return
    }

    const token = await createToken(user)
    const encryptedToken = encryptToken(token)
    res.cookie('token', encryptedToken, cookieConfig).end()
  } catch (error) {
    res.status(500).end()
  }
}

/**
 * Logs out a user by clearing the session cookie
 */
export const handleLogout = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    req.session = undefined
    res.clearCookie('token').json(req.session)
  } catch (error) {
    res.status(500).end()
  }
}

/**
 * Registers a user by creating a new user and setting the session cookie
 */
export const handleRegister = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = userSchema.safeParse(req.body)
    if (!result.success) {
      res.status(400).end()
      return
    }

    const { username, password } = result.data

    const existingUser = await checkExistingUser(username)
    if (existingUser) {
      res.status(409).end()
      return
    }

    const user = await createUser(username, password)
    if (!user) {
      res.status(500).end()
      return
    }

    const token = await createToken(user)
    const encryptedToken = encryptToken(token)
    res.status(201).cookie('token', encryptedToken, cookieConfig).end()
  } catch (error) {
    res.status(500).end()
  }
}
