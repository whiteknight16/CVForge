"use client"

import React, { useState } from 'react'
import { 
  User, Phone, FileText, Briefcase, GraduationCap, 
  Lightbulb, Globe, Link as LinkIcon, GripVertical, 
  CheckCircle2, Circle, SkipForward
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { resume_section_order } from '@/db/schema'

interface Section {
  id: string
  name: string
  icon: React.ElementType
  mandatory: boolean
  canSkip: boolean
}

const sections: Section[] = [
  { id: 'personal_details', name: 'Personal Details', icon: User, mandatory: true, canSkip: false },
  { id: 'professional_summary', name: 'Professional Summary', icon: FileText, mandatory: false, canSkip: true },
  { id: 'skills', name: 'Skills', icon: Lightbulb, mandatory: false, canSkip: true },
  { id: 'employment_history', name: 'Employment History', icon: Briefcase, mandatory: false, canSkip: true },
  { id: 'education', name: 'Education', icon: GraduationCap, mandatory: false, canSkip: true },
  { id: 'projects', name: 'Projects', icon: FileText, mandatory: false, canSkip: true },
  { id: 'languages', name: 'Languages', icon: Globe, mandatory: false, canSkip: true },
  { id: 'links', name: 'Links', icon: LinkIcon, mandatory: false, canSkip: true },
]

interface ResumeSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  sectionOrder: resume_section_order
  onReorder: (newOrder: resume_section_order) => void
  resumeData: any
  onSkipSection: (section: string) => void
  skippedSections?: Set<string>
}

const ResumeSidebar: React.FC<ResumeSidebarProps> = ({
  activeSection,
  onSectionChange,
  sectionOrder,
  onReorder,
  resumeData,
  onSkipSection,
  skippedSections = new Set(),
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleDragStart = (index: number) => {
    // Don't allow dragging if it's personal_details (always at index 0)
    if (index === 0 && orderedSections[index]?.id === 'personal_details') {
      return
    }
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null) return
    
    // Don't allow dropping at index 0 (personal_details position)
    if (index === 0) return
    
    // Don't allow dragging personal_details
    if (draggedIndex === 0 && orderedSections[draggedIndex]?.id === 'personal_details') {
      return
    }

    if (draggedIndex !== index) {
      const newOrder = [...sectionOrder] as resume_section_order
      const draggedItem = newOrder[draggedIndex]
      
      // Ensure personal_details stays at index 0
      if (draggedItem === 'personal_details' || newOrder[0] !== 'personal_details') {
        return
      }
      
      newOrder.splice(draggedIndex, 1)
      // Insert at index, but ensure we don't go before personal_details
      const insertIndex = Math.max(1, index > draggedIndex ? index - 1 : index)
      newOrder.splice(insertIndex, 0, draggedItem)
      onReorder(newOrder)
      setDraggedIndex(insertIndex)
    }
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const isSectionCompleted = (sectionId: string) => {
    // If section is skipped, it's considered "completed" (no need to fill)
    if (skippedSections.has(sectionId)) return true
    
    const data = resumeData[sectionId]
    if (!data) return false
    
    // Check if section has data
    if (Array.isArray(data)) {
      // For arrays, check if it has valid entries
      // For languages, ensure entries are objects with valid properties
      if (data.length === 0) return false
      if (sectionId === 'languages') {
        // For languages, check if at least one entry has a language property
        return data.some((lang: any) => {
          if (!lang || typeof lang !== 'object') return false
          const languageName = typeof lang.language === 'string' ? lang.language : (lang.language ? String(lang.language) : '')
          return languageName && languageName.trim() !== ''
        })
      }
      return data.length > 0
    }
    if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
      // For objects, check if it has meaningful keys
      const keys = Object.keys(data)
      if (keys.length === 0) return false
      // For personal_details, check if name and email exist
      if (sectionId === 'personal_details') {
        return !!(data.name && data.email)
      }
      return keys.length > 0
    }
    // For strings (like professional_summary), check if not empty
    if (typeof data === 'string') {
      return data.trim().length > 0
    }
    return !!data
  }

  const isSectionSkipped = (sectionId: string) => {
    return skippedSections.has(sectionId)
  }

  const orderedSections = sectionOrder.map(id => 
    sections.find(s => s.id === id)
  ).filter(Boolean) as Section[]

  return (
    <div className="p-4 space-y-2">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Resume Sections
        </h2>
      </div>

      {orderedSections.map((section, index) => {
        const Icon = section.icon
        const isActive = activeSection === section.id
        const isCompleted = isSectionCompleted(section.id)
        const isSkipped = isSectionSkipped(section.id)

        return (
          <div
            key={section.id}
            draggable={!section.mandatory && section.id !== 'personal_details' && index !== 0}
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`group relative flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${
              isActive
                ? 'bg-primary/10 border-2 border-primary'
                : 'bg-card/50 hover:bg-card border-2 border-transparent'
            } ${draggedIndex === index ? 'opacity-50' : ''} ${section.id === 'personal_details' ? 'cursor-default' : ''}`}
            onClick={() => onSectionChange(section.id)}
          >
            {/* Drag Handle */}
            {!section.mandatory && section.id !== 'personal_details' && (
              <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            )}

            {/* Icon */}
            <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />

            {/* Section Name */}
            <span className={`flex-1 text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
              {section.name}
            </span>

            {/* Status Indicators */}
            <div className="flex items-center gap-1">
              {isSkipped ? (
                <span className="text-xs text-muted-foreground italic">Skipped</span>
              ) : isCompleted ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground" />
              )}
              
              {section.canSkip && !isSkipped && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-6 w-6 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}
                  onClick={(e) => {
                    e.stopPropagation()
                    onSkipSection(section.id)
                  }}
                  title="Skip this section"
                >
                  <SkipForward className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Mandatory Badge */}
            {section.mandatory && (
              <span className="text-xs text-destructive font-medium">*</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ResumeSidebar

