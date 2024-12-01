'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useMessages } from '@/hooks/useMessages'
import { Message } from '@/types/message'
import { SendHorizontal } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'

export function ChatView() {
  const { messages, createMessage, streamMessage } = useMessages()

  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const initalInput: Message = {
    content: '',
    role: 'user',
    timestamp: new Date().toISOString(),
  }

  const [input, setInput] = useState<Message>(initalInput)

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const onSubmit = async () => {
    // validate message TODO use zod
    if (!input.content.trim() || loading) return
    setLoading(true)

    await createMessage(input.content.trim()).then(() => {
      setInput(initalInput)
      setLoading(false)
    })

    await streamMessage()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }

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

  if (!messages) {
    return (
      <div className="mx-auto my-auto p-4">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto flex h-[calc(100vh-2rem)] flex-col gap-4 p-4">
      <div className="flex-grow space-y-4 overflow-y-auto rounded-lg p-4">
        {messages.map(renderMessage)}
        {/* Invisible div for scrolling */}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex max-h-24 gap-2">
        <Textarea
          ref={textareaRef}
          value={input.content}
          onChange={(e) => setInput({ ...input, content: e.target.value })}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="resize-none"
        />
        <Button onClick={onSubmit} disabled={loading} className="h-full">
          <SendHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
