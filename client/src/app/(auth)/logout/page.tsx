'use client'

import { useSession } from '@/hooks/useSession'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function LogoutPage() {
  const { clearSession } = useSession()

  useEffect(() => {
    setTimeout(async () => {
      await clearSession()
      redirect('/')
    }, 1000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div className="mx-auto my-auto p-4">Logging out...</div>
}
