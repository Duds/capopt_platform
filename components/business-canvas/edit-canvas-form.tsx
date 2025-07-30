/**
 * Edit Canvas Form Component
 * 
 * Allows editing of canvas overarching metadata:
 * - Business identification and classification
 * - Industry and sector details
 * - Operational context and scope
 * - Strategic positioning
 * - Risk and compliance requirements
 * - Does NOT allow editing of canvas cards/content
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { LocationInput } from '@/components/ui/location-input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Building,
  Target,
  Users,
  Globe,
  MapPin,
  DollarSign,
  Shield,
  Activity,
  Edit,
  Save
} from 'lucide-react'

interface BusinessInformation {
  // Basic Business Information
  name: string
  legalName: string
  businessType: 'ENTERPRISE' | 'BUSINESS_UNIT' | 'OPERATIONAL' | 'SPECIALIZED'
  industry: string
  sector: string
  subSector: string
  
  // Operational Context
  operationalScope: 'GLOBAL' | 'REGIONAL' | 'NATIONAL' | 'LOCAL'
  facilityType: 'HEADQUARTERS' | 'PRODUCTION' | 'DISTRIBUTION' | 'SERVICE' | 'RESEARCH'
  operationalStreams: string[]
  
  // Strategic Information
  strategicObjective: string
  valueProposition: string
  targetMarkets: string[]
  competitiveAdvantage: string
  
  // Risk and Compliance
  riskProfile: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  complianceRequirements: string[]
  regulatoryFramework: string[]
  
  // Financial Context
  annualRevenue: number
  employeeCount: number
  budget: number
  currency: string
  
  // Geographic Information
  primaryLocation: string
  primaryLocationValidation?: any
  operatingRegions: string[]
  timeZone: string
  
  // Technical Context
  technologyStack: string[]
  digitalMaturity: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'LEADING'
  automationLevel: 'MANUAL' | 'SEMI_AUTOMATED' | 'AUTOMATED' | 'INTELLIGENT'
  
  // Relationships
  parentCanvasId?: string
  enterpriseId?: string
  facilityId?: string
  businessUnitId?: string
}

interface EditCanvasFormProps {
  onUpdateCanvas: (canvasId: string, businessInfo: BusinessInformation) => void
  canvasId: string
  canvasData?: any
  enterpriseContext?: any
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const INDUSTRIES = [
  'MINING_METALS',
  'OIL_GAS',
  'CHEMICALS',
  'MANUFACTURING',
  'CONSTRUCTION',
  'TRANSPORTATION',
  'HEALTHCARE',
  'FINANCIAL_SERVICES',
  'TECHNOLOGY',
  'RETAIL',
  'AGRICULTURE',
  'UTILITIES',
  'DEFENCE',
  'OTHER'
]

const SECTORS = {
  MINING_METALS: ['COPPER', 'GOLD', 'URANIUM', 'IRON_ORE', 'COAL', 'LITHIUM', 'RARE_EARTHS'],
  OIL_GAS: ['UPSTREAM', 'MIDSTREAM', 'DOWNSTREAM', 'RENEWABLES'],
  CHEMICALS: ['BASIC_CHEMICALS', 'SPECIALTY_CHEMICALS', 'PETROCHEMICALS'],
  MANUFACTURING: ['HEAVY_INDUSTRY', 'LIGHT_INDUSTRY', 'PRECISION_MANUFACTURING'],
  CONSTRUCTION: ['INFRASTRUCTURE', 'COMMERCIAL', 'RESIDENTIAL', 'INDUSTRIAL'],
  TRANSPORTATION: ['LOGISTICS', 'PASSENGER', 'FREIGHT', 'INFRASTRUCTURE'],
  HEALTHCARE: ['PHARMACEUTICALS', 'MEDICAL_DEVICES', 'HEALTHCARE_SERVICES'],
  FINANCIAL_SERVICES: ['BANKING', 'INSURANCE', 'INVESTMENT', 'FINTECH'],
  TECHNOLOGY: ['SOFTWARE', 'HARDWARE', 'SERVICES', 'CLOUD'],
  RETAIL: ['B2B', 'B2C', 'E_COMMERCE', 'WHOLESALE'],
  AGRICULTURE: ['CROPS', 'LIVESTOCK', 'AGROTECH', 'FOOD_PROCESSING'],
  UTILITIES: ['ELECTRICITY', 'WATER', 'GAS', 'WASTE_MANAGEMENT'],
  DEFENCE: ['AEROSPACE', 'MARITIME', 'LAND_SYSTEMS', 'CYBER'],
  OTHER: ['CUSTOM']
}

const OPERATIONAL_STREAMS = [
  'COPPER_PROCESSING',
  'GOLD_REFINING',
  'URANIUM_EXTRACTION',
  'LITHIUM_PRODUCTION',
  'RARE_EARTHS_PROCESSING',
  'IRON_ORE_MINING',
  'COAL_MINING',
  'OIL_REFINING',
  'GAS_PROCESSING',
  'CHEMICAL_MANUFACTURING',
  'STEEL_PRODUCTION',
  'ALUMINUM_SMELTING',
  'CEMENT_PRODUCTION',
  'POWER_GENERATION',
  'WATER_TREATMENT',
  'WASTE_MANAGEMENT',
  'LOGISTICS',
  'MAINTENANCE',
  'RESEARCH_DEVELOPMENT',
  'QUALITY_ASSURANCE'
]

const COMPLIANCE_REQUIREMENTS = [
  'ISO_9001',
  'ISO_14001',
  'ISO_45001',
  'ISO_27001',
  'OHSAS_18001',
  'WHS_ACT',
  'ENVIRONMENTAL_PROTECTION',
  'DATA_PRIVACY',
  'CYBER_SECURITY',
  'EXPORT_CONTROLS',
  'CUSTOMS_REGULATIONS',
  'TAX_COMPLIANCE',
  'FINANCIAL_REPORTING',
  'CORPORATE_GOVERNANCE',
  'ANTI_CORRUPTION',
  'SUSTAINABILITY_REPORTING'
]

const REGULATORY_FRAMEWORKS = [
  'AUSTRALIAN_STANDARDS',
  'INTERNATIONAL_STANDARDS',
  'EU_REGULATIONS',
  'US_REGULATIONS',
  'CANADIAN_REGULATIONS',
  'UK_REGULATIONS',
  'ASIA_PACIFIC_REGULATIONS',
  'AFRICAN_REGULATIONS',
  'SOUTH_AMERICAN_REGULATIONS',
  'MIDDLE_EAST_REGULATIONS'
]

export function EditCanvasForm({
  onUpdateCanvas,
  canvasId,
  canvasData,
  enterpriseContext,
  isOpen,
  onOpenChange
}: EditCanvasFormProps) {
  const [formData, setFormData] = useState<BusinessInformation>({
    name: '',
    legalName: '',
    businessType: 'BUSINESS_UNIT',
    industry: '',
    sector: '',
    subSector: '',
    operationalScope: 'REGIONAL',
    facilityType: 'PRODUCTION',
    operationalStreams: [],
    strategicObjective: '',
    valueProposition: '',
    targetMarkets: [],
    competitiveAdvantage: '',
    riskProfile: 'MEDIUM',
    complianceRequirements: [],
    regulatoryFramework: [],
    annualRevenue: 0,
    employeeCount: 0,
    budget: 0,
    currency: 'AUD',
    primaryLocation: '',
    primaryLocationValidation: null,
    operatingRegions: [],
    timeZone: 'Australia/Sydney',
    technologyStack: [],
    digitalMaturity: 'INTERMEDIATE',
    automationLevel: 'SEMI_AUTOMATED',
    parentCanvasId: undefined,
    enterpriseId: enterpriseContext?.enterprise?.id,
    facilityId: enterpriseContext?.facility?.id,
    businessUnitId: enterpriseContext?.businessUnit?.id
  })

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  // Load canvas data when component mounts or canvasData changes
  useEffect(() => {
    if (canvasData) {
      console.log('🔍 EDIT FORM DEBUG - Loading canvas data:', canvasData)
      
      // Extract business information from canvas data and related entities
      const businessInfo: BusinessInformation = {
        name: canvasData.name || '',
        legalName: canvasData.enterprise?.legalName || canvasData.facility?.name || canvasData.businessUnit?.name || '',
        businessType: canvasData.enterprise ? 'ENTERPRISE' : 
                     canvasData.facility ? 'OPERATIONAL' : 
                     canvasData.businessUnit ? 'BUSINESS_UNIT' : 'BUSINESS_UNIT',
        industry: canvasData.enterprise?.industry || canvasData.facility?.type || '',
        sector: canvasData.enterprise?.sector || '',
        subSector: '',
        operationalScope: 'REGIONAL',
        facilityType: canvasData.facility?.type || 'PRODUCTION',
        operationalStreams: [],
        strategicObjective: canvasData.description || '',
        valueProposition: '',
        targetMarkets: [],
        competitiveAdvantage: '',
        riskProfile: 'MEDIUM',
        complianceRequirements: [],
        regulatoryFramework: [],
        annualRevenue: 0,
        employeeCount: 0,
        budget: parseFloat(canvasData.businessUnit?.budget?.toString() || '0'),
        currency: 'AUD',
        primaryLocation: canvasData.facility?.location || canvasData.enterprise?.addresses?.find((addr: any) => addr.isPrimary)?.city || '',
        primaryLocationValidation: null,
        operatingRegions: [],
        timeZone: 'Australia/Sydney',
        technologyStack: [],
        digitalMaturity: 'INTERMEDIATE',
        automationLevel: 'SEMI_AUTOMATED',
        parentCanvasId: canvasData.parentCanvasId,
        enterpriseId: canvasData.enterpriseId,
        facilityId: canvasData.facilityId,
        businessUnitId: canvasData.businessUnitId
      }
      
      setFormData(businessInfo)
      console.log('🔍 EDIT FORM DEBUG - Set form data:', businessInfo)
    }
  }, [canvasData])

  const handleInputChange = (field: keyof BusinessInformation, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field: keyof BusinessInformation, value: string, action: 'add' | 'remove') => {
    setFormData(prev => ({
      ...prev,
      [field]: action === 'add' 
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter(item => item !== value)
    }))
  }

  const handleSubmit = () => {
    console.log('🔍 EDIT FORM DEBUG - Submitting form data:', formData)
    console.log('🔍 EDIT FORM DEBUG - canvasId:', canvasId)
    onUpdateCanvas(canvasId, formData)
    onOpenChange(false)
    setCurrentStep(1)
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
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="businessType">Business Type *</Label>
          <Select value={formData.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
              <SelectItem value="BUSINESS_UNIT">Business Unit</SelectItem>
              <SelectItem value="OPERATIONAL">Operational</SelectItem>
              <SelectItem value="SPECIALIZED">Specialized</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="industry">Industry *</Label>
          <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map(industry => (
                <SelectItem key={industry} value={industry}>
                  {industry.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="sector">Sector</Label>
          <Select 
            value={formData.sector} 
            onValueChange={(value) => handleInputChange('sector', value)}
            disabled={!formData.industry}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {formData.industry && SECTORS[formData.industry as keyof typeof SECTORS]?.map(sector => (
                <SelectItem key={sector} value={sector}>
                  {sector.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="operationalScope">Operational Scope</Label>
          <Select value={formData.operationalScope} onValueChange={(value) => handleInputChange('operationalScope', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GLOBAL">Global</SelectItem>
              <SelectItem value="REGIONAL">Regional</SelectItem>
              <SelectItem value="NATIONAL">National</SelectItem>
              <SelectItem value="LOCAL">Local</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="facilityType">Facility Type</Label>
          <Select value={formData.facilityType} onValueChange={(value) => handleInputChange('facilityType', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HEADQUARTERS">Headquarters</SelectItem>
              <SelectItem value="PRODUCTION">Production</SelectItem>
              <SelectItem value="DISTRIBUTION">Distribution</SelectItem>
              <SelectItem value="SERVICE">Service</SelectItem>
              <SelectItem value="RESEARCH">Research</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Operational Streams</Label>
        <div className="grid grid-cols-3 gap-2 mt-2 max-h-32 overflow-y-auto">
          {OPERATIONAL_STREAMS.map(stream => (
            <div key={stream} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={stream}
                checked={formData.operationalStreams.includes(stream)}
                onChange={(e) => handleArrayChange('operationalStreams', stream, e.target.checked ? 'add' : 'remove')}
              />
              <Label htmlFor={stream} className="text-sm">
                {stream.replace('_', ' ')}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <LocationInput
          value={formData.primaryLocation}
          onChange={(value) => handleInputChange('primaryLocation', value)}
          onValidationChange={(validation) => handleInputChange('primaryLocationValidation', validation)}
          label="Primary Location"
          placeholder="Enter city, state, country..."
          required={false}
        />
      </div>
    </div>
  )

  const renderStep3 = () => (
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

  const renderStep4 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="riskProfile">Risk Profile</Label>
          <Select value={formData.riskProfile} onValueChange={(value) => handleInputChange('riskProfile', value)}>
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
        <div>
          <Label htmlFor="digitalMaturity">Digital Maturity</Label>
          <Select value={formData.digitalMaturity} onValueChange={(value) => handleInputChange('digitalMaturity', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BASIC">Basic</SelectItem>
              <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
              <SelectItem value="ADVANCED">Advanced</SelectItem>
              <SelectItem value="LEADING">Leading</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Compliance Requirements</Label>
        <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
          {COMPLIANCE_REQUIREMENTS.map(req => (
            <div key={req} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={req}
                checked={formData.complianceRequirements.includes(req)}
                onChange={(e) => handleArrayChange('complianceRequirements', req, e.target.checked ? 'add' : 'remove')}
              />
              <Label htmlFor={req} className="text-sm">
                {req.replace('_', ' ')}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Regulatory Framework</Label>
        <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
          {REGULATORY_FRAMEWORKS.map(framework => (
            <div key={framework} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={framework}
                checked={formData.regulatoryFramework.includes(framework)}
                onChange={(e) => handleArrayChange('regulatoryFramework', framework, e.target.checked ? 'add' : 'remove')}
              />
              <Label htmlFor={framework} className="text-sm">
                {framework.replace('_', ' ')}
              </Label>
            </div>
          ))}
        </div>
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
        return 'Basic Business Information'
      case 2:
        return 'Operational Context'
      case 3:
        return 'Strategic Positioning'
      case 4:
        return 'Risk & Compliance'
      default:
        return 'Basic Business Information'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Business Canvas
          </DialogTitle>
          <DialogDescription>
            Update canvas metadata and business information. Canvas content and cards cannot be edited here.
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Step {currentStep} of {totalSteps}</Badge>
            <span className="text-sm font-medium">{getStepTitle()}</span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`h-2 w-8 rounded ${
                  i + 1 <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="space-y-6">
          {renderCurrentStep()}
        </div>

        {/* Navigation */}
        <DialogFooter className="flex justify-between">
          <div>
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Previous
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {currentStep < totalSteps ? (
              <Button onClick={() => setCurrentStep(currentStep + 1)}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                <Save className="h-4 w-4 mr-2" />
                Update Canvas
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 