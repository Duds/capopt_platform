/**
 * Operating Model Canvas Component
 * 
 * Provides interactive operating model canvas visualization for the CapOpt Platform:
 * - 6-section operating model canvas layout (Suppliers, Locations, Value Chains, Organisation, Information, Management Systems)
 * - BMC → OMC integration with inherited business model context
 * - Strategic navigation flow integration
 * - Edit and view modes with clear visual distinction
 * - Real-time operating model updates
 * - Export and sharing capabilities
 * - Tree view for detailed navigation
 * 
 * This component enables operational strategy design and visualization.
 */

'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
  Plus,
  Edit,
  Trash2,
  Download,
  Share,
  Eye,
  Copy,
  Workflow,
  Users,
  Heart,
  Target,
  BookOpen,
  Activity,
  Package,
  Eye as EyeIcon,
  Zap,
  TrendingUp,
  TrendingDown,
  Shield,
  Lightbulb,
  Leaf,
  Grid3X3,
  List,
  Printer,
  Mail,
  Link,
  FileText,
  Network,
  Layers,
  Gauge,
  Clock,
  ArrowRight,
  ChevronDown,
  MoreHorizontal,
  BarChart3,
  Settings,
  CheckCircle,
  AlertTriangle,
  Truck,
  MapPin,
  Database,
  Monitor,
  Building2,
  Factory,
  Warehouse,
  Building,
  Globe,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  ExternalLink
} from 'lucide-react'
import { 
  OperatingModelCanvasProps, 
  OperatingModel, 
  CanvasItem,
  OperatingModelSupplier,
  OperatingModelLocation,
  OperatingModelValueChain,
  OperatingModelOrganisation,
  OperatingModelInformation,
  OperatingModelManagementSystem,
  SupplierType,
  LocationType,
  ValueChainType,
  OrganisationType,
  InformationType,
  ManagementSystemType,
  RiskLevel,
  ComplianceStatus,
  MaturityLevel,
  CanvasStatus,
  EditMode,
  SupplierCriticality,
  LocationStatus,
  ManagementSystemStatus,
  ValueChainComplexity,
  OrganisationLevel,
  InformationAccessibility,
  ValueChainActivityType
} from './types'
import { 
  operatingModelSections, 
  getSupplierTypeColor, 
  getLocationTypeColor, 
  getValueChainTypeColor, 
  getOrganisationTypeColor, 
  getInformationTypeColor, 
  getManagementSystemTypeColor,
  getRiskLevelColor,
  getComplianceStatusColor,
  getMaturityLevelColor,
  getSupplierTypeIcon,
  getLocationTypeIcon,
  getValueChainTypeIcon,
  getOrganisationTypeIcon,
  getInformationTypeIcon,
  getManagementSystemTypeIcon,
  generateId, 
  formatDate, 
  getSectionCount, 
  validateOperatingModel, 
  exportOperatingModel,
  buildOperatingModelTree,
  mapBMCToOMC,
  getBMCContext,
  calculateBMCIntegrationScore
} from './utils'

// BMC Context Interface
interface BMCContext {
  valuePropositions: any[]
  customerSegments: any[]
  channels: any[]
  customerRelationships: any[]
  keyActivities: any[]
  keyResources: any[]
  keyPartners: any[]
  costStructure: any[]
  revenueStreams: any[]
}

// Tree item types
interface TreeItem {
  id: string
  name: string
  type: string
  supplierType?: SupplierType
  locationType?: LocationType
  valueChainType?: ValueChainType
  orgType?: OrganisationType
  infoType?: InformationType
  systemType?: ManagementSystemType
  criticality?: SupplierCriticality
  status?: LocationStatus | ManagementSystemStatus
  complexity?: ValueChainComplexity
  level?: OrganisationLevel
  accessibility?: InformationAccessibility
  activityType?: ValueChainActivityType
  sequence?: number
  children?: TreeItem[]
}

interface TreeSection {
  id: string
  name: string
  type: string
  count: number
  children: TreeItem[]
}

interface TreeStructure {
  id: string
  name: string
  type: string
  children: TreeSection[]
}

