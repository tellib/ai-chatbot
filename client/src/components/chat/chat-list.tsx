'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { MessageSquare, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Chat {
  id: number
  title: string
  timestamp: string
  messages: Array<{
    content: string
    timestamp: string
  }>
}

interface ChatListProps {
  chats: Chat[]
  onNewChat: () => Promise<void>
}

export function ChatList({ chats, onNewChat }: ChatListProps) {
  const router = useRouter()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Chats</h2>
        <Button onClick={onNewChat}>
          <Plus className="mr-2" />
          New Chat
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        {chats.map((chat) => (
          <Card
            key={chat.id}
            className="cursor-pointer transition-colors hover:bg-accent/50"
            onClick={() => router.push(`/chat/${chat.id}`)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                {chat.title}
              </CardTitle>
              <CardDescription>
                <span className="block">
                  {chat.messages[0]?.content.substring(0, 100) ||
                    'No messages yet'}
                </span>
                <span className="mt-2 block text-xs">
                  {formatDate(new Date(chat.timestamp))}
                </span>
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
