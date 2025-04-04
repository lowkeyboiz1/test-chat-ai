import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { LandPlot } from "@/types"
import { Button } from "@/components/ui/button"

interface CropListProps {
  landPlots: LandPlot[]
  onSelectPlot: (plot: LandPlot) => void
}

const CropList: React.FC<CropListProps> = ({ landPlots, onSelectPlot }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-900 text-sm">Thửa đất của tôi</h3>
        <Button variant="ghost" size="sm" className="h-6 text-amber-600 hover:bg-amber-50 p-0">
          <i className="fas fa-plus text-xs mr-1"></i>
          <span className="text-xs">Thêm</span>
        </Button>
      </div>
      <Card className="border-amber-200">
        <CardContent className="p-0">
          <div className="divide-y divide-amber-100">
            {landPlots.map((plot, index) => (
              <div key={index} className="p-3 hover:bg-amber-50 cursor-pointer" onClick={() => onSelectPlot(plot)}>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">{plot.name}</h4>
                  <span className="text-xs text-gray-500">{plot.area}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <i className="fas fa-map-marker-alt mr-1.5 text-amber-500"></i>
                  <span>{plot.location}</span>
                </div>
                {plot.crops.length > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">{plot.crops[0].name}</span>
                      <span className="text-xs font-medium">{plot.crops[0].progress}%</span>
                    </div>
                    <Progress value={plot.crops[0].progress} className="h-1.5 bg-amber-100" />
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-gray-500">Hành động tiếp theo: {plot.crops[0].nextAction}</span>
                      <span className={`text-[10px] font-medium ${plot.crops[0].daysRemaining === 0 ? "text-red-500" : "text-amber-600"}`}>
                        {plot.crops[0].daysRemaining === 0 ? "Hôm nay" : `${plot.crops[0].daysRemaining} ngày`}
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
