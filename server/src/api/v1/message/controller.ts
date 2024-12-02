import { model } from '@/config/gpt4all'
import { Request, Response } from 'express'
import { CompletionInput, createCompletionStream } from 'gpt4all'
import { z } from 'zod'
import { createMessage, getMessages, getMessagesContext } from './service'

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
      req.session!.user!.id,
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
      req.session!.user!.id,
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

  const result = chatIdSchema.safeParse({ chat_id: req.params.chat_id })

  if (!result.success) {
    res.write(
      `event: error\ndata: ${JSON.stringify({ error: 'Invalid chat ID' })}\n\n`,
    )
    return res.end()
  }

  try {
    const context = await getMessagesContext(
      req.session!.user!.id,
      result.data.chat_id,
    )

    const chat = await model.createChatSession({
      temperature: 0.8,
      systemPrompt: '### System:\nYou are an advanced AI assistant.\n\n',
    })

    const stream = createCompletionStream(chat, context as CompletionInput)

    let content = ''
    stream.tokens.on('data', (chunk) => {
      content += chunk
      res.write(`event: chunk\ndata: ${JSON.stringify({ chunk })}\n\n`)
    })

    await stream.result
    const message = await createMessage(
      req.session!.user!.id,
      result.data.chat_id,
      content,
      'assistant',
    )

    res.write(`event: done\ndata: ${JSON.stringify({ message })}\n\n`)
    res.end()
  } catch (error) {
    console.error('Stream error:', error)
    res.write(
      `event: error\ndata: ${JSON.stringify({ error: 'Failed to process stream' })}\n\n`,
    )
    res.end()
  }
}
