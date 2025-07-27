"use client"

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { useAuth } from '@/hooks/use-auth'
import { useBusinessCanvas } from '@/hooks/use-business-canvas'
import { BMCAuthoringHeader } from '@/components/business-canvas/bmc-authoring-header'
import { BusinessCanvas } from '@/components/business-canvas/canvas-visualization'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Target, 
  AlertCircle, 
  Plus,
  Save,
  Download,
  Share,
  Copy,
  Eye,
  Edit
} from 'lucide-react'

export default function BusinessCanvasPage() {
  const { user } = useAuth()
  const {
    businessCanvases,
    loading,
    error,
    currentCanvas,
    hasUnsavedChanges,
    lastSaved,
    setCurrentCanvas,
    setHasUnsavedChanges,
    saveCanvas,
    createCanvas,
    exportCanvas,
    shareCanvas,
    loadTemplate,
    getTemplates,
    createVersion,
    addCollaborator,
    refreshCanvases
  } = useBusinessCanvas()

  const [selectedCanvasId, setSelectedCanvasId] = useState<string>('')
  const [templates, setTemplates] = useState<any[]>([])
  const [collaborators, setCollaborators] = useState<any[]>([])
  const [versions, setVersions] = useState<any[]>([])
  const [enterpriseContext, setEnterpriseContext] = useState<any>(null)
  const [conflicts, setConflicts] = useState<any[]>([])

  // Load templates on component mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const templatesData = await getTemplates()
        setTemplates(templatesData)
      } catch (err) {
        console.error('Failed to load templates:', err)
      }
    }
    loadTemplates()
  }, [getTemplates])

  // Set initial canvas if available
  useEffect(() => {
    if (businessCanvases.length > 0 && !selectedCanvasId) {
      const activeCanvas = businessCanvases.find(canvas => canvas.isActive)
      if (activeCanvas) {
        setSelectedCanvasId(activeCanvas.id)
        setCurrentCanvas(activeCanvas)
      }
    }
  }, [businessCanvases, selectedCanvasId, setCurrentCanvas])

  // Mock enterprise context (in real app, this would come from user context)
  useEffect(() => {
    if (currentCanvas?.enterpriseId) {
      setEnterpriseContext({
        enterprise: {
          id: currentCanvas.enterpriseId,
          name: "Cracked Mountain Pty Ltd",
          legalName: "Cracked Mountain Pty Ltd",
          abn: "12 345 678 901"
        },
        facility: currentCanvas.facility ? {
          id: currentCanvas.facility.id,
          name: currentCanvas.facility.name,
          code: currentCanvas.facility.code
        } : undefined,
        businessUnit: currentCanvas.businessUnit ? {
          id: currentCanvas.businessUnit.id,
          name: currentCanvas.businessUnit.name,
          code: currentCanvas.businessUnit.code
        } : undefined
      })
    }
  }, [currentCanvas])

  // Mock collaborators (in real app, this would come from the API)
  useEffect(() => {
    if (currentCanvas) {
      setCollaborators([
        {
          id: '1',
          user: {
            id: user?.id || '1',
            name: user?.name || 'Current User',
            email: user?.email || 'user@example.com'
          },
          role: 'OWNER',
          lastActivity: new Date().toISOString(),
          isActive: true
        }
      ])
    }
  }, [currentCanvas, user])

  // Mock versions (in real app, this would come from the API)
  useEffect(() => {
    if (currentCanvas) {
      setVersions([
        {
          id: '1',
          versionNumber: currentCanvas.version,
          description: 'Current version',
          createdBy: {
            id: user?.id || '1',
            name: user?.name || 'Current User'
          },
          createdAt: currentCanvas.updatedAt
        }
      ])
    }
  }, [currentCanvas, user])

  // Handle canvas change
  const handleCanvasChange = (canvasId: string) => {
    setSelectedCanvasId(canvasId)
    const canvas = businessCanvases.find(c => c.id === canvasId)
    if (canvas) {
      setCurrentCanvas(canvas)
    }
  }

  // Handle save
  const handleSave = async () => {
    if (currentCanvas) {
      try {
        await saveCanvas(currentCanvas)
        setHasUnsavedChanges(false)
      } catch (err) {
        console.error('Failed to save canvas:', err)
      }
    }
  }

  // Handle export
  const handleExport = async (format: string) => {
    if (currentCanvas) {
      try {
        await exportCanvas(currentCanvas.id, format)
      } catch (err) {
        console.error('Failed to export canvas:', err)
      }
    }
  }

  // Handle share
  const handleShare = async (settings: any) => {
    if (currentCanvas) {
      try {
        await shareCanvas(currentCanvas.id, settings)
      } catch (err) {
        console.error('Failed to share canvas:', err)
      }
    }
  }

  // Handle template load
  const handleTemplateLoad = async (templateId: string) => {
    try {
      await loadTemplate(templateId)
    } catch (err) {
      console.error('Failed to load template:', err)
    }
  }

  // Handle new canvas
  const handleNewCanvas = async () => {
    try {
      const newCanvas = await createCanvas({
        name: 'New Business Canvas',
        description: 'A new business model canvas',
        status: 'DRAFT',
        editMode: 'SINGLE_USER',
        autoSave: true
      })
      setSelectedCanvasId(newCanvas.id)
      setCurrentCanvas(newCanvas)
    } catch (err) {
      console.error('Failed to create new canvas:', err)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto p-6 space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load business canvases: {error}
            </AlertDescription>
          </Alert>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6 space-y-6">
        {/* Enhanced BMC Authoring Header */}
        <BMCAuthoringHeader
          currentCanvasId={selectedCanvasId}
          onCanvasChange={handleCanvasChange}
          onSave={handleSave}
          onExport={handleExport}
          onShare={handleShare}
          onTemplateLoad={handleTemplateLoad}
          onNewCanvas={handleNewCanvas}
          collaborationMode="single"
          enterpriseContext={enterpriseContext}
          collaborators={collaborators}
          versions={versions}
          templates={templates}
          hasUnsavedChanges={hasUnsavedChanges}
          lastSaved={lastSaved}
          conflicts={conflicts}
        />

        {/* Canvas Content */}
        {currentCanvas ? (
          <div className="space-y-6">
            {/* Canvas Status Bar */}
            <div className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">{currentCanvas.name}</h2>
                </div>
                <Badge variant={currentCanvas.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                  {currentCanvas.status}
                </Badge>
                <Badge variant="outline">v{currentCanvas.version}</Badge>
              </div>
              <div className="flex items-center gap-2">
                {hasUnsavedChanges && (
                  <Badge variant="destructive">Unsaved Changes</Badge>
                )}
                <Button variant="outline" size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleShare({ type: 'team' })}>
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Business Canvas Visualization */}
            <BusinessCanvas 
              businessModel={{
                keyPartners: currentCanvas.partnerships.map(p => ({
                  id: p.id,
                  title: p.name,
                  description: p.description || '',
                  priority: 'medium' as const
                })),
                keyActivities: currentCanvas.activities.map(a => ({
                  id: a.id,
                  title: a.name,
                  description: a.description || '',
                  priority: a.priority.toLowerCase() as 'high' | 'medium' | 'low'
                })),
                keyResources: currentCanvas.resources.map(r => ({
                  id: r.id,
                  title: r.name,
                  description: r.description || '',
                  priority: 'medium' as const
                })),
                valuePropositions: currentCanvas.valuePropositions.map(v => ({
                  id: v.id,
                  title: v.description,
                  description: v.description,
                  priority: v.priority.toLowerCase() as 'high' | 'medium' | 'low'
                })),
                customerRelationships: [],
                channels: currentCanvas.channels.map(c => ({
                  id: c.id,
                  title: c.type,
                  description: c.description || '',
                  priority: 'medium' as const
                })),
                customerSegments: currentCanvas.customerSegments.map(cs => ({
                  id: cs.id,
                  title: cs.name,
                  description: cs.description || '',
                  priority: cs.priority.toLowerCase() as 'high' | 'medium' | 'low'
                })),
                costStructure: currentCanvas.costStructures.map(cs => ({
                  id: cs.id,
                  title: cs.description,
                  description: cs.description,
                  priority: 'medium' as const
                })),
                revenueStreams: currentCanvas.revenueStreams.map(rs => ({
                  id: rs.id,
                  title: rs.type,
                  description: rs.description || '',
                  priority: 'medium' as const
                }))
              }}
              onUpdate={(updatedModel) => {
                // Handle canvas updates
                setHasUnsavedChanges(true)
                // In a real implementation, you would update the currentCanvas state
                // and potentially auto-save
              }}
              editMode="edit"
              collaborationStatus={{
                mode: 'single',
                collaborators: [],
                activeUsers: [],
                lastActivity: new Date(),
                conflicts: [],
                permissions: []
              }}
            />
          </div>
        ) : (
          /* Empty State */
          <Card className="text-center py-12">
            <CardContent>
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Canvas Selected</h3>
              <p className="text-gray-600 mb-6">
                Select an existing canvas or create a new one to get started.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button onClick={handleNewCanvas}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Canvas
                </Button>
                <Button variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  )
} 