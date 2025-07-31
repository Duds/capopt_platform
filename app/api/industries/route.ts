import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const industries = await prisma.industry.findMany({
      where: {
        isActive: true
      },
      include: {
        sectors: {
          where: {
            isActive: true
          },
          orderBy: {
            sortOrder: 'asc'
          }
        }
      },
      orderBy: {
        sortOrder: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      industries: industries.map(industry => ({
        id: industry.id,
        code: industry.code,
        name: industry.name,
        description: industry.description,
        category: industry.category,
        sectors: industry.sectors.map(sector => ({
          id: sector.id,
          code: sector.code,
          name: sector.name,
          description: sector.description,
          category: sector.category,
          riskProfile: sector.riskProfile
        }))
      }))
    })
  } catch (error) {
    console.error('Error fetching industries:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch industries' },
      { status: 500 }
    )
  }
} 