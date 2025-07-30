import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schemas
const valuePropositionSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
})

const valuePropositionUpdateSchema = z.object({
  description: z.string().min(1, 'Description is required').optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
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

    const valuePropositions = await prisma.valueProposition.findMany({
      where: { businessCanvasId: id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(valuePropositions)
  } catch (error) {
    console.error('Error fetching value propositions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch value propositions', details: error instanceof Error ? error.message : 'Unknown error' },
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

    const validatedData = valuePropositionSchema.parse(body)

    const valueProposition = await prisma.valueProposition.create({
      data: {
        ...validatedData,
        businessCanvasId: id
      }
    })

    return NextResponse.json(valueProposition, { status: 201 })
  } catch (error: any) {
    console.error('Error creating value proposition:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create value proposition', details: error.message },
      { status: 500 }
    )
  }
} 