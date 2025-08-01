import { PrismaClient } from '@prisma/client'
import { AssignmentPattern, AssignmentData, LocationPattern } from './pattern-analysis'

const prisma = new PrismaClient()

export interface PatternAssignmentResult {
  facilityTypes: string[]
  operationalStreams: string[]
  complianceRequirements: string[]
  regulatoryFrameworks: string[]
  confidence: number
  appliedPatterns: string[]
}

export interface PatternRule {
  id: string
  type: 'facility' | 'operational' | 'compliance' | 'regulatory'
  conditions: {
    industry: string
    sectors: string[]
    location?: LocationPattern
    businessSize?: 'SMALL' | 'MEDIUM' | 'LARGE'
    riskProfile?: string
  }
  assignments: AssignmentData
  confidence: number
  priority: number
}

export class BasicPatternEngine {
  /**
   * Assign patterns for a business canvas based on industry, sectors, and location
   */
  async assignPatterns(
    industry: string,
    sectors: string[],
    location?: string,
    businessSize?: 'SMALL' | 'MEDIUM' | 'LARGE',
    riskProfile?: string
  ): Promise<PatternAssignmentResult> {
    console.log(`🔧 Assigning patterns for industry: ${industry}, sectors: ${sectors.join(', ')}`)

    // Get matching patterns from database
    const patterns = await this.getMatchingPatterns(industry, sectors, location)
    
    // Apply patterns and calculate confidence
    const result = this.applyPatterns(patterns, businessSize, riskProfile)
    
    console.log(`✅ Assigned patterns with confidence: ${result.confidence.toFixed(2)}`)
    
    return result
  }

  /**
   * Get facility types based on industry and sectors using existing associations
   */
  async assignFacilityTypes(industry: string, sectors: string[]): Promise<string[]> {
    console.log(`🏭 Assigning facility types for industry: ${industry}, sectors: ${sectors.join(', ')}`)

    try {
      // Get industry ID
      const industryRecord = await prisma.industry.findUnique({
        where: { code: industry }
      })

      if (!industryRecord) {
        console.warn(`⚠️ Industry not found: ${industry}`)
        return []
      }

      // Get facility type associations
      const associations = await prisma.industryFacilityTypeAssociation.findMany({
        where: {
          industryId: industryRecord.id,
          isActive: true
        },
        include: {
          facilityType: true
        },
        orderBy: { sortOrder: 'asc' }
      })

      // Filter by sectors if specified
      let filteredAssociations = associations
      if (sectors.length > 0) {
        // For now, return all facility types for the industry
        // In the future, we can implement sector-specific filtering
        console.log(`📊 Found ${associations.length} facility types for industry ${industry}`)
      }

      const facilityTypeCodes = filteredAssociations.map(a => a.facilityType.code)
      
      console.log(`✅ Assigned ${facilityTypeCodes.length} facility types`)
      return facilityTypeCodes
    } catch (error) {
      console.error('❌ Error assigning facility types:', error)
      return []
    }
  }

  /**
   * Get operational streams based on industry and sectors
   */
  async assignOperationalStreams(industry: string, sectors: string[]): Promise<string[]> {
    console.log(`⚙️ Assigning operational streams for industry: ${industry}, sectors: ${sectors.join(', ')}`)

    try {
      // Get industry ID
      const industryRecord = await prisma.industry.findUnique({
        where: { code: industry }
      })

      if (!industryRecord) {
        console.warn(`⚠️ Industry not found: ${industry}`)
        return []
      }

      // Get operational stream associations
      const associations = await prisma.industryOperationalStreams.findMany({
        where: {
          industryId: industryRecord.id,
          isActive: true
        },
        orderBy: { sortOrder: 'asc' }
      })

      // Filter by sectors if specified
      let filteredAssociations = associations
      if (sectors.length > 0) {
        // Filter by sector-specific streams
        filteredAssociations = associations.filter(a => 
          !a.sector || sectors.includes(a.sector)
        )
        
        // If no sector-specific streams found, fall back to industry-level streams
        if (filteredAssociations.length === 0) {
          filteredAssociations = associations.filter(a => 
            !a.sector || a.sector === '' || a.sector === null
          )
        }
      }

      const streamCodes = filteredAssociations.map(a => a.streamName)
      
      console.log(`✅ Assigned ${streamCodes.length} operational streams`)
      return streamCodes
    } catch (error) {
      console.error('❌ Error assigning operational streams:', error)
      return []
    }
  }

