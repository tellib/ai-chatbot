import { JWT_SECRET } from '@/config/environment'
import { User } from '@/types/user'
import { decryptToken } from '@/utils/tokens'
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

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    const decryptedToken = decryptToken(token)

    try {
      const { payload } = await jwtVerify(decryptedToken, secret)
      req.session = {
        user: {
          id: payload?.id as string,
          username: payload?.username as string,
          email: payload?.email as string,
          role: payload?.role as string,
        } as User,
        token: token,
      }
    } catch (error) {
      if (error instanceof JWTExpired || error instanceof JWTInvalid) {
        res.clearCookie('token')
        console.error('Token expired or invalid:', error)
      } else {
        console.error('Token validation error:', error)
      }
    }
  }
  next()
}
