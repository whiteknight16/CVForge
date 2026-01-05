"use client"

import React from 'react'
import type { resume_section_order } from '@/db/schema'

interface ResumePreviewProps {
  data: any
  order: resume_section_order
  fontFamily?: string
  color?: string
  templateStyle?: string
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, order, fontFamily, color, templateStyle = 'classic' }) => {
  const textColor = color || 'inherit'
  
  /**
   * HOW TEMPLATE STYLES WORK:
   * 
   * 1. The `templateStyle` prop (e.g., 'classic', 'modern', 'professional') is passed from the create page
   * 2. `getTemplateStyles()` returns a style configuration object based on the template:
   *    - layout: 'single' or 'two-column' (affects overall structure)
   *    - headerAlignment: 'left' or 'center' (affects section header alignment)
   *    - sectionHeaderStyle: CSS classes for section headers (borders, padding, etc.)
   *    - nameStyle: CSS classes for the name (size, alignment, weight, etc.)
   *    - namePosition: 'top-left', 'top-center', or 'top-right' (for layout positioning)
   *    - nameSize: Tailwind text size class
   * 
   * 3. These styles are then applied to:
   *    - renderPersonalDetails(): Uses nameStyle, namePosition, layout
   *    - All section headers: Use sectionHeaderStyle and headerAlignment
   *    - Two-column layouts: Special handling for professional template
   * 
   * 4. The styles cascade through all sections, giving each template a unique visual identity
   */
  const getTemplateStyles = () => {
    switch (templateStyle) {
      case 'modern':
        return {
          layout: 'single',
          headerAlignment: 'left',
          sectionHeaderStyle: 'border-l-4 pl-3',
          nameStyle: 'text-left text-3xl',
          namePosition: 'top-left',
          nameSize: 'text-3xl',
        }
      case 'professional':
        return {
          layout: 'two-column',
          headerAlignment: 'left',
          sectionHeaderStyle: 'border-b-2 uppercase tracking-wide',
          nameStyle: 'text-right text-4xl font-bold',
          namePosition: 'top-right',
          nameSize: 'text-4xl',
        }
      case 'elegant':
        return {
          layout: 'single',
          headerAlignment: 'center',
          sectionHeaderStyle: 'border-b border-double pb-2',
          nameStyle: 'text-center italic text-3xl',
          namePosition: 'top-center',
          nameSize: 'text-3xl',
        }
      case 'academic':
        return {
          layout: 'single',
          headerAlignment: 'left',
          sectionHeaderStyle: 'border-b pb-1',
          nameStyle: 'text-left text-2xl',
          namePosition: 'top-left',
          nameSize: 'text-2xl',
        }
      case 'creative':
        return {
          layout: 'single',
          headerAlignment: 'center',
          sectionHeaderStyle: 'border-b-2 border-dashed pb-2',
          nameStyle: 'text-center text-3xl uppercase tracking-widest',
          namePosition: 'top-center',
          nameSize: 'text-3xl',
        }
      case 'minimal':
        return {
          layout: 'single',
          headerAlignment: 'left',
          sectionHeaderStyle: '',
          nameStyle: 'text-left text-2xl font-light',
          namePosition: 'top-left',
          nameSize: 'text-2xl',
        }
      case 'executive':
        return {
          layout: 'single',
          headerAlignment: 'left',
          sectionHeaderStyle: 'border-b-4 pb-2 uppercase font-bold',
          nameStyle: 'text-left text-4xl font-black uppercase',
          namePosition: 'top-left',
          nameSize: 'text-4xl',
        }
      default: // classic
        return {
          layout: 'single',
          headerAlignment: 'center',
          sectionHeaderStyle: 'border-b-2 pb-1',
          nameStyle: 'text-center text-3xl uppercase tracking-wide',
          namePosition: 'top-center',
          nameSize: 'text-3xl',
        }
    }
  }
  
  const templateStyles = getTemplateStyles()
  const isTwoColumn = templateStyles.layout === 'two-column'
  
  const renderPersonalDetails = () => {
    const pd = data.personal_details
    if (!pd || !pd.name) return null

    // For two-column layout, name goes in right column
    if (isTwoColumn) {
      return (
        <div className="mb-6 flex">
          <div className="flex-1"></div>
          <div className="flex-1 text-right" style={{ color: textColor }}>
            <h1 className={`${templateStyles.nameStyle} mb-1`} style={{ color: textColor }}>
              {pd.name.toUpperCase()}
            </h1>
          </div>
        </div>
      )
    }

    // Single column layout
    return (
      <div className={`mb-6 ${templateStyles.headerAlignment === 'center' ? 'text-center' : 'text-left'}`} style={{ color: textColor }}>
        <h1 className={`${templateStyles.nameStyle} mb-1`} style={{ color: textColor }}>
          {pd.name}
        </h1>
        <div className={`flex flex-wrap items-center gap-3 text-sm ${templateStyles.headerAlignment === 'center' ? 'justify-center' : 'justify-start'}`} style={{ color: textColor, opacity: 0.8 }}>
          {pd.email && <span>{pd.email}</span>}
          {pd.phone && <span>• {pd.phone}</span>}
          {pd.address && <span>• {pd.address}</span>}
          {pd.city && pd.state && <span>• {pd.city}, {pd.state}</span>}
          {pd.country && <span>• {pd.country}</span>}
        </div>
      </div>
    )
  }

  const renderProfessionalSummary = () => {
    // Handle both string and object cases
    let summary = ''
    if (typeof data.professional_summary === 'string') {
      summary = data.professional_summary
    } else if (data.professional_summary && typeof data.professional_summary === 'object') {
      summary = String(data.professional_summary)
    }
    
    if (!summary || summary.trim() === '' || summary === '[object Object]') return null

    return (
      <div className="mb-6" style={{ color: textColor }}>
        <h2 className={`text-lg font-semibold mb-2 pb-1 ${templateStyles.sectionHeaderStyle}`} style={{ color: textColor, borderColor: textColor }}>
          Professional Summary
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: textColor, opacity: 0.9 }}>
          {summary}
        </p>
      </div>
    )
  }

  const renderSkills = () => {
    const skills = Array.isArray(data.skills) ? data.skills : []
    if (skills.length === 0) return null

    return (
      <div className="mb-6">
        <h2 className={`text-lg font-semibold mb-2 pb-1 ${templateStyles.sectionHeaderStyle}`} style={{ color: textColor, borderColor: textColor }}>
          Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill: string, index: number) => (
            <span
              key={index}
              className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    )
  }

  const renderEmploymentHistory = () => {
    const employment = Array.isArray(data.employment_history) ? data.employment_history : []
    if (employment.length === 0) return null

    return (
      <div className={`mb-6 ${isTwoColumn ? 'flex' : ''}`}>
        <div className={isTwoColumn ? 'flex-1 pr-4' : ''}>
          <h2 className={`text-lg font-semibold mb-3 ${templateStyles.sectionHeaderStyle || 'border-b pb-1'}`} style={{ color: textColor, borderColor: textColor }}>
            {isTwoColumn ? 'EMPLOYMENT HISTORY' : 'Employment History'}
          </h2>
        </div>
        <div className={isTwoColumn ? 'flex-1' : ''}>
          <div className="space-y-4">
            {employment.map((job: any, index: number) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold" style={{ color: textColor }}>{job.position}</h3>
                    <p className="text-sm" style={{ color: textColor, opacity: 0.8 }}>{job.company_name}</p>
                  </div>
                  <div className="text-sm text-right" style={{ color: textColor, opacity: 0.7 }}>
                    {job.start_date && (
                      <span>{new Date(job.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    )}
                    {job.end_date ? (
                      <span> - {new Date(job.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    ) : (
                      <span> - Present</span>
                    )}
                  </div>
                </div>
                {job.description && (
                  <p className="text-sm mt-2" style={{ color: textColor, opacity: 0.9 }}>{job.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderEducation = () => {
    const education = Array.isArray(data.education) ? data.education : []
    if (education.length === 0) return null

    return (
      <div className={`mb-6 ${isTwoColumn ? 'flex' : ''}`}>
        <div className={isTwoColumn ? 'flex-1 pr-4' : ''}>
          <h2 className={`text-lg font-semibold mb-3 ${templateStyles.sectionHeaderStyle || 'border-b pb-1'}`} style={{ color: textColor, borderColor: textColor }}>
            {isTwoColumn ? 'EDUCATION' : 'Education'}
          </h2>
        </div>
        <div className={isTwoColumn ? 'flex-1' : ''}>
          <div className="space-y-4">
            {education.map((edu: any, index: number) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold" style={{ color: textColor }}>{edu.degree}</h3>
                    <p className="text-sm" style={{ color: textColor, opacity: 0.8 }}>{edu.school_name}</p>
                    {edu.field_of_study && (
                      <p className="text-sm" style={{ color: textColor, opacity: 0.8 }}>{edu.field_of_study}</p>
                    )}
                  </div>
                  <div className="text-sm text-right" style={{ color: textColor, opacity: 0.7 }}>
                    {edu.start_date && (
                      <span>{new Date(edu.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    )}
                    {edu.end_date && (
                      <span> - {new Date(edu.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    )}
                  </div>
                </div>
                {edu.description && (
                  <p className="text-sm mt-2" style={{ color: textColor, opacity: 0.9 }}>{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderProjects = () => {
    const projects = Array.isArray(data.projects) ? data.projects : []
    if (projects.length === 0) return null

    return (
      <div className={`mb-6 ${isTwoColumn ? 'flex' : ''}`}>
        <div className={isTwoColumn ? 'flex-1 pr-4' : ''}>
          <h2 className={`text-lg font-semibold mb-3 ${templateStyles.sectionHeaderStyle || 'border-b pb-1'}`} style={{ color: textColor, borderColor: textColor }}>
            {isTwoColumn ? 'PROJECTS' : 'Projects'}
          </h2>
        </div>
        <div className={isTwoColumn ? 'flex-1' : ''}>
          <div className="space-y-4">
          {projects.map((project: any, index: number) => {
            // Ensure project is an object and has required fields
            if (!project || typeof project !== 'object') return null
            
            const projectName = project.project_name || ''
            const description = typeof project.description === 'string' 
              ? project.description 
              : (project.description ? String(project.description) : '')
            const technologies = Array.isArray(project.technologies) ? project.technologies : []
            const links = project.links && typeof project.links === 'object' && !Array.isArray(project.links) 
              ? project.links 
              : {}

            return (
              <div key={index} className="space-y-2">
                {projectName && (
                  <h3 className="font-semibold">{projectName}</h3>
                )}
                {description && (
                  <p className="text-sm text-muted-foreground">{description}</p>
                )}
                {technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {technologies.map((tech: string, techIndex: number) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {Object.keys(links).length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-2">
                    {Object.entries(links).map(([label, url]: [string, any]) => (
                      <a
                        key={label}
                        href={typeof url === 'string' ? url : String(url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
          </div>
        </div>
      </div>
    )
  }

  const renderLanguages = () => {
    const languages = Array.isArray(data.languages) ? data.languages : []
    if (languages.length === 0) return null

    return (
      <div className="mb-6">
        <h2 className={`text-lg font-semibold mb-2 pb-1 ${templateStyles.sectionHeaderStyle}`} style={{ color: textColor, borderColor: textColor }}>
          Languages
        </h2>
        <div className="space-y-1">
          {languages.map((lang: any, index: number) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{lang.language}</span>
              <span className="text-muted-foreground capitalize">{lang.proficiency}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderLinks = () => {
    const links = data.links || {}
    if (Object.keys(links).length === 0) return null

    return (
      <div className="mb-6">
        <h2 className={`text-lg font-semibold mb-2 pb-1 ${templateStyles.sectionHeaderStyle}`} style={{ color: textColor, borderColor: textColor }}>
          Links
        </h2>
        <div className="space-y-1">
          {Object.entries(links).map(([label, url]: [string, any]) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline block"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    )
  }

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    personal_details: renderPersonalDetails,
    professional_summary: renderProfessionalSummary,
    skills: renderSkills,
    employment_history: renderEmploymentHistory,
    education: renderEducation,
    projects: renderProjects,
    languages: renderLanguages,
    links: renderLinks,
  }

  // ENSURE personal_details is ALWAYS rendered first, regardless of order array
  // This is a safety measure to guarantee personal_details has highest priority
  const ensurePersonalDetailsFirst = (sections: resume_section_order): resume_section_order => {
    const filtered = sections.filter(id => id !== 'personal_details')
    return ['personal_details', ...filtered] as resume_section_order
  }

  const finalOrder = ensurePersonalDetailsFirst(order)

  return (
    <div className="rounded-lg shadow-lg p-8 min-h-[800px]" style={{ fontFamily, color: textColor }}>
      <div className={isTwoColumn ? 'max-w-5xl mx-auto' : 'max-w-2xl mx-auto'}>
        {isTwoColumn && (
          <div className="flex border-r-2 pr-4" style={{ borderColor: textColor, opacity: 0.3 }}>
            <div className="flex-1"></div>
            <div className="flex-1"></div>
          </div>
        )}
        {finalOrder.map((sectionId) => {
          const renderer = sectionRenderers[sectionId]
          return renderer ? (
            <div key={sectionId}>
              {renderer()}
            </div>
          ) : null
        })}
      </div>
    </div>
  )
}

export default ResumePreview

