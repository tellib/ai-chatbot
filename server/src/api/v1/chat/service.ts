import { getDb } from '@/config/database'

/**
 * Finds a chat by its id
 * @param user_id The id of the user
 * @param chat_id The id of the chat
 * @returns The chat object
 */
export async function findChatById(user_id: number, chat_id: number) {
  const prisma = getDb()
  const chat = await prisma.chat.findFirst({
    where: {
      id: chat_id,
      user_id,
    },
    include: {
      messages: {
        orderBy: {
          timestamp: 'desc',
        },
        take: 50,
      },
    },
  })

  if (!chat) {
    throw new Error('Chat not found')
  }

  return chat
}

/**
 * Creates a new chat
 * @param user_id The id of the user
 * @returns The created chat object
 */
export async function createChat(user_id: number) {
  const prisma = getDb()
  return prisma.chat.create({
    data: {
      user_id,
      title: 'New Chat',
    },
  })
}

/**
 * Updates the title of a chat
 * @param user_id The id of the user
 * @param chat_id The id of the chat
 * @param title The new title of the chat
 * @returns The updated chat object
 */
export async function updateChatTitle(
  user_id: number,
  chat_id: number,
  title: string,
) {
  const prisma = getDb()
  return prisma.chat.update({
    where: { id: chat_id, user_id },
    data: { title },
  })
}

/**
 * Gets the chats of a user
 * @param user_id The id of the user
 * @param page The page number
 * @param pageSize The number of chats per page
 * @returns The chats and total number of chats
 */
export async function getChats(user_id: number, page = 1, pageSize = 20) {
  const prisma = getDb()
  const skip = (page - 1) * pageSize

  const [chats, total] = await Promise.all([
    prisma.chat.findMany({
      where: { user_id },
      orderBy: { timestamp: 'desc' },
      skip,
      take: pageSize,
      include: {
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
    }),
    prisma.chat.count({
      where: { user_id },
    }),
  ])

  return {
    chats,
    total,
    hasMore: skip + chats.length < total,
  }
}

/**
 * Gets the recent chats of a user
 * @param user_id The id of the user
 * @returns The recent chats
 */
export async function getRecentChats(user_id: number) {
  const prisma = getDb()

  const recentChats = await prisma.chat.findMany({
    where: { user_id },
    orderBy: { timestamp: 'desc' },
    take: 10,
    select: {
      id: true,
      title: true,
    },
  })
  return recentChats
}
