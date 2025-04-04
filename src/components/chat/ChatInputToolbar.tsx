import React from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ChatInputToolbarProps {
  isRecording: boolean
  inputValue: string
  handleSendMessage: () => void
  toggleRecording: () => void
}

export function ChatInputToolbar({ isRecording, inputValue, handleSendMessage, toggleRecording }: ChatInputToolbarProps) {
  return (
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
            <Button variant="ghost" size="icon" className={`h-8 w-8 !rounded-button ${isRecording ? "bg-red-100 text-red-600" : "text-amber-600 hover:bg-amber-50"}`} onClick={toggleRecording}>
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
  )
}
