'use client'

import { useToast } from '@/hooks/use-toast'
import { useSession } from '@/hooks/useSession'
import axios from '@/lib/axios'
import { Chat } from '@/types/chat'
import { createContext, ReactNode, useEffect, useState } from 'react'

export interface ChatContextType {
  chats: Chat[] | null
  getChats: () => Promise<void>
  createChat: (content: string) => Promise<Chat>
  updateChatTitle: (chat_id: number, title: string) => Promise<void>
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatsProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[] | null>(null)

  const { toast } = useToast()
  const { session } = useSession()

  useEffect(() => {
    if (session.user) {
      try {
        getChats()
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch chats',
          variant: 'destructive',
        })
      }
    }
  }, [session.user])

  const getChats = async () => {
    await axios
      .get('/chat')
      .then((response) => {
        setChats(response.data)
      })
      .catch((error) => {
        throw error
      })
  }

  const createChat = async (content: string): Promise<Chat> => {
    return await axios
      .post('/chat', { content })
      .then((response) => {
        setChats((prev) => {
          if (!prev) return prev
          return [response.data, ...prev]
        })
        return response.data
      })
      .catch((error) => {
        throw error
      })
  }

  const updateChatTitle = async (chat_id: number, title: string) => {
    await axios
      .patch(`/chat/title/${chat_id}`, { title })
      .then((response) => {
        setChats((prev) => {
          if (!prev) return prev
          return prev.map((chat) =>
            chat.id === chat_id ? response.data : chat,
          )
        })
      })
      .catch((error) => {
        throw error
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
