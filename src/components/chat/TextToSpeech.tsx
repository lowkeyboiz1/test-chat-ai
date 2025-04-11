'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Volume2, VolumeX, Loader2 } from 'lucide-react'

interface TextToSpeechProps {
  text: string
  language?: string
}

export default function TextToSpeech({ text, language = 'vi' }: TextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handlePlay = async () => {
    // If already playing, stop it
    if (isPlaying && audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      return
    }

    if (!text.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      // Create formData to send to OpenAI TTS API
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          prompt:
            'Bạn đang là một trợ lý AI thân thiện, đang trò chuyện với một người nông dân Việt Nam. Hãy dùng lời lẽ giản dị, gần gũi như một người cháu đang hỏi chuyện ông bà hoặc chú bác ở quê. Tránh dùng từ ngữ học thuật hay kỹ thuật. Khi nói đến nông sản hay sản phẩm, hãy gọi là “sản vật”. Mỗi câu trả lời nên ngắn gọn, dễ hiểu, và nên dùng ví dụ cụ thể (như lúa, xoài, cà phê…). Tránh đưa quá nhiều thông tin cùng lúc.',
          voice: 'coral',
          speed: 1.05,
          response_format: 'mp3'
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      // Get audio blob from the response
      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)

      // Create and play audio element
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl)

        audioRef.current.onended = () => {
          setIsPlaying(false)
        }

        audioRef.current.onerror = () => {
          setError('Lỗi khi phát âm thanh')
          setIsPlaying(false)
        }
      } else {
        audioRef.current.src = audioUrl
      }

      await audioRef.current.play()
      setIsPlaying(true)
    } catch (err) {
      console.error('Error in TTS:', err)
      setError('Lỗi khi chuyển đổi văn bản thành giọng nói')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='relative'>
      {error && <div className='absolute -top-10 left-0 w-64 rounded border border-red-200 bg-white p-2 text-xs text-red-600 shadow-md'>{error}</div>}

      <Button
        type='button'
        size='icon'
        variant='ghost'
        onClick={handlePlay}
        className={`h-8 w-8 rounded-full ${isPlaying ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-blue-100 hover:text-blue-700'}`}
        disabled={isLoading || !text.trim()}
        aria-label={isPlaying ? 'Dừng phát' : 'Phát giọng nói'}
      >
        {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : isPlaying ? <VolumeX className='h-4 w-4' /> : <Volume2 className='h-4 w-4' />}
      </Button>
    </div>
  )
}
