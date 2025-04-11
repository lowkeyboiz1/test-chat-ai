import { ScrollArea } from '@/components/ui/scroll-area'
import { TMessage, TWeatherData } from '@/types'
import { format } from 'date-fns'
import { ChatListItem } from '@/components/sidebar/ChatListItem'
import { ChatSidebarHeader } from '@/components/sidebar/ChatSidebarHeader'
import { ChatSidebarFooter } from '@/components/sidebar/ChatSidebarFooter'

interface ChatSidebarProps {
  messages: TMessage[]
  weather: TWeatherData
}

export function ChatSidebar({ messages, weather }: ChatSidebarProps) {
  return (
    <div className='flex w-80 flex-col border-r border-gray-200 bg-white'>
      <ChatSidebarHeader messagesCount={messages.length} />
      <ScrollArea className='flex-1'>
        <div className='p-2'>
          <ChatListItem
            isActive={true}
            title='Đom Đóm AI'
            time={format(new Date(), 'HH:mm')}
            message='Xin chào Anh Tuấn! Tôi là Đom Đóm AI, trợ lý cá nhân của anh. Hôm nay tôi có thể giúp gì cho anh về vụ lúa mùa thu?'
          />
          {[1, 2, 3, 4].map((item) => (
            <ChatListItem
              key={item}
              isActive={false}
              title='Trợ lý thời tiết'
              time={format(new Date(new Date().setDate(new Date().getDate() - item)), 'dd/MM')}
              message='Dự báo thời tiết tuần tới cho khu vực Đồng Tháp của anh...'
            />
          ))}
        </div>
      </ScrollArea>
      <ChatSidebarFooter weather={weather} />
    </div>
  )
}
