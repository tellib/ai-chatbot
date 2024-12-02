'use client'

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useChats } from '@/hooks/useChats'
import { formatDate } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

export function ChatsList() {
  const { chats } = useChats()
  const router = useRouter()
  const t = useTranslations('navigation')
  // Take only the first 6 chats (2x3 grid)
  const displayedChats = chats?.slice(0, 6)

  if (!displayedChats) {
    return null
  }

  return (
    <>
      <h2 className="text-2xl font-bold">{t('recent')}</h2>
      <div className="grid grid-cols-3 gap-4">
        {displayedChats.map((chat) => (
          <Card
            key={chat.id}
            className="cursor-pointer transition-colors hover:bg-accent/50"
            onClick={() => router.push(`/chat/${chat.id}`)}
          >
            <CardHeader>
              <CardTitle className="text-sm">{chat.title}</CardTitle>
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
