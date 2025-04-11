'use client'

import { Clock, Cloud, CloudSun, Droplets, MapPin, Sun, Wind } from 'lucide-react'
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react'

interface ForecastDay {
  day: string
  temperature: number | null
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

const DEFAULT_WEATHER_DATA: WeatherData = {
  location: 'Hà Nội',
  date: 'Thứ Năm, 03/04/2025',
  time: '15:30',
  temperature: 27,
  condition: 'Mây rải rác',
  humidity: 75,
  windSpeed: 12,
  forecast: [
    { day: 'Thứ Sáu', temperature: 26, condition: 'cloudy' },
    { day: 'Thứ Bảy', temperature: 27, condition: 'partly_cloudy' },
    { day: 'Chủ Nhật', temperature: 28, condition: 'sunny' }
  ]
}

// Weather icon components to avoid recreating on each render
const WeatherIcon = React.memo(({ condition, size = 'small' }: { condition: string; size?: 'small' | 'large' }) => {
  const iconProps = size === 'large' ? { className: 'h-16 w-16 text-white/80' } : { className: 'h-6 w-6 text-white/80' }

  switch (condition) {
    case 'sunny':
      return <Sun {...{ ...iconProps, className: iconProps.className.replace('text-white/80', 'text-yellow-300') }} />
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

const WeatherTemplate: React.FC<{ weatherData?: WeatherData; isLoading?: boolean }> = ({ weatherData = DEFAULT_WEATHER_DATA }) => {
  const [loaded, setLoaded] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [glowing, setGlowing] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const particlesRef = useRef<HTMLDivElement>(null)

  // Determine main condition icon only when weatherData changes
  const mainConditionType = useMemo(() => {
    const condition = weatherData.condition?.toLowerCase() || ''
    if (condition.includes('mây')) return 'partly_cloudy'
    if (condition.includes('mưa')) return 'rainy'
    if (condition.includes('nắng')) return 'sunny'
    return 'partly_cloudy'
  }, [weatherData.condition])

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
    return weatherData.forecast.map((day, index) => (
      <div
        key={index}
        className={`rounded-xl border border-[#2EAF5D]/20 bg-[#1A2E22]/30 p-2 transition-all duration-300 hover:border-[#2EAF5D]/40 hover:bg-[#1A2E22]/50 sm:p-3 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
        style={{ transitionDelay: `${300 + index * 100}ms` }}
      >
        <div className='flex flex-col items-center'>
          <div className='mb-1 text-xs font-medium text-white/90 sm:mb-2 sm:text-sm'>{day.day}</div>
          <div className='my-1 flex justify-center sm:my-2'>
            <div className='scale-75 sm:scale-100'>
              <WeatherIcon condition={day.condition} />
            </div>
          </div>
          <div className='text-base font-bold text-white sm:text-lg'>{day.temperature}°C</div>
        </div>
      </div>
    ))
  }, [weatherData.forecast, showDetails])

  return (
    <div className='flex min-h-[400px] w-full items-center justify-center rounded-3xl bg-gradient-to-b from-[#1A2E22] to-[#0F1A15] p-3 sm:min-h-[500px] sm:p-6'>
      <div className='relative w-full max-w-md transition-all duration-300'>
        {/* Main container */}
        <div className={`relative overflow-hidden rounded-2xl border border-[#2EAF5D]/30 transition-all duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          {/* Enhanced background with gradient */}
          <div className='absolute inset-0 z-0 bg-gradient-to-b from-[#1A2E22]/80 via-[#0F1A15]/90 to-[#0F1A15]/80'></div>

          {/* Animated scanning effect */}
          <div
            className={`absolute inset-0 h-full w-full bg-gradient-to-b from-transparent via-[#2EAF5D]/35 to-transparent transition-all duration-700 ease-in-out ${scanning ? 'translate-y-full' : '-translate-y-full'}`}
          ></div>

          {/* Particles container */}
          <div ref={particlesRef} className='pointer-events-none absolute inset-0 overflow-hidden bg-[#2EAF5D]/5'></div>

          {/* Header section */}
          <div className='relative z-10 border-b border-[#2EAF5D]/30 p-4 sm:p-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <div className='relative'>
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border border-[#2EAF5D]/50 bg-[#1A2E22] transition-all duration-300 sm:h-10 sm:w-10 ${
                      glowing ? 'shadow-lg shadow-[#2EAF5D]/30' : ''
                    }`}
                  >
                    <CloudSun className={`h-4 w-4 text-[#2EAF5D] transition-all duration-300 sm:h-5 sm:w-5 ${glowing ? 'animate-pulse' : ''}`} />
                    {glowing && <div className='absolute inset-0 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-[#2EAF5D]/40 blur-md'></div>}
                  </div>
                  <div className='absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white sm:h-5 sm:w-5'>
                    <div className='h-2 w-2 rounded-full bg-[#2EAF5D] sm:h-2.5 sm:w-2.5'></div>
                  </div>
                </div>
                <div>
                  <h3 className='text-lg font-bold text-white sm:text-xl'>Thời tiết</h3>
                  <div className='mt-1 flex items-center text-xs text-[#2EAF5D]/70'>
                    <span>Đom Đóm AI</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Location info with enhanced style */}
            <div className={`mt-4 transition-all duration-300 sm:mt-5 ${showDetails ? 'opacity-100' : 'opacity-0'}`}>
              <div className='mb-1 flex items-center space-x-2 text-xs text-white/80'>
                <div className='h-px flex-grow bg-gradient-to-r from-[#2EAF5D]/50 to-transparent'></div>
                <span>THÔNG TIN KHU VỰC</span>
                <div className='h-px flex-grow bg-gradient-to-l from-[#2EAF5D]/50 to-transparent'></div>
              </div>

              <div className='mt-2 grid grid-cols-2 gap-2 sm:gap-3'>
                <div className='rounded-lg border border-[#2EAF5D]/20 bg-[#1A2E22]/30 p-2 sm:p-2.5'>
                  <div className='flex items-center space-x-1 sm:space-x-2'>
                    <MapPin className='h-3 w-3 text-[#2EAF5D]/70 sm:h-3.5 sm:w-3.5' />
                    <div className='text-[9px] text-[#2EAF5D]/70 uppercase sm:text-[10px]'>Vị trí</div>
                  </div>
                  <div className='mt-1 truncate text-xs font-medium text-white/90 sm:text-sm'>{weatherData.location}</div>
                </div>
                <div className='rounded-lg border border-[#2EAF5D]/20 bg-[#1A2E22]/30 p-2 sm:p-2.5'>
                  <div className='flex items-center space-x-1 sm:space-x-2'>
                    <Clock className='h-3 w-3 text-[#2EAF5D]/70 sm:h-3.5 sm:w-3.5' />
                    <div className='text-[9px] text-[#2EAF5D]/70 uppercase sm:text-[10px]'>Giờ</div>
                  </div>
                  <div className='mt-1 truncate text-xs font-medium text-white/90 sm:text-sm'>{weatherData.time}</div>
                </div>
              </div>

              <div className='mt-3 flex items-center gap-1'>
                <div className='text-xs font-medium text-white/90'>{weatherData.date}</div>
              </div>
            </div>
          </div>

          {/* Current Weather Section */}
          <div className='relative z-10 border-b border-[#2EAF5D]/30 p-4 sm:p-6'>
            <div
              className={`mb-3 flex items-center space-x-2 text-xs text-white/80 transition-all duration-300 sm:mb-4 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className='h-px flex-grow bg-gradient-to-r from-[#2EAF5D]/50 to-transparent'></div>
              <span>THỜI TIẾT HIỆN TẠI</span>
              <div className='h-px flex-grow bg-gradient-to-l from-[#2EAF5D]/50 to-transparent'></div>
            </div>

            <div className={`flex items-center justify-between transition-all duration-300 ${showDetails ? 'opacity-100' : 'opacity-0'}`}>
              <div className='flex flex-col items-start'>
                <div className='text-4xl font-bold text-white sm:text-5xl'>{weatherData.temperature}°C</div>
                <div className='mt-1 text-base text-white/90 sm:text-lg'>{weatherData.condition}</div>

                <div className='mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:mt-4 sm:gap-x-6 sm:gap-y-3'>
                  <div className='flex items-center space-x-1 sm:space-x-2'>
                    <Droplets className='h-3.5 w-3.5 text-[#2EAF5D]/70 sm:h-4 sm:w-4' />
                    <span className='text-xs text-white/90 sm:text-sm'>
                      <span className='mr-1 text-[#2EAF5D]/70'>Độ ẩm:</span>
                      {weatherData.humidity}%
                    </span>
                  </div>
                  <div className='flex items-center space-x-1 sm:space-x-2'>
                    <Wind className='h-3.5 w-3.5 text-[#2EAF5D]/70 sm:h-4 sm:w-4' />
                    <span className='text-xs text-white/90 sm:text-sm'>
                      <span className='mr-1 text-[#2EAF5D]/70'>Tốc độ gió:</span>
                      {weatherData.windSpeed} km/h
                    </span>
                  </div>
                </div>
              </div>

              <div className='relative'>
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full border border-[#2EAF5D]/30 bg-[#1A2E22]/50 p-2 ${
                    glowing ? 'shadow-lg shadow-[#2EAF5D]/30' : ''
                  }`}
                >
                  <WeatherIcon condition={mainConditionType} size='large' />
                  {glowing && <div className='absolute inset-0 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-[#2EAF5D]/20 blur-md'></div>}
                </div>
              </div>
            </div>
          </div>

          {/* Forecast Section */}
          <div className='relative z-10 p-4 sm:p-6'>
            <div
              className={`mb-3 flex items-center space-x-2 text-xs text-white/80 transition-all duration-300 sm:mb-4 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className='h-px flex-grow bg-gradient-to-r from-[#2EAF5D]/50 to-transparent'></div>
              <span>DỰ BÁO THỜI TIẾT</span>
              <div className='h-px flex-grow bg-gradient-to-l from-[#2EAF5D]/50 to-transparent'></div>
            </div>

            <div className='grid grid-cols-3 gap-2 sm:gap-3'>{forecastItems}</div>
          </div>

          {/* Enhanced decorative elements */}
          <div className='absolute top-0 right-0 -z-10 h-32 w-32 rounded-full bg-white/10 blur-3xl sm:h-40 sm:w-40'></div>
          <div className='absolute bottom-0 left-0 -z-10 h-32 w-32 rounded-full bg-white/10 blur-3xl sm:h-40 sm:w-40'></div>

          {/* Scan lines effect */}
          <div className='pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(transparent_0%,rgba(46,175,93,0.05)_50%,transparent_100%)] bg-[size:100%_4px]'></div>

          {/* Enhanced glitch effect */}
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

          {/* Shimmer effect */}
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
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(-120px) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes glitch {
          0% {
            opacity: 0;
          }
          7% {
            opacity: 0.4;
          }
          10% {
            opacity: 0;
          }
          27% {
            opacity: 0;
          }
          30% {
            opacity: 0.4;
          }
          35% {
            opacity: 0;
          }
          92% {
            opacity: 0;
          }
          95% {
            opacity: 0.4;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.08);
          }
        }

        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  )
}

export default React.memo(WeatherTemplate)
