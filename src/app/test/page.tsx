"use client"
import React, { useState, useEffect, useRef } from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import * as echarts from "echarts"

import "swiper/css/pagination"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Message {
  id: number
  text: string
  sender: "user" | "ai"
  timestamp: Date
}
interface WeatherData {
  temp: number
  condition: string
  icon: string
}
interface CropData {
  name: string
  progress: number
  nextAction: string
  daysRemaining: number
}
const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Xin chào Anh Tuấn! Tôi là Đom Đóm AI, trợ lý cá nhân của anh. Hôm nay tôi có thể giúp gì cho anh về vụ lúa mùa thu?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [weather, setWeather] = useState<WeatherData>({
    temp: 28,
    condition: "Nắng nhẹ",
    icon: "sun",
  })
  const [intimacyLevel, setIntimacyLevel] = useState(67)
  const [activeMood, setActiveMood] = useState("friendly")
  const [isTyping, setIsTyping] = useState(false)
  const [cropDetailOpen, setCropDetailOpen] = useState(false)
  const [selectedCrop, setSelectedCrop] = useState<CropData | null>(null)
  const [selectedPlot, setSelectedPlot] = useState<LandPlot | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<HTMLDivElement>(null)
  const cropDataRef = useRef<HTMLDivElement>(null)
  interface LandPlot {
    id: string
    name: string
    area: string
    location: string
    crops: CropData[]
  }

  const landPlots: LandPlot[] = [
    {
      id: "plot1",
      name: "Thửa ruộng Đông",
      area: "1.5 ha",
      location: "Đông Tháp - Khu A",
      crops: [{ name: "Lúa mùa thu", progress: 65, nextAction: "Phun thuốc trừ sâu", daysRemaining: 3 }],
    },
    {
      id: "plot2",
      name: "Thửa vườn Tây",
      area: "0.3 ha",
      location: "Đông Tháp - Khu B",
      crops: [{ name: "Rau muống", progress: 85, nextAction: "Thu hoạch", daysRemaining: 1 }],
    },
    {
      id: "plot3",
      name: "Thửa đất Nam",
      area: "0.5 ha",
      location: "Đông Tháp - Khu C",
      crops: [{ name: "Cà chua", progress: 40, nextAction: "Tưới nước", daysRemaining: 0 }],
    },
  ]

  // Tạo danh sách cây trồng từ tất cả các thửa đất
  const crops: CropData[] = landPlots.flatMap((plot) => plot.crops)
  const recentTopics = ["Phòng trừ sâu bệnh", "Dự báo thời tiết", "Kỹ thuật canh tác lúa", "Giá nông sản"]
  const suggestedQuestions = ["Làm thế nào để tăng năng suất lúa?", "Khi nào nên thu hoạch rau muống?", "Dự báo thời tiết tuần tới?", "Cách phòng trừ sâu đục thân?"]
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])
  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current)
      const option = {
        animation: false,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: ["Năng suất", "Lượng mưa"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
        },
        yAxis: [
          {
            type: "value",
            name: "Năng suất (tấn/ha)",
            min: 0,
            max: 10,
            position: "left",
          },
          {
            type: "value",
            name: "Lượng mưa (mm)",
            min: 0,
            max: 300,
            position: "right",
          },
        ],
        series: [
          {
            name: "Năng suất",
            type: "bar",
            data: [4.2, 4.5, 5.0, 5.2, 5.5, 6.0, 6.2, 6.5, 6.8, 7.0, 7.2, 7.5],
          },
          {
            name: "Lượng mưa",
            type: "line",
            yAxisIndex: 1,
            data: [20, 40, 60, 80, 120, 180, 220, 240, 200, 160, 80, 40],
          },
        ],
      }
      chart.setOption(option)
      const handleResize = () => {
        chart.resize()
      }
      window.addEventListener("resize", handleResize)
      return () => {
        chart.dispose()
        window.removeEventListener("resize", handleResize)
      }
    }
  }, [])
  useEffect(() => {
    if (cropDataRef.current) {
      const chart = echarts.init(cropDataRef.current)

      // Tính toán phân bổ diện tích theo thửa đất
      const plotAreas = landPlots.map((plot) => {
        const areaValue = parseFloat(plot.area.split(" ")[0])
        return {
          value: areaValue,
          name: plot.name,
          cropType: plot.crops[0]?.name || "Chưa trồng",
        }
      })

      const option = {
        animation: false,
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ha ({d}%)<br/>Cây trồng: {c2}",
        },
        legend: {
          top: "5%",
          left: "center",
          textStyle: {
            fontSize: 10,
          },
        },
        series: [
          {
            name: "Phân bổ thửa đất",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 12,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: plotAreas.map((item) => ({
              value: item.value,
              name: `${item.name} (${item.cropType})`,
              c2: item.cropType,
            })),
          },
        ],
      }
      chart.setOption(option)
      const handleResize = () => {
        chart.resize()
      }
      window.addEventListener("resize", handleResize)
      return () => {
        chart.dispose()
        window.removeEventListener("resize", handleResize)
      }
    }
  }, [landPlots])
  const handleSendMessage = () => {
    if (inputValue.trim() === "") return
    const newUserMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages([...messages, newUserMessage])
    setInputValue("")
    setIsTyping(true)
    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "Để tăng năng suất lúa, anh nên chú ý đến việc chọn giống phù hợp với điều kiện thổ nhưỡng và thời tiết khu vực của anh. Giống lúa ST25 hoặc OM5451 có thể phù hợp với vùng của anh.",
        "Dựa vào dữ liệu thời tiết và lịch canh tác của anh, tôi khuyên anh nên phun thuốc trừ sâu cho lúa trong 3 ngày tới trước khi có mưa lớn vào cuối tuần.",
        "Theo dõi của tôi về ruộng rau muống của anh, đã đến lúc thu hoạch rồi đấy! Nên thu vào buổi sáng sớm để đảm bảo độ tươi ngon nhất.",
        "Tôi thấy anh đang gặp vấn đề với sâu đục thân trên cây lúa. Tôi đề xuất sử dụng thuốc sinh học Bacillus thuringiensis với liều lượng 1kg/ha, phun vào buổi chiều mát.",
      ]
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
      const newAiMessage: Message = {
        id: messages.length + 2,
        text: randomResponse,
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prevMessages) => [...prevMessages, newAiMessage])
      setIsTyping(false)
      setIntimacyLevel((prev) => Math.min(prev + 2, 100))
    }, 1500)
  }
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }
  const toggleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      // Simulate voice recording
      setTimeout(() => {
        setInputValue("Làm thế nào để phòng trừ sâu đục thân trên cây lúa?")
        setIsRecording(false)
      }, 3000)
    } else {
      setInputValue("")
    }
  }
  const formatTime = (date: Date) => {
    return format(date, "HH:mm", { locale: vi })
  }
  const formatDate = () => {
    return format(new Date(), "EEEE, dd/MM/yyyy", { locale: vi })
  }
  return (
    <div className="flex h-screen bg-amber-50/30 overflow-hidden">
      {/* Sidebar */}
      <div className="w-16 md:w-20 bg-amber-700 flex flex-col items-center py-4 flex-shrink-0 bg-gradient-to-b from-amber-600 to-amber-800 relative overflow-hidden">
        {/* Vietnamese pattern background */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3Cg fill='%23ffffff' fill-opacity='0.4' transform='rotate(45 30 30)'%3E%3Cpath d='M30 30h2v2h-2v-2zm-10-10h2v2h-2v-2zm20 0h2v2h-2v-2zm-10 20h2v2h-2v-2z'/%3E%3C/g%3E%3Cg fill='%23ffffff' fill-opacity='0.4' transform='rotate(90 30 30)'%3E%3Cpath d='M10 10h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 10h4v4h-4v-4zm-30 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 10h4v4h-4v-4zm-30 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 10h4v4h-4v-4zm-30 0h4v4h-4v-4zm10 0h4v4h-4v-4zm10 0h4v4h-4v-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>
        <div className="relative z-10">
          <Avatar className="h-10 w-10 md:h-12 md:w-12 border-2 border-amber-300 mb-4 shadow-lg">
            <AvatarImage src="https://public.readdy.ai/ai/img_res/c43c8385367a8bd2e59e93e8130e16f0.jpg" alt="Đom Đóm AI Logo" />
            <AvatarFallback className="bg-amber-700">ĐĐ</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col items-center gap-3 md:gap-4 mt-4 relative z-10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-amber-100 hover:bg-amber-600/50 !rounded-button w-10 h-10 flex items-center justify-center">
                  <i className="fas fa-comment-dots text-lg"></i>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Trò chuyện</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-amber-100/70 hover:bg-amber-600/50 hover:text-amber-100 !rounded-button w-10 h-10 flex items-center justify-center">
                  <i className="fas fa-seedling text-lg"></i>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Quản lý cây trồng</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-amber-100/70 hover:bg-amber-600/50 hover:text-amber-100 !rounded-button w-10 h-10 flex items-center justify-center">
                  <i className="fas fa-chart-line text-lg"></i>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Phân tích</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-amber-100/70 hover:bg-amber-600/50 hover:text-amber-100 !rounded-button w-10 h-10 flex items-center justify-center">
                  <i className="fas fa-cloud-sun text-lg"></i>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Thời tiết</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-amber-100/70 hover:bg-amber-600/50 hover:text-amber-100 !rounded-button w-10 h-10 flex items-center justify-center">
                  <i className="fas fa-book text-lg"></i>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Kiến thức nông nghiệp</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="mt-auto relative z-10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-amber-100/70 hover:bg-amber-600/50 hover:text-amber-100 !rounded-button w-10 h-10 flex items-center justify-center">
                  <i className="fas fa-cog text-lg"></i>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Cài đặt</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-8 w-8 md:h-10 md:w-10 mt-4 cursor-pointer border-2 border-transparent hover:border-amber-300 shadow-md">
                  <AvatarImage
                    src="https://readdy.ai/api/search-image?query=Portrait of a Vietnamese farmer in his 40s, wearing a traditional conical hat, with a weathered face showing experience and wisdom, standing in a lush green rice field during golden hour, with mountains in the background&width=100&height=100&seq=2&orientation=squarish"
                    alt="Anh Tuấn"
                  />
                  <AvatarFallback className="bg-amber-100 text-amber-700">AT</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Hồ sơ của tôi</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="flex flex-1">
        {/* Chat List Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg text-amber-800">Trò chuyện</h2>
                <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
                  {messages.length} tin nhắn
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="!rounded-button h-8 w-8 text-amber-600 hover:bg-amber-100">
                        <i className="fas fa-filter text-sm"></i>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p className="text-xs">Lọc cuộc trò chuyện</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="!rounded-button h-8 w-8 text-amber-600 hover:bg-amber-100">
                        <i className="fas fa-plus text-sm"></i>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p className="text-xs">Tạo cuộc trò chuyện mới</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="relative mb-3">
              <Input placeholder="Tìm kiếm cuộc trò chuyện..." className="pl-9 bg-white border border-amber-200 focus:border-amber-400 focus:ring-amber-400 text-sm" />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400"></i>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Button variant="outline" size="sm" className="h-7 bg-white border-amber-200 hover:bg-amber-50 text-amber-700 !rounded-button whitespace-nowrap">
                <i className="fas fa-clock mr-1.5 text-amber-500"></i>
                Gần đây
              </Button>
              <Button variant="outline" size="sm" className="h-7 bg-white border-amber-200 hover:bg-amber-50 text-amber-700 !rounded-button whitespace-nowrap">
                <i className="fas fa-star mr-1.5 text-amber-500"></i>
                Đánh dấu
              </Button>
              <Button variant="outline" size="sm" className="h-7 bg-white border-amber-200 hover:bg-amber-50 text-amber-700 !rounded-button whitespace-nowrap">
                <i className="fas fa-seedling mr-1.5 text-amber-500"></i>
                Cây trồng
              </Button>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2">
              <div className="bg-amber-50 rounded-lg p-3 mb-2 cursor-pointer border-l-4 border-amber-600">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-amber-800">Đom Đóm AI</h3>
                  <span className="text-xs text-amber-600">{format(new Date(), "HH:mm")}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">Xin chào Anh Tuấn! Tôi là Đom Đóm AI, trợ lý cá nhân của anh. Hôm nay tôi có thể giúp gì cho anh về vụ lúa mùa thu?</p>
              </div>
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="hover:bg-gray-50 rounded-lg p-3 mb-2 cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium">Trợ lý thời tiết</h3>
                    <span className="text-xs text-gray-500">{format(new Date(new Date().setDate(new Date().getDate() - item)), "dd/MM")}</span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">Dự báo thời tiết tuần tới cho khu vực Đồng Tháp của anh...</p>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-amber-100 rounded-full px-3 py-1.5 text-sm text-amber-700 w-full">
                <i className={`fas fa-${weather.icon}`}></i>
                <span>{weather.temp}°C</span>
                <span className="hidden sm:inline">| {weather.condition}</span>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="!rounded-button border-amber-200 hover:bg-amber-50">
                      <i className="fas fa-bell text-amber-600"></i>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Thông báo</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col bg-white bg-[url('https://public.readdy.ai/ai/img_res/d0c4f65405da6599ac836fe88274f6f8.jpg')]">
            <div className="border-b border-gray-200 p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10 bg-gradient-to-r from-amber-500 to-yellow-400">
                    <AvatarImage
                      src="https://readdy.ai/api/search-image?query=A traditional Vietnamese firefly AI assistant with a warm glowing light, incorporating rice paddy elements and traditional Vietnamese patterns, with a friendly appearance, suitable for a farming application for Vietnamese farmers&width=100&height=100&seq=3&orientation=squarish"
                      alt="Đom Đóm AI"
                    />
                    <AvatarFallback>
                      <i className="fas fa-bug"></i>
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-bold font-serif">Đom Đóm AI</h2>
                    <p className="text-xs text-amber-600">
                      <i className="fas fa-circle text-xs mr-1"></i>
                      Đang hoạt động
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="!rounded-button">
                          <i className="fas fa-sync-alt"></i>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Làm mới cuộc trò chuyện</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="!rounded-button">
                          <i className="fas fa-ellipsis-v"></i>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Tùy chọn khác</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
            <ScrollArea className="flex-1 p-4 bg-gray-50">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center my-4">
                  <Badge variant="outline" className="bg-gray-100 text-gray-500">
                    {format(new Date(), "EEEE, dd/MM/yyyy", { locale: vi })}
                  </Badge>
                </div>
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`flex gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                      {message.sender === "ai" && (
                        <Avatar className="h-8 w-8 mt-1 bg-gradient-to-r from-amber-500 to-yellow-400">
                          <AvatarImage
                            src="https://readdy.ai/api/search-image?query=A traditional Vietnamese firefly AI assistant with a warm glowing light, incorporating rice paddy elements and traditional Vietnamese patterns, with a friendly appearance, suitable for a farming application for Vietnamese farmers&width=100&height=100&seq=3&orientation=squarish"
                            alt="Đom Đóm AI"
                          />
                          <AvatarFallback>
                            <i className="fas fa-bug"></i>
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`rounded-2xl p-3 shadow-sm ${message.sender === "user" ? "bg-amber-600 text-white" : "bg-white text-gray-800 border border-amber-200"}`}>
                        <p>{message.text}</p>
                        <div className={`text-xs mt-1 ${message.sender === "user" ? "text-amber-100" : "text-gray-500"}`}>{formatTime(message.timestamp)}</div>
                      </div>
                      {message.sender === "user" && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarImage
                            src="https://readdy.ai/api/search-image?query=Portrait of a Vietnamese farmer in his 40s, wearing a traditional conical hat, with a weathered face showing experience and wisdom, standing in a lush green rice field during golden hour, with mountains in the background&width=100&height=100&seq=2&orientation=squarish"
                            alt="Anh Tuấn"
                          />
                          <AvatarFallback className="bg-green-100 text-green-700">AT</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex gap-2 max-w-[80%]">
                      <Avatar className="h-8 w-8 mt-1 bg-gradient-to-r from-amber-500 to-yellow-400">
                        <AvatarImage
                          src="https://readdy.ai/api/search-image?query=A traditional Vietnamese firefly AI assistant with a warm glowing light, incorporating rice paddy elements and traditional Vietnamese patterns, with a friendly appearance, suitable for a farming application for Vietnamese farmers&width=100&height=100&seq=3&orientation=squarish"
                          alt="Đom Đóm AI"
                        />
                        <AvatarFallback>
                          <i className="fas fa-bug"></i>
                        </AvatarFallback>
                      </Avatar>
                      <div className="rounded-2xl p-3 bg-white shadow-sm">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="max-w-4xl mx-auto space-y-3">
                <div className="flex gap-2 flex-wrap">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="bg-white text-gray-700 border-amber-200 hover:bg-amber-50 hover:text-amber-700 !rounded-button whitespace-nowrap"
                      onClick={() => setInputValue(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
                <div className="relative">
                  <div className="rounded-xl border border-amber-200 bg-white shadow-sm overflow-hidden transition-all">
                    <div className="p-3">
                      <div className="relative">
                        <textarea
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault()
                              handleSendMessage()
                            }
                          }}
                          placeholder="Nhập câu hỏi của bạn hoặc nhấn Shift+Enter để xuống dòng..."
                          className="w-full border-none focus:ring-0 resize-none min-h-[60px] max-h-[200px] text-sm bg-transparent outline-none"
                          style={{ overflow: "auto" }}
                        />
                        {inputValue && (
                          <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-8 w-8 !rounded-button cursor-pointer" onClick={() => setInputValue("")}>
                            <i className="fas fa-times text-gray-400 text-xs"></i>
                          </Button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 !rounded-button text-amber-600 hover:bg-amber-50">
                                <i className="fas fa-image text-sm"></i>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="text-xs">Gửi hình ảnh</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 !rounded-button text-amber-600 hover:bg-amber-50">
                                <i className="fas fa-paperclip text-sm"></i>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="text-xs">Đính kèm tệp</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className={`h-8 w-8 !rounded-button ${isRecording ? "bg-red-100 text-red-600" : "text-amber-600 hover:bg-amber-50"}`}
                                onClick={toggleRecording}
                              >
                                <i className={`fas fa-microphone${isRecording ? "-slash" : ""} text-sm`}></i>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="text-xs">{isRecording ? "Dừng ghi âm" : "Ghi âm giọng nói"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 !rounded-button text-amber-600 hover:bg-amber-50">
                                <i className="fas fa-camera text-sm"></i>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="text-xs">Chụp ảnh</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 !rounded-button text-amber-600 hover:bg-amber-50">
                                <i className="fas fa-map-marker-alt text-sm"></i>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="text-xs">Chia sẻ vị trí</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <div className="ml-auto flex items-center gap-2">
                          {isRecording && (
                            <div className="flex items-center gap-1 bg-red-50 text-red-600 px-2 py-1 rounded-full text-xs">
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                              <span>Đang ghi âm...</span>
                            </div>
                          )}
                          <Button className="!rounded-button whitespace-nowrap bg-amber-600 hover:bg-amber-700 h-8 px-4" onClick={handleSendMessage} disabled={!inputValue.trim() && !isRecording}>
                            <i className="fas fa-paper-plane mr-2 text-sm"></i>
                            Gửi
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="bg-amber-50/70 px-3 py-2 border-t border-amber-100 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-amber-700">
                        <i className="fas fa-lightbulb"></i>
                        <span>
                          Nhấn <kbd className="px-1.5 py-0.5 bg-white border border-amber-200 rounded text-xs mx-1">Enter</kbd> để gửi,{" "}
                          <kbd className="px-1.5 py-0.5 bg-white border border-amber-200 rounded text-xs mx-1">Shift+Enter</kbd> để xuống dòng
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 !rounded-button text-amber-600 hover:bg-amber-100">
                                <i className="fas fa-cog text-xs"></i>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="text-xs">Cài đặt trò chuyện</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 !rounded-button text-amber-600 hover:bg-amber-100">
                                <i className="fas fa-keyboard text-xs"></i>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="text-xs">Phím tắt</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                  {isRecording && (
                    <div className="absolute inset-0 bg-black/5 rounded-xl flex items-center justify-center pointer-events-none">
                      <div className="bg-white p-3 rounded-full shadow-lg animate-pulse">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                          <i className="fas fa-microphone text-red-600"></i>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right Sidebar - Info Panel */}
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
            <ScrollArea className="flex-1">
              <TabsContent value="info" className="p-3 mt-0">
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
                              onClick={() => setInputValue(`Tôi muốn biết thêm về ${topic.toLowerCase()}`)}
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
              </TabsContent>
              <TabsContent value="crops" className="p-3 mt-0">
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 text-sm">Thửa đất và cây trồng</h3>
                      <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 h-7 !rounded-button whitespace-nowrap text-xs px-2">
                        <i className="fas fa-plus mr-1"></i> Thêm thửa đất
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {landPlots.map((plot, plotIndex) => (
                        <Card key={plotIndex} className="overflow-hidden border-amber-200">
                          <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-2 flex justify-between items-center">
                            <h4 className="font-medium text-white flex items-center text-xs">
                              <i className="fas fa-map-marker-alt mr-1.5"></i>
                              {plot.name} ({plot.area})
                            </h4>
                            <Badge variant="outline" className="bg-white/20 text-white border-white/30 whitespace-nowrap text-xs px-2 py-0.5">
                              {plot.location}
                            </Badge>
                          </div>
                          <CardContent className="p-2">
                            {plot.crops.map((crop, cropIndex) => (
                              <div key={cropIndex} className="border border-amber-100 rounded-lg p-2 mb-2 last:mb-0">
                                <div className="flex justify-between items-center mb-2">
                                  <div className="flex items-center gap-1.5">
                                    <i className={`fas fa-${plotIndex === 0 ? "seedling" : plotIndex === 1 ? "leaf" : "apple-alt"} text-amber-600`}></i>
                                    <span className="text-xs font-medium">{crop.name}</span>
                                  </div>
                                  <Badge
                                    variant={crop.daysRemaining === 0 ? "destructive" : "outline"}
                                    className={`whitespace-nowrap text-xs px-2 py-0.5 ${crop.daysRemaining === 0 ? "bg-red-500 hover:bg-red-600" : "bg-amber-100 text-amber-700 border-amber-200"}`}
                                  >
                                    {crop.daysRemaining === 0 ? "Hôm nay" : `${crop.daysRemaining} ngày nữa`}
                                  </Badge>
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
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-amber-600 hover:text-amber-700 hover:bg-amber-50 !rounded-button">
                            <i className="fas fa-question-circle text-xs"></i>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-amber-800 flex items-center gap-2">
                              <i className="fas fa-chart-pie text-amber-600"></i>
                              Biểu đồ phân bổ thửa đất
                            </DialogTitle>
                            <DialogDescription>Thông tin chi tiết về cách đọc và sử dụng biểu đồ</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm text-amber-700">Ý nghĩa của biểu đồ</h4>
                              <p className="text-sm text-gray-600">
                                Biểu đồ tròn thể hiện tỷ lệ phân bổ diện tích theo từng thửa đất và loại cây trồng tương ứng, giúp bạn có cái nhìn tổng quan về cơ cấu nông trại.
                              </p>
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm text-amber-700">Cách đọc dữ liệu</h4>
                              <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                                <li>Mỗi phần trong biểu đồ tròn tương ứng với một thửa đất</li>
                                <li>Phần trăm thể hiện tỷ lệ diện tích của thửa đất đó trên tổng diện tích canh tác</li>
                                <li>Màu sắc khác nhau giúp phân biệt các thửa đất</li>
                                <li>Tên thửa đất kèm theo loại cây trồng hiện tại trên thửa đất đó</li>
                              </ul>
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm text-amber-700">Gợi ý tối ưu hóa</h4>
                              <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                                <li>Nên đa dạng hóa cây trồng trên các thửa đất để giảm thiểu rủi ro về thời tiết và sâu bệnh</li>
                                <li>Phân bổ thửa đất lớn cho cây trồng chính và thửa đất nhỏ hơn cho các cây trồng phụ</li>
                                <li>Cân nhắc luân canh giữa các thửa đất để cải thiện độ phì nhiêu</li>
                                <li>Ưu tiên các loại cây có giá trị kinh tế cao và phù hợp với điều kiện thổ nhưỡng của từng thửa đất</li>
                              </ul>
                            </div>
                          </div>
                          <DialogFooter className="mt-4">
                            <Button className="bg-amber-600 hover:bg-amber-700 !rounded-button whitespace-nowrap" onClick={() => setDialogOpen(false)}>
                              <i className="fas fa-check mr-1.5"></i> Đã hiểu
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <Card className="border-amber-200">
                      <CardContent className="p-2">
                        <div ref={cropDataRef} className="h-44 w-full"></div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <Button variant="outline" className="bg-white border-amber-200 hover:bg-amber-50 hover:text-amber-700 !rounded-button whitespace-nowrap text-xs h-8">
                            <i className="fas fa-download mr-1"></i> Xuất báo cáo
                          </Button>
                          <Button variant="outline" className="bg-white border-amber-200 hover:bg-amber-50 hover:text-amber-700 !rounded-button whitespace-nowrap text-xs h-8">
                            <i className="fas fa-map-marked-alt mr-1"></i> Xem bản đồ thửa đất
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="weather" className="p-3 mt-0">
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
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </div>
      {/* Crop Detail Modal */}
      {selectedCrop && (
        <Dialog open={cropDetailOpen} onOpenChange={setCropDetailOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-amber-800">
                <i className={`fas fa-${selectedCrop.name === "Lúa mùa thu" ? "seedling" : selectedCrop.name === "Rau muống" ? "leaf" : "apple-alt"} text-amber-600`}></i>
                {selectedCrop.name} - Chi tiết cây trồng
              </DialogTitle>
              <DialogDescription className="text-amber-600">
                {landPlots.find((plot) => plot.crops.some((crop) => crop.name === selectedCrop.name))?.name || ""} -{" "}
                {landPlots.find((plot) => plot.crops.some((crop) => crop.name === selectedCrop.name))?.location || ""}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <div className="rounded-lg overflow-hidden border border-amber-200 mb-4">
                  <div className="bg-amber-50 p-3 border-b border-amber-200">
                    <h3 className="font-medium text-amber-800">Thông tin tổng quan</h3>
                  </div>
                  <div className="p-3 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Giống:</span>
                      <span className="text-sm font-medium">{selectedCrop.name === "Lúa mùa thu" ? "ST25" : selectedCrop.name === "Rau muống" ? "Rau muống nước" : "Cà chua F1"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Ngày gieo trồng:</span>
                      <span className="text-sm font-medium">
                        {format(new Date(new Date().setDate(new Date().getDate() - (selectedCrop.name === "Lúa mùa thu" ? 60 : selectedCrop.name === "Rau muống" ? 25 : 45))), "dd/MM/yyyy")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Dự kiến thu hoạch:</span>
                      <span className="text-sm font-medium">
                        {format(new Date(new Date().setDate(new Date().getDate() + (selectedCrop.name === "Lúa mùa thu" ? 30 : selectedCrop.name === "Rau muống" ? 5 : 60))), "dd/MM/yyyy")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Diện tích thửa đất:</span>
                      <span className="text-sm font-medium">{landPlots.find((plot) => plot.crops.some((crop) => crop.name === selectedCrop.name))?.area || "Không xác định"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Giai đoạn hiện tại:</span>
                      <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
                        {selectedCrop.name === "Lúa mùa thu" ? "Làm đòng" : selectedCrop.name === "Rau muống" ? "Thu hoạch" : "Ra hoa"}
                      </Badge>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Tiến độ phát triển:</span>
                        <span className="text-sm font-medium">{selectedCrop.progress}%</span>
                      </div>
                      <Progress value={selectedCrop.progress} className="h-2 bg-amber-100" />
                    </div>
                  </div>
                </div>
                <div className="rounded-lg overflow-hidden border border-amber-200">
                  <div className="bg-amber-50 p-3 border-b border-amber-200">
                    <h3 className="font-medium text-amber-800">Lịch trình chăm sóc</h3>
                  </div>
                  <div className="p-3">
                    <div className="space-y-3">
                      <div className={`p-2 rounded-lg border ${selectedCrop.daysRemaining === 0 ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedCrop.daysRemaining === 0 ? "bg-red-100" : "bg-amber-100"}`}>
                              <i
                                className={`fas fa-${selectedCrop.nextAction.includes("Phun") ? "spray-can" : selectedCrop.nextAction.includes("Tưới") ? "tint" : "scissors"} ${
                                  selectedCrop.daysRemaining === 0 ? "text-red-500" : "text-amber-500"
                                }`}
                              ></i>
                            </div>
                            <div>
                              <p className={`font-medium ${selectedCrop.daysRemaining === 0 ? "text-red-800" : "text-amber-800"}`}>{selectedCrop.nextAction}</p>
                              <p className={`text-xs ${selectedCrop.daysRemaining === 0 ? "text-red-600" : "text-amber-600"}`}>
                                {selectedCrop.daysRemaining === 0 ? "Hôm nay" : `${selectedCrop.daysRemaining} ngày nữa`}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`h-7 !rounded-button whitespace-nowrap text-xs ${
                              selectedCrop.daysRemaining === 0 ? "border-red-200 bg-white hover:bg-red-50 text-red-700" : "border-amber-200 bg-white hover:bg-amber-50 text-amber-700"
                            }`}
                          >
                            <i className="fas fa-bell mr-1"></i> Nhắc nhở
                          </Button>
                        </div>
                      </div>
                      <div className="p-2 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <i className="fas fa-seedling text-gray-500"></i>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">Bón phân</p>
                              <p className="text-xs text-gray-600">7 ngày nữa</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="h-7 border-gray-200 bg-white hover:bg-gray-50 text-gray-700 !rounded-button whitespace-nowrap text-xs">
                            <i className="fas fa-bell mr-1"></i> Nhắc nhở
                          </Button>
                        </div>
                      </div>
                      <div className="p-2 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <i className="fas fa-clipboard-check text-gray-500"></i>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">Kiểm tra sâu bệnh</p>
                              <p className="text-xs text-gray-600">10 ngày nữa</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="h-7 border-gray-200 bg-white hover:bg-gray-50 text-gray-700 !rounded-button whitespace-nowrap text-xs">
                            <i className="fas fa-bell mr-1"></i> Nhắc nhở
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="rounded-lg overflow-hidden border border-amber-200 mb-4">
                  <div className="bg-amber-50 p-3 border-b border-amber-200 flex justify-between items-center">
                    <h3 className="font-medium text-amber-800">Hình ảnh theo dõi</h3>
                    <Button variant="ghost" size="sm" className="h-7 text-amber-600 hover:bg-amber-100 !rounded-button whitespace-nowrap text-xs">
                      <i className="fas fa-camera mr-1"></i> Thêm ảnh
                    </Button>
                  </div>
                  <div className="p-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg overflow-hidden border border-amber-100">
                        <img
                          src={`https://readdy.ai/api/search-image?query=Close-up of ${
                            selectedCrop.name === "Lúa mùa thu"
                              ? "rice paddy field in Vietnam with golden rice stalks"
                              : selectedCrop.name === "Rau muống"
                              ? "water spinach growing in Vietnamese farm"
                              : "tomato plants with small green tomatoes growing"
                          } with rich details, natural lighting, showing healthy growth stage, agricultural monitoring photo&width=300&height=200&seq=10&orientation=landscape`}
                          alt={`${selectedCrop.name} - Tuần trước`}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-1.5 bg-amber-50 text-xs">
                          <p className="font-medium text-amber-800">Tuần trước</p>
                          <p className="text-amber-600">{format(new Date(new Date().setDate(new Date().getDate() - 7)), "dd/MM/yyyy")}</p>
                        </div>
                      </div>
                      <div className="rounded-lg overflow-hidden border border-amber-100">
                        <img
                          src={`https://readdy.ai/api/search-image?query=Close-up of ${
                            selectedCrop.name === "Lúa mùa thu"
                              ? "rice paddy field in Vietnam with golden rice stalks"
                              : selectedCrop.name === "Rau muống"
                              ? "water spinach growing in Vietnamese farm"
                              : "tomato plants with small green tomatoes growing"
                          } with rich details, natural lighting, showing current growth stage, agricultural monitoring photo&width=300&height=200&seq=11&orientation=landscape`}
                          alt={`${selectedCrop.name} - Hiện tại`}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-1.5 bg-amber-50 text-xs">
                          <p className="font-medium text-amber-800">Hiện tại</p>
                          <p className="text-amber-600">{format(new Date(), "dd/MM/yyyy")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg overflow-hidden border border-amber-200 mb-4">
                  <div className="bg-amber-50 p-3 border-b border-amber-200">
                    <h3 className="font-medium text-amber-800">Dự báo năng suất</h3>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <i className="fas fa-chart-line text-green-600"></i>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Dự kiến năng suất</p>
                          <p className="text-xs text-gray-600">Dựa trên dữ liệu hiện tại</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{selectedCrop.name === "Lúa mùa thu" ? "7.2 tấn/ha" : selectedCrop.name === "Rau muống" ? "15 tấn/ha" : "25 tấn/ha"}</p>
                        <p className="text-xs text-green-500">
                          <i className="fas fa-arrow-up mr-1"></i>
                          {selectedCrop.name === "Lúa mùa thu" ? "5%" : selectedCrop.name === "Rau muống" ? "8%" : "12%"} so với vụ trước
                        </p>
                      </div>
                    </div>
                    <div className="p-2 rounded-lg border border-amber-100 bg-amber-50 mb-3">
                      <p className="text-sm text-amber-800">
                        <i className="fas fa-lightbulb mr-1 text-amber-600"></i>
                        {selectedCrop.name === "Lúa mùa thu"
                          ? "Phun thuốc trừ sâu đúng thời điểm sẽ giúp tăng năng suất thêm 3-5%."
                          : selectedCrop.name === "Rau muống"
                          ? "Thu hoạch vào buổi sáng sớm để đảm bảo độ tươi ngon và giá trị dinh dưỡng cao nhất."
                          : "Tưới nước đều đặn vào buổi sáng sớm hoặc chiều muộn để tránh sốc nhiệt cho cây."}
                      </p>
                    </div>
                    <Button variant="outline" className="w-full justify-center bg-white hover:bg-amber-50 hover:text-amber-700 !rounded-button whitespace-nowrap border-amber-200 text-xs h-8">
                      <i className="fas fa-chart-bar mr-1.5"></i>
                      Xem phân tích chi tiết
                    </Button>
                  </div>
                </div>
                <div className="rounded-lg overflow-hidden border border-amber-200">
                  <div className="bg-amber-50 p-3 border-b border-amber-200">
                    <h3 className="font-medium text-amber-800">Khuyến nghị</h3>
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="flex gap-2 items-start">
                      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i className="fas fa-check text-amber-600 text-xs"></i>
                      </div>
                      <p className="text-sm text-gray-700">
                        {selectedCrop.name === "Lúa mùa thu"
                          ? "Phun thuốc trừ sâu vào buổi chiều mát để tránh thuốc bay hơi nhanh và tăng hiệu quả."
                          : selectedCrop.name === "Rau muống"
                          ? "Thu hoạch rau muống khi cây cao khoảng 25-30cm để đảm bảo độ giòn và ngọt."
                          : "Tưới nước đều đặn, giữ đất ẩm nhưng không quá ướt để tránh thối rễ."}
                      </p>
                    </div>
                    <div className="flex gap-2 items-start">
                      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i className="fas fa-check text-amber-600 text-xs"></i>
                      </div>
                      <p className="text-sm text-gray-700">
                        {selectedCrop.name === "Lúa mùa thu"
                          ? "Kiểm tra mực nước ruộng thường xuyên, duy trì ở mức 3-5cm trong giai đoạn làm đòng."
                          : selectedCrop.name === "Rau muống"
                          ? "Sau khi thu hoạch, bón thêm phân để kích thích tái sinh nhanh cho đợt thu hoạch tiếp theo."
                          : "Cần buộc dây cho cây cà chua để tránh quả chạm đất và giảm nguy cơ thối quả."}
                      </p>
                    </div>
                    <div className="flex gap-2 items-start">
                      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i className="fas fa-check text-amber-600 text-xs"></i>
                      </div>
                      <p className="text-sm text-gray-700">
                        {selectedCrop.name === "Lúa mùa thu"
                          ? "Theo dõi dự báo thời tiết, có kế hoạch thoát nước khi có mưa lớn sắp đến."
                          : selectedCrop.name === "Rau muống"
                          ? "Giữ nước sạch và thay nước thường xuyên để tránh rêu và tảo phát triển."
                          : "Tỉa bỏ lá già và lá bệnh để tăng khả năng quang hợp và giảm nguy cơ lây lan bệnh."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button variant="outline" className="bg-white border-amber-200 hover:bg-amber-50 hover:text-amber-700 !rounded-button whitespace-nowrap">
                <i className="fas fa-history mr-1.5"></i> Xem lịch sử
              </Button>
              <Button variant="outline" className="bg-white border-amber-200 hover:bg-amber-50 hover:text-amber-700 !rounded-button whitespace-nowrap">
                <i className="fas fa-edit mr-1.5"></i> Cập nhật trạng thái
              </Button>
              <Button variant="outline" className="bg-white border-amber-200 hover:bg-amber-50 hover:text-amber-700 !rounded-button whitespace-nowrap">
                <i className="fas fa-bell mr-1.5"></i> Đặt nhắc nhở
              </Button>
              <Button className="bg-amber-600 hover:bg-amber-700 !rounded-button whitespace-nowrap">
                <i className="fas fa-check mr-1.5"></i> Hoàn thành
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
export default App
