// src/components/chat/MiddlePanel/ChatInput.tsx
'use client'
import { Button } from '@/components/ui/button'
import { ChatInputFooter } from './ChatInputFooter'
import { ChatInputToolbar } from './ChatInputToolbar'
import { ChangeEvent } from 'react'
import { useAtom } from 'jotai'
import { inputValueAtom } from '@/atoms/chatAtoms'
import { useChatState } from '@/atoms/chatAtoms'

export function ChatInput() {
  const [inputValue, setInputValue] = useAtom(inputValueAtom)
  const { handleSendMessage } = useChatState()

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
  }

  return (
    <div className='sticky bottom-0 border-t border-gray-200 bg-white p-4'>
      <div className='mx-auto max-w-4xl space-y-3'>
        <div className='relative'>
          <div className='overflow-hidden rounded-xl border border-amber-200 bg-white shadow-sm transition-all'>
            <div className='p-3'>
              <div className='relative'>
                <textarea
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  placeholder='Nhập câu hỏi của bạn hoặc nhấn Shift+Enter để xuống dòng...'
                  className='max-h-[200px] min-h-[60px] w-full resize-none border-none bg-transparent text-sm outline-none focus:ring-0'
                  style={{ overflow: 'auto' }}
                />
                {inputValue && (
                  <Button
                    variant='ghost'
                    size='icon'
                    className='!rounded-button absolute top-0 right-0 h-8 w-8 cursor-pointer'
                    onClick={() => setInputValue('')}
                  >
                    <i className='fas fa-times text-xs text-gray-400'></i>
                  </Button>
                )}
              </div>

              <ChatInputToolbar />
            </div>

            <ChatInputFooter />
          </div>
        </div>
      </div>
    </div>
  )
}
