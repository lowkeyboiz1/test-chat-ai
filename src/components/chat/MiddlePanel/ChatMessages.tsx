// src/components/chat/MiddlePanel/ChatMessages.tsx
'use client'
import React, { useEffect, useRef, useCallback, memo, useState } from 'react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { MessageBubble } from '@/components/chat/MiddlePanel/MessageBubble'
import { Bug, Search, RefreshCw, Database, Brain, Loader2, Zap } from 'lucide-react'
import { useAtom } from 'jotai'
import { isTypingAtom, messagesAtom } from '@/atoms/chatAtoms'
import { TMessage } from '@/types'

// Define the CSS animation for the status indicator dots and transitions
const typingAnimationStyle = `
  @keyframes blink {
    0% { opacity: 0.3; transform: translateY(0); }
    50% { opacity: 1; transform: translateY(-3px); }
    100% { opacity: 0.3; transform: translateY(0); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(132, 204, 22, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(132, 204, 22, 0); }
    100% { box-shadow: 0 0 0 0 rgba(132, 204, 22, 0); }
  }
  
  .typing-dot:nth-child(1) { animation: blink 1s infinite 0.2s; }
  .typing-dot:nth-child(2) { animation: blink 1s infinite 0.4s; }
  .typing-dot:nth-child(3) { animation: blink 1s infinite 0.6s; }
  
  .status-text {
    animation: fadeIn 0.3s ease-out;
  }
  
  .status-bubble {
    animation: pulse 2s infinite;
  }
  
  .status-icon {
    transition: all 0.3s ease;
  }
  
  .status-icon:hover {
    transform: scale(1.2);
  }
`

// Status types and their corresponding icons
const STATUS_ICONS = {
  typing: Bug,
  searching: Search,
  updating: RefreshCw,
  fetching: Database,
  thinking: Brain,
  processing: Loader2,
  analyzing: Zap
}

// Status messages in Vietnamese
const STATUS_MESSAGES = {
  typing: 'Đang soạn',
  searching: 'Đang tìm kiếm',
  updating: 'Đang cập nhật',
  fetching: 'Đang lấy dữ liệu',
  thinking: 'Đang suy nghĩ',
  processing: 'Đang xử lý',
  analyzing: 'Đang phân tích'
}

// Status transition timing (more varied timing)
const STATUS_TRANSITION_TIME = 4000 // 4 seconds between status changes

