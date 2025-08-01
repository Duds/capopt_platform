/**
 * Canvas Tree View Component - Hierarchical Business Canvas Management
 * 
 * Provides drag and drop tree view for managing business canvas hierarchies:
 * - Hierarchical display of business canvases
 * - Drag and drop for reorganizing relationships
 * - Inline actions for adding, cloning, editing, deleting
 * - Visual feedback for drag operations
 * - Clean native HTML5 drag and drop implementation
 * 
 * This component enables intuitive management of business canvas
 * relationships within the operational capability framework.
 */

'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Target,
  Plus,
  Copy,
  Edit,
  Trash2,
  Archive,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  GripVertical,
  Globe,
  Building,
  Factory,
  Store,
  Maximize2,
  Minimize2,
  ChevronsDown,
  ChevronsUp,
  CheckSquare,
  Square
} from 'lucide-react'
import { CanvasEditor } from './CanvasEditor'
import { CanvasStatusDialog } from './CanvasStatusDialog'

// Canvas Node Interface
interface CanvasNode {
  id: string
  name: string
  description: string
  type: 'ENTERPRISE' | 'BUSINESS_UNIT' | 'OPERATIONAL' | 'SPECIALIZED'
  level: 'PARENT' | 'CHILD' | 'GRANDCHILD'
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED'
  children?: CanvasNode[]
  isExpanded?: boolean
}

// Canvas Tree View Props
interface CanvasTreeViewProps {
  canvases: CanvasNode[]
  onSelectCanvas: (canvasId: string) => void
  onAddChild: (parentId: string) => void
  onCloneCanvas: (canvasId: string) => void
  onEditCanvas: (canvasId: string) => void
  onDeleteCanvas: (canvasId: string) => void
  onArchiveCanvas: (canvasId: string) => void
  onMoveCanvas: (canvasId: string, newParentId: string | null) => void
  onAddRootCanvas?: () => void
  selectedCanvasId?: string
  // Group selection props
  selectedCanvasIds?: Set<string>
  onToggleCanvasSelection?: (canvasId: string) => void
  onBulkDelete?: (canvasIds: string[]) => void
  onBulkArchive?: (canvasIds: string[]) => void
  // Edit canvas props
  onUpdateCanvas?: (canvasId: string, businessInfo: any) => void
  enterpriseContext?: any
  // Status management props
  onStatusChange?: (canvasId: string, newStatus: string, justification?: string) => Promise<void>
  userRole?: string
}

// Helper functions for icons and styling
const getCanvasIcon = (type: string) => {
  switch (type) {
    case 'ENTERPRISE': return Target
    case 'BUSINESS_UNIT': return Building
    case 'OPERATIONAL': return Factory
    case 'SPECIALIZED': return Store
    default: return Target
  }
}

