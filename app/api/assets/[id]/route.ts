import { NextRequest, NextResponse } from 'next/server'
import { assetUpdateSchema } from '@/lib/validations/asset'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const include = searchParams.get('include')?.split(',') || []

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

    const asset = await prisma.asset.findUnique({
      where: { id: params.id },
      include: includeClause
    })

    if (!asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(asset)
  } catch (error: any) {
    console.error('Error fetching asset:', error)
    return NextResponse.json(
      { error: 'Failed to fetch asset', details: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = assetUpdateSchema.parse(body)

    // Check if asset exists
    const existingAsset = await prisma.asset.findUnique({
      where: { id: params.id }
    })

    if (!existingAsset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      )
    }

    // Build update data object with only defined values
    const updateData: any = {}
    
    if (validatedData.name !== undefined) updateData.name = validatedData.name
    if (validatedData.description !== undefined) updateData.description = validatedData.description
    if (validatedData.type !== undefined) updateData.type = validatedData.type
    if (validatedData.location !== undefined) updateData.location = validatedData.location
    if (validatedData.status !== undefined) updateData.status = validatedData.status
    if (validatedData.criticality !== undefined) updateData.criticality = validatedData.criticality

    const asset = await prisma.asset.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json(asset)
  } catch (error: any) {
    console.error('Error updating asset:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update asset', details: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if asset exists
    const existingAsset = await prisma.asset.findUnique({
      where: { id: params.id }
    })

    if (!existingAsset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      )
    }

    // Delete related records first
    await prisma.assetControl.deleteMany({
      where: { assetId: params.id }
    })

    await prisma.assetRisk.deleteMany({
      where: { assetId: params.id }
    })

    await prisma.assetProtection.deleteMany({
      where: { assetId: params.id }
    })

    await prisma.assetMonitor.deleteMany({
      where: { assetId: params.id }
    })

    await prisma.assetOptimisation.deleteMany({
      where: { assetId: params.id }
    })

    // Delete the asset
    await prisma.asset.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      { message: 'Asset deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error deleting asset:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete asset', details: error.message },
      { status: 500 }
    )
  }
} 