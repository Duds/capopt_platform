/**
 * Enhanced Item Card Component for Business Model Canvas
 * 
 * Displays comprehensive information for BMC items including:
 * - Basic information (title, description, priority)
 * - Strategic context indicators
 * - Operational integration status
 * - Risk & control indicators
 * - Performance metrics visualization
 * - Australian compliance status
 * - Interactive elements for editing and viewing details
 */

'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { 
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Target,
  Zap,
  Shield,
  TrendingUp,
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Star,
  Activity,
  Users,
  DollarSign,
  Package,
  Handshake,
  Layers
} from 'lucide-react'
import { EnhancedCanvasItem, BusinessModel } from './types'

interface EnhancedItemCardProps {
  item: EnhancedCanvasItem
  section: keyof BusinessModel
  isEditing?: boolean
  onEdit?: (item: EnhancedCanvasItem) => void
  onDelete?: (itemId: string) => void
  onViewDetails?: (item: EnhancedCanvasItem) => void
}

const sectionIcons = {
  valuePropositions: Target,
  customerSegments: Users,
  channels: Zap,
  revenueStreams: DollarSign,
  resources: Package,
  activities: Activity,
  partnerships: Handshake,
  costStructures: Layers
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getPerformanceColor = (score: number) => {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

const getPerformanceIcon = (score: number) => {
  if (score >= 80) return <CheckCircle className="h-4 w-4 text-green-600" />
  if (score >= 60) return <AlertTriangle className="h-4 w-4 text-yellow-600" />
  return <XCircle className="h-4 w-4 text-red-600" />
}

export function EnhancedItemCard({
  item,
  section,
  isEditing = false,
  onEdit,
  onDelete,
  onViewDetails
}: EnhancedItemCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  
  const SectionIcon = sectionIcons[section] || Target

  const hasStrategicData = item.strategicObjective || item.competitiveAdvantage || item.uniqueSellingPoint
  const hasOperationalData = item.operationalDeliveryPoints?.length || item.processDependencies?.length || item.resourceRequirements?.length
  const hasRiskData = item.criticalControls?.length || item.riskMitigation || item.complianceRequirements?.length
  const hasPerformanceData = item.effectiveness || item.efficiency || item.satisfaction
  const hasComplianceData = item.whsRequirements?.length || item.isoStandards?.length || item.icmmGuidelines?.length

  const renderStrategicIndicator = () => {
    if (!hasStrategicData) return null
    
    return (
      <div className="flex items-center gap-1">
        <Target className="h-3 w-3 text-blue-600" />
        <span className="text-xs text-blue-600">Strategic</span>
      </div>
    )
  }

  const renderOperationalIndicator = () => {
    if (!hasOperationalData) return null
    
    return (
      <div className="flex items-center gap-1">
        <Zap className="h-3 w-3 text-green-600" />
        <span className="text-xs text-green-600">Operational</span>
      </div>
    )
  }

  const renderRiskIndicator = () => {
    if (!hasRiskData) return null
    
    return (
      <div className="flex items-center gap-1">
        <Shield className="h-3 w-3 text-orange-600" />
        <span className="text-xs text-orange-600">Risk & Control</span>
      </div>
    )
  }

  const renderPerformanceIndicator = () => {
    if (!hasPerformanceData) return null
    
    const avgScore = item.efficiency && item.satisfaction 
      ? Math.round((item.efficiency + item.satisfaction) / 2)
      : item.efficiency || item.satisfaction || 0
    
    return (
      <div className="flex items-center gap-1">
        <TrendingUp className="h-3 w-3 text-purple-600" />
        <span className={`text-xs ${getPerformanceColor(avgScore)}`}>
          {avgScore}%
        </span>
      </div>
    )
  }

  const renderComplianceIndicator = () => {
    if (!hasComplianceData) return null
    
    return (
      <div className="flex items-center gap-1">
        <Shield className="h-3 w-3 text-red-600" />
        <span className="text-xs text-red-600">Compliance</span>
      </div>
    )
  }

  const renderPerformanceMetrics = () => {
    if (!hasPerformanceData) return null

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span>Efficiency</span>
          <span className={getPerformanceColor(item.efficiency || 0)}>
            {item.efficiency || 0}%
          </span>
        </div>
        {item.efficiency !== undefined && (
          <Progress value={item.efficiency} className="h-1" />
        )}
        
        <div className="flex items-center justify-between text-xs">
          <span>Satisfaction</span>
          <span className={getPerformanceColor(item.satisfaction || 0)}>
            {item.satisfaction || 0}%
          </span>
        </div>
        {item.satisfaction !== undefined && (
          <Progress value={item.satisfaction} className="h-1" />
        )}
      </div>
    )
  }

  const renderArrayBadges = (items: string[] | undefined, label: string, maxItems = 3) => {
    if (!items || items.length === 0) return null

    const displayItems = items.slice(0, maxItems)
    const remainingCount = items.length - maxItems

    return (
      <div className="space-y-1">
        <span className="text-xs font-medium text-gray-600">{label}</span>
        <div className="flex flex-wrap gap-1">
          {displayItems.map((item, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {item}
            </Badge>
          ))}
          {remainingCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              +{remainingCount} more
            </Badge>
          )}
        </div>
      </div>
    )
  }

  const renderDetailedView = () => {
    if (!showDetails) return null

    return (
      <div className="mt-4 space-y-4 border-t pt-4">
        {/* Strategic Context */}
        {hasStrategicData && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              Strategic Context
            </h5>
            {item.strategicObjective && (
              <div>
                <span className="text-xs font-medium text-gray-600">Strategic Objective:</span>
                <p className="text-sm">{item.strategicObjective}</p>
              </div>
            )}
            {item.competitiveAdvantage && (
              <div>
                <span className="text-xs font-medium text-gray-600">Competitive Advantage:</span>
                <p className="text-sm">{item.competitiveAdvantage}</p>
              </div>
            )}
            {item.uniqueSellingPoint && (
              <div>
                <span className="text-xs font-medium text-gray-600">Unique Selling Point:</span>
                <p className="text-sm">{item.uniqueSellingPoint}</p>
              </div>
            )}
          </div>
        )}

        {/* Operational Integration */}
        {hasOperationalData && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-600" />
              Operational Integration
            </h5>
            {renderArrayBadges(item.operationalDeliveryPoints, 'Delivery Points')}
            {renderArrayBadges(item.processDependencies, 'Process Dependencies')}
            {renderArrayBadges(item.resourceRequirements, 'Resource Requirements')}
          </div>
        )}

        {/* Risk & Control */}
        {hasRiskData && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-orange-600" />
              Risk & Control
            </h5>
            {renderArrayBadges(item.criticalControls, 'Critical Controls')}
            {item.riskMitigation && (
              <div>
                <span className="text-xs font-medium text-gray-600">Risk Mitigation:</span>
                <p className="text-sm">{item.riskMitigation}</p>
              </div>
            )}
            {renderArrayBadges(item.complianceRequirements, 'Compliance Requirements')}
          </div>
        )}

        {/* Performance Metrics */}
        {hasPerformanceData && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              Performance Metrics
            </h5>
            {item.effectiveness && (
              <div>
                <span className="text-xs font-medium text-gray-600">Effectiveness:</span>
                <p className="text-sm">{item.effectiveness}</p>
              </div>
            )}
            {renderPerformanceMetrics()}
          </div>
        )}

        {/* Compliance Context */}
        {hasComplianceData && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-red-600" />
              Compliance & Regulatory
            </h5>
            {renderArrayBadges(item.whsRequirements, 'Safety Requirements')}
            {renderArrayBadges(item.isoStandards, 'Quality Standards')}
            {renderArrayBadges(item.icmmGuidelines, 'Industry Guidelines')}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className="bg-white border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <SectionIcon className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-medium leading-tight line-clamp-2">
                {item.title}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 mt-1 line-clamp-2">
                {item.description}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <Badge variant="secondary" className={getPriorityColor(item.priority || 'medium')}>
              {item.priority || 'medium'}
            </Badge>
            
            {isEditing && (
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => onEdit?.(item)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  onClick={() => onDelete?.(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Data Indicators */}
        <div className="flex flex-wrap gap-2 mt-2">
          {renderStrategicIndicator()}
          {renderOperationalIndicator()}
          {renderRiskIndicator()}
          {renderPerformanceIndicator()}
          {renderComplianceIndicator()}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Performance Metrics Summary */}
        {hasPerformanceData && (
          <div className="mb-3">
            {renderPerformanceMetrics()}
          </div>
        )}

        {/* View Details Toggle */}
        {(hasStrategicData || hasOperationalData || hasRiskData || hasPerformanceData || hasComplianceData) && (
          <Collapsible open={showDetails} onOpenChange={setShowDetails}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between text-xs text-gray-600 hover:text-gray-800"
              >
                <span>View Details</span>
                {showDetails ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {renderDetailedView()}
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  )
} 