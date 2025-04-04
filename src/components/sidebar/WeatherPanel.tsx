import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface WeatherPanelProps {
  chartRef: React.RefObject<HTMLDivElement>
}

export function WeatherPanel({ chartRef }: WeatherPanelProps) {
  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-900 text-sm">Dự báo thời tiết</h3>
          <div className="flex items-center text-xs text-amber-600">
            <i className="fas fa-map-marker-alt mr-1"></i>
            Đồng Tháp
          </div>
        </div>
        <Card className="border-amber-200">
          <CardContent className="p-2">
            <Tabs defaultValue="daily">
              <TabsList className="grid w-full grid-cols-2 bg-amber-100">
                <TabsTrigger value="daily" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-xs py-1">
                  Hàng ngày
                </TabsTrigger>
                <TabsTrigger value="weekly" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-xs py-1">
                  Hàng tuần
                </TabsTrigger>
              </TabsList>
              <TabsContent value="daily" className="mt-2">
                <div className="grid grid-cols-4 gap-1 text-center">
                  {["Sáng", "Trưa", "Chiều", "Tối"].map((time, index) => (
                    <div key={index} className="bg-white rounded-lg p-1.5 border border-amber-100">
                      <p className="text-xs text-amber-700">{time}</p>
                      <i
                        className={`fas fa-${["sun", "cloud-sun", "cloud", "cloud-rain"][index]} text-base my-1 ${
                          index === 0 ? "text-yellow-500" : index === 1 ? "text-orange-400" : index === 2 ? "text-gray-400" : "text-blue-400"
                        }`}
                      ></i>
                      <p className="font-medium text-xs">{[29, 32, 30, 27][index]}°C</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="weekly" className="mt-2">
                <div className="space-y-1.5">
                  {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6"].map((day, index) => (
                    <div key={index} className="flex items-center justify-between bg-white rounded-lg p-1.5 border border-amber-100">
                      <span className="text-amber-800 text-xs">{day}</span>
                      <div className="flex items-center gap-2">
                        <i
                          className={`fas fa-${["sun", "cloud-sun", "cloud-rain", "cloud", "sun"][index]} text-xs ${
                            index === 0 || index === 4 ? "text-yellow-500" : index === 1 ? "text-orange-400" : index === 2 ? "text-blue-400" : "text-gray-400"
                          }`}
                        ></i>
                        <span className="text-xs">{[30, 29, 27, 28, 31][index]}°C</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            <div className="mt-2 pt-2 border-t border-amber-100">
              <a href="https://readdy.ai/home/bce7eed3-730a-4196-a894-cbe004d4e9a7/8619eeab-c6c1-4d75-ba59-76d30ad7a904" data-readdy="true" className="block">
                <Button variant="outline" className="w-full justify-center bg-white hover:bg-amber-50 hover:text-amber-700 !rounded-button whitespace-nowrap border-amber-200 text-xs h-8">
                  <i className="fas fa-cloud-sun-rain mr-1.5"></i>
                  Xem dự báo chi tiết
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-900 text-sm">Phân tích nông trại</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-amber-600 hover:text-amber-700 hover:bg-amber-50 !rounded-button">
                  <i className="fas fa-question-circle text-xs"></i>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Biểu đồ so sánh năng suất và lượng mưa theo tháng</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Card className="border-amber-200">
          <CardContent className="p-2">
            <div ref={chartRef} className="h-44 w-full"></div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button variant="outline" className="bg-white border-amber-200 hover:bg-amber-50 hover:text-amber-700 !rounded-button whitespace-nowrap text-xs h-8">
                <i className="fas fa-download mr-1"></i> Xuất dữ liệu
              </Button>
              <a href="https://readdy.ai/home/bce7eed3-730a-4196-a894-cbe004d4e9a7/3d87b4ce-b166-405e-b0f0-723dee8936ae" data-readdy="true" className="block">
                <Button variant="default" className="w-full bg-amber-600 hover:bg-amber-700 !rounded-button whitespace-nowrap text-xs h-8">
                  <i className="fas fa-chart-line mr-1.5"></i>
                  Phân tích chi tiết
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-900 text-sm">Cảnh báo thời tiết</h3>
        </div>
        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100">
          <CardContent className="p-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center">
                <i className="fas fa-exclamation-triangle text-amber-600 text-xs"></i>
              </div>
              <div>
                <h4 className="font-medium text-amber-800 text-xs">Mưa lớn sắp đến</h4>
                <p className="text-xs text-amber-700">Dự kiến trong 3 ngày tới</p>
              </div>
            </div>
            <p className="text-xs text-amber-700 mb-2">Khuyến nghị thu hoạch rau muống và chuẩn bị phương án thoát nước cho ruộng lúa.</p>
            <Button variant="outline" className="w-full justify-center bg-white hover:bg-amber-50 hover:text-amber-700 !rounded-button whitespace-nowrap border-amber-200 text-xs h-8">
              <i className="fas fa-bell mr-1.5"></i>
              Đặt nhắc nhở
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
