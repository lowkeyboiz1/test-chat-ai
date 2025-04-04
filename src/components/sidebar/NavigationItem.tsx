import React from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface NavigationItemProps {
  icon: string
  label: string
  isActive: boolean
}

export function NavigationItem({ icon, label, isActive }: NavigationItemProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`${isActive ? "text-amber-100" : "text-amber-100/70 hover:text-amber-100"} hover:bg-amber-600/50 !rounded-button w-10 h-10 flex items-center justify-center`}
          >
            <i className={`fas fa-${icon} text-lg`}></i>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
