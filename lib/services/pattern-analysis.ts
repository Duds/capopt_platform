import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface AssignmentPattern {
  id: string
  type: 'facility' | 'operational' | 'compliance' | 'regulatory'
  industryCode: string
  sectorCodes: string[]
  locationPatterns?: LocationPattern
  assignmentData: AssignmentData
  confidenceScore: number
  usageCount: number
  successRate: number
  createdAt: Date
  updatedAt: Date
}

export interface LocationPattern {
  state?: string
  region?: string
  jurisdiction?: string
  coordinates?: string
}

export interface AssignmentData {
  facilityTypes?: string[]
  operationalStreams?: string[]
  complianceRequirements?: string[]
  regulatoryFrameworks?: string[]
}

export interface PatternAnalysisResult {
  patterns: AssignmentPattern[]
  statistics: {
    totalCanvases: number
    patternsGenerated: number
    averageConfidence: number
  }
}

export class PatternAnalysisService {
  /**
   * Analyze existing business canvases to build initial patterns
   */
  async analyzeExistingCanvases(): Promise<PatternAnalysisResult> {
    console.log('🔍 Starting pattern analysis of existing business canvases...')

    const canvases = await prisma.businessCanvas.findMany({
      where: { isActive: true },
      include: {
        frameworkFacilityTypes: {
          include: { facilityType: true }
        },
        frameworkOperationalStreams: {
          include: { operationalStream: true }
        },
        frameworkComplianceFrameworks: {
          include: { 
            complianceFramework: true,
            RegulatoryFramework: true
          }
        }
      }
    })

    console.log(`📊 Analyzing ${canvases.length} business canvases`)

    const patterns: AssignmentPattern[] = []
    let totalConfidence = 0

    // Group canvases by industry and sectors
    const industrySectorGroups = this.groupCanvasesByIndustrySector(canvases)

    for (const [key, groupCanvases] of Object.entries(industrySectorGroups)) {
      const [industryCode, sectorCodes] = this.parseGroupKey(key)
      
      // Generate patterns for each type
      const facilityPattern = await this.generateFacilityPattern(industryCode, sectorCodes, groupCanvases)
      const operationalPattern = await this.generateOperationalPattern(industryCode, sectorCodes, groupCanvases)
      const compliancePattern = await this.generateCompliancePattern(industryCode, sectorCodes, groupCanvases)

      if (facilityPattern) {
        patterns.push(facilityPattern)
        totalConfidence += facilityPattern.confidenceScore
      }
      if (operationalPattern) {
        patterns.push(operationalPattern)
        totalConfidence += operationalPattern.confidenceScore
      }
      if (compliancePattern) {
        patterns.push(compliancePattern)
        totalConfidence += compliancePattern.confidenceScore
      }
    }

    const averageConfidence = patterns.length > 0 ? totalConfidence / patterns.length : 0

    console.log(`✅ Generated ${patterns.length} patterns with average confidence: ${averageConfidence.toFixed(2)}`)

    return {
      patterns,
      statistics: {
        totalCanvases: canvases.length,
        patternsGenerated: patterns.length,
        averageConfidence
      }
    }
  }

