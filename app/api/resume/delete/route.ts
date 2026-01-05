import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { resume } from '@/db/schema'
import { getSession } from '@/lib/session'
import { eq, and } from 'drizzle-orm'

export async function DELETE(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { resume_id } = body

    if (!resume_id) {
      return NextResponse.json(
        { success: false, error: 'Resume ID is required' },
        { status: 400 }
      )
    }

    // Delete resume only if it belongs to the user
    await db
      .delete(resume)
      .where(
        and(
          eq(resume.resume_id, resume_id),
          eq(resume.user_id, session.user_id)
        )
      )

    return NextResponse.json({
      success: true,
      message: 'Resume deleted successfully',
    })
  } catch (error: any) {
    console.error('Delete resume error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete resume',
      },
      { status: 500 }
    )
  }
}

