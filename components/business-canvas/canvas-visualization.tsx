/**
 * Business Canvas Visualization Component - Strategic Business Model Interface
 * 
 * Provides interactive business model canvas visualization for the CapOpt Platform:
 * - 9-section business model canvas layout (Osterwalder & Pigneur)
 * - Strategic navigation flow integration
 * - Implementation status transparency
 * - Edit and view modes with clear visual distinction
 * - Real-time business model updates
 * - Export and sharing capabilities
 * - Visual representation of strategic business components
 * - Integration with operational capability framework
 * 
 * This component enables strategic planning and business model
 * visualization within the operational capability framework.
 */

'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { 
  Plus,
  Edit,
  Trash2,
  Download,
  Share,
  Save,
  Eye,
  Copy,
  Users,
  Handshake,
  Activity,
  Package,
  Heart,
  Radio,
  DollarSign,
  TrendingDown,
  Target,
  Zap,
  Gem,
  Coins,
  Layers,
  AlertTriangle,
  Grid3X3,
  List
} from 'lucide-react'
import { CanvasVisualizationProps, BusinessModel, CanvasItem } from './types'
import { canvasSections, getPriorityColor } from './utils'
import { useBusinessCanvas, BusinessCanvas as DBBusinessCanvas } from '@/hooks/use-business-canvas'
import { CanvasTreeView } from './canvas-tree-view'
import { NewCanvasForm } from './new-canvas-form'

