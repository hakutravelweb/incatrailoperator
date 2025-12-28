import { NextRequest, NextResponse } from 'next/server'
import { getLocale } from 'next-intl/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'
import { PROTECTED_ROUTES } from './lib/constants'
import { getSession } from './lib/session'

export default async function proxy(request: NextRequest) {
  try {
    const locale = await getLocale()
    const pathname = request.nextUrl.pathname
    const protectedRoutes = PROTECTED_ROUTES.map(
      (protectedRoute) => `/${locale}/${protectedRoute}`,
    )
    const isProtectedRoute = protectedRoutes.includes(pathname)

    const session = await getSession()

    if (isProtectedRoute && !session) {
      return NextResponse.redirect(new URL('/', request.nextUrl))
    }

    const i18nRouting = createMiddleware(routing)
    const response = i18nRouting(request)

    return response
  } catch {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }
}

export const config = {
  matcher: ['/', '/(es|en)/:path*'],
}
