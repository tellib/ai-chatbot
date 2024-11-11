import { NextFunction, Request, Response } from 'express'
import { jwtVerify } from 'jose'
import { JWTExpired, JWTInvalid } from 'jose/errors'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]

    try {
      const { payload } = await jwtVerify(token, secret)
      req.session = {
        user: {
          id: payload?.user_id as string,
          username: payload?.username as string,
          email: payload?.email as string,
          role: payload?.role as string,
        },
        token: token,
      }
      return next()
    } catch (error) {
      if (error instanceof JWTExpired || error instanceof JWTInvalid) {
        res.clearCookie('token')
        res.status(401).json({ message: 'Token is expired or invalid' })
        return
      } else {
        res.status(500).json({ message: 'Internal server error' })
        return
      }
    }
  } else {
    res
      .status(401)
      .json({ message: 'Authorization header missing or malformed' })
  }
}
