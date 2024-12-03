import {
  COOKIE_ENCRYPTION_KEY,
  JWT_SECRET,
  TOKEN_EXPIRE_TIME,
} from '@/config/environment'
import crypto from 'crypto'
import { SignJWT } from 'jose'

const ALGORITHM = 'aes-256-cbc'

export function encryptToken(text: string): string {
  const key = crypto
    .createHash('sha256')
    .update(String(COOKIE_ENCRYPTION_KEY))
    .digest()
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])

  return `${iv.toString('hex')}:${encrypted.toString('hex')}`
}

export function decryptToken(text: string): string {
  const key = crypto
    .createHash('sha256')
    .update(String(COOKIE_ENCRYPTION_KEY))
    .digest()
  const [ivHex, encryptedHex] = text.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const encrypted = Buffer.from(encryptedHex, 'hex')

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  let decrypted = decipher.update(encrypted)
  decrypted = Buffer.concat([decrypted, decipher.final()])

  return decrypted.toString()
}

export async function createToken(payload: any): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRE_TIME)
    .sign(new TextEncoder().encode(JWT_SECRET))
}
