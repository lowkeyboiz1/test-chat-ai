'use client'

import type React from 'react'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { IFarmingTechniqueData } from '@/types/farmingTechnique'
import { Calendar, DropletIcon, MapPin, ShowerHead, Sprout, SunIcon, ThermometerIcon } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface FarmingTechniqueTemplateProps {
  techniqueData?: IFarmingTechniqueData
  isLoading?: boolean
}

const FarmingTechniqueTemplate: React.FC<FarmingTechniqueTemplateProps> = ({ techniqueData, isLoading = false }) => {
  const [loaded, setLoaded] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [glowing, setGlowing] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const particlesRef = useRef<HTMLDivElement>(null)

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
    particle.className = 'absolute rounded-full bg-emerald-400/40 pointer-events-none'

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

  return (
    <div className='flex min-h-[500px] w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-emerald-950 to-slate-950 p-4 sm:rounded-3xl sm:p-6'>
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
        @keyframes glitch {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 100%;
          }
        }
      `}</style>

      <div className='relative w-full max-w-lg'>
        {/* Ambient background effects */}
        <div className='absolute top-0 right-0 -z-10 h-32 w-32 rounded-full bg-emerald-400/10 blur-3xl sm:h-40 sm:w-40'></div>
        <div className='absolute bottom-0 left-0 -z-10 h-32 w-32 rounded-full bg-emerald-400/10 blur-3xl sm:h-40 sm:w-40'></div>

        {/* Main container */}
        <div
          className={`relative overflow-hidden rounded-xl border border-emerald-500/30 transition-all duration-300 sm:rounded-2xl ${loaded ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className='absolute inset-0 z-0 bg-gradient-to-b from-emerald-950/80 via-slate-900/90 to-emerald-950/80'></div>
          <div ref={particlesRef} className='pointer-events-none absolute inset-0 overflow-hidden bg-emerald-400/5'></div>

          {/* Header section */}
          <div className='relative z-10 border-b border-emerald-500/30 p-4 sm:p-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3 sm:space-x-3'>
                <div
                  className={`relative flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/50 bg-emerald-950 transition-all duration-300 sm:h-10 sm:w-10 ${
                    glowing ? 'shadow-lg shadow-emerald-400/30' : ''
                  }`}
                >
                  <Sprout className={`h-5 w-5 text-emerald-400 sm:h-5 sm:w-5 ${glowing ? 'animate-pulse' : ''}`} />
                  {glowing && <div className='absolute inset-0 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-emerald-400/40 blur-md'></div>}
                </div>
                <div>
                  <h3 className='bg-gradient-to-r from-emerald-300 to-emerald-100 bg-clip-text text-xl font-bold text-transparent sm:text-xl'>
                    {techniqueData?.title}
                  </h3>
                  <div className='mt-1 flex items-center text-xs text-emerald-400/70'>
                    <div className='mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400'></div>
                    <span>Đom Đóm AI</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Crop info with futuristic style */}
            <div className={`mt-4 transition-all duration-300 sm:mt-5 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className='mb-1 flex items-center space-x-2 text-xs text-emerald-300/90'>
                <div className='h-px flex-grow bg-gradient-to-r from-emerald-500/50 to-transparent'></div>
                <span>THÔNG TIN CÂY TRỒNG</span>
                <div className='h-px flex-grow bg-gradient-to-l from-emerald-500/50 to-transparent'></div>
              </div>

              <div className='mt-2.5 rounded-lg border border-emerald-500/20 bg-emerald-950/30 p-3 backdrop-blur-sm sm:p-2.5'>
                <div className='mb-1 text-xs text-emerald-400/70 uppercase'>Loại cây trồng</div>
                <div className='text-sm font-medium text-emerald-100'>{techniqueData?.crop}</div>
              </div>

              <div className='mt-3 rounded-lg border border-emerald-500/20 bg-emerald-950/30 p-3 backdrop-blur-sm sm:p-3'>
                <div className='mb-1 text-xs text-emerald-400/70 uppercase'>MÔ TẢ</div>
                <p className='text-sm text-emerald-100 italic sm:text-sm'>{techniqueData?.description}</p>
              </div>
            </div>
          </div>

          {/* Growing Duration section */}
          <div className='relative z-10 border-b border-emerald-500/30 p-4 sm:p-4'>
            <div
              className={`mb-3 flex items-center space-x-2 text-xs text-emerald-300/90 transition-all duration-300 sm:mb-3 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className='h-px flex-grow bg-gradient-to-r from-emerald-500/50 to-transparent'></div>
              <span>THỜI GIAN CANH TÁC</span>
              <div className='h-px flex-grow bg-gradient-to-l from-emerald-500/50 to-transparent'></div>
            </div>

            <div
              className={`flex items-center space-x-4 transition-all duration-300 sm:space-x-4 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            >
              <div className='relative flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-950/50 sm:h-14 sm:w-14'>
                <Calendar className='h-7 w-7 text-emerald-400 sm:h-7 sm:w-7' />
              </div>
              <div>
                <div className='mb-1.5 text-xs text-emerald-400/70 uppercase'>Thời gian canh tác</div>
                <div className='bg-gradient-to-r from-emerald-300 to-emerald-100 bg-clip-text text-xl font-bold text-transparent sm:text-xl'>
                  {techniqueData?.growingDuration}
                </div>
              </div>
            </div>
          </div>

          {/* Ideal Conditions section */}
          <div className='relative z-10 border-b border-emerald-500/30 p-3 sm:p-4'>
            <div
              className={`mb-2 flex items-center space-x-2 text-xs text-emerald-300/90 transition-all duration-300 sm:mb-3 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className='h-px flex-grow bg-gradient-to-r from-emerald-500/50 to-transparent'></div>
              <span>ĐIỀU KIỆN TỐI ƯU</span>
              <div className='h-px flex-grow bg-gradient-to-l from-emerald-500/50 to-transparent'></div>
            </div>

            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3'>
              {idealConditionsData.map((condition) => (
                <div
                  key={condition.id}
                  className={`group relative overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-950/30 p-3 backdrop-blur-sm transition-all duration-300 hover:border-emerald-400/40 hover:bg-emerald-900/30 sm:p-3 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                >
                  <div className='relative z-10 flex items-center space-x-3'>
                    <div className='rounded-full border border-emerald-500/30 bg-emerald-900/50 p-2'>{condition.icon}</div>
                    <div>
                      <div className='mb-1 text-[10px] text-emerald-400/70 uppercase'>{condition.label}</div>
                      <div className='text-sm text-emerald-100'>{condition.value}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Implementation Steps section */}
          <div className='relative z-10 border-b border-emerald-500/30 p-4 sm:p-4'>
            <div
              className={`mb-3 flex items-center justify-between text-xs text-emerald-300/90 transition-all duration-300 sm:mb-3 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className='flex items-center space-x-2'>
                <div className='h-px w-8 bg-gradient-to-r from-emerald-500/50 to-transparent sm:w-12'></div>
                <span>QUY TRÌNH THỰC HIỆN</span>
                <div className='h-px w-8 bg-gradient-to-l from-emerald-500/50 to-transparent sm:w-12'></div>
              </div>
              <div className='rounded border border-emerald-500/30 bg-emerald-950/50 px-2 py-1 text-[10px] backdrop-blur-sm sm:px-2 sm:text-[10px]'>
                {techniqueData?.steps.length} BƯỚC
              </div>
            </div>

            <Accordion type='single' collapsible className='w-full space-y-3'>
              {techniqueData?.steps.map((step, index) => (
                <AccordionItem
                  key={index}
                  value={`step-${index}`}
                  className={`relative overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-950/30 backdrop-blur-sm transition-all duration-300 hover:bg-emerald-900/20 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                >
                  <AccordionTrigger className='px-3 py-2 hover:no-underline'>
                    <div className='flex items-center space-x-3'>
                      <div className='flex h-7 w-7 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-900/50 text-xs font-bold text-emerald-300 sm:h-7 sm:w-7'>
                        {index + 1}
                      </div>
                      <div className='text-sm font-medium text-emerald-100'>{step.title}</div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='border-t border-emerald-500/20 px-3 pt-2'>
                    <p className='mt-2 text-sm text-emerald-200 sm:text-sm'>{step.description}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Tips section */}
          <div className='relative z-10 border-b border-emerald-500/30 p-4 sm:p-4'>
            <div
              className={`mb-3 flex items-center space-x-2 text-xs text-emerald-300/90 transition-all duration-300 sm:mb-3 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className='h-px flex-grow bg-gradient-to-r from-emerald-500/50 to-transparent'></div>
              <span>MẸO TỐI ƯU HÓA</span>
              <div className='h-px flex-grow bg-gradient-to-l from-emerald-500/50 to-transparent'></div>
            </div>

            <div className='space-y-3'>
              {techniqueData?.tips.map((tip, index) => (
                <div
                  key={index}
                  className={`group relative overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-950/30 p-3 backdrop-blur-sm transition-all duration-300 hover:bg-emerald-900/20 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                >
                  <div className='relative z-10 flex items-start space-x-3'>
                    <div className='flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-900/50 text-xs text-emerald-300'>
                      {index + 1}
                    </div>
                    <div className='text-sm text-emerald-200'>{tip}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suitable Regions section */}
          <div className='relative z-10 p-4'>
            <div
              className={`mb-3 flex items-center space-x-2 text-xs text-emerald-300/90 transition-all duration-300 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className='h-px flex-grow bg-gradient-to-r from-emerald-500/50 to-transparent'></div>
              <span>KHU VỰC PHÙ HỢP</span>
              <div className='h-px flex-grow bg-gradient-to-l from-emerald-500/50 to-transparent'></div>
            </div>

            <div className='flex flex-wrap gap-2.5'>
              {techniqueData?.suitableRegions.map((region, index) => (
                <div
                  key={index}
                  className={`group relative overflow-hidden rounded-full border border-emerald-500/20 bg-emerald-950/30 px-3.5 py-2 backdrop-blur-sm transition-all duration-300 hover:border-emerald-400/40 hover:bg-emerald-900/20 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                >
                  <div className='relative z-10 flex items-center space-x-1.5'>
                    <MapPin className='h-4 w-4 text-emerald-400' />
                    <span className='text-sm text-emerald-100'>{region}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual effects overlays */}
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
        </div>
      </div>
    </div>
  )
}

export default FarmingTechniqueTemplate
