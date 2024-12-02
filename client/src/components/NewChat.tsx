'use client'

import { useToast } from '@/hooks/use-toast'
import { useChats } from '@/hooks/useChats'
import { createLengthValidator } from '@/lib/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form'
import { Textarea } from './ui/textarea'

export function NewChat() {
  const { createChat } = useChats()

  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const formSchema = z.object({
    content: createLengthValidator(1, 4096, 'Message is required'),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  })

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      form.handleSubmit(onSubmit)()
    }
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      await createChat(data.content).then((chat) => {
        router.push(`/chat/${chat.id}`)
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create chat',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>What can I help with?</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea {...field} onKeyDown={handleKeyDown} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={loading}>
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
