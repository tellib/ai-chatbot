import { getDb } from '@/config/database'

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

export async function createChat(user_id: number) {
  const prisma = getDb()
  return prisma.chat.create({
    data: {
      user_id,
      title: 'New Chat',
    },
  })
}

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
