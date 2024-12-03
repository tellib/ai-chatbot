'use client'

import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'
import { SidebarIcon } from 'lucide-react'

export function SidebarButton() {
  const { toggleSidebar } = useSidebar()
  return (
    <Button variant="outline" size="icon" onClick={toggleSidebar}>
      <SidebarIcon />
    </Button>
  )
}
