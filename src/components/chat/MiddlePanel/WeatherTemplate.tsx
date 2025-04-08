'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Cloud, CloudSun, Droplets, Sun, Wind, Thermometer, MapPin, Clock, RefreshCw, Maximize2 } from 'lucide-react'

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

const WeatherTemplate: React.FC<{ weatherData?: WeatherData }> = ({
  weatherData = {
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
}) => {
  const [loaded, setLoaded] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Function to determine weather icon based on condition
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className='h-6 w-6 text-yellow-300' />
      case 'partly_cloudy':
        return <CloudSun className='h-6 w-6 text-cyan-200' />
      case 'cloudy':
        return <Cloud className='h-6 w-6 text-cyan-200' />
      case 'rainy':
        return <Droplets className='h-6 w-6 text-cyan-200' />
      case 'windy':
        return <Wind className='h-6 w-6 text-cyan-200' />
      default:
        return <CloudSun className='h-6 w-6 text-cyan-200' />
    }
  }

  // Get main weather icon with larger size
  const getMainWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className='h-16 w-16 text-yellow-300' />
      case 'partly_cloudy':
        return <CloudSun className='h-16 w-16 text-cyan-200' />
      case 'cloudy':
        return <Cloud className='h-16 w-16 text-cyan-200' />
      case 'rainy':
        return <Droplets className='h-16 w-16 text-cyan-200' />
      case 'windy':
        return <Wind className='h-16 w-16 text-cyan-200' />
      default:
        return <CloudSun className='h-16 w-16 text-cyan-200' />
    }
  }

  // Determine main condition icon
  const mainConditionType = weatherData.condition?.toLowerCase().includes('mây')
    ? 'partly_cloudy'
    : weatherData.condition?.toLowerCase().includes('mưa')
      ? 'rainy'
      : weatherData.condition?.toLowerCase().includes('nắng')
        ? 'sunny'
        : 'partly_cloudy'

  // Simulate loading sequence
  useEffect(() => {
    const timer1 = setTimeout(() => setLoaded(true), 500)
    const timer2 = setTimeout(() => setScanning(true), 1500)
    const timer3 = setTimeout(() => setShowDetails(true), 2500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  return (
    <div className='perspective-1000 flex min-h-[500px] w-full items-center justify-center rounded-3xl bg-gradient-to-b from-cyan-950 to-slate-950 p-6'>
      <div className='relative w-full max-w-md transform-gpu transition-all duration-300'>
        {/* Background elements */}
        <div className='absolute inset-0 -z-10'>
          <div className='absolute top-0 left-1/2 h-40 w-full -translate-x-1/2 rounded-full bg-cyan-500 opacity-20 blur-[100px]'></div>
          <div className='absolute bottom-0 left-1/2 h-40 w-full -translate-x-1/2 rounded-full bg-purple-500 opacity-20 blur-[100px]'></div>
        </div>

        {/* Grid lines */}
        <div className='absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]'></div>

        {/* Main holographic container */}
        <div
          className={`relative overflow-hidden rounded-2xl border border-cyan-500/30 backdrop-blur-sm transition-all duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Holographic overlay effect */}
          <div className='absolute inset-0 z-0 bg-gradient-to-b from-cyan-950/80 via-slate-900/90 to-purple-950/80'></div>
          <div className="absolute inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDEwIDAgTCAwIDAgTCAwIDEwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMCwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

          {/* Scanning effect */}
          <div
            className={`absolute inset-0 z-0 h-full w-full bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent transition-all duration-1000 ease-in-out ${scanning ? 'translate-y-full' : '-translate-y-full'}`}
          ></div>

          {/* Header section */}
          <div className='relative z-10 border-b border-cyan-500/30 p-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <div className='relative'>
                  <div className='absolute inset-0 animate-pulse rounded-full bg-cyan-500 blur-md'></div>
                  <div className='relative flex h-10 w-10 items-center justify-center rounded-full border border-cyan-500/50 bg-cyan-950'>
                    <CloudSun className='h-5 w-5 text-cyan-400' />
                  </div>
                </div>
                <div>
                  <h3 className='bg-gradient-to-r from-cyan-300 to-cyan-100 bg-clip-text text-xl font-bold text-transparent'>Thời tiết</h3>
                  <div className='mt-1 flex items-center text-xs text-cyan-400/70'>
                    <div className='mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400'></div>
                    <span>Đom Đóm AI</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Location info with futuristic style */}
            <div className={`mt-5 transition-all delay-500 duration-1000 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className='mb-1 flex items-center space-x-2 text-xs text-cyan-300/90'>
                <div className='h-px flex-grow bg-gradient-to-r from-cyan-500/50 to-transparent'></div>
                <span>THÔNG TIN KHU VỰC</span>
                <div className='h-px flex-grow bg-gradient-to-l from-cyan-500/50 to-transparent'></div>
              </div>

              <div className='mt-2 grid grid-cols-2 gap-3'>
                <div className='rounded-lg border border-cyan-500/20 bg-cyan-950/30 p-2.5'>
                  <div className='flex items-center space-x-2'>
                    <MapPin className='h-3.5 w-3.5 text-cyan-400/70' />
                    <div className='text-[10px] text-cyan-400/70 uppercase'>Vị trí</div>
                  </div>
                  <div className='mt-1 truncate text-sm font-medium text-cyan-100'>{weatherData.location}</div>
                </div>
                <div className='rounded-lg border border-cyan-500/20 bg-cyan-950/30 p-2.5'>
                  <div className='flex items-center space-x-2'>
                    <Clock className='h-3.5 w-3.5 text-cyan-400/70' />
                    <div className='text-[10px] text-cyan-400/70 uppercase'>Giờ</div>
                  </div>
                  <div className='mt-1 truncate text-sm font-medium text-cyan-100'>{weatherData.time}</div>
                </div>
              </div>

              <div className='mt-3 flex items-center justify-between'>
                <div className='text-[10px] text-cyan-400/70 uppercase'>Ngày</div>
                <div className='text-xs font-medium text-cyan-100'>{weatherData.date}</div>
              </div>
            </div>
          </div>

          {/* Current Weather Section */}
          <div className='relative z-10 border-b border-cyan-500/30 p-6'>
            <div
              className={`mb-4 flex items-center space-x-2 text-xs text-cyan-300/90 transition-all delay-700 duration-1000 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className='h-px flex-grow bg-gradient-to-r from-cyan-500/50 to-transparent'></div>
              <span>THỜI TIẾT HIỆN TẠI</span>
              <div className='h-px flex-grow bg-gradient-to-l from-cyan-500/50 to-transparent'></div>
            </div>

            <div
              className={`flex items-center justify-between transition-all delay-800 duration-1000 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            >
              <div className='flex flex-col items-start'>
                <div className='bg-gradient-to-r from-cyan-300 to-cyan-100 bg-clip-text text-5xl font-bold text-transparent'>{weatherData.temperature}°C</div>
                <div className='mt-1 text-lg text-cyan-200'>{weatherData.condition}</div>

                <div className='mt-4 grid grid-cols-2 gap-x-6 gap-y-3'>
                  <div className='flex items-center space-x-2'>
                    <Droplets className='h-4 w-4 text-cyan-400/70' />
                    <span className='text-sm text-cyan-100'>
                      <span className='mr-1 text-cyan-400/70'>Độ ẩm:</span>
                      {weatherData.humidity}%
                    </span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Wind className='h-4 w-4 text-cyan-400/70' />
                    <span className='text-sm text-cyan-100'>
                      <span className='mr-1 text-cyan-400/70'>Tốc độ gió:</span>
                      {weatherData.windSpeed} km/h
                    </span>
                  </div>
                </div>
              </div>

              <div className='relative'>
                <div className='absolute inset-0 rounded-full bg-cyan-500/20 blur-xl'></div>
                <div className='relative flex h-10 w-10 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-950/50'>
                  {getMainWeatherIcon(mainConditionType)}
                </div>
              </div>
            </div>
          </div>

          {/* Forecast Section */}
          <div className='relative z-10 p-6'>
            <div
              className={`mb-4 flex items-center space-x-2 text-xs text-cyan-300/90 transition-all delay-900 duration-1000 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className='h-px flex-grow bg-gradient-to-r from-cyan-500/50 to-transparent'></div>
              <span>DỰ BÁO THỜI TIẾT</span>
              <div className='h-px flex-grow bg-gradient-to-l from-cyan-500/50 to-transparent'></div>
            </div>

            <div className='grid grid-cols-3 gap-3'>
              {weatherData.forecast.map((day, index) => (
                <div
                  key={index}
                  className={`group relative overflow-hidden rounded-xl border border-cyan-500/20 bg-cyan-950/30 p-3 transition-all duration-500 hover:border-cyan-400/40 hover:bg-cyan-900/30 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                  style={{ transitionDelay: `${1000 + index * 200}ms` }}
                >
                  {/* Decorative corners */}
                  <div className='absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan-400/50'></div>
                  <div className='absolute right-0 bottom-0 h-2 w-2 border-r border-b border-cyan-400/50'></div>

                  {/* Animated highlight effect */}
                  <div className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent transition-transform duration-1500 ease-in-out group-hover:translate-x-full'></div>

                  <div className='relative z-10 flex flex-col items-center'>
                    <div className='mb-2 text-sm font-medium text-cyan-100'>{day.day}</div>
                    <div className='my-2 flex justify-center'>{getWeatherIcon(day.condition)}</div>
                    <div className='bg-gradient-to-r from-cyan-300 to-cyan-100 bg-clip-text text-lg font-bold text-transparent'>{day.temperature}°C</div>
                  </div>
                </div>
              ))}
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

export default WeatherTemplate
