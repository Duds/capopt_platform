import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schemas
const ResourceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["PHYSICAL", "HUMAN", "INTELLECTUAL", "FINANCIAL"]),
  description: z.string().optional(),
  availability: z.string().optional(),
  cost: z.number().optional()
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

    const resources = await prisma.Resource.findMany({
      where: { businessCanvasId: id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(resources)
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resources', details: error instanceof Error ? error.message : 'Unknown error' },
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

    const validatedData = ResourceSchema.parse(body)

    const resources = await prisma.Resource.create({
      data: {
        ...validatedData,
        businessCanvasId: id
      }
    })

    return NextResponse.json(resources, { status: 201 })
  } catch (error: any) {
    console.error('Error creating resources:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create resources', details: error.message },
      { status: 500 }
    )
  }
}