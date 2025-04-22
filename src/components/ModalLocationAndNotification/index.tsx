'use client'

import { isOpenModalLocationAndNotification } from '@/atoms/modal'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAtom } from 'jotai'
import { CircleCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect, useCallback, memo } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/useToast'

const ModalLocationAndNotification = () => {
  const toast = useToast()
  const router = useRouter()
  const [isOpen, setIsOpen] = useAtom(isOpenModalLocationAndNotification)
  const [permissionStatus, setPermissionStatus] = useState({
    location: false,
    notification: false
  })

  useEffect(() => {
    // Check if both permissions are granted, redirect to login page
    if (permissionStatus.location && permissionStatus.notification) {
      setIsOpen(false)
      router.push('/login')
    }
  }, [permissionStatus, setIsOpen, router])

  const handleRequestPermissions = useCallback(async () => {
    try {
      // Request location permission
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setPermissionStatus((prev) => ({ ...prev, location: true }))
            console.log('Location permission granted')
            toast.success('Định vị đã được bật')
          },
          (error) => {
            console.error('Location permission denied:', error)
            toast.error(`Định vị không được bật: ${JSON.stringify(error)}`)
          }
        )
      }

      // Request notification permission
      if ('Notification' in window) {
        const result = await Notification.requestPermission()
        if (result === 'granted') {
          setPermissionStatus((prev) => ({ ...prev, notification: true }))
        }
      }
    } catch (error) {
      console.error('Error requesting permissions:', error)
    }
  }, [])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open)
    },
    [setIsOpen]
  )

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className='rounded-[20px] p-4 sm:p-6 md:rounded-[30px] md:p-8 lg:rounded-[40px] lg:p-12'>
          <DialogHeader>
            <DialogTitle className='text-xl font-bold text-[#333333] sm:text-2xl md:text-3xl'>Để Vinimex AI hỗ trợ tốt hơn</DialogTitle>
            <div className='flex flex-col gap-6 md:gap-8 lg:gap-12'>
              <div className='flex flex-col gap-3 md:gap-4'>
                <div className='flex items-start gap-1 text-sm text-[#333333] sm:text-base md:text-lg'>
                  <span>
                    <CircleCheck className='fill-primary-green h-5 w-5 text-white md:h-6 md:w-6' />
                  </span>{' '}
                  <span>
                    <strong>Bật Định vị:</strong> Dự báo thời tiết & giá nông sản chính xác.
                  </span>
                </div>
                <div className='flex items-start gap-1 text-sm text-[#333333] sm:text-base md:text-lg'>
                  <span>
                    <CircleCheck className='fill-primary-green h-5 w-5 text-white md:h-6 md:w-6' />
                  </span>{' '}
                  <span>
                    <strong>Bật Thông báo:</strong> Nhận cảnh báo sâu bệnh và giá tăng cao.
                  </span>
                </div>
              </div>
              <div className='flex flex-col items-center gap-2'>
                <Button className='w-full rounded-full text-sm sm:text-base' onClick={handleRequestPermissions}>
                  Bật định vị & thông báo
                </Button>
                <p className='text-center text-xs text-[#A4A4A4] sm:text-sm md:text-base lg:text-lg'>
                  Thông tin của bạn được bảo mật theo chính sách của Vinimex AI.
                </p>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default memo(ModalLocationAndNotification)
