'use client'

import {
  MessageContext,
  MessageContextType,
} from '@/components/MessagesProvider'
import { useContext } from 'react'

export const useMessages = (): MessageContextType => {
  const context = useContext(MessageContext)
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessagesProvider')
  }
  return context
}
