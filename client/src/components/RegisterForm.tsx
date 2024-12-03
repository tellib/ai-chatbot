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
import { useSession } from '@/hooks/useSession'
import { createLengthValidator } from '@/lib/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export function RegisterForm() {
  const [loading, setLoading] = useState(false)
  const t = useTranslations('auth')
  const { register } = useSession()

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

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true)
    await register(data.username, data.password)
    setLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
