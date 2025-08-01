import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const facilityTypes = await prisma.facilityTypeMaster.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    })

    return NextResponse.json(facilityTypes)
  } catch (error) {
    console.error('Error fetching facility types:', error)
    return NextResponse.json(
      { error: 'Failed to fetch facility types' }, 
      { status: 500 }
    )
  }
} 