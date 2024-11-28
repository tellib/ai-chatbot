'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useEffect, useState } from 'react'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
}

interface Model {
  id: string
  name: string
}

const models: Model[] = [
  { id: 'Meta-Llama-3-8B-Instruct.Q4_0.gguf', name: 'Meta Llama 3 8B' },
  {
    id: 'Nous-Hermes-2-Mistral-7B-DPO.Q4_0.gguf',
    name: 'Nous Hermes 2 Mistral',
  },
  { id: 'Phi-3-mini-4k-instruct.Q4_0.gguf', name: 'Phi-3 Mini' },
  { id: 'orca-mini-3b-gguf2-q4_0.gguf', name: 'Orca Mini 3B' },
  { id: 'gpt4all-13b-snoozy-q4_0.gguf', name: 'GPT4All 13B Snoozy' },
]

// Test messages for demonstration
const testMessages: Message[] = [
  {
    id: '1',
    content: 'Hello! Can you help me with a coding problem?',
    role: 'user',
    timestamp: '2024-03-15T10:00:00Z',
  },
  {
    id: '2',
    content:
      "Of course! I'd be happy to help. Please describe the problem you're facing.",
    role: 'assistant',
    timestamp: '2024-03-15T10:00:05Z',
  },
  {
    id: '3',
    content:
      "I'm trying to implement a React component that handles form validation. What's the best approach?",
    role: 'user',
    timestamp: '2024-03-15T10:00:30Z',
  },
  {
    id: '4',
    content:
      'For form validation in React, I recommend using a form management library like React Hook Form or Formik. These libraries provide excellent validation capabilities and good performance. Would you like me to show you an example implementation?',
    role: 'assistant',
    timestamp: '2024-03-15T10:00:45Z',
  },
]

export default function ChatPage({ params }: { params: { id: string } }) {
  const [selectedModel, setSelectedModel] = useState<string>(models[0].id)
  const [message, setMessage] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])

  // Load test messages on component mount
  useEffect(() => {
    setMessages(testMessages)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, newMessage])
    setMessage('')

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `This is a simulated response for chat ${params.id}. I'm here to help you with your questions!`,
        role: 'assistant',
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  return (
    <div className="flex h-screen flex-col p-4">
      <div className="mb-4 w-[200px]">
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger>
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4 flex-1 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-lg p-4 ${
              msg.role === 'user'
                ? 'ml-12 bg-primary text-primary-foreground'
                : 'mr-12 bg-muted'
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="resize-none"
          placeholder="Type your message here..."
          rows={1}
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  )
}
