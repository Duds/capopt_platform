export interface CanvasItem {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  color?: string
  isImplemented?: boolean
}

export interface BusinessModel {
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

export interface CanvasSection {
  key: keyof BusinessModel
  title: string
  description: string
  icon: React.ReactNode
  color: string
  position: 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
  isImplemented: boolean
}

export interface CanvasVisualizationProps {
  businessModel: BusinessModel
  onUpdate: (updatedModel: BusinessModel) => void
  isEditing?: boolean
}

export interface CanvasItemProps {
  item: CanvasItem
  sectionKey: keyof BusinessModel
  isEditing: boolean
  onEdit?: (item: CanvasItem) => void
  onDelete?: (itemId: string) => void
  onDragStart?: (e: React.DragEvent, item: CanvasItem, sectionKey: keyof BusinessModel) => void
} 