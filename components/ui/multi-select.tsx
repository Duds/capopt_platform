'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { 
  ChevronDown, 
  X, 
  Search,
  Check,
  AlertCircle,
  RefreshCw,
  RotateCcw,
  History
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface Option {
  id: string
  code: string
  name: string
  description?: string
  category?: string
  riskProfile?: string
}

interface RejectedItem {
  id: string
  reason: string
  rejectedAt: Date
  canReapply: boolean
}

interface MultiSelectProps {
  label?: string
  value: string[]
  onValueChange: (value: string[]) => void
  options: Option[]
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  error?: string
  showError?: boolean
  loading?: boolean
  onRetry?: () => void
  maxSelections?: number
  searchable?: boolean
  groupBy?: 'category' | 'riskProfile' | null
  // Rejection functionality
  rejectedItems?: RejectedItem[]
  onReject?: (itemId: string, reason: string) => void
  onReapply?: (itemId: string) => void
  showRejectionHistory?: boolean
  rejectionReasons?: string[]
}

export function MultiSelect({
  label,
  value,
  onValueChange,
  options,
  placeholder = "Select options...",
  required = false,
  disabled = false,
  className = "",
  error,
  showError = false,
  loading = false,
  onRetry,
  maxSelections,
  searchable = true,
  groupBy = null,
  rejectedItems = [],
  onReject,
  onReapply,
  showRejectionHistory = false,
  rejectionReasons = [
    'Not applicable to our operations',
    'Too expensive to implement',
    'Already covered by other measures',
    'Not required for our size',
    'Geographically not relevant',
    'Other'
  ]
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectionDialog, setShowRejectionDialog] = useState(false)
  const [itemToReject, setItemToReject] = useState<string | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Filter options based on search term and rejected items
  const filteredOptions = options.filter(option =>
    !rejectedItems.some(rejected => rejected.id === option.id && !rejected.canReapply) &&
    (option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (option.description && option.description.toLowerCase().includes(searchTerm.toLowerCase())))
  )

  // Group options if groupBy is specified
  const groupedOptions = groupBy ? filteredOptions.reduce((groups, option) => {
    const groupKey = option[groupBy] || 'Other'
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(option)
    return groups
  }, {} as Record<string, Option[]>) : null

  // Handle option selection/deselection
  const handleOptionToggle = (optionId: string) => {
    const newValue = value.includes(optionId)
      ? value.filter(id => id !== optionId)
      : maxSelections && value.length >= maxSelections
        ? value
        : [...value, optionId]
    
    onValueChange(newValue)
  }

  // Handle remove selected option
  const handleRemoveOption = (optionId: string) => {
    onValueChange(value.filter(id => id !== optionId))
  }

  // Handle reject option
  const handleRejectOption = (optionId: string) => {
    setItemToReject(optionId)
    setShowRejectionDialog(true)
  }

  // Handle rejection confirmation
  const handleRejectionConfirm = () => {
    if (itemToReject && rejectionReason && onReject) {
      onReject(itemToReject, rejectionReason)
      setShowRejectionDialog(false)
      setItemToReject(null)
      setRejectionReason("")
    }
  }

  // Handle reapply rejected item
  const handleReapplyItem = (itemId: string) => {
    if (onReapply) {
      onReapply(itemId)
    }
  }

  // Get selected options
  const selectedOptions = options.filter(option => value.includes(option.id))

  // Get display text for trigger
  const getDisplayText = () => {
    if (value.length === 0) return placeholder
    if (value.length === 1) {
      const option = options.find(opt => opt.id === value[0])
      return option?.name || value[0]
    }
    return `${value.length} selected`
  }

  const hasError = showError && error

  if (loading) {
    return (
      <div className={`space-y-2 ${className}`}>
        {label && (
          <Label className="flex items-center gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
          </Label>
        )}
        <div className="h-10 w-full bg-gray-100 animate-pulse rounded-md" />
      </div>
    )
  }

  if (error && !loading) {
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
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="h-6 px-2"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            )}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className={`space-y-2 ${className}`}>
        {label && (
          <Label className="flex items-center gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
          </Label>
        )}

        {/* Selected options display */}
        {selectedOptions.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {selectedOptions.map(option => (
              <Badge
                key={option.id}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {option.name}
                <button
                  type="button"
                  onClick={() => handleRemoveOption(option.id)}
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
                {onReject && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => handleRejectOption(option.id)}
                        className="ml-1 hover:bg-red-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3 text-red-600" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reject this option</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </Badge>
            ))}
          </div>
        )}

        {/* Rejection history */}
        {showRejectionHistory && rejectedItems.length > 0 && (
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              <History className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Rejected Items</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {rejectedItems.map(item => {
                const option = options.find(opt => opt.id === item.id)
                if (!option) return null

                return (
                  <Badge
                    key={item.id}
                    variant="outline"
                    className="flex items-center gap-1 text-muted-foreground"
                  >
                    {option.name}
                    {item.canReapply && onReapply && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={() => handleReapplyItem(item.id)}
                            className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                          >
                            <RotateCcw className="h-3 w-3 text-green-600" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Reapply this option</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </Badge>
                )
              })}
            </div>
          </div>
        )}

        {/* Multi-select trigger */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={triggerRef}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "w-full justify-between",
                hasError && "border-red-500",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              disabled={disabled}
            >
              <span className={cn(
                "truncate",
                value.length === 0 && "text-muted-foreground"
              )}>
                {getDisplayText()}
              </span>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <div className="space-y-2 p-2">
              {/* Search input */}
              {searchable && (
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search options..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              )}

              {/* Max selections warning */}
              {maxSelections && value.length >= maxSelections && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-3 w-3" />
                  <AlertDescription className="text-xs">
                    Maximum {maxSelections} selections allowed
                  </AlertDescription>
                </Alert>
              )}

              {/* Options list */}
              <ScrollArea className="h-64">
                {groupedOptions ? (
                  // Grouped options
                  Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
                    <div key={groupName} className="space-y-1">
                      <div className="px-2 py-1 text-xs font-medium text-muted-foreground bg-muted">
                        {groupName}
                      </div>
                      {groupOptions.map(option => (
                        <div
                          key={option.id}
                          className="flex items-center space-x-2 px-2 py-1 hover:bg-muted rounded-sm cursor-pointer"
                          onClick={() => handleOptionToggle(option.id)}
                        >
                          <Checkbox
                            checked={value.includes(option.id)}
                            disabled={maxSelections && value.length >= maxSelections && !value.includes(option.id)}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium">{option.name}</div>
                            {option.description && (
                              <div className="text-xs text-muted-foreground truncate">
                                {option.description}
                              </div>
                            )}
                          </div>
                          {option.riskProfile && (
                            <Badge variant="outline" className="text-xs">
                              {option.riskProfile}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  // Ungrouped options
                  filteredOptions.map(option => (
                    <div
                      key={option.id}
                      className="flex items-center space-x-2 px-2 py-1 hover:bg-muted rounded-sm cursor-pointer"
                      onClick={() => handleOptionToggle(option.id)}
                    >
                      <Checkbox
                        checked={value.includes(option.id)}
                        disabled={maxSelections && value.length >= maxSelections && !value.includes(option.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{option.name}</div>
                        {option.description && (
                          <div className="text-xs text-muted-foreground truncate">
                            {option.description}
                          </div>
                        )}
                      </div>
                      {option.riskProfile && (
                        <Badge variant="outline" className="text-xs">
                          {option.riskProfile}
                        </Badge>
                      )}
                    </div>
                  ))
                )}
              </ScrollArea>

              {/* No options message */}
              {filteredOptions.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  {searchTerm ? "No options match your search" : "No options available"}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Rejection dialog */}
        {showRejectionDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Reject Option</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Please provide a reason for rejecting this option:
              </p>
              <select
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-2 border rounded-md mb-4"
              >
                <option value="">Select a reason...</option>
                {rejectionReasons.map(reason => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectionDialog(false)
                    setItemToReject(null)
                    setRejectionReason("")
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRejectionConfirm}
                  disabled={!rejectionReason}
                >
                  Reject
                </Button>
              </div>
            </div>
          </div>
        )}

        {hasError && (
          <p className="text-sm text-red-500 mt-1">{error}</p>
        )}
      </div>
    </TooltipProvider>
  )
} 