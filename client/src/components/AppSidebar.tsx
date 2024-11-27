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
import {
  Home,
  LayoutDashboard,
  LogInIcon,
  LogOut,
  Settings,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import UserInfo from './UserInfo'

export function AppSidebar() {
  const t = useTranslations('navigation')
  const { toggleSidebar } = useSidebar()
  const isMobile = useIsMobile()

  const items = [
    {
      title: t('home'),
      url: '/',
      icon: Home,
    },
    {
      title: t('login'),
      url: 'login',
      icon: LogInIcon,
    },
    {
      title: t('dashboard'),
      url: 'dashboard',
      icon: LayoutDashboard,
    },
    {
      title: t('settings'),
      url: 'settings',
      icon: Settings,
    },
    {
      title: t('logout'),
      url: 'logout',
      icon: LogOut,
    },
  ]

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
        <SidebarGroup>
          <SidebarGroupLabel>{t('recents')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>test</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserInfo />
      </SidebarFooter>
    </Sidebar>
  )
}
