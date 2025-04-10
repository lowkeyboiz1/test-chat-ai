// src/components/chat/MiddlePanel/ChatArea.tsx
'use client'
import React, { memo } from 'react'
import { ChatHeader } from '@/components/chat/MiddlePanel/ChatHeader'
import { ChatMessages } from '@/components/chat/MiddlePanel/ChatMessages'
import { ChatInput } from '@/components/chat/MiddlePanel/ChatInput'
import RecordingUI from '@/components/chat/MiddlePanel/RecordingUI'
import { useAtom } from 'jotai'
import { isRecordingAtom, transcriptAtom } from '@/atoms/chatAtoms'

export const ChatArea = memo(function ChatArea() {
  const [isRecording, setIsRecording] = useAtom(isRecordingAtom)
  const [transcript, setTranscript] = useAtom(transcriptAtom)

  const handleStopRecording = (transcriptText: string) => {
    setIsRecording(false)
    // Update transcript with the text returned from Whisper
    setTranscript(transcriptText)
  }

  const handleCancelRecording = () => {
    setIsRecording(false)
    setTranscript('')
  }

  return (
    <div className='relative flex h-full w-full flex-col'>
      <div
        className='absolute inset-0 z-0 bg-[url("https://public.readdy.ai/ai/img_res/d0c4f65405da6599ac836fe88274f6f8.jpg")] bg-cover bg-fixed bg-center'
        aria-hidden='true'
      ></div>
      <div className='relative z-10 flex h-full w-full flex-col'>
        <ChatHeader />
        <div className='min-h-0 flex-1 overflow-hidden'>
          <ChatMessages />
        </div>
        <ChatInput />

        {isRecording && <RecordingUI onStop={handleStopRecording} onCancel={handleCancelRecording} transcript={transcript} />}
      </div>
    </div>
  )
})
