import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface FrameworkItem {
  id: string
  code: string
  name: string
  description?: string | null
  category: string
  sector?: string | null
  isAutoApplied: boolean
}

interface FrameworksResponse {
  operationalStreams?: FrameworkItem[]
  complianceFrameworks?: FrameworkItem[]
  facilityTypes?: FrameworkItem[]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const industry = searchParams.get('industry')
    const sector = searchParams.get('sector')
    const type = searchParams.get('type') // 'operational', 'compliance', 'facility'

    if (!industry) {
      return NextResponse.json(
        { error: 'Industry parameter is required' },
        { status: 400 }
      )
    }

    let frameworks: FrameworksResponse = {}

    // Get operational streams
    if (!type || type === 'operational') {
      let operationalStreams = await prisma.industryOperationalStreams.findMany({
        where: {
          industry: { code: industry },
          sector: sector || undefined,
          isActive: true
        },
        orderBy: {
          sortOrder: 'asc'
        }
      })

      // If no sector-specific streams found and sector is specified, try industry-level (no sector)
      if (operationalStreams.length === 0 && sector) {
        operationalStreams = await prisma.industryOperationalStreams.findMany({
          where: {
            industry: { code: industry },
            sector: '',
            isActive: true
          },
          orderBy: {
            sortOrder: 'asc'
          }
        })
      }

      frameworks.operationalStreams = operationalStreams.map(stream => ({
        id: stream.id,
        code: stream.streamName,
        name: stream.streamName,
        description: stream.description,
        category: stream.category,
        sector: stream.sector || null,
        isAutoApplied: true
      }))
    }

    // Get compliance frameworks
    if (!type || type === 'compliance') {
      let complianceFrameworks = await prisma.industryComplianceFramework.findMany({
        where: {
          industry: { code: industry },
          sector: sector || undefined,
          isActive: true
        },
        orderBy: {
          sortOrder: 'asc'
        }
      })

      // If no sector-specific frameworks found and sector is specified, try industry-level (no sector)
      if (complianceFrameworks.length === 0 && sector) {
        complianceFrameworks = await prisma.industryComplianceFramework.findMany({
          where: {
            industry: { code: industry },
            sector: '',
            isActive: true
          },
          orderBy: {
            sortOrder: 'asc'
          }
        })
      }

      frameworks.complianceFrameworks = complianceFrameworks.map(framework => ({
        id: framework.id,
        code: framework.frameworkName,
        name: framework.frameworkName,
        description: framework.description,
        category: framework.category,
        jurisdiction: 'INDUSTRY',
        priority: 'MEDIUM',
        sector: framework.sector || null,
        isAutoApplied: true
      }))
    }

    // Get facility types
    if (!type || type === 'facility') {
      const facilityTypes = await prisma.industryFacilityTypeAssociation.findMany({
        where: {
          industry: { code: industry },
          isApplicable: true
        },
        include: {
          facilityType: true
        },
        orderBy: {
          sortOrder: 'asc'
        }
      })

      frameworks.facilityTypes = facilityTypes.map(facility => ({
        id: facility.facilityTypeId,
        code: facility.facilityType.code,
        name: facility.customName || facility.facilityType.name,
        description: facility.customDescription || facility.facilityType.description,
        category: facility.facilityType.category,
        riskProfile: facility.riskProfile,
        isAutoApplied: true
      }))
    }

    return NextResponse.json(frameworks)
  } catch (error) {
    console.error('Error fetching frameworks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch frameworks', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { canvasId, frameworks }: { canvasId: string; frameworks: FrameworksResponse } = body

    if (!canvasId || !frameworks) {
      return NextResponse.json(
        { error: 'Canvas ID and frameworks are required' },
        { status: 400 }
      )
    }

    const results = {
      operationalStreams: { added: 0, errors: [] },
      complianceFrameworks: { added: 0, errors: [] },
      facilityTypes: { added: 0, errors: [] }
    }

    // Apply operational streams
    if (frameworks.operationalStreams) {
      for (const stream of frameworks.operationalStreams) {
        try {
          await prisma.businessCanvasOperationalStreams.upsert({
            where: {
              businessCanvasId_operationalStreamId: {
                businessCanvasId: canvasId,
                operationalStreamId: stream.id
              }
            },
            update: {
              isAutoApplied: false // Manual application
            },
            create: {
              businessCanvasId: canvasId,
              operationalStreamId: stream.id,
              isAutoApplied: false
            }
          })
          results.operationalStreams.added++
        } catch (error) {
          results.operationalStreams.errors.push(`Failed to add operational stream ${stream.id}: ${error}`)
        }
      }
    }

    // Apply compliance frameworks
    if (frameworks.complianceFrameworks) {
      for (const framework of frameworks.complianceFrameworks) {
        try {
          await prisma.businessCanvasComplianceFrameworks.upsert({
            where: {
              businessCanvasId_complianceFrameworkId: {
                businessCanvasId: canvasId,
                complianceFrameworkId: framework.id
              }
            },
            update: {
              isAutoApplied: false
            },
            create: {
              businessCanvasId: canvasId,
              complianceFrameworkId: framework.id,
              isAutoApplied: false
            }
          })
          results.complianceFrameworks.added++
        } catch (error) {
          results.complianceFrameworks.errors.push(`Failed to add compliance framework ${framework.id}: ${error}`)
        }
      }
    }

    // Apply facility types
    if (frameworks.facilityTypes) {
      for (const facilityType of frameworks.facilityTypes) {
        try {
          await prisma.businessCanvasFacilityTypes.upsert({
            where: {
              businessCanvasId_facilityTypeId: {
                businessCanvasId: canvasId,
                facilityTypeId: facilityType.id
              }
            },
            update: {
              isAutoApplied: false
            },
            create: {
              businessCanvasId: canvasId,
              facilityTypeId: facilityType.id,
              isAutoApplied: false
            }
          })
          results.facilityTypes.added++
        } catch (error) {
          results.facilityTypes.errors.push(`Failed to add facility type ${facilityType.id}: ${error}`)
        }
      }
    }

    return NextResponse.json({
      message: 'Frameworks applied successfully',
      results
    })
  } catch (error) {
    console.error('Error applying frameworks:', error)
    return NextResponse.json(
      { error: 'Failed to apply frameworks', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 