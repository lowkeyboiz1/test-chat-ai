'use client'
import { chatStatusAtom, isTypingAtom } from '@/atoms/chatAtoms'
import AgriPriceTemplate from '@/components/chat/MiddlePanel/AgriPriceTemplate'
import FarmingTechniqueTemplate from '@/components/chat/MiddlePanel/FarmingTechniqueTemplate'
import TextToSpeech from '@/components/chat/TextToSpeech'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AGRI_PRICE_REGEX, ARGI_NEWS_REGEX, FARMING_TECHNIQUE_REGEX, LOADING_REGEX, PLANT_DOCTOR_REGEX, STATUS_REGEX, WEATHER_REGEX } from '@/constans/regex'
import { cn } from '@/lib/utils'
import { MessageBubbleProps, MessageClasses, TemplateData } from '@/types/templates'
import { formatTime } from '@/utils/formatters'
import { useAtom } from 'jotai'
import { Bug, User } from 'lucide-react'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import ArgiNewsTemplate from './ArgiNewsTemplate'
import PlantDoctorTemplate from './PlantDoctorTemplate'
import StatusTemplate from './StatusTemplate'
import WeatherTemplate from './WeatherTemplate'

// Custom function to parse and render markdown
const renderMarkdown = (text: string): React.ReactNode => {
  if (!text) return null

  // Process links - [text](url)
  const processLinks = (line: string): React.ReactNode[] => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    const parts: React.ReactNode[] = []
    let lastIndex = 0
    let match

    while ((match = linkRegex.exec(line)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(line.substring(lastIndex, match.index))
      }

      // Add the link
      parts.push(
        <a key={match.index} href={match[2]} className='text-emerald-600 hover:underline' target='_blank' rel='noopener noreferrer'>
          {match[1]}
        </a>
      )

      lastIndex = match.index + match[0].length
    }

    // Add remaining text
    if (lastIndex < line.length) {
      parts.push(line.substring(lastIndex))
    }

    return parts
  }

  // Process inline text formatting
  const processInlineFormatting = (content: string | React.ReactNode): React.ReactNode => {
    if (typeof content !== 'string') return content

    // Process bold - **text** or __text__
    let result = content.split(/(\*\*|__)(.*?)\1/).map((part, index) => {
      if (index % 3 === 2) {
        // This is the content between ** or __
        return (
          <strong key={index} className='font-bold text-slate-800'>
            {part}
          </strong>
        )
      }
      return part
    })

    // Process italic - *text* or _text_
    result = result
      .map((part, index) => {
        if (typeof part !== 'string') return part

        return part.split(/(\*|_)(.*?)\1/).map((subpart, subindex) => {
          if (subindex % 3 === 2) {
            // This is the content between * or _
            return (
              <em key={`${index}-${subindex}`} className='text-slate-700 italic'>
                {subpart}
              </em>
            )
          }
          return subpart
        })
      })
      .flat()

    // Process inline code - `code`
    result = result
      .map((part, index) => {
        if (typeof part !== 'string') return part

        return part.split(/(`)(.*?)\1/).map((subpart, subindex) => {
          if (subindex % 3 === 2) {
            // This is the content between backticks
            return (
              <code key={`${index}-${subindex}`} className='rounded bg-slate-100 px-1 py-0.5 font-mono text-sm text-slate-800'>
                {subpart}
              </code>
            )
          }
          return subpart
        })
      })
      .flat()

    return result
  }

  // Process a single line
  const processLine = (line: string): React.ReactNode => {
    // Process headings
    if (line.startsWith('# ')) {
      return <h1 className='my-2 text-xl font-bold text-slate-800'>{processInlineFormatting(line.substring(2))}</h1>
    }
    if (line.startsWith('## ')) {
      return <h2 className='my-2 text-lg font-bold text-slate-800'>{processInlineFormatting(line.substring(3))}</h2>
    }
    if (line.startsWith('### ')) {
      return <h3 className='my-1 text-base font-bold text-slate-800'>{processInlineFormatting(line.substring(4))}</h3>
    }

    // Process blockquotes
    if (line.startsWith('> ')) {
      return <blockquote className='my-2 border-l-4 border-lime-300 pl-3 text-slate-600 italic'>{processInlineFormatting(line.substring(2))}</blockquote>
    }

    // Process links and inline formatting
    const linkedContent = processLinks(line)
    return (
      <p key={line} className='text-slate-700'>
        {linkedContent.map(processInlineFormatting)}
      </p>
    )
  }

  // Process code blocks
  const processCodeBlocks = (text: string): { blocks: (string | { type: 'code'; content: string; language?: string })[]; isInCodeBlock: boolean } => {
    const lines = text.split('\n')
    const blocks: (string | { type: 'code'; content: string; language?: string })[] = []
    let isInCodeBlock = false
    let currentBlock: string[] = []
    let codeLanguage: string | undefined

    lines.forEach((line) => {
      if (line.startsWith('```')) {
        if (!isInCodeBlock) {
          // Start of code block
          if (currentBlock.length > 0) {
            blocks.push(currentBlock.join('\n'))
            currentBlock = []
          }
          isInCodeBlock = true
          // Extract language if specified
          codeLanguage = line.substring(3).trim() || undefined
        } else {
          // End of code block
          blocks.push({ type: 'code', content: currentBlock.join('\n'), language: codeLanguage })
          currentBlock = []
          isInCodeBlock = false
          codeLanguage = undefined
        }
      } else {
        currentBlock.push(line)
      }
    })

    // Add any remaining content
    if (currentBlock.length > 0) {
      if (isInCodeBlock) {
        blocks.push({ type: 'code', content: currentBlock.join('\n'), language: codeLanguage })
      } else {
        blocks.push(currentBlock.join('\n'))
      }
    }

    return { blocks, isInCodeBlock }
  }

  // Define types for list processing
  type ListType = 'ul' | 'ol'
  interface ListState {
    type: ListType
    items: React.ReactNode[]
  }

  // Process lists
  const processLists = (content: string): React.ReactNode => {
    const lines = content.split('\n')
    const result: React.ReactNode[] = []
    let currentList = null as ListState | null

    lines.forEach((line, index) => {
      // Unordered list - starts with "- ", "* ", or "+ "
      const ulMatch = line.match(/^(\s*)[-*+]\s(.+)$/)
      if (ulMatch) {
        const [, indent, text] = ulMatch
        if (!currentList || currentList.type !== 'ul') {
          if (currentList && currentList.type === 'ol') {
            // End previous list
            const olList = currentList as ListState
            result.push(
              <ol key={index} className='my-2 list-decimal pl-5'>
                {olList.items.map((item: React.ReactNode, i: number) => (
                  <li key={i} className='my-1'>
                    {item}
                  </li>
                ))}
              </ol>
            )
          }
          // Start new unordered list
          currentList = { type: 'ul' as const, items: [] }
        }
        // Add item to current list
        if (currentList) {
          currentList.items.push(processInlineFormatting(processLinks(text.trim())))
        }
        return
      }

      // Ordered list - starts with "1. ", "2. ", etc.
      const olMatch = line.match(/^(\s*)\d+\.\s(.+)$/)
      if (olMatch) {
        const [, indent, text] = olMatch
        if (!currentList || currentList.type !== 'ol') {
          if (currentList && currentList.type === 'ul') {
            // End previous list
            const ulList = currentList as ListState
            result.push(
              <ul key={index} className='my-2 list-disc pl-5'>
                {ulList.items.map((item: React.ReactNode, i: number) => (
                  <li key={i} className='my-1'>
                    {item}
                  </li>
                ))}
              </ul>
            )
          }
          // Start new ordered list
          currentList = { type: 'ol' as const, items: [] }
        }
        // Add item to current list
        if (currentList) {
          currentList.items.push(processInlineFormatting(processLinks(text.trim())))
        }
        return
      }

      // Not a list item, end any current list
      if (currentList) {
        if (currentList.type === 'ul') {
          const ulList = currentList as ListState
          result.push(
            <ul key={index} className='my-2 list-disc pl-5'>
              {ulList.items.map((item: React.ReactNode, i: number) => (
                <li key={i} className='my-1'>
                  {item}
                </li>
              ))}
            </ul>
          )
        } else {
          const olList = currentList as ListState
          result.push(
            <ol key={index} className='my-2 list-decimal pl-5'>
              {olList.items.map((item: React.ReactNode, i: number) => (
                <li key={i} className='my-1'>
                  {item}
                </li>
              ))}
            </ol>
          )
        }
        currentList = null
      }

      // Process regular line
      result.push(processLine(line))
    })

    // End any remaining list
    if (currentList) {
      if (currentList.type === 'ul') {
        const ulList = currentList as ListState
        result.push(
          <ul key={currentList.items.length} className='my-2 list-disc pl-5'>
            {ulList.items.map((item: React.ReactNode, i: number) => (
              <li key={i} className='my-1'>
                {item}
              </li>
            ))}
          </ul>
        )
      } else {
        const olList = currentList as ListState
        result.push(
          <ol key={currentList.items.length} className='my-2 list-decimal pl-5'>
            {olList.items.map((item: React.ReactNode, i: number) => (
              <li key={i} className='my-1'>
                {item}
              </li>
            ))}
          </ol>
        )
      }
    }

    return <>{result}</>
  }

  // Main render function
  const { blocks, isInCodeBlock } = processCodeBlocks(text)

  return (
    <>
      {blocks.map((block, index) => {
        if (typeof block === 'string') {
          return <div key={index}>{processLists(block)}</div>
        } else if (block.type === 'code') {
          return (
            <pre key={index} className='my-2 overflow-auto rounded bg-slate-100 p-2 font-mono text-sm text-slate-800'>
              <code>{block.content}</code>
            </pre>
          )
        }
        return null
      })}
      {isInCodeBlock && (
        <pre className='my-2 overflow-auto rounded bg-slate-100 p-2 font-mono text-sm text-slate-800'>
          <code>Unclosed code block</code>
        </pre>
      )}
    </>
  )
}

