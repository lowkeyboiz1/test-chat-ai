'use client'
import { memo } from 'react'

const TemplateLoader = memo(function TemplateLoader() {
  return (
    <div className='flex items-center justify-center py-4'>
      <div className='h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-amber-500'></div>
      <span className='ml-2 text-sm text-amber-600'>Đang chuẩn bị dữ liệu...</span>
    </div>
  )
})

export default TemplateLoader
