import { getDb } from '@/config/database'
import { model } from '@/config/gpt4all'
import { createCompletion } from 'gpt4all'

/**
 * Creates a new chat with an initial message
 * @param user_id The id of the user
 * @param content The content of the initial message
 * @returns The created chat object with its first message
 */
export async function createChat(user_id: number, content: string) {
  try {
    const title = await generateChatTitle(content)
    const prisma = getDb()
    const chat = await prisma.chat.create({
      data: {
        user_id,
        title,
        messages: {
          create: {
            content,
            role: 'user',
          },
        },
      },
    })
    return chat
  } catch (error) {
    throw error
  }
}

export async function generateChatTitle(content: string) {
  try {
    const chat = await model.createChatSession({
      temperature: 0.8,
      systemPrompt:
        '### System:\nYou are an advanced AI assistant. Create a short title for the chat based on the following question or conversation. It should be no more than 6 words and be in plain text format. It should not include any markdown formatting. Do not include any other text than the title. Do not include any punctuation.\n\n',
    })

    const response = await createCompletion(chat, content)
    return response.choices[0].message.content
  } catch (error) {
    throw error
  }
}

/**
 * Gets the chats of a user
 * @param user_id The id of the user
 * @returns The found chats
 */
export async function getChats(user_id: number) {
  try {
    const prisma = getDb()
    const chats = await prisma.chat.findMany({
      where: { user_id },
      orderBy: { timestamp: 'desc' },
    })
    return chats
  } catch (error) {
    throw error
  }
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
  try {
    const prisma = getDb()
    const chat = await prisma.chat.update({
      where: { id: chat_id, user_id },
      data: { title },
    })
    return chat
  } catch (error) {
    throw error
  }
}
