import { useMessages } from '@/hooks/useMessages'
import { SendHorizontal } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'

export function MessagesInput() {
  const [input, setInput] = useState('')
  const { createMessage, loading, messages } = useMessages()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    textareaRef?.current?.focus()
  }, [])

  const onSubmit = async () => {
    if (!input.trim() || loading) return
    await createMessage(input.trim())
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  if (!messages) return null

  return (
    <div className="flex gap-4 border-t border-foreground/10 bg-background/50 p-4">
      <Textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="resize-none"
      />
      <Button className="h-full w-16" onClick={onSubmit} disabled={loading}>
        <SendHorizontal />
      </Button>
    </div>
  )
}
