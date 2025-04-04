import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LandPlot, CropData } from "@/types"

interface CropsPanelProps {
  landPlots: LandPlot[]
  setCropDetailOpen: (open: boolean) => void
  setSelectedCrop: (crop: CropData) => void
  setSelectedPlot: (plot: LandPlot) => void
}

export function CropsPanel({ landPlots, setCropDetailOpen, setSelectedCrop, setSelectedPlot }: CropsPanelProps) {
  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-900 text-sm">Thửa đất & cây trồng</h3>
          <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 h-7 !rounded-button whitespace-nowrap text-xs px-2">
            <i className="fas fa-plus mr-1"></i> Thêm thửa đất
          </Button>
        </div>
        <div className="space-y-3">
          {landPlots.map((plot, plotIndex) => (
            <Card key={plotIndex} className="overflow-hidden border-amber-200">
              <div className="bg-amber-50 p-2 border-b border-amber-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-amber-800 text-sm">{plot.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-amber-600">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{plot.location}</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-2">
                {plot.crops.map((crop, cropIndex) => (
                  <div key={cropIndex} className="border border-amber-100 rounded-lg p-2 mb-2 last:mb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                          <i className={`fas fa-${crop.name === "Lúa mùa thu" ? "seedling" : crop.name === "Rau muống" ? "leaf" : "apple-alt"} text-amber-600 text-xs`}></i>
                        </div>
                        <div>
                          <p className="font-medium text-amber-800 text-sm">{crop.name}</p>
                          <p className="text-xs text-amber-600">{plot.area}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium">Tiến độ phát triển</span>
                        <span className="text-xs font-medium">{crop.progress}%</span>
                      </div>
                      <Progress value={crop.progress} className="h-2 bg-amber-100" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-amber-700">
                        <i className="fas fa-calendar-check mr-1"></i>
                        <span>Cần {crop.nextAction.toLowerCase()}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 bg-white border-amber-200 hover:bg-amber-50 hover:text-amber-700 !rounded-button whitespace-nowrap text-xs px-2"
                        onClick={() => {
                          setCropDetailOpen(true)
                          setSelectedCrop(crop)
                          setSelectedPlot(plot)
                        }}
                      >
                        <i className="fas fa-info-circle mr-1"></i> Chi tiết
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-2 bg-white border-amber-200 hover:bg-amber-50 hover:text-amber-700 !rounded-button whitespace-nowrap text-xs h-7">
                  <i className="fas fa-plus mr-1"></i> Thêm cây trồng vào thửa đất này
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-900 text-sm">Phân bổ thửa đất</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 h-7 !rounded-button whitespace-nowrap text-xs px-2">
                <i className="fas fa-expand-alt mr-1"></i> Xem đầy đủ
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Phân bổ thửa đất</DialogTitle>
                <DialogDescription>Tổng quan về phân bổ diện tích canh tác theo thửa đất</DialogDescription>
              </DialogHeader>
              <div className="h-80">
                {/* Placeholder for full land distribution chart */}
                <div className="w-full h-full bg-amber-50 rounded-lg flex items-center justify-center">
                  <p className="text-amber-600">Biểu đồ phân bổ thửa đất</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" className="border-amber-200 hover:bg-amber-50 hover:text-amber-700">
                  Đóng
                </Button>
                <Button className="bg-amber-600 hover:bg-amber-700">
                  <i className="fas fa-download mr-1.5"></i>
                  Xuất dữ liệu
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <Card className="border-amber-200">
          <CardContent className="p-2">
            <div className="h-40 bg-amber-50 rounded-lg flex items-center justify-center mb-2">
              <p className="text-amber-600 text-sm">Biểu đồ phân bổ thửa đất</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-amber-50 p-1.5 rounded-lg border border-amber-100">
                <p className="text-xs text-amber-700">Tổng diện tích</p>
                <p className="font-medium text-amber-800">2.5 ha</p>
              </div>
              <div className="bg-amber-50 p-1.5 rounded-lg border border-amber-100">
                <p className="text-xs text-amber-700">Số thửa đất</p>
                <p className="font-medium text-amber-800">{landPlots.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
