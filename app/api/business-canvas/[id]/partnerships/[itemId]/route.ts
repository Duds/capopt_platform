import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schemas
const PartnershipUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  type: z.string().optional(),
  description: z.string().optional(),
  value: z.string().optional()
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const { id: canvasId, itemId } = params
    const body = await request.json()

    // Verify the canvas exists
    const canvas = await prisma.businessCanvas.findUnique({
      where: { id: canvasId }
    })

    if (!canvas) {
      return NextResponse.json(
        { error: 'Business canvas not found' },
        { status: 404 }
      )
    }

    // Verify the partnerships exists and belongs to this canvas
    const existingPartnership = await prisma.partnership.findFirst({
      where: {
        id: itemId,
        businessCanvasId: canvasId
      }
    })

    if (!existingPartnership) {
      return NextResponse.json(
        { error: 'Partnership not found' },
        { status: 404 }
      )
    }

    const validatedData = PartnershipUpdateSchema.parse(body)

    // Build update data object with only defined values
    const updateData: any = {}
    
    if (validatedData.name !== undefined) updateData.name = validatedData.name
    if (validatedData.type !== undefined) updateData.type = validatedData.type
    if (validatedData.description !== undefined) updateData.description = validatedData.description
    if (validatedData.value !== undefined) updateData.value = validatedData.value

    const partnerships = await prisma.partnership.update({
      where: { id: itemId },
      data: updateData
    })

    return NextResponse.json(partnerships)
  } catch (error: any) {
    console.error('Error updating partnerships:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Partnership not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update partnerships', details: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const { id: canvasId, itemId } = params

    // Verify the canvas exists
    const canvas = await prisma.businessCanvas.findUnique({
      where: { id: canvasId }
    })

    if (!canvas) {
      return NextResponse.json(
        { error: 'Business canvas not found' },
        { status: 404 }
      )
    }

    // Verify the partnerships exists and belongs to this canvas
    const existingPartnership = await prisma.partnership.findFirst({
      where: {
        id: itemId,
        businessCanvasId: canvasId
      }
    })

    if (!existingPartnership) {
      return NextResponse.json(
        { error: 'Partnership not found' },
        { status: 404 }
      )
    }

    await prisma.partnership.delete({
      where: { id: itemId }
    })

    return NextResponse.json(
      { message: 'Partnership deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error deleting partnerships:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Partnership not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete partnerships', details: error.message },
      { status: 500 }
    )
  }
}