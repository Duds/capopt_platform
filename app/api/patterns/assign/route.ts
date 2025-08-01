import { NextRequest, NextResponse } from 'next/server'
import { BasicPatternEngine } from '@/lib/services/pattern-engine'
import { PatternAnalysisService } from '@/lib/services/pattern-analysis'

const patternEngine = new BasicPatternEngine()
const patternAnalysisService = new PatternAnalysisService()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { industry, sectors, location, businessSize, riskProfile } = body

    // Validate required fields
    if (!industry) {
      return NextResponse.json(
        { error: 'Industry is required' },
        { status: 400 }
      )
    }

    if (!sectors || !Array.isArray(sectors) || sectors.length === 0) {
      return NextResponse.json(
        { error: 'At least one sector is required' },
        { status: 400 }
      )
    }

    console.log(`🔧 Pattern assignment requested for industry: ${industry}, sectors: ${sectors.join(', ')}`)

    // Get pattern assignments
    const patternResult = await patternEngine.assignPatterns(
      industry,
      sectors,
      location,
      businessSize,
      riskProfile
    )

    // Get specific assignments for each type
    const facilityTypes = await patternEngine.assignFacilityTypes(industry, sectors)
    const operationalStreams = await patternEngine.assignOperationalStreams(industry, sectors)
    const complianceRequirements = await patternEngine.assignComplianceRequirements(industry, sectors, location)

    // Combine results
    const result = {
      facilityTypes: [...new Set([...patternResult.facilityTypes, ...facilityTypes])],
      operationalStreams: [...new Set([...patternResult.operationalStreams, ...operationalStreams])],
      complianceRequirements: [...new Set([...patternResult.complianceRequirements, ...complianceRequirements.complianceRequirements])],
      regulatoryFrameworks: [...new Set([...patternResult.regulatoryFrameworks, ...complianceRequirements.regulatoryFrameworks])],
      confidence: patternResult.confidence,
      appliedPatterns: patternResult.appliedPatterns,
      assignmentMethod: 'pattern_engine',
      timestamp: new Date().toISOString()
    }

    console.log(`✅ Pattern assignment completed with confidence: ${result.confidence.toFixed(2)}`)
    console.log(`  - Facility Types: ${result.facilityTypes.length}`)
    console.log(`  - Operational Streams: ${result.operationalStreams.length}`)
    console.log(`  - Compliance Requirements: ${result.complianceRequirements.length}`)
    console.log(`  - Regulatory Frameworks: ${result.regulatoryFrameworks.length}`)

    return NextResponse.json(result)

  } catch (error) {
    console.error('❌ Error in pattern assignment:', error)
    return NextResponse.json(
      { 
        error: 'Failed to assign patterns',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const industry = searchParams.get('industry')
    const sectors = searchParams.get('sectors')?.split(',') || []
    const location = searchParams.get('location')

    if (!industry) {
      return NextResponse.json(
        { error: 'Industry parameter is required' },
        { status: 400 }
      )
    }

    console.log(`🔍 Pattern analysis requested for industry: ${industry}`)

    // Analyze existing patterns for this industry
    const analysisResult = await patternAnalysisService.analyzeExistingCanvases()
    
    // Filter patterns for the specific industry
    const industryPatterns = analysisResult.patterns.filter(
      pattern => pattern.industryCode === industry
    )

    // Get facility patterns from industry associations
    const facilityPatterns = await patternAnalysisService.generateFacilityPatterns()
    const industryFacilityPatterns = facilityPatterns.filter(
      pattern => pattern.industryCode === industry
    )

    const result = {
      industry,
      sectors,
      location,
      patterns: {
        total: analysisResult.statistics.patternsGenerated,
        industrySpecific: industryPatterns.length,
        facilityPatterns: industryFacilityPatterns.length,
        averageConfidence: analysisResult.statistics.averageConfidence
      },
      patternDetails: {
        facility: industryPatterns.filter(p => p.type === 'facility'),
        operational: industryPatterns.filter(p => p.type === 'operational'),
        compliance: industryPatterns.filter(p => p.type === 'compliance'),
        regulatory: industryPatterns.filter(p => p.type === 'regulatory')
      },
      statistics: analysisResult.statistics
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('❌ Error in pattern analysis:', error)
    return NextResponse.json(
      { 
        error: 'Failed to analyze patterns',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 