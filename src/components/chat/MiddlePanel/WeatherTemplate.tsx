'use client'

import { Clock, Cloud, CloudSun, Droplets, MapPin, Sun, Wind } from 'lucide-react'
import React, { useEffect, useState, useMemo } from 'react'

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
  const iconProps = size === 'large' ? { className: 'h-16 w-16 text-cyan-200' } : { className: 'h-6 w-6 text-cyan-200' }

  switch (condition) {
    case 'sunny':
      return <Sun {...{ ...iconProps, className: iconProps.className.replace('text-cyan-200', 'text-yellow-300') }} />
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

  // Determine main condition icon only when weatherData changes
  const mainConditionType = useMemo(() => {
    const condition = weatherData.condition?.toLowerCase() || ''
    if (condition.includes('mây')) return 'partly_cloudy'
    if (condition.includes('mưa')) return 'rainy'
    if (condition.includes('nắng')) return 'sunny'
    return 'partly_cloudy'
  }, [weatherData.condition])

  // Simplified loading sequence
  useEffect(() => {
    const loadTimer = setTimeout(() => setLoaded(true), 300)
    const detailsTimer = setTimeout(() => setShowDetails(true), 600)

    return () => {
      clearTimeout(loadTimer)
      clearTimeout(detailsTimer)
    }
  }, [])

  // Memoize forecast items to prevent unnecessary re-renders
  const forecastItems = useMemo(() => {
    return weatherData.forecast.map((day, index) => (
      <div
        key={index}
        className={`rounded-xl border border-cyan-500/20 bg-cyan-950/30 p-2 transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-900/30 sm:p-3 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
        style={{ transitionDelay: `${300 + index * 100}ms` }}
      >
        <div className='flex flex-col items-center'>
          <div className='mb-1 text-xs font-medium text-cyan-100 sm:mb-2 sm:text-sm'>{day.day}</div>
          <div className='my-1 flex justify-center sm:my-2'>
            <div className='scale-75 sm:scale-100'>
              <WeatherIcon condition={day.condition} />
            </div>
          </div>
          <div className='text-base font-bold text-cyan-200 sm:text-lg'>{day.temperature}°C</div>
        </div>
      </div>
    ))
  }, [weatherData.forecast, showDetails])

  return (
    <div className='flex min-h-[400px] w-full items-center justify-center rounded-3xl bg-gradient-to-b from-cyan-950 to-slate-950 p-3 sm:min-h-[500px] sm:p-6'>
      <div className='relative w-full max-w-md transition-all duration-300'>
        {/* Main container */}
        <div className={`relative overflow-hidden rounded-2xl border border-cyan-500/30 transition-all duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          {/* Simple background */}
          <div className='absolute inset-0 z-0 bg-gradient-to-b from-cyan-950/80 via-slate-900/90 to-purple-950/80'></div>

          {/* Header section */}
          <div className='relative z-10 border-b border-cyan-500/30 p-4 sm:p-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <div className='relative'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full border border-cyan-500/50 bg-cyan-950 sm:h-10 sm:w-10'>
                    <CloudSun className='h-4 w-4 text-cyan-400 sm:h-5 sm:w-5' />
                  </div>
                </div>
                <div>
                  <h3 className='text-lg font-bold text-cyan-200 sm:text-xl'>Thời tiết</h3>
                  <div className='mt-1 flex items-center text-xs text-cyan-400/70'>
                    <span>Đom Đóm AI</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Location info with simplified style */}
            <div className={`mt-4 transition-all duration-300 sm:mt-5 ${showDetails ? 'opacity-100' : 'opacity-0'}`}>
              <div className='mb-1 flex items-center space-x-2 text-xs text-cyan-300/90'>
                <div className='h-px flex-grow bg-gradient-to-r from-cyan-500/50 to-transparent'></div>
                <span>THÔNG TIN KHU VỰC</span>
                <div className='h-px flex-grow bg-gradient-to-l from-cyan-500/50 to-transparent'></div>
              </div>

              <div className='mt-2 grid grid-cols-2 gap-2 sm:gap-3'>
                <div className='rounded-lg border border-cyan-500/20 bg-cyan-950/30 p-2 sm:p-2.5'>
                  <div className='flex items-center space-x-1 sm:space-x-2'>
                    <MapPin className='h-3 w-3 text-cyan-400/70 sm:h-3.5 sm:w-3.5' />
                    <div className='text-[9px] text-cyan-400/70 uppercase sm:text-[10px]'>Vị trí</div>
                  </div>
                  <div className='mt-1 truncate text-xs font-medium text-cyan-100 sm:text-sm'>{weatherData.location}</div>
                </div>
                <div className='rounded-lg border border-cyan-500/20 bg-cyan-950/30 p-2 sm:p-2.5'>
                  <div className='flex items-center space-x-1 sm:space-x-2'>
                    <Clock className='h-3 w-3 text-cyan-400/70 sm:h-3.5 sm:w-3.5' />
                    <div className='text-[9px] text-cyan-400/70 uppercase sm:text-[10px]'>Giờ</div>
                  </div>
                  <div className='mt-1 truncate text-xs font-medium text-cyan-100 sm:text-sm'>{weatherData.time}</div>
                </div>
              </div>

              <div className='mt-3 flex items-center gap-1'>
                <div className='text-xs font-medium text-cyan-100'>{weatherData.date}</div>
              </div>
            </div>
          </div>

          {/* Current Weather Section */}
          <div className='relative z-10 border-b border-cyan-500/30 p-4 sm:p-6'>
            <div
              className={`mb-3 flex items-center space-x-2 text-xs text-cyan-300/90 transition-all duration-300 sm:mb-4 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className='h-px flex-grow bg-gradient-to-r from-cyan-500/50 to-transparent'></div>
              <span>THỜI TIẾT HIỆN TẠI</span>
              <div className='h-px flex-grow bg-gradient-to-l from-cyan-500/50 to-transparent'></div>
            </div>

            <div className={`flex items-center justify-between transition-all duration-300 ${showDetails ? 'opacity-100' : 'opacity-0'}`}>
              <div className='flex flex-col items-start'>
                <div className='text-4xl font-bold text-cyan-200 sm:text-5xl'>{weatherData.temperature}°C</div>
                <div className='mt-1 text-base text-cyan-200 sm:text-lg'>{weatherData.condition}</div>

                <div className='mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:mt-4 sm:gap-x-6 sm:gap-y-3'>
                  <div className='flex items-center space-x-1 sm:space-x-2'>
                    <Droplets className='h-3.5 w-3.5 text-cyan-400/70 sm:h-4 sm:w-4' />
                    <span className='text-xs text-cyan-100 sm:text-sm'>
                      <span className='mr-1 text-cyan-400/70'>Độ ẩm:</span>
                      {weatherData.humidity}%
                    </span>
                  </div>
                  <div className='flex items-center space-x-1 sm:space-x-2'>
                    <Wind className='h-3.5 w-3.5 text-cyan-400/70 sm:h-4 sm:w-4' />
                    <span className='text-xs text-cyan-100 sm:text-sm'>
                      <span className='mr-1 text-cyan-400/70'>Tốc độ gió:</span>
                      {weatherData.windSpeed} km/h
                    </span>
                  </div>
                </div>
              </div>

              <div className='relative'>
                <div className='flex h-14 w-14 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-950/50 p-2'>
                  <WeatherIcon condition={mainConditionType} size='large' />
                </div>
              </div>
            </div>
          </div>

          {/* Forecast Section */}
          <div className='relative z-10 p-4 sm:p-6'>
            <div
              className={`mb-3 flex items-center space-x-2 text-xs text-cyan-300/90 transition-all duration-300 sm:mb-4 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className='h-px flex-grow bg-gradient-to-r from-cyan-500/50 to-transparent'></div>
              <span>DỰ BÁO THỜI TIẾT</span>
              <div className='h-px flex-grow bg-gradient-to-l from-cyan-500/50 to-transparent'></div>
            </div>

            <div className='grid grid-cols-3 gap-2 sm:gap-3'>{forecastItems}</div>
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
                animation: 'glitch 2s infinite'
              }}
            ></div>
          </div>
        </div>
      </div>

      <style jsx>{`
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
          27% {
            opacity: 0;
          }
          30% {
            opacity: 0.3;
          }
          35% {
            opacity: 0;
          }
          52% {
            opacity: 0;
          }
          55% {
            opacity: 0.3;
          }
          60% {
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

        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  )
}

export default React.memo(WeatherTemplate)
