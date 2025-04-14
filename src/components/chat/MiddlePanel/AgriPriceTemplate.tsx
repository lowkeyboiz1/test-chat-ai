'use client'

import '@/lib/animations.css'
import { AgriPriceTemplateProps } from '@/types/templates'
import { Wheat } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import PriceItemComponent, { PriceItem } from './PriceItemComponent'

const AgriPriceTemplate: React.FC<AgriPriceTemplateProps> = ({ priceData }) => {
  const [activeItem, setActiveItem] = useState<number | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [glowing, setGlowing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)
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

  // Optimized particle creation
  const createParticle = useCallback(() => {
    if (!particlesRef.current) return

    const particle = document.createElement('div')
    particle.className = 'absolute rounded-full bg-green-500/40 pointer-events-none'

    const size = Math.random() * 4 + 3
    particle.style.width = `${size}px`
    particle.style.height = `${size}px`

    particle.style.left = `${Math.random() * 100}%`
    particle.style.bottom = '0px'

    const duration = Math.random() * 3000 + 3000
    particle.style.animation = `float ${duration}ms ease-in-out forwards`

    particlesRef.current.appendChild(particle)

    setTimeout(() => particle.remove(), duration)
  }, [])

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
      particle.className = 'absolute rounded-full bg-green-400/30 pointer-events-none'
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

  // Enhanced loading sequence
  useEffect(() => {
    // Enhanced animation sequence
    setLoaded(true)
    const timer1 = setTimeout(() => setShowDetails(true), 300)
    const glowInterval = setInterval(() => setGlowing((prev) => !prev), 3000)

    // Particle intervals
    const particleInterval = setInterval(createParticle, 300)
    const weatherInterval = setInterval(() => {
      createWeatherParticle()
      // Cycle through weather effects
      if (Math.random() > 0.97) {
        setWeatherEffect((prev) => {
          const effects: Array<'rain' | 'sun' | 'wind'> = ['rain', 'sun', 'wind']
          const currentIndex = effects.indexOf(prev)
          return effects[(currentIndex + 1) % effects.length]
        })
      }
    }, 250)

    // Scan animation
    const scanInterval = setInterval(() => setScanning((prev) => !prev), 5000)

    return () => {
      clearTimeout(timer1)
      clearInterval(glowInterval)
      clearInterval(particleInterval)
      clearInterval(weatherInterval)
      clearInterval(scanInterval)
    }
  }, [createParticle, createWeatherParticle])

  return (
    <div className='flex min-h-[500px] w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-emerald-950 to-slate-950 p-4 sm:rounded-3xl sm:p-6'>
      {/* Ambient background effects */}
      <div className='absolute top-0 right-0 -z-10 h-48 w-48 rounded-full bg-emerald-400/10 sm:h-64 sm:w-64'></div>
      <div className='absolute bottom-0 left-0 -z-10 h-48 w-48 rounded-full bg-emerald-400/10 sm:h-64 sm:w-64'></div>

      <div className='relative w-full max-w-lg'>
        {/* Main container */}
        <div
          ref={containerRef}
          className={`relative overflow-hidden rounded-xl border border-emerald-500/30 transition-all duration-300 sm:rounded-2xl ${loaded ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className='absolute inset-0 z-0 bg-gradient-to-b from-emerald-950/80 via-slate-900/90 to-emerald-950/80'></div>
          <div ref={particlesRef} className='pointer-events-none absolute inset-0 overflow-hidden'></div>

          {/* Header title */}
          <div className='relative z-10 border-b border-emerald-500/30 p-4 sm:p-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <div
                  className={`relative flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/50 bg-emerald-950 transition-all duration-300 sm:h-12 sm:w-12 ${
                    glowing ? 'shadow-lg shadow-emerald-400/30' : ''
                  }`}
                >
                  <Wheat className={`h-6 w-6 text-emerald-400 sm:h-6 sm:w-6 ${glowing ? 'animate-pulse' : ''}`} />
                  {glowing && <div className='absolute inset-0 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-emerald-400/40'></div>}
                </div>
                <div>
                  <h3 className='bg-gradient-to-r from-emerald-300 to-emerald-100 bg-clip-text text-2xl font-bold text-transparent sm:text-2xl'>
                    {priceData?.title}
                  </h3>
                  <div className='mt-1 flex items-center text-xs text-emerald-400/70'>
                    <div className='mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400'></div>
                    <span>Đom Đóm AI</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Header divider */}
            <div className={`mt-4 transition-all duration-300 sm:mt-5 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className='mb-1 flex items-center space-x-2 text-xs text-emerald-300/90'>
                <div className='h-px flex-grow bg-gradient-to-r from-emerald-500/50 to-transparent'></div>
                <span>THÔNG TIN CẬP NHẬT</span>
                <div className='h-px flex-grow bg-gradient-to-l from-emerald-500/50 to-transparent'></div>
              </div>

              <div className='mt-2.5 rounded-lg border border-emerald-500/20 bg-emerald-950/30 p-3'>
                <div className='mb-1 text-xs text-emerald-400/70 uppercase'>Thời gian cập nhật</div>
                <div className='text-sm font-medium text-emerald-100'>{priceData?.date}</div>
              </div>

              <div className='mt-3 rounded-lg border border-emerald-500/20 bg-emerald-950/30 p-3'>
                <div className='mb-1 text-xs text-emerald-400/70 uppercase'>KHU VỰC</div>
                <p className='text-sm text-emerald-100 italic'>
                  {priceData?.region} - {priceData?.market}
                </p>
              </div>
            </div>
          </div>

          {/* Prices list section */}
          <div className='relative z-10 p-4 sm:p-6'>
            <div
              className={`mb-3 flex items-center space-x-2 text-xs text-emerald-300/90 transition-all duration-300 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className='h-px flex-grow bg-gradient-to-r from-emerald-500/50 to-transparent'></div>
              <span className='rounded-full bg-emerald-500/10 px-2 py-1'>GIÁ NÔNG SẢN</span>
              <div className='h-px flex-grow bg-gradient-to-l from-emerald-500/50 to-transparent'></div>
            </div>

            <div className='space-y-4'>
              {priceData?.items.map((item: PriceItem, index: number) => (
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

          {/* Summary and recommendation section */}
          {(priceData?.priceSummary || priceData?.recommendation) && (
            <div className='relative z-10 border-t border-emerald-500/30 p-4 sm:p-6'>
              <div
                className={`mb-3 flex items-center space-x-2 text-xs text-emerald-300/90 transition-all duration-300 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
              >
                <div className='h-px flex-grow bg-gradient-to-r from-emerald-500/50 to-transparent'></div>
                <span className='rounded-full bg-emerald-500/10 px-2 py-1'>THÔNG TIN BỔ SUNG</span>
                <div className='h-px flex-grow bg-gradient-to-l from-emerald-500/50 to-transparent'></div>
              </div>

              <div className='space-y-3'>
                {priceData?.priceSummary && (
                  <div
                    className={`group relative overflow-hidden rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-4 transition-all duration-300 hover:bg-emerald-900/30 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                  >
                    <div className='relative z-10'>
                      <div className='mb-1 text-xs font-medium text-emerald-400/70 uppercase'>Tóm tắt giá</div>
                      <div className='text-sm text-emerald-100'>{priceData.priceSummary}</div>
                    </div>
                    <div className='absolute -top-12 -right-12 h-24 w-24 rounded-full bg-emerald-500/5'></div>
                  </div>
                )}

                {priceData?.recommendation && (
                  <div
                    className={`group relative overflow-hidden rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-4 transition-all duration-300 hover:bg-emerald-900/30 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                  >
                    <div className='relative z-10'>
                      <div className='mb-1 text-xs font-medium text-emerald-400/70 uppercase'>Khuyến nghị</div>
                      <div className='text-sm text-emerald-100'>{priceData.recommendation}</div>
                    </div>
                    <div className='absolute -bottom-12 -left-12 h-24 w-24 rounded-full bg-emerald-500/5'></div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Visual effects overlays */}
          <div className='pointer-events-none absolute inset-0 z-20 opacity-30 mix-blend-overlay'>
            <div
              className='absolute inset-0 animate-pulse'
              style={{
                backgroundImage: 'linear-gradient(0deg, transparent 0%, rgba(52, 211, 153, 0.4) 2%, transparent 3%)',
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                animation: 'glitch 5s infinite'
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

          {/* Scanning effect */}
          {scanning && (
            <div
              className='pointer-events-none absolute inset-0 z-30 h-20 bg-gradient-to-b from-transparent via-emerald-400/20 to-transparent'
              style={{
                animation: 'scan 4s linear infinite'
              }}
            ></div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AgriPriceTemplate
