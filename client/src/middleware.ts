import { NextRequest, NextResponse } from 'next/server'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export default async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }
  NextResponse.next()
}

export const config = {
  matcher: ['/dashboard', '/settings', '/logout'],
}
