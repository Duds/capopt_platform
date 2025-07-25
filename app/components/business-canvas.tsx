"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Plus,
  Edit,
  Trash2,
  Download,
  Share,
  Save,
  Eye,
  Copy,
} from "lucide-react"
import { CanvasVisualization } from "@/components/business-canvas/canvas-visualization"
import { BusinessModel, CanvasItem } from "@/components/business-canvas/types"
import { defaultBusinessModel, canvasSections } from "@/components/business-canvas/utils"
import { CanvasSection } from "@/components/business-canvas/canvas-section"

export function BusinessCanvas() {
  const [businessModel, setBusinessModel] = useState<BusinessModel>(defaultBusinessModel)
  const [viewMode, setViewMode] = useState<'list' | 'canvas'>('canvas')
  const [isEditing, setIsEditing] = useState(false)
  const [editingItem, setEditingItem] = useState<{ section: keyof BusinessModel; item: CanvasItem } | null>(null)
  const [newItem, setNewItem] = useState<{ section: keyof BusinessModel } | null>(null)

  const addItem = (section: keyof BusinessModel, item: Omit<CanvasItem, "id">) => {
    const newId = Date.now().toString()
    setBusinessModel((prev) => ({
      ...prev,
      [section]: [...prev[section], { ...item, id: newId }],
    }))
  }

  const updateItem = (section: keyof BusinessModel, itemId: string, updates: Partial<CanvasItem>) => {
    setBusinessModel((prev) => ({
      ...prev,
      [section]: prev[section].map((item) => (item.id === itemId ? { ...item, ...updates } : item)),
    }))
  }

  const deleteItem = (section: keyof BusinessModel, itemId: string) => {
    setBusinessModel((prev) => ({
      ...prev,
      [section]: prev[section].filter((item) => item.id !== itemId),
    }))
  }

  const handleAddItem = (sectionKey: keyof BusinessModel) => {
    setNewItem({ section: sectionKey })
  }

  const handleEditItem = (item: CanvasItem) => {
    // Find the section this item belongs to
    const section = Object.keys(businessModel).find(key => 
      businessModel[key as keyof BusinessModel].some(i => i.id === item.id)
    ) as keyof BusinessModel
    setEditingItem({ section, item })
  }

  const handleDeleteItem = (itemId: string) => {
    // Find the section this item belongs to
    const section = Object.keys(businessModel).find(key => 
      businessModel[key as keyof BusinessModel].some(i => i.id === itemId)
    ) as keyof BusinessModel
    deleteItem(section, itemId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Business Model Canvas</h2>
          <p className="text-muted-foreground">
            Design and visualize your business model strategy
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <Eye className="h-4 w-4 mr-2" />
            List View
          </Button>
          <Button
            variant={viewMode === 'canvas' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('canvas')}
          >
            <Copy className="h-4 w-4 mr-2" />
            Canvas View
          </Button>
          <Button
            variant={isEditing ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? 'View Mode' : 'Edit Mode'}
          </Button>
          <Button variant="outline" size="sm" className="opacity-50" disabled>
            <Download className="h-4 w-4 mr-2" />
            Export
            <Badge variant="outline" className="ml-2 text-xs">Not Implemented</Badge>
          </Button>
          <Button variant="outline" size="sm" className="opacity-50" disabled>
            <Share className="h-4 w-4 mr-2" />
            Share
            <Badge variant="outline" className="ml-2 text-xs">Not Implemented</Badge>
          </Button>
        </div>
      </div>

      {/* Canvas Visualization */}
      {viewMode === 'canvas' && (
        <CanvasVisualization
          businessModel={businessModel}
          onUpdate={setBusinessModel}
          isEditing={isEditing}
        />
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold mb-2">Business Model Canvas</h2>
              <p className="text-gray-600 text-lg">Define and visualize your business model across 9 key components</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={() => setIsEditing(!isEditing)}
                className="px-6"
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? 'View Mode' : 'Edit Mode'}
              </Button>
              <Button variant="outline" className="px-6 bg-transparent opacity-50" disabled>
                <Save className="h-4 w-4 mr-2" />
                Save
                <Badge variant="outline" className="ml-2 text-xs">Not Implemented</Badge>
              </Button>
              <Button variant="outline" className="px-6 bg-transparent opacity-50" disabled>
                <Share className="h-4 w-4 mr-2" />
                Share
                <Badge variant="outline" className="ml-2 text-xs">Not Implemented</Badge>
              </Button>
              <Button variant="outline" className="px-6 bg-transparent opacity-50" disabled>
                <Download className="h-4 w-4 mr-2" />
                Export
                <Badge variant="outline" className="ml-2 text-xs">Not Implemented</Badge>
              </Button>
            </div>
          </div>

          {/* Canvas Grid */}
          <div className="grid grid-cols-5 gap-6 min-h-[800px]">
            {/* Row 1 - Top sections */}
            <div className="col-span-1 row-span-2">
              <CanvasSection
                section={canvasSections[0]} // keyPartners
                items={businessModel.keyPartners}
                isEditing={isEditing}
                onAddItem={handleAddItem}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
              />
            </div>
            <div className="col-span-1">
              <CanvasSection
                section={canvasSections[1]} // keyActivities
                items={businessModel.keyActivities}
                isEditing={isEditing}
                onAddItem={handleAddItem}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
              />
            </div>
            <div className="col-span-1 row-span-2">
              <CanvasSection
                section={canvasSections[3]} // valuePropositions
                items={businessModel.valuePropositions}
                isEditing={isEditing}
                onAddItem={handleAddItem}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
              />
            </div>
            <div className="col-span-1">
              <CanvasSection
                section={canvasSections[4]} // customerRelationships
                items={businessModel.customerRelationships}
                isEditing={isEditing}
                onAddItem={handleAddItem}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
              />
            </div>
            <div className="col-span-1 row-span-2">
              <CanvasSection
                section={canvasSections[6]} // customerSegments
                items={businessModel.customerSegments}
                isEditing={isEditing}
                onAddItem={handleAddItem}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
              />
            </div>

            {/* Row 2 - Middle sections */}
            <div className="col-span-1">
              <CanvasSection
                section={canvasSections[2]} // keyResources
                items={businessModel.keyResources}
                isEditing={isEditing}
                onAddItem={handleAddItem}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
              />
            </div>
            <div className="col-span-1">
              <CanvasSection
                section={canvasSections[5]} // channels
                items={businessModel.channels}
                isEditing={isEditing}
                onAddItem={handleAddItem}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
              />
            </div>

            {/* Row 3 - Bottom sections */}
            <div className="col-span-2">
              <CanvasSection
                section={canvasSections[7]} // costStructure
                items={businessModel.costStructure}
                isEditing={isEditing}
                onAddItem={handleAddItem}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
              />
            </div>
            <div className="col-span-3">
              <CanvasSection
                section={canvasSections[8]} // revenueStreams
                items={businessModel.revenueStreams}
                isEditing={isEditing}
                onAddItem={handleAddItem}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
              />
            </div>
          </div>

          {/* Templates and Examples */}
          <Card>
            <CardHeader>
              <CardTitle>Templates & Examples</CardTitle>
              <CardDescription>Get started quickly with pre-built templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:shadow-md transition-shadow opacity-50">
                  <CardHeader>
                    <CardTitle className="text-lg">SaaS Platform</CardTitle>
                    <CardDescription>Template for software-as-a-service businesses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" className="bg-transparent" disabled>
                      <Copy className="h-4 w-4 mr-2" />
                      Use Template
                      <Badge variant="outline" className="ml-2 text-xs">Not Implemented</Badge>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow opacity-50">
                  <CardHeader>
                    <CardTitle className="text-lg">Consulting Services</CardTitle>
                    <CardDescription>Template for professional services firms</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" className="bg-transparent" disabled>
                      <Copy className="h-4 w-4 mr-2" />
                      Use Template
                      <Badge variant="outline" className="ml-2 text-xs">Not Implemented</Badge>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow opacity-50">
                  <CardHeader>
                    <CardTitle className="text-lg">E-commerce</CardTitle>
                    <CardDescription>Template for online retail businesses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" className="bg-transparent" disabled>
                      <Copy className="h-4 w-4 mr-2" />
                      Use Template
                      <Badge variant="outline" className="ml-2 text-xs">Not Implemented</Badge>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Item Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>Update the details for this business model component</DialogDescription>
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
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>Add a new component to your business model</DialogDescription>
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
                  isImplemented: false
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
              <Button type="submit">Add Item</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
