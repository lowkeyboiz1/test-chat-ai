'use client'
import AgriPriceTemplate from '@/components/chat/MiddlePanel/AgriPriceTemplate'
import FarmingTechniqueTemplate from '@/components/chat/MiddlePanel/FarmingTechniqueTemplate'
import TextToSpeech from '@/components/chat/TextToSpeech'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TMessage } from '@/types'
import { formatTime } from '@/utils/formatters'
import { Bug, User } from 'lucide-react'
import { useEffect, useState, useMemo, useCallback, lazy, Suspense, memo } from 'react'
import { useAtom } from 'jotai'
import { isTypingAtom } from '@/atoms/chatAtoms'
import { WEATHER_REGEX, AGRI_PRICE_REGEX, FARMING_TECHNIQUE_REGEX } from '@/constans/regex'

// Lazy load the large templates
const WeatherTemplate = lazy(() => import('@/components/chat/MiddlePanel/WeatherTemplate'))

interface MessageBubbleProps {
  message: TMessage
}

interface TemplateData {
  weather: any | null
  agriPrice: any | null
  farmingTechnique: any | null
}

// Loading placeholder component
const TemplateLoader = memo(function TemplateLoader() {
  return (
    <div className='flex items-center justify-center py-4'>
      <div className='h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-amber-500'></div>
      <span className='ml-2 text-sm text-amber-600'>Đang chuẩn bị dữ liệu...</span>
    </div>
  )
})

