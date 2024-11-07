'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { setUserLocale } from '@/i18n/request'
import { Languages } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function LocaleToggle() {
  const t = useTranslations('settings')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4"
        >
          <Languages className="" />
          <span className="sr-only">{t('language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setUserLocale('en-US')}>
          {t('languages.en-US')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setUserLocale('ko-KR')}>
          {t('languages.ko-KR')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
