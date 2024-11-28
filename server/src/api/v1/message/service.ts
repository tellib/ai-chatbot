import axios from '@/config/axios'
import { getDb } from '@/config/database'
import { Message } from '@prisma/client'

interface PaginatedMessages {
  messages: Message[]
  hasMore: boolean
  total: number
}

export async function getChatMessages(
  chat_id: number,
  page = 1,
  pageSize = 50,
): Promise<PaginatedMessages> {
  const prisma = getDb()
  const skip = (page - 1) * pageSize

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where: { chat_id },
      orderBy: { timestamp: 'desc' },
      skip,
      take: pageSize + 1,
    }),
    prisma.message.count({
      where: { chat_id },
    }),
  ])

  const hasMore = messages.length > pageSize
  if (hasMore) {
    messages.pop()
  }

  return {
    messages,
    hasMore,
    total,
  }
}

export async function createMessage(
  chat_id: number,
  content: string,
  role: 'USER' | 'BOT',
) {
  const prisma = getDb()
  return prisma.message.create({
    data: {
      chat_id,
      content,
      role,
    },
  })
}

export async function getResponseFromLLM(prompt: string) {
  // TODO: Implement actual LLM integration
  // const response = 'Hello! This is a placeholder response.'
  // return response

  try {
    const response = await axios.post('/generate', {
      prompt,
    })
    console.log('LLM response:', response.data)

    // The Flask app returns { response: string }
    return response.data.response
  } catch (error) {
    console.error('Error getting LLM response:', error)
    throw new Error('Failed to get response from LLM service')
  }
}
