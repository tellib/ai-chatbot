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
import { createLengthValidator } from '@/lib/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { redirect } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type AuthFormProps = {
  type: 'login' | 'signup'
}

export function AuthForm({ type }: AuthFormProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const t = useTranslations('auth')
  const { session, refreshSession } = useSession()

  if (session?.user) {
    redirect('/dashboard')
  }

  const FormSchema = z.object({
    username: createLengthValidator(2, 50, t('requirements.username')),
    password: createLengthValidator(6, 50, t('requirements.password')),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true)
    const { username, password } = data
    setTimeout(async () => {
      try {
        const response = await axios.post(`/auth/${type}`, {
          username,
          password,
        })
        if (response.status === (type === 'signup' ? 201 : 200)) {
          await refreshSession()
          toast({
            title: t(`success.${type}`),
            duration: 1000,
          })
        } else {
          throw new Error()
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast({
          title: t(`error.${type}`),
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }, 1000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
          {t(type)}
        </Button>
      </form>
    </Form>
  )
}
