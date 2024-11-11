'use client'

import { useSession } from '@/hooks/useSession'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function LogoutPage() {
  const { clearSession } = useSession()

  useEffect(() => {
    clearSession()
    redirect('/')
  }, [])
}
