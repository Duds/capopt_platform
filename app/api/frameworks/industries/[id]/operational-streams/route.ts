import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const operationalStreams = await prisma.industryOperationalStreamAssociation.findMany({
      where: {
        industryId: params.id,
        isApplicable: true,
        isActive: true
      },
      include: {
        operationalStream: true,
        sector: true
      },
      orderBy: { sortOrder: 'asc' }
    })

    return NextResponse.json(operationalStreams)
  } catch (error) {
    console.error('Error fetching industry operational streams:', error)
    return NextResponse.json(
      { error: 'Failed to fetch industry operational streams' }, 
      { status: 500 }
    )
  }
} 