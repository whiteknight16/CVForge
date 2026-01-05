import { cookies } from 'next/headers'

const SESSION_COOKIE_NAME = 'cvforge_session'
const SESSION_DURATION_DAYS = 7

export interface SessionData {
  user_id: string
  email: string
  name?: string | null
  image?: string | null
  provider?: string | null
  expires_at: number
}

/**
 * Create a session cookie
 */
export function createSessionCookie(sessionData: Omit<SessionData, 'expires_at'>): string {
  const expiresAt = Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000
  const session: SessionData = {
    ...sessionData,
    expires_at: expiresAt,
  }
  
  return JSON.stringify(session)
}

/**
 * Get session from cookie
 */
export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)
    
    if (!sessionCookie?.value) {
      return null
    }

    const session: SessionData = JSON.parse(sessionCookie.value)
    
    // Check if session is expired
    if (Date.now() > session.expires_at) {
      return null
    }

    return session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

/**
 * Delete session cookie
 */
export function deleteSessionCookie(): void {
  // This will be handled in the API route
}

/**
 * Check if session is valid
 */
export function isSessionValid(session: SessionData | null): boolean {
  if (!session) return false
  return Date.now() < session.expires_at
}

