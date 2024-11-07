export type Locale = (typeof locales)[number]

export const locales = ['en-US', 'ko-KR'] as const
export const defaultLocale: Locale = 'en-US'
