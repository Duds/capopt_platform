import { useState, useEffect, useCallback } from 'react'

export interface BusinessCanvas {
  id: string
  name: string
  description: string | null
  version: string
  isActive: boolean
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED'
  editMode: 'SINGLE_USER' | 'MULTI_USER' | 'READ_ONLY'
  autoSave: boolean
  lastSaved: string
  createdAt: string
  updatedAt: string
  
  // Enterprise context
  enterpriseId?: string
  facilityId?: string
  businessUnitId?: string
  enterprise?: EnterpriseInfo
  facility?: FacilityInfo
  businessUnit?: BusinessUnitInfo
  
  // Canvas hierarchy (for parent-child relationships between canvases)
  parentCanvasId?: string
  
  // Canvas content
  valuePropositions: ValueProposition[]
  customerSegments: CustomerSegment[]
  revenueStreams: RevenueStream[]
  partnerships: Partnership[]
  resources: Resource[]
  activities: Activity[]
  costStructures: CostStructure[]
  channels: Channel[]
  
  // Enhanced features
  versions?: CanvasVersion[]
  collaborators?: CanvasCollaborator[]
  sharingSettings?: CanvasSharingSetting[]
  exportHistory?: CanvasExport[]
  templateId?: string
  templateSource?: CanvasTemplate
}

export interface EnterpriseInfo {
  id: string
  name: string
  legalName: string
  abn: string
  industry: string
  sector: string
}

export interface FacilityInfo {
  id: string
  name: string
  code: string
  type: string
  status: string
}

export interface BusinessUnitInfo {
  id: string
  name: string
  code: string
  type: string
  status: string
}

export interface CanvasVersion {
  id: string
  businessCanvasId: string
  versionNumber: string
  description?: string
  changes?: any
  createdBy: UserInfo
  createdAt: string
}

export interface CanvasCollaborator {
  id: string
  businessCanvasId: string
  userId: string
  role: 'OWNER' | 'EDITOR' | 'REVIEWER' | 'VIEWER'
  permissions?: any
  lastActivity?: string
  isActive: boolean
  user: UserInfo
}

export interface CanvasSharingSetting {
  id: string
  businessCanvasId: string
  type: 'PUBLIC_LINK' | 'EMAIL_INVITE' | 'TEAM_ACCESS' | 'ENTERPRISE_ACCESS'
  value: string
  permissions?: any
  expiresAt?: string
  isActive: boolean
}

export interface CanvasExport {
  id: string
  businessCanvasId: string
  format: 'PDF' | 'PNG' | 'SVG' | 'JSON' | 'CSV' | 'EXCEL'
  fileName: string
  fileSize?: number
  exportedBy: UserInfo
  metadata?: any
  createdAt: string
}

export interface CanvasTemplate {
  id: string
  name: string
  description?: string
  category: 'INDUSTRY' | 'BUSINESS_TYPE' | 'CUSTOM' | 'ENTERPRISE'
  tags: string[]
  thumbnail?: string
  canvas: any
  usageCount: number
  rating: number
  isPublic: boolean
  createdBy: UserInfo
}

export interface UserInfo {
  id: string
  name: string
  email: string
  avatar?: string
}

