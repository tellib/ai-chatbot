import { JWT_SECRET } from '@/utils/secrets'
import { SignJWT } from 'jose'

export const createNewToken = async (payload: any) => {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(new TextEncoder().encode(JWT_SECRET))

  return token
}
