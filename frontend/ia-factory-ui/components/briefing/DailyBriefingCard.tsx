'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Sun,
  Mail,
  Calendar,
  Pill,
  Newspaper,
  ChevronRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mobileApi } from '@/lib/api'
import { useTenant } from '@/lib/providers/TenantProvider'

export default function DailyBriefingCard() {
  const { tenantId, colors } = useTenant()
  const [briefing, setBriefing] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadBriefing = async () => {
      setIsLoading(true)
      try {
        const data = await mobileApi.getBriefing(tenantId, 1, 'json')
        setBriefing(data)
      } catch (error) {
        console.error('Error loading daily briefing:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadBriefing()
  }, [tenantId])

  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl overflow-hidden">
      <div
        className="h-1 w-full"
        style={{ background: colors.gradient }}
      />

      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-white">
            <Sun className="h-5 w-5 text-yellow-400" />
            <span>Good Morning Briefing</span>
          </CardTitle>
          <span className="text-xs text-slate-500">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-800/50 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : briefing ? (
          <>
            {/* Weather */}
            {briefing.weather && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="p-3 rounded-lg bg-slate-950/50 border border-slate-800 hover:border-blue-500/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Sun className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">
                        {briefing.weather.temperature}°C, {briefing.weather.condition}
                      </div>
                      <div className="text-xs text-slate-400">
                        Geneva - {briefing.weather.neighborhood}
                      </div>
                    </div>
                  </div>
                  {briefing.weather.advice && (
                    <span className="text-xs text-blue-400">
                      💡 {briefing.weather.advice}
                    </span>
                  )}
                </div>
              </motion.div>
            )}

            {/* Top Emails */}
            {briefing.top_emails && briefing.top_emails.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="p-3 rounded-lg bg-slate-950/50 border border-slate-800 hover:border-purple-500/30 transition-colors"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Mail className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="text-sm font-medium text-white">
                    {briefing.top_emails.length} Priority Emails
                  </div>
                </div>
                <div className="ml-11 space-y-1.5">
                  {briefing.top_emails.slice(0, 3).map((email: any, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                      <span className="text-xs text-slate-300 truncate">
                        {email.subject || email.summary}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Next Meeting */}
            {briefing.next_meeting && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="p-3 rounded-lg bg-slate-950/50 border border-slate-800 hover:border-green-500/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <Calendar className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">
                        {briefing.next_meeting.title}
                      </div>
                      <div className="text-xs text-slate-400">
                        {briefing.next_meeting.time} - {briefing.next_meeting.duration}
                      </div>
                    </div>
                  </div>
                  {briefing.next_meeting.route && (
                    <div className="text-xs text-green-400">
                      🚗 {briefing.next_meeting.route.duration}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Medication Reminder */}
            {briefing.medication_reminder && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="p-3 rounded-lg bg-slate-950/50 border border-slate-800 hover:border-red-500/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <Pill className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      {briefing.medication_reminder.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {briefing.medication_reminder.timing}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        ) : (
          <div className="text-center py-6">
            <Sun className="h-12 w-12 text-slate-700 mx-auto mb-3" />
            <p className="text-sm text-slate-500">
              No briefing available yet
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
