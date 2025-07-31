'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useIndustries, type Industry } from '@/hooks/use-industries'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LocationInput } from '@/components/ui/location-input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { SectorMultiSelect } from './sector-multi-select'
import { 
  ChevronLeft, 
  ChevronRight, 
  Building, 
  MapPin, 
  Target, 
  DollarSign, 
  Users, 
  Shield, 
  Zap, 
  FileText, 
  Save,
  Plus
} from 'lucide-react'
import { SectorSelection } from '@/lib/sector-framework'

interface BusinessInformation {
  // Basic Business Information
  name: string
  legalName: string
  abn: string
  acn: string
  businessType: 'CORPORATION' | 'PARTNERSHIP' | 'SOLE_TRADER' | 'TRUST' | 'JOINT_VENTURE' | 'SUBSIDIARY'
  industry: string
  sector: string
  sectors: SectorSelection[] // Multi-sector support
  
  // Geographic & Regional
  regional: 'METROPOLITAN' | 'REGIONAL' | 'REMOTE' | 'RURAL' | 'COASTAL' | 'INLAND'
  primaryLocation: string
  coordinates: string
  
  // Facility & Operations
  facilityType: 'MINE' | 'PROCESSING_PLANT' | 'REFINERY' | 'SMELTER' | 'WAREHOUSE' | 'OFFICE' | 'LABORATORY' | 'WORKSHOP' | 'POWER_STATION' | 'WATER_TREATMENT' | 'WASTE_MANAGEMENT'
  operationalStreams: string[]
  
  // Strategic & Financial
  strategicObjective: string
  valueProposition: string
  competitiveAdvantage: string
  annualRevenue: number
  employeeCount: number
  
  // Risk & Compliance
  riskProfile: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  digitalMaturity: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'LEADING'
  complianceRequirements: string[]
  regulatoryFramework: string[]
  
  // Relationships
  parentCanvasId?: string
  enterpriseId?: string
  facilityId?: string
  businessUnitId?: string
}

