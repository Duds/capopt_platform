import { useState, useEffect } from 'react'

export interface BusinessCanvas {
  id: string
  name: string
  description?: string
  industry?: string
  sector?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  enterpriseId?: string
  facilityId?: string
  businessUnitId?: string
}

export function useBusinessCanvases() {
  const [businessCanvases, setBusinessCanvases] = useState<BusinessCanvas[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBusinessCanvases = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/business-canvas?isActive=true')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch business canvases: ${response.statusText}`)
        }
        
        const data = await response.json()
        setBusinessCanvases(data)
      } catch (err) {
        console.error('Error fetching business canvases:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch business canvases')
      } finally {
        setLoading(false)
      }
    }

    fetchBusinessCanvases()
  }, [])

  return {
    businessCanvases,
    loading,
    error,
    refetch: () => {
      setLoading(true)
      setError(null)
      fetch('/api/business-canvas?isActive=true')
        .then(response => response.json())
        .then(data => setBusinessCanvases(data))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false))
    }
  }
} 