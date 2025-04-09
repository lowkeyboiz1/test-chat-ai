// src/components/chat/MiddlePanel/ChatInputToolbar.tsx
import { inputValueAtom, isRecordingAtom, useChatState } from '@/atoms/chatAtoms'
import { Button } from '@/components/ui/button'
import { useAtom } from 'jotai'
import { Mic, Send } from 'lucide-react'

export function ChatInputToolbar() {
  const [isRecording] = useAtom(isRecordingAtom)
  const [inputValue] = useAtom(inputValueAtom)
  const { handleSendMessage, toggleRecording, isTyping, isLoading } = useChatState()

  return (
    <div className='flex items-center justify-between gap-3'>
      <div className='flex items-center space-x-2'>
        <Button
          variant={isRecording ? 'destructive' : 'outline'}
          size='icon'
          className={`h-10 w-10 rounded-full transition-all duration-300 hover:scale-105 ${
            isRecording
              ? 'animate-pulse bg-red-500 shadow-red-500/30 hover:bg-red-600'
              : 'border-amber-200/50 bg-gradient-to-r from-amber-50 to-yellow-50 shadow-lg hover:from-amber-100 hover:to-yellow-100'
          }`}
          onClick={toggleRecording}
        >
          <Mic className={`h-5 w-5 ${isRecording ? 'text-white' : 'text-amber-500'}`} />
        </Button>
      </div>

      <Button
        size='sm'
        className={`relative overflow-hidden rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 px-6 py-5 text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-amber-500 hover:to-yellow-500 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 ${isLoading || isTyping ? 'animate-pulse' : ''} group`}
        onClick={handleSendMessage}
        disabled={!inputValue.trim() || isLoading || isTyping}
      >
        <div className='relative flex items-center'>
          <Send className='mr-2 h-5 w-5 transition-transform group-hover:translate-x-1' />
          <span className='font-medium'>Gửi</span>
        </div>

        {/* Shine effect */}
        <div className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full'></div>
      </Button>
    </div>
  )
}
