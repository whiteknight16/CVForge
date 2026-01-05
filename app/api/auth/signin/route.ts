import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/db/schema'
import { verifyPassword } from '@/lib/auth'
import { createSessionCookie } from '@/lib/session'
import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1)

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if user has a password (email auth user)
    if (!user.password) {
      return NextResponse.json(
        { success: false, error: 'Please sign in with Google' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create session cookie
    const sessionCookie = createSessionCookie({
      user_id: user.user_id,
      email: user.email,
      name: user.name,
      image: user.image,
      provider: user.provider,
    })

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('cvforge_session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    // Return user data (excluding password)
    const response = NextResponse.json({
      success: true,
      message: 'Sign in successful',
      user: {
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        image: user.image,
        provider: user.provider,
      },
    })

    return response
  } catch (error: any) {
    console.error('Sign-in error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sign in. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

