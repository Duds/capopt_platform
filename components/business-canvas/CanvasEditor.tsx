'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useIndustries, type Industry } from '@/hooks/use-industries'
import { useOperationalStreams, useComplianceFrameworks, useSectorRecommendations } from '@/hooks/use-enum-values'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LocationInput } from '@/components/ui/location-input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DynamicSelect } from '@/components/ui/dynamic-select'
import { IndustrySectorSelector } from './IndustrySectorSelector'
import { EditableBadgeList } from './EditableBadgeList'
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
  Plus,
  AlertCircle,
  CheckCircle,
  X,
  Info
} from 'lucide-react'

interface SectorSelection {
  sectorCode: string
  sectorType: string
  isPrimary: boolean
}

interface BusinessInformation {
  // Basic Business Information
  name: string
  legalName: string
  abn: string
  acn: string
  businessType: string
  industry: string
  sectors: SectorSelection[]
  
  // Geographic & Regional
  regional: string
  primaryLocation: string
  
  // Facility & Operations
  facilityType: string
  operationalStreams: string[]
  
  // Strategic & Financial
  strategicObjective: string
  valueProposition: string
  competitiveAdvantage: string
  annualRevenue: number
  employeeCount: number
  
  // Risk & Compliance
  riskProfile: string
  complianceRequirements: string[]
  regulatoryFramework: string[]
  
  // Relationships
  parentCanvasId?: string
  enterpriseId?: string
  facilityId?: string
  businessUnitId?: string
}

interface ValidationErrors {
  [key: string]: string
}

