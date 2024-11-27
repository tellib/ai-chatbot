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
import { useState } from 'react'

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

export default function ChatPage() {
  const [selectedModel, setSelectedModel] = useState<string>(models[0].id)
  const [message, setMessage] = useState<string>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle message submission here
    console.log('Selected model:', selectedModel)
    console.log('Message:', message)
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

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <div className="mb-4 flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[200px] resize-none"
            placeholder="Type your message here..."
          />
        </div>

        <Button type="submit">Send</Button>
      </form>
    </div>
  )
}
