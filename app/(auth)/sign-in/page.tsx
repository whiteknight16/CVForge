"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileText, Mail, Lock } from 'lucide-react'
import { GoogleIcon } from '@/components/ui/google-icon'
import { useAuthStore } from '@/store/auth-store'

const SignInPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { setUser } = useAuthStore()

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign in')
      }

      // Update Zustand store
      if (data.user) {
        setUser(data.user)
      }

      // Success - redirect to dashboard
      window.location.href = '/dashboard'
    } catch (error: any) {
      console.error('Sign-in error:', error)
      alert(error.message || 'Failed to sign in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    
    try {
      // Redirect to Google OAuth
      // For now, we'll use a simple approach - you can integrate Google OAuth later
      // This is a placeholder that will need Google OAuth setup
      window.location.href = '/api/auth/google/redirect'
    } catch (error) {
      console.error('Google sign-in error:', error)
      alert('Failed to sign in with Google. Please try again.')
      setIsLoading(false)
    }
  }

    return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-muted/20 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="relative">
              <FileText className="h-8 w-8 text-primary" />
              <div className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-primary rounded-full animate-pulse" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              CVForge
            </span>
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/sign-up" className="font-semibold text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-card/50 dark:bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-xl">
          {/* Google Sign In */}
          <Button
            type="button"
            variant="outline"
            className="w-full mb-6 h-11 text-base font-medium"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <GoogleIcon className="h-5 w-5 mr-2" />
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card/50 dark:bg-card/30 px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  Password
                </Label>
                <Link
                  href="#"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="h-11"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to CVForge's{' '}
          <Link href="#" className="underline hover:text-foreground">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="#" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
    )
}

export default SignInPage
