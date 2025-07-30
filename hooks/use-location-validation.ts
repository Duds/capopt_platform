/**
 * Location Validation Hook using Geoapify API
 * 
 * Provides:
 * - Location autocomplete suggestions
 * - City, State, Country validation
 * - Geocoding and reverse geocoding
 * - Address formatting
 */

import { useState, useCallback, useEffect } from 'react'

interface LocationSuggestion {
  id: string
  name: string
  city: string
  state: string
  country: string
  formatted: string
  lat: number
  lon: number
}

interface LocationValidation {
  isValid: boolean
  city: string
  state: string
  country: string
  formatted: string
  coordinates?: { lat: number; lon: number }
  error?: string
}

interface UseLocationValidationProps {
  apiKey?: string
  debounceMs?: number
}

export function useLocationValidation({ 
  apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY,
  debounceMs = 500 
}: UseLocationValidationProps = {}) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [validation, setValidation] = useState<LocationValidation | null>(null)
  const [lastQuery, setLastQuery] = useState('')

  // Debounced search function
  const searchLocations = useCallback(
    async (query: string) => {
      if (!query.trim() || query.length < 2) {
        setSuggestions([])
        return
      }

      if (!apiKey || apiKey === 'your_actual_api_key_here') {
        console.warn('Geoapify API key not configured - using fallback mode')
        return
      }

      setIsLoading(true)
      setLastQuery(query)

      try {
        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&format=json&limit=10&apiKey=${apiKey}`
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.results) {
          const formattedSuggestions: LocationSuggestion[] = data.results.map((result: any, index: number) => ({
            id: `${index}-${result.place_id}`,
            name: result.name || '',
            city: result.city || result.town || result.village || '',
            state: result.state || result.county || '',
            country: result.country || '',
            formatted: result.formatted || '',
            lat: result.lat,
            lon: result.lon
          }))

          setSuggestions(formattedSuggestions)
        } else {
          setSuggestions([])
        }
      } catch (error) {
        console.error('Error fetching location suggestions:', error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    },
    [apiKey]
  )

  // Validate a specific location string
  const validateLocation = useCallback(
    async (locationString: string): Promise<LocationValidation> => {
      if (!locationString.trim()) {
        return {
          isValid: false,
          city: '',
          state: '',
          country: '',
          formatted: '',
          error: 'Location is required'
        }
      }

      if (!apiKey || apiKey === 'your_actual_api_key_here') {
        console.warn('Geoapify API key not configured - skipping validation')
        return {
          isValid: true, // Skip validation if no API key
          city: '',
          state: '',
          country: '',
          formatted: locationString
        }
      }

      try {
        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(locationString)}&format=json&limit=1&apiKey=${apiKey}`
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.results && data.results.length > 0) {
          const result = data.results[0]
          
          return {
            isValid: true,
            city: result.city || result.town || result.village || '',
            state: result.state || result.county || '',
            country: result.country || '',
            formatted: result.formatted || locationString,
            coordinates: { lat: result.lat, lon: result.lon }
          }
        } else {
          return {
            isValid: false,
            city: '',
            state: '',
            country: '',
            formatted: locationString,
            error: 'Location not found'
          }
        }
      } catch (error) {
        console.error('Error validating location:', error)
        return {
          isValid: false,
          city: '',
          state: '',
          country: '',
          formatted: locationString,
          error: 'Error validating location'
        }
      }
    },
    [apiKey]
  )

  // Clear suggestions
  const clearSuggestions = useCallback(() => {
    setSuggestions([])
    setIsLoading(false)
  }, [])

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (lastQuery) {
        searchLocations(lastQuery)
      }
    }, debounceMs)

    return () => clearTimeout(timeoutId)
  }, [lastQuery, debounceMs, searchLocations])

  return {
    suggestions,
    isLoading,
    validation,
    searchLocations,
    validateLocation,
    clearSuggestions,
    setValidation
  }
} 