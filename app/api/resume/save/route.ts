import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'
import { resume } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export async function POST(request: Request) {
  let body: any = {}
  let session: any = null
  
  try {
    // Parse request body
    try {
      body = await request.json()
    } catch (parseError: any) {
      console.error('Error parsing request body:', parseError)
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request body',
          details: parseError?.message || 'Failed to parse JSON',
          code: 'PARSE_ERROR',
        },
        { status: 400 }
      )
    }

    // Get session
    try {
      session = await getSession()
    } catch (sessionError: any) {
      console.error('Error getting session:', sessionError)
      return NextResponse.json(
        {
          success: false,
          error: 'Session error',
          details: sessionError?.message || 'Failed to get session',
          code: 'SESSION_ERROR',
        },
        { status: 500 }
      )
    }

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    let { resumeId, resumeName, resumeData, sectionOrder, skippedSections } = body

    if (!resumeId || !resumeName) {
      return NextResponse.json(
        { success: false, error: 'Resume ID and name are required' },
        { status: 400 }
      )
    }

    // Ensure resumeId is a valid UUID string
    const resumeIdStr = String(resumeId).trim()
    if (!resumeIdStr || resumeIdStr.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid resume ID' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!sectionOrder || !Array.isArray(sectionOrder)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid section order',
          details: 'sectionOrder must be an array',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      )
    }

    // Ensure personal_details is always first in the order array
    const filteredOrder = sectionOrder.filter(s => s !== 'personal_details')
    const finalOrder = ['personal_details', ...filteredOrder]

    const resumeDataToSave = {
      user_id: session.user_id,
      resume_name: resumeName,
      personal_details: resumeData.personal_details || null,
      professional_summary: resumeData.professional_summary || null,
      employment_history: resumeData.employment_history || null,
      education: resumeData.education || null,
      projects: resumeData.projects || null,
      skills: resumeData.skills || [], // skills is required, default to empty array
      languages: resumeData.languages || null,
      links: resumeData.links || null,
      order: finalOrder, // Store as array of section names in order
      updated_at: new Date().toISOString(),
    }

    // Try to check if resume exists, but if query fails, assume it's new
    let existingResume: any[] = []
    try {
      existingResume = await db
        .select()
        .from(resume)
        .where(
          and(
            eq(resume.resume_id, resumeIdStr),
            eq(resume.user_id, session.user_id)
          )
        )
        .limit(1)
    } catch (checkError: any) {
      // If check fails, log it but continue to create new resume
      console.warn('Error checking if resume exists, will create new:', checkError?.message)
      console.warn('Check error details:', {
        code: checkError?.code,
        detail: checkError?.detail,
        resumeId: resumeIdStr,
        user_id: session.user_id,
      })
    }

    if (existingResume.length > 0) {
      // Update existing resume
      try {
        await db
          .update(resume)
          .set(resumeDataToSave)
          .where(
            and(
              eq(resume.resume_id, resumeIdStr),
              eq(resume.user_id, session.user_id)
            )
          )

        return NextResponse.json({
          success: true,
          message: 'Resume updated successfully',
        })
      } catch (updateError: any) {
        console.error('Update error:', updateError)
        throw new Error(`Failed to update resume: ${updateError?.message || 'Unknown error'}`)
      }
    } else {
      // Create new resume
      try {
        // Ensure skills is always an array (not null) for JSONB
        const insertData = {
          ...resumeDataToSave,
          resume_id: resumeIdStr,
          skills: Array.isArray(resumeDataToSave.skills) ? resumeDataToSave.skills : [],
        }

        const [newResume] = await db
          .insert(resume)
          .values(insertData)
          .returning()

        return NextResponse.json({
          success: true,
          message: 'Resume saved successfully',
          resume: newResume,
        })
      } catch (insertError: any) {
        console.error('Insert error:', insertError)
        console.error('Insert error details:', {
          code: insertError?.code,
          detail: insertError?.detail,
          hint: insertError?.hint,
          message: insertError?.message,
          resumeId: resumeIdStr,
          user_id: session.user_id,
        })
        
        // Check if error is due to type mismatch (serial vs uuid)
        if (insertError?.code === '42804' || insertError?.message?.includes('cannot be cast') || insertError?.message?.includes('type uuid')) {
          const errorMessage = 'Database schema mismatch: resume_id column type needs to be updated to UUID. Please run: npm run db:migrate'
          console.error(errorMessage)
          throw new Error(errorMessage)
        }
        
        // If insert fails due to duplicate, try update instead
        if (insertError?.code === '23505' || insertError?.message?.includes('duplicate') || insertError?.message?.includes('unique')) {
          try {
            await db
              .update(resume)
              .set(resumeDataToSave)
              .where(
                and(
                  eq(resume.resume_id, resumeIdStr),
                  eq(resume.user_id, session.user_id)
                )
              )
            
            return NextResponse.json({
              success: true,
              message: 'Resume saved successfully',
            })
          } catch (updateError: any) {
            console.error('Update error after failed insert:', updateError)
            throw new Error(`Failed to save resume: ${updateError?.message || 'Unknown error'}`)
          }
        }
        
        // Provide more detailed error message
        const errorDetail = insertError?.detail || insertError?.hint || insertError?.message || 'Unknown database error'
        throw new Error(`Failed to create resume: ${errorDetail}`)
      }
    }
  } catch (error: any) {
    console.error('Save resume error:', error)
    console.error('Error type:', typeof error)
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      detail: error?.detail,
      hint: error?.hint,
      name: error?.name,
      stack: error?.stack?.substring(0, 500), // Limit stack trace length
    })
    
    // Ensure we always return a valid JSON response
    // Convert error to a serializable format
    const errorMessage = error?.message || String(error) || 'Unknown error occurred'
    const errorDetails = error?.detail || error?.hint || errorMessage
    const errorCode = error?.code || error?.name || 'UNKNOWN_ERROR'
    
    const errorResponse = {
      success: false,
      error: errorMessage,
      details: errorDetails,
      code: errorCode,
    }
    
    try {
      return NextResponse.json(
        errorResponse,
        { status: 500 }
      )
    } catch (jsonError: any) {
      // If even JSON serialization fails, return a minimal response
      console.error('Failed to serialize error response:', jsonError)
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Internal server error',
          details: 'Failed to process error response',
          code: 'SERIALIZATION_ERROR',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }
  }
}

