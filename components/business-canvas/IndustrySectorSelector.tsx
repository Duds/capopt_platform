/**
 * Sector Multi-Select Component
 * 
 * Allows users to select multiple sectors from different categories:
 * - Commodity-based sectors
 * - Value chain sectors  
 * - Business model sectors
 * - Support services sectors
 * 
 * Now uses database-driven data instead of hardcoded values
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
import { useIndustries, type Industry, type Sector } from '@/hooks/use-industries'

interface SectorSelection {
  sectorCode: string
  sectorType: string
  isPrimary: boolean
}

interface SectorMultiSelectProps {
  selectedSectors: SectorSelection[]
  onSectorsChange: (sectors: SectorSelection[]) => void
  disabled?: boolean
  showValidation?: boolean
  industryCode?: string // Add industry code prop to filter sectors
}

// Helper function to categorize sectors based on their database category
const categorizeSectors = (industries: Industry[], industryCode?: string) => {
  // Get sectors from the specified industry or all industries
  let allSectors: Sector[] = []
  
  if (industryCode) {
    // Filter to specific industry
    const targetIndustry = industries.find(ind => ind.code === industryCode)
    allSectors = targetIndustry?.sectors || []
  } else {
    // Get all sectors from all industries
    allSectors = industries.flatMap(industry => industry.sectors)
  }
  
  // Get unique categories from the sectors
  const uniqueCategories = [...new Set(allSectors.map(s => s.category))]
  
  // Create a mapping of category IDs to display names and icons
  const categoryConfig: Record<string, { name: string; description: string; icon: any; required: boolean }> = {
    'COMMODITY': {
      name: 'Commodity-Based',
      description: 'Classified by the type of resource being extracted or produced',
      icon: Building,
      required: true
    },
    'VALUE_CHAIN': {
      name: 'Value Chain',
      description: 'Stage of the industry lifecycle',
      icon: Activity,
      required: false
    },
    'BUSINESS_MODEL': {
      name: 'Business Model',
      description: 'Ownership and operational structure',
      icon: Users,
      required: false
    },
    'SUPPORT_SERVICES': {
      name: 'Support Services',
      description: 'Essential services supporting industry operations',
      icon: Wrench,
      required: false
    }
  }
  
  // Dynamically create categories based on what's in the sectors
  const categories: Record<string, Sector[]> = {}
  
  uniqueCategories.forEach(category => {
    const categoryKey = category.toLowerCase().replace('_', '-')
    categories[categoryKey] = allSectors.filter(s => s.category === category)
  })
  
  return { categories, categoryConfig }
}

// Validation function for sector combinations
const validateSectorCombination = (sectors: SectorSelection[]): string[] => {
  const errors: string[] = []
  
  // Check if at least one commodity sector is selected
  const commoditySectors = sectors.filter(s => s.sectorType === 'COMMODITY')
  if (commoditySectors.length === 0) {
    errors.push('At least one commodity sector must be selected')
  }
  
  // Check if only one sector is primary
  const primarySectors = sectors.filter(s => s.isPrimary)
  if (primarySectors.length > 1) {
    errors.push('Only one sector can be marked as primary')
  }
  
  return errors
}

export function IndustrySectorSelector({
  selectedSectors,
  onSectorsChange,
  disabled = false,
  showValidation = true,
  industryCode
}: SectorMultiSelectProps) {
  const { industries, loading, error } = useIndustries()
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  // Get all sectors from the database
  const allSectors = industries.flatMap(industry => industry.sectors)
  const { categories, categoryConfig } = categorizeSectors(industries, industryCode)

  // Update validation errors when sectors change
  useEffect(() => {
    if (showValidation) {
      const errors = validateSectorCombination(selectedSectors)
      setValidationErrors(errors)
    }
  }, [selectedSectors, showValidation])

  const handleSectorToggle = (sectorCode: string, sectorType: string, checked: boolean) => {
    if (checked) {
      // Add new sector
      const newSector: SectorSelection = {
        sectorCode,
        sectorType,
        isPrimary: selectedSectors.length === 0 // First sector becomes primary
      }
      onSectorsChange([...selectedSectors, newSector])
    } else {
      // Remove sector
      const updatedSectors = selectedSectors.filter(s => 
        !(s.sectorCode === sectorCode && s.sectorType === sectorType)
      )
      
      // If we removed the primary sector and there are other sectors, make the first one primary
      if (selectedSectors.find(s => s.sectorCode === sectorCode && s.sectorType === sectorType)?.isPrimary) {
        if (updatedSectors.length > 0) {
          updatedSectors[0].isPrimary = true
        }
      }
      
      onSectorsChange(updatedSectors)
    }
  }

  const handlePrimaryToggle = (sectorCode: string, sectorType: string) => {
    const updatedSectors = selectedSectors.map(sector => ({
      ...sector,
      isPrimary: sector.sectorCode === sectorCode && sector.sectorType === sectorType
    }))
    onSectorsChange(updatedSectors)
  }

  const isSectorSelected = (sectorCode: string, sectorType: string) => {
    return selectedSectors.some(s => s.sectorCode === sectorCode && s.sectorType === sectorType)
  }

  const getSelectedSector = (sectorCode: string, sectorType: string) => {
    return selectedSectors.find(s => s.sectorCode === sectorCode && s.sectorType === sectorType)
  }

  const getRiskProfileColor = (riskProfile: string) => {
    switch (riskProfile) {
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading sectors...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load sectors: {error}
        </AlertDescription>
      </Alert>
    )
  }

  // Dynamically generate sector categories from database data
  const SECTOR_CATEGORIES = Object.entries(categories)
    .map(([categoryKey, sectorList]) => {
      const category = categoryKey.toUpperCase().replace('-', '_')
      const config = categoryConfig[category]
      
      if (!config) {
        // Fallback for unknown categories
        return {
          id: categoryKey,
          name: category.replace('_', ' '),
          description: 'Sector category',
          icon: Building,
          sectors: sectorList,
          required: false
        }
      }
      
      return {
        id: categoryKey,
        name: config.name,
        description: config.description,
        icon: config.icon,
        sectors: sectorList,
        required: config.required
      }
    })
    .filter(category => category.sectors.length > 0) // Only show categories that have sectors

  return (
    <div className="space-y-4">
      {/* Sector Selection Tabs */}
      <Tabs defaultValue={SECTOR_CATEGORIES[0]?.id || "commodity"} className="w-full">
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${SECTOR_CATEGORIES.length}, 1fr)` }}>
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
              
              {category.sectors.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No sectors available in this category</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.sectors.map((sector) => {
                    const isSelected = isSectorSelected(sector.code, sector.category)
                    const selectedSector = getSelectedSector(sector.code, sector.category)
                    
                    return (
                      <Card key={sector.id} className={`${isSelected ? 'ring-2 ring-primary' : ''}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => 
                                handleSectorToggle(sector.code, sector.category, checked as boolean)
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
                              
                              {sector.description && (
                                <p className="text-xs text-muted-foreground">
                                  {sector.description}
                                </p>
                              )}
                              
                              {isSelected && (
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handlePrimaryToggle(sector.code, sector.category)}
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
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Validation Errors */}
      {showValidation && validationErrors.length > 0 && (
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
      )}

      {/* Selected Sectors Summary */}
      {selectedSectors.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Selected Sectors ({selectedSectors.length})</h4>
          <div className="flex flex-wrap gap-2">
                         {selectedSectors.map((sector: SectorSelection, index) => (
               <Badge key={index} variant="secondary" className="flex items-center gap-1">
                 {sector.isPrimary && <Star className="h-3 w-3 fill-yellow-400 text-yellow-600" />}
                 {sector.sectorCode}
               </Badge>
             ))}
          </div>
        </div>
      )}
    </div>
  )
} 