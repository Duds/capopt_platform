import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { controlSchema } from '@/lib/validations/control'
import { authenticateRequest, createAuthErrorResponse } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    // Authenticate the request
    const authenticatedRequest = await authenticateRequest(request)
    const user = authenticatedRequest.user!

    const { searchParams } = new URL(request.url)
    const include = searchParams.get('include')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const riskCategory = searchParams.get('riskCategory')

    // Build where clause
    const where: any = {}
    if (status) where.complianceStatus = status
    if (priority) where.priority = priority
    if (riskCategory) where.riskCategory = { name: { contains: riskCategory, mode: 'insensitive' } }

    // Build include object
    const includeObj: any = {}
    if (include) {
      const includes = include.split(',')
      includes.forEach((inc) => {
        includeObj[inc.trim()] = true
      })
    }

    const controls = await prisma.criticalControl.findMany({
      where,
      include: Object.keys(includeObj).length > 0 ? includeObj : undefined,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(controls)
  } catch (error: any) {
    if (error.message.includes('authentication') || error.message.includes('token')) {
      return createAuthErrorResponse(error.message)
    }
    
    console.error('Error fetching controls:', error)
    return NextResponse.json(
      { error: 'Failed to fetch controls' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate the request
    const authenticatedRequest = await authenticateRequest(request)
    const user = authenticatedRequest.user!

    const body = await request.json()
    const validatedData = controlSchema.parse(body)

    // Build the data object dynamically
    const data: any = {
      name: validatedData.name,
      description: validatedData.description,
      complianceStatus: validatedData.complianceStatus,
      priority: validatedData.priority,
      createdBy: { connect: { id: user.id } }
    }

    // Add optional fields if they exist
    if (validatedData.riskCategoryId) data.riskCategory = { connect: { id: validatedData.riskCategoryId } }
    if (validatedData.controlTypeId) data.controlType = { connect: { id: validatedData.controlTypeId } }
    if (validatedData.effectivenessId) data.effectiveness = { connect: { id: validatedData.effectivenessId } }

    const control = await prisma.criticalControl.create({
      data,
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
        }
      }
    })

    return NextResponse.json(control, { status: 201 })
  } catch (error: any) {
    if (error.message.includes('authentication') || error.message.includes('token')) {
      return createAuthErrorResponse(error.message)
    }
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error creating control:', error)
    return NextResponse.json(
      { error: 'Failed to create control' },
      { status: 500 }
    )
  }
} 