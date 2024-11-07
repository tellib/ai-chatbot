export interface SessionData {
  user?: {
    id: string
    username: string
  }
  token?: string
  isAuthenticated: boolean
  setSession: (session: Partial<SessionData>) => void
  clearSession: () => void
}
