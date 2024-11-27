import { getTranslations } from 'next-intl/server'

export default async function SettingsPage() {
  const t = await getTranslations('settings')

  return (
    <main className="mx-auto my-auto p-4">
      <p>{t('title')}</p>
    </main>
  )
}
