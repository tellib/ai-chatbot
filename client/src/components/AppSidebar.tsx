'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useIsMobile } from '@/hooks/use-mobile'
import { useChats } from '@/hooks/useChats'
import { useSession } from '@/hooks/useSession'
import {
  ChevronUp,
  Home,
  LayoutDashboard,
  LogInIcon,
  LogOut,
  MoreHorizontal,
  Settings,
  User2,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function AppSidebar() {
  const t = useTranslations('navigation')
  const { toggleSidebar } = useSidebar()
  const isMobile = useIsMobile()
  const { session } = useSession()
  const { chats, fetchRecentChats } = useChats()

  useEffect(() => {
    if (session?.user) {
      fetchRecentChats()
    }
  }, [session?.user, fetchRecentChats])

  const items = [
    {
      title: t('home'),
      url: '/',
      icon: Home,
    },
    {
      title: t('login'),
      url: '/login',
      icon: LogInIcon,
    },
    {
      title: t('dashboard'),
      url: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: t('settings'),
      url: '/settings',
      icon: Settings,
    },
    {
      title: t('logout'),
      url: '/logout',
      icon: LogOut,
    },
  ]

  const RecentChats = () => {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>{t('recents')}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {chats?.map((chat) => (
              <SidebarMenuItem key={chat.id}>
                <SidebarMenuButton asChild>
                  <Link href={`/chat/${chat.id}`}>
                    <span>{chat.title}</span>
                  </Link>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction>
                      <MoreHorizontal />
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="bottom" align="start">
                    <DropdownMenuItem>
                      <span>Rename</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    )
  }

  const UserMenu = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton>
            <User2 /> {session?.user?.username}
            <ChevronUp className="ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          className="w-[--radix-popper-anchor-width]"
        >
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <span>Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const LoginMenu = () => {
    return (
      <SidebarMenuButton asChild>
        <Link href="/login">
          <LogInIcon />
          <span>Login</span>
        </Link>
      </SidebarMenuButton>
    )
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('title')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => isMobile && toggleSidebar()}
                    asChild
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {chats?.length > 0 && <RecentChats />}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {session?.user ? <UserMenu /> : <LoginMenu />}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
