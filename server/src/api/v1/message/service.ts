import { getDb } from '@/config/database'
import { Message } from '@prisma/client'

interface PaginatedMessages {
  messages: Message[]
  hasMore: boolean
  total: number
}

/**
 * Gets the messages of a chat
 * @param chat_id The id of the chat
 * @param page The page number
 * @param pageSize The number of messages per page
 * @returns The messages and total number of messages
 */
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

/**
 * Creates a new message
 * @param chat_id The id of the chat
 * @param content The content of the message
 * @param role The role of the message
 * @returns The created message object
 */
export async function createMessage(
  chat_id: number,
  content: string,
  role: 'user' | 'assistant',
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
