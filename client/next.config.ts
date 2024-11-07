import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

if (!process.env.JWT_SECRET) {
  throw new Error(
    'JWT_SECRET is not defined in environment variables. Please add it to your .env.local file.',
  )
}

const nextConfig: NextConfig = {}

export default withNextIntl(nextConfig)
