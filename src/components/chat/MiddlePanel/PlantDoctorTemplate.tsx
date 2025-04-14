'use client'

import React, { memo, useEffect, useRef, useState, useCallback } from 'react'
import { Bug, Sprout, Leaf, Droplets, AlertCircle, ChevronUp, ChevronDown, FolderOpen, CheckCheck, ShieldCheck } from 'lucide-react'

interface TreatmentOption {
  chemical: string[]
  organic: string[]
}

interface PlantDoctorData {
  disease: string
  symptoms: string[]
  causes: string[]
  treatment: TreatmentOption
  prevention: string[]
  recommendation: string
}

interface PlantDoctorTemplateProps {
  plantData?: PlantDoctorData
  isLoading?: boolean
}

const PlantDoctorTemplate: React.FC<PlantDoctorTemplateProps> = ({ plantData, isLoading = false }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    symptoms: false,
    causes: false,
    treatment: false,
    prevention: false
  })
  const [loaded, setLoaded] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [glowing, setGlowing] = useState(false)
  const particlesRef = useRef<HTMLDivElement>(null)

  // Enhanced particles effect
  const createParticle = useCallback(() => {
    if (!particlesRef.current) return

    const particle = document.createElement('div')
    const isGreen = Math.random() > 0.7

    particle.className = `absolute rounded-full ${isGreen ? 'bg-green-500/50' : 'bg-green-400/40'} pointer-events-none`

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

  useEffect(() => {
    if (isLoading || !plantData) return

    setLoaded(true)
    setScanning(true)

    // Animation sequence
    const glowInterval = setInterval(() => setGlowing((prev) => !prev), 2000)
    const particleInterval = setInterval(createParticle, 200)

    return () => {
      clearInterval(glowInterval)
      clearInterval(particleInterval)
    }
  }, [isLoading, plantData, createParticle])

  const toggleSection = (section: string) => {
    setExpanded((prev) => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  if (isLoading || !plantData) {
    return (
      <div className='flex min-h-[500px] w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-green-50 to-white p-4'>
        <div className='flex flex-col items-center'>
          <div className='h-12 w-12 animate-pulse rounded-full bg-green-200'></div>
          <div className='mt-4 h-4 w-48 animate-pulse rounded-full bg-green-100'></div>
          <div className='mt-2 h-3 w-32 animate-pulse rounded-full bg-green-100/70'></div>
          <div className='mt-6 grid w-64 grid-cols-2 gap-3'>
            <div className='h-20 animate-pulse rounded-lg bg-green-50'></div>
            <div className='h-20 animate-pulse rounded-lg bg-green-50'></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex min-h-[500px] w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-green-50 to-white p-4 sm:rounded-3xl sm:p-6'>
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
        <div className='absolute top-0 right-0 -z-10 h-40 w-40 rounded-full bg-green-400/15 blur-3xl sm:h-48 sm:w-48'></div>
        <div className='absolute bottom-0 left-0 -z-10 h-40 w-40 rounded-full bg-green-400/15 blur-3xl sm:h-48 sm:w-48'></div>
        <div className='absolute top-1/3 left-1/4 -z-10 h-24 w-24 rounded-full bg-green-300/10 blur-2xl'></div>

        {/* Main container */}
        <div
          className={`relative overflow-hidden rounded-xl border border-green-500/30 backdrop-blur-sm transition-all duration-500 sm:rounded-2xl ${loaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        >
          <div className='absolute inset-0 z-0 bg-gradient-to-b from-green-50/90 via-white/95 to-green-50/90'></div>
          <div ref={particlesRef} className='pointer-events-none absolute inset-0 overflow-hidden'></div>

          {/* Scanning effect */}
          <div
            className={`via-green/20 absolute inset-0 z-0 h-full w-full bg-gradient-to-b from-transparent to-transparent transition-all duration-700 ease-in-out ${scanning ? 'translate-y-full' : '-translate-y-full'}`}
          ></div>

          {/* Header section */}
          <div className='relative z-10 border-b border-green-500/30 p-4 sm:p-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3 sm:space-x-3'>
                <div
                  className={`relative flex h-12 w-12 items-center justify-center rounded-full border border-green-500/50 bg-white transition-all duration-300 sm:h-12 sm:w-12 ${
                    glowing ? 'shadow-lg shadow-green-400/30' : ''
                  }`}
                >
                  <Bug className={`h-6 w-6 text-green-500 sm:h-6 sm:w-6 ${glowing ? 'animate-pulse' : ''}`} />
                  {glowing && <div className='absolute inset-0 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-green-400/40 blur-md'></div>}
                </div>
                <div>
                  <h3 className='bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-xl font-bold text-transparent sm:text-2xl'>Bác sĩ cây trồng</h3>
                  <div className='mt-1 flex items-center text-xs text-green-500/70'>
                    <div className='mr-1.5 h-1.5 w-1.5 rounded-full bg-green-500'></div>
                    <span>Đom Đóm AI</span>
                    <span className='ml-2 rounded-full bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700'>Chẩn đoán</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Disease Information */}
          <div className='relative z-10 border-b border-green-200/50 p-4 sm:p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div className='flex h-9 w-9 items-center justify-center rounded-full bg-green-500/20'>
                  <Sprout className='h-4 w-4 text-green-600' />
                </div>
                <h3 className='text-lg font-bold text-slate-800'>Chẩn đoán bệnh</h3>
              </div>
              <div className='rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 shadow-sm'>{plantData.disease}</div>
            </div>

            {/* Recommendation */}
            <div className='mb-4 rounded-lg border border-green-300/70 bg-green-50/80 p-3.5 shadow-sm backdrop-blur-sm'>
              <div className='mb-1.5 flex items-center space-x-1.5 text-xs font-medium text-green-700 uppercase'>
                <AlertCircle className='h-3.5 w-3.5' />
                <span>Khuyến nghị</span>
              </div>
              <div className='text-sm leading-relaxed text-slate-700'>{plantData.recommendation}</div>
            </div>

            {/* Symptoms section */}
            <div className='mb-3'>
              <button
                onClick={() => toggleSection('symptoms')}
                className='mb-2 flex w-full items-center justify-between rounded-lg bg-green-100/70 px-4 py-2.5 text-sm font-semibold text-green-800 transition-colors hover:bg-green-100'
              >
                <div className='flex items-center space-x-2'>
                  <Leaf className='h-4 w-4' />
                  <span>Triệu chứng</span>
                </div>
                {expanded.symptoms ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
              </button>
              {expanded.symptoms && (
                <div className='animate-[fadeIn_0.3s_ease-out] rounded-lg border border-green-100 bg-white p-3 shadow-sm'>
                  <ul className='space-y-2'>
                    {plantData.symptoms.map((symptom, index) => (
                      <li key={index} className='flex items-start gap-2 text-sm text-slate-700'>
                        <div className='mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-green-100'>
                          <div className='h-1.5 w-1.5 rounded-full bg-green-600'></div>
                        </div>
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Causes section */}
            <div className='mb-3'>
              <button
                onClick={() => toggleSection('causes')}
                className='mb-2 flex w-full items-center justify-between rounded-lg bg-amber-100/70 px-4 py-2.5 text-sm font-semibold text-amber-800 transition-colors hover:bg-amber-100'
              >
                <div className='flex items-center space-x-2'>
                  <FolderOpen className='h-4 w-4' />
                  <span>Nguyên nhân</span>
                </div>
                {expanded.causes ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
              </button>
              {expanded.causes && (
                <div className='animate-[fadeIn_0.3s_ease-out] rounded-lg border border-amber-100 bg-white p-3 shadow-sm'>
                  <ul className='space-y-2'>
                    {plantData.causes.map((cause, index) => (
                      <li key={index} className='flex items-start gap-2 text-sm text-slate-700'>
                        <div className='mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-amber-100'>
                          <div className='h-1.5 w-1.5 rounded-full bg-amber-600'></div>
                        </div>
                        {cause}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Treatment section */}
            <div className='mb-3'>
              <button
                onClick={() => toggleSection('treatment')}
                className='mb-2 flex w-full items-center justify-between rounded-lg bg-blue-100/70 px-4 py-2.5 text-sm font-semibold text-blue-800 transition-colors hover:bg-blue-100'
              >
                <div className='flex items-center space-x-2'>
                  <Droplets className='h-4 w-4' />
                  <span>Phương pháp điều trị</span>
                </div>
                {expanded.treatment ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
              </button>
              {expanded.treatment && (
                <div className='animate-[fadeIn_0.3s_ease-out] space-y-3'>
                  <div className='rounded-lg border border-blue-100 bg-white p-3 shadow-sm'>
                    <div className='mb-2 flex items-center gap-2 text-sm font-medium text-blue-700'>
                      <div className='flex h-5 w-5 items-center justify-center rounded-full bg-blue-100'>
                        <Sprout className='h-3 w-3' />
                      </div>
                      Điều trị sinh học
                    </div>
                    <ul className='space-y-2'>
                      {plantData.treatment.organic.map((item, index) => (
                        <li key={index} className='flex items-start gap-2 text-sm text-slate-700'>
                          <CheckCheck className='mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-blue-500' />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className='rounded-lg border border-rose-100 bg-white p-3 shadow-sm'>
                    <div className='mb-2 flex items-center gap-2 text-sm font-medium text-rose-700'>
                      <div className='flex h-5 w-5 items-center justify-center rounded-full bg-rose-100'>
                        <Droplets className='h-3 w-3' />
                      </div>
                      Điều trị hóa học
                    </div>
                    <ul className='space-y-2'>
                      {plantData.treatment.chemical.map((item, index) => (
                        <li key={index} className='flex items-start gap-2 text-sm text-slate-700'>
                          <CheckCheck className='mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-rose-500' />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Prevention section */}
            <div>
              <button
                onClick={() => toggleSection('prevention')}
                className='mb-2 flex w-full items-center justify-between rounded-lg bg-emerald-100/70 px-4 py-2.5 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-100'
              >
                <div className='flex items-center space-x-2'>
                  <ShieldCheck className='h-4 w-4' />
                  <span>Phòng ngừa</span>
                </div>
                {expanded.prevention ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
              </button>
              {expanded.prevention && (
                <div className='animate-[fadeIn_0.3s_ease-out] rounded-lg border border-emerald-100 bg-white p-3 shadow-sm'>
                  <ul className='space-y-2'>
                    {plantData.prevention.map((item, index) => (
                      <li key={index} className='flex items-start gap-2 text-sm text-slate-700'>
                        <ShieldCheck className='mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-500' />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Visual effects overlays */}
          <div className='pointer-events-none absolute inset-0 z-20 opacity-30 mix-blend-overlay'>
            <div
              className='absolute inset-0 animate-pulse'
              style={{
                backgroundImage: 'linear-gradient(0deg, transparent 0%, rgba(34, 197, 94, 0.1) 2%, transparent 3%)',
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
                backgroundImage: 'linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.2), transparent)',
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

export default memo(PlantDoctorTemplate)
