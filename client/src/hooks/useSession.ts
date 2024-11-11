'use client'

import { SessionContext } from '@/components/SessionProvider'
import { SessionContextType } from '@/lib/data'
import { useContext } from 'react'

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}
