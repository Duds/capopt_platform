import { useState, useEffect } from 'react'

export interface BusinessCanvas {
  id: string
  name: string
  description: string | null
  version: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  valuePropositions: ValueProposition[]
  customerSegments: CustomerSegment[]
  revenueStreams: RevenueStream[]
  partnerships: Partnership[]
  resources: Resource[]
  activities: Activity[]
  costStructures: CostStructure[]
  channels: Channel[]
}

export interface ValueProposition {
  id: string
  businessCanvasId: string
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  createdAt: string
  updatedAt: string
}

export interface CustomerSegment {
  id: string
  businessCanvasId: string
  name: string
  description: string | null
  size: number | null
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  createdAt: string
  updatedAt: string
}

export interface RevenueStream {
  id: string
  businessCanvasId: string
  type: string
  description: string | null
  estimatedValue: number | null
  frequency: string | null
  createdAt: string
  updatedAt: string
}

export interface Partnership {
  id: string
  businessCanvasId: string
  name: string
  type: string | null
  description: string | null
  value: string | null
  createdAt: string
  updatedAt: string
}

export interface Resource {
  id: string
  businessCanvasId: string
  name: string
  type: 'PHYSICAL' | 'HUMAN' | 'INTELLECTUAL' | 'FINANCIAL'
  description: string | null
  availability: string | null
  cost: number | null
  createdAt: string
  updatedAt: string
}

export interface Activity {
  id: string
  businessCanvasId: string
  name: string
  description: string | null
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  cost: number | null
  createdAt: string
  updatedAt: string
}

export interface CostStructure {
  id: string
  businessCanvasId: string
  description: string
  category: string | null
  amount: number | null
  frequency: string | null
  createdAt: string
  updatedAt: string
}

export interface Channel {
  id: string
  businessCanvasId: string
  type: string
  description: string | null
  effectiveness: string | null
  cost: number | null
  createdAt: string
  updatedAt: string
}

export function useBusinessCanvas() {
  const [businessCanvases, setBusinessCanvases] = useState<BusinessCanvas[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBusinessCanvases = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Add cache-busting headers to prevent stale data
        const response = await fetch('/api/business-canvas?include=valuePropositions,customerSegments,revenueStreams,partnerships,resources,activities,costStructures,channels', {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'X-Requested-With': 'XMLHttpRequest'
          }
        })
        
        if (!response.ok) {
          throw new Error(`Failed to fetch business canvases: ${response.statusText}`)
        }
        
        const data = await response.json()
        
        // Deduplicate data at the source to prevent duplicates from reaching the component
        const uniqueCanvases = data.reduce((acc: BusinessCanvas[], canvas: BusinessCanvas) => {
          const exists = acc.find(c => c.id === canvas.id)
          if (!exists) {
            acc.push(canvas)
          }
          return acc
        }, [])
        
        setBusinessCanvases(uniqueCanvases)
      } catch (err) {
        console.error('Error fetching business canvases:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch business canvases')
      } finally {
        setLoading(false)
      }
    }

    fetchBusinessCanvases()
  }, [])

  const getCanvasById = (id: string) => {
    return businessCanvases.find(canvas => canvas.id === id)
  }

  const getCanvasByName = (name: string) => {
    return businessCanvases.find(canvas => canvas.name.toLowerCase().includes(name.toLowerCase()))
  }

  return {
    businessCanvases,
    loading,
    error,
    getCanvasById,
    getCanvasByName
  }
} 