'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { CanvasSection as CanvasSectionType, BusinessModel } from './types'
import { CanvasItem } from './canvas-item'
import { canvasSectionIcons } from './icons'

interface CanvasSectionProps {
  section: CanvasSectionType
  items: any[]
  isEditing: boolean
  onAddItem?: (sectionKey: keyof BusinessModel) => void
  onEditItem?: (item: any) => void
  onDeleteItem?: (itemId: string) => void
  onDragStart?: (e: React.DragEvent, item: any, sectionKey: keyof BusinessModel) => void
  onDragOver?: (e: React.DragEvent, sectionKey: keyof BusinessModel) => void
  onDrop?: (e: React.DragEvent, sectionKey: keyof BusinessModel) => void
  onDragEnd?: () => void
}

export function CanvasSection({
  section,
  items,
  isEditing,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd
}: CanvasSectionProps) {
  const icon = canvasSectionIcons[section.key]

  return (
    <Card 
      className={`${section.color} min-h-[350px] h-full ${!section.isImplemented ? 'opacity-50' : ''}`}
      onDragOver={(e) => onDragOver?.(e, section.key)}
      onDrop={(e) => onDrop?.(e, section.key)}
      onDragEnd={onDragEnd}
    >
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-xl">
          {icon}
          <span className="ml-3">{section.title}</span>
          {!section.isImplemented && (
            <Badge variant="outline" className="ml-2 text-xs">Mock Data</Badge>
          )}
          {section.isImplemented && (
            <Badge variant="secondary" className="ml-2 text-xs">✓ Real Data</Badge>
          )}
        </CardTitle>
        <p className="text-sm leading-relaxed text-muted-foreground">{section.description}</p>
      </CardHeader>
      <CardContent className="space-y-4 flex-1">
        {items.map((item) => (
          <CanvasItem
            key={item.id}
            item={item}
            sectionKey={section.key}
            isEditing={isEditing}
            onEdit={onEditItem}
            onDelete={onDeleteItem}
            onDragStart={onDragStart}
          />
        ))}

        {isEditing && onAddItem && (
          <Button
            variant="outline"
            className="w-full border-2 border-dashed border-gray-300 hover:border-gray-400 bg-transparent py-3"
            onClick={() => onAddItem(section.key)}
            disabled={!section.isImplemented}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add {section.title.slice(0, -1)}
            {!section.isImplemented && (
              <Badge variant="outline" className="ml-2 text-xs">Not Available</Badge>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
} 