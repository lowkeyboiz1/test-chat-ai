'use client'
import { useRef, useState, useCallback, useEffect } from 'react'
import { Mic } from 'lucide-react'

interface VoiceRecorderProps {
  onTranscriptionComplete: (transcript: string) => void
}

export const VoiceRecorder = ({ onTranscriptionComplete }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    // Check if MediaDevices API is supported
    if (typeof window !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setIsSupported(true)
    }
  }, [])

  const startRecording = useCallback(async () => {
    if (!isSupported) {
      console.error('MediaDevices API is not supported in this browser')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        const formData = new FormData()
        formData.append('file', audioBlob, 'audio.wav')
        formData.append('model', 'whisper-1')

        try {
          const response = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData
          })
          const data = await response.json()
          if (data.text) {
            onTranscriptionComplete(data.text)
          }
        } catch (error) {
          console.error('Error transcribing audio:', error)
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }, [onTranscriptionComplete])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      setIsRecording(false)
    }
  }, [isRecording])

  const handleClick = isRecording ? stopRecording : startRecording

  return (
    <button
      onClick={handleClick}
      disabled={isRecording}
      className={`group relative flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ${
        isRecording
          ? 'cursor-not-allowed border-red-400/50 bg-red-950/30 text-red-400/50'
          : 'border-cyan-400/50 bg-gradient-to-br from-cyan-950/50 via-slate-900/50 to-purple-950/50 text-cyan-300 shadow-lg shadow-cyan-500/10 hover:border-cyan-400/70 hover:text-cyan-200 hover:shadow-cyan-500/20'
      }`}
      aria-label={isRecording ? 'Recording in progress' : 'Start voice recording'}
    >
      <Mic className={`h-5 w-5 transition-all duration-300 ${isRecording ? '' : 'group-hover:scale-110'}`} />

      {/* Recording indicator */}
      {isRecording && (
        <div className='absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center'>
          <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75'></span>
          <span className='relative inline-flex h-3 w-3 rounded-full bg-red-500'></span>
        </div>
      )}

      {/* Hover effect */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
        <div className='absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10'></div>
        <div className='absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%]'></div>
      </div>
    </button>
  )
}
