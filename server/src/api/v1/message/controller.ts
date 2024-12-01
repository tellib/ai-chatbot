import { model } from '@/config/gpt4all'
import { Request, Response } from 'express'
import { createCompletionStream } from 'gpt4all'
import { createMessage, getContext, getMessages } from './service'

/**
 * Gets all the messages of a chat
 */
export const handleGetMessages = async (req: Request, res: Response) => {
  try {
    const chat_id = parseInt(req.params.chat_id)

    const messages = await getMessages(chat_id)
    res.json(messages)
  } catch (error) {
    res.status(500).end()
  }
}

/**
 * Creates a new message
 */
export const handleNewMessage = async (req: Request, res: Response) => {
  try {
    const chat_id = parseInt(req.params.chat_id)
    const { content } = req.body

    const message = await createMessage(chat_id, content, 'user')
    res.json(message)
  } catch (error) {
    res.status(500).end()
  }
}

/**
 * Gets a stream of messages
 */
export const handleGetStream = async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const chat_id = parseInt(req.params.chat_id)
  console.log('chat_id', chat_id)

  if (isNaN(chat_id) || chat_id <= 0) {
    res.write(
      `event: error\ndata: ${JSON.stringify({ error: 'Invalid chat ID' })}\n\n`,
    )
    return res.end()
  }

  try {
    const context = await getContext(chat_id)

    const chat = await model.createChatSession({
      temperature: 0.8,
      systemPrompt: '### System:\nYou are an advanced AI assistant.\n\n',
    })

    const stream = createCompletionStream(chat, context)

    let content = ''
    stream.tokens.on('data', (chunk) => {
      content += chunk
      console.log('chunk', chunk)
      res.write(`event: chunk\ndata: ${JSON.stringify({ chunk })}\n\n`)
    })

    await stream.result
    await createMessage(chat_id, content, 'assistant')

    // Send done event
    res.write('event: done\ndata: {}\n\n')

    res.end()
  } catch (error) {
    console.error('Stream error:', error)
    res.write(
      `event: error\ndata: ${JSON.stringify({ error: 'Failed to process stream' })}\n\n`,
    )
    res.end()
  }
}

// //*
// /* Gets paginated messages
//  */
// export const handleGetPaginatedMessages = async (
//   req: Request,
//   res: Response,
// ) => {
//   try {
//     const chat_id = parseInt(req.params.chat_id)
//     const page = parseInt(req.query.page as string) || 1
//     const pageSize = parseInt(req.query.pageSize as string) || 50

//     const messages = await getPaginatedMessages(chat_id, page, pageSize)
//     res.json({ success: true, data: messages })
//   } catch (error) {
//     res.status(500).json({ success: false, error: 'Failed to fetch messages' })
//   }
// }
