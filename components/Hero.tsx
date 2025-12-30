"use client"

import React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { ArrowRight, Sparkles, Zap, CheckCircle2, FileCheck } from 'lucide-react'

const Hero = () => {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center bg-gradient-to-b from-background via-background to-muted/30">
      {/* Grid Background */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        {/* Light mode grid */}
        <div 
          className="absolute inset-0 dark:hidden"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(0 0 0 / 0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(0 0 0 / 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%)',
          }}
        />
        {/* Dark mode grid */}
        <div 
          className="absolute inset-0 hidden dark:block"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(255 255 255 / 0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(255 255 255 / 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%)',
          }}
        />
        {/* Larger grid overlay - Light mode */}
        <div 
          className="absolute inset-0 dark:hidden"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(0 0 0 / 0.015) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(0 0 0 / 0.015) 1px, transparent 1px)
            `,
            backgroundSize: '120px 120px',
            maskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%)',
          }}
        />
        {/* Larger grid overlay - Dark mode */}
        <div 
          className="absolute inset-0 hidden dark:block"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(255 255 255 / 0.015) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(255 255 255 / 0.015) 1px, transparent 1px)
            `,
            backgroundSize: '120px 120px',
            maskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%)',
          }}
        />
      </div>

      {/* Animated background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 dark:bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="mx-auto max-w-5xl text-center space-y-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-sm font-semibold border border-primary/20 dark:border-primary/30 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span>AI-Powered Resume Builder • 100% Free</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-tight">
            <span className="block">Craft Your Perfect</span>
            <span className="block mt-2 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              Resume in Minutes
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
            Create professional, ATS-friendly resumes that stand out. 
            Choose from beautiful templates, get AI-powered suggestions, 
            and land your dream job faster—all completely free.
          </p>

          {/* CTA Button */}
          <div className="pt-6">
            <Button asChild size="lg" className="group text-lg px-10 py-7 h-auto font-semibold shadow-2xl shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all duration-300">
              <Link href="/sign-up">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {/* Key features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-16 max-w-4xl mx-auto">
            <div className="group flex items-center gap-4 p-5 rounded-xl bg-card/50 dark:bg-card/30 border border-border/50 hover:border-primary/50 hover:bg-card/80 dark:hover:bg-card/50 transition-all duration-300 backdrop-blur-sm">
              <div className="flex-shrink-0 p-2.5 rounded-lg bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">Lightning Fast</p>
                <p className="text-xs text-muted-foreground">Build in minutes</p>
              </div>
            </div>
            <div className="group flex items-center gap-4 p-5 rounded-xl bg-card/50 dark:bg-card/30 border border-border/50 hover:border-primary/50 hover:bg-card/80 dark:hover:bg-card/50 transition-all duration-300 backdrop-blur-sm">
              <div className="flex-shrink-0 p-2.5 rounded-lg bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                <FileCheck className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">ATS Optimized</p>
                <p className="text-xs text-muted-foreground">Pass every scan</p>
              </div>
            </div>
            <div className="group flex items-center gap-4 p-5 rounded-xl bg-card/50 dark:bg-card/30 border border-border/50 hover:border-primary/50 hover:bg-card/80 dark:hover:bg-card/50 transition-all duration-300 backdrop-blur-sm">
              <div className="flex-shrink-0 p-2.5 rounded-lg bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">AI Powered</p>
                <p className="text-xs text-muted-foreground">Smart suggestions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero