import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schemas
const CostStructureUpdateSchema = z.object({
  description: z.string().min(1, "Description is required").optional(),
  category: z.string().optional(),
  amount: z.number().optional(),
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

    // Verify the cost structures exists and belongs to this canvas
    const existingCostStructure = await prisma.costStructure.findFirst({
      where: {
        id: itemId,
        businessCanvasId: canvasId
      }
    })

    if (!existingCostStructure) {
      return NextResponse.json(
        { error: 'CostStructure not found' },
        { status: 404 }
      )
    }

    const validatedData = CostStructureUpdateSchema.parse(body)

    // Build update data object with only defined values
    const updateData: any = {}
    
    if (validatedData.description !== undefined) updateData.description = validatedData.description
    if (validatedData.category !== undefined) updateData.category = validatedData.category
    if (validatedData.amount !== undefined) updateData.amount = validatedData.amount
    if (validatedData.frequency !== undefined) updateData.frequency = validatedData.frequency

    const coststructures = await prisma.costStructure.update({
      where: { id: itemId },
      data: updateData
    })

    return NextResponse.json(coststructures)
  } catch (error: any) {
    console.error('Error updating cost structures:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'CostStructure not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update cost structures', details: error.message },
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

    // Verify the cost structures exists and belongs to this canvas
    const existingCostStructure = await prisma.costStructure.findFirst({
      where: {
        id: itemId,
        businessCanvasId: canvasId
      }
    })

    if (!existingCostStructure) {
      return NextResponse.json(
        { error: 'CostStructure not found' },
        { status: 404 }
      )
    }

    await prisma.costStructure.delete({
      where: { id: itemId }
    })

    return NextResponse.json(
      { message: 'CostStructure deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error deleting cost structures:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'CostStructure not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete cost structures', details: error.message },
      { status: 500 }
    )
  }
}