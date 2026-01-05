"use client"

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface User {
  user_id: string
  email: string
  name?: string | null
  image?: string | null
  provider?: string | null
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  logout: () => void
  initializeAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      setUser: (user) => {
        set({ user, isAuthenticated: !!user })
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false })
        // Clear cookie by calling logout API
        fetch('/api/auth/logout', { method: 'POST' })
      },
      
      initializeAuth: async () => {
        try {
          const response = await fetch('/api/auth/me')
          if (response.ok) {
            const data = await response.json()
            if (data.success && data.user) {
              set({ user: data.user, isAuthenticated: true })
            } else {
              set({ user: null, isAuthenticated: false })
            }
          } else {
            set({ user: null, isAuthenticated: false })
          }
        } catch (error) {
          console.error('Error initializing auth:', error)
          set({ user: null, isAuthenticated: false })
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

