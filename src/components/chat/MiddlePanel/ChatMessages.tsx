// src/components/chat/MiddlePanel/ChatMessages.tsx
'use client'
import React, { useEffect, useRef, useCallback, memo } from 'react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { MessageBubble } from '@/components/chat/MiddlePanel/MessageBubble'
import { Bug } from 'lucide-react'
import { useAtom } from 'jotai'
import { isTypingAtom, messagesAtom } from '@/atoms/chatAtoms'
import { TMessage } from '@/types'

export const ChatMessages = memo(function ChatMessages() {
  const [messages] = useAtom(messagesAtom)
  const [isTyping] = useAtom(isTypingAtom)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Improved scrolling function
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      })
    }
  }, [])

  // Scroll when messages change or typing status changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollToBottom()
    }, 100) // Small delay to ensure content is rendered

    return () => clearTimeout(timeoutId)
  }, [messages.length, isTyping, scrollToBottom])

  return (
    <ScrollArea className='h-full w-full overflow-auto'>
      <div className='mx-auto max-w-4xl space-y-4 p-2 sm:space-y-6 sm:p-4'>
        <div className='my-2 text-center sm:my-4'>
          <Badge variant='outline' className='bg-gray-100 text-xs text-gray-500 sm:text-sm'>
            {format(new Date(), 'EEEE, dd/MM/yyyy', { locale: vi })}
          </Badge>
        </div>

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message as TMessage} />
        ))}

        {isTyping && (
          <div className='flex justify-start' aria-live='polite' aria-label='AI is typing'>
            <div className='flex max-w-[90%] gap-1 sm:gap-2 lg:max-w-[80%]'>
              <div className='mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 sm:h-8 sm:w-8'>
                <Bug className='text-[10px] text-white sm:text-xs' />
              </div>
              <div className='rounded-2xl border border-amber-200 bg-white p-2 text-gray-800 shadow-sm sm:p-3'>
                <div className='flex space-x-1'>
                  <div className='h-1.5 w-1.5 animate-bounce rounded-full bg-amber-400 sm:h-2 sm:w-2'></div>
                  <div className='h-1.5 w-1.5 animate-bounce rounded-full bg-amber-400 sm:h-2 sm:w-2' style={{ animationDelay: '0.2s' }}></div>
                  <div className='h-1.5 w-1.5 animate-bounce rounded-full bg-amber-400 sm:h-2 sm:w-2' style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className='h-1' />
      </div>
    </ScrollArea>
  )
})
