import { NextRequest, NextResponse } from 'next/server'
import { businessCanvasSchema } from '@/lib/validations/strategic'
import { prisma } from '@/lib/prisma'
import { applyIndustryFrameworks } from '@/lib/utils/framework-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get('isActive')
    const include = searchParams.get('include')?.split(',') || []
    const enterpriseId = searchParams.get('enterpriseId')
    const facilityId = searchParams.get('facilityId')
    const businessUnitId = searchParams.get('businessUnitId')
    const industry = searchParams.get('industry')
    const sector = searchParams.get('sector')

    // Build where clause
    const where: any = {}
    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }
    if (enterpriseId) {
      where.enterpriseId = enterpriseId
    }
    if (facilityId) {
      where.facilityId = facilityId
    }
    if (businessUnitId) {
      where.businessUnitId = businessUnitId
    }
    if (industry) {
      where.industry = industry
    }
    if (sector) {
      where.sector = sector
    }

    // Build include clause with framework hierarchy relationships
    const includeClause: any = {
      // Canvas content relationships
      valuePropositions: include.includes('valuePropositions'),
      customerSegments: include.includes('customerSegments'),
      revenueStreams: include.includes('revenueStreams'),
      partnerships: include.includes('partnerships'),
      resources: include.includes('resources'),
      activities: include.includes('activities'),
      costStructures: include.includes('costStructures'),
      channels: include.includes('channels'),
      
      // Framework hierarchy relationships
      frameworkOperationalStreams: include.includes('frameworks') ? {
        include: {
          operationalStream: true,
          IndustryOperationalStreams: true
        }
      } : false,
      frameworkComplianceFrameworks: include.includes('frameworks') ? {
        include: {
          complianceFramework: true,
          RegulatoryFramework: true,
          IndustryComplianceFramework: true
        }
      } : false,
      frameworkFacilityTypes: include.includes('frameworks') ? {
        include: {
          facilityType: true,
          IndustryFacilityTypes: true
        }
      } : false,
      
      // Enterprise context relationships
      enterprise: include.includes('enterprise'),
      facility: include.includes('facility'),
      businessUnit: include.includes('businessUnit'),
      parentCanvas: include.includes('hierarchy'),
      childCanvases: include.includes('hierarchy')
    }

    const businessCanvases = await prisma.businessCanvas.findMany({
      where,
      include: includeClause,
      orderBy: [
        { isActive: 'desc' },
        { updatedAt: 'desc' },
        { name: 'asc' }
      ]
    })
    
    // Debug logging to check hierarchy data
    console.log('🔍 API DEBUG - Business Canvases fetched:', businessCanvases.length)
    businessCanvases.forEach(canvas => {
      console.log(`  - ${canvas.name}: parentCanvasId = ${canvas.parentCanvasId || 'ROOT'}`)
      if (canvas.industry) {
        console.log(`    Industry: ${canvas.industry}, Sector: ${canvas.sector || 'N/A'}`)
      }
    })
    
    // Add cache-busting headers to prevent browser caching
    const response = NextResponse.json(businessCanvases)
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Last-Modified', new Date().toUTCString())
    
    return response
  } catch (error) {
    console.error('Error fetching business canvases:', error)
    return NextResponse.json(
      { error: 'Failed to fetch business canvases', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🔍 API DEBUG - Creating canvas with data:', JSON.stringify(body, null, 2))
    
    const validatedData = businessCanvasSchema.parse(body)
    console.log('🔍 API DEBUG - Validated data:', JSON.stringify(validatedData, null, 2))

    // Extract framework-related data
    const {
      industry,
      sector,
      operationalStreams,
      complianceRequirements,
      regulatoryFramework,
      facilityTypes, // Changed from facilityType
      ...canvasData
    } = validatedData

    // Create the business canvas
    const cleanCanvasData = Object.fromEntries(
      Object.entries(canvasData).filter(([_, value]) => value !== undefined)
    ) as any

    const businessCanvas = await prisma.businessCanvas.create({
      data: {
        ...cleanCanvasData,
        ...(industry && { industry }),
        ...(sector && { sector }),
        ...(operationalStreams && { operationalStreams }),
        ...(complianceRequirements && { complianceRequirements }),
        ...(regulatoryFramework && { regulatoryFramework })
      },
      include: {
        valuePropositions: true,
        customerSegments: true,
        revenueStreams: true,
        partnerships: true,
        resources: true,
        activities: true,
        costStructures: true,
        channels: true
      }
    })

    // Apply industry-specific frameworks if industry is specified
    if (industry) {
      const result = await applyIndustryFrameworks(businessCanvas.id, industry, sector, {
        replaceExisting: false,
        markAsAutoApplied: true
      })
      
      if (result.errors.length > 0) {
        console.warn('⚠️ Framework application warnings:', result.errors)
      }
      
      console.log(`✅ Applied ${result.applied.totalFrameworks} frameworks to canvas ${businessCanvas.id}`)
    }

    // Create facility type associations if facilityTypes are provided
    if (facilityTypes && facilityTypes.length > 0) {
      console.log(`🔧 Creating ${facilityTypes.length} facility type associations`)
      
      for (const facilityTypeId of facilityTypes) {
        await prisma.businessCanvasFacilityTypes.upsert({
          where: {
            businessCanvasId_facilityTypeId: {
              businessCanvasId: businessCanvas.id,
              facilityTypeId: facilityTypeId
            }
          },
          update: {
            isAutoApplied: false // Mark as manually selected
          },
          create: {
            businessCanvasId: businessCanvas.id,
            facilityTypeId: facilityTypeId,
            isAutoApplied: false // Mark as manually selected
          }
        })
      }
      
      console.log(`✅ Created ${facilityTypes.length} facility type associations`)
    }

    console.log('✅ Business canvas created successfully:', businessCanvas.id)
    
    return NextResponse.json(businessCanvas, { status: 201 })
  } catch (error) {
    console.error('Error creating business canvas:', error)
    return NextResponse.json(
      { error: 'Failed to create business canvas', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Helper function to apply industry-specific frameworks (legacy - now using utility)
async function applyIndustryFrameworksLegacy(canvasId: string, industry: string, sector?: string) {
  console.log(`🔧 Applying frameworks for industry: ${industry}, sector: ${sector || 'N/A'}`)
  
  try {
    // Apply operational streams
    const operationalStreams = await prisma.industryOperationalStreamAssociation.findMany({
      where: {
        industry: { code: industry },
        sector: sector ? { code: sector } : undefined,
        isApplicable: true
      },
      include: {
        operationalStream: true
      }
    })

    for (const stream of operationalStreams) {
      await prisma.businessCanvasOperationalStreams.upsert({
        where: {
          businessCanvasId_operationalStreamId: {
            businessCanvasId: canvasId,
            operationalStreamId: stream.operationalStreamId
          }
        },
        update: {
          isAutoApplied: true
        },
        create: {
          businessCanvasId: canvasId,
          operationalStreamId: stream.operationalStreamId,
          isAutoApplied: true
        }
      })
    }

    // Apply compliance frameworks
    const complianceFrameworks = await prisma.industryComplianceRequirementAssociation.findMany({
      where: {
        industry: { code: industry },
        sector: sector ? { code: sector } : undefined,
        isApplicable: true
      },
      include: {
        complianceRequirement: true
      }
    })

    for (const framework of complianceFrameworks) {
      await prisma.businessCanvasComplianceFrameworks.upsert({
        where: {
          businessCanvasId_complianceFrameworkId: {
            businessCanvasId: canvasId,
            complianceFrameworkId: framework.complianceRequirementId
          }
        },
        update: {
          isAutoApplied: true
        },
        create: {
          businessCanvasId: canvasId,
          complianceFrameworkId: framework.complianceRequirementId,
          isAutoApplied: true
        }
      })
    }

    // Apply facility types
    const facilityTypes = await prisma.industryFacilityTypeAssociation.findMany({
      where: {
        industry: { code: industry },
        isApplicable: true
      },
      include: {
        facilityType: true
      }
    })

    for (const facilityType of facilityTypes) {
      await prisma.businessCanvasFacilityTypes.upsert({
        where: {
          businessCanvasId_facilityTypeId: {
            businessCanvasId: canvasId,
            facilityTypeId: facilityType.facilityTypeId
          }
        },
        update: {
          isAutoApplied: true
        },
        create: {
          businessCanvasId: canvasId,
          facilityTypeId: facilityType.facilityTypeId,
          isAutoApplied: true
        }
      })
    }

    console.log(`✅ Applied ${operationalStreams.length} operational streams, ${complianceFrameworks.length} compliance frameworks, ${facilityTypes.length} facility types`)
  } catch (error) {
    console.error('❌ Error applying industry frameworks:', error)
    throw error
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Canvas ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    console.log('🔍 API DEBUG - Updating canvas with data:', JSON.stringify(body, null, 2))
    
    const validatedData = businessCanvasSchema.partial().parse(body)
    console.log('🔍 API DEBUG - Validated update data:', JSON.stringify(validatedData, null, 2))

    // Extract framework-related data
    const {
      industry,
      sector,
      operationalStreams,
      complianceRequirements,
      regulatoryFramework,
      facilityTypes,
      ...canvasData
    } = validatedData

    // Update the business canvas
    const cleanCanvasData = Object.fromEntries(
      Object.entries(canvasData).filter(([_, value]) => value !== undefined)
    ) as any

    const businessCanvas = await prisma.businessCanvas.update({
      where: { id },
      data: {
        ...cleanCanvasData,
        ...(industry !== undefined && { industry }),
        ...(sector !== undefined && { sector }),
        ...(operationalStreams !== undefined && { operationalStreams }),
        ...(complianceRequirements !== undefined && { complianceRequirements }),
        ...(regulatoryFramework !== undefined && { regulatoryFramework })
      },
      include: {
        valuePropositions: true,
        customerSegments: true,
        revenueStreams: true,
        partnerships: true,
        resources: true,
        activities: true,
        costStructures: true,
        channels: true,
        frameworkOperationalStreams: {
          include: {
            operationalStream: true
          }
        },
        frameworkComplianceFrameworks: {
          include: {
            complianceFramework: true
          }
        },
        frameworkFacilityTypes: {
          include: {
            facilityType: true
          }
        }
      }
    })

    // Update facility type associations if facilityTypes are provided
    if (facilityTypes !== undefined) {
      console.log(`🔧 Updating facility type associations for canvas ${id}`)
      
      // Remove existing facility type associations
      await prisma.businessCanvasFacilityTypes.deleteMany({
        where: { businessCanvasId: id }
      })
      
      // Create new facility type associations
      if (facilityTypes.length > 0) {
        for (const facilityTypeId of facilityTypes) {
          await prisma.businessCanvasFacilityTypes.create({
            data: {
              businessCanvasId: id,
              facilityTypeId: facilityTypeId,
              isAutoApplied: false // Mark as manually selected
            }
          })
        }
      }
      
      console.log(`✅ Updated facility type associations: ${facilityTypes.length} types`)
    }

    // Re-apply industry-specific frameworks if industry changed
    if (industry !== undefined) {
      const result = await applyIndustryFrameworks(id, industry, sector, {
        replaceExisting: true,
        markAsAutoApplied: true
      })
      
      if (result.errors.length > 0) {
        console.warn('⚠️ Framework re-application warnings:', result.errors)
      }
      
      console.log(`✅ Re-applied ${result.applied.totalFrameworks} frameworks to canvas ${id}`)
    }

    console.log('✅ Business canvas updated successfully:', id)
    
    return NextResponse.json(businessCanvas)
  } catch (error) {
    console.error('Error updating business canvas:', error)
    return NextResponse.json(
      { error: 'Failed to update business canvas', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 