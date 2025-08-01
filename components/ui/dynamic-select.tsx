'use client'

import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEnumValues } from '@/hooks/use-enum-values'

interface DynamicSelectProps {
  label?: string
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  enumType: string
  industryCode?: string
  required?: boolean
  disabled?: boolean
  className?: string
  error?: string
  showError?: boolean
}

export function DynamicSelect({
  label,
  value,
  onValueChange,
  placeholder = "Select an option...",
  enumType,
  industryCode,
  required = false,
  disabled = false,
  className = "",
  error,
  showError = false
}: DynamicSelectProps) {
  const { values, loading, error: fetchError, refetch } = useEnumValues(enumType, industryCode)

  // Debug logging
  console.log(`🔍 DYNAMIC SELECT DEBUG - ${enumType}:`, {
    value,
    values,
    loading,
    fetchError,
    industryCode
  })

  // Find the display name for the current value
  const getDisplayNameForValue = (currentValue: string) => {
    if (!currentValue || !values) return ''
    
    // First, check if the value is already a display name
    const displayName = Object.values(values).find(display => display === currentValue)
    if (displayName) return displayName
    
    // If not found as display name, check if it's an enum code
    const displayNameFromCode = values[currentValue]
    if (displayNameFromCode) return displayNameFromCode
    
    // If still not found, return the original value
    return currentValue
  }

  const displayValue = getDisplayNameForValue(value)
  
  console.log(`🔍 DYNAMIC SELECT DEBUG - ${enumType} display value:`, {
    originalValue: value,
    displayValue,
    availableValues: values
  })

  const hasError = showError && (error || fetchError)
  const errorMessage = error || fetchError

  if (loading) {
    return (
      <div className={`space-y-2 ${className}`}>
        {label && (
          <Label className="flex items-center gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
          </Label>
        )}
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (fetchError && !loading) {
    return (
      <div className={`space-y-2 ${className}`}>
        {label && (
          <Label className="flex items-center gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
          </Label>
        )}
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load options</span>
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              className="h-6 px-2"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label className="flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      
      <Select
        value={displayValue || ""}
        onValueChange={onValueChange}
        disabled={disabled || Object.keys(values).length === 0}
      >
        <SelectTrigger className={hasError ? 'border-red-500' : ''}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(values).map(([key, displayName]) => (
            <SelectItem key={key} value={displayName}>
              {displayName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasError && (
        <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
      )}

      {Object.keys(values).length === 0 && !loading && !fetchError && (
        <p className="text-sm text-muted-foreground mt-1">
          No options available
        </p>
      )}
    </div>
  )
} 