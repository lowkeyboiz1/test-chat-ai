import { uploadImageServices } from '@/services/upload-image'
import { TCropData, TLandPlot, TWeatherData } from '@/types'
import { useChat as useAIChat } from '@ai-sdk/react'
import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'

// Basic atoms
export const inputValueAtom = atom('')
export const isTypingAtom = atom(false)
export const chatStatusAtom = atom<'submitted' | 'streaming' | 'ready' | 'error'>('ready')
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
  url: string
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
  url: ''
})

export const imageUploadTempAtom = atom<ImageUpload>({
  file: null,
  url: ''
})

// Internal AI message type from the SDK
interface AIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  experimental_attachments?: {
    url: string
    name: string
    contentType: string
  }[]
}

// AI messages atom
export const aiMessagesAtom = atom<AIMessage[]>([])

// Derived atom for transformed messages
export const messagesAtom = atom((get) => {
  const aiMessages = get(aiMessagesAtom)

  console.log('Derived messages atom getting aiMessages:', { aiMessages })

  // Safety check to prevent empty messages array
  if (!aiMessages || aiMessages.length === 0) {
    console.log('Warning: aiMessages is empty, returning empty array')
    return []
  }

  return aiMessages.map((msg: AIMessage, index: number) => ({
    id: parseInt(msg.id) || index + 1,
    text: msg.content,
    sender: msg.role === 'assistant' ? 'ai' : 'user',
    timestamp: new Date(),
    attachments: msg.experimental_attachments,
    parts: msg.experimental_attachments
      ? [
          { type: 'text', text: msg.content },
          ...msg.experimental_attachments.map((attachment) => ({
            type: 'image' as const,
            imageUrl: attachment.url
          }))
        ]
      : undefined
  }))
})

// Custom hook to use AI SDK with Jotai
export function useChatState() {
  const [inputValue, setInputValue] = useAtom(inputValueAtom)
  const [isTyping, setIsTyping] = useAtom(isTypingAtom)
  const [, setAiMessages] = useAtom(aiMessagesAtom)
  const [, setChatStatus] = useAtom(chatStatusAtom)
  const [imageUpload, setImageUpload] = useAtom(imageUploadAtom)
  const [_, setImageUploadTemp] = useAtom(imageUploadTempAtom)

  // Check if we're in the test1 route
  const isTestRoute = typeof window !== 'undefined' && window.location.pathname.includes('/test1')
  const apiUrl = isTestRoute ? 'http://192.168.1.164:7000/api/ai/chat' : `${process.env.NEXT_PUBLIC_API_URL}/api/ai/chat`

  const {
    messages: aiMessages,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    status,
    append
  } = useAIChat({
    api: apiUrl,
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

  // Update chat status based on the SDK status
  useEffect(() => {
    setChatStatus(status)
    // Update isTyping based on the streaming status
    setIsTyping(status === 'streaming' || status === 'submitted')
  }, [status, setChatStatus, setIsTyping])

  // Sync AI SDK messages with Jotai
  useEffect(() => {
    // Only update if there are messages to sync
    if (aiMessages && aiMessages.length > 0) {
      console.log('Syncing messages from SDK:', aiMessages)
      setAiMessages(aiMessages as AIMessage[])
    }
  }, [aiMessages, setAiMessages])

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading || isTyping) return

    console.log('Before sending message:', { aiMessages, imageUpload })

    if (imageUpload.file) {
      // Save current messages to prevent them from being lost during append
      const currentMessages = [...aiMessages]

      setImageUploadTemp({
        file: null,
        url: ''
      })

      // Append the new message with image attachment
      await append(
        {
          role: 'user',
          content: inputValue
        },
        {
          experimental_attachments: [
            {
              url: imageUpload.url,
              name: imageUpload.file?.name,
              contentType: imageUpload.file?.type
            }
          ]
        }
      )

      // Log the messages after append to verify they're still there
      console.log('After append with image:', { currentMessages, newMessages: aiMessages })

      // Only clear the image upload state after successfully appending
      setImageUpload({
        file: null,
        url: ''
      })

      return
    }

    handleSubmit(new Event('submit'))
    setInputValue('')
  }

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('image', file)
      const fileUrl = await uploadImageServices.uploadImage(formData)

      // Get image URL
      const imageUrl = fileUrl?.urls?.find((url: string) => url.includes('thumb300')) || ''

      // Set loading state
      setImageUpload({
        file: file,
        url: imageUrl
      })
      setImageUploadTemp({
        file: file,
        url: imageUrl
      })

      // Important: Don't reset messages here - keep existing messages
      // This is critical to not lose the existing messages
      console.log('Image upload complete, current messages:', aiMessages)

      // Reset input value after sending
      setInputValue('')
    } catch (error) {
      console.error('Error processing image:', error)

      const errorMessage = 'Xin lỗi, tôi không thể phân tích hình ảnh của bạn. Vui lòng thử lại sau.'
      handleInputChange({ target: { value: errorMessage } } as React.ChangeEvent<HTMLInputElement>)
      handleSubmit(new Event('submit'))
    }
  }

  // Clear uploaded image
  const clearImage = () => {
    setImageUpload({
      file: null,
      url: ''
    })
    setImageUploadTemp({
      file: null,
      url: ''
    })
  }

  // Add a function to delete the uploaded image
  const deleteImage = () => {
    clearImage() // Clear the image and reset the URLs
  }

  return {
    aiMessages,
    inputValue,
    setInputValue,
    isTyping,
    handleSendMessage,
    isLoading,
    error,
    imageUpload,
    handleImageUpload,
    clearImage,
    deleteImage,
    status
  }
}
