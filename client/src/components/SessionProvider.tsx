'use client'

import { useToast } from '@/hooks/use-toast'
import axios from '@/lib/axios'
import { Session } from '@/types/session'
import { useRouter } from 'next/navigation'
import { createContext, ReactNode, useEffect, useState } from 'react'

export interface SessionContextType {
  session: Session
  getSession: () => Promise<void>
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const SessionContext = createContext<SessionContextType | undefined>(
  undefined,
)

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const [session, setSession] = useState<Session>({
    user: undefined,
    token: undefined,
  })
  const { toast } = useToast()

  useEffect(() => {
    getSession()
  }, [])

  /**
   * Clears the session by calling the logout endpoint and setting the session to the response
   */
  const logout = async () => {
    if (session.user) {
      await axios
        .get('/auth/logout')
        .then((response) => {
          setSession(response.data)
          toast({
            title: 'Logout successful',
            description: 'We hope to see you soon!',
            duration: 1000,
          })
          router.push('/login')
        })
        .catch((error) => {
          toast({
            title: 'Logout Error',
            description: 'Failed to logout',
            variant: 'destructive',
          })
          if (process.env.NODE_ENV === 'development') {
            console.error(error)
          }
        })
    }
  }

  /**
   * Refreshes the session by calling the session endpoint and setting the session to the response
   */
  const getSession = async () => {
    await axios
      .get('/auth/session')
      .then((response) => {
        setSession(response.data)
      })
      .catch((error) => {
        toast({
          title: 'Session Error',
          description: 'Failed to refresh session',
          variant: 'destructive',
        })
        if (process.env.NODE_ENV === 'development') {
          console.error(error)
        }
      })
  }

  const login = async (username: string, password: string) => {
    await axios
      .post('/auth/login', { username, password })
      .then((response) => {
        setSession(response.data)
        toast({
          title: 'Login successful',
          description: 'Welcome back!',
          duration: 1000,
        })
      })
      .catch((error) => {
        toast({
          title: 'Login Error',
          description: 'Failed to login',
          variant: 'destructive',
        })
        if (process.env.NODE_ENV === 'development') {
          console.error(error)
        }
      })
  }

  const register = async (username: string, password: string) => {
    await axios
      .post('/auth/register', { username, password })
      .then((response) => {
        setSession(response.data)
        toast({
          title: 'Registration successful',
          description: 'Welcome aboard!',
          duration: 1000,
        })
      })
      .catch((error) => {
        toast({
          title: 'Registration Error',
          description: 'Failed to register',
          variant: 'destructive',
        })
        if (process.env.NODE_ENV === 'development') {
          console.error(error)
        }
      })
  }

  return (
    <SessionContext.Provider
      value={{
        session,
        logout,
        getSession,
        login,
        register,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}
