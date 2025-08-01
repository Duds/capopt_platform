import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const industry = searchParams.get('industry')
    const sectors = searchParams.get('sectors')?.split(',') || []

    let operationalStreams

    if (industry) {
      // Get industry ID
      const industryRecord = await prisma.industry.findUnique({
        where: { code: industry }
      })

      if (!industryRecord) {
        return NextResponse.json(
          { error: `Industry not found: ${industry}` },
          { status: 404 }
        )
      }

      // Get operational stream associations
      const associations = await prisma.industryOperationalStreams.findMany({
        where: {
          industryId: industryRecord.id,
          isActive: true,
          ...(sectors.length > 0 && { sector: { in: sectors } })
        },
        orderBy: { sortOrder: 'asc' }
      })

      // Get the actual operational stream details
      const streamNames = associations.map(a => a.streamName)
      
      operationalStreams = await prisma.operationalStream.findMany({
        where: {
          name: { in: streamNames },
          isActive: true
        },
        orderBy: { sortOrder: 'asc' }
      })

      // If no sector-specific streams found, fall back to all industry streams
      if (operationalStreams.length === 0) {
        const allAssociations = await prisma.industryOperationalStreams.findMany({
          where: {
            industryId: industryRecord.id,
            isActive: true
          },
          orderBy: { sortOrder: 'asc' }
        })

        const allStreamNames = allAssociations.map(a => a.streamName)
        
        operationalStreams = await prisma.operationalStream.findMany({
          where: {
            name: { in: allStreamNames },
            isActive: true
          },
          orderBy: { sortOrder: 'asc' }
        })
      }
    } else {
      // Return all operational streams if no industry specified
      operationalStreams = await prisma.operationalStream.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' }
      })
    }

    return NextResponse.json(operationalStreams)
  } catch (error) {
    console.error('Error fetching operational streams:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch operational streams', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
} 