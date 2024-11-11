export interface User {
  id: string
  username: string
}

export interface Session {
  user?: User
  token?: string
  isAuthenticated: boolean
}

export interface SessionContextType {
  session: Session
  setSession: (session: Partial<Session>) => void
  clearSession: () => Promise<void>
}
