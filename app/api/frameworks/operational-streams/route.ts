import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const operationalStreams = await prisma.operationalStream.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    })

    return NextResponse.json(operationalStreams)
  } catch (error) {
    console.error('Error fetching operational streams:', error)
    return NextResponse.json(
      { error: 'Failed to fetch operational streams' }, 
      { status: 500 }
    )
  }
} 