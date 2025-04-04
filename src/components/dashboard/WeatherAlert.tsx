import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const WeatherAlert: React.FC = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-900 text-sm">Cảnh báo thời tiết</h3>
        <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
          <i className="fas fa-exclamation-triangle mr-1 text-[10px]"></i>
          <span className="text-[10px]">Mới</span>
        </Badge>
      </div>
      <Card className="border-amber-200">
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <i className="fas fa-cloud-showers-heavy text-amber-600"></i>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Dự báo mưa lớn</h4>
              <p className="text-xs text-gray-600 mt-1">Dự báo có mưa lớn trong 3 ngày tới, lượng mưa trung bình 50-70mm. Khuyến cáo nông dân chuẩn bị thoát nước cho ruộng.</p>
              <div className="flex items-center mt-2">
                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 mr-2">
                  <i className="fas fa-calendar-alt mr-1 text-[10px]"></i>
                  <span className="text-[10px]">15/06 - 17/06</span>
                </Badge>
                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                  <i className="fas fa-map-marker-alt mr-1 text-[10px]"></i>
                  <span className="text-[10px]">Đồng Tháp</span>
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default WeatherAlert
