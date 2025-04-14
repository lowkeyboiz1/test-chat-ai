'use client'

import { ArrowUpRight, Calendar, ChevronDown, ChevronUp, ExternalLink, Globe, Lightbulb, Newspaper, Tag, TrendingUp } from 'lucide-react'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { ArgiNewsTemplateProps } from '@/types'

const ArgiNewsTemplate: React.FC<ArgiNewsTemplateProps> = ({ newsData, isLoading = false }) => {
  const [expandedItems, setExpandedItems] = useState<boolean[]>([])
  const [loaded, setLoaded] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [glowing, setGlowing] = useState(false)
  const contentRefs = useRef<(HTMLDivElement | null)[]>([])
  const particlesRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Enhanced particles effect
  const createParticle = useCallback(() => {
    if (!particlesRef.current) return

    const particle = document.createElement('div')
    const isGolden = Math.random() > 0.7

    particle.className = `absolute rounded-full ${isGolden ? 'bg-amber-500/50' : 'bg-amber-400/40'} pointer-events-none`

    const size = Math.random() * 5 + 2
    particle.style.width = `${size}px`
    particle.style.height = `${size}px`

    particle.style.left = `${Math.random() * 100}%`
    particle.style.bottom = '0px'

    const duration = Math.random() * 4000 + 3000
    particle.style.animation = `float ${duration}ms ease-in-out forwards`

    particlesRef.current.appendChild(particle)

    setTimeout(() => particle.remove(), duration)
  }, [])

  // Scroll to active news item
  const scrollToActiveNews = useCallback(() => {
    if (containerRef.current && newsData?.news.length) {
      const newsElements = containerRef.current.querySelectorAll('.news-item')
      if (newsElements[activeIndex]) {
        newsElements[activeIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }, [activeIndex, newsData?.news.length])

  useEffect(() => {
    if (isLoading || !newsData) return

    setLoaded(true)
    // Initialize expanded state for each news item
    setExpandedItems(newsData.news.map(() => false))

    const glowInterval = setInterval(() => setGlowing((prev) => !prev), 2000)
    const particleInterval = setInterval(createParticle, 200)

    // Auto-expand for short content
    setTimeout(() => {
      contentRefs.current.forEach((ref, index) => {
        if (ref && ref.scrollHeight < 300) {
          setExpandedItems((prev) => {
            const newState = [...prev]
            newState[index] = true
            return newState
          })
        }
      })
    }, 0)

    return () => {
      clearInterval(glowInterval)
      clearInterval(particleInterval)
    }
  }, [isLoading, newsData, createParticle])

  useEffect(() => {
    scrollToActiveNews()
  }, [activeIndex, scrollToActiveNews])

  const toggleExpanded = (index: number) => {
    setExpandedItems((prev) => {
      const newState = [...prev]
      newState[index] = !newState[index]
      return newState
    })
  }

  const navigateNews = (direction: 'prev' | 'next') => {
    if (!newsData) return

    setActiveIndex((prev) => {
      if (direction === 'next') {
        return prev < newsData.news.length - 1 ? prev + 1 : prev
      } else {
        return prev > 0 ? prev - 1 : prev
      }
    })
  }

  if (isLoading || !newsData) {
    return (
      <div className='flex min-h-[500px] w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-amber-50 to-white p-4'>
        <div className='flex flex-col items-center'>
          <div className='h-12 w-12 animate-pulse rounded-full bg-amber-200'></div>
          <div className='mt-4 h-4 w-48 animate-pulse rounded-full bg-amber-100'></div>
          <div className='mt-2 h-3 w-32 animate-pulse rounded-full bg-amber-100/70'></div>
          <div className='mt-6 grid w-64 grid-cols-2 gap-3'>
            <div className='h-20 animate-pulse rounded-lg bg-amber-50'></div>
            <div className='h-20 animate-pulse rounded-lg bg-amber-50'></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex min-h-[500px] w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-amber-50 to-white p-4 sm:rounded-3xl sm:p-6'>
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-100vh) rotate(720deg);
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
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.08);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className='relative w-full max-w-lg'>
        {/* Enhanced ambient background effects */}
        <div className='absolute top-0 right-0 -z-10 h-40 w-40 rounded-full bg-amber-400/15 blur-3xl sm:h-48 sm:w-48'></div>
        <div className='absolute bottom-0 left-0 -z-10 h-40 w-40 rounded-full bg-amber-400/15 blur-3xl sm:h-48 sm:w-48'></div>
        <div className='absolute top-1/3 left-1/4 -z-10 h-24 w-24 rounded-full bg-amber-300/10 blur-2xl'></div>

        {/* Main container */}
        <div
          className={`relative overflow-hidden rounded-xl border border-amber-500/30 backdrop-blur-sm transition-all duration-500 sm:rounded-2xl ${loaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        >
          <div className='absolute inset-0 z-0 bg-gradient-to-b from-amber-50/90 via-white/95 to-amber-50/90'></div>
          <div ref={particlesRef} className='pointer-events-none absolute inset-0 overflow-hidden'></div>

          {/* Header section */}
          <div className='relative z-10 border-b border-amber-500/30 p-4 sm:p-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3 sm:space-x-3'>
                <div
                  className={`relative flex h-12 w-12 items-center justify-center rounded-full border border-amber-500/50 bg-white transition-all duration-300 sm:h-12 sm:w-12 ${
                    glowing ? 'shadow-lg shadow-amber-400/30' : ''
                  }`}
                >
                  <Newspaper className={`h-6 w-6 text-amber-500 sm:h-6 sm:w-6 ${glowing ? 'animate-pulse' : ''}`} />
                  {glowing && <div className='absolute inset-0 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-amber-400/40 blur-md'></div>}
                </div>
                <div>
                  <h3 className='bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-xl font-bold text-transparent sm:text-2xl'>
                    Tin tức nông nghiệp
                  </h3>
                  <div className='mt-1 flex items-center text-xs text-amber-500/70'>
                    <div className='mr-1.5 h-1.5 w-1.5 rounded-full bg-amber-500'></div>
                    <span>Đom Đóm AI</span>
                    {newsData.news.length > 0 && (
                      <span className='ml-2 rounded-full bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700'>{newsData.news.length} tin mới</span>
                    )}
                  </div>
                </div>
              </div>

              {newsData.news.length > 1 && (
                <div className='flex space-x-1'>
                  <button
                    onClick={() => navigateNews('prev')}
                    disabled={activeIndex === 0}
                    className={`rounded-full p-1.5 transition-colors ${activeIndex === 0 ? 'cursor-not-allowed text-amber-300' : 'text-amber-500 hover:bg-amber-100'}`}
                  >
                    <ChevronUp className='h-4 w-4' />
                  </button>
                  <button
                    onClick={() => navigateNews('next')}
                    disabled={activeIndex === newsData.news.length - 1}
                    className={`rounded-full p-1.5 transition-colors ${activeIndex === newsData.news.length - 1 ? 'cursor-not-allowed text-amber-300' : 'text-amber-500 hover:bg-amber-100'}`}
                  >
                    <ChevronDown className='h-4 w-4' />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* News items */}
          <div
            ref={containerRef}
            className='scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-transparent relative z-10 max-h-[60vh] overflow-y-auto p-4 sm:p-6'
          >
            {newsData.news.map((item, newsIndex) => (
              <div
                key={newsIndex}
                className={`news-item transition-all duration-500 ${
                  newsIndex > 0 ? 'mt-6 border-t border-amber-200/50 pt-6' : ''
                } ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} ${
                  activeIndex === newsIndex ? '-m-2 rounded-lg p-2 ring-2 ring-amber-300/50' : ''
                }`}
                style={{ transitionDelay: `${newsIndex * 100}ms` }}
              >
                {/* News header */}
                <div className='mb-3 flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full ${activeIndex === newsIndex ? 'bg-amber-500/30' : 'bg-amber-500/20'} transition-colors`}
                    >
                      <Newspaper className='h-4 w-4 text-amber-600' />
                    </div>
                    <h3 className='text-lg font-bold text-slate-800'>{item.title}</h3>
                  </div>
                  <div className='rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 shadow-sm'>{item.category}</div>
                </div>

                {/* Meta information */}
                <div className='mb-3 grid grid-cols-2 gap-2 text-sm'>
                  <div className='flex items-center space-x-2 rounded-lg bg-white p-2.5 shadow-sm transition-transform hover:scale-[1.02]'>
                    <Calendar className='h-4 w-4 text-amber-500' />
                    <div>
                      <div className='text-xs text-slate-500'>Ngày đăng</div>
                      <div className='font-medium text-slate-700'>{item.date}</div>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2 rounded-lg bg-white p-2.5 shadow-sm transition-transform hover:scale-[1.02]'>
                    <Globe className='h-4 w-4 text-amber-500' />
                    <div>
                      <div className='text-xs text-slate-500'>Nguồn</div>
                      <div className='flex items-center font-medium text-slate-700'>
                        {item.source}
                        <ExternalLink className='ml-1 h-3 w-3 text-amber-400' />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content section */}
                <div className='mb-3 overflow-hidden rounded-lg border border-amber-100/50 bg-white p-3.5 shadow-sm'>
                  <div
                    ref={(el) => {
                      contentRefs.current[newsIndex] = el
                    }}
                    className={`overflow-hidden text-sm leading-relaxed text-slate-700 transition-all duration-500 ${expandedItems[newsIndex] ? 'max-h-[1000px]' : 'max-h-[150px]'}`}
                  >
                    {item.content}
                  </div>

                  {contentRefs.current[newsIndex] && contentRefs.current[newsIndex]?.scrollHeight > 150 && (
                    <button
                      onClick={() => toggleExpanded(newsIndex)}
                      className='mt-2 flex w-full items-center justify-center gap-1 rounded-lg bg-amber-50 py-1.5 text-xs font-medium text-amber-700 transition-all duration-200 hover:bg-amber-100 hover:shadow-sm'
                    >
                      {expandedItems[newsIndex] ? (
                        <>
                          <ChevronUp className='h-3 w-3' /> Rút gọn
                        </>
                      ) : (
                        <>
                          <ChevronDown className='h-3 w-3' /> Xem thêm
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Impact section */}
                <div className='mb-3 rounded-lg border border-amber-200/50 bg-amber-50/80 p-3.5 shadow-sm backdrop-blur-sm'>
                  <div className='mb-1.5 flex items-center space-x-1.5 text-xs font-medium text-amber-700 uppercase'>
                    <TrendingUp className='h-3.5 w-3.5' />
                    <span>Tác động</span>
                  </div>
                  <div className='text-sm leading-relaxed text-slate-700'>{item.impact}</div>
                </div>

                {/* Related products */}
                {item.relatedProducts.length > 0 && (
                  <div className='mb-3 rounded-lg border border-slate-200/70 bg-white p-3.5 shadow-sm'>
                    <div className='mb-2 flex items-center space-x-1.5 text-xs font-medium text-slate-500 uppercase'>
                      <Tag className='h-3.5 w-3.5' />
                      <span>Sản phẩm liên quan</span>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      {item.relatedProducts.map((product, index) => (
                        <div
                          key={index}
                          className='cursor-pointer rounded-full border border-slate-200/50 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 transition-all hover:bg-slate-200 hover:shadow-sm'
                        >
                          {product}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {item.recommendations.length > 0 && (
                  <div className='rounded-lg border border-emerald-200/50 bg-emerald-50/80 p-3.5 shadow-sm backdrop-blur-sm'>
                    <div className='mb-2 flex items-center space-x-1.5 text-xs font-medium text-emerald-700 uppercase'>
                      <Lightbulb className='h-3.5 w-3.5' />
                      <span>Khuyến nghị</span>
                    </div>
                    <div className='space-y-2.5'>
                      {item.recommendations.map((recommendation, index) => (
                        <div key={index} className='flex items-start gap-2 text-sm leading-relaxed text-slate-700'>
                          <ArrowUpRight className='mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-600' />
                          <span>{recommendation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Visual effects overlays */}
          <div className='pointer-events-none absolute inset-0 z-20 opacity-30 mix-blend-overlay'>
            <div
              className='absolute inset-0 animate-pulse'
              style={{
                backgroundImage: 'linear-gradient(0deg, transparent 0%, rgba(245, 158, 11, 0.1) 2%, transparent 3%)',
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
                backgroundImage: 'linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.2), transparent)',
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

export default memo(ArgiNewsTemplate)
