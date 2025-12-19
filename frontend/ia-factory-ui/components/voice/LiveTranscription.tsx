'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface LiveTranscriptionProps {
  text: string
  isRecording: boolean
  keywords: string[]
}

export default function LiveTranscription({
  text,
  isRecording,
  keywords,
}: LiveTranscriptionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [text])

  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-white">
            <FileText className="h-5 w-5" />
            <span>Live Transcription</span>
          </CardTitle>

          {isRecording && (
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-400 font-medium">
                Live
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div
          ref={scrollRef}
          className="min-h-[200px] max-h-[400px] overflow-y-auto scrollbar-thin rounded-lg bg-slate-950/50 p-6 border border-slate-800"
        >
          <AnimatePresence mode="wait">
            {text ? (
              <motion.div
                key="text-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Transcription Text */}
                <p className="text-white leading-relaxed text-base whitespace-pre-wrap">
                  {text}
                </p>

                {/* Keywords Highlight */}
                {keywords.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-slate-800">
                    <div className="flex items-center space-x-2 mb-3">
                      <Sparkles className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-medium text-slate-300">
                        Extracted Keywords
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {keywords.map((keyword, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                        >
                          {keyword}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-[200px] text-center"
              >
                <FileText className="h-12 w-12 text-slate-700 mb-4" />
                <p className="text-slate-500 text-sm">
                  {isRecording
                    ? 'Listening... Your transcription will appear here'
                    : 'Start recording to see live transcription'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Character Count */}
        {text && (
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>{text.split(/\s+/).filter(Boolean).length} words</span>
            <span>{text.length} characters</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
