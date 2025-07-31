import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const businessCanvas = await prisma.businessCanvas.findUnique({
      where: { id },
      include: {
        valuePropositions: true,
        customerSegments: true,
        revenueStreams: true,
        partnerships: true,
        resources: true,
        activities: true,
        costStructures: true,
        channels: true,
        enterprise: true,
        facility: true,
        businessUnit: true
      }
    })

    if (!businessCanvas) {
      return NextResponse.json(
        { error: 'Business canvas not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(businessCanvas)
  } catch (error) {
    console.error('Error fetching business canvas:', error)
    return NextResponse.json(
      { error: 'Failed to fetch business canvas', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    console.log('🔧 API UPDATE - Canvas ID:', id)
    console.log('🔧 API UPDATE - Request body:', JSON.stringify(body, null, 2))

    // Validate that the canvas exists
    const existingCanvas = await prisma.businessCanvas.findUnique({
      where: { id }
    })

    if (!existingCanvas) {
      return NextResponse.json(
        { error: 'Business canvas not found' },
        { status: 404 }
      )
    }

    // Build update data object
    const updateData: any = {}

    // Handle basic fields
    if (body.name !== undefined) updateData.name = body.name
    if (body.description !== undefined) updateData.description = body.description
    if (body.version !== undefined) updateData.version = body.version
    if (body.isActive !== undefined) updateData.isActive = body.isActive
    if (body.status !== undefined) updateData.status = body.status
    if (body.editMode !== undefined) updateData.editMode = body.editMode
    if (body.autoSave !== undefined) updateData.autoSave = body.autoSave

    // Handle enhanced metadata fields
    if (body.legalName !== undefined) updateData.legalName = body.legalName
    if (body.abn !== undefined) updateData.abn = body.abn
    if (body.acn !== undefined) updateData.acn = body.acn
    if (body.industry !== undefined) updateData.industry = body.industry
    if (body.sector !== undefined) updateData.sector = body.sector
    if (body.sectors !== undefined) {
      // Convert SectorSelection[] to string[] for database storage
      const sectorCodes = Array.isArray(body.sectors) 
        ? body.sectors.map((sector: any) => typeof sector === 'string' ? sector : sector.sectorCode)
        : body.sectors
      
      updateData.sectors = sectorCodes
      
      // Extract primary sector from SectorSelection[] objects
      if (Array.isArray(body.sectors) && body.sectors.length > 0) {
        const primarySector = body.sectors.find((sector: any) => sector.isPrimary)
        if (primarySector) {
          updateData.primarySector = typeof primarySector === 'string' ? primarySector : primarySector.sectorCode
        } else {
          // If no primary sector is marked, use the first sector as primary
          updateData.primarySector = sectorCodes[0]
        }
      }
    }
    if (body.sectorTypes !== undefined) updateData.sectorTypes = body.sectorTypes
    if (body.businessType !== undefined) updateData.businessType = body.businessType
    if (body.regional !== undefined) updateData.regional = body.regional
    if (body.primaryLocation !== undefined) updateData.primaryLocation = body.primaryLocation
    if (body.coordinates !== undefined) updateData.coordinates = body.coordinates
    if (body.facilityType !== undefined) updateData.facilityType = body.facilityType
    if (body.operationalStreams !== undefined) updateData.operationalStreams = body.operationalStreams
    if (body.strategicObjective !== undefined) updateData.strategicObjective = body.strategicObjective
    if (body.valueProposition !== undefined) updateData.valueProposition = body.valueProposition
    if (body.competitiveAdvantage !== undefined) updateData.competitiveAdvantage = body.competitiveAdvantage
    if (body.annualRevenue !== undefined) updateData.annualRevenue = body.annualRevenue
    if (body.employeeCount !== undefined) updateData.employeeCount = body.employeeCount
    if (body.riskProfile !== undefined) updateData.riskProfile = body.riskProfile
    if (body.digitalMaturity !== undefined) updateData.digitalMaturity = body.digitalMaturity
    if (body.complianceRequirements !== undefined) updateData.complianceRequirements = body.complianceRequirements
    if (body.regulatoryFramework !== undefined) updateData.regulatoryFramework = body.regulatoryFramework

    // Handle relationship fields (for drag and drop operations)
    if (body.enterpriseId !== undefined) updateData.enterpriseId = body.enterpriseId
    if (body.facilityId !== undefined) updateData.facilityId = body.facilityId
    if (body.businessUnitId !== undefined) updateData.businessUnitId = body.businessUnitId
    if (body.parentCanvasId !== undefined) updateData.parentCanvasId = body.parentCanvasId

    // Update lastSaved timestamp
    updateData.lastSaved = new Date()

    console.log('🔧 API UPDATE - Update data:', JSON.stringify(updateData, null, 2))
    
    const updatedCanvas = await prisma.businessCanvas.update({
      where: { id },
      data: updateData,
      include: {
        valuePropositions: true,
        customerSegments: true,
        revenueStreams: true,
        partnerships: true,
        resources: true,
        activities: true,
        costStructures: true,
        channels: true,
        enterprise: true,
        facility: true,
        businessUnit: true
      }
    })

    console.log('✅ API UPDATE - Canvas updated successfully:', updatedCanvas.name)
    return NextResponse.json(updatedCanvas)
  } catch (error) {
    console.error('❌ API UPDATE - Error updating business canvas:', error)
    console.error('❌ API UPDATE - Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { 
        error: 'Failed to update business canvas', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate that the canvas exists
    const existingCanvas = await prisma.businessCanvas.findUnique({
      where: { id }
    })

    if (!existingCanvas) {
      return NextResponse.json(
        { error: 'Business canvas not found' },
        { status: 404 }
      )
    }

    // Build update data object for partial updates
    const updateData: any = {}

    // Handle status updates (for archive functionality)
    if (body.status !== undefined) {
      updateData.status = body.status
    }

    // Update lastSaved timestamp
    updateData.lastSaved = new Date()

    // If this is an archive operation, cascade to all descendants
    if (body.status === 'ARCHIVED') {
      // Recursive function to get all descendant canvas IDs
      const getAllDescendantIds = async (canvasId: string): Promise<string[]> => {
        const descendants: string[] = []
        
        const getDescendants = async (parentId: string) => {
          const children = await prisma.businessCanvas.findMany({
            where: { parentCanvasId: parentId },
            select: { id: true }
          })
          
          for (const child of children) {
            descendants.push(child.id)
            await getDescendants(child.id) // Recursively get grandchildren
          }
        }
        
        await getDescendants(canvasId)
        return descendants
      }

      // Get all descendant canvas IDs
      const descendantIds = await getAllDescendantIds(id)
      const allCanvasIdsToArchive = [id, ...descendantIds]
      
      console.log('📦 CASCADE ARCHIVE - Canvas to archive:', {
        parentId: id,
        parentName: existingCanvas.name,
        descendantCount: descendantIds.length,
        descendantIds,
        totalToArchive: allCanvasIdsToArchive.length
      })

      // Archive all canvases in a transaction
      await prisma.$transaction(async (tx) => {
        for (const canvasId of allCanvasIdsToArchive) {
          await tx.businessCanvas.update({
            where: { id: canvasId },
            data: { 
              status: 'ARCHIVED',
              lastSaved: new Date()
            }
          })
        }
      })

      // Return the updated parent canvas with cascade info
      const updatedCanvas = await prisma.businessCanvas.findUnique({
        where: { id },
        include: {
          valuePropositions: true,
          customerSegments: true,
          revenueStreams: true,
          partnerships: true,
          resources: true,
          activities: true,
          costStructures: true,
          channels: true,
          enterprise: true,
          facility: true,
          businessUnit: true
        }
      })

      return NextResponse.json({
        ...updatedCanvas,
        cascadeInfo: {
          archivedCount: allCanvasIdsToArchive.length,
          parentCanvas: existingCanvas.name,
          descendantCount: descendantIds.length
        }
      })
    } else {
      // Regular update (non-archive)
      const updatedCanvas = await prisma.businessCanvas.update({
        where: { id },
        data: updateData,
        include: {
          valuePropositions: true,
          customerSegments: true,
          revenueStreams: true,
          partnerships: true,
          resources: true,
          activities: true,
          costStructures: true,
          channels: true,
          enterprise: true,
          facility: true,
          businessUnit: true
        }
      })

      return NextResponse.json(updatedCanvas)
    }
  } catch (error) {
    console.error('Error updating business canvas:', error)
    return NextResponse.json(
      { error: 'Failed to update business canvas', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Validate that the canvas exists
    const existingCanvas = await prisma.businessCanvas.findUnique({
      where: { id }
    })

    if (!existingCanvas) {
      return NextResponse.json(
        { error: 'Business canvas not found' },
        { status: 404 }
      )
    }

    // Recursive function to get all descendant canvas IDs
    const getAllDescendantIds = async (canvasId: string): Promise<string[]> => {
      const descendants: string[] = []
      
      const getDescendants = async (parentId: string) => {
        const children = await prisma.businessCanvas.findMany({
          where: { parentCanvasId: parentId },
          select: { id: true }
        })
        
        for (const child of children) {
          descendants.push(child.id)
          await getDescendants(child.id) // Recursively get grandchildren
        }
      }
      
      await getDescendants(canvasId)
      return descendants
    }

    // Get all descendant canvas IDs
    const descendantIds = await getAllDescendantIds(id)
    const allCanvasIdsToDelete = [id, ...descendantIds]
    
    console.log('🗑️  CASCADE DELETE - Canvas to delete:', {
      parentId: id,
      parentName: existingCanvas.name,
      descendantCount: descendantIds.length,
      descendantIds,
      totalToDelete: allCanvasIdsToDelete.length
    })

    // Delete all canvases in a transaction
    await prisma.$transaction(async (tx) => {
      for (const canvasId of allCanvasIdsToDelete) {
        await tx.businessCanvas.delete({
          where: { id: canvasId }
        })
      }
    })

    return NextResponse.json(
      { 
        message: 'Business canvas and descendants deleted successfully',
        deletedCount: allCanvasIdsToDelete.length,
        parentCanvas: existingCanvas.name,
        descendantCount: descendantIds.length
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting business canvas:', error)
    return NextResponse.json(
      { error: 'Failed to delete business canvas', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 