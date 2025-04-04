import React from "react"

interface ChatListItemProps {
  isActive: boolean
  title: string
  time: string
  message: string
}

export function ChatListItem({ isActive, title, time, message }: ChatListItemProps) {
  return (
    <div className={`${isActive ? "bg-amber-50 border-l-4 border-amber-600" : "hover:bg-gray-50 border-l-4 border-transparent"} rounded-lg p-3 mb-2 cursor-pointer`}>
      <div className="flex justify-between items-start mb-1">
        <h3 className={`font-medium ${isActive ? "text-amber-800" : "text-gray-700"}`}>{title}</h3>
        <span className={`text-xs ${isActive ? "text-amber-600" : "text-gray-500"}`}>{time}</span>
      </div>
      <p className="text-sm text-gray-600 line-clamp-2">{message}</p>
    </div>
  )
}
