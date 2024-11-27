'use client'

import { SidebarButton } from '@/components/SidebarButton'
import { Textarea } from '@/components/ui/textarea'
import { useSession } from '@/hooks/useSession'

export default function DashboardPage() {
  const { session } = useSession()

  if (session.user) {
    return (
      <main>
        {/* <pre className="bg-black/0.5 dark:bg-white/0.5 rounded-lg"> */}
        {/* <code className="text-sm">{JSON.stringify(session, null, 2)}</code> */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger>
            <Button>Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>New Window</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
        <SidebarButton />
        <Textarea value="0000" onChange={() => {}} />
        {/* </pre> */}
      </main>
    )
  }

  return (
    <div className="mx-auto my-auto p-4">
      <p>Loading...</p>
    </div>
  )
}
