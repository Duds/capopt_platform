import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeSectors = searchParams.get('includeSectors') === 'true'
    const includeFrameworks = searchParams.get('includeFrameworks') === 'true'
    const category = searchParams.get('category')
    const isActive = searchParams.get('isActive')

    // Build where clause
    const where: any = {}
    if (category) {
      where.category = category
    }
    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    // Build include clause
    const include: any = {}
    if (includeSectors) {
      include.sectors = {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' }
      }
    }
    if (includeFrameworks) {
      include.facilityTypeAssociations = {
        where: { isApplicable: true },
        include: {
          facilityType: true
        },
        orderBy: { sortOrder: 'asc' }
      }
      include.operationalStreamAssociations = {
        where: { isApplicable: true },
        include: {
          operationalStream: true,
          sector: true
        },
        orderBy: { sortOrder: 'asc' }
      }
      include.complianceRequirementAssociations = {
        where: { isApplicable: true },
        include: {
          complianceRequirement: true,
          sector: true
        },
        orderBy: { sortOrder: 'asc' }
      }
      include.regulatoryFrameworkAssociations = {
        where: { isApplicable: true },
        include: {
          regulatoryFramework: true,
          sector: true
        },
        orderBy: { sortOrder: 'asc' }
      }
    }

    const industries = await prisma.industry.findMany({
      where,
      include,
      orderBy: { sortOrder: 'asc' }
    })

    return NextResponse.json(industries)
  } catch (error) {
    console.error('Error fetching industries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch industries', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, name, description, category, sectors } = body

    if (!code || !name) {
      return NextResponse.json(
        { error: 'Industry code and name are required' },
        { status: 400 }
      )
    }

    // Check if industry already exists
    const existingIndustry = await prisma.industry.findUnique({
      where: { code }
    })

    if (existingIndustry) {
      return NextResponse.json(
        { error: 'Industry with this code already exists' },
        { status: 409 }
      )
    }

    // Create industry with sectors
    const industry = await prisma.industry.create({
      data: {
        code,
        name,
        description,
        category: category || 'OTHER',
        sectors: sectors ? {
          create: sectors.map((sector: any, index: number) => ({
            code: sector.code,
            name: sector.name,
            description: sector.description,
            category: sector.category || 'VALUE_CHAIN',
            riskProfile: sector.riskProfile || 'MEDIUM',
            sortOrder: sector.sortOrder || index + 1
          }))
        } : undefined
      },
      include: {
        sectors: true
      }
    })

    return NextResponse.json(industry, { status: 201 })
  } catch (error) {
    console.error('Error creating industry:', error)
    return NextResponse.json(
      { error: 'Failed to create industry', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 