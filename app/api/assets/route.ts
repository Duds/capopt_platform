import { NextRequest, NextResponse } from 'next/server'
import { assetSchema, assetUpdateSchema } from '@/lib/validations/asset'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const criticality = searchParams.get('criticality')
    const createdById = searchParams.get('createdById')
    const include = searchParams.get('include')?.split(',') || []

    // Build where clause
    const where: any = {}
    if (type) where.type = type
    if (status) where.status = status
    if (criticality) where.criticality = criticality
    if (createdById) where.createdById = createdById

    // Build include clause
    const includeClause: any = {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }

    if (include.includes('risks')) {
      includeClause.risks = true
    }

    if (include.includes('protections')) {
      includeClause.protections = true
    }

    if (include.includes('monitors')) {
      includeClause.monitors = true
    }

    if (include.includes('optimisations')) {
      includeClause.optimisations = true
    }

    if (include.includes('controls')) {
      includeClause.controls = {
      include: {
          control: {
            select: {
              id: true,
              name: true,
              description: true,
              priority: true,
              complianceStatus: true
          }
        }
      }
      }
    }

    const assets = await prisma.asset.findMany({
      where,
      include: includeClause,
      orderBy: [
        { criticality: 'desc' },
        { name: 'asc' }
      ]
    })
    
    return NextResponse.json(assets)
  } catch (error: any) {
    console.error('Error fetching assets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assets', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = assetSchema.parse(body)
    
    // Get the first user as default creator if not provided
    let createdById = validatedData.createdById
    if (!createdById) {
      const defaultUser = await prisma.user.findFirst()
      if (!defaultUser) {
        return NextResponse.json(
          { error: 'No users found in system' },
          { status: 400 }
        )
      }
      createdById = defaultUser.id
    }
    
    // Build data object with only defined values
    const data: any = {
      name: validatedData.name,
      type: validatedData.type,
      createdBy: {
        connect: { id: createdById }
      }
    }
    
    if (validatedData.description !== undefined) data.description = validatedData.description
    if (validatedData.location !== undefined) data.location = validatedData.location
    if (validatedData.status !== undefined) data.status = validatedData.status
    if (validatedData.criticality !== undefined) data.criticality = validatedData.criticality

    // Handle nested relationships
    if (validatedData.risks) {
      data.risks = {
        create: validatedData.risks
      }
    }

    if (validatedData.protections) {
      data.protections = {
        create: validatedData.protections
      }
    }

    if (validatedData.monitors) {
      data.monitors = {
        create: validatedData.monitors
      }
    }

    if (validatedData.optimisations) {
      data.optimisations = {
        create: validatedData.optimisations
      }
    }
    
    const asset = await prisma.asset.create({
      data,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        risks: true,
        protections: true,
        monitors: true,
        optimisations: true,
        controls: {
          include: {
            control: {
              select: {
                id: true,
                name: true,
                description: true,
                priority: true,
                complianceStatus: true
              }
            }
          }
        }
      }
    })
    
    return NextResponse.json(asset, { status: 201 })
  } catch (error: any) {
    console.error('Error creating asset:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create asset', details: error.message },
      { status: 500 }
    )
  }
} 