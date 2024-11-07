import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import UserInfo from '@/components/UserInfo'
import {
  Home,
  LayoutDashboard,
  LogInIcon,
  LogOut,
  Settings,
} from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export async function AppSidebar() {
  const t = await getTranslations('navigation')

  const items = [
    {
      title: t('home'),
      url: '/',
      icon: Home,
    },
    {
      title: t('login'),
      url: 'auth',
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
        <SidebarHeader>
          <UserInfo />
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel>{t('title')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
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
          <SidebarGroupLabel>{t('title')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
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
        <SidebarFooter></SidebarFooter>
      </SidebarContent>
    </Sidebar>
  )
}
