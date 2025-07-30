import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schemas
const ChannelUpdateSchema = z.object({
  type: z.string().min(1, "Type is required").optional(),
  description: z.string().optional(),
  effectiveness: z.string().optional(),
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

    // Verify the channels exists and belongs to this canvas
    const existingChannel = await prisma.channel.findFirst({
      where: {
        id: itemId,
        businessCanvasId: canvasId
      }
    })

    if (!existingChannel) {
      return NextResponse.json(
        { error: 'Channel not found' },
        { status: 404 }
      )
    }

    const validatedData = ChannelUpdateSchema.parse(body)

    // Build update data object with only defined values
    const updateData: any = {}
    
    if (validatedData.type !== undefined) updateData.type = validatedData.type
    if (validatedData.description !== undefined) updateData.description = validatedData.description
    if (validatedData.effectiveness !== undefined) updateData.effectiveness = validatedData.effectiveness
    if (validatedData.cost !== undefined) updateData.cost = validatedData.cost

    const channels = await prisma.channel.update({
      where: { id: itemId },
      data: updateData
    })

    return NextResponse.json(channels)
  } catch (error: any) {
    console.error('Error updating channels:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Channel not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update channels', details: error.message },
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

    // Verify the channels exists and belongs to this canvas
    const existingChannel = await prisma.channel.findFirst({
      where: {
        id: itemId,
        businessCanvasId: canvasId
      }
    })

    if (!existingChannel) {
      return NextResponse.json(
        { error: 'Channel not found' },
        { status: 404 }
      )
    }

    await prisma.channel.delete({
      where: { id: itemId }
    })

    return NextResponse.json(
      { message: 'Channel deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error deleting channels:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Channel not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete channels', details: error.message },
      { status: 500 }
    )
  }
}