const getLevelIcon = (level: string) => {
  switch (level) {
    case 'PARENT': return Target
    case 'CHILD': return Building
    case 'GRANDCHILD': return Factory
    default: return Target
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE': return 'bg-green-100 text-green-800'
    case 'DRAFT': return 'bg-yellow-100 text-yellow-800'
    case 'ARCHIVED': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

// TreeNode Component with Native Drag and Drop
function TreeNode({ 
  node, 
  depth = 0, 
  onSelectCanvas, 
  onAddChild, 
  onCloneCanvas, 
  onEditCanvas, 
  onDeleteCanvas, 
  onArchiveCanvas, 
  onMoveCanvas,
  selectedCanvasId,
  expandedNodes,
  onToggleNode,
  draggedCanvasId,
  setDraggedCanvasId,
  // Group selection props
  selectedCanvasIds,
  onToggleCanvasSelection,
  // Status management props
  onOpenStatusDialog
}: {
  node: CanvasNode
  depth?: number
  onSelectCanvas: (canvasId: string) => void
  onAddChild: (parentId: string) => void
  onCloneCanvas: (canvasId: string) => void
  onEditCanvas: (canvasId: string) => void
  onDeleteCanvas: (canvasId: string) => void
  onArchiveCanvas: (canvasId: string) => void
  onMoveCanvas: (canvasId: string, newParentId: string | null) => void
  selectedCanvasId?: string
  expandedNodes: Set<string>
  onToggleNode: (nodeId: string) => void
  draggedCanvasId: string | null
  setDraggedCanvasId: (id: string | null) => void
  // Group selection props
  selectedCanvasIds?: Set<string>
  onToggleCanvasSelection?: (canvasId: string) => void
  // Status management props
  onOpenStatusDialog?: (canvasId: string) => void
}) {
  const nodeRef = useRef<HTMLDivElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  
  const isSelected = selectedCanvasId === node.id
  const isExpanded = expandedNodes.has(node.id)
  const hasChildren = node.children && node.children.length > 0
  const isGroupSelected = selectedCanvasIds?.has(node.id) || false

  // Native Drag and Drop handlers
  const handleDragStart = useCallback((e: React.DragEvent) => {
    console.log('🟢 DRAG START:', { 
      nodeId: node.id, 
      nodeName: node.name,
      timestamp: new Date().toISOString()
    })
    
    // Prevent event bubbling
    e.stopPropagation()
    
    setIsDragging(true)
    setDraggedCanvasId(node.id)
    e.dataTransfer.setData('text/plain', node.id)
    e.dataTransfer.effectAllowed = 'move'
    
    // Use a simple, clean drag image
    const dragImage = document.createElement('div')
    dragImage.textContent = node.name
    dragImage.style.cssText = `
      background: white;
      border: 1px solid #3b82f6;
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 12px;
      color: #1f2937;
      pointer-events: none;
      position: absolute;
      top: -1000px;
      left: -1000px;
    `
    document.body.appendChild(dragImage)
    e.dataTransfer.setDragImage(dragImage, 10, 10)
    
    // Clean up immediately
    requestAnimationFrame(() => {
      if (document.body.contains(dragImage)) {
        document.body.removeChild(dragImage)
      }
    })
    
    console.log('🟢 DRAG START COMPLETED:', { 
      nodeId: node.id, 
      nodeName: node.name,
      draggedCanvasId: node.id
    })
  }, [node.id, node.name, setDraggedCanvasId])

  const handleDragEnd = useCallback(() => {
    console.log('🔴 DRAG END:', { nodeId: node.id, nodeName: node.name })
    setIsDragging(false)
    setDraggedCanvasId(null)
  }, [node.id, node.name, setDraggedCanvasId])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    
    const isValidDrop = draggedCanvasId && draggedCanvasId !== node.id
    
    console.log('🟡 DRAG OVER:', { 
      targetNodeId: node.id, 
      targetNodeName: node.name,
      draggedCanvasId,
      isValidDrop
    })
    
    if (isValidDrop) {
      e.dataTransfer.dropEffect = 'move'
      setIsDragOver(true)
      console.log('🟢 VALID DROP TARGET - Blue glow applied')
    } else {
      e.dataTransfer.dropEffect = 'none'
      setIsDragOver(false)
      console.log('🔴 INVALID DROP TARGET - Red glow applied')
    }
  }, [draggedCanvasId, node.id, node.name])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    console.log('🟡 DRAG LEAVE:', { targetNodeId: node.id, targetNodeName: node.name })
    setIsDragOver(false)
  }, [node.id, node.name])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('🟣 DROP EVENT START:', { 
      targetNodeId: node.id, 
      targetNodeName: node.name,
      draggedCanvasId,
      expandedNodesBeforeDrop: expandedNodes,
      expandedNodesSizeBeforeDrop: expandedNodes.size,
      timestamp: new Date().toISOString()
    })
    
    // Check if we have a valid dragged canvas ID
    if (!draggedCanvasId) {
      console.log('🔴 DROP REJECTED - No dragged canvas ID')
      return
    }
    
    // Prevent dropping on itself
    if (draggedCanvasId === node.id) {
      console.log('🔴 SELF DROP REJECTED:', { 
        targetNodeId: node.id, 
        targetNodeName: node.name 
      })
      return
    }

    console.log('🟢 DROP ACCEPTED - Calling onMoveCanvas:', { 
      targetNodeId: node.id, 
      targetNodeName: node.name,
      draggedCanvasId,
      newParentId: node.id
    })
    
    // Call the parent handler to move the canvas
    onMoveCanvas(draggedCanvasId, node.id)
    
    console.log('🟢 DROP EVENT COMPLETED')
  }, [node.id, node.name, draggedCanvasId, onMoveCanvas])

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (hasChildren) {
      onToggleNode(node.id)
    }
  }

  const handleAddChild = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddChild(node.id)
  }

  const handleSelect = () => {
    onSelectCanvas(node.id)
  }

  const handleCheckboxToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleCanvasSelection?.(node.id)
  }

  return (
    <div 
      className={`tree-node ${isDragging ? 'dragging' : ''}`}
      ref={nodeRef}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div 
        className={`
          flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out border-2 border-transparent
          ${isSelected ? 'bg-primary/5 border-primary/20 shadow-sm' : 'hover:bg-muted/50 hover:border-muted-foreground/20'}
          ${isDragOver ? 'bg-primary/10 border-primary/30 shadow-md scale-[1.02]' : ''}
          ${isDragging ? 'opacity-50' : ''}
        `}
        onClick={handleSelect}
      >
        {/* Drag Handle */}
        <div className="cursor-grab active:cursor-grabbing p-1.5 rounded-md transition-all duration-200 hover:bg-muted hover:scale-105">
          <GripVertical className="h-4 w-4 text-muted-foreground/60" />
        </div>

        {/* Selection Checkbox */}
        {onToggleCanvasSelection && (
          <button
            onClick={handleCheckboxToggle}
            className="flex items-center justify-center w-5 h-5 rounded border-2 border-muted-foreground/30 hover:border-primary transition-colors duration-200"
          >
            {isGroupSelected ? (
              <CheckSquare className="h-4 w-4 text-primary" />
            ) : (
              <Square className="h-4 w-4 text-muted-foreground/60" />
            )}
          </button>
        )}

        {/* Indentation */}
        <div style={{ width: depth * 24 }} />

        {/* Toggle Icon */}
        {hasChildren && (
          <button
            onClick={handleToggle}
            className="flex items-center justify-center w-6 h-6 rounded-md bg-muted/50 hover:bg-muted transition-colors duration-200"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        )}

        {/* Canvas Icon */}
        <div className="flex items-center gap-3 flex-1">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
            {React.createElement(getCanvasIcon(node.type), { 
              className: "h-4 w-4 text-primary" 
            })}
          </div>
          
          {/* Canvas Info */}
          <div className="flex flex-col min-w-0 flex-1">
            <div className="font-medium text-sm truncate">{node.name}</div>
            <div className="text-xs text-muted-foreground truncate">{node.description}</div>
          </div>
        </div>

        {/* Status Badge */}
        {node.status && (
          <Badge variant="secondary" className="text-xs">
            {node.status}
          </Badge>
        )}

        {/* Drop Here Badge */}
        {isDragOver && draggedCanvasId && draggedCanvasId !== node.id && (
          <Badge variant="default" className="text-xs bg-primary text-primary-foreground animate-pulse">
            Drop here
          </Badge>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 ml-auto">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleAddChild}
            className="h-8 w-8 p-0 hover:bg-muted"
          >
            <Plus className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-muted"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onCloneCanvas(node.id)}>
                <Copy className="h-4 w-4 mr-2" />
                Clone
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEditCanvas(node.id)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onOpenStatusDialog?.(node.id)}>
                <Target className="h-4 w-4 mr-2" />
                Change Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onArchiveCanvas(node.id)}>
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDeleteCanvas(node.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="ml-6 pl-4 border-l border-muted-foreground/20 mt-2 animate-in slide-in-from-top-2 duration-200">
          <TreeList
            nodes={node.children!}
            onSelectCanvas={onSelectCanvas}
            onAddChild={onAddChild}
            onCloneCanvas={onCloneCanvas}
            onEditCanvas={onEditCanvas}
            onDeleteCanvas={onDeleteCanvas}
            onArchiveCanvas={onArchiveCanvas}
            onMoveCanvas={onMoveCanvas}
            selectedCanvasId={selectedCanvasId}
            expandedNodes={expandedNodes}
            onToggleNode={onToggleNode}
            depth={depth + 1}
            draggedCanvasId={draggedCanvasId}
            setDraggedCanvasId={setDraggedCanvasId}
            selectedCanvasIds={selectedCanvasIds}
            onToggleCanvasSelection={onToggleCanvasSelection}
            onOpenStatusDialog={onOpenStatusDialog}
          />
        </div>
      )}
    </div>
  )
}

