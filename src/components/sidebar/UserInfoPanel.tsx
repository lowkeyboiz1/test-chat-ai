import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { recentTopics } from "@/utils/mockData"

interface UserInfoPanelProps {
  intimacyLevel: number
}

export function UserInfoPanel({ intimacyLevel }: UserInfoPanelProps) {
  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-900 text-sm">Thông tin người dùng</h3>
          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 text-xs px-2 py-0.5">
            <i className="fas fa-check-circle mr-1"></i> Đã xác thực
          </Badge>
        </div>
        <Card className="overflow-hidden border-amber-200">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-14 w-14 border-2 border-white">
                <AvatarImage src="https://public.readdy.ai/ai/img_res/769d4382b388522acdc210cad8b8eb83.jpg" alt="Anh Tuấn" />
                <AvatarFallback className="bg-amber-100 text-amber-700">AT</AvatarFallback>
              </Avatar>
              <div className="text-white">
                <h3 className="font-bold text-base">Anh Tuấn</h3>
                <p className="text-xs text-amber-100">Nông dân 15 năm kinh nghiệm</p>
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant="outline" className="bg-white/20 text-white border-white/30 text-xs px-2 py-0.5">
                    <i className="fas fa-seedling mr-1"></i> Chuyên lúa
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <CardContent className="p-2 bg-white">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="bg-amber-50 p-2 rounded-lg border border-amber-100">
                <p className="text-xs text-gray-500 mb-1">Vùng canh tác</p>
                <div className="flex items-center">
                  <i className="fas fa-map-marker-alt text-amber-600 mr-1 text-xs"></i>
                  <p className="font-medium text-xs">Đồng Tháp</p>
                </div>
              </div>
              <div className="bg-amber-50 p-2 rounded-lg border border-amber-100">
                <p className="text-xs text-gray-500 mb-1">Diện tích</p>
                <div className="flex items-center">
                  <i className="fas fa-ruler-combined text-amber-600 mr-1 text-xs"></i>
                  <p className="font-medium text-xs">2.5 ha</p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium flex items-center">
                  <i className="fas fa-heart text-amber-500 mr-1"></i>
                  Độ thân thiết
                </span>
                <span className="text-xs font-medium">{intimacyLevel}%</span>
              </div>
              <Progress value={intimacyLevel} className="h-2 bg-amber-100" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-900 text-sm">Chủ đề gần đây</h3>
          <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 h-7 !rounded-button whitespace-nowrap text-xs px-2">
            <i className="fas fa-sync-alt mr-1"></i> Làm mới
          </Button>
        </div>
        <Card className="border-amber-200">
          <CardContent className="p-2">
            <div className="space-y-1.5">
              {recentTopics.map((topic, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start bg-white hover:bg-amber-50 hover:text-amber-700 !rounded-button whitespace-nowrap border-amber-200 text-xs h-8 px-2"
                  onClick={() => {}}
                >
                  <i className="fas fa-history mr-1.5 text-amber-400"></i>
                  {topic}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-900 text-sm">Lịch nhắc nhở</h3>
          <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 h-7 !rounded-button whitespace-nowrap text-xs px-2">
            <i className="fas fa-plus mr-1"></i> Thêm mới
          </Button>
        </div>
        <Card className="border-amber-200">
          <CardContent className="p-2 space-y-2">
            <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg border border-red-100">
              <div className="flex items-center">
                <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center mr-2">
                  <i className="fas fa-spray-can text-red-500 text-xs"></i>
                </div>
                <div>
                  <p className="font-medium text-red-800 text-xs">Phun thuốc trừ sâu</p>
                  <p className="text-xs text-red-600">Lúa mùa thu</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 text-xs px-2 py-0.5">
                Hôm nay
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-amber-50 rounded-lg border border-amber-100">
              <div className="flex items-center">
                <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                  <i className="fas fa-tint text-amber-500 text-xs"></i>
                </div>
                <div>
                  <p className="font-medium text-amber-800 text-xs">Tưới nước</p>
                  <p className="text-xs text-amber-600">Cà chua</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 text-xs px-2 py-0.5">
                Ngày mai
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
