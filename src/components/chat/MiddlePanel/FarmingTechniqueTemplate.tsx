'use client'

import type React from 'react'

import { useState, useEffect, useRef } from 'react'
import { Calendar, DropletIcon, ShowerHead, SunIcon, ThermometerIcon, MapPin, Sprout, RefreshCw, Maximize2, ChevronDown, ChevronUp } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

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
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [rotateY, setRotateY] = useState(0)
  const [rotateX, setRotateX] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

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

  if (isLoading || !techniqueData) {
    return (
      <div className='w-full max-w-lg overflow-hidden'>
        <div className='rounded-xl bg-gradient-to-br from-cyan-950 to-slate-900 p-6 text-white shadow-lg'>
          {/* Header Skeleton */}
          <div className='mb-5 flex items-start justify-between'>
            <div className='flex-1'>
              <Skeleton className='h-8 w-3/4 bg-cyan-500/20' />
              <Skeleton className='mt-2 h-6 w-1/2 bg-cyan-500/20' />
            </div>
            <Skeleton className='h-16 w-16 rounded-full bg-cyan-500/20' />
          </div>

          {/* Description Skeleton */}
          <div className='mb-5 rounded-lg border-l-4 border-cyan-400/30 bg-gradient-to-r from-cyan-500/15 to-cyan-500/5 px-4 py-3'>
            <Skeleton className='h-4 w-full bg-cyan-500/20' />
            <Skeleton className='mt-2 h-4 w-3/4 bg-cyan-500/20' />
          </div>

          {/* Growing Duration Skeleton */}
          <div className='mb-5 flex items-center space-x-3 rounded-lg border-l-4 border-cyan-400/30 bg-gradient-to-r from-cyan-500/20 to-transparent p-3'>
            <Skeleton className='h-10 w-10 rounded-full bg-cyan-500/20' />
            <div className='flex-1'>
              <Skeleton className='h-4 w-1/3 bg-cyan-500/20' />
              <Skeleton className='mt-1 h-4 w-1/2 bg-cyan-500/20' />
            </div>
          </div>

          {/* Ideal Conditions Skeleton */}
          <div className='mb-6'>
            <Skeleton className='mb-3 h-6 w-1/3 bg-cyan-500/20' />
            <div className='grid grid-cols-2 gap-3'>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className='flex items-center space-x-2 rounded-lg bg-gradient-to-br from-cyan-500/15 to-cyan-500/5 p-3'>
                  <Skeleton className='h-9 w-9 rounded-full bg-cyan-500/20' />
                  <div className='flex-1'>
                    <Skeleton className='h-3 w-1/2 bg-cyan-500/20' />
                    <Skeleton className='mt-1 h-3 w-3/4 bg-cyan-500/20' />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Implementation Steps Skeleton */}
          <div className='mb-6 rounded-lg bg-gradient-to-br from-cyan-500/15 to-cyan-500/5 p-4'>
            <Skeleton className='mb-3 h-6 w-1/3 bg-cyan-500/20' />
            <div className='space-y-3'>
              {[1, 2, 3].map((i) => (
                <div key={i} className='rounded-lg border-l-3 border-cyan-400/30 bg-cyan-500/10 p-3'>
                  <div className='mb-1 flex items-center'>
                    <Skeleton className='mr-2 h-6 w-6 rounded-full bg-cyan-500/20' />
                    <Skeleton className='h-4 w-1/3 bg-cyan-500/20' />
                  </div>
                  <Skeleton className='mt-2 ml-8 h-4 w-3/4 bg-cyan-500/20' />
                </div>
              ))}
            </div>
          </div>

          {/* Tips Skeleton */}
          <div className='mb-6 rounded-lg bg-gradient-to-br from-cyan-500/15 to-cyan-500/5 p-4'>
            <Skeleton className='mb-3 h-6 w-1/3 bg-cyan-500/20' />
            <div className='space-y-2.5'>
              {[1, 2, 3].map((i) => (
                <div key={i} className='flex items-start'>
                  <Skeleton className='mr-3 h-5 w-5 rounded-full bg-cyan-500/20' />
                  <Skeleton className='h-4 w-3/4 bg-cyan-500/20' />
                </div>
              ))}
            </div>
          </div>

          {/* Suitable Regions Skeleton */}
          <div className='rounded-lg bg-gradient-to-br from-cyan-500/15 to-cyan-500/5 p-4'>
            <Skeleton className='mb-3 h-5 w-1/3 bg-cyan-500/20' />
            <div className='flex flex-wrap gap-2'>
              {[1, 2].map((i) => (
                <Skeleton key={i} className='h-8 w-32 rounded-full bg-cyan-500/20' />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='perspective-1000 flex min-h-[500px] w-full items-center justify-center rounded-3xl bg-gradient-to-b from-cyan-950 to-slate-950 p-6'>
      <div
        ref={containerRef}
        className='preserve-3d relative w-full max-w-lg transform-gpu transition-all duration-300'
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
                    <Sprout className='h-5 w-5 text-cyan-400' />
                  </div>
                </div>
                <div>
                  <h3 className='bg-gradient-to-r from-cyan-300 to-cyan-100 bg-clip-text text-xl font-bold text-transparent'>{techniqueData.title}</h3>
                  <div className='mt-1 flex items-center text-xs text-cyan-400/70'>
                    <div className='mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400'></div>
                    <span>Đom Đóm AI</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Crop info with futuristic style */}
            <div className={`mt-5 transition-all delay-500 duration-1000 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className='mb-1 flex items-center space-x-2 text-xs text-cyan-300/90'>
                <div className='h-px flex-grow bg-gradient-to-r from-cyan-500/50 to-transparent'></div>
                <span>THÔNG TIN CÂY TRỒNG</span>
                <div className='h-px flex-grow bg-gradient-to-l from-cyan-500/50 to-transparent'></div>
              </div>

              <div className='mt-2 rounded-lg border border-cyan-500/20 bg-cyan-950/30 p-2.5'>
                <div className='mb-1 text-[10px] text-cyan-400/70 uppercase'>Loại cây trồng</div>
                <div className='text-sm font-medium text-cyan-100'>{techniqueData.crop}</div>
              </div>

              <div className='mt-3 rounded-lg border border-cyan-500/20 bg-cyan-950/30 p-3'>
                <div className='mb-1 text-[10px] text-cyan-400/70 uppercase'>MÔ TẢ</div>
                <p className='text-sm text-cyan-100 italic'>{techniqueData.description}</p>
              </div>
            </div>
          </div>

          {/* Growing Duration section */}
          <div className='relative z-10 border-b border-cyan-500/30 p-4'>
            <div
              className={`mb-3 flex items-center space-x-2 text-xs text-cyan-300/90 transition-all delay-700 duration-1000 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className='h-px flex-grow bg-gradient-to-r from-cyan-500/50 to-transparent'></div>
              <span>THỜI GIAN CANH TÁC</span>
              <div className='h-px flex-grow bg-gradient-to-l from-cyan-500/50 to-transparent'></div>
            </div>

            <div
              className={`flex items-center space-x-4 transition-all duration-500 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
              style={{ transitionDelay: '800ms' }}
            >
              <div className='relative'>
                <div className='absolute inset-0 rounded-full bg-cyan-500/20 blur-md'></div>
                <div className='relative flex h-14 w-14 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-950/50'>
                  <Calendar className='h-7 w-7 text-cyan-400' />
                </div>
              </div>
              <div>
                <div className='mb-1 text-[10px] text-cyan-400/70 uppercase'>Thời gian canh tác</div>
                <div className='bg-gradient-to-r from-cyan-300 to-cyan-100 bg-clip-text text-lg font-bold text-transparent'>
                  {techniqueData.growingDuration}
                </div>
              </div>
            </div>
          </div>

          {/* Ideal Conditions section */}
          <div className='relative z-10 border-b border-cyan-500/30 p-4'>
            <div
              className={`mb-3 flex items-center space-x-2 text-xs text-cyan-300/90 transition-all delay-900 duration-1000 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className='h-px flex-grow bg-gradient-to-r from-cyan-500/50 to-transparent'></div>
              <span>ĐIỀU KIỆN TỐI ƯU</span>
              <div className='h-px flex-grow bg-gradient-to-l from-cyan-500/50 to-transparent'></div>
            </div>

            <div className='grid grid-cols-2 gap-3'>
              {/* Temperature */}
              <div
                className={`group relative overflow-hidden rounded-xl border border-cyan-500/20 bg-cyan-950/30 p-3 transition-all duration-500 hover:border-cyan-400/40 hover:bg-cyan-900/30 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                style={{ transitionDelay: '1000ms' }}
              >
                {/* Decorative corners */}
                <div className='absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan-400/50'></div>
                <div className='absolute right-0 bottom-0 h-2 w-2 border-r border-b border-cyan-400/50'></div>

                {/* Animated highlight effect */}
                <div className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent transition-transform duration-1500 ease-in-out group-hover:translate-x-full'></div>

                <div className='relative z-10 flex items-center space-x-3'>
                  <div className='rounded-full border border-cyan-500/30 bg-cyan-900/50 p-2'>
                    <ThermometerIcon className='h-5 w-5 text-cyan-400' />
                  </div>
                  <div>
                    <div className='mb-1 text-[10px] text-cyan-400/70 uppercase'>Nhiệt độ</div>
                    <div className='text-sm text-cyan-100'>{techniqueData.idealConditions.temperature}</div>
                  </div>
                </div>
              </div>

              {/* Water */}
              <div
                className={`group relative overflow-hidden rounded-xl border border-cyan-500/20 bg-cyan-950/30 p-3 transition-all duration-500 hover:border-cyan-400/40 hover:bg-cyan-900/30 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                style={{ transitionDelay: '1100ms' }}
              >
                {/* Decorative corners */}
                <div className='absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan-400/50'></div>
                <div className='absolute right-0 bottom-0 h-2 w-2 border-r border-b border-cyan-400/50'></div>

                {/* Animated highlight effect */}
                <div className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent transition-transform duration-1500 ease-in-out group-hover:translate-x-full'></div>

                <div className='relative z-10 flex items-center space-x-3'>
                  <div className='rounded-full border border-cyan-500/30 bg-cyan-900/50 p-2'>
                    <DropletIcon className='h-5 w-5 text-cyan-400' />
                  </div>
                  <div>
                    <div className='mb-1 text-[10px] text-cyan-400/70 uppercase'>Nước</div>
                    <div className='text-sm text-cyan-100'>{techniqueData.idealConditions.water}</div>
                  </div>
                </div>
              </div>

              {/* Soil */}
              <div
                className={`group relative overflow-hidden rounded-xl border border-cyan-500/20 bg-cyan-950/30 p-3 transition-all duration-500 hover:border-cyan-400/40 hover:bg-cyan-900/30 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                style={{ transitionDelay: '1200ms' }}
              >
                {/* Decorative corners */}
                <div className='absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan-400/50'></div>
                <div className='absolute right-0 bottom-0 h-2 w-2 border-r border-b border-cyan-400/50'></div>

                {/* Animated highlight effect */}
                <div className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent transition-transform duration-1500 ease-in-out group-hover:translate-x-full'></div>

                <div className='relative z-10 flex items-center space-x-3'>
                  <div className='rounded-full border border-cyan-500/30 bg-cyan-900/50 p-2'>
                    <ShowerHead className='h-5 w-5 text-cyan-400' />
                  </div>
                  <div>
                    <div className='mb-1 text-[10px] text-cyan-400/70 uppercase'>Đất</div>
                    <div className='text-sm text-cyan-100'>{techniqueData.idealConditions.soil}</div>
                  </div>
                </div>
              </div>

              {/* Sunlight */}
              <div
                className={`group relative overflow-hidden rounded-xl border border-cyan-500/20 bg-cyan-950/30 p-3 transition-all duration-500 hover:border-cyan-400/40 hover:bg-cyan-900/30 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                style={{ transitionDelay: '1300ms' }}
              >
                {/* Decorative corners */}
                <div className='absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan-400/50'></div>
                <div className='absolute right-0 bottom-0 h-2 w-2 border-r border-b border-cyan-400/50'></div>

                {/* Animated highlight effect */}
                <div className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent transition-transform duration-1500 ease-in-out group-hover:translate-x-full'></div>

                <div className='relative z-10 flex items-center space-x-3'>
                  <div className='rounded-full border border-cyan-500/30 bg-cyan-900/50 p-2'>
                    <SunIcon className='h-5 w-5 text-cyan-400' />
                  </div>
                  <div>
                    <div className='mb-1 text-[10px] text-cyan-400/70 uppercase'>Ánh sáng</div>
                    <div className='text-sm text-cyan-100'>{techniqueData.idealConditions.sunlight}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Implementation Steps section */}
          <div className='relative z-10 border-b border-cyan-500/30 p-4'>
            <div
              className={`mb-3 flex items-center justify-between text-xs text-cyan-300/90 transition-all delay-1400 duration-1000 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className='flex items-center space-x-2'>
                <div className='h-px w-12 bg-gradient-to-r from-cyan-500/50 to-transparent'></div>
                <span>QUY TRÌNH THỰC HIỆN</span>
                <div className='h-px w-12 bg-gradient-to-l from-cyan-500/50 to-transparent'></div>
              </div>
              <div className='rounded border border-cyan-500/30 bg-cyan-950/50 px-2 py-0.5 text-[10px]'>{techniqueData.steps.length} BƯỚC</div>
            </div>

            <div className='space-y-2'>
              {techniqueData.steps.map((step, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer overflow-hidden rounded-xl border transition-all duration-500 ease-out ${
                    activeStep === index
                      ? 'border-cyan-400/50 bg-cyan-900/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : 'border-cyan-500/20 bg-cyan-950/30 hover:bg-cyan-900/20'
                  } ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} `}
                  style={{ transitionDelay: `${1500 + index * 100}ms` }}
                  onClick={() => setActiveStep(activeStep === index ? null : index)}
                >
                  {/* Step header */}
                  <div className='flex items-center justify-between p-3'>
                    <div className='flex items-center space-x-3'>
                      <div className='flex h-7 w-7 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-900/50 text-xs font-bold text-cyan-300'>
                        {index + 1}
                      </div>
                      <div className='text-sm font-medium text-cyan-100'>{step.title}</div>
                    </div>
                    {activeStep === index ? <ChevronUp className='h-4 w-4 text-cyan-400/70' /> : <ChevronDown className='h-4 w-4 text-cyan-400/70' />}
                  </div>

                  {/* Expanded details */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-out ${activeStep === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className='border-t border-cyan-500/20 p-3 pt-0'>
                      <p className='mt-2 ml-10 text-sm text-cyan-200'>{step.description}</p>
                    </div>
                  </div>

                  {/* Decorative corner */}
                  <div className='absolute top-0 right-0 h-4 w-4 border-t border-r border-cyan-400/30'></div>
                  <div className='absolute bottom-0 left-0 h-4 w-4 border-b border-l border-cyan-400/30'></div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips section */}
          <div className='relative z-10 border-b border-cyan-500/30 p-4'>
            <div
              className={`mb-3 flex items-center space-x-2 text-xs text-cyan-300/90 transition-all delay-2000 duration-1000 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className='h-px flex-grow bg-gradient-to-r from-cyan-500/50 to-transparent'></div>
              <span>MẸO TỐI ƯU HÓA</span>
              <div className='h-px flex-grow bg-gradient-to-l from-cyan-500/50 to-transparent'></div>
            </div>

            <div className='space-y-2'>
              {techniqueData.tips.map((tip, index) => (
                <div
                  key={index}
                  className={`group relative overflow-hidden rounded-xl border border-cyan-500/20 bg-cyan-950/30 p-3 transition-all duration-500 hover:bg-cyan-900/20 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                  style={{ transitionDelay: `${2100 + index * 100}ms` }}
                >
                  {/* Decorative corners */}
                  <div className='absolute top-0 left-0 h-2 w-2 border-t border-l border-cyan-400/50'></div>
                  <div className='absolute right-0 bottom-0 h-2 w-2 border-r border-b border-cyan-400/50'></div>

                  {/* Animated highlight effect */}
                  <div className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent transition-transform duration-1500 ease-in-out group-hover:translate-x-full'></div>

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
              className={`mb-3 flex items-center space-x-2 text-xs text-cyan-300/90 transition-all delay-2500 duration-1000 ${showDetails ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className='h-px flex-grow bg-gradient-to-r from-cyan-500/50 to-transparent'></div>
              <span>KHU VỰC PHÙ HỢP</span>
              <div className='h-px flex-grow bg-gradient-to-l from-cyan-500/50 to-transparent'></div>
            </div>

            <div className='flex flex-wrap gap-2'>
              {techniqueData.suitableRegions.map((region, index) => (
                <div
                  key={index}
                  className={`group relative overflow-hidden rounded-full border border-cyan-500/20 bg-cyan-950/30 px-3 py-1.5 transition-all duration-500 hover:border-cyan-400/40 hover:bg-cyan-900/20 ${showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                  style={{ transitionDelay: `${2600 + index * 100}ms` }}
                >
                  {/* Animated highlight effect */}
                  <div className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent transition-transform duration-1500 ease-in-out group-hover:translate-x-full'></div>

                  <div className='relative z-10 flex items-center space-x-1'>
                    <MapPin className='h-3.5 w-3.5 text-cyan-400' />
                    <span className='text-sm text-cyan-100'>{region}</span>
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

export default FarmingTechniqueTemplate
