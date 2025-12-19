import createMiddleware from 'next-intl/middleware'
import { locales } from './i18n'
import { NextRequest } from 'next/server'

// Custom middleware to set default locale based on domain
export default function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''

  // Determine default locale based on domain
  let defaultLocale = 'fr' // Default for Geneva and Switzerland

  if (hostname.includes('iafactoryalgeria.com') || hostname.includes('.dz')) {
    defaultLocale = 'ar' // Default to Arabic for Algeria
  }

  const handleI18nRouting = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'as-needed',
    localeDetection: true,
  })

  return handleI18nRouting(request)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
