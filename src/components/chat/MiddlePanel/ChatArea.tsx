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
      {/* Background effects */}
      <div className='absolute inset-0 -z-10'>
        <div className='absolute top-0 left-1/2 h-40 w-full -translate-x-1/2 rounded-full bg-cyan-500 opacity-20 blur-[100px]'></div>
        <div className='absolute bottom-0 left-1/2 h-40 w-full -translate-x-1/2 rounded-full bg-purple-500 opacity-20 blur-[100px]'></div>
      </div>

      {/* Grid lines */}
      <div className='absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]'></div>

      {/* Scan lines effect */}
      <div className='pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(transparent_0%,rgba(0,255,255,0.05)_50%,transparent_100%)] bg-[size:100%_4px]'></div>

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

        {isRecording && <RecordingUI onStop={handleStopRecording} onCancel={handleCancelRecording} transcript={transcript} />}
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
