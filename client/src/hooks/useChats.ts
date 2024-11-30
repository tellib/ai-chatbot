'use client'

import { ChatContext, ChatContextType } from '@/components/ChatsProvider'
import { useContext } from 'react'

export const useChats = (): ChatContextType => {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChats must be used within a ChatsProvider')
  }
  return context
}
