'use client'

import { toast } from '@/hooks/use-toast'
import { useMessages } from '@/hooks/useMessages'
import { useSession } from '@/hooks/useSession'
import { Message } from '@/types/message'
import { CopyIcon, LoaderCircle } from 'lucide-react'
import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { Button } from './ui/button'

export function MessagesView() {
  const { session } = useSession()
  const { messages } = useMessages()
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messages) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const renderMessage = (message: Message) => {
    const isUser = message.role === 'user'
    return (
      <div
        key={message.timestamp}
        className={`mx-auto w-full max-w-full rounded-2xl px-6 py-4 md:max-w-md lg:max-w-2xl ${
          isUser
            ? 'bg-primary-foreground shadow-sm ring-1 ring-inset ring-primary/10'
            : ''
        }`}
      >
        {isUser ? (
          message.content
        ) : message.content ? (
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
                  className={`bg-accent text-sm text-accent-foreground ${className} my-3 block overflow-x-auto rounded-sm p-4 shadow-sm ring-1 ring-inset ring-primary/10`}
                  {...props}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="float-right"
                    onClick={() => {
                      navigator.clipboard.writeText(String(children))
                      toast({
                        title: 'Copied to clipboard',
                        duration: 800,
                      })
                    }}
                  >
                    <CopyIcon />
                  </Button>
                  {children}
                </code>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        ) : (
          <div className="flex animate-pulse items-center gap-2">
            <LoaderCircle className="animate-spin" />
            <span>Loading...</span>
          </div>
        )}
      </div>
    )
  }

  if (messages && messages.length > 0)
    return (
      <div className="h-full space-y-4 overflow-y-auto p-6 pt-24">
        {messages.map(renderMessage)}
        {/* Invisible div for scrolling */}
        <div ref={endRef} />
      </div>
    )
}
