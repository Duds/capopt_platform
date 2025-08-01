'use client'

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Plus, Settings, Shield, FileText, Zap, Building, Workflow, Search } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface MasterDataItem {
  id: string
  name: string
  code?: string
  description?: string
  category?: string
}

interface EditableBadgeListProps {
  items: string[]
  onItemsChange: (items: string[]) => void
  placeholder?: string
  category: 'operational' | 'compliance' | 'regulatory' | 'facility' | 'stream'
  maxItems?: number
  masterData?: MasterDataItem[]
  allowFreeText?: boolean
}

export function EditableBadgeList({
  items,
  onItemsChange,
  placeholder = "Add item...",
  category,
  maxItems = 20,
  masterData = [],
  allowFreeText = false
}: EditableBadgeListProps) {
  const [newItem, setNewItem] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [open, setOpen] = useState(false)

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

  const handleSelectMasterData = (item: MasterDataItem) => {
    const itemName = item.name
    if (!items.includes(itemName) && items.length < maxItems) {
      onItemsChange([...items, itemName])
    }
    setOpen(false)
  }

  const getCategoryIcon = () => {
    switch (category) {
      case 'operational':
        return Zap
      case 'compliance':
        return Shield
      case 'regulatory':
        return FileText
      case 'facility':
        return Building
      case 'stream':
        return Workflow
      default:
        return Settings
    }
  }

  const getCategoryVariant = () => {
    switch (category) {
      case 'operational':
        return 'secondary'
      case 'compliance':
        return 'compliance'
      case 'regulatory':
        return 'regulatory'
      case 'facility':
        return 'facility'
      case 'stream':
        return 'stream'
      default:
        return 'outline'
    }
  }

  const getCategoryLabel = () => {
    switch (category) {
      case 'operational':
        return 'operational item'
      case 'compliance':
        return 'compliance requirement'
      case 'regulatory':
        return 'regulatory framework'
      case 'facility':
        return 'facility type'
      case 'stream':
        return 'operational stream'
      default:
        return 'item'
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
              variant={getCategoryVariant()}
              className="flex items-center gap-1 cursor-pointer transition-colors"
              onClick={() => handleRemoveItem(item)}
            >
              <CategoryIcon className="h-3 w-3" />
              {item.replace(/_/g, ' ')}
              <X className="h-3 w-3 ml-1 opacity-60 hover:opacity-100" />
            </Badge>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {/* Add from Master Data Button */}
        {masterData.length > 0 && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Select from list
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] max-w-[90vw] p-0" align="start">
              <Command>
                <CommandInput placeholder={`Search ${getCategoryLabel()}s...`} />
                <CommandList>
                  <CommandEmpty>No {getCategoryLabel()}s found.</CommandEmpty>
                  <CommandGroup>
                    {masterData
                      .filter(item => !items.includes(item.name))
                      .map((item) => (
                        <CommandItem
                          key={item.id}
                          onSelect={() => handleSelectMasterData(item)}
                          className="cursor-pointer"
                        >
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium truncate">{item.name}</span>
                            {item.description && (
                              <span className="text-sm text-muted-foreground truncate">
                                {item.description}
                              </span>
                            )}
                          </div>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}

        {/* Add Free Text Button */}
        {allowFreeText && !isAdding && items.length < maxItems && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add custom {getCategoryLabel()}
          </Button>
        )}
      </div>

      {/* Add Item Input (for free text) */}
      {isAdding && allowFreeText && (
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
          No {getCategoryLabel()}s added yet.
          {masterData.length > 0 && ` Click "Select from list" to choose from available ${getCategoryLabel()}s.`}
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