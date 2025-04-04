import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserInfoPanel } from "./UserInfoPanel"
import { CropsPanel } from "./CropsPanel"
import { WeatherPanel } from "./WeatherPanel"
import { LandPlot, CropData } from "@/types"

interface RightSidebarProps {
  intimacyLevel: number
  landPlots: LandPlot[]
  chartRef: React.RefObject<HTMLDivElement>
  setCropDetailOpen: (open: boolean) => void
  setSelectedCrop: (crop: CropData) => void
  setSelectedPlot: (plot: LandPlot) => void
}

export function RightSidebar({ intimacyLevel, landPlots, chartRef, setCropDetailOpen, setSelectedCrop, setSelectedPlot }: RightSidebarProps) {
  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <Tabs defaultValue="info" className="flex-1 flex flex-col">
        <div className="border-b border-gray-200 bg-amber-50/50">
          <TabsList className="w-full justify-start p-2 bg-transparent">
            <TabsTrigger value="info" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              <i className="fas fa-info-circle mr-2"></i>
              Thông tin
            </TabsTrigger>
            <TabsTrigger value="crops" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              <i className="fas fa-seedling mr-2"></i>
              Cây trồng
            </TabsTrigger>
            <TabsTrigger value="weather" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              <i className="fas fa-cloud-sun mr-2"></i>
              Thời tiết
            </TabsTrigger>
          </TabsList>
        </div>
        <ScrollArea className="flex-1 h-[calc(100vh-500px)]">
          <TabsContent value="info" className="p-3 mt-0">
            <UserInfoPanel intimacyLevel={intimacyLevel} />
          </TabsContent>

          <TabsContent value="crops" className="p-3 mt-0">
            <CropsPanel landPlots={landPlots} setCropDetailOpen={setCropDetailOpen} setSelectedCrop={setSelectedCrop} setSelectedPlot={setSelectedPlot} />
          </TabsContent>

          <TabsContent value="weather" className="p-3 mt-0">
            <WeatherPanel chartRef={chartRef} />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