interface CanvasEditorProps {
  mode: 'create' | 'edit'
  onSubmit: (businessInfo: BusinessInformation) => void
  canvasId?: string
  canvasData?: any
  enterpriseContext?: any
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function CanvasEditor({
  mode,
  onSubmit,
  canvasId,
  canvasData,
  enterpriseContext,
  isOpen,
  onOpenChange
}: CanvasEditorProps) {
  const { industries, loading: industriesLoading, error: industriesError } = useIndustries()

  const [formData, setFormData] = useState<BusinessInformation>({
    name: '',
    legalName: '',
    abn: '',
    acn: '',
    businessType: '',
    industry: '',
    sectors: [],
    regional: '',
    primaryLocation: '',
    facilityType: '',
    operationalStreams: [],
    strategicObjective: '',
    valueProposition: '',
    competitiveAdvantage: '',
    annualRevenue: 0,
    employeeCount: 0,
    riskProfile: '',
    complianceRequirements: [],
    regulatoryFramework: []
  })

  console.log('🔍 INITIAL FORM DATA DEBUG - Initial form data:', formData)

  // Debug log for form data changes
  useEffect(() => {
    console.log('🔍 FORM DATA CHANGE DEBUG - Form data updated:', formData)
  }, [formData])

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [currentStep, setCurrentStep] = useState(1)
  const [stepCompletion, setStepCompletion] = useState<boolean[]>([false, false, false, false])
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  // Get current industry code for API calls
  const currentIndustryCode = formData.industry ? 
    industries.find(i => i.name === formData.industry)?.code : undefined

  console.log('🔍 INDUSTRY CODE DEBUG - Form industry:', formData.industry)
  console.log('🔍 INDUSTRY CODE DEBUG - Available industries:', industries)
  console.log('🔍 INDUSTRY CODE DEBUG - Current industry code:', currentIndustryCode)
  console.log('🔍 INDUSTRY CODE DEBUG - Canvas data industry:', canvasData?.industry)

  // Get selected sector codes for recommendations
  const selectedSectorCodes = formData.sectors.map(s => s.sectorCode)

  // Fetch sector-based recommendations
  const { recommendations, loading: recommendationsLoading } = useSectorRecommendations(
    currentIndustryCode, 
    selectedSectorCodes
  )

  // Auto-populate operational streams and compliance requirements when sectors change
  useEffect(() => {
    // Don't auto-populate if we're in edit mode and data hasn't been loaded yet
    if (mode === 'edit' && !isDataLoaded) {
      console.log('🔍 AUTO-POPULATION DEBUG - Skipping auto-population in edit mode before data loaded')
      return
    }
    
    if (formData.sectors.length > 0 && recommendations && !recommendationsLoading) {
      console.log('🔍 AUTO-POPULATION DEBUG - Auto-populating from recommendations')
      
      // Auto-populate operational streams from sector recommendations
      if (recommendations.operationalStreams && recommendations.operationalStreams.length > 0) {
        setFormData(prev => ({
          ...prev,
          operationalStreams: [...new Set([...prev.operationalStreams, ...recommendations.operationalStreams])]
        }))
      }

      // Auto-populate compliance requirements from sector recommendations
      if (recommendations.complianceRequirements && recommendations.complianceRequirements.length > 0) {
        setFormData(prev => ({
          ...prev,
          complianceRequirements: [...new Set([...prev.complianceRequirements, ...recommendations.complianceRequirements])]
        }))
      }

      // Auto-populate regulatory framework from sector recommendations
      if (recommendations.regulatoryFramework && recommendations.regulatoryFramework.length > 0) {
        setFormData(prev => ({
          ...prev,
          regulatoryFramework: [...new Set([...prev.regulatoryFramework, ...recommendations.regulatoryFramework])]
        }))
      }
    }
  }, [formData.sectors, recommendations, recommendationsLoading, mode, isDataLoaded])

  // Reset related fields when industry changes
  const handleIndustryChange = (industryName: string) => {
    console.log('🔍 INDUSTRY CHANGE DEBUG - New industry name:', industryName)
    
    setFormData(prev => ({
      ...prev,
      industry: industryName, // Store the display name
      sectors: [], // Reset sectors when industry changes
      facilityType: '', // Reset facility type when industry changes
      operationalStreams: [], // Reset operational streams
      complianceRequirements: [], // Reset compliance requirements
      regulatoryFramework: [] // Reset regulatory framework
    }))
  }

  // Convert database sectors (string[]) to UI sectors (SectorSelection[])
  const convertSectorsToUI = useCallback((sectors: string[]): SectorSelection[] => {
    console.log('🔍 SECTOR CONVERSION DEBUG - Input sectors:', sectors)
    console.log('🔍 SECTOR CONVERSION DEBUG - Industries available:', industries.length)
    
    if (!sectors || sectors.length === 0) {
      console.log('🔍 SECTOR CONVERSION DEBUG - No sectors to convert')
      return []
    }
    
    // Get all sectors from the database to find their categories
    const allSectors = industries.flatMap(industry => industry.sectors)
    console.log('🔍 SECTOR CONVERSION DEBUG - All sectors from industries:', allSectors.map(s => ({ code: s.code, category: s.category })))
    
    const convertedSectors = sectors.map((sectorCode, index) => {
      // Find the sector in the database to get its category
      const sectorData = allSectors.find(s => s.code === sectorCode)
      console.log('🔍 SECTOR CONVERSION DEBUG - Converting sector:', sectorCode, 'found:', !!sectorData, 'category:', sectorData?.category)
      
      return {
        sectorCode,
        sectorType: sectorData?.category || 'COMMODITY', // Default to COMMODITY if not found
        isPrimary: index === 0 // First sector is primary
      }
    })
    
    console.log('🔍 SECTOR CONVERSION DEBUG - Converted sectors:', convertedSectors)
    return convertedSectors
  }, [industries])

  // Initialize form data for edit mode
  useEffect(() => {
    console.log('🔍 DATA LOADING DEBUG - Mode:', mode, 'CanvasData:', canvasData, 'Industries loaded:', industries.length > 0)
    
    if (mode === 'edit' && canvasData && industries.length > 0) {
      console.log('🔍 DATA LOADING DEBUG - Loading edit data:', canvasData)
      
      // Convert string values to numbers where needed
      const annualRevenue = typeof canvasData.annualRevenue === 'string' 
        ? parseFloat(canvasData.annualRevenue) 
        : canvasData.annualRevenue || 0
      
      const employeeCount = typeof canvasData.employeeCount === 'string'
        ? parseInt(canvasData.employeeCount)
        : canvasData.employeeCount || 0
      
      console.log('🔍 DATA LOADING DEBUG - Converted numbers:', { annualRevenue, employeeCount })
      
      // Convert database sectors to UI format
      const sectors = Array.isArray(canvasData.sectors) 
        ? convertSectorsToUI(canvasData.sectors)
        : []
      
      console.log('🔍 DATA LOADING DEBUG - Converted sectors:', sectors)
      
      // Use enterprise context to populate missing fields
      const getDefaultValue = (field: string, canvasValue: any, enterpriseValue?: any) => {
        if (canvasValue && canvasValue !== null && canvasValue !== '') return canvasValue
        if (enterpriseValue && enterpriseValue !== null && enterpriseValue !== '') return enterpriseValue
        return ''
      }
      
      // Get primary address for location
      const primaryAddress = enterpriseContext?.addresses?.find((addr: any) => addr.isPrimary)
      const defaultLocation = primaryAddress ? 
        `${primaryAddress.street}, ${primaryAddress.city}, ${primaryAddress.state} ${primaryAddress.postcode}` : ''
      
      // Map enterprise industry to display name
      const mapIndustryToDisplay = (industryCode: string) => {
        console.log('🔍 INDUSTRY MAPPING DEBUG - Input industryCode:', industryCode)
        
        // Map database enum values to display names
        const industryMap: { [key: string]: string } = {
          'MINING_METALS': 'Mining & Metals',
          'OIL_GAS': 'Oil & Gas',
          'CHEMICALS': 'Chemicals',
          'MANUFACTURING': 'Manufacturing',
          'CONSTRUCTION': 'Construction',
          'TRANSPORT': 'Transport',
          'ENERGY': 'Energy',
          'WATER': 'Water',
          'WASTE': 'Waste Management',
          'DEFENCE': 'Defence',
          'AEROSPACE': 'Aerospace',
          'HEALTHCARE': 'Healthcare',
          'FOOD_BEVERAGE': 'Food & Beverage',
          'TEXTILES': 'Textiles',
          'ELECTRONICS': 'Electronics',
          'PHARMACEUTICALS': 'Pharmaceuticals'
        }
        
        const displayName = industryMap[industryCode] || industryCode
        console.log('🔍 INDUSTRY MAPPING DEBUG - Mapped to:', displayName)
        return displayName
      }
      
      const formDataToSet = {
        name: canvasData.name || '',
        legalName: getDefaultValue('legalName', canvasData.legalName, enterpriseContext?.legalName),
        abn: getDefaultValue('abn', canvasData.abn, enterpriseContext?.abn),
        acn: getDefaultValue('acn', canvasData.acn, enterpriseContext?.acn),
        businessType: getDefaultValue('businessType', canvasData.businessType, ''),
        industry: getDefaultValue('industry', canvasData.industry, mapIndustryToDisplay(enterpriseContext?.industry)),
        sectors,
        regional: getDefaultValue('regional', canvasData.regional, ''),
        primaryLocation: getDefaultValue('primaryLocation', canvasData.primaryLocation, defaultLocation),
        facilityType: getDefaultValue('facilityType', canvasData.facilityType, ''),
        operationalStreams: canvasData.operationalStreams || [],
        strategicObjective: canvasData.strategicObjective || '',
        valueProposition: canvasData.valueProposition || '',
        competitiveAdvantage: canvasData.competitiveAdvantage || '',
        annualRevenue,
        employeeCount,
        riskProfile: canvasData.riskProfile || '',
        complianceRequirements: canvasData.complianceRequirements || [],
        regulatoryFramework: canvasData.regulatoryFramework || []
      }
      
      console.log('🔍 DATA LOADING DEBUG - Setting form data:', formDataToSet)
      console.log('🔍 DATA LOADING DEBUG - Form data keys:', Object.keys(formDataToSet))
      console.log('🔍 DATA LOADING DEBUG - Name value:', formDataToSet.name)
      console.log('🔍 DATA LOADING DEBUG - Industry value:', formDataToSet.industry)
      console.log('🔍 DATA LOADING DEBUG - Business type value:', formDataToSet.businessType)
      setFormData(formDataToSet)
      setIsDataLoaded(true) // Mark data as loaded
    } else if (mode === 'edit' && canvasData && industries.length === 0) {
      console.log('🔍 DATA LOADING DEBUG - Waiting for industries to load...')
    } else if (mode === 'edit' && !canvasData) {
      console.log('🔍 DATA LOADING DEBUG - No canvas data provided for edit mode')
    } else if (mode === 'create') {
      console.log('🔍 DATA LOADING DEBUG - Create mode, marking as loaded')
      setIsDataLoaded(true) // For create mode, mark as loaded immediately
    }
  }, [mode, canvasData, industries, convertSectorsToUI])

  const handleInputChange = (field: keyof BusinessInformation, value: any) => {
    console.log('🔍 INPUT CHANGE DEBUG - Field:', field, 'Value:', value, 'Type:', typeof value)
    
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }))
    }

    // Special handling for industry change
    if (field === 'industry') {
      handleIndustryChange(value)
    }
  }

  const validateStep = (step: number): boolean => {
    const errors: ValidationErrors = {}

    console.log('🔍 VALIDATION DEBUG - Validating step:', step)
    console.log('🔍 VALIDATION DEBUG - Current form data:', formData)
    console.log('🔍 VALIDATION DEBUG - Is data loaded:', isDataLoaded)

    // If data is not loaded yet, don't validate
    if (mode === 'edit' && !isDataLoaded) {
      console.log('🔍 VALIDATION DEBUG - Data not loaded yet, skipping validation')
      return true
    }

    switch (step) {
      case 1:
        console.log('🔍 VALIDATION DEBUG - Step 1 validation:')
        console.log('  - name:', formData.name, 'trimmed:', formData.name.trim(), 'empty:', !formData.name.trim())
        console.log('  - legalName:', formData.legalName, 'trimmed:', formData.legalName.trim(), 'empty:', !formData.legalName.trim())
        console.log('  - businessType:', formData.businessType, 'empty:', !formData.businessType)
        console.log('  - industry:', formData.industry, 'empty:', !formData.industry)
        console.log('  - regional:', formData.regional, 'empty:', !formData.regional)
        console.log('  - primaryLocation:', formData.primaryLocation, 'trimmed:', formData.primaryLocation.trim(), 'empty:', !formData.primaryLocation.trim())
        
        if (!formData.name || !formData.name.trim()) errors.name = 'Business name is required'
        if (!formData.legalName || !formData.legalName.trim()) errors.legalName = 'Legal entity name is required'
        if (!formData.businessType || !formData.businessType.trim()) errors.businessType = 'Business type is required'
        if (!formData.industry || !formData.industry.trim()) errors.industry = 'Industry is required'
        if (!formData.regional || !formData.regional.trim()) errors.regional = 'Regional classification is required'
        if (!formData.primaryLocation || !formData.primaryLocation.trim()) errors.primaryLocation = 'Primary location is required'
        break

      case 2:
        console.log('🔍 VALIDATION DEBUG - Step 2 validation:')
        console.log('  - facilityType:', formData.facilityType, 'empty:', !formData.facilityType)
        console.log('  - sectors:', formData.sectors, 'length:', formData.sectors.length, 'empty:', formData.sectors.length === 0)
        console.log('  - sectors type:', typeof formData.sectors, 'isArray:', Array.isArray(formData.sectors))
        console.log('  - sectors details:', JSON.stringify(formData.sectors, null, 2))
        
        if (!formData.facilityType || !formData.facilityType.trim()) errors.facilityType = 'Facility type is required'
        if (!formData.sectors || formData.sectors.length === 0) errors.sectors = 'At least one sector must be selected'
        break

      case 3:
        console.log('🔍 VALIDATION DEBUG - Step 3 validation:')
        console.log('  - strategicObjective:', formData.strategicObjective, 'trimmed:', formData.strategicObjective.trim(), 'empty:', !formData.strategicObjective.trim())
        console.log('  - annualRevenue:', formData.annualRevenue, 'type:', typeof formData.annualRevenue, '<=0:', formData.annualRevenue <= 0)
        console.log('  - employeeCount:', formData.employeeCount, 'type:', typeof formData.employeeCount, '<=0:', formData.employeeCount <= 0)
        
        if (!formData.strategicObjective || !formData.strategicObjective.trim()) errors.strategicObjective = 'Strategic objective is required'
        if (!formData.annualRevenue || isNaN(formData.annualRevenue) || formData.annualRevenue <= 0) errors.annualRevenue = 'Annual revenue must be greater than 0'
        if (!formData.employeeCount || isNaN(formData.employeeCount) || formData.employeeCount <= 0) errors.employeeCount = 'Employee count must be greater than 0'
        break

      case 4:
        console.log('🔍 VALIDATION DEBUG - Step 4 validation:')
        console.log('  - riskProfile:', formData.riskProfile, 'empty:', !formData.riskProfile)
        
        if (!formData.riskProfile || !formData.riskProfile.trim()) errors.riskProfile = 'Risk profile is required'
        break
    }

    if (Object.keys(errors).length > 0) {
      console.log('🔍 VALIDATION DEBUG - Validation errors for step', step, ':', errors)
    } else {
      console.log('🔍 VALIDATION DEBUG - Step', step, 'validation passed')
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
      setStepCompletion(prev => {
        const newCompletion = [...prev]
        newCompletion[currentStep - 1] = true
        return newCompletion
      })
    }
  }

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      // Convert display names back to enum values for submission
      const mapDisplayToEnum = (displayName: string, enumType: string) => {
        // Industry mapping
        if (enumType === 'industry') {
          const reverseMap: { [key: string]: string } = {
            'Mining & Metals': 'MINING_METALS',
            'Oil & Gas': 'OIL_GAS',
            'Chemicals': 'CHEMICALS',
            'Manufacturing': 'MANUFACTURING',
            'Construction': 'CONSTRUCTION',
            'Transport': 'TRANSPORT',
            'Energy': 'ENERGY',
            'Water': 'WATER',
            'Waste Management': 'WASTE',
            'Defence': 'DEFENCE',
            'Aerospace': 'AEROSPACE',
            'Healthcare': 'HEALTHCARE',
            'Food & Beverage': 'FOOD_BEVERAGE',
            'Textiles': 'TEXTILES',
            'Electronics': 'ELECTRONICS',
            'Pharmaceuticals': 'PHARMACEUTICALS'
          }
          return reverseMap[displayName] || displayName
        }
        
        // Business type mapping
        if (enumType === 'business-type') {
          const reverseMap: { [key: string]: string } = {
            'Corporation': 'CORPORATION',
            'Partnership': 'PARTNERSHIP',
            'Sole Trader': 'SOLE_TRADER',
            'Trust': 'TRUST',
            'Joint Venture': 'JOINT_VENTURE',
            'Subsidiary': 'SUBSIDIARY'
          }
          return reverseMap[displayName] || displayName
        }
        
        // Regional classification mapping
        if (enumType === 'regional') {
          const reverseMap: { [key: string]: string } = {
            'Metropolitan': 'METROPOLITAN',
            'Regional': 'REGIONAL',
            'Remote': 'REMOTE',
            'Rural': 'RURAL',
            'Coastal': 'COASTAL',
            'Inland': 'INLAND'
          }
          return reverseMap[displayName] || displayName
        }
        
        // Risk profile mapping
        if (enumType === 'risk-profile') {
          const reverseMap: { [key: string]: string } = {
            'Low': 'LOW',
            'Medium': 'MEDIUM',
            'High': 'HIGH',
            'Critical': 'CRITICAL'
          }
          return reverseMap[displayName] || displayName
        }
        
        return displayName
      }

      const submissionData = {
        ...formData,
        industry: mapDisplayToEnum(formData.industry, 'industry'),
        businessType: mapDisplayToEnum(formData.businessType, 'business-type'),
        regional: mapDisplayToEnum(formData.regional, 'regional'),
        riskProfile: mapDisplayToEnum(formData.riskProfile, 'risk-profile')
      }

      console.log('🔍 SUBMISSION DEBUG - Original form data:', formData)
      console.log('🔍 SUBMISSION DEBUG - Submission data:', submissionData)
      
      onSubmit(submissionData)
    }
  }

  const getStepProgress = () => {
    return (currentStep / 4) * 100
  }

  const renderStep1 = () => {
    console.log('🔍 RENDER DEBUG - Step 1 form data:', formData)
    console.log('🔍 RENDER DEBUG - Name field value:', formData.name)
    console.log('🔍 RENDER DEBUG - Industry field value:', formData.industry)
    console.log('🔍 RENDER DEBUG - Business type field value:', formData.businessType)
    
    return (
      <div className="space-y-6">
        <div>
          <Label htmlFor="name" className="flex items-center gap-1">
            Business Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter business name"
            className={validationErrors.name ? 'border-red-500' : ''}
          />
          {validationErrors.name && (
            <p className="text-sm text-red-500 mt-1">{validationErrors.name}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="legalName" className="flex items-center gap-1">
              Legal Entity Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="legalName"
              value={formData.legalName}
              onChange={(e) => handleInputChange('legalName', e.target.value)}
              placeholder="Legal entity name"
              className={validationErrors.legalName ? 'border-red-500' : ''}
            />
            {validationErrors.legalName && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.legalName}</p>
            )}
          </div>

          <div>
            <Label htmlFor="businessType">Business Type</Label>
            <DynamicSelect
              value={formData.businessType}
              onValueChange={(value) => handleInputChange('businessType', value)}
              enumType="business-types"
              required
              error={validationErrors.businessType}
              showError={!!validationErrors.businessType}
            />
            {validationErrors.businessType && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.businessType}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="abn">ABN/ACN</Label>
            <Input
              id="abn"
              value={formData.abn}
              onChange={(e) => handleInputChange('abn', e.target.value)}
              placeholder="ABN or ACN"
            />
          </div>

          <div>
            <Label htmlFor="industry" className="flex items-center gap-1">
              Industry <span className="text-red-500">*</span>
            </Label>
            <DynamicSelect
              value={formData.industry}
              onValueChange={(value) => handleInputChange('industry', value)}
              enumType="industries"
              required
              error={validationErrors.industry}
              showError={!!validationErrors.industry}
            />
            {validationErrors.industry && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.industry}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="regional">Regional Classification</Label>
            <DynamicSelect
              value={formData.regional}
              onValueChange={(value) => handleInputChange('regional', value)}
              enumType="regional-classifications"
              required
              error={validationErrors.regional}
              showError={!!validationErrors.regional}
            />
            {validationErrors.regional && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.regional}</p>
            )}
          </div>

          <div>
            <LocationInput
              value={formData.primaryLocation}
              onChange={(value) => handleInputChange('primaryLocation', value)}
              placeholder="Enter primary location"
              required
              className={validationErrors.primaryLocation ? 'border-red-500' : ''}
            />
            {validationErrors.primaryLocation && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.primaryLocation}</p>
            )}
          </div>
        </div>
        
        {/* Debug info */}
        <div className="p-4 bg-gray-100 rounded-lg text-xs">
          <p><strong>Debug Info:</strong></p>
          <p>Business Type: "{formData.businessType}"</p>
          <p>Industry: "{formData.industry}"</p>
          <p>Regional: "{formData.regional}"</p>
          <p>Primary Location: "{formData.primaryLocation}"</p>
        </div>
      </div>
    )
  }

  const renderStep2 = () => (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Select your sectors to automatically populate relevant operational streams, compliance requirements, and regulatory frameworks. You can modify these later.
        </AlertDescription>
      </Alert>

      <div>
        <Label className="flex items-center gap-1">
          Sectors <span className="text-red-500">*</span>
        </Label>
        <IndustrySectorSelector
          selectedSectors={formData.sectors}
          onSectorsChange={(sectors) => handleInputChange('sectors', sectors)}
        />
        {validationErrors.sectors && (
          <p className="text-sm text-red-500 mt-1">{validationErrors.sectors}</p>
        )}
      </div>

      <DynamicSelect
        label="Facility Type"
        value={formData.facilityType}
        onValueChange={(value) => handleInputChange('facilityType', value)}
        enumType="facility-types"
        industryCode={currentIndustryCode}
        required
        error={validationErrors.facilityType}
        showError={!!validationErrors.facilityType}
      />
      {validationErrors.facilityType && (
        <p className="text-sm text-red-500 mt-1">{validationErrors.facilityType}</p>
      )}

      <div>
        <Label>Operational Streams</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Auto-populated based on selected sectors. Add or remove as needed.
        </p>
        <EditableBadgeList
          items={formData.operationalStreams}
          onItemsChange={(streams: string[]) => handleInputChange('operationalStreams', streams)}
          category="operational"
          placeholder="Add operational stream..."
        />
      </div>

      <div>
        <Label>Compliance Requirements</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Auto-populated based on selected sectors. Add or remove as needed.
        </p>
        <EditableBadgeList
          items={formData.complianceRequirements}
          onItemsChange={(requirements: string[]) => handleInputChange('complianceRequirements', requirements)}
          category="compliance"
          placeholder="Add compliance requirement..."
        />
      </div>

      <div>
        <Label>Regulatory Framework</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Auto-populated based on selected sectors. Add or remove as needed.
        </p>
        <EditableBadgeList
          items={formData.regulatoryFramework}
          onItemsChange={(framework: string[]) => handleInputChange('regulatoryFramework', framework)}
          category="regulatory"
          placeholder="Add regulatory framework..."
        />
      </div>
      
      {/* Debug info */}
      <div className="p-4 bg-gray-100 rounded-lg text-xs">
        <p><strong>Debug Info:</strong></p>
        <p>Facility Type: "{formData.facilityType}"</p>
        <p>Sectors: {JSON.stringify(formData.sectors)}</p>
        <p>Sectors Length: {formData.sectors.length}</p>
        <p>Operational Streams: {JSON.stringify(formData.operationalStreams)}</p>
        <p>Compliance Requirements: {JSON.stringify(formData.complianceRequirements)}</p>
        <p>Regulatory Framework: {JSON.stringify(formData.regulatoryFramework)}</p>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="strategicObjective" className="flex items-center gap-1">
          Strategic Objective <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="strategicObjective"
          value={formData.strategicObjective}
          onChange={(e) => handleInputChange('strategicObjective', e.target.value)}
          placeholder="Primary strategic objective for this business"
          rows={3}
          className={validationErrors.strategicObjective ? 'border-red-500' : ''}
        />
        {validationErrors.strategicObjective && (
          <p className="text-sm text-red-500 mt-1">{validationErrors.strategicObjective}</p>
        )}
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
          <Label htmlFor="annualRevenue" className="flex items-center gap-1">
            Annual Revenue (AUD) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="annualRevenue"
            type="number"
            value={formData.annualRevenue}
            onChange={(e) => handleInputChange('annualRevenue', parseFloat(e.target.value) || 0)}
            placeholder="0"
            className={validationErrors.annualRevenue ? 'border-red-500' : ''}
          />
          {validationErrors.annualRevenue && (
            <p className="text-sm text-red-500 mt-1">{validationErrors.annualRevenue}</p>
          )}
        </div>
        <div>
          <Label htmlFor="employeeCount" className="flex items-center gap-1">
            Employee Count <span className="text-red-500">*</span>
          </Label>
          <Input
            id="employeeCount"
            type="number"
            value={formData.employeeCount}
            onChange={(e) => handleInputChange('employeeCount', parseInt(e.target.value) || 0)}
            placeholder="0"
            className={validationErrors.employeeCount ? 'border-red-500' : ''}
          />
          {validationErrors.employeeCount && (
            <p className="text-sm text-red-500 mt-1">{validationErrors.employeeCount}</p>
          )}
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
      
      {/* Debug info */}
      <div className="p-4 bg-gray-100 rounded-lg text-xs">
        <p><strong>Debug Info:</strong></p>
        <p>Strategic Objective: "{formData.strategicObjective}"</p>
        <p>Value Proposition: "{formData.valueProposition}"</p>
        <p>Competitive Advantage: "{formData.competitiveAdvantage}"</p>
        <p>Annual Revenue: {formData.annualRevenue} (type: {typeof formData.annualRevenue})</p>
        <p>Employee Count: {formData.employeeCount} (type: {typeof formData.employeeCount})</p>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <DynamicSelect
          label="Risk Profile"
          value={formData.riskProfile}
          onValueChange={(value) => handleInputChange('riskProfile', value)}
          enumType="risk-profiles"
          required
          error={validationErrors.riskProfile}
          showError={!!validationErrors.riskProfile}
        />
        {validationErrors.riskProfile && (
          <p className="text-sm text-red-500 mt-1">{validationErrors.riskProfile}</p>
        )}
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Review all information before submitting. You can go back to previous steps to make changes.
        </AlertDescription>
      </Alert>
      
      {/* Debug info */}
      <div className="p-4 bg-gray-100 rounded-lg text-xs">
        <p><strong>Debug Info:</strong></p>
        <p>Risk Profile: "{formData.riskProfile}"</p>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1()
      case 2: return renderStep2()
      case 3: return renderStep3()
      case 4: return renderStep4()
      default: return renderStep1()
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Basic Information'
      case 2: return 'Operations & Compliance'
      case 3: return 'Strategic & Financial'
      case 4: return 'Risk Assessment'
      default: return 'Basic Information'
    }
  }

  const getStepIcon = () => {
    switch (currentStep) {
      case 1: return Building
      case 2: return Zap
      case 3: return DollarSign
      case 4: return Shield
      default: return Building
    }
  }

  const getFormTitle = () => {
    return mode === 'create' ? 'Create New Business Canvas' : 'Edit Business Canvas'
  }

  const getSubmitButtonText = () => {
    return mode === 'create' ? 'Create Canvas' : 'Update Canvas'
  }

  const getSubmitIcon = () => {
    return mode === 'create' ? Plus : Save
  }

  const StepIcon = getStepIcon()

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getFormTitle()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Step {currentStep} of 4</span>
              <span>{Math.round(getStepProgress())}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getStepProgress()}%` }}
              />
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <StepIcon className="h-4 w-4" />
            <span>{getStepTitle()}</span>
          </div>

          {/* Form Content */}
          <div className="space-y-6">
            {mode === 'edit' && !isDataLoaded ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-sm text-muted-foreground">Loading canvas data...</p>
                </div>
              </div>
            ) : (
              renderCurrentStep()
            )}
          </div>

          {/* Validation Summary */}
          {Object.keys(validationErrors).length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
                <AlertCircle className="h-4 w-4" />
                Please fix the following errors to continue:
              </div>
              <ul className="text-sm text-red-700 space-y-1">
                {Object.entries(validationErrors).map(([field, error]) => (
                  <li key={field}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              disabled={currentStep === 1 || (mode === 'edit' && !isDataLoaded)}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {currentStep < 4 ? (
                <Button
                  onClick={handleNextStep}
                  disabled={Object.keys(validationErrors).length > 0 || (mode === 'edit' && !isDataLoaded)}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={Object.keys(validationErrors).length > 0 || (mode === 'edit' && !isDataLoaded)}
                  className="flex items-center gap-2"
                >
                  {(() => {
                    const SubmitIcon = getSubmitIcon()
                    return SubmitIcon ? <SubmitIcon className="h-4 w-4" /> : null
                  })()}
                  {getSubmitButtonText()}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 