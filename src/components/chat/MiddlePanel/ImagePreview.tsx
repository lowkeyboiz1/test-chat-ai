'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChatState } from '@/atoms/chatAtoms'

interface ImagePreviewProps {
  url: string
}

export default function ImagePreview({ url }: ImagePreviewProps) {
  const { deleteImage } = useChatState()

  if (!url) return null

  return (
    <div className='relative mb-2 flex h-24 w-24 overflow-hidden rounded-md border border-amber-200 bg-amber-50'>
      <img src={url} alt='Uploaded image' className='object-cover' />
      <Button
        type='button'
        size='icon'
        variant='destructive'
        onClick={deleteImage}
        className='absolute top-1 right-1 h-5 w-5 rounded-full p-0.5 opacity-80 hover:opacity-100'
        aria-label='Delete image'
      >
        <X className='h-4 w-4' />
      </Button>
    </div>
  )
}
