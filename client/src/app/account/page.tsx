'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSession } from '@/hooks/useSession'

export default function AccountPage() {
  const { session } = useSession()

  if (!session?.user) {
    return (
      <div className="m-auto">
        <p>Must be logged in to view this page</p>
      </div>
    )
  }

  const userFields = [
    { label: 'Username', value: session.user.username },
    { label: 'User ID', value: session.user.id },
    {
      label: 'Account Created',
      value: session.user.created_at.toLocaleString().slice(0, 10),
    },
    { label: 'Role', value: session.user.role },
  ]

  return (
    <div className="m-auto max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {userFields.map((field) => (
            <div key={field.label} className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">
                {field.label}
              </span>
              <span className="text-base">{field.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
