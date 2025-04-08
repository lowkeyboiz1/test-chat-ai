import React from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ChatInputFooter() {
  return (
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
  )
}
