'use client'

import '@/lib/animations.css'
import { cn } from '@/lib/utils'
import { TArgiNewsTemplateProps } from '@/types'
import { AnimatePresence, motion } from 'framer-motion'
import { Calendar, ChevronDown, ChevronUp, ExternalLink, Globe, Lightbulb, Newspaper, Tag, TrendingUp } from 'lucide-react'
import React, { memo, useEffect, useRef, useState } from 'react'

// Header Component with modern design
const NewsHeader = memo(({ newsCount }: { newsCount: number }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className={cn('sticky top-0 z-50', 'bg-gradient-to-b from-emerald-950/90 to-slate-950/90', 'border-b border-emerald-500/30 shadow-md')}
  >
    <div className='flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4'>
      <div className='flex items-center gap-3 sm:gap-4'>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'relative flex h-10 w-10 items-center justify-center rounded-xl sm:h-12 sm:w-12',
            'bg-gradient-to-br from-emerald-950 to-slate-900',
            'border border-emerald-500/50 shadow-md shadow-emerald-400/20'
          )}
        >
          <Newspaper className={cn('h-5 w-5 sm:h-6 sm:w-6', 'text-emerald-400')} />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className='absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 text-xs font-medium text-white shadow-sm sm:h-5 sm:w-5'
          >
            {newsCount}
          </motion.div>
        </motion.div>

        <div>
          <h1 className={cn('bg-clip-text text-lg font-bold tracking-tight sm:text-xl', 'bg-gradient-to-r from-emerald-300 to-emerald-100 text-transparent')}>
            Tin tức nông nghiệp
          </h1>
          <div className='flex items-center gap-2 text-xs sm:text-sm'>
            <span className={cn('font-medium', 'text-emerald-400/70')}>Đom Đóm AI</span>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className={cn('rounded-full px-2 py-0.5 text-xs', 'border border-emerald-500/30 bg-emerald-950/40 text-emerald-400/70')}
            >
              {newsCount} tin mới
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
))

NewsHeader.displayName = 'NewsHeader'

