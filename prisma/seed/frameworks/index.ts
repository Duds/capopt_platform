import { PrismaClient } from '@prisma/client';
import { operationalStreamsData } from './operational-streams';
import { complianceFrameworkData } from './compliance-framework';

const prisma = new PrismaClient();

export async function seedFrameworks() {
  console.log('🌱 Seeding framework data...');

  try {
    // Seed operational streams
    console.log('📊 Seeding operational streams...');
    for (const data of operationalStreamsData) {
      await prisma.industryOperationalStreams.upsert({
        where: {
          industry_sector: {
            industry: data.industry,
            sector: data.sector
          }
        },
        update: {
          operationalStreams: data.operationalStreams,
          updatedAt: new Date()
        },
        create: {
          industry: data.industry,
          sector: data.sector,
          operationalStreams: data.operationalStreams
        }
      });
    }

    // Seed compliance frameworks
    console.log('🛡️ Seeding compliance frameworks...');
    for (const data of complianceFrameworkData) {
      await prisma.industryComplianceFramework.upsert({
        where: {
          industry_sector: {
            industry: data.industry,
            sector: data.sector
          }
        },
        update: {
          complianceRequirements: data.complianceRequirements,
          regulatoryFramework: data.regulatoryFramework,
          updatedAt: new Date()
        },
        create: {
          industry: data.industry,
          sector: data.sector,
          complianceRequirements: data.complianceRequirements,
          regulatoryFramework: data.regulatoryFramework
        }
      });
    }

    console.log('✅ Framework data seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding framework data:', error);
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