import { Session } from '@/models/Session'
import { cookieConfig } from '@/utils/cookies'
import { Request, Response } from 'express'
import { jwtVerify } from 'jose'
import { JWTExpired, JWTInvalid } from 'jose/errors'

export const getSession = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const token: string = req.session?.token

    if (!token) {
      res.status(401).json({
        isAuthenticated: false,
        message: 'No token provided',
      })
      return
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)

    if (!payload?.user_id || !payload?.username) {
      throw new Error('Invalid token payload')
    }

    res.json({
      user: {
        id: payload.user_id,
        username: payload.username,
      },
      token,
      isAuthenticated: true,
    } as Session)
  } catch (error) {
    console.error('Session error:', error)

    if (error instanceof JWTExpired) {
      res.status(401).json({
        isAuthenticated: false,
        message: 'Token expired',
      })
      return
    }

    if (error instanceof JWTInvalid) {
      res.status(401).json({
        isAuthenticated: false,
        message: 'Invalid token',
      })
      return
    }

    res.status(500).json({
      isAuthenticated: false,
      message: 'Internal server error',
    })
  }
}

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie('token', {
      ...cookieConfig,
      maxAge: 0,
    })
    res.status(200).json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({ message: 'Error during logout' })
  }
}
