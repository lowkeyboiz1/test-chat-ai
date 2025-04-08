'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Wheat, ArrowDown, ArrowUp, Minus, RefreshCw, Maximize2, ChevronRight } from 'lucide-react'

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

const AgriPriceTemplate: React.FC<{ priceData?: AgriPriceData }> = ({
  priceData = {
    title: 'Giá nông sản hôm nay',
    date: 'Ngày 01/04/2025',
    region: 'Đồng bằng sông Cửu Long',
    market: 'Chợ đầu mối nông sản Tiền Giang',
    items: [
      { product: 'Lúa gạo', currentPrice: 6500, previousPrice: 6200, unit: 'đồng/kg', trend: 'up' },
      { product: 'Khoai lang', currentPrice: 15000, previousPrice: 15000, unit: 'đồng/kg', trend: 'stable' },
      { product: 'Ngô', currentPrice: 4800, previousPrice: 5000, unit: 'đồng/kg', trend: 'down' },
      { product: 'Sắn', currentPrice: 3200, previousPrice: 3000, unit: 'đồng/kg', trend: 'up' },
      { product: 'Cà phê', currentPrice: 92000, previousPrice: 94000, unit: 'đồng/kg', trend: 'down' }
    ]
  }
}) => {
  const [activeItem, setActiveItem] = useState<number | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [rotateY, setRotateY] = useState(0)
  const [rotateX, setRotateX] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Format price in Vietnamese currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  // Calculate percentage change
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0
    const change = ((current - previous) / previous) * 100
    return change.toFixed(1)
  }

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

  // 3D hover effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
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
    <div className='perspective-1000 flex min-h-[500px] w-full items-center justify-center rounded-3xl bg-gradient-to-b from-cyan-950 to-slate-950 p-6'>
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
                    <Wheat className='h-5 w-5 text-cyan-400' />
                  </div>
                </div>
                <div>
                  <h3 className='bg-gradient-to-r from-cyan-300 to-cyan-100 bg-clip-text text-xl font-bold text-transparent'>{priceData.title}</h3>
                  <div className='mt-1 flex items-center text-xs text-cyan-400/70'>
                    <span>Đom Đóm AI</span>
                    <div className='text-linear-gradient-2 text-[10px] leading-[13px] font-bold'>BETA</div>
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
                  <div className='mb-1 text-[10px] text-cyan-400/70 uppercase'>Khu vực</div>
                  <div className='truncate text-sm font-medium text-cyan-100'>{priceData.region}</div>
                </div>
                <div className='rounded-lg border border-cyan-500/20 bg-cyan-950/30 p-2.5'>
                  <div className='mb-1 text-[10px] text-cyan-400/70 uppercase'>Chợ</div>
                  <div className='truncate text-sm font-medium text-cyan-100'>{priceData.market}</div>
                </div>
              </div>

              <div className='mt-3 flex items-center justify-between'>
                <div className='text-[10px] text-cyan-400/70 uppercase'>Last updated</div>
                <div className='text-xs font-medium text-cyan-100'>{priceData.date}</div>
              </div>
            </div>
          </div>

          {/* Price data section */}
          <div className='relative z-10 p-4'>
            <div
              className={`mb-3 flex items-center space-x-2 text-xs text-cyan-300/90 transition-all delay-700 duration-1000 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className='h-px flex-grow bg-gradient-to-r from-cyan-500/50 to-transparent'></div>
              <span>NÔNG SẢN</span>
              <div className='h-px flex-grow bg-gradient-to-l from-cyan-500/50 to-transparent'></div>
            </div>

            {/* Price items */}
            <div className='space-y-3'>
              {priceData.items.map((item, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer rounded-xl border transition-all duration-500 ease-out ${
                    activeItem === index
                      ? 'border-cyan-400/50 bg-cyan-900/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : 'border-cyan-500/20 bg-cyan-950/30 hover:bg-cyan-900/20'
                  } ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} `}
                  style={{ transitionDelay: `${800 + index * 100}ms` }}
                  onClick={() => setActiveItem(activeItem === index ? null : index)}
                >
                  {/* Item header */}
                  <div className='flex items-center justify-between p-3'>
                    <div className='flex items-center space-x-3'>
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          item.trend === 'up'
                            ? 'border border-emerald-500/30 bg-emerald-900/30 text-emerald-400'
                            : item.trend === 'down'
                              ? 'border border-rose-500/30 bg-rose-900/30 text-rose-400'
                              : 'border border-amber-500/30 bg-amber-900/30 text-amber-400'
                        }`}
                      >
                        {item.trend === 'up' ? (
                          <ArrowUp className='h-4 w-4' />
                        ) : item.trend === 'down' ? (
                          <ArrowDown className='h-4 w-4' />
                        ) : (
                          <Minus className='h-4 w-4' />
                        )}
                      </div>
                      <div>
                        <div className='text-sm font-medium text-cyan-100'>{item.product}</div>
                        <div className='text-xs text-cyan-400/70'>{item.unit}</div>
                      </div>
                    </div>

                    <div className='flex items-center space-x-3'>
                      <div className='text-right'>
                        <div className='bg-gradient-to-r from-cyan-300 to-cyan-100 bg-clip-text text-lg font-bold text-transparent'>
                          {formatPrice(item.currentPrice)}
                        </div>
                        <div
                          className={`text-xs font-medium ${
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
                      <ChevronRight className={`h-4 w-4 text-cyan-400/70 transition-transform duration-300 ${activeItem === index ? 'rotate-90' : ''}`} />
                    </div>
                  </div>

                  {/* Expanded details */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-out ${activeItem === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className='border-t border-cyan-500/20 p-3 pt-0'>
                      <div className='mb-3 grid grid-cols-2 gap-3'>
                        <div className='mt-2 rounded-lg bg-cyan-500/10 p-2.5'>
                          <div className='mb-1 text-[10px] text-cyan-400/70 uppercase'>Previous</div>
                          <div className='text-sm font-medium text-cyan-100'>
                            {formatPrice(item.previousPrice)} {item.unit}
                          </div>
                        </div>
                        <div className='mt-2 rounded-lg bg-cyan-500/10 p-2.5'>
                          <div className='mb-1 text-[10px] text-cyan-400/70 uppercase'>Source</div>
                          <div className='truncate text-sm font-medium text-cyan-100'>{item.location || 'Standard Market'}</div>
                        </div>
                      </div>
                    </div>
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
      `}</style>
    </div>
  )
}

export default AgriPriceTemplate
