import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
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

    // Handle relationship fields (for drag and drop operations)
    if (body.enterpriseId !== undefined) updateData.enterpriseId = body.enterpriseId
    if (body.facilityId !== undefined) updateData.facilityId = body.facilityId
    if (body.businessUnitId !== undefined) updateData.businessUnitId = body.businessUnitId
    if (body.parentCanvasId !== undefined) updateData.parentCanvasId = body.parentCanvasId

    // Update lastSaved timestamp
    updateData.lastSaved = new Date()

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
  } catch (error) {
    console.error('Error updating business canvas:', error)
    return NextResponse.json(
      { error: 'Failed to update business canvas', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

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

    // Delete the canvas and all related data
    await prisma.businessCanvas.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Business canvas deleted successfully' },
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