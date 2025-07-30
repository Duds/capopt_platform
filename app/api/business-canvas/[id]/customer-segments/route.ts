import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schemas
const customerSegmentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  size: z.number().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Verify the canvas exists
    const canvas = await prisma.businessCanvas.findUnique({
      where: { id }
    })

    if (!canvas) {
      return NextResponse.json(
        { error: 'Business canvas not found' },
        { status: 404 }
      )
    }

    const customerSegments = await prisma.customerSegment.findMany({
      where: { businessCanvasId: id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(customerSegments)
  } catch (error) {
    console.error('Error fetching customer segments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customer segments', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    // Verify the canvas exists
    const canvas = await prisma.businessCanvas.findUnique({
      where: { id }
    })

    if (!canvas) {
      return NextResponse.json(
        { error: 'Business canvas not found' },
        { status: 404 }
      )
    }

    const validatedData = customerSegmentSchema.parse(body)

    const customerSegment = await prisma.customerSegment.create({
      data: {
        ...validatedData,
        businessCanvasId: id
      }
    })

    return NextResponse.json(customerSegment, { status: 201 })
  } catch (error: any) {
    console.error('Error creating customer segment:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create customer segment', details: error.message },
      { status: 500 }
    )
  }
} 