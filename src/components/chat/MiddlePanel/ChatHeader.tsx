'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Bug, Leaf, Cloud, Sun, Droplets, Moon, Info } from 'lucide-react'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night'

export const ChatHeader = memo(function ChatHeader() {
  const [glowing, setGlowing] = useState(false)
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning')
  const [scanning, setScanning] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
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
    particle.className = 'absolute rounded-full bg-cyan-400/30 pointer-events-none'

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

    // Simplified loading sequence
    setLoaded(true)
    setScanning(true)
    setTimeout(() => setShowDetails(true), 300)

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
        return <Sun className='h-4 w-4 text-cyan-400' aria-hidden='true' />
      case 'afternoon':
        return <Sun className='h-4 w-4 text-amber-400' aria-hidden='true' />
      case 'evening':
        return <Cloud className='h-4 w-4 text-cyan-400' aria-hidden='true' />
      case 'night':
        return <Moon className='h-4 w-4 text-cyan-400' aria-hidden='true' />
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
    <header className='sticky top-0 z-50 overflow-hidden transition-all duration-300' role='banner'>
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

        @keyframes glitch {
          0% {
            opacity: 0;
          }
          7% {
            opacity: 0.3;
          }
          10% {
            opacity: 0;
          }
          92% {
            opacity: 0;
          }
          95% {
            opacity: 0.3;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>

      {/* Main container with holographic effect */}
      <div className={`relative border-b border-cyan-500/30 backdrop-blur-md transition-all duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Background gradients and effects */}
        <div className='absolute inset-0 bg-gradient-to-b from-cyan-950/80 via-slate-900/90 to-purple-950/80'></div>
        <div className='absolute inset-0 bg-[linear-gradient(0deg,rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]'></div>

        {/* Scanning effect */}
        <div
          className={`absolute inset-0 h-full w-full bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent transition-all duration-500 ease-in-out ${scanning ? 'translate-y-full' : '-translate-y-full'}`}
        ></div>

        {/* Particles container */}
        <div ref={particlesRef} className='pointer-events-none absolute inset-0 overflow-hidden'></div>

        {/* Header content */}
        <div className='relative z-10 mx-auto flex max-w-4xl items-center justify-between p-3'>
          <div className='flex items-center gap-3'>
            <div
              className={`relative flex h-10 w-10 items-center justify-center rounded-full border border-cyan-500/50 bg-cyan-950 transition-all duration-300 ${
                glowing ? 'shadow-lg shadow-cyan-500/30' : ''
              }`}
            >
              <Avatar className='h-9 w-9 bg-gradient-to-r from-cyan-500 to-purple-500'>
                <AvatarImage
                  src='https://readdy.ai/api/search-image?query=A traditional Vietnamese firefly AI assistant with a warm glowing light, incorporating rice paddy elements and traditional Vietnamese patterns, with a friendly appearance, suitable for a farming application for Vietnamese farmers&width=100&height=100&seq=3&orientation=squarish'
                  alt='Đom Đóm AI'
                  className={`object-cover transition-all duration-300 ${glowing ? 'animate-pulse' : ''}`}
                  loading='lazy'
                />
                <AvatarFallback className='bg-gradient-to-r from-cyan-500 to-purple-400'>
                  <Bug className='h-4 w-4 text-white' />
                </AvatarFallback>
              </Avatar>
              {glowing && <div className='absolute inset-0 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-cyan-400/20'></div>}
            </div>

            <div className='flex flex-col'>
              <div className='flex items-center gap-1.5'>
                <h2 className='bg-gradient-to-r from-cyan-300 to-cyan-100 bg-clip-text text-lg font-bold text-transparent'>Đom Đóm AI</h2>
                <div className='flex items-center gap-1'>
                  <div className='rounded-full bg-gradient-to-r from-cyan-700 to-purple-600 px-1.5 py-0.5 text-[10px] font-medium text-white'>
                    <span>Beta</span>
                  </div>
                  <div className='flex items-center gap-0.5 rounded-full border border-cyan-500/30 bg-cyan-900/30 px-1.5 py-0.5 text-xs font-medium text-cyan-300'>
                    <Leaf className='h-2.5 w-2.5' aria-hidden='true' />
                    <span>Nông nghiệp</span>
                  </div>
                </div>
              </div>

              {/* Time info with simplified style */}
              <div className={`mt-2 transition-all duration-300 ${showDetails ? 'opacity-100' : 'opacity-0'}`}>
                <div className='mt-1 flex items-center space-x-2'>
                  <div className='flex items-center gap-1 text-xs text-cyan-400'>
                    {timeIcon}
                    <span>{greeting}</span>
                  </div>
                  <span className='mx-1 text-[10px] text-cyan-500/50' aria-hidden='true'>
                    •
                  </span>
                  <div className='flex items-center gap-1 text-xs text-cyan-400'>
                    <Droplets className='h-3 w-3 text-cyan-400' aria-hidden='true' />
                    <span>Thời tiết hôm nay đẹp</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <div className={`flex items-center transition-all duration-300 ${showDetails ? 'opacity-100' : 'opacity-0'}`}>
              <div className='rounded-lg border border-cyan-500/20 bg-cyan-950/30 px-3 py-1.5'>
                <div className='flex items-center gap-1.5'>
                  <Info className='h-3.5 w-3.5 text-cyan-400/70' />
                  <span className='text-xs text-cyan-100'>
                    {currentTime.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className='absolute top-0 right-0 -z-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl'></div>
        <div className='absolute bottom-0 left-0 -z-10 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl'></div>

        {/* Scan lines effect */}
        <div className='pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(transparent_0%,rgba(0,255,255,0.05)_50%,transparent_100%)] bg-[size:100%_4px]'></div>

        {/* Glitch effect */}
        <div className='pointer-events-none absolute inset-0 z-20 opacity-20 mix-blend-screen'>
          <div
            className='absolute inset-0 animate-pulse'
            style={{
              backgroundImage: 'linear-gradient(0deg, transparent 0%, rgba(0, 255, 255, 0.2) 2%, transparent 3%)',
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
              animation: 'glitch 5s infinite'
            }}
          ></div>
        </div>
      </div>
    </header>
  )
})
