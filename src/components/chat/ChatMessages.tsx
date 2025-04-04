"use client"
import React, { useEffect, useRef } from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Message } from "@/types"
import { MessageBubble } from "./MessageBubble"
import { Bug } from "lucide-react"

interface ChatMessagesProps {
  messages: Message[]
  isTyping: boolean
}

export function ChatMessages({ messages, isTyping }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  return (
    <ScrollArea className="flex-1 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <div className="text-center my-2 sm:my-4">
          <Badge variant="outline" className="bg-gray-100 text-gray-500 text-xs sm:text-sm">
            {format(new Date(), "EEEE, dd/MM/yyyy", { locale: vi })}
          </Badge>
        </div>

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-1 sm:gap-2 max-w-[80%]">
              <div className="h-6 w-6 sm:h-8 sm:w-8 mt-1 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full flex items-center justify-center">
                <Bug className="text-white text-[10px] sm:text-xs" />
              </div>
              <div className="rounded-2xl p-2 sm:p-3 shadow-sm bg-white text-gray-800 border border-amber-200">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  )
}
