'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Ticket, Sparkles, Check, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { tokenApi } from '@/lib/api'
import { useTenant } from '@/lib/providers/TenantProvider'
import { useToast } from '@/lib/hooks/useToast'

interface RedeemCodeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  gradientColor: string
}

export default function RedeemCodeModal({
  isOpen,
  onClose,
  onSuccess,
  gradientColor,
}: RedeemCodeModalProps) {
  const { tenantId } = useTenant()
  const { toast } = useToast()

  const [code, setCode] = useState('')
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [redeemSuccess, setRedeemSuccess] = useState(false)
  const [redeemError, setRedeemError] = useState('')
  const [tokensAdded, setTokensAdded] = useState(0)

  const handleRedeem = async () => {
    if (!code.trim()) {
      setRedeemError('Please enter a code')
      return
    }

    setIsRedeeming(true)
    setRedeemError('')

    try {
      const result = await tokenApi.redeemCode(tenantId, code.trim())

      setTokensAdded(result.tokens_added || 100000)
      setRedeemSuccess(true)

      setTimeout(() => {
        onSuccess()
        handleClose()
      }, 2000)

      toast({
        title: 'Code redeemed successfully!',
        description: `${result.tokens_added} tokens added to your balance`,
      })
    } catch (error: any) {
      const message = error.response?.data?.message || 'Invalid or expired code'
      setRedeemError(message)
      toast({
        title: 'Redemption failed',
        description: message,
        variant: 'destructive',
      })
    } finally {
      setIsRedeeming(false)
    }
  }

  const handleClose = () => {
    setCode('')
    setRedeemError('')
    setRedeemSuccess(false)
    setTokensAdded(0)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div
              className="p-2 rounded-lg"
              style={{ background: gradientColor }}
            >
              <Ticket className="h-5 w-5 text-white" />
            </div>
            <span>Redeem Token Code</span>
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!redeemSuccess ? (
            <motion.div
              key="redeem-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 pt-4"
            >
              {/* Scratch Card Design */}
              <div
                className="relative p-6 rounded-xl border-2 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(148, 163, 184, 0.1) 0%, rgba(71, 85, 105, 0.1) 100%)',
                  borderColor: 'rgba(148, 163, 184, 0.3)',
                }}
              >
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="grid grid-cols-8 gap-2 h-full">
                    {[...Array(64)].map((_, i) => (
                      <div
                        key={i}
                        className="rounded-full"
                        style={{ background: gradientColor }}
                      />
                    ))}
                  </div>
                </div>

                <div className="relative space-y-4">
                  <div className="text-center">
                    <Sparkles className="h-12 w-12 mx-auto text-yellow-400 mb-3" />
                    <h3 className="text-lg font-semibold text-white mb-1">
                      Premium Token Card
                    </h3>
                    <p className="text-sm text-slate-400">
                      Enter your 16-digit code below
                    </p>
                  </div>

                  {/* Code Input */}
                  <div>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value.toUpperCase())
                        setRedeemError('')
                      }}
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                      maxLength={19}
                      className="w-full px-4 py-3 text-center text-lg font-mono tracking-wider bg-slate-950 border-2 border-slate-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-600"
                      disabled={isRedeeming}
                    />
                  </div>

                  {/* Error Message */}
                  {redeemError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30"
                    >
                      <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                      <span className="text-sm text-red-400">{redeemError}</span>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isRedeeming}
                  className="flex-1 border-slate-700 hover:bg-slate-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRedeem}
                  disabled={isRedeeming || !code.trim()}
                  className="flex-1 text-white"
                  style={{ background: gradientColor }}
                >
                  {isRedeeming ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Redeeming...
                    </>
                  ) : (
                    'Redeem Code'
                  )}
                </Button>
              </div>

              {/* Help Text */}
              <p className="text-xs text-center text-slate-500">
                Token codes are like iTunes gift cards - one-time use only
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="py-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{ background: gradientColor }}
              >
                <Check className="h-10 w-10 text-white" />
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-white mb-2"
              >
                Success!
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-slate-400 mb-4"
              >
                <span className="text-3xl font-bold text-green-400">
                  {tokensAdded.toLocaleString()}
                </span>
                <br />
                tokens added to your balance
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-slate-500"
              >
                Closing automatically...
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
