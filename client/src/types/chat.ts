export interface Chat {
  id: number
  title: string
  timestamp: string
  messages: Array<{
    content: string
    timestamp: string
  }>
}