  /**
   * Generate facility type patterns from IndustryFacilityTypeAssociation
   */
  async generateFacilityPatterns(): Promise<AssignmentPattern[]> {
    console.log('🏭 Generating facility type patterns from industry associations...')

    const associations = await prisma.industryFacilityTypeAssociation.findMany({
      where: { isActive: true },
      include: {
        industry: true,
        facilityType: true
      }
    })

    const patterns: AssignmentPattern[] = []
    const industryGroups = this.groupAssociationsByIndustry(associations)

    for (const [industryCode, industryAssociations] of Object.entries(industryGroups)) {
      const facilityTypeCodes = industryAssociations.map(a => a.facilityType.code)
      const confidence = this.calculateConfidence(industryAssociations.length, 1)

      patterns.push({
        id: `facility-${industryCode}-${Date.now()}`,
        type: 'facility',
        industryCode,
        sectorCodes: [], // Will be populated when sectors are available
        assignmentData: {
          facilityTypes: facilityTypeCodes
        },
        confidenceScore: confidence,
        usageCount: industryAssociations.length,
        successRate: 0.8, // Default success rate
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    console.log(`✅ Generated ${patterns.length} facility patterns`)
    return patterns
  }

  /**
   * Group canvases by industry and sectors for pattern analysis
   */
  private groupCanvasesByIndustrySector(canvases: any[]): Record<string, any[]> {
    const groups: Record<string, any[]> = {}

    for (const canvas of canvases) {
      if (!canvas.industry) continue

      const sectorCodes = canvas.sectors || []
      const key = this.createGroupKey(canvas.industry, sectorCodes)
      
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(canvas)
    }

    return groups
  }

  /**
   * Group facility type associations by industry
   */
  private groupAssociationsByIndustry(associations: any[]): Record<string, any[]> {
    const groups: Record<string, any[]> = {}

    for (const association of associations) {
      const industryCode = association.industry.code
      
      if (!groups[industryCode]) {
        groups[industryCode] = []
      }
      groups[industryCode].push(association)
    }

    return groups
  }

  /**
   * Generate facility pattern for a specific industry-sector combination
   */
  private async generateFacilityPattern(
    industryCode: string, 
    sectorCodes: string[], 
    canvases: any[]
  ): Promise<AssignmentPattern | null> {
    const facilityTypes = new Map<string, number>()

    // Count facility type occurrences
    for (const canvas of canvases) {
      for (const facility of canvas.frameworkFacilityTypes) {
        const code = facility.facilityType.code
        facilityTypes.set(code, (facilityTypes.get(code) || 0) + 1)
      }
    }

    if (facilityTypes.size === 0) return null

    // Calculate confidence based on frequency
    const totalCanvases = canvases.length
    const facilityTypeCodes = Array.from(facilityTypes.keys())
    const confidence = this.calculateConfidence(facilityTypes.size, totalCanvases)

    return {
      id: `facility-${industryCode}-${sectorCodes.join('-')}-${Date.now()}`,
      type: 'facility',
      industryCode,
      sectorCodes,
      assignmentData: {
        facilityTypes: facilityTypeCodes
      },
      confidenceScore: confidence,
      usageCount: totalCanvases,
      successRate: 0.8,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  /**
   * Generate operational stream pattern
   */
  private async generateOperationalPattern(
    industryCode: string, 
    sectorCodes: string[], 
    canvases: any[]
  ): Promise<AssignmentPattern | null> {
    const operationalStreams = new Map<string, number>()

    // Count operational stream occurrences
    for (const canvas of canvases) {
      for (const stream of canvas.frameworkOperationalStreams) {
        const code = stream.operationalStream.code
        operationalStreams.set(code, (operationalStreams.get(code) || 0) + 1)
      }
    }

    if (operationalStreams.size === 0) return null

    const totalCanvases = canvases.length
    const streamCodes = Array.from(operationalStreams.keys())
    const confidence = this.calculateConfidence(operationalStreams.size, totalCanvases)

    return {
      id: `operational-${industryCode}-${sectorCodes.join('-')}-${Date.now()}`,
      type: 'operational',
      industryCode,
      sectorCodes,
      assignmentData: {
        operationalStreams: streamCodes
      },
      confidenceScore: confidence,
      usageCount: totalCanvases,
      successRate: 0.8,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  /**
   * Generate compliance pattern
   */
  private async generateCompliancePattern(
    industryCode: string, 
    sectorCodes: string[], 
    canvases: any[]
  ): Promise<AssignmentPattern | null> {
    const complianceRequirements = new Map<string, number>()
    const regulatoryFrameworks = new Map<string, number>()

    // Count compliance and regulatory occurrences
    for (const canvas of canvases) {
      for (const compliance of canvas.frameworkComplianceFrameworks) {
        const complianceCode = compliance.complianceFramework.code
        complianceRequirements.set(complianceCode, (complianceRequirements.get(complianceCode) || 0) + 1)

        if (compliance.RegulatoryFramework) {
          const regulatoryCode = compliance.RegulatoryFramework.code
          regulatoryFrameworks.set(regulatoryCode, (regulatoryFrameworks.get(regulatoryCode) || 0) + 1)
        }
      }
    }

    if (complianceRequirements.size === 0 && regulatoryFrameworks.size === 0) return null

    const totalCanvases = canvases.length
    const complianceCodes = Array.from(complianceRequirements.keys())
    const regulatoryCodes = Array.from(regulatoryFrameworks.keys())
    const confidence = this.calculateConfidence(
      complianceRequirements.size + regulatoryFrameworks.size, 
      totalCanvases
    )

    return {
      id: `compliance-${industryCode}-${sectorCodes.join('-')}-${Date.now()}`,
      type: 'compliance',
      industryCode,
      sectorCodes,
      assignmentData: {
        complianceRequirements: complianceCodes,
        regulatoryFrameworks: regulatoryCodes
      },
      confidenceScore: confidence,
      usageCount: totalCanvases,
      successRate: 0.8,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  /**
   * Calculate confidence score based on frequency and consistency
   */
  private calculateConfidence(frequency: number, total: number): number {
    if (total === 0) return 0
    
    const frequencyRatio = frequency / total
    const consistencyScore = Math.min(frequencyRatio * 2, 1) // Higher frequency = higher confidence
    
    return Math.round(consistencyScore * 100) / 100 // Round to 2 decimal places
  }

  /**
   * Create a unique key for grouping canvases
   */
  private createGroupKey(industry: string, sectors: string[]): string {
    const sortedSectors = sectors.sort().join(',')
    return `${industry}:${sortedSectors}`
  }

  /**
   * Parse group key back to industry and sectors
   */
  private parseGroupKey(key: string): [string, string[]] {
    const [industry, sectorsStr] = key.split(':')
    const sectors = sectorsStr ? sectorsStr.split(',').filter(s => s) : []
    return [industry, sectors]
  }

  /**
   * Save patterns to database
   */
  async savePatterns(patterns: AssignmentPattern[]): Promise<void> {
    console.log(`💾 Saving ${patterns.length} patterns to database...`)

    for (const pattern of patterns) {
      await prisma.assignmentPattern.upsert({
        where: { id: pattern.id },
        update: {
          assignmentData: pattern.assignmentData,
          confidenceScore: pattern.confidenceScore,
          usageCount: pattern.usageCount,
          successRate: pattern.successRate,
          updatedAt: new Date()
        },
        create: {
          id: pattern.id,
          patternType: pattern.type,
          industryCode: pattern.industryCode,
          sectorCodes: pattern.sectorCodes,
          locationPatterns: pattern.locationPatterns,
          assignmentData: pattern.assignmentData,
          confidenceScore: pattern.confidenceScore,
          usageCount: pattern.usageCount,
          successRate: pattern.successRate,
          createdAt: pattern.createdAt,
          updatedAt: pattern.updatedAt
        }
      })
    }

    console.log('✅ Patterns saved successfully')
  }
} 