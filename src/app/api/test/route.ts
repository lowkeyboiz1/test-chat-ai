import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageUrl, message } = body

    // Log the received data

    // Here you would typically process the image URL and message
    // For example, save it to a database, send to another service, etc.

    return NextResponse.json(
      {
        success: true,
        message: 'Image URL and message received successfully',
        data: { imageUrl, message }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in test API:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
