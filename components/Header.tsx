"use client"

import React, { useEffect } from 'react'
import Link from 'next/link'
import { ModeToggle } from './ModeToggle'
import { Button } from './ui/button'
import { FileText } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import UserMenu from './UserMenu'

const Header = () => {
    const { isAuthenticated, initializeAuth } = useAuthStore()

    useEffect(() => {
        // Initialize auth on mount
        initializeAuth()
    }, [initializeAuth])

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center space-x-2.5 group mr-auto">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-lg blur-xl group-hover:bg-primary/30 transition-colors" />
                        <FileText className="relative h-7 w-7 text-primary transition-transform group-hover:scale-110 group-hover:rotate-3" />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                        CVForge
                    </span>
                </Link>

                <div className="flex items-center gap-3 ml-auto">
                <ModeToggle />
                    {isAuthenticated ? (
                        <UserMenu />
                    ) : (
                        <Button asChild size="default" className="font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
            <Link href="/sign-up">Get Started</Link>
                        </Button>
                    )}
            </div>
        </div>
        </header>
    )
}

export default Header