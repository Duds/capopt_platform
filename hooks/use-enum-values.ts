import { useState, useEffect } from 'react'

interface EnumValues {
  [key: string]: string
}

interface UseEnumValuesReturn {
  values: EnumValues
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useEnumValues(
  type: string,
  industryCode?: string
): UseEnumValuesReturn {
  const [values, setValues] = useState<EnumValues>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEnumValues = async () => {
    try {
      setLoading(true)
      setError(null)

      // Check if industry code is required but missing
      const requiresIndustry = ['facility-types', 'sectors', 'operational-streams', 'compliance-frameworks', 'sector-recommendations'].includes(type)
      if (requiresIndustry && !industryCode) {
        setValues({})
        setLoading(false)
        return
      }

      const params = new URLSearchParams({ type })
      if (industryCode) {
        params.append('industry', industryCode)
      }

      const response = await fetch(`/api/enums?${params}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch enum values: ${response.statusText}`)
      }

      const data = await response.json()
      setValues(data.values)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      console.error('Error fetching enum values:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEnumValues()
  }, [type, industryCode])

  const refetch = () => {
    fetchEnumValues()
  }

  return {
    values,
    loading,
    error,
    refetch
  }
}

// Convenience hooks for specific enum types
export function useBusinessTypes() {
  return useEnumValues('business-types')
}

export function useRegionalClassifications() {
  return useEnumValues('regional-classifications')
}

export function useFacilityTypes(industryCode?: string) {
  return useEnumValues('facility-types', industryCode)
}

export function useRiskProfiles() {
  return useEnumValues('risk-profiles')
}

export function useIndustries() {
  return useEnumValues('industries')
}

export function useSectors(industryCode?: string) {
  return useEnumValues('sectors', industryCode)
}

export function useOperationalStreams(industryCode?: string) {
  return useEnumValues('operational-streams', industryCode)
}

export function useComplianceFrameworks(industryCode?: string) {
  return useEnumValues('compliance-frameworks', industryCode)
}

export function useSectorRecommendations(industryCode?: string, sectors?: string[]) {
  const [recommendations, setRecommendations] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!industryCode || !sectors || sectors.length === 0) {
        setRecommendations({})
        setLoading(false)
        return
      }

      const params = new URLSearchParams({ 
        type: 'sector-recommendations',
        industry: industryCode,
        sectors: sectors.join(',')
      })

      const response = await fetch(`/api/enums?${params}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch sector recommendations: ${response.statusText}`)
      }

      const data = await response.json()
      setRecommendations(data.values)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      console.error('Error fetching sector recommendations:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecommendations()
  }, [industryCode, sectors?.join(',')])

  const refetch = () => {
    fetchRecommendations()
  }

  return {
    recommendations,
    loading,
    error,
    refetch
  }
} 