'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Handshake, 
  Activity, 
  Package, 
  Heart, 
  Radio, 
  DollarSign, 
  TrendingDown,
  Plus,
  Edit,
  Trash2,
  Download,
  Share,
  Save,
  Eye,
  Copy,
  Move,
  GripVertical
} from 'lucide-react'

interface CanvasItem {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  color?: string
}

interface BusinessModel {
  keyPartners: CanvasItem[]
  keyActivities: CanvasItem[]
  keyResources: CanvasItem[]
  valuePropositions: CanvasItem[]
  customerRelationships: CanvasItem[]
  channels: CanvasItem[]
  customerSegments: CanvasItem[]
  costStructure: CanvasItem[]
  revenueStreams: CanvasItem[]
}

interface CanvasSection {
  key: keyof BusinessModel
  title: string
  description: string
  icon: React.ReactNode
  color: string
  position: 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
}

interface CanvasVisualizationProps {
  businessModel: BusinessModel
  onUpdate: (updatedModel: BusinessModel) => void
  isEditing?: boolean
}

export function CanvasVisualization({ 
  businessModel, 
  onUpdate, 
  isEditing = false 
}: CanvasVisualizationProps) {
  const [draggedItem, setDraggedItem] = useState<{ item: CanvasItem; sourceSection: keyof BusinessModel } | null>(null)
  const [hoveredSection, setHoveredSection] = useState<keyof BusinessModel | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const sections: CanvasSection[] = [
    {
      key: 'keyPartners',
      title: 'Key Partners',
      description: 'Who are our key partners?',
      icon: <Handshake className="h-5 w-5" />,
      color: 'bg-blue-50 border-blue-200',
      position: 'top-left'
    },
    {
      key: 'keyActivities',
      title: 'Key Activities',
      description: 'What key activities do we perform?',
      icon: <Activity className="h-5 w-5" />,
      color: 'bg-green-50 border-green-200',
      position: 'top-center'
    },
    {
      key: 'keyResources',
      title: 'Key Resources',
      description: 'What key resources do we have?',
      icon: <Package className="h-5 w-5" />,
      color: 'bg-purple-50 border-purple-200',
      position: 'top-right'
    },
    {
      key: 'valuePropositions',
      title: 'Value Propositions',
      description: 'What value do we deliver?',
      icon: <Heart className="h-5 w-5" />,
      color: 'bg-red-50 border-red-200',
      position: 'center'
    },
    {
      key: 'customerRelationships',
      title: 'Customer Relationships',
      description: 'How do we interact with customers?',
      icon: <Users className="h-5 w-5" />,
      color: 'bg-yellow-50 border-yellow-200',
      position: 'center-left'
    },
    {
      key: 'channels',
      title: 'Channels',
      description: 'How do we reach customers?',
      icon: <Radio className="h-5 w-5" />,
      color: 'bg-indigo-50 border-indigo-200',
      position: 'center-right'
    },
    {
      key: 'customerSegments',
      title: 'Customer Segments',
      description: 'Who are our customers?',
      icon: <Users className="h-5 w-5" />,
      color: 'bg-pink-50 border-pink-200',
      position: 'bottom-left'
    },
    {
      key: 'costStructure',
      title: 'Cost Structure',
      description: 'What are our major costs?',
      icon: <TrendingDown className="h-5 w-5" />,
      color: 'bg-orange-50 border-orange-200',
      position: 'bottom-center'
    },
    {
      key: 'revenueStreams',
      title: 'Revenue Streams',
      description: 'How do we make money?',
      icon: <DollarSign className="h-5 w-5" />,
      color: 'bg-emerald-50 border-emerald-200',
      position: 'bottom-right'
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDragStart = (e: React.DragEvent, item: CanvasItem, sourceSection: keyof BusinessModel) => {
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

  const getSectionPosition = (position: string) => {
    switch (position) {
      case 'top-left':
        return 'col-start-1 row-start-1'
      case 'top-center':
        return 'col-start-2 row-start-1'
      case 'top-right':
        return 'col-start-3 row-start-1'
      case 'center-left':
        return 'col-start-1 row-start-2'
      case 'center':
        return 'col-start-2 row-start-2'
      case 'center-right':
        return 'col-start-3 row-start-2'
      case 'bottom-left':
        return 'col-start-1 row-start-3'
      case 'bottom-center':
        return 'col-start-2 row-start-3'
      case 'bottom-right':
        return 'col-start-3 row-start-3'
      default:
        return 'col-start-1 row-start-1'
    }
  }

  const renderCanvasItem = (item: CanvasItem, sectionKey: keyof BusinessModel) => (
    <div
      key={item.id}
      draggable={isEditing}
      onDragStart={(e) => handleDragStart(e, item, sectionKey)}
      className={`p-3 border rounded-lg mb-2 cursor-move hover:shadow-md transition-shadow ${
        isEditing ? 'bg-white' : 'bg-gray-50'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm">{item.title}</h4>
            <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>
              {item.priority}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{item.description}</p>
        </div>
        {isEditing && (
          <div className="flex items-center gap-1 ml-2">
            <GripVertical className="h-3 w-3 text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  )

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
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </>
          )}
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Canvas Grid */}
      <div 
        ref={canvasRef}
        className="grid grid-cols-3 grid-rows-3 gap-4 p-6 bg-gray-100 rounded-lg min-h-[600px]"
      >
        {sections.map((section) => (
          <div
            key={section.key}
            className={`${getSectionPosition(section.position)} ${section.color} border-2 rounded-lg p-4 ${
              hoveredSection === section.key ? 'ring-2 ring-blue-400' : ''
            }`}
            onDragOver={(e) => handleDragOver(e, section.key)}
            onDrop={(e) => handleDrop(e, section.key)}
            onDragEnd={handleDragEnd}
          >
            <div className="flex items-center gap-2 mb-3">
              {section.icon}
              <div>
                <h3 className="font-semibold text-sm">{section.title}</h3>
                <p className="text-xs text-muted-foreground">{section.description}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {businessModel[section.key].map((item) => 
                renderCanvasItem(item, section.key)
              )}
              
              {isEditing && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs"
                  onClick={() => {
                    // Add new item logic
                  }}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Item
                </Button>
              )}
            </div>
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
              <Download className="h-4 w-4 text-muted-foreground" />
              <span>Export canvas</span>
            </div>
            <div className="flex items-center gap-2">
              <Share className="h-4 w-4 text-muted-foreground" />
              <span>Share with team</span>
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