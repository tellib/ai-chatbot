'use client'

import axios from '@/lib/axios'
import { deleteCookie, getCookie } from '@/lib/cookies'
import { SessionData } from '@/lib/data'
import { useRouter } from 'next/navigation'
import { createContext, ReactNode, useEffect, useState } from 'react'

export const SessionContext = createContext<SessionData | undefined>(undefined)

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const [session, setSessionState] = useState<Partial<SessionData>>({
    isAuthenticated: false,
  })

  const setSession = (newSession: Partial<SessionData>) => {
    setSessionState((prevSession) => ({ ...prevSession, ...newSession }))
  }

  const clearSession = async () => {
    await deleteCookie('token')
    setSession({
      isAuthenticated: false,
      token: undefined,
      user: undefined,
    } as SessionData)
  }

  useEffect(() => {
    const fetchSession = async () => {
      const token = await getCookie('token')
      if (!token) {
        return
      }

      try {
        const response = await axios.get('/session')
        // TODO: handle expired token
        if (response.status !== 200) {
          router.replace('/auth')
          return
        }
        const data: SessionData = response.data

        setSession(data)
      } catch (error) {
        console.error('Session fetch error', error)
      }
    }

    fetchSession()
  }, [])

  return (
    <SessionContext.Provider
      value={
        {
          ...session,
          setSession,
          clearSession,
        } as SessionData
      }
    >
      {children}
    </SessionContext.Provider>
  )
}
