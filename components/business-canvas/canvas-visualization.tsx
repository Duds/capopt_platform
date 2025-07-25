'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Plus,
  Edit,
  Trash2,
  Download,
  Share,
  Save,
  Eye,
  Copy,
  Move
} from 'lucide-react'
import { CanvasVisualizationProps, BusinessModel } from './types'
import { canvasSections, getSectionPosition } from './utils'
import { CanvasSection } from './canvas-section'

export function CanvasVisualization({ 
  businessModel, 
  onUpdate, 
  isEditing = false 
}: CanvasVisualizationProps) {
  const [draggedItem, setDraggedItem] = useState<{ item: any; sourceSection: keyof BusinessModel } | null>(null)
  const [hoveredSection, setHoveredSection] = useState<keyof BusinessModel | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleDragStart = (e: React.DragEvent, item: any, sourceSection: keyof BusinessModel) => {
    setDraggedItem({ item, sourceSection })
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, targetSection: keyof BusinessModel) => {
    e.preventDefault()
    setHoveredSection(targetSection)
  }

  const handleDrop = (e: React.DragEvent, targetSection: keyof BusinessModel) => {
    e.preventDefault()
    
    if (draggedItem && draggedItem.sourceSection !== targetSection) {
      const updatedModel = { ...businessModel }
      
      // Remove from source section
      updatedModel[draggedItem.sourceSection] = updatedModel[draggedItem.sourceSection].filter(
        item => item.id !== draggedItem.item.id
      )
      
      // Add to target section
      updatedModel[targetSection] = [...updatedModel[targetSection], draggedItem.item]
      
      onUpdate(updatedModel)
    }
    
    setDraggedItem(null)
    setHoveredSection(null)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setHoveredSection(null)
  }

  const handleAddItem = (sectionKey: keyof BusinessModel) => {
    // Add new item logic would go here
    console.log('Add item to section:', sectionKey)
  }

  const handleEditItem = (item: any) => {
    // Edit item logic would go here
    console.log('Edit item:', item)
  }

  const handleDeleteItem = (itemId: string) => {
    // Delete item logic would go here
    console.log('Delete item:', itemId)
  }

  return (
    <div className="space-y-4">
      {/* Canvas Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Business Model Canvas</h2>
          <p className="text-muted-foreground">
            Visual representation of your business model
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing && (
            <>
              <Button variant="outline" size="sm" className="opacity-50" disabled>
                <Save className="h-4 w-4 mr-2" />
                Save
                <Badge variant="outline" className="ml-2 text-xs">Not Implemented</Badge>
              </Button>
              <Button variant="outline" size="sm" className="opacity-50" disabled>
                <Download className="h-4 w-4 mr-2" />
                Export
                <Badge variant="outline" className="ml-2 text-xs">Not Implemented</Badge>
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" className="opacity-50" disabled>
            <Share className="h-4 w-4 mr-2" />
            Share
            <Badge variant="outline" className="ml-2 text-xs">Not Implemented</Badge>
          </Button>
        </div>
      </div>

      {/* Canvas Grid */}
      <div 
        ref={canvasRef}
        className="grid grid-cols-3 grid-rows-3 gap-4 p-6 bg-gray-100 rounded-lg min-h-[600px]"
      >
        {canvasSections.map((section) => (
          <div
            key={section.key}
            className={`${getSectionPosition(section.position)} ${
              hoveredSection === section.key ? 'ring-2 ring-blue-400' : ''
            }`}
          >
            <CanvasSection
              section={section}
              items={businessModel[section.key]}
              isEditing={isEditing}
              onAddItem={handleAddItem}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
            />
          </div>
        ))}
      </div>

      {/* Canvas Legend */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-semibold mb-3">Canvas Legend</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
              <span>High Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
              <span>Medium Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
              <span>Low Priority</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Move className="h-4 w-4 text-muted-foreground" />
              <span>Drag to move items</span>
            </div>
            <div className="flex items-center gap-2">
              <Edit className="h-4 w-4 text-muted-foreground" />
              <span>Click to edit</span>
            </div>
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-muted-foreground" />
              <span>Add new items</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">✓ Real Data</Badge>
              <span>Implemented features</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Mock Data</Badge>
              <span>Not implemented</span>
            </div>
            <div className="flex items-center gap-2">
              <Save className="h-4 w-4 text-muted-foreground" />
              <span>Save changes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 