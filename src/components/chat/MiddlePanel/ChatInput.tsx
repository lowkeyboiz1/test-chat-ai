// src/components/chat/MiddlePanel/ChatInput.tsx
'use client'
import { ChatInputToolbar } from './ChatInputToolbar'
import { ChangeEvent, useRef, useEffect, useCallback, memo } from 'react'
import { useAtom } from 'jotai'
import { inputValueAtom, useChatState } from '@/atoms/chatAtoms'

const MIN_TEXTAREA_HEIGHT = 40

export const ChatInput = memo(function ChatInput() {
  const [inputValue, setInputValue] = useAtom(inputValueAtom)
  const { handleSendMessage } = useChatState()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Debounced resize function to improve performance
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(e.target.value)
    },
    [setInputValue]
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

  // Focus textarea on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  return (
    <div className='sticky bottom-0 z-50'>
      <div className='relative'>
        {/* Decorative background */}
        <div className='absolute inset-0 bg-gradient-to-r from-amber-100/30 to-yellow-100/30 backdrop-blur-lg'></div>

        {/* Main content */}
        <div className='relative mx-auto max-w-4xl'>
          <div className='m-3'>
            <div className='relative overflow-hidden rounded-2xl border border-amber-200/30 bg-white/80 shadow-lg transition-shadow duration-300 hover:shadow-xl'>
              <div className='relative px-4 py-3'>
                <div className='flex items-center gap-3'>
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder='Nhập câu hỏi của bạn...'
                    className='h-[40px] flex-1 resize-none border-none bg-transparent text-sm transition-all duration-300 outline-none placeholder:text-amber-400/70 focus:ring-0'
                    style={{
                      overflow: 'auto',
                      minHeight: `${MIN_TEXTAREA_HEIGHT}px`
                    }}
                    aria-label='Chat input'
                  />
                  <ChatInputToolbar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
