import { Request, Response } from 'express'
import { z } from 'zod'
import { createChat, getChats, updateChatTitle } from './service'

// validation schemas
const createChatSchema = z.object({
  content: z.string().min(1).max(4096),
})

const updateTitleSchema = z.object({
  title: z.string().min(1).max(12),
})

/**
 * Gets the chats of a user
 */
export const handleGetChats = async (req: Request, res: Response) => {
  try {
    const chats = await getChats(req.session!.user!.id!)
    res.json(chats)
  } catch (error) {
    res.status(500).end()
  }
}

/**
 * Creates a new chat
 */
export const handleCreateChat = async (req: Request, res: Response) => {
  try {
    const result = createChatSchema.safeParse(req.body)
    if (!result.success) return res.status(400).end()

    const chat = await createChat(req.session!.user!.id!, result.data.content)
    res.json(chat)
  } catch (error) {
    res.status(500).end()
  }
}

/**
 * Updates the title of a chat
 */
export const handleUpdateTitle = async (req: Request, res: Response) => {
  try {
    const result = updateTitleSchema.safeParse(req.body)
    if (!result.success) return res.status(400).end()

    const chat = await updateChatTitle(
      req.session!.user!.id!,
      parseInt(req.params.chat_id),
      result.data.title,
    )
    res.json(chat)
  } catch (error) {
    res.status(500).end()
  }
}
