'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Mic, Square, Loader2 } from 'lucide-react'

interface WhisperRecorderProps {
  onTranscription: (text: string) => void
}

export default function WhisperRecorder({ onTranscription }: WhisperRecorderProps) {
  const [recording, setRecording] = useState(false)
  const [transcribing, setTranscribing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  // Clear error message after a timeout
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()

        // Stop all tracks in the stream
        if (mediaRecorderRef.current.stream) {
          mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
        }
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      setError(null)
      chunksRef.current = []

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        // Stop all tracks in the stream
        stream.getTracks().forEach((track) => track.stop())

        if (chunksRef.current.length === 0) {
          setError('Không có dữ liệu âm thanh được ghi lại')
          setRecording(false)
          return
        }

        try {
          await transcribeAudio()
        } catch (err) {
          console.error('Transcription error:', err)
          setError('Lỗi khi chuyển đổi giọng nói thành văn bản')
        }
      }

      mediaRecorder.start(100) // Collect data every 100ms
      setRecording(true)
    } catch (err) {
      console.error('Error starting recording:', err)
      setError('Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      setRecording(false)
    }
  }

  const transcribeAudio = async () => {
    if (chunksRef.current.length === 0) return

    setTranscribing(true)

    try {
      // Create audio blob from collected chunks
      const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })

      // Create FormData to send to Whisper API
      const formData = new FormData()
      formData.append('file', audioBlob, 'recording.webm')
      formData.append('model', 'whisper-1')
      formData.append('language', 'vi') // Vietnamese language

      // Send to OpenAI Whisper API
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()

      // Call the callback with the transcribed text
      if (data.text) {
        onTranscription(data.text)
      } else {
        setError('Không nhận dạng được giọng nói')
      }
    } catch (error) {
      console.error('Error transcribing audio:', error)
      setError('Lỗi khi xử lý giọng nói với Whisper')
      throw error
    } finally {
      setTranscribing(false)
      chunksRef.current = []
    }
  }

  return (
    <div className='relative'>
      {error && <div className='absolute -top-10 left-0 w-64 rounded border border-red-200 bg-white p-2 text-xs text-red-600 shadow-md'>{error}</div>}

      <Button
        type='button'
        size='icon'
        variant='ghost'
        onClick={recording ? stopRecording : startRecording}
        className={`h-8 w-8 rounded-full ${recording ? 'animate-pulse bg-red-100 text-red-600' : 'text-gray-500 hover:bg-amber-100 hover:text-amber-700'}`}
        disabled={transcribing}
        aria-label={recording ? 'Dừng ghi âm' : 'Bắt đầu ghi âm'}
      >
        {transcribing ? <Loader2 className='h-4 w-4 animate-spin' /> : recording ? <Square className='h-4 w-4' /> : <Mic className='h-4 w-4' />}
      </Button>
    </div>
  )
}
