import { Request, Response } from 'express'
import { createChat, getChats, updateChatTitle } from './service'

// TODO: fix
/**
 * Gets the chats of a user
 */
export const handleGetChats = async (req: Request, res: Response) => {
  try {
    // const page = parseInt(req.query.page as string) || 1
    // const pageSize = parseInt(req.query.pageSize as string) || 20

    // const chats = await getChats(req.session!.user!.id, page, pageSize)
    const chats = await getChats(req.session!.user!.id)

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
    const chat = await createChat(req.session!.user!.id)
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
    const newTitle = req.body.title
    if (!newTitle) {
      return res.status(400).end()
    }

    const chat = await updateChatTitle(
      req.session!.user!.id,
      parseInt(req.params.chat_id),
      newTitle,
    )
    res.json(chat)
  } catch (error) {
    res.status(500).end()
  }
}
