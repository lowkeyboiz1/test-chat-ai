// src/components/chat/MiddlePanel/ChatInput.tsx
'use client'
import { ChatInputToolbar } from './ChatInputToolbar'
import { ChangeEvent, useRef, useEffect, useCallback, memo, useState } from 'react'
import { useAtom } from 'jotai'
import { inputValueAtom, useChatState } from '@/atoms/chatAtoms'

const MIN_TEXTAREA_HEIGHT = 40
const MAX_TEXTAREA_HEIGHT = 200

export const ChatInput = memo(function ChatInput() {
  const [inputValue, setInputValue] = useAtom(inputValueAtom)
  const { handleSendMessage } = useChatState()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [textareaHeight, setTextareaHeight] = useState(MIN_TEXTAREA_HEIGHT)

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

  // Handle input change
  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(e.target.value)
      // Adjust height after input changes
      setTimeout(adjustTextareaHeight, 0)
    },
    [setInputValue, adjustTextareaHeight]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSendMessage()
      }
    },
    [handleSendMessage]
  )

  // Focus textarea on mount and adjust height when input value changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
      adjustTextareaHeight()
    }
  }, [adjustTextareaHeight, inputValue])

  return (
    <div className='sticky bottom-0 z-50'>
      <div className='relative overflow-hidden border border-amber-200/50 bg-white/90 shadow-lg transition-shadow duration-300 hover:shadow-xl'>
        <div className='relative px-4 py-3'>
          <div className='flex items-center gap-3'>
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder='Nhập câu hỏi của bạn...'
              className='scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-transparent flex-1 resize-none border-none bg-transparent text-sm transition-all duration-300 outline-none placeholder:text-amber-400/70 focus:ring-0'
              style={{
                height: `${textareaHeight}px`,
                maxHeight: `${MAX_TEXTAREA_HEIGHT}px`,
                overflow: textareaHeight >= MAX_TEXTAREA_HEIGHT ? 'auto' : 'hidden'
              }}
              aria-label='Chat input'
            />
            <ChatInputToolbar />
          </div>
        </div>
      </div>
    </div>
  )
})
