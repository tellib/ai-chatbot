'use client'

import { useSession } from '@/hooks/useSession'

export default function DashboardPage() {
  const session = useSession()

  if (session.user) {
    return (
      <main>
        <pre className="bg-black/0.5 dark:bg-white/0.5 rounded-lg">
          <code className="text-sm">{JSON.stringify(session, null, 2)}</code>
        </pre>
      </main>
    )
  }

  return (
    <div>
      <p>Loading...</p>
    </div>
  )
}
