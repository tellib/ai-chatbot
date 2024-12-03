import { getDb } from '@/config/database'

/**
 * Gets the messages of a chat
 * @param user_id The id of the user
 * @param chat_id The id of the chat
 * @returns The messages of the chat
 * @throws Error if the messages are not found
 */
export async function getMessages(user_id: number, chat_id: number) {
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

  if (!chat) {
    throw new Error('Messages not found')
  }

  return chat.messages
}

/**
 * Gets the context of a chat for the model
 * @param user_id The id of the user
 * @param chat_id The id of the chat
 * @returns The context of the chat
 * @throws Error if the chat is not found
 */
export async function getMessagesContext(user_id: number, chat_id: number) {
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

  if (!chat) {
    throw new Error('No messages found')
  }

  return chat.messages
}

/**
 * Creates a new message in a chat
 * @param user_id The id of the user
 * @param chat_id The id of the chat
 * @param content The content of the message
 * @param role The role of the message
 * @returns The created message
 * @throws Error if the message creation fails
 */
export async function createMessage(
  user_id: number,
  chat_id: number,
  content: string,
  role: 'user' | 'assistant',
) {
  const prisma = getDb()
  const chat = await prisma.chat.findUnique({
    where: { id: chat_id, user_id },
  })

  if (!chat) {
    throw new Error('No chat found')
  }

  const message = await prisma.message.create({
    data: {
      chat_id,
      content,
      role,
    },
  })

  if (!message) {
    throw new Error('Failed to create message')
  }

  return message
}
