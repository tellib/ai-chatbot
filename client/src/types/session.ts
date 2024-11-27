import { User } from '@/types/user'

export interface Session {
  user?: User
  token?: string
}
