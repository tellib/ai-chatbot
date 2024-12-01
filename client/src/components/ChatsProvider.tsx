'use client'

import { useToast } from '@/hooks/use-toast'
import { useSession } from '@/hooks/useSession'
import axios from '@/lib/axios'
import { Chat } from '@/types/chat'
import { createContext, ReactNode, useEffect, useState } from 'react'

export interface ChatContextType {
  chats: Chat[]
  getChats: () => Promise<void>
  createChat: () => Promise<void>
  updateChatTitle: (chat_id: number, title: string) => Promise<void>
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatsProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([])
  const { toast } = useToast()
  const { session } = useSession()

  useEffect(() => {
    if (session.user) {
      getChats()
    } else {
      setChats([])
    }
  }, [session.user])

  const getChats = async () => {
    await axios
      .get('/chat')
      .then((response) => {
        setChats(response.data)
      })
      .catch(() => {
        toast({
          title: 'Error',
          description: 'Failed to fetch chats',
          variant: 'destructive',
        })
      })
  }

  const createChat = async () => {
    await axios
      .post('/chat')
      .then((response) => {
        setChats([...chats, response.data])
      })
      .catch(() => {
        toast({
          title: 'Error',
          description: 'Failed to create chat',
          variant: 'destructive',
        })
      })
  }

  const updateChatTitle = async (chat_id: number, title: string) => {
    await axios
      .patch(`/chat/title/${chat_id}`, { title })
      .then((response) => {
        setChats(
          chats.map((chat) => (chat.id === chat_id ? response.data : chat)),
        )
      })
      .catch(() => {
        toast({
          title: 'Error',
          description: 'Failed to update chat title',
          variant: 'destructive',
        })
      })
  }

  return (
    <ChatContext.Provider
      value={{
        chats,
        getChats: getChats,
        createChat,
        updateChatTitle,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