// TreeList Component
function TreeList({ 
  nodes, 
  onSelectCanvas, 
  onAddChild, 
  onCloneCanvas, 
  onEditCanvas, 
  onDeleteCanvas, 
  onArchiveCanvas, 
  onMoveCanvas,
  selectedCanvasId,
  expandedNodes,
  onToggleNode,
  depth = 0,
  draggedCanvasId,
  setDraggedCanvasId,
  // Group selection props
  selectedCanvasIds,
  onToggleCanvasSelection,
  // Status management props
  onOpenStatusDialog
}: {
  nodes: CanvasNode[]
  onSelectCanvas: (canvasId: string) => void
  onAddChild: (parentId: string) => void
  onCloneCanvas: (canvasId: string) => void
  onEditCanvas: (canvasId: string) => void
  onDeleteCanvas: (canvasId: string) => void
  onArchiveCanvas: (canvasId: string) => void
  onMoveCanvas: (canvasId: string, newParentId: string | null) => void
  selectedCanvasId?: string
  expandedNodes: Set<string>
  onToggleNode: (nodeId: string) => void
  depth?: number
  draggedCanvasId: string | null
  setDraggedCanvasId: (id: string | null) => void
  // Group selection props
  selectedCanvasIds?: Set<string>
  onToggleCanvasSelection?: (canvasId: string) => void
  // Status management props
  onOpenStatusDialog?: (canvasId: string) => void
}) {
  return (
    <div className="space-y-1">
      {nodes.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          depth={depth}
          onSelectCanvas={onSelectCanvas}
          onAddChild={onAddChild}
          onCloneCanvas={onCloneCanvas}
          onEditCanvas={onEditCanvas}
          onDeleteCanvas={onDeleteCanvas}
          onArchiveCanvas={onArchiveCanvas}
          onMoveCanvas={onMoveCanvas}
          selectedCanvasId={selectedCanvasId}
          expandedNodes={expandedNodes}
          onToggleNode={onToggleNode}
          draggedCanvasId={draggedCanvasId}
          setDraggedCanvasId={setDraggedCanvasId}
          selectedCanvasIds={selectedCanvasIds}
          onToggleCanvasSelection={onToggleCanvasSelection}
          onOpenStatusDialog={onOpenStatusDialog}
        />
      ))}
    </div>
  )
}

