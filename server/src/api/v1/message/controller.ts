import { Request, Response } from 'express'
import {
  createMessage as createNewMessage,
  getChatMessages,
  getResponseFromLLM,
} from './service'

export const handleGetMessages = async (req: Request, res: Response) => {
  try {
    const chat_id = parseInt(req.params.chat_id)
    const page = parseInt(req.query.page as string) || 1
    const pageSize = parseInt(req.query.pageSize as string) || 50

    const messages = await getChatMessages(chat_id, page, pageSize)
    res.json({ success: true, data: messages })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch messages' })
  }
}

export const handleNewMessage = async (req: Request, res: Response) => {
  const chat_id = parseInt(req.params.chat_id)
  const { message } = req.body

  if (!message?.trim()) {
    return res
      .status(400)
      .json({ success: false, error: 'Message is required' })
  }

  try {
    // Add user message to db
    const userMessage = await createNewMessage(chat_id, message, 'USER')

    try {
      // Get response from LLM
      const response = await getResponseFromLLM(message)

      // Add bot response to db
      const botMessage = await createNewMessage(chat_id, response, 'BOT')

      res.json({
        success: true,
        data: {
          userMessage,
          botMessage,
        },
      })
    } catch (llmError) {
      // If LLM fails, we still want to save the user message
      console.error('LLM Error:', llmError)

      // Create a fallback bot message
      const fallbackResponse =
        "I apologize, but I'm having trouble processing your request at the moment. Please try again later."
      const botMessage = await createNewMessage(
        chat_id,
        fallbackResponse,
        'BOT',
      )

      res.json({
        success: true,
        data: {
          userMessage,
          botMessage,
        },
      })
    }
  } catch (error) {
    console.error('Message handling error:', error)
    res.status(500).json({ success: false, error: 'Failed to process message' })
  }
}
