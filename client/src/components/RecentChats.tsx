'use client'

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useChats } from '@/hooks/useChats'
import { formatDate } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export function RecentChats() {
  const { chats } = useChats()
  const router = useRouter()

  if (!chats || chats.length === 0) {
    return null
  }

  const displayedChats = chats?.slice(0, 4)

  return (
    <>
      <h2 className="text-2xl font-bold">Recent Chats</h2>
      <div className="flex flex-col gap-2">
        {displayedChats.map((chat) => (
          <Card
            key={chat.id}
            className="cursor-pointer transition-colors hover:bg-accent/50"
            onClick={() => router.push(`/chat/${chat.id}`)}
          >
            <CardHeader>
              <CardTitle className="truncate text-sm">{chat.title}</CardTitle>
              <CardDescription>
                <span className="text-xs">
                  {formatDate(new Date(chat.timestamp))}
                </span>
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  )
}
