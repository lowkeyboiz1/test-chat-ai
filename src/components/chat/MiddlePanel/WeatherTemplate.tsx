'use client'

import { WeatherTemplateProps } from '@/types/templates'
import { Clock, Cloud, CloudSun, Droplets, MapPin, Sun, Wind } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import '@/lib/animations.css'
import { cn } from '@/lib/utils'

// Weather icon components to avoid recreating on each render
const WeatherIcon = React.memo(({ condition, size = 'small' }: { condition: string; size?: 'small' | 'large' }) => {
  const iconProps = size === 'large' ? { className: 'h-16 w-16 text-white/80' } : { className: 'h-6 w-6 text-white/80' }

  switch (condition) {
    case 'sunny':
      return <Sun {...{ ...iconProps, className: iconProps.className.replace('text-white/80', 'text-emerald-300') }} />
    case 'partly_cloudy':
      return <CloudSun {...iconProps} />
    case 'cloudy':
      return <Cloud {...iconProps} />
    case 'rainy':
      return <Droplets {...iconProps} />
    case 'windy':
      return <Wind {...iconProps} />
    default:
      return <CloudSun {...iconProps} />
  }
})

WeatherIcon.displayName = 'WeatherIcon'

const WeatherTemplate: React.FC<WeatherTemplateProps> = ({ weatherData }) => {
  const [loaded, setLoaded] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [glowing, setGlowing] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const particlesRef = useRef<HTMLDivElement>(null)

  // Determine main condition icon only when weatherData changes
  const mainConditionType = useMemo(() => {
    const condition = weatherData?.condition?.toLowerCase() || ''
    if (condition.includes('mây')) return 'partly_cloudy'
    if (condition.includes('mưa')) return 'rainy'
    if (condition.includes('nắng')) return 'sunny'
    return 'partly_cloudy'
  }, [weatherData?.condition])

  // Optimized particle creation with reduced frequency on mobile
  const createParticle = useCallback(() => {
    if (!particlesRef.current) return

    const particle = document.createElement('div')
    const isGolden = Math.random() > 0.7

    particle.className = `absolute rounded-full ${isGolden ? 'bg-emerald-500/50' : 'bg-emerald-400/40'} pointer-events-none`

    const size = isMobile ? Math.random() * 3 + 2 : Math.random() * 4 + 3
    particle.style.width = `${size}px`
    particle.style.height = `${size}px`

    particle.style.left = `${Math.random() * 100}%`
    particle.style.bottom = '0px'

    const duration = isMobile ? Math.random() * 2000 + 2000 : Math.random() * 3000 + 3000
    particle.style.animation = `float ${duration}ms ease-in-out forwards`

    particlesRef.current.appendChild(particle)

    setTimeout(() => particle.remove(), duration)
  }, [isMobile])

  // Enhanced loading sequence
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    const glowInterval = setInterval(() => setGlowing((prev) => !prev), 2000)

    // Adjust particle interval based on device
    const particleInterval = setInterval(createParticle, isMobile ? 400 : 250)

    setLoaded(true)
    setScanning(true)
    setTimeout(() => setShowDetails(true), 300)

    return () => {
      window.removeEventListener('resize', checkMobile)
      clearInterval(glowInterval)
      clearInterval(particleInterval)
    }
  }, [createParticle, isMobile])

  // Memoize forecast items to prevent unnecessary re-renders
  const forecastItems = useMemo(() => {
    return weatherData?.forecast.map((day, index) => (
      <div
        key={index}
        className={`rounded-xl border border-emerald-500/20 bg-emerald-950/30 p-2 transition-all duration-300 hover:border-emerald-500/40 hover:bg-emerald-900/50 sm:p-3 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
        style={{ transitionDelay: `${300 + index * 100}ms` }}
      >
        <div className='flex flex-col items-center'>
          <div className='mb-1 text-xs font-medium text-slate-300/90 sm:mb-2 sm:text-sm'>{day.day}</div>
          <div className='my-1 flex justify-center sm:my-2'>
            <div className='scale-75 sm:scale-100'>
              <WeatherIcon condition={day.condition} />
            </div>
          </div>
          <div className='text-base font-bold text-slate-200 sm:text-lg'>{day.temperature}°C</div>
        </div>
      </div>
    ))
  }, [weatherData?.forecast, showDetails])

  return (
    <div
      className={cn(
        'flex min-h-[500px] w-full items-center justify-center overflow-hidden rounded-xl',
        'bg-gradient-to-b from-emerald-950 to-slate-950 p-4 sm:rounded-3xl sm:p-6'
      )}
    >
      <div className='relative w-full max-w-lg'>
        {/* Ambient background effects - simplified */}
        <div className='absolute top-0 right-0 -z-10 h-48 w-48 rounded-full bg-emerald-800/10 sm:h-64 sm:w-64'></div>

        {/* Main container */}
        <div
          className={`relative overflow-hidden rounded-2xl border border-emerald-500/30 transition-all duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Simplified background with gradient */}
          <div className='absolute inset-0 z-0 bg-gradient-to-b from-emerald-950/90 via-slate-950/95 to-emerald-950/90'></div>

          {/* Animated scanning effect */}
          <div
            className={`absolute inset-0 h-full w-full bg-gradient-to-b from-transparent via-emerald-500/35 to-transparent transition-all duration-700 ease-in-out ${scanning ? 'translate-y-full' : '-translate-y-full'}`}
          ></div>

          {/* Particles container */}
          <div ref={particlesRef} className='pointer-events-none absolute inset-0 overflow-hidden bg-emerald-500/5'></div>

          {/* Header section */}
          <div className='relative z-10 border-b border-emerald-500/30 p-4 sm:p-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <div className='relative'>
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border border-emerald-500/50 bg-emerald-900 transition-all duration-300 sm:h-10 sm:w-10 ${
                      glowing ? 'shadow-lg shadow-emerald-400/30' : ''
                    }`}
                  >
                    <CloudSun className={`h-4 w-4 text-emerald-400 transition-all duration-300 sm:h-5 sm:w-5 ${glowing ? 'animate-pulse' : ''}`} />
                    {glowing && <div className='absolute inset-0 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-emerald-400/40'></div>}
                  </div>
                  <div className='absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 sm:h-5 sm:w-5'>
                    <div className='h-2 w-2 rounded-full bg-emerald-500 sm:h-2.5 sm:w-2.5'></div>
                  </div>
                </div>
                <div>
                  <h3 className='bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-lg font-bold text-transparent sm:text-xl'>Thời tiết</h3>
                  <div className='mt-1 flex items-center text-xs text-emerald-500/70'>
                    <span>Đom Đóm AI</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Location info with enhanced style */}
            <div className={`mt-4 transition-all duration-300 sm:mt-5 ${showDetails ? 'opacity-100' : 'opacity-0'}`}>
              <div className='mb-1 flex items-center space-x-2 text-xs text-slate-300/80'>
                <div className='h-px flex-grow bg-gradient-to-r from-emerald-500/50 to-transparent'></div>
                <span>THÔNG TIN KHU VỰC</span>
                <div className='h-px flex-grow bg-gradient-to-l from-emerald-500/50 to-transparent'></div>
              </div>

              <div className='mt-2 grid grid-cols-2 gap-2 sm:gap-3'>
                <div className='rounded-lg border border-emerald-500/20 bg-emerald-900/30 p-2 sm:p-2.5'>
                  <div className='flex items-center space-x-1 sm:space-x-2'>
                    <MapPin className='h-3 w-3 text-emerald-500/70 sm:h-3.5 sm:w-3.5' />
                    <div className='text-[9px] text-emerald-500/70 uppercase sm:text-[10px]'>Vị trí</div>
                  </div>
                  <div className='mt-1 truncate text-xs font-medium text-slate-300/90 sm:text-sm'>{weatherData?.location}</div>
                </div>
                <div className='rounded-lg border border-emerald-500/20 bg-emerald-900/30 p-2 sm:p-2.5'>
                  <div className='flex items-center space-x-1 sm:space-x-2'>
                    <Clock className='h-3 w-3 text-emerald-500/70 sm:h-3.5 sm:w-3.5' />
                    <div className='text-[9px] text-emerald-500/70 uppercase sm:text-[10px]'>Giờ</div>
                  </div>
                  <div className='mt-1 truncate text-xs font-medium text-slate-300/90 sm:text-sm'>{weatherData?.time}</div>
                </div>
              </div>

              <div className='mt-3 flex items-center gap-1'>
                <div className='text-xs font-medium text-slate-300/90'>{weatherData?.date}</div>
              </div>
            </div>
          </div>

          {/* Current Weather Section */}
          <div className='relative z-10 border-b border-emerald-500/30 p-4 sm:p-6'>
            <div
              className={`mb-3 flex items-center space-x-2 text-xs text-slate-300/80 transition-all duration-300 sm:mb-4 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className='h-px flex-grow bg-gradient-to-r from-emerald-500/50 to-transparent'></div>
              <span>THỜI TIẾT HIỆN TẠI</span>
              <div className='h-px flex-grow bg-gradient-to-l from-emerald-500/50 to-transparent'></div>
            </div>

            <div className={`flex items-center justify-between transition-all duration-300 ${showDetails ? 'opacity-100' : 'opacity-0'}`}>
              <div className='flex flex-col items-start'>
                <div className='text-4xl font-bold text-slate-200 sm:text-5xl'>{weatherData?.temperature}°C</div>
                <div className='mt-1 text-base text-slate-300/90 sm:text-lg'>{weatherData?.condition}</div>

                <div className='mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:mt-4 sm:gap-x-6 sm:gap-y-3'>
                  <div className='flex items-center space-x-1 sm:space-x-2'>
                    <Droplets className='h-3.5 w-3.5 text-emerald-500/70 sm:h-4 sm:w-4' />
                    <span className='text-xs text-slate-300/90 sm:text-sm'>
                      <span className='mr-1 text-emerald-500/70'>Độ ẩm:</span>
                      {weatherData?.humidity}%
                    </span>
                  </div>
                  <div className='flex items-center space-x-1 sm:space-x-2'>
                    <Wind className='h-3.5 w-3.5 text-emerald-500/70 sm:h-4 sm:w-4' />
                    <span className='text-xs text-slate-300/90 sm:text-sm'>
                      <span className='mr-1 text-emerald-500/70'>Tốc độ gió:</span>
                      {weatherData?.windSpeed} km/h
                    </span>
                  </div>
                </div>
              </div>

              <div className='relative'>
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-900/50 p-2 ${
                    glowing ? 'shadow-lg shadow-emerald-400/30' : ''
                  }`}
                >
                  <WeatherIcon condition={mainConditionType} size='large' />
                  {glowing && <div className='absolute inset-0 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-emerald-400/20'></div>}
                </div>
              </div>
            </div>
          </div>

          {/* Forecast Section */}
          <div className='relative z-10 p-4 sm:p-6'>
            <div
              className={`mb-3 flex items-center space-x-2 text-xs text-slate-300/80 transition-all duration-300 sm:mb-4 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className='h-px flex-grow bg-gradient-to-r from-emerald-500/50 to-transparent'></div>
              <span>DỰ BÁO THỜI TIẾT</span>
              <div className='h-px flex-grow bg-gradient-to-l from-emerald-500/50 to-transparent'></div>
            </div>

            <div className='grid grid-cols-3 gap-2 sm:gap-3'>{forecastItems}</div>
          </div>

          {/* Simplified decorative elements */}
          <div className='absolute bottom-0 left-0 -z-10 h-32 w-32 rounded-full bg-emerald-900/10 sm:h-40 sm:w-40'></div>

          {/* Scan lines effect - simplified */}
          <div className='pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(transparent_0%,rgba(16,185,129,0.05)_50%,transparent_100%)] bg-[size:100%_4px]'></div>

          {/* Simplified glitch effect */}
          <div className='pointer-events-none absolute inset-0 z-20 opacity-30 mix-blend-overlay'>
            <div
              className='absolute inset-0 animate-pulse'
              style={{
                backgroundImage: 'linear-gradient(0deg, transparent 0%, rgba(16, 185, 129, 0.1) 2%, transparent 3%)',
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                animation: 'glitch 4s infinite'
              }}
            ></div>
          </div>

          {/* Simplified shimmer effect */}
          <div className='pointer-events-none absolute inset-0 z-10 opacity-20'>
            <div
              className='absolute inset-0'
              style={{
                backgroundImage: 'linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.2), transparent)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 8s infinite linear'
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(WeatherTemplate)
