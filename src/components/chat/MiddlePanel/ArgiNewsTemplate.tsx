'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import '@/lib/animations.css'
import { cn } from '@/lib/utils'
import { TArgiNewsTemplateProps, TArgiNewsItem } from '@/types'
import { AnimatePresence, motion } from 'framer-motion'
import { BarChart2, Calendar, ExternalLink, Globe, Leaf, Lightbulb, Newspaper, Scroll, Sparkles, Tag } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'

// News Card component - enhanced with better visual styling
const NewsCard = React.memo(({ item, onClick }: { item: TArgiNewsItem; onClick: () => void }) => (
  <motion.div
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    onClick={onClick}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={cn(
      'group relative cursor-pointer overflow-hidden rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-4 transition-all duration-300 hover:border-emerald-500/40 hover:bg-emerald-950/50 hover:shadow-sm hover:shadow-emerald-500/10'
    )}
  >
    <div className='mb-2.5 flex flex-col gap-4'>
      <h3 className='line-clamp-2 text-base leading-tight font-semibold text-emerald-100'>{item.title}</h3>

      <p className='line-clamp-2 text-sm text-emerald-100/80'>{item.content.substring(0, 120)}...</p>
    </div>

    <div className='mt-3 flex items-center justify-between border-t border-emerald-500/20 pt-3'>
      <div className='flex items-center gap-1.5 text-xs text-emerald-400/80'>
        <Calendar className='h-3.5 w-3.5' />
        {item.date}
      </div>

      <div className='flex items-center gap-1 text-xs text-emerald-400/80'>
        {item.source}
        <ExternalLink className='h-3.5 w-3.5' />
      </div>
    </div>

    {/* Category tag */}
    <div className='absolute top-3 right-3'>
      {item.category === 'Thị trường nông sản' ? (
        <div className='rounded-lg bg-emerald-900/50 px-2.5 py-1 text-xs font-medium text-emerald-300'>
          <div className='flex items-center gap-1.5'>
            <BarChart2 className='h-3 w-3 text-emerald-400' />
            <span>Thị trường</span>
          </div>
        </div>
      ) : (
        <div className='rounded-lg bg-emerald-900/50 px-2.5 py-1 text-xs font-medium text-emerald-300'>
          <div className='flex items-center gap-1.5'>
            <Leaf className='h-3 w-3 text-emerald-400' />
            <span>{item.category}</span>
          </div>
        </div>
      )}
    </div>
  </motion.div>
))

NewsCard.displayName = 'NewsCard'

