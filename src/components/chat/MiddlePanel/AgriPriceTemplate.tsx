'use client'

import React, { useState, useEffect, useRef, useCallback, memo } from 'react'
import { Wheat, ArrowDown, ArrowUp, Minus, ChevronRight } from 'lucide-react'

interface PriceItem {
  product: string
  currentPrice: number
  previousPrice: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  location?: string
}

interface AgriPriceData {
  title: string
  date: string
  region: string
  market: string
  items: PriceItem[]
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
    formatPrice: (price: number) => string
    calculateChange: (current: number, previous: number) => string
  }) => {
    const handleClick = useCallback(() => {
      setActiveItem(activeItem === index ? null : index)
    }, [activeItem, index, setActiveItem])

    return (
      <div
        className={`relative cursor-pointer rounded-xl border transition-all duration-300 ease-out ${
          activeItem === index
            ? 'border-cyan-400/50 bg-cyan-900/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
            : 'border-cyan-500/20 bg-cyan-950/30 hover:bg-cyan-900/20'
        } ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} `}
        style={{ transitionDelay: `${index * 50}ms` }}
        onClick={handleClick}
      >
        {/* Item header */}
        <div className='flex items-center justify-between p-2 sm:p-3'>
          <div className='flex items-center space-x-2'>
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full sm:h-8 sm:w-8 ${
                item.trend === 'up'
                  ? 'border border-emerald-500/30 bg-emerald-900/30 text-emerald-400'
                  : item.trend === 'down'
                    ? 'border border-rose-500/30 bg-rose-900/30 text-rose-400'
                    : 'border border-amber-500/30 bg-amber-900/30 text-amber-400'
              }`}
            >
              {item.trend === 'up' ? (
                <ArrowUp className='h-3 w-3 sm:h-4 sm:w-4' />
              ) : item.trend === 'down' ? (
                <ArrowDown className='h-3 w-3 sm:h-4 sm:w-4' />
              ) : (
                <Minus className='h-3 w-3 sm:h-4 sm:w-4' />
              )}
            </div>
            <div>
              <div className='text-xs font-medium text-cyan-100 sm:text-sm'>{item.product}</div>
              <div className='text-[9px] text-cyan-400/70 sm:text-xs'>{item.unit}</div>
            </div>
          </div>

          <div className='flex items-center space-x-1 sm:space-x-3'>
            <div className='text-right'>
              <div className='bg-gradient-to-r from-cyan-300 to-cyan-100 bg-clip-text text-base font-bold text-transparent sm:text-lg'>
                {formatPrice(item.currentPrice)}
              </div>
              <div
                className={`text-[9px] font-medium sm:text-xs ${
                  item.trend === 'up' ? 'text-emerald-400' : item.trend === 'down' ? 'text-rose-400' : 'text-amber-400'
                }`}
              >
                {item.trend === 'up'
                  ? `+${calculateChange(item.currentPrice, item.previousPrice)}%`
                  : item.trend === 'down'
                    ? `-${calculateChange(item.previousPrice, item.currentPrice)}%`
                    : 'Ổn định'}
              </div>
            </div>
            <ChevronRight className={`h-3 w-3 text-cyan-400/70 transition-transform duration-300 sm:h-4 sm:w-4 ${activeItem === index ? 'rotate-90' : ''}`} />
          </div>
        </div>

        {/* Expanded details */}
        {activeItem === index && (
          <div className='max-h-40 overflow-hidden opacity-100 transition-all duration-300 ease-out'>
            <div className='border-t border-cyan-500/20 px-3 pt-0'>
              <div className='mb-2 grid grid-cols-2 gap-2 sm:mb-3 sm:gap-3'>
                <div className='mt-2 rounded-lg bg-cyan-500/10 p-2 sm:p-2.5'>
                  <div className='mb-1 text-[9px] text-cyan-400/70 uppercase sm:text-[10px]'>Previous</div>
                  <div className='text-xs font-medium text-cyan-100 sm:text-sm'>
                    {formatPrice(item.previousPrice)} {item.unit}
                  </div>
                </div>
                <div className='mt-2 rounded-lg bg-cyan-500/10 p-2 sm:p-2.5'>
                  <div className='mb-1 text-[9px] text-cyan-400/70 uppercase sm:text-[10px]'>Source</div>
                  <div className='truncate text-xs font-medium text-cyan-100 sm:text-sm'>{item.location || 'Standard Market'}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
)

PriceItemComponent.displayName = 'PriceItemComponent'

const AgriPriceTemplate: React.FC<{ priceData: AgriPriceData }> = ({ priceData }) => {
  // If loading is true, show the skeleton

  const [activeItem, setActiveItem] = useState<number | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [rotateY, setRotateY] = useState(0)
  const [rotateX, setRotateX] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Format price in Vietnamese currency - memoized
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }, [])

  // Calculate percentage change - memoized
  const calculateChange = useCallback((current: number, previous: number) => {
    if (previous === 0) return '0'
    const change = ((current - previous) / previous) * 100
    return change.toFixed(1)
  }, [])

  // Simulate loading sequence with faster timing
  useEffect(() => {
    // Show content immediately
    setLoaded(true)
    setScanning(true)
    setShowDetails(true)

    return () => {}
  }, [])

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
      const rotateYValue = -((e.clientX - centerX) / (rect.width / 2)) * 2
      const rotateXValue = ((e.clientY - centerY) / (rect.height / 2)) * 2

      setRotateY(rotateYValue)
      setRotateX(rotateXValue)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className='perspective-1000 flex min-h-[400px] w-full items-center justify-center rounded-3xl bg-gradient-to-b from-cyan-950 to-slate-950 p-3 sm:min-h-[500px] sm:p-6'>
      <div
        ref={containerRef}
        className='preserve-3d relative w-full max-w-md transform-gpu transition-all duration-300'
        style={{
          transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`
        }}
      >
        {/* Background elements */}
        <div className='absolute inset-0 -z-10'>
          <div className='absolute top-0 left-1/2 h-40 w-full -translate-x-1/2 rounded-full bg-cyan-500 opacity-20 blur-[100px]'></div>
          <div className='absolute bottom-0 left-1/2 h-40 w-full -translate-x-1/2 rounded-full bg-purple-500 opacity-20 blur-[100px]'></div>
        </div>

        {/* Grid lines */}
        <div className='absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]'></div>

        {/* Main holographic container */}
        <div
          className={`relative overflow-hidden rounded-2xl border border-cyan-500/30 backdrop-blur-sm transition-all duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Holographic overlay effect */}
          <div className='absolute inset-0 z-0 bg-gradient-to-b from-cyan-950/80 via-slate-900/90 to-purple-950/80'></div>
          <div className="absolute inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDEwIDAgTCAwIDAgTCAwIDEwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMCwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

          {/* Scanning effect */}
          <div
            className={`absolute inset-0 z-0 h-full w-full bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent transition-all duration-500 ease-in-out ${scanning ? 'translate-y-full' : '-translate-y-full'}`}
          ></div>

          {/* Header section */}
          <div className='relative z-10 border-b border-cyan-500/30 p-4 sm:p-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <div className='relative'>
                  <div className='absolute inset-0 animate-pulse rounded-full bg-cyan-500 blur-md'></div>
                  <div className='relative flex h-8 w-8 items-center justify-center rounded-full border border-cyan-500/50 bg-cyan-950 sm:h-10 sm:w-10'>
                    <Wheat className='h-4 w-4 text-cyan-400 sm:h-5 sm:w-5' />
                  </div>
                </div>
                <div>
                  <h3 className='bg-gradient-to-r from-cyan-300 to-cyan-100 bg-clip-text text-lg font-bold text-transparent sm:text-xl'>{priceData?.title}</h3>
                  <div className='mt-1 flex items-center text-xs text-cyan-400/70'>
                    <span>Đom Đóm AI</span>
                    <div className='text-linear-gradient-2 text-[10px] leading-[13px] font-bold'>BETA</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location info with futuristic style */}
            <div className={`mt-4 transition-all duration-300 sm:mt-5 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className='mb-1 flex items-center space-x-2 text-xs text-cyan-300/90'>
                <div className='h-px flex-grow bg-gradient-to-r from-cyan-500/50 to-transparent'></div>
                <span>THÔNG TIN KHU VỰC</span>
                <div className='h-px flex-grow bg-gradient-to-l from-cyan-500/50 to-transparent'></div>
              </div>

              <div className='mt-2 grid grid-cols-2 gap-2 sm:gap-3'>
                <div className='rounded-lg border border-cyan-500/20 bg-cyan-950/30 p-2 sm:p-2.5'>
                  <div className='mb-1 text-[9px] text-cyan-400/70 uppercase sm:text-[10px]'>Khu vực</div>
                  <div className='truncate text-xs font-medium text-cyan-100 sm:text-sm'>{priceData?.region}</div>
                </div>
                <div className='rounded-lg border border-cyan-500/20 bg-cyan-950/30 p-2 sm:p-2.5'>
                  <div className='mb-1 text-[9px] text-cyan-400/70 uppercase sm:text-[10px]'>Chợ</div>
                  <div className='truncate text-xs font-medium text-cyan-100 sm:text-sm'>{priceData?.market}</div>
                </div>
              </div>

              <div className='mt-3 flex items-center justify-between'>
                <div className='text-[9px] text-cyan-400/70 uppercase sm:text-[10px]'>Last updated</div>
                <div className='text-xs font-medium text-cyan-100'>{priceData?.date}</div>
              </div>
            </div>
          </div>

          {/* Price data section */}
          <div className='relative z-10 p-3 sm:p-4'>
            <div
              className={`mb-2 flex items-center space-x-2 text-xs text-cyan-300/90 transition-all duration-300 sm:mb-3 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className='h-px flex-grow bg-gradient-to-r from-cyan-500/50 to-transparent'></div>
              <span>NÔNG SẢN</span>
              <div className='h-px flex-grow bg-gradient-to-l from-cyan-500/50 to-transparent'></div>
            </div>

            {/* Price items */}
            <div className='space-y-2 sm:space-y-3'>
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
          </div>

          {/* Decorative elements */}
          <div className='absolute top-0 right-0 -z-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl'></div>
          <div className='absolute bottom-0 left-0 -z-10 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl'></div>

          {/* Scan lines effect */}
          <div className='pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(transparent_0%,rgba(0,255,255,0.05)_50%,transparent_100%)] bg-[size:100%_4px]'></div>

          {/* Glitch effect - reduced frequency */}
          <div className='pointer-events-none absolute inset-0 z-20 opacity-10 mix-blend-screen'>
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
    </div>
  )
}

export default AgriPriceTemplate
