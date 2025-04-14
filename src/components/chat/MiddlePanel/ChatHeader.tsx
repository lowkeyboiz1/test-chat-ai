'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Cloud, Droplets, Info, Moon, Sun, Wheat } from 'lucide-react'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import '@/lib/animations.css'

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night'

export const ChatHeader = memo(function ChatHeader() {
  const [glowing, setGlowing] = useState(false)
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning')
  const [loaded, setLoaded] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const particlesRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

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

  // Optimized particle creation with reduced frequency on mobile
  const createParticle = useCallback(() => {
    if (!particlesRef.current) return

    const particle = document.createElement('div')
    particle.className = 'absolute rounded-full bg-[#2EAF5D]/40 pointer-events-none'

    // Smaller particles on mobile
    const size = isMobile ? Math.random() * 3 + 2 : Math.random() * 4 + 3
    particle.style.width = `${size}px`
    particle.style.height = `${size}px`

    particle.style.left = `${Math.random() * 100}%`
    particle.style.bottom = '0px'

    // Shorter animation duration on mobile
    const duration = isMobile ? Math.random() * 2000 + 2000 : Math.random() * 3000 + 3000
    particle.style.animation = `float ${duration}ms ease-in-out forwards`

    particlesRef.current.appendChild(particle)

    setTimeout(() => particle.remove(), duration)
  }, [isMobile])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    const glowInterval = setInterval(() => setGlowing((prev) => !prev), 2000)
    setTimeOfDay(updateTimeOfDay())

    const timeInterval = setInterval(() => setTimeOfDay(updateTimeOfDay()), 60000)

    // Adjust particle interval based on device
    const particleInterval = setInterval(createParticle, isMobile ? 400 : 250)

    setLoaded(true)
    setTimeout(() => setShowDetails(true), 300)

    return () => {
      window.removeEventListener('resize', checkMobile)
      clearInterval(glowInterval)
      clearInterval(timeInterval)
      clearInterval(particleInterval)
    }
  }, [updateTimeOfDay, createParticle, isMobile])

  const timeIcon = useMemo(() => {
    const iconClass = 'h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#2EAF5D]'
    switch (timeOfDay) {
      case 'morning':
        return <Sun className={`${iconClass} text-amber-400`} aria-hidden='true' />
      case 'afternoon':
        return <Sun className={`${iconClass} text-amber-500`} aria-hidden='true' />
      case 'evening':
        return <Cloud className={`${iconClass} text-indigo-300`} aria-hidden='true' />
      case 'night':
        return <Moon className={`${iconClass} text-indigo-400`} aria-hidden='true' />
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

  return (
    <header className='sticky top-0 z-50 w-full transition-all duration-300' role='banner'>
      <div className={`relative border-b border-white/20 bg-[#2EAF5D] backdrop-blur-sm transition-all duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <div ref={particlesRef} className='pointer-events-none absolute inset-0 overflow-hidden bg-[#2EAF5D]/5'></div>

        <div className='relative z-10 mx-auto flex items-center justify-between p-2 sm:p-3'>
          <div className='flex items-center gap-2 sm:gap-3'>
            <div
              className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/60 bg-white/10 transition-all duration-300 sm:h-12 sm:w-12 ${
                glowing ? 'shadow-lg shadow-white/30' : ''
              }`}
            >
              <Avatar className='h-8 w-8 bg-gradient-to-br from-white/90 to-white/70 sm:h-10 sm:w-10'>
                <AvatarImage
                  src='https://readdy.ai/api/search-image?query=A traditional Vietnamese firefly AI assistant with a warm glowing light, incorporating rice paddy elements and traditional Vietnamese patterns, with a friendly appearance, suitable for a farming application for Vietnamese farmers&width=100&height=100&seq=3&orientation=squarish'
                  alt='Đom Đóm AI'
                  className={`object-cover transition-all duration-300 ${glowing ? 'animate-pulse' : ''}`}
                  loading='lazy'
                />
                <AvatarFallback className='bg-gradient-to-br from-white/90 to-white/70'>
                  <Wheat className='h-4 w-4 text-[#2EAF5D] sm:h-5 sm:w-5' />
                </AvatarFallback>
              </Avatar>
              {glowing && <div className='absolute inset-0 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-white/40'></div>}
              <div className='absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white sm:h-5 sm:w-5'>
                <div className='h-2 w-2 rounded-full bg-[#2EAF5D] sm:h-2.5 sm:w-2.5'></div>
              </div>
            </div>

            <div className='flex flex-col'>
              <div className='flex items-center gap-1.5 sm:gap-2'>
                <h2 className='text-lg font-bold text-white sm:text-xl'>Đom Đóm AI</h2>
                <div className='flex items-center gap-1.5'>
                  <div className='flex items-center gap-0.5 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-[#2EAF5D] shadow-sm shadow-black/5 sm:text-xs'>
                    <span>Beta</span>
                  </div>
                  <div className='hidden items-center gap-1 rounded-full border border-white/30 bg-white/10 px-2.5 py-1 text-xs font-medium text-white shadow-sm shadow-black/5 sm:flex'>
                    <Wheat className='h-3.5 w-3.5' aria-hidden='true' />
                    <span>Nông nghiệp</span>
                  </div>
                </div>
              </div>

              <div className={`mt-1 transition-all duration-300 sm:mt-1.5 ${showDetails ? 'opacity-100' : 'opacity-0'}`}>
                <div className='flex items-center space-x-1.5 sm:space-x-2'>
                  <div className='flex items-center gap-1 text-[10px] text-white/90 sm:text-xs'>
                    {timeIcon}
                    <span>{greeting}</span>
                  </div>
                  <span className='text-[8px] text-white/40 sm:text-[10px]' aria-hidden='true'>
                    •
                  </span>
                  <div className='flex items-center gap-1 text-[10px] text-white/90 sm:text-xs'>
                    <Droplets className='h-3 w-3 text-white sm:h-3.5 sm:w-3.5' aria-hidden='true' />
                    <span className='hidden sm:inline'>Thời tiết hôm nay đẹp</span>
                    <span className='sm:hidden'>Đẹp trời</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='flex items-center'>
            <div className={`transition-all duration-300 ${showDetails ? 'opacity-100' : 'opacity-0'}`}>
              <div className='rounded-lg border border-white/20 bg-white/10 px-2 py-1 sm:px-3 sm:py-1.5'>
                <div className='flex items-center gap-1 sm:gap-1.5'>
                  <Info className='h-3 w-3 text-white/90 sm:h-3.5 sm:w-3.5' />
                  <span className='text-[10px] text-white sm:text-xs'>
                    {currentTime.toLocaleDateString('vi-VN', {
                      weekday: isMobile ? 'short' : 'long',
                      day: 'numeric',
                      month: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='pointer-events-none absolute inset-0 z-20 opacity-30 mix-blend-overlay'>
          <div
            className='absolute inset-0 animate-pulse'
            style={{
              backgroundImage: 'linear-gradient(0deg, transparent 0%, rgba(255, 255, 255, 0.4) 2%, transparent 3%)',
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
              animation: 'glitch 4s infinite'
            }}
          ></div>
        </div>

        <div className='pointer-events-none absolute inset-0 z-10 opacity-20'>
          <div
            className='absolute inset-0'
            style={{
              backgroundImage: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 8s infinite linear'
            }}
          ></div>
        </div>
      </div>
    </header>
  )
})