// Existing interfaces remain the same
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
  const [currentCanvas, setCurrentCanvas] = useState<BusinessCanvas | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)

  // Fetch business canvases with enhanced data
  const fetchBusinessCanvases = useCallback(async () => {
    try {
      console.log('🟡 FETCH BUSINESS CANVASES START')
      setLoading(true)
      setError(null)
      
      // Temporarily use only basic relationships until new tables are fully set up
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
      console.log('🟡 API RESPONSE - Raw data:', data)
      console.log('🟡 API RESPONSE - Canvas count:', data.length)
      console.log('🟡 API RESPONSE - Canvas details:', data.map((c: BusinessCanvas) => ({ 
        id: c.id, 
        name: c.name, 
        parentCanvasId: c.parentCanvasId 
      })))
      
      // Debug: Check if parentCanvasId is present in the response
      const missingParentIds = data.filter((c: BusinessCanvas) => c.parentCanvasId === undefined)
      if (missingParentIds.length > 0) {
        console.warn('⚠️ WARNING: Some canvases missing parentCanvasId:', missingParentIds.map((c: BusinessCanvas) => c.name))
      }
      
      // Debug: Log the actual hierarchy structure
      console.log('🟡 HIERARCHY STRUCTURE:')
      const rootCanvases = data.filter((c: BusinessCanvas) => !c.parentCanvasId)
      const childCanvases = data.filter((c: BusinessCanvas) => c.parentCanvasId)
      console.log('  Root canvases:', rootCanvases.map((c: BusinessCanvas) => c.name))
      console.log('  Child canvases:', childCanvases.map((c: BusinessCanvas) => `${c.name} → ${data.find((p: BusinessCanvas) => p.id === c.parentCanvasId)?.name || 'UNKNOWN'}`))
      
      // Deduplicate data
      const uniqueCanvases = data.reduce((acc: BusinessCanvas[], canvas: BusinessCanvas) => {
        const exists = acc.find(c => c.id === canvas.id)
        if (!exists) {
          acc.push(canvas)
        }
        return acc
      }, [])
      
      console.log('🟡 AFTER DEDUPLICATION - Canvas count:', uniqueCanvases.length)
      console.log('🟡 AFTER DEDUPLICATION - Canvas details:', uniqueCanvases.map((c: BusinessCanvas) => ({ 
        id: c.id, 
        name: c.name, 
        parentCanvasId: c.parentCanvasId 
      })))
      
      setBusinessCanvases(uniqueCanvases)
      console.log('🟢 FETCH BUSINESS CANVASES COMPLETED')
    } catch (err) {
      console.error('🔴 FETCH BUSINESS CANVASES ERROR:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch business canvases')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBusinessCanvases()
  }, [fetchBusinessCanvases])

  // Get canvas by ID
  const getCanvasById = useCallback((id: string) => {
    return businessCanvases.find(canvas => canvas.id === id)
  }, [businessCanvases])

  // Get canvas by name
  const getCanvasByName = useCallback((name: string) => {
    return businessCanvases.find(canvas => canvas.name.toLowerCase().includes(name.toLowerCase()))
  }, [businessCanvases])

  // Save canvas
  const saveCanvas = useCallback(async (canvasData: Partial<BusinessCanvas>) => {
    try {
      setError(null)
      
      const response = await fetch(`/api/business-canvas/${canvasData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(canvasData),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to save canvas: ${response.statusText}`)
      }
      
      const savedCanvas = await response.json()
      
      // Update local state
      setBusinessCanvases(prev => 
        prev.map(canvas => 
          canvas.id === savedCanvas.id ? savedCanvas : canvas
        )
      )
      
      setCurrentCanvas(savedCanvas)
      setHasUnsavedChanges(false)
      setLastSaved(new Date().toISOString())
      
      return savedCanvas
    } catch (err) {
      console.error('Error saving canvas:', err)
      setError(err instanceof Error ? err.message : 'Failed to save canvas')
      throw err
    }
  }, [])

  // Create new canvas
  const createCanvas = useCallback(async (canvasData: Partial<BusinessCanvas>) => {
    try {
      setError(null)
      
      const response = await fetch('/api/business-canvas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(canvasData),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to create canvas: ${response.statusText}`)
      }
      
      const newCanvas = await response.json()
      
      // Update local state
      setBusinessCanvases(prev => [...prev, newCanvas])
      setCurrentCanvas(newCanvas)
      
      return newCanvas
    } catch (err) {
      console.error('Error creating canvas:', err)
      setError(err instanceof Error ? err.message : 'Failed to create canvas')
      throw err
    }
  }, [])

  // Clone canvas
  const cloneCanvas = useCallback(async (canvasId: string) => {
    try {
      setError(null)
      
      const response = await fetch('/api/business-canvas', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'clone',
          canvasId: canvasId
        }),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to clone canvas: ${response.statusText}`)
      }
      
      const clonedCanvas = await response.json()
      
      // Update local state
      setBusinessCanvases(prev => [...prev, clonedCanvas])
      
      // Show success message
      console.log('Canvas cloned successfully:', clonedCanvas.name)
      
      return clonedCanvas
    } catch (err) {
      console.error('Error cloning canvas:', err)
      setError(err instanceof Error ? err.message : 'Failed to clone canvas')
      throw err
    }
  }, [])

  // Delete canvas
  const deleteCanvas = useCallback(async (canvasId: string) => {
    try {
      setError(null)
      
      const response = await fetch(`/api/business-canvas/${canvasId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to delete canvas: ${response.statusText}`)
      }
      
      // Update local state by removing the deleted canvas
      setBusinessCanvases(prev => prev.filter(canvas => canvas.id !== canvasId))
      
      // If the current canvas was deleted, clear it
      if (currentCanvas?.id === canvasId) {
        setCurrentCanvas(null)
      }
      
      console.log('Canvas deleted successfully')
      
      return true
    } catch (err) {
      console.error('Error deleting canvas:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete canvas')
      throw err
    }
  }, [currentCanvas])

  // Archive canvas
  const archiveCanvas = useCallback(async (canvasId: string) => {
    try {
      setError(null)
      
      const response = await fetch(`/api/business-canvas/${canvasId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'ARCHIVED' }),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to archive canvas: ${response.statusText}`)
      }
      
      // Update the canvas status in the local state
      setBusinessCanvases(prev => prev.map(canvas => 
        canvas.id === canvasId 
          ? { ...canvas, status: 'ARCHIVED' as const }
          : canvas
      ))
      
      // If the current canvas is being archived, clear it
      if (currentCanvas?.id === canvasId) {
        setCurrentCanvas(null)
      }
      
      console.log('Canvas archived successfully')
      
      return true
    } catch (err) {
      console.error('Error archiving canvas:', err)
      setError(err instanceof Error ? err.message : 'Failed to archive canvas')
      throw err
    }
  }, [currentCanvas])

  // Export canvas
  const exportCanvas = useCallback(async (canvasId: string, format: string) => {
    try {
      setError(null)
      
      const response = await fetch(`/api/business-canvas/${canvasId}/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ format }),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to export canvas: ${response.statusText}`)
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `business-canvas-${canvasId}.${format.toLowerCase()}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      // Refresh canvas data to get updated export history
      await fetchBusinessCanvases()
      
    } catch (err) {
      console.error('Error exporting canvas:', err)
      setError(err instanceof Error ? err.message : 'Failed to export canvas')
      throw err
    }
  }, [fetchBusinessCanvases])

  // Share canvas
  const shareCanvas = useCallback(async (canvasId: string, shareSettings: any) => {
    try {
      setError(null)
      
      const response = await fetch(`/api/business-canvas/${canvasId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shareSettings),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to share canvas: ${response.statusText}`)
      }
      
      const shareResult = await response.json()
      
      // Refresh canvas data to get updated sharing settings
      await fetchBusinessCanvases()
      
      return shareResult
    } catch (err) {
      console.error('Error sharing canvas:', err)
      setError(err instanceof Error ? err.message : 'Failed to share canvas')
      throw err
    }
  }, [fetchBusinessCanvases])

  // Load template
  const loadTemplate = useCallback(async (templateId: string) => {
    try {
      setError(null)
      
      const response = await fetch(`/api/business-canvas/templates/${templateId}/load`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to load template: ${response.statusText}`)
      }
      
      const newCanvas = await response.json()
      
      // Update local state
      setBusinessCanvases(prev => [...prev, newCanvas])
      setCurrentCanvas(newCanvas)
      
      return newCanvas
    } catch (err) {
      console.error('Error loading template:', err)
      setError(err instanceof Error ? err.message : 'Failed to load template')
      throw err
    }
  }, [])

  // Get templates
  const getTemplates = useCallback(async () => {
    try {
      setError(null)
      
      const response = await fetch('/api/business-canvas/templates', {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch templates: ${response.statusText}`)
      }
      
      const templates = await response.json()
      return templates
    } catch (err) {
      console.error('Error fetching templates:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch templates')
      throw err
    }
  }, [])

  // Create version
  const createVersion = useCallback(async (canvasId: string, versionData: Partial<CanvasVersion>) => {
    try {
      setError(null)
      
      const response = await fetch(`/api/business-canvas/${canvasId}/versions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(versionData),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to create version: ${response.statusText}`)
      }
      
      const newVersion = await response.json()
      
      // Refresh canvas data to get updated versions
      await fetchBusinessCanvases()
      
      return newVersion
    } catch (err) {
      console.error('Error creating version:', err)
      setError(err instanceof Error ? err.message : 'Failed to create version')
      throw err
    }
  }, [fetchBusinessCanvases])

  // Add collaborator
  const addCollaborator = useCallback(async (canvasId: string, collaboratorData: Partial<CanvasCollaborator>) => {
    try {
      setError(null)
      
      const response = await fetch(`/api/business-canvas/${canvasId}/collaborators`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(collaboratorData),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to add collaborator: ${response.statusText}`)
      }
      
      const newCollaborator = await response.json()
      
      // Refresh canvas data to get updated collaborators
      await fetchBusinessCanvases()
      
      return newCollaborator
    } catch (err) {
      console.error('Error adding collaborator:', err)
      setError(err instanceof Error ? err.message : 'Failed to add collaborator')
      throw err
    }
  }, [fetchBusinessCanvases])

  return {
    // State
    businessCanvases,
    loading,
    error,
    currentCanvas,
    hasUnsavedChanges,
    lastSaved,
    
    // Actions
    setCurrentCanvas,
    setHasUnsavedChanges,
    setBusinessCanvases,
    getCanvasById,
    getCanvasByName,
    saveCanvas,
    createCanvas,
    cloneCanvas,
    deleteCanvas,
    archiveCanvas,
    exportCanvas,
    shareCanvas,
    loadTemplate,
    getTemplates,
    createVersion,
    addCollaborator,
    refreshCanvases: fetchBusinessCanvases,
  }
} 