'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useSession } from '@/hooks/useSession'
import axios from '@/lib/axios'
import { SendHorizontal } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'

interface Message {
  id: number
  content: string
  role: 'USER' | 'BOT'
  timestamp: string
}

interface Chat {
  id: number
  title: string
  messages: Message[]
}

export default function ChatPage() {
  const params = useParams()
  const { session } = useSession()
  const { toast } = useToast()
  const [chat, setChat] = useState<Chat | null>(null)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (session.user) {
      fetchChat()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.user, params.id])

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom()
  }, [chat?.messages])

  const fetchChat = async () => {
    try {
      const { data } = await axios.get(`/chat/${params.id}`)
      if (data.success) {
        setChat(data.data)
      }
    } catch (err) {
      console.error('Failed to fetch chat:', err)
      toast({
        title: 'Error',
        description: 'Failed to fetch chat',
        variant: 'destructive',
      })
    }
  }

  const handleSubmit = async () => {
    if (!message.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const { data } = await axios.post(`/chat/${params.id}/messages`, {
        message: message.trim(),
      })

      if (data.success) {
        setMessage('')
        // Update chat with new messages
        setChat((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            messages: [
              ...prev.messages,
              data.data.userMessage,
              data.data.botMessage,
            ],
          }
        })
      }
    } catch (err) {
      console.error('Failed to send message:', err)
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  if (!session.user || !chat) {
    return (
      <div className="mx-auto my-auto p-4">
        <p>Loading...</p>
      </div>
    )
  }

  // Sort messages by timestamp (oldest first)
  const sortedMessages = [...chat.messages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  )

  const renderMessage = (message: Message) => {
    const isUser = message.role === 'USER'
    return (
      <div
        key={message.id}
        className={`rounded-lg p-4 ${
          isUser
            ? 'ml-auto bg-primary text-primary-foreground shadow-sm ring-1 ring-inset ring-primary/10'
            : 'max-w-none bg-primary-foreground shadow-sm ring-1 ring-inset ring-primary/10'
        } max-w-[80%]`}
      >
        {isUser ? (
          message.content
        ) : (
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({ children }) => (
                <ul className="my-4 list-disc pl-8">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="my-4 list-decimal pl-8">{children}</ol>
              ),
              li: ({ children }) => <li className="mb-1">{children}</li>,
              code: ({ className, children, ...props }) => (
                <code
                  className={`text-sm text-primary/60 ${className} m-2 my-4 block overflow-x-auto rounded-lg p-4 shadow-sm ring-1 ring-inset ring-primary/10`}
                  {...props}
                >
                  {children}
                </code>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    )
  }

  return (
    <main className="container mx-auto flex h-[calc(100vh-2rem)] flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">{chat.title}</h1>

      <div className="flex-grow space-y-4 overflow-y-auto rounded-lg p-4">
        {sortedMessages.map(renderMessage)}
        {/* Invisible div for scrolling */}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex max-h-24 gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="resize-none"
          disabled={isSubmitting}
        />
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="h-full"
        >
          <SendHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </main>
  )
}
