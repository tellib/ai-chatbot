import { User } from '@/types/express'
import { cookieConfig } from '@/utils/cookies'
import { JWT_SECRET } from '@/utils/secrets'
import { Request, Response } from 'express'
import { jwtVerify } from 'jose'
import { JWTExpired, JWTInvalid } from 'jose/errors'

export const getSession = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const token = req.session?.token

    if (!token) {
      res.status(401).json({ message: 'No token provided' })
      return
    }

    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)

    res.status(200).json({
      user: {
        id: payload.id,
        username: payload.username,
        role: payload.role,
      } as User,
      token,
    })
  } catch (error) {
    handleSessionError(error, res)
  }
}

export const clearSession = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    res.clearCookie('token', {
      ...cookieConfig,
      maxAge: 0,
    })
    req.session = undefined
    res.status(200).json({ message: 'Logged out successfully' })
  } catch (error) {
    handleSessionError(error, res)
  }
}

function handleSessionError(error: unknown, res: Response): void {
  console.error('Session error', error)
  if (error instanceof JWTExpired) {
    res.status(401).json({ message: 'Token expired' })
    return
  }
  if (error instanceof JWTInvalid) {
    res.status(401).json({ message: 'Invalid token' })
    return
  }
  res.status(500).json({ message: 'Internal server error' })
}
