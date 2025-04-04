import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Message } from "@/types"
import { formatTime } from "@/utils/formatters"
import { Bug, User } from "lucide-react"

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
      <div className={`flex gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
        {message.sender === "ai" && (
          <Avatar className="h-8 w-8 mt-1 bg-gradient-to-r from-amber-500 to-yellow-400 ring-1 ring-amber-300 shadow-md">
            <AvatarImage
              src="https://readdy.ai/api/search-image?query=A traditional Vietnamese firefly AI assistant with a warm glowing light, incorporating rice paddy elements and traditional Vietnamese patterns, with a friendly appearance, suitable for a farming application for Vietnamese farmers&width=100&height=100&seq=3&orientation=squarish"
              alt="Đom Đóm AI"
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-r from-amber-500 to-yellow-400">
              <Bug className="text-white text-xs" />
            </AvatarFallback>
          </Avatar>
        )}
        <div
          className={`rounded-2xl p-3 shadow-sm ${
            message.sender === "user" ? "bg-amber-600 text-white hover:bg-amber-700" : "bg-white text-gray-800 border border-amber-200 hover:border-amber-300"
          } transition-colors duration-200`}
        >
          <p className="leading-relaxed">{message.text}</p>
          <div className={`text-xs mt-1 ${message.sender === "user" ? "text-amber-100" : "text-gray-500"}`}>{formatTime(message.timestamp)}</div>
        </div>
        {message.sender === "user" && (
          <Avatar className="h-8 w-8 mt-1 ring-1 ring-green-300 shadow-md">
            <AvatarImage
              src="https://readdy.ai/api/search-image?query=Portrait of a Vietnamese farmer in his 40s, wearing a traditional conical hat, with a weathered face showing experience and wisdom, standing in a lush green rice field during golden hour, with mountains in the background&width=100&height=100&seq=2&orientation=squarish"
              alt="Anh Tuấn"
              className="object-cover"
            />
            <AvatarFallback className="bg-green-100 text-green-700">
              <User className="text-green-700 text-xs" />
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  )
}
