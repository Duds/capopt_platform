import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schemas
const ResourceUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  type: z.enum(["PHYSICAL", "HUMAN", "INTELLECTUAL", "FINANCIAL"]),
  description: z.string().optional(),
  availability: z.string().optional(),
  cost: z.number().optional()
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

    // Verify the resources exists and belongs to this canvas
    const existingResource = await prisma.resource.findFirst({
      where: {
        id: itemId,
        businessCanvasId: canvasId
      }
    })

    if (!existingResource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    const validatedData = ResourceUpdateSchema.parse(body)

    // Build update data object with only defined values
    const updateData: any = {}
    
    if (validatedData.name !== undefined) updateData.name = validatedData.name
    if (validatedData.type !== undefined) updateData.type = validatedData.type
    if (validatedData.description !== undefined) updateData.description = validatedData.description
    if (validatedData.availability !== undefined) updateData.availability = validatedData.availability
    if (validatedData.cost !== undefined) updateData.cost = validatedData.cost

    const resources = await prisma.resource.update({
      where: { id: itemId },
      data: updateData
    })

    return NextResponse.json(resources)
  } catch (error: any) {
    console.error('Error updating resources:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update resources', details: error.message },
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

    // Verify the resources exists and belongs to this canvas
    const existingResource = await prisma.resource.findFirst({
      where: {
        id: itemId,
        businessCanvasId: canvasId
      }
    })

    if (!existingResource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    await prisma.resource.delete({
      where: { id: itemId }
    })

    return NextResponse.json(
      { message: 'Resource deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error deleting resources:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete resources', details: error.message },
      { status: 500 }
    )
  }
}