export function CanvasVisualization({ 
  businessModel, 
  onUpdate, 
  isEditing = false,
  viewMode = 'canvas',
  onViewModeChange,
  onEditingChange
}: CanvasVisualizationProps) {
  const [editingItem, setEditingItem] = useState<{ section: keyof BusinessModel; item: CanvasItem } | null>(null)
  const [newItem, setNewItem] = useState<{ section: keyof BusinessModel } | null>(null)
  const [selectedCanvas, setSelectedCanvas] = useState<string>('')
  const [showTreeView, setShowTreeView] = useState(true)
  const [showNewCanvasForm, setShowNewCanvasForm] = useState(false)
  const [isCreatingRootCanvas, setIsCreatingRootCanvas] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean
    canvasId: string | null
    canvasName: string | null
  }>({
    isOpen: false,
    canvasId: null,
    canvasName: null
  })
  
  // Fetch business canvas data from database
  const { businessCanvases, loading, error, refreshCanvases, setBusinessCanvases, cloneCanvas, deleteCanvas, archiveCanvas } = useBusinessCanvas()
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Track businessCanvases changes for debugging
  useEffect(() => {
    console.log('🟡 BUSINESS CANVASES STATE CHANGED:', { 
      count: businessCanvases.length,
      canvases: businessCanvases.map(c => ({ 
        id: c.id, 
        name: c.name, 
        parentCanvasId: c.parentCanvasId 
      }))
    })
  }, [businessCanvases])

  // Sync selectedCanvas with URL parameter
  useEffect(() => {
    const canvasIdFromUrl = searchParams.get('canvasId')
    if (canvasIdFromUrl && canvasIdFromUrl !== selectedCanvas) {
      setSelectedCanvas(canvasIdFromUrl)
    }
  }, [searchParams, selectedCanvas])

  // Determine canvas type based on relationships and content
  const determineCanvasType = (canvas: any): 'ENTERPRISE' | 'BUSINESS_UNIT' | 'OPERATIONAL' | 'SPECIALIZED' => {
    // If this canvas has children, it's likely an enterprise or business unit
    const hasChildren = businessCanvases.some(c => c.parentCanvasId === canvas.id)
    
    if (hasChildren) {
      // If it has many children or is named "enterprise", it's likely an enterprise
      const childCount = businessCanvases.filter(c => c.parentCanvasId === canvas.id).length
      if (childCount > 2 || canvas.name.toLowerCase().includes('enterprise')) {
        return 'ENTERPRISE'
      }
      return 'BUSINESS_UNIT'
    }
    
    // If it has a parent, it's likely operational or specialized
    if (canvas.parentCanvasId) {
      // Check if it's specialized based on name or content
      if (canvas.name.toLowerCase().includes('precious') || 
          canvas.name.toLowerCase().includes('uranium') ||
          canvas.name.toLowerCase().includes('copper')) {
        return 'SPECIALIZED'
      }
      return 'OPERATIONAL'
    }
    
    // Default to business unit if no clear indicators
    return 'BUSINESS_UNIT'
  }

  // Determine canvas level based on hierarchy depth
  const determineCanvasLevel = (canvas: any, allCanvases: any[]): 'PARENT' | 'CHILD' | 'GRANDCHILD' => {
    // If this canvas has a parent (parentCanvasId points to another canvas), it's a child
    if (canvas.parentCanvasId) {
      // Check if the parent also has a parent (making this a grandchild)
      const parent = allCanvases.find(c => c.id === canvas.parentCanvasId)
      if (parent && parent.parentCanvasId) {
        return 'GRANDCHILD'
      }
      return 'CHILD'
    }
    
    // If this canvas has children, it's a parent
    const hasChildren = allCanvases.some(c => c.parentCanvasId === canvas.id)
    if (hasChildren) {
      return 'PARENT'
    }
    
    // Default to parent if no clear indicators
    return 'PARENT'
  }

  // Convert database business canvases to tree structure
  const convertBusinessCanvasesToTree = (canvases: DBBusinessCanvas[]): any[] => {
    console.log('🟡 CONVERT TO TREE START:', { 
      inputCount: canvases.length,
      inputCanvases: canvases.map(c => ({ id: c.id, name: c.name, parentCanvasId: c.parentCanvasId }))
    })
    
    const canvasMap = new Map<string, any>()
    const rootNodes: any[] = []

    // First pass: create all nodes
    canvases.forEach(canvas => {
      canvasMap.set(canvas.id, {
        id: canvas.id,
        name: canvas.name,
        description: canvas.description || '',
        type: determineCanvasType(canvas),
        level: determineCanvasLevel(canvas, canvases),
        children: [],
        isExpanded: false
      })
    })

    console.log('🟡 AFTER FIRST PASS - Canvas map size:', canvasMap.size)
    console.log('🟡 AFTER FIRST PASS - Canvas map keys:', Array.from(canvasMap.keys()))

    // Second pass: establish parent-child relationships
    canvases.forEach(canvas => {
      const node = canvasMap.get(canvas.id)
      if (!node) {
        console.warn('Node not found in map:', canvas.id)
        return
      }

      if (canvas.parentCanvasId) {
        const parentNode = canvasMap.get(canvas.parentCanvasId)
        if (parentNode) {
          parentNode.children.push(node)
          console.log('🟡 PARENT-CHILD RELATIONSHIP:', { 
            child: node.name, 
            parent: parentNode.name 
          })
        } else {
          console.warn('Parent node not found, making root:', { 
            child: node.name, 
            parentId: canvas.parentCanvasId 
          })
          rootNodes.push(node)
        }
      } else {
        rootNodes.push(node)
        console.log('🟡 ROOT NODE:', node.name)
      }
    })

    console.log('🟡 AFTER SECOND PASS - Root nodes count:', rootNodes.length)
    console.log('🟡 AFTER SECOND PASS - Root nodes:', rootNodes.map(n => n.name))
    console.log('🟢 CONVERT TO TREE COMPLETED')

    return rootNodes
  }

  // Generate canvas options from database data (ensure uniqueness)
  const canvasOptions = useMemo(() => {
    console.log('🟡 CANVAS OPTIONS MEMO - businessCanvases count:', businessCanvases.length)
    console.log('🟡 CANVAS OPTIONS MEMO - businessCanvases:', businessCanvases.map(c => ({ 
      id: c.id, 
      name: c.name, 
      parentCanvasId: c.parentCanvasId 
    })))
    
    const uniqueCanvases = businessCanvases.reduce((acc, canvas) => {
      if (!acc.find(c => c.id === canvas.id)) {
        acc.push(canvas)
      }
      return acc
    }, [] as typeof businessCanvases)

    return uniqueCanvases.map(canvas => {
      // Map canvas names to icons
      const getIcon = (name: string) => {
        if (name.toLowerCase().includes('enterprise')) return Target
        if (name.toLowerCase().includes('mining')) return Target
        if (name.toLowerCase().includes('copper')) return Zap
        if (name.toLowerCase().includes('uranium')) return Target
        if (name.toLowerCase().includes('precious')) return Gem
        if (name.toLowerCase().includes('operations')) return Activity
        return Target
      }

      return {
        value: canvas.id,
        label: canvas.name,
        description: canvas.description || '',
        icon: getIcon(canvas.name)
      }
    })
  }, [businessCanvases])

  // Debug: Check for duplicates in canvas options
  const uniqueNames = new Set(canvasOptions.map((opt: any) => opt.label))
  if (uniqueNames.size !== canvasOptions.length) {
    console.warn('Duplicate canvas names detected:', canvasOptions.map((opt: any) => opt.label))
  }

  // Add version-based cache invalidation
  const canvasVersion = useMemo(() => {
    return businessCanvases.reduce((hash, canvas) => {
      return hash + canvas.id + canvas.updatedAt
    }, '')
  }, [businessCanvases])

  // Convert database business canvases to tree structure
  const treeData = useMemo(() => {
    console.log('🟡 TREE DATA MEMO - businessCanvases count:', businessCanvases.length)
    console.log('🟡 TREE DATA MEMO - businessCanvases:', businessCanvases.map(c => ({ 
      id: c.id, 
      name: c.name, 
      parentCanvasId: c.parentCanvasId 
    })))
    
    return convertBusinessCanvasesToTree(businessCanvases)
  }, [businessCanvases])


  // Set default selected canvas to enterprise canvas
  useEffect(() => {
    if (businessCanvases.length > 0 && !selectedCanvas) {
      const enterpriseCanvas = businessCanvases.find(canvas => 
        canvas.name.toLowerCase().includes('enterprise')
      )
      setSelectedCanvas(enterpriseCanvas?.id || businessCanvases[0].id)
    }
  }, [businessCanvases, selectedCanvas])

  // Get current selected canvas data
  const currentCanvas = businessCanvases.find(canvas => canvas.id === selectedCanvas)

  // Convert database canvas to business model format
  const convertCanvasToBusinessModel = (canvas: DBBusinessCanvas): BusinessModel => {
    return {
      keyPartners: canvas.partnerships.map(p => ({
        id: p.id,
        title: p.name,
        description: p.description || '',
        priority: p.type === 'Strategic' ? 'high' : 'medium',
        isImplemented: true
      })),
      keyActivities: canvas.activities.map(a => ({
        id: a.id,
        title: a.name,
        description: a.description || '',
        priority: a.priority.toLowerCase() as 'low' | 'medium' | 'high',
        isImplemented: true
      })),
      keyResources: canvas.resources.map(r => ({
        id: r.id,
        title: r.name,
        description: r.description || '',
        priority: r.type === 'PHYSICAL' ? 'high' : 'medium',
        isImplemented: true
      })),
      valuePropositions: canvas.valuePropositions.map(vp => ({
        id: vp.id,
        title: vp.description,
        description: vp.description,
        priority: vp.priority.toLowerCase() as 'low' | 'medium' | 'high',
        isImplemented: true
      })),
      customerRelationships: canvas.customerSegments.map(cs => ({
        id: cs.id,
        title: cs.name,
        description: cs.description || '',
        priority: cs.priority.toLowerCase() as 'low' | 'medium' | 'high',
        isImplemented: true
      })),
      channels: canvas.channels.map(c => ({
        id: c.id,
        title: c.type,
        description: c.description || '',
        priority: c.effectiveness === 'High' ? 'high' : 'medium',
        isImplemented: true
      })),
      customerSegments: canvas.customerSegments.map(cs => ({
        id: cs.id,
        title: cs.name,
        description: cs.description || '',
        priority: cs.priority.toLowerCase() as 'low' | 'medium' | 'high',
        isImplemented: true
      })),
      costStructure: canvas.costStructures.map(cs => ({
        id: cs.id,
        title: cs.description,
        description: cs.description,
        priority: cs.category === 'Operations' ? 'high' : 'medium',
        isImplemented: true
      })),
      revenueStreams: canvas.revenueStreams.map(rs => ({
        id: rs.id,
        title: rs.type,
        description: rs.description || '',
        priority: rs.estimatedValue && rs.estimatedValue > 1000000 ? 'high' : 'medium',
        isImplemented: true
      }))
    }
  }

  // Get current business model from selected canvas
  const currentBusinessModel = currentCanvas ? convertCanvasToBusinessModel(currentCanvas) : businessModel

  const sectionConfig = {
    keyPartners: {
      title: "Key Partners",
      icon: Handshake,
      color: "bg-blue-50 border-blue-200",
      description: "Who are our key partners and suppliers?",
    },
    keyActivities: {
      title: "Key Activities",
      icon: Activity,
      color: "bg-green-50 border-green-200",
      description: "What key activities does our value proposition require?",
    },
    keyResources: {
      title: "Key Resources",
      icon: Package,
      color: "bg-purple-50 border-purple-200",
      description: "What key resources does our value proposition require?",
    },
    valuePropositions: {
      title: "Value Propositions",
      icon: Heart,
      color: "bg-red-50 border-red-200",
      description: "What value do we deliver to customers?",
    },
    customerRelationships: {
      title: "Customer Relationships",
      icon: Users,
      color: "bg-orange-50 border-orange-200",
      description: "What type of relationship does each customer segment expect?",
    },
    channels: {
      title: "Channels",
      icon: Radio,
      color: "bg-yellow-50 border-yellow-200",
      description: "Through which channels do we reach our customers?",
    },
    customerSegments: {
      title: "Customer Segments",
      icon: Users,
      color: "bg-indigo-50 border-indigo-200",
      description: "For whom are we creating value?",
    },
    costStructure: {
      title: "Cost Structure",
      icon: TrendingDown,
      color: "bg-gray-50 border-gray-200",
      description: "What are the most important costs in our business model?",
    },
    revenueStreams: {
      title: "Revenue Streams",
      icon: DollarSign,
      color: "bg-emerald-50 border-emerald-200",
      description: "For what value are customers willing to pay?",
    },
  }

  const addItem = (section: keyof BusinessModel, item: Omit<CanvasItem, "id">) => {
    const newId = Date.now().toString()
    const updatedModel = { ...businessModel }
    updatedModel[section] = [...updatedModel[section], { ...item, id: newId }]
    onUpdate(updatedModel)
  }

  const updateItem = (section: keyof BusinessModel, itemId: string, updates: Partial<CanvasItem>) => {
    const updatedModel = { ...businessModel }
    updatedModel[section] = updatedModel[section].map((item) => 
      item.id === itemId ? { ...item, ...updates } : item
    )
    onUpdate(updatedModel)
  }

  const deleteItem = (section: keyof BusinessModel, itemId: string) => {
    const updatedModel = { ...businessModel }
    updatedModel[section] = updatedModel[section].filter((item) => item.id !== itemId)
    onUpdate(updatedModel)
  }

  // Handle new canvas creation
  const handleCreateNewCanvas = (businessInfo: any) => {
    console.log('Creating new canvas with business info:', businessInfo)
    // TODO: Implement canvas creation logic
    setShowNewCanvasForm(false)
  }

  // Handle canvas tree actions
  const handleSelectCanvas = (canvasId: string) => {
    setSelectedCanvas(canvasId)
    
    // Update URL with canvasId parameter
    const params = new URLSearchParams(searchParams.toString())
    params.set('canvasId', canvasId)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const handleAddChild = (parentId: string) => {
    console.log('Adding child canvas to parent:', parentId)
    setShowNewCanvasForm(true)
  }

  const handleCloneCanvas = async (canvasId: string) => {
    console.log('Cloning canvas:', canvasId)
    try {
      const clonedCanvas = await cloneCanvas(canvasId)
      toast({
        title: "Success",
        description: `Canvas "${clonedCanvas.name}" cloned successfully`,
        variant: "default",
      })
      // Refresh the canvas list to show the new cloned canvas
      await refreshCanvases()
    } catch (error) {
      console.error('Error cloning canvas:', error)
      toast({
        title: "Error",
        description: "Failed to clone canvas. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditCanvas = (canvasId: string) => {
    console.log('Editing canvas:', canvasId)
    // Select the canvas and enable edit mode within the current context
    setSelectedCanvas(canvasId)
    onEditingChange?.(true)
    
    // Find the canvas and convert it to business model for editing
    const canvasToEdit = businessCanvases.find(c => c.id === canvasId)
    if (canvasToEdit) {
      const businessModel = convertCanvasToBusinessModel(canvasToEdit)
      onUpdate?.(businessModel)
    }
  }

  const handleDeleteCanvas = (canvasId: string) => {
    console.log('Requesting delete confirmation for canvas:', canvasId)
    const canvasToDelete = businessCanvases.find(c => c.id === canvasId)
    if (canvasToDelete) {
      setDeleteConfirmation({
        isOpen: true,
        canvasId: canvasId,
        canvasName: canvasToDelete.name
      })
    }
  }

  const handleArchiveCanvas = async (canvasId: string) => {
    console.log('Archiving canvas:', canvasId)
    const canvasToArchive = businessCanvases.find(c => c.id === canvasId)
    if (!canvasToArchive) return
    
    try {
      await archiveCanvas(canvasId)
      toast({
        title: "Canvas Archived",
        description: `"${canvasToArchive.name}" has been archived.`,
        variant: "default",
      })
      // Refresh the canvas list
      await refreshCanvases()
    } catch (error) {
      console.error('Error archiving canvas:', error)
      toast({
        title: "Archive Failed",
        description: "Failed to archive canvas. Please try again.",
        variant: "destructive",
      })
    }
  }

  const confirmDeleteCanvas = async () => {
    if (!deleteConfirmation.canvasId) return
    
    try {
      await deleteCanvas(deleteConfirmation.canvasId)
      toast({
        title: "Canvas Deleted",
        description: `"${deleteConfirmation.canvasName}" has been permanently deleted.`,
        variant: "default",
      })
      // Refresh the canvas list
      await refreshCanvases()
    } catch (error) {
      console.error('Error deleting canvas:', error)
      toast({
        title: "Delete Failed",
        description: "Failed to delete canvas. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteConfirmation({
        isOpen: false,
        canvasId: null,
        canvasName: null
      })
    }
  }

  const cancelDeleteCanvas = () => {
    setDeleteConfirmation({
      isOpen: false,
      canvasId: null,
      canvasName: null
    })
  }

  const handleMoveCanvas = async (canvasId: string, newParentId: string | null) => {
    console.log('🟣 HANDLE MOVE CANVAS START:', { 
      canvasId, 
      newParentId, 
      timestamp: new Date().toISOString() 
    })
    
    try {
      // Find the canvas to move
      const canvasToMove = businessCanvases.find(c => c.id === canvasId)
      console.log('🟡 CANVAS LOOKUP:', { 
        canvasId, 
        canvasFound: !!canvasToMove, 
        canvasName: canvasToMove?.name 
      })
      if (!canvasToMove) {
        console.error('🔴 CANVAS NOT FOUND:', canvasId)
        toast({
          title: "Error",
          description: "Canvas not found",
          variant: "destructive",
        })
        return
      }

      // Prevent circular references
      if (newParentId && newParentId !== 'root') {
        // Prevent moving a canvas to be its own parent
        if (newParentId === canvasId) {
          console.error('Cannot move canvas to be its own parent')
          toast({
            title: "Error",
            description: "Cannot move a canvas to be its own parent",
            variant: "destructive",
          })
          return
        }
        
        // Check if the new parent is a descendant of the canvas being moved
        console.log('🟡 CIRCULAR REFERENCE CHECK:', { canvasId, newParentId })
        const isCircular = checkForCircularReference(canvasId, newParentId, businessCanvases)
        console.log('🟡 CIRCULAR REFERENCE RESULT:', { isCircular })
        
        if (isCircular) {
          console.error('🔴 CIRCULAR REFERENCE DETECTED - Move rejected')
          toast({
            title: "Error",
            description: "Cannot create circular reference. This would create an invalid hierarchy.",
            variant: "destructive",
          })
          return
        }
      }

      // Determine the new parent type and ID
      let updateData: any = {}
      
      if (newParentId === 'root' || newParentId === null) {
        // Moving to root level
        updateData = {
          parentCanvasId: null // Explicitly set to null for root
        }
      } else {
        // Find the new parent canvas
        const newParent = businessCanvases.find(c => c.id === newParentId)
        if (!newParent) {
          console.error('New parent not found:', newParentId)
          toast({
            title: "Error",
            description: "New parent canvas not found",
            variant: "destructive",
          })
          return
        }

        // Create a parent-child relationship between canvases
        updateData = {
          parentCanvasId: newParent.id
        }
      }

      // Update the canvas in the database
      console.log('🟡 API CALL - Updating canvas:', { 
        url: `/api/business-canvas/${canvasId}`,
        method: 'PUT',
        updateData 
      })
      
      const response = await fetch(`/api/business-canvas/${canvasId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      console.log('🟡 API RESPONSE:', { 
        status: response.status, 
        statusText: response.statusText,
        ok: response.ok 
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('🔴 API ERROR - Response body:', errorText)
        throw new Error(`Failed to move canvas: ${response.statusText}`)
      }

      const updatedCanvas = await response.json()
      console.log('🟢 API SUCCESS - Updated canvas:', updatedCanvas)
      
      // Update local state optimistically instead of full refresh to preserve tree state
      console.log('🟡 UPDATING LOCAL STATE OPTIMISTICALLY...')
      console.log('🟡 BEFORE UPDATE - businessCanvases count:', businessCanvases.length)
      console.log('🟡 BEFORE UPDATE - businessCanvases:', businessCanvases.map(c => ({ id: c.id, name: c.name, parentCanvasId: c.parentCanvasId })))
      
      // Update the moved canvas in the local state
      setBusinessCanvases((prev: DBBusinessCanvas[]) => 
        prev.map((canvas: DBBusinessCanvas) => 
          canvas.id === canvasId ? { ...canvas, parentCanvasId: updatedCanvas.parentCanvasId } : canvas
        )
      )
      
      console.log('🟡 AFTER UPDATE - businessCanvases count:', businessCanvases.length)
      console.log('🟢 LOCAL STATE UPDATED - Tree state preserved')

      // If the moved canvas is currently selected, update selection
      if (selectedCanvas === canvasId) {
        console.log('🟡 UPDATING SELECTED CANVAS')
        setSelectedCanvas(canvasId) // Trigger re-render
      }

      console.log('🟢 CANVAS MOVE COMPLETED SUCCESSFULLY:', { 
        canvasId, 
        newParentId, 
        updatedCanvas 
      })
      
      // Show success notification
      toast({
        title: "Success",
        description: `Canvas "${canvasToMove.name}" moved successfully.`,
        variant: "default",
      })

    } catch (error: any) {
      console.error('🔴 HANDLE MOVE CANVAS ERROR:', error)
      toast({
        title: "Error",
        description: `Failed to move canvas: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  // Check for circular references in the hierarchy
  const checkForCircularReference = (canvasId: string, newParentId: string, canvases: any[]): boolean => {
    console.log('🟡 CIRCULAR REFERENCE CHECK - Details:', { 
      canvasId, 
      newParentId,
      canvasToMove: canvases.find(c => c.id === canvasId)?.name,
      newParent: canvases.find(c => c.id === newParentId)?.name
    })
    
    // Prevent moving to self
    if (newParentId === canvasId) {
      console.log('🔴 CIRCULAR REFERENCE - Self reference detected')
      return true
    }
    
    // Check if the new parent is a descendant of the canvas being moved
    // This would create a circular reference: A → B → C → A
    const visited = new Set<string>()
    
    const checkIfDescendant = (checkId: string): boolean => {
      if (visited.has(checkId)) return false
      visited.add(checkId)
      
      // If we find the canvas being moved in the ancestry of the new parent, it's a circular reference
      if (checkId === canvasId) {
        console.log('🔴 CIRCULAR REFERENCE - New parent is descendant of canvas being moved')
        return true // Found circular reference
      }
      
      // Check the parent of the current canvas
      const currentCanvas = canvases.find(c => c.id === checkId)
      if (currentCanvas && currentCanvas.parentCanvasId) {
        return checkIfDescendant(currentCanvas.parentCanvasId)
      }
      
      return false
    }
    
    // Start checking from the new parent's ancestry
    const isCircular = checkIfDescendant(newParentId)
    console.log('🟡 CIRCULAR REFERENCE RESULT:', { isCircular })
    return isCircular
  }

  const renderCanvasSection = (sectionKey: keyof BusinessModel) => {
    const section = sectionConfig[sectionKey]
    const items = currentBusinessModel[sectionKey] || []
    const Icon = section.icon
    const hasData = items.length > 0

    return (
      <Card 
        key={sectionKey} 
        className={`${section.color} min-h-[350px] h-full`}
      >
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-xl">
            <Icon className="h-6 w-6 mr-3" />
            {section.title}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">{section.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-1">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="bg-white p-4 rounded-lg border shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium text-base leading-tight">{item.title}</h4>
                <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                  <Badge variant="secondary" className={getPriorityColor(item.priority)}>
                    {item.priority}
                  </Badge>
                  {isEditing && (
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setEditingItem({ section: sectionKey, item })}
                        disabled={!hasData}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        onClick={() => deleteItem(sectionKey, item.id)}
                        disabled={!hasData}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}

          {isEditing && (
            <Button
              variant="outline"
              className="w-full border-2 border-dashed border-gray-300 hover:border-gray-400 bg-transparent py-3"
              onClick={() => setNewItem({ section: sectionKey })}
              disabled={!hasData}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add {section.title.slice(0, -1)}
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  const renderListView = () => {
    return (
      <div className="space-y-6">
        {Object.entries(sectionConfig).map(([sectionKey, section]) => {
          const items = currentBusinessModel[sectionKey as keyof BusinessModel] || []
          const Icon = section.icon
          
          return (
            <Card key={sectionKey}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  {section.title}
                  <Badge variant="outline" className="text-xs">
                    {items.length} items
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {section.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {items.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Icon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-sm">No {section.title.toLowerCase()} defined</p>
                    {isEditing && (
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setNewItem({ section: sectionKey as keyof BusinessModel })}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add {section.title.slice(0, -1)}
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium">{item.title}</h4>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getPriorityColor(item.priority)}`}
                            >
                              {item.priority}
                            </Badge>
                            {item.isImplemented && (
                              <Badge variant="secondary" className="text-xs">
                                Implemented
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                        {isEditing && (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingItem({ 
                                section: sectionKey as keyof BusinessModel, 
                                item 
                              })}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteItem(sectionKey as keyof BusinessModel, item.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                    {isEditing && (
                      <Button
                        variant="outline"
                        className="w-full border-2 border-dashed border-gray-300 hover:border-gray-400 bg-transparent py-4"
                        onClick={() => setNewItem({ section: sectionKey as keyof BusinessModel })}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add {section.title.slice(0, -1)}
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="space-y-8 w-full">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading business canvases...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-8 w-full">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-600 mb-2">Error loading business canvases</p>
              <p className="text-gray-600 text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // No data state
  if (businessCanvases.length === 0) {
    return (
      <div className="space-y-8 w-full">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-gray-600 mb-2">No business canvases found</p>
              <p className="text-gray-500 text-sm">Please seed the database with business canvas data</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8 w-full">

      {/* Tree View */}
      {showTreeView && (
        <CanvasTreeView
          canvases={treeData}
          onSelectCanvas={handleSelectCanvas}
          onAddChild={handleAddChild}
          onCloneCanvas={handleCloneCanvas}
          onEditCanvas={handleEditCanvas}
          onDeleteCanvas={handleDeleteCanvas}
          onArchiveCanvas={handleArchiveCanvas}
          onMoveCanvas={handleMoveCanvas}
          onAddRootCanvas={() => {
            setIsCreatingRootCanvas(true)
            setShowNewCanvasForm(true)
          }}
          selectedCanvasId={selectedCanvas}
        />
      )}

      {/* New Canvas Form */}
      <NewCanvasForm
        onCreateCanvas={handleCreateNewCanvas}
        parentCanvasId={isCreatingRootCanvas ? undefined : selectedCanvas}
        enterpriseContext={null}
        isOpen={showNewCanvasForm}
        onOpenChange={(open) => {
          setShowNewCanvasForm(open)
          if (!open) {
            setIsCreatingRootCanvas(false)
          }
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-bold mb-2">
            {currentCanvas?.name || 'Business Canvas'}
          </h2>
          <p className="text-gray-600 text-lg">
            {currentCanvas?.description || 'Strategic business model'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Strategic business model aligned with operational capability optimization
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-lg p-1 bg-gray-50">
            <Button
              variant={viewMode === 'canvas' ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange?.('canvas')}
              className="px-3"
            >
              <Grid3X3 className="h-4 w-4 mr-1" />
              Canvas
            </Button>
            <Button
              variant={viewMode === 'list' ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange?.('list')}
              className="px-3"
            >
              <List className="h-4 w-4 mr-1" />
              List
            </Button>
          </div>
          
          {/* Edit Mode Toggle */}
          <div className="flex items-center border rounded-lg p-1 bg-gray-50">
            <Button
              variant={isEditing ? "default" : "ghost"}
              size="sm"
              onClick={() => onEditingChange?.(true)}
              className="px-3"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant={!isEditing ? "default" : "ghost"}
              size="sm"
              onClick={() => onEditingChange?.(false)}
              className="px-3"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </div>
          
          <Button variant="outline" className="px-6 bg-transparent">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" className="px-6 bg-transparent">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" className="px-6 bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Canvas Content */}
      {viewMode === 'canvas' ? (
        <div className="grid grid-cols-5 gap-6 min-h-[800px]">
          {/* Row 1 - Top sections */}
          <div className="col-span-1 row-span-2">{renderCanvasSection("keyPartners")}</div>
          <div className="col-span-1">{renderCanvasSection("keyActivities")}</div>
          <div className="col-span-1 row-span-2">{renderCanvasSection("valuePropositions")}</div>
          <div className="col-span-1">{renderCanvasSection("customerRelationships")}</div>
          <div className="col-span-1 row-span-2">{renderCanvasSection("customerSegments")}</div>

          {/* Row 2 - Middle sections */}
          <div className="col-span-1">{renderCanvasSection("keyResources")}</div>
          <div className="col-span-1">{renderCanvasSection("channels")}</div>

          {/* Row 3 - Bottom sections */}
          <div className="col-span-2">{renderCanvasSection("costStructure")}</div>
          <div className="col-span-3">{renderCanvasSection("revenueStreams")}</div>
        </div>
      ) : (
        renderListView()
      )}

      {/* Strategic Integration */}
      <Card>
        <CardHeader>
          <CardTitle>Strategic Integration</CardTitle>
          <CardDescription>
            How this business model connects to operational capabilities and critical controls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <Activity className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-semibold mb-2">Operational Alignment</h4>
              <p className="text-sm text-gray-600">
                Business model drives operational processes and activities
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Package className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h4 className="font-semibold mb-2">Resource Optimization</h4>
              <p className="text-sm text-gray-600">
                Key resources aligned with operational capabilities
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Heart className="h-8 w-8 mx-auto mb-2 text-red-600" />
              <h4 className="font-semibold mb-2">Value Creation</h4>
              <p className="text-sm text-gray-600">
                Value propositions delivered through operational excellence
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Item Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Business Model Component</DialogTitle>
            <DialogDescription>
              Update the details for this business model component
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editingItem.item.title}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, title: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingItem.item.description}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, description: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  className="w-full p-2 border rounded-md"
                  value={editingItem.item.priority}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, priority: e.target.value as "high" | "medium" | "low" },
                    })
                  }
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editingItem) {
                  updateItem(editingItem.section, editingItem.item.id, editingItem.item)
                  setEditingItem(null)
                }
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Item Dialog */}
      <Dialog open={!!newItem} onOpenChange={() => setNewItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Business Model Component</DialogTitle>
            <DialogDescription>
              Add a new component to your business model
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              if (newItem) {
                addItem(newItem.section, {
                  title: formData.get("title") as string,
                  description: formData.get("description") as string,
                  priority: formData.get("priority") as "high" | "medium" | "low",
                })
                setNewItem(null)
              }
            }}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-title">Title</Label>
                <Input id="new-title" name="title" required />
              </div>
              <div>
                <Label htmlFor="new-description">Description</Label>
                <Textarea id="new-description" name="description" required />
              </div>
              <div>
                <Label htmlFor="new-priority">Priority</Label>
                <select
                  id="new-priority"
                  name="priority"
                  className="w-full p-2 border rounded-md"
                  defaultValue="medium"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setNewItem(null)}>
                Cancel
              </Button>
              <Button type="submit">Add Component</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmation.isOpen} onOpenChange={cancelDeleteCanvas}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Delete Business Canvas
            </DialogTitle>
            <DialogDescription className="text-left">
              This action cannot be undone. This will permanently delete the business canvas and all associated data.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="font-medium text-destructive">
                    Warning: Irreversible Action
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You are about to delete <strong>"{deleteConfirmation.canvasName}"</strong> and all its:
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 ml-2">
                    <li>Value propositions</li>
                    <li>Customer segments</li>
                    <li>Revenue streams</li>
                    <li>Partnerships</li>
                    <li>Resources and activities</li>
                    <li>Cost structures</li>
                    <li>Channel information</li>
                  </ul>
                  <p className="text-sm font-medium text-destructive">
                    This data cannot be recovered once deleted.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Alternative:</strong> Consider archiving the canvas instead of deleting it to preserve the data for future reference.
              </p>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={cancelDeleteCanvas}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteCanvas}
              className="w-full sm:w-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 