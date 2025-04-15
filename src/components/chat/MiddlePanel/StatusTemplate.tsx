'use client'
import { Loader2, Search, CheckCircle, AlertTriangle } from 'lucide-react'
import { StatusTemplateProps } from '@/types/templates'

export default function StatusTemplate({ statusData }: StatusTemplateProps) {
  const getIcon = () => {
    switch (statusData.state) {
      case 'searching':
        return <Search className='h-4 w-4 animate-pulse text-amber-600' />
      case 'processing':
        return <Loader2 className='h-4 w-4 animate-spin text-emerald-600' />
      case 'completed':
        return <CheckCircle className='h-4 w-4 text-emerald-600' />
      case 'error':
        return <AlertTriangle className='h-4 w-4 text-red-600' />
      default:
        return <Loader2 className='h-4 w-4 animate-spin text-amber-600' />
    }
  }

  const getColor = () => {
    switch (statusData.state) {
      case 'searching':
        return 'bg-amber-100 border-amber-200 text-amber-800'
      case 'processing':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800'
      case 'completed':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      default:
        return 'bg-slate-50 border-slate-200 text-slate-800'
    }
  }

  if (statusData.state === 'completed') return null

  return (
    <div className='w-full py-2'>
      <div className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${getColor()}`}>
        <div className='mr-1 flex-shrink-0'>{getIcon()}</div>
        <div>{statusData.message}</div>
      </div>
    </div>
  )
}
