import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Bug, EllipsisVertical, RefreshCw } from "lucide-react"

export function ChatHeader() {
  return (
    <div className="border-b border-gray-200 backdrop-blur-md bg-white/40 p-4 shadow-md sticky top-0 z-10">
      <div className="flex justify-between items-center max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 bg-gradient-to-r from-amber-500 to-yellow-400 ring-2 ring-amber-300 ring-offset-2 transition-all hover:ring-amber-400 hover:scale-105">
            <AvatarImage
              src="https://readdy.ai/api/search-image?query=A traditional Vietnamese firefly AI assistant with a warm glowing light, incorporating rice paddy elements and traditional Vietnamese patterns, with a friendly appearance, suitable for a farming application for Vietnamese farmers&width=100&height=100&seq=3&orientation=squarish"
              alt="Đom Đóm AI"
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-r from-amber-500 to-yellow-400">
              <Bug className="text-white animate-pulse" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="font-bold font-serif text-lg text-amber-900 tracking-wide">Đom Đóm AI</h2>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 px-2 py-0 text-xs font-medium">
              AI Assistant
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
