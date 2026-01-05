import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/db/schema'
import { hashPassword, isValidEmail, isValidPassword } from '@/lib/auth'
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

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password strength
    const passwordValidation = isValidPassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { success: false, error: passwordValidation.message },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1)

    if (existingUser.length > 0) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email: email.toLowerCase(),
        password: hashedPassword,
        provider: 'email',
      })
      .returning({
        user_id: users.user_id,
        email: users.email,
        created_at: users.created_at,
      })

    // Create session cookie
    const sessionCookie = createSessionCookie({
      user_id: newUser.user_id,
      email: newUser.email,
      name: null,
      image: null,
      provider: 'email',
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

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        user: {
          user_id: newUser.user_id,
          email: newUser.email,
          name: null,
          image: null,
          provider: 'email',
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Sign-up error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create account. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

