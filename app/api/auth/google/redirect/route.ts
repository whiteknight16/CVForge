import { NextResponse } from 'next/server'

/**
 * Google OAuth Redirect Handler
 * 
 * To complete Google OAuth setup:
 * 1. Go to https://console.cloud.google.com/
 * 2. Create a new project or select existing
 * 3. Enable Google+ API
 * 4. Create OAuth 2.0 credentials
 * 5. Add authorized redirect URI: http://localhost:3000/api/auth/google/callback
 * 6. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env
 */

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  
  if (!clientId) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Google OAuth is not configured. Please add GOOGLE_CLIENT_ID to your .env file.' 
      },
      { status: 500 }
    )
  }

  // Use NEXT_PUBLIC_APP_URL if set, otherwise default to localhost:3000 for development
  // This ensures consistency
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const redirectUri = `${baseUrl.replace(/\/$/, '')}/api/auth/google/callback`

  // Log the redirect URI for debugging - this is what you need to add to Google Cloud Console
  console.log('\n🔗 ==========================================')
  console.log('🔗 REDIRECT URI:', redirectUri)
  console.log('🔗 ==========================================')
  console.log('\n📝 TO FIX THE ERROR:')
  console.log('   1. Copy this EXACT URL:', redirectUri)
  console.log('   2. Go to: https://console.cloud.google.com/apis/credentials')
  console.log('   3. Click on your OAuth 2.0 Client ID')
  console.log('   4. Scroll to "Authorized redirect URIs"')
  console.log('   5. Click "ADD URI" button')
  console.log('   6. Paste:', redirectUri)
  console.log('   7. Click "SAVE"')
  console.log('   8. Wait 30-60 seconds for changes to propagate')
  console.log('   9. Try again!\n')

  // Google OAuth URL
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', 'openid email profile')
  authUrl.searchParams.set('access_type', 'offline')
  authUrl.searchParams.set('prompt', 'consent')

  // Redirect to Google OAuth
  return NextResponse.redirect(authUrl.toString())
}

