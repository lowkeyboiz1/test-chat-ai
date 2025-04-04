import React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ChatSidebarHeaderProps {
  messagesCount: number
}

export function ChatSidebarHeader({ messagesCount }: ChatSidebarHeaderProps) {
  return (
    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-lg text-amber-800">Trò chuyện</h2>
          <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
            {messagesCount} tin nhắn
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
  )
}
