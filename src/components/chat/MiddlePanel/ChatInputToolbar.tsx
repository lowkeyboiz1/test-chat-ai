// src/components/chat/MiddlePanel/ChatInputToolbar.tsx
'use client'
import React, { memo, useCallback, useRef } from 'react'
import { Send, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAtom } from 'jotai'
import { inputValueAtom, useChatState } from '@/atoms/chatAtoms'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import WhisperRecorder from './WhisperRecorder'

export const ChatInputToolbar = memo(function ChatInputToolbar() {
  const [inputValue, setInputValue] = useAtom(inputValueAtom)
  const { handleSendMessage, isTyping, handleImageUpload } = useChatState()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Optimized send message handler
  const onSendMessage = useCallback(() => {
    if (inputValue.trim() && !isTyping) {
      handleSendMessage()
    }
  }, [inputValue, handleSendMessage, isTyping])

  // Defines if send button should be disabled
  const isSendDisabled = !inputValue.trim() || isTyping

  // Handle transcription from Whisper
  const handleTranscription = useCallback(
    (text: string) => {
      if (text) {
        setInputValue((prev) => {
          const trimmedPrev = prev.trim()
          // If the previous value is empty, just set it to the transcript
          if (!trimmedPrev) {
            return text
          }
          // Otherwise add the transcript with a space
          return `${trimmedPrev} ${text}`
        })
      }
    },
    [setInputValue]
  )

  // Handle file input change
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        const file = files[0]
        // Check if file is an image
        if (file.type.startsWith('image/')) {
          handleImageUpload(file)
        } else {
          // Could display an error message for non-image files
          console.error('Only image files are supported')
        }
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    },
    [handleImageUpload]
  )

  // Trigger file input click
  const openFileDialog = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [])

  return (
    <>
      <div className='relative flex items-center gap-1.5 transition-opacity duration-200' aria-label='Chat toolbar'>
        <input type='file' ref={fileInputRef} onChange={handleFileChange} accept='image/*' className='hidden' aria-label='Upload image' />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type='button'
                size='icon'
                variant='ghost'
                onClick={openFileDialog}
                className='h-8 w-8 rounded-full text-gray-500 hover:bg-amber-100 hover:text-amber-700'
                aria-label='Upload image'
              >
                <Upload className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent side='top'>
              <p className='text-xs'>Tải ảnh lên để phân tích</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                {' '}
                {/* Wrapper div to make it work with WhisperRecorder */}
                <WhisperRecorder onTranscription={handleTranscription} />
              </div>
            </TooltipTrigger>
            <TooltipContent side='top'>
              <p className='text-xs'>Nhập giọng nói với Whisper</p>
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
    </>
  )
})
