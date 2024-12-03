import { model } from '@/config/gpt4all'
import { Request, Response } from 'express'
import { createCompletionStream } from 'gpt4all'
import { z } from 'zod'
import { createMessage, getMessages, getMessagesContext } from './service'

// validation schemas
const chatIdSchema = z.object({
  chat_id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive('Chat ID must be a positive number')),
})

const newMessageSchema = z.object({
  chat_id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive()),
  body: z.object({
    content: z.string().min(1),
  }),
})

/**
 * Gets all the messages of a chat
 */
export const handleGetMessages = async (req: Request, res: Response) => {
  try {
    const result = chatIdSchema.safeParse({ chat_id: req.params.chat_id })

    if (!result.success) {
      return res.status(400).end()
    }

    const messages = await getMessages(
      req.session!.user!.id!,
      result.data.chat_id,
    )
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
    const result = newMessageSchema.safeParse({
      chat_id: req.params.chat_id,
      body: req.body,
    })

    if (!result.success) {
      return res.status(400).end()
    }

    const message = await createMessage(
      req.session!.user!.id!,
      result.data.chat_id,
      result.data.body.content,
      'user',
    )
    res.json(message)
  } catch (error) {
    res.status(500).end()
  }
}

/**
 * Gets the model's stream of messages for a chat
 */
export const handleGetStream = async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  // check if the connection is closed
  let isConnectionClosed = false

  // if the connection is closed by the client, end the response
  req.on('close', () => {
    isConnectionClosed = true
    console.log('Stream closed')
    return res.end()
  })

  // validate the chat id
  const result = chatIdSchema.safeParse({ chat_id: req.params.chat_id })
  if (!result.success) {
    res.write(
      `event: error\ndata: ${JSON.stringify({ error: 'Invalid chat ID' })}\n\n`,
    )
    return res.end()
  }

  try {
    // get the context of the chat
    const context = await getMessagesContext(
      req.session!.user!.id!,
      result.data.chat_id,
    )

    // create a new chat session
    const chat = await model.createChatSession({
      temperature: 0.8,
      systemPrompt:
        '### System:\nYou are an advanced AI assistant named "TellBot". You are a model called "Llama 3 Instruct" created by Meta.The website you are on was created by Berk Tellioglu, a graduate student at Boston University pursuing a MS in Computer Science.\n\n',
    })

    // create a stream of messages
    const stream = createCompletionStream(chat, context)

    // create a variable to store the content of the message
    let content = ''

    // on each chunk of the stream, add it to the content and send it to the client
    stream.tokens.on('data', (chunk) => {
      if (isConnectionClosed) return
      content += chunk
      res.write(`event: chunk\ndata: ${JSON.stringify({ chunk })}\n\n`)
    })

    // wait for the stream to finish
    await stream.result

    // only save message and send done event if connection wasn't closed
    if (!isConnectionClosed) {
      const message = await createMessage(
        req.session!.user!.id!,
        result.data.chat_id,
        content,
        'assistant',
      )

      // send the done event to the client, with the message created in the database
      res.write(`event: done\ndata: ${JSON.stringify({ message })}\n\n`)
    }

    res.end()
  } catch (error) {
    console.error('Stream error', error)
    if (!isConnectionClosed) {
      res.write(
        `event: error\ndata: ${JSON.stringify({ error: 'Failed to process stream' })}\n\n`,
      )
    }
    res.end()
  }
}
