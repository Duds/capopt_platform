import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schemas
const customerSegmentUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
  size: z.number().optional(),
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

    // Verify the customer segment exists and belongs to this canvas
    const existingCustomerSegment = await prisma.customerSegment.findFirst({
      where: {
        id: itemId,
        businessCanvasId: canvasId
      }
    })

    if (!existingCustomerSegment) {
      return NextResponse.json(
        { error: 'Customer segment not found' },
        { status: 404 }
      )
    }

    const validatedData = customerSegmentUpdateSchema.parse(body)

    // Build update data object with only defined values
    const updateData: any = {}
    
    if (validatedData.name !== undefined) updateData.name = validatedData.name
    if (validatedData.description !== undefined) updateData.description = validatedData.description
    if (validatedData.size !== undefined) updateData.size = validatedData.size
    if (validatedData.priority !== undefined) updateData.priority = validatedData.priority

    const customerSegment = await prisma.customerSegment.update({
      where: { id: itemId },
      data: updateData
    })

    return NextResponse.json(customerSegment)
  } catch (error: any) {
    console.error('Error updating customer segment:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Customer segment not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update customer segment', details: error.message },
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

    // Verify the customer segment exists and belongs to this canvas
    const existingCustomerSegment = await prisma.customerSegment.findFirst({
      where: {
        id: itemId,
        businessCanvasId: canvasId
      }
    })

    if (!existingCustomerSegment) {
      return NextResponse.json(
        { error: 'Customer segment not found' },
        { status: 404 }
      )
    }

    await prisma.customerSegment.delete({
      where: { id: itemId }
    })

    return NextResponse.json(
      { message: 'Customer segment deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error deleting customer segment:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Customer segment not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete customer segment', details: error.message },
      { status: 500 }
    )
  }
} 