import { useState, useEffect } from 'react'

export interface OperationalStream {
  id: string
  code: string
  name: string
  description?: string
  category: string
  isActive: boolean
  sortOrder: number
}

interface UseOperationalStreamsReturn {
  operationalStreams: OperationalStream[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useOperationalStreams(industryCode?: string, sectorCodes?: string[]): UseOperationalStreamsReturn {
  const [operationalStreams, setOperationalStreams] = useState<OperationalStream[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOperationalStreams = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      if (industryCode) {
        params.append('industry', industryCode)
      }
      if (sectorCodes && sectorCodes.length > 0) {
        params.append('sectors', sectorCodes.join(','))
      }

      const response = await fetch(`/api/operational-streams?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch operational streams')
      }
      
      const data = await response.json()
      
      if (Array.isArray(data)) {
        setOperationalStreams(data)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch operational streams')
      console.error('Error fetching operational streams:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOperationalStreams()
  }, [industryCode, sectorCodes?.join(',')])

  return {
    operationalStreams,
    loading,
    error,
    refetch: fetchOperationalStreams,
  }
}

export interface Sector {
  id: string
  code: string
  name: string
  description?: string
  category: string
  riskProfile: string
  industryId: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface IndustryOperationalStreamAssociation {
  id: string
  industryId: string
  sectorId?: string
  operationalStreamId: string
  isApplicable: boolean
  customName?: string
  customDescription?: string
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  operationalStream: OperationalStream
  sector?: Sector
}

export function useIndustryOperationalStreams(industryId: string) {
  const [associations, setAssociations] = useState<IndustryOperationalStreamAssociation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchIndustryOperationalStreams = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/frameworks/industries/${industryId}/operational-streams`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch industry operational streams')
        }
        
        const data = await response.json()
        setAssociations(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch industry operational streams')
      } finally {
        setLoading(false)
      }
    }

    if (industryId) {
      fetchIndustryOperationalStreams()
    }
  }, [industryId])

  return { associations, loading, error }
} 