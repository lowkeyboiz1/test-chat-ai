import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { NavigationItem } from '@/components/sidebar/NavigationItem'
import { VietnamesePatternBackground } from '@/components/sidebar/VietnamesePatternBackground'

export function NavigationSidebar() {
  const navigationItems = [
    { icon: 'comment-dots', label: 'Trò chuyện', isActive: true },
    { icon: 'seedling', label: 'Quản lý cây trồng', isActive: false },
    { icon: 'chart-line', label: 'Phân tích', isActive: false },
    { icon: 'cloud-sun', label: 'Thời tiết', isActive: false },
    { icon: 'book', label: 'Kiến thức nông nghiệp', isActive: false }
  ]

  return (
    <div className='relative flex w-16 flex-shrink-0 flex-col items-center overflow-hidden bg-amber-700 bg-gradient-to-b from-amber-600 to-amber-800 py-4 md:w-20'>
      <VietnamesePatternBackground />

      <div className='relative z-10'>
        <Avatar className='mb-4 h-10 w-10 border-2 border-amber-300 shadow-lg md:h-12 md:w-12'>
          <AvatarImage src='https://public.readdy.ai/ai/img_res/c43c8385367a8bd2e59e93e8130e16f0.jpg' alt='Đom Đóm AI Logo' />
          <AvatarFallback className='bg-amber-700'>ĐĐ</AvatarFallback>
        </Avatar>
      </div>

      <div className='relative z-10 mt-4 flex flex-col items-center gap-3 md:gap-4'>
        {navigationItems.map((item, index) => (
          <NavigationItem key={index} icon={item.icon} label={item.label} isActive={item.isActive} />
        ))}
      </div>

      <div className='relative z-10 mt-auto'>
        <NavigationItem icon='cog' label='Cài đặt' isActive={false} />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className='mt-4 h-8 w-8 cursor-pointer border-2 border-transparent shadow-md hover:border-amber-300 md:h-10 md:w-10'>
                <AvatarImage
                  src='https://readdy.ai/api/search-image?query=Portrait of a Vietnamese farmer in his 40s, wearing a traditional conical hat, with a weathered face showing experience and wisdom, standing in a lush green rice field during golden hour, with mountains in the background&width=100&height=100&seq=2&orientation=squarish'
                  alt='Anh Tuấn'
                />
                <AvatarFallback className='bg-amber-100 text-amber-700'>AT</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent side='right'>
              <p>Hồ sơ của tôi</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
