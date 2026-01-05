import { NextResponse } from 'next/server'

/**
 * Debug endpoint to show the exact redirect URI being used
 * Visit: http://localhost:3000/api/auth/google/debug
 */
export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  
  // Get the base URL
  let baseUrl = process.env.NEXT_PUBLIC_APP_URL
  if (!baseUrl) {
    const url = new URL(request.url)
    baseUrl = `${url.protocol}//${url.host}`
  }
  baseUrl = baseUrl.replace(/\/$/, '')
  const redirectUri = `${baseUrl}/api/auth/google/callback`

  return NextResponse.json({
    message: 'Google OAuth Debug Info',
    redirectUri,
    clientIdConfigured: !!clientId,
    clientId: clientId ? `${clientId.substring(0, 20)}...` : 'NOT SET',
    instructions: {
      step1: 'Copy the redirectUri below',
      step2: 'Go to: https://console.cloud.google.com/apis/credentials',
      step3: 'Click on your OAuth 2.0 Client ID',
      step4: 'Under "Authorized redirect URIs", click "ADD URI"',
      step5: `Paste this EXACT URL: ${redirectUri}`,
      step6: 'Click "SAVE"',
      step7: 'Wait 30 seconds for changes to propagate',
      step8: 'Try signing in with Google again',
    },
    commonMistakes: [
      'Adding http:// instead of https:// (or vice versa)',
      'Wrong port number (should be 3000 for localhost)',
      'Trailing slash at the end',
      'Wrong path (must be /api/auth/google/callback)',
      'Not waiting for changes to propagate',
    ],
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

