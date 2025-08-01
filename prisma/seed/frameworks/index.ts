import { PrismaClient } from '@prisma/client';
import { seedComplianceFramework } from './compliance-framework';
import { seedOperationalStreams } from './operational-streams';
import { seedFacilityTypes } from './facility-types';

const prisma = new PrismaClient();

export async function seedFrameworks() {
  console.log('🔄 Seeding frameworks...');
  
  try {
    await seedComplianceFramework(prisma);
    await seedOperationalStreams(prisma);
    await seedFacilityTypes(prisma);
    
    console.log('✅ Frameworks seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding frameworks:', error);
    throw error;
  }
}

export async function getOperationalStreams(industry: string, sector: string) {
  const framework = await prisma.industryOperationalStreams.findUnique({
    where: {
      industry_sector: {
        industry,
        sector
      }
    }
  });
  return framework?.operationalStreams as string[] || [];
}

export async function getComplianceFramework(industry: string, sector: string) {
  const framework = await prisma.industryComplianceFramework.findUnique({
    where: {
      industry_sector: {
        industry,
        sector
      }
    }
  });
  return {
    complianceRequirements: framework?.complianceRequirements as string[] || [],
    regulatoryFramework: framework?.regulatoryFramework as any || {}
  };
}

export async function getSectorsForIndustry(industry: string) {
  const sectors = await prisma.industryOperationalStreams.findMany({
    where: { industry, isActive: true },
    select: { sector: true }
  });
  return sectors.map(s => s.sector);
}

export async function getIndustries() {
  const industries = await prisma.industryOperationalStreams.findMany({
    where: { isActive: true },
    select: { industry: true },
    distinct: ['industry']
  });
  return industries.map(i => i.industry);
} 