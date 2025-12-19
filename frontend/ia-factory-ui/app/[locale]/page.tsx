'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function HomePage() {
  const t = useTranslations('landing')

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: 'var(--bg)' }}>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: 'var(--iaf-text-primary, inherit)' }}>
            {t('hero.title')}
          </h1>
          <p className="text-xl mb-8" style={{ color: 'var(--iaf-text-secondary, #64748b)' }}>
            {t('hero.subtitle')}
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-8 py-4 bg-[#00a651] hover:bg-[#00c761] text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-green-500/25"
          >
            {t('hero.cta')}
            <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--iaf-text-primary, inherit)' }}>
          {t('features.title')}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Voice Recognition */}
          <div className="backdrop-blur-xl rounded-2xl p-8 transition-colors" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="w-14 h-14 bg-[#00a651]/20 rounded-xl flex items-center justify-center mb-6">
              <i className="fas fa-microphone text-2xl text-[#00a651]"></i>
            </div>
            <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--iaf-text-primary, inherit)' }}>
              {t('features.voice.title')}
            </h3>
            <p style={{ color: 'var(--iaf-text-secondary, #64748b)' }}>
              {t('features.voice.description')}
            </p>
          </div>

          {/* Intelligent Analysis */}
          <div className="backdrop-blur-xl rounded-2xl p-8 transition-colors" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
              <i className="fas fa-brain text-2xl text-blue-500"></i>
            </div>
            <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--iaf-text-primary, inherit)' }}>
              {t('features.analysis.title')}
            </h3>
            <p style={{ color: 'var(--iaf-text-secondary, #64748b)' }}>
              {t('features.analysis.description')}
            </p>
          </div>

          {/* Secure Export */}
          <div className="backdrop-blur-xl rounded-2xl p-8 transition-colors" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
              <i className="fas fa-shield-halved text-2xl text-purple-500"></i>
            </div>
            <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--iaf-text-primary, inherit)' }}>
              {t('features.export.title')}
            </h3>
            <p style={{ color: 'var(--iaf-text-secondary, #64748b)' }}>
              {t('features.export.description')}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
