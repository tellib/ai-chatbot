import { ChatsList } from '@/components/ChatsList'
import { getTranslations } from 'next-intl/server'

export default async function ChatsPage() {
  const t = await getTranslations('chats')
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold">{t('title')}</h2>
      <ChatsList />
    </div>
  )
}
