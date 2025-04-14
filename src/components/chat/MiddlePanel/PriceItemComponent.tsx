import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import React, { memo, useCallback } from 'react'

export interface PriceItem {
  product: string
  currentPrice: number | string
  previousPrice: number | string
  unit: string
  pricePerKg?: number | string
  trend: 'up' | 'down' | 'stable'
  location?: string
  sources?: string[]
  type?: string
}

interface PriceItemComponentProps {
  item: PriceItem
  index: number
  activeItem: number | null
  setActiveItem: (index: number | null) => void
  showDetails: boolean
  formatPrice: (price: number | string) => string
  calculateChange: (current: number | string, previous: number | string) => string
}

const PriceItemComponent: React.FC<PriceItemComponentProps> = ({ item, index, activeItem, setActiveItem, showDetails, formatPrice, calculateChange }) => {
  const handleClick = useCallback(() => {
    setActiveItem(activeItem === index ? null : index)
  }, [activeItem, index, setActiveItem])

  // Determine trend text color
  const getTrendTextColor = () => {
    if (item.trend === 'up') return 'text-emerald-400'
    if (item.trend === 'down') return 'text-rose-400'
    return 'text-blue-400'
  }

  // Get trend text
  const getTrendText = () => {
    if (item.trend === 'up') return `+${calculateChange(item.currentPrice, item.previousPrice)}%`
    if (item.trend === 'down') return `-${calculateChange(item.previousPrice, item.currentPrice)}%`
    return 'Ổn định'
  }

  return (
    <div
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-xl border border-emerald-500/30 transition-all duration-300 ease-out',
        activeItem === index ? 'bg-emerald-950/60' : 'bg-emerald-950/40 hover:bg-emerald-900/40',
        showDetails ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      )}
      style={{ transitionDelay: `${index * 50}ms` }}
      onClick={handleClick}
    >
      {/* Background gradient */}
      <div className='absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-emerald-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100'></div>

      {/* Subtle gradient at bottom */}
      <div className='absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent'></div>

      {/* Item header */}
      <div className='relative flex items-start justify-between p-4 sm:p-5'>
        <div className='flex max-w-[60%] flex-col'>
          <div className='mb-1 text-lg font-bold text-white'>{item.product}</div>
          <div className='text-base text-emerald-400/70'>{item.type ? `${item.type} (${item.unit})` : item.unit}</div>
        </div>

        <div className='flex flex-col items-end'>
          <div className='flex flex-col items-end'>
            <div className='flex items-baseline'>
              <span className='text-lg font-bold text-white'>
                {typeof item.currentPrice === 'string' ? item.currentPrice : formatPrice(item.currentPrice).replace(' ₫', '')}
              </span>
            </div>
            <div
              className={cn(
                'mt-2 rounded-full px-4 py-1 text-sm font-medium',
                item.trend === 'up'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : item.trend === 'down'
                    ? 'bg-rose-500/20 text-rose-400'
                    : 'bg-blue-500/20 text-blue-400'
              )}
            >
              {item.trend === 'stable' ? 'Ổn định' : getTrendText()}
            </div>
          </div>

          <div className='mt-2 flex justify-end'>
            <div className={cn('transform transition-transform duration-300', activeItem === index ? 'rotate-90' : '')}>
              <ChevronRight className='h-6 w-6 text-emerald-400/60' />
            </div>
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {activeItem === index && (
        <div className='overflow-hidden opacity-100 transition-all duration-300 ease-out'>
          <div className='border-t border-emerald-500/30 px-4 py-3 sm:px-5 sm:py-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='rounded-xl bg-emerald-900/30 p-3'>
                <div className='mb-1 text-xs text-emerald-400/70 uppercase'>Giá trước đó</div>
                <div className='text-sm font-medium text-emerald-100'>
                  {typeof item.previousPrice === 'string' ? item.previousPrice : formatPrice(item.previousPrice)} {item.unit}
                </div>
              </div>
              <div className='rounded-xl bg-emerald-900/30 p-3'>
                <div className='mb-1 text-xs text-emerald-400/70 uppercase'>Nguồn</div>
                <div className='truncate text-sm font-medium text-emerald-100'>{item.location || 'Chợ truyền thống'}</div>
              </div>
            </div>
            {item.sources && item.sources.length > 0 && (
              <div className='mt-3 rounded-xl bg-emerald-900/30 p-3'>
                <div className='mb-1 text-xs text-emerald-400/70 uppercase'>Nguồn tham khảo</div>
                <div className='text-sm font-medium text-emerald-100'>{item.sources.join(', ')}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

PriceItemComponent.displayName = 'PriceItemComponent'

export default memo(PriceItemComponent)
