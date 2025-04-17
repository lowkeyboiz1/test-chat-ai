'use client'

import '@/lib/animations.css'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { cn } from '@/lib/utils'
import { FarmingTechniqueTemplateProps } from '@/types/templates'
import { Calendar, DropletIcon, MapPin, ShowerHead, Sprout, SunIcon, ThermometerIcon, Trees, ListChecks } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// Technique icon component to avoid recreating on each render
const TechniqueIcon = React.memo(({ icon, size = 'small' }: { icon: React.ReactNode; size?: 'small' | 'large' }) => {
  const iconProps = size === 'large' ? { className: 'h-16 w-16 text-emerald-400' } : { className: 'h-6 w-6 text-emerald-400' }

  return (
    <div className={`flex items-center justify-center ${size === 'large' ? 'h-16 w-16' : 'h-8 w-8'} relative`}>
      {icon}
      <div className='absolute inset-0 animate-pulse rounded-full bg-emerald-400/10 blur-[2px]'></div>
    </div>
  )
})

TechniqueIcon.displayName = 'TechniqueIcon'

// Farming Tag component
const FarmingTag = React.memo(({ label }: { label: string }) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className='inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-950/60 px-2.5 py-1 text-xs font-medium text-emerald-300/90 shadow-sm shadow-emerald-500/10 backdrop-blur-sm'
    whileHover={{ scale: 1.05, backgroundColor: 'rgba(16, 185, 129, 0.2)' }}
  >
    <Sprout className='mr-1 h-3 w-3 text-emerald-400' />
    {label}
  </motion.div>
))

FarmingTag.displayName = 'FarmingTag'

