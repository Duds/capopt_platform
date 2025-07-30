/**
 * Location Input Component with Geoapify API validation
 * 
 * Features:
 * - Autocomplete suggestions
 * - Real-time validation
 * - City, State, Country parsing
 * - Error handling
 * - Loading states
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, MapPin, CheckCircle, AlertCircle, X } from 'lucide-react'
import { useLocationValidation } from '@/hooks/use-location-validation'

interface LocationInputProps {
  value: string
  onChange: (value: string) => void
  onValidationChange?: (validation: any) => void
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

export function LocationInput({
  value,
  onChange,
  onValidationChange,
  label = 'Location',
  placeholder = 'Enter city, state, country...',
  required = false,
  disabled = false,
  className = ''
}: LocationInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const {
    suggestions,
    isLoading,
    validation,
    searchLocations,
    validateLocation,
    clearSuggestions,
    setValidation
  } = useLocationValidation()

  // Sync input value with prop value
  useEffect(() => {
    setInputValue(value)
  }, [value])

  // Handle input change
  const handleInputChange = (newValue: string) => {
    setInputValue(newValue)
    onChange(newValue)
    
    if (newValue.trim()) {
      searchLocations(newValue)
      setIsOpen(true)
    } else {
      clearSuggestions()
      setIsOpen(false)
      setSelectedSuggestion(null)
      setValidation(null)
      onValidationChange?.(null)
    }
  }

  // Handle suggestion selection
  const handleSuggestionSelect = async (suggestion: any) => {
    setSelectedSuggestion(suggestion)
    setInputValue(suggestion.formatted)
    onChange(suggestion.formatted)
    setIsOpen(false)
    clearSuggestions()

    // Validate the selected location
    const validationResult = await validateLocation(suggestion.formatted)
    setValidation(validationResult)
    onValidationChange?.(validationResult)
  }

  // Handle input blur
  const handleInputBlur = async () => {
    // Delay to allow for suggestion clicks
    setTimeout(() => {
      setIsOpen(false)
      
      // Validate current input if not empty
      if (inputValue.trim() && !selectedSuggestion) {
        validateLocation(inputValue).then(result => {
          setValidation(result)
          onValidationChange?.(result)
        })
      }
    }, 200)
  }

  // Handle input focus
  const handleInputFocus = () => {
    if (inputValue.trim() && suggestions.length > 0) {
      setIsOpen(true)
    }
  }

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        inputRef.current?.blur()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Clear input
  const handleClear = () => {
    setInputValue('')
    onChange('')
    setSelectedSuggestion(null)
    setValidation(null)
    onValidationChange?.(null)
    clearSuggestions()
    setIsOpen(false)
    inputRef.current?.focus()
  }

  return (
    <div className={`relative ${className}`}>
      {label && (
        <Label htmlFor="location-input" className="mb-2 block">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <div className="relative">
        <Input
          ref={inputRef}
          id="location-input"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`pr-10 ${validation?.isValid ? 'border-green-500' : validation?.error ? 'border-red-500' : ''}`}
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          {validation?.isValid && <CheckCircle className="h-4 w-4 text-green-500" />}
          {validation?.error && <AlertCircle className="h-4 w-4 text-red-500" />}
          {inputValue && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0 hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Validation Status */}
      {validation && (
        <div className="mt-2">
          {validation.isValid ? (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>Valid location</span>
              {(validation.city || validation.state || validation.country) && (
                <div className="flex gap-1">
                  {validation.city && <Badge variant="secondary">{validation.city}</Badge>}
                  {validation.state && <Badge variant="secondary">{validation.state}</Badge>}
                  {validation.country && <Badge variant="secondary">{validation.country}</Badge>}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>{validation.error}</span>
            </div>
          )}
        </div>
      )}

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              type="button"
              className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
              onClick={() => handleSuggestionSelect(suggestion)}
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{suggestion.formatted}</div>
                  {(suggestion.city || suggestion.state || suggestion.country) && (
                    <div className="text-sm text-muted-foreground">
                      {[suggestion.city, suggestion.state, suggestion.country]
                        .filter(Boolean)
                        .join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen && !isLoading && suggestions.length === 0 && inputValue.trim().length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4 text-center text-muted-foreground">
          No locations found
        </div>
      )}
    </div>
  )
} 