// Optimized with memo for better performance
export const MessageBubble = memo(function MessageBubble({ message }: MessageBubbleProps) {
  const [templateData, setTemplateData] = useState<TemplateData>({
    weather: null,
    agriPrice: null,
    farmingTechnique: null
  })

  console.log({ message })
  const [displayText, setDisplayText] = useState('')
  const [isTyping] = useAtom(isTypingAtom)
  const [hasPartialTemplate, setHasPartialTemplate] = useState(false)

  // Memoized function to check for partial templates
  const checkForPartialTemplate = useCallback((text: string) => {
    return text.includes('@@@')
  }, [])

  // Process template data with error handling
  const processTemplateData = useCallback((match: RegExpMatchArray | null) => {
    if (match && match[1]) {
      try {
        const jsonData = match[1].trim()
        return JSON.parse(jsonData)
      } catch (error) {
        console.error('Failed to parse template data:', error)
      }
    }
    return null
  }, [])

  useEffect(() => {
    if (message.sender !== 'ai') {
      // Reset all states for non-AI messages
      setTemplateData({
        weather: null,
        agriPrice: null,
        farmingTechnique: null
      })
      setHasPartialTemplate(false)
      setDisplayText(message.text)
      return
    }

    // Check for partial templates first
    const hasPartial = checkForPartialTemplate(message.text)
    setHasPartialTemplate(hasPartial)

    // Extract template data
    let cleanedText = message.text
    const weatherMatch = message.text.match(WEATHER_REGEX)
    const agriPriceMatch = message.text.match(AGRI_PRICE_REGEX)
    const farmingTechniqueMatch = message.text.match(FARMING_TECHNIQUE_REGEX)

    // Process all template types at once
    const weatherData = processTemplateData(weatherMatch)
    const agriPriceData = processTemplateData(agriPriceMatch)
    const farmingTechniqueData = processTemplateData(farmingTechniqueMatch)

    // Update template data state
    setTemplateData({
      weather: weatherData,
      agriPrice: agriPriceData,
      farmingTechnique: farmingTechniqueData
    })

    // Clean the text by removing all template data
    if (weatherData) {
      cleanedText = cleanedText.replace(WEATHER_REGEX, '').trim()
    }
    if (agriPriceData) {
      cleanedText = cleanedText.replace(AGRI_PRICE_REGEX, '').trim()
    }
    if (farmingTechniqueData) {
      cleanedText = cleanedText.replace(FARMING_TECHNIQUE_REGEX, '').trim()
    }

    setDisplayText(cleanedText)
  }, [message.text, message.sender, checkForPartialTemplate, processTemplateData])

  // Memoize derived values to prevent unnecessary recalculations
  const { hasTemplate, shouldHideText } = useMemo(() => {
    const hasTemplateValue = Boolean(templateData.weather || templateData.agriPrice || templateData.farmingTechnique)
    return {
      hasTemplate: hasTemplateValue,
      shouldHideText: (hasTemplateValue || hasPartialTemplate) && isTyping
    }
  }, [templateData, hasPartialTemplate, isTyping])

  // Memoize message styling classes
  const messageClasses = useMemo(() => {
    const isUser = message.sender === 'user'
    return {
      container: `flex ${isUser ? 'justify-end' : 'justify-start'}`,
      innerContainer: `flex w-full max-w-[90%] gap-2 lg:max-w-[80%] ${isUser ? 'flex-row-reverse' : ''}`,
      bubble: isUser
        ? 'rounded-2xl p-3 shadow-sm bg-amber-600 text-white hover:bg-amber-700 transition-colors duration-200'
        : 'rounded-2xl border border-amber-200 bg-white p-3 text-gray-800 shadow-sm transition-colors duration-200 hover:border-amber-300',
      timestamp: `mt-1 text-xs ${isUser ? 'text-amber-100' : 'text-gray-500'}`
    }
  }, [message.sender])

  return (
    <div className={messageClasses.container} role={message.sender === 'ai' ? 'status' : undefined}>
      <div className={messageClasses.innerContainer}>
        {message.sender === 'ai' && (
          <Avatar className='mt-1 h-8 w-8 bg-gradient-to-r from-amber-500 to-yellow-400 shadow-md ring-1 ring-amber-300'>
            <AvatarImage
              src='https://readdy.ai/api/search-image?query=A traditional Vietnamese firefly AI assistant with a warm glowing light, incorporating rice paddy elements and traditional Vietnamese patterns, with a friendly appearance, suitable for a farming application for Vietnamese farmers&width=100&height=100&seq=3&orientation=squarish'
              alt='Đom Đóm AI'
              className='object-cover'
              loading='lazy'
            />
            <AvatarFallback className='bg-gradient-to-r from-amber-500 to-yellow-400'>
              <Bug className='text-xs text-white' />
            </AvatarFallback>
          </Avatar>
        )}

        {message.sender === 'user' ? (
          <div className={messageClasses.bubble}>
            <p className='leading-relaxed'>{message.text}</p>
            <div className={messageClasses.timestamp}>{formatTime(message.timestamp)}</div>
          </div>
        ) : (
          <div className={messageClasses.bubble}>
            {/* Only show plain text if we should not hide it */}
            {!shouldHideText && displayText && (
              <div className='flex items-start justify-between gap-2'>
                <p className='flex-1 leading-relaxed whitespace-pre-line'>{displayText}</p>
                {!isTyping && displayText && <TextToSpeech text={displayText} />}
              </div>
            )}

            {/* Show templates if data is available - using Suspense for better UX */}
            <Suspense fallback={<TemplateLoader />}>
              {templateData.weather && (
                <div className='mt-3 w-full'>
                  <WeatherTemplate weatherData={templateData.weather} />
                </div>
              )}
            </Suspense>

            {templateData.agriPrice && (
              <div className='mt-3 w-full'>
                <AgriPriceTemplate priceData={templateData.agriPrice} />
              </div>
            )}

            {templateData.farmingTechnique && (
              <div className='mt-3 w-full'>
                <FarmingTechniqueTemplate techniqueData={templateData.farmingTechnique} isLoading={!templateData.farmingTechnique} />
              </div>
            )}

            {/* If we have partial template and are still typing, show a placeholder */}
            {hasPartialTemplate && isTyping && !hasTemplate && <TemplateLoader />}

            <div className={messageClasses.timestamp}>{formatTime(message.timestamp)}</div>
          </div>
        )}

        {message.sender === 'user' && (
          <Avatar className='mt-1 h-8 w-8 shadow-md ring-1 ring-green-300'>
            <AvatarImage
              src='https://readdy.ai/api/search-image?query=Portrait of a Vietnamese farmer in his 40s, wearing a traditional conical hat, with a weathered face showing experience and wisdom, standing in a lush green rice field during golden hour, with mountains in the background&width=100&height=100&seq=2&orientation=squarish'
              alt='Anh Tuấn'
              className='object-cover'
              loading='lazy'
            />
            <AvatarFallback className='bg-green-100 text-green-700'>
              <User className='text-xs text-green-700' />
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  )
})
