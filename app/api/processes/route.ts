import { NextRequest, NextResponse } from 'next/server'
import { processSchema, processUpdateSchema } from '@/lib/validations/process'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const createdById = searchParams.get('createdById')
    const include = searchParams.get('include')?.split(',') || []

    // Build where clause
    const where: any = {}
    if (status) where.status = status
    if (priority) where.priority = priority
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

    const processes = await prisma.process.findMany({
      where,
      include: includeClause,
      orderBy: [
        { priority: 'desc' },
        { name: 'asc' }
      ]
    })
    
    return NextResponse.json(processes)
  } catch (error: any) {
    console.error('Error fetching processes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch processes', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = processSchema.parse(body)
    
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
      createdBy: {
        connect: { id: createdById }
      }
    }
    
    if (validatedData.description !== undefined) data.description = validatedData.description
    if (validatedData.version !== undefined) data.version = validatedData.version
    if (validatedData.status !== undefined) data.status = validatedData.status
    if (validatedData.priority !== undefined) data.priority = validatedData.priority

    // Handle nested relationships
    if (validatedData.steps) {
      data.steps = {
        create: validatedData.steps.map((step, index) => ({
          ...step,
          orderIndex: step.orderIndex ?? index
        }))
      }
    }

    if (validatedData.inputs) {
      data.inputs = {
        create: validatedData.inputs
      }
    }

    if (validatedData.outputs) {
      data.outputs = {
        create: validatedData.outputs
      }
    }

    if (validatedData.metrics) {
      data.metrics = {
        create: validatedData.metrics
      }
    }

    if (validatedData.risks) {
      data.risks = {
        create: validatedData.risks
      }
    }
    
    const process = await prisma.process.create({
      data,
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
    
    return NextResponse.json(process, { status: 201 })
  } catch (error: any) {
    console.error('Error creating process:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create process', details: error.message },
      { status: 500 }
    )
  }
} 