// Farming Stat component
const FarmingStat = React.memo(({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
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

FarmingStat.displayName = 'FarmingStat'

const FarmingTechniqueTemplate: React.FC<FarmingTechniqueTemplateProps> = ({ techniqueData, isLoading = false }) => {
  const [loaded, setLoaded] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [glowing, setGlowing] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const particlesRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [selectedCondition, setSelectedCondition] = useState(0)

  // Ideal conditions data for mapping - memoized to prevent recreating on each render
  const idealConditionsData = useMemo(
    () => [
      {
        id: 'temperature',
        icon: <ThermometerIcon className='h-4 w-4 text-emerald-400 sm:h-5 sm:w-5' />,
        label: 'Nhiệt độ',
        value: techniqueData?.idealConditions.temperature
      },
      {
        id: 'water',
        icon: <DropletIcon className='h-4 w-4 text-emerald-400 sm:h-5 sm:w-5' />,
        label: 'Nước',
        value: techniqueData?.idealConditions.water
      },
      {
        id: 'soil',
        icon: <ShowerHead className='h-4 w-4 text-emerald-400 sm:h-5 sm:w-5' />,
        label: 'Đất',
        value: techniqueData?.idealConditions.soil
      },
      {
        id: 'sunlight',
        icon: <SunIcon className='h-4 w-4 text-emerald-400 sm:h-5 sm:w-5' />,
        label: 'Ánh sáng',
        value: techniqueData?.idealConditions.sunlight
      }
    ],
    [techniqueData?.idealConditions]
  )

  // Optimized particle creation with reduced frequency on mobile
  const createParticle = useCallback(() => {
    if (!particlesRef.current) return

    const particle = document.createElement('div')
    const isGolden = Math.random() > 0.7

    particle.className = `absolute rounded-full ${isGolden ? 'bg-emerald-500/50' : 'bg-emerald-400/40'} pointer-events-none`

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

  // Enhanced loading sequence with mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    if (isLoading || !techniqueData) return

    const glowInterval = setInterval(() => setGlowing((prev) => !prev), 2000)

    // Adjust particle interval based on device
    const particleInterval = setInterval(createParticle, isMobile ? 400 : 250)

    setLoaded(true)
    const timer = setTimeout(() => setShowDetails(true), 300)

    return () => {
      window.removeEventListener('resize', checkMobile)
      clearInterval(glowInterval)
      clearInterval(particleInterval)
      clearTimeout(timer)
    }
  }, [isLoading, techniqueData, createParticle, isMobile])

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className='w-full space-y-4'>
            {/* Crop info with futuristic style */}
            <div className={`transition-all duration-300 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className='mb-1 flex items-center space-x-2 text-xs text-emerald-300/90'>
                <div className='h-px flex-grow bg-gradient-to-r from-emerald-500/50 to-transparent'></div>
                <span>THÔNG TIN CÂY TRỒNG</span>
                <div className='h-px flex-grow bg-gradient-to-l from-emerald-500/50 to-transparent'></div>
              </div>

              <motion.div
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className='mt-2.5 rounded-lg border border-emerald-500/20 bg-emerald-950/30 p-3'
              >
                <div className='mb-1 text-xs text-emerald-400/70 uppercase'>Loại cây trồng</div>
                <div className='text-sm font-medium text-emerald-100'>{techniqueData?.crop}</div>
              </motion.div>

              <motion.div
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className='mt-3 rounded-lg border border-emerald-500/20 bg-emerald-950/30 p-3 transition-all duration-300 hover:border-emerald-500/40 hover:bg-emerald-900/30'
              >
                <div className='mb-1 text-xs text-emerald-400/70 uppercase'>MÔ TẢ</div>
                <p className='text-sm text-emerald-100 italic'>{techniqueData?.description}</p>
              </motion.div>
            </div>

            {/* Growing Duration section */}
            <div className='relative z-10'>
              <div
                className={`mb-3 flex items-center space-x-2 text-xs text-emerald-300/90 transition-all duration-300 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
              >
                <div className='h-px flex-grow bg-gradient-to-r from-emerald-500/50 to-transparent'></div>
                <span>THỜI GIAN CANH TÁC</span>
                <div className='h-px flex-grow bg-gradient-to-l from-emerald-500/50 to-transparent'></div>
              </div>

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className='flex items-center space-x-4'
              >
                <div className='relative flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-950/50'>
                  <Calendar className='h-7 w-7 text-emerald-400' />
                  {glowing && <div className='absolute inset-0 animate-pulse rounded-full bg-emerald-400/20'></div>}
                </div>
                <div>
                  <div className='mb-1.5 text-xs text-emerald-400/70 uppercase'>Thời gian canh tác</div>
                  <div className='bg-gradient-to-r from-emerald-300 to-emerald-100 bg-clip-text text-xl font-bold text-transparent'>
                    {techniqueData?.growingDuration}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Ideal Conditions section */}
            <div className='relative z-10'>
              <div
                className={`mb-2 flex items-center space-x-2 text-xs text-emerald-300/90 transition-all duration-300 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
              >
                <div className='h-px flex-grow bg-gradient-to-r from-emerald-500/50 to-transparent'></div>
                <span>ĐIỀU KIỆN TỐI ƯU</span>
                <div className='h-px flex-grow bg-gradient-to-l from-emerald-500/50 to-transparent'></div>
              </div>

              <div className='grid grid-cols-2 gap-3 pb-6'>
                {idealConditionsData.map((condition, index) => (
                  <motion.div
                    key={condition.id}
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCondition(index)}
                    className={cn(
                      'group relative cursor-pointer overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-950/30 p-3 transition-all duration-300 hover:border-emerald-400/40 hover:bg-emerald-900/30',
                      selectedCondition === index ? 'border-emerald-400/60 bg-emerald-900/50 shadow-lg shadow-emerald-500/15' : ''
                    )}
                  >
                    <div className='relative z-10 flex items-center space-x-3'>
                      <div className='rounded-full border border-emerald-500/30 bg-emerald-900/50 p-2'>{condition.icon}</div>
                      <div>
                        <div className='mb-1 text-[10px] text-emerald-400/70 uppercase'>{condition.label}</div>
                        <div className='text-sm text-emerald-100'>{condition.value}</div>
                      </div>
                    </div>
                    {selectedCondition === index && <div className='absolute -inset-1 animate-pulse rounded-full bg-emerald-400/5'></div>}
                    <div className='absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]'></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )
      case 'steps':
        return (
          <div className='relative z-10 w-full'>
            <div
              className={`mb-3 flex items-center justify-between text-xs text-emerald-300/90 transition-all duration-300 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className='flex items-center space-x-2'>
                <div className='h-px w-8 bg-gradient-to-r from-emerald-500/50 to-transparent'></div>
                <span>QUY TRÌNH THỰC HIỆN</span>
                <div className='h-px w-8 bg-gradient-to-l from-emerald-500/50 to-transparent'></div>
              </div>
              <div className='rounded border border-emerald-500/30 bg-emerald-950/50 px-2 py-1 text-[10px]'>{techniqueData?.steps.length} BƯỚC</div>
            </div>

            <Accordion type='single' collapsible className='w-full space-y-3 pb-6'>
              {techniqueData?.steps.map((step, index) => (
                <motion.div key={index} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
                  <AccordionItem
                    value={`step-${index}`}
                    className={`relative overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-950/30 transition-all duration-300 hover:bg-emerald-900/20 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                  >
                    <AccordionTrigger className='px-3 py-2 hover:no-underline'>
                      <div className='flex items-center space-x-3'>
                        <div className='flex h-7 w-7 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-900/50 text-xs font-bold text-emerald-300'>
                          {index + 1}
                        </div>
                        <div className='text-sm font-medium text-emerald-100'>{step.title}</div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className='border-t border-emerald-500/20 px-3 pt-2'>
                      <p className='mt-2 text-sm text-emerald-200'>{step.description}</p>

                      <div className='absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent transition-transform duration-1000'></div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        )
      case 'tips':
        return (
          <div className='w-full space-y-5'>
            {/* Tips section - Enhanced with animated hover effects */}
            <div className='relative z-10'>
              <div
                className={`mb-3 flex items-center space-x-2 text-xs text-emerald-300/90 transition-all duration-300 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
              >
                <div className='h-px flex-grow bg-gradient-to-r from-emerald-500/50 to-transparent'></div>
                <span>MẸO TỐI ƯU HÓA</span>
                <div className='h-px flex-grow bg-gradient-to-l from-emerald-500/50 to-transparent'></div>
              </div>

              <div className='space-y-3'>
                {techniqueData?.tips.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`group relative overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-950/30 p-3.5 transition-all duration-300 hover:border-emerald-400/40 hover:bg-emerald-900/30 hover:shadow-md hover:shadow-emerald-900/30 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                  >
                    <div className='relative z-10 flex items-start space-x-3'>
                      <div className='flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-900/50 text-xs font-medium text-emerald-300'>
                        {index + 1}
                      </div>
                      <div className='text-sm text-emerald-200 transition-colors duration-300 group-hover:text-emerald-100'>{tip}</div>
                    </div>
                    <div className='absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]'></div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Suitable Regions section - Enhanced with interactive styling */}
            <div className='relative z-10'>
              <div
                className={`mb-3 flex items-center space-x-2 text-xs text-emerald-300/90 transition-all duration-300 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
              >
                <div className='h-px flex-grow bg-gradient-to-r from-emerald-500/50 to-transparent'></div>
                <span>KHU VỰC PHÙ HỢP</span>
                <div className='h-px flex-grow bg-gradient-to-l from-emerald-500/50 to-transparent'></div>
              </div>

              <div className='flex flex-wrap gap-2.5'>
                {techniqueData?.suitableRegions.map((region, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.05 * index }}
                    whileHover={{ scale: 1.05 }}
                    className={`group relative overflow-hidden rounded-full border border-emerald-500/20 bg-emerald-950/30 py-2 pr-4 pl-2.5 transition-all duration-300 hover:border-emerald-400/40 hover:bg-emerald-900/30 hover:shadow-md hover:shadow-emerald-900/30 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                  >
                    <div className='relative z-10 flex items-center space-x-1.5'>
                      <div className='flex h-5 w-5 items-center justify-center rounded-full bg-emerald-900/70 transition-colors duration-300 group-hover:bg-emerald-800/70'>
                        <MapPin className='h-3.5 w-3.5 text-emerald-400' />
                      </div>
                      <span className='text-sm text-emerald-100'>{region}</span>
                    </div>
                    <div className='absolute bottom-0 left-0 h-[1.5px] w-0 bg-emerald-400/40 transition-all duration-500 group-hover:w-full'></div>
                  </motion.div>
                ))}
              </div>

              {/* Visual decoration */}
              <div className='mt-6 border-t border-dashed border-emerald-500/20 pt-3'>
                <div className='flex items-center justify-center space-x-2 opacity-70'>
                  <div className='h-px w-12 bg-gradient-to-r from-transparent to-emerald-500/40'></div>
                  <Sprout className='h-4 w-4 text-emerald-400/40' />
                  <div className='h-px w-12 bg-gradient-to-l from-transparent to-emerald-500/40'></div>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
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
          className={`relative overflow-hidden rounded-xl border border-emerald-500/30 backdrop-blur-sm transition-all duration-500 sm:rounded-2xl ${loaded ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className='absolute inset-0 z-0 bg-gradient-to-b from-emerald-950/80 via-slate-900/90 to-emerald-950/80'></div>
          <div ref={particlesRef} className='pointer-events-none absolute inset-0 overflow-hidden bg-emerald-400/5'></div>

          <div className='flex w-full flex-col md:grid md:grid-cols-3'>
            {/* Header section - Always visible, enhanced with larger logo and better spacing */}
            <div className='relative z-10 w-full border-b border-emerald-500/30 p-4 md:col-span-3 md:p-5'>
              <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4'>
                <div className='flex items-center space-x-3 sm:space-x-4'>
                  <div
                    className={`relative flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/50 bg-emerald-950 transition-all duration-300 sm:h-12 sm:w-12 ${
                      glowing ? 'shadow-lg shadow-emerald-400/30' : ''
                    }`}
                  >
                    <Sprout className={`h-5 w-5 text-emerald-400 sm:h-6 sm:w-6 ${glowing ? 'animate-pulse' : ''}`} />
                    {glowing && (
                      <>
                        <div className='absolute inset-0 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-emerald-400/40'></div>
                        <div className='absolute -inset-1 animate-[ping_4s_ease-in-out_infinite] rounded-full border border-emerald-400/30'></div>
                      </>
                    )}
                  </div>
                  <div>
                    <h3 className='max-w-[200px] truncate bg-gradient-to-r from-emerald-300 to-emerald-100 bg-clip-text text-xl font-bold text-transparent sm:max-w-none sm:text-2xl'>
                      {techniqueData?.title}
                    </h3>
                    <div className='mt-1 flex flex-wrap items-center gap-x-2 text-xs text-emerald-400/70'>
                      <div className='flex items-center'>
                        <div className='mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400'></div>
                        <span>Đom Đóm AI</span>
                      </div>
                      {techniqueData?.crop && (
                        <>
                          <span className='xs:inline hidden text-emerald-500/50'>|</span>
                          <span className='text-emerald-300/80'>{techniqueData.crop}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className='flex items-center self-start sm:self-center'>
                  <FarmingStat icon={<Calendar className='h-4 w-4 text-emerald-400/70' />} label='Thời gian' value={techniqueData?.growingDuration || 'N/A'} />
                </div>
              </div>
            </div>

            {/* Navigation tabs - sidebar style, hidden on mobile */}
            <div className='relative z-10 hidden w-full border-r border-emerald-500/30 bg-emerald-950/90 md:col-span-1 md:block'>
              <div className='flex flex-col gap-5 p-6'>
                {[
                  { id: 'overview', icon: <Trees className='size-4 text-emerald-400' />, label: 'Tổng quan' },
                  { id: 'steps', icon: <ListChecks className='size-4 text-emerald-400' />, label: 'Quy trình' },
                  { id: 'tips', icon: <DropletIcon className='size-4 text-emerald-400' />, label: 'Mẹo & Khu vực' }
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

              {/* Mobile overview visualization - Only shown on overview tab for desktop */}
              {activeTab === 'overview' && (
                <div className={`mt-4 px-6 pb-6 transition-all duration-300 ${showDetails ? 'opacity-100' : 'opacity-0'}`}>
                  <div className='flex flex-col items-center justify-center'>
                    <div className='relative mb-4'>
                      <div
                        className={`flex h-24 w-24 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-900/50 ${
                          glowing ? 'shadow-lg shadow-emerald-400/30' : ''
                        }`}
                      >
                        <TechniqueIcon icon={<Sprout className='h-14 w-14 text-emerald-400' />} size='large' />
                        {glowing && (
                          <>
                            <div className='absolute inset-0 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-emerald-400/20'></div>
                            <div className='absolute -inset-1 animate-[ping_4s_ease-in-out_infinite] rounded-full border border-emerald-400/30'></div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className='text-center'>
                      <div className='text-2xl font-bold text-emerald-100'>{techniqueData?.crop}</div>
                      <div className='mt-2 text-lg text-emerald-300/90'>{techniqueData?.title}</div>
                      <div className='mt-1 text-sm text-emerald-400/80'>{techniqueData?.growingDuration}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile current technique visualization - Only shown on mobile */}
            <div className='relative z-10 w-full md:hidden'>
              {activeTab === 'overview' && (
                <div className={`p-5 transition-all duration-300 ${showDetails ? 'opacity-100' : 'opacity-0'}`}>
                  <div className='flex flex-col items-center justify-center'>
                    <div className='relative mb-4'>
                      <div
                        className={`flex h-24 w-24 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-900/50 ${
                          glowing ? 'shadow-lg shadow-emerald-400/30' : ''
                        }`}
                      >
                        <TechniqueIcon icon={<Sprout className='h-14 w-14 text-emerald-400' />} size='large' />
                        {glowing && (
                          <>
                            <div className='absolute inset-0 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-emerald-400/20'></div>
                            <div className='absolute -inset-1 animate-[ping_4s_ease-in-out_infinite] rounded-full border border-emerald-400/30'></div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className='text-center'>
                      <div className='text-2xl font-bold text-emerald-100'>{techniqueData?.crop}</div>
                      <div className='mt-2 text-lg text-emerald-300/90'>{techniqueData?.title}</div>
                      <div className='mt-1 text-sm text-emerald-400/80'>{techniqueData?.growingDuration}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Main content area - Takes most of the space */}
            <div className='scrollbar-thin scrollbar-track-emerald-950 scrollbar-thumb-emerald-700/50 min-h-[400px] w-full flex-grow overflow-y-auto p-4 pb-4 pb-20 md:col-span-2 md:p-5'>
              <div ref={contentRef} className='w-full transition-all duration-500'>
                {renderTabContent()}
              </div>
            </div>
          </div>

          {/* Bottom mobile navigation - New component */}
          <div className='fixed bottom-0 left-0 z-50 w-full border-t border-emerald-500/30 bg-emerald-950/95 backdrop-blur-md md:hidden'>
            <div className='mx-auto flex max-w-md items-center justify-around px-6 py-4'>
              {[
                { id: 'overview', icon: <Trees className='size-6 text-emerald-400' />, label: 'Tổng quan' },
                { id: 'steps', icon: <ListChecks className='size-6 text-emerald-400' />, label: 'Quy trình' },
                { id: 'tips', icon: <DropletIcon className='size-6 text-emerald-400' />, label: 'Mẹo & Khu vực' }
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
                </button>
              ))}
            </div>

            {/* Visual hint for interactivity */}
            <div className='absolute -top-1.5 left-1/2 -translate-x-1/2 rounded-full border border-emerald-500/20 bg-emerald-950 px-2 text-[10px] text-emerald-400/80'>
              chọn chế độ
            </div>
          </div>

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

          {/* Additional ambient effects */}
          <div className='pointer-events-none absolute inset-0 z-5 opacity-30'>
            <div className='absolute h-full w-full bg-[radial-gradient(circle,rgba(52,211,153,0.1)_0%,transparent_70%)]'></div>
          </div>

          {/* Corner accents */}
          <div className='pointer-events-none absolute top-0 right-0 h-10 w-10 rounded-tr-xl border-t-2 border-r-2 border-emerald-400/20'></div>
          <div className='pointer-events-none absolute bottom-0 left-0 h-10 w-10 rounded-bl-xl border-b-2 border-l-2 border-emerald-400/20'></div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(FarmingTechniqueTemplate)
