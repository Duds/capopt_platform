import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schemas
const valuePropositionUpdateSchema = z.object({
  description: z.string().min(1, 'Description is required').optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
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

    // Verify the value proposition exists and belongs to this canvas
    const existingValueProposition = await prisma.valueProposition.findFirst({
      where: {
        id: itemId,
        businessCanvasId: canvasId
      }
    })

    if (!existingValueProposition) {
      return NextResponse.json(
        { error: 'Value proposition not found' },
        { status: 404 }
      )
    }

    const validatedData = valuePropositionUpdateSchema.parse(body)

    // Build update data object with only defined values
    const updateData: any = {}
    
    if (validatedData.description !== undefined) updateData.description = validatedData.description
    if (validatedData.priority !== undefined) updateData.priority = validatedData.priority

    const valueProposition = await prisma.valueProposition.update({
      where: { id: itemId },
      data: updateData
    })

    return NextResponse.json(valueProposition)
  } catch (error: any) {
    console.error('Error updating value proposition:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Value proposition not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update value proposition', details: error.message },
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

    // Verify the value proposition exists and belongs to this canvas
    const existingValueProposition = await prisma.valueProposition.findFirst({
      where: {
        id: itemId,
        businessCanvasId: canvasId
      }
    })

    if (!existingValueProposition) {
      return NextResponse.json(
        { error: 'Value proposition not found' },
        { status: 404 }
      )
    }

    await prisma.valueProposition.delete({
      where: { id: itemId }
    })

    return NextResponse.json(
      { message: 'Value proposition deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error deleting value proposition:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Value proposition not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete value proposition', details: error.message },
      { status: 500 }
    )
  }
} 