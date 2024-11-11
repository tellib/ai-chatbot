'use client'

import { useSession } from '@/hooks/useSession'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LogoutPage() {
  const { clearSession } = useSession()
  const router = useRouter()

  useEffect(() => {
    clearSession()
    router.push('/')
  }, [])
}
