import { TMessage, TCropData, TLandPlot, TWeatherData } from '@/types'
import { useChat as useAIChat } from '@ai-sdk/react'
import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'

// Basic atoms
export const inputValueAtom = atom('')
export const isRecordingAtom = atom(false)
export const isTypingAtom = atom(false)
export const weatherAtom = atom<TWeatherData>({
  temp: 28,
  condition: 'Nắng nhẹ',
  icon: 'sun'
})
export const intimacyLevelAtom = atom(67)
export const cropDetailOpenAtom = atom(false)
export const selectedCropAtom = atom<TCropData | null>(null)
export const selectedPlotAtom = atom<TLandPlot | null>(null)

// AI messages atom
export const aiMessagesAtom = atom<TMessage[]>([])

// Derived atom for transformed messages
export const messagesAtom = atom((get) => {
  const aiMessages = get(aiMessagesAtom)
  return aiMessages.map((msg: any, index: number) => ({
    id: parseInt(msg.id) || index + 1,
    text: msg.content,
    sender: msg.role === 'assistant' ? 'ai' : 'user',
    timestamp: new Date()
  }))
})

// Custom hook to use AI SDK with Jotai
export function useChatState() {
  const [inputValue, setInputValue] = useAtom(inputValueAtom)
  const [isRecording, setIsRecording] = useAtom(isRecordingAtom)
  const [isTyping, setIsTyping] = useAtom(isTypingAtom)
  const [, setAiMessages] = useAtom(aiMessagesAtom)

  const {
    messages: aiMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error
  } = useAIChat({
    initialMessages: [
      {
        id: '1',
        role: 'assistant',
        content: 'Xin chào Anh Tuấn! Tôi là Đom Đóm AI, trợ lý cá nhân của anh. Hôm nay tôi có thể giúp gì cho anh về vụ lúa mùa thu?'
      }
    ]
  })

  // Sync AI SDK input with Jotai
  useEffect(() => {
    handleInputChange({ target: { value: inputValue } } as any)
  }, [inputValue, handleInputChange])

  // Update isTyping when AI response is loading or completes
  useEffect(() => {
    setIsTyping(isLoading)
  }, [isLoading, setIsTyping])

  // Sync AI SDK messages with Jotai
  useEffect(() => {
    setAiMessages(aiMessages as unknown as TMessage[])
  }, [aiMessages, setAiMessages])

  const handleSendMessage = () => {
    if (inputValue.trim() === '' || isLoading || isTyping) return
    handleSubmit(new Event('submit'))
    setInputValue('')
    setIsTyping(true)
  }

  const toggleRecording = () => {
    setIsRecording((prev: boolean) => {
      const newValue = !prev
      if (newValue) {
        // Simulate voice recording
        setTimeout(() => {
          setIsRecording(false)
        }, 3000)
      }
      return newValue
    })
  }

  return {
    aiMessages,
    inputValue,
    setInputValue,
    isTyping,
    isRecording,
    handleSendMessage,
    isLoading,
    toggleRecording
  }
}
