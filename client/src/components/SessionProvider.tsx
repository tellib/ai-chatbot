'use client'

import axios from '@/lib/axios'
import { Session } from '@/types/session'
import { createContext, ReactNode, useEffect, useState } from 'react'

export interface SessionContextType {
  session: Session
  setSession: (session: Partial<Session>) => void
  clearSession: () => Promise<void>
  refreshSession: () => Promise<void>
}

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
      const response = await axios.get('/auth/logout')
      if (response.status === 200) {
        setSession(initialSession)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const refreshSession = async () => {
    try {
      const response = await axios.get('/auth/session')
      const data = response.data
      if (!data || !data.user) {
        setSession(initialSession)
      } else {
        setSession(data)
      }
    } catch (error) {
      console.log(error)
      setSession(initialSession)
    }
  }

  useEffect(() => {
    refreshSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
