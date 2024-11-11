'use client'

import { Button } from '@/components/ui/button'
import { FloatingLabelInput } from '@/components/ui/floating-label-input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { useSession } from '@/hooks/useSession'
import axios from '@/lib/axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { redirect } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export default function SignupForm() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const t = useTranslations('auth')
  const { session, refreshSession } = useSession()

  if (session?.user) {
    redirect('/dashboard')
  }

  const FormSchema = z.object({
    username: z.string().min(2, {
      message: t('requirements.username'),
    }),
    password: z.string().min(6, {
      message: t('requirements.password'),
    }),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const handleSignup = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true)
    const { username, password } = data

    try {
      const response = await axios.post('/auth/signup', {
        username,
        password,
      })
      if (response.status === 201) {
        await refreshSession()
      } else {
        throw new Error()
      }
    } catch (error) {
      toast({
        title: t('error.signup'),
        variant: 'destructive',
      })
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignup)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FloatingLabelInput
                  type="text"
                  {...field}
                  id="username"
                  label={t('username')}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FloatingLabelInput
                  type="password"
                  {...field}
                  id="password"
                  label={t('password')}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {t('signup')}
        </Button>
      </form>
    </Form>
  )
}
