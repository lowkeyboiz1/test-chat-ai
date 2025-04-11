import OpenAI from 'openai'
import { NextRequest } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return new Response(JSON.stringify({ error: 'No file uploaded' }), {
      status: 400
    })
  }

  const audioFile = await file.arrayBuffer()
  const result = await openai.audio.transcriptions.create({
    file: new File([audioFile], file.name, { type: file.type }),
    model: 'whisper-1'
  })

  return Response.json({ text: result.text })
}
