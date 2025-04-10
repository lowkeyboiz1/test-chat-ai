import React from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { TWeatherData } from '@/types'

interface ChatSidebarFooterProps {
  weather: TWeatherData
}

export function ChatSidebarFooter({ weather }: ChatSidebarFooterProps) {
  return (
    <div className='border-t border-gray-200 p-4'>
      <div className='flex items-center gap-3'>
        <div className='flex w-full items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-sm text-amber-700'>
          <i className={`fas fa-${weather.icon}`}></i>
          <span>{weather.temp}°C</span>
          <span className='hidden sm:inline'>| {weather.condition}</span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='outline' size='icon' className='!rounded-button border-amber-200 hover:bg-amber-50'>
                <i className='fas fa-bell text-amber-600'></i>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Thông báo</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
