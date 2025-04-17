'use client'

import '@/lib/animations.css'
import { AgriPriceTemplateProps } from '@/types/templates'
import { ArrowDown, ArrowUp, Minus, Wheat, ArrowUpRight, Dot, TrendingUp, Leaf, BarChart3, Droplets, Sun, Clock, Info } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const AgriPriceTemplate: React.FC<AgriPriceTemplateProps> = ({ priceData }) => {
  // Enhanced state management
  const [loaded, setLoaded] = useState(false)
  const [glowing, setGlowing] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [activeTab, setActiveTab] = useState('prices')
  const [showSpotlight, setShowSpotlight] = useState(false)
  const [animateItems, setAnimateItems] = useState(false)

  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const raindropsRef = useRef<HTMLDivElement>(null)
  const spotlightRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when content changes
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      })
    }
  }, [])

  // Format price in Vietnamese currency with enhanced formatting
  const formatPrice = (price: number | string) => {
    if (typeof price === 'string') return price
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  // Calculate percentage change with improved precision
  const calculateChange = (current: number | string, previous: number | string) => {
    if (current === previous) return ''
    const currentNum = typeof current === 'string' ? parseFloat(current.replace(/[^\d.-]/g, '')) : current
    const previousNum = typeof previous === 'string' ? parseFloat(previous.replace(/[^\d.-]/g, '')) : previous

    if (isNaN(currentNum) || isNaN(previousNum) || previousNum === 0) return '0'
    const change = ((currentNum - previousNum) / previousNum) * 100
    return Math.abs(change).toFixed(1)
  }

  // Create enhanced particle effect with variety
  const createParticle = useCallback(() => {
    if (!particlesRef.current) return

    const particle = document.createElement('div')
    const isGlowParticle = Math.random() > 0.7

    particle.className = `absolute rounded-full pointer-events-none ${isGlowParticle ? 'bg-emerald-400/60' : 'bg-emerald-500/40'}`

    const size = Math.random() * (isGlowParticle ? 8 : 5) + (isGlowParticle ? 5 : 3)
    particle.style.width = `${size}px`
    particle.style.height = `${size}px`
    particle.style.left = `${Math.random() * 100}%`
    particle.style.bottom = '0px'

    const duration = Math.random() * 2500 + 2000
    particle.style.animation = `float ${duration}ms ease-in-out forwards`

    if (isGlowParticle) {
      particle.style.filter = 'blur(1.5px)'
      particle.style.boxShadow = '0 0 6px rgba(16, 185, 129, 0.8)'
    }

    particlesRef.current.appendChild(particle)
    setTimeout(() => particle.remove(), duration)
  }, [])

  // Create enhanced sparkle effect with variety
  const createSparkle = useCallback(() => {
    if (!containerRef.current) return

    const sparkle = document.createElement('div')
    const isGoldSparkle = Math.random() > 0.5

    sparkle.className = `absolute rounded-full pointer-events-none z-10 ${isGoldSparkle ? 'bg-amber-300/90' : 'bg-emerald-300/80'}`

    const size = Math.random() * 4 + (isGoldSparkle ? 3 : 2)
    sparkle.style.width = `${size}px`
    sparkle.style.height = `${size}px`

    // Position randomly within the container
    sparkle.style.left = `${Math.random() * 100}%`
    sparkle.style.top = `${Math.random() * 100}%`

    // Animation
    sparkle.style.animation = `sparkle ${isGoldSparkle ? 2500 : 2000}ms ease-in-out forwards`

    if (isGoldSparkle) {
      sparkle.style.filter = 'blur(0.8px)'
      sparkle.style.boxShadow = '0 0 5px rgba(251, 191, 36, 0.9)'
    }

    containerRef.current.appendChild(sparkle)
    setTimeout(() => sparkle.remove(), isGoldSparkle ? 2500 : 2000)
  }, [])

  // Create raindrop effect for a natural feel
  const createRaindrop = useCallback(() => {
    if (!raindropsRef.current) return

    const raindrop = document.createElement('div')
    raindrop.className = 'absolute rounded-full bg-emerald-400/20 pointer-events-none'

    const size = Math.random() * 3 + 2
    raindrop.style.width = `${size}px`
    raindrop.style.height = `${size * 3}px`
    raindrop.style.left = `${Math.random() * 100}%`
    raindrop.style.top = '-10px'

    const duration = Math.random() * 1500 + 1000
    raindrop.style.animation = `raindrop ${duration}ms linear forwards`

    raindropsRef.current.appendChild(raindrop)
    setTimeout(() => raindrop.remove(), duration)
  }, [])

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

  // Animation and effects setup with enhanced timing
  useEffect(() => {
    // Initial animation sequence with staggered timing
    setTimeout(() => setLoaded(true), 300)
    setTimeout(() => setAnimateItems(true), 800)

    // Spotlight effect
    setTimeout(() => {
      const spotlightInterval = setInterval(() => setShowSpotlight((prev) => !prev), 7000)
      return () => clearInterval(spotlightInterval)
    }, 3000)

    // Scroll to bottom after content loads
    setTimeout(scrollToBottom, 500)

    // Effect intervals with varied timing
    const glowInterval = setInterval(() => setGlowing((prev) => !prev), 3000)
    const particleInterval = setInterval(createParticle, 400)
    const sparkleInterval = setInterval(createSparkle, 250)
    const scanInterval = setInterval(() => setScanning((prev) => !prev), 5000)
    const raindropInterval = setInterval(createRaindrop, 300)

    // Cleanup
    return () => {
      clearInterval(glowInterval)
      clearInterval(particleInterval)
      clearInterval(sparkleInterval)
      clearInterval(scanInterval)
      clearInterval(raindropInterval)
    }
  }, [createParticle, createSparkle, createRaindrop, scrollToBottom])

  // Get trend style with enhanced visual cues
  const getTrendStyle = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return 'text-emerald-400'
    if (trend === 'down') return 'text-rose-400'
    return 'text-blue-400'
  }

  // Format date string with enhanced formatting
  const formatDate = () => {
    if (priceData?.date) return priceData.date

    const now = new Date()
    return now.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

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
          ref={containerRef}
          className={`relative overflow-hidden rounded-xl border border-emerald-500/30 backdrop-blur-sm transition-all duration-500 sm:rounded-2xl ${loaded ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className='absolute inset-0 z-0 bg-gradient-to-b from-emerald-950/80 via-slate-900/90 to-emerald-950/80'></div>
          <div ref={particlesRef} className='pointer-events-none absolute inset-0 overflow-hidden bg-emerald-400/5'></div>
          <div ref={raindropsRef} className='pointer-events-none absolute inset-0 overflow-hidden'></div>

          {/* Enhanced scan line effect */}
          <div
            className={`pointer-events-none absolute inset-0 h-20 -translate-y-full bg-gradient-to-b from-transparent via-emerald-400/15 to-transparent transition-transform duration-3000 ease-in-out ${scanning ? 'translate-y-full' : ''}`}
          ></div>

          {/* Spotlight effect */}
          <div
            ref={spotlightRef}
            className={`pointer-events-none absolute inset-0 overflow-hidden rounded-2xl transition-opacity duration-1000 ${showSpotlight ? 'opacity-100' : 'opacity-0'}`}
          ></div>

          <div className='flex w-full flex-col md:grid md:grid-cols-3'>
            {/* Header section */}
            <div className='relative z-10 w-full border-b border-emerald-500/30 p-5 md:col-span-3'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  <div
                    className={`relative flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/50 bg-emerald-950 transition-all duration-300 ${
                      glowing ? 'shadow-lg shadow-emerald-400/30' : ''
                    }`}
                  >
                    <BarChart3 className={`h-6 w-6 text-emerald-400 ${glowing ? 'animate-pulse' : ''}`} />
                    {glowing && (
                      <>
                        <div className='absolute inset-0 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-emerald-400/40'></div>
                        <div className='absolute -inset-1 animate-[ping_4s_ease-in-out_infinite] rounded-full border border-emerald-400/30'></div>
                      </>
                    )}
                  </div>
                  <div>
                    <h3 className='bg-gradient-to-r from-emerald-300 to-emerald-100 bg-clip-text text-2xl font-bold text-transparent'>Giá nông sản</h3>
                    <div className='mt-1 flex items-center space-x-2 text-xs text-emerald-400/70'>
                      <div className='flex items-center'>
                        <div className='mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400'></div>
                        <span>Đom Đóm AI</span>
                      </div>
                      {priceData?.region && (
                        <>
                          <span className='text-emerald-500/50'>|</span>
                          <span className='text-emerald-300/80'>{priceData.region}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <div className='group relative overflow-hidden rounded-lg border border-emerald-500/20 bg-emerald-950/40 px-2 py-1.5 backdrop-blur-sm hover:border-emerald-500/40 hover:bg-emerald-900/30 sm:space-x-2'>
                    <div className='relative z-10 flex items-center space-x-1.5'>
                      <div className='rounded-full border border-emerald-500/30 bg-emerald-900/50 p-1'>
                        <Clock className='h-3 w-3 text-emerald-400/70' />
                      </div>
                      <span className='text-xs text-emerald-100 sm:text-sm'>
                        <span className='mr-1 text-emerald-400/90'>Cập nhật:</span>
                        {formatDate()}
                      </span>
                    </div>
                    <div className='absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]'></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation tabs - sidebar style on desktop, hidden on mobile */}
            <div className='relative z-10 hidden w-full border-r border-emerald-500/30 bg-emerald-950/90 md:col-span-1 md:block'>
              <div className='flex flex-col gap-5 p-6'>
                {[
                  { id: 'prices', icon: <BarChart3 className='size-4 text-emerald-400' />, label: 'Bảng giá' },
                  { id: 'info', icon: <Info className='size-4 text-emerald-400' />, label: 'Thông tin' }
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

              {/* Additional info */}
              <div className='px-6 py-4'>
                <div className='flex justify-between border-t border-emerald-500/20 pt-4 text-xs text-emerald-400/70'>
                  <div className='flex items-center'>
                    <Sun className='mr-1 h-3 w-3 text-amber-400' />
                    <span>Khu vực: {priceData?.region || 'Toàn quốc'}</span>
                  </div>
                </div>
                <div className='mt-2 flex justify-between text-xs text-emerald-400/70'>
                  <div className='flex items-center'>
                    <Droplets className='mr-1 h-3 w-3 text-blue-400' />
                    <span>Chợ: {priceData?.market || 'Bán lẻ & sỉ'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content area */}
            <div className='scrollbar-thin scrollbar-track-emerald-950 scrollbar-thumb-emerald-700/50 min-h-[400px] w-full flex-grow overflow-y-auto p-4 pb-20 md:col-span-2 md:p-5 md:pb-4'>
              <div ref={contentRef} className='w-full transition-all duration-500'>
                {activeTab === 'prices' && (
                  <div className='w-full space-y-5'>
                    <div className='mb-3 flex items-center space-x-2 text-xs text-emerald-300/90'>
                      <div className='h-px flex-grow bg-gradient-to-r from-emerald-500/50 to-transparent'></div>
                      <span>BẢNG GIÁ NÔNG SẢN</span>
                      <div className='h-px flex-grow bg-gradient-to-l from-emerald-500/50 to-transparent'></div>
                    </div>

                    <div className='space-y-2'>
                      {priceData?.items.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: animateItems ? 1 : 0, x: animateItems ? 0 : 20 }}
                          transition={{ duration: 0.3, delay: 0.1 * index }}
                          className={`flex flex-col rounded-lg border border-[#1D4B42] bg-gradient-to-br from-[#0A2C25] to-[#0D332B] p-3 shadow-md transition-all duration-200 hover:border-emerald-500/40 hover:shadow-lg`}
                        >
                          <div className='flex justify-between'>
                            <div className='flex flex-col'>
                              <span className='flex items-center text-sm font-medium text-white'>
                                <Wheat className={`mr-1 h-3 w-3 text-amber-400`} />
                                {item.product}
                              </span>
                              <span className='text-xs text-gray-400'>{item.unit}</span>
                            </div>

                            <div className='flex flex-col items-end'>
                              <div className='flex items-center'>
                                <span className='bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-base font-bold text-transparent sm:text-transparent'>
                                  {formatPrice(item.currentPrice)} {item.unit === 'tấn' ? 'USD' : 'VND'}
                                </span>

                                {item.trend !== 'stable' && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                                    className={`ml-2 flex items-center ${item.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}
                                  >
                                    {item.trend === 'up' ? '+' : '-'}
                                    {calculateChange(item.currentPrice, item.previousPrice)}%
                                    <ArrowUpRight className={`ml-0.5 h-3 w-3 ${item.trend === 'up' ? 'animate-bounce-slow' : 'rotate-180'}`} />
                                  </motion.div>
                                )}
                              </div>

                              <div className='flex items-center text-xs text-gray-400'>
                                <span>Giá {item.trend === 'stable' ? 'ổn định' : item.trend === 'up' ? 'tăng' : 'giảm'}</span>
                                {item.trend !== 'stable' && (
                                  <>
                                    <Dot className='h-3 w-3' />
                                    <span className={`${getTrendStyle(item.trend)} font-medium`}>{item.trend === 'up' ? 'Tăng' : 'Giảm'} so với cùng kỳ</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'info' && (
                  <div className='w-full space-y-5'>
                    <div className='mb-3 flex items-center space-x-2 text-xs text-emerald-300/90'>
                      <div className='h-px flex-grow bg-gradient-to-r from-emerald-500/50 to-transparent'></div>
                      <span>THÔNG TIN THỊ TRƯỜNG</span>
                      <div className='h-px flex-grow bg-gradient-to-l from-emerald-500/50 to-transparent'></div>
                    </div>

                    {/* Summary and recommendation */}
                    {priceData?.priceSummary && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: animateItems ? 1 : 0, y: animateItems ? 0 : 20 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className={`rounded-lg border border-[#1D4B42] bg-gradient-to-br from-[#0A2C25] to-[#0D332B] p-3 shadow-md hover:border-emerald-500/40 hover:shadow-lg`}
                      >
                        <div className='mb-1 flex items-center text-xs font-medium tracking-wider text-gray-400 uppercase'>
                          <TrendingUp className='mr-1 h-3 w-3 text-emerald-400' />
                          TỔNG QUAN
                        </div>
                        <div className='text-xs leading-relaxed text-white'>{priceData.priceSummary}</div>
                      </motion.div>
                    )}

                    {priceData?.recommendation && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: animateItems ? 1 : 0, y: animateItems ? 0 : 20 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className={`rounded-lg border border-[#1D4B42] bg-gradient-to-br from-[#0A2C25] to-[#0D332B] p-3 shadow-md hover:border-emerald-500/40 hover:shadow-lg`}
                      >
                        <div className='mb-1 flex items-center text-xs font-medium tracking-wider text-gray-400 uppercase'>
                          <Leaf className='mr-1 h-3 w-3 text-emerald-400' />
                          KHUYẾN NGHỊ
                        </div>
                        <div className='text-xs leading-relaxed text-white'>{priceData.recommendation}</div>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom mobile navigation */}
          <div className='fixed bottom-0 left-0 z-50 w-full border-t border-emerald-500/30 bg-emerald-950/95 backdrop-blur-md md:hidden'>
            <div className='mx-auto flex h-16 max-w-md items-center justify-around px-6'>
              {[
                { id: 'prices', icon: <BarChart3 className='size-6 text-emerald-400' />, label: 'Bảng giá' },
                { id: 'info', icon: <Info className='size-6 text-emerald-400' />, label: 'Thông tin' }
              ].map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className='group relative flex flex-col items-center justify-center px-4'>
                  <div
                    className={`relative mb-1 flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'border border-emerald-400/50 bg-emerald-900 shadow-lg shadow-emerald-500/20'
                        : 'border border-emerald-500/20 bg-emerald-950/70 hover:border-emerald-500/40 hover:bg-emerald-900/40'
                    }`}
                  >
                    <div className={`relative z-10 transition-all duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                      {tab.icon}
                    </div>
                    {activeTab === tab.id && <div className='absolute inset-0 animate-pulse rounded-full bg-emerald-500/20'></div>}
                  </div>
                  <span
                    className={`text-xs font-medium transition-colors duration-300 ${
                      activeTab === tab.id ? 'text-emerald-300' : 'text-emerald-400/60 group-hover:text-emerald-300/80'
                    }`}
                  >
                    {tab.label}
                  </span>

                  {/* Active indicator dot */}
                  {activeTab === tab.id && <div className='absolute -bottom-0.5 h-1 w-6 rounded-full bg-emerald-400'></div>}
                </button>
              ))}
            </div>

            {/* Visual hint for interactivity */}
            <div className='absolute -top-1.5 left-1/2 -translate-x-1/2 rounded-full border border-emerald-500/20 bg-emerald-950 px-2 text-[10px] text-emerald-400/80'>
              chọn chế độ
            </div>
          </div>

          {/* Enhanced visual effects */}
          <div className='pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(transparent_0%,rgba(16,185,129,0.07)_50%,transparent_100%)] bg-[size:100%_4px]'></div>

          <div className='pointer-events-none absolute inset-0 z-20 opacity-30 mix-blend-overlay'>
            <div
              className='absolute inset-0 animate-pulse'
              style={{
                backgroundImage: 'linear-gradient(0deg, transparent 0%, rgba(16, 185, 129, 0.4) 2%, transparent 3%)',
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
                backgroundImage: 'linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.3), transparent)',
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
                boxShadow: '0 0 10px 2px rgba(16, 185, 129, 0.7)'
              }}
            ></div>
          </div>

          {/* Corner accents */}
          <div className='pointer-events-none absolute top-0 right-0 h-10 w-10 rounded-tr-xl border-t-2 border-r-2 border-emerald-400/20'></div>
          <div className='pointer-events-none absolute bottom-0 left-0 h-10 w-10 rounded-bl-xl border-b-2 border-l-2 border-emerald-400/20'></div>
        </div>

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced CSS animations */}
      <style jsx>{`
        @keyframes sparkle {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(0);
            opacity: 0;
          }
        }

        @keyframes float {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.7;
          }
          100% {
            transform: translateY(-100px) scale(0);
            opacity: 0;
          }
        }

        @keyframes raindrop {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.4;
          }
          80% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(100vh) scale(0.8);
            opacity: 0;
          }
        }

        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }

        .animate-dash {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: dash 1.5s linear infinite;
        }

        .animate-bounce-slow {
          animation: bounce 2s infinite;
        }

        .animate-bounce-reverse {
          animation: bounceReverse 2s infinite;
        }

        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes bounceReverse {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(3px);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes scanline {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }

        @keyframes glitch {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 100%;
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

        @keyframes ping {
          75%,
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}

export default AgriPriceTemplate
