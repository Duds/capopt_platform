import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const industry = searchParams.get('industry')
    const category = searchParams.get('category')
    const riskProfile = searchParams.get('riskProfile')
    const isActive = searchParams.get('isActive')

    // Build where clause
    const where: any = {}
    if (category) {
      where.category = category
    }
    if (riskProfile) {
      where.riskProfile = riskProfile
    }
    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    let facilityTypes

    if (industry) {
      // Get industry-specific facility types
      const industryRecord = await prisma.industry.findUnique({
        where: { code: industry }
      })

      if (!industryRecord) {
        return NextResponse.json(
          { error: `Industry not found: ${industry}` },
          { status: 404 }
        )
      }

      // Get facility types associated with this industry
      const associations = await prisma.industryFacilityTypeAssociation.findMany({
        where: {
          industryId: industryRecord.id,
          isActive: true,
          ...where
        },
        include: {
          facilityType: true
        },
        orderBy: { sortOrder: 'asc' }
      })

      facilityTypes = associations.map(association => ({
        id: association.facilityType.id,
        code: association.facilityType.code,
        name: association.customName || association.facilityType.name,
        description: association.customDescription || association.facilityType.description,
        category: association.facilityType.category,
        riskProfile: association.riskProfile || association.facilityType.riskProfile,
        isActive: association.isActive,
        sortOrder: association.sortOrder
      }))
    } else {
      // Get all facility types
      facilityTypes = await prisma.facilityTypeMaster.findMany({
        where,
        orderBy: { sortOrder: 'asc' }
      })
    }

    return NextResponse.json(facilityTypes)
  } catch (error) {
    console.error('Error fetching facility types:', error)
    return NextResponse.json(
      { error: 'Failed to fetch facility types', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 