export const ChatMessages = memo(function ChatMessages() {
  const [messages] = useAtom(messagesAtom)
  const [isTyping] = useAtom(isTypingAtom)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [currentStatus, setCurrentStatus] = useState<keyof typeof STATUS_ICONS>('typing')
  const [fadeStatus, setFadeStatus] = useState(true)

  // Cycle through statuses when isTyping is true with smooth transitions
  useEffect(() => {
    if (!isTyping) return

    // Statuses to cycle through in a specific sequence for better user experience
    const statusSequence: Array<keyof typeof STATUS_ICONS> = ['typing', 'thinking', 'searching', 'fetching', 'processing', 'analyzing', 'updating']

    let currentIndex = 0

    const rotateStatus = () => {
      // Fade out, change status, fade in
      setFadeStatus(false)

      setTimeout(() => {
        currentIndex = (currentIndex + 1) % statusSequence.length
        setCurrentStatus(statusSequence[currentIndex])
        setFadeStatus(true)
      }, 200) // Short delay to allow fade out
    }

    // Set initial status with fade in
    setCurrentStatus(statusSequence[0])
    setFadeStatus(true)

    // Set up interval to change status with varying times
    const interval = setInterval(rotateStatus, STATUS_TRANSITION_TIME)

    return () => clearInterval(interval)
  }, [isTyping])

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

  // Get current icon component
  const StatusIcon = STATUS_ICONS[currentStatus]

  // Generate a different color based on the status
  const getStatusColor = (status: keyof typeof STATUS_ICONS) => {
    const colors = {
      typing: 'from-lime-400 to-emerald-400',
      searching: 'from-blue-400 to-cyan-400',
      updating: 'from-amber-400 to-orange-400',
      fetching: 'from-violet-400 to-purple-400',
      thinking: 'from-emerald-400 to-teal-400',
      processing: 'from-rose-400 to-pink-400',
      analyzing: 'from-yellow-400 to-amber-400'
    }
    return colors[status] || 'from-lime-400 to-emerald-400'
  }

  return (
    <>
      <style jsx global>
        {typingAnimationStyle}
      </style>
      <ScrollArea className='h-full w-full overflow-auto'>
        <div className='relative mx-auto space-y-4 p-2 pb-[100px] sm:space-y-6 sm:p-4 sm:pb-[100px]'>
          {/* Grid lines */}
          <div className='fixed inset-0 -z-10 bg-[linear-gradient(0deg,rgba(217,249,157,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(217,249,157,0.15)_1px,transparent_1px)] bg-[size:20px_20px]'></div>

          {/* Scan lines effect */}
          <div className='pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(transparent_0%,rgba(217,249,157,0.2)_50%,transparent_100%)] bg-[size:100%_4px]'></div>

          {/* Date divider */}
          <div className='flex w-full justify-center'>
            <Badge
              variant='outline'
              className='mx-auto rounded-full border border-lime-300/60 bg-gradient-to-br from-lime-100/95 via-white/95 to-emerald-100/95 px-4 py-1.5 text-xs text-slate-600 shadow-lg shadow-lime-200/30 sm:text-sm'
            >
              {format(new Date(), 'EEEE, dd/MM/yyyy', { locale: vi })}
            </Badge>
          </div>

          {/* Messages */}
          <div className='relative space-y-4 sm:space-y-6'>
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message as TMessage} />
            ))}

            {/* Enhanced Typing indicator with animated status - only show if there's no status message */}
            {isTyping && !messages.some((m) => m.text?.includes('<STATUS>')) && (
              <div className='flex justify-start' aria-live='polite' aria-label={`AI is ${currentStatus}`}>
                <div className='animate-fadeIn flex max-w-[90%] gap-1.5 sm:gap-3 lg:max-w-[80%]'>
                  {/* Avatar with dynamic color based on status */}
                  <div className='relative mt-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-lime-300/80 bg-gradient-to-br from-lime-100 to-white shadow-xl shadow-lime-200/40 transition-all duration-300 hover:scale-105 sm:h-11 sm:w-11'>
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${getStatusColor(currentStatus)} transition-all duration-500 sm:h-9 sm:w-9`}
                    >
                      <StatusIcon className='status-icon h-4 w-4 text-white drop-shadow-md sm:h-5 sm:w-5' />
                    </div>
                    <div className='absolute inset-0 animate-pulse rounded-full bg-lime-200/60'></div>
                    <div className='absolute -inset-1 animate-ping rounded-full bg-lime-300/30 duration-1000'></div>
                  </div>

                  {/* Status message bubble with enhanced animation and transitions */}
                  <div className='status-bubble group mt-2 flex items-center gap-2 overflow-hidden rounded-2xl border-2 border-lime-300/70 bg-gradient-to-br from-lime-50/95 via-white/95 to-emerald-50/95 px-5 py-3 shadow-lg shadow-lime-200/40 backdrop-blur-sm transition-all duration-300 hover:shadow-lime-200/60'>
                    <div className='flex items-center space-x-2'>
                      <p
                        className={`status-text font-medium text-slate-700 transition-all duration-500 ${fadeStatus ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'}`}
                      >
                        <span className='bg-gradient-to-r from-emerald-600 to-lime-500 bg-clip-text font-semibold text-transparent'>
                          {STATUS_MESSAGES[currentStatus]}
                        </span>
                      </p>
                      <div className='ml-1 flex space-x-1.5'>
                        <span className='typing-dot h-2 w-2 rounded-full bg-gradient-to-r from-lime-500 to-emerald-500 shadow-sm shadow-lime-300'></span>
                        <span className='typing-dot h-2 w-2 rounded-full bg-gradient-to-r from-lime-500 to-emerald-500 shadow-sm shadow-lime-300'></span>
                        <span className='typing-dot h-2 w-2 rounded-full bg-gradient-to-r from-lime-500 to-emerald-500 shadow-sm shadow-lime-300'></span>
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
    </>
  )
})
