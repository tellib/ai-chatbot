export interface Message {
  id?: number
  timestamp?: string
  content: string
  role: 'user' | 'assistant'
}
