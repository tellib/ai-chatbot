export interface User {
  id: string
  email?: string
  username: string
  role: string
}

export type Session = {
  user?: User
  token?: string
}

export type SessionContextType = {
  session: Session
  setSession: (session: Partial<Session>) => void
  clearSession: () => Promise<void>
  refreshSession: () => Promise<void>
}