// Meta Info Component
const MetaInfo = memo(({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={cn('flex items-center gap-2 rounded-lg border p-2 transition-colors', 'border-emerald-500/30 bg-emerald-950/40')}
  >
    <div className='text-emerald-400'>{icon}</div>
    <div>
      <div className={cn('text-xs', 'text-emerald-400/70')}>{label}</div>
      <div className={cn('text-sm font-medium', 'text-emerald-100')}>{value}</div>
    </div>
  </motion.div>
))

MetaInfo.displayName = 'MetaInfo'

// Enhanced News Card Component
const NewsCard = memo(({ item, index }: { item: any; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className={cn(
        'group relative overflow-hidden rounded-xl transition-all duration-300',
        'border border-emerald-500/30 bg-gradient-to-br from-emerald-950/80 to-slate-900/90',
        'hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-400/20'
      )}
    >
      {/* Category Badge */}
      <div className='absolute top-3 right-3 z-10'>
        <motion.span
          whileHover={{ scale: 1.05 }}
          className={cn('rounded-full px-2.5 py-1 text-xs font-medium shadow-sm', 'border border-emerald-500/30 bg-emerald-950/40 text-emerald-400/70')}
        >
          {item.category}
        </motion.span>
      </div>

      <div className='p-4 sm:p-5'>
        {/* Title */}
        <h3
          className={cn('text-base leading-tight font-semibold sm:text-lg', 'bg-gradient-to-r from-emerald-300 to-emerald-100 bg-clip-text text-transparent')}
        >
          {item.title}
        </h3>

        {/* Meta Information */}
        <div className='mt-3 grid grid-cols-2 gap-2 sm:gap-3'>
          <MetaInfo icon={<Calendar className='h-3.5 w-3.5 text-emerald-400 sm:h-4 sm:w-4' />} label='Ngày đăng' value={item.date} />
          <MetaInfo
            icon={<Globe className='h-3.5 w-3.5 text-emerald-400 sm:h-4 sm:w-4' />}
            label='Nguồn'
            value={
              <div className='flex items-center gap-1 text-emerald-100'>
                {item.source}
                <ExternalLink className='h-2.5 w-2.5 sm:h-3 sm:w-3' />
              </div>
            }
          />
        </div>

        {/* Content */}
        <div className='mt-3 sm:mt-4'>
          <AnimatePresence>
            <motion.div
              key={isExpanded ? 'expanded' : 'collapsed'}
              initial={{ height: isExpanded ? 0 : 'auto' }}
              animate={{ height: 'auto' }}
              className={cn('prose prose-sm max-w-none text-sm text-emerald-100/90 transition-all duration-300', !isExpanded && 'line-clamp-3')}
            >
              {item.content}
            </motion.div>
          </AnimatePresence>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              'mt-2 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors',
              'bg-emerald-950/40 text-emerald-400/70 hover:bg-emerald-900/30 hover:text-emerald-300'
            )}
          >
            {isExpanded ? (
              <>
                <ChevronUp className='h-3.5 w-3.5' />
                Thu gọn
              </>
            ) : (
              <>
                <ChevronDown className='h-3.5 w-3.5' />
                Xem thêm
              </>
            )}
          </motion.button>
        </div>

        {/* Impact Section */}
        <motion.div whileHover={{ scale: 1.01 }} className={cn('mt-3 rounded-lg border p-3 sm:mt-4 sm:p-4', 'border-emerald-500/30 bg-emerald-950/40')}>
          <div className='flex items-center gap-2 text-xs font-medium text-emerald-400/70 sm:text-sm'>
            <TrendingUp className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4', 'text-emerald-400')} />
            <span>Tác động</span>
          </div>
          <p className={cn('mt-1.5 text-xs sm:text-sm', 'text-emerald-100/90')}>{item.impact}</p>
        </motion.div>

        {/* Related Products */}
        {item.relatedProducts.length > 0 && (
          <div className='mt-3 sm:mt-4'>
            <div className='flex items-center gap-2 text-xs font-medium text-emerald-400/70 sm:text-sm'>
              <Tag className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4', 'text-emerald-400')} />
              <span>Sản phẩm liên quan</span>
            </div>
            <div className='mt-1.5 flex flex-wrap gap-1.5'>
              {item.relatedProducts.map((product: string, idx: number) => (
                <motion.span
                  key={idx}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={cn('rounded-full border px-2.5 py-0.5 text-xs', 'border-emerald-500/30 bg-emerald-950/40 text-emerald-400/70')}
                >
                  {product}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations Section */}
        {item.recommendations && item.recommendations.length > 0 && (
          <motion.div whileHover={{ scale: 1.01 }} className={cn('mt-3 rounded-lg border p-3 sm:mt-4 sm:p-4', 'border-emerald-500/30 bg-emerald-950/40')}>
            <div className='flex items-center gap-2 text-xs font-medium text-emerald-400/70 sm:text-sm'>
              <Lightbulb className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4', 'text-emerald-400')} />
              <span>Khuyến nghị</span>
            </div>
            <ul className={cn('mt-1.5 space-y-1 text-xs sm:text-sm', 'text-emerald-100/90')}>
              {item.recommendations.map((rec: string, idx: number) => (
                <li key={idx} className='flex items-start gap-1.5'>
                  <span className='mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400'></span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
})

NewsCard.displayName = 'NewsCard'

// Main Component
const ArgiNewsTemplate: React.FC<TArgiNewsTemplateProps> = ({ newsData, isLoading = false }) => {
  const [showParticles, setShowParticles] = useState(true)
  const particlesRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Check for mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Particle effect for visual enhancement
  useEffect(() => {
    if (!showParticles || !particlesRef.current) return

    const interval = setInterval(
      () => {
        if (!particlesRef.current) return

        const particle = document.createElement('div')
        particle.className = 'absolute rounded-full bg-emerald-400/10'

        const size = Math.random() * 15 + 5
        particle.style.width = `${size}px`
        particle.style.height = `${size}px`

        particle.style.left = `${Math.random() * 100}%`
        particle.style.bottom = '0px'

        const duration = isMobile ? Math.random() * 1500 + 1500 : Math.random() * 2500 + 2500
        particle.style.animation = `float ${duration}ms ease-in-out forwards`

        particlesRef.current.appendChild(particle)

        setTimeout(() => particle.remove(), duration)
      },
      isMobile ? 600 : 400
    )

    return () => clearInterval(interval)
  }, [isMobile, showParticles])

  // Loading state with enhanced animation
  if (isLoading || !newsData) {
    return (
      <div className={cn('relative w-full overflow-hidden rounded-xl transition-colors', 'bg-gradient-to-b from-emerald-950 to-slate-950')}>
        <div ref={particlesRef} className='pointer-events-none absolute inset-0 overflow-hidden' />
        <div className='space-y-3 p-4'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className='h-16 animate-pulse rounded-xl bg-emerald-950/40 shadow-md'
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className='h-48 animate-pulse rounded-xl bg-emerald-950/40 shadow-md'
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className='h-48 animate-pulse rounded-xl bg-emerald-950/40 shadow-md'
          />
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={cn('relative w-full overflow-hidden rounded-xl transition-colors', 'bg-gradient-to-b from-emerald-950 to-slate-950')}>
      <div ref={particlesRef} className='pointer-events-none absolute inset-0 overflow-hidden' />
      <NewsHeader newsCount={newsData.news.length} />

      <main className='p-3 sm:p-4'>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className='space-y-4'>
          {newsData.news.map((item, idx) => (
            <NewsCard key={idx} item={item} index={idx} />
          ))}
        </motion.div>
      </main>
    </div>
  )
}

export default memo(ArgiNewsTemplate)