  /**
   * Get compliance requirements and regulatory frameworks based on industry, sectors, and location
   */
  async assignComplianceRequirements(
    industry: string,
    sectors: string[],
    location?: string
  ): Promise<{ complianceRequirements: string[], regulatoryFrameworks: string[] }> {
    console.log(`🛡️ Assigning compliance requirements for industry: ${industry}, sectors: ${sectors.join(', ')}`)

    try {
      // Get industry ID
      const industryRecord = await prisma.industry.findUnique({
        where: { code: industry }
      })

      if (!industryRecord) {
        console.warn(`⚠️ Industry not found: ${industry}`)
        return { complianceRequirements: [], regulatoryFrameworks: [] }
      }

      // Get compliance framework associations
      const associations = await prisma.industryComplianceFramework.findMany({
        where: {
          industryId: industryRecord.id,
          isActive: true
        },
        orderBy: { sortOrder: 'asc' }
      })

      // Filter by sectors if specified
      let filteredAssociations = associations
      if (sectors.length > 0) {
        // Filter by sector-specific frameworks
        filteredAssociations = associations.filter(a => 
          !a.sector || sectors.includes(a.sector)
        )
        
        // If no sector-specific frameworks found, fall back to industry-level frameworks
        if (filteredAssociations.length === 0) {
          filteredAssociations = associations.filter(a => 
            !a.sector || a.sector === '' || a.sector === null
          )
        }
      }

      const complianceRequirements = filteredAssociations.map(a => a.frameworkName)
      const regulatoryFrameworks = filteredAssociations
        .filter(a => a.regulatoryFramework && a.regulatoryFramework.length > 0)
        .flatMap(a => a.regulatoryFramework)

      // Add location-specific requirements
      if (location) {
        const locationRequirements = await this.getLocationSpecificRequirements(location, industry)
        complianceRequirements.push(...locationRequirements.compliance)
        regulatoryFrameworks.push(...locationRequirements.regulatory)
      }

      console.log(`✅ Assigned ${complianceRequirements.length} compliance requirements and ${regulatoryFrameworks.length} regulatory frameworks`)
      
      return {
        complianceRequirements: [...new Set(complianceRequirements)],
        regulatoryFrameworks: [...new Set(regulatoryFrameworks)]
      }
    } catch (error) {
      console.error('❌ Error assigning compliance requirements:', error)
      return { complianceRequirements: [], regulatoryFrameworks: [] }
    }
  }

  /**
   * Get matching patterns from database
   */
  private async getMatchingPatterns(
    industry: string,
    sectors: string[],
    location?: string
  ): Promise<AssignmentPattern[]> {
    try {
      const patterns = await prisma.assignmentPattern.findMany({
        where: {
          industryCode: industry,
          sectorCodes: {
            hasEvery: sectors
          }
        },
        orderBy: [
          { confidenceScore: 'desc' },
          { usageCount: 'desc' }
        ]
      })

      return patterns
    } catch (error) {
      console.error('❌ Error getting matching patterns:', error)
      return []
    }
  }

  /**
   * Apply patterns to generate assignments
   */
  private applyPatterns(
    patterns: AssignmentPattern[],
    businessSize?: 'SMALL' | 'MEDIUM' | 'LARGE',
    riskProfile?: string
  ): PatternAssignmentResult {
    const facilityTypes = new Set<string>()
    const operationalStreams = new Set<string>()
    const complianceRequirements = new Set<string>()
    const regulatoryFrameworks = new Set<string>()
    const appliedPatterns: string[] = []
    let totalConfidence = 0

    for (const pattern of patterns) {
      appliedPatterns.push(pattern.id)
      totalConfidence += pattern.confidenceScore

      // Apply facility types
      if (pattern.assignmentData.facilityTypes) {
        pattern.assignmentData.facilityTypes.forEach(ft => facilityTypes.add(ft))
      }

      // Apply operational streams
      if (pattern.assignmentData.operationalStreams) {
        pattern.assignmentData.operationalStreams.forEach(os => operationalStreams.add(os))
      }

      // Apply compliance requirements
      if (pattern.assignmentData.complianceRequirements) {
        pattern.assignmentData.complianceRequirements.forEach(cr => complianceRequirements.add(cr))
      }

      // Apply regulatory frameworks
      if (pattern.assignmentData.regulatoryFrameworks) {
        pattern.assignmentData.regulatoryFrameworks.forEach(rf => regulatoryFrameworks.add(rf))
      }
    }

    const averageConfidence = patterns.length > 0 ? totalConfidence / patterns.length : 0

    return {
      facilityTypes: Array.from(facilityTypes),
      operationalStreams: Array.from(operationalStreams),
      complianceRequirements: Array.from(complianceRequirements),
      regulatoryFrameworks: Array.from(regulatoryFrameworks),
      confidence: averageConfidence,
      appliedPatterns
    }
  }

