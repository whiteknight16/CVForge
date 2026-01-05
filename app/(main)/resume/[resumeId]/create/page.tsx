"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import Header from '@/components/Header'
import { Loader2, Check } from 'lucide-react'
import ResumePreview from '@/components/resume/ResumePreview'
import type { resume_section_order } from '@/db/schema'
import { templates, fonts, themes } from '@/lib/resume-constants'

const CreateResumePage = () => {
  const params = useParams()
  const router = useRouter()
  const resumeId = params.resumeId as string
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  const [resumeData, setResumeData] = useState<any>(null)
  const [sectionOrder, setSectionOrder] = useState<resume_section_order>([])
  
  // Customization state
  const [selectedTemplate, setSelectedTemplate] = useState('melitta')
  const [selectedFont, setSelectedFont] = useState('garamond')
  const [selectedTheme, setSelectedTheme] = useState('teal')
  const [templateScrollIndex, setTemplateScrollIndex] = useState(0)

  useEffect(() => {
    const fetchResume = async () => {
      if (!resumeId || !user?.user_id) {
        router.push(`/resume/${resumeId}`)
        return
      }

      try {
        setIsLoading(true)
        const response = await fetch('/api/resume/get', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ resume_id: resumeId }),
        })

        const text = await response.text()
        let data: any = {}
        
        if (text) {
          try {
            data = JSON.parse(text)
          } catch (parseError) {
            console.error('JSON parse error:', parseError)
            router.push(`/resume/${resumeId}`)
            return
          }
        }

        if (response.status === 404 || !data.success || !data.resume) {
          router.push(`/resume/${resumeId}`)
          return
        }

        setResumeData(data.resume)
        
        // Build section order from order object
        // Order object format: {sectionName: isSkipped (boolean)}
        // IMPORTANT: personal_details MUST always be first and cannot be skipped
        let orderedSections: resume_section_order = []
        if (data.resume.order && typeof data.resume.order === 'object') {
          const orderObj = data.resume.order as Record<string, boolean>
          // Get all sections in the order they appear in the object, filtering out skipped ones
          const sectionsInOrder = Object.keys(orderObj).filter(key => orderObj[key] === false)
          // ALWAYS ensure personal_details is first, regardless of order object
          // Remove personal_details from wherever it might be, then add it at the start
          const otherSections = sectionsInOrder.filter(s => s !== 'personal_details')
          orderedSections = [
            'personal_details', // Always first - highest priority
            ...otherSections
          ] as resume_section_order
        } else {
          // Default order if no order object - personal_details always first
          orderedSections = [
            'personal_details', // Always first - highest priority
            'skills',
            'employment_history',
            'education',
            'projects',
            'languages',
            'links',
            'professional_summary'
          ]
        }
        setSectionOrder(orderedSections)
      } catch (error: any) {
        console.error('Error fetching resume:', error)
        router.push(`/resume/${resumeId}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResume()
  }, [resumeId, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Header />
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!resumeData) {
    return null
  }

  // Get selected values
  const selectedFontFamily = fonts.find(f => f.id === selectedFont)?.family || 'Garamond, serif'
  const selectedThemeData = themes.find(t => t.id === selectedTheme) || themes[2] // Default to teal
  const selectedTemplateStyle = templates.find(t => t.id === selectedTemplate)?.style || 'classic'

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-120px)]">
          {/* Left Side - Resume Preview - Always light mode, scaled down */}
          <div className="lg:sticky lg:top-24 h-full overflow-y-auto">
            <div 
              className="rounded-lg shadow-xl p-6 min-h-full"
              style={{ 
                backgroundColor: selectedThemeData.bgColor,
                color: selectedThemeData.textColor,
                // Force light mode - override any dark mode styles
                colorScheme: 'light',
                transform: 'scale(0.85)',
                transformOrigin: 'top left',
                width: '117.65%', // Compensate for scale (100 / 0.85)
              }}
            >
              <ResumePreview 
                data={resumeData} 
                order={sectionOrder}
                fontFamily={selectedFontFamily}
                color={selectedThemeData.textColor}
                templateStyle={selectedTemplateStyle}
              />
            </div>
          </div>

          {/* Right Side - Customization Panel */}
          <div className="h-full overflow-y-auto">
            <div className="bg-card border border-border rounded-lg shadow-lg p-6">
              {/* All customization options visible */}
              <div className="space-y-8">
                {/* Styles Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Choose a Template</h3>
                  <div className="flex flex-wrap gap-3">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`relative px-4 py-2 rounded-lg border-2 transition-all flex items-center gap-2 ${
                          selectedTemplate === template.id
                            ? 'border-primary bg-primary/10 text-primary font-semibold shadow-md'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <span>{template.name}</span>
                        {selectedTemplate === template.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fonts Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Choose a Font</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {fonts.map((font) => (
                      <button
                        key={font.id}
                        onClick={() => setSelectedFont(font.id)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          selectedFont === font.id
                            ? 'border-primary bg-primary/10 shadow-md'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="mb-2">
                          <p className="font-bold text-lg mb-1" style={{ fontFamily: font.family }}>
                            {font.name}
                          </p>
                          <p className="text-sm text-muted-foreground" style={{ fontFamily: font.family }}>
                            The quick brown fox jumps over the lazy dog
                          </p>
                        </div>
                        {selectedFont === font.id && (
                          <div className="flex items-center justify-end mt-2">
                            <Check className="h-5 w-5 text-primary" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Themes Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Choose a Theme</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {themes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setSelectedTheme(theme.id)}
                        className={`relative p-4 rounded-lg border-2 transition-all ${
                          selectedTheme === theme.id
                            ? 'border-primary shadow-lg ring-2 ring-primary/20'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div 
                            className="w-8 h-8 rounded border border-border"
                            style={{ backgroundColor: theme.bgColor }}
                          />
                          <div 
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: theme.textColor }}
                          />
                        </div>
                        <p className="text-sm font-medium">{theme.name}</p>
                        {selectedTheme === theme.id && (
                          <div className="absolute top-2 right-2">
                            <Check className="h-5 w-5 text-primary" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    Selected: <span className="font-semibold">{selectedThemeData.name}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CreateResumePage
