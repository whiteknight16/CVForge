"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, ArrowRight, Trash2, Plus, GripVertical, X, Sparkles, Loader2, SkipForward } from 'lucide-react'
import type { personal_details, employment_history, education, projects } from '@/db/schema'

interface SectionEditorProps {
  section: string
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  onBack: () => void
  onSkipSection?: (section: string) => void
  onValidate?: () => Promise<boolean>
  allResumeData?: any // For professional summary generation
}

const SectionEditor: React.FC<SectionEditorProps> = ({
  section,
  data,
  onUpdate,
  onNext,
  onBack,
  onSkipSection,
  onValidate,
  allResumeData,
}) => {
  // Determine initial value based on section type
  const getInitialValue = () => {
    // Array sections - ensure data is an array
    if (['skills', 'employment_history', 'education', 'projects', 'languages'].includes(section)) {
      return Array.isArray(data) ? data : []
    }
    // Object sections
    if (['links'].includes(section)) {
      return data && typeof data === 'object' && !Array.isArray(data) ? data : {}
    }
    // String sections
    if (['professional_summary'].includes(section)) {
      return typeof data === 'string' ? data : ''
    }
    // Default to object (for personal_details)
    return data && typeof data === 'object' && !Array.isArray(data) ? data : {}
  }

  const [localData, setLocalData] = useState<any>(getInitialValue())
  // All hooks must be at the top level - not conditionally
  const [newSkill, setNewSkill] = useState('')
  const [newLang, setNewLang] = useState({ language: '', proficiency: 'native' })
  const [newLink, setNewLink] = useState({ label: '', url: '' })
  // Project-specific input states
  const [newTechInputs, setNewTechInputs] = useState<Record<number, string>>({})
  const [newLinkInputs, setNewLinkInputs] = useState<Record<number, { label: string; url: string }>>({})
  // AI generation loading states - format: 'employment_0', 'education_1', 'project_2'
  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Determine correct default based on section type
    // Array sections - ensure data is an array
    if (['skills', 'employment_history', 'education', 'projects', 'languages'].includes(section)) {
      setLocalData(Array.isArray(data) ? data : [])
    } else if (['links'].includes(section)) {
      setLocalData(data && typeof data === 'object' && !Array.isArray(data) ? data : {})
    } else if (['professional_summary'].includes(section)) {
      setLocalData(typeof data === 'string' ? data : '')
    } else {
      // Default to object (for personal_details)
      setLocalData(data && typeof data === 'object' && !Array.isArray(data) ? data : {})
    }
    // Reset form states when section changes
    if (section !== 'skills') setNewSkill('')
    if (section !== 'languages') setNewLang({ language: '', proficiency: 'native' })
    if (section !== 'links') setNewLink({ label: '', url: '' })
    if (section !== 'projects') {
      setNewTechInputs({})
      setNewLinkInputs({})
    }
  }, [data, section])

  const handleFieldChange = (field: string, value: any) => {
    const updated = { ...localData, [field]: value }
    setLocalData(updated)
    onUpdate(updated)
  }


  // Personal Details Section
  if (section === 'personal_details') {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">
              Personal Details
            </h2>
            <p className="text-muted-foreground mt-1">Fill in your basic information</p>
          </div>
        </div>

        <div className="bg-card/50 dark:bg-card/30 border border-border/50 rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="name">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={localData.name || ''}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={localData.email || ''}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                placeholder="john.doe@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={localData.phone || ''}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                placeholder="+1 234 567 8900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={localData.dob || ''}
                onChange={(e) => handleFieldChange('dob', e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={localData.address || ''}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                placeholder="123 Main Street"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={localData.city || ''}
                onChange={(e) => handleFieldChange('city', e.target.value)}
                placeholder="New York"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={localData.state || ''}
                onChange={(e) => handleFieldChange('state', e.target.value)}
                placeholder="NY"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code</Label>
              <Input
                id="zip"
                value={localData.zip || ''}
                onChange={(e) => handleFieldChange('zip', e.target.value)}
                placeholder="10001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={localData.country || ''}
                onChange={(e) => handleFieldChange('country', e.target.value)}
                placeholder="United States"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            {onSkipSection && section !== 'personal_details' && (
              <Button 
                variant="outline" 
                onClick={() => onSkipSection(section)}
                className="gap-2"
              >
                <SkipForward className="h-4 w-4" />
                Skip Section
              </Button>
            )}
            <Button onClick={onNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Professional Summary Section
  if (section === 'professional_summary') {
    // Ensure we always work with a string
    const summaryValue = typeof localData === 'string' 
      ? localData 
      : (typeof localData === 'object' && localData !== null ? String(localData) : '')

    const generateAISummary = async () => {
      const loadingKey = 'professional_summary'
      setAiLoading({ ...aiLoading, [loadingKey]: true })

      try {
        const response = await fetch('/api/ai/generate-summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            resumeData: allResumeData || {},
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to generate professional summary')
        }

        const data = await response.json()
        const generatedSummary = data.summary || ''
        onUpdate(generatedSummary)
      } catch (error: any) {
        console.error('AI generation error:', error)
        alert(error.message || 'Failed to generate professional summary. Please try again.')
      } finally {
        setAiLoading({ ...aiLoading, [loadingKey]: false })
      }
    }
    
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">Professional Summary</h2>
            <p className="text-muted-foreground mt-1">Write a brief summary of your professional background</p>
          </div>
        </div>

        <div className="bg-card/50 dark:bg-card/30 border border-border/50 rounded-2xl p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="summary">Summary</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateAISummary}
                disabled={aiLoading['professional_summary']}
                className="gap-2"
              >
                {aiLoading['professional_summary'] ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3" />
                    {summaryValue ? 'Regenerate using AI' : 'Generate using AI'}
                  </>
                )}
              </Button>
            </div>
            <textarea
              id="summary"
              className="w-full min-h-[200px] px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={summaryValue}
              onChange={(e) => {
                // Always update as a string
                onUpdate(e.target.value)
              }}
              placeholder="Experienced professional with expertise in..."
            />
            <p className="text-xs text-muted-foreground">2-4 sentences recommended</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            {onSkipSection && (
              <Button 
                variant="outline" 
                onClick={() => onSkipSection(section)}
                className="gap-2"
              >
                <SkipForward className="h-4 w-4" />
                Skip Section
              </Button>
            )}
            <Button onClick={onNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Skills Section
  if (section === 'skills') {
    const skills = Array.isArray(localData) ? localData : []

    const addSkill = () => {
      if (newSkill.trim()) {
        const updated = [...skills, newSkill.trim()]
        setLocalData(updated)
        onUpdate(updated)
        setNewSkill('')
      }
    }

    const removeSkill = (index: number) => {
      const updated = skills.filter((_: string, i: number) => i !== index)
      setLocalData(updated)
      onUpdate(updated)
    }

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">Skills</h2>
            <p className="text-muted-foreground mt-1">List 5 to 15 key skills, both technical and soft</p>
          </div>
        </div>

        <div className="bg-card/50 dark:bg-card/30 border border-border/50 rounded-2xl p-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: string, index: number) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
              >
                <span>{skill}</span>
                <button
                  onClick={() => removeSkill(index)}
                  className="hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addSkill()
                }
              }}
              placeholder="Add skill"
            />
            <Button onClick={addSkill}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            {onSkipSection && (
              <Button 
                variant="outline" 
                onClick={() => onSkipSection(section)}
                className="gap-2"
              >
                <SkipForward className="h-4 w-4" />
                Skip Section
              </Button>
            )}
            <Button onClick={onNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Employment History Section
  if (section === 'employment_history') {
    const employment = Array.isArray(localData) ? localData : []

    const addEmployment = () => {
      const updated = [...employment, {
        company_name: '',
        position: '',
        start_date: '',
        end_date: '',
        description: '',
        type: 'full-time'
      }]
      setLocalData(updated)
      onUpdate(updated)
    }

    const updateEmployment = (index: number, field: string, value: any) => {
      const updated = employment.map((job: any, i: number) => 
        i === index ? { ...job, [field]: value } : job
      )
      setLocalData(updated)
      onUpdate(updated)
    }

    const removeEmployment = (index: number) => {
      const updated = employment.filter((_: any, i: number) => i !== index)
      setLocalData(updated)
      onUpdate(updated)
    }

    const generateAIDescription = async (index: number, job: any) => {
      const loadingKey = `employment_${index}`
      setAiLoading({ ...aiLoading, [loadingKey]: true })

      try {
        const response = await fetch('/api/ai/generate-description', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'employment',
            context: job,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to generate description')
        }

        const data = await response.json()
        const generatedDescription = data.description || ''
        updateEmployment(index, 'description', generatedDescription)
      } catch (error: any) {
        console.error('AI generation error:', error)
        alert(error.message || 'Failed to generate description. Please try again.')
      } finally {
        setAiLoading({ ...aiLoading, [loadingKey]: false })
      }
    }

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">Employment History</h2>
            <p className="text-muted-foreground mt-1">Add your work experience</p>
          </div>
          <Button onClick={addEmployment}>
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        </div>

        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {employment.map((job: any, index: number) => (
            <div key={index} className="bg-card/50 dark:bg-card/30 border border-border/50 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Experience {index + 1}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeEmployment(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    Company Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={job.company_name || ''}
                    onChange={(e) => updateEmployment(index, 'company_name', e.target.value)}
                    placeholder="Acme Inc."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Position <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={job.position || ''}
                    onChange={(e) => updateEmployment(index, 'position', e.target.value)}
                    placeholder="Software Engineer"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Start Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="date"
                    value={job.start_date || ''}
                    onChange={(e) => updateEmployment(index, 'start_date', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={job.end_date || ''}
                    onChange={(e) => updateEmployment(index, 'end_date', e.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label>Description</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => generateAIDescription(index, job)}
                      disabled={aiLoading[`employment_${index}`]}
                      className="gap-2"
                    >
                      {aiLoading[`employment_${index}`] ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3 w-3" />
                          {job.description ? 'Regenerate using AI' : 'Generate using AI'}
                        </>
                      )}
                    </Button>
                  </div>
                  <textarea
                    className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background text-sm"
                    value={job.description || ''}
                    onChange={(e) => updateEmployment(index, 'description', e.target.value)}
                    placeholder="Describe your responsibilities and achievements..."
                  />
                </div>
              </div>
            </div>
          ))}

          {employment.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No employment history added yet.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={addEmployment}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Experience
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            {onSkipSection && (
              <Button 
                variant="outline" 
                onClick={() => onSkipSection(section)}
                className="gap-2"
              >
                <SkipForward className="h-4 w-4" />
                Skip Section
              </Button>
            )}
            <Button onClick={onNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Education Section
  if (section === 'education') {
    const education = Array.isArray(localData) ? localData : []

    const addEducation = () => {
      const updated = [...education, {
        school_name: '',
        degree: '',
        field_of_study: '',
        start_date: '',
        end_date: '',
        description: ''
      }]
      setLocalData(updated)
      onUpdate(updated)
    }

    const updateEducation = (index: number, field: string, value: any) => {
      const updated = education.map((edu: any, i: number) => 
        i === index ? { ...edu, [field]: value } : edu
      )
      setLocalData(updated)
      onUpdate(updated)
    }

    const removeEducation = (index: number) => {
      const updated = education.filter((_: any, i: number) => i !== index)
      setLocalData(updated)
      onUpdate(updated)
    }

    const generateAIDescription = async (index: number, edu: any) => {
      const loadingKey = `education_${index}`
      setAiLoading({ ...aiLoading, [loadingKey]: true })

      try {
        const response = await fetch('/api/ai/generate-description', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'education',
            context: edu,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to generate description')
        }

        const data = await response.json()
        const generatedDescription = data.description || ''
        updateEducation(index, 'description', generatedDescription)
      } catch (error: any) {
        console.error('AI generation error:', error)
        alert(error.message || 'Failed to generate description. Please try again.')
      } finally {
        setAiLoading({ ...aiLoading, [loadingKey]: false })
      }
    }

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">Education</h2>
            <p className="text-muted-foreground mt-1">Add your educational background</p>
          </div>
          <Button onClick={addEducation}>
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </div>

        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {education.map((edu: any, index: number) => (
            <div key={index} className="bg-card/50 dark:bg-card/30 border border-border/50 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Education {index + 1}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeEducation(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    School Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={edu.school_name || ''}
                    onChange={(e) => updateEducation(index, 'school_name', e.target.value)}
                    placeholder="University of Example"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Degree <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={edu.degree || ''}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    placeholder="Bachelor of Science"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Field of Study <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={edu.field_of_study || ''}
                    onChange={(e) => updateEducation(index, 'field_of_study', e.target.value)}
                    placeholder="Computer Science"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Start Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="date"
                    value={edu.start_date || ''}
                    onChange={(e) => updateEducation(index, 'start_date', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={edu.end_date || ''}
                    onChange={(e) => updateEducation(index, 'end_date', e.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label>Description</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => generateAIDescription(index, edu)}
                      disabled={aiLoading[`education_${index}`]}
                      className="gap-2"
                    >
                      {aiLoading[`education_${index}`] ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3 w-3" />
                          {edu.description ? 'Regenerate using AI' : 'Generate using AI'}
                        </>
                      )}
                    </Button>
                  </div>
                  <textarea
                    className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background text-sm"
                    value={edu.description || ''}
                    onChange={(e) => updateEducation(index, 'description', e.target.value)}
                    placeholder="Relevant coursework, achievements..."
                  />
                </div>
              </div>
            </div>
          ))}

          {education.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No education added yet.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={addEducation}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Education
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            {onSkipSection && (
              <Button 
                variant="outline" 
                onClick={() => onSkipSection(section)}
                className="gap-2"
              >
                <SkipForward className="h-4 w-4" />
                Skip Section
              </Button>
            )}
            <Button onClick={onNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Projects Section
  if (section === 'projects') {
    const projects = Array.isArray(localData) ? localData : []

    const addProject = () => {
      const updated = [...projects, {
        project_name: '',
        description: '',
        technologies: [],
        links: {}
      }]
      setLocalData(updated)
      onUpdate(updated)
    }

    const updateProject = (index: number, field: string, value: any) => {
      const updated = projects.map((project: any, i: number) => 
        i === index ? { ...project, [field]: value } : project
      )
      setLocalData(updated)
      onUpdate(updated)
    }

    const removeProject = (index: number) => {
      const updated = projects.filter((_: any, i: number) => i !== index)
      setLocalData(updated)
      onUpdate(updated)
      // Clean up input states
      const newTechs = { ...newTechInputs }
      const newLinks = { ...newLinkInputs }
      delete newTechs[index]
      delete newLinks[index]
      setNewTechInputs(newTechs)
      setNewLinkInputs(newLinks)
    }

    const generateAIDescription = async (index: number, project: any) => {
      const loadingKey = `project_${index}`
      setAiLoading({ ...aiLoading, [loadingKey]: true })

      try {
        const response = await fetch('/api/ai/generate-description', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'project',
            context: project,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to generate description')
        }

        const data = await response.json()
        const generatedDescription = data.description || ''
        updateProject(index, 'description', generatedDescription)
      } catch (error: any) {
        console.error('AI generation error:', error)
        alert(error.message || 'Failed to generate description. Please try again.')
      } finally {
        setAiLoading({ ...aiLoading, [loadingKey]: false })
      }
    }

    const addTechnology = (projectIndex: number) => {
      const tech = newTechInputs[projectIndex]?.trim()
      if (tech) {
        const project = projects[projectIndex]
        const updatedTechs = [...(project.technologies || []), tech]
        updateProject(projectIndex, 'technologies', updatedTechs)
        setNewTechInputs({ ...newTechInputs, [projectIndex]: '' })
      }
    }

    const addLink = (projectIndex: number) => {
      const linkInput = newLinkInputs[projectIndex]
      if (linkInput?.label.trim() && linkInput?.url.trim()) {
        const project = projects[projectIndex]
        const updatedLinks = { ...(project.links || {}), [linkInput.label]: linkInput.url }
        updateProject(projectIndex, 'links', updatedLinks)
        setNewLinkInputs({ ...newLinkInputs, [projectIndex]: { label: '', url: '' } })
      }
    }

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">Projects</h2>
            <p className="text-muted-foreground mt-1">Showcase your projects and achievements</p>
          </div>
          <Button onClick={addProject}>
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>

        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {projects.map((project: any, index: number) => (
            <div key={index} className="bg-card/50 dark:bg-card/30 border border-border/50 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Project {index + 1}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeProject(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>
                    Project Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={project.project_name || ''}
                    onChange={(e) => updateProject(index, 'project_name', e.target.value)}
                    placeholder="E-commerce Platform"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>
                      Description <span className="text-destructive">*</span>
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => generateAIDescription(index, project)}
                      disabled={aiLoading[`project_${index}`]}
                      className="gap-2"
                    >
                      {aiLoading[`project_${index}`] ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3 w-3" />
                          {project.description ? 'Regenerate using AI' : 'Generate using AI'}
                        </>
                      )}
                    </Button>
                  </div>
                  <textarea
                    className="w-full min-h-[120px] px-3 py-2 rounded-md border border-input bg-background text-sm"
                    value={project.description || ''}
                    onChange={(e) => updateProject(index, 'description', e.target.value)}
                    placeholder="Describe your project..."
                    required
                  />
                </div>

                {/* Technologies Section */}
                <div className="space-y-2">
                  <Label>Technologies Used</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(project.technologies || []).map((tech: string, techIndex: number) => (
                      <div
                        key={techIndex}
                        className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        <span>{tech}</span>
                        <button
                          onClick={() => {
                            const updatedTechs = (project.technologies || []).filter((_: string, i: number) => i !== techIndex)
                            updateProject(index, 'technologies', updatedTechs)
                          }}
                          className="hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add technology (e.g., React, Node.js)"
                      value={newTechInputs[index] || ''}
                      onChange={(e) => setNewTechInputs({ ...newTechInputs, [index]: e.target.value })}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addTechnology(index)
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => addTechnology(index)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Links Section */}
                <div className="space-y-2">
                  <Label>Project Links</Label>
                  <div className="space-y-2 mb-2">
                    {Object.entries(project.links || {}).map(([label, url]: [string, any]) => (
                      <div key={label} className="flex items-center gap-3 p-2 bg-background rounded-lg border border-border/50">
                        <span className="flex-1 font-medium text-sm">{label}</span>
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-primary hover:underline flex-1 truncate"
                        >
                          {url}
                        </a>
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          onClick={() => {
                            const updatedLinks = { ...(project.links || {}) }
                            delete updatedLinks[label]
                            updateProject(index, 'links', updatedLinks)
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Label (e.g., GitHub, Live Demo)"
                      value={newLinkInputs[index]?.label || ''}
                      onChange={(e) => setNewLinkInputs({ 
                        ...newLinkInputs, 
                        [index]: { 
                          ...(newLinkInputs[index] || { label: '', url: '' }), 
                          label: e.target.value 
                        } 
                      })}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addLink(index)
                        }
                      }}
                    />
                    <Input
                      placeholder="https://..."
                      value={newLinkInputs[index]?.url || ''}
                      onChange={(e) => setNewLinkInputs({ 
                        ...newLinkInputs, 
                        [index]: { 
                          ...(newLinkInputs[index] || { label: '', url: '' }), 
                          url: e.target.value 
                        } 
                      })}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addLink(index)
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => addLink(index)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {projects.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No projects added yet.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={addProject}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Project
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            {onSkipSection && (
              <Button 
                variant="outline" 
                onClick={() => onSkipSection(section)}
                className="gap-2"
              >
                <SkipForward className="h-4 w-4" />
                Skip Section
              </Button>
            )}
            <Button onClick={onNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Languages Section
  if (section === 'languages') {
    const languages = Array.isArray(localData) ? localData : []

    const addLanguage = () => {
      if (newLang.language.trim()) {
        const updated = [...languages, newLang]
        setLocalData(updated)
        onUpdate(updated)
        setNewLang({ language: '', proficiency: 'native' })
      }
    }

    const removeLanguage = (index: number) => {
      const updated = languages.filter((_: any, i: number) => i !== index)
      setLocalData(updated)
      onUpdate(updated)
    }

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">Languages</h2>
            <p className="text-muted-foreground mt-1">List languages you speak</p>
          </div>
        </div>

        <div className="bg-card/50 dark:bg-card/30 border border-border/50 rounded-2xl p-6 space-y-4">
          <div className="space-y-3">
            {languages.map((lang: any, index: number) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-background rounded-lg">
                <span className="flex-1 font-medium">{lang.language}</span>
                <span className="text-sm text-muted-foreground capitalize">{lang.proficiency}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLanguage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={newLang.language}
              onChange={(e) => setNewLang({ ...newLang, language: e.target.value })}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addLanguage()
                }
              }}
              placeholder="Language"
            />
            <select
              className="px-3 py-2 rounded-md border border-input bg-background text-sm"
              value={newLang.proficiency}
              onChange={(e) => setNewLang({ ...newLang, proficiency: e.target.value })}
            >
              <option value="native">Native</option>
              <option value="fluent">Fluent</option>
              <option value="conversational">Conversational</option>
              <option value="basic">Basic</option>
            </select>
            <Button onClick={addLanguage}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={onNext}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    )
  }

  // Links Section
  if (section === 'links') {
    const links = localData || {}

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">Links</h2>
            <p className="text-muted-foreground mt-1">Add your portfolio, LinkedIn, GitHub, etc.</p>
          </div>
        </div>

        <div className="bg-card/50 dark:bg-card/30 border border-border/50 rounded-2xl p-6 space-y-4">
          <div className="space-y-3">
            {Object.entries(links).map(([label, url]: [string, any]) => (
              <div key={label} className="flex items-center gap-3 p-3 bg-background rounded-lg">
                <span className="flex-1 font-medium">{label}</span>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                  {url}
                </a>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const updated = { ...links }
                    delete updated[label]
                    onUpdate(updated)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={newLink.label}
              onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
              placeholder="Label (e.g., LinkedIn)"
            />
            <Input
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              placeholder="https://..."
            />
            <Button
              onClick={() => {
                if (newLink.label.trim() && newLink.url.trim()) {
                  onUpdate({ ...links, [newLink.label]: newLink.url })
                  setNewLink({ label: '', url: '' })
                }
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            {onSkipSection && (
              <Button 
                variant="outline" 
                onClick={() => onSkipSection(section)}
                className="gap-2"
              >
                <SkipForward className="h-4 w-4" />
                Skip Section
              </Button>
            )}
            <Button onClick={onNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <p>Section not found: {section}</p>
    </div>
  )
}

export default SectionEditor

