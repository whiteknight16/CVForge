import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { resume } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { getSession } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    // Get session
    const session = await getSession()
    if (!session?.user_id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { resumeId, customization } = await request.json()

    if (!resumeId || !customization) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update only the customization field
    await db
      .update(resume)
      .set({
        customization,
        updated_at: new Date().toISOString(),
      })
      .where(
        and(
          eq(resume.resume_id, resumeId),
          eq(resume.user_id, session.user_id)
        )
      )

    return NextResponse.json({
      success: true,
      message: 'Customization saved successfully',
    })
  } catch (error) {
    console.error('Error saving customization:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to save customization',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