  /**
   * Get location-specific compliance requirements
   */
  private async getLocationSpecificRequirements(
    location: string,
    industry: string
  ): Promise<{ compliance: string[], regulatory: string[] }> {
    const compliance: string[] = []
    const regulatory: string[] = []

    // Extract state from location
    const state = this.extractStateFromLocation(location)
    
    if (state) {
      // Add state-specific requirements
      const stateRequirements = this.getStateSpecificRequirements(state, industry)
      compliance.push(...stateRequirements.compliance)
      regulatory.push(...stateRequirements.regulatory)
    }

    // Add federal requirements
    const federalRequirements = this.getFederalRequirements(industry)
    compliance.push(...federalRequirements.compliance)
    regulatory.push(...federalRequirements.regulatory)

    return { compliance, regulatory }
  }

  /**
   * Extract state from location string
   */
  private extractStateFromLocation(location: string): string | null {
    const statePatterns = [
      /NSW|New South Wales/i,
      /VIC|Victoria/i,
      /QLD|Queensland/i,
      /WA|Western Australia/i,
      /SA|South Australia/i,
      /TAS|Tasmania/i,
      /NT|Northern Territory/i,
      /ACT|Australian Capital Territory/i
    ]

    for (const pattern of statePatterns) {
      const match = location.match(pattern)
      if (match) {
        return match[0].toUpperCase()
      }
    }

    return null
  }

  /**
   * Get state-specific compliance requirements
   */
  private getStateSpecificRequirements(state: string, industry: string): { compliance: string[], regulatory: string[] } {
    const requirements: Record<string, { compliance: string[], regulatory: string[] }> = {
      'NSW': {
        compliance: ['NSW_WHS_ACT_2011', 'NSW_ENVIRONMENTAL_PROTECTION_ACT'],
        regulatory: ['NSW_EPA_FRAMEWORK']
      },
      'VIC': {
        compliance: ['VIC_OHSA_2004', 'VIC_ENVIRONMENTAL_PROTECTION_ACT'],
        regulatory: ['VIC_EPA_FRAMEWORK']
      },
      'QLD': {
        compliance: ['QLD_WHS_ACT_2011', 'QLD_ENVIRONMENTAL_PROTECTION_ACT'],
        regulatory: ['QLD_EPA_FRAMEWORK']
      },
      'WA': {
        compliance: ['WA_WHS_ACT_2020', 'WA_ENVIRONMENTAL_PROTECTION_ACT'],
        regulatory: ['WA_EPA_FRAMEWORK']
      },
      'SA': {
        compliance: ['SA_WHS_ACT_2012', 'SA_ENVIRONMENTAL_PROTECTION_ACT'],
        regulatory: ['SA_EPA_FRAMEWORK']
      },
      'TAS': {
        compliance: ['TAS_WHS_ACT_2012', 'TAS_ENVIRONMENTAL_PROTECTION_ACT'],
        regulatory: ['TAS_EPA_FRAMEWORK']
      },
      'NT': {
        compliance: ['NT_WHS_ACT_2011', 'NT_ENVIRONMENTAL_PROTECTION_ACT'],
        regulatory: ['NT_EPA_FRAMEWORK']
      },
      'ACT': {
        compliance: ['ACT_WHS_ACT_2011', 'ACT_ENVIRONMENTAL_PROTECTION_ACT'],
        regulatory: ['ACT_EPA_FRAMEWORK']
      }
    }

    return requirements[state] || { compliance: [], regulatory: [] }
  }

  /**
   * Get federal compliance requirements
   */
  private getFederalRequirements(industry: string): { compliance: string[], regulatory: string[] } {
    const baseRequirements = {
      compliance: ['WHS_ACT_2011', 'ENVIRONMENTAL_PROTECTION_ACT'],
      regulatory: ['ISO_14001', 'ISO_45001']
    }

    // Add industry-specific federal requirements
    const industrySpecific: Record<string, { compliance: string[], regulatory: string[] }> = {
      'MINING_METALS': {
        compliance: ['MINERALS_RESOURCE_RENT_TAX_ACT', 'PETROLEUM_RESOURCE_RENT_TAX_ACT'],
        regulatory: ['ICMM_FRAMEWORK', 'GLOBAL_REPORTING_INITIATIVE']
      },
      'OIL_GAS': {
        compliance: ['PETROLEUM_ACT', 'OFFSHORE_PETROLEUM_ACT'],
        regulatory: ['ISO_14001', 'ICMM_FRAMEWORK']
      },
      'CHEMICALS': {
        compliance: ['CHEMICAL_ACT', 'HAZARDOUS_WASTE_ACT'],
        regulatory: ['RESPONSIBLE_CARE', 'ISO_14001']
      }
    }

    const specific = industrySpecific[industry] || { compliance: [], regulatory: [] }

    return {
      compliance: [...baseRequirements.compliance, ...specific.compliance],
      regulatory: [...baseRequirements.regulatory, ...specific.regulatory]
    }
  }
} 