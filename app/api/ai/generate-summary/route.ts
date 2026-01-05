import { NextResponse } from 'next/server'
import { generateProfessionalSummary } from '@/lib/openai'

export async function POST(request: Request) {
  try {
    const { resumeData } = await request.json()

    if (!resumeData) {
      return NextResponse.json(
        { error: 'Resume data is required' },
        { status: 400 }
      )
    }

    const summary = await generateProfessionalSummary(resumeData)

    return NextResponse.json({ 
      success: true, 
      summary 
    })
  } catch (error: any) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate professional summary',
        success: false 
      },
      { status: 500 }
    )
  }
}

