'use client'

import { useChat } from 'ai/react'
import { useState } from 'react'

export default function ImageUploadChat() {
  const { messages, append } = useChat()
  const [file, setFile] = useState<File | null>(null)
  const [inputText, setInputText] = useState('')

  const handleSend = async () => {
    if (!file && inputText.trim() === '') return

    const fileUrl = await toBase64Url(file)

    await append(
      {
        role: 'user',
        content: inputText || 'Describe this image.'
      },
      {
        experimental_attachments: [
          {
            url: fileUrl,
            name: file?.name,
            contentType: file?.type
          }
        ]
      }
    )

    // Reset
    setInputText('')
    setFile(null)
  }

  const toBase64Url = (file?: File | null): Promise<string> =>
    new Promise((resolve, reject) => {
      if (!file) return resolve('')
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string) // data:image/...;base64,...
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  return (
    <div className='space-y-4 p-4'>
      <div>
        <input type='file' accept='image/*' onChange={(e) => setFile(e.target.files?.[0] || null)} />
        {file && <p className='mt-1 text-sm'>📎 {file.name}</p>}
      </div>

      <input className='w-full border p-2' placeholder='Ask something about the image...' value={inputText} onChange={(e) => setInputText(e.target.value)} />

      <button className='rounded bg-blue-600 px-4 py-2 text-white' onClick={handleSend}>
        Gửi
      </button>

      <div className='mt-4 space-y-2'>
        {messages.map((m, i) => (
          <div key={i} className='rounded bg-gray-100 p-2'>
            <strong>{m.role}</strong>: {m.content}
          </div>
        ))}
      </div>
    </div>
  )
}