// Optimized with memo for better performance
export const MessageBubble = memo(function MessageBubble({ message }: MessageBubbleProps) {
  const [templateData, setTemplateData] = useState<TemplateData>({
    weather: null,
    agriPrice: null,
    farmingTechnique: null,
    plantDoctor: null,
    argiNews: null,
    status: null,
    loading: null
  })

  const [displayText, setDisplayText] = useState('')
  const [isTyping] = useAtom(isTypingAtom)
  const [chatStatus] = useAtom(chatStatusAtom)
  const [hasPartialTemplate, setHasPartialTemplate] = useState(false)
  const [showTemplate, setShowTemplate] = useState(false)
  const [isRenderingTemplate, setIsRenderingTemplate] = useState(false)

  // Check if this is the last message (still being streamed)
  const isMessageStreaming = useMemo(() => {
    return message.sender === 'ai' && (chatStatus === 'streaming' || chatStatus === 'submitted')
  }, [message.sender, chatStatus])

  // Memoized function to check for partial templates
  const checkForPartialTemplate = useCallback((text: string) => {
    // Improve detection of template rendering
    // Check for any of these cases:
    // 1. Has @@ followed by template tag but no closing tag
    // 2. Has JSON object being built with { but missing }
    // 3. Has JSON syntax in progress

    // Check for template tag
    const hasTemplateTag =
      text.includes('@@<') &&
      !text.includes('</FARMING_TECHNIQUE>@@') &&
      !text.includes('</weather>@@') &&
      !text.includes('</agriPrice>@@') &&
      !text.includes('</plantDoctor>@@') &&
      !text.includes('</argiNews>@@') &&
      !text.includes('</status>@@')

    // Check for unclosed JSON (more open braces than closing braces)
    const openBraces = (text.match(/{/g) || []).length
    const closeBraces = (text.match(/}/g) || []).length
    const hasUnbalancedBraces = openBraces > closeBraces

    // Check for JSON-like content after template opening
    const jsonPattern = /@@<[^>]+>\s*\{.+/
    const hasJsonAfterTag = jsonPattern.test(text)

    const isPartial = hasTemplateTag || (hasJsonAfterTag && hasUnbalancedBraces)

    if (isPartial) {
      console.log('Detected partial template:', {
        text: text.substring(0, 100),
        hasTemplateTag,
        hasUnbalancedBraces,
        openBraces,
        closeBraces,
        hasJsonAfterTag
      })
    }

    return isPartial
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

  // Process loading tag to extract loading type
  const processLoadingTag = useCallback((match: RegExpMatchArray | null) => {
    if (match && match[1]) {
      return match[1].trim()
    }
    return null
  }, [])

  useEffect(() => {
    if (message.sender !== 'ai') {
      // Reset all states for non-AI messages
      setTemplateData({
        weather: null,
        agriPrice: null,
        farmingTechnique: null,
        plantDoctor: null,
        argiNews: null,
        status: null,
        loading: null
      })
      setHasPartialTemplate(false)
      setDisplayText(message.text)
      setShowTemplate(false)
      setIsRenderingTemplate(false)
      return
    }

    // Check for JSON content in message text without template tags yet
    const potentialJsonContent = message.text.includes('{') && message.text.includes('"title"') && message.text.includes('"description"')

    // Check for template syntax or potential JSON content
    const hasPartial = checkForPartialTemplate(message.text) || potentialJsonContent
    setHasPartialTemplate(hasPartial)

    // If we detect a template tag opening, but no closing tag, consider it as rendering
    if (hasPartial) {
      setIsRenderingTemplate(true)
      console.log('Currently rendering template...', {
        text: message.text.substring(0, 100),
        hasJSON: message.text.includes('{'),
        potentialJsonContent: potentialJsonContent
      })
    }

    // Clean message text - also remove any raw JSON that might be from a template being built
    let cleanedText = message.text

    // First try to remove template syntax and content
    const weatherMatch = message.text.match(WEATHER_REGEX)
    const agriPriceMatch = message.text.match(AGRI_PRICE_REGEX)
    const farmingTechniqueMatch = message.text.match(FARMING_TECHNIQUE_REGEX)
    const plantDoctorMatch = message.text.match(PLANT_DOCTOR_REGEX)
    const argiNewsMatch = message.text.match(ARGI_NEWS_REGEX)
    const statusMatch = message.text.match(STATUS_REGEX)
    const loadingMatch = message.text.match(LOADING_REGEX)

    // Process all template types at once
    const weatherData = processTemplateData(weatherMatch)
    const agriPriceData = processTemplateData(agriPriceMatch)
    const farmingTechniqueData = processTemplateData(farmingTechniqueMatch)
    const plantDoctorData = processTemplateData(plantDoctorMatch)
    const argiNewsData = processTemplateData(argiNewsMatch)
    const statusData = processTemplateData(statusMatch)
    const loadingType = processLoadingTag(loadingMatch)

    // Also hide raw JSON text that's likely part of a template being built
    if (hasPartial && potentialJsonContent) {
      // Use regex to remove JSON-like content that appears to be part of a template
      cleanedText = cleanedText.replace(/@@<[^>]+>\s*\{[\s\S]*$/, '')
      cleanedText = cleanedText.replace(/\s*\{\s*"title"[\s\S]*$/, '')
    }

    // Check if we have any template data
    const hasAnyTemplateData = weatherData || agriPriceData || farmingTechniqueData || plantDoctorData || argiNewsData

    // If we have complete template data, mark rendering as complete
    if (hasAnyTemplateData) {
      if (isRenderingTemplate) {
        console.log('Template rendering complete!', {
          template: weatherData
            ? 'weather'
            : agriPriceData
              ? 'agriPrice'
              : farmingTechniqueData
                ? 'farmingTechnique'
                : plantDoctorData
                  ? 'plantDoctor'
                  : argiNewsData
                    ? 'argiNews'
                    : 'unknown'
        })
      }
      setIsRenderingTemplate(false)
    }

    console.log('Processing message:', {
      hasAnyTemplateData,
      loadingType,
      isRenderingTemplate: hasPartial,
      weatherData: weatherData !== null,
      hasPartial,
      potentialJsonContent
    })

    // Determine if we should show loading indicator or template
    let shouldShowLoading = false
    let shouldShowTemplates = false

    // Priority logic (updated):
    // 1. If we have template data, show it (even during streaming)
    // 2. If we're currently rendering a template, don't show previous templates
    // 3. If we only have loading state, show loading
    if (hasAnyTemplateData) {
      shouldShowTemplates = true
      shouldShowLoading = false
    } else if (loadingType) {
      shouldShowLoading = true
      shouldShowTemplates = false
    }

    // Update UI states - allow showing template even during streaming if we have template data
    setShowTemplate(shouldShowTemplates)

    // Update template data state
    setTemplateData({
      weather: weatherData,
      agriPrice: agriPriceData,
      farmingTechnique: farmingTechniqueData,
      plantDoctor: plantDoctorData,
      argiNews: argiNewsData,
      status: statusData,
      loading: shouldShowLoading ? loadingType : null
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
    if (plantDoctorData) {
      cleanedText = cleanedText.replace(PLANT_DOCTOR_REGEX, '').trim()
    }
    if (argiNewsData) {
      cleanedText = cleanedText.replace(ARGI_NEWS_REGEX, '').trim()
    }
    if (statusData) {
      cleanedText = cleanedText.replace(STATUS_REGEX, '').trim()
    }
    if (loadingType) {
      cleanedText = cleanedText.replace(LOADING_REGEX, '').trim()
    }

    // Also remove any partial templates from display text
    if (hasPartial) {
      // More aggressive cleaning of template or JSON fragments
      cleanedText = cleanedText.replace(/@@<[^>]+>[^<]*$/g, '').trim()

      // Try to hide JSON-looking content
      if (cleanedText.includes('{') && cleanedText.includes('"')) {
        const lastOpenBraceIndex = cleanedText.lastIndexOf('{')
        if (lastOpenBraceIndex >= 0) {
          cleanedText = cleanedText.substring(0, lastOpenBraceIndex).trim()
        }
      }
    }

    setDisplayText(cleanedText)
  }, [message.text, message.sender, checkForPartialTemplate, processTemplateData, processLoadingTag, isRenderingTemplate, isMessageStreaming])

  // Effect to detect when streaming ends and show templates
  useEffect(() => {
    if (!isMessageStreaming && hasPartialTemplate && !showTemplate) {
      // When streaming ends and we have template data
      console.log('Streaming ended, checking templates for display')

      const hasTemplateData =
        templateData.weather !== null ||
        templateData.agriPrice !== null ||
        templateData.farmingTechnique !== null ||
        templateData.plantDoctor !== null ||
        templateData.argiNews !== null

      if (hasTemplateData) {
        console.log('Template data available, showing template')
        setShowTemplate(true)
        setIsRenderingTemplate(false)
      }
    }
  }, [isMessageStreaming, hasPartialTemplate, showTemplate, templateData])

  // Effect to detect changes in message content and handle transition from loading to template
  useEffect(() => {
    // If we have a complete template data in the current message, clear loading state
    const hasCompleteTemplate =
      templateData.weather !== null ||
      templateData.agriPrice !== null ||
      templateData.farmingTechnique !== null ||
      templateData.plantDoctor !== null ||
      templateData.argiNews !== null

    // Debug information
    console.log('Message changed:', {
      hasCompleteTemplate,
      hasLoading: templateData.loading !== null,
      showTemplate,
      isRenderingTemplate,
      streaming: isMessageStreaming,
      weather: templateData.weather !== null,
      loading: templateData.loading
    })

    if (hasCompleteTemplate && templateData.loading !== null) {
      // Clear loading and show template when we have both loading and template data
      console.log('Transitioning from loading to template view')
      setTemplateData((prev) => ({
        ...prev,
        loading: null
      }))
      if (!isMessageStreaming) {
        setShowTemplate(true)
        setIsRenderingTemplate(false)
      }
    }
  }, [message.text, templateData, showTemplate, isRenderingTemplate, isMessageStreaming])

  // Memoize derived values to prevent unnecessary recalculations
  const { hasTemplate, shouldHideText } = useMemo(() => {
    const hasTemplateValue = Boolean(
      templateData.weather || templateData.agriPrice || templateData.farmingTechnique || templateData.plantDoctor || templateData.argiNews
    )

    // Hide text if showing a template during streaming
    return {
      hasTemplate: hasTemplateValue,
      shouldHideText: hasTemplateValue && isMessageStreaming && isRenderingTemplate
    }
  }, [templateData, isMessageStreaming, isRenderingTemplate])

  // Memoize message styling classes
  const messageClasses = useMemo<MessageClasses>(() => {
    const isUser = message.sender === 'user'
    return {
      container: `flex ${isUser ? 'justify-end' : 'justify-start'}`,
      innerContainer: `flex w-full max-w-[90%] gap-2 lg:max-w-[80%] ${isUser ? 'flex-row-reverse' : ''}`,
      bubble: isUser
        ? 'rounded-2xl border border-lime-300/60 bg-gradient-to-br from-lime-100/95 via-white/95 to-emerald-100/95 p-3.5 text-slate-700 shadow-lg shadow-lime-200/30 transition-all duration-300 hover:border-lime-400/70 hover:shadow-lime-300/40'
        : 'rounded-2xl border border-lime-300/60 bg-gradient-to-br from-lime-100/95 via-white/95 to-emerald-100/95 p-3.5 text-slate-700 shadow-lg shadow-lime-200/30 transition-all duration-300 hover:border-lime-400/70 hover:shadow-lime-300/40',
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
            {isMessageStreaming && <div className='absolute inset-0 animate-pulse rounded-full bg-lime-200/60'></div>}
          </div>
        )}

        {message.sender === 'user' ? (
          <pre className={cn(messageClasses.bubble, '!font-inter')}>
            <div className='whitespace-pre-wrap'>{renderMarkdown(message.text)}</div>
            <div className={messageClasses.timestamp}>{formatTime(message.timestamp)}</div>
          </pre>
        ) : (
          <div className={messageClasses.bubble}>
            {/* Display status template */}
            {templateData.status && <StatusTemplate statusData={templateData.status} />}

            {/* Only show plain text if we should not hide it */}
            {displayText && (
              <div className='flex items-start justify-between gap-3'>
                <div className='font-inter whitespace-pre-wrap'>{renderMarkdown(displayText)}</div>
                {!isMessageStreaming && displayText && (
                  <div className='mt-0.5'>
                    <TextToSpeech text={displayText} />
                  </div>
                )}
              </div>
            )}

            {/* Show templates if we have data - even during streaming (changed from isRenderingTemplate condition) */}
            {showTemplate && templateData.weather && (
              <div className='mt-4 w-full overflow-hidden rounded-xl border border-lime-300/30 bg-gradient-to-br from-lime-50/90 via-white/95 to-emerald-50/90 p-3 shadow-sm shadow-lime-200/20'>
                <WeatherTemplate weatherData={templateData.weather} />
              </div>
            )}

            {showTemplate && templateData.agriPrice && (
              <div className='mt-4 w-full overflow-hidden rounded-xl border border-lime-300/30 bg-gradient-to-br from-lime-50/90 via-white/95 to-emerald-50/90 p-3 shadow-sm shadow-lime-200/20'>
                <AgriPriceTemplate priceData={templateData.agriPrice} />
              </div>
            )}

            {showTemplate && templateData.farmingTechnique && (
              <div className='mt-4 w-full overflow-hidden rounded-xl border border-lime-300/30 bg-gradient-to-br from-lime-50/90 via-white/95 to-emerald-50/90 p-3 shadow-sm shadow-lime-200/20'>
                <FarmingTechniqueTemplate techniqueData={templateData.farmingTechnique} isLoading={!templateData.farmingTechnique} />
              </div>
            )}

            {showTemplate && templateData.plantDoctor && (
              <div className='mt-4 w-full overflow-hidden rounded-xl border border-lime-300/30 bg-gradient-to-br from-lime-50/90 via-white/95 to-emerald-50/90 p-3 shadow-sm shadow-lime-200/20'>
                <PlantDoctorTemplate plantData={templateData.plantDoctor} />
              </div>
            )}

            {showTemplate && templateData.argiNews && (
              <div className='mt-4 w-full overflow-hidden rounded-xl border border-lime-300/30 bg-gradient-to-br from-lime-50/90 via-white/95 to-emerald-50/90 p-3 shadow-sm shadow-lime-200/20'>
                <ArgiNewsTemplate newsData={templateData.argiNews} />
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
