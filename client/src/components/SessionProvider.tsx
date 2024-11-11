'use client'

import axios from '@/lib/axios'
import { Session, SessionContextType } from '@/lib/data'
import { createContext, ReactNode, useEffect, useState } from 'react'

export const SessionContext = createContext<SessionContextType | undefined>(
  undefined,
)

const initialSession: Session = {
  token: undefined,
  user: undefined,
}

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSessionState] = useState<Session>(initialSession)

  const setSession = (newSession: Partial<Session>) => {
    setSessionState((prevSession) => ({ ...prevSession, ...newSession }))
  }

  const clearSession = async () => {
    try {
      await axios.get('/session/clear')
      setSession(initialSession)
    } catch (error) {
      console.log(error)
    }
  }

  const refreshSession = async () => {
    try {
      const response = await axios.get('/session')
      const data = response.data
      setSession(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    refreshSession()
  }, [])

  return (
    <SessionContext.Provider
      value={{
        session,
        setSession,
        clearSession,
        refreshSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}
