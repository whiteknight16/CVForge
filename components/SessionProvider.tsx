"use client"

import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth-store'

/**
 * Component to handle session expiration and auto-logout
 * Should be added to the root layout
 */
export default function SessionProvider() {
  const { user, isAuthenticated, initializeAuth, logout } = useAuthStore()

  useEffect(() => {
    // Initialize auth on mount
    initializeAuth()
  }, [initializeAuth])

  useEffect(() => {
    if (!isAuthenticated || !user) return

    // Check session validity periodically (every 5 minutes)
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (!response.ok) {
          // Session expired or invalid
          logout()
        }
      } catch (error) {
        console.error('Session check error:', error)
        logout()
      }
    }

    // Check immediately
    checkSession()

    // Check every 5 minutes
    const interval = setInterval(checkSession, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [isAuthenticated, user, logout])

  return null
}

