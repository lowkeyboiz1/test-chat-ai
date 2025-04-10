import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { TLandPlot, TCropData } from '@/types'

interface CropsPanelProps {
  landPlots: TLandPlot[]
  setCropDetailOpen: (open: boolean) => void
  setSelectedCrop: (crop: TCropData) => void
  setSelectedPlot: (plot: TLandPlot) => void
}

export function CropsPanel({ landPlots, setCropDetailOpen, setSelectedCrop, setSelectedPlot }: CropsPanelProps) {
  return (
    <div className='space-y-5'>
      <div>
        <div className='mb-2 flex items-center justify-between'>
          <h3 className='text-sm font-medium text-gray-900'>Thửa đất & cây trồng</h3>
          <Button
            variant='ghost'
            size='sm'
            className='!rounded-button h-7 px-2 text-xs whitespace-nowrap text-amber-600 hover:bg-amber-50 hover:text-amber-700'
          >
            <i className='fas fa-plus mr-1'></i> Thêm thửa đất
          </Button>
        </div>
        <div className='space-y-3'>
          {landPlots.map((plot, plotIndex) => (
            <Card key={plotIndex} className='overflow-hidden border-amber-200'>
              <div className='border-b border-amber-200 bg-amber-50 p-2'>
                <div className='flex items-center justify-between'>
                  <h4 className='text-sm font-medium text-amber-800'>{plot.name}</h4>
                  <div className='flex items-center gap-1 text-xs text-amber-600'>
                    <i className='fas fa-map-marker-alt'></i>
                    <span>{plot.location}</span>
                  </div>
                </div>
              </div>
              <CardContent className='p-2'>
                {plot.crops.map((crop, cropIndex) => (
                  <div key={cropIndex} className='mb-2 rounded-lg border border-amber-100 p-2 last:mb-0'>
                    <div className='mb-2 flex items-center justify-between'>
                      <div className='flex items-center'>
                        <div className='mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-amber-100'>
                          <i
                            className={`fas fa-${crop.name === 'Lúa mùa thu' ? 'seedling' : crop.name === 'Rau muống' ? 'leaf' : 'apple-alt'} text-xs text-amber-600`}
                          ></i>
                        </div>
                        <div>
                          <p className='text-sm font-medium text-amber-800'>{crop.name}</p>
                          <p className='text-xs text-amber-600'>{plot.area}</p>
                        </div>
                      </div>
                    </div>
                    <div className='mb-2'>
                      <div className='mb-1 flex items-center justify-between'>
                        <span className='text-xs font-medium'>Tiến độ phát triển</span>
                        <span className='text-xs font-medium'>{crop.progress}%</span>
                      </div>
                      <Progress value={crop.progress} className='h-2 bg-amber-100' />
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center text-xs text-amber-700'>
                        <i className='fas fa-calendar-check mr-1'></i>
                        <span>Cần {crop.nextAction.toLowerCase()}</span>
                      </div>
                      <Button
                        variant='outline'
                        size='sm'
                        className='!rounded-button h-7 border-amber-200 bg-white px-2 text-xs whitespace-nowrap hover:bg-amber-50 hover:text-amber-700'
                        onClick={() => {
                          setCropDetailOpen(true)
                          setSelectedCrop(crop)
                          setSelectedPlot(plot)
                        }}
                      >
                        <i className='fas fa-info-circle mr-1'></i> Chi tiết
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  variant='outline'
                  size='sm'
                  className='!rounded-button mt-2 h-7 w-full border-amber-200 bg-white text-xs whitespace-nowrap hover:bg-amber-50 hover:text-amber-700'
                >
                  <i className='fas fa-plus mr-1'></i> Thêm cây trồng vào thửa đất này
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div>
        <div className='mb-2 flex items-center justify-between'>
          <h3 className='text-sm font-medium text-gray-900'>Phân bổ thửa đất</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                className='!rounded-button h-7 px-2 text-xs whitespace-nowrap text-amber-600 hover:bg-amber-50 hover:text-amber-700'
              >
                <i className='fas fa-expand-alt mr-1'></i> Xem đầy đủ
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Phân bổ thửa đất</DialogTitle>
                <DialogDescription>Tổng quan về phân bổ diện tích canh tác theo thửa đất</DialogDescription>
              </DialogHeader>
              <div className='h-80'>
                {/* Placeholder for full land distribution chart */}
                <div className='flex h-full w-full items-center justify-center rounded-lg bg-amber-50'>
                  <p className='text-amber-600'>Biểu đồ phân bổ thửa đất</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant='outline' className='border-amber-200 hover:bg-amber-50 hover:text-amber-700'>
                  Đóng
                </Button>
                <Button className='bg-amber-600 hover:bg-amber-700'>
                  <i className='fas fa-download mr-1.5'></i>
                  Xuất dữ liệu
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <Card className='border-amber-200'>
          <CardContent className='p-2'>
            <div className='mb-2 flex h-40 items-center justify-center rounded-lg bg-amber-50'>
              <p className='text-sm text-amber-600'>Biểu đồ phân bổ thửa đất</p>
            </div>
            <div className='grid grid-cols-2 gap-2 text-center'>
              <div className='rounded-lg border border-amber-100 bg-amber-50 p-1.5'>
                <p className='text-xs text-amber-700'>Tổng diện tích</p>
                <p className='font-medium text-amber-800'>2.5 ha</p>
              </div>
              <div className='rounded-lg border border-amber-100 bg-amber-50 p-1.5'>
                <p className='text-xs text-amber-700'>Số thửa đất</p>
                <p className='font-medium text-amber-800'>{landPlots.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
