'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Brain,
  Heart,
  Sparkles,
  TrendingUp,
  AlertCircle,
  BookOpen,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { digitalTwinApi } from '@/lib/api'
import { useTenant } from '@/lib/providers/TenantProvider'
import { getEmotionColor, getStressLevelColor, formatCurrency } from '@/lib/utils'

interface DigitalTwinSidebarProps {
  emotionData: any
  keywords: string[]
  gradientColor: string
}

export default function DigitalTwinSidebar({
  emotionData,
  keywords,
  gradientColor,
}: DigitalTwinSidebarProps) {
  const { tenantId } = useTenant()
  const [lexicon, setLexicon] = useState<any[]>([])
  const [roiStats, setROIStats] = useState<any>(null)
  const [isLoadingLexicon, setIsLoadingLexicon] = useState(false)
  const [isLoadingROI, setIsLoadingROI] = useState(false)

  // Load lexicon and ROI stats
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingLexicon(true)
      setIsLoadingROI(true)

      try {
        const [lexiconData, roiData] = await Promise.all([
          digitalTwinApi.getLexicon(tenantId, 1),
          digitalTwinApi.getROIStats(tenantId),
        ])

        setLexicon(lexiconData.lexicon?.slice(0, 10) || [])
        setROIStats(roiData)
      } catch (error) {
        console.error('Error loading Digital Twin data:', error)
      } finally {
        setIsLoadingLexicon(false)
        setIsLoadingROI(false)
      }
    }

    loadData()
  }, [tenantId])

  return (
    <div className="space-y-4">
      {/* Digital Twin Header */}
      <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl overflow-hidden">
        <div
          className="h-2 w-full"
          style={{ background: gradientColor }}
        />
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div
              className="p-2 rounded-lg"
              style={{ background: gradientColor }}
            >
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-white text-lg">
                Digital Twin
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                AI Intelligence Layer
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Emotion Analysis */}
      {emotionData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-pink-400" />
                <CardTitle className="text-white text-sm">
                  Emotional State
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Detected Emotion */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">Emotion</span>
                  <span
                    className={`text-sm font-semibold capitalize ${getEmotionColor(
                      emotionData.detected_emotion
                    )}`}
                  >
                    {emotionData.detected_emotion}
                  </span>
                </div>

                {/* Stress Level Bar */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400">Stress Level</span>
                    <span
                      className={`text-sm font-bold ${getStressLevelColor(
                        emotionData.stress_level
                      )}`}
                    >
                      {emotionData.stress_level}/10
                    </span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-500 rounded-full"
                      style={{
                        width: `${(emotionData.stress_level / 10) * 100}%`,
                        background:
                          emotionData.stress_level >= 8
                            ? '#dc2626'
                            : emotionData.stress_level >= 5
                            ? '#f59e0b'
                            : '#22c55e',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Heritage Detection */}
              {emotionData.heritage_detected && (
                <div className="pt-3 border-t border-slate-800">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="h-4 w-4 text-yellow-400" />
                    <span className="text-xs font-medium text-yellow-400">
                      Heritage Detected
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {emotionData.heritage_type === 'proverb'
                      ? 'Cultural proverb identified'
                      : emotionData.heritage_type === 'historical_reference'
                      ? 'Historical reference found'
                      : 'Cultural wisdom detected'}
                  </p>
                </div>
              )}

              {/* Professional Terms */}
              {emotionData.professional_terms?.length > 0 && (
                <div className="pt-3 border-t border-slate-800">
                  <div className="flex items-center space-x-2 mb-2">
                    <BookOpen className="h-4 w-4 text-blue-400" />
                    <span className="text-xs font-medium text-blue-400">
                      Professional Terms
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {emotionData.professional_terms.slice(0, 5).map((term: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Personal Lexicon */}
      <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-purple-400" />
              <CardTitle className="text-white text-sm">
                Personal Lexicon
              </CardTitle>
            </div>
            {lexicon.length > 0 && (
              <span className="text-xs text-slate-500">
                {lexicon.length} terms
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingLexicon ? (
            <div className="text-center py-6">
              <div className="animate-spin h-6 w-6 border-2 border-purple-500 border-t-transparent rounded-full mx-auto" />
            </div>
          ) : lexicon.length > 0 ? (
            <div className="space-y-2 max-h-[200px] overflow-y-auto scrollbar-thin">
              {lexicon.map((term, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-2 rounded-lg bg-slate-950/50 border border-slate-800"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white font-medium">
                      {term.term}
                    </span>
                    <span className="text-xs text-slate-500">
                      ×{term.frequency_count}
                    </span>
                  </div>
                  <span className="text-xs text-purple-400">
                    {term.professional_domain}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <BookOpen className="h-8 w-8 text-slate-700 mx-auto mb-2" />
              <p className="text-xs text-slate-500">
                No terms learned yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ROI Stats */}
      {roiStats && (
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <CardTitle className="text-white text-sm">
                ROI Tracker
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {formatCurrency(roiStats.cost_comparison?.savings_usd || 0)}
                </div>
                <div className="text-xs text-green-300 mt-1">
                  Total Saved
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-slate-950/50">
                <div className="text-slate-400">Hours</div>
                <div className="text-white font-semibold mt-1">
                  {roiStats.total_hours_transcribed?.toFixed(1) || 0}h
                </div>
              </div>
              <div className="p-2 rounded bg-slate-950/50">
                <div className="text-slate-400">Sessions</div>
                <div className="text-white font-semibold mt-1">
                  {roiStats.total_transcriptions || 0}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
