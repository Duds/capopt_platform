import { NextRequest, NextResponse } from 'next/server'
import { processUpdateSchema } from '@/lib/validations/process'
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

    if (include.includes('steps')) {
      includeClause.steps = {
        orderBy: { orderIndex: 'asc' }
      }
    }

    if (include.includes('inputs')) {
      includeClause.inputs = true
    }

    if (include.includes('outputs')) {
      includeClause.outputs = true
    }

    if (include.includes('metrics')) {
      includeClause.metrics = true
    }

    if (include.includes('risks')) {
      includeClause.risks = true
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

    if (include.includes('playbooks')) {
      includeClause.playbooks = {
        include: {
          playbook: {
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

    if (include.includes('maturityScores')) {
      includeClause.maturityScores = {
        include: {
          assessment: {
            select: {
              id: true,
              name: true,
              framework: true
            }
          }
        }
      }
    }

    const process = await prisma.process.findUnique({
      where: { id: params.id },
      include: includeClause
    })
    
    if (!process) {
      return NextResponse.json(
        { error: 'Process not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(process)
  } catch (error: any) {
    console.error('Error fetching process:', error)
    return NextResponse.json(
      { error: 'Failed to fetch process', details: error.message },
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
    const validatedData = processUpdateSchema.parse(body)

    // Check if process exists
    const existingProcess = await prisma.process.findUnique({
      where: { id: params.id }
    })

    if (!existingProcess) {
      return NextResponse.json(
        { error: 'Process not found' },
        { status: 404 }
      )
    }

    // Build update data object with only defined values
    const updateData: any = {}
    
    if (validatedData.name !== undefined) updateData.name = validatedData.name
    if (validatedData.description !== undefined) updateData.description = validatedData.description
    if (validatedData.version !== undefined) updateData.version = validatedData.version
    if (validatedData.status !== undefined) updateData.status = validatedData.status
    if (validatedData.priority !== undefined) updateData.priority = validatedData.priority
    
    const process = await prisma.process.update({
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
        steps: {
          orderBy: { orderIndex: 'asc' }
        },
        inputs: true,
        outputs: true,
        metrics: true,
        risks: true,
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
    
    return NextResponse.json(process)
  } catch (error: any) {
    console.error('Error updating process:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Process not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update process', details: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if process exists
    const existingProcess = await prisma.process.findUnique({
      where: { id: params.id }
    })

    if (!existingProcess) {
      return NextResponse.json(
        { error: 'Process not found' },
        { status: 404 }
      )
    }

    // Delete related records first
    await prisma.processControl.deleteMany({
      where: { processId: params.id }
    })

    await prisma.processPlaybook.deleteMany({
      where: { processId: params.id }
    })

    await prisma.processMaturityScore.deleteMany({
      where: { processId: params.id }
    })

    await prisma.processStep.deleteMany({
      where: { processId: params.id }
    })

    await prisma.processInput.deleteMany({
      where: { processId: params.id }
    })

    await prisma.processOutput.deleteMany({
      where: { processId: params.id }
    })

    await prisma.processMetric.deleteMany({
      where: { processId: params.id }
    })

    await prisma.processRisk.deleteMany({
      where: { processId: params.id }
    })

    // Delete the process
    await prisma.process.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json(
      { message: 'Process deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error deleting process:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Process not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete process', details: error.message },
      { status: 500 }
    )
  }
} 