// Main Canvas Tree View Component
export function CanvasHierarchyView({
  canvases,
  onSelectCanvas,
  onAddChild,
  onCloneCanvas,
  onEditCanvas,
  onDeleteCanvas,
  onArchiveCanvas,
  onMoveCanvas,
  onAddRootCanvas,
  selectedCanvasId,
  // Group selection props
  selectedCanvasIds,
  onToggleCanvasSelection,
  onBulkDelete,
  onBulkArchive,
  // Edit canvas props
  onUpdateCanvas,
  enterpriseContext,
  // Status management props
  onStatusChange,
  userRole
}: CanvasTreeViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
  const [draggedCanvasId, setDraggedCanvasId] = useState<string | null>(null)
  const [isRootDragOver, setIsRootDragOver] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingCanvasId, setEditingCanvasId] = useState<string | null>(null)
  const [editingCanvasData, setEditingCanvasData] = useState<any>(null)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [statusCanvas, setStatusCanvas] = useState<any>(null)
  
  // Load expanded nodes from localStorage on mount
  useEffect(() => {
    try {
      const savedExpandedNodes = localStorage.getItem('canvas-tree-expanded-nodes')
      if (savedExpandedNodes) {
        const parsedNodes = JSON.parse(savedExpandedNodes)
        setExpandedNodes(new Set(parsedNodes))
        console.log('🟡 LOADED EXPANDED NODES FROM LOCALSTORAGE:', parsedNodes)
      }
    } catch (error) {
      console.error('Error loading expanded nodes from localStorage:', error)
    }
  }, [])
  
  // Save expanded nodes to localStorage whenever they change
  useEffect(() => {
    try {
      const expandedNodesArray = Array.from(expandedNodes)
      localStorage.setItem('canvas-tree-expanded-nodes', JSON.stringify(expandedNodesArray))
      console.log('🟡 SAVED EXPANDED NODES TO LOCALSTORAGE:', expandedNodesArray)
    } catch (error) {
      console.error('Error saving expanded nodes to localStorage:', error)
    }
  }, [expandedNodes])





  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId)
        console.log('🟡 COLLAPSED NODE:', nodeId)
      } else {
        newSet.add(nodeId)
        console.log('🟡 EXPANDED NODE:', nodeId)
      }
      return newSet
    })
  }

  // Recursive function to collect all node IDs from the tree
  const getAllNodeIds = (nodes: CanvasNode[]): string[] => {
    const nodeIds: string[] = []
    
    const traverse = (nodeList: CanvasNode[]) => {
      nodeList.forEach(node => {
        nodeIds.push(node.id)
        if (node.children && node.children.length > 0) {
          traverse(node.children)
        }
      })
    }
    
    traverse(nodes)
    return nodeIds
  }

  // Utility functions for tree state management
  const expandAllNodes = () => {
    const allNodeIds = getAllNodeIds(canvases)
    setExpandedNodes(new Set(allNodeIds))
    console.log('🟡 EXPANDED ALL NODES:', allNodeIds.length, 'nodes')
    
    // Debug: Show which nodes are being expanded
    const nodeNames = allNodeIds.map(id => {
      const findNodeName = (nodes: CanvasNode[], targetId: string): string | null => {
        for (const node of nodes) {
          if (node.id === targetId) return node.name
          if (node.children) {
            const found = findNodeName(node.children, targetId)
            if (found) return found
          }
        }
        return null
      }
      return findNodeName(canvases, id) || 'Unknown'
    })
    console.log('🟡 EXPANDED NODE NAMES:', nodeNames)
    // Note: This will automatically save to localStorage via the useEffect
  }

  const collapseAllNodes = () => {
    setExpandedNodes(new Set())
    console.log('🟡 COLLAPSED ALL NODES')
  }

  // Handle edit canvas
  const handleEditCanvas = async (canvasId: string) => {
    try {
      console.log('🔍 CANVAS HIERARCHY DEBUG - Fetching canvas data for editing:', canvasId)
      
      // Fetch canvas data for editing
      const response = await fetch(`/api/business-canvas/${canvasId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch canvas data')
      }
      const canvasData = await response.json()
      
      console.log('🔍 CANVAS HIERARCHY DEBUG - Fetched canvas data:', canvasData)
      console.log('🔍 CANVAS HIERARCHY DEBUG - Canvas data keys:', Object.keys(canvasData))
      console.log('🔍 CANVAS HIERARCHY DEBUG - Name:', canvasData.name)
      console.log('🔍 CANVAS HIERARCHY DEBUG - Industry:', canvasData.industry)
      console.log('🔍 CANVAS HIERARCHY DEBUG - Business type:', canvasData.businessType)
      console.log('🔍 CANVAS HIERARCHY DEBUG - Sectors:', canvasData.sectors)
      
      setEditingCanvasId(canvasId)
      setEditingCanvasData(canvasData)
      setIsEditModalOpen(true)
    } catch (error) {
      console.error('Error fetching canvas data for editing:', error)
      // Fallback to original edit handler
      onEditCanvas(canvasId)
    }
  }

  // Handle update canvas
  const handleUpdateCanvas = async (canvasId: string, businessInfo: any) => {
    try {
      console.log('✏️ CANVAS HIERARCHY - Starting update process:', canvasId)
      console.log('✏️ CANVAS HIERARCHY - Business info:', JSON.stringify(businessInfo, null, 2))
      
      // Update canvas metadata with all fields
      const response = await fetch(`/api/business-canvas/${canvasId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(businessInfo),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Failed to update canvas: ${errorData.details || response.statusText}`)
      }

      const updatedCanvas = await response.json()
      console.log('✅ CANVAS HIERARCHY - Canvas updated successfully:', updatedCanvas.name)
      
      // Call the parent update handler if provided
      onUpdateCanvas?.(canvasId, businessInfo)
      
      // Close modal and reset state
      setIsEditModalOpen(false)
      setEditingCanvasId(null)
      setEditingCanvasData(null)
    } catch (error) {
      console.error('❌ CANVAS HIERARCHY - Error updating canvas:', error)
      console.error('❌ CANVAS HIERARCHY - Error details:', error instanceof Error ? error.message : 'Unknown error')
      // You might want to show an error toast here
      throw error // Re-throw to let the parent handle the error
    }
  }

  // Handle status change
  const handleStatusChange = async (canvasId: string, newStatus: string, justification?: string) => {
    try {
      // Call the parent status change handler if provided
      if (onStatusChange) {
        await onStatusChange(canvasId, newStatus, justification)
      } else {
        // Default implementation - update via API
        const response = await fetch(`/api/business-canvas/${canvasId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: newStatus,
            // Add justification to audit log if needed
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to update canvas status')
        }

        console.log('✅ Canvas status updated successfully')
      }
    } catch (error) {
      console.error('Error updating canvas status:', error)
      throw error
    }
  }

  // Handle open status dialog
  const handleOpenStatusDialog = async (canvasId: string) => {
    try {
      // Fetch canvas data for status change
      const response = await fetch(`/api/business-canvas/${canvasId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch canvas data')
      }
      const canvasData = await response.json()
      
      setStatusCanvas(canvasData)
      setIsStatusDialogOpen(true)
    } catch (error) {
      console.error('Error fetching canvas data for status change:', error)
    }
  }

  return (
    <Card className="w-full transition-all duration-300">
      <CardHeader className={isMinimized ? 'pb-2' : ''}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            <CardTitle>Canvas Management</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            {!isMinimized && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={expandAllNodes}
                  className="h-8 w-8 p-0"
                  title="Expand all nodes"
                >
                  <ChevronsDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={collapseAllNodes}
                  className="h-8 w-8 p-0"
                  title="Collapse all nodes"
                >
                  <ChevronsUp className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0"
            >
              {isMinimized ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        {!isMinimized && (
          <CardDescription>
            Manage business canvas relationships and hierarchy
            {expandedNodes.size > 0 && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({expandedNodes.size} expanded)
              </span>
            )}
          </CardDescription>
        )}
      </CardHeader>
      {!isMinimized && (
        <CardContent className="space-y-4">
        {/* Root Drop Zone */}
        <div
          className={`p-6 border-2 border-dashed rounded-lg transition-all duration-200 ${
            isRootDragOver 
              ? 'border-primary bg-primary/5 shadow-lg' 
              : 'border-muted-foreground/20 bg-muted/30 hover:bg-muted/50'
          }`}
          onDragOver={(e) => {
            console.log('🟡 ROOT DROP ZONE - DRAG OVER START')
            e.preventDefault()
            e.stopPropagation()
            setIsRootDragOver(true)
            console.log('🟡 ROOT DROP ZONE - DRAG OVER COMPLETED')
          }}
          onDragLeave={(e) => {
            console.log('🟡 ROOT DROP ZONE - DRAG LEAVE START')
            e.preventDefault()
            e.stopPropagation()
            // Only set to false if we're leaving the drop zone entirely
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setIsRootDragOver(false)
            }
            console.log('🟡 ROOT DROP ZONE - DRAG LEAVE COMPLETED')
          }}
          onDrop={(e) => {
            console.log('🟣 ROOT DROP ZONE - DROP START')
            e.preventDefault()
            e.stopPropagation()
            setIsRootDragOver(false)
            
            console.log('🟣 ROOT DROP ZONE - Data transfer:', { 
              draggedCanvasId,
              newParentId: 'root',
              expandedNodesBeforeDrop: expandedNodes,
              expandedNodesSizeBeforeDrop: expandedNodes.size
            })
            
            if (draggedCanvasId) {
              console.log('🟢 ROOT DROP ZONE - Calling onMoveCanvas:', { 
                draggedCanvasId, 
                newParentId: 'root' 
              })
              onMoveCanvas(draggedCanvasId, 'root')
            } else {
              console.log('🔴 ROOT DROP ZONE - No dragged canvas ID')
            }
            
            console.log('🟢 ROOT DROP ZONE - DROP COMPLETED')
          }}
        >
          <div className="text-center text-muted-foreground transition-colors duration-200">
            <Globe className="h-8 w-8 mx-auto mb-3 text-muted-foreground/60" />
            <div className="font-medium text-sm">Drop here to move to root level</div>
            <div className="text-xs mt-1 opacity-75 mb-4">Makes the canvas independent (no parent)</div>
            
            {/* Add New Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onAddRootCanvas}
              className="border-dashed border-2 hover:border-solid transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCanvasIds && selectedCanvasIds.size > 0 && (
          <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border border-muted-foreground/20">
            <div className="flex-1 text-sm text-muted-foreground">
              {selectedCanvasIds.size} canvas{selectedCanvasIds.size !== 1 ? 'es' : ''} selected
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkArchive?.(Array.from(selectedCanvasIds))}
                className="h-8 px-3"
              >
                <Archive className="h-4 w-4 mr-2" />
                Archive All
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onBulkDelete?.(Array.from(selectedCanvasIds))}
                className="h-8 px-3"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete All
              </Button>
            </div>
          </div>
        )}

        <TreeList
          nodes={canvases}
          onSelectCanvas={onSelectCanvas}
          onAddChild={onAddChild}
          onCloneCanvas={onCloneCanvas}
          onEditCanvas={handleEditCanvas}
          onDeleteCanvas={onDeleteCanvas}
          onArchiveCanvas={onArchiveCanvas}
          onMoveCanvas={onMoveCanvas}
          selectedCanvasId={selectedCanvasId}
          expandedNodes={expandedNodes}
          onToggleNode={toggleNode}
          draggedCanvasId={draggedCanvasId}
          setDraggedCanvasId={setDraggedCanvasId}
          selectedCanvasIds={selectedCanvasIds}
          onToggleCanvasSelection={onToggleCanvasSelection}
          onOpenStatusDialog={handleOpenStatusDialog}
        />
      </CardContent>
      )}

      {/* Edit Canvas Modal */}
      <CanvasEditor
        mode="edit"
        onSubmit={(businessInfo) => handleUpdateCanvas(editingCanvasId || '', businessInfo)}
        canvasId={editingCanvasId || ''}
        canvasData={editingCanvasData}
        enterpriseContext={enterpriseContext}
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      />
      
      {/* Debug info for CanvasEditor props */}
      {isEditModalOpen && (
        <div style={{ display: 'none' }}>
          {console.log('🔍 CANVAS HIERARCHY DEBUG - CanvasEditor props:', {
            mode: 'edit',
            canvasId: editingCanvasId,
            canvasData: editingCanvasData,
            enterpriseContext,
            isOpen: isEditModalOpen
          })}
        </div>
      )}

      {/* Status Change Dialog */}
      {statusCanvas && (
        <CanvasStatusDialog
          isOpen={isStatusDialogOpen}
          onOpenChange={setIsStatusDialogOpen}
          canvas={statusCanvas}
          currentStatus={statusCanvas.status}
          userRole={userRole || 'USER'}
          onStatusChange={handleStatusChange}
        />
      )}
    </Card>
  )
} 