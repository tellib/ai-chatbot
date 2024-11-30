import { Request, Response } from 'express'
import {
  createChat,
  findChatById,
  getChats,
  getRecentChats,
  updateChatTitle,
} from './service'

/**
 * Gets a chat by its id
 */
export const handleGetChat = async (req: Request, res: Response) => {
  try {
    const chat = await findChatById(
      req.session!.user!.id,
      parseInt(req.params.chat_id),
    )
    res.json({ success: true, data: chat })
  } catch (error) {
    if (error instanceof Error && error.message === 'Chat not found') {
      return res.status(404).json({ success: false, error: 'Chat not found' })
    }
    res.status(500).json({ success: false, error: 'Failed to fetch chat' })
  }
}

/**
 * Gets the recent chats of a user
 */
export const handleGetRecentChats = async (req: Request, res: Response) => {
  try {
    const chats = await getRecentChats(req.session!.user!.id)
    res.json({ success: true, data: chats })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch chats' })
  }
}

/**
 * Gets the chats of a user
 */
export const handleGetChats = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const pageSize = parseInt(req.query.pageSize as string) || 20

    const chats = await getChats(req.session!.user!.id, page, pageSize)
    res.json({ success: true, data: chats })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch chats' })
  }
}

/**
 * Creates a new chat
 */
export const handleCreateChat = async (req: Request, res: Response) => {
  try {
    const chat = await createChat(req.session!.user!.id)
    res.json({ success: true, data: chat })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create chat' })
  }
}

/**
 * Updates the title of a chat
 */
export const handleUpdateTitle = async (req: Request, res: Response) => {
  try {
    const { title } = req.body
    if (!title) {
      return res
        .status(400)
        .json({ success: false, error: 'Title is required' })
    }

    const chat = await updateChatTitle(
      req.session!.user!.id,
      parseInt(req.params.chat_id),
      title,
    )
    res.json({ success: true, data: chat })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: 'Failed to update chat title' })
  }
}
