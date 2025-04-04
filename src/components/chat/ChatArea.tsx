import React from "react"
import { ChatHeader } from "./ChatHeader"
import { ChatMessages } from "./ChatMessages"
import { ChatInput } from "./ChatInput"
import { Message } from "@/types"

interface ChatAreaProps {
  messages: Message[]
  inputValue: string
  setInputValue: (value: string) => void
  isTyping: boolean
  isRecording: boolean
  handleSendMessage: () => void
  toggleRecording: () => void
}

export function ChatArea({ messages, inputValue, setInputValue, isTyping, isRecording, handleSendMessage, toggleRecording }: ChatAreaProps) {
  return (
    <div className="flex-1 flex flex-col relative">
      <div className="absolute inset-0 bg-[url('https://public.readdy.ai/ai/img_res/d0c4f65405da6599ac836fe88274f6f8.jpg')] bg-cover bg-center z-0"></div>
      <div className="flex-1 flex flex-col z-10 relative">
        <ChatHeader />
        <ChatMessages messages={messages} isTyping={isTyping} />
        <ChatInput inputValue={inputValue} setInputValue={setInputValue} isRecording={isRecording} handleSendMessage={handleSendMessage} toggleRecording={toggleRecording} />
      </div>
    </div>
  )
}
