import { Chat } from '@/types/chat'

export interface User {
  id: number
  email: string
  username: string
  role: string
  chats: Partial<Chat>[]
}
