import OpenAI from 'openai'
import { NextRequest } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

// Status types matching the frontend
type StatusState = 'analyzing' | 'fetching' | 'processing' | 'completed' | 'error'

// Enhanced image detection with status updates
export async function POST(req: NextRequest) {
  // Create a stream for sending status updates
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

  try {
    // Parse the form data
    const formData = await req.formData()
    const imageFile = formData.get('image') as File
    const prompt =
      (formData.get('prompt') as string) ||
      'Mô tả chi tiết về hình ảnh này, tập trung vào các yếu tố nông nghiệp, cây trồng, tình trạng sức khỏe cây trồng và các vấn đề có thể nhìn thấy.'

    if (!imageFile) {
      await sendStatus('error', 'Không tìm thấy file hình ảnh')
      await writer.close()
      return new Response(stream.readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive'
        }
      })
    }

    // Initial status: Analyzing
    await sendStatus('analyzing', 'Đang phân tích hình ảnh của bạn...')

    // Sequence of status updates with delays
    setTimeout(async () => {
      await sendStatus('fetching', 'Đang lấy dữ liệu từ hình ảnh...')

      setTimeout(async () => {
        await sendStatus('processing', 'Đang xử lý thông tin từ hình ảnh...')

        try {
          // Convert file to base64 for OpenAI API
          const arrayBuffer = await imageFile.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)
          const base64Image = buffer.toString('base64')

          // Call OpenAI Vision model
          const response = await openai.chat.completions.create({
            model: 'gpt-4-vision-preview',
            messages: [
              {
                role: 'user',
                content: [
                  { type: 'text', text: prompt },
                  {
                    type: 'image_url',
                    image_url: {
                      url: `data:${imageFile.type};base64,${base64Image}`
                    }
                  }
                ]
              }
            ],
            max_tokens: 1024
          })

          // Send completed status
          await sendStatus('completed', 'Đã hoàn thành phân tích hình ảnh')

          // Send the result
          const resultMessage = {
            id: (Date.now() + 1).toString(),
            type: 'result',
            content: response.choices[0]?.message?.content || 'Không thể phân tích hình ảnh'
          }
          await writer.write(encoder.encode(`data: ${JSON.stringify(resultMessage)}\n\n`))
        } catch (error) {
          console.error('Image analysis error:', error)
          await sendStatus('error', 'Có lỗi khi phân tích hình ảnh')
        }

        // Close the stream
        await writer.close()
      }, 1500)
    }, 1000)

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
      }
    })
  } catch (error) {
    console.error('API error:', error)

    try {
      await sendStatus('error', 'Có lỗi xảy ra khi xử lý yêu cầu')
      await writer.close()
    } catch (e) {
      console.error('Error sending error status:', e)
    }

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
      }
    })
  }
}
