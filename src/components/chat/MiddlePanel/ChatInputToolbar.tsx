// src/components/chat/MiddlePanel/ChatInputToolbar.tsx
'use client'
import React, { memo, useCallback, useEffect, useState, useRef } from 'react'
import { Send, Upload, Mic } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAtom } from 'jotai'
import { inputValueAtom, useChatState } from '@/atoms/chatAtoms'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export const ChatInputToolbar = memo(function ChatInputToolbar() {
  const [inputValue, setInputValue] = useAtom(inputValueAtom)
  const { handleSendMessage, isTyping } = useChatState()
  const [isRecording, setIsRecording] = useState(false)
  const [speechError, setSpeechError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [currentTranscript, setCurrentTranscript] = useState('')
  const recognitionRef = useRef<any>(null)
  const MAX_RETRIES = 2

  // Clear error message after a timeout
  useEffect(() => {
    if (speechError) {
      const timer = setTimeout(() => setSpeechError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [speechError])

  // Clean up recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch (e) {
          console.error('Error aborting speech recognition:', e)
        }
      }
    }
  }, [])

  // Optimized send message handler
  const onSendMessage = useCallback(() => {
    if (inputValue.trim() && !isTyping) {
      handleSendMessage()
    }
  }, [inputValue, handleSendMessage, isTyping])

  // Defines if send button should be disabled
  const isSendDisabled = !inputValue.trim() || isTyping

  // Stop ongoing recognition
  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort()
      } catch (e) {
        console.error('Error stopping speech recognition:', e)
      }
      recognitionRef.current = null
    }
    setIsRecording(false)
  }, [])

  // Handle speech recognition
  const handleSpeechRecognition = useCallback(() => {
    // If already recording, stop the recording
    if (isRecording) {
      stopRecognition()
      return
    }

    // Check browser support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSpeechError('Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói. Vui lòng sử dụng Chrome hoặc Edge.')
      return
    }

    // Reset states when starting a new recording session
    setRetryCount(0)
    setSpeechError(null)
    setCurrentTranscript('')

    // @ts-ignore - SpeechRecognition is not in the TypeScript types
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition

    recognition.lang = 'vi-VN'
    recognition.continuous = false
    recognition.interimResults = true

    // Prevent partial results from being added multiple times
    let finalTranscriptAdded = false

    recognition.onstart = () => {
      setIsRecording(true)
      finalTranscriptAdded = false
    }

    recognition.onresult = (event: any) => {
      // Get the last result
      const lastResultIndex = event.results.length - 1
      const result = event.results[lastResultIndex]
      const transcript = result[0].transcript.trim()
      const isFinal = result.isFinal

      // Update current transcript for display purposes
      setCurrentTranscript(transcript)

      // Only add to input field when we have a final result
      if (isFinal && !finalTranscriptAdded) {
        finalTranscriptAdded = true

        setInputValue((prev) => {
          const trimmedPrev = prev.trim()
          // If the previous value is empty, just set it to the transcript
          if (!trimmedPrev) {
            return transcript
          }
          // Otherwise add the transcript with a space
          return `${trimmedPrev} ${transcript}`
        })
      }
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)

      // Handle specific error types
      switch (event.error) {
        case 'network':
          setSpeechError('Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet của bạn.')

          // Attempt to retry for network errors
          if (retryCount < MAX_RETRIES) {
            setRetryCount((prev) => prev + 1)
            setSpeechError(`Lỗi kết nối mạng. Đang thử lại (${retryCount + 1}/${MAX_RETRIES})...`)

            // Wait and retry
            setTimeout(() => {
              if (isRecording) {
                // Only retry if still in recording state
                try {
                  recognition.start()
                  return // Don't set isRecording to false if retrying
                } catch (e) {
                  setSpeechError('Không thể kết nối lại. Vui lòng thử lại sau.')
                }
              }
            }, 2000)
          } else {
            setSpeechError('Không thể kết nối sau nhiều lần thử. Vui lòng kiểm tra mạng và thử lại sau.')
          }
          break

        case 'not-allowed':
          setSpeechError('Quyền truy cập microphone bị từ chối. Vui lòng cấp quyền và thử lại.')
          break

        case 'aborted':
          // User canceled, so no need to show error
          setSpeechError(null)
          break

        case 'no-speech':
          setSpeechError('Không phát hiện giọng nói. Vui lòng thử lại.')
          break

        default:
          setSpeechError(`Có lỗi xảy ra: ${event.error}. Vui lòng thử lại sau.`)
      }

      if (event.error !== 'network' || retryCount >= MAX_RETRIES) {
        setIsRecording(false)
        recognitionRef.current = null
      }
    }

    recognition.onend = () => {
      // If this is a final end (not a retry attempt)
      if (retryCount >= MAX_RETRIES || !isRecording) {
        setIsRecording(false)
        recognitionRef.current = null

        // If we have a final transcript that hasn't been added yet, add it now
        if (currentTranscript && !finalTranscriptAdded) {
          setInputValue((prev) => {
            const trimmedPrev = prev.trim()
            if (!trimmedPrev) {
              return currentTranscript
            }
            return `${trimmedPrev} ${currentTranscript}`
          })
        }
      }
    }

    try {
      recognition.start()
    } catch (e) {
      console.error('Failed to start speech recognition:', e)
      setSpeechError('Không thể bắt đầu nhận dạng giọng nói. Vui lòng thử lại.')
      setIsRecording(false)
      recognitionRef.current = null
    }
  }, [isRecording, setInputValue, retryCount, currentTranscript, stopRecognition])

  return (
    <div className='relative flex items-center gap-1.5 transition-opacity duration-200' aria-label='Chat toolbar'>
      {speechError && (
        <div className='absolute -top-10 left-0 w-64 rounded border border-red-200 bg-white p-2 text-xs text-red-600 shadow-md'>{speechError}</div>
      )}

      {isRecording && currentTranscript && (
        <div className='absolute -top-10 right-0 w-64 rounded border border-green-200 bg-white p-2 text-xs text-green-600 shadow-md'>
          Đang nghe: {currentTranscript}
        </div>
      )}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type='button'
              size='icon'
              variant='ghost'
              className='h-8 w-8 rounded-full text-gray-500 hover:bg-amber-100 hover:text-amber-700'
              aria-label='Attach file'
            >
              <Upload className='h-4 w-4' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='top'>
            <p className='text-xs'>Đính kèm tệp</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type='button'
              size='icon'
              variant='ghost'
              className={`h-8 w-8 rounded-full ${
                isRecording ? 'animate-pulse bg-red-100 text-red-600' : 'text-gray-500 hover:bg-amber-100 hover:text-amber-700'
              }`}
              aria-label='Voice input'
              onClick={handleSpeechRecognition}
            >
              <Mic className='h-4 w-4' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='top'>
            <p className='text-xs'>{isRecording ? 'Đang ghi âm...' : 'Nhập giọng nói'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Button
        type='button'
        size='icon'
        disabled={isSendDisabled}
        onClick={onSendMessage}
        className={`h-8 w-8 rounded-full transition-all duration-200 ${
          isSendDisabled
            ? 'cursor-not-allowed bg-gray-100 text-gray-400'
            : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-white hover:from-amber-600 hover:to-yellow-500'
        }`}
        aria-label='Send message'
      >
        <Send className='h-3.5 w-3.5' />
      </Button>
    </div>
  )
})
