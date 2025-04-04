import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { NavigationItem } from "./NavigationItem"
import { VietnamesePatternBackground } from "./VietnamesePatternBackground"

export function NavigationSidebar() {
  const navigationItems = [
    { icon: "comment-dots", label: "Trò chuyện", isActive: true },
    { icon: "seedling", label: "Quản lý cây trồng", isActive: false },
    { icon: "chart-line", label: "Phân tích", isActive: false },
    { icon: "cloud-sun", label: "Thời tiết", isActive: false },
    { icon: "book", label: "Kiến thức nông nghiệp", isActive: false },
  ]

  return (
    <div className="w-16 md:w-20 bg-amber-700 flex flex-col items-center py-4 flex-shrink-0 bg-gradient-to-b from-amber-600 to-amber-800 relative overflow-hidden">
      <VietnamesePatternBackground />

      <div className="relative z-10">
        <Avatar className="h-10 w-10 md:h-12 md:w-12 border-2 border-amber-300 mb-4 shadow-lg">
          <AvatarImage src="https://public.readdy.ai/ai/img_res/c43c8385367a8bd2e59e93e8130e16f0.jpg" alt="Đom Đóm AI Logo" />
          <AvatarFallback className="bg-amber-700">ĐĐ</AvatarFallback>
        </Avatar>
      </div>

      <div className="flex flex-col items-center gap-3 md:gap-4 mt-4 relative z-10">
        {navigationItems.map((item, index) => (
          <NavigationItem key={index} icon={item.icon} label={item.label} isActive={item.isActive} />
        ))}
      </div>

      <div className="mt-auto relative z-10">
        <NavigationItem icon="cog" label="Cài đặt" isActive={false} />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-8 w-8 md:h-10 md:w-10 mt-4 cursor-pointer border-2 border-transparent hover:border-amber-300 shadow-md">
                <AvatarImage
                  src="https://readdy.ai/api/search-image?query=Portrait of a Vietnamese farmer in his 40s, wearing a traditional conical hat, with a weathered face showing experience and wisdom, standing in a lush green rice field during golden hour, with mountains in the background&width=100&height=100&seq=2&orientation=squarish"
                  alt="Anh Tuấn"
                />
                <AvatarFallback className="bg-amber-100 text-amber-700">AT</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Hồ sơ của tôi</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
