'use client'

import { cn } from '@/lib/utils'
import { SidebarButton } from './SidebarButton'
import { ThemeToggle } from './ThemeToggle'
import { useSidebar } from './ui/sidebar'

export default function FloatingNav() {
  const { open, isMobile } = useSidebar()
  return (
    <>
      <div
        className={cn(
          'absolute right-0 top-0 flex w-full flex-row items-center justify-between gap-3 border-b border-foreground/10 bg-background/50 p-3 backdrop-blur-md',
          !isMobile && open && 'pl-[--sidebar-width]',
        )}
      >
        <div className={cn('flex flex-row gap-2', !isMobile && open && 'pl-3')}>
          <ThemeToggle />
          {/* <LocaleToggle /> */}
        </div>
        <h1 className="pl-3 text-lg font-semibold">TellBot</h1>
        <div className="flex flex-row gap-2">
          <SidebarButton />
        </div>
      </div>
    </>
  )
}
