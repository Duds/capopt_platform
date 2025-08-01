/**
 * Business Canvas Types - TypeScript Type Definitions
 * 
 * Defines TypeScript interfaces for the business canvas functionality:
 * - CanvasItem: Individual elements within canvas sections
 * - BusinessModel: Complete business model with 9 canvas sections
 * - CanvasSection: Section configuration and layout information
 * - CanvasVisualizationProps: Props for the main visualization component
 * - CanvasItemProps: Props for individual canvas items
 * 
 * These types ensure type safety and consistency across
 * the business canvas implementation.
 */

export interface CanvasItem {
  id: string
  title?: string
  name?: string
  description?: string
  priority?: "high" | "medium" | "low" | "HIGH" | "MEDIUM" | "LOW" | "CRITICAL"
  color?: string
  isImplemented?: boolean
  // Additional properties for different sections
  type?: string
  size?: number
  estimatedValue?: number
  frequency?: string
  value?: string
  availability?: string
  cost?: number
  amount?: number
  category?: string
  effectiveness?: string
}

export interface BusinessModel {
  partnerships: CanvasItem[]
  activities: CanvasItem[]
  resources: CanvasItem[]
  valuePropositions: CanvasItem[]
  channels: CanvasItem[]
  customerSegments: CanvasItem[]
  costStructures: CanvasItem[]
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

export interface BusinessModelCanvasProps {
  businessModel: BusinessModel
  onUpdate: (updatedModel: BusinessModel) => void
  isEditing?: boolean
  viewMode?: 'list' | 'canvas'
  onViewModeChange?: (mode: 'list' | 'canvas') => void
  onEditingChange?: (editing: boolean) => void
}

export interface CanvasItemProps {
  item: CanvasItem
  sectionKey: keyof BusinessModel
  isEditing: boolean
  onEdit?: (item: CanvasItem) => void
  onDelete?: (itemId: string) => void
  onDragStart?: (e: React.DragEvent, item: CanvasItem, sectionKey: keyof BusinessModel) => void
} 