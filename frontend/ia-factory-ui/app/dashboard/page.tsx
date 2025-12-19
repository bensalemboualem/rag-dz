'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mic, Sparkles, Globe } from 'lucide-react'
import VoiceRecorder from '@/components/voice/VoiceRecorder'
import LiveTranscription from '@/components/voice/LiveTranscription'
import DigitalTwinSidebar from '@/components/digital-twin/DigitalTwinSidebar'
import TokenWidget from '@/components/tokens/TokenWidget'
import DailyBriefingCard from '@/components/briefing/DailyBriefingCard'
import { useTenant } from '@/lib/providers/TenantProvider'
import { Card } from '@/components/ui/card'

export default function DashboardPage() {
  const { tenant, profile, tagline, focus, flag, colors } = useTenant()
  const [isRecording, setIsRecording] = useState(false)
  const [transcriptionText, setTranscriptionText] = useState('')
  const [emotionData, setEmotionData] = useState<any>(null)
  const [keywords, setKeywords] = useState<string[]>([])

  const handleTranscriptionComplete = (result: any) => {
    setTranscriptionText(result.text)
    setEmotionData(result.emotion_analysis)
    setKeywords(result.keywords || [])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className="h-10 w-10 rounded-lg flex items-center justify-center text-2xl"
                style={{ background: colors.gradient }}
              >
                {flag}
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  {tagline}
                </h1>
                <p className="text-xs text-slate-400">
                  {focus}
                </p>
              </div>
            </div>

            {/* Token Widget in Header */}
            <TokenWidget />
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column: Main Voice Interface */}
          <div className="lg:col-span-2 space-y-6">

            {/* Daily Briefing Card (Geneva Mode) */}
            {tenant === 'geneva' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <DailyBriefingCard />
              </motion.div>
            )}

            {/* Voice Recorder - "The Pulse" */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ background: colors.gradient }}
                      >
                        <Mic className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-white">
                          The Nervous System
                        </h2>
                        <p className="text-sm text-slate-400">
                          Central Pulse Microphone
                        </p>
                      </div>
                    </div>

                    {/* Profile-specific Badge */}
                    {profile === 'psychologist' && (
                      <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30">
                        <svg className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="text-xs text-red-300 font-medium">
                          nLPD Compliant
                        </span>
                      </div>
                    )}
                    {profile === 'education' && (
                      <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30">
                        <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                        <span className="text-xs text-green-300 font-medium">
                          FR/AR Bilingual
                        </span>
                      </div>
                    )}
                    {profile === 'general' && (
                      <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30">
                        <Globe className="h-4 w-4 text-purple-400" />
                        <span className="text-xs text-purple-300 font-medium">
                          110+ Cultures
                        </span>
                      </div>
                    )}
                  </div>

                  <VoiceRecorder
                    isRecording={isRecording}
                    setIsRecording={setIsRecording}
                    onTranscriptionComplete={handleTranscriptionComplete}
                    gradientColor={colors.gradient}
                  />
                </div>
              </Card>
            </motion.div>

            {/* Live Transcription */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <LiveTranscription
                text={transcriptionText}
                isRecording={isRecording}
                keywords={keywords}
              />
            </motion.div>
          </div>

          {/* Right Column: Digital Twin Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="sticky top-6"
            >
              <DigitalTwinSidebar
                emotionData={emotionData}
                keywords={keywords}
                gradientColor={colors.gradient}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
