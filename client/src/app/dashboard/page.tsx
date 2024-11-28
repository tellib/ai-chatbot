'use client'

import { ChatList } from '@/components/chat/chat-list'
import { useToast } from '@/hooks/use-toast'
import { useSession } from '@/hooks/useSession'
import axios from '@/lib/axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const router = useRouter()
  const { session } = useSession()
  const { toast } = useToast()
  const [chats, setChats] = useState([])

  useEffect(() => {
    if (session.user) {
      fetchChats()
    }
  }, [session.user])

  const fetchChats = async () => {
    try {
      const { data } = await axios.get('/chat')
      if (data.success) {
        setChats(data.data.chats)
      }
    } catch (err) {
      console.error('Failed to fetch chats:', err)
      toast({
        title: 'Error',
        description: 'Failed to fetch chats',
        variant: 'destructive',
      })
    }
  }

  const handleNewChat = async () => {
    try {
      const { data } = await axios.post('/chat')
      if (data.success) {
        router.push(`/chat/${data.data.id}`)
      }
    } catch (err) {
      console.error('Failed to create chat:', err)
      toast({
        title: 'Error',
        description: 'Failed to create new chat',
        variant: 'destructive',
      })
    }
  }

  if (!session.user) {
    return (
      <div className="mx-auto my-auto p-4">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <ChatList chats={chats} onNewChat={handleNewChat} />
    </div>
  )
}
