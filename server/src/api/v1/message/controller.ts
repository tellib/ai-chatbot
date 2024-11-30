import { getDb } from '@/config/database'
import { model } from '@/config/gpt4all'
import { Request, Response } from 'express'
import { createCompletionStream } from 'gpt4all'
import { createMessage, getChatMessages } from './service'

/**
 * Gets the messages of a chat
 */
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

/**
 * Creates a new message
 */
export const handleNewMessage = async (req: Request, res: Response) => {
  const chat_id = parseInt(req.params.chat_id)
  const { message } = req.body

  const newMessage = await createMessage(chat_id, message, 'user')
  res.json({ success: true, data: newMessage })
}

/**
 * Gets a stream of messages
 */
export const handleGetStream = async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const chat_id = parseInt(req.params.chat_id)

  const sendSSE = (data: { data: any } | { error: string }) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  if (isNaN(chat_id) || chat_id <= 0) {
    sendSSE({ error: 'Invalid chat ID' })
    return res.end()
  }

  try {
    const prisma = getDb()
    const previousMessages = await prisma.message.findMany({
      where: {
        chat_id: chat_id,
      },
      orderBy: {
        timestamp: 'asc',
      },
      select: {
        content: true,
        role: true,
      },
    })

    const chat = await model.createChatSession({
      temperature: 0.8,
      systemPrompt: '### System:\nYou are an advanced AI assistant.\n\n',
    })

    const stream = createCompletionStream(chat, previousMessages)
    let fullResponse = ''

    stream.tokens.on('data', (chunk) => {
      fullResponse += chunk
      sendSSE({
        data: { chunk },
      })
    })

    await stream.result
    await createMessage(chat_id, fullResponse, 'assistant')

    // Send done event
    res.write('event: done\ndata: {}\n\n')

    res.end()
  } catch (error) {
    console.error('Stream error:', error)
    sendSSE({ error: 'Failed to process stream' })
    res.end()
  }
}
