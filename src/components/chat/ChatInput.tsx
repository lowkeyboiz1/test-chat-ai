"use client"
import { Button } from "@/components/ui/button"
import { ChatInputFooter } from "./ChatInputFooter"
import { ChatInputToolbar } from "./ChatInputToolbar"

interface ChatInputProps {
  inputValue: string
  setInputValue: (value: string) => void
  isRecording: boolean
  handleSendMessage: () => void
  toggleRecording: () => void
}

export function ChatInput({ inputValue, setInputValue, isRecording, handleSendMessage, toggleRecording }: ChatInputProps) {
  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <div className="max-w-4xl mx-auto space-y-3">
        <div className="relative">
          <div className="rounded-xl border border-amber-200 bg-white shadow-sm overflow-hidden transition-all">
            <div className="p-3">
              <div className="relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  placeholder="Nhập câu hỏi của bạn hoặc nhấn Shift+Enter để xuống dòng..."
                  className="w-full border-none focus:ring-0 resize-none min-h-[60px] max-h-[200px] text-sm bg-transparent outline-none"
                  style={{ overflow: "auto" }}
                />
                {inputValue && (
                  <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-8 w-8 !rounded-button cursor-pointer" onClick={() => setInputValue("")}>
                    <i className="fas fa-times text-gray-400 text-xs"></i>
                  </Button>
                )}
              </div>

              <ChatInputToolbar isRecording={isRecording} inputValue={inputValue} handleSendMessage={handleSendMessage} toggleRecording={toggleRecording} />
            </div>

            <ChatInputFooter />
          </div>

          {isRecording && (
            <div className="absolute inset-0 bg-black/5 rounded-xl flex items-center justify-center pointer-events-none">
              <div className="bg-white p-3 rounded-full shadow-lg animate-pulse">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <i className="fas fa-microphone text-red-600"></i>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
