"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth-store'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { FileText, Plus, Calendar, Edit2, Trash2, Loader2 } from 'lucide-react'
import { format } from 'date-fns'

interface Resume {
  resume_id: string
  resume_name: string
  created_at: string
  updated_at: string
}

const DashboardPage = () => {
  const router = useRouter()
  const { user } = useAuthStore()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchResumes()
  }, [])

  const fetchResumes = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/resume/list')
      const data = await response.json()

      if (data.success) {
        setResumes(data.resumes || [])
      } else {
        console.error('Failed to fetch resumes:', data.error)
      }
    } catch (error) {
      console.error('Error fetching resumes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (resumeId: string) => {
    if (!confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
      return
    }

    try {
      setIsDeleting(resumeId)
      const response = await fetch(`/api/resume/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resume_id: resumeId }),
      })

      const data = await response.json()

      if (data.success) {
        setResumes(resumes.filter((r) => r.resume_id !== resumeId))
      } else {
        alert(data.error || 'Failed to delete resume')
      }
    } catch (error) {
      console.error('Error deleting resume:', error)
      alert('Failed to delete resume. Please try again.')
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                My Resumes
              </h1>
              <p className="text-muted-foreground text-lg">
                Manage and edit your resumes
              </p>
            </div>
            <Button
              onClick={() => router.push('/resume-creation-options')}
              size="lg"
              className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all w-full md:w-auto"
            >
              <Plus className="h-5 w-5" />
              Create New Resume
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : resumes.length === 0 ? (
          <div className="border-2 border-dashed border-border rounded-2xl p-16 text-center bg-muted/20 backdrop-blur-sm">
            <div className="max-w-md mx-auto">
              <div className="p-4 bg-primary/10 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <FileText className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">No resumes yet</h3>
              <p className="text-muted-foreground mb-8 text-lg">
                Get started by creating your first resume
              </p>
              <Button
                onClick={() => router.push('/resume-creation-options')}
                size="lg"
                className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
              >
                <Plus className="h-5 w-5" />
                Create Your First Resume
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div
                key={resume.resume_id}
                className="group relative border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 bg-card/50 backdrop-blur-sm overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                          {resume.resume_name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-5 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Updated {format(new Date(resume.updated_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-border/50">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Link href={`/resume/${resume.resume_id}`}>
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                      onClick={() => handleDelete(resume.resume_id)}
                      disabled={isDeleting === resume.resume_id}
                    >
                      {isDeleting === resume.resume_id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default DashboardPage
