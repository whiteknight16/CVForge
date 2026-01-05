import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        user_id: session.user_id,
        email: session.email,
        name: session.name,
        image: session.image,
        provider: session.provider,
      },
    })
  } catch (error: any) {
    console.error('Get user error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get user',
      },
      { status: 500 }
    )
  }
}

