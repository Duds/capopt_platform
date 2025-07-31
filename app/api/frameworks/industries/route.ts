import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const industries = await prisma.industryOperationalStreams.findMany({
      where: { isActive: true },
      select: { industry: true },
      distinct: ['industry']
    });
    
    const uniqueIndustries = industries.map(item => item.industry);
    
    return NextResponse.json({
      industries: uniqueIndustries
    });
  } catch (error) {
    console.error('Error fetching industries:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 