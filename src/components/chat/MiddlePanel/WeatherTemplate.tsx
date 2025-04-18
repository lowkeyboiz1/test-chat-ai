'use client'

import { WeatherTemplateProps } from '@/types/templates'
import { Clock, Cloud, CloudSun, Droplets, MapPin, Sun, Wind, Thermometer, Umbrella, BarChart2 } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import '@/lib/animations.css'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

// Weather icon components to avoid recreating on each render
const WeatherIcon = React.memo(({ condition, size = 'small' }: { condition: string; size?: 'small' | 'large' }) => {
  const iconProps = size === 'large' ? { className: 'h-16 w-16 text-emerald-400' } : { className: 'h-6 w-6 text-emerald-400' }

  const Icon = (() => {
    switch (condition) {
      case 'sunny':
        return <Sun {...iconProps} />
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
  })()

  return (
    <div className={`flex items-center justify-center ${size === 'large' ? 'h-16 w-16' : 'h-8 w-8'} relative`}>
      {Icon}
      <div className='absolute inset-0 animate-pulse rounded-full bg-emerald-400/10 blur-[2px]'></div>
    </div>
  )
})

WeatherIcon.displayName = 'WeatherIcon'

// Weather Tag component
const WeatherTag = React.memo(({ label }: { label: string }) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className='inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-950/60 px-2.5 py-1 text-xs font-medium text-emerald-300/90 shadow-sm shadow-emerald-500/10 backdrop-blur-sm'
    whileHover={{ scale: 1.05, backgroundColor: 'rgba(16, 185, 129, 0.2)' }}
  >
    <Cloud className='mr-1 h-3 w-3 text-emerald-400' />
    {label}
  </motion.div>
))

WeatherTag.displayName = 'WeatherTag'

