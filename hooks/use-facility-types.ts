import { useState, useEffect } from 'react'

export interface FacilityType {
  id: string
  code: string
  name: string
  description?: string
  category: string
  riskProfile: string
  isActive: boolean
  sortOrder: number
}

interface UseFacilityTypesReturn {
  facilityTypes: FacilityType[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useFacilityTypes(industryCode?: string): UseFacilityTypesReturn {
  const [facilityTypes, setFacilityTypes] = useState<FacilityType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFacilityTypes = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      if (industryCode) {
        params.append('industry', industryCode)
      }
      
      const response = await fetch(`/api/facility-types?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch facility types')
      }
      
      const data = await response.json()
      if (Array.isArray(data)) {
        setFacilityTypes(data)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch facility types')
      console.error('Error fetching facility types:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFacilityTypes()
  }, [industryCode])

  return {
    facilityTypes,
    loading,
    error,
    refetch: fetchFacilityTypes
  }
}

export interface IndustryFacilityTypeAssociation {
  id: string
  industryId: string
  facilityTypeId: string
  isApplicable: boolean
  riskProfile?: string
  customName?: string
  customDescription?: string
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  facilityType: FacilityType
}

export function useIndustryFacilityTypes(industryId: string) {
  const [associations, setAssociations] = useState<IndustryFacilityTypeAssociation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchIndustryFacilityTypes = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/frameworks/industries/${industryId}/facility-types`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch industry facility types')
        }
        
        const data = await response.json()
        setAssociations(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch industry facility types')
      } finally {
        setLoading(false)
      }
    }

    if (industryId) {
      fetchIndustryFacilityTypes()
    }
  }, [industryId])

  return { associations, loading, error }
} 