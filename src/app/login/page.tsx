'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { maskPhoneNumber } from '@/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/hooks/useToast'
import { useMutation } from '@tanstack/react-query'
import { apiServices } from '@/services/apiServices'
import { useIsMobile } from '@/hooks/useIsMoblie'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { instance } from '@/services/instance'

const countryCodes = [
  { code: '+84', flag: '🇻🇳', name: 'Vietnam' }
  // { code: '+1', flag: '🇺🇸', name: 'United States' },
  // { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  // { code: '+86', flag: '🇨🇳', name: 'China' },
  // { code: '+81', flag: '🇯🇵', name: 'Japan' }
]

const fadeVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -100, transition: { duration: 0.3 } }
}

const shakeAnimation = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 }
  }
}

const LoginPage = () => {
  const isMobile = useIsMobile()
  const { mutate: requestOtp, isPending } = useMutation({
    mutationFn: async () => {
      const phone_number = `${formData.countryCode}${formData.phoneNumber}`
      console.log({ phone_number })
      const response = await apiServices.requestOtp({ phone_number, device_id: '123' })
      console.log({ response })
    },
    onMutate: async () => {
      console.log('123')
    },
    onSuccess: async (data) => {
      console.log('123')
      console.log({ data })
    },
    onError: (err) => {
      console.log({ err })
    }
  })

  const toast = useToast()
  const router = useRouter()
  const [formData, setFormData] = useState({
    countryCode: '+84',
    phoneNumber: ''
  })
  const [error, setError] = useState('')
  const [isPhoneValid, setIsPhoneValid] = useState(false)
  const [step, setStep] = useState(1)
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', ''])
  const [countdown, setCountdown] = useState(5)
  const [canResend, setCanResend] = useState(false)
  const [otpError, setOtpError] = useState(false)
  const [resendCount, setResendCount] = useState(0)
  const [resendLimitReached, setResendLimitReached] = useState(false)
  const [shakeOtp, setShakeOtp] = useState(false)

  const handlePhoneNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value

    // Chỉ cho phép nhập số
    if (value && !/^\d+$/.test(value)) {
      return
    }

    // Nếu vượt quá 9 số (thành 10 số), xóa số 0 đầu tiên
    if (value.length > 9 && value.startsWith('0')) {
      value = value.slice(1) // Bỏ số 0 đầu tiên
    }

    // Giới hạn tối đa 9 số
    value = value.slice(0, 9)

    setFormData((prev) => ({ ...prev, phoneNumber: value }))

    // Kiểm tra hợp lệ (chỉ đúng 9 số)
    const isValid = value.length === 9
    setIsPhoneValid(isValid)

    // Xóa lỗi khi người dùng nhập
    setError('')
  }, [])

  const handleCountryCodeChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, countryCode: value }))
  }, [])

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!formData.phoneNumber) {
        setError('Số điện thoại là bắt buộc')
        return
      }

      if (!isPhoneValid) {
        setError('Số điện thoại phải có đúng 9 chữ số')
        return
      }

      if (isPhoneValid) {
        console.log('Form data:', formData)
        // send OTP to the phone number
        requestOtp()
        toast.success('Mã OTP đã được gửi đến số điện thoại của bạn')
        setStep(2)
      }
    },
    [formData, isPhoneValid]
  )

  const verifyOtp = async (otp: string) => {
    try {
      // Simulate OTP verification
      console.log({ otp, otpValues })

      const response = await instance.post('/api/auth/verify-otp', {
        phone_number: `${formData.countryCode}${formData.phoneNumber}`,
        otp,
        device_id: '123'
      })

      console.log({ response, otp, otpValues })
      // If OTP is correct, proceed to step 3
      console.log('OTP verified successfully')
      toast.success('Xác thực OTP thành công')
      // router.push('/collect')
      return true
    } catch (error) {
      console.error('OTP verification failed', error)
      setOtpError(true)
      setShakeOtp(true)
      toast.error('Mã OTP không chính xác')
      setTimeout(() => setShakeOtp(false), 500)
      return false
    }
  }

  const handleOtpChange = useCallback(
    async (index: number, value: string) => {
      if (value.length > 1) {
        value = value.slice(0, 1)
      }

      if (value && !/^\d+$/.test(value)) {
        return
      }

      const newOtpValues = [...otpValues]
      newOtpValues[index] = value
      setOtpValues(newOtpValues)
      setOtpError(false)
      console.log({ value, newOtpValues })

      // Auto focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`)
        if (nextInput) {
          nextInput.focus()
        }
      }

      // Auto verify OTP if all fields are filled
      console.log(newOtpValues.join('').length)
      if (newOtpValues.join('').length === 6) {
        const allFilled = newOtpValues.every((val) => val !== '')
        if (allFilled) {
          // Remove focus from the last input when the last digit is entered
          document.getElementById(`otp-input-${index}`)?.blur()
          try {
            const success = await verifyOtp(newOtpValues.join(''))
            if (success) {
              toast.success('Xác thực OTP thành công')
              // router.push('/collections')
            }
          } catch (error) {
            setOtpError(true)
            setShakeOtp(true)
            toast.error('Mã OTP không chính xác')
            setTimeout(() => setShakeOtp(false), 500)
          }
        }
      }
    },
    [otpValues]
  )

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
        const prevInput = document.getElementById(`otp-input-${index - 1}`)
        if (prevInput) {
          prevInput.focus()
        }
      }
    },
    [otpValues]
  )

  const handleResendOtp = useCallback(async () => {
    if (canResend) {
      if (resendCount >= 2) {
        setResendLimitReached(true)
        toast.error('Bạn đã yêu cầu gửi lại OTP quá nhiều lần')
        return
      }

      const response = await instance.post('/api/auth/resend-otp', {
        phone_number: `${formData.countryCode}${formData.phoneNumber}`,
        device_id: '123'
      })
      console.log({ response })
      setResendCount(resendCount + 1)
      setCountdown(5)
      setCanResend(false)
      // Clear OTP fields
      setOtpValues(['', '', '', '', '', ''])
      setOtpError(false)
      // Logic to resend OTP
      console.log('Resending OTP...')
      toast.success('Đã gửi lại mã OTP')
    }
  }, [canResend, resendCount, formData])

  const handleGoBack = useCallback(() => {
    if (step === 2) {
      setStep(1)
      setOtpValues(['', '', '', '', '', ''])
      setOtpError(false)
    } else if (step === 3 || step === 4) {
      setStep(1)
    }
  }, [step])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (step === 2 && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
    } else if (countdown === 0) {
      setCanResend(true)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [countdown, step])

  const [position, setPosition] = useState<GeolocationPosition | null>(null)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setPosition(position)
    })
  }, [])

  // Define step content components
  const stepComponents = useMemo(
    () => ({
      1: {
        key: 'login',
        content: (
          <div className='relative h-full w-full rounded-2xl md:p-8 lg:mx-auto lg:h-auto lg:w-fit lg:bg-white lg:p-12 lg:shadow-lg'>
            <h1 className='mb-1 text-xl font-bold text-gray-800 md:text-2xl'>Đăng nhập Vinimex AI</h1>
            <p className='mb-6 text-base text-[#A4A4A4] md:mb-8 md:text-lg'>Nhập số điện thoại của bạn để tiếp tục</p>
            {/* {position && (
              <>
                {position.coords.latitude} {position.coords.longitude}
              </>
            )} */}
            <form onSubmit={onSubmit} className='space-y-4 md:space-y-6'>
              <div className='relative flex justify-center'>
                <div
                  className={cn(
                    'mb-14 flex w-full items-center overflow-hidden rounded-2xl border border-[#E8E8E8] p-4 shadow-none',
                    formData.phoneNumber && 'border-primary-yellow'
                  )}
                >
                  <Select onValueChange={handleCountryCodeChange} defaultValue={formData.countryCode}>
                    <SelectTrigger className='h-full w-fit border-0 text-lg shadow-none focus:ring-0 md:text-2xl' hideIcon>
                      <SelectValue placeholder='Mã quốc gia' />
                    </SelectTrigger>
                    <SelectContent className='text-lg md:text-2xl'>
                      {countryCodes.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          <span className='flex items-center gap-2'>
                            <span>{country.flag}</span>
                            <span>{country.code}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={formData.phoneNumber}
                    onChange={handlePhoneNumberChange}
                    placeholder='Nhập số điện thoại'
                    className={cn(
                      'flex-1 border-0 pl-1 text-lg text-[#8E8E8E] shadow-none placeholder:text-lg placeholder:text-[#8E8E8E] focus-visible:ring-0 md:!text-2xl md:placeholder:!text-2xl'
                    )}
                    type='tel'
                    inputMode='numeric'
                    pattern='[0-9]*'
                  />
                </div>
                {error && <p className='absolute -bottom-6 left-0 mt-1 text-sm text-red-500'>{error}</p>}
              </div>

              <div className='absolute bottom-10 mt-6 flex w-full flex-col gap-3 md:mt-8 lg:static'>
                <Button
                  type='submit'
                  className={`w-full rounded-full text-base md:text-lg ${isPhoneValid ? 'bg-primary-blue hover:bg-blue-700' : 'bg-gray-300 hover:bg-gray-400'}`}
                  disabled={!isPhoneValid}
                  isLoading={isPending}
                >
                  Gửi mã OTP
                </Button>
              </div>
            </form>
          </div>
        )
      },
      2: {
        key: 'otp',
        content: (
          <div className='w-fit rounded-2xl lg:bg-white lg:p-10 lg:shadow-lg'>
            <div className='mb-4 flex cursor-pointer items-center' onClick={handleGoBack}>
              <Button variant='ghost' size='icon' className='mr-2 p-1'>
                <ArrowLeft className='h-5 w-5' />
              </Button>
              <h1 className='text-base font-bold text-gray-800'>Trở lại</h1>
            </div>
            <p className='text-2xl font-bold'>Nhập mã OTP</p>
            <p className='mb-6 text-base text-gray-600 md:mb-8 md:text-lg'>
              Nhập mã 6 số đã gửi tới {formData.countryCode}
              <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                {maskPhoneNumber(formData.phoneNumber)}
              </motion.span>{' '}
              qua SMS để tiếp tục
            </p>

            <form className='space-y-4 md:space-y-6'>
              <div className='relative'>
                <motion.div className='flex justify-center gap-1 md:gap-2' animate={shakeOtp ? 'shake' : 'visible'} variants={shakeAnimation}>
                  {otpValues.map((value, index) => (
                    <Input
                      key={index}
                      id={`otp-input-${index}`}
                      type='text'
                      inputMode='numeric'
                      pattern='[0-9]*'
                      value={value}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`border-primary-yellow focus:border-primary-yellow h-12 w-12 text-center text-lg font-bold md:h-16 md:w-16 md:!text-xl ${otpError ? 'border-red-500' : ''}`}
                      maxLength={1}
                      autoFocus={index === 0}
                    />
                  ))}
                </motion.div>
                {otpError && <p className='mt-2 text-center text-sm text-red-500'>Mã OTP chưa đúng, kiểm tra lại nhé!</p>}
              </div>

              <div className='mt-3 text-center md:mt-4'>
                <p className='text-sm text-gray-600 md:text-base'>
                  {resendLimitReached ? (
                    <span className='min-h-10 text-red-500'>Bạn yêu cầu quá nhiều lần, hãy thử lại sau</span>
                  ) : canResend ? (
                    <Button type='button' variant='link' className='text-[#A4A4A4]' onClick={handleResendOtp}>
                      Gửi lại mã OTP
                    </Button>
                  ) : (
                    <span className='min-h-10'>Gửi lại mã sau {countdown} giây</span>
                  )}
                </p>
              </div>

              {/* <div className='mt-6 flex w-full flex-col gap-3 md:mt-8'>
                <Button type='submit' className='bg-primary-blue w-full rounded-full text-base hover:bg-blue-700 md:text-lg' disabled={otpValues.some((val) => val === '')} isLoading={false}>
                  Xác nhận
                </Button>
              </div> */}
            </form>
          </div>
        )
      }
    }),
    [
      formData,
      isPhoneValid,
      error,
      otpValues,
      otpError,
      resendLimitReached,
      canResend,
      countdown,
      handleCountryCodeChange,
      handlePhoneNumberChange,
      onSubmit,
      handleOtpChange,
      handleKeyDown,
      handleResendOtp,
      verifyOtp,
      router,
      isPending,
      handleGoBack,
      shakeOtp
    ]
  )

  const currentStep = stepComponents[step as keyof typeof stepComponents]

  return (
    <div className='flex h-screen w-full justify-center bg-gray-50 p-4 lg:items-center'>
      <AnimatePresence mode='wait'>
        <motion.div className='w-fit *:lg:mx-auto' key={currentStep.key} variants={fadeVariants} initial='hidden' animate='visible' exit='exit'>
          {currentStep.content && currentStep.content}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default LoginPage
