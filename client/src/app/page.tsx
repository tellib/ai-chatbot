import axios from '@/lib/axios'
import { cn } from '@/lib/utils'
import { Bot } from 'lucide-react'

export default async function Home() {
  const { version, status } = await axios
    .get('/')
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.error('Server is not running', error)
      return {
        version: 'Unknown',
        status: 'Offline',
      }
    })

  return (
    <main className="m-auto scale-125 p-4 text-center">
      <p className="text-2xl font-bold duration-700 animate-in fade-in">
        Welcome to TellBot!
      </p>
      <p className="text-base text-muted-foreground delay-200 duration-1000 animate-in fade-in">
        A simple chatbot for your conversations
      </p>
      <div className="flex flex-col gap-1">
        <Bot
          size={100}
          className="mx-auto delay-500 duration-1000 animate-in fade-in"
        />
        <p className="text-xs text-muted-foreground">Version: {version}</p>
        <p className="text-sm text-muted-foreground">
          Server:{' '}
          <span
            className={cn(
              'text-sm font-bold',
              status === 'Online'
                ? 'animate-pulse text-green-500'
                : 'text-red-500',
            )}
          >
            {status}
          </span>
        </p>
      </div>
    </main>
  )
}
