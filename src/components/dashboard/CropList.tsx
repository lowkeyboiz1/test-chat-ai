import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TLandPlot } from '@/types'
import { Button } from '@/components/ui/button'

interface CropListProps {
  landPlots: TLandPlot[]
  onSelectPlot: (plot: TLandPlot) => void
}

const CropList: React.FC<CropListProps> = ({ landPlots, onSelectPlot }) => {
  return (
    <div>
      <div className='mb-2 flex items-center justify-between'>
        <h3 className='text-sm font-medium text-gray-900'>Thửa đất của tôi</h3>
        <Button variant='ghost' size='sm' className='h-6 p-0 text-amber-600 hover:bg-amber-50'>
          <i className='fas fa-plus mr-1 text-xs'></i>
          <span className='text-xs'>Thêm</span>
        </Button>
      </div>
      <Card className='border-amber-200'>
        <CardContent className='p-0'>
          <div className='divide-y divide-amber-100'>
            {landPlots.map((plot, index) => (
              <div key={index} className='cursor-pointer p-3 hover:bg-amber-50' onClick={() => onSelectPlot(plot)}>
                <div className='flex items-center justify-between'>
                  <h4 className='text-sm font-medium text-gray-900'>{plot.name}</h4>
                  <span className='text-xs text-gray-500'>{plot.area}</span>
                </div>
                <div className='mt-1 flex items-center text-xs text-gray-500'>
                  <i className='fas fa-map-marker-alt mr-1.5 text-amber-500'></i>
                  <span>{plot.location}</span>
                </div>
                {plot.crops.length > 0 && (
                  <div className='mt-2'>
                    <div className='mb-1 flex items-center justify-between'>
                      <span className='text-xs text-gray-600'>{plot.crops[0].name}</span>
                      <span className='text-xs font-medium'>{plot.crops[0].progress}%</span>
                    </div>
                    <Progress value={plot.crops[0].progress} className='h-1.5 bg-amber-100' />
                    <div className='mt-1 flex items-center justify-between'>
                      <span className='text-[10px] text-gray-500'>Hành động tiếp theo: {plot.crops[0].nextAction}</span>
                      <span className={`text-[10px] font-medium ${plot.crops[0].daysRemaining === 0 ? 'text-red-500' : 'text-amber-600'}`}>
                        {plot.crops[0].daysRemaining === 0 ? 'Hôm nay' : `${plot.crops[0].daysRemaining} ngày`}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CropList
