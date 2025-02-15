'use client'

import { useSession } from '@/hooks/useSession'

export default function UserInfo() {
  const { session } = useSession()

  if (session?.user) {
    return (
      <div className="flex justify-between p-2 align-middle text-sm font-medium text-sidebar-foreground/70">
        <p>User: {session.user.username}</p>
        <p>ID: {session.user.id}</p>
        <p>Role: {session.user.role}</p>
      </div>
    )
  }
  return null
}
