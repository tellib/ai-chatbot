'use client'

import { useSession } from '@/hooks/useSession'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LogoutPage() {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session.user) {
      session.clearSession()
    } else {
      router.push('/')
    }
  }, [session])
}
