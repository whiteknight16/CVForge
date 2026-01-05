"use client"

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

interface ValidationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sectionName: string
  onSkip: () => void
  onCancel: () => void
}

const ValidationDialog: React.FC<ValidationDialogProps> = ({
  open,
  onOpenChange,
  sectionName,
  onSkip,
  onCancel,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Incomplete Section</DialogTitle>
              <DialogDescription className="mt-1">
                Please complete all mandatory fields to proceed.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            The <span className="font-semibold text-foreground">{sectionName}</span> section has mandatory fields that need to be filled before you can move to the next section.
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel}>
            Continue Editing
          </Button>
          <Button variant="secondary" onClick={onSkip}>
            Skip This Section
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ValidationDialog

