// src/components/chat/MiddlePanel/ChatArea.tsx
'use client'
import { ChatHeader } from '@/components/chat/MiddlePanel/ChatHeader'
import { ChatInput } from '@/components/chat/MiddlePanel/ChatInput'
import { ChatMessages } from '@/components/chat/MiddlePanel/ChatMessages'
import { memo } from 'react'

export const ChatArea = memo(function ChatArea() {
  return (
    <div className='fixed flex h-full w-full flex-col'>
      {/* Glitch effect */}
      <div className='pointer-events-none absolute inset-0 -z-10 opacity-10 mix-blend-screen'>
        <div
          className='absolute inset-0 animate-pulse'
          style={{
            backgroundImage: 'linear-gradient(0deg, transparent 0%, rgba(0, 255, 255, 0.2) 2%, transparent 3%)',
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            animation: 'glitch 5s infinite'
          }}
        ></div>
      </div>

      <div className='relative z-10 flex h-full w-full flex-col'>
        <ChatHeader />
        <div className='min-h-0 flex-1 overflow-hidden'>
          <ChatMessages />
        </div>
        <ChatInput />
      </div>

      <style jsx>{`
        @keyframes glitch {
          0% {
            opacity: 0;
          }
          7% {
            opacity: 0.3;
          }
          10% {
            opacity: 0;
          }
          27% {
            opacity: 0;
          }
          30% {
            opacity: 0.3;
          }
          35% {
            opacity: 0;
          }
          52% {
            opacity: 0;
          }
          55% {
            opacity: 0.3;
          }
          60% {
            opacity: 0;
          }
          92% {
            opacity: 0;
          }
          95% {
            opacity: 0.3;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
})
