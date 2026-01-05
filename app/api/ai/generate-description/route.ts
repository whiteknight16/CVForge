import { NextResponse } from 'next/server'
import { generateDescription } from '@/lib/openai'

export async function POST(request: Request) {
  try {
    const { type, context } = await request.json()

    if (!type || !context) {
      return NextResponse.json(
        { error: 'Type and context are required' },
        { status: 400 }
      )
    }

    if (!['employment', 'education', 'project'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be employment, education, or project' },
        { status: 400 }
      )
    }

    const description = await generateDescription(context, type)

    return NextResponse.json({ 
      success: true, 
      description 
    })
  } catch (error: any) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate description',
        success: false 
      },
      { status: 500 }
    )
  }
}

