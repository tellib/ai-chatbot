import { RegisterForm } from '@/components/RegisterForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export default async function RegisterPage() {
  const t = await getTranslations('auth')

  return (
    <main className="m-auto">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>{t('signup')}</CardTitle>
          <CardDescription>
            <Link className="underline-offset-4 hover:underline" href="/login">
              {t('toggle.login')}
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </main>
  )
}
