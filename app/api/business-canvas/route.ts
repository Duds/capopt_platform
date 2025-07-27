import { NextRequest, NextResponse } from 'next/server'
import { businessCanvasSchema } from '@/lib/validations/strategic'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get('isActive')
    const include = searchParams.get('include')?.split(',') || []

    // Build where clause
    const where: any = {}
    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    // Build include clause
    const includeClause: any = {}

    if (include.includes('valuePropositions')) {
      includeClause.valuePropositions = true
    }

    if (include.includes('customerSegments')) {
      includeClause.customerSegments = true
    }

    if (include.includes('revenueStreams')) {
      includeClause.revenueStreams = true
    }

    if (include.includes('partnerships')) {
      includeClause.partnerships = true
    }

    if (include.includes('resources')) {
      includeClause.resources = true
    }

    if (include.includes('activities')) {
      includeClause.activities = true
    }

    if (include.includes('costStructures')) {
      includeClause.costStructures = true
    }

    if (include.includes('channels')) {
      includeClause.channels = true
    }

    const businessCanvases = await prisma.businessCanvas.findMany({
      where,
      include: includeClause,
      orderBy: [
        { isActive: 'desc' },
        { name: 'asc' }
      ]
    })
    
    // Add cache-busting headers to prevent browser caching
    const response = NextResponse.json(businessCanvases)
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Last-Modified', new Date().toUTCString())
    
    return response
  } catch (error: any) {
    console.error('Error fetching business canvases:', error)
    return NextResponse.json(
      { error: 'Failed to fetch business canvases', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = businessCanvasSchema.parse(body)
    
    // Build data object with only defined values
    const data: any = {
      name: validatedData.name
    }
    
    if (validatedData.description !== undefined) data.description = validatedData.description
    if (validatedData.version !== undefined) data.version = validatedData.version
    if (validatedData.isActive !== undefined) data.isActive = validatedData.isActive

    // Handle nested relationships
    if (validatedData.valuePropositions) {
      data.valuePropositions = {
        create: validatedData.valuePropositions
      }
    }

    if (validatedData.customerSegments) {
      data.customerSegments = {
        create: validatedData.customerSegments
      }
    }

    if (validatedData.revenueStreams) {
      data.revenueStreams = {
        create: validatedData.revenueStreams
      }
    }

    if (validatedData.partnerships) {
      data.partnerships = {
        create: validatedData.partnerships
      }
    }

    if (validatedData.resources) {
      data.resources = {
        create: validatedData.resources
      }
    }

    if (validatedData.activities) {
      data.activities = {
        create: validatedData.activities
      }
    }

    if (validatedData.costStructures) {
      data.costStructures = {
        create: validatedData.costStructures
      }
    }

    if (validatedData.channels) {
      data.channels = {
        create: validatedData.channels
      }
    }
    
    const businessCanvas = await prisma.businessCanvas.create({
      data,
      include: {
        valuePropositions: true,
        customerSegments: true,
        revenueStreams: true,
        partnerships: true,
        resources: true,
        activities: true,
        costStructures: true,
        channels: true
      }
    })
    
    return NextResponse.json(businessCanvas, { status: 201 })
  } catch (error: any) {
    console.error('Error creating business canvas:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create business canvas', details: error.message },
      { status: 500 }
    )
  }
} 