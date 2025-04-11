'use client'

import React, { useState, useEffect, useRef, useCallback, memo } from 'react'
import { Wheat, ArrowDown, ArrowUp, Minus, ChevronRight, Droplets, Sun, Wind } from 'lucide-react'

interface PriceItem {
  product: string
  currentPrice: number | string
  previousPrice: number | string
  unit: string
  pricePerKg?: number | string
  trend: 'up' | 'down' | 'stable'
  location?: string
  sources?: string[]
  type?: string
}

interface AgriPriceData {
  title: string
  date: string
  region: string
  market: string
  items: PriceItem[]
  priceSummary?: string
  recommendation?: string
}

// Memoized price item component for better performance
const PriceItemComponent = memo(
  ({
    item,
    index,
    activeItem,
    setActiveItem,
    showDetails,
    formatPrice,
    calculateChange
  }: {
    item: PriceItem
    index: number
    activeItem: number | null
    setActiveItem: (index: number | null) => void
    showDetails: boolean
    formatPrice: (price: number | string) => string
    calculateChange: (current: number | string, previous: number | string) => string
  }) => {
    const handleClick = useCallback(() => {
      setActiveItem(activeItem === index ? null : index)
    }, [activeItem, index, setActiveItem])

    // Determine trend icon
    const getTrendIcon = () => {
      if (item.trend === 'up') return <ArrowUp className='h-5 w-5' />
      if (item.trend === 'down') return <ArrowDown className='h-5 w-5' />
      return <Minus className='h-5 w-5' />
    }

    // Determine trend color
    const getTrendColor = () => {
      if (item.trend === 'up') return 'bg-emerald-500/20'
      if (item.trend === 'down') return 'bg-rose-500/20'
      return 'bg-amber-500/20'
    }

    // Determine trend text color
    const getTrendTextColor = () => {
      if (item.trend === 'up') return 'text-emerald-400'
      if (item.trend === 'down') return 'text-rose-400'
      return 'text-amber-400'
    }

    // Get trend text
    const getTrendText = () => {
      if (item.trend === 'up') return `+${calculateChange(item.currentPrice, item.previousPrice)}%`
      if (item.trend === 'down') return `-${calculateChange(item.previousPrice, item.currentPrice)}%`
      return 'Ổn định'
    }

    return (
      <div
        className={`group relative cursor-pointer overflow-hidden transition-all duration-300 ease-out ${
          activeItem === index ? 'rounded-2xl bg-white/10' : 'rounded-2xl bg-white/5 hover:bg-white/8'
        } ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
        style={{ transitionDelay: `${index * 50}ms` }}
        onClick={handleClick}
      >
        {/* Background gradient */}
        <div className='absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100'></div>

        {/* Item header */}
        <div className='relative flex items-center justify-between p-4 sm:p-5'>
          <div className='flex items-center space-x-4'>
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${getTrendColor()}`}>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  item.trend === 'up' ? 'text-emerald-400' : item.trend === 'down' ? 'text-rose-400' : 'text-amber-400'
                }`}
              >
                {getTrendIcon()}
              </div>
            </div>
            <div>
              <div className='text-lg font-semibold text-white sm:text-xl'>{item.product}</div>
              <div className='mt-0.5 text-sm text-white/60'>
                {item.unit} {item.type && `(${item.type})`}
              </div>
            </div>
          </div>

          <div className='flex items-center space-x-4'>
            <div className='text-right'>
              <div className='text-xl font-bold text-white sm:text-2xl'>
                {typeof item.currentPrice === 'string' ? item.currentPrice : formatPrice(item.currentPrice)}
              </div>
              <div className={`mt-0.5 text-base font-medium ${getTrendTextColor()}`}>{getTrendText()}</div>
            </div>
            <div className={`transform transition-transform duration-300 ${activeItem === index ? 'rotate-90' : ''}`}>
              <ChevronRight className='h-6 w-6 text-white/40' />
            </div>
          </div>
        </div>

        {/* Expanded details */}
        {activeItem === index && (
          <div className='overflow-hidden opacity-100 transition-all duration-300 ease-out'>
            <div className='border-t border-white/10 px-4 py-3'>
              <div className='grid grid-cols-2 gap-3'>
                <div className='rounded-xl bg-white/5 p-3 backdrop-blur-sm'>
                  <div className='mb-1 text-xs text-white/50 uppercase'>Giá trước đó</div>
                  <div className='text-sm font-medium text-white'>
                    {typeof item.previousPrice === 'string' ? item.previousPrice : formatPrice(item.previousPrice)} {item.unit}
                  </div>
                </div>
                <div className='rounded-xl bg-white/5 p-3 backdrop-blur-sm'>
                  <div className='mb-1 text-xs text-white/50 uppercase'>Nguồn</div>
                  <div className='truncate text-sm font-medium text-white'>{item.location || 'Chợ truyền thống'}</div>
                </div>
              </div>
              {item.sources && item.sources.length > 0 && (
                <div className='mt-3 rounded-xl bg-white/5 p-3 backdrop-blur-sm'>
                  <div className='mb-1 text-xs text-white/50 uppercase'>Nguồn tham khảo</div>
                  <div className='text-sm font-medium text-white'>{item.sources.join(', ')}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }
)

PriceItemComponent.displayName = 'PriceItemComponent'

const AgriPriceTemplate: React.FC<{ priceData: AgriPriceData }> = ({ priceData }) => {
  const [activeItem, setActiveItem] = useState<number | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [rotateY, setRotateY] = useState(0)
  const [rotateX, setRotateX] = useState(0)
  const [glowing, setGlowing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [weatherEffect, setWeatherEffect] = useState<'rain' | 'sun' | 'wind'>('sun')

  // Format price in Vietnamese currency - memoized
  const formatPrice = useCallback((price: number | string) => {
    if (typeof price === 'string') return price
    return new Intl.NumberFormat('vi-VN').format(price)
  }, [])

  // Calculate percentage change - memoized
  const calculateChange = useCallback((current: number | string, previous: number | string) => {
    const currentNum = typeof current === 'string' ? parseFloat(current.replace(/[^\d.-]/g, '')) : current
    const previousNum = typeof previous === 'string' ? parseFloat(previous.replace(/[^\d.-]/g, '')) : previous

    if (previousNum === 0) return '0'
    const change = ((currentNum - previousNum) / previousNum) * 100
    return change.toFixed(1)
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

  // Create weather particles
  const createWeatherParticle = useCallback(() => {
    if (!particlesRef.current || !weatherEffect) return

    const particle = document.createElement('div')

    if (weatherEffect === 'rain') {
      particle.className = 'absolute rounded-full bg-blue-400/40 pointer-events-none'
      const size = Math.random() * 2 + 1
      particle.style.width = `${size}px`
      particle.style.height = `${size * 5}px`
      particle.style.left = `${Math.random() * 100}%`
      particle.style.top = '-10px'
      particle.style.animation = `rain ${Math.random() * 1000 + 1000}ms linear forwards`
    } else if (weatherEffect === 'sun') {
      particle.className = 'absolute rounded-full bg-yellow-400/30 pointer-events-none'
      const size = Math.random() * 4 + 2
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.left = `${Math.random() * 100}%`
      particle.style.top = `${Math.random() * 100}%`
      particle.style.animation = `sunray ${Math.random() * 3000 + 2000}ms ease-in-out forwards`
    } else if (weatherEffect === 'wind') {
      particle.className = 'absolute bg-white/20 pointer-events-none'
      const height = Math.random() * 1 + 0.5
      const width = Math.random() * 20 + 10
      particle.style.height = `${height}px`
      particle.style.width = `${width}px`
      particle.style.left = '-10px'
      particle.style.top = `${Math.random() * 100}%`
      particle.style.animation = `wind ${Math.random() * 2000 + 1000}ms linear forwards`
    }

    particlesRef.current.appendChild(particle)

    setTimeout(() => particle.remove(), 3000)
  }, [weatherEffect])

  // Simulate loading sequence with faster timing
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Show content with animation
    setTimeout(() => setLoaded(true), 300)
    setTimeout(() => setScanning(true), 600)
    setTimeout(() => setShowDetails(true), 900)

    const glowInterval = setInterval(() => setGlowing((prev) => !prev), 2000)
    const particleInterval = setInterval(createParticle, isMobile ? 400 : 250)
    const weatherInterval = setInterval(createWeatherParticle, isMobile ? 300 : 150)

    // Cycle through weather effects
    const weatherCycleInterval = setInterval(() => {
      setWeatherEffect((prev) => {
        if (prev === 'sun') return 'rain'
        if (prev === 'rain') return 'wind'
        return 'sun'
      })
    }, 10000)

    return () => {
      window.removeEventListener('resize', checkMobile)
      clearInterval(glowInterval)
      clearInterval(particleInterval)
      clearInterval(weatherInterval)
      clearInterval(weatherCycleInterval)
    }
  }, [createParticle, createWeatherParticle, isMobile])

  // 3D hover effect with throttling
  useEffect(() => {
    let lastUpdateTime = 0
    const throttleDelay = 16 // ~60fps

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastUpdateTime < throttleDelay) return
      lastUpdateTime = now

      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      // Calculate distance from center (normalized -1 to 1)
      const rotateYValue = -((e.clientX - centerX) / (rect.width / 2)) * 3
      const rotateXValue = ((e.clientY - centerY) / (rect.height / 2)) * 3

      setRotateY(rotateYValue)
      setRotateX(rotateXValue)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const getWeatherIcon = () => {
    if (weatherEffect === 'rain') return <Droplets className='h-4 w-4 text-blue-300' />
    if (weatherEffect === 'wind') return <Wind className='h-4 w-4 text-gray-300' />
    return <Sun className='h-4 w-4 text-yellow-300' />
  }

  return (
    <div className='perspective-1000 flex min-h-[400px] w-full items-center justify-center rounded-3xl bg-gradient-to-br from-[#2EAF5D] to-[#1A7A3D] p-3 sm:min-h-[500px] sm:p-6'>
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
            transform: translateY(-120px) rotate(360deg);
            opacity: 0;
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
        @keyframes rain {
          0% {
            transform: translateY(0) rotate(15deg);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(400px) rotate(15deg);
            opacity: 0;
          }
        }
        @keyframes sunray {
          0% {
            transform: scale(1);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: scale(0);
            opacity: 0;
          }
        }
        @keyframes wind {
          0% {
            transform: translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          100% {
            transform: translateX(400px);
            opacity: 0;
          }
        }
      `}</style>

      <div
        ref={containerRef}
        className='preserve-3d relative w-full max-w-md transform-gpu transition-all duration-300'
        style={{
          transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`
        }}
      >
        {/* Background elements */}
        <div className='absolute inset-0 -z-10'>
          <div className='absolute top-0 left-1/2 h-40 w-full -translate-x-1/2 rounded-full bg-white/10 blur-[100px]'></div>
          <div className='absolute bottom-0 left-1/2 h-40 w-full -translate-x-1/2 rounded-full bg-white/10 blur-[100px]'></div>
        </div>

        {/* Grid lines */}
        <div className='absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:20px_20px]'></div>

        {/* Main holographic container */}
        <div
          className={`relative overflow-hidden rounded-2xl border border-white/20 backdrop-blur-md transition-all duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Holographic overlay effect */}
          <div className='absolute inset-0 z-0 bg-gradient-to-b from-[#2EAF5D]/15 via-[#2EAF5D]/10 to-[#2EAF5D]/15'></div>
          <div className="absolute inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDEwIDAgTCAwIDAgTCAwIDEwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

          {/* Scanning effect */}
          <div
            className={`absolute inset-0 z-0 h-full w-full bg-gradient-to-b from-transparent via-white/20 to-transparent transition-all duration-700 ease-in-out ${scanning ? 'translate-y-full' : '-translate-y-full'}`}
          ></div>

          {/* Particles effect */}
          <div ref={particlesRef} className='pointer-events-none absolute inset-0 overflow-hidden'></div>

          {/* Header section */}
          <div className='relative z-10 border-b border-white/20 bg-white/5 p-4 sm:p-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <div className='relative'>
                  <div className={`absolute inset-0 rounded-full bg-white/30 blur-md ${glowing ? 'animate-pulse' : ''}`}></div>
                  <div
                    className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white/60 bg-white/10 sm:h-10 sm:w-10 ${glowing ? 'shadow-lg shadow-white/30' : ''}`}
                  >
                    <Wheat className='h-4 w-4 text-white sm:h-5 sm:w-5' />
                  </div>
                </div>
                <div>
                  <h3 className='text-lg font-bold text-white sm:text-xl'>{priceData?.title}</h3>
                  <div className='mt-1 flex items-center text-xs text-white/80'>
                    <span>Đom Đóm AI</span>
                    <div className='ml-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] leading-[13px] font-medium text-[#2EAF5D] shadow-sm shadow-black/5'>
                      BETA
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex items-center space-x-1 rounded-full bg-white/10 px-2 py-1 transition-colors duration-200 hover:bg-white/15'>
                {getWeatherIcon()}
                <span className='text-xs text-white/80'>{weatherEffect === 'rain' ? 'Mưa' : weatherEffect === 'wind' ? 'Gió' : 'Nắng'}</span>
              </div>
            </div>

            {/* Location info with futuristic style */}
            <div className={`mt-4 transition-all duration-300 sm:mt-5 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className='mb-1 flex items-center space-x-2 text-xs text-white/90'>
                <div className='h-px flex-grow bg-gradient-to-r from-white/40 to-transparent'></div>
                <span>THÔNG TIN KHU VỰC</span>
                <div className='h-px flex-grow bg-gradient-to-l from-white/40 to-transparent'></div>
              </div>

              <div className='mt-2 grid grid-cols-2 gap-2 sm:gap-3'>
                <div className='rounded-lg border border-white/20 bg-white/5 p-2 backdrop-blur-sm transition-colors duration-200 hover:bg-white/10 sm:p-2.5'>
                  <div className='mb-1 text-[9px] text-white/70 uppercase sm:text-[10px]'>Khu vực</div>
                  <div className='truncate text-xs font-medium text-white sm:text-sm'>{priceData?.region}</div>
                </div>
                <div className='rounded-lg border border-white/20 bg-white/5 p-2 backdrop-blur-sm transition-colors duration-200 hover:bg-white/10 sm:p-2.5'>
                  <div className='mb-1 text-[9px] text-white/70 uppercase sm:text-[10px]'>Chợ</div>
                  <div className='truncate text-xs font-medium text-white sm:text-sm'>{priceData?.market}</div>
                </div>
              </div>

              <div className='mt-3 flex items-center justify-between'>
                <div className='text-[9px] text-white/70 uppercase sm:text-[10px]'>Last updated</div>
                <div className='text-xs font-medium text-white'>{priceData?.date}</div>
              </div>
            </div>
          </div>

          {/* Price data section */}
          <div className='relative z-10 bg-white/5 p-3 sm:p-4'>
            <div className='relative'>
              <div className='absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/30 to-transparent'></div>
              <div
                className={`mb-4 flex items-center justify-center space-x-2 text-sm font-medium text-white/90 transition-all duration-300 sm:mb-5 ${
                  showDetails ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className='h-px flex-grow bg-gradient-to-r from-transparent via-white/30 to-transparent'></div>
                <div className='rounded-full bg-white/10 px-4 py-1 backdrop-blur-sm'>NÔNG SẢN</div>
                <div className='h-px flex-grow bg-gradient-to-r from-transparent via-white/30 to-transparent'></div>
              </div>
            </div>

            {/* Price items */}
            <div className='space-y-3 sm:space-y-4'>
              {priceData?.items.map((item, index) => (
                <PriceItemComponent
                  key={index}
                  item={item}
                  index={index}
                  activeItem={activeItem}
                  setActiveItem={setActiveItem}
                  showDetails={showDetails}
                  formatPrice={formatPrice}
                  calculateChange={calculateChange}
                />
              ))}
            </div>

            {/* Price summary and recommendation */}
            {(priceData?.priceSummary || priceData?.recommendation) && (
              <div className={`mt-4 space-y-2 transition-all duration-500 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <div className='mb-1 flex items-center space-x-2 text-xs text-white/90'>
                  <div className='h-px flex-grow bg-gradient-to-r from-white/40 to-transparent'></div>
                  <span>THÔNG TIN BỔ SUNG</span>
                  <div className='h-px flex-grow bg-gradient-to-l from-white/40 to-transparent'></div>
                </div>

                {priceData?.priceSummary && (
                  <div className='rounded-lg border border-white/20 bg-white/5 p-2.5 backdrop-blur-sm transition-colors duration-200 hover:bg-white/10'>
                    <div className='mb-1 text-[10px] text-white/70 uppercase'>Tóm tắt giá</div>
                    <div className='text-xs font-medium text-white'>{priceData.priceSummary}</div>
                  </div>
                )}

                {priceData?.recommendation && (
                  <div className='rounded-lg border border-white/20 bg-white/5 p-2.5 backdrop-blur-sm transition-colors duration-200 hover:bg-white/10'>
                    <div className='mb-1 text-[10px] text-white/70 uppercase'>Khuyến nghị</div>
                    <div className='text-xs font-medium text-white'>{priceData.recommendation}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Decorative elements */}
          <div className='absolute top-0 right-0 -z-10 h-32 w-32 rounded-full bg-white/10 blur-3xl'></div>
          <div className='absolute bottom-0 left-0 -z-10 h-32 w-32 rounded-full bg-white/10 blur-3xl'></div>

          {/* Scan lines effect */}
          <div className='pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)] bg-[size:100%_4px]'></div>

          {/* Glitch effect - reduced frequency */}
          <div className='pointer-events-none absolute inset-0 z-20 opacity-10 mix-blend-overlay'>
            <div
              className='absolute inset-0 animate-pulse'
              style={{
                backgroundImage: 'linear-gradient(0deg, transparent 0%, rgba(255, 255, 255, 0.4) 2%, transparent 3%)',
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                animation: 'glitch 5s infinite'
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
    </div>
  )
}

export default AgriPriceTemplate
