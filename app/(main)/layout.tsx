"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, isAuthenticated, initializeAuth } = useAuthStore()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    let mounted = true
    
    const checkAuth = async () => {
      try {
        // Verify auth status with server
        await initializeAuth()
        
        // Wait a bit for Zustand state to update
        await new Promise(resolve => setTimeout(resolve, 150))
        
        if (mounted) {
          // Get current state after initialization
          const currentUser = useAuthStore.getState().user
          const currentAuth = useAuthStore.getState().isAuthenticated
          
          // Only redirect if not authenticated
          if (!currentAuth || !currentUser) {
            router.push('/sign-in')
          } else {
            setIsChecking(false)
          }
        }
      } catch (error) {
        console.error('Auth check error:', error)
        if (mounted) {
          router.push('/sign-in')
        }
      }
    }
    
    // Small delay to ensure SessionProvider has initialized
    const timer = setTimeout(() => {
      checkAuth()
    }, 50)
    
    return () => {
      mounted = false
      clearTimeout(timer)
    }
  }, [initializeAuth, router])

  // Show loading while checking auth
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Double check with current store state
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Redirecting to sign in...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

