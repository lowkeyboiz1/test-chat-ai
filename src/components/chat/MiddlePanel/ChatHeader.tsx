import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Bug, Sparkles, Leaf, Cloud, Sun, Droplets } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export function ChatHeader() {
  const [glowing, setGlowing] = useState(false)
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning')
  const particlesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setGlowing((prev) => !prev)
    }, 2000)

    // Set time of day based on current hour
    const updateTimeOfDay = () => {
      const hour = new Date().getHours()
      if (hour >= 5 && hour < 12) setTimeOfDay('morning')
      else if (hour >= 12 && hour < 17) setTimeOfDay('afternoon')
      else if (hour >= 17 && hour < 20) setTimeOfDay('evening')
      else setTimeOfDay('night')
    }

    updateTimeOfDay()
    const dayInterval = setInterval(updateTimeOfDay, 60000)

    // Create floating particles effect
    if (particlesRef.current) {
      const createParticle = () => {
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

        particlesRef.current?.appendChild(particle)

        // Remove particle after animation completes
        setTimeout(() => {
          particle.remove()
        }, duration)
      }

      const particleInterval = setInterval(createParticle, 300)
      return () => {
        clearInterval(interval)
        clearInterval(dayInterval)
        clearInterval(particleInterval)
      }
    }

    return () => {
      clearInterval(interval)
      clearInterval(dayInterval)
    }
  }, [])

  const getTimeIcon = () => {
    switch (timeOfDay) {
      case 'morning':
        return <Sun className='h-3.5 w-3.5 text-amber-500' />
      case 'afternoon':
        return <Sun className='h-3.5 w-3.5 text-amber-600' />
      case 'evening':
        return <Cloud className='h-3.5 w-3.5 text-amber-700' />
      case 'night':
        return <Sparkles className='h-3.5 w-3.5 text-indigo-400' />
    }
  }

  const getGreeting = () => {
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
  }

  return (
    <div
      className={`sticky top-0 z-50 overflow-hidden border-b border-amber-100 bg-amber-50/90 px-3 py-2 shadow-sm backdrop-blur-md transition-all duration-300 ${timeOfDay === 'night' ? 'border-indigo-100 bg-indigo-50/90' : ''}`}
    >
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
          <div
            className={`relative rounded-full p-[2px] transition-all duration-500 ${glowing ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 shadow-lg shadow-amber-200/50' : 'bg-amber-200'} ${timeOfDay === 'night' ? (glowing ? 'bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-400 shadow-lg shadow-indigo-200/50' : 'bg-indigo-200') : ''}`}
          >
            <Avatar
              className={`h-9 w-9 ${timeOfDay === 'night' ? 'bg-gradient-to-r from-indigo-500 to-purple-400 ring-1 ring-indigo-300' : 'bg-gradient-to-r from-amber-500 to-yellow-400 ring-1 ring-amber-300'}`}
            >
              <AvatarImage
                src='https://readdy.ai/api/search-image?query=A traditional Vietnamese firefly AI assistant with a warm glowing light, incorporating rice paddy elements and traditional Vietnamese patterns, with a friendly appearance, suitable for a farming application for Vietnamese farmers&width=100&height=100&seq=3&orientation=squarish'
                alt='Đom Đóm AI'
                className={`object-cover transition-all duration-300 ${glowing ? 'animate-pulse' : ''}`}
              />
              <AvatarFallback
                className={`${timeOfDay === 'night' ? 'bg-gradient-to-r from-indigo-500 to-purple-400' : 'bg-gradient-to-r from-amber-500 to-yellow-400'}`}
              >
                <Bug className='h-4 w-4 text-white' />
              </AvatarFallback>
            </Avatar>
            {glowing && <div className='absolute inset-0 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-amber-300/20'></div>}
          </div>

          <div className='flex flex-col'>
            <div className='flex items-center gap-1.5'>
              <h2
                className={`font-serif text-base font-bold tracking-wide ${timeOfDay === 'night' ? 'bg-gradient-to-r from-indigo-800 to-purple-600 bg-clip-text text-transparent' : 'bg-gradient-to-r from-amber-800 to-amber-600 bg-clip-text text-transparent'}`}
              >
                Đom Đóm AI
              </h2>
              <div className='flex items-center gap-1'>
                <div
                  className={`rounded-full px-1.5 py-[1px] text-xs font-medium text-white ${timeOfDay === 'night' ? 'bg-gradient-to-r from-indigo-700 to-purple-600' : 'bg-gradient-to-r from-[#8B5E3C] to-[#A9745B]'}`}
                >
                  <span>Beta</span>
                </div>
                <div className='flex items-center gap-0.5 rounded-full border border-emerald-200 bg-emerald-100 px-1.5 py-[1px] text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-200'>
                  <Leaf className='h-2.5 w-2.5' />
                  <span>Nông nghiệp</span>
                </div>
              </div>
            </div>

            <div className='mt-0.5 flex items-center text-xs'>
              <div className={`flex items-center gap-1 ${timeOfDay === 'night' ? 'text-indigo-600' : 'text-amber-700'}`}>
                {getTimeIcon()}
                <span>{getGreeting()}</span>
              </div>
              <span className={`mx-2 text-xs ${timeOfDay === 'night' ? 'text-indigo-300' : 'text-amber-300'}`}>•</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={`flex cursor-pointer items-center gap-1 ${timeOfDay === 'night' ? 'text-indigo-600 hover:text-indigo-800' : 'text-amber-700 hover:text-amber-900'} transition-colors`}
                    >
                      <Droplets className='h-3 w-3' />
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

        <div
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${timeOfDay === 'night' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'}`}
        >
          {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
    </div>
  )
}
