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
  Coins
} from 'lucide-react'
import { CanvasVisualizationProps, BusinessModel, CanvasItem } from './types'
import { canvasSections, getPriorityColor } from './utils'
import { useBusinessCanvas, BusinessCanvas as DBBusinessCanvas } from '@/hooks/use-business-canvas'

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
  
  // Fetch business canvas data from database
  const { businessCanvases, loading, error } = useBusinessCanvas()

  // Generate canvas options from database data (ensure uniqueness)
  const canvasOptions = useMemo(() => {
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
        return Target
      }

      return {
        value: canvas.id,
        label: canvas.name,
        description: canvas.description || 'Business canvas',
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
      {/* Canvas Selector */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Target className="h-5 w-5" />
            Business Canvas Selection
          </CardTitle>
          <CardDescription className="text-blue-700">
            Choose the business canvas to view and edit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="canvas-select" className="text-sm font-medium text-blue-900">
                Select Canvas
              </Label>
              <Select key={canvasVersion} value={selectedCanvas} onValueChange={setSelectedCanvas}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Choose a canvas" />
                </SelectTrigger>
                <SelectContent>
                  {canvasOptions.map((option: any) => {
                    const Icon = option.icon
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4 text-blue-600" />
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-sm text-gray-500">{option.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {currentCanvas?.name || 'Select Canvas'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

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
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={() => onEditingChange?.(!isEditing)}
            className="px-6"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant={!isEditing ? "default" : "outline"}
            onClick={() => onEditingChange?.(false)}
            className="px-6"
          >
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
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

      {/* Canvas Grid */}
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
    </div>
  )
} 