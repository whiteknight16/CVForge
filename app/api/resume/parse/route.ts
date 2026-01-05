import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { parseResumeText } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user_id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { text } = await request.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { success: false, error: 'No text provided' },
        { status: 400 }
      )
    }

    // Use the reusable function from lib/openai.ts
    const resumeData = await parseResumeText(text)

    return NextResponse.json({
      success: true,
      data: resumeData,
    })
  } catch (error) {
    console.error('Resume parse error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to parse resume',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