// Weather Stat component
const WeatherStat = React.memo(({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
  <motion.div
    initial={{ y: 5, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.3 }}
    className='group relative overflow-hidden rounded-lg border border-emerald-500/20 bg-emerald-950/40 px-2 py-1.5 backdrop-blur-sm hover:border-emerald-500/40 hover:bg-emerald-900/30 sm:space-x-2'
  >
    <div className='relative z-10 flex items-center space-x-1.5'>
      <div className='rounded-full border border-emerald-500/30 bg-emerald-900/50 p-1'>{icon}</div>
      <span className='text-xs text-emerald-100 sm:text-sm'>
        <span className='mr-1 text-emerald-400/90'>{label}:</span>
        {value}
      </span>
    </div>
    <div className='absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]'></div>
  </motion.div>
))

WeatherStat.displayName = 'WeatherStat'

// Forecast Card component
const ForecastCard = React.memo(({ day, isActive, onClick }: { day: any; isActive: boolean; onClick: () => void }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={cn(
      'group relative overflow-hidden rounded-xl border backdrop-blur-sm transition-all duration-300',
      'border-emerald-500/30 bg-emerald-950/40 p-3',
      isActive
        ? 'border-emerald-400/60 bg-emerald-900/50 shadow-lg shadow-emerald-500/15'
        : 'hover:border-emerald-500/40 hover:bg-emerald-950/50 hover:shadow-md hover:shadow-emerald-500/10'
    )}
  >
    <div className='flex flex-col items-center'>
      <div className='mb-1 text-sm font-medium text-emerald-300/90'>{day.day}</div>
      <div className='my-2 flex justify-center'>
        <WeatherIcon condition={day.condition} />
      </div>
      <div className='text-base font-bold text-emerald-100'>{day.temperature}°C</div>
    </div>
    {isActive && <div className='absolute -inset-1 animate-pulse rounded-full bg-emerald-400/5'></div>}
    <div className='absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]'></div>
  </motion.div>
))

ForecastCard.displayName = 'ForecastCard'

// Detailed Weather component
const DetailedWeather = React.memo(({ data }: { data: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className='relative overflow-hidden rounded-xl border border-emerald-500/30 bg-emerald-950/60 p-4 backdrop-blur-md'
  >
    <div className='flex items-center justify-between'>
      <div>
        <h3 className='bg-gradient-to-r from-emerald-300 to-emerald-100 bg-clip-text text-lg font-semibold text-transparent'>{data.day}</h3>
        <p className='text-sm text-emerald-300/80'>{data.condition}</p>
      </div>
      <div className='relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-900/50 p-2'>
        <WeatherIcon condition={data.condition} size='large' />
        <div className='absolute -inset-1 animate-[ping_4s_ease-in-out_infinite] rounded-full border border-emerald-400/20'></div>
      </div>
    </div>

    <div className='mt-4 grid grid-cols-2 gap-3'>
      <WeatherStat icon={<Thermometer className='h-4 w-4 text-emerald-400/70' />} label='Nhiệt độ' value={`${data.temperature}°C`} />
      <WeatherStat icon={<Droplets className='h-4 w-4 text-emerald-400/70' />} label='Độ ẩm' value='65%' />
      <WeatherStat icon={<Wind className='h-4 w-4 text-emerald-400/70' />} label='Gió' value='12 km/h' />
      <WeatherStat icon={<Umbrella className='h-4 w-4 text-emerald-400/70' />} label='Mưa' value='10%' />
    </div>

    {/* Holographic scan line effect */}
    <div className='pointer-events-none absolute inset-0 z-30 overflow-hidden opacity-10'>
      <div
        className='absolute h-[1px] w-full bg-emerald-400'
        style={{
          animation: 'scanline 3s linear infinite',
          boxShadow: '0 0 10px 2px rgba(52, 211, 153, 0.7)'
        }}
      ></div>
    </div>
  </motion.div>
))

DetailedWeather.displayName = 'DetailedWeather'

const WeatherTemplate: React.FC<WeatherTemplateProps> = ({ weatherData }) => {
  const [loaded, setLoaded] = useState(false)
  const [selectedDay, setSelectedDay] = useState(0)
  const [glowing, setGlowing] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState('current')
  const particlesRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Determine main condition icon only when weatherData changes
  const mainConditionType = useMemo(() => {
    const condition = weatherData?.condition?.toLowerCase() || ''
    if (condition.includes('mây')) return 'partly_cloudy'
    if (condition.includes('mưa')) return 'rainy'
    if (condition.includes('nắng')) return 'sunny'
    return 'partly_cloudy'
  }, [weatherData?.condition])

  // Optimized particle creation
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
    const particleInterval = setInterval(createParticle, isMobile ? 400 : 250)

    setLoaded(true)
    const timer = setTimeout(() => setShowDetails(true), 300)

    return () => {
      window.removeEventListener('resize', checkMobile)
      clearInterval(glowInterval)
      clearInterval(particleInterval)
      clearTimeout(timer)
    }
  }, [createParticle, isMobile])

  // Tab content transition effect
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.opacity = '0'
      contentRef.current.style.transform = 'translateY(15px)'

      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.style.opacity = '1'
          contentRef.current.style.transform = 'translateY(0)'
        }
      }, 180)
    }
  }, [activeTab])

  return (
    <div className='flex min-h-[500px] w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-emerald-950 to-slate-950 p-4 sm:rounded-3xl sm:p-6'>
      <div className='relative w-full'>
        {/* Ambient background effects */}
        <div className='absolute top-0 right-0 -z-10 h-32 w-32 rounded-full bg-emerald-400/10 blur-xl sm:h-40 sm:w-40'></div>
        <div className='absolute bottom-0 left-0 -z-10 h-32 w-32 rounded-full bg-emerald-400/10 blur-xl sm:h-40 sm:w-40'></div>
        <div className='absolute top-1/3 left-1/4 -z-10 h-24 w-24 rounded-full bg-emerald-400/5 blur-xl sm:h-32 sm:w-32'></div>
        <div className='absolute right-1/4 bottom-1/4 -z-10 h-20 w-20 rounded-full bg-emerald-500/5 blur-xl sm:h-28 sm:w-28'></div>

        {/* Main container */}
        <div
          className={`relative overflow-hidden rounded-xl border border-emerald-500/30 backdrop-blur-sm transition-all duration-500 sm:rounded-2xl ${loaded ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className='absolute inset-0 z-0 bg-gradient-to-b from-emerald-950/80 via-slate-900/90 to-emerald-950/80'></div>
          <div ref={particlesRef} className='pointer-events-none absolute inset-0 overflow-hidden bg-emerald-400/5'></div>

          <div className='flex w-full flex-col md:grid md:grid-cols-3'>
            {/* Header section - Enhanced with better styling */}
            <div className='relative z-10 w-full border-b border-emerald-500/30 p-5 md:col-span-3'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  <div
                    className={`relative flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/50 bg-emerald-950 transition-all duration-300 ${
                      glowing ? 'shadow-lg shadow-emerald-400/30' : ''
                    }`}
                  >
                    <CloudSun className={`h-6 w-6 text-emerald-400 ${glowing ? 'animate-pulse' : ''}`} />
                    {glowing && (
                      <>
                        <div className='absolute inset-0 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-emerald-400/40'></div>
                        <div className='absolute -inset-1 animate-[ping_4s_ease-in-out_infinite] rounded-full border border-emerald-400/30'></div>
                      </>
                    )}
                  </div>
                  <div>
                    <h3 className='bg-gradient-to-r from-emerald-300 to-emerald-100 bg-clip-text text-2xl font-bold text-transparent'>Thời tiết</h3>
                    <div className='mt-1 flex items-center space-x-2 text-xs text-emerald-400/70'>
                      <div className='flex items-center'>
                        <div className='mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400'></div>
                        <span>Đom Đóm AI</span>
                      </div>
                      {weatherData?.location && (
                        <>
                          <span className='text-emerald-500/50'>|</span>
                          <span className='text-emerald-300/80'>{weatherData.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <WeatherStat icon={<Clock className='h-4 w-4 text-emerald-400/70' />} label='Cập nhật' value={weatherData?.time} />
                </div>
              </div>
            </div>

            {/* Navigation tabs - sidebar style on desktop, hidden on mobile */}
            <div className='relative z-10 hidden w-full border-r border-emerald-500/30 bg-emerald-950/90 md:col-span-1 md:block'>
              <div className='flex flex-col gap-5 p-6'>
                {[
                  { id: 'current', icon: <CloudSun className='size-4 text-emerald-400' />, label: 'Hiện tại' },
                  { id: 'forecast', icon: <BarChart2 className='size-4 text-emerald-400' />, label: 'Dự báo' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'group relative flex w-full items-center overflow-hidden rounded-md border border-emerald-500/20 px-4 py-2 transition-all duration-300 hover:border-emerald-400/30',
                      activeTab === tab.id
                        ? 'border-emerald-400/40 bg-emerald-900/30 shadow-md shadow-emerald-900/50'
                        : 'bg-emerald-950/30 hover:bg-emerald-900/20'
                    )}
                  >
                    <div className='relative mr-4 flex size-8 flex-shrink-0 items-center justify-center'>
                      <div className={`absolute inset-0 rounded-full ${activeTab === tab.id ? 'bg-emerald-900/60' : 'bg-emerald-950/60'}`} />
                      <div className={`absolute inset-[2px] rounded-full ${activeTab === tab.id ? 'bg-emerald-800/40' : 'bg-emerald-900/40'}`} />
                      <div className='relative z-10'>{tab.icon}</div>
                    </div>
                    <span
                      className={`text-base font-medium transition-colors duration-300 ${
                        activeTab === tab.id ? 'text-emerald-200' : 'text-emerald-300/80 group-hover:text-emerald-200/90'
                      }`}
                    >
                      {tab.label}
                    </span>
                    {/* Subtle hover effect */}
                    <div className='absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]'></div>
                  </button>
                ))}
              </div>

              {/* Current weather visualization - Only show on current tab on desktop */}
              {activeTab === 'current' && (
                <div className={`mt-4 px-6 pb-6 transition-all duration-300 ${showDetails ? 'opacity-100' : 'opacity-0'}`}>
                  <div className='flex flex-col items-center justify-center'>
                    <div className='relative mb-4'>
                      <div
                        className={`flex h-24 w-24 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-900/50 ${
                          glowing ? 'shadow-lg shadow-emerald-400/30' : ''
                        }`}
                      >
                        <WeatherIcon condition={mainConditionType} size='large' />
                        {glowing && (
                          <>
                            <div className='absolute inset-0 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-emerald-400/20'></div>
                            <div className='absolute -inset-1 animate-[ping_4s_ease-in-out_infinite] rounded-full border border-emerald-400/30'></div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className='text-center'>
                      <div className='text-5xl font-bold text-emerald-100'>{weatherData?.temperature}°C</div>
                      <div className='mt-2 text-lg text-emerald-300/90'>{weatherData?.condition}</div>
                      <div className='mt-1 text-sm text-emerald-400/80'>{weatherData?.date}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile current weather visualization - Only shown on mobile */}
            <div className='relative z-10 w-full md:hidden'>
              {activeTab === 'current' && (
                <div className={`p-5 transition-all duration-300 ${showDetails ? 'opacity-100' : 'opacity-0'}`}>
                  <div className='flex flex-col items-center justify-center'>
                    <div className='relative mb-4'>
                      <div
                        className={`flex h-24 w-24 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-900/50 ${
                          glowing ? 'shadow-lg shadow-emerald-400/30' : ''
                        }`}
                      >
                        <WeatherIcon condition={mainConditionType} size='large' />
                        {glowing && (
                          <>
                            <div className='absolute inset-0 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-emerald-400/20'></div>
                            <div className='absolute -inset-1 animate-[ping_4s_ease-in-out_infinite] rounded-full border border-emerald-400/30'></div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className='text-center'>
                      <div className='text-5xl font-bold text-emerald-100'>{weatherData?.temperature}°C</div>
                      <div className='mt-2 text-lg text-emerald-300/90'>{weatherData?.condition}</div>
                      <div className='mt-1 text-sm text-emerald-400/80'>{weatherData?.date}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Main content area */}
            <div className='scrollbar-thin scrollbar-track-emerald-950 scrollbar-thumb-emerald-700/50 min-h-[400px] w-full flex-grow overflow-y-auto p-4 pb-20 md:col-span-2 md:p-5 md:pb-4'>
              <div ref={contentRef} className='w-full transition-all duration-500'>
                {activeTab === 'current' ? (
                  <div className='w-full space-y-5'>
                    <div className='mb-3 flex items-center space-x-2 text-xs text-emerald-300/90'>
                      <div className='h-px flex-grow bg-gradient-to-r from-emerald-500/50 to-transparent'></div>
                      <span>CHI TIẾT THỜI TIẾT</span>
                      <div className='h-px flex-grow bg-gradient-to-l from-emerald-500/50 to-transparent'></div>
                    </div>

                    <div className='grid grid-cols-2 gap-3'>
                      <WeatherStat icon={<Thermometer className='h-4 w-4 text-emerald-400/70' />} label='Nhiệt độ' value={`${weatherData?.temperature}°C`} />
                      <WeatherStat icon={<Droplets className='h-4 w-4 text-emerald-400/70' />} label='Độ ẩm' value={`${weatherData?.humidity}%`} />
                      <WeatherStat icon={<Wind className='h-4 w-4 text-emerald-400/70' />} label='Gió' value={`${weatherData?.windSpeed} km/h`} />
                      <WeatherStat icon={<Umbrella className='h-4 w-4 text-emerald-400/70' />} label='Khả năng mưa' value='15%' />
                    </div>

                    <div className='mb-3 flex items-center space-x-2 text-xs text-emerald-300/90'>
                      <div className='h-px flex-grow bg-gradient-to-r from-emerald-500/50 to-transparent'></div>
                      <span>DỰ BÁO NGÀY HÔM NAY</span>
                      <div className='h-px flex-grow bg-gradient-to-l from-emerald-500/50 to-transparent'></div>
                    </div>

                    <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
                      {weatherData?.forecast.slice(0, 1).map((day, index) => <ForecastCard key={index} day={day} isActive={true} onClick={() => {}} />)}
                    </div>
                  </div>
                ) : (
                  <div className='w-full space-y-5'>
                    <div className='mb-3 flex items-center space-x-2 text-xs text-emerald-300/90'>
                      <div className='h-px flex-grow bg-gradient-to-r from-emerald-500/50 to-transparent'></div>
                      <span>DỰ BÁO 5 NGÀY</span>
                      <div className='h-px flex-grow bg-gradient-to-l from-emerald-500/50 to-transparent'></div>
                    </div>

                    {/* Forecast cards */}
                    <div className='mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5'>
                      {weatherData?.forecast.map((day, index) => (
                        <ForecastCard key={index} day={day} isActive={selectedDay === index} onClick={() => setSelectedDay(index)} />
                      ))}
                    </div>

                    {/* Detailed forecast */}
                    <AnimatePresence mode='wait'>
                      <DetailedWeather key={selectedDay} data={weatherData?.forecast[selectedDay]} />
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom mobile navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className='fixed bottom-0 left-0 z-50 w-full border-t border-emerald-500/30 bg-emerald-950/95 backdrop-blur-md md:hidden'
          >
            <div className='mx-auto flex items-center justify-around px-4 py-2'>
              {[
                { id: 'current', icon: <CloudSun className='h-5 w-5 text-emerald-400' />, label: 'Hiện tại' },
                { id: 'forecast', icon: <BarChart2 className='h-5 w-5 text-emerald-400' />, label: 'Dự báo' }
              ].map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className='group relative flex flex-col items-center justify-center px-1.5'>
                  <div
                    className={`relative mb-0.5 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'border border-emerald-400/50 bg-emerald-900 shadow-lg shadow-emerald-500/20'
                        : 'border border-emerald-500/20 bg-emerald-950/70 hover:border-emerald-500/40 hover:bg-emerald-900/40'
                    }`}
                  >
                    <div className={`relative z-10 transition-all duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                      {tab.icon}
                    </div>
                    {activeTab === tab.id && (
                      <>
                        <div className='absolute inset-0 animate-pulse rounded-full bg-emerald-500/20'></div>
                        <div className='absolute -inset-1 animate-ping rounded-full border border-emerald-400/30 opacity-75'></div>
                      </>
                    )}
                  </div>
                  <span
                    className={`text-[8px] font-medium transition-colors duration-300 ${
                      activeTab === tab.id ? 'text-emerald-300' : 'text-emerald-400/60 group-hover:text-emerald-300/80'
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Visual hint for interactivity */}
            <div className='absolute -top-2 left-1/2 -translate-x-1/2 rounded-full border border-emerald-500/20 bg-emerald-950 px-1.5 py-0.5 text-[8px] text-emerald-400/80'>
              chọn chế độ
            </div>
          </motion.div>

          {/* Enhanced visual effects */}
          <div className='pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(transparent_0%,rgba(52,211,153,0.07)_50%,transparent_100%)] bg-[size:100%_4px]'></div>

          <div className='pointer-events-none absolute inset-0 z-20 opacity-30 mix-blend-overlay'>
            <div
              className='absolute inset-0 animate-pulse'
              style={{
                backgroundImage: 'linear-gradient(0deg, transparent 0%, rgba(52, 211, 153, 0.4) 2%, transparent 3%)',
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
                backgroundImage: 'linear-gradient(90deg, transparent, rgba(52, 211, 153, 0.3), transparent)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 8s infinite linear'
              }}
            ></div>
          </div>

          {/* Holographic scan line effect */}
          <div className='pointer-events-none absolute inset-0 z-30 overflow-hidden opacity-10'>
            <div
              className='absolute h-[1px] w-full bg-emerald-400'
              style={{
                animation: 'scanline 3s linear infinite',
                boxShadow: '0 0 10px 2px rgba(52, 211, 153, 0.7)'
              }}
            ></div>
          </div>

          {/* Corner accents */}
          <div className='pointer-events-none absolute top-0 right-0 h-10 w-10 rounded-tr-xl border-t-2 border-r-2 border-emerald-400/20'></div>
          <div className='pointer-events-none absolute bottom-0 left-0 h-10 w-10 rounded-bl-xl border-b-2 border-l-2 border-emerald-400/20'></div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(WeatherTemplate)
