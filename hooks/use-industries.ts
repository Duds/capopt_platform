import { useState, useEffect } from 'react'

export interface Sector {
  id: string
  code: string
  name: string
  description?: string
  category: string
  riskProfile: string
}

export interface Industry {
  id: string
  code: string
  name: string
  description?: string
  category?: string
  sectors: Sector[]
}

interface UseIndustriesReturn {
  industries: Industry[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useIndustries(): UseIndustriesReturn {
  const [industries, setIndustries] = useState<Industry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchIndustries = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/industries')
      if (!response.ok) {
        throw new Error('Failed to fetch industries')
      }
      
      const data = await response.json()
      if (data.success) {
        setIndustries(data.industries)
      } else {
        throw new Error(data.error || 'Failed to fetch industries')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch industries')
      console.error('Error fetching industries:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIndustries()
  }, [])

  return {
    industries,
    loading,
    error,
    refetch: fetchIndustries
  }
} 