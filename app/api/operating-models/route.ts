/**
 * Operating Models API Routes
 * 
 * Provides REST API endpoints for Operating Model Canvas management:
 * - GET: Retrieve operating models with filtering and pagination
 * - POST: Create new operating models
 * - PATCH: Update existing operating models
 * - DELETE: Delete operating models
 * 
 * Supports enterprise context, collaboration, and version control.
 */

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { CanvasStatus, EditMode } from '@/components/operating-model/types'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const enterpriseId = searchParams.get('enterpriseId')
    const facilityId = searchParams.get('facilityId')
    const businessUnitId = searchParams.get('businessUnitId')

    const where: any = {
      isActive: true
    }

    if (enterpriseId) where.enterpriseId = enterpriseId
    if (facilityId) where.facilityId = facilityId
    if (businessUnitId) where.businessUnitId = businessUnitId

    const operatingModels = await prisma.operatingModel.findMany({
      where,
      include: {
        suppliers: true,
        locations: true,
        valueChains: {
          include: {
            activities: true,
            inputs: true,
            outputs: true,
            metrics: true
          }
        },
        organisation: true,
        information: true,
        managementSystems: true,
        enterprise: true,
        facility: true,
        businessUnit: true,
        businessCanvas: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: operatingModels
    })
  } catch (error) {
    console.error('Error fetching operating models:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch operating models' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      description, 
      enterpriseId, 
      facilityId, 
      businessUnitId, 
      businessCanvasId,
      createdBy 
    } = body

    if (!name || !createdBy) {
      return NextResponse.json(
        { success: false, error: 'Name and createdBy are required' },
        { status: 400 }
      )
    }

    const operatingModel = await prisma.operatingModel.create({
      data: {
        name,
        description,
        enterpriseId,
        facilityId,
        businessUnitId,
        businessCanvasId,
        createdBy,
        status: CanvasStatus.DRAFT,
        editMode: EditMode.SINGLE_USER,
        autoSave: true,
        suppliers: {
          create: []
        },
        locations: {
          create: []
        },
        valueChains: {
          create: []
        },
        organisation: {
          create: []
        },
        information: {
          create: []
        },
        managementSystems: {
          create: []
        }
      },
      include: {
        suppliers: true,
        locations: true,
        valueChains: {
          include: {
            activities: true,
            inputs: true,
            outputs: true,
            metrics: true
          }
        },
        organisation: true,
        information: true,
        managementSystems: true,
        enterprise: true,
        facility: true,
        businessUnit: true,
        businessCanvas: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: operatingModel
    })
  } catch (error) {
    console.error('Error creating operating model:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create operating model' },
      { status: 500 }
    )
  }
}

// PATCH /api/operating-models
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Operating model ID is required' },
        { status: 400 }
      )
    }

    // Update operating model
    const operatingModel = await prisma.operatingModel.update({
      where: { id },
      data: updates,
      include: {
        valueChains: {
          include: {
            activities: true,
            inputs: true,
            outputs: true,
            metrics: true
          }
        },
        serviceModels: {
          include: {
            metrics: true
          }
        },
        experienceModels: {
          include: {
            touchpoints: true,
            journeyStages: true,
            metrics: true
          }
        },
        capabilityModels: {
          include: {
            areas: true,
            metrics: true
          }
        },
        operatingPrinciples: {
          include: {
            principles: true
          }
        },
        enterprise: true,
        facility: true,
        businessUnit: true,
        businessCanvas: true
      }
    })

    return NextResponse.json(operatingModel)
  } catch (error) {
    console.error('Error updating operating model:', error)
    return NextResponse.json(
      { error: 'Failed to update operating model' },
      { status: 500 }
    )
  }
}

// DELETE /api/operating-models
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Operating model ID is required' },
        { status: 400 }
      )
    }

    // Delete operating model (cascade will handle related records)
    await prisma.operatingModel.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Operating model deleted successfully' })
  } catch (error) {
    console.error('Error deleting operating model:', error)
    return NextResponse.json(
      { error: 'Failed to delete operating model' },
      { status: 500 }
    )
  }
} 