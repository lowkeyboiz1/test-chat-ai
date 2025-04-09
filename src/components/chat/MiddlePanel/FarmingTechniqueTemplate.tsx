'use client'

import type React from 'react'

import { useState, useEffect, useMemo } from 'react'
import { Calendar, DropletIcon, ShowerHead, SunIcon, ThermometerIcon, MapPin, Sprout } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

interface Step {
  title: string
  description: string
}

interface FarmingTechniqueData {
  title: string
  crop: string
  imageUrl?: string
  description: string
  suitableRegions: string[]
  growingDuration: string
  idealConditions: {
    soil: string
    temperature: string
    water: string
    sunlight: string
  }
  steps: Step[]
  tips: string[]
}

interface FarmingTechniqueTemplateProps {
  techniqueData?: FarmingTechniqueData
  isLoading?: boolean
}

const FarmingTechniqueTemplate: React.FC<FarmingTechniqueTemplateProps> = ({ techniqueData, isLoading = false }) => {
  const [loaded, setLoaded] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  // Ideal conditions data for mapping - memoized to prevent recreating on each render
  const idealConditionsData = useMemo(
    () => [
      {
        id: 'temperature',
        icon: <ThermometerIcon className='h-4 w-4 text-cyan-400 sm:h-5 sm:w-5' />,
        label: 'Nhiệt độ',
        value: techniqueData?.idealConditions.temperature
      },
      {
        id: 'water',
        icon: <DropletIcon className='h-4 w-4 text-cyan-400 sm:h-5 sm:w-5' />,
        label: 'Nước',
        value: techniqueData?.idealConditions.water
      },
      {
        id: 'soil',
        icon: <ShowerHead className='h-4 w-4 text-cyan-400 sm:h-5 sm:w-5' />,
        label: 'Đất',
        value: techniqueData?.idealConditions.soil
      },
      {
        id: 'sunlight',
        icon: <SunIcon className='h-4 w-4 text-cyan-400 sm:h-5 sm:w-5' />,
        label: 'Ánh sáng',
        value: techniqueData?.idealConditions.sunlight
      }
    ],
    [techniqueData?.idealConditions]
  )

  // Simplified loading sequence
  useEffect(() => {
    if (isLoading || !techniqueData) return

    setLoaded(true)
    const timer = setTimeout(() => setShowDetails(true), 300)

    return () => {
      clearTimeout(timer)
    }
  }, [isLoading, techniqueData])

  return (
    <div className='flex min-h-[500px] w-full items-center justify-center rounded-xl bg-gradient-to-b from-cyan-950 to-slate-950 p-4 sm:rounded-3xl sm:p-6'>
      <div className='relative w-full max-w-lg'>
        {/* Main container */}
        <div
          className={`relative overflow-hidden rounded-xl border border-cyan-500/30 transition-opacity duration-300 sm:rounded-2xl ${loaded ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className='absolute inset-0 z-0 bg-gradient-to-b from-cyan-950/80 via-slate-900/90 to-purple-950/80'></div>

          {/* Header section */}
          <div className='relative z-10 border-b border-cyan-500/30 p-4 sm:p-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3 sm:space-x-3'>
                <div className='relative flex h-10 w-10 items-center justify-center rounded-full border border-cyan-500/50 bg-cyan-950 sm:h-10 sm:w-10'>
                  <Sprout className='h-5 w-5 text-cyan-400 sm:h-5 sm:w-5' />
                </div>
                <div>
                  <h3 className='bg-gradient-to-r from-cyan-300 to-cyan-100 bg-clip-text text-xl font-bold text-transparent sm:text-xl'>
                    {techniqueData?.title}
                  </h3>
                  <div className='mt-1 flex items-center text-xs text-cyan-400/70'>
                    <div className='mr-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400'></div>
                    <span>Đom Đóm AI</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Crop info with futuristic style */}
            <div className={`mt-4 transition-all duration-300 sm:mt-5 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className='mb-1 flex items-center space-x-2 text-xs text-cyan-300/90'>
                <div className='h-px flex-grow bg-gradient-to-r from-cyan-500/50 to-transparent'></div>
                <span>THÔNG TIN CÂY TRỒNG</span>
                <div className='h-px flex-grow bg-gradient-to-l from-cyan-500/50 to-transparent'></div>
              </div>

              <div className='mt-2.5 rounded-lg border border-cyan-500/20 bg-cyan-950/30 p-3 sm:p-2.5'>
                <div className='mb-1 text-xs text-cyan-400/70 uppercase'>Loại cây trồng</div>
                <div className='text-sm font-medium text-cyan-100'>{techniqueData?.crop}</div>
              </div>

              <div className='mt-3 rounded-lg border border-cyan-500/20 bg-cyan-950/30 p-3 sm:p-3'>
                <div className='mb-1 text-xs text-cyan-400/70 uppercase'>MÔ TẢ</div>
                <p className='text-sm text-cyan-100 italic sm:text-sm'>{techniqueData?.description}</p>
              </div>
            </div>
          </div>

          {/* Growing Duration section */}
          <div className='relative z-10 border-b border-cyan-500/30 p-4 sm:p-4'>
            <div
              className={`mb-3 flex items-center space-x-2 text-xs text-cyan-300/90 transition-all duration-300 sm:mb-3 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className='h-px flex-grow bg-gradient-to-r from-cyan-500/50 to-transparent'></div>
              <span>THỜI GIAN CANH TÁC</span>
              <div className='h-px flex-grow bg-gradient-to-l from-cyan-500/50 to-transparent'></div>
            </div>

            <div
              className={`flex items-center space-x-4 transition-all duration-300 sm:space-x-4 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            >
              <div className='relative flex h-14 w-14 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-950/50 sm:h-14 sm:w-14'>
                <Calendar className='h-7 w-7 text-cyan-400 sm:h-7 sm:w-7' />
              </div>
              <div>
                <div className='mb-1.5 text-xs text-cyan-400/70 uppercase'>Thời gian canh tác</div>
                <div className='bg-gradient-to-r from-cyan-300 to-cyan-100 bg-clip-text text-xl font-bold text-transparent sm:text-xl'>
                  {techniqueData?.growingDuration}
                </div>
              </div>
            </div>
          </div>

          {/* Ideal Conditions section */}
          <div className='relative z-10 border-b border-cyan-500/30 p-3 sm:p-4'>
            <div
              className={`mb-2 flex items-center space-x-2 text-xs text-cyan-300/90 transition-all duration-300 sm:mb-3 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className='h-px flex-grow bg-gradient-to-r from-cyan-500/50 to-transparent'></div>
              <span>ĐIỀU KIỆN TỐI ƯU</span>
              <div className='h-px flex-grow bg-gradient-to-l from-cyan-500/50 to-transparent'></div>
            </div>

            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3'>
              {idealConditionsData.map((condition) => (
                <div
                  key={condition.id}
                  className={`group relative overflow-hidden rounded-xl border border-cyan-500/20 bg-cyan-950/30 p-3 transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-900/30 sm:p-3 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                >
                  <div className='relative z-10 flex items-center space-x-3'>
                    <div className='rounded-full border border-cyan-500/30 bg-cyan-900/50 p-2'>{condition.icon}</div>
                    <div>
                      <div className='mb-1 text-[10px] text-cyan-400/70 uppercase'>{condition.label}</div>
                      <div className='text-sm text-cyan-100'>{condition.value}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Implementation Steps section */}
          <div className='relative z-10 border-b border-cyan-500/30 p-4 sm:p-4'>
            <div
              className={`mb-3 flex items-center justify-between text-xs text-cyan-300/90 transition-all duration-300 sm:mb-3 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className='flex items-center space-x-2'>
                <div className='h-px w-8 bg-gradient-to-r from-cyan-500/50 to-transparent sm:w-12'></div>
                <span>QUY TRÌNH THỰC HIỆN</span>
                <div className='h-px w-8 bg-gradient-to-l from-cyan-500/50 to-transparent sm:w-12'></div>
              </div>
              <div className='rounded border border-cyan-500/30 bg-cyan-950/50 px-2 py-1 text-[10px] sm:px-2 sm:text-[10px]'>
                {techniqueData?.steps.length} BƯỚC
              </div>
            </div>

            <Accordion type='single' collapsible className='w-full space-y-3'>
              {techniqueData?.steps.map((step, index) => (
                <AccordionItem
                  key={index}
                  value={`step-${index}`}
                  className={`relative overflow-hidden rounded-xl border border-cyan-500/20 bg-cyan-950/30 transition-all duration-300 hover:bg-cyan-900/20 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                >
                  <AccordionTrigger className='px-3 py-2 hover:no-underline'>
                    <div className='flex items-center space-x-3'>
                      <div className='flex h-7 w-7 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-900/50 text-xs font-bold text-cyan-300 sm:h-7 sm:w-7'>
                        {index + 1}
                      </div>
                      <div className='text-sm font-medium text-cyan-100'>{step.title}</div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='border-t border-cyan-500/20 px-3 pt-2'>
                    <p className='mt-2 text-sm text-cyan-200 sm:text-sm'>{step.description}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Tips section */}
          <div className='relative z-10 border-b border-cyan-500/30 p-4 sm:p-4'>
            <div
              className={`mb-3 flex items-center space-x-2 text-xs text-cyan-300/90 transition-all duration-300 sm:mb-3 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className='h-px flex-grow bg-gradient-to-r from-cyan-500/50 to-transparent'></div>
              <span>MẸO TỐI ƯU HÓA</span>
              <div className='h-px flex-grow bg-gradient-to-l from-cyan-500/50 to-transparent'></div>
            </div>

            <div className='space-y-3'>
              {techniqueData?.tips.map((tip, index) => (
                <div
                  key={index}
                  className={`group relative overflow-hidden rounded-xl border border-cyan-500/20 bg-cyan-950/30 p-3 transition-all duration-300 hover:bg-cyan-900/20 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                >
                  <div className='relative z-10 flex items-start space-x-3'>
                    <div className='flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-900/50 text-xs text-cyan-300'>
                      {index + 1}
                    </div>
                    <div className='text-sm text-cyan-200'>{tip}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suitable Regions section */}
          <div className='relative z-10 p-4'>
            <div
              className={`mb-3 flex items-center space-x-2 text-xs text-cyan-300/90 transition-all duration-300 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className='h-px flex-grow bg-gradient-to-r from-cyan-500/50 to-transparent'></div>
              <span>KHU VỰC PHÙ HỢP</span>
              <div className='h-px flex-grow bg-gradient-to-l from-cyan-500/50 to-transparent'></div>
            </div>

            <div className='flex flex-wrap gap-2.5'>
              {techniqueData?.suitableRegions.map((region, index) => (
                <div
                  key={index}
                  className={`group relative overflow-hidden rounded-full border border-cyan-500/20 bg-cyan-950/30 px-3.5 py-2 transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-900/20 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                >
                  <div className='relative z-10 flex items-center space-x-1.5'>
                    <MapPin className='h-4 w-4 text-cyan-400' />
                    <span className='text-sm text-cyan-100'>{region}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FarmingTechniqueTemplate
