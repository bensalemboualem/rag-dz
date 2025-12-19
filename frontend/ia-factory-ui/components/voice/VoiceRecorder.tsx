'use client'

import { useEffect, useRef, useState } from 'react'
import { Mic, Square, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { voiceApi } from '@/lib/api'
import { useToast } from '@/lib/hooks/useToast'
import { formatDuration } from '@/lib/utils'

interface VoiceRecorderProps {
  isRecording: boolean
  setIsRecording: (recording: boolean) => void
  onTranscriptionComplete: (result: any) => void
  gradientColor: string
}

export default function VoiceRecorder({
  isRecording,
  setIsRecording,
  onTranscriptionComplete,
  gradientColor,
}: VoiceRecorderProps) {
  const [duration, setDuration] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  const { toast } = useToast()

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Create AudioContext for visualization
      audioContextRef.current = new AudioContext()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256
      source.connect(analyserRef.current)

      // Start visualizing
      visualizeAudio()

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        await processAudio(audioBlob)

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())

        // Clean up audio context
        if (audioContextRef.current) {
          audioContextRef.current.close()
          audioContextRef.current = null
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
      setDuration(0)

      // Start timer
      timerIntervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)

      toast({
        title: 'Recording started',
        description: 'Speak clearly into your microphone',
      })
    } catch (error) {
      console.error('Error starting recording:', error)
      toast({
        title: 'Microphone access denied',
        description: 'Please allow microphone access to record',
        variant: 'destructive',
      })
    }
  }

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }

  // Visualize audio waveform
  const visualizeAudio = () => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)

    const updateLevel = () => {
      if (!analyserRef.current) return

      analyserRef.current.getByteFrequencyData(dataArray)
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length
      setAudioLevel(Math.min(100, (average / 255) * 100))

      animationFrameRef.current = requestAnimationFrame(updateLevel)
    }

    updateLevel()
  }

  // Process and transcribe audio
  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true)

    try {
      const result = await voiceApi.transcribe(audioBlob, 1)
      onTranscriptionComplete(result)

      toast({
        title: 'Transcription complete',
        description: `Processed in ${result.processing_time_ms}ms`,
      })
    } catch (error: any) {
      console.error('Transcription error:', error)
      toast({
        title: 'Transcription failed',
        description: error.response?.data?.message || 'Please try again',
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  return (
    <div className="flex flex-col items-center space-y-6">

      {/* Waveform Visualization */}
      <div className="w-full max-w-md">
        <div className="flex items-end justify-center h-32 space-x-1">
          {[...Array(40)].map((_, i) => {
            const height = isRecording
              ? Math.max(20, (audioLevel / 100) * 100 * (0.5 + Math.random() * 0.5))
              : 20
            return (
              <div
                key={i}
                className="waveform-bar w-1.5 transition-all duration-150"
                style={{
                  height: `${height}%`,
                  background: isRecording ? gradientColor : '#475569',
                  opacity: isRecording ? 0.8 + (audioLevel / 100) * 0.2 : 0.3,
                }}
              />
            )
          })}
        </div>
      </div>

      {/* Central Pulse Button */}
      <div className="relative">
        {isRecording && (
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{ background: gradientColor, opacity: 0.3 }}
          />
        )}

        <Button
          size="lg"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className="h-24 w-24 rounded-full text-white shadow-2xl relative overflow-hidden"
          style={{
            background: isRecording ? '#ef4444' : gradientColor,
          }}
        >
          {isProcessing ? (
            <Loader2 className="h-10 w-10 animate-spin" />
          ) : isRecording ? (
            <Square className="h-10 w-10" />
          ) : (
            <Mic className="h-10 w-10" />
          )}
        </Button>
      </div>

      {/* Duration & Status */}
      <div className="text-center space-y-2">
        {isRecording && (
          <div className="flex items-center justify-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-2xl font-mono text-white font-medium">
              {formatDuration(duration)}
            </span>
          </div>
        )}

        <p className="text-sm text-slate-400">
          {isProcessing
            ? 'Processing transcription...'
            : isRecording
            ? 'Recording in progress - Click to stop'
            : 'Click to start recording'}
        </p>
      </div>
    </div>
  )
}
