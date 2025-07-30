import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schemas
const RevenueStreamUpdateSchema = z.object({
  type: z.string().min(1, "Type is required").optional(),
  description: z.string().optional(),
  estimatedValue: z.number().optional(),
  frequency: z.string().optional()
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

    // Verify the revenue streams exists and belongs to this canvas
    const existingRevenueStream = await prisma.revenueStream.findFirst({
      where: {
        id: itemId,
        businessCanvasId: canvasId
      }
    })

    if (!existingRevenueStream) {
      return NextResponse.json(
        { error: 'RevenueStream not found' },
        { status: 404 }
      )
    }

    const validatedData = RevenueStreamUpdateSchema.parse(body)

    // Build update data object with only defined values
    const updateData: any = {}
    
    if (validatedData.type !== undefined) updateData.type = validatedData.type
    if (validatedData.description !== undefined) updateData.description = validatedData.description
    if (validatedData.estimatedValue !== undefined) updateData.estimatedValue = validatedData.estimatedValue
    if (validatedData.frequency !== undefined) updateData.frequency = validatedData.frequency

    const revenuestreams = await prisma.revenueStream.update({
      where: { id: itemId },
      data: updateData
    })

    return NextResponse.json(revenuestreams)
  } catch (error: any) {
    console.error('Error updating revenue streams:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'RevenueStream not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update revenue streams', details: error.message },
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

    // Verify the revenue streams exists and belongs to this canvas
    const existingRevenueStream = await prisma.revenueStream.findFirst({
      where: {
        id: itemId,
        businessCanvasId: canvasId
      }
    })

    if (!existingRevenueStream) {
      return NextResponse.json(
        { error: 'RevenueStream not found' },
        { status: 404 }
      )
    }

    await prisma.revenueStream.delete({
      where: { id: itemId }
    })

    return NextResponse.json(
      { message: 'RevenueStream deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error deleting revenue streams:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'RevenueStream not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete revenue streams', details: error.message },
      { status: 500 }
    )
  }
}