interface CanvasFormProps {
  mode: 'create' | 'edit'
  onSubmit: (businessInfo: BusinessInformation) => void
  canvasId?: string // Only needed for edit mode
  canvasData?: any // Only needed for edit mode
  enterpriseContext?: any
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function CanvasForm({
  mode,
  onSubmit,
  canvasId,
  canvasData,
  enterpriseContext,
  isOpen,
  onOpenChange
}: CanvasFormProps) {
  const { industries, loading: industriesLoading, error: industriesError } = useIndustries()

  const [formData, setFormData] = useState<BusinessInformation>({
    name: '',
    legalName: '',
    abn: '',
    acn: '',
    businessType: 'CORPORATION',
    industry: '',
    sector: '',
    sectors: [],
    regional: 'METROPOLITAN',
    primaryLocation: '',
    coordinates: '',
    facilityType: 'MINE',
    operationalStreams: [],
    strategicObjective: '',
    valueProposition: '',
    competitiveAdvantage: '',
    annualRevenue: 0,
    employeeCount: 0,
    riskProfile: 'MEDIUM',
    digitalMaturity: 'BASIC',
    complianceRequirements: [],
    regulatoryFramework: [],
    parentCanvasId: undefined,
    enterpriseId: enterpriseContext?.enterprise?.id,
    facilityId: enterpriseContext?.facility?.id,
    businessUnitId: enterpriseContext?.businessUnit?.id
  })

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  // Load canvas data when in edit mode
  useEffect(() => {
    if (mode === 'edit' && canvasData) {
      console.log('🔍 EDIT FORM DEBUG - Loading canvas data:', canvasData)
      console.log('🔍 EDIT FORM DEBUG - Canvas sectors:', canvasData.sectors)
      
      // Extract business information from canvas data and related entities
      const businessInfo: BusinessInformation = {
        name: canvasData.name || '',
        legalName: canvasData.legalName || '',
        abn: canvasData.abn || '',
        acn: canvasData.acn || '',
        businessType: canvasData.businessType || 'CORPORATION',
        industry: canvasData.industry || '',
        sector: canvasData.sector || '',
        sectors: canvasData.sectors ? (() => {
          // Map sector codes to their correct types and deduplicate
          const sectorTypeMap: Record<string, 'COMMODITY' | 'VALUE_CHAIN' | 'BUSINESS_MODEL' | 'SUPPORT_SERVICES'> = {
            // Commodity sectors
            'COAL': 'COMMODITY',
            'IRON_ORE': 'COMMODITY',
            'PRECIOUS_METALS': 'COMMODITY',
            'BASE_METALS': 'COMMODITY',
            'BATTERY_MINERALS': 'COMMODITY',
            'INDUSTRIAL_MINERALS': 'COMMODITY',
            'RARE_EARTH_ELEMENTS': 'COMMODITY',
            'URANIUM': 'COMMODITY',
            'GEMSTONES': 'COMMODITY',
            // Value chain sectors
            'EXPLORATION': 'VALUE_CHAIN',
            'DEVELOPMENT': 'VALUE_CHAIN',
            'PRODUCTION': 'VALUE_CHAIN',
            'PROCESSING': 'VALUE_CHAIN',
            'CLOSURE': 'VALUE_CHAIN',
            // Business model sectors
            'MAJOR_MINERS': 'BUSINESS_MODEL',
            'JUNIOR_MINERS': 'BUSINESS_MODEL',
            'STATE_OWNED': 'BUSINESS_MODEL',
            'ARTISANAL_SMALL_SCALE': 'BUSINESS_MODEL',
            // Support services sectors
            'METS': 'SUPPORT_SERVICES',
            'CONTRACT_MINING': 'SUPPORT_SERVICES',
            'ENVIRONMENTAL_SERVICES': 'SUPPORT_SERVICES',
            'LOGISTICS_INFRASTRUCTURE': 'SUPPORT_SERVICES'
          }
          
          // Create sector objects and deduplicate
          const sectorObjects = canvasData.sectors.map((sector: string, index: number) => ({
            sectorCode: sector,
            sectorType: sectorTypeMap[sector] || 'COMMODITY' as const,
            isPrimary: sector === canvasData.primarySector || (index === 0 && !canvasData.primarySector) // Use primarySector from DB or fallback to first
          }))
          
          // Remove duplicates, keeping the first occurrence (which might be primary)
          const uniqueSectors = sectorObjects.reduce((acc, sector) => {
            const existing = acc.find(s => s.sectorCode === sector.sectorCode)
            if (!existing) {
              acc.push(sector)
            } else if (sector.isPrimary && !existing.isPrimary) {
              // If new sector is primary and existing isn't, replace it
              const index = acc.findIndex(s => s.sectorCode === sector.sectorCode)
              acc[index] = sector
            }
            return acc
          }, [] as typeof sectorObjects)
          
          return uniqueSectors
        })() : [],
        regional: canvasData.regional || 'METROPOLITAN',
        primaryLocation: canvasData.primaryLocation || '',
        coordinates: canvasData.coordinates || '',
        facilityType: canvasData.facilityType || 'MINE',
        operationalStreams: canvasData.operationalStreams || [],
        strategicObjective: canvasData.strategicObjective || canvasData.description || '',
        valueProposition: canvasData.valueProposition || '',
        competitiveAdvantage: canvasData.competitiveAdvantage || '',
        annualRevenue: canvasData.annualRevenue || 0,
        employeeCount: canvasData.employeeCount || 0,
        riskProfile: canvasData.riskProfile || 'MEDIUM',
        digitalMaturity: canvasData.digitalMaturity || 'BASIC',
        complianceRequirements: canvasData.complianceRequirements || [],
        regulatoryFramework: canvasData.regulatoryFramework || [],
        parentCanvasId: canvasData.parentCanvasId,
        enterpriseId: canvasData.enterpriseId,
        facilityId: canvasData.facilityId,
        businessUnitId: canvasData.businessUnitId
      }
      
      setFormData(businessInfo)
      
      console.log('🔍 EDIT FORM DEBUG - Set form data:', businessInfo)
      console.log('🔍 EDIT FORM DEBUG - Converted sectors:', businessInfo.sectors)
    }
  }, [canvasData, mode])

  const handleInputChange = (field: keyof BusinessInformation, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Memoized callbacks to prevent infinite loops in SectorMultiSelect
  const handleOperationalStreamsChange = useCallback((streams: string[]) => {
    setFormData(prev => ({ ...prev, operationalStreams: streams }))
  }, [])

  const handleComplianceRequirementsChange = useCallback((requirements: string[]) => {
    setFormData(prev => ({ ...prev, complianceRequirements: requirements }))
  }, [])

  const handleArrayChange = (field: keyof BusinessInformation, value: string, action: 'add' | 'remove') => {
    setFormData(prev => ({
      ...prev,
      [field]: action === 'add' 
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter(item => item !== value)
    }))
  }

  const handleSubmit = () => {
    console.log(`🔍 ${mode.toUpperCase()} FORM DEBUG - Submitting form data:`, JSON.stringify(formData, null, 2))
    console.log(`🔍 ${mode.toUpperCase()} FORM DEBUG - Sectors data:`, formData.sectors)
    if (mode === 'edit' && canvasId) {
      console.log('🔍 EDIT FORM DEBUG - canvasId:', canvasId)
    }
    console.log('🔍 FORM DEBUG - Calling onSubmit with data...')
    onSubmit(formData)
    console.log('🔍 FORM DEBUG - onSubmit called, closing form...')
    onOpenChange(false)
    setCurrentStep(1)
    
    // Reset form data for create mode
    if (mode === 'create') {
      setFormData({
        name: '',
        legalName: '',
        abn: '',
        acn: '',
        businessType: 'CORPORATION',
        industry: '',
        sector: '',
        sectors: [],
        regional: 'METROPOLITAN',
        primaryLocation: '',
        coordinates: '',
        facilityType: 'MINE',
        operationalStreams: [],
        strategicObjective: '',
        valueProposition: '',
        competitiveAdvantage: '',
        annualRevenue: 0,
        employeeCount: 0,
        riskProfile: 'MEDIUM',
        digitalMaturity: 'BASIC',
        complianceRequirements: [],
        regulatoryFramework: [],
        parentCanvasId: undefined,
        enterpriseId: enterpriseContext?.enterprise?.id,
        facilityId: enterpriseContext?.facility?.id,
        businessUnitId: enterpriseContext?.businessUnit?.id
      })
    }
  }

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Business Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter business name"
          />
        </div>
        <div>
          <Label htmlFor="legalName">Legal Name</Label>
          <Input
            id="legalName"
            value={formData.legalName}
            onChange={(e) => handleInputChange('legalName', e.target.value)}
            placeholder="Legal entity name"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="abn">ABN</Label>
          <Input
            id="abn"
            value={formData.abn}
            onChange={(e) => handleInputChange('abn', e.target.value)}
            placeholder="Australian Business Number"
          />
        </div>
        <div>
          <Label htmlFor="acn">ACN</Label>
          <Input
            id="acn"
            value={formData.acn}
            onChange={(e) => handleInputChange('acn', e.target.value)}
            placeholder="Australian Company Number"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="businessType">Business Type</Label>
        <Select value={formData.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select business type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CORPORATION">Corporation</SelectItem>
            <SelectItem value="PARTNERSHIP">Partnership</SelectItem>
            <SelectItem value="SOLE_TRADER">Sole Trader</SelectItem>
            <SelectItem value="TRUST">Trust</SelectItem>
            <SelectItem value="JOINT_VENTURE">Joint Venture</SelectItem>
            <SelectItem value="SUBSIDIARY">Subsidiary</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="regional">Regional Classification</Label>
          <Select value={formData.regional} onValueChange={(value) => handleInputChange('regional', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select regional classification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="METROPOLITAN">Metropolitan</SelectItem>
              <SelectItem value="REGIONAL">Regional</SelectItem>
              <SelectItem value="REMOTE">Remote</SelectItem>
              <SelectItem value="RURAL">Rural</SelectItem>
              <SelectItem value="COASTAL">Coastal</SelectItem>
              <SelectItem value="INLAND">Inland</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <LocationInput
            value={formData.primaryLocation}
            onChange={(value) => handleInputChange('primaryLocation', value)}
            label="Primary Location"
            placeholder="Enter city, state, country..."
            required={false}
          />
        </div>
      </div>



      <div>
        <Label htmlFor="industry">Industry *</Label>
        {industriesLoading ? (
          <div className="text-sm text-muted-foreground">Loading industries...</div>
        ) : industriesError ? (
          <div className="text-sm text-destructive">Error loading industries</div>
        ) : (
          <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry.code} value={industry.code}>
                  {industry.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {(formData.industry === 'MINING_METALS' || formData.industry === 'MINING' || formData.industry === 'Mining & Metals') && (
        <div>
          <Label>Sectors *</Label>
          <SectorMultiSelect
            selectedSectors={formData.sectors}
            onSectorsChange={(sectors) => handleInputChange('sectors', sectors)}
            onOperationalStreamsChange={handleOperationalStreamsChange}
            onComplianceRequirementsChange={handleComplianceRequirementsChange}
            showValidation={true}
          />
        </div>
      )}

      <div>
        <Label>Operational Streams</Label>
        <div className="text-sm text-muted-foreground">
          Operational streams are automatically generated based on selected sectors
        </div>
        {formData.operationalStreams.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {formData.operationalStreams.map((stream: string) => (
              <Badge key={stream} variant="outline" className="text-xs">
                {stream.replace(/_/g, ' ')}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div>
        <LocationInput
          value={formData.primaryLocation}
          onChange={(value) => handleInputChange('primaryLocation', value)}
          label="Primary Location"
          placeholder="Enter city, state, country..."
          required={false}
        />
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="strategicObjective">Strategic Objective</Label>
        <Textarea
          id="strategicObjective"
          value={formData.strategicObjective}
          onChange={(e) => handleInputChange('strategicObjective', e.target.value)}
          placeholder="Primary strategic objective for this business"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="valueProposition">Value Proposition</Label>
        <Textarea
          id="valueProposition"
          value={formData.valueProposition}
          onChange={(e) => handleInputChange('valueProposition', e.target.value)}
          placeholder="What value does this business deliver to customers?"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="annualRevenue">Annual Revenue (AUD)</Label>
          <Input
            id="annualRevenue"
            type="number"
            value={formData.annualRevenue}
            onChange={(e) => handleInputChange('annualRevenue', parseFloat(e.target.value) || 0)}
            placeholder="0"
          />
        </div>
        <div>
          <Label htmlFor="employeeCount">Employee Count</Label>
          <Input
            id="employeeCount"
            type="number"
            value={formData.employeeCount}
            onChange={(e) => handleInputChange('employeeCount', parseInt(e.target.value) || 0)}
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="competitiveAdvantage">Competitive Advantage</Label>
        <Textarea
          id="competitiveAdvantage"
          value={formData.competitiveAdvantage}
          onChange={(e) => handleInputChange('competitiveAdvantage', e.target.value)}
          placeholder="What gives this business a competitive edge?"
          rows={2}
        />
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="riskProfile">Risk Profile</Label>
        <Select value={formData.riskProfile} onValueChange={(value) => handleInputChange('riskProfile', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select risk profile" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="CRITICAL">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="digitalMaturity">Digital Maturity</Label>
        <Select value={formData.digitalMaturity} onValueChange={(value) => handleInputChange('digitalMaturity', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select digital maturity level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BASIC">Basic</SelectItem>
            <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
            <SelectItem value="ADVANCED">Advanced</SelectItem>
            <SelectItem value="LEADING">Leading</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="facilityType">Facility Type</Label>
        <Select value={formData.facilityType} onValueChange={(value) => handleInputChange('facilityType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select facility type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MINE">Mine</SelectItem>
            <SelectItem value="PROCESSING_PLANT">Processing Plant</SelectItem>
            <SelectItem value="REFINERY">Refinery</SelectItem>
            <SelectItem value="SMELTER">Smelter</SelectItem>
            <SelectItem value="WAREHOUSE">Warehouse</SelectItem>
            <SelectItem value="OFFICE">Office</SelectItem>
            <SelectItem value="LABORATORY">Laboratory</SelectItem>
            <SelectItem value="WORKSHOP">Workshop</SelectItem>
            <SelectItem value="POWER_STATION">Power Station</SelectItem>
            <SelectItem value="WATER_TREATMENT">Water Treatment</SelectItem>
            <SelectItem value="WASTE_MANAGEMENT">Waste Management</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="regional">Regional Classification</Label>
        <Select value={formData.regional} onValueChange={(value) => handleInputChange('regional', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select regional classification" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="METROPOLITAN">Metropolitan</SelectItem>
            <SelectItem value="REGIONAL">Regional</SelectItem>
            <SelectItem value="REMOTE">Remote</SelectItem>
            <SelectItem value="RURAL">Rural</SelectItem>
            <SelectItem value="COASTAL">Coastal</SelectItem>
            <SelectItem value="INLAND">Inland</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-4">
      <div>
        <Label>Compliance Requirements</Label>
        <div className="text-sm text-muted-foreground">
          Compliance requirements are automatically generated based on selected sectors
        </div>
        {formData.complianceRequirements.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {formData.complianceRequirements.map((requirement: string) => (
              <Badge key={requirement} variant="outline" className="text-xs">
                {requirement.replace(/_/g, ' ')}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div>
        <Label>Regulatory Framework</Label>
        <div className="text-sm text-muted-foreground">
          Regulatory framework is automatically generated based on selected sectors
        </div>
        {formData.regulatoryFramework.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {formData.regulatoryFramework.map((framework: string) => (
              <Badge key={framework} variant="outline" className="text-xs">
                {framework.replace(/_/g, ' ')}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1()
      case 2:
        return renderStep2()
      case 3:
        return renderStep3()
      case 4:
        return renderStep4()
      default:
        return renderStep1()
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Business Information'
      case 2:
        return 'Strategic & Financial'
      case 3:
        return 'Risk & Operations'
      case 4:
        return 'Compliance & Regulatory'
      default:
        return 'Business Information'
    }
  }

  const getFormTitle = () => {
    return mode === 'create' ? 'Create New Business Canvas' : 'Edit Business Canvas'
  }

  const getFormDescription = () => {
    return mode === 'create' 
      ? 'Set up a new business canvas with comprehensive metadata'
      : 'Update canvas metadata and business information'
  }

  const getSubmitButtonText = () => {
    return mode === 'create' ? 'Create Canvas' : 'Update Canvas'
  }

  const getSubmitIcon = () => {
    return mode === 'create' ? Plus : Save
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{getFormTitle()}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="flex space-x-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full ${
                  i + 1 <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Step Title */}
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-primary/10">
              {currentStep === 1 && <Building className="h-4 w-4 text-primary" />}
              {currentStep === 2 && <Target className="h-4 w-4 text-primary" />}
              {currentStep === 3 && <Shield className="h-4 w-4 text-primary" />}
              {currentStep === 4 && <FileText className="h-4 w-4 text-primary" />}
            </div>
            <h3 className="text-lg font-semibold">{getStepTitle()}</h3>
          </div>

          {/* Form Content */}
          <div className="space-y-6">
            {renderCurrentStep()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button onClick={() => setCurrentStep(currentStep + 1)}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                {React.createElement(getSubmitIcon(), { className: "h-4 w-4 mr-2" })}
                {getSubmitButtonText()}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 