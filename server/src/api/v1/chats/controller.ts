import { Request, Response } from 'express'
import { findChatById } from './service'

export const getChat = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  const chat = await findChatById(id)
  res.status(200).json({ message: 'Chat retrieved successfully' })
}
