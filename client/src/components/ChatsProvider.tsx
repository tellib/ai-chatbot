'use client'

import { useToast } from '@/hooks/use-toast'
import { useSession } from '@/hooks/useSession'
import axios from '@/lib/axios'
import { Chat } from '@/types/chat'
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react'

export interface ChatContextType {
  chats: Chat[]
  fetchChats: () => Promise<void>
  fetchRecentChats: () => Promise<void>
  createChat: () => Promise<Chat>
  updateChatTitle: (chatId: number, title: string) => Promise<void>
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatsProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([])
  const { toast } = useToast()
  const { session } = useSession()

  useEffect(() => {
    if (session.user) {
      fetchRecentChats()
    } else {
      setChats([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.user])

  const fetchChats = useCallback(async () => {
    try {
      const { data } = await axios.get('/chat')
      if (data.success) {
        setChats(data.data.chats)
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to fetch chats',
        variant: 'destructive',
      })
    }
  }, [toast])

  const fetchRecentChats = useCallback(async () => {
    try {
      const { data } = await axios.get('/chat/recent')
      if (data.success) {
        setChats(data.data)
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to fetch recent chats',
        variant: 'destructive',
      })
    }
  }, [toast])

  const createChat = useCallback(async () => {
    try {
      const { data } = await axios.post('/chat')
      if (data.success) {
        await fetchRecentChats()
        return data.data
      }
      throw new Error('Failed to create chat')
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to create new chat',
        variant: 'destructive',
      })
      throw new Error('Failed to create chat')
    }
  }, [fetchRecentChats, toast])

  const updateChatTitle = useCallback(
    async (chatId: number, title: string) => {
      try {
        const { data } = await axios.patch(`/chat/${chatId}/title`, { title })
        if (data.success) {
          await fetchRecentChats()
        }
      } catch {
        toast({
          title: 'Error',
          description: 'Failed to update chat title',
          variant: 'destructive',
        })
      }
    },
    [fetchRecentChats, toast],
  )

  return (
    <ChatContext.Provider
      value={{
        chats,
        fetchChats,
        fetchRecentChats,
        createChat,
        updateChatTitle,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
