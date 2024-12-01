'use client'

import { ChatView } from '@/components/ChatView'
import { MessagesProvider } from '@/components/MessagesProvider'
import { useSession } from '@/hooks/useSession'
import { useParams } from 'next/navigation'

export default function ChatPage() {
  const { session } = useSession()
  const params = useParams()
  const id = parseInt(params.id as string)

  if (!session.user) {
    return (
      <div className="mx-auto my-auto p-4">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <MessagesProvider chat_id={id}>
      <ChatView />
    </MessagesProvider>
  )
}
