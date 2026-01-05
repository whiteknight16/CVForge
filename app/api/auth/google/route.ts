import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/db/schema'
import { eq, or } from 'drizzle-orm'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, googleId, name, image } = body

    // Validate input
    if (!email || !googleId) {
      return NextResponse.json(
        { success: false, error: 'Email and Google ID are required' },
        { status: 400 }
      )
    }

    // Check if user exists by email or google_id
    const [existingUser] = await db
      .select()
      .from(users)
      .where(
        or(
          eq(users.email, email.toLowerCase()),
          eq(users.google_id, googleId)
        )
      )
      .limit(1)

    if (existingUser) {
      // Update user if they're signing in with Google for the first time
      if (!existingUser.google_id) {
        await db
          .update(users)
          .set({
            google_id: googleId,
            provider: 'google',
            name: name || existingUser.name,
            image: image || existingUser.image,
            updated_at: new Date(),
          })
          .where(eq(users.user_id, existingUser.user_id))
      }

      return NextResponse.json({
        success: true,
        message: 'Sign in successful',
        user: {
          user_id: existingUser.user_id,
          email: existingUser.email,
          name: existingUser.name || name,
          image: existingUser.image || image,
          provider: 'google',
        },
      })
    }

    // Create new user
    const [newUser] = await db
      .insert(users)
      .values({
        email: email.toLowerCase(),
        google_id: googleId,
        provider: 'google',
        name: name,
        image: image,
      })
      .returning({
        user_id: users.user_id,
        email: users.email,
        name: users.name,
        image: users.image,
        provider: users.provider,
      })

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        user: {
          user_id: newUser.user_id,
          email: newUser.email,
          name: newUser.name,
          image: newUser.image,
          provider: newUser.provider,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Google auth error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to authenticate with Google. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

