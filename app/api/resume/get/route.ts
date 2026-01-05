import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { resume } from '@/db/schema'
import { getSession } from '@/lib/session'
import { eq, and } from 'drizzle-orm'

export async function POST(request: Request) {
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

    // Fetch resume only if it belongs to the user
    const [resumeData] = await db
      .select()
      .from(resume)
      .where(
        and(
          eq(resume.resume_id, resume_id),
          eq(resume.user_id, session.user_id)
        )
      )
      .limit(1)

    // If resume doesn't exist, return empty data (new resume)
    if (!resumeData) {
      // Check if resume exists but belongs to another user
      const [anyResume] = await db
        .select({ user_id: resume.user_id })
        .from(resume)
        .where(eq(resume.resume_id, resume_id))
        .limit(1)

      if (anyResume) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Access denied',
            details: 'This resume does not belong to you'
          },
          { status: 403 }
        )
      }

      // Resume doesn't exist - return empty/default data for new resume
      const defaultSectionOrder = [
        'personal_details',
        'skills',
        'employment_history',
        'education',
        'projects',
        'languages',
        'links',
        'professional_summary'
      ]

      return NextResponse.json({
        success: true,
        resume: {
          resume_id: resume_id,
          resume_name: 'My Resume',
          personal_details: null,
          professional_summary: null,
          employment_history: null,
          education: null,
          projects: null,
          skills: null,
          languages: null,
          links: null,
          sectionOrder: defaultSectionOrder,
          skippedSections: [],
        },
        isNew: true,
      })
    }

    // Transform order object to array format
    let sectionOrder: string[] = []
    if (resumeData.order && typeof resumeData.order === 'object') {
      // Extract keys from order object and filter out skipped sections
      const orderObj = resumeData.order as Record<string, boolean>
      sectionOrder = Object.keys(orderObj).filter(key => !orderObj[key])
    }

    // If no order, use default
    if (sectionOrder.length === 0) {
      sectionOrder = [
        'personal_details',
        'skills',
        'employment_history',
        'education',
        'projects',
        'languages',
        'links',
        'professional_summary'
      ]
    }

    // Get skipped sections from order object
    const skippedSections: string[] = []
    if (resumeData.order && typeof resumeData.order === 'object') {
      const orderObj = resumeData.order as Record<string, boolean>
      Object.keys(orderObj).forEach(key => {
        if (orderObj[key] === true) {
          skippedSections.push(key)
        }
      })
    }

    return NextResponse.json({
      success: true,
      resume: {
        resume_id: resumeData.resume_id,
        resume_name: resumeData.resume_name,
        personal_details: resumeData.personal_details,
        professional_summary: resumeData.professional_summary,
        employment_history: resumeData.employment_history,
        education: resumeData.education,
        projects: resumeData.projects,
        skills: resumeData.skills,
        languages: resumeData.languages,
        links: resumeData.links,
        sectionOrder,
        skippedSections,
      },
    })
  } catch (error: any) {
    console.error('Get resume error:', error)
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      detail: error?.detail,
      hint: error?.hint,
      resume_id,
      user_id: session?.user_id,
    })
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch resume',
        details: error?.message || 'Unknown error occurred',
        code: error?.code,
      },
      { status: 500 }
    )
  }
}

