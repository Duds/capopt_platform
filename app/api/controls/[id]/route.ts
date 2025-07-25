import { NextRequest, NextResponse } from 'next/server'
import { controlUpdateSchema } from '@/lib/validations/control'
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
      riskCategory: true,
      controlType: true,
      effectiveness: true,
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }

    if (include.includes('processes')) {
      includeClause.processes = {
        include: {
          process: {
            select: {
              id: true,
              name: true,
              description: true,
              status: true
            }
          }
        }
      }
    }

    if (include.includes('assets')) {
      includeClause.assets = {
        include: {
          asset: {
            select: {
              id: true,
              name: true,
              description: true,
              type: true,
              status: true,
              criticality: true
            }
          }
        }
      }
    }

    if (include.includes('bowtieAnalyses')) {
      includeClause.bowtieAnalyses = {
        include: {
          threats: true,
          consequences: true,
          barriers: true
        }
      }
    }

    const control = await prisma.criticalControl.findUnique({
      where: { id: params.id },
      include: includeClause
    })

    if (!control) {
      return NextResponse.json(
        { error: 'Control not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(control)
  } catch (error: any) {
    console.error('Error fetching control:', error)
    return NextResponse.json(
      { error: 'Failed to fetch control', details: error.message },
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
    const validatedData = controlUpdateSchema.parse(body)

    // Check if control exists
    const existingControl = await prisma.criticalControl.findUnique({
      where: { id: params.id }
    })

    if (!existingControl) {
      return NextResponse.json(
        { error: 'Control not found' },
        { status: 404 }
      )
    }

    // Build update data object with only defined values
    const updateData: any = {}
    
    if (validatedData.name !== undefined) updateData.name = validatedData.name
    if (validatedData.description !== undefined) updateData.description = validatedData.description
    if (validatedData.riskCategoryId !== undefined) updateData.riskCategoryId = validatedData.riskCategoryId
    if (validatedData.controlTypeId !== undefined) updateData.controlTypeId = validatedData.controlTypeId
    if (validatedData.effectivenessId !== undefined) updateData.effectivenessId = validatedData.effectivenessId
    if (validatedData.complianceStatus !== undefined) updateData.complianceStatus = validatedData.complianceStatus
    if (validatedData.priority !== undefined) updateData.priority = validatedData.priority

    const control = await prisma.criticalControl.update({
      where: { id: params.id },
      data: updateData,
      include: {
        riskCategory: true,
        controlType: true,
        effectiveness: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        processes: {
          include: {
            process: {
              select: {
                id: true,
                name: true,
                description: true,
                status: true
              }
            }
          }
        },
        assets: {
          include: {
            asset: {
              select: {
                id: true,
                name: true,
                description: true,
                type: true,
                status: true,
                criticality: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(control)
  } catch (error: any) {
    console.error('Error updating control:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Control not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update control', details: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if control exists
    const existingControl = await prisma.criticalControl.findUnique({
      where: { id: params.id }
    })

    if (!existingControl) {
      return NextResponse.json(
        { error: 'Control not found' },
        { status: 404 }
      )
    }

    // Delete related records first
    await prisma.processControl.deleteMany({
      where: { controlId: params.id }
    })

    await prisma.assetControl.deleteMany({
      where: { controlId: params.id }
    })

    // Delete the control
    await prisma.criticalControl.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      { message: 'Control deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error deleting control:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Control not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete control', details: error.message },
      { status: 500 }
    )
  }
} 