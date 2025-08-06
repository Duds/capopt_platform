/**
 * Enhanced Item Dialog Component for Business Model Canvas
 * 
 * Provides comprehensive editing capabilities for all 9 BMC sections with:
 * - Section-specific form fields based on enhanced data requirements
 * - Strategic context fields (objectives, competitive advantage, USP)
 * - Operational integration fields (delivery points, dependencies, requirements)
 * - Risk & control fields (critical controls, risk mitigation, compliance)
 * - Performance metrics (effectiveness, efficiency, satisfaction)
 * - Australian business context (WHS, ISO, ICMM requirements)
 * - Validation and error handling
 * - Responsive design with proper form layout
 */

'use client'

import { useState, useEffect } from 'react'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { 
  Target,
  Zap,
  Shield,
  TrendingUp,
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Trash2
} from 'lucide-react'
import { 
  EnhancedCanvasItem, 
  EnhancedValueProposition,
  EnhancedCustomerSegment,
  EnhancedChannel,
  EnhancedRevenueStream,
  EnhancedResource,
  EnhancedActivity,
  EnhancedPartnership,
  EnhancedCostStructure,
  BusinessModel
} from './types'

interface EnhancedItemDialogProps {
  isOpen: boolean
  onClose: () => void
  section: keyof BusinessModel
  item?: EnhancedCanvasItem | null
  isNew?: boolean
  onSave: (section: keyof BusinessModel, item: EnhancedCanvasItem) => void
}

const sectionConfig = {
  valuePropositions: {
    title: 'Value Proposition',
    description: 'Products and services that create value for customers',
    icon: Target,
    fields: {
      strategic: ['targetCustomerSegment', 'customerPainPoints', 'solutionBenefits', 'uniqueSellingPoint'],
      operational: ['valueDeliveryPoints', 'measurableOutcomes', 'successCriteria', 'processDependencies'],
      risk: ['criticalControls', 'riskMitigation', 'complianceRequirements'],
      performance: ['valueEffectiveness', 'customerSatisfaction', 'marketPosition'],
      compliance: ['whsRequirements', 'isoStandards', 'icmmGuidelines']
    }
  },
  customerSegments: {
    title: 'Customer Segments',
    description: 'Groups of people or organizations you aim to reach and serve',
    icon: Target,
    fields: {
      strategic: ['geographicRegion', 'industrySector', 'companySize', 'customerNeeds'],
      operational: ['serviceDeliveryChannels', 'supportProcesses', 'relationshipManagement', 'operationalDeliveryPoints'],
      risk: ['customerRiskProfile', 'dataProtectionNeeds', 'complianceRequirements'],
      performance: ['revenuePotential', 'lifetimeValue', 'retentionRate'],
      compliance: ['whsRequirements', 'isoStandards', 'icmmGuidelines']
    }
  },
  channels: {
    title: 'Channels',
    description: 'How you communicate with and reach your customer segments',
    icon: Zap,
    fields: {
      strategic: ['channelType', 'reach', 'coverage', 'channelStrategy'],
      operational: ['deliveryMethod', 'serviceLevel', 'responseTime', 'operationalDeliveryPoints'],
      risk: ['channelRisks', 'qualityControls', 'complianceRequirements'],
      performance: ['channelEffectiveness', 'costEfficiency', 'profitability'],
      compliance: ['whsRequirements', 'isoStandards', 'icmmGuidelines']
    }
  },
  revenueStreams: {
    title: 'Revenue Streams',
    description: 'How you generate revenue from each customer segment',
    icon: TrendingUp,
    fields: {
      strategic: ['pricingStrategy', 'revenueModel', 'revenuePotential', 'competitiveAdvantage'],
      operational: ['revenueProcesses', 'billingSystems', 'collectionProcedures', 'operationalDeliveryPoints'],
      risk: ['revenueRisks', 'financialControls', 'complianceRequirements'],
      performance: ['revenueGrowth', 'profitMargin', 'cashFlow'],
      compliance: ['whsRequirements', 'isoStandards', 'icmmGuidelines']
    }
  },
  resources: {
    title: 'Key Resources',
    description: 'Most important assets required to make your business model work',
    icon: Shield,
    fields: {
      strategic: ['resourceCategory', 'criticality', 'uniqueness', 'strategicObjective'],
      operational: ['capacity', 'utilization', 'scalability', 'resourceRequirements'],
      risk: ['resourceRisks', 'protectionMeasures', 'backupPlans'],
      performance: ['reliability', 'efficiency', 'replacementCost'],
      compliance: ['whsRequirements', 'isoStandards', 'icmmGuidelines']
    }
  },
  activities: {
    title: 'Key Activities',
    description: 'Most important things you must do to make your business model work',
    icon: Zap,
    fields: {
      strategic: ['activityType', 'complexity', 'processSteps', 'strategicObjective'],
      operational: ['inputs', 'outputs', 'dependencies', 'processDependencies'],
      risk: ['activityRisks', 'safetyControls', 'qualityAssurance'],
      performance: ['cycleTime', 'quality', 'efficiency'],
      compliance: ['whsRequirements', 'isoStandards', 'icmmGuidelines']
    }
  },
  partnerships: {
    title: 'Key Partnerships',
    description: 'Network of suppliers and partners that make your business model work',
    icon: Target,
    fields: {
      strategic: ['partnershipModel', 'exclusivity', 'contractTerms', 'strategicObjective'],
      operational: ['serviceLevel', 'communication', 'costStructure', 'resourceRequirements'],
      risk: ['supplierRisks', 'complianceRequirements', 'contingencyPlans'],
      performance: ['supplierPerformance', 'relationshipStrength', 'valueDelivery'],
      compliance: ['whsRequirements', 'isoStandards', 'icmmGuidelines']
    }
  },
  costStructures: {
    title: 'Cost Structure',
    description: 'All costs incurred to operate your business model',
    icon: TrendingUp,
    fields: {
      strategic: ['costType', 'costDriver', 'allocationMethod', 'strategicObjective'],
      operational: ['budget', 'actual', 'variance', 'resourceRequirements'],
      risk: ['costRisks', 'budgetControls', 'approvalProcedures'],
      performance: ['trend', 'forecast', 'efficiency'],
      compliance: ['whsRequirements', 'isoStandards', 'icmmGuidelines']
    }
  }
}

