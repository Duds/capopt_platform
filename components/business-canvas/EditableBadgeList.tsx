'use client'

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Plus, Settings, Shield, FileText, Zap } from 'lucide-react'

interface EditableBadgeListProps {
  items: string[]
  onItemsChange: (items: string[]) => void
  placeholder?: string
  category: 'operational' | 'compliance' | 'regulatory'
  maxItems?: number
}

export function EditableBadgeList({
  items,
  onItemsChange,
  placeholder = "Add item...",
  category,
  maxItems = 20
}: EditableBadgeListProps) {
  const [newItem, setNewItem] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const handleAddItem = () => {
    const trimmedItem = newItem.trim()
    if (trimmedItem && !items.includes(trimmedItem) && items.length < maxItems) {
      onItemsChange([...items, trimmedItem])
      setNewItem('')
      setIsAdding(false)
    }
  }

  const handleRemoveItem = (itemToRemove: string) => {
    onItemsChange(items.filter(item => item !== itemToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddItem()
    } else if (e.key === 'Escape') {
      setIsAdding(false)
      setNewItem('')
    }
  }

  const getCategoryIcon = () => {
    switch (category) {
      case 'operational':
        return Zap
      case 'compliance':
        return Shield
      case 'regulatory':
        return FileText
      default:
        return Settings
    }
  }

  const getCategoryColor = () => {
    switch (category) {
      case 'operational':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
      case 'compliance':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200'
      case 'regulatory':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }
  }

  const CategoryIcon = getCategoryIcon()

  return (
    <div className="space-y-3">
      {/* Existing Items */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <Badge
              key={`${item}-${index}`}
              variant="outline"
              className={`flex items-center gap-1 ${getCategoryColor()} cursor-pointer transition-colors`}
              onClick={() => handleRemoveItem(item)}
            >
              <CategoryIcon className="h-3 w-3" />
              {item.replace(/_/g, ' ')}
              <X className="h-3 w-3 ml-1 opacity-60 hover:opacity-100" />
            </Badge>
          ))}
        </div>
      )}

      {/* Add New Item */}
      {!isAdding && items.length < maxItems && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add {category.replace(/([A-Z])/g, ' $1').toLowerCase()}
        </Button>
      )}

      {/* Add Item Input */}
      {isAdding && (
        <div className="flex gap-2">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            className="flex-1"
            autoFocus
          />
          <Button
            size="sm"
            onClick={handleAddItem}
            disabled={!newItem.trim() || items.includes(newItem.trim())}
          >
            Add
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsAdding(false)
              setNewItem('')
            }}
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Help Text */}
      {items.length === 0 && !isAdding && (
        <p className="text-sm text-muted-foreground">
          No {category.replace(/([A-Z])/g, ' $1').toLowerCase()} items added yet.
        </p>
      )}

      {/* Max Items Warning */}
      {items.length >= maxItems && (
        <p className="text-sm text-amber-600">
          Maximum {maxItems} items reached. Remove some items to add more.
        </p>
      )}
    </div>
  )
} 