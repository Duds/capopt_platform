'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, GripVertical } from 'lucide-react'
import { CanvasItemProps } from './types'
import { getPriorityColor } from './utils'

export function CanvasItem({ 
  item, 
  sectionKey, 
  isEditing, 
  onEdit, 
  onDelete, 
  onDragStart 
}: CanvasItemProps) {
  return (
    <div
      draggable={isEditing}
      onDragStart={(e) => onDragStart?.(e, item, sectionKey)}
      className={`p-3 border rounded-lg mb-2 cursor-move hover:shadow-md transition-shadow ${
        isEditing ? 'bg-white' : 'bg-gray-50'
      } ${!item.isImplemented ? 'opacity-50' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm">{item.title}</h4>
            <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>
              {item.priority}
            </Badge>
            {!item.isImplemented && (
              <Badge variant="outline" className="text-xs">Mock Data</Badge>
            )}
            {item.isImplemented && (
              <Badge variant="secondary" className="text-xs">✓ Real Data</Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{item.description}</p>
        </div>
        {isEditing && (
          <div className="flex items-center gap-1 ml-2">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => onEdit(item)}
              >
                <Edit className="h-3 w-3" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                onClick={() => onDelete(item.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
            <GripVertical className="h-3 w-3 text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  )
} 