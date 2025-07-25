import { PrismaClient } from '@prisma/client'
import { SeedOptions } from '../config/types'

export async function seedCrackedMountainPtyLtd(prisma: PrismaClient, options?: SeedOptions) {
  console.log('🏔️ Seeding Cracked Mountain Pty Ltd...')
  
  // Create the enterprise
  const enterprise = await prisma.enterprise.upsert({
    where: { abn: '12345678901' },
    update: {},
    create: {
      name: 'Cracked Mountain Pty Ltd',
      legalName: 'Cracked Mountain Pty Ltd',
      abn: '12345678901',
      acn: '123456789',
      description: 'Leading Australian mining and minerals processing company specializing in copper, uranium, gold, and silver production.',
      industry: 'Mining',
      sector: 'Resources',
    },
  })
  
  console.log('✅ Enterprise created:', enterprise.name)
  
  // Create enterprise addresses
  const addresses = [
    {
      type: 'REGISTERED_OFFICE' as const,
      street: 'Level 15, 123 Collins Street',
      suburb: 'Melbourne',
      city: 'Melbourne',
      state: 'VIC',
      postcode: '3000',
      country: 'Australia',
      isPrimary: true,
    },
    {
      type: 'OPERATIONAL_OFFICE' as const,
      street: '456 Flinders Street',
      suburb: 'Adelaide',
      city: 'Adelaide',
      state: 'SA',
      postcode: '5000',
      country: 'Australia',
      isPrimary: false,
    },
    {
      type: 'SITE_OFFICE' as const,
      street: 'Hercules Levee Access Road',
      suburb: 'Roxby Downs',
      city: 'Roxby Downs',
      state: 'SA',
      postcode: '5725',
      country: 'Australia',
      isPrimary: false,
    }
  ]
  
  for (const addressData of addresses) {
    await prisma.enterpriseAddress.create({
      data: {
        ...addressData,
        enterpriseId: enterprise.id,
      },
    })
  }
  
  console.log('✅ Enterprise addresses created')
  
  // Create business units
  const businessUnits = [
    {
      name: 'Mining Operations',
      code: 'MINING',
      description: 'Underground and open pit mining operations',
      type: 'MINING' as const,
      manager: 'Sarah Johnson',
      budget: 150000000.00, // $150M
    },
    {
      name: 'Mineral Processing',
      code: 'PROCESSING',
      description: 'Crushing, grinding, and mineral separation',
      type: 'PROCESSING' as const,
      manager: 'Michael Chen',
      budget: 200000000.00, // $200M
    },
    {
      name: 'Metallurgy',
      code: 'METALLURGY',
      description: 'Smelting, refining, and metal production',
      type: 'PROCESSING' as const,
      manager: 'David Rodriguez',
      budget: 180000000.00, // $180M
    },
    {
      name: 'Maintenance',
      code: 'MAINTENANCE',
      description: 'Equipment maintenance and reliability',
      type: 'MAINTENANCE' as const,
      manager: 'Lisa Thompson',
      budget: 80000000.00, // $80M
    },
    {
      name: 'Engineering',
      code: 'ENGINEERING',
      description: 'Engineering design and project management',
      type: 'ENGINEERING' as const,
      manager: 'Robert Wilson',
      budget: 60000000.00, // $60M
    },
    {
      name: 'Safety & Health',
      code: 'SAFETY',
      description: 'Workplace safety and occupational health',
      type: 'SAFETY' as const,
      manager: 'Amanda Foster',
      budget: 40000000.00, // $40M
    },
    {
      name: 'Environmental',
      code: 'ENVIRONMENTAL',
      description: 'Environmental management and compliance',
      type: 'ENVIRONMENTAL' as const,
      manager: 'James Brown',
      budget: 30000000.00, // $30M
    },
    {
      name: 'Finance',
      code: 'FINANCE',
      description: 'Financial management and reporting',
      type: 'FINANCE' as const,
      manager: 'Emma Davis',
      budget: 20000000.00, // $20M
    },
    {
      name: 'Human Resources',
      code: 'HR',
      description: 'Human resources and workforce management',
      type: 'HUMAN_RESOURCES' as const,
      manager: 'Thomas Lee',
      budget: 25000000.00, // $25M
    },
    {
      name: 'Information Technology',
      code: 'IT',
      description: 'IT infrastructure and systems',
      type: 'IT' as const,
      manager: 'Rachel Green',
      budget: 35000000.00, // $35M
    },
    {
      name: 'Logistics',
      code: 'LOGISTICS',
      description: 'Supply chain and logistics management',
      type: 'LOGISTICS' as const,
      manager: 'Christopher White',
      budget: 45000000.00, // $45M
    },
    {
      name: 'Quality Assurance',
      code: 'QA',
      description: 'Quality control and assurance',
      type: 'QUALITY_ASSURANCE' as const,
      manager: 'Jennifer Martinez',
      budget: 15000000.00, // $15M
    }
  ]
  
  for (const buData of businessUnits) {
    await prisma.businessUnit.upsert({
      where: { code: buData.code },
      update: {},
      create: {
        ...buData,
        enterpriseId: enterprise.id,
      },
    })
  }
  
  console.log('✅ Business units created')
  
  return {
    success: true,
    message: 'Cracked Mountain Pty Ltd seeded successfully',
    entitiesCreated: 1 + addresses.length + businessUnits.length,
    entitiesUpdated: 0,
  }
} 