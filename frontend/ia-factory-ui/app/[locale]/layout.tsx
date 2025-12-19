import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import '../globals.css'
import '@/styles/iafactory-components.css'
import { Toaster } from '@/components/ui/toaster'
import { TenantProvider } from '@/lib/providers/TenantProvider'
import { DynamicFavicon } from '@/components/branding/DynamicFavicon'
import { Header, Footer, Sidebar, HelpChatbot } from '@/components/layout'
import { locales } from '@/i18n'

const inter = Inter({ subsets: ['latin', 'latin-ext'] })

export const metadata: Metadata = {
  title: 'IA Factory - Geneva Digital Butler',
  description: 'AI-powered voice assistant with 110+ nationalities support',
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Validate that the locale is supported
  if (!locales.includes(locale as any)) {
    notFound()
  }

  // Fetch messages for the current locale
  const messages = await getMessages()

  // Determine text direction based on locale
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        {/* FontAwesome for icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <NextIntlClientProvider messages={messages}>
          <TenantProvider>
            <DynamicFavicon />
            <Sidebar />
            <Header />
            <main className="flex-1 pt-[70px] pl-[60px]">
              {children}
            </main>
            <Footer />
            <HelpChatbot />
            <Toaster />
          </TenantProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
