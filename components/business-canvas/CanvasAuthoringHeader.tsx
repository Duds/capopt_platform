"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Target,
  Plus,
  Copy,
  Download,
  Share,
  Save,
  History,
  GitBranch,
  Users,
  Building,
  MapPin,
  Eye,
  Edit,
  Lock,
  Unlock,
  FileText,
  Image,
  Code,
  FileSpreadsheet,
  Settings,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  Tag,
  Globe,
  Mail,
  Link,
  Shield,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useBusinessCanvas } from '@/hooks/use-business-canvas'

// Types for enhanced BMC functionality
interface EnterpriseContext {
  enterprise: {
    id: string
    name: string
    legalName: string
    abn: string
  }
  facility?: {
    id: string
    name: string
    code: string
  }
  businessUnit?: {
    id: string
    name: string
    code: string
  }
}

interface CanvasCollaborator {
  id: string
  user: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  role: 'OWNER' | 'EDITOR' | 'REVIEWER' | 'VIEWER'
  lastActivity?: string
  isActive: boolean
}

interface CanvasVersion {
  id: string
  versionNumber: string
  description?: string
  createdBy: {
    id: string
    name: string
  }
  createdAt: string
}

interface CanvasTemplate {
  id: string
  name: string
  description?: string
  category: 'INDUSTRY' | 'BUSINESS_TYPE' | 'CUSTOM' | 'ENTERPRISE'
  tags: string[]
  thumbnail?: string
  usageCount: number
  rating: number
}

interface CanvasAuthoringHeaderProps {
  currentCanvasId?: string
  onCanvasChange: (canvasId: string) => void
  onSave: () => void
  onExport: (format: string) => void
  onShare: (settings: any) => void
  onTemplateLoad: (templateId: string) => void
  onNewCanvas: () => void
  collaborationMode?: 'single' | 'multi'
  enterpriseContext?: EnterpriseContext
  collaborators?: CanvasCollaborator[]
  versions?: CanvasVersion[]
  templates?: CanvasTemplate[]
  hasUnsavedChanges?: boolean
  lastSaved?: string
  conflicts?: any[]
}

