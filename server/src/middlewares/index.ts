import { JWT_SECRET } from '@/config/environment'
import { decryptToken } from '@/utils/tokens'
import { User } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import { jwtVerify } from 'jose'
import { JWTExpired, JWTInvalid } from 'jose/errors'

const secret = new TextEncoder().encode(JWT_SECRET)

export const getSessionFromToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization
  const cookieToken = req.cookies?.token

  if ((authHeader && authHeader.startsWith('Bearer ')) || cookieToken) {
    const token = authHeader?.split(' ')[1] || cookieToken

    try {
      const decryptedToken = decryptToken(token)
      const { payload } = await jwtVerify(decryptedToken, secret)
      req.session = {
        user: payload as Partial<User>,
        token,
      }
    } catch (error) {
      if (error instanceof JWTExpired || error instanceof JWTInvalid) {
        res.clearCookie('token')
        console.log('Token expired or invalid:', error)
      } else {
        res.clearCookie('token')
        console.log('Token validation error:', error)
      }
    }
  }
  next()
}

export const requireUser = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.session?.user) {
    res.status(401).end()
    return
  }
  next()
}

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (req.session?.user?.role !== 'ADMIN') {
    res.status(403).end()
    return
  }
  next()
}
