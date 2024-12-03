'use client'

import { useToast } from '@/hooks/use-toast'
import { useSession } from '@/hooks/useSession'
import axios from '@/lib/axios'
import { Message } from '@/types/message'
import { createContext, ReactNode, useEffect, useState } from 'react'

export interface MessageContextType {
  messages: Message[] | null
  getMessages: () => Promise<void>
  createMessage: (content: string) => Promise<void>
  streamMessage: () => Promise<void>
  loading: boolean
}

export const MessageContext = createContext<MessageContextType | undefined>(
  undefined,
)

export function MessagesProvider({
  children,
  chat_id,
}: {
  children: ReactNode
  chat_id: string
}) {
  const [messages, setMessages] = useState<Message[] | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { session } = useSession()

  useEffect(() => {
    if (session.user) {
      getMessages()
    } else {
      setMessages(null)
    }
  }, [session.user])

  const getMessages = async (): Promise<void> => {
    await axios
      .get(`/message/${chat_id}`)
      .then((response) => {
        setMessages(response.data)
        if (
          response.data &&
          response.data[response.data.length - 1].role === 'user'
        ) {
          streamMessage()
        }
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

  const createMessage = async (content: string): Promise<void> => {
    setLoading(true)
    await axios
      .post(`/message/${chat_id}`, {
        content,
      })
      .then((response) => {
        setMessages((prev) => {
          if (!prev) return prev
          return [...prev, response.data]
        })
        streamMessage()
      })
      .catch((error) => {
        toast({
          title: 'Error',
          description: 'Failed to create message',
          variant: 'destructive',
        })
        if (process.env.NODE_ENV === 'development') {
          console.error(error)
        }
      })
  }

  const streamMessage = async (): Promise<void> => {
    // Create temporary assistant message for streaming
    const assistantMessage: Message = {
      content: '',
      role: 'assistant',
      timestamp: new Date().toISOString(),
    }

    // Add empty assistant message that will be updated with stream
    setMessages((prev) => {
      if (!prev) return prev
      return [...prev, assistantMessage]
    })

    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://server:4000/api/v1'}/message/stream/${
        chat_id
      }`,
      { withCredentials: true },
    )

    let accumulatedContent = ''

    eventSource.addEventListener('chunk', (event) => {
      const data = JSON.parse(event.data)

      if (data.error) {
        toast({
          title: 'Error',
          description: data.error,
          variant: 'destructive',
        })
        eventSource.close()
        return
      }

      accumulatedContent += data.chunk
      setMessages((prev) => {
        if (!prev) return prev
        const lastMessage = prev[prev.length - 1]
        lastMessage.content = accumulatedContent
        return [...prev]
      })
    })

    eventSource.addEventListener('error', (event) => {
      toast({
        title: 'Error',
        description: 'Failed to stream message',
        variant: 'destructive',
      })
      if (process.env.NODE_ENV === 'development') {
        console.error(event)
      }
      eventSource.close()
      setLoading(false)
    })

    eventSource.addEventListener('done', (event) => {
      const data = JSON.parse(event.data)
      eventSource.close()
      setMessages((prev) => {
        if (!prev) return prev
        const lastMessage = prev[prev.length - 1]
        lastMessage.id = data.message.id
        lastMessage.timestamp = data.message.timestamp
        return [...prev]
      })
      setLoading(false)
    })
  }

  return (
    <MessageContext.Provider
      value={{
        messages,
        getMessages,
        createMessage,
        streamMessage,
        loading,
      }}
    >
      {children}
    </MessageContext.Provider>
  )
}
