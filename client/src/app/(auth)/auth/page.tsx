import LoginForm from '@/components/LoginForm'
import SignupForm from '@/components/SignupForm'
import { ThemeToggle } from '@/components/ThemeToggle'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function AuthPage(props: { searchParams: SearchParams }) {
  const t = await getTranslations('auth')
  const searchParams = await props.searchParams
  const signup = searchParams.signup

  return (
    <main className="mx-auto my-auto gap-8">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>{t(signup ? 'signup' : 'login')}</CardTitle>
          <CardDescription>
            <Link
              className="underline-offset-4 hover:underline"
              href={`/auth${signup ? '' : '?signup=1'}`}
            >
              {t(signup ? 'toggle.login' : 'toggle.signup')}
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>{signup ? <SignupForm /> : <LoginForm />}</CardContent>
      </Card>
      <ThemeToggle />
    </main>
  )
}
