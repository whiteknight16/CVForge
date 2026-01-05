# Google OAuth Setup Guide

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" or "People API"
   - Click "Enable"

## Step 2: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen first:
   - Choose "External" (unless you have a Google Workspace)
   - Fill in the required information
   - Add your email as a test user if needed

4. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: CVForge (or your app name)
   - **Authorized JavaScript origins:**
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)
   
   - **Authorized redirect URIs:**
     - `http://localhost:3000/api/auth/google/callback` (for development)
     - `https://yourdomain.com/api/auth/google/callback` (for production)

5. Click "Create"
6. Copy the **Client ID** and **Client Secret**

## Step 3: Add to Environment Variables

Add these to your `.env` file:

```env
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important Notes:**
- The redirect URI must match **exactly** (including http/https, port, and path)
- No trailing slashes
- For production, update both the Google Console and your `.env` file

## Step 4: Test

1. Restart your dev server: `npm run dev`
2. Try signing in with Google
3. Check the console logs for the redirect URI being used

## Troubleshooting

### Error: redirect_uri_mismatch

This means the redirect URI in your code doesn't match what's in Google Cloud Console.

**Solution:**
1. Check the console log when you click "Continue with Google" - it will show the exact redirect URI
2. Go to Google Cloud Console > Credentials > Your OAuth Client
3. Make sure the "Authorized redirect URIs" includes the exact URL from the console log
4. Common issues:
   - Missing `http://` or `https://`
   - Wrong port number
   - Trailing slash
   - Wrong path (`/api/auth/google/callback` must match exactly)

### Error: invalid_client

- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct in your `.env` file
- Make sure there are no extra spaces or quotes

### Error: access_denied

- User cancelled the OAuth flow
- Or the app is not approved (check OAuth consent screen)

