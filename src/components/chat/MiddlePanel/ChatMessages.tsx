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
import { chatStatusAtom, isTypingAtom, messagesAtom } from '@/atoms/chatAtoms'
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
  submitted: Bug,
  streaming: Loader2,
  thinking: Brain,
  searching: Search,
  updating: RefreshCw,
  fetching: Database,
  analyzing: Zap
}

// Status messages in Vietnamese
const STATUS_MESSAGES = {
  submitted: 'Đang suy luận',
  streaming: 'Đang soạn',
  thinking: 'Đang suy nghĩ',
  searching: 'Đang tìm kiếm',
  updating: 'Đang cập nhật',
  fetching: 'Đang lấy dữ liệu',
  analyzing: 'Đang phân tích'
}

export const ChatMessages = memo(function ChatMessages() {
  const [messages] = useAtom(messagesAtom)
  const [isTyping] = useAtom(isTypingAtom)
  const [chatStatus] = useAtom(chatStatusAtom)
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

  // Check if there's a loading tag in the messages
  const loadingTagRegex = /@@<loading>(.*?)<\/loading>/
  const lastMessage = messages[messages.length - 1]?.text || ''
  const loadingMatch = lastMessage.match(loadingTagRegex)

  // Determine status based on chatStatus or loading tag
  const statusFromTag = loadingMatch && loadingMatch[1] ? loadingMatch[1] : undefined
  const shouldShowTyping = isTyping || chatStatus === 'streaming' || chatStatus === 'submitted'
  const currentStatus = statusFromTag || chatStatus

  // Get the appropriate icon for the current status
  const StatusIcon = STATUS_ICONS[currentStatus as keyof typeof STATUS_ICONS] || STATUS_ICONS.streaming

  // Generate a different color based on the status
  const getStatusColor = (status: string) => {
    const colors = {
      submitted: 'from-blue-400 to-indigo-400',
      streaming: 'from-lime-400 to-emerald-400',
      thinking: 'from-emerald-400 to-teal-400',
      searching: 'from-blue-400 to-cyan-400',
      updating: 'from-amber-400 to-orange-400',
      fetching: 'from-violet-400 to-purple-400',
      analyzing: 'from-yellow-400 to-amber-400'
    }
    return colors[status as keyof typeof colors] || 'from-lime-400 to-emerald-400'
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

            {/* Typing indicator based on chatStatus */}

            {shouldShowTyping && (
              <div
                className={`flex items-center space-x-3 rounded-2xl border border-lime-300/70 bg-gradient-to-br ${getStatusColor(currentStatus)} p-3.5 shadow-lg transition-all duration-300`}
                style={{ maxWidth: 'max-content' }}
              >
                <div className='status-icon flex h-7 w-7 items-center justify-center rounded-full bg-white/95 p-1.5 shadow-inner'>
                  <StatusIcon className='h-4 w-4 animate-pulse text-emerald-600' />
                </div>
                <div className='status-text text-sm font-medium tracking-wide text-white drop-shadow-sm'>
                  {STATUS_MESSAGES[currentStatus as keyof typeof STATUS_MESSAGES] || STATUS_MESSAGES.streaming}
                </div>
                <div className='flex space-x-1.5 pl-1'>
                  <div className='typing-dot h-2.5 w-2.5 rounded-full bg-white/90 shadow-sm'></div>
                  <div className='typing-dot h-2.5 w-2.5 rounded-full bg-white/90 shadow-sm'></div>
                  <div className='typing-dot h-2.5 w-2.5 rounded-full bg-white/90 shadow-sm'></div>
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
