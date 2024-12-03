'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useIsMobile } from '@/hooks/use-mobile'
import { useChats } from '@/hooks/useChats'
import { useSession } from '@/hooks/useSession'
import { ChevronUp, Home, LogInIcon, SpeechIcon, User2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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
  const { session, logout } = useSession()
  const { chats, deleteChat } = useChats()
  const router = useRouter()
  const pathname = usePathname()

  const items = [
    {
      title: t('home'),
      url: '/',
      icon: Home,
    },
    {
      title: t('chats'),
      url: '/chat',
      icon: SpeechIcon,
    },
  ]

  const MenuGroup = () => {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>{t('title')}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => {
              const isActive =
                item.url === '/chat'
                  ? pathname === '/chat' || pathname.startsWith('/chat/')
                  : pathname === item.url
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => isMobile && toggleSidebar()}
                    asChild
                    isActive={isActive}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    )
  }

  const ChatGroup = () => {
    if (!chats || chats.length === 0) {
      return null
    }
    return (
      <SidebarGroup>
        <SidebarGroupLabel>{t('recent')}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {chats?.map((chat) => {
              const isActive = pathname === `/chat/${chat.id}`
              return (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton
                    asChild
                    onClick={() => isMobile && toggleSidebar()}
                    isActive={isActive}
                  >
                    <Link href={`/chat/${chat.id}`}>
                      <span>{chat.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction>
                        <MoreHorizontal />
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="bottom" align="start">
                      <DropdownMenuItem>
                        <span>Rename</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deleteChat(chat.id)}>
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu> */}
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    )
  }

  const UserMenu = () => {
    if (!session?.user) {
      return (
        <SidebarMenuButton asChild>
          <Link href="/login" onClick={() => isMobile && toggleSidebar()}>
            <LogInIcon />
            <span>Login</span>
          </Link>
        </SidebarMenuButton>
      )
    }
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
            <DropdownMenuItem
              onClick={() => {
                router.push('/account')
                isMobile && toggleSidebar()
              }}
            >
              <span>Account</span>
            </DropdownMenuItem>
            {/* <DropdownMenuItem onClick={() => router.push('/settings')}>
              <span>Settings</span>
            </DropdownMenuItem> */}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              logout()
              isMobile && toggleSidebar()
            }}
          >
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  return (
    <Sidebar>
      <SidebarContent>
        <MenuGroup />
        <ChatGroup />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserMenu />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
