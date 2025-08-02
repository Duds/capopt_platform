/**
 * Service Model Design Component
 * 
 * Provides interactive service design and delivery framework for the Operating Model Canvas:
 * - Service design visualization and mapping
 * - Service delivery method configuration
 * - Service level management and metrics
 * - Customer journey integration
 * - Service performance tracking
 * - Interactive editing and collaboration
 * 
 * This component enables comprehensive service model design and optimization
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
  Users,
  ArrowRight,
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  Clock,
  Package,
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
  Minimize2,
  Globe,
  Smartphone,
  Monitor,
  Headphones,
  Mail,
  MessageSquare,
  Phone,
  Video,
  Building,
  Home,
  Car,
  Plane,
  Ship,
  Truck,
  Wifi,
  Shield,
  Star,
  Award,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react'
import { ServiceModel, ServiceMetric } from './types'
import { getServiceTypeColor, getServiceLevelColor, generateId, formatDate } from './legacy-utils'

interface ServiceModelDesignProps {
  serviceModel: ServiceModel
  onUpdate: (updatedServiceModel: ServiceModel) => void
  isEditing?: boolean
  onEditingChange?: (editing: boolean) => void
}

export function ServiceModelDesign({
  serviceModel,
  onUpdate,
  isEditing = false,
  onEditingChange
}: ServiceModelDesignProps) {
  const [selectedService, setSelectedService] = useState<ServiceModel | null>(null)
  const [showServiceDialog, setShowServiceDialog] = useState(false)
  const [showMetricDialog, setShowMetricDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'design' | 'delivery' | 'metrics'>('design')
  const { toast } = useToast()

  // Calculate service model metrics
  const serviceMetrics = useMemo(() => {
    const totalServices = 1 // Single service model
    const coreServices = serviceModel.serviceType === 'CORE' ? 1 : 0
    const supportingServices = serviceModel.serviceType === 'SUPPORTING' ? 1 : 0
    const enablingServices = serviceModel.serviceType === 'ENABLING' ? 1 : 0
    
    const avgResponseTime = serviceModel.serviceMetrics.length > 0 
      ? serviceModel.serviceMetrics.reduce((sum, metric) => sum + metric.current, 0) / serviceModel.serviceMetrics.length
      : 0
    
    const avgAvailability = serviceModel.serviceMetrics.length > 0
      ? serviceModel.serviceMetrics.filter(m => m.metricType === 'AVAILABILITY').reduce((sum, metric) => sum + metric.current, 0) / 
        serviceModel.serviceMetrics.filter(m => m.metricType === 'AVAILABILITY').length
      : 0
    
    return {
      totalServices,
      coreServices,
      supportingServices,
      enablingServices,
      avgResponseTime,
      avgAvailability,
      totalMetrics: serviceModel.serviceMetrics.length
    }
  }, [serviceModel])

  // Get delivery method icon
  const getDeliveryMethodIcon = (method: string) => {
    switch (method) {
      case 'IN_PERSON':
        return Building
      case 'REMOTE':
        return Globe
      case 'HYBRID':
        return Monitor
      case 'AUTOMATED':
        return Zap
      default:
        return Activity
    }
  }

  // Get service level icon
  const getServiceLevelIcon = (level: string) => {
    switch (level) {
      case 'BASIC':
        return Info
      case 'STANDARD':
        return CheckCircle
      case 'PREMIUM':
        return Star
      default:
        return Target
    }
  }

  // Get channel icon
  const getChannelIcon = (channel: string) => {
    const channelLower = channel.toLowerCase()
    if (channelLower.includes('web') || channelLower.includes('online')) return Globe
    if (channelLower.includes('mobile') || channelLower.includes('app')) return Smartphone
    if (channelLower.includes('phone') || channelLower.includes('call')) return Phone
    if (channelLower.includes('email')) return Mail
    if (channelLower.includes('chat') || channelLower.includes('message')) return MessageSquare
    if (channelLower.includes('video') || channelLower.includes('meeting')) return Video
    if (channelLower.includes('office') || channelLower.includes('branch')) return Building
    return Activity
  }

  // Update service model
  const updateServiceModel = async (updates: Partial<ServiceModel>) => {
    try {
      const updatedModel = {
        ...serviceModel,
        ...updates,
        updatedAt: new Date()
      }

      onUpdate(updatedModel)
      
      toast({
        title: "Service Model Updated",
        description: "Successfully updated service model",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update service model. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Add service metric
  const addServiceMetric = async (metric: Omit<ServiceMetric, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newMetric: ServiceMetric = {
        ...metric,
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const updatedModel = {
        ...serviceModel,
        serviceMetrics: [...serviceModel.serviceMetrics, newMetric]
      }

      onUpdate(updatedModel)
      setShowMetricDialog(false)
      
      toast({
        title: "Metric Added",
        description: `Successfully added ${metric.name} metric`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add metric. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Update service metric
  const updateServiceMetric = async (metricId: string, updates: Partial<ServiceMetric>) => {
    try {
      const updatedModel = {
        ...serviceModel,
        serviceMetrics: serviceModel.serviceMetrics.map(metric =>
          metric.id === metricId
            ? { ...metric, ...updates, updatedAt: new Date() }
            : metric
        )
      }

      onUpdate(updatedModel)
      setShowMetricDialog(false)
      
      toast({
        title: "Metric Updated",
        description: `Successfully updated ${updates.name || 'metric'}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update metric. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Delete service metric
  const deleteServiceMetric = async (metricId: string) => {
    try {
      const updatedModel = {
        ...serviceModel,
        serviceMetrics: serviceModel.serviceMetrics.filter(metric => metric.id !== metricId)
      }

      onUpdate(updatedModel)
      
      toast({
        title: "Metric Deleted",
        description: "Successfully deleted metric",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete metric. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Render service design view
  const renderServiceDesign = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Service Design</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('delivery')}
            >
              <Package className="h-4 w-4 mr-1" />
              Delivery
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Service Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Service Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Service Type</span>
                <Badge variant="outline" className={getServiceTypeColor(serviceModel.serviceType)}>
                  {serviceModel.serviceType}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Service Level</span>
                <Badge variant="outline" className={getServiceLevelColor(serviceModel.serviceLevel)}>
                  {serviceModel.serviceLevel}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Delivery Method</span>
                <div className="flex items-center gap-2">
                  {(() => {
                    const Icon = getDeliveryMethodIcon(serviceModel.deliveryMethod)
                    return <Icon className="h-4 w-4" />
                  })()}
                  <span className="text-sm">{serviceModel.deliveryMethod.replace('_', ' ')}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Service Channels</span>
                <span className="text-sm text-muted-foreground">{serviceModel.serviceChannels.length} channels</span>
              </div>
            </CardContent>
          </Card>

          {/* Service Channels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Service Channels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {serviceModel.serviceChannels.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <Globe className="h-8 w-8 mx-auto mb-2" />
                    <p>No service channels defined</p>
                  </div>
                ) : (
                  serviceModel.serviceChannels.map((channel, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        {(() => {
                          const Icon = getChannelIcon(channel)
                          return <Icon className="h-4 w-4" />
                        })()}
                        <span className="text-sm font-medium">{channel}</span>
                      </div>
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updatedChannels = serviceModel.serviceChannels.filter((_, i) => i !== index)
                            updateServiceModel({ serviceChannels: updatedChannels })
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))
                )}
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newChannel = prompt('Enter new service channel:')
                      if (newChannel) {
                        updateServiceModel({ 
                          serviceChannels: [...serviceModel.serviceChannels, newChannel] 
                        })
                      }
                    }}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Channel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Description */}
        <Card>
          <CardHeader>
            <CardTitle>Service Description</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-2">
                <Label htmlFor="serviceDescription">Description</Label>
                <Textarea
                  id="serviceDescription"
                  defaultValue={serviceModel.description || ''}
                  placeholder="Describe the service..."
                  rows={4}
                />
                <Button
                  size="sm"
                  onClick={() => {
                    const description = (document.getElementById('serviceDescription') as HTMLTextAreaElement)?.value
                    updateServiceModel({ description })
                  }}
                >
                  Save Description
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">
                {serviceModel.description || 'No description provided'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render delivery view
  const renderDeliveryView = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Service Delivery</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('design')}
            >
              <Users className="h-4 w-4 mr-1" />
              Design
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Delivery Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {(() => {
                  const Icon = getDeliveryMethodIcon(serviceModel.deliveryMethod)
                  return <Icon className="h-5 w-5" />
                })()}
                Delivery Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {serviceModel.deliveryMethod.replace('_', ' ')}
                </div>
                <p className="text-sm text-muted-foreground">
                  Primary delivery method for this service
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Service Level */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {(() => {
                  const Icon = getServiceLevelIcon(serviceModel.serviceLevel)
                  return <Icon className="h-5 w-5" />
                })()}
                Service Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {serviceModel.serviceLevel}
                </div>
                <p className="text-sm text-muted-foreground">
                  Quality and priority level
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Service Type */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Service Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {serviceModel.serviceType}
                </div>
                <p className="text-sm text-muted-foreground">
                  Strategic importance level
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Delivery Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isEditing ? (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="deliveryMethod">Delivery Method</Label>
                      <Select 
                        value={serviceModel.deliveryMethod} 
                        onValueChange={(value) => updateServiceModel({ deliveryMethod: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IN_PERSON">In Person</SelectItem>
                          <SelectItem value="REMOTE">Remote</SelectItem>
                          <SelectItem value="HYBRID">Hybrid</SelectItem>
                          <SelectItem value="AUTOMATED">Automated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serviceLevel">Service Level</Label>
                      <Select 
                        value={serviceModel.serviceLevel} 
                        onValueChange={(value) => updateServiceModel({ serviceLevel: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BASIC">Basic</SelectItem>
                          <SelectItem value="STANDARD">Standard</SelectItem>
                          <SelectItem value="PREMIUM">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="serviceType">Service Type</Label>
                      <Select 
                        value={serviceModel.serviceType} 
                        onValueChange={(value) => updateServiceModel({ serviceType: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CORE">Core</SelectItem>
                          <SelectItem value="SUPPORTING">Supporting</SelectItem>
                          <SelectItem value="ENABLING">Enabling</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span className="font-medium">Delivery Method</span>
                    <span className="text-muted-foreground">{serviceModel.deliveryMethod.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span className="font-medium">Service Level</span>
                    <span className="text-muted-foreground">{serviceModel.serviceLevel}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span className="font-medium">Service Type</span>
                    <span className="text-muted-foreground">{serviceModel.serviceType}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render metrics view
  const renderMetricsView = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Service Metrics</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('design')}
            >
              <Users className="h-4 w-4 mr-1" />
              Design
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('delivery')}
            >
              <Package className="h-4 w-4 mr-1" />
              Delivery
            </Button>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMetricDialog(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Metric
              </Button>
            )}
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{serviceMetrics.totalMetrics}</div>
                <div className="text-sm text-muted-foreground">Total Metrics</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{Math.round(serviceMetrics.avgResponseTime)}</div>
                <div className="text-sm text-muted-foreground">Avg Response (ms)</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{Math.round(serviceMetrics.avgAvailability)}%</div>
                <div className="text-sm text-muted-foreground">Avg Availability</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{serviceModel.serviceChannels.length}</div>
                <div className="text-sm text-muted-foreground">Service Channels</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Metrics List */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {serviceModel.serviceMetrics.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-3" />
                  <p>No metrics defined</p>
                  {isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowMetricDialog(true)}
                      className="mt-3"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add First Metric
                    </Button>
                  )}
                </div>
              ) : (
                serviceModel.serviceMetrics.map((metric) => (
                  <div key={metric.id} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{metric.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {metric.metricType.replace('_', ' ')}
                        </Badge>
                      </div>
                      {metric.description && (
                        <p className="text-sm text-muted-foreground mt-1">{metric.description}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">{metric.current} / {metric.target}</div>
                        <div className="text-xs text-muted-foreground">{metric.unit}</div>
                      </div>
                      {isEditing && (
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingItem(metric)
                              setShowMetricDialog(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteServiceMetric(metric.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{serviceModel.name}</h2>
          <p className="text-muted-foreground">{serviceModel.description}</p>
        </div>
        <div className="flex items-center space-x-2">
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
      {viewMode === 'design' && renderServiceDesign()}
      {viewMode === 'delivery' && renderDeliveryView()}
      {viewMode === 'metrics' && renderMetricsView()}

      {/* Metric Dialog */}
      <Dialog open={showMetricDialog} onOpenChange={setShowMetricDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Metric' : 'Add Metric'}
            </DialogTitle>
            <DialogDescription>
              Define a new service performance metric
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metricName">Metric Name *</Label>
              <Input
                id="metricName"
                defaultValue={editingItem?.name || ''}
                placeholder="Enter metric name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="metricDescription">Description</Label>
              <Textarea
                id="metricDescription"
                defaultValue={editingItem?.description || ''}
                placeholder="Describe the metric"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="metricType">Metric Type</Label>
                <Select defaultValue={editingItem?.metricType || 'RESPONSE_TIME'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RESPONSE_TIME">Response Time</SelectItem>
                    <SelectItem value="AVAILABILITY">Availability</SelectItem>
                    <SelectItem value="QUALITY">Quality</SelectItem>
                    <SelectItem value="SATISFACTION">Satisfaction</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="metricUnit">Unit</Label>
                <Input
                  id="metricUnit"
                  defaultValue={editingItem?.unit || ''}
                  placeholder="ms, %, score"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="metricTarget">Target Value</Label>
                <Input
                  id="metricTarget"
                  type="number"
                  defaultValue={editingItem?.target || 0}
                  placeholder="100"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="metricCurrent">Current Value</Label>
                <Input
                  id="metricCurrent"
                  type="number"
                  defaultValue={editingItem?.current || 0}
                  placeholder="85"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMetricDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              const name = (document.getElementById('metricName') as HTMLInputElement)?.value
              const description = (document.getElementById('metricDescription') as HTMLTextAreaElement)?.value
              const metricType = (document.querySelector('select[data-value]') as HTMLSelectElement)?.value || 'RESPONSE_TIME'
              const unit = (document.getElementById('metricUnit') as HTMLInputElement)?.value
              const target = parseFloat((document.getElementById('metricTarget') as HTMLInputElement)?.value || '0')
              const current = parseFloat((document.getElementById('metricCurrent') as HTMLInputElement)?.value || '0')
              
              if (!name) {
                toast({
                  title: "Validation Error",
                  description: "Metric name is required",
                  variant: "destructive",
                })
                return
              }

              const metricData = {
                name,
                description: description || undefined,
                metricType,
                unit,
                target,
                current
              }

              if (editingItem) {
                updateServiceMetric(editingItem.id, metricData)
              } else {
                addServiceMetric(metricData)
              }
            }}>
              {editingItem ? 'Update' : 'Add'} Metric
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 