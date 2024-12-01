import { getDb } from '@/config/database'

export async function getMessages(chat_id: number) {
  const prisma = getDb()

  const messages = await prisma.message.findMany({
    where: { chat_id },
    orderBy: { timestamp: 'asc' },
  })
  return messages
}

export async function getContext(chat_id: number) {
  const prisma = getDb()
  const messages = await prisma.message.findMany({
    where: { chat_id },
    select: {
      content: true,
      role: true,
    },
    orderBy: { timestamp: 'asc' },
  })
  return messages
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
  const message = await prisma.message.create({
    data: {
      chat_id,
      content,
      role,
    },
  })
  return message
}

// /**
//  * Gets the messages of a chat
//  * @param chat_id The id of the chat
//  * @param page The page number
//  * @param pageSize The number of messages per page
//  * @returns The messages and total number of messages
//  */
// export async function getPaginatedMessages(
//   chat_id: number,
//   page = 1,
//   pageSize = 50,
// ): Promise<PaginatedMessages> {
//   const prisma = getDb()
//   const skip = (page - 1) * pageSize

//   const [messages, total] = await Promise.all([
//     prisma.message.findMany({
//       where: { chat_id },
//       orderBy: { timestamp: 'desc' },
//       skip,
//       take: pageSize + 1,
//     }),
//     prisma.message.count({
//       where: { chat_id },
//     }),
//   ])

//   const hasMore = messages.length > pageSize
//   if (hasMore) {
//     messages.pop()
//   }

//   return {
//     messages,
//     hasMore,
//     total,
//   }
// }

// interface PaginatedMessages {
//   messages: Message[]
//   hasMore: boolean
//   total: number
// }
