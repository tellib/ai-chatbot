import { CookieOptions } from 'express'

export const cookieConfig: CookieOptions = {
  httpOnly: true,
  secure: true,
  path: '/',
  sameSite: 'none',
}
