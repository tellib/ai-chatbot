import { NextFunction, Request, Response } from 'express'
import { jwtVerify } from 'jose'
import { JWTExpired } from 'jose/errors'

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
          id: payload?.user_id,
          username: payload?.username,
        },
        token: token,
        isAuthenticated: true,
      }
      return next()
    } catch (error) {
      if (error instanceof JWTExpired) {
        res.clearCookie('token')
        res.status(401).json({ isAuthenticated: false })
        return
      } else {
        // res.status(401).json({ message: 'Token is invalid' })
        res.clearCookie('token')
        return
      }
    }
  } else {
    res
      .status(401)
      .json({ message: 'Authorization header missing or malformed' })
  }
}
