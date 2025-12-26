import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

export default async function proxy(request: NextRequest) {
  try {
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
