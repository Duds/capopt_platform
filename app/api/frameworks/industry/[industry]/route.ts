import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ industry: string }> }
) {
  try {
    const { industry } = await params;
    
    const [operationalStreams, complianceFramework] = await Promise.all([
      prisma.industryOperationalStreams.findMany({
        where: { industry, isActive: true }
      }),
      prisma.industryComplianceFramework.findMany({
        where: { industry, isActive: true }
      })
    ]);
    
    return NextResponse.json({
      industry,
      operationalStreams,
      complianceFramework
    });
  } catch (error) {
    console.error('Error fetching industry framework:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 