export function EnhancedItemDialog({
  isOpen,
  onClose,
  section,
  item,
  isNew = false,
  onSave
}: EnhancedItemDialogProps) {
  const [formData, setFormData] = useState<any>({
    id: '',
    title: '',
    description: '',
    priority: 'medium',
    // Strategic Context
    strategicObjective: '',
    competitiveAdvantage: '',
    uniqueSellingPoint: '',
    // Value Proposition specific
    targetCustomerSegment: '',
    customerPainPoints: [],
    solutionBenefits: '',
    // Customer Segments specific
    geographicRegion: '',
    industrySector: '',
    companySize: '',
    customerNeeds: '',
    // Channels specific
    channelType: '',
    reach: '',
    coverage: '',
    channelStrategy: '',
    // Revenue Streams specific
    pricingStrategy: '',
    revenueModel: '',
    revenuePotential: '',
    // Resources specific
    resourceCategory: '',
    criticality: '',
    uniqueness: '',
    // Activities specific
    activityType: '',
    complexity: '',
    processSteps: '',
    // Partnerships specific
    partnershipModel: '',
    exclusivity: '',
    contractTerms: '',
    // Cost Structure specific
    costType: '',
    costDriver: '',
    allocationMethod: '',
    // Operational Integration
    operationalDeliveryPoints: [],
    processDependencies: [],
    resourceRequirements: [],
    valueDeliveryPoints: [],
    measurableOutcomes: '',
    successCriteria: '',
    serviceDeliveryChannels: [],
    supportProcesses: [],
    relationshipManagement: '',
    deliveryMethod: '',
    serviceLevel: '',
    responseTime: '',
    revenueProcesses: [],
    billingSystems: [],
    collectionProcedures: [],
    capacity: '',
    utilization: '',
    scalability: '',
    inputs: '',
    outputs: '',
    dependencies: [],
    communication: '',
    costStructure: '',
    budget: '',
    actual: '',
    variance: '',
    // Risk & Control
    criticalControls: [],
    riskMitigation: '',
    complianceRequirements: [],
    customerRiskProfile: '',
    dataProtectionNeeds: [],
    channelRisks: [],
    qualityControls: [],
    revenueRisks: [],
    financialControls: [],
    resourceRisks: [],
    protectionMeasures: [],
    backupPlans: [],
    activityRisks: [],
    safetyControls: [],
    qualityAssurance: '',
    supplierRisks: [],
    contingencyPlans: [],
    costRisks: [],
    budgetControls: [],
    approvalProcedures: [],
    // Performance Metrics
    effectiveness: '',
    efficiency: 0,
    satisfaction: 0,
    valueEffectiveness: '',
    customerSatisfaction: 0,
    marketPosition: '',
    revenuePotential: '',
    lifetimeValue: '',
    retentionRate: 0,
    channelEffectiveness: '',
    costEfficiency: '',
    profitability: '',
    revenueGrowth: '',
    profitMargin: 0,
    cashFlow: '',
    reliability: '',
    replacementCost: '',
    cycleTime: '',
    quality: '',
    supplierPerformance: '',
    relationshipStrength: '',
    valueDelivery: '',
    trend: '',
    forecast: '',
    // Compliance
    whsRequirements: [],
    isoStandards: [],
    icmmGuidelines: []
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [arrayFieldInputs, setArrayFieldInputs] = useState<Record<string, string>>({})
  const { toast } = useToast()

  useEffect(() => {
    if (item) {
      setFormData({
        id: item.id,
        title: item.title || '',
        description: item.description || '',
        priority: item.priority || 'medium',
        // Strategic Context
        strategicObjective: item.strategicObjective || '',
        competitiveAdvantage: item.competitiveAdvantage || '',
        uniqueSellingPoint: item.uniqueSellingPoint || '',
        // Value Proposition specific
        targetCustomerSegment: (item as any).targetCustomerSegment || '',
        customerPainPoints: (item as any).customerPainPoints || [],
        solutionBenefits: (item as any).solutionBenefits || '',
        // Customer Segments specific
        geographicRegion: (item as any).geographicRegion || '',
        industrySector: (item as any).industrySector || '',
        companySize: (item as any).companySize || '',
        customerNeeds: (item as any).customerNeeds || '',
        // Channels specific
        channelType: (item as any).channelType || '',
        reach: (item as any).reach || '',
        coverage: (item as any).coverage || '',
        channelStrategy: (item as any).channelStrategy || '',
        // Revenue Streams specific
        pricingStrategy: (item as any).pricingStrategy || '',
        revenueModel: (item as any).revenueModel || '',
        revenuePotential: (item as any).revenuePotential || '',
        // Resources specific
        resourceCategory: (item as any).resourceCategory || '',
        criticality: (item as any).criticality || '',
        uniqueness: (item as any).uniqueness || '',
        // Activities specific
        activityType: (item as any).activityType || '',
        complexity: (item as any).complexity || '',
        processSteps: (item as any).processSteps || '',
        // Partnerships specific
        partnershipModel: (item as any).partnershipModel || '',
        exclusivity: (item as any).exclusivity || '',
        contractTerms: (item as any).contractTerms || '',
        // Cost Structure specific
        costType: (item as any).costType || '',
        costDriver: (item as any).costDriver || '',
        allocationMethod: (item as any).allocationMethod || '',
        // Operational Integration
        operationalDeliveryPoints: item.operationalDeliveryPoints || [],
        processDependencies: item.processDependencies || [],
        resourceRequirements: item.resourceRequirements || [],
        valueDeliveryPoints: (item as any).valueDeliveryPoints || [],
        measurableOutcomes: (item as any).measurableOutcomes || '',
        successCriteria: (item as any).successCriteria || '',
        serviceDeliveryChannels: (item as any).serviceDeliveryChannels || [],
        supportProcesses: (item as any).supportProcesses || [],
        relationshipManagement: (item as any).relationshipManagement || '',
        deliveryMethod: (item as any).deliveryMethod || '',
        serviceLevel: (item as any).serviceLevel || '',
        responseTime: (item as any).responseTime || '',
        revenueProcesses: (item as any).revenueProcesses || [],
        billingSystems: (item as any).billingSystems || [],
        collectionProcedures: (item as any).collectionProcedures || [],
        capacity: (item as any).capacity || '',
        utilization: (item as any).utilization || '',
        scalability: (item as any).scalability || '',
        inputs: (item as any).inputs || '',
        outputs: (item as any).outputs || '',
        dependencies: (item as any).dependencies || [],
        communication: (item as any).communication || '',
        costStructure: (item as any).costStructure || '',
        budget: (item as any).budget || '',
        actual: (item as any).actual || '',
        variance: (item as any).variance || '',
        // Risk & Control
        criticalControls: item.criticalControls || [],
        riskMitigation: item.riskMitigation || '',
        complianceRequirements: item.complianceRequirements || [],
        customerRiskProfile: (item as any).customerRiskProfile || '',
        dataProtectionNeeds: (item as any).dataProtectionNeeds || [],
        channelRisks: (item as any).channelRisks || [],
        qualityControls: (item as any).qualityControls || [],
        revenueRisks: (item as any).revenueRisks || [],
        financialControls: (item as any).financialControls || [],
        resourceRisks: (item as any).resourceRisks || [],
        protectionMeasures: (item as any).protectionMeasures || [],
        backupPlans: (item as any).backupPlans || [],
        activityRisks: (item as any).activityRisks || [],
        safetyControls: (item as any).safetyControls || [],
        qualityAssurance: (item as any).qualityAssurance || '',
        supplierRisks: (item as any).supplierRisks || [],
        contingencyPlans: (item as any).contingencyPlans || [],
        costRisks: (item as any).costRisks || [],
        budgetControls: (item as any).budgetControls || [],
        approvalProcedures: (item as any).approvalProcedures || [],
        // Performance Metrics
        effectiveness: item.effectiveness || '',
        efficiency: item.efficiency || 0,
        satisfaction: item.satisfaction || 0,
        valueEffectiveness: (item as any).valueEffectiveness || '',
        customerSatisfaction: (item as any).customerSatisfaction || 0,
        marketPosition: (item as any).marketPosition || '',
        revenuePotential: (item as any).revenuePotential || '',
        lifetimeValue: (item as any).lifetimeValue || '',
        retentionRate: (item as any).retentionRate || 0,
        channelEffectiveness: (item as any).channelEffectiveness || '',
        costEfficiency: (item as any).costEfficiency || '',
        profitability: (item as any).profitability || '',
        revenueGrowth: (item as any).revenueGrowth || '',
        profitMargin: (item as any).profitMargin || 0,
        cashFlow: (item as any).cashFlow || '',
        reliability: (item as any).reliability || '',
        replacementCost: (item as any).replacementCost || '',
        cycleTime: (item as any).cycleTime || '',
        quality: (item as any).quality || '',
        supplierPerformance: (item as any).supplierPerformance || '',
        relationshipStrength: (item as any).relationshipStrength || '',
        valueDelivery: (item as any).valueDelivery || '',
        trend: (item as any).trend || '',
        forecast: (item as any).forecast || '',
        // Compliance
        whsRequirements: item.whsRequirements || [],
        isoStandards: item.isoStandards || [],
        icmmGuidelines: item.icmmGuidelines || []
      })
    } else {
      setFormData({
        id: '',
        title: '',
        description: '',
        priority: 'medium',
        // Strategic Context
        strategicObjective: '',
        competitiveAdvantage: '',
        uniqueSellingPoint: '',
        // Value Proposition specific
        targetCustomerSegment: '',
        customerPainPoints: [],
        solutionBenefits: '',
        // Customer Segments specific
        geographicRegion: '',
        industrySector: '',
        companySize: '',
        customerNeeds: '',
        // Channels specific
        channelType: '',
        reach: '',
        coverage: '',
        channelStrategy: '',
        // Revenue Streams specific
        pricingStrategy: '',
        revenueModel: '',
        revenuePotential: '',
        // Resources specific
        resourceCategory: '',
        criticality: '',
        uniqueness: '',
        // Activities specific
        activityType: '',
        complexity: '',
        processSteps: '',
        // Partnerships specific
        partnershipModel: '',
        exclusivity: '',
        contractTerms: '',
        // Cost Structure specific
        costType: '',
        costDriver: '',
        allocationMethod: '',
        // Operational Integration
        operationalDeliveryPoints: [],
        processDependencies: [],
        resourceRequirements: [],
        valueDeliveryPoints: [],
        measurableOutcomes: '',
        successCriteria: '',
        serviceDeliveryChannels: [],
        supportProcesses: [],
        relationshipManagement: '',
        deliveryMethod: '',
        serviceLevel: '',
        responseTime: '',
        revenueProcesses: [],
        billingSystems: [],
        collectionProcedures: [],
        capacity: '',
        utilization: '',
        scalability: '',
        inputs: '',
        outputs: '',
        dependencies: [],
        communication: '',
        costStructure: '',
        budget: '',
        actual: '',
        variance: '',
        // Risk & Control
        criticalControls: [],
        riskMitigation: '',
        complianceRequirements: [],
        customerRiskProfile: '',
        dataProtectionNeeds: [],
        channelRisks: [],
        qualityControls: [],
        revenueRisks: [],
        financialControls: [],
        resourceRisks: [],
        protectionMeasures: [],
        backupPlans: [],
        activityRisks: [],
        safetyControls: [],
        qualityAssurance: '',
        supplierRisks: [],
        contingencyPlans: [],
        costRisks: [],
        budgetControls: [],
        approvalProcedures: [],
        // Performance Metrics
        effectiveness: '',
        efficiency: 0,
        satisfaction: 0,
        valueEffectiveness: '',
        customerSatisfaction: 0,
        marketPosition: '',
        revenuePotential: '',
        lifetimeValue: '',
        retentionRate: 0,
        channelEffectiveness: '',
        costEfficiency: '',
        profitability: '',
        revenueGrowth: '',
        profitMargin: 0,
        cashFlow: '',
        reliability: '',
        replacementCost: '',
        cycleTime: '',
        quality: '',
        supplierPerformance: '',
        relationshipStrength: '',
        valueDelivery: '',
        trend: '',
        forecast: '',
        // Compliance
        whsRequirements: [],
        isoStandards: [],
        icmmGuidelines: []
      })
    }
    setErrors({})
    setArrayFieldInputs({})
  }, [item, isOpen])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (formData.efficiency < 0 || formData.efficiency > 100) {
      newErrors.efficiency = 'Efficiency must be between 0 and 100'
    }

    if (formData.satisfaction < 0 || formData.satisfaction > 100) {
      newErrors.satisfaction = 'Satisfaction must be between 0 and 100'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before saving",
        variant: "destructive"
      })
      return
    }

    try {
      onSave(section, formData)
      toast({
        title: "Success",
        description: `${isNew ? 'Added' : 'Updated'} ${sectionConfig[section]?.title} successfully`,
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isNew ? 'add' : 'update'} ${sectionConfig[section]?.title}`,
        variant: "destructive"
      })
    }
  }

  const handleArrayFieldChange = (field: string, value: string, action: 'add' | 'remove' | 'set') => {
    const currentArray = formData[field as keyof EnhancedCanvasItem] as string[] || []
    let newArray: string[]

    switch (action) {
      case 'add':
        if (value.trim() && !currentArray.includes(value.trim())) {
          newArray = [...currentArray, value.trim()]
        } else {
          return
        }
        break
      case 'remove':
        newArray = currentArray.filter(item => item !== value)
        break
      case 'set':
        newArray = value.split(',').map(item => item.trim()).filter(item => item)
        break
      default:
        return
    }

    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }))
  }

  const renderArrayField = (field: string, label: string, placeholder: string) => {
    const values = formData[field as keyof EnhancedCanvasItem] as string[] || []
    const inputValue = arrayFieldInputs[field] || ''

    const handleInputChange = (value: string) => {
      setArrayFieldInputs(prev => ({ ...prev, [field]: value }))
    }

    const handleAdd = () => {
      if (inputValue.trim()) {
        handleArrayFieldChange(field, inputValue, 'add')
        setArrayFieldInputs(prev => ({ ...prev, [field]: '' }))
      }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleAdd()
      }
    }

    return (
      <div className="space-y-2">
        <Label htmlFor={field}>{label}</Label>
        <div className="flex gap-2">
          <Input
            id={field}
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {values.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {values.map((value, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {value}
                <button
                  type="button"
                  onClick={() => handleArrayFieldChange(field, value, 'remove')}
                  className="ml-1 hover:text-destructive"
                >
                  <XCircle className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderStrategicFields = () => {
    const fields = sectionConfig[section]?.fields?.strategic || []
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Strategic Context
          </CardTitle>
          <CardDescription>
            Define the strategic objectives and competitive positioning for {sectionConfig[section]?.title}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.includes('targetCustomerSegment') && (
            <div>
              <Label htmlFor="targetCustomerSegment">Target Customer Segment</Label>
              <Input
                id="targetCustomerSegment"
                placeholder="Who is the target customer segment?"
                value={formData.targetCustomerSegment || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, targetCustomerSegment: e.target.value }))}
              />
            </div>
          )}
          {fields.includes('customerPainPoints') && (
            renderArrayField('customerPainPoints', 'Customer Pain Points', 'Add pain point...')
          )}
          {fields.includes('solutionBenefits') && (
            renderArrayField('solutionBenefits', 'Solution Benefits', 'Add benefit...')
          )}
          {fields.includes('geographicRegion') && (
            <div>
              <Label htmlFor="geographicRegion">Geographic Region</Label>
              <Input
                id="geographicRegion"
                placeholder="What geographic region?"
                value={formData.geographicRegion || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, geographicRegion: e.target.value }))}
              />
            </div>
          )}
          {fields.includes('industrySector') && (
            <div>
              <Label htmlFor="industrySector">Industry Sector</Label>
              <Input
                id="industrySector"
                placeholder="What industry sector?"
                value={formData.industrySector || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, industrySector: e.target.value }))}
              />
            </div>
          )}
          {fields.includes('companySize') && (
            <div>
              <Label htmlFor="companySize">Company Size</Label>
              <Select
                value={formData.companySize || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, companySize: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="startup">Startup</SelectItem>
                  <SelectItem value="small">Small (1-50)</SelectItem>
                  <SelectItem value="medium">Medium (51-500)</SelectItem>
                  <SelectItem value="large">Large (500+)</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {fields.includes('channelType') && (
            <div>
              <Label htmlFor="channelType">Channel Type</Label>
              <Select
                value={formData.channelType || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, channelType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select channel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="direct">Direct</SelectItem>
                  <SelectItem value="indirect">Indirect</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {fields.includes('reach') && (
            <div>
              <Label htmlFor="reach">Reach</Label>
              <Input
                id="reach"
                placeholder="What is the reach of this channel?"
                value={formData.reach || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, reach: e.target.value }))}
              />
            </div>
          )}
          {fields.includes('coverage') && (
            <div>
              <Label htmlFor="coverage">Coverage</Label>
              <Input
                id="coverage"
                placeholder="What is the coverage area?"
                value={formData.coverage || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, coverage: e.target.value }))}
              />
            </div>
          )}
          {fields.includes('pricingStrategy') && (
            <div>
              <Label htmlFor="pricingStrategy">Pricing Strategy</Label>
              <Select
                value={formData.pricingStrategy || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, pricingStrategy: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pricing strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cost_plus">Cost Plus</SelectItem>
                  <SelectItem value="value_based">Value Based</SelectItem>
                  <SelectItem value="competitive">Competitive</SelectItem>
                  <SelectItem value="freemium">Freemium</SelectItem>
                  <SelectItem value="subscription">Subscription</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {fields.includes('revenueModel') && (
            <div>
              <Label htmlFor="revenueModel">Revenue Model</Label>
              <Select
                value={formData.revenueModel || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, revenueModel: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select revenue model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subscription">Subscription</SelectItem>
                  <SelectItem value="transaction">Transaction</SelectItem>
                  <SelectItem value="licensing">Licensing</SelectItem>
                  <SelectItem value="advertising">Advertising</SelectItem>
                  <SelectItem value="marketplace">Marketplace</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {fields.includes('revenuePotential') && (
            <div>
              <Label htmlFor="revenuePotential">Revenue Potential ($)</Label>
              <Input
                id="revenuePotential"
                type="number"
                placeholder="0"
                value={formData.revenuePotential || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, revenuePotential: Number(e.target.value) }))}
              />
            </div>
          )}
          {fields.includes('resourceCategory') && (
            <div>
              <Label htmlFor="resourceCategory">Resource Category</Label>
              <Select
                value={formData.resourceCategory || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, resourceCategory: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select resource category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physical">Physical</SelectItem>
                  <SelectItem value="intellectual">Intellectual</SelectItem>
                  <SelectItem value="human">Human</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {fields.includes('criticality') && (
            <div>
              <Label htmlFor="criticality">Criticality</Label>
              <Select
                value={formData.criticality || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, criticality: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select criticality level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {fields.includes('uniqueness') && (
            <div>
              <Label htmlFor="uniqueness">Uniqueness</Label>
              <Select
                value={formData.uniqueness || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, uniqueness: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select uniqueness level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="common">Common</SelectItem>
                  <SelectItem value="rare">Rare</SelectItem>
                  <SelectItem value="unique">Unique</SelectItem>
                  <SelectItem value="proprietary">Proprietary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {fields.includes('activityType') && (
            <div>
              <Label htmlFor="activityType">Activity Type</Label>
              <Select
                value={formData.activityType || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, activityType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="problem_solving">Problem Solving</SelectItem>
                  <SelectItem value="platform">Platform</SelectItem>
                  <SelectItem value="network">Network</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {fields.includes('complexity') && (
            <div>
              <Label htmlFor="complexity">Complexity</Label>
              <Select
                value={formData.complexity || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, complexity: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select complexity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="complex">Complex</SelectItem>
                  <SelectItem value="very_complex">Very Complex</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {fields.includes('partnershipModel') && (
            <div>
              <Label htmlFor="partnershipModel">Partnership Model</Label>
              <Select
                value={formData.partnershipModel || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, partnershipModel: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select partnership model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strategic">Strategic</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="competitive">Competitive</SelectItem>
                  <SelectItem value="joint_venture">Joint Venture</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {fields.includes('exclusivity') && (
            <div>
              <Label htmlFor="exclusivity">Exclusivity</Label>
              <Select
                value={formData.exclusivity || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, exclusivity: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select exclusivity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="exclusive">Exclusive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {fields.includes('contractTerms') && (
            <div>
              <Label htmlFor="contractTerms">Contract Terms</Label>
              <Textarea
                id="contractTerms"
                placeholder="Describe the contract terms..."
                value={formData.contractTerms || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, contractTerms: e.target.value }))}
              />
            </div>
          )}
          {fields.includes('costType') && (
            <div>
              <Label htmlFor="costType">Cost Type</Label>
              <Select
                value={formData.costType || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, costType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cost type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="variable">Variable</SelectItem>
                  <SelectItem value="semi_variable">Semi-Variable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {fields.includes('costDriver') && (
            <div>
              <Label htmlFor="costDriver">Cost Driver</Label>
              <Input
                id="costDriver"
                placeholder="What drives this cost?"
                value={formData.costDriver || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, costDriver: e.target.value }))}
              />
            </div>
          )}
          {fields.includes('allocationMethod') && (
            <div>
              <Label htmlFor="allocationMethod">Allocation Method</Label>
              <Select
                value={formData.allocationMethod || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, allocationMethod: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select allocation method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="direct">Direct</SelectItem>
                  <SelectItem value="activity_based">Activity Based</SelectItem>
                  <SelectItem value="volume_based">Volume Based</SelectItem>
                  <SelectItem value="time_based">Time Based</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {fields.includes('customerNeeds') && (
            <div>
              <Label htmlFor="customerNeeds">Customer Needs</Label>
              <Textarea
                id="customerNeeds"
                placeholder="Describe the specific customer needs..."
                value={formData.customerNeeds || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, customerNeeds: e.target.value }))}
              />
            </div>
          )}
          {fields.includes('channelStrategy') && (
            <div>
              <Label htmlFor="channelStrategy">Channel Strategy</Label>
              <Textarea
                id="channelStrategy"
                placeholder="Describe the channel strategy..."
                value={formData.channelStrategy || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, channelStrategy: e.target.value }))}
              />
            </div>
          )}
          {fields.includes('strategicObjective') && (
            <div>
              <Label htmlFor="strategicObjective">Strategic Objective</Label>
              <Textarea
                id="strategicObjective"
                placeholder="Describe the strategic objective..."
                value={formData.strategicObjective || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, strategicObjective: e.target.value }))}
              />
            </div>
          )}
          {fields.includes('competitiveAdvantage') && (
            <div>
              <Label htmlFor="competitiveAdvantage">Competitive Advantage</Label>
              <Textarea
                id="competitiveAdvantage"
                placeholder="Describe the competitive advantage..."
                value={formData.competitiveAdvantage || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, competitiveAdvantage: e.target.value }))}
              />
            </div>
          )}
          {fields.includes('uniqueSellingPoint') && (
            <div>
              <Label htmlFor="uniqueSellingPoint">Unique Selling Point</Label>
              <Textarea
                id="uniqueSellingPoint"
                placeholder="Describe the unique selling point..."
                value={formData.uniqueSellingPoint || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, uniqueSellingPoint: e.target.value }))}
              />
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const renderOperationalFields = () => {
    const fields = sectionConfig[section]?.fields?.operational || []
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Operational Integration
          </CardTitle>
          <CardDescription>
            Define operational delivery points, dependencies, and requirements for {sectionConfig[section]?.title}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.includes('operationalDeliveryPoints') && 
            renderArrayField('operationalDeliveryPoints', 'Operational Delivery Points', 'Add delivery point...')
          }
          {fields.includes('processDependencies') && 
            renderArrayField('processDependencies', 'Process Dependencies', 'Add dependency...')
          }
          {fields.includes('resourceRequirements') && 
            renderArrayField('resourceRequirements', 'Resource Requirements', 'Add requirement...')
          }
          {fields.includes('valueDeliveryPoints') && 
            renderArrayField('valueDeliveryPoints', 'Value Delivery Points', 'Add delivery point...')
          }
          {fields.includes('measurableOutcomes') && (
            <div>
              <Label htmlFor="measurableOutcomes">Measurable Outcomes</Label>
              <Textarea
                id="measurableOutcomes"
                placeholder="Describe measurable outcomes..."
                value={formData.measurableOutcomes || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, measurableOutcomes: e.target.value }))}
              />
            </div>
          )}
          {fields.includes('successCriteria') && (
            <div>
              <Label htmlFor="successCriteria">Success Criteria</Label>
              <Textarea
                id="successCriteria"
                placeholder="Define success criteria..."
                value={formData.successCriteria || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, successCriteria: e.target.value }))}
              />
            </div>
          )}
          {fields.includes('serviceDeliveryChannels') && 
            renderArrayField('serviceDeliveryChannels', 'Service Delivery Channels', 'Add channel...')
          }
          {fields.includes('supportProcesses') && 
            renderArrayField('supportProcesses', 'Support Processes', 'Add process...')
          }
          {fields.includes('relationshipManagement') && (
            <div>
              <Label htmlFor="relationshipManagement">Relationship Management</Label>
              <Textarea
                id="relationshipManagement"
                placeholder="Describe relationship management approach..."
                value={formData.relationshipManagement || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, relationshipManagement: e.target.value }))}
              />
            </div>
          )}
          {fields.includes('deliveryMethod') && (
            <div>
              <Label htmlFor="deliveryMethod">Delivery Method</Label>
              <Select
                value={formData.deliveryMethod || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, deliveryMethod: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select delivery method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="direct">Direct</SelectItem>
                  <SelectItem value="indirect">Indirect</SelectItem>
                  <SelectItem value="digital">Digital</SelectItem>
                  <SelectItem value="physical">Physical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {fields.includes('serviceLevel') && (
            <div>
              <Label htmlFor="serviceLevel">Service Level</Label>
              <Select
                value={formData.serviceLevel || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, serviceLevel: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {fields.includes('responseTime') && (
            <div>
              <Label htmlFor="responseTime">Response Time</Label>
              <Input
                id="responseTime"
                placeholder="e.g., 24 hours, 1 hour, immediate"
                value={formData.responseTime || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, responseTime: e.target.value }))}
              />
            </div>
          )}
          {fields.includes('revenueProcesses') && 
            renderArrayField('revenueProcesses', 'Revenue Processes', 'Add process...')
          }
          {fields.includes('billingSystems') && 
            renderArrayField('billingSystems', 'Billing Systems', 'Add system...')
          }
          {fields.includes('collectionProcedures') && 
            renderArrayField('collectionProcedures', 'Collection Procedures', 'Add procedure...')
          }
          {fields.includes('capacity') && (
            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                placeholder="e.g., 1000 units/day, 24/7, scalable"
                value={formData.capacity || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
              />
            </div>
          )}
          {fields.includes('utilization') && (
            <div>
              <Label htmlFor="utilization">Utilization Rate (%)</Label>
              <Input
                id="utilization"
                type="number"
                min="0"
                max="100"
                placeholder="0-100"
                value={formData.utilization || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, utilization: Number(e.target.value) }))}
              />
            </div>
          )}
          {fields.includes('scalability') && (
            <div>
              <Label htmlFor="scalability">Scalability</Label>
              <Select
                value={formData.scalability || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, scalability: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select scalability level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {fields.includes('inputs') && (
            <div>
              <Label htmlFor="inputs">Inputs</Label>
              <Textarea
                id="inputs"
                placeholder="Describe required inputs..."
                value={formData.inputs || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, inputs: e.target.value }))}
              />
            </div>
          )}
          {fields.includes('outputs') && (
            <div>
              <Label htmlFor="outputs">Outputs</Label>
              <Textarea
                id="outputs"
                placeholder="Describe expected outputs..."
                value={formData.outputs || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, outputs: e.target.value }))}
              />
            </div>
          )}
          {fields.includes('dependencies') && 
            renderArrayField('dependencies', 'Dependencies', 'Add dependency...')
          }
          {fields.includes('communication') && (
            <div>
              <Label htmlFor="communication">Communication</Label>
              <Textarea
                id="communication"
                placeholder="Describe communication protocols..."
                value={formData.communication || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, communication: e.target.value }))}
              />
            </div>
          )}
          {fields.includes('costStructure') && (
            <div>
              <Label htmlFor="costStructure">Cost Structure</Label>
              <Textarea
                id="costStructure"
                placeholder="Describe cost structure..."
                value={formData.costStructure || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, costStructure: e.target.value }))}
              />
            </div>
          )}
          {fields.includes('budget') && (
            <div>
              <Label htmlFor="budget">Budget ($)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="0"
                value={formData.budget || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: Number(e.target.value) }))}
              />
            </div>
          )}
          {fields.includes('actual') && (
            <div>
              <Label htmlFor="actual">Actual Cost ($)</Label>
              <Input
                id="actual"
                type="number"
                placeholder="0"
                value={formData.actual || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, actual: Number(e.target.value) }))}
              />
            </div>
          )}
          {fields.includes('variance') && (
            <div>
              <Label htmlFor="variance">Variance ($)</Label>
              <Input
                id="variance"
                type="number"
                placeholder="0"
                value={formData.variance || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, variance: Number(e.target.value) }))}
              />
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const renderRiskFields = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Risk & Control
        </CardTitle>
        <CardDescription>
          Define critical controls, risk mitigation, and compliance requirements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderArrayField('criticalControls', 'Critical Controls', 'Add critical control...')}
        <div>
          <Label htmlFor="riskMitigation">Risk Mitigation Strategy</Label>
          <Textarea
            id="riskMitigation"
            placeholder="How are risks mitigated for this component?"
            value={formData.riskMitigation}
            onChange={(e) => setFormData(prev => ({ ...prev, riskMitigation: e.target.value }))}
          />
        </div>
        {renderArrayField('complianceRequirements', 'Compliance Requirements', 'Add requirement...')}
      </CardContent>
    </Card>
  )

  const renderPerformanceFields = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Performance Metrics
        </CardTitle>
        <CardDescription>
          Define effectiveness, efficiency, and satisfaction metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="effectiveness">Effectiveness</Label>
          <Textarea
            id="effectiveness"
            placeholder="How is effectiveness measured?"
            value={formData.effectiveness}
            onChange={(e) => setFormData(prev => ({ ...prev, effectiveness: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="efficiency">Efficiency Score (%)</Label>
          <Input
            id="efficiency"
            type="number"
            min="0"
            max="100"
            placeholder="0-100"
            value={formData.efficiency}
            onChange={(e) => setFormData(prev => ({ ...prev, efficiency: Number(e.target.value) }))}
          />
          {errors.efficiency && <p className="text-sm text-destructive">{errors.efficiency}</p>}
        </div>
        <div>
          <Label htmlFor="satisfaction">Satisfaction Score (%)</Label>
          <Input
            id="satisfaction"
            type="number"
            min="0"
            max="100"
            placeholder="0-100"
            value={formData.satisfaction}
            onChange={(e) => setFormData(prev => ({ ...prev, satisfaction: Number(e.target.value) }))}
          />
          {errors.satisfaction && <p className="text-sm text-destructive">{errors.satisfaction}</p>}
        </div>
      </CardContent>
    </Card>
  )

  const renderComplianceFields = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Compliance & Regulatory
        </CardTitle>
        <CardDescription>
          Define safety, quality, and industry-specific compliance requirements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderArrayField('whsRequirements', 'Safety Requirements', 'Add safety requirement...')}
        {renderArrayField('isoStandards', 'Quality Standards', 'Add quality standard...')}
        {renderArrayField('icmmGuidelines', 'Industry Guidelines', 'Add industry guideline...')}
      </CardContent>
    </Card>
  )

  const renderBasicFields = () => (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Core information about this business model component
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            placeholder="Enter title..."
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          />
          {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
        </div>
        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            placeholder="Enter description..."
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
          {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
        </div>
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as 'high' | 'medium' | 'low' }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isNew ? 'Add New' : 'Edit'} {sectionConfig[section]?.title}
          </DialogTitle>
          <DialogDescription>
            {sectionConfig[section]?.description}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="strategic">Strategic</TabsTrigger>
            <TabsTrigger value="operational">Operational</TabsTrigger>
            <TabsTrigger value="risk">Risk & Control</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            {renderBasicFields()}
          </TabsContent>

          <TabsContent value="strategic" className="space-y-4">
            {renderStrategicFields()}
          </TabsContent>

          <TabsContent value="operational" className="space-y-4">
            {renderOperationalFields()}
          </TabsContent>

          <TabsContent value="risk" className="space-y-4">
            {renderRiskFields()}
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            {renderPerformanceFields()}
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            {renderComplianceFields()}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {isNew ? 'Add' : 'Save'} {sectionConfig[section]?.title}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 