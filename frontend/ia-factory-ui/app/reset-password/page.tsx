'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { useTenant } from '@/lib/providers/TenantProvider'
import axios from 'axios'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { flag, tagline } = useTenant()

  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (tokenParam) {
      setToken(tokenParam)
      verifyToken(tokenParam)
    } else {
      setVerifying(false)
      toast({
        title: 'Erreur',
        description: 'Token manquant',
        variant: 'destructive',
      })
    }
  }, [searchParams])

  const verifyToken = async (token: string) => {
    try {
      const response = await axios.get(`/api/auth/verify-reset-token/${token}`)
      if (response.data.valid) {
        setTokenValid(true)
        setEmail(response.data.email)
      }
    } catch (error: any) {
      toast({
        title: 'Token invalide',
        description: error.response?.data?.detail || 'Ce lien de réinitialisation est invalide ou a expiré.',
        variant: 'destructive',
      })
    } finally {
      setVerifying(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Erreur',
        description: 'Les mots de passe ne correspondent pas',
        variant: 'destructive',
      })
      return
    }

    if (newPassword.length < 8) {
      toast({
        title: 'Erreur',
        description: 'Le mot de passe doit contenir au moins 8 caractères',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const response = await axios.post('/api/auth/reset-password', {
        token,
        new_password: newPassword,
      })

      toast({
        title: 'Succès',
        description: response.data.message || 'Votre mot de passe a été réinitialisé avec succès.',
      })

      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.response?.data?.detail || 'Une erreur est survenue',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">{flag}</div>
          <p className="text-slate-400">Vérification du lien...</p>
        </div>
      </div>
    )
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">{flag}</div>
            <h1 className="text-2xl font-bold text-white mb-4">Lien invalide</h1>
            <p className="text-slate-400 mb-6">
              Ce lien de réinitialisation est invalide ou a expiré. Veuillez demander un nouveau lien.
            </p>
            <Button
              onClick={() => router.push('/login')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Retour à la connexion
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{flag}</div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Nouveau mot de passe
            </h1>
            <p className="text-slate-400">{tagline}</p>
            <div className="mt-4 text-sm text-slate-500">
              Pour: <span className="text-slate-300">{email}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-slate-300">
                Nouveau mot de passe
              </Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
              />
              <p className="text-xs text-slate-500">Minimum 8 caractères</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-300">
                Confirmer le mot de passe
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/login')}
              disabled={loading}
              className="w-full border-slate-700 text-slate-300 hover:bg-slate-700"
            >
              Annuler
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <p className="text-slate-400">Chargement...</p>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
