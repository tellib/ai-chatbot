'use client'

import { MessagesInput } from '@/components/MessagesInput'
import { MessagesProvider } from '@/components/MessagesProvider'
import { MessagesView } from '@/components/MessagesView'
import { useParams } from 'next/navigation'

export default function ChatPage() {
  const params = useParams<{ id: string }>()

  return (
    <MessagesProvider chat_id={params.id}>
      <div className="mx-auto flex h-screen w-full flex-col">
        <MessagesView />
        <MessagesInput />
      </div>
    </MessagesProvider>
  )
}
