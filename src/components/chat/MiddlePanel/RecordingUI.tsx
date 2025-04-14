'use client'

import React, { useRef, useState, useEffect, useCallback, memo, useMemo } from 'react'
import { Square, X, Mic, Volume2, Sparkles, Loader2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RecordingUIProps {
  onStop: (transcript: string) => void
  onCancel: () => void
  transcript: string
}

const RecordingUI: React.FC<RecordingUIProps> = ({ onStop, onCancel, transcript }) => {
  // Create refs for animation elements
  const waveformRef = useRef<HTMLDivElement>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const [recordingPhase, setRecordingPhase] = useState<'initial' | 'active' | 'peak'>('initial')
  const [pulseEffect, setPulseEffect] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [localTranscript, setLocalTranscript] = useState(transcript)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Format time as MM:SS - memoized
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  // Create bar gradients - memoized
  const barGradients = useMemo(
    () => [
      'linear-gradient(to top, #00BFFF, #1E90FF)',
      'linear-gradient(to top, #8A2BE2, #4B0082)',
      'linear-gradient(to top, #00BFFF, #1E90FF)',
      'linear-gradient(to top, #20B2AA, #008080)',
      'linear-gradient(to top, #7B68EE, #4834d4)',
      'linear-gradient(to top, #00BFFF, #1E90FF)',
      'linear-gradient(to top, #20B2AA, #008080)',
      'linear-gradient(to top, #7B68EE, #4834d4)'
    ],
    []
  )

  // Initialize loading sequence similar to other templates
  useEffect(() => {
    setLoaded(true)
    return () => {}
  }, [])

  // Handle timer and recording phases
  useEffect(() => {
    const timer = setInterval(() => {
      setRecordingTime((prev: number) => {
        const newTime = prev + 1
        // Change phase based on recording time
        if (newTime === 5) setRecordingPhase('active')
        if (newTime === 15) setRecordingPhase('peak')

        // Add pulse effect every 5 seconds
        if (newTime % 5 === 0) {
          setPulseEffect(true)
          setTimeout(() => setPulseEffect(false), 800)
        }
        return newTime
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Initialize audio recording and analysis
  useEffect(() => {
    const initAudio = async () => {
      try {
        // Get user media
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        mediaStreamRef.current = stream

        // Create audio context and analyzer for visualization
        const audioContext = new (window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)()
        audioContextRef.current = audioContext

        const analyser = audioContext.createAnalyser()
        analyserRef.current = analyser
        analyser.fftSize = 256

        const source = audioContext.createMediaStreamSource(stream)
        source.connect(analyser)

        // Initialize MediaRecorder for capturing audio
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder

        // Setup event handlers for MediaRecorder
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data)
          }
        }

        // Start recording
        audioChunksRef.current = []
        mediaRecorder.start(1000) // Collect data every second

        // Start analyzing audio levels for visualization
        const dataArray = new Uint8Array(analyser.frequencyBinCount)

        const updateAudioLevel = () => {
          if (!analyserRef.current) return

          analyserRef.current.getByteFrequencyData(dataArray)

          // Calculate average volume level
          let sum = 0
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i]
          }
          const avg = sum / dataArray.length
          setAudioLevel(avg)

          animationFrameRef.current = requestAnimationFrame(updateAudioLevel)
        }

        updateAudioLevel()
      } catch (err) {
        console.error('Error accessing microphone:', err)
      }
    }

    initAudio()

    return () => {
      // Clean up
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      if (audioContextRef.current) {
        audioContextRef.current.close()
      }

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop())
      }
    }
  }, [])

  // Handle stop button click
  const handleStop = async () => {
    setIsTranscribing(true)

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()

      // Create audio blob from all chunks
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })

      try {
        // Create FormData to send to Whisper API
        const formData = new FormData()
        formData.append('file', audioBlob, 'recording.webm')
        formData.append('model', 'whisper-1')
        formData.append('language', 'vi') // Vietnamese language

        // Send to OpenAI Whisper API
        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
          },
          body: formData
        })

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }

        const data = await response.json()

        // Update transcript
        setLocalTranscript(data.text)

        // Call onStop with the transcribed text
        onStop(data.text)
      } catch (error) {
        console.error('Error transcribing audio:', error)
        // Still call onStop but with the existing transcript
        onStop(localTranscript)
      } finally {
        setIsTranscribing(false)
      }
    } else {
      onStop(localTranscript)
    }
  }

  // Create dynamic audio visualization with enhanced bars
  useEffect(() => {
    if (!waveformRef.current) return

    const waveform = waveformRef.current
    const barCount = 8

    // Create bars if they don't exist
    if (waveform.children.length === 0) {
      const bars = Array.from({ length: barCount }).map((_, index) => {
        const bar = document.createElement('div')
        bar.className = 'rounded-lg transition-all duration-100 ease-out'
        bar.style.background = barGradients[index % barGradients.length]

        // Responsive bar width
        bar.style.width = 'calc(10% - 4px)'
        bar.style.margin = '0 2px'
        bar.style.boxShadow = '0 0 15px rgba(8, 145, 178, 0.4)'
        bar.style.borderRadius = '0.5rem'
        return bar
      })

      // Add bars to waveform
      waveform.innerHTML = ''
      bars.forEach((bar) => waveform.appendChild(bar))
    }

    // Update existing bars based on audio level
    const updateBars = () => {
      const bars = Array.from(waveform.children) as HTMLElement[]

      bars.forEach((bar, index) => {
        // Create different patterns for each bar
        let height

        switch (index % 8) {
          case 0:
            height = 20 + audioLevel * 0.9 * Math.sin(Date.now() / 300)
            break
          case 1:
            height = 35 + audioLevel * 0.8 * Math.cos(Date.now() / 450)
            break
          case 2:
            height = 25 + audioLevel * 1.0 * Math.sin(Date.now() / 350)
            break
          case 3:
            height = 40 + audioLevel * 1.1 * Math.cos(Date.now() / 200)
            break
          case 4:
            height = 30 + audioLevel * 0.95 * Math.sin(Date.now() / 300)
            break
          case 5:
            height = 45 + audioLevel * 1.05 * Math.cos(Date.now() / 250)
            break
          case 6:
            height = 35 + audioLevel * 1.15 * Math.sin(Date.now() / 180)
            break
          case 7:
            height = 25 + audioLevel * 0.85 * Math.cos(Date.now() / 400)
            break
          default:
            height = 30 + audioLevel * 0.8
        }

        if (recordingPhase === 'active') {
          height += 15 * Math.sin(Date.now() / 180)
        } else if (recordingPhase === 'peak') {
          height += 25 * Math.sin(Date.now() / 100)
        }

        if (pulseEffect) {
          height += 30 * Math.sin(Date.now() / 80)
        }

        // Scale height for smaller screens
        const scaleFactor = window.innerWidth < 640 ? 0.8 : 1
        height = Math.max(15, Math.min(120 * scaleFactor, height))

        bar.style.height = `${height}px`
        bar.style.opacity = `${0.85 + height / 250}`

        // Reduced 3D effect for mobile
        const rotateVal = Math.sin(Date.now() / 600 + index) * (window.innerWidth < 640 ? 1 : 3)
        const scaleVal = 1 + audioLevel / 180
        bar.style.transform = `perspective(800px) rotateX(${rotateVal}deg) scale(${scaleVal})`
      })
    }

    updateBars()
    const intervalId = setInterval(updateBars, 20)

    return () => clearInterval(intervalId)
  }, [audioLevel, recordingPhase, pulseEffect, barGradients])

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80'>
      <div
        className={`w-[90%] max-w-sm overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900 shadow-xl shadow-cyan-500/20 transition-all duration-300 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      >
        {/* Header */}
        <div className='relative border-b border-cyan-500/30 bg-gradient-to-r from-cyan-900/50 to-cyan-950/50 p-3 sm:p-4'>
          <div className='flex items-center space-x-3'>
            <div className='relative'>
              <div className='absolute inset-0 animate-pulse rounded-full bg-cyan-500'></div>
              <div className='relative flex h-8 w-8 items-center justify-center rounded-full border border-cyan-500/50 bg-cyan-950 sm:h-9 sm:w-9'>
                <Mic className='h-4 w-4 text-cyan-400 sm:h-5 sm:w-5' />
              </div>
            </div>
            <div>
              <h3 className='bg-gradient-to-r from-cyan-300 to-cyan-100 bg-clip-text text-lg font-bold text-transparent'>Ghi âm giọng nói</h3>
              <div className='mt-0.5 flex items-center text-xs text-cyan-400/70'>
                <span>Đom Đóm AI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area with sections */}
        <div className='px-3 py-4 sm:px-4 sm:py-5'>
          {/* THÔNG TIN GHI ÂM section */}
          <div className='mb-4 sm:mb-5'>
            <div className='mb-2 text-center text-xs font-medium text-cyan-300 sm:text-sm'>THÔNG TIN GHI ÂM</div>

            <div className='rounded-lg border border-cyan-500/20 bg-cyan-950/30 p-3 sm:p-4'>
              <div className='mb-1 flex items-center space-x-2 text-xs text-cyan-400/70'>
                <Clock className='h-3 w-3 sm:h-4 sm:w-4' />
                <span className='text-[10px] uppercase sm:text-xs'>THỜI GIAN</span>
              </div>
              <div className='text-xl font-bold text-cyan-100 sm:text-2xl'>{formatTime(recordingTime)}</div>
            </div>

            <div className='mt-2 flex items-center gap-1.5'>
              <div className='h-1.5 w-1.5 animate-pulse rounded-full bg-red-500 sm:h-2 sm:w-2'></div>
              <div className='text-xs font-medium text-cyan-100 sm:text-sm'>Đang lắng nghe...</div>
            </div>
          </div>

          {/* BIỂU ĐỒ ÂM THANH section */}
          <div className='mb-4 sm:mb-5'>
            <div className='mb-2 text-center text-xs font-medium text-cyan-300 sm:text-sm'>BIỂU ĐỒ ÂM THANH</div>

            <div className='relative rounded-lg border border-cyan-500/20 bg-cyan-950/20 p-2 sm:p-3'>
              <div ref={waveformRef} className='flex h-28 items-end justify-center overflow-hidden p-1 sm:h-32 sm:p-2'></div>

              <div className='absolute bottom-2 left-2 flex items-center gap-1'>
                <div className='h-1.5 w-1.5 animate-pulse rounded-full bg-red-500 sm:h-2 sm:w-2'></div>
                <span className='text-[10px] font-medium text-cyan-300 sm:text-xs'>Live</span>
              </div>

              <div className='absolute right-2 bottom-2 flex items-center gap-1'>
                <Volume2 className='h-3 w-3 text-cyan-300 sm:h-4 sm:w-4' />
                <div className='h-1 w-12 overflow-hidden rounded-full bg-slate-700 sm:h-1.5 sm:w-16'>
                  <div
                    className='h-full bg-gradient-to-r from-cyan-400 to-cyan-500'
                    style={{ width: `${Math.min(100, audioLevel * 2)}%`, boxShadow: '0 0 8px rgba(8, 145, 178, 0.6)' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* VĂN BẢN ĐÃ NHẬN DẠNG section */}
          <div className='mb-3 sm:mb-4'>
            <div className='mb-2 text-center text-xs font-medium text-cyan-300 sm:text-sm'>VĂN BẢN ĐÃ NHẬN DẠNG</div>

            {localTranscript ? (
              <div className='rounded-lg border border-cyan-500/20 bg-cyan-950/30 p-3 sm:p-4'>
                <div className='mb-2 inline-flex rounded-full bg-cyan-500/20 px-2 py-0.5'>
                  <Sparkles className='mr-1 h-3 w-3 text-cyan-300' />
                  <span className='text-[10px] font-medium text-cyan-300 sm:text-xs'>Đã nhận dạng</span>
                </div>

                <p className='mb-2 text-sm font-medium text-cyan-100 sm:text-base'>{localTranscript}</p>

                <div className='flex items-center gap-1 text-[10px] text-cyan-400 sm:text-xs'>
                  {isTranscribing ? (
                    <>
                      <Loader2 className='h-3 w-3 animate-spin' />
                      <span>Đang phân tích...</span>
                    </>
                  ) : (
                    <span>Whisper AI đã chuyển đổi giọng nói thành văn bản</span>
                  )}
                </div>
              </div>
            ) : (
              <div className='rounded-lg border border-cyan-500/20 bg-cyan-950/30 p-3 sm:p-4'>
                <div className='flex animate-pulse flex-col items-center justify-center py-3 sm:py-4'>
                  <Sparkles className='mb-2 h-5 w-5 text-cyan-500/80 sm:h-6 sm:w-6' />
                  <p className='text-center text-xs text-cyan-400/90 sm:text-sm'>Bắt đầu nói để thấy văn bản được nhận dạng...</p>
                  <div className='mt-2 flex items-center gap-1'>
                    {isTranscribing ? (
                      <>
                        <Loader2 className='h-3 w-3 animate-spin text-cyan-400' />
                        <span className='text-[10px] font-medium text-cyan-400 sm:text-xs'>Đang nhận dạng</span>
                      </>
                    ) : (
                      <>
                        <Loader2 className='h-3 w-3 animate-spin text-cyan-400' />
                        <span className='text-[10px] font-medium text-cyan-400 sm:text-xs'>Đang lắng nghe</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Button section */}
        <div className='flex justify-center gap-2 border-t border-cyan-500/20 bg-gradient-to-t from-slate-900 to-cyan-950/40 p-3 sm:gap-3 sm:p-4'>
          <Button
            onClick={handleStop}
            className='h-9 bg-gradient-to-r from-cyan-600 to-cyan-500 px-3 py-1 text-xs text-white hover:from-cyan-700 hover:to-cyan-600 sm:px-4 sm:text-sm'
            disabled={isTranscribing}
          >
            {isTranscribing ? (
              <>
                <Loader2 className='mr-1.5 h-3 w-3 animate-spin sm:h-4 sm:w-4' />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <Square className='mr-1.5 h-3 w-3 sm:h-4 sm:w-4' />
                <span>Dừng ghi âm</span>
              </>
            )}
          </Button>

          <Button
            onClick={onCancel}
            variant='outline'
            className='h-9 border-cyan-500/50 px-3 py-1 text-xs text-cyan-200 hover:border-cyan-400 hover:bg-cyan-900/50 sm:px-4 sm:text-sm'
            disabled={isTranscribing}
          >
            <X className='mr-1.5 h-3 w-3 sm:h-4 sm:w-4' />
            <span>Huỷ bỏ</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default memo(RecordingUI)
