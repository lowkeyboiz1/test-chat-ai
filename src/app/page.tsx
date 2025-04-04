"use client"
import { ChatArea } from "@/components/chat/ChatArea"
import { ChatSidebar } from "@/components/sidebar/ChatSidebar"
import { NavigationSidebar } from "@/components/sidebar/NavigationSidebar"
import { RightSidebar } from "@/components/sidebar/RightSidebar"
import { CropData, LandPlot, Message, WeatherData } from "@/types"
import { aiResponses, landPlots } from "@/utils/mockData"
import * as echarts from "echarts"
import React, { useEffect, useRef, useState } from "react"

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
  const [isTyping, setIsTyping] = useState(false)
  const [cropDetailOpen, setCropDetailOpen] = useState(false)
  const [selectedCrop, setSelectedCrop] = useState<CropData | null>(null)
  const [selectedPlot, setSelectedPlot] = useState<LandPlot | null>(null)
  const chartRef = useRef<HTMLDivElement>(null)
  const cropDataRef = useRef<HTMLDivElement>(null)

  // Chart initialization code...
  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current)
      const option = {
        // Chart options...
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

  // Crop data chart initialization...
  useEffect(() => {
    if (cropDataRef.current) {
      // Chart initialization code...
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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <NavigationSidebar />

      <div className="flex flex-1">
        {/* Chat List Sidebar */}
        <ChatSidebar messages={messages} weather={weather} />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <ChatArea
            messages={messages}
            inputValue={inputValue}
            setInputValue={setInputValue}
            isTyping={isTyping}
            isRecording={isRecording}
            handleSendMessage={handleSendMessage}
            toggleRecording={toggleRecording}
          />
        </div>

        {/* Right Sidebar - Info Panel */}
        <RightSidebar
          intimacyLevel={intimacyLevel}
          landPlots={landPlots}
          chartRef={chartRef as any}
          setCropDetailOpen={setCropDetailOpen}
          setSelectedCrop={setSelectedCrop}
          setSelectedPlot={setSelectedPlot}
        />
      </div>
    </div>
  )
}

export default App
