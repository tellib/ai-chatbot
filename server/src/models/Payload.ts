import { Role } from '@/models/Role'

export type Payload = {
  user_id: number
  username: string
  role: Role
  iat?: number
  exp?: number
}
