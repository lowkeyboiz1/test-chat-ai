"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const Sidebar: React.FC = () => {
  return (
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
        <SidebarButton icon="comment-dots" tooltip="Trò chuyện" active />
        <SidebarButton icon="seedling" tooltip="Quản lý cây trồng" />
        <SidebarButton icon="chart-line" tooltip="Phân tích" />
        <SidebarButton icon="cloud-sun" tooltip="Thời tiết" />
        <SidebarButton icon="book" tooltip="Kiến thức nông nghiệp" />
      </div>
      <div className="mt-auto relative z-10">
        <SidebarButton icon="cog" tooltip="Cài đặt" />
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
  )
}

interface SidebarButtonProps {
  icon: string
  tooltip: string
  active?: boolean
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ icon, tooltip, active = false }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`${active ? "text-amber-100" : "text-amber-100/70"} hover:bg-amber-600/50 hover:text-amber-100 !rounded-button w-10 h-10 flex items-center justify-center`}
          >
            <i className={`fas fa-${icon} text-lg`}></i>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default Sidebar
