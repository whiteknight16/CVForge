"use client"

import React, { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import Header from '@/components/Header'
import { Loader2, Check, Download, Save, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ResumePreview from '@/components/resume/ResumePreview'
import type { resume_section_order } from '@/db/schema'
import { templates, fonts, themes } from '@/lib/resume-constants'
import { toast } from 'sonner'

const CreateResumePage = () => {
  const params = useParams()
  const router = useRouter()
  const resumeId = params.resumeId as string
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  const [resumeData, setResumeData] = useState<any>(null)
  const [sectionOrder, setSectionOrder] = useState<resume_section_order>([])
  const [isDownloading, setIsDownloading] = useState(false)
  
  // Customization state
  const [selectedTemplate, setSelectedTemplate] = useState('melitta')
  const [selectedFont, setSelectedFont] = useState('times')
  const [selectedTheme, setSelectedTheme] = useState('classic')
  const [templateScrollIndex, setTemplateScrollIndex] = useState(0)
  
  // Ref for the resume preview container
  const resumePreviewRef = useRef<HTMLDivElement>(null)

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

        // Structure the resume data for ResumePreview component
        // The API returns data.resume with all fields, which is what ResumePreview expects
        const resume = data.resume
        setResumeData({
          personal_details: resume.personal_details || null,
          professional_summary: resume.professional_summary || null,
          employment_history: resume.employment_history || null,
          education: resume.education || null,
          projects: resume.projects || null,
          skills: resume.skills || null,
          languages: resume.languages || null,
          links: resume.links || null,
        })
        
        // Load customization settings if they exist
        if (resume.customization) {
          if (resume.customization.template) {
            setSelectedTemplate(resume.customization.template)
          }
          if (resume.customization.font) {
            setSelectedFont(resume.customization.font)
          }
          if (resume.customization.theme) {
            setSelectedTheme(resume.customization.theme)
          }
        }
        
        // Build section order from order array or sectionOrder
        // The API might return sectionOrder directly, or we need to use order
        let orderedSections: resume_section_order = []
        
        // Check if API returned sectionOrder directly
        if (resume.sectionOrder && Array.isArray(resume.sectionOrder)) {
          orderedSections = resume.sectionOrder as resume_section_order
        } else if (resume.order) {
          // Use order from database
          if (Array.isArray(resume.order)) {
            // New format: array of section names
            orderedSections = resume.order as resume_section_order
          } else if (typeof resume.order === 'object') {
            // Legacy format: object with {sectionName: isSkipped}
            // Convert to array format for backward compatibility
            const orderObj = resume.order as Record<string, boolean>
            const sectionsInOrder = Object.keys(orderObj).filter(key => orderObj[key] === false)
            orderedSections = sectionsInOrder as resume_section_order
          }
        }
        
        // ALWAYS ensure personal_details is first
        const filteredOrder = orderedSections.filter(s => s !== 'personal_details')
        orderedSections = ['personal_details', ...filteredOrder] as resume_section_order
        
        // If still no order, use default
        if (orderedSections.length === 0 || (orderedSections.length === 1 && orderedSections[0] === 'personal_details')) {
          orderedSections = [
            'personal_details',
            'skills',
            'employment_history',
            'education',
            'projects',
            'languages',
            'links',
            'professional_summary'
          ] as resume_section_order
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

  // Print to PDF (uses browser's native print dialog)
  const handlePrintPDF = () => {
    // Create a print-friendly window
    const printWindow = window.open('', '_blank')
    if (!printWindow || !resumePreviewRef.current) return

    const resumeContent = getCleanResumeContent()
    if (!resumeContent) return
    
    const selectedFontValue = fonts.find(f => f.id === selectedFont)?.family || 'Times New Roman'
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${resumeData?.resume_name || 'Resume'}</title>
          <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600;700&display=swap" rel="stylesheet">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: '${selectedFontValue}', sans-serif !important;
              background: white;
              padding: 0;
              margin: 0;
            }
            * {
              font-family: '${selectedFontValue}', sans-serif !important;
            }
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              @page {
                margin: 0.5in;
                size: A4;
              }
            }
            .resume-container {
              max-width: 8.5in;
              margin: 0 auto !important;
              background: white !important;
              padding: 2rem !important;
              font-family: '${selectedFontValue}', serif !important;
            }
            .resume-container * {
              font-family: '${selectedFontValue}', serif !important;
            }
            a {
              color: inherit !important;
              text-decoration: underline !important;
            }
            /* Clean print output - no shadows or boxes */
            @media print {
              .resume-container {
                box-shadow: none !important;
                border: none !important;
                padding: 0 !important;
                margin: 0 !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="resume-container">
            ${resumeContent}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  // Helper to get only the inner resume content (without wrapper styles)
  const getCleanResumeContent = () => {
    if (!resumePreviewRef.current) return null
    
    // Clone the element
    const clonedElement = resumePreviewRef.current.cloneNode(true) as HTMLElement
    
    // Copy computed styles to inline
    const copyStylesToInline = (element: HTMLElement, originalElement: HTMLElement) => {
      const computedStyles = window.getComputedStyle(originalElement)
      
      const stylesToCopy = [
        'color', 'font-size', 'font-weight', 'font-family', 'text-align', 
        'line-height', 'text-transform', 'letter-spacing', 'text-decoration',
        'display', 'flex', 'flex-direction', 'flex-wrap', 'justify-content', 
        'align-items', 'align-content', 'gap', 'width', 'min-width', 'max-width',
        'height', 'min-height', 'max-height',
        'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
        'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
        'background', 'background-color', 
        'border', 'border-top', 'border-right', 'border-bottom', 'border-left',
        'border-radius', 'border-color', 'border-width', 'border-style',
        'opacity', 'overflow', 'overflow-x', 'overflow-y'
      ]
      
      stylesToCopy.forEach(prop => {
        const value = computedStyles.getPropertyValue(prop)
        if (value && value !== '' && value !== 'none' && value !== 'normal' && value !== 'auto') {
          element.style.setProperty(prop, value, 'important')
        }
      })
      
      const children = element.children
      const originalChildren = originalElement.children
      for (let i = 0; i < children.length; i++) {
        if (children[i] instanceof HTMLElement && originalChildren[i] instanceof HTMLElement) {
          copyStylesToInline(children[i] as HTMLElement, originalChildren[i] as HTMLElement)
        }
      }
    }
    
    copyStylesToInline(clonedElement, resumePreviewRef.current)
    return clonedElement.innerHTML
  }

  // Download as HTML
  const handleDownloadHTML = () => {
    if (!resumePreviewRef.current) return
    
    try {
      setIsDownloading(true)
      
      const resumeContent = getCleanResumeContent()
      if (!resumeContent) return
      
      const selectedFontValue = fonts.find(f => f.id === selectedFont)?.family || 'Times New Roman'
      
      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${resumeData?.resume_name || 'Resume'}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Roboto:wght@400;500;700&family=Playfair+Display:wght@400;600;700&family=Montserrat:wght@400;600;700&family=Lora:wght@400;600;700&family=Crimson+Text:wght@400;600;700&family=Source+Sans+Pro:wght@400;600;700&family=Merriweather:wght@400;700&family=Open+Sans:wght@400;600;700&family=Libre+Baskerville:wght@400;700&family=EB+Garamond:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: '${selectedFontValue}', serif !important;
      background: white;
      padding: 0;
      margin: 0;
      line-height: 1.6;
    }
    body > div {
      max-width: 8.5in;
      margin: 0 auto !important;
      background: white !important;
      padding: 2rem !important;
      font-family: '${selectedFontValue}', serif !important;
    }
    body * {
      font-family: '${selectedFontValue}', serif !important;
    }
    a {
      color: inherit !important;
      text-decoration: underline !important;
    }
    @media print {
      body { 
        padding: 0; 
        background: white; 
        margin: 0;
      }
      body > div { 
        box-shadow: none !important;
        border: none !important;
        padding: 0.5in !important;
        margin: 0 !important;
      }
      @page { 
        margin: 0.5in; 
        size: A4; 
      }
    }
  </style>
</head>
<body>
  <div class="resume-container">
    ${resumeContent}
  </div>
</body>
</html>
      `.trim()
      
      // Create blob and download
      const blob = new Blob([htmlContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${resumeData?.resume_name || 'resume'}.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading HTML:', error)
      alert('Failed to download HTML. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }


  // Download as PDF (direct approach using print dialog)
  const handleDownloadPDF = async () => {
    if (!resumePreviewRef.current) return
    
    try {
      setIsDownloading(true)
      
      // Use print dialog which is more reliable
      handlePrintPDF()
      
      // Show user instruction
      setTimeout(() => {
        toast.info('Use "Save as PDF" in the print dialog to save your resume')
      }, 100)
    } catch (error) {
      console.error('Error downloading PDF:', error)
      toast.error('Failed to open print dialog. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  // Handle save - saves customization settings
  const handleSave = async () => {
    if (!user?.user_id || !resumeId) {
      toast.error('Please log in to save your resume')
      return
    }

    try {
      const customization = {
        template: selectedTemplate,
        font: selectedFont,
        theme: selectedTheme,
      }

      const response = await fetch('/api/resume/save-customization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeId,
          customization,
        }),
      })

      if (response.ok) {
        toast.success('Resume customization saved successfully!')
      } else {
        toast.error('Failed to save customization. Please try again.')
      }
    } catch (error) {
      console.error('Error saving customization:', error)
      toast.error('An error occurred while saving. Please try again.')
    }
  }

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
              <div ref={resumePreviewRef}>
                <ResumePreview 
                  data={resumeData} 
                  order={sectionOrder}
                  fontFamily={selectedFontFamily}
                  color={selectedThemeData.textColor}
                  templateStyle={selectedTemplateStyle}
                />
              </div>
            </div>
          </div>

          {/* Right Side - Customization Panel */}
          <div className="h-full overflow-y-auto">
            <div className="bg-card border border-border rounded-lg shadow-lg p-6">
              {/* Action Buttons */}
              <div className="mb-6 pb-6 border-b border-border">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Button
                      onClick={handlePrintPDF}
                      disabled={isDownloading}
                      className="w-full"
                      size="lg"
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Opening...
                        </>
                      ) : (
                        <>
                          <Printer className="mr-2 h-4 w-4" />
                          Print / Save as PDF
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="flex-1">
                    <Button
                      onClick={handleSave}
                      variant="secondary"
                      className="w-full"
                      size="lg"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Resume
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* All customization options visible */}
              <div className="space-y-6">
                {/* Styles Section */}
                <div>
                  <h3 className="text-base font-semibold mb-3">Choose a Template</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`relative px-3 py-2 rounded-lg border transition-all group ${
                          selectedTemplate === template.id
                            ? 'border-primary bg-primary/10 shadow-sm'
                            : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1.5">
                          <div className="text-left min-w-0 flex-1">
                            <p className={`text-sm font-medium truncate ${
                              selectedTemplate === template.id ? 'text-primary' : ''
                            }`}>
                              {template.name}
                            </p>
                            {template.description && (
                              <p className="text-xs text-muted-foreground truncate">
                                {template.description}
                              </p>
                            )}
                          </div>
                          {selectedTemplate === template.id && (
                            <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fonts Section */}
                <div>
                  <h3 className="text-base font-semibold mb-3">Choose a Font</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {fonts.map((font) => (
                      <button
                        key={font.id}
                        onClick={() => setSelectedFont(font.id)}
                        className={`p-3 rounded-lg border transition-all text-left ${
                          selectedFont === font.id
                            ? 'border-primary bg-primary/10 shadow-sm'
                            : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm mb-0.5" style={{ fontFamily: font.family }}>
                              {font.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate" style={{ fontFamily: font.family }}>
                              The quick brown fox
                            </p>
                          </div>
                          {selectedFont === font.id && (
                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Themes Section */}
                <div>
                  <h3 className="text-base font-semibold mb-3">Choose a Color</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {themes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setSelectedTheme(theme.id)}
                        className={`relative p-3 rounded-lg border transition-all ${
                          selectedTheme === theme.id
                            ? 'border-primary shadow-sm ring-1 ring-primary/20'
                            : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <div 
                            className="w-6 h-6 rounded border border-border flex-shrink-0"
                            style={{ backgroundColor: theme.bgColor }}
                          />
                          <div 
                            className="w-5 h-5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: theme.textColor }}
                          />
                        </div>
                        <p className="text-xs font-medium">{theme.name}</p>
                        {selectedTheme === theme.id && (
                          <div className="absolute top-1.5 right-1.5">
                            <Check className="h-3.5 w-3.5 text-primary" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Selected: <span className="font-medium">{selectedThemeData.name}</span>
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
