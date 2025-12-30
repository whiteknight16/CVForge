"use client"

import React from 'react'
import { UserPlus, FileEdit, Download, CheckCircle2 } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create Your Account",
    description: "Sign up in seconds with just your email. No credit card required to get started."
  },
  {
    number: "02",
    icon: FileEdit,
    title: "Build Your Resume",
    description: "Fill in your details using our intuitive editor. Get AI suggestions as you type."
  },
  {
    number: "03",
    icon: CheckCircle2,
    title: "Review & Optimize",
    description: "Use our built-in ATS checker to ensure your resume passes automated screenings."
  },
  {
    number: "04",
    icon: Download,
    title: "Download & Apply",
    description: "Export your professional resume in PDF or Word format and start applying."
  }
]

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
            How It Works
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Get your professional resume ready in just four simple steps
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative">
            {/* Connection line for desktop */}
            <div className="hidden lg:block absolute top-16 left-24 right-24 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -z-10" />
            
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="relative group">
                  <div className="flex flex-col items-center text-center space-y-6">
                    {/* Step number badge */}
                    <div className="relative z-10">
                      <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border-2 border-primary/20 dark:border-primary/30 flex items-center justify-center group-hover:scale-110 group-hover:border-primary/40 dark:group-hover:border-primary/50 transition-all duration-300 shadow-lg shadow-primary/5 group-hover:shadow-primary/10">
                        <Icon className="h-12 w-12 text-primary" />
                      </div>
                      {/* Step number background */}
                      <div className="absolute -top-4 -left-4 -z-10 text-7xl font-black text-muted/10 dark:text-muted/5 select-none">
                        {step.number}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3 pt-2">
                      <h3 className="text-xl font-bold">{step.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed max-w-[200px]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* CTA */}
          <div className="text-center mt-20">
            <Button asChild size="lg" className="text-lg px-10 py-7 h-auto font-semibold shadow-2xl shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all duration-300">
              <Link href="/sign-up">
                Get Started Free
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks

