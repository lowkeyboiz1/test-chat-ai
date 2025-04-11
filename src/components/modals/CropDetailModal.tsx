import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { TLandPlot } from '@/types'
import YieldRainfallChart from '@/components/charts/YieldRainfallChart'

interface CropDetailModalProps {
  isOpen: boolean
  onClose: () => void
  plot: TLandPlot | null
}

const CropDetailModal: React.FC<CropDetailModalProps> = ({ isOpen, onClose, plot }) => {
  if (!plot) return null

  const crop = plot.crops[0]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-center'>{plot.name}</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <span className='text-xs text-gray-500'>Diện tích</span>
              <p className='font-medium'>{plot.area}</p>
            </div>
            <div>
              <span className='text-xs text-gray-500'>Vị trí</span>
              <p className='font-medium'>{plot.location}</p>
            </div>
            <div>
              <span className='text-xs text-gray-500'>Cây trồng</span>
              <p className='font-medium'>{crop?.name || 'Chưa trồng'}</p>
            </div>
          </div>

          {crop && (
            <>
              <div>
                <div className='mb-1 flex items-center justify-between'>
                  <span className='text-sm'>Tiến độ canh tác</span>
                  <span className='font-medium'>{crop.progress}%</span>
                </div>
                <Progress value={crop.progress} className='h-2 bg-amber-100' />
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <div className='rounded-lg bg-amber-50 p-3'>
                  <div className='mb-2 flex items-center'>
                    <div className='mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-100'>
                      <i className='fas fa-calendar-day text-amber-600'></i>
                    </div>
                    <span className='text-sm font-medium'>Hành động tiếp theo</span>
                  </div>
                  <p className='text-sm'>{crop.nextAction}</p>
                  <Badge variant='outline' className='mt-2 border-amber-200 bg-white text-amber-600'>
                    <i className='fas fa-clock mr-1 text-[10px]'></i>
                    <span className='text-[10px]'>{crop.daysRemaining === 0 ? 'Hôm nay' : `${crop.daysRemaining} ngày`}</span>
                  </Badge>
                </div>

                <div className='rounded-lg bg-amber-50 p-3'>
                  <div className='mb-2 flex items-center'>
                    <div className='mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-100'>
                      <i className='fas fa-leaf text-amber-600'></i>
                    </div>
                    <span className='text-sm font-medium'>Tình trạng cây trồng</span>
                  </div>
                  <p className='text-sm'>Phát triển tốt</p>
                  <Badge variant='outline' className='mt-2 border-green-200 bg-white text-green-600'>
                    <i className='fas fa-check-circle mr-1 text-[10px]'></i>
                    <span className='text-[10px]'>Khỏe mạnh</span>
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className='mb-2 text-sm font-medium'>Dữ liệu năng suất & lượng mưa</h4>
                <YieldRainfallChart />
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={onClose} className='border-amber-200 hover:bg-amber-50 hover:text-amber-700'>
            Đóng
          </Button>
          <Button className='bg-amber-600 hover:bg-amber-700'>
            <i className='fas fa-edit mr-1.5'></i>
            Chỉnh sửa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CropDetailModal
