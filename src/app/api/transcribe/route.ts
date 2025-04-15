import OpenAI from 'openai'
import { NextRequest } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

// Types to match the frontend status indicators
type StatusState = 'analyzing' | 'processing' | 'completed' | 'error'

// Create a stream response with status updates
const createStatusStream = async (file: File) => {
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()
  const encoder = new TextEncoder()

  const sendStatus = async (state: StatusState, message: string) => {
    const statusMessage = {
      id: Date.now().toString(),
      type: 'status',
      content: `@@<STATUS>{"state":"${state}","message":"${message}"}</STATUS>`
    }
    await writer.write(encoder.encode(`data: ${JSON.stringify(statusMessage)}\n\n`))
  }

  // Start processing with initial status
  try {
    // Send analyzing status
    await sendStatus('analyzing', 'Đang phân tích audio của bạn...')

    setTimeout(async () => {
      // Send processing status after a short delay
      await sendStatus('processing', 'Đang chuyển audio thành văn bản...')

      try {
        // Process the audio file
        const audioFile = await file.arrayBuffer()
        const result = await openai.audio.transcriptions.create({
          file: new File([audioFile], file.name, { type: file.type }),
          model: 'whisper-1'
        })

        // Send completed status
        await sendStatus('completed', 'Đã chuyển đổi hoàn tất')

        // Send the transcription result
        const resultMessage = {
          id: (Date.now() + 1).toString(),
          type: 'result',
          content: result.text
        }
        await writer.write(encoder.encode(`data: ${JSON.stringify(resultMessage)}\n\n`))
      } catch (error) {
        console.error('Transcription error:', error)
        await sendStatus('error', 'Có lỗi khi xử lý audio')
      }

      // Close the stream
      await writer.close()
    }, 1000)
  } catch (error) {
    console.error('Stream error:', error)
    await sendStatus('error', 'Có lỗi xảy ra')
    await writer.close()
  }

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    }
  })
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return new Response(JSON.stringify({ error: 'Không tìm thấy file audio' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Return a streaming response with status updates
    return createStatusStream(file)
  } catch (error) {
    console.error('API error:', error)
    return new Response(JSON.stringify({ error: 'Lỗi xử lý yêu cầu' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
