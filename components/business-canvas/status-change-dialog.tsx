/**
 * Status Change Dialog Component
 * 
 * Provides a user interface for changing canvas status with validation
 * and business rule enforcement
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  Archive, 
  AlertTriangle,
  Info,
  CheckSquare,
  XCircle
} from 'lucide-react'
import { CanvasStatusValidator, CanvasValidationResult } from '@/lib/canvas-status-validation'
import { useToast } from '@/hooks/use-toast'

interface StatusChangeDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  canvas: any
  currentStatus: string
  userRole: string
  onStatusChange: (canvasId: string, newStatus: string, justification?: string) => Promise<void>
}

export function StatusChangeDialog({
  isOpen,
  onOpenChange,
  canvas,
  currentStatus,
  userRole,
  onStatusChange
}: StatusChangeDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [validationResult, setValidationResult] = useState<CanvasValidationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [justification, setJustification] = useState('')
  const { toast } = useToast()

  // Get available status transitions
  const availableStatuses = CanvasStatusValidator.getAvailableStatusTransitions(userRole, currentStatus)

  useEffect(() => {
    if (isOpen) {
      setSelectedStatus('')
      setValidationResult(null)
      setJustification('')
    }
  }, [isOpen])

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status)
    
    // Get content counts from canvas
    const contentCounts = {
      valuePropositions: canvas.valuePropositions?.length || 0,
      customerSegments: canvas.customerSegments?.length || 0,
      revenueStreams: canvas.revenueStreams?.length || 0,
      partnerships: canvas.partnerships?.length || 0,
      resources: canvas.resources?.length || 0,
      activities: canvas.activities?.length || 0,
      costStructures: canvas.costStructures?.length || 0,
      channels: canvas.channels?.length || 0
    }

    // Validate the status transition
    const validation = CanvasStatusValidator.validateStatusTransition({
      canvas,
      contentCounts,
      userRole,
      currentStatus,
      targetStatus: status
    })

    setValidationResult(validation)
  }

  const handleStatusChange = async () => {
    if (!selectedStatus || !validationResult?.isValid) {
      return
    }

    setIsLoading(true)

    try {
      await onStatusChange(canvas.id, selectedStatus, justification)
      
      toast({
        title: "Status Updated",
        description: `Canvas status changed to ${CanvasStatusValidator.getStatusInfo(selectedStatus).label}`,
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update canvas status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DRAFT': return <FileText className="h-4 w-4" />
      case 'REVIEW': return <Clock className="h-4 w-4" />
      case 'PUBLISHED': return <CheckCircle className="h-4 w-4" />
      case 'ARCHIVED': return <Archive className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const renderStatusOption = (status: string) => {
    const statusInfo = CanvasStatusValidator.getStatusInfo(status)
    const isSelected = selectedStatus === status
    const isCurrent = status === currentStatus

    return (
      <div
        key={status}
        className={`
          p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
          ${isSelected 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/20 hover:border-primary/30 hover:bg-muted/30'
          }
          ${isCurrent ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={() => !isCurrent && handleStatusSelect(status)}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-md ${statusInfo.color}`}>
            {getStatusIcon(status)}
          </div>
          <div className="flex-1">
            <div className="font-medium">{statusInfo.label}</div>
            <div className="text-sm text-muted-foreground">{statusInfo.description}</div>
          </div>
          {isCurrent && (
            <Badge variant="secondary" className="text-xs">
              Current
            </Badge>
          )}
          {isSelected && (
            <CheckSquare className="h-4 w-4 text-primary" />
          )}
        </div>
      </div>
    )
  }

  const renderValidationResult = () => {
    if (!validationResult) return null

    return (
      <div className="space-y-3">
        <Separator />
        
        {validationResult.isValid ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Canvas meets all criteria for {CanvasStatusValidator.getStatusInfo(selectedStatus).label} status.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Canvas does not meet criteria for {CanvasStatusValidator.getStatusInfo(selectedStatus).label} status.
            </AlertDescription>
          </Alert>
        )}

        {validationResult.errors.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium text-sm text-destructive">Errors:</div>
            <ul className="text-sm text-destructive space-y-1">
              {validationResult.errors.map((error, index) => (
                <li key={index} className="flex items-start gap-2">
                  <XCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {validationResult.warnings.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium text-sm text-yellow-600">Warnings:</div>
            <ul className="text-sm text-yellow-600 space-y-1">
              {validationResult.warnings.map((warning, index) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}

        {validationResult.missingFields.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium text-sm text-destructive">Missing Fields:</div>
            <ul className="text-sm text-destructive space-y-1">
              {validationResult.missingFields.map((field, index) => (
                <li key={index} className="flex items-start gap-2">
                  <XCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  {field}
                </li>
              ))}
            </ul>
          </div>
        )}

        {validationResult.contentIssues.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium text-sm text-destructive">Content Issues:</div>
            <ul className="text-sm text-destructive space-y-1">
              {validationResult.contentIssues.map((issue, index) => (
                <li key={index} className="flex items-start gap-2">
                  <XCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Change Canvas Status</DialogTitle>
          <DialogDescription>
            Select a new status for "{canvas.name}". The system will validate that the canvas meets all requirements.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Status */}
          <div className="space-y-2">
            <div className="font-medium text-sm">Current Status:</div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={CanvasStatusValidator.getStatusInfo(currentStatus).color}>
                {getStatusIcon(currentStatus)}
                <span className="ml-1">{CanvasStatusValidator.getStatusInfo(currentStatus).label}</span>
              </Badge>
            </div>
          </div>

          {/* Available Status Options */}
          <div className="space-y-2">
            <div className="font-medium text-sm">Available Statuses:</div>
            <div className="space-y-2">
              {availableStatuses.length > 0 ? (
                availableStatuses.map(renderStatusOption)
              ) : (
                <div className="text-sm text-muted-foreground p-4 border border-dashed rounded-lg">
                  No status transitions available for your role.
                </div>
              )}
            </div>
          </div>

          {/* Validation Results */}
          {selectedStatus && renderValidationResult()}

          {/* Justification (for certain status changes) */}
          {(selectedStatus === 'ARCHIVED' || selectedStatus === 'PUBLISHED') && (
            <div className="space-y-2">
              <div className="font-medium text-sm">Justification:</div>
              <textarea
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder={`Please provide a reason for changing status to ${CanvasStatusValidator.getStatusInfo(selectedStatus).label}...`}
                className="w-full p-3 border rounded-md resize-none"
                rows={3}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusChange}
              disabled={!selectedStatus || !validationResult?.isValid || isLoading}
            >
              {isLoading ? 'Updating...' : 'Change Status'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 