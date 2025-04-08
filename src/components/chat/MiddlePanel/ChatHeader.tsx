import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Bug } from 'lucide-react'

export function ChatHeader() {
  return (
    <div className='sticky top-0 z-10 border-b border-gray-200 bg-white/40 p-4 shadow-md backdrop-blur-md'>
      <div className='mx-auto flex max-w-4xl items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Avatar className='h-12 w-12 bg-gradient-to-r from-amber-500 to-yellow-400 ring-2 ring-amber-300 ring-offset-2 transition-all hover:scale-105 hover:ring-amber-400'>
            <AvatarImage
              src='https://readdy.ai/api/search-image?query=A traditional Vietnamese firefly AI assistant with a warm glowing light, incorporating rice paddy elements and traditional Vietnamese patterns, with a friendly appearance, suitable for a farming application for Vietnamese farmers&width=100&height=100&seq=3&orientation=squarish'
              alt='Đom Đóm AI'
              className='object-cover'
            />
            <AvatarFallback className='bg-gradient-to-r from-amber-500 to-yellow-400'>
              <Bug className='animate-pulse text-white' />
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            <div className='flex items-center gap-2'>
              <h2 className='font-serif text-lg font-bold tracking-wide text-amber-900'>Đom Đóm AI</h2>
              <div className='h-2 w-2 animate-pulse rounded-full bg-green-500'></div>
            </div>
            <Badge variant='outline' className='border-green-300 bg-green-100 px-2 py-0 text-xs font-medium text-green-700'>
              AI Assistant
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
