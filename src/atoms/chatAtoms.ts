import { TCropData, TLandPlot, TWeatherData } from '@/types'
import { useChat as useAIChat } from '@ai-sdk/react'
import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'

// Basic atoms
export const inputValueAtom = atom('')
export const isRecordingAtom = atom(false)
export const transcriptAtom = atom('')
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

// Image upload atoms
export interface ImageUpload {
  file: File | null
  previewUrl: string
  detectionResults: DetectionResult[] | null
  isDetecting: boolean
}

export interface DetectionResult {
  label: string
  confidence: number
  bbox?: {
    x: number
    y: number
    width: number
    height: number
  }
}

export const imageUploadAtom = atom<ImageUpload>({
  file: null,
  previewUrl: '',
  detectionResults: null,
  isDetecting: false
})

// Internal AI message type from the SDK
interface AIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

// AI messages atom
export const aiMessagesAtom = atom<AIMessage[]>([])

// Derived atom for transformed messages
export const messagesAtom = atom((get) => {
  const aiMessages = get(aiMessagesAtom)
  return aiMessages.map((msg: AIMessage, index: number) => ({
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
  const [imageUpload, setImageUpload] = useAtom(imageUploadAtom)

  const {
    messages: aiMessages,
    handleInputChange,
    handleSubmit,
    isLoading,
    error
  } = useAIChat({
    api: `${process.env.NEXT_PUBLIC_API_URL}/api/ai/chat-template`,
    streamProtocol: 'data'
    // initialMessages: [
    //   {
    //     id: '1',
    //     role: 'assistant',
    //     content: 'Xin chào anh tên gì?'
    //   }
    // ]
  })

  // Sync AI SDK input with Jotai
  useEffect(() => {
    handleInputChange({ target: { value: inputValue } } as React.ChangeEvent<HTMLInputElement>)
  }, [inputValue, handleInputChange])

  // Update isTyping when AI response is loading or completes
  useEffect(() => {
    setIsTyping(isLoading)
  }, [isLoading, setIsTyping])

  // Sync AI SDK messages with Jotai
  useEffect(() => {
    setAiMessages(aiMessages as AIMessage[])
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

  // Handle image upload
  const handleImageUpload = (file: File) => {
    const previewUrl = URL.createObjectURL(file)

    setImageUpload({
      file,
      previewUrl,
      detectionResults: null,
      isDetecting: true
    })

    // Create form data for API request
    const formData = new FormData()
    formData.append('image', file)

    // Send the image to our API endpoint
    fetch('/api/image-detection', {
      method: 'POST',
      body: formData
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        // Convert API response to our DetectionResult format
        const detectionResults: DetectionResult[] = data.detections.map(
          (detection: { label: string; confidence: number; bbox?: { x: number; y: number; width: number; height: number } }) => ({
            label: detection.label,
            confidence: detection.confidence,
            bbox: detection.bbox
          })
        )

        setImageUpload((prev) => ({
          ...prev,
          detectionResults,
          isDetecting: false
        }))

        // Add image detection result to chat
        const detectionMessage = `Tôi đã phân tích hình ảnh của bạn và phát hiện:\n${detectionResults
          .map((d) => `- ${d.label} (${Math.round(d.confidence * 100)}% xác suất)`)
          .join('\n')}\n\n${data.analysis}`

        handleInputChange({ target: { value: detectionMessage } } as React.ChangeEvent<HTMLInputElement>)
        handleSubmit(new Event('submit'))
      })
      .catch((error) => {
        console.error('Error processing image:', error)
        setImageUpload((prev) => ({
          ...prev,
          isDetecting: false
        }))

        // Add error message to chat
        const errorMessage = 'Xin lỗi, tôi không thể phân tích hình ảnh của bạn. Vui lòng thử lại sau.'
        handleInputChange({ target: { value: errorMessage } } as React.ChangeEvent<HTMLInputElement>)
        handleSubmit(new Event('submit'))
      })
  }

  // Clear uploaded image
  const clearImage = () => {
    if (imageUpload.previewUrl) {
      URL.revokeObjectURL(imageUpload.previewUrl)
    }

    setImageUpload({
      file: null,
      previewUrl: '',
      detectionResults: null,
      isDetecting: false
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
    toggleRecording,
    error,
    imageUpload,
    handleImageUpload,
    clearImage
  }
}
