import { ChatsList } from '@/components/ChatsList'
import { NewChat } from '@/components/NewChat'
import { getTranslations } from 'next-intl/server'

export default async function ChatsPage() {
  const t = await getTranslations('navigation')
  return (
    <div className="m-auto space-y-4 p-4">
      <NewChat />
      <ChatsList />
    </div>
  )
}
