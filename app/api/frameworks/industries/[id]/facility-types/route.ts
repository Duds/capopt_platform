import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const facilityTypes = await prisma.industryFacilityTypeAssociation.findMany({
      where: {
        industryId: params.id,
        isApplicable: true,
        isActive: true
      },
      include: {
        facilityType: true
      },
      orderBy: { sortOrder: 'asc' }
    })

    return NextResponse.json(facilityTypes)
  } catch (error) {
    console.error('Error fetching industry facility types:', error)
    return NextResponse.json(
      { error: 'Failed to fetch industry facility types' }, 
      { status: 500 }
    )
  }
} 