// News Detail Full Screen component for selected news
const NewsDetailFullScreen = React.memo(({ item, onClose }: { item: TArgiNewsItem; onClose: () => void }) => {
  useEffect(() => {
    // Add event listener for Escape key to close the detail view
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    // Add the event listener when component mounts
    window.addEventListener('keydown', handleKeyDown)

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className='fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-emerald-950 to-slate-950/95 backdrop-blur-sm'
    >
      {/* Header with back button */}
      <div className='sticky top-0 z-10 flex items-center justify-between border-b border-emerald-500/30 bg-emerald-950/90 px-4 py-3 backdrop-blur-sm'>
        <button
          onClick={onClose}
          className='flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-900/40 px-3 py-2 text-sm text-emerald-200 transition-colors hover:bg-emerald-900/60'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M19 12H5M12 19l-7-7 7-7' />
          </svg>
          <span>Quay lại</span>
        </button>

        <div className='flex-shrink-0'>
          {item.category && (
            <div className='rounded-lg border border-emerald-500/30 bg-emerald-900/40 px-3 py-1 text-sm text-emerald-300'>
              {item.category === 'Thị trường nông sản' ? (
                <div className='flex items-center gap-1.5'>
                  <BarChart2 className='h-4 w-4 text-emerald-400' />
                  <span>Giá cả thị trường</span>
                </div>
              ) : (
                <div className='flex items-center gap-1.5'>
                  <Tag className='h-4 w-4 text-emerald-400' />
                  <span>{item.category}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ScrollArea className='h-[calc(100vh-135px)] flex-1 overflow-auto'>
        <div className='mx-auto max-w-3xl px-4 py-5'>
          {/* Title */}
          <h1 className='mb-5 text-2xl leading-tight font-bold text-emerald-100'>{item.title}</h1>

          {/* Meta info */}
          <div className='mb-6 grid grid-cols-2 gap-4'>
            <div className='flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-950/40 px-4 py-3'>
              <Calendar className='h-5 w-5 text-emerald-400/80' />
              <div>
                <div className='text-xs text-emerald-400/70'>Ngày đăng:</div>
                <div className='text-sm text-emerald-100'>{item.date}</div>
              </div>
            </div>

            <div className='flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-950/40 px-4 py-3'>
              <Globe className='h-5 w-5 text-emerald-400/80' />
              <div>
                <div className='text-xs text-emerald-400/70'>Nguồn:</div>
                <div className='flex items-center gap-1 text-sm text-emerald-100'>
                  {item.source}
                  <ExternalLink className='h-3 w-3' />
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className='mb-6 rounded-lg border border-emerald-500/20 bg-emerald-950/30 p-4 text-base leading-relaxed text-emerald-100/90'>
            <p>{item.content}</p>
          </div>

          {/* Impact section */}
          {item.impact && (
            <div className='mb-6 rounded-lg border border-emerald-500/20 bg-emerald-950/30 p-4'>
              <div className='mb-2 flex items-center gap-2 font-medium text-emerald-300'>
                <BarChart2 className='h-5 w-5 text-emerald-400' />
                <span>Tác động</span>
              </div>
              <p className='text-sm text-emerald-100/90'>{item.impact}</p>
            </div>
          )}

          {/* Recommendations section */}
          {item.recommendations && item.recommendations.length > 0 && (
            <div className='mb-6 rounded-lg border border-emerald-500/20 bg-emerald-950/30 p-4'>
              <div className='mb-2 flex items-center gap-2 font-medium text-emerald-300'>
                <Lightbulb className='h-5 w-5 text-emerald-400' />
                <span>Khuyến nghị</span>
              </div>
              <ul className='space-y-2'>
                {item.recommendations.map((rec, idx) => (
                  <li key={idx} className='flex items-start gap-2 text-sm text-emerald-100/90'>
                    <span className='mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400'></span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related products */}
          {item.relatedProducts && item.relatedProducts.length > 0 && (
            <div className='mb-6'>
              <div className='mb-2 flex items-center gap-2 font-medium text-emerald-300'>
                <Tag className='h-5 w-5 text-emerald-400' />
                <span>Sản phẩm liên quan</span>
              </div>
              <div className='flex flex-wrap gap-2'>
                {item.relatedProducts.map((product, idx) => (
                  <div key={idx} className='rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-sm text-emerald-200'>
                    {product}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </motion.div>
  )
})

NewsDetailFullScreen.displayName = 'NewsDetailFullScreen'

// Main Component
const ArgiNewsTemplate: React.FC<TArgiNewsTemplateProps> = ({ newsData, isLoading = false }) => {
  const [selectedNewsIndex, setSelectedNewsIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [glowing, setGlowing] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState('allNews')
  const [fullScreenView, setFullScreenView] = useState(false)
  const particlesRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Handle news selection and detail view
  const handleNewsSelect = useCallback((index: number) => {
    setSelectedNewsIndex(index)
    setFullScreenView(true)
  }, [])

  // Create a particle effect
  const createParticle = useCallback(() => {
    if (!particlesRef.current) return

    const particle = document.createElement('div')
    const particleType = Math.random()

    // Different particle types for visual variety
    if (particleType > 0.9) {
      // Sparkle particle
      particle.className = 'absolute pointer-events-none'
      particle.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3L14.5 8.5L20 11L14.5 13.5L12 19L9.5 13.5L4 11L9.5 8.5L12 3Z" fill="rgba(16, 185, 129, 0.7)" />
      </svg>`
    } else if (particleType > 0.7) {
      // Leaf particle
      particle.className = 'absolute pointer-events-none'
      particle.innerHTML = `<svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 21C6 21 8 12 16 8C16 8 16 16 10 20" stroke="rgba(16, 185, 129, 0.6)" stroke-width="2" />
      </svg>`
    } else {
      // Regular dot particle
      const isGolden = Math.random() > 0.8
      particle.className = `absolute rounded-full ${isGolden ? 'bg-emerald-400/60' : 'bg-emerald-300/50'} pointer-events-none`

      const size = isMobile ? Math.random() * 3 + 2 : Math.random() * 4 + 3
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
    }

    particle.style.left = `${Math.random() * 100}%`
    particle.style.bottom = '0px'

    const duration = isMobile ? Math.random() * 2000 + 2000 : Math.random() * 3000 + 3000
    particle.style.animation = `float ${duration}ms ease-in-out forwards`

    particlesRef.current.appendChild(particle)

    setTimeout(() => particle.remove(), duration)
  }, [isMobile])

  // Setup animations and effects
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    const glowInterval = setInterval(() => setGlowing((prev) => !prev), 2000)

    // Adjust particle interval based on device
    const particleInterval = setInterval(createParticle, isMobile ? 400 : 250)

    // Initiate scanning animation
    setLoaded(true)
    setScanning(true)
    const scanInterval = setInterval(() => {
      setScanning((prev) => !prev)
    }, 4000)

    return () => {
      window.removeEventListener('resize', checkMobile)
      clearInterval(glowInterval)
      clearInterval(particleInterval)
      clearInterval(scanInterval)
    }
  }, [createParticle, isMobile])

  // Smooth tab transition effect with fade-slide animation
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

  // Loading state with skeleton UI
  if (isLoading || !newsData) {
    return (
      <div
        className={cn(
          'flex min-h-[500px] w-full items-center justify-center overflow-hidden rounded-xl',
          'bg-gradient-to-b from-emerald-950 to-slate-950 p-4 sm:rounded-3xl sm:p-6'
        )}
      >
        <div className='relative w-full max-w-4xl'>
          <div ref={particlesRef} className='pointer-events-none absolute inset-0 overflow-hidden' />
          <div className='rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 backdrop-blur-sm sm:p-6'>
            <div className='animate-pulse space-y-4'>
              <div className='flex items-center space-x-3'>
                <div className='h-10 w-10 rounded-full bg-emerald-800/40'></div>
                <div className='space-y-2'>
                  <div className='h-4 w-48 rounded bg-emerald-800/40'></div>
                  <div className='h-3 w-24 rounded bg-emerald-800/40'></div>
                </div>
              </div>
              <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
                <div className='space-y-3'>
                  <div className='h-24 rounded-xl bg-emerald-800/30'></div>
                  <div className='h-24 rounded-xl bg-emerald-800/30'></div>
                </div>
                <div className='col-span-2 space-y-4'>
                  <div className='h-8 rounded-lg bg-emerald-800/30'></div>
                  <div className='grid grid-cols-2 gap-2'>
                    <div className='h-4 rounded bg-emerald-800/30'></div>
                    <div className='h-4 rounded bg-emerald-800/30'></div>
                  </div>
                  <div className='h-32 rounded-lg bg-emerald-800/30'></div>
                  <div className='h-20 rounded-lg bg-emerald-800/30'></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const selectedNews = newsData.news[selectedNewsIndex]

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'allNews':
        return (
          <div className='space-y-4'>
            {/* News list header */}
            <div className='flex items-center justify-between'>
              <h2 className='text-lg font-semibold text-emerald-200'>Tin tức nông nghiệp</h2>
              <div className='rounded-full border border-emerald-500/30 bg-emerald-950/60 px-2.5 py-1 text-xs text-emerald-300/90'>
                {newsData.news.length} tin
              </div>
            </div>

            {/* News list */}
            <div className='grid gap-4'>
              <AnimatePresence>
                {newsData.news.map((item, index) => (
                  <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
                    <NewsCard item={item} onClick={() => handleNewsSelect(index)} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )
      case 'market':
        // Filter and show only market news
        const marketNews = newsData.news.filter((item) => item.category === 'Thị trường nông sản')

        return (
          <div className='space-y-4'>
            {/* Market news header */}
            <div className='flex items-center justify-between'>
              <h2 className='text-lg font-semibold text-emerald-200'>Tin thị trường</h2>
              <div className='rounded-full border border-emerald-500/30 bg-emerald-950/60 px-2.5 py-1 text-xs text-emerald-300/90'>{marketNews.length} tin</div>
            </div>

            {/* Market news list */}
            <div className='grid gap-4'>
              {marketNews.length > 0 ? (
                <AnimatePresence>
                  {marketNews.map((item, index) => (
                    <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
                      <NewsCard item={item} onClick={() => handleNewsSelect(newsData.news.indexOf(item))} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <div className='flex h-20 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-950/30'>
                  <p className='text-sm text-emerald-300/70'>Không có tin thị trường</p>
                </div>
              )}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'flex min-h-[500px] w-full items-center justify-center overflow-hidden rounded-xl',
        'bg-gradient-to-b from-emerald-950 to-slate-950 p-4 sm:rounded-3xl sm:p-6'
      )}
    >
      <div className='relative w-full max-w-4xl'>
        {/* Ambient background effects */}
        <div className='absolute -top-10 -right-10 -z-10 h-64 w-64 rounded-full bg-emerald-700/5 blur-3xl'></div>
        <div className='absolute -bottom-10 -left-10 -z-10 h-64 w-64 rounded-full bg-emerald-700/5 blur-3xl'></div>

        {/* Main container */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`relative overflow-hidden rounded-2xl border border-emerald-500/40 shadow-lg shadow-emerald-500/5 backdrop-blur-sm transition-all duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Background with gradient */}
          <div className='absolute inset-0 z-0 bg-gradient-to-b from-emerald-950/95 via-slate-950/95 to-emerald-950/95'></div>

          {/* Animated scanning effect */}
          <div
            className={`absolute inset-0 z-20 h-full w-full bg-gradient-to-b from-transparent via-emerald-400/15 to-transparent transition-all duration-2000 ease-in-out ${scanning ? 'translate-y-full' : '-translate-y-full'}`}
            style={{ transitionDuration: '4000ms' }}
          ></div>

          {/* Particles container */}
          <div ref={particlesRef} className='pointer-events-none absolute inset-0 z-10 overflow-hidden'></div>

          {/* Header section */}
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className='relative z-30 border-b border-emerald-500/40 bg-emerald-950/60 p-4 backdrop-blur-sm sm:p-5'
          >
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <div className='relative'>
                  <motion.div
                    animate={{ rotate: [0, 5, 0, -5, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border border-emerald-500/50 bg-emerald-900/80 transition-all duration-300 sm:h-10 sm:w-10 ${
                      glowing ? 'shadow-lg shadow-emerald-400/20' : ''
                    }`}
                  >
                    <Newspaper className={`h-4 w-4 text-emerald-300 transition-all duration-300 sm:h-5 sm:w-5 ${glowing ? 'animate-pulse' : ''}`} />
                    {glowing && <div className='absolute inset-0 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-emerald-400/30'></div>}
                  </motion.div>
                  <div className='absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 shadow-md shadow-emerald-500/10 sm:h-5 sm:w-5'>
                    <div className='h-2 w-2 rounded-full bg-emerald-400 sm:h-2.5 sm:w-2.5'></div>
                  </div>
                </div>
                <div>
                  <div className='flex items-center'>
                    <motion.h3
                      initial={{ x: -20 }}
                      animate={{ x: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      className='bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-lg font-bold text-transparent sm:text-xl'
                    >
                      Tin tức nông nghiệp
                      <Sparkles className='ml-2 inline-block h-4 w-4 text-emerald-400' />
                    </motion.h3>

                    {/* Market News Indicator */}
                    {newsData.news.some((item) => item.category === 'Thị trường nông sản') && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.3 }}
                        className='ml-2 hidden items-center rounded-full border border-emerald-500/30 bg-emerald-900/50 px-2 py-0.5 backdrop-blur-sm sm:flex'
                      >
                        <BarChart2 className='mr-1 h-3 w-3 text-emerald-400' />
                        <span className='text-xs font-medium text-emerald-300'>Thị trường</span>
                        <motion.span
                          className='ml-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400'
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </motion.div>
                    )}
                  </div>
                  <div className='mt-1 flex items-center gap-2 text-xs text-emerald-400/80'>
                    <span>Đom Đóm AI</span>
                    <motion.span
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                      className='rounded-full border border-emerald-500/30 bg-emerald-950/60 px-2 py-0.5 text-xs text-emerald-300/90'
                    >
                      {newsData.news.length} tin mới
                    </motion.span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Desktop Navigation tabs */}
          <div className='relative z-30 hidden border-b border-emerald-500/30 bg-emerald-950/90 px-5 py-3 md:block'>
            <div className='flex items-center gap-4'>
              {[
                { id: 'allNews', icon: <Newspaper className='size-4 text-emerald-400' />, label: 'Tin tức' },
                { id: 'market', icon: <BarChart2 className='size-4 text-emerald-400' />, label: 'Thị trường' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'group flex items-center gap-2 rounded-md border px-3 py-1.5 transition-all duration-300',
                    activeTab === tab.id
                      ? 'border-emerald-400/40 bg-emerald-900/30 shadow-md shadow-emerald-900/50'
                      : 'border-emerald-500/20 bg-emerald-950/30 hover:bg-emerald-900/20'
                  )}
                >
                  <div className={`relative transition-all duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`}>{tab.icon}</div>
                  <span
                    className={`text-sm font-medium transition-colors duration-300 ${
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
          </div>

          {/* Content section - adaptive layout with proper bottom padding for mobile */}
          <div ref={contentRef} className='relative z-30 p-4 pb-28 transition-all duration-500 sm:p-5 md:pb-6'>
            {renderTabContent()}
          </div>

          {/* Bottom mobile navigation - Only visible on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className='fixed bottom-0 left-0 z-40 w-full border-t border-emerald-500/30 bg-emerald-950/95 backdrop-blur-md md:hidden'
          >
            <div className='mx-auto flex items-center justify-around px-4 py-2'>
              {[
                { id: 'allNews', icon: <Newspaper className='h-5 w-5 text-emerald-400' />, label: 'Tin tức' },
                { id: 'market', icon: <BarChart2 className='h-5 w-5 text-emerald-400' />, label: 'Thị trường' }
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

          {/* Decorative elements */}
          <div
            className='absolute bottom-0 left-0 -z-5 h-40 w-40 rounded-full bg-emerald-600/5 blur-2xl'
            style={{ animation: 'pulse 10s infinite ease-in-out' }}
          ></div>

          <div
            className='absolute top-0 right-0 -z-5 h-32 w-32 rounded-full bg-emerald-600/5 blur-2xl'
            style={{ animation: 'pulse 8s infinite ease-in-out' }}
          ></div>

          {/* Scan lines effect */}
          <div className='pointer-events-none absolute inset-0 z-40 bg-[linear-gradient(transparent_0%,rgba(16,185,129,0.05)_50%,transparent_100%)] bg-[size:100%_4px]'></div>

          {/* Glow effects */}
          <div className='pointer-events-none absolute inset-0 z-30 opacity-40 mix-blend-overlay'>
            <div
              className='absolute inset-0'
              style={{
                backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.15), transparent 70%)'
              }}
            ></div>
          </div>

          {/* Shimmer effect */}
          <div className='pointer-events-none absolute inset-0 z-20 opacity-20'>
            <div
              className='absolute inset-0'
              style={{
                backgroundImage: 'linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.2), transparent)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 8s infinite linear'
              }}
            ></div>
          </div>

          {/* Add market category distribution indicator */}
          {newsData.news.some((item) => item.category === 'Thị trường nông sản') && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className='relative z-30 hidden items-center justify-center py-1 md:flex'
            >
              <div className='flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/40 px-3 py-1 backdrop-blur-sm'>
                <BarChart2 className='h-3.5 w-3.5 text-emerald-400/70' />
                <span className='text-xs text-emerald-300/80'>
                  Tin thị trường:
                  <span className='ml-1 font-medium text-emerald-200'>
                    {newsData.news.filter((item) => item.category === 'Thị trường nông sản').length}/{newsData.news.length}
                  </span>
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Full Screen Detail View - Only visible when a news item is selected */}
      <AnimatePresence>{fullScreenView && <NewsDetailFullScreen item={selectedNews} onClose={() => setFullScreenView(false)} />}</AnimatePresence>
    </motion.div>
  )
}

export default React.memo(ArgiNewsTemplate)
