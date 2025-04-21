'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface MessageAttachmentProps {
  url: string
  name?: string
  contentType?: string
}

export default function MessageAttachment({ url, name, contentType }: MessageAttachmentProps) {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)

  if (!url || !contentType?.startsWith('image/')) {
    return null
  }

  return (
    <>
      <div className='relative mt-2 flex cursor-pointer flex-col' onClick={() => setIsImageDialogOpen(true)}>
        <div className='relative h-48 w-full max-w-xs overflow-hidden rounded-lg border border-gray-200 bg-gray-100'>
          <img src={url} alt={name || 'Hình ảnh đính kèm'} className='object-contain' />
        </div>
      </div>

      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className='max-w-3xl'>
          <div className='relative h-[70vh] w-full'>
            <img src={url} alt={name || 'Hình ảnh đính kèm'} className='object-contain' sizes='100vw' />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
