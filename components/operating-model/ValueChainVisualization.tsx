/**
 * Value Chain Visualization Component
 * 
 * Provides interactive visual representation of value chains for the Operating Model Canvas:
 * - Flow diagram visualization of value chain activities
 * - Activity sequencing and dependencies
 * - Input/output mapping
 * - Performance metrics display
 * - Interactive editing and navigation
 * - Real-time updates and collaboration
 * 
 * This component enables visual understanding of value creation and delivery processes
 * within the operational capability framework.
 */

'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { 
  Workflow,
  ArrowRight,
  ArrowDown,
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  Clock,
  Package,
  Users,
  TrendingUp,
  Target,
  Zap,
  Activity,
  Layers,
  Gauge,
  Settings,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2
} from 'lucide-react'
import { ValueChain, ValueChainActivity, ValueChainInput, ValueChainOutput, ValueChainMetric } from './types'
import { getActivityTypeColor, getInputTypeIcon, getOutputTypeIcon, getMetricTypeIcon, generateId, formatDate } from './legacy-utils'

interface ValueChainVisualizationProps {
  valueChain: ValueChain
  onUpdate: (updatedValueChain: ValueChain) => void
  isEditing?: boolean
  onEditingChange?: (editing: boolean) => void
}

export function ValueChainVisualization({
  valueChain,
  onUpdate,
  isEditing = false,
  onEditingChange
}: ValueChainVisualizationProps) {
  const [selectedActivity, setSelectedActivity] = useState<ValueChainActivity | null>(null)
  const [showActivityDialog, setShowActivityDialog] = useState(false)
  const [showInputDialog, setShowInputDialog] = useState(false)
  const [showOutputDialog, setShowOutputDialog] = useState(false)
  const [showMetricDialog, setShowMetricDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'flow' | 'list' | 'metrics'>('flow')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['activities', 'inputs', 'outputs', 'metrics']))
  const { toast } = useToast()

  // Sort activities by sequence
  const sortedActivities = useMemo(() => {
    return [...valueChain.activities].sort((a, b) => a.sequence - b.sequence)
  }, [valueChain.activities])

  // Calculate value chain metrics
  const chainMetrics = useMemo(() => {
    const totalDuration = sortedActivities.reduce((sum, activity) => sum + activity.duration, 0)
    const primaryActivities = sortedActivities.filter(a => a.activityType === 'PRIMARY').length
    const supportActivities = sortedActivities.filter(a => a.activityType === 'SUPPORT').length
    const enablingActivities = sortedActivities.filter(a => a.activityType === 'ENABLING').length
    
    return {
      totalDuration,
      totalActivities: sortedActivities.length,
      primaryActivities,
      supportActivities,
      enablingActivities,
      averageDuration: totalDuration / sortedActivities.length || 0
    }
  }, [sortedActivities])

  // Add activity
  const addActivity = async (activity: Omit<ValueChainActivity, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newActivity: ValueChainActivity = {
        ...activity,
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const updatedValueChain = {
        ...valueChain,
        activities: [...valueChain.activities, newActivity]
      }

      onUpdate(updatedValueChain)
      setShowActivityDialog(false)
      
      toast({
        title: "Activity Added",
        description: `Successfully added ${activity.name} to value chain`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add activity. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Update activity
  const updateActivity = async (activityId: string, updates: Partial<ValueChainActivity>) => {
    try {
      const updatedValueChain = {
        ...valueChain,
        activities: valueChain.activities.map(activity =>
          activity.id === activityId
            ? { ...activity, ...updates, updatedAt: new Date() }
            : activity
        )
      }

      onUpdate(updatedValueChain)
      setShowActivityDialog(false)
      
      toast({
        title: "Activity Updated",
        description: `Successfully updated ${updates.name || 'activity'}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update activity. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Delete activity
  const deleteActivity = async (activityId: string) => {
    try {
      const updatedValueChain = {
        ...valueChain,
        activities: valueChain.activities.filter(activity => activity.id !== activityId)
      }

      onUpdate(updatedValueChain)
      
      toast({
        title: "Activity Deleted",
        description: "Successfully deleted activity",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete activity. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Toggle section expansion
  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  // Render flow diagram
  const renderFlowDiagram = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Value Chain Flow</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <Layers className="h-4 w-4 mr-1" />
              List View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('metrics')}
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Metrics
            </Button>
          </div>
        </div>

        <div className="relative">
          {/* Flow Diagram */}
          <div className="flex flex-wrap items-center justify-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-dashed border-blue-200">
            {sortedActivities.length === 0 ? (
              <div className="text-center py-8">
                <Workflow className="h-12 w-12 mx-auto mb-3 text-blue-400" />
                <p className="text-blue-600 font-medium">No activities defined</p>
                <p className="text-blue-500 text-sm">Add activities to create your value chain flow</p>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowActivityDialog(true)}
                    className="mt-3"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add First Activity
                  </Button>
                )}
              </div>
            ) : (
              sortedActivities.map((activity, index) => (
                <div key={activity.id} className="flex items-center">
                  {/* Activity Card */}
                  <Card 
                    className={`w-48 cursor-pointer hover:shadow-md transition-all ${
                      selectedActivity?.id === activity.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedActivity(activity)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getActivityTypeColor(activity.activityType)}`}
                        >
                          {activity.activityType}
                        </Badge>
                        <span className="text-xs text-muted-foreground">#{activity.sequence}</span>
                      </div>
                      <CardTitle className="text-sm font-medium line-clamp-2">
                        {activity.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {activity.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {activity.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {activity.duration}m
                        </span>
                        <span className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {activity.resources.length}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Arrow */}
                  {index < sortedActivities.length - 1 && (
                    <div className="mx-2">
                      <ArrowRight className="h-6 w-6 text-blue-400" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Selected Activity Details */}
          {selectedActivity && (
            <Card className="mt-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Activity Details</CardTitle>
                  {isEditing && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingItem(selectedActivity)
                          setShowActivityDialog(true)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteActivity(selectedActivity.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Activity Information</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <Badge variant="outline" className={`ml-2 ${getActivityTypeColor(selectedActivity.activityType)}`}>
                          {selectedActivity.activityType}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Sequence:</span>
                        <span className="ml-2">{selectedActivity.sequence}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="ml-2">{selectedActivity.duration} minutes</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Resources</h4>
                    <div className="space-y-1">
                      {selectedActivity.resources.length > 0 ? (
                        selectedActivity.resources.map((resource, index) => (
                          <Badge key={index} variant="secondary" className="mr-1 mb-1">
                            {resource}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No resources defined</p>
                      )}
                    </div>
                  </div>
                </div>
                {selectedActivity.description && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{selectedActivity.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  }

  // Render list view
  const renderListView = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Activities List</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('flow')}
            >
              <Workflow className="h-4 w-4 mr-1" />
              Flow View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('metrics')}
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Metrics
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {sortedActivities.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Workflow className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">No activities defined</p>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowActivityDialog(true)}
                    className="mt-3"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Activity
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            sortedActivities.map((activity) => (
              <Card key={activity.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                        {activity.sequence}
                      </div>
                      <div>
                        <h4 className="font-medium">{activity.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className={getActivityTypeColor(activity.activityType)}>
                            {activity.activityType}
                          </Badge>
                          <span className="text-sm text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {activity.duration}m
                          </span>
                        </div>
                      </div>
                    </div>
                    {isEditing && (
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingItem(activity)
                            setShowActivityDialog(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteActivity(activity.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  {activity.description && (
                    <p className="text-sm text-muted-foreground mt-2">{activity.description}</p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    )
  }

  // Render metrics view
  const renderMetricsView = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Value Chain Metrics</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('flow')}
            >
              <Workflow className="h-4 w-4 mr-1" />
              Flow View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <Layers className="h-4 w-4 mr-1" />
              List View
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{chainMetrics.totalActivities}</div>
                <div className="text-sm text-muted-foreground">Total Activities</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{chainMetrics.totalDuration}</div>
                <div className="text-sm text-muted-foreground">Total Duration (min)</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{Math.round(chainMetrics.averageDuration)}</div>
                <div className="text-sm text-muted-foreground">Avg Duration (min)</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{chainMetrics.primaryActivities}</div>
                <div className="text-sm text-muted-foreground">Primary Activities</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Primary Activities</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(chainMetrics.primaryActivities / chainMetrics.totalActivities) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{chainMetrics.primaryActivities}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Support Activities</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(chainMetrics.supportActivities / chainMetrics.totalActivities) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{chainMetrics.supportActivities}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Enabling Activities</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${(chainMetrics.enablingActivities / chainMetrics.totalActivities) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{chainMetrics.enablingActivities}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {valueChain.metrics.length > 0 ? (
                  valueChain.metrics.map((metric) => (
                    <div key={metric.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium text-sm">{metric.name}</div>
                        <div className="text-xs text-muted-foreground">{metric.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{metric.current} / {metric.target}</div>
                        <div className="text-xs text-muted-foreground">{metric.unit}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                    <p>No metrics defined</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{valueChain.name}</h2>
          <p className="text-muted-foreground">{valueChain.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowActivityDialog(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Activity
            </Button>
          )}
          <Button
            variant={isEditing ? "default" : "outline"}
            size="sm"
            onClick={() => onEditingChange?.(!isEditing)}
          >
            {isEditing ? <Eye className="h-4 w-4 mr-1" /> : <Edit className="h-4 w-4 mr-1" />}
            {isEditing ? 'View Mode' : 'Edit Mode'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === 'flow' && renderFlowDiagram()}
      {viewMode === 'list' && renderListView()}
      {viewMode === 'metrics' && renderMetricsView()}

      {/* Activity Dialog */}
      <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Activity' : 'Add Activity'}
            </DialogTitle>
            <DialogDescription>
              Define a new activity in the value chain
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="activityName">Activity Name *</Label>
              <Input
                id="activityName"
                defaultValue={editingItem?.name || ''}
                placeholder="Enter activity name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="activityDescription">Description</Label>
              <Textarea
                id="activityDescription"
                defaultValue={editingItem?.description || ''}
                placeholder="Describe the activity"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="activityType">Activity Type</Label>
                <Select defaultValue={editingItem?.activityType || 'PRIMARY'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRIMARY">Primary</SelectItem>
                    <SelectItem value="SUPPORT">Support</SelectItem>
                    <SelectItem value="ENABLING">Enabling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="activitySequence">Sequence</Label>
                <Input
                  id="activitySequence"
                  type="number"
                  defaultValue={editingItem?.sequence || (sortedActivities.length + 1)}
                  placeholder="1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="activityDuration">Duration (minutes)</Label>
              <Input
                id="activityDuration"
                type="number"
                defaultValue={editingItem?.duration || 60}
                placeholder="60"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActivityDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              const name = (document.getElementById('activityName') as HTMLInputElement)?.value
              const description = (document.getElementById('activityDescription') as HTMLTextAreaElement)?.value
              const activityType = (document.querySelector('select[data-value]') as HTMLSelectElement)?.value || 'PRIMARY'
              const sequence = parseInt((document.getElementById('activitySequence') as HTMLInputElement)?.value || '1')
              const duration = parseInt((document.getElementById('activityDuration') as HTMLInputElement)?.value || '60')
              
              if (!name) {
                toast({
                  title: "Validation Error",
                  description: "Activity name is required",
                  variant: "destructive",
                })
                return
              }

              const activityData = {
                name,
                description: description || undefined,
                activityType,
                sequence,
                duration,
                resources: editingItem?.resources || [],
                dependencies: editingItem?.dependencies || []
              }

              if (editingItem) {
                updateActivity(editingItem.id, activityData)
              } else {
                addActivity(activityData)
              }
            }}>
              {editingItem ? 'Update' : 'Add'} Activity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 