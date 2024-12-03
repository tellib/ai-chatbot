import { User } from '@prisma/client'

export interface Session {
  user?: Partial<User>
  token?: string
}
