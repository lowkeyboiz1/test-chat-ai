// src/components/chat/MiddlePanel/ChatArea.tsx
import React from 'react'
import { ChatHeader } from '@/components/chat/MiddlePanel/ChatHeader'
import { ChatMessages } from '@/components/chat/MiddlePanel/ChatMessages'
import { ChatInput } from '@/components/chat/MiddlePanel/ChatInput'

export function ChatArea() {
  return (
    <div className='relative flex flex-1 flex-col'>
      <div className='absolute inset-0 z-0 bg-[url("https://public.readdy.ai/ai/img_res/d0c4f65405da6599ac836fe88274f6f8.jpg")] bg-cover bg-center'></div>
      <div className='relative z-10 flex flex-1 flex-col'>
        <ChatHeader />
        <ChatMessages />
        <ChatInput />
      </div>
    </div>
  )
}
