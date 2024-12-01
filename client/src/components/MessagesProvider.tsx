'use client'

import { useToast } from '@/hooks/use-toast'
import { useSession } from '@/hooks/useSession'
import axios from '@/lib/axios'
import { Message } from '@/types/message'
import { createContext, ReactNode, useEffect, useState } from 'react'

export interface MessageContextType {
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  getMessages: () => Promise<void>
  createMessage: (content: string) => Promise<void>
  streamMessage: () => Promise<void>
}

export const MessageContext = createContext<MessageContextType | undefined>(
  undefined,
)

export function MessagesProvider({
  children,
  chat_id,
}: {
  children: ReactNode
  chat_id: number
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const { toast } = useToast()
  const { session } = useSession()

  useEffect(() => {
    if (chat_id && session.user) {
      getMessages()
    } else {
      setMessages([])
    }
  }, [chat_id, session.user])

  const getMessages = async (): Promise<void> => {
    await axios
      .get(`/message/${chat_id}`)
      .then((response) => {
        setMessages(response.data)
      })
      .catch((error) => {
        toast({
          title: 'Error fetching messages',
          description: error.response.data.message,
          variant: 'destructive',
        })
      })
  }

  const createMessage = async (content: string): Promise<void> => {
    await axios
      .post(`/message/${chat_id}`, {
        content,
      })
      .then((response) => {
        setMessages([...messages, response.data])
      })
      .catch((error) => {
        toast({
          title: 'Error creating message',
          description:
            error.response?.data?.message || 'Failed to create message',
        })
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

      // Accumulate content and update the last message
      accumulatedContent += data.chunk
      setMessages((prev) => {
        if (!prev) return prev
        const lastMessage = prev[prev.length - 1]
        lastMessage.content = accumulatedContent
        return [...prev]
      })
    })

    eventSource.addEventListener('error', () => {
      console.error('SSE Error')
      eventSource.close()
    })

    eventSource.addEventListener('done', () => {
      eventSource.close()
    })
  }

  return (
    <MessageContext.Provider
      value={{
        messages,
        setMessages,
        getMessages,
        createMessage,
        streamMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  )
}
