'use server'

import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'
import { Locale, defaultLocale } from './config'

const COOKIE_NAME = 'locale'

export async function getUserLocale() {
  const cookieStore = await cookies()
  return (cookieStore.get(COOKIE_NAME)?.value as Locale) || defaultLocale
}

export async function setUserLocale(locale: Locale | null) {
  const cookieStore = await cookies()
  if (locale) {
    cookieStore.set(COOKIE_NAME, locale)
  } else {
    cookieStore.delete(COOKIE_NAME)
  }
}

export default getRequestConfig(async () => {
  const locale = await getUserLocale()

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
