"use client"

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { FileText, FileUp, Cloud, HardDrive, Loader2, X } from 'lucide-react'
import { GoogleIcon } from '@/components/ui/google-icon'
import Header from '@/components/Header'

const CreateResumePage = () => {
  const router = useRouter()
  const [showImportOptions, setShowImportOptions] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)

  // Generate random UUID
  const generateUUID = () => {
    return crypto.randomUUID()
  }

  // Handle start from scratch
  const handleStartFromScratch = () => {
    const randomUUID = generateUUID()
    router.push(`/resume/${randomUUID}`)
  }

  // Handle file selection
  const handleFileSelect = (file: File) => {
    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]
    
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF, DOC, DOCX, or TXT file')
      return
    }

    setSelectedFile(file)
  }

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }, [])

  // Extract data from resume
  const extractDataFromResume = async (file: File): Promise<any> => {
    // TODO: Implement actual resume parsing logic
    // This could use libraries like pdf-parse, mammoth, etc.
    
    return new Promise((resolve) => {
      // Simulate extraction process
      setTimeout(() => {
        // Mock extracted data
        const extractedData = {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1 234 567 8900',
          // Add more fields as needed
        }
        resolve(extractedData)
      }, 2000) // Simulate 2 second extraction
    })
  }

  // Handle resume upload and extraction
  const handleResumeUpload = async () => {
    if (!selectedFile) return

    setIsExtracting(true)
    
    try {
      // Extract data from resume
      const extractedData = await extractDataFromResume(selectedFile)
      
      // Generate UUID for the resume
      const randomUUID = generateUUID()
      
      // TODO: Save extracted data to database/state management
      console.log('Extracted data:', extractedData)
      
      // Route to resume page with the UUID
      router.push(`/resume/${randomUUID}`)
    } catch (error) {
      console.error('Error extracting resume data:', error)
      alert('Failed to extract data from resume. Please try again.')
      setIsExtracting(false)
    }
  }

  // Handle Google Drive import
  const handleGoogleDriveImport = () => {
    // TODO: Implement Google Drive integration
    console.log('Google Drive import')
    alert('Google Drive integration coming soon!')
  }

  // Handle Dropbox import
  const handleDropboxImport = () => {
    // TODO: Implement Dropbox integration
    console.log('Dropbox import')
    alert('Dropbox integration coming soon!')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/20">
      <Header />
      <div className="flex-1 px-4 py-12">
        <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Create Your Resume
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose how you'd like to get started
          </p>
        </div>

        {!showImportOptions ? (
          /* Main Options */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start from Scratch */}
            <button
              onClick={handleStartFromScratch}
              className="group relative p-8 rounded-2xl bg-card/50 dark:bg-card/30 border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 text-left"
            >
              <div className="flex flex-col items-start space-y-4">
                <div className="p-4 rounded-xl bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Start from Scratch</h2>
                  <p className="text-muted-foreground">
                    Build your resume step by step with our intuitive editor
                  </p>
                </div>
              </div>
            </button>

            {/* I Already Have Resume */}
            <button
              onClick={() => setShowImportOptions(true)}
              className="group relative p-8 rounded-2xl bg-card/50 dark:bg-card/30 border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 text-left"
            >
              <div className="flex flex-col items-start space-y-4">
                <div className="p-4 rounded-xl bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                  <FileUp className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">I Already Have Resume</h2>
                  <p className="text-muted-foreground">
                    Import your existing resume and we'll extract the data for you
                  </p>
                </div>
              </div>
            </button>
          </div>
        ) : (
          /* Import Options */
          <div className="space-y-6">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => {
                setShowImportOptions(false)
                setSelectedFile(null)
              }}
              className="mb-4"
            >
              ← Back
            </Button>

            {/* Cloud Import Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Google Drive */}
              <Button
                variant="outline"
                onClick={handleGoogleDriveImport}
                className="h-auto p-6 flex flex-col items-center gap-3"
                disabled={isExtracting}
              >
                <GoogleIcon className="h-8 w-8" />
                <span className="font-semibold">Import from Google Drive</span>
              </Button>

              {/* Dropbox */}
              <Button
                variant="outline"
                onClick={handleDropboxImport}
                className="h-auto p-6 flex flex-col items-center gap-3"
                disabled={isExtracting}
              >
                <Cloud className="h-8 w-8" />
                <span className="font-semibold">Import from Dropbox</span>
              </Button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or upload from system
                </span>
              </div>
            </div>

            {/* File Upload Area */}
            {!selectedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileInputChange}
                  disabled={isExtracting}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-4"
                >
                  <div className="p-4 rounded-full bg-primary/10 dark:bg-primary/20">
                    <HardDrive className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-muted-foreground">
                      PDF, DOC, DOCX, or TXT (Max 10MB)
                    </p>
                  </div>
                </label>
              </div>
            ) : (
              /* Selected File */
              <div className="border border-border rounded-2xl p-6 bg-card/50 dark:bg-card/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 dark:bg-primary/20">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  {!isExtracting && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {!isExtracting && (
                  <Button
                    onClick={handleResumeUpload}
                    className="w-full mt-4"
                    size="lg"
                  >
                    Extract Data & Continue
                  </Button>
                )}
              </div>
            )}

            {/* Extraction Loader */}
            {isExtracting && (
              <div className="border border-border rounded-2xl p-12 bg-card/50 dark:bg-card/30 text-center">
                <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Extracting data from resume</h3>
                <p className="text-muted-foreground">
                  Please wait while we analyze your resume...
                </p>
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  )
}

export default CreateResumePage
