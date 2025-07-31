/**
 * Sector Multi-Select Component
 * 
 * Allows users to select multiple sectors from different categories:
 * - Commodity-based sectors
 * - Value chain sectors  
 * - Business model sectors
 * - Support services sectors
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Star, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Building,
  Activity,
  Users,
  Wrench
} from 'lucide-react'
import {
  COMMODITY_SECTORS,
  VALUE_CHAIN_SECTORS,
  BUSINESS_MODEL_SECTORS,
  SUPPORT_SERVICES_SECTORS,
  SectorSelection,
  validateSectorCombination,
  getSectorName,
  generateOperationalStreams,
  generateComplianceRequirements
} from '@/lib/sector-framework'

interface SectorMultiSelectProps {
  selectedSectors: SectorSelection[]
  onSectorsChange: (sectors: SectorSelection[]) => void
  onOperationalStreamsChange?: (streams: string[]) => void
  onComplianceRequirementsChange?: (requirements: string[]) => void
  disabled?: boolean
  showValidation?: boolean
}

const SECTOR_CATEGORIES = [
  {
    id: 'commodity',
    name: 'Commodity-Based',
    description: 'Classified by the type of resource being extracted',
    icon: Building,
    sectors: COMMODITY_SECTORS,
    required: true
  },
  {
    id: 'value-chain',
    name: 'Value Chain',
    description: 'Stage of the mining lifecycle',
    icon: Activity,
    sectors: VALUE_CHAIN_SECTORS,
    required: false
  },
  {
    id: 'business-model',
    name: 'Business Model',
    description: 'Ownership and operational structure',
    icon: Users,
    sectors: BUSINESS_MODEL_SECTORS,
    required: false
  },
  {
    id: 'support-services',
    name: 'Support Services',
    description: 'Essential services supporting mining operations',
    icon: Wrench,
    sectors: SUPPORT_SERVICES_SECTORS,
    required: false
  }
]

export function SectorMultiSelect({
  selectedSectors,
  onSectorsChange,
  onOperationalStreamsChange,
  onComplianceRequirementsChange,
  disabled = false,
  showValidation = true
}: SectorMultiSelectProps) {
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  // Update validation errors when sectors change
  useEffect(() => {
    if (showValidation) {
      const errors = validateSectorCombination(selectedSectors)
      setValidationErrors(errors)
    }
  }, [selectedSectors, showValidation])

  // Update operational streams and compliance requirements when sectors change
  useEffect(() => {
    if (onOperationalStreamsChange) {
      const streams = generateOperationalStreams(selectedSectors)
      onOperationalStreamsChange(streams)
    }
    
    if (onComplianceRequirementsChange) {
      const requirements = generateComplianceRequirements(selectedSectors)
      onComplianceRequirementsChange(requirements)
    }
  }, [selectedSectors, onOperationalStreamsChange, onComplianceRequirementsChange])

  const handleSectorToggle = (sectorCode: string, sectorType: string, checked: boolean) => {
    // Map category IDs to sector type values
    const sectorTypeMap: Record<string, string> = {
      'commodity': 'COMMODITY',
      'value-chain': 'VALUE_CHAIN', 
      'business-model': 'BUSINESS_MODEL',
      'support-services': 'SUPPORT_SERVICES'
    }
    
    const actualSectorType = sectorTypeMap[sectorType] || sectorType
    
    if (checked) {
      // Add sector
      const newSector: SectorSelection = {
        sectorCode,
        sectorType: actualSectorType as any,
        isPrimary: selectedSectors.length === 0 // First sector becomes primary
      }
      onSectorsChange([...selectedSectors, newSector])
    } else {
      // Remove sector
      const updatedSectors = selectedSectors.filter(
        s => !(s.sectorCode === sectorCode && s.sectorType === actualSectorType)
      )
      
      // If we removed the primary sector, make the first remaining sector primary
      if (updatedSectors.length > 0 && !updatedSectors.some(s => s.isPrimary)) {
        updatedSectors[0].isPrimary = true
      }
      
      onSectorsChange(updatedSectors)
    }
  }

  const handlePrimaryToggle = (sectorCode: string, sectorType: string) => {
    // Map category IDs to sector type values
    const sectorTypeMap: Record<string, string> = {
      'commodity': 'COMMODITY',
      'value-chain': 'VALUE_CHAIN', 
      'business-model': 'BUSINESS_MODEL',
      'support-services': 'SUPPORT_SERVICES'
    }
    
    const actualSectorType = sectorTypeMap[sectorType] || sectorType
    
    const updatedSectors = selectedSectors.map(sector => ({
      ...sector,
      isPrimary: sector.sectorCode === sectorCode && sector.sectorType === actualSectorType
    }))
    onSectorsChange(updatedSectors)
  }

  const isSectorSelected = (sectorCode: string, sectorType: string) => {
    // Map category IDs to sector type values for comparison
    const sectorTypeMap: Record<string, string> = {
      'commodity': 'COMMODITY',
      'value-chain': 'VALUE_CHAIN', 
      'business-model': 'BUSINESS_MODEL',
      'support-services': 'SUPPORT_SERVICES'
    }
    
    const expectedSectorType = sectorTypeMap[sectorType] || sectorType
    
    const isSelected = selectedSectors.some(s => 
      s.sectorCode === sectorCode && s.sectorType === expectedSectorType
    )
    
    return isSelected
  }

  const getSelectedSector = (sectorCode: string, sectorType: string) => {
    // Map category IDs to sector type values for comparison
    const sectorTypeMap: Record<string, string> = {
      'commodity': 'COMMODITY',
      'value-chain': 'VALUE_CHAIN', 
      'business-model': 'BUSINESS_MODEL',
      'support-services': 'SUPPORT_SERVICES'
    }
    
    const expectedSectorType = sectorTypeMap[sectorType] || sectorType
    
    return selectedSectors.find(s => 
      s.sectorCode === sectorCode && s.sectorType === expectedSectorType
    )
  }

  const getRiskProfileColor = (riskProfile: string) => {
    switch (riskProfile) {
      case 'LOW': return 'bg-green-100 text-green-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800'
      case 'CRITICAL': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Calculate unique sectors count for display
  const uniqueSectorCodes = new Set(selectedSectors.map(s => s.sectorCode))
  const uniqueCount = uniqueSectorCodes.size

  // Helper function to get unique sectors for a category
  const getUniqueSectorsForCategory = (categoryId: string) => {
    const sectorTypeMap: Record<string, string> = {
      'commodity': 'COMMODITY',
      'value-chain': 'VALUE_CHAIN', 
      'business-model': 'BUSINESS_MODEL',
      'support-services': 'SUPPORT_SERVICES'
    }
    
    const expectedSectorType = sectorTypeMap[categoryId] || categoryId
    const categorySectors = selectedSectors.filter(s => s.sectorType === expectedSectorType)
    
    // Deduplicate sectors by sectorCode
    return categorySectors.reduce((acc, sector) => {
      const existing = acc.find(s => s.sectorCode === sector.sectorCode)
      if (!existing) {
        acc.push(sector)
      } else if (sector.isPrimary && !existing.isPrimary) {
        // If new sector is primary and existing isn't, replace it
        const index = acc.findIndex(s => s.sectorCode === sector.sectorCode)
        acc[index] = sector
      }
      return acc
    }, [] as typeof categorySectors)
  }

  return (
    <div className="space-y-4">
      {/* Sector Selection Tabs */}
      <Tabs defaultValue="commodity" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {SECTOR_CATEGORIES.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
              <category.icon className="h-4 w-4" />
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {SECTOR_CATEGORIES.map(category => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(category.sectors).map(([code, sector]) => {
                  const isSelected = isSectorSelected(code, category.id)
                  const selectedSector = getSelectedSector(code, category.id)
                  
                  return (
                    <Card key={code} className={`${isSelected ? 'ring-2 ring-primary' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => 
                              handleSectorToggle(code, category.id, checked as boolean)
                            }
                            disabled={disabled}
                          />
                          
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-medium cursor-pointer">
                                {sector.name}
                              </Label>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getRiskProfileColor(sector.riskProfile)}`}
                              >
                                {sector.riskProfile}
                              </Badge>
                            </div>
                            
                            <p className="text-xs text-muted-foreground">
                              {sector.description}
                            </p>
                            
                            {isSelected && (
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handlePrimaryToggle(code, category.id)}
                                  disabled={disabled}
                                  className="h-6 px-2"
                                >
                                  <Star className={`h-3 w-3 ${selectedSector?.isPrimary ? 'fill-yellow-400 text-yellow-600' : 'text-gray-400'}`} />
                                  <span className="text-xs ml-1">
                                    {selectedSector?.isPrimary ? 'Primary' : 'Set Primary'}
                                  </span>
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Selected Sectors Display */}
      {selectedSectors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Selected Sectors</CardTitle>
            <CardDescription>
              {uniqueCount} sector{uniqueCount !== 1 ? 's' : ''} selected
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {SECTOR_CATEGORIES.map(category => {
                const uniqueSectors = getUniqueSectorsForCategory(category.id)
                
                if (uniqueSectors.length === 0) return null
                
                return (
                  <div key={category.id}>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <category.icon className="h-4 w-4" />
                      {category.name}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {uniqueSectors.map((sector, index) => (
                        <Badge 
                          key={`${category.id}-${sector.sectorCode}-${index}`} 
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {getSectorName(sector.sectorCode, sector.sectorType)}
                          {sector.isPrimary && <Star className="h-3 w-3 fill-yellow-400 text-yellow-600" />}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Messages */}
      {showValidation && (
        <div className="space-y-2">
          {validationErrors.length > 0 ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          ) : selectedSectors.length > 0 ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Sector combination is valid. Operational streams and compliance requirements will be automatically generated.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Please select at least one commodity sector to continue.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Summary Information */}
      {selectedSectors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Generated Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Operational Streams</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {generateOperationalStreams(selectedSectors).map(stream => (
                  <Badge key={stream} variant="outline" className="text-xs">
                    {stream.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Compliance Requirements</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {generateComplianceRequirements(selectedSectors).map(requirement => (
                  <Badge key={requirement} variant="outline" className="text-xs">
                    {requirement.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 