export function CanvasAuthoringHeader({
  currentCanvasId,
  onCanvasChange,
  onSave,
  onExport,
  onShare,
  onTemplateLoad,
  onNewCanvas,
  collaborationMode = 'single',
  enterpriseContext,
  collaborators = [],
  versions = [],
  templates = [],
  hasUnsavedChanges = false,
  lastSaved,
  conflicts = []
}: CanvasAuthoringHeaderProps) {
  const { user } = useAuth()
  const { businessCanvases, loading } = useBusinessCanvas()
  
  const [selectedCanvas, setSelectedCanvas] = useState<string>(currentCanvasId || '')
  const [showTemplates, setShowTemplates] = useState(false)
  const [showSharing, setShowSharing] = useState(false)
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [autoSave, setAutoSave] = useState(true)
  const [editMode, setEditMode] = useState<'draft' | 'review' | 'published'>('draft')

  const currentCanvas = businessCanvases.find(canvas => canvas.id === selectedCanvas)
  const activeCollaborators = collaborators.filter(c => c.isActive)

  // Format relative time
  const formatRelativeTime = (dateString?: string) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  // Handle canvas selection
  const handleCanvasChange = (canvasId: string) => {
    setSelectedCanvas(canvasId)
    onCanvasChange(canvasId)
  }

  // Export options
  const exportFormats = [
    { value: 'pdf', label: 'PDF Document', icon: FileText },
    { value: 'png', label: 'PNG Image', icon: Image },
    { value: 'svg', label: 'SVG Vector', icon: Image },
    { value: 'json', label: 'JSON Data', icon: Code },
    { value: 'csv', label: 'CSV Spreadsheet', icon: FileSpreadsheet },
    { value: 'excel', label: 'Excel File', icon: FileSpreadsheet },
  ]

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      {/* Header Section */}
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2 text-blue-900">
          <Target className="h-5 w-5" />
          Business Canvas Authoring
        </div>
        <div className="text-sm text-blue-700">
          Create, edit, and manage business model canvases with enterprise context
        </div>
      </div>

      {/* Main Controls Section */}
      <div className="p-6 pt-0 space-y-4">
        
        {/* Canvas Selection Row */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-blue-900">Select Canvas</label>
            <div className="flex items-center gap-2 mt-1">
              <Select value={selectedCanvas} onValueChange={handleCanvasChange}>
                <SelectTrigger className="flex-1">
                  <SelectValue>
                    {currentCanvas ? (
                      <div className="flex items-center gap-3">
                        <Target className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="font-medium">{currentCanvas.name}</div>
                          <div className="text-sm text-gray-500">{currentCanvas.description}</div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Select a canvas...</span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {businessCanvases.map(canvas => (
                    <SelectItem key={canvas.id} value={canvas.id}>
                      <div className="flex items-center gap-3">
                        <Target className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="font-medium">{canvas.name}</div>
                          <div className="text-sm text-gray-500">{canvas.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={onNewCanvas}>
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button>
              <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Templates
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Canvas Templates</DialogTitle>
                    <DialogDescription>
                      Choose from pre-built templates to get started quickly
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                    {templates.map(template => (
                      <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium">{template.name}</h4>
                              <p className="text-sm text-gray-600">{template.description}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {template.category}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span className="text-xs">{template.rating.toFixed(1)}</span>
                            </div>
                            <span className="text-xs text-gray-500">{template.usageCount} uses</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {template.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => {
                              onTemplateLoad(template.id)
                              setShowTemplates(false)
                            }}
                          >
                            Use Template
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="text-right">
            {currentCanvas && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {currentCanvas.name}
              </Badge>
            )}
          </div>
        </div>

        {/* Authoring Controls Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Edit Mode Toggle */}
            <div className="flex items-center gap-2">
              <Label htmlFor="edit-mode" className="text-sm font-medium">Edit Mode</Label>
              <Select value={editMode} onValueChange={(value: any) => setEditMode(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Collaboration Indicator */}
            {collaborationMode === 'multi' && (
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {activeCollaborators.slice(0, 3).map(collaborator => (
                    <Avatar key={collaborator.id} className="h-6 w-6 border-2 border-white">
                      <AvatarImage src={collaborator.user.avatar} />
                      <AvatarFallback className="text-xs">
                        {collaborator.user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {activeCollaborators.length > 3 && (
                    <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                      +{activeCollaborators.length - 3}
                    </div>
                  )}
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Live
                </Badge>
              </div>
            )}

            {/* Auto-Save Indicator */}
            <div className="flex items-center gap-2">
              <Switch
                id="auto-save"
                checked={autoSave}
                onCheckedChange={setAutoSave}
              />
              <Label htmlFor="auto-save" className="text-sm">Auto-save</Label>
              {hasUnsavedChanges ? (
                <Badge variant="destructive">Unsaved</Badge>
              ) : (
                <Badge variant="secondary">Saved</Badge>
              )}
              <span className="text-xs text-muted-foreground">
                Last saved: {formatRelativeTime(lastSaved)}
              </span>
              {conflicts.length > 0 && (
                <Badge variant="destructive">{conflicts.length} conflicts</Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Version Control */}
            <div className="flex items-center gap-2">
              <Badge variant="outline">v{currentCanvas?.version || '1.0'}</Badge>
              <Button variant="ghost" size="sm" onClick={() => setShowVersionHistory(true)}>
                <History className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <GitBranch className="h-4 w-4" />
              </Button>
            </div>

            {/* Action Buttons */}
            <Button variant="outline" size="sm" onClick={onSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {exportFormats.map(format => (
                  <DropdownMenuItem key={format.value} onClick={() => onExport(format.value)}>
                    <format.icon className="h-4 w-4 mr-2" />
                    {format.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={showSharing} onOpenChange={setShowSharing}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Canvas</DialogTitle>
                  <DialogDescription>
                    Share this canvas with team members or create public links
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="share-type">Share Type</Label>
                    <Select defaultValue="team">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="team">Team Access</SelectItem>
                        <SelectItem value="public">Public Link</SelectItem>
                        <SelectItem value="email">Email Invite</SelectItem>
                        <SelectItem value="enterprise">Enterprise Access</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="permissions">Permissions</Label>
                    <Select defaultValue="view">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="view">View Only</SelectItem>
                        <SelectItem value="comment">Can Comment</SelectItem>
                        <SelectItem value="edit">Can Edit</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="expires">Expires</Label>
                    <Input type="date" id="expires" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowSharing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    onShare({ type: 'team', permissions: 'view' })
                    setShowSharing(false)
                  }}>
                    Share
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Lock className="h-4 w-4 mr-2" />
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Enterprise Context Row */}
        {enterpriseContext && (
          <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-blue-600" />
              <span className="font-medium">{enterpriseContext.enterprise.name}</span>
              <Badge variant="outline" className="text-xs">
                {enterpriseContext.enterprise.abn}
              </Badge>
            </div>
            {enterpriseContext.facility && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="text-sm">{enterpriseContext.facility.name}</span>
                <Badge variant="outline" className="text-xs">
                  {enterpriseContext.facility.code}
                </Badge>
              </div>
            )}
            {enterpriseContext.businessUnit && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm">{enterpriseContext.businessUnit.name}</span>
                <Badge variant="outline" className="text-xs">
                  {enterpriseContext.businessUnit.code}
                </Badge>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Version History Dialog */}
      <Dialog open={showVersionHistory} onOpenChange={setShowVersionHistory}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Version History</DialogTitle>
            <DialogDescription>
              View and manage versions of this canvas
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {versions.map(version => (
              <div key={version.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Version {version.versionNumber}</div>
                  <div className="text-sm text-gray-600">{version.description}</div>
                  <div className="text-xs text-gray-500">
                    by {version.createdBy.name} • {formatRelativeTime(version.createdAt)}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Restore
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 