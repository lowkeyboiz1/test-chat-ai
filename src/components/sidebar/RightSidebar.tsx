import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { UserInfoPanel } from './UserInfoPanel'
import { CropsPanel } from './CropsPanel'
import { WeatherPanel } from './WeatherPanel'
import { TLandPlot, TCropData } from '@/types'

interface RightSidebarProps {
  intimacyLevel: number
  landPlots: TLandPlot[]
  chartRef: React.RefObject<HTMLDivElement>
  setCropDetailOpen: (open: boolean) => void
  setSelectedCrop: (crop: TCropData) => void
  setSelectedPlot: (plot: TLandPlot) => void
}

export function RightSidebar({ intimacyLevel, landPlots, chartRef, setCropDetailOpen, setSelectedCrop, setSelectedPlot }: RightSidebarProps) {
  return (
    <div className='flex w-80 flex-col border-l border-gray-200 bg-white'>
      <Tabs defaultValue='info' className='flex flex-1 flex-col'>
        <div className='border-b border-gray-200 bg-amber-50/50'>
          <TabsList className='w-full justify-start bg-transparent p-2'>
            <TabsTrigger value='info' className='data-[state=active]:bg-amber-600 data-[state=active]:text-white'>
              <i className='fas fa-info-circle mr-2'></i>
              Thông tin
            </TabsTrigger>
            <TabsTrigger value='crops' className='data-[state=active]:bg-amber-600 data-[state=active]:text-white'>
              <i className='fas fa-seedling mr-2'></i>
              Cây trồng
            </TabsTrigger>
            <TabsTrigger value='weather' className='data-[state=active]:bg-amber-600 data-[state=active]:text-white'>
              <i className='fas fa-cloud-sun mr-2'></i>
              Thời tiết
            </TabsTrigger>
          </TabsList>
        </div>
        <ScrollArea className='h-[calc(100vh-500px)] flex-1'>
          <TabsContent value='info' className='mt-0 p-3'>
            <UserInfoPanel intimacyLevel={intimacyLevel} />
          </TabsContent>

          <TabsContent value='crops' className='mt-0 p-3'>
            <CropsPanel landPlots={landPlots} setCropDetailOpen={setCropDetailOpen} setSelectedCrop={setSelectedCrop} setSelectedPlot={setSelectedPlot} />
          </TabsContent>

          <TabsContent value='weather' className='mt-0 p-3'>
            <WeatherPanel chartRef={chartRef} />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
