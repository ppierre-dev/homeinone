import { auth } from '@/lib/auth'
import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import type { NextAuthRequest } from 'next-auth'
import { routing } from '@/i18n/routing'

const intlMiddleware = createMiddleware(routing)

export default auth((req: NextAuthRequest) => {
  const isAuthenticated = !!req.auth

  if (!isAuthenticated) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return intlMiddleware(req)
})

export const config = {
  // Protect all routes except auth pages, API auth routes and static assets
  matcher: [
    '/((?!login|register|api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
