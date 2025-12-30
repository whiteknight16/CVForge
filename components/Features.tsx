"use client"

import React from 'react'
import { FileText, Palette, Download, Shield, Sparkles, Target } from 'lucide-react'

const features = [
  {
    icon: FileText,
    title: "Professional Templates",
    description: "Choose from dozens of professionally designed templates that work for any industry or career level."
  },
  {
    icon: Sparkles,
    title: "AI-Powered Suggestions",
    description: "Get intelligent recommendations to improve your resume content and make it more impactful."
  },
  {
    icon: Target,
    title: "ATS-Friendly Format",
    description: "All templates are optimized to pass Applicant Tracking Systems used by most employers."
  },
  {
    icon: Palette,
    title: "Customizable Design",
    description: "Easily customize colors, fonts, and layouts to match your personal brand and style."
  },
  {
    icon: Download,
    title: "Multiple Export Formats",
    description: "Download your resume as PDF, Word, or share it online with a professional link."
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data is secure and private. We never share your information with third parties."
  }
]

const Features = () => {
  return (
    <section id="features" className="py-24 md:py-32 bg-gradient-to-b from-muted/30 via-background to-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
            Everything You Need to Build
            <span className="block mt-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              the Perfect Resume
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Powerful features designed to help you create a resume that gets you noticed
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-card/50 dark:bg-card/30 border border-border/50 hover:border-primary/50 hover:bg-card/80 dark:hover:bg-card/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 backdrop-blur-sm"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-3.5 rounded-xl bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-all duration-300 group-hover:scale-110">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold pt-1">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-[15px]">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Features

