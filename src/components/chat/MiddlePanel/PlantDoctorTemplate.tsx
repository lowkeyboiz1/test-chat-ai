'use client'

import React, { memo, useEffect, useRef, useState, useCallback } from 'react'
import { Bug, Sprout, Leaf, Droplets, AlertCircle, ChevronRight, FolderOpen, CheckCheck, ShieldCheck, BarChart2 } from 'lucide-react'
import '@/lib/animations.css'
import { TPlantDoctorData } from '@/types/plantDoctorTemplate'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// Add scanline animation inline if not in animations.css
const scanlineAnimation = `
@keyframes scanline {
  0% {
    top: -100%;
  }
  100% {
    top: 200%;
  }
}
`

interface PlantDoctorTemplateProps {
  plantData?: TPlantDoctorData
  isLoading?: boolean
}

// Symptom Tag component
const SymptomTag = memo(({ symptom }: { symptom: string }) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className='inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-950/60 px-2.5 py-1 text-xs font-medium text-emerald-300/90 shadow-sm shadow-emerald-500/10 backdrop-blur-sm'
    whileHover={{ scale: 1.05, backgroundColor: 'rgba(16, 185, 129, 0.2)' }}
  >
    <Leaf className='mr-1 h-3 w-3 text-emerald-400' />
    {symptom}
  </motion.div>
))

SymptomTag.displayName = 'SymptomTag'

// Info Card component
const InfoCard = memo(({ title, icon, children, className }: { title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn('rounded-xl border border-emerald-500/20 bg-emerald-950/50 p-4 backdrop-blur-sm', className)}
    whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.1)' }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className='mb-3 flex items-center gap-2'>
      <div className='flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20'>{icon}</div>
      <h3 className='text-sm font-semibold text-emerald-200'>{title}</h3>
    </div>
    <div className='text-sm text-emerald-100/90'>{children}</div>
  </motion.div>
))

InfoCard.displayName = 'InfoCard'

// Treatment Method component
const TreatmentMethod = memo(({ title, icon, items }: { title: string; icon: React.ReactNode; items: string[] }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className='rounded-lg border border-emerald-500/20 bg-emerald-950/40 p-3 shadow-sm'
    whileHover={{ scale: 1.02, backgroundColor: 'rgba(16, 185, 129, 0.15)' }}
  >
    <div className='mb-2 flex items-center gap-2 text-sm font-medium text-emerald-400'>
      <div className='flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20'>{icon}</div>
      {title}
    </div>
    <ul className='space-y-2'>
      {items.map((item, index) => (
        <motion.li
          key={index}
          className='flex items-start gap-2 text-xs text-emerald-100'
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <CheckCheck className='mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-400' />
          {item}
        </motion.li>
      ))}
    </ul>
  </motion.div>
))

TreatmentMethod.displayName = 'TreatmentMethod'

const PlantDoctorTemplate: React.FC<PlantDoctorTemplateProps> = ({ plantData, isLoading = false }) => {
  const [activeSection, setActiveSection] = useState<string>('symptoms')
  const [loaded, setLoaded] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [glowing, setGlowing] = useState(false)
  const particlesRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

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

  // Smooth tab transition effect
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
  }, [activeSection])

  if (isLoading || !plantData) {
    return (
      <div className='flex min-h-[500px] w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-emerald-100 to-emerald-50 p-4'>
        <div className='flex flex-col items-center'>
          <div className='relative h-16 w-16'>
            <div className='absolute inset-0 animate-pulse rounded-full bg-emerald-200'></div>
            <div className='absolute inset-0 animate-ping rounded-full bg-emerald-300 opacity-75'></div>
          </div>
          <div className='mt-6 h-4 w-48 animate-pulse rounded-full bg-emerald-200'></div>
          <div className='mt-2 h-3 w-32 animate-pulse rounded-full bg-emerald-100/70'></div>
          <div className='mt-8 grid w-64 grid-cols-2 gap-3'>
            <div className='h-20 animate-pulse rounded-lg bg-emerald-100'></div>
            <div className='h-20 animate-pulse rounded-lg bg-emerald-100'></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='relative flex min-h-[500px] w-full flex-col overflow-hidden rounded-xl bg-gradient-to-b from-emerald-950 to-slate-950 p-4 sm:rounded-3xl sm:p-6'
    >
      {/* Add inline style for scanline animation */}
      <style jsx global>
        {scanlineAnimation}
      </style>

      {/* Ambient background effects */}
      <div className='absolute top-0 right-0 -z-10 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl'></div>
      <div className='absolute bottom-0 left-0 -z-10 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl'></div>
      <div className='absolute top-1/2 left-1/4 -z-10 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/5 blur-2xl'></div>

      {/* Header section */}
      <div className='relative z-10 mb-4 flex items-center justify-between border-b border-emerald-500/30 pb-4 sm:mb-6'>
        <div className='flex items-center space-x-3'>
          <motion.div
            className={`relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-emerald-500/50 bg-emerald-950 transition-all duration-300 ${
              glowing ? 'shadow-lg shadow-emerald-400/30' : ''
            }`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Bug className={`h-7 w-7 text-emerald-400 ${glowing ? 'animate-pulse' : ''}`} />
            {glowing && (
              <motion.div
                className='absolute inset-0 rounded-full bg-emerald-400/40'
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              ></motion.div>
            )}
          </motion.div>
          <div>
            <motion.h3
              className='bg-gradient-to-r from-emerald-300 to-emerald-100 bg-clip-text text-xl font-bold text-transparent sm:text-2xl'
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Bác sĩ cây trồng
            </motion.h3>
            <motion.div
              className='mt-1 flex items-center text-xs text-emerald-400/70'
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className='mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400'></div>
              <span>Đom Đóm AI</span>
              <span className='ml-2 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-xs font-medium text-emerald-400'>Chẩn đoán</span>
            </motion.div>
          </div>
        </div>
        <motion.div
          className='rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 shadow-sm backdrop-blur-sm'
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(16, 185, 129, 0.2)' }}
        >
          {plantData.disease}
        </motion.div>
      </div>

      {/* Main content - horizontal layout */}
      <div className='relative z-10 flex flex-1 flex-col md:flex-row md:space-x-6'>
        {/* Left panel - Disease info and navigation (only visible on desktop) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className='mb-4 hidden w-full md:mb-0 md:block md:w-1/3'
        >
          <motion.div
            className='mb-5 rounded-lg border border-emerald-500/20 bg-emerald-950/30 p-4 shadow-sm backdrop-blur-sm'
            whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.15)' }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className='mb-2 flex items-center space-x-1.5 text-xs font-medium text-emerald-400/70 uppercase'>
              <AlertCircle className='h-3.5 w-3.5' />
              <span>Khuyến nghị</span>
            </div>
            <div className='text-sm leading-relaxed text-emerald-100'>{plantData.recommendation}</div>
          </motion.div>

          {/* Navigation buttons (desktop) */}
          <div className='space-y-2.5'>
            {[
              { id: 'symptoms', icon: <Leaf className='h-4 w-4' />, label: 'Triệu chứng' },
              { id: 'causes', icon: <FolderOpen className='h-4 w-4' />, label: 'Nguyên nhân' },
              { id: 'treatment', icon: <Droplets className='h-4 w-4' />, label: 'Điều trị' },
              { id: 'prevention', icon: <ShieldCheck className='h-4 w-4' />, label: 'Phòng ngừa' }
            ].map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
                  activeSection === item.id
                    ? 'bg-emerald-500/30 text-emerald-200 shadow-md shadow-emerald-500/10'
                    : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                }`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ x: 5 }}
              >
                <div className='flex items-center space-x-2'>
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <ChevronRight className={`h-4 w-4 transition-transform ${activeSection === item.id ? 'translate-x-1' : ''}`} />
              </motion.button>
            ))}
          </div>

          {/* Disease stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className='mt-5 flex items-center justify-center'
          >
            <div className='flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/40 px-3.5 py-1.5 backdrop-blur-sm'>
              <BarChart2 className='h-3.5 w-3.5 text-emerald-400/70' />
              <span className='text-xs text-emerald-300/80'>
                Mức độ nguy hiểm:
                <span className='ml-1 font-medium text-emerald-200'>Cao</span>
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Mobile recommendation panel (only visible on mobile) */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='mb-4 block md:hidden'>
          <motion.div
            className='rounded-lg border border-emerald-500/20 bg-emerald-950/30 p-4 shadow-sm backdrop-blur-sm'
            whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.15)' }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className='mb-2 flex items-center space-x-1.5 text-xs font-medium text-emerald-400/70 uppercase'>
              <AlertCircle className='h-3.5 w-3.5' />
              <span>Khuyến nghị</span>
            </div>
            <div className='text-sm leading-relaxed text-emerald-100'>{plantData.recommendation}</div>
          </motion.div>
        </motion.div>

        {/* Right panel - Content display */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className='relative flex-1 overflow-hidden rounded-xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/80 via-slate-900/90 to-emerald-950/80 pb-16 backdrop-blur-md md:pb-0'
        >
          <div ref={particlesRef} className='pointer-events-none absolute inset-0 overflow-hidden'></div>

          <div className='relative z-10 h-full p-5'>
            <AnimatePresence mode='wait'>
              <div ref={contentRef} key={activeSection} className='transition-all duration-300'>
                {activeSection === 'symptoms' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className='h-full'
                  >
                    <h3 className='mb-5 flex items-center gap-2 text-lg font-bold text-emerald-100'>
                      <Leaf className='h-5 w-5 text-emerald-400' />
                      Triệu chứng
                    </h3>
                    <div className='mb-5 flex flex-wrap gap-2'>
                      {plantData.symptoms.slice(0, 3).map((symptom, index) => (
                        <SymptomTag key={index} symptom={symptom} />
                      ))}
                    </div>
                    <div className='space-y-3'>
                      {plantData.symptoms.map((symptom, index) => (
                        <motion.div
                          key={index}
                          className='flex items-start gap-2.5 text-sm text-emerald-100'
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ x: 5 }}
                        >
                          <div className='mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20'>
                            <div className='h-1.5 w-1.5 rounded-full bg-emerald-400'></div>
                          </div>
                          {symptom}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeSection === 'causes' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className='h-full'
                  >
                    <h3 className='mb-5 flex items-center gap-2 text-lg font-bold text-emerald-100'>
                      <FolderOpen className='h-5 w-5 text-emerald-400' />
                      Nguyên nhân
                    </h3>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                      {plantData.causes.map((cause, index) => (
                        <InfoCard key={index} title={`Nguyên nhân ${index + 1}`} icon={<Bug className='h-3 w-3 text-emerald-400' />}>
                          {cause}
                        </InfoCard>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeSection === 'treatment' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className='h-full'
                  >
                    <h3 className='mb-5 flex items-center gap-2 text-lg font-bold text-emerald-100'>
                      <Droplets className='h-5 w-5 text-emerald-400' />
                      Phương pháp điều trị
                    </h3>
                    <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
                      <TreatmentMethod title='Điều trị sinh học' icon={<Sprout className='h-3 w-3 text-emerald-400' />} items={plantData.treatment.organic} />
                      <TreatmentMethod title='Điều trị hóa học' icon={<Droplets className='h-3 w-3 text-emerald-400' />} items={plantData.treatment.chemical} />
                    </div>
                  </motion.div>
                )}

                {activeSection === 'prevention' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className='h-full'
                  >
                    <h3 className='mb-5 flex items-center gap-2 text-lg font-bold text-emerald-100'>
                      <ShieldCheck className='h-5 w-5 text-emerald-400' />
                      Phòng ngừa
                    </h3>
                    <div className='space-y-3'>
                      {plantData.prevention.map((item, index) => (
                        <motion.div
                          key={index}
                          className='flex items-start gap-2.5 text-sm text-emerald-100'
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ x: 5 }}
                        >
                          <ShieldCheck className='mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400' />
                          {item}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </AnimatePresence>
          </div>

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
        </motion.div>
      </div>

      {/* Mobile Footer Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className='absolute right-0 bottom-0 left-0 z-50 block border-t border-emerald-500/30 bg-emerald-950/95 backdrop-blur-md md:hidden'
      >
        <div className='mx-auto flex items-center justify-around px-4 py-2'>
          {[
            { id: 'symptoms', icon: <Leaf className='h-5 w-5 text-emerald-400' />, label: 'Triệu chứng' },
            { id: 'causes', icon: <FolderOpen className='h-5 w-5 text-emerald-400' />, label: 'Nguyên nhân' },
            { id: 'treatment', icon: <Droplets className='h-5 w-5 text-emerald-400' />, label: 'Điều trị' },
            { id: 'prevention', icon: <ShieldCheck className='h-5 w-5 text-emerald-400' />, label: 'Phòng ngừa' }
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveSection(item.id)} className='group relative flex flex-col items-center justify-center px-1.5'>
              <div
                className={`relative mb-0.5 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
                  activeSection === item.id
                    ? 'border border-emerald-400/50 bg-emerald-900 shadow-lg shadow-emerald-500/20'
                    : 'border border-emerald-500/20 bg-emerald-950/70 hover:border-emerald-500/40 hover:bg-emerald-900/40'
                }`}
              >
                <div className={`relative z-10 transition-all duration-300 ${activeSection === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </div>
                {activeSection === item.id && (
                  <>
                    <div className='absolute inset-0 animate-pulse rounded-full bg-emerald-500/20'></div>
                    <div className='absolute -inset-1 animate-ping rounded-full border border-emerald-400/30 opacity-75'></div>
                  </>
                )}
              </div>
              <span
                className={`text-[8px] font-medium transition-colors duration-300 ${
                  activeSection === item.id ? 'text-emerald-300' : 'text-emerald-400/60 group-hover:text-emerald-300/80'
                }`}
              >
                {item.label}
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
        className='absolute bottom-0 left-0 -z-5 h-60 w-60 rounded-full bg-emerald-600/5 blur-3xl'
        style={{ animation: 'pulse 10s infinite ease-in-out' }}
      ></div>

      <div
        className='absolute top-0 right-0 -z-5 h-48 w-48 rounded-full bg-emerald-600/5 blur-3xl'
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

      {/* Corner accents */}
      <div className='pointer-events-none absolute top-0 right-0 h-10 w-10 rounded-tr-xl border-t-2 border-r-2 border-emerald-400/20'></div>
      <div className='pointer-events-none absolute bottom-0 left-0 h-10 w-10 rounded-bl-xl border-b-2 border-l-2 border-emerald-400/20'></div>
    </motion.div>
  )
}

export default memo(PlantDoctorTemplate)
