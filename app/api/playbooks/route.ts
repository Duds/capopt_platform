import { NextRequest, NextResponse } from 'next/server'
import { playbookSchema } from '@/lib/validations/process'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const include = searchParams.get('include')?.split(',') || []

    // Build where clause
    const where: any = {}
    if (status) where.status = status

    // Build include clause
    const includeClause: any = {}

    if (include.includes('procedures')) {
      includeClause.procedures = true
    }

    if (include.includes('trainingMaterials')) {
      includeClause.trainingMaterials = true
    }

    if (include.includes('bestPractices')) {
      includeClause.bestPractices = true
    }

    if (include.includes('improvements')) {
      includeClause.improvements = true
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

    const playbooks = await prisma.playbook.findMany({
      where,
      include: includeClause,
      orderBy: [
        { status: 'asc' },
        { name: 'asc' }
      ]
    })
    
    return NextResponse.json(playbooks)
  } catch (error: any) {
    console.error('Error fetching playbooks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch playbooks', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = playbookSchema.parse(body)
    
    // Build data object with only defined values
    const data: any = {
      name: validatedData.name
    }
    
    if (validatedData.description !== undefined) data.description = validatedData.description
    if (validatedData.version !== undefined) data.version = validatedData.version
    if (validatedData.status !== undefined) data.status = validatedData.status

    // Handle nested relationships
    if (validatedData.procedures) {
      data.procedures = {
        create: validatedData.procedures
      }
    }

    if (validatedData.trainingMaterials) {
      data.trainingMaterials = {
        create: validatedData.trainingMaterials
      }
    }

    if (validatedData.bestPractices) {
      data.bestPractices = {
        create: validatedData.bestPractices
      }
    }

    if (validatedData.improvements) {
      data.improvements = {
        create: validatedData.improvements
      }
    }
    
    const playbook = await prisma.playbook.create({
      data,
      include: {
        procedures: true,
        trainingMaterials: true,
        bestPractices: true,
        improvements: true,
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
        }
      }
    })
    
    return NextResponse.json(playbook, { status: 201 })
  } catch (error: any) {
    console.error('Error creating playbook:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create playbook', details: error.message },
      { status: 500 }
    )
  }
} 