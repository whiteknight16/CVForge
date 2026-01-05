import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { resume } from '@/db/schema'
import { getSession } from '@/lib/session'
import { eq, desc } from 'drizzle-orm'

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Fetch all resumes for the user
    const resumes = await db
      .select()
      .from(resume)
      .where(eq(resume.user_id, session.user_id))
      .orderBy(desc(resume.updated_at))

    return NextResponse.json({
      success: true,
      resumes: resumes.map((r) => ({
        resume_id: r.resume_id,
        resume_name: r.resume_name,
        created_at: r.created_at,
        updated_at: r.updated_at,
      })),
    })
  } catch (error: any) {
    console.error('Get resumes error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch resumes',
      },
      { status: 500 }
    )
  }
}

