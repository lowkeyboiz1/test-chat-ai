import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CropData } from "@/types"

interface CropAnalyticsProps {
  crop: CropData
}

const CropAnalytics: React.FC<CropAnalyticsProps> = ({ crop }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-900 text-sm">Tiến độ canh tác</h3>
        <div className="flex items-center text-xs text-amber-600">
          <i className="fas fa-seedling mr-1"></i>
          {crop.name}
        </div>
      </div>
      <Card className="border-amber-200">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-600">Tiến độ phát triển</span>
            <span className="text-xs font-medium">{crop.progress}%</span>
          </div>
          <Progress value={crop.progress} className="h-1.5 bg-amber-100" />

          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs">
                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                  <i className="fas fa-calendar-day text-amber-600 text-xs"></i>
                </div>
                <span>Hành động tiếp theo</span>
              </div>
              <span className="text-xs font-medium text-amber-700">{crop.nextAction}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs">
                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                  <i className="fas fa-clock text-amber-600 text-xs"></i>
                </div>
                <span>Thời gian còn lại</span>
              </div>
              <span className={`text-xs font-medium ${crop.daysRemaining === 0 ? "text-red-500" : "text-amber-700"}`}>{crop.daysRemaining === 0 ? "Hôm nay" : `${crop.daysRemaining} ngày`}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs">
                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                  <i className="fas fa-tint text-amber-600 text-xs"></i>
                </div>
                <span>Độ ẩm đất</span>
              </div>
              <span className="text-xs font-medium text-amber-700">65%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CropAnalytics
