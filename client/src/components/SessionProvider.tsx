'use client'

import { useToast } from '@/hooks/use-toast'
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

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSessionState] = useState<Session>({
    user: undefined,
    token: undefined,
  })
  const { toast } = useToast()

  /**
   * Sets the session to the new session
   * @param session - The new session to set
   */
  const setSession = (session: Partial<Session>) => {
    setSessionState((prev) => ({
      // prev is used to keep the functions inside SessionContextType
      ...prev,

      // these are specifically set since user and token are optional (for null and undefined)
      user: session.user,
      token: session.token,
    }))
  }

  /**
   * Clears the session by calling the logout endpoint and setting the session to the response
   */
  const clearSession = async () => {
    if (session.user) {
      await axios
        .get('/auth/logout')
        .then((response) => {
          console.log(response.data)
          setSession(response.data)
          toast({
            title: 'Logout successful',
            description: 'We hope to see you soon!',
          })
        })
        .catch((error) => {
          if (process.env.NODE_ENV === 'development') {
            toast({
              title: 'Logout Error',
              description: 'Failed to logout',
            })
            console.log(error)
          }
        })
    }
  }

  /**
   * Refreshes the session by calling the session endpoint and setting the session to the response
   */
  const refreshSession = async () => {
    await axios
      .get('/auth/session')
      .then((response) => {
        setSession(response.data)
      })
      .catch((error) => {
        if (process.env.NODE_ENV === 'development') {
          toast({
            title: 'Session Error',
            description: 'Failed to refresh session',
          })
          console.log(error)
        }
      })
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
