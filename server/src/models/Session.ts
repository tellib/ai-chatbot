export type Session = {
  user?: {
    id: string
    username: string
  }
  token?: string
  isAuthenticated: boolean
}
