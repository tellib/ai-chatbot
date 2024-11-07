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
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export default function LoginForm() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const t = useTranslations('auth')
  const session = useSession()
  const router = useRouter()

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

  const handleLogin = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true)
    const { username, password } = data

    try {
      const response = await axios.post('/auth/login', {
        username,
        password,
      })

      const result = response.data

      session.setSession({
        isAuthenticated: true,
        user: result.user,
        token: result.token,
      })

      toast({
        title: t('success.login'),
        description: t('success.welcomeback', {
          username: result.user.username,
        }),
      })

      router.push('/dashboard')
    } catch (error) {
      toast({
        title: t('error.login'),
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
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
          {t('login')}
        </Button>
      </form>
    </Form>
  )
}
