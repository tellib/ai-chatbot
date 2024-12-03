'use client'

import { MessagesInput } from '@/components/MessagesInput'
import { MessagesProvider } from '@/components/MessagesProvider'
import { MessagesView } from '@/components/MessagesView'
import { useChats } from '@/hooks/useChats'
import { useParams } from 'next/navigation'

export default function ChatPage() {
  const params = useParams<{ id: string }>()
  const { chats } = useChats()

  const chat = chats?.find((chat) => chat.id === parseInt(params.id))

  return (
    <MessagesProvider chat_id={params.id}>
      <main className="flex h-screen w-full flex-col">
        <MessagesView />
        <MessagesInput />
      </main>
    </MessagesProvider>
  )
}
