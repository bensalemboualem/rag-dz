'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import axios from 'axios'

interface ForgotPasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      toast({
        title: 'Erreur',
        description: 'Veuillez entrer une adresse e-mail valide',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const response = await axios.post('/api/auth/forgot-password', {
        email,
      })

      if (response.data.success) {
        setSent(true)
        toast({
          title: 'E-mail envoyé',
          description: 'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.',
        })
      }
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

  const handleClose = () => {
    setEmail('')
    setSent(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">
            {sent ? 'E-mail envoyé' : 'Mot de passe oublié ?'}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {sent
              ? 'Vérifiez votre boîte de réception pour le lien de réinitialisation.'
              : 'Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.'}
          </DialogDescription>
        </DialogHeader>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">
                Adresse e-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-700"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? 'Envoi...' : 'Envoyer le lien'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="pt-4 pb-2">
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="text-green-400 text-xl">✓</div>
                <div className="text-sm text-green-300">
                  <p className="font-semibold mb-1">E-mail de réinitialisation envoyé</p>
                  <p className="text-green-400/80">
                    Si un compte existe avec l'adresse <strong>{email}</strong>, vous recevrez un lien pour
                    réinitialiser votre mot de passe dans quelques minutes.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm text-slate-400">
              <p>Conseils :</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Vérifiez votre dossier spam</li>
                <li>Le lien expire dans 1 heure</li>
                <li>Si vous ne recevez rien, réessayez</li>
              </ul>
            </div>

            <Button
              onClick={handleClose}
              className="w-full mt-6 bg-slate-700 hover:bg-slate-600 text-white"
            >
              Fermer
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
