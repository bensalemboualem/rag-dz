import { getRequestConfig } from 'next-intl/server'

export const locales = ['fr', 'ar', 'en'] as const
export const defaultLocale = 'fr'
export type Locale = (typeof locales)[number]

export default getRequestConfig(async ({ requestLocale }) => {
  // Get locale from request or use default
  let locale = await requestLocale

  // Validate locale
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
    timeZone: locale === 'ar' ? 'Africa/Algiers' : 'Europe/Zurich',
  }
})
