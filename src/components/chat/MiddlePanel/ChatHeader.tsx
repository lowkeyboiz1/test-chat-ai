'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Bug, Sparkles, Leaf, Cloud, Sun, Droplets } from 'lucide-react'
import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night'

export const ChatHeader = memo(function ChatHeader() {
  const [glowing, setGlowing] = useState(false)
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning')
  const particlesRef = useRef<HTMLDivElement>(null)

  // Memoize the current time for consistency
  const currentTime = useMemo(() => new Date(), [])

  // Optimized time of day calculation
  const updateTimeOfDay = useCallback(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return 'morning' as TimeOfDay
    else if (hour >= 12 && hour < 17) return 'afternoon' as TimeOfDay
    else if (hour >= 17 && hour < 20) return 'evening' as TimeOfDay
    else return 'night' as TimeOfDay
  }, [])

  // Optimized particle creation
  const createParticle = useCallback(() => {
    if (!particlesRef.current) return

    const particle = document.createElement('div')
    particle.className = 'absolute rounded-full bg-amber-300/30 pointer-events-none'

    // Random size between 3px and 6px
    const size = Math.random() * 3 + 3
    particle.style.width = `${size}px`
    particle.style.height = `${size}px`

    // Random position along the header
    particle.style.left = `${Math.random() * 100}%`
    particle.style.bottom = '0px'

    // Random animation duration between 3s and 6s
    const duration = Math.random() * 3000 + 3000
    particle.style.animation = `float ${duration}ms ease-in-out forwards`

    particlesRef.current.appendChild(particle)

    // Remove particle after animation completes
    setTimeout(() => {
      particle.remove()
    }, duration)
  }, [])

  useEffect(() => {
    // Setup animation and time of day detection
    const glowInterval = setInterval(() => {
      setGlowing((prev) => !prev)
    }, 2000)

    // Initial time of day
    setTimeOfDay(updateTimeOfDay())

    // Update time of day every minute
    const timeInterval = setInterval(() => {
      setTimeOfDay(updateTimeOfDay())
    }, 60000)

    // Create particles at optimized interval
    const particleInterval = setInterval(createParticle, 300)

    // Cleanup all intervals
    return () => {
      clearInterval(glowInterval)
      clearInterval(timeInterval)
      clearInterval(particleInterval)
    }
  }, [updateTimeOfDay, createParticle])

  // Memoize UI elements for better performance
  const timeIcon = useMemo(() => {
    switch (timeOfDay) {
      case 'morning':
        return <Sun className='h-3.5 w-3.5 text-amber-500' aria-hidden='true' />
      case 'afternoon':
        return <Sun className='h-3.5 w-3.5 text-amber-600' aria-hidden='true' />
      case 'evening':
        return <Cloud className='h-3.5 w-3.5 text-amber-700' aria-hidden='true' />
      case 'night':
        return <Sparkles className='h-3.5 w-3.5 text-indigo-400' aria-hidden='true' />
    }
  }, [timeOfDay])

  const greeting = useMemo(() => {
    switch (timeOfDay) {
      case 'morning':
        return 'Chào buổi sáng'
      case 'afternoon':
        return 'Chào buổi chiều'
      case 'evening':
        return 'Chào buổi tối'
      case 'night':
        return 'Chào đêm khuya'
    }
  }, [timeOfDay])

  // Memoize theme-based classes
  const themeClasses = useMemo(() => {
    const isNight = timeOfDay === 'night'
    return {
      header: `sticky top-0 z-50 overflow-hidden border-b shadow-sm backdrop-blur-md transition-all duration-300 ${
        isNight ? 'border-indigo-100 bg-indigo-50/90' : 'border-amber-100 bg-amber-50/90'
      }`,
      avatarWrapper: `relative rounded-full p-[2px] transition-all duration-500 ${
        glowing
          ? isNight
            ? 'bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-400 shadow-lg shadow-indigo-200/50'
            : 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 shadow-lg shadow-amber-200/50'
          : isNight
            ? 'bg-indigo-200'
            : 'bg-amber-200'
      }`,
      avatar: `h-9 w-9 ${
        isNight
          ? 'bg-gradient-to-r from-indigo-500 to-purple-400 ring-1 ring-indigo-300'
          : 'bg-gradient-to-r from-amber-500 to-yellow-400 ring-1 ring-amber-300'
      }`,
      title: `font-serif text-base font-bold tracking-wide ${
        isNight
          ? 'bg-gradient-to-r from-indigo-800 to-purple-600 bg-clip-text text-transparent'
          : 'bg-gradient-to-r from-amber-800 to-amber-600 bg-clip-text text-transparent'
      }`,
      badge: `rounded-full px-1.5 py-[1px] text-xs font-medium text-white ${
        isNight ? 'bg-gradient-to-r from-indigo-700 to-purple-600' : 'bg-gradient-to-r from-[#8B5E3C] to-[#A9745B]'
      }`,
      timeText: isNight ? 'text-indigo-600' : 'text-amber-700',
      dot: isNight ? 'text-indigo-300' : 'text-amber-300',
      weatherText: `flex cursor-pointer items-center gap-1 transition-colors ${
        isNight ? 'text-indigo-600 hover:text-indigo-800' : 'text-amber-700 hover:text-amber-900'
      }`,
      dateText: `rounded-full px-2.5 py-1 text-xs font-medium ${isNight ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'}`
    }
  }, [timeOfDay, glowing])

  return (
    <header className={`${themeClasses.header} px-3 py-2`} role='banner'>
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>

      <div ref={particlesRef} className='pointer-events-none absolute inset-0 overflow-hidden'></div>

      <div className='mx-auto flex max-w-4xl items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className={themeClasses.avatarWrapper}>
            <Avatar className={themeClasses.avatar}>
              <AvatarImage
                src='https://readdy.ai/api/search-image?query=A traditional Vietnamese firefly AI assistant with a warm glowing light, incorporating rice paddy elements and traditional Vietnamese patterns, with a friendly appearance, suitable for a farming application for Vietnamese farmers&width=100&height=100&seq=3&orientation=squarish'
                alt='Đom Đóm AI'
                className={`object-cover transition-all duration-300 ${glowing ? 'animate-pulse' : ''}`}
                loading='lazy'
              />
              <AvatarFallback
                className={timeOfDay === 'night' ? 'bg-gradient-to-r from-indigo-500 to-purple-400' : 'bg-gradient-to-r from-amber-500 to-yellow-400'}
              >
                <Bug className='h-4 w-4 text-white' />
              </AvatarFallback>
            </Avatar>
            {glowing && <div className='absolute inset-0 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-amber-300/20'></div>}
          </div>

          <div className='flex flex-col'>
            <div className='flex items-center gap-1.5'>
              <h2 className={themeClasses.title}>Đom Đóm AI</h2>
              <div className='flex items-center gap-1'>
                <div className={themeClasses.badge}>
                  <span>Beta</span>
                </div>
                <div className='flex items-center gap-0.5 rounded-full border border-emerald-200 bg-emerald-100 px-1.5 py-[1px] text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-200'>
                  <Leaf className='h-2.5 w-2.5' aria-hidden='true' />
                  <span>Nông nghiệp</span>
                </div>
              </div>
            </div>

            <div className='mt-0.5 flex items-center text-xs'>
              <div className={`flex items-center gap-1 ${themeClasses.timeText}`}>
                {timeIcon}
                <span>{greeting}</span>
              </div>
              <span className={`mx-2 text-xs ${themeClasses.dot}`} aria-hidden='true'>
                •
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={themeClasses.weatherText}>
                      <Droplets className='h-3 w-3' aria-hidden='true' />
                      <span>Thời tiết hôm nay đẹp</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side='bottom'>
                    <p className='text-xs'>Cập nhật thời tiết</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        <div className={themeClasses.dateText}>
          {currentTime.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
    </header>
  )
})
