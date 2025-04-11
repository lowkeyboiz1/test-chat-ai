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

interface ForecastDay {
  day: string
  temperature: number
  condition: string
}

interface WeatherData {
  location: string
  date: string
  time: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  forecast: ForecastDay[]
}

interface PriceItem {
  product: string
  currentPrice: number
  previousPrice: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  location?: string
}

interface AgriPriceData {
  title: string
  date: string
  region: string
  market: string
  items: PriceItem[]
}

interface FarmingTechniqueData {
  title: string
  crop: string
  imageUrl?: string
  description: string
  suitableRegions: string[]
  growingDuration: string
  idealConditions: {
    soil: string
    temperature: string
    water: string
    sunlight: string
  }
  steps: {
    title: string
    description: string
  }[]
  tips: string[]
}

interface TemplateData {
  weather: WeatherData | null
  agriPrice: AgriPriceData | null
  farmingTechnique: FarmingTechniqueData | null
}

interface MessageClasses {
  container: string
  innerContainer: string
  bubble: string
  timestamp: string
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

interface MessageBubbleProps {
  message: TMessage
}

// Optimized with memo for better performance
export const MessageBubble = memo(function MessageBubble({ message }: MessageBubbleProps) {
  const [templateData, setTemplateData] = useState<TemplateData>({
    weather: null,
    agriPrice: null,
    farmingTechnique: null
  })

  const [displayText, setDisplayText] = useState('')
  const [isTyping] = useAtom(isTypingAtom)
  const [hasPartialTemplate, setHasPartialTemplate] = useState(false)

  // Memoized function to check for partial templates
  const checkForPartialTemplate = useCallback((text: string) => {
    return text.includes('@@')
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
  const messageClasses = useMemo<MessageClasses>(() => {
    const isUser = message.sender === 'user'
    return {
      container: `flex ${isUser ? 'justify-end' : 'justify-start'}`,
      innerContainer: `flex w-full max-w-[90%] gap-2 lg:max-w-[80%] ${isUser ? 'flex-row-reverse' : ''}`,
      bubble: isUser
        ? 'rounded-2xl border border-lime-300/60 bg-gradient-to-br from-lime-100/95 via-white/95 to-emerald-100/95 p-3.5 text-slate-700 shadow-lg shadow-lime-200/30 transition-all duration-300 hover:border-lime-400/70 hover:shadow-lime-300/40 backdrop-blur-sm'
        : 'rounded-2xl border border-lime-300/60 bg-gradient-to-br from-lime-100/95 via-white/95 to-emerald-100/95 p-3.5 text-slate-700 shadow-lg shadow-lime-200/30 transition-all duration-300 hover:border-lime-400/70 hover:shadow-lime-300/40 backdrop-blur-sm',
      timestamp: `mt-1.5 text-xs ${isUser ? 'text-slate-500' : 'text-slate-500'}`
    }
  }, [message.sender])

  return (
    <div className={messageClasses.container} role={message.sender === 'ai' ? 'status' : undefined}>
      <div className={messageClasses.innerContainer}>
        {message.sender === 'ai' && (
          <div className='relative mt-1 flex h-8 w-8 items-center justify-center rounded-full border border-lime-300/70 bg-gradient-to-br from-lime-100 to-white shadow-lg shadow-lime-200/30 sm:h-10 sm:w-10'>
            <div className='flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-lime-400 to-emerald-400 sm:h-9 sm:w-9'>
              <Bug className='h-3.5 w-3.5 text-white sm:h-4 sm:w-4' />
            </div>
            {isTyping && <div className='absolute inset-0 animate-pulse rounded-full bg-lime-200/60 blur-sm'></div>}
          </div>
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
              <div className='flex items-start justify-between gap-3'>
                <p className='flex-1 leading-relaxed whitespace-pre-line'>{displayText}</p>
                {!isTyping && displayText && (
                  <div className='mt-0.5'>
                    <TextToSpeech text={displayText} />
                  </div>
                )}
              </div>
            )}

            {/* Show templates if data is available - using Suspense for better UX */}
            <Suspense fallback={<TemplateLoader />}>
              {templateData.weather && (
                <div className='mt-4 w-full overflow-hidden rounded-xl border border-lime-300/30 bg-gradient-to-br from-lime-50/90 via-white/95 to-emerald-50/90 p-3 shadow-sm shadow-lime-200/20'>
                  <WeatherTemplate weatherData={templateData.weather} />
                </div>
              )}
            </Suspense>

            {templateData.agriPrice && (
              <div className='mt-4 w-full overflow-hidden rounded-xl border border-lime-300/30 bg-gradient-to-br from-lime-50/90 via-white/95 to-emerald-50/90 p-3 shadow-sm shadow-lime-200/20'>
                <AgriPriceTemplate priceData={templateData.agriPrice} />
              </div>
            )}

            {templateData.farmingTechnique && (
              <div className='mt-4 w-full overflow-hidden rounded-xl border border-lime-300/30 bg-gradient-to-br from-lime-50/90 via-white/95 to-emerald-50/90 p-3 shadow-sm shadow-lime-200/20'>
                <FarmingTechniqueTemplate techniqueData={templateData.farmingTechnique} isLoading={!templateData.farmingTechnique} />
              </div>
            )}

            {/* If we have partial template and are still typing, show a placeholder */}
            {hasPartialTemplate && isTyping && !hasTemplate && (
              <div className='mt-4 w-full overflow-hidden rounded-xl border border-lime-300/30 bg-gradient-to-br from-lime-50/90 via-white/95 to-emerald-50/90 p-3 shadow-sm shadow-lime-200/20'>
                <TemplateLoader />
              </div>
            )}

            <div className={messageClasses.timestamp}>{formatTime(message.timestamp)}</div>
          </div>
        )}

        {message.sender === 'user' && (
          <div className='relative mt-1 flex h-8 w-8 items-center justify-center rounded-full border border-lime-300/70 bg-gradient-to-br from-lime-100 to-white shadow-lg shadow-lime-200/30 sm:h-10 sm:w-10'>
            <Avatar className='h-7 w-7 bg-gradient-to-r from-lime-400 to-emerald-400 sm:h-9 sm:w-9'>
              <AvatarImage
                src='https://readdy.ai/api/search-image?query=Portrait of a Vietnamese farmer in his 40s, wearing a traditional conical hat, with a weathered face showing experience and wisdom, standing in a lush green rice field during golden hour, with mountains in the background&width=100&height=100&seq=2&orientation=squarish'
                alt='Anh Tuấn'
                className='object-cover'
                loading='lazy'
              />
              <AvatarFallback className='bg-gradient-to-r from-lime-400 to-emerald-400'>
                <User className='h-3 w-3 text-white sm:h-4 sm:w-4' />
              </AvatarFallback>
            </Avatar>
            <div className='absolute inset-0 animate-pulse rounded-full bg-lime-200/50'></div>
          </div>
        )}
      </div>
    </div>
  )
})
