'use client'

import { useEffect, useState } from 'react'
import { Coins, Plus, TrendingUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { tokenApi } from '@/lib/api'
import { useTenant } from '@/lib/providers/TenantProvider'
import { formatTokens } from '@/lib/utils'
import RedeemCodeModal from './RedeemCodeModal'

export default function TokenWidget() {
  const { tenantId, colors } = useTenant()
  const [balance, setBalance] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showRedeemModal, setShowRedeemModal] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadBalance = async () => {
    setIsLoading(true)
    try {
      const data = await tokenApi.getBalance(tenantId)
      setBalance(data)
    } catch (error) {
      console.error('Error loading token balance:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshBalance = async () => {
    setIsRefreshing(true)
    await loadBalance()
    setTimeout(() => setIsRefreshing(false), 500)
  }

  useEffect(() => {
    loadBalance()
  }, [tenantId])

  const percentageUsed = balance
    ? (balance.used_tokens / balance.total_tokens) * 100
    : 0

  return (
    <>
      <div className="flex items-center space-x-3">
        {/* Token Balance Display */}
        <div
          className="relative px-4 py-2 rounded-lg backdrop-blur-xl border overflow-hidden group cursor-pointer"
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderColor: 'rgba(148, 163, 184, 0.2)',
          }}
          onClick={refreshBalance}
        >
          {/* Gradient background on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
            style={{ background: colors.gradient }}
          />

          <div className="relative flex items-center space-x-3">
            {/* Icon */}
            <div
              className="p-1.5 rounded"
              style={{ background: colors.gradient }}
            >
              <Coins className="h-4 w-4 text-white" />
            </div>

            {/* Balance Info */}
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-16 bg-slate-800 animate-pulse rounded" />
              </div>
            ) : balance ? (
              <div className="flex items-center space-x-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={balance.remaining_tokens}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="text-lg font-bold text-white"
                      >
                        {formatTokens(balance.remaining_tokens)}
                      </motion.span>
                    </AnimatePresence>
                    {isRefreshing && (
                      <TrendingUp className="h-3 w-3 text-green-400 animate-pulse" />
                    )}
                  </div>
                  <div className="text-xs text-slate-400">
                    of {formatTokens(balance.total_tokens)} tokens
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="hidden md:flex flex-col space-y-1">
                  <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-500 rounded-full"
                      style={{
                        width: `${100 - percentageUsed}%`,
                        background: colors.gradient,
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {(100 - percentageUsed).toFixed(0)}% remaining
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-sm text-slate-400">No balance</span>
            )}
          </div>
        </div>

        {/* Redeem Code Button */}
        <Button
          size="sm"
          onClick={() => setShowRedeemModal(true)}
          className="text-white shadow-lg"
          style={{ background: colors.gradient }}
        >
          <Plus className="h-4 w-4 mr-1" />
          Redeem
        </Button>
      </div>

      {/* Redeem Code Modal */}
      <RedeemCodeModal
        isOpen={showRedeemModal}
        onClose={() => setShowRedeemModal(false)}
        onSuccess={refreshBalance}
        gradientColor={colors.gradient}
      />
    </>
  )
}
