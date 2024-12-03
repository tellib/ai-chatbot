'use client'

import { useToast } from '@/hooks/use-toast'
import { useSession } from '@/hooks/useSession'
import axios from '@/lib/axios'
import { Chat } from '@/types/chat'
import { useRouter } from 'next/navigation'
import { createContext, ReactNode, useEffect, useState } from 'react'

export interface ChatContextType {
  chats: Chat[] | null
  getChats: () => Promise<void>
  createChat: (content: string) => Promise<void>
  updateChatTitle: (chat_id: number, title: string) => Promise<void>
  deleteChat: (chat_id: number) => Promise<void>
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatsProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[] | null>(null)
  const router = useRouter()

  const { toast } = useToast()
  const { session } = useSession()

  useEffect(() => {
    if (session.user) {
      getChats()
    } else {
      setChats(null)
    }
  }, [session])

  const getChats = async () => {
    await axios
      .get('/chat')
      .then((response) => {
        setChats(response.data)
      })
      .catch((error) => {
        toast({
          title: 'Error',
          description: 'Failed to fetch chats',
          variant: 'destructive',
        })
        if (process.env.NODE_ENV === 'development') {
          console.error(error)
        }
      })
  }

  const createChat = async (content: string): Promise<void> => {
    return await axios
      .post('/chat', { content })
      .then((response) => {
        setChats((prev) => {
          if (!prev) return prev
          return [response.data, ...prev]
        })
        router.push(`/chat/${response.data.id}`)
      })
      .catch((error) => {
        toast({
          title: 'Error',
          description: 'Failed to create chat',
          variant: 'destructive',
        })
        if (process.env.NODE_ENV === 'development') {
          console.error(error)
        }
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
        toast({
          title: 'Error',
          description: 'Failed to update chat title',
          variant: 'destructive',
        })
        if (process.env.NODE_ENV === 'development') {
          console.error(error)
        }
      })
  }

  const deleteChat = async (chat_id: number) => {
    await axios
      .delete(`/chat/delete/${chat_id}`)
      .then(() => {
        setChats((prev) => {
          if (!prev) return prev
          return prev.filter((chat) => chat.id !== chat_id)
        })
      })
      .catch((error) => {
        toast({
          title: 'Error',
          description: 'Failed to delete chat',
          variant: 'destructive',
        })
        if (process.env.NODE_ENV === 'development') {
          console.error(error)
        }
      })
  }

  return (
    <ChatContext.Provider
      value={{
        chats,
        getChats: getChats,
        createChat,
        updateChatTitle,
        deleteChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
