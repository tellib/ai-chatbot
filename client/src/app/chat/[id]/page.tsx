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
  content: string
  role: 'user' | 'assistant'
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
  const [message, setMessage] = useState<Message>({
    content: '',
    role: 'user',
    timestamp: new Date().toISOString(),
  })
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
    // validate message
    if (!message.content.trim() || isSubmitting) return

    // update chat with new user message
    setChat((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        messages: [...prev.messages, message],
      }
    })

    setIsSubmitting(true)

    // Create temporary assistant message for streaming
    const assistantMessage: Message = {
      content: '',
      role: 'assistant',
      timestamp: new Date().toISOString(),
    }

    // Add empty assistant message that will be updated with stream
    setChat((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        messages: [...prev.messages, assistantMessage],
      }
    })

    try {
      // Send message to server but don't update chat state with the response
      await axios.post(`/chat/${params.id}/message`, {
        message: message.content.trim(),
      })

      setMessage({
        content: '',
        role: 'user',
        timestamp: '',
      })
    } catch (err) {
      console.error('Failed to send message:', err)
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      })
      setIsSubmitting(false)
      return
    }

    // get llm stream through SSE
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://server:4000/api/v1'}/chat/${
        params.id
      }/message/stream`,
      { withCredentials: true },
    )

    let accumulatedContent = '' // Add this to accumulate streamed content

    eventSource.addEventListener('message', (event) => {
      const data = JSON.parse(event.data)

      if (data.error) {
        toast({
          title: 'Error',
          description: data.error,
          variant: 'destructive',
        })
        eventSource.close()
        setIsSubmitting(false)
        return
      }

      // Accumulate content and update the last message
      accumulatedContent += data.data.chunk
      setChat((prev) => {
        if (!prev) return prev
        const messages = [...prev.messages]
        const lastMessage = messages[messages.length - 1]
        lastMessage.content = accumulatedContent // Use accumulated content
        return {
          ...prev,
          messages,
        }
      })
    })

    eventSource.addEventListener('error', () => {
      console.error('SSE Error')
      eventSource.close()
      setIsSubmitting(false)
    })

    eventSource.addEventListener('done', () => {
      eventSource.close()
      setIsSubmitting(false)
    })
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

  // show oldest first
  const sortedMessages = [...chat.messages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  )

  const renderMessage = (message: Message) => {
    const isUser = message.role === 'user'
    return (
      <div
        key={message.timestamp}
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
          value={message.content}
          onChange={(e) => setMessage({ ...message, content: e.target.value })}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="resize-none"
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
