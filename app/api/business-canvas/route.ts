import { NextRequest, NextResponse } from 'next/server'
import { businessCanvasSchema } from '@/lib/validations/strategic'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get('isActive')
    const include = searchParams.get('include')?.split(',') || []
    const enterpriseId = searchParams.get('enterpriseId')
    const facilityId = searchParams.get('facilityId')
    const businessUnitId = searchParams.get('businessUnitId')

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

    // Build include clause with basic relationships only
    const includeClause: any = {}

    // Canvas content relationships (these should always exist)
    if (include.includes('valuePropositions')) {
      includeClause.valuePropositions = true
    }
    if (include.includes('customerSegments')) {
      includeClause.customerSegments = true
    }
    if (include.includes('revenueStreams')) {
      includeClause.revenueStreams = true
    }
    if (include.includes('partnerships')) {
      includeClause.partnerships = true
    }
    if (include.includes('resources')) {
      includeClause.resources = true
    }
    if (include.includes('activities')) {
      includeClause.activities = true
    }
    if (include.includes('costStructures')) {
      includeClause.costStructures = true
    }
    if (include.includes('channels')) {
      includeClause.channels = true
    }

    // Note: Enterprise context and enhanced features will be added back
    // once the database schema is fully migrated and tested

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
    
    // Check for duplicate canvas name
    const existingCanvas = await prisma.businessCanvas.findFirst({
      where: {
        name: validatedData.name,
        isActive: true
      }
    })
    
    if (existingCanvas) {
      return NextResponse.json(
        { 
          error: 'Canvas name already exists', 
          details: `A canvas with the name "${validatedData.name}" already exists. Please choose a different name.`,
          code: 'DUPLICATE_NAME'
        },
        { status: 409 }
      )
    }
    
    // Build data object with enhanced fields
    const data: any = {
      name: validatedData.name
    }
    
    if (validatedData.description !== undefined) data.description = validatedData.description
    if (validatedData.version !== undefined) data.version = validatedData.version
    if (validatedData.isActive !== undefined) data.isActive = validatedData.isActive
    if (validatedData.status !== undefined) data.status = validatedData.status
    if (validatedData.editMode !== undefined) data.editMode = validatedData.editMode
    if (validatedData.autoSave !== undefined) data.autoSave = validatedData.autoSave
    if (validatedData.enterpriseId !== undefined) data.enterpriseId = validatedData.enterpriseId
    if (validatedData.facilityId !== undefined) data.facilityId = validatedData.facilityId
    if (validatedData.businessUnitId !== undefined) data.businessUnitId = validatedData.businessUnitId
    if (validatedData.parentCanvasId !== undefined) {
      console.log('🔍 API DEBUG - parentCanvasId received:', validatedData.parentCanvasId, 'type:', typeof validatedData.parentCanvasId)
      
      // Convert empty string to null to prevent foreign key constraint violation
      if (validatedData.parentCanvasId === '' || (typeof validatedData.parentCanvasId === 'string' && validatedData.parentCanvasId.trim() === '')) {
        console.log('🔍 API DEBUG - Converting empty/whitespace string parentCanvasId to null')
        data.parentCanvasId = null
      } else {
        data.parentCanvasId = validatedData.parentCanvasId
      }
    }
    if (validatedData.templateId !== undefined) data.templateId = validatedData.templateId

    // Handle enhanced metadata fields
    if (validatedData.legalName !== undefined) data.legalName = validatedData.legalName
    if (validatedData.abn !== undefined) data.abn = validatedData.abn
    if (validatedData.acn !== undefined) data.acn = validatedData.acn
    if (validatedData.industry !== undefined) data.industry = validatedData.industry
    if (validatedData.sector !== undefined) data.sector = validatedData.sector
    if (validatedData.sectors !== undefined) data.sectors = validatedData.sectors
    if (validatedData.sectorTypes !== undefined) data.sectorTypes = validatedData.sectorTypes
    if (validatedData.businessType !== undefined) data.businessType = validatedData.businessType
    if (validatedData.regional !== undefined) data.regional = validatedData.regional
    if (validatedData.primaryLocation !== undefined) data.primaryLocation = validatedData.primaryLocation
    if (validatedData.coordinates !== undefined) data.coordinates = validatedData.coordinates
    if (validatedData.facilityType !== undefined) data.facilityType = validatedData.facilityType
    if (validatedData.operationalStreams !== undefined) data.operationalStreams = validatedData.operationalStreams
    if (validatedData.strategicObjective !== undefined) data.strategicObjective = validatedData.strategicObjective
    if (validatedData.valueProposition !== undefined) data.valueProposition = validatedData.valueProposition
    if (validatedData.competitiveAdvantage !== undefined) data.competitiveAdvantage = validatedData.competitiveAdvantage
    if (validatedData.annualRevenue !== undefined) data.annualRevenue = validatedData.annualRevenue
    if (validatedData.employeeCount !== undefined) data.employeeCount = validatedData.employeeCount
    if (validatedData.riskProfile !== undefined) data.riskProfile = validatedData.riskProfile
    if (validatedData.digitalMaturity !== undefined) data.digitalMaturity = validatedData.digitalMaturity
    if (validatedData.complianceRequirements !== undefined) data.complianceRequirements = validatedData.complianceRequirements
    if (validatedData.regulatoryFramework !== undefined) data.regulatoryFramework = validatedData.regulatoryFramework

    // Handle nested relationships
    if (validatedData.valuePropositions) {
      data.valuePropositions = {
        create: validatedData.valuePropositions
      }
    }

    if (validatedData.customerSegments) {
      data.customerSegments = {
        create: validatedData.customerSegments
      }
    }

    if (validatedData.revenueStreams) {
      data.revenueStreams = {
        create: validatedData.revenueStreams
      }
    }

    if (validatedData.partnerships) {
      data.partnerships = {
        create: validatedData.partnerships
      }
    }

    if (validatedData.resources) {
      data.resources = {
        create: validatedData.resources
      }
    }

    if (validatedData.activities) {
      data.activities = {
        create: validatedData.activities
      }
    }

    if (validatedData.costStructures) {
      data.costStructures = {
        create: validatedData.costStructures
      }
    }

    if (validatedData.channels) {
      data.channels = {
        create: validatedData.channels
      }
    }
    
    console.log('🔍 API DEBUG - Final data for Prisma:', JSON.stringify(data, null, 2))
    
    const businessCanvas = await prisma.businessCanvas.create({
      data,
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
    
    console.log('🔍 API DEBUG - Canvas created successfully:', businessCanvas.id)
    return NextResponse.json(businessCanvas, { status: 201 })
  } catch (error) {
    console.error('❌ Error creating business canvas:', error)
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { error: 'Failed to create business canvas', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, canvasId } = body

    if (action === 'clone' && canvasId) {
      // Find the canvas to clone
      const sourceCanvas = await prisma.businessCanvas.findUnique({
        where: { id: canvasId },
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

      if (!sourceCanvas) {
        return NextResponse.json(
          { error: 'Source canvas not found' },
          { status: 404 }
        )
      }

      // Create a new canvas with cloned data
      const clonedCanvas = await prisma.businessCanvas.create({
        data: {
          name: `${sourceCanvas.name} (Copy)`,
          description: sourceCanvas.description,
          version: '1.0',
          isActive: true,
          status: 'DRAFT',
          editMode: 'SINGLE_USER',
          autoSave: true,
          enterpriseId: sourceCanvas.enterpriseId,
          facilityId: sourceCanvas.facilityId,
          businessUnitId: sourceCanvas.businessUnitId,
          parentCanvasId: sourceCanvas.parentCanvasId,
          // Clone all related data
          valuePropositions: {
            create: sourceCanvas.valuePropositions.map(vp => ({
              description: vp.description,
              priority: vp.priority
            }))
          },
          customerSegments: {
            create: sourceCanvas.customerSegments.map(cs => ({
              name: cs.name,
              description: cs.description,
              size: cs.size,
              priority: cs.priority
            }))
          },
          revenueStreams: {
            create: sourceCanvas.revenueStreams.map(rs => ({
              type: rs.type,
              description: rs.description,
              estimatedValue: rs.estimatedValue,
              frequency: rs.frequency
            }))
          },
          partnerships: {
            create: sourceCanvas.partnerships.map(p => ({
              name: p.name,
              type: p.type,
              description: p.description,
              value: p.value
            }))
          },
          resources: {
            create: sourceCanvas.resources.map(r => ({
              name: r.name,
              type: r.type,
              description: r.description,
              availability: r.availability,
              cost: r.cost
            }))
          },
          activities: {
            create: sourceCanvas.activities.map(a => ({
              name: a.name,
              description: a.description,
              priority: a.priority,
              cost: a.cost
            }))
          },
          costStructures: {
            create: sourceCanvas.costStructures.map(cs => ({
              description: cs.description,
              category: cs.category,
              amount: cs.amount,
              frequency: cs.frequency
            }))
          },
          channels: {
            create: sourceCanvas.channels.map(c => ({
              type: c.type,
              description: c.description,
              effectiveness: c.effectiveness,
              cost: c.cost
            }))
          }
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

      return NextResponse.json(clonedCanvas, { status: 201 })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error cloning business canvas:', error)
    return NextResponse.json(
      { error: 'Failed to clone business canvas', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 