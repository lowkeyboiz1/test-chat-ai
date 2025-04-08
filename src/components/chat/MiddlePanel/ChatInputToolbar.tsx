// src/components/chat/MiddlePanel/ChatInputToolbar.tsx
import { Button } from '@/components/ui/button'
import { Mic, Send, MessageSquare, Cloud } from 'lucide-react'
import { useAtom } from 'jotai'
import { inputValueAtom, isRecordingAtom } from '@/atoms/chatAtoms'
import { useChatState } from '@/atoms/chatAtoms'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export function ChatInputToolbar() {
  const [isRecording] = useAtom(isRecordingAtom)
  const [inputValue] = useAtom(inputValueAtom)
  const { handleSendMessage, toggleRecording } = useChatState()

  return (
    <div className='mt-2 flex items-center justify-between'>
      <div className='flex items-center space-x-2'>
        <Button variant={isRecording ? 'destructive' : 'outline'} size='icon' className='h-8 w-8 rounded-full' onClick={toggleRecording}>
          <Mic className='h-4 w-4' />
        </Button>
      </div>

      <Button
        size='sm'
        className='bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600'
        onClick={handleSendMessage}
        disabled={!inputValue.trim()}
      >
        <Send className='mr-2 h-4 w-4' />
        Gửi
      </Button>
    </div>
  )
}
