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
      <div className='relative mx-auto space-y-4 p-2 sm:space-y-6 sm:p-4'>
        {/* Background effects */}
        <div className='fixed inset-0 -z-10'>
          <div className='absolute top-0 left-1/2 h-40 w-full -translate-x-1/2 rounded-full bg-lime-200 opacity-30 blur-[100px]'></div>
          <div className='absolute bottom-0 left-1/2 h-40 w-full -translate-x-1/2 rounded-full bg-emerald-200 opacity-30 blur-[100px]'></div>
        </div>

        {/* Grid lines */}
        <div className='fixed inset-0 -z-10 bg-[linear-gradient(0deg,rgba(217,249,157,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(217,249,157,0.15)_1px,transparent_1px)] bg-[size:20px_20px]'></div>

        {/* Scan lines effect */}
        <div className='pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(transparent_0%,rgba(217,249,157,0.2)_50%,transparent_100%)] bg-[size:100%_4px]'></div>

        {/* Date divider */}
        <div className='flex w-full justify-center'>
          <Badge
            variant='outline'
            className='mx-auto rounded-full border border-lime-300/60 bg-gradient-to-br from-lime-100/95 via-white/95 to-emerald-100/95 px-4 py-1.5 text-xs text-slate-600 shadow-lg shadow-lime-200/30 backdrop-blur-sm sm:text-sm'
          >
            {format(new Date(), 'EEEE, dd/MM/yyyy', { locale: vi })}
          </Badge>
        </div>

        {/* Messages */}
        <div className='relative space-y-4 sm:space-y-6'>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message as TMessage} />
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className='flex justify-start' aria-live='polite' aria-label='AI is typing'>
              <div className='flex max-w-[90%] gap-1 sm:gap-2 lg:max-w-[80%]'>
                <div className='relative mt-1 flex h-8 w-8 items-center justify-center rounded-full border border-lime-300/70 bg-gradient-to-br from-lime-100 to-white shadow-lg shadow-lime-200/30 sm:h-10 sm:w-10'>
                  <div className='flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-lime-400 to-emerald-400 sm:h-9 sm:w-9'>
                    <Bug className='h-3.5 w-3.5 text-white sm:h-4 sm:w-4' />
                  </div>
                  <div className='absolute inset-0 animate-pulse rounded-full bg-lime-200/60 blur-sm'></div>
                </div>
                <div className='mt-2 flex items-center gap-1 rounded-xl border border-lime-300/60 bg-gradient-to-br from-lime-100/95 via-white/95 to-emerald-100/95 px-4 py-2 backdrop-blur-sm'>
                  <div className='flex space-x-1'>
                    <div className='h-2 w-2 rounded-full bg-lime-400/90'>
                      <div className='animate-bounce [animation-delay:-0.3s]'></div>
                    </div>
                    <div className='h-2 w-2 rounded-full bg-lime-400/90'>
                      <div className='animate-bounce [animation-delay:-0.15s]'></div>
                    </div>
                    <div className='h-2 w-2 rounded-full bg-lime-400/90'>
                      <div className='animate-bounce'></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  )
})
