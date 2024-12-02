import { getDb } from '@/config/database'

/**
 * Gets the messages of a chat
 */
export async function getMessages(user_id: number, chat_id: number) {
  try {
    const prisma = getDb()
    const chat = await prisma.chat.findUnique({
      where: { id: chat_id, user_id },
      select: {
        messages: {
          orderBy: {
            timestamp: 'asc',
          },
        },
      },
    })
    return chat?.messages
  } catch (error) {
    throw error
  }
}

/**
 * Gets the context of a chat for the model
 */
export async function getMessagesContext(user_id: number, chat_id: number) {
  try {
    const prisma = getDb()
    const chat = await prisma.chat.findUnique({
      where: { id: chat_id, user_id },
      select: {
        messages: {
          orderBy: {
            timestamp: 'asc',
          },
          select: {
            content: true,
            role: true,
          },
        },
      },
    })
    return chat?.messages ?? []
  } catch (error) {
    console.error(error)
    return []
  }
}

/**
 * Creates a new message in a chat
 */
export async function createMessage(
  user_id: number,
  chat_id: number,
  content: string,
  role: 'user' | 'assistant',
) {
  try {
    const prisma = getDb()
    const chat = await prisma.chat.findUnique({
      where: { id: chat_id, user_id },
    })

    if (!chat) {
      throw new Error()
    }

    const message = await prisma.message.create({
      data: {
        chat_id,
        content,
        role,
      },
    })
    return message
  } catch (error) {
    console.error(error)
    return null
  }
}
