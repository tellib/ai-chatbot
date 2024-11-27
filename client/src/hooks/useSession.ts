'use client'

import {
  SessionContext,
  SessionContextType,
} from '@/components/SessionProvider'
import { useContext } from 'react'

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}
