import { NewChat } from '@/components/NewChat'
import { RecentChats } from '@/components/RecentChats'
import { getTranslations } from 'next-intl/server'

export default async function ChatsPage() {
  const t = await getTranslations('navigation')
  return (
    <div className="w-lg m-auto flex max-w-lg flex-col gap-8 p-4">
      <h1 className="text-center text-3xl font-semibold">
        What can I help with?
      </h1>
      <NewChat />
      <div className="flex flex-col gap-2">
        <RecentChats />
      </div>
    </div>
  )
}
