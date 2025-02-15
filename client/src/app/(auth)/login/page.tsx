import { LoginForm } from '@/components/LoginForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export default async function LoginPage() {
  const t = await getTranslations('auth')

  return (
    <main className="m-auto">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>{t('login')}</CardTitle>
          <CardDescription>
            <Link
              className="underline-offset-4 hover:underline"
              href="/register"
            >
              {t('toggle.signup')}
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  )
}
