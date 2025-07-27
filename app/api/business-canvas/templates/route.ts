import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const isPublic = searchParams.get('isPublic')

    // Build where clause
    const where: any = {}
    if (category) {
      where.category = category
    }
    if (isPublic !== null) {
      where.isPublic = isPublic === 'true'
    }

    const templates = await prisma.canvasTemplate.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: [
        { usageCount: 'desc' },
        { rating: 'desc' },
        { name: 'asc' }
      ]
    })
    
    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.canvas) {
      return NextResponse.json(
        { error: 'Name and canvas data are required' },
        { status: 400 }
      )
    }

    const template = await prisma.canvasTemplate.create({
      data: {
        name: body.name,
        description: body.description,
        category: body.category || 'CUSTOM',
        tags: body.tags || [],
        thumbnail: body.thumbnail,
        canvas: body.canvas,
        isPublic: body.isPublic || false,
        createdById: body.createdById || 'default-user-id' // In real app, get from auth
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
    
    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      { error: 'Failed to create template', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 