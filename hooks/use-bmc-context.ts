import { useState, useEffect } from 'react'

export interface BMCContext {
  valuePropositions: any[]
  customerSegments: any[]
  channels: any[]
  customerRelationships: any[]
  keyActivities: any[]
  keyResources: any[]
  keyPartners: any[]
  costStructure: any[]
  revenueStreams: any[]
}

export function useBMCContext(businessCanvasId?: string) {
  const [bmcContext, setBmcContext] = useState<BMCContext | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!businessCanvasId) {
      setBmcContext(null)
      setError(null)
      return
    }

    const fetchBMCContext = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/business-canvas/${businessCanvasId}?include=valuePropositions,customerSegments,channels,customerRelationships,keyActivities,keyResources,partnerships,costStructures,revenueStreams`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch BMC context: ${response.statusText}`)
        }
        
        const data = await response.json()
        
        // Transform the API response to match BMCContext interface
        const context: BMCContext = {
          valuePropositions: data.valuePropositions || [],
          customerSegments: data.customerSegments || [],
          channels: data.channels || [],
          customerRelationships: data.customerRelationships || [],
          keyActivities: data.keyActivities || [],
          keyResources: data.keyResources || [],
          keyPartners: data.partnerships || [], // Note: partnerships in API = keyPartners in BMC
          costStructure: data.costStructures || [],
          revenueStreams: data.revenueStreams || []
        }
        
        setBmcContext(context)
      } catch (err) {
        console.error('Error fetching BMC context:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch BMC context')
        setBmcContext(null)
      } finally {
        setLoading(false)
      }
    }

    fetchBMCContext()
  }, [businessCanvasId])

  return {
    bmcContext,
    loading,
    error,
    refetch: () => {
      if (businessCanvasId) {
        setLoading(true)
        setError(null)
        fetch(`/api/business-canvas/${businessCanvasId}?include=valuePropositions,customerSegments,channels,customerRelationships,keyActivities,keyResources,partnerships,costStructures,revenueStreams`)
          .then(response => response.json())
          .then(data => {
            const context: BMCContext = {
              valuePropositions: data.valuePropositions || [],
              customerSegments: data.customerSegments || [],
              channels: data.channels || [],
              customerRelationships: data.customerRelationships || [],
              keyActivities: data.keyActivities || [],
              keyResources: data.keyResources || [],
              keyPartners: data.partnerships || [],
              costStructure: data.costStructures || [],
              revenueStreams: data.revenueStreams || []
            }
            setBmcContext(context)
          })
          .catch(err => {
            setError(err.message)
            setBmcContext(null)
          })
          .finally(() => setLoading(false))
      }
    }
  }
} 