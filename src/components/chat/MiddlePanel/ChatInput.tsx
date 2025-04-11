// src/components/chat/MiddlePanel/ChatInput.tsx
'use client'
import { inputValueAtom, useChatState } from '@/atoms/chatAtoms'
import { useAtom } from 'jotai'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ChatInputToolbar } from './ChatInputToolbar'

const MIN_TEXTAREA_HEIGHT = 40
const MAX_TEXTAREA_HEIGHT = 200

type ChatFormValues = {
  message: string
}

export const ChatInput = memo(function ChatInput() {
  const [inputValue, setInputValue] = useAtom(inputValueAtom)
  const { handleSendMessage } = useChatState()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [textareaHeight, setTextareaHeight] = useState(MIN_TEXTAREA_HEIGHT)

  const { register, handleSubmit, watch, reset } = useForm<ChatFormValues>({
    defaultValues: {
      message: inputValue
    }
  })

  // Watch for changes to update jotai state
  const messageValue = watch('message')

  useEffect(() => {
    setInputValue(messageValue)
  }, [messageValue, setInputValue])

  // Auto-resize textarea based on content
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    // Reset height to get the correct scrollHeight
    textarea.style.height = 'auto'

    // Calculate new height
    const newHeight = Math.min(Math.max(textarea.scrollHeight, MIN_TEXTAREA_HEIGHT), MAX_TEXTAREA_HEIGHT)

    // Set the new height
    textarea.style.height = `${newHeight}px`
    setTextareaHeight(newHeight)
  }, [])

  // Handle form submission
  const onSubmit = useCallback(() => {
    handleSendMessage()
    // Clear the input after sending the message
    reset({ message: '' })
    // Reset textarea height
    setTextareaHeight(MIN_TEXTAREA_HEIGHT)
    if (textareaRef.current) {
      textareaRef.current.style.height = `${MIN_TEXTAREA_HEIGHT}px`
    }
  }, [handleSendMessage, reset])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit(onSubmit)()
      }
    },
    [handleSubmit, onSubmit]
  )

  // Focus textarea on mount and adjust height when input value changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
      adjustTextareaHeight()
    }
  }, [adjustTextareaHeight, messageValue])

  return (
    <div className='sticky bottom-0 z-50'>
      <div className='relative overflow-hidden border border-amber-200/50 bg-white/90 shadow-lg transition-shadow duration-300 hover:shadow-xl'>
        <form onSubmit={handleSubmit(onSubmit)} className='relative px-4 py-3'>
          <div className='flex items-center gap-3'>
            <textarea
              {...register('message')}
              ref={(e) => {
                register('message').ref(e)
                textareaRef.current = e
              }}
              onKeyDown={handleKeyDown}
              placeholder='Nhập câu hỏi của bạn...'
              className='scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-transparent flex-1 resize-none border-none bg-transparent text-sm transition-all duration-300 outline-none placeholder:text-amber-400/70 focus:ring-0'
              style={{
                height: `${textareaHeight}px`,
                maxHeight: `${MAX_TEXTAREA_HEIGHT}px`,
                overflow: textareaHeight >= MAX_TEXTAREA_HEIGHT ? 'auto' : 'hidden'
              }}
              onChange={(e) => {
                register('message').onChange(e)
                setTimeout(adjustTextareaHeight, 0)
              }}
              aria-label='Chat input'
            />
            <ChatInputToolbar />
          </div>
        </form>
      </div>
    </div>
  )
})
