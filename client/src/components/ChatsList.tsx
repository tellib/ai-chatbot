'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useChats } from '@/hooks/useChats'
import { formatDate } from '@/lib/utils'
import { MessageSquare, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function ChatsList() {
  const { chats, createChat } = useChats()
  const router = useRouter()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button onClick={createChat}>
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
                <span className="text-sm">
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
