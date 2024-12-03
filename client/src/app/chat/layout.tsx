'use client'

import { useChats } from '@/hooks/useChats'
import { useSession } from '@/hooks/useSession'

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { session } = useSession()
  const { chats } = useChats()

  if (!session?.user) {
    return <div className="m-auto">Must be logged in to view this page</div>
  }

  if (session?.user && chats) {
    return <>{children}</>
  }
}
