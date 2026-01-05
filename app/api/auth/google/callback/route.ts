import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/db/schema'
import { createSessionCookie } from '@/lib/session'
import { eq, or } from 'drizzle-orm'
import { cookies } from 'next/headers'

/**
 * Google OAuth Callback Handler
 * 
 * This handles the callback from Google OAuth
 * You'll need to exchange the authorization code for tokens
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/sign-in?error=${error}`
      )
    }

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/sign-in?error=no_code`
      )
    }

    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    
    // Use the same base URL logic as redirect route for consistency
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const redirectUri = `${baseUrl.replace(/\/$/, '')}/api/auth/google/callback`

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/sign-in?error=not_configured`
      )
    }

    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for tokens')
    }

    const tokens = await tokenResponse.json()

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    if (!userInfoResponse.ok) {
      throw new Error('Failed to fetch user info')
    }

    const googleUser = await userInfoResponse.json()

    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(
        or(
          eq(users.email, googleUser.email.toLowerCase()),
          eq(users.google_id, googleUser.id)
        )
      )
      .limit(1)

    let finalUser = existingUser

    if (existingUser) {
      // Update user if needed
      if (!existingUser.google_id) {
        await db
          .update(users)
          .set({
            google_id: googleUser.id,
            provider: 'google',
            name: googleUser.name,
            image: googleUser.picture,
            updated_at: new Date(),
          })
          .where(eq(users.user_id, existingUser.user_id))
        
        finalUser = {
          ...existingUser,
          google_id: googleUser.id,
          provider: 'google',
          name: googleUser.name,
          image: googleUser.picture,
        }
      }
    } else {
      // Create new user
      const [newUser] = await db
        .insert(users)
        .values({
          email: googleUser.email.toLowerCase(),
          google_id: googleUser.id,
          provider: 'google',
          name: googleUser.name,
          image: googleUser.picture,
        })
        .returning()
      
      finalUser = newUser
    }

    // Create session cookie
    const sessionCookie = createSessionCookie({
      user_id: finalUser.user_id,
      email: finalUser.email,
      name: finalUser.name,
      image: finalUser.image,
      provider: finalUser.provider || 'google',
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

    // Redirect to dashboard
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`
    )
  } catch (error: any) {
    console.error('Google OAuth callback error:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/sign-in?error=auth_failed`
    )
  }
}

