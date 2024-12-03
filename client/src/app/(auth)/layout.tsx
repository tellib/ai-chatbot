'use client'

import { useSession } from '@/hooks/useSession'
import { redirect } from 'next/navigation'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { session } = useSession()

  if (session?.user) {
    return redirect('/chat')
  }
  return <>{children}</>
}
