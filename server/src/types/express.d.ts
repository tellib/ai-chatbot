declare module 'express-serve-static-core' {
  interface Request {
    session?: Session
  }
}

export interface User {
  id: string
  email: string
  username: string
  role: string
}

export interface Session {
  user?: User
  token?: string
}
