'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react'
import { useTenant } from '@/lib/providers/TenantProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const { profile, tagline, focus, flag, colors } = useTenant()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loginMode, setLoginMode] = useState<'email' | 'apikey'>('email')

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // TODO: Implement actual authentication with backend
      // For now, just store a demo API key
      if (email && password) {
        localStorage.setItem('api_key', 'demo-api-key-' + Date.now())
        localStorage.setItem('user_email', email)
        router.push('/dashboard')
      } else {
        setError('Please enter both email and password')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApiKeyLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (apiKey && apiKey.length >= 16) {
        localStorage.setItem('api_key', apiKey)
        router.push('/dashboard')
      } else {
        setError('Please enter a valid API key (minimum 16 characters)')
      }
    } catch (err) {
      setError('Invalid API key. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Profile-specific styling
  const getProfileStyles = () => {
    switch (profile) {
      case 'psychologist':
        return {
          accentColor: 'text-red-400',
          borderColor: 'border-red-500/30',
          bgColor: 'bg-red-500/10',
          hoverColor: 'hover:bg-red-500/20',
        }
      case 'education':
        return {
          accentColor: 'text-green-400',
          borderColor: 'border-green-500/30',
          bgColor: 'bg-green-500/10',
          hoverColor: 'hover:bg-green-500/20',
        }
      default:
        return {
          accentColor: 'text-purple-400',
          borderColor: 'border-purple-500/30',
          bgColor: 'bg-purple-500/10',
          hoverColor: 'hover:bg-purple-500/20',
        }
    }
  }

  const styles = getProfileStyles()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Header with Flag and Tagline */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center h-20 w-20 rounded-2xl mb-4 text-5xl"
            style={{ background: colors.gradient }}
          >
            {flag}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-white mb-2"
          >
            {tagline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`text-sm ${styles.accentColor} font-medium`}
          >
            {focus}
          </motion.p>

          {/* Profile-specific Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 inline-flex items-center space-x-2 px-4 py-2 rounded-full border"
            style={{ background: colors.gradient + '20' }}
          >
            {profile === 'psychologist' && (
              <>
                <svg className="h-4 w-4 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-xs text-red-300 font-medium">
                  Swiss nLPD Compliant
                </span>
              </>
            )}
            {profile === 'education' && (
              <>
                <svg className="h-4 w-4 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-xs text-green-300 font-medium">
                  Bilingual FR/AR Education
                </span>
              </>
            )}
            {profile === 'general' && (
              <>
                <svg className="h-4 w-4 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-purple-300 font-medium">
                  110+ Cultures
                </span>
              </>
            )}
          </motion.div>
        </div>

        {/* Login Card */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white text-center">Welcome Back</CardTitle>
            <CardDescription className="text-slate-400 text-center">
              Sign in to access your AI assistant
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Toggle Login Mode */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setLoginMode('email')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  loginMode === 'email'
                    ? `${styles.bgColor} ${styles.accentColor} border ${styles.borderColor}`
                    : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:bg-slate-800'
                }`}
              >
                Email & Password
              </button>
              <button
                onClick={() => setLoginMode('apikey')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  loginMode === 'apikey'
                    ? `${styles.bgColor} ${styles.accentColor} border ${styles.borderColor}`
                    : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:bg-slate-800'
                }`}
              >
                API Key
              </button>
            </div>

            {/* Email/Password Login Form */}
            {loginMode === 'email' && (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                      style={{ focusRing: colors.primary }}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                  >
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <span className="text-sm text-red-300">{error}</span>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-6 text-white font-medium rounded-lg transition-all"
                  style={{ background: colors.gradient }}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Signing In...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <LogIn className="h-5 w-5 mr-2" />
                      Sign In
                    </span>
                  )}
                </Button>
              </form>
            )}

            {/* API Key Login Form */}
            {loginMode === 'apikey' && (
              <form onSubmit={handleApiKeyLogin} className="space-y-4">
                <div>
                  <label htmlFor="apikey" className="block text-sm font-medium text-slate-300 mb-2">
                    API Key
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <input
                      id="apikey"
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all font-mono text-sm"
                      placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      required
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Enter your API key from the dashboard or scratch card
                  </p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                  >
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <span className="text-sm text-red-300">{error}</span>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-6 text-white font-medium rounded-lg transition-all"
                  style={{ background: colors.gradient }}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Validating...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <LogIn className="h-5 w-5 mr-2" />
                      Access Dashboard
                    </span>
                  )}
                </Button>
              </form>
            )}

            {/* Footer Links */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-xs text-slate-500">
                {profile === 'psychologist' && 'Protected by Swiss nLPD privacy regulations'}
                {profile === 'education' && 'Supporting Algerian schools and universities'}
                {profile === 'general' && 'Multicultural intelligence for Geneva'}
              </p>
              <div className="flex justify-center space-x-4 text-xs">
                <a href="#" className={`${styles.accentColor} ${styles.hoverColor} transition-colors`}>
                  Need an API Key?
                </a>
                <span className="text-slate-700">•</span>
                <a href="#" className={`${styles.accentColor} ${styles.hoverColor} transition-colors`}>
                  Support
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile-specific Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border ${styles.borderColor} ${styles.bgColor}`}>
            {profile === 'psychologist' && (
              <p className="text-xs text-slate-400">
                🇨🇭 Geneva Psychologists • Clinical Precision • Full Privacy
              </p>
            )}
            {profile === 'education' && (
              <p className="text-xs text-slate-400">
                🇩🇿 Algerian Education • Innovation • Bilingual Support
              </p>
            )}
            {profile === 'general' && (
              <p className="text-xs text-slate-400">
                🌍 Geneva Digital Butler • 110+ Cultures • Universal Intelligence
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