export function OperatingModelCanvas({ 
  operatingModel, 
  onUpdate, 
  isEditing = false,
  viewMode = 'canvas',
  onViewModeChange,
  onEditingChange
}: OperatingModelCanvasProps) {
  const [editingItem, setEditingItem] = useState<{ section: keyof OperatingModel; item: any } | null>(null)
  const [newItem, setNewItem] = useState<{ section: keyof OperatingModel } | null>(null)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [exportFormat, setExportFormat] = useState<'json' | 'pdf' | 'csv'>('json')
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [selectedTreeItem, setSelectedTreeItem] = useState<string | null>(null)
  const [showBMCContext, setShowBMCContext] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Build tree structure for navigation
  const treeStructure = useMemo(() => {
    return buildOperatingModelTree(operatingModel)
  }, [operatingModel])

  // Get BMC context for integration
  const bmcContext = useMemo(() => {
    return getBMCContext(operatingModel.businessCanvasId)
  }, [operatingModel.businessCanvasId])

  // Calculate BMC integration score
  const bmcIntegrationScore = useMemo(() => {
    return calculateBMCIntegrationScore(operatingModel, bmcContext)
  }, [operatingModel, bmcContext])

  // Add item to section
  const addItem = async (section: keyof OperatingModel, item: any) => {
    try {
      const newItemWithId = {
        ...item,
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const updatedModel = {
        ...operatingModel,
        [section]: [...(operatingModel[section] as any[]), newItemWithId]
      }

      onUpdate(updatedModel)
      setNewItem(null)
      
      toast({
        title: "Item Added",
        description: `Successfully added ${item.name} to ${operatingModelSections[section as keyof typeof operatingModelSections].title}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Update item in section
  const updateItem = async (section: keyof OperatingModel, itemId: string, updates: any) => {
    try {
      const updatedModel = {
        ...operatingModel,
        [section]: (operatingModel[section] as any[]).map((item: any) =>
          item.id === itemId
            ? { ...item, ...updates, updatedAt: new Date() }
            : item
        )
      }

      onUpdate(updatedModel)
      setEditingItem(null)
      
      toast({
        title: "Item Updated",
        description: `Successfully updated ${updates.name || 'item'}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Delete item from section
  const deleteItem = async (section: keyof OperatingModel, itemId: string) => {
    try {
      const updatedModel = {
        ...operatingModel,
        [section]: (operatingModel[section] as any[]).filter((item: any) => item.id !== itemId)
      }

      onUpdate(updatedModel)
      
      toast({
        title: "Item Deleted",
        description: "Successfully deleted item",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle BMC integration
  const handleBMCIntegration = async () => {
    try {
      if (!bmcContext) {
        toast({
          title: "No BMC Context",
          description: "No Business Model Canvas context available for integration.",
          variant: "destructive",
        })
        return
      }
      
      const mappedItems = mapBMCToOMC(bmcContext, operatingModel)
      const updatedModel = {
        ...operatingModel,
        ...mappedItems
      }

      onUpdate(updatedModel)
      
      toast({
        title: "BMC Integration Complete",
        description: "Successfully integrated Business Model Canvas elements",
      })
    } catch (error) {
      toast({
        title: "Integration Error",
        description: "Failed to integrate BMC elements. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle export
  const handleExport = () => {
    setShowExportDialog(true)
  }

  const handleExportConfirm = () => {
    try {
      let exportData: string
      
      switch (exportFormat) {
        case 'json':
          exportData = exportOperatingModel(operatingModel)
          break
        case 'pdf':
          // TODO: Implement PDF export
          exportData = 'PDF export not yet implemented'
          break
        case 'csv':
          // TODO: Implement CSV export
          exportData = 'CSV export not yet implemented'
          break
        default:
          exportData = exportOperatingModel(operatingModel)
      }

      // Create and download file
      const blob = new Blob([exportData], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `operating-model-${operatingModel.name.replace(/\s+/g, '-').toLowerCase()}.${exportFormat}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setShowExportDialog(false)
      toast({
        title: "Export Successful",
        description: `Operating model exported as ${exportFormat.toUpperCase()}`,
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export operating model. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle share
  const handleShare = () => {
    setShowShareDialog(true)
  }

  const handleShareConfirm = () => {
    // TODO: Implement sharing functionality
    setShowShareDialog(false)
    toast({
      title: "Share Feature",
      description: "Sharing functionality will be implemented in a future update.",
    })
  }

  // Render BMC context strip
  const renderBMCContextStrip = () => {
    if (!bmcContext || !operatingModel.businessCanvasId) return null

    return (
      <Card className="mb-6 border-blue-200 bg-blue-50/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg font-semibold text-blue-900">
                Business Model Context
              </CardTitle>
              <Badge variant="outline" className="bg-blue-100 text-blue-700">
                {bmcIntegrationScore}% Integrated
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBMCIntegration}
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                <ArrowRight className="h-4 w-4 mr-1" />
                Integrate BMC
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBMCContext(!showBMCContext)}
              >
                {showBMCContext ? <ChevronDown className="h-4 w-4" /> : <ChevronDown className="h-4 w-4 rotate-180" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {showBMCContext && (
          <CardContent className="pt-0">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <div className="font-medium text-blue-800">Value Proposition</div>
                <div className="text-blue-700">
                  {bmcContext.valuePropositions?.[0]?.description || 'Not defined'}
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-medium text-blue-800">Customer Segments</div>
                <div className="text-blue-700">
                  {bmcContext.customerSegments?.length || 0} segments defined
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-medium text-blue-800">Key Activities</div>
                <div className="text-blue-700">
                  {bmcContext.keyActivities?.length || 0} activities defined
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    )
  }

  // Render canvas section with BMC integration indicators
  const renderCanvasSection = (sectionKey: keyof OperatingModel) => {
    const section = operatingModelSections[sectionKey as keyof typeof operatingModelSections]
    const items = operatingModel[sectionKey] as any[]
    const Icon = section.icon

    // Calculate BMC integration for this section
    const bmcItems = getBMCItemsForSection(sectionKey, bmcContext)
    const integrationCount = items.filter(item => item.businessCanvasActivityIds?.length > 0 || item.businessCanvasResourceIds?.length > 0).length
    const integrationPercentage = bmcItems.length > 0 ? Math.round((integrationCount / bmcItems.length) * 100) : 0

    return (
      <Card key={sectionKey} className={`${section.color} border-2 hover:shadow-md transition-shadow relative`}>
        {/* BMC Integration Indicator */}
        {bmcItems.length > 0 && (
          <div className="absolute -top-2 -right-2">
            <Badge 
              variant="secondary" 
              className={`text-xs ${
                integrationPercentage >= 80 ? 'bg-green-100 text-green-700' :
                integrationPercentage >= 60 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}
            >
              {integrationPercentage}% BMC
            </Badge>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon className="h-5 w-5" />
              <CardTitle className="text-lg font-semibold">{section.title}</CardTitle>
              <Badge variant="secondary" className="ml-2">
                {items.length}
              </Badge>
            </div>
            {isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNewItem({ section: sectionKey })}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
          <CardDescription className="text-sm opacity-80">
            {section.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {items.length === 0 ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                <Icon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No {section.title.toLowerCase()} defined</p>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setNewItem({ section: sectionKey })}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add {section.title.slice(0, -1)}
                  </Button>
                )}
              </div>
            ) : (
              items.map((item: any) => (
                <div
                  key={item.id}
                  className="group relative p-3 bg-white/50 rounded-lg border border-white/20 hover:bg-white/70 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedTreeItem(`${sectionKey}-${item.id}`)
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-sm truncate">{item.name}</h4>
                        
                        {/* BMC Integration Badge */}
                        {(item.businessCanvasActivityIds?.length > 0 || item.businessCanvasResourceIds?.length > 0) && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            BMC
                          </Badge>
                        )}
                        
                        {/* Type Badges */}
                        {isSupplier(item) && (
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getSupplierTypeColor(item.supplierType)}`}
                          >
                            {item.supplierType.replace(/_/g, ' ')}
                          </Badge>
                        )}
                        {isLocation(item) && (
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getLocationTypeColor(item.locationType)}`}
                          >
                            {item.locationType.replace(/_/g, ' ')}
                          </Badge>
                        )}
                        {isValueChain(item) && (
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getValueChainTypeColor(item.valueChainType)}`}
                          >
                            {item.valueChainType.replace(/_/g, ' ')}
                          </Badge>
                        )}
                        {isOrganisation(item) && (
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getOrganisationTypeColor(item.orgType)}`}
                          >
                            {item.orgType.replace(/_/g, ' ')}
                          </Badge>
                        )}
                        {isInformation(item) && (
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getInformationTypeColor(item.infoType)}`}
                          >
                            {item.infoType.replace(/_/g, ' ')}
                          </Badge>
                        )}
                        {isManagementSystem(item) && (
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getManagementSystemTypeColor(item.systemType)}`}
                          >
                            {item.systemType.replace(/_/g, ' ')}
                          </Badge>
                        )}
                        
                        {/* Status Badges */}
                        {isSupplier(item) && item.riskLevel && (
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getRiskLevelColor(item.riskLevel)}`}
                          >
                            {item.riskLevel}
                          </Badge>
                        )}
                        {isSupplier(item) && item.complianceStatus && (
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getComplianceStatusColor(item.complianceStatus)}`}
                          >
                            {item.complianceStatus.replace(/_/g, ' ')}
                          </Badge>
                        )}
                        {isOrganisation(item) && item.maturity && (
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getMaturityLevelColor(item.maturity)}`}
                          >
                            {item.maturity}
                          </Badge>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        <span>Created: {formatDate(item.createdAt)}</span>
                        <span>Updated: {formatDate(item.updatedAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingItem({ section: sectionKey, item })
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteItem(sectionKey, item.id)
                        }}
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Helper function to get BMC items for a section
  const getBMCItemsForSection = (sectionKey: keyof OperatingModel, bmcContext: BMCContext | null) => {
    if (!bmcContext) return []
    
    switch (sectionKey) {
      case 'suppliers':
        return bmcContext.keyPartners || []
      case 'valueChains':
        return [...(bmcContext.keyActivities || []), ...(bmcContext.valuePropositions || [])]
      case 'organisation':
        return [...(bmcContext.keyResources || []), ...(bmcContext.customerSegments || [])]
      case 'information':
        return [...(bmcContext.keyResources || []), ...(bmcContext.channels || [])]
      case 'managementSystems':
        return [...(bmcContext.channels || []), ...(bmcContext.costStructure || []), ...(bmcContext.revenueStreams || [])]
      default:
        return []
    }
  }

  // Helper function to check if a status is a compliance status
  const isComplianceStatus = (status: string): status is ComplianceStatus => {
    return ['COMPLIANT', 'NON_COMPLIANT', 'PARTIALLY_COMPLIANT', 'UNDER_REVIEW', 'NOT_APPLICABLE'].includes(status)
  }

  // Type guards for operating model items
  const isSupplier = (item: any): item is OperatingModelSupplier => {
    return 'supplierType' in item && 'criticality' in item
  }

  const isLocation = (item: any): item is OperatingModelLocation => {
    return 'locationType' in item && 'status' in item
  }

  const isValueChain = (item: any): item is OperatingModelValueChain => {
    return 'valueChainType' in item && 'complexity' in item
  }

  const isOrganisation = (item: any): item is OperatingModelOrganisation => {
    return 'orgType' in item && 'level' in item
  }

  const isInformation = (item: any): item is OperatingModelInformation => {
    return 'infoType' in item && 'accessibility' in item
  }

  const isManagementSystem = (item: any): item is OperatingModelManagementSystem => {
    return 'systemType' in item && 'status' in item
  }

  // Helper function to get item type safely
  const getItemTypeSafe = (item: any): string => {
    if (isSupplier(item)) return item.supplierType.replace(/_/g, ' ')
    if (isLocation(item)) return item.locationType.replace(/_/g, ' ')
    if (isValueChain(item)) return item.valueChainType.replace(/_/g, ' ')
    if (isOrganisation(item)) return item.orgType.replace(/_/g, ' ')
    if (isInformation(item)) return item.infoType.replace(/_/g, ' ')
    if (isManagementSystem(item)) return item.systemType.replace(/_/g, ' ')
    return ''
  }

  // Helper function to get item status safely
  const getItemStatusSafe = (item: any): string => {
    if (isSupplier(item)) return item.criticality
    if (isLocation(item)) return item.status.replace(/_/g, ' ')
    if (isValueChain(item)) return item.complexity.replace(/_/g, ' ')
    if (isOrganisation(item)) return item.level.replace(/_/g, ' ')
    if (isInformation(item)) return item.accessibility.replace(/_/g, ' ')
    if (isManagementSystem(item)) return item.status.replace(/_/g, ' ')
    return 'Active'
  }

  // Helper function to get item status color safely
  const getItemStatusColorSafe = (item: any): string => {
    if (isSupplier(item)) {
      const riskLevelMap: Record<string, RiskLevel> = {
        'CRITICAL': RiskLevel.CRITICAL,
        'HIGH': RiskLevel.HIGH,
        'MEDIUM': RiskLevel.MEDIUM,
        'LOW': RiskLevel.LOW
      }
      return getRiskLevelColor(riskLevelMap[item.criticality] || RiskLevel.MEDIUM)
    }
    if (isLocation(item)) return 'bg-green-100 text-green-800 border-green-200'
    if (isValueChain(item)) return 'bg-purple-100 text-purple-800 border-purple-200'
    if (isOrganisation(item)) return 'bg-orange-100 text-orange-800 border-orange-200'
    if (isInformation(item)) return 'bg-cyan-100 text-cyan-800 border-cyan-200'
    if (isManagementSystem(item)) {
      if (isComplianceStatus(item.status)) {
        return getComplianceStatusColor(item.status)
      }
      return 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return 'bg-gray-100 text-gray-800 border-gray-200'
  }

  // Helper functions for TreeItem (used in tree view)
  const getItemType = (item: TreeItem): string => {
    if (item.supplierType) return item.supplierType.replace(/_/g, ' ')
    if (item.locationType) return item.locationType.replace(/_/g, ' ')
    if (item.valueChainType) return item.valueChainType.replace(/_/g, ' ')
    if (item.orgType) return item.orgType.replace(/_/g, ' ')
    if (item.infoType) return item.infoType.replace(/_/g, ' ')
    if (item.systemType) return item.systemType.replace(/_/g, ' ')
    return ''
  }

  const getItemStatus = (item: TreeItem): string => {
    if (item.criticality) return item.criticality
    if (item.status) return item.status.replace(/_/g, ' ')
    if (item.complexity) return item.complexity.replace(/_/g, ' ')
    if (item.level) return item.level.replace(/_/g, ' ')
    if (item.accessibility) return item.accessibility.replace(/_/g, ' ')
    return 'Active'
  }

  const getItemStatusColor = (item: TreeItem): string => {
    if (item.criticality) {
      const riskLevelMap: Record<string, RiskLevel> = {
        'CRITICAL': RiskLevel.CRITICAL,
        'HIGH': RiskLevel.HIGH,
        'MEDIUM': RiskLevel.MEDIUM,
        'LOW': RiskLevel.LOW
      }
      return getRiskLevelColor(riskLevelMap[item.criticality] || RiskLevel.MEDIUM)
    }
    if (item.status) {
      if (isComplianceStatus(item.status)) {
        return getComplianceStatusColor(item.status)
      }
      return 'bg-gray-100 text-gray-800 border-gray-200'
    }
    if (item.complexity) return 'bg-purple-100 text-purple-800 border-purple-200'
    if (item.level) return 'bg-orange-100 text-orange-800 border-orange-200'
    if (item.accessibility) return 'bg-cyan-100 text-cyan-800 border-cyan-200'
    return 'bg-gray-100 text-gray-800 border-gray-200'
  }

  // Render list view
  const renderListView = () => {
    return (
      <div className="space-y-6">
        {Object.keys(operatingModelSections).map((sectionKey) => {
          const section = operatingModelSections[sectionKey as keyof typeof operatingModelSections]
          const items = operatingModel[sectionKey as keyof OperatingModel] as any[]
          const Icon = section.icon

          return (
            <Card key={sectionKey}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5" />
                    <CardTitle>{section.title}</CardTitle>
                    <Badge variant="secondary">{items.length}</Badge>
                  </div>
                  {isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNewItem({ section: sectionKey as keyof OperatingModel })}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add {section.title.slice(0, -1)}
                    </Button>
                  )}
                </div>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {items.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <Icon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No {section.title.toLowerCase()} defined</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 font-medium">Name</th>
                          <th className="text-left p-2 font-medium">Type</th>
                          <th className="text-left p-2 font-medium">Description</th>
                          <th className="text-left p-2 font-medium">Status</th>
                          <th className="text-left p-2 font-medium">Created</th>
                          <th className="text-left p-2 font-medium">Updated</th>
                          {isEditing && <th className="text-left p-2 font-medium">Actions</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item: any) => (
                          <tr key={item.id} className="border-b hover:bg-gray-50">
                            <td className="p-2">
                              {isEditing ? (
                                <Input
                                  defaultValue={item.name}
                                  className="h-8 text-sm"
                                  onBlur={(e) => {
                                    if (e.target.value !== item.name) {
                                      updateItem(sectionKey as keyof OperatingModel, item.id, { name: e.target.value })
                                    }
                                  }}
                                />
                              ) : (
                                <span className="font-medium">{item.name}</span>
                              )}
                            </td>
                            <td className="p-2">
                              {isEditing ? (
                                <Select
                                  defaultValue={
                                    'supplierType' in item ? item.supplierType :
                                    'locationType' in item ? item.locationType :
                                    'valueChainType' in item ? item.valueChainType :
                                    'orgType' in item ? item.orgType :
                                    'infoType' in item ? item.infoType :
                                    'systemType' in item ? item.systemType : ''
                                  }
                                  onValueChange={(value) => {
                                    const updateField = 
                                      'supplierType' in item ? 'supplierType' :
                                      'locationType' in item ? 'locationType' :
                                      'valueChainType' in item ? 'valueChainType' :
                                      'orgType' in item ? 'orgType' :
                                      'infoType' in item ? 'infoType' :
                                      'systemType' in item ? 'systemType' : null
                                    
                                    if (updateField) {
                                      updateItem(sectionKey as keyof OperatingModel, item.id, { [updateField]: value })
                                    }
                                  }}
                                >
                                  <SelectTrigger className="h-8 text-sm">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.values(SupplierType).map(type => (
                                      <SelectItem key={type} value={type}>
                                        {type.replace(/_/g, ' ')}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  {getItemTypeSafe(item)}
                                </Badge>
                              )}
                            </td>
                            <td className="p-2">
                              {isEditing ? (
                                <Textarea
                                  defaultValue={item.description || ''}
                                  className="h-8 text-sm resize-none"
                                  rows={1}
                                  onBlur={(e) => {
                                    if (e.target.value !== item.description) {
                                      updateItem(sectionKey as keyof OperatingModel, item.id, { description: e.target.value })
                                    }
                                  }}
                                />
                              ) : (
                                <span className="text-sm text-muted-foreground">
                                  {item.description || 'No description'}
                                </span>
                              )}
                            </td>
                            <td className="p-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getItemStatusColorSafe(item)}`}
                              >
                                {getItemStatusSafe(item)}
                              </Badge>
                            </td>
                            <td className="p-2 text-xs text-muted-foreground">
                              {formatDate(item.createdAt)}
                            </td>
                            <td className="p-2 text-xs text-muted-foreground">
                              {formatDate(item.updatedAt)}
                            </td>
                            {isEditing && (
                              <td className="p-2">
                                <div className="flex items-center space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingItem({ section: sectionKey as keyof OperatingModel, item })}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteItem(sectionKey as keyof OperatingModel, item.id)}
                                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  // Render tree view
  const renderTreeView = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Operating Model Tree</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedTreeItem(null)}
          >
            ← Back to Canvas
          </Button>
        </div>
        
        <div className="border rounded-lg p-4">
          {treeStructure.children.map((section) => (
            <div key={section.id} className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <ChevronDown className="h-4 w-4" />
                <span className="font-medium">{section.name}</span>
                <Badge variant="secondary">{section.count}</Badge>
              </div>
              
              <div className="ml-6 space-y-1">
                {section.children.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedTreeItem(`${section.id}-${item.id}`)}
                  >
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-sm">{item.name}</span>
                    {getItemType(item) && (
                      <Badge variant="outline" className="text-xs">
                        {getItemType(item)}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Render item editing dialog
  const renderItemDialog = () => {
    if (!newItem && !editingItem) return null

    const section = newItem ? newItem.section : editingItem!.section
    const item = editingItem?.item || {}
    const isEditing = !!editingItem
    const sectionInfo = operatingModelSections[section as keyof typeof operatingModelSections]

    return (
      <Dialog open={true} onOpenChange={() => {
        setNewItem(null)
        setEditingItem(null)
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit' : 'Add'} {sectionInfo.title.slice(0, -1)}
            </DialogTitle>
            <DialogDescription>
              {sectionInfo.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  defaultValue={item.name || ''}
                  placeholder={`Enter ${sectionInfo.title.slice(0, -1).toLowerCase()} name`}
                />
              </div>
              
              {/* Type Selection based on section */}
              {section === 'suppliers' && (
                <div className="space-y-2">
                  <Label htmlFor="supplierType">Supplier Type</Label>
                  <Select defaultValue={item.supplierType || SupplierType.MATERIAL_SUPPLIER}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(SupplierType).map(type => (
                        <SelectItem key={type} value={type}>
                          {type.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {section === 'locations' && (
                <div className="space-y-2">
                  <Label htmlFor="locationType">Location Type</Label>
                  <Select defaultValue={item.locationType || LocationType.HEADQUARTERS}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(LocationType).map(type => (
                        <SelectItem key={type} value={type}>
                          {type.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {section === 'valueChains' && (
                <div className="space-y-2">
                  <Label htmlFor="valueChainType">Value Chain Type</Label>
                  <Select defaultValue={item.valueChainType || ValueChainType.PRIMARY}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ValueChainType).map(type => (
                        <SelectItem key={type} value={type}>
                          {type.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {section === 'organisation' && (
                <div className="space-y-2">
                  <Label htmlFor="orgType">Organisation Type</Label>
                  <Select defaultValue={item.orgType || OrganisationType.FUNCTIONAL}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(OrganisationType).map(type => (
                        <SelectItem key={type} value={type}>
                          {type.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {section === 'information' && (
                <div className="space-y-2">
                  <Label htmlFor="infoType">Information Type</Label>
                  <Select defaultValue={item.infoType || InformationType.OPERATIONAL}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(InformationType).map(type => (
                        <SelectItem key={type} value={type}>
                          {type.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {section === 'managementSystems' && (
                <div className="space-y-2">
                  <Label htmlFor="systemType">System Type</Label>
                  <Select defaultValue={item.systemType || ManagementSystemType.ERP}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ManagementSystemType).map(type => (
                        <SelectItem key={type} value={type}>
                          {type.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                defaultValue={item.description || ''}
                placeholder={`Describe this ${sectionInfo.title.slice(0, -1).toLowerCase()}`}
                rows={3}
              />
            </div>

            {/* Additional fields based on section */}
            {section === 'suppliers' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    defaultValue={item.category || ''}
                    placeholder="e.g., Raw Materials"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="criticality">Criticality</Label>
                  <Select defaultValue={item.criticality || 'MEDIUM'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {section === 'locations' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    defaultValue={item.address || ''}
                    placeholder="Street address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    defaultValue={item.city || ''}
                    placeholder="City"
                  />
                </div>
              </div>
            )}

            {section === 'valueChains' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sequence">Sequence</Label>
                  <Input
                    id="sequence"
                    type="number"
                    defaultValue={item.sequence || 1}
                    placeholder="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="complexity">Complexity</Label>
                  <Select defaultValue={item.complexity || 'MODERATE'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SIMPLE">Simple</SelectItem>
                      <SelectItem value="MODERATE">Moderate</SelectItem>
                      <SelectItem value="COMPLEX">Complex</SelectItem>
                      <SelectItem value="VERY_COMPLEX">Very Complex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {section === 'organisation' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select defaultValue={item.level || 'OPERATIONAL'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EXECUTIVE">Executive</SelectItem>
                      <SelectItem value="SENIOR_MANAGEMENT">Senior Management</SelectItem>
                      <SelectItem value="MIDDLE_MANAGEMENT">Middle Management</SelectItem>
                      <SelectItem value="SUPERVISORY">Supervisory</SelectItem>
                      <SelectItem value="OPERATIONAL">Operational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeCount">Employee Count</Label>
                  <Input
                    id="employeeCount"
                    type="number"
                    defaultValue={item.employeeCount || ''}
                    placeholder="Number of employees"
                  />
                </div>
              </div>
            )}

            {section === 'information' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    defaultValue={item.category || ''}
                    placeholder="e.g., Financial Reports"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accessibility">Accessibility</Label>
                  <Select defaultValue={item.accessibility || 'INTERNAL'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PUBLIC">Public</SelectItem>
                      <SelectItem value="INTERNAL">Internal</SelectItem>
                      <SelectItem value="RESTRICTED">Restricted</SelectItem>
                      <SelectItem value="CONFIDENTIAL">Confidential</SelectItem>
                      <SelectItem value="CLASSIFIED">Classified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {section === 'managementSystems' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    defaultValue={item.category || ''}
                    placeholder="e.g., Core Systems"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendor</Label>
                  <Input
                    id="vendor"
                    defaultValue={item.vendor || ''}
                    placeholder="System vendor"
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setNewItem(null)
              setEditingItem(null)
            }}>
              Cancel
            </Button>
            <Button onClick={() => {
              // Get form data and save
              const name = (document.getElementById('name') as HTMLInputElement)?.value
              const description = (document.getElementById('description') as HTMLTextAreaElement)?.value
              
              if (!name) {
                toast({
                  title: "Validation Error",
                  description: "Name is required",
                  variant: "destructive",
                })
                return
              }

              const itemData: any = {
                name,
                description: description || undefined
              }

              // Add type-specific fields
              if (section === 'suppliers') {
                const supplierType = (document.querySelector('select[data-value]') as HTMLSelectElement)?.value || SupplierType.MATERIAL_SUPPLIER
                const category = (document.getElementById('category') as HTMLInputElement)?.value || ''
                const criticality = (document.querySelectorAll('select[data-value]')[1] as HTMLSelectElement)?.value || 'MEDIUM'
                itemData.supplierType = supplierType
                itemData.category = category
                itemData.criticality = criticality
              } else if (section === 'locations') {
                const locationType = (document.querySelector('select[data-value]') as HTMLSelectElement)?.value || LocationType.HEADQUARTERS
                const address = (document.getElementById('address') as HTMLInputElement)?.value || ''
                const city = (document.getElementById('city') as HTMLInputElement)?.value || ''
                itemData.locationType = locationType
                itemData.address = address
                itemData.city = city
                itemData.state = 'NSW' // Default for Australia
                itemData.postcode = '2000' // Default
                itemData.country = 'Australia' // Default
              } else if (section === 'valueChains') {
                const valueChainType = (document.querySelector('select[data-value]') as HTMLSelectElement)?.value || ValueChainType.PRIMARY
                const sequence = parseInt((document.getElementById('sequence') as HTMLInputElement)?.value || '1')
                const complexity = (document.querySelectorAll('select[data-value]')[1] as HTMLSelectElement)?.value || 'MODERATE'
                itemData.valueChainType = valueChainType
                itemData.sequence = sequence
                itemData.complexity = complexity
              } else if (section === 'organisation') {
                const orgType = (document.querySelector('select[data-value]') as HTMLSelectElement)?.value || OrganisationType.FUNCTIONAL
                const level = (document.querySelectorAll('select[data-value]')[1] as HTMLSelectElement)?.value || 'OPERATIONAL'
                const employeeCount = parseInt((document.getElementById('employeeCount') as HTMLInputElement)?.value || '0')
                itemData.orgType = orgType
                itemData.level = level
                itemData.employeeCount = employeeCount
              } else if (section === 'information') {
                const infoType = (document.querySelector('select[data-value]') as HTMLSelectElement)?.value || InformationType.OPERATIONAL
                const category = (document.getElementById('category') as HTMLInputElement)?.value || ''
                const accessibility = (document.querySelectorAll('select[data-value]')[1] as HTMLSelectElement)?.value || 'INTERNAL'
                itemData.infoType = infoType
                itemData.category = category
                itemData.accessibility = accessibility
              } else if (section === 'managementSystems') {
                const systemType = (document.querySelector('select[data-value]') as HTMLSelectElement)?.value || ManagementSystemType.ERP
                const category = (document.getElementById('category') as HTMLInputElement)?.value || ''
                const vendor = (document.getElementById('vendor') as HTMLInputElement)?.value || ''
                itemData.systemType = systemType
                itemData.category = category
                itemData.vendor = vendor
              }

              if (isEditing) {
                updateItem(section, item.id, itemData)
              } else {
                addItem(section, itemData)
              }
            }}>
              {isEditing ? 'Update' : 'Add'} {sectionInfo.title.slice(0, -1)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-bold mb-2">
            {operatingModel.name || 'Operating Model Canvas'}
          </h2>
          <p className="text-gray-600 text-lg">
            {operatingModel.description || 'Operational strategy design'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* BMC Selector */}
          <Select defaultValue={operatingModel.businessCanvasId || 'none'}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select BMC" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No BMC Selected</SelectItem>
              <SelectItem value="bmc1">Copper Operations BMC</SelectItem>
              <SelectItem value="bmc2">Gold Operations BMC</SelectItem>
              <SelectItem value="bmc3">Iron Ore Operations BMC</SelectItem>
            </SelectContent>
          </Select>
          
          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-lg p-1 bg-gray-50">
            <Button
              variant={viewMode === 'canvas' ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange?.('canvas')}
              className="px-3"
            >
              <Grid3X3 className="h-4 w-4 mr-1" />
              Canvas
            </Button>
            <Button
              variant={viewMode === 'list' ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange?.('list')}
              className="px-3"
            >
              <List className="h-4 w-4 mr-1" />
              List
            </Button>
          </div>
          
          {/* Edit Mode Toggle */}
          <div className="flex items-center border rounded-lg p-1 bg-gray-50">
            <Button
              variant={isEditing ? "default" : "ghost"}
              size="sm"
              onClick={() => onEditingChange?.(true)}
              className="px-3"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant={!isEditing ? "default" : "ghost"}
              size="sm"
              onClick={() => onEditingChange?.(false)}
              className="px-3"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </div>
          
          <Button variant="outline" className="px-6 bg-transparent" onClick={() => setSelectedTreeItem('tree')}>
            <Network className="h-4 w-4 mr-2" />
            Tree View
          </Button>
          <Button variant="outline" className="px-6 bg-transparent" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" className="px-6 bg-transparent" onClick={handleShare}>
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* BMC Context Strip */}
      {renderBMCContextStrip()}

      {/* Main Content */}
      {selectedTreeItem ? (
        selectedTreeItem === 'tree' ? (
          renderTreeView()
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTreeItem(null)}
              >
                ← Back to Canvas
              </Button>
              <h2 className="text-xl font-bold">Item Details</h2>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  Detailed view for: {selectedTreeItem}
                </p>
                {/* TODO: Implement detailed item view */}
              </CardContent>
            </Card>
          </div>
        )
      ) : (
        <>
          {/* Canvas Content - New Grid Layout */}
          {viewMode === 'canvas' ? (
            <div className="grid grid-cols-4 gap-4">
              {/* Row 1: Suppliers (1-2) and Locations (3-4) */}
              <div className="col-span-2">
                {renderCanvasSection('suppliers')}
              </div>
              <div className="col-span-2">
                {renderCanvasSection('locations')}
              </div>
              
              {/* Row 2: Value Chains (1-3) and Value Prop (4) */}
              <div className="col-span-3">
                {renderCanvasSection('valueChains')}
              </div>
              <div className="col-span-1">
                <Card className="border-purple-200 bg-purple-50 h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <Target className="h-5 w-5" />
                      <CardTitle className="text-lg font-semibold">Value Proposition</CardTitle>
                    </div>
                    <CardDescription className="text-sm opacity-80">
                      BL-specific value execution
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Value proposition from BMC context</p>
                      {bmcContext?.valuePropositions?.[0]?.description && (
                        <p className="mt-2 text-xs bg-white/50 p-2 rounded">
                          {bmcContext.valuePropositions[0].description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Row 3: Organisation (1-2) and Information (3-4) */}
              <div className="col-span-2">
                {renderCanvasSection('organisation')}
              </div>
              <div className="col-span-2">
                {renderCanvasSection('information')}
              </div>
              
              {/* Row 4: Management Systems (1-4) */}
              <div className="col-span-4">
                {renderCanvasSection('managementSystems')}
              </div>
            </div>
          ) : (
            renderListView()
          )}

          {/* Item Editing Dialog */}
          {renderItemDialog()}
        </>
      )}

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Operating Model</DialogTitle>
            <DialogDescription>
              Choose the format to export your operating model
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Export Format</Label>
              <Select value={exportFormat} onValueChange={(value: 'json' | 'pdf' | 'csv') => setExportFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleExportConfirm}>
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Operating Model</DialogTitle>
            <DialogDescription>
              Share your operating model with team members
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center py-6">
              <Share className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">
                Sharing functionality will be implemented in a future update.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 