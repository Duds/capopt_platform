import { NextRequest, NextResponse } from 'next/server'
import { maturityAssessmentSchema } from '@/lib/validations/strategic'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const framework = searchParams.get('framework')
    const createdById = searchParams.get('createdById')
    const include = searchParams.get('include')?.split(',') || []

    // Build where clause
    const where: any = {}
    if (framework) where.framework = framework
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

    if (include.includes('capabilityScores')) {
      includeClause.capabilityScores = true
    }

    if (include.includes('improvementRoadmaps')) {
      includeClause.improvementRoadmaps = true
    }

    if (include.includes('benchmarks')) {
      includeClause.benchmarks = true
    }

    if (include.includes('progress')) {
      includeClause.progress = true
    }

    const maturityAssessments = await prisma.maturityAssessment.findMany({
      where,
      include: includeClause,
      orderBy: [
        { createdAt: 'desc' }
      ]
    })
    
    return NextResponse.json(maturityAssessments)
  } catch (error: any) {
    console.error('Error fetching maturity assessments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch maturity assessments', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = maturityAssessmentSchema.parse(body)
    
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
    if (validatedData.framework !== undefined) data.framework = validatedData.framework

    // Handle nested relationships
    if (validatedData.capabilityScores) {
      data.capabilityScores = {
        create: validatedData.capabilityScores
      }
    }

    if (validatedData.improvementRoadmaps) {
      data.improvementRoadmaps = {
        create: validatedData.improvementRoadmaps
      }
    }

    if (validatedData.benchmarks) {
      data.benchmarks = {
        create: validatedData.benchmarks
      }
    }

    if (validatedData.progress) {
      data.progress = {
        create: validatedData.progress
      }
    }
    
    const maturityAssessment = await prisma.maturityAssessment.create({
      data,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        capabilityScores: true,
        improvementRoadmaps: true,
        benchmarks: true,
        progress: true
      }
    })
    
    return NextResponse.json(maturityAssessment, { status: 201 })
  } catch (error: any) {
    console.error('Error creating maturity assessment:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create maturity assessment', details: error.message },
      { status: 500 }
    )
  }
} 