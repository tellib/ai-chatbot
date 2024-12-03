import { Request, Response } from 'express'
import { z } from 'zod'
import { createChat, getChats } from './service'

// validation schemas
const createChatSchema = z.object({
  content: z.string().min(1).max(4096),
})

const updateTitleSchema = z.object({
  title: z.string().min(1).max(12),
})

const chatIdSchema = z.object({
  chat_id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive('Chat ID must be a positive number')),
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

// // TODO: implement chat title update
// /**
//  * Updates the title of a chat
//  */
// export const handleUpdateTitle = async (req: Request, res: Response) => {
//   try {
//     const result = updateTitleSchema.safeParse({
//       title: req.body,
//     })
//     if (!result.success) return res.status(400).end()

//     const chat = await updateChatTitle(
//       req.session!.user!.id!,
//       parseInt(req.params.chat_id),
//       result.data.title,
//     )
//     res.json(chat)
//   } catch (error) {
//     res.status(500).end()
//   }
// }

// TODO: implement chat deletion
// /**
//  * Deletes a chat
//  */
// export const handleDeleteChat = async (req: Request, res: Response) => {
//   try {
//     const result = chatIdSchema.safeParse({ chat_id: req.params.chat_id })
//     if (!result.success) return res.status(400).end()

//     const chat_id = await deleteChat(
//       req.session!.user!.id!,
//       result.data.chat_id,
//     )
//     res.json(chat_id)
//   } catch (error) {
//     res.status(500).end()
//   }
// }
