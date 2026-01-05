"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import ResumeSidebar from '@/components/resume/ResumeSidebar'
import SectionEditor from '@/components/resume/SectionEditor'
import ResumePreview from '@/components/resume/ResumePreview'
import ValidationDialog from '@/components/resume/ValidationDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save, Menu, X, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { toast } from 'sonner'
import type { personal_details, employment_history, education, projects, resume_section_order } from '@/db/schema'

type ResumeData = {
  personal_details?: personal_details | null
  professional_summary?: string | null
  employment_history?: employment_history[] | null
  education?: education[] | null
  projects?: projects[] | null
  skills?: string[] | null
  languages?: any[] | null
  links?: any | null
  order?: resume_section_order
}

const ResumePage = () => {
  const params = useParams()
  const router = useRouter()
  // Extract UUID from URL: /resume/[resumeId] where resumeId is a UUID
  // Example: /resume/e5515ebe-ebe9-4c95-a42b-cc8c409deb5c
  const resumeId = params.resumeId as string
  const { user } = useAuthStore()
  const [activeSection, setActiveSection] = useState<string>('personal_details')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [skippedSections, setSkippedSections] = useState<Set<string>>(new Set())
  const [showValidationDialog, setShowValidationDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null)
  const [resumeName, setResumeName] = useState<string>('My Resume')
  const [resumeData, setResumeData] = useState<ResumeData>({
    order: [
      'personal_details',
      'skills',
      'employment_history',
      'education',
      'projects',
      'languages',
      'links',
      'professional_summary'
    ]
  })

  // Ref to track if we've loaded imported data to prevent re-fetching
  const hasLoadedImportedData = useRef(false)
  
  // Also use sessionStorage to persist across re-renders
  const getImportedDataFlag = () => {
    return sessionStorage.getItem(`resume_imported_${resumeId}`) === 'true'
  }
  
  const setImportedDataFlag = () => {
    sessionStorage.setItem(`resume_imported_${resumeId}`, 'true')
    hasLoadedImportedData.current = true
  }

  // Fetch resume data on mount
  useEffect(() => {
    let isMounted = true
    
    const fetchResumeData = async () => {
      if (!resumeId) return

      try {
        setIsLoading(true)
        
        // STEP 1: Check for imported resume data in localStorage FIRST
        // This takes priority over database fetch for new imports
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const importKey = `resume_import_${resumeId}`
        const importedData = localStorage.getItem(importKey)
        
        console.log('Checking for imported data with key:', importKey)
        console.log('Found imported data:', importedData ? 'YES' : 'NO')
        
        if (importedData) {
          // Load imported data - this takes priority
          console.log('Loading imported resume data from localStorage')
          try {
            const parsed = JSON.parse(importedData)
            console.log('Parsed imported data:', parsed)
            
            // CRITICAL: Set flag FIRST before anything else to prevent any other code from running
            setImportedDataFlag()
            console.log('✅ Set imported data flag in sessionStorage')
            
            // ALSO store the data in sessionStorage as backup (in case state gets reset)
            sessionStorage.setItem(`resume_data_${resumeId}`, JSON.stringify(parsed))
            console.log('✅ Stored imported data in sessionStorage as backup')
            
            // Clear localStorage IMMEDIATELY to prevent re-reading
            localStorage.removeItem(importKey)
            console.log('Cleared localStorage key:', importKey)
            
            // Set resume data with proper structure including order
            const defaultOrder = [
              'personal_details',
              'professional_summary',
              'skills',
              'employment_history',
              'education',
              'projects',
              'languages',
              'links',
            ]
            
            // Set all state at once to prevent race conditions
            if (isMounted) {
              setResumeData({
                personal_details: parsed.personal_details || null,
                professional_summary: parsed.professional_summary || null,
                employment_history: parsed.employment_history || null,
                education: parsed.education || null,
                projects: parsed.projects || null,
                skills: parsed.skills || null,
                languages: parsed.languages || null,
                links: parsed.links || null,
                order: defaultOrder, // Include order so sectionOrder can be computed
              })
              
              setResumeName(parsed.personal_details?.name ? `${parsed.personal_details.name}'s Resume` : 'My Resume')
              setSkippedSections(new Set())
              setIsLoading(false)
              
              // IMPORTANT: Return early to prevent database fetch
              console.log('✅ Successfully loaded imported data, skipping database fetch')
            }
            return
          } catch (parseError) {
            console.error('Failed to parse imported data:', parseError)
            localStorage.removeItem(importKey)
            // Continue to database fetch if parsing fails
          }
        }
        
        // STEP 2: Check sessionStorage backup (for re-renders)
        if (hasLoadedImportedData.current || getImportedDataFlag()) {
          console.log('Already loaded imported data (from previous render), restoring from sessionStorage')
          
          const backupData = sessionStorage.getItem(`resume_data_${resumeId}`)
          console.log('Backup data found:', backupData ? 'YES' : 'NO')
          
          if (backupData) {
            try {
              const parsed = JSON.parse(backupData)
              console.log('Restoring parsed data:', parsed)
              
              const defaultOrder = [
                'personal_details',
                'professional_summary',
                'skills',
                'employment_history',
                'education',
                'projects',
                'languages',
                'links',
              ]
              
              if (isMounted) {
                setResumeData({
                  personal_details: parsed.personal_details || null,
                  professional_summary: parsed.professional_summary || null,
                  employment_history: parsed.employment_history || null,
                  education: parsed.education || null,
                  projects: parsed.projects || null,
                  skills: parsed.skills || null,
                  languages: parsed.languages || null,
                  links: parsed.links || null,
                  order: defaultOrder,
                })
                
                setResumeName(parsed.personal_details?.name ? `${parsed.personal_details.name}'s Resume` : 'My Resume')
                setSkippedSections(new Set())
                setIsLoading(false)
                console.log('✅ Restored data from sessionStorage backup')
              }
              return
            } catch (e) {
              console.error('Failed to restore from sessionStorage:', e)
              // Clear invalid sessionStorage data
              sessionStorage.removeItem(`resume_imported_${resumeId}`)
              sessionStorage.removeItem(`resume_data_${resumeId}`)
              hasLoadedImportedData.current = false
            }
          } else {
            // Flag is set but no backup data - clear flag and proceed to DB
            console.log('⚠️ Flag set but no backup data, clearing flags and fetching from DB')
            sessionStorage.removeItem(`resume_imported_${resumeId}`)
            sessionStorage.removeItem(`resume_data_${resumeId}`)
            hasLoadedImportedData.current = false
          }
        }
        
        // STEP 3: Fetch from database (only if no imported data found)
        console.log('✅ No imported data found, fetching from database')
        
        const response = await fetch('/api/resume/get', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ resume_id: resumeId }),
        })

        // Check if response has content before parsing
        const text = await response.text()
        let data: any = {}
        
        if (text) {
          try {
            data = JSON.parse(text)
          } catch (parseError) {
            console.error('JSON parse error:', parseError, 'Response text:', text)
            // If parse fails, treat as new resume
            console.log('Invalid response, starting with empty data')
            setIsLoading(false)
            return
          }
        }

        // Handle 404 - resume doesn't exist (new resume)
        if (response.status === 404) {
          console.log('Resume not found, starting with new resume')
          // Start with empty/default data
          setResumeName('My Resume')
          setResumeData({
            order: [
              'personal_details',
              'skills',
              'employment_history',
              'education',
              'projects',
              'languages',
              'links',
              'professional_summary'
            ]
          })
          setSkippedSections(new Set())
          setIsLoading(false)
          return
        }

        // Handle 403 - access denied
        if (response.status === 403) {
          alert('You do not have access to this resume.')
          window.location.href = '/dashboard'
          return
        }

        // Handle other errors
        if (!response.ok) {
          // For other errors, still start with empty data (don't block user)
          console.warn('Error fetching resume, starting with empty data:', data.error || 'Unknown error')
          setResumeName('My Resume')
          setResumeData({
            order: [
              'personal_details',
              'skills',
              'employment_history',
              'education',
              'projects',
              'languages',
              'links',
              'professional_summary'
            ]
          })
          setSkippedSections(new Set())
          setIsLoading(false)
          return
        }

        // Success - load resume data
        // CRITICAL: Check one more time if we've loaded imported data (race condition protection)
        if (hasLoadedImportedData.current || getImportedDataFlag()) {
          console.log('BLOCKED: Database response received but imported data was already loaded, ignoring DB data')
          if (isMounted) {
            setIsLoading(false)
          }
          return
        }
        
        if (data.success && data.resume) {
          const resume = data.resume
          
          // Set resume name
          setResumeName(resume.resume_name || 'My Resume')
          
          // Set resume data
          setResumeData({
            personal_details: resume.personal_details || null,
            professional_summary: resume.professional_summary || null,
            employment_history: resume.employment_history || null,
            education: resume.education || null,
            projects: resume.projects || null,
            skills: resume.skills || null,
            languages: resume.languages || null,
            links: resume.links || null,
            // Use sectionOrder from API (it's now an array, not an object)
            // Ensure personal_details is always first
            order: (() => {
              const apiOrder = resume.sectionOrder || [
                'personal_details',
                'skills',
                'employment_history',
                'education',
                'projects',
                'languages',
                'links',
                'professional_summary'
              ]
              const filtered = apiOrder.filter(s => s !== 'personal_details')
              return ['personal_details', ...filtered]
            })(),
          })

          // Set skipped sections (for backward compatibility)
          if (resume.skippedSections && Array.isArray(resume.skippedSections)) {
            setSkippedSections(new Set(resume.skippedSections))
          } else {
            setSkippedSections(new Set())
          }
        } else if (data.isNew || !data.success) {
          // New resume or failed to load - start with empty data
          console.log('Starting with new resume')
          setResumeName('My Resume')
          setResumeData({
            order: [
              'personal_details',
              'skills',
              'employment_history',
              'education',
              'projects',
              'languages',
              'links',
              'professional_summary'
            ]
          })
          setSkippedSections(new Set())
        }
      } catch (error: any) {
        // On any error, start with empty data (don't block user)
        console.warn('Error fetching resume, starting with empty data:', error.message || 'Unknown error')
        setResumeName('My Resume')
        setResumeData({
          order: [
            'personal_details',
            'skills',
            'employment_history',
            'education',
            'projects',
            'languages',
            'links',
            'professional_summary'
          ]
        })
        setSkippedSections(new Set())
      } finally {
        setIsLoading(false)
      }
    }

    fetchResumeData()
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false
    }
  }, [resumeId])

  // Restore from sessionStorage on every render if flag is set (prevents data loss on re-renders)
  useEffect(() => {
    if (getImportedDataFlag()) {
      const backupData = sessionStorage.getItem(`resume_data_${resumeId}`)
      if (backupData) {
        try {
          const parsed = JSON.parse(backupData)
          // Only restore if current data is empty/default
          if (!resumeData.personal_details && parsed.personal_details) {
            console.log('🔄 Restoring data from sessionStorage on render')
            const defaultOrder = [
              'personal_details',
              'professional_summary',
              'skills',
              'employment_history',
              'education',
              'projects',
              'languages',
              'links',
            ]
            
            setResumeData({
              personal_details: parsed.personal_details || null,
              professional_summary: parsed.professional_summary || null,
              employment_history: parsed.employment_history || null,
              education: parsed.education || null,
              projects: parsed.projects || null,
              skills: parsed.skills || null,
              languages: parsed.languages || null,
              links: parsed.links || null,
              order: defaultOrder,
            })
            
            if (parsed.personal_details?.name) {
              setResumeName(`${parsed.personal_details.name}'s Resume`)
            }
          }
        } catch (e) {
          console.error('Failed to restore on render:', e)
        }
      }
    }
  }, [resumeId, resumeData.personal_details])

  // Default order if not set
  const defaultOrder: resume_section_order = [
    'personal_details',
    'skills',
    'employment_history',
    'education',
    'projects',
    'languages',
    'links',
    'professional_summary'
  ]

  // Ensure personal_details is always first
  const ensurePersonalDetailsFirst = (order: resume_section_order): resume_section_order => {
    const filtered = order.filter(id => id !== 'personal_details')
    return ['personal_details', ...filtered] as resume_section_order
  }

  const sectionOrder = ensurePersonalDetailsFirst(resumeData.order || defaultOrder)

  // Update section data
  const updateSectionData = (section: string, data: any) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data,
    }))
    // If data is added, remove from skipped sections
    if (data && (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0 || typeof data === 'string' && data.trim())) {
      setSkippedSections(prev => {
        const newSet = new Set(prev)
        newSet.delete(section)
        return newSet
      })
    }
  }

  // Handle skip section
  const handleSkipSection = (sectionId: string) => {
    // Don't allow skipping mandatory sections
    if (sectionId === 'personal_details') {
      toast.error('Personal Details is mandatory and cannot be skipped.')
      return
    }

    // Mark section as skipped
    const newSkippedSections = new Set(skippedSections)
    newSkippedSections.add(sectionId)
    setSkippedSections(newSkippedSections)
    
    // Set empty/default data for skipped section
    const defaultData = getDefaultSectionData(sectionId)
    setResumeData(prev => ({
      ...prev,
      [sectionId]: defaultData,
    }))

    // Move to next section
    const currentIndex = sectionOrder.indexOf(sectionId)
    if (currentIndex < sectionOrder.length - 1) {
      // Find next non-skipped section
      for (let i = currentIndex + 1; i < sectionOrder.length; i++) {
        const nextSection = sectionOrder[i]
        if (nextSection === 'personal_details' || !newSkippedSections.has(nextSection)) {
          setActiveSection(nextSection)
          break
        }
      }
    } else {
      // If this is the last section, go back to first non-skipped section
      for (let i = 0; i < sectionOrder.length; i++) {
        const nextSection = sectionOrder[i]
        if (nextSection === 'personal_details' || !newSkippedSections.has(nextSection)) {
          setActiveSection(nextSection)
          break
        }
      }
    }
  }

  // Get default/empty data for a section
  const getDefaultSectionData = (sectionId: string): any => {
    switch (sectionId) {
      case 'professional_summary':
        return ''
      case 'skills':
      case 'employment_history':
      case 'education':
      case 'projects':
      case 'languages':
        return []
      case 'links':
        return {}
      default:
        return null
    }
  }

  // Validate section mandatory fields
  const validateSection = (sectionId: string, data: any): boolean => {
    // If section is skipped, it's valid
    if (skippedSections.has(sectionId)) return true

    switch (sectionId) {
      case 'personal_details':
        const pd = data as personal_details
        return !!(pd?.name && pd?.email)
      
      case 'employment_history':
        const employment = Array.isArray(data) ? data : []
        if (employment.length === 0) return true // Optional if empty
        return employment.every((job: any) => 
          job.company_name && job.position && job.start_date
        )
      
      case 'education':
        const education = Array.isArray(data) ? data : []
        if (education.length === 0) return true // Optional if empty
        return education.every((edu: any) => 
          edu.school_name && edu.degree && edu.field_of_study && edu.start_date
        )
      
      case 'projects':
        const projects = Array.isArray(data) ? data : []
        if (projects.length === 0) return true // Optional if empty
        return projects.every((project: any) => 
          project.project_name && project.description
        )
      
      default:
        // Other sections are optional
        return true
    }
  }

  // Get section display name
  const getSectionName = (sectionId: string): string => {
    const names: Record<string, string> = {
      'personal_details': 'Personal Details',
      'professional_summary': 'Professional Summary',
      'skills': 'Skills',
      'employment_history': 'Employment History',
      'education': 'Education',
      'projects': 'Projects',
      'languages': 'Languages',
      'links': 'Links',
    }
    return names[sectionId] || sectionId
  }

  // Save resume to database
  const saveResumeToDB = async () => {
    if (!user?.user_id) {
      console.error('User not authenticated')
      return
    }

    try {
      const response = await fetch('/api/resume/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeId,
          resumeName,
          resumeData,
          sectionOrder,
          skippedSections: Array.from(skippedSections),
        }),
      })

      // Check if response has content before parsing
      const text = await response.text()
      let data: any = {}
      
      if (text) {
        try {
          data = JSON.parse(text)
        } catch (parseError) {
          console.error('JSON parse error in auto-save:', parseError, 'Response text:', text)
          // If parse fails but response is ok, assume success
          if (response.ok) {
            console.log('Response OK but invalid JSON, assuming success')
            return
          }
          // If not OK and can't parse, log the raw response
          console.error('Failed to parse error response. Raw text:', text)
          throw new Error(`Server error: ${response.status} ${response.statusText}`)
        }
      } else if (response.ok) {
        // Empty response but OK status - assume success
        console.log('Resume auto-saved successfully (empty response)')
        return
      }
      
      if (!response.ok) {
        // Log detailed error for debugging
        console.error('Save resume error response:', {
          status: response.status,
          statusText: response.statusText,
          error: data.error,
          details: data.details,
          code: data.code,
          success: data.success,
          message: data.message,
          fullResponse: data,
          resumeId,
        })
        
        // Build error message from available data
        const errorMessage = data.error || data.details || data.message || `Server error: ${response.status} ${response.statusText}`
        throw new Error(errorMessage)
      }
      
      // Check if response indicates success
      if (data.success === false) {
        console.error('Save returned success:false:', data)
        throw new Error(data.error || data.details || 'Failed to save resume')
      }
      
      console.log('Resume auto-saved successfully')
    } catch (error: any) {
      console.error('Error auto-saving resume:', error)
      // Don't show alert on auto-save to avoid interrupting user flow
      // The error is logged for debugging
      // In production, you might want to queue this for retry
    }
  }

  // Handle navigation with validation
  const handleNavigation = async (targetSection: string) => {
    // CRITICAL: Always check personal_details first - name and email are mandatory
    const personalDetails = resumeData.personal_details as personal_details
    if (!personalDetails?.name || !personalDetails?.email) {
      toast.error('Please fill in your Name and Email in Personal Details before proceeding')
      return
    }

    // If trying to navigate away from personal_details, validate it first
    if (activeSection === 'personal_details') {
      const isValid = validateSection('personal_details', personalDetails)
      if (!isValid) {
        toast.error('Please fill in your Name and Email in Personal Details before proceeding')
        return
      }
    }

    const currentData = resumeData[activeSection as keyof ResumeData]
    const isValid = validateSection(activeSection, currentData)

    if (!isValid && activeSection !== 'personal_details') {
      // Show validation dialog
      setPendingNavigation(() => () => setActiveSection(targetSection))
      setShowValidationDialog(true)
    } else {
      // Save before navigating
      await saveResumeToDB()
      // Proceed with navigation
      setActiveSection(targetSection)
    }
  }

  // Handle skip from validation dialog
  const handleSkipFromDialog = () => {
    if (activeSection !== 'personal_details') {
      handleSkipSection(activeSection)
    }
    setShowValidationDialog(false)
    if (pendingNavigation) {
      pendingNavigation()
      setPendingNavigation(null)
    }
  }

  // Handle save
  const handleSave = async () => {
    if (!user?.user_id) {
      toast.error('Please log in to save your resume.')
      return
    }

    // CRITICAL: Validate personal details (name and email are mandatory)
    const personalDetails = resumeData.personal_details as personal_details
    if (!personalDetails?.name || !personalDetails?.email) {
      toast.error('Please fill in your Name and Email in Personal Details before saving')
      // Navigate to personal_details section
      setActiveSection('personal_details')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/resume/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeId,
          resumeName,
          resumeData,
          sectionOrder,
          skippedSections: Array.from(skippedSections),
        }),
      })

      // Check if response has content before parsing
      const text = await response.text()
      let data: any = {}
      
      if (text) {
        try {
          data = JSON.parse(text)
        } catch (parseError) {
          console.error('JSON parse error in save:', parseError, 'Response text:', text)
          if (response.ok) {
            // If response is OK but JSON is invalid, assume success and redirect
            router.push(`/resume/${resumeId}/create`)
            return
          }
          throw new Error('Invalid response from server')
        }
      } else if (response.ok) {
        // Clear sessionStorage flags after successful save
        sessionStorage.removeItem(`resume_imported_${resumeId}`)
        sessionStorage.removeItem(`resume_data_${resumeId}`)
        hasLoadedImportedData.current = false
        console.log('✅ Cleared sessionStorage flags after successful save (empty response)')
        
        // Empty response but OK status - assume success and redirect
        router.push(`/resume/${resumeId}/create`)
        return
      }
      
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to save resume')
      }
      
      // Clear sessionStorage flags after successful save
      // This ensures next time we load, we fetch from DB instead of sessionStorage
      sessionStorage.removeItem(`resume_imported_${resumeId}`)
      sessionStorage.removeItem(`resume_data_${resumeId}`)
      hasLoadedImportedData.current = false
      console.log('✅ Cleared sessionStorage flags after successful save')
      
      // Save successful - redirect to create page
      router.push(`/resume/${resumeId}/create`)
    } catch (error: any) {
      console.error('Error saving resume:', error)
      alert(error.message || 'Failed to save resume. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading resume...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/10">
      <Header />
      
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden border-b border-border/50 bg-card/95 backdrop-blur-md sticky top-16 z-40 shadow-sm">
        <div className="px-3 py-2.5 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="gap-1.5"
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              <span className="text-xs font-medium">Sections</span>
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="sm"
              className="gap-1.5 text-xs"
            >
              <Save className="h-3.5 w-3.5" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
          <div>
            <Input
              id="resume-name-mobile"
              value={resumeName}
              onChange={(e) => setResumeName(e.target.value)}
              placeholder="My Resume"
              className="h-8 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-72 border-r border-border/50 bg-card/50 backdrop-blur-sm overflow-y-auto">
          {/* Resume Name Input */}
          <div className="p-4 border-b border-border/50 bg-background/50">
            <Label htmlFor="resume-name" className="text-xs font-semibold mb-2 block text-muted-foreground uppercase tracking-wide">
              Resume Name
            </Label>
            <Input
              id="resume-name"
              value={resumeName}
              onChange={(e) => setResumeName(e.target.value)}
              placeholder="My Resume"
              className="w-full font-medium"
            />
          </div>
          <ResumeSidebar
            activeSection={activeSection}
            onSectionChange={(section) => handleNavigation(section)}
            sectionOrder={sectionOrder}
            onReorder={(newOrder) => {
              // Ensure personal_details stays first
              const correctedOrder = ensurePersonalDetailsFirst(newOrder)
              updateSectionData('order', correctedOrder)
            }}
            resumeData={resumeData}
            onSkipSection={handleSkipSection}
            skippedSections={skippedSections}
          />
        </aside>

        {/* Mobile Sidebar */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
            <div className="h-full w-72 border-r border-border/50 bg-card shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-200">
              <div className="p-3 border-b border-border/50 flex items-center justify-between">
                <h3 className="font-semibold text-sm">Resume Sections</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <ResumeSidebar
                activeSection={activeSection}
                onSectionChange={(section) => {
                  handleNavigation(section)
                  setIsMobileMenuOpen(false)
                }}
                sectionOrder={sectionOrder}
                onReorder={(newOrder) => {
                  // Ensure personal_details stays first
                  const correctedOrder = ensurePersonalDetailsFirst(newOrder)
                  updateSectionData('order', correctedOrder)
                }}
                resumeData={resumeData}
                onSkipSection={(section) => {
                  handleSkipSection(section)
                  setIsMobileMenuOpen(false)
                }}
                skippedSections={skippedSections}
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Editor Section */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg sm:text-xl font-bold">{getSectionName(activeSection)}</h2>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {sectionOrder.indexOf(activeSection) + 1} / {sectionOrder.length}
                  </span>
                </div>
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${((sectionOrder.indexOf(activeSection) + 1) / sectionOrder.length) * 100}%` }}
                  />
                </div>
              </div>
              <SectionEditor
                section={activeSection}
                data={resumeData[activeSection as keyof ResumeData]}
                onUpdate={(data) => updateSectionData(activeSection, data)}
                onNext={() => {
                  const currentIndex = sectionOrder.indexOf(activeSection)
                  if (currentIndex < sectionOrder.length - 1) {
                    handleNavigation(sectionOrder[currentIndex + 1])
                  }
                }}
                onBack={() => {
                  const currentIndex = sectionOrder.indexOf(activeSection)
                  if (currentIndex > 0) {
                    // Back navigation doesn't need validation
                    setActiveSection(sectionOrder[currentIndex - 1])
                  }
                }}
                onSkipSection={activeSection !== 'personal_details' ? () => handleSkipSection(activeSection) : undefined}
                allResumeData={resumeData}
              />
            </div>
          </main>

          {/* Preview Section */}
          <aside className="hidden xl:block w-[500px] border-l border-border/50 bg-muted/30 overflow-y-auto p-4">
            <div className="sticky top-4">
              <ResumePreview data={resumeData} order={sectionOrder} />
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Preview Toggle */}
      <div className="xl:hidden fixed bottom-20 right-4 z-40">
        <Button
          onClick={() => {
            // Toggle preview in mobile
            const previewElement = document.getElementById('mobile-preview')
            if (previewElement) {
              previewElement.scrollIntoView({ behavior: 'smooth' })
            }
          }}
          size="lg"
          className="rounded-full shadow-xl gap-2"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Preview
        </Button>
      </div>

      {/* Mobile Preview Section */}
      <div id="mobile-preview" className="xl:hidden border-t border-border/50 bg-muted/20 p-4 sm:p-6">
        <h3 className="text-sm font-semibold mb-4">Resume Preview</h3>
        <ResumePreview data={resumeData} order={sectionOrder} />
      </div>

      {/* Save Button - Desktop */}
      <div className="hidden lg:flex fixed bottom-6 right-6 z-40">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          size="lg"
          className="gap-2 shadow-2xl"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Save Resume
            </>
          )}
        </Button>
      </div>

      {/* Validation Dialog */}
      <ValidationDialog
        open={showValidationDialog}
        onOpenChange={setShowValidationDialog}
        sectionName={getSectionName(activeSection)}
        onSkip={handleSkipFromDialog}
        onCancel={() => {
          setShowValidationDialog(false)
          setPendingNavigation(null)
        }}
      />
    </div>
  )
}

export default ResumePage

