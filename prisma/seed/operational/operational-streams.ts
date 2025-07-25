import { PrismaClient } from '@prisma/client'
import { SeedOptions } from '../config/types'

export async function seedOperationalStreams(prisma: PrismaClient, options?: SeedOptions) {
  console.log('🔄 Seeding operational streams...')
  
  // Get the enterprise and facility
  const enterprise = await prisma.enterprise.findUnique({
    where: { abn: '12345678901' }
  })
  
  const facility = await prisma.facility.findUnique({
    where: { code: 'HL001' }
  })
  
  if (!enterprise || !facility) {
    throw new Error('Enterprise or facility not found. Please seed enterprise first.')
  }
  
  // Get business units
  const processingBu = await prisma.businessUnit.findUnique({
    where: { code: 'PROCESSING' }
  })
  
  const metallurgyBu = await prisma.businessUnit.findUnique({
    where: { code: 'METALLURGY' }
  })
  
  // Get admin user for createdById
  const adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  })
  
  if (!adminUser) {
    throw new Error('Admin user not found. Please seed users first.')
  }

  // Create processes for each operational stream
  const operationalStreams = [
    // Copper Stream
    {
      name: 'Copper Flotation Process',
      description: 'Copper ore flotation and concentration process',
      status: 'ACTIVE',
      priority: 'HIGH',
      version: '1.0',
      createdById: adminUser.id,
      enterpriseId: enterprise.id,
      facilityId: facility.id,
      businessUnitId: processingBu?.id,
    },
    {
      name: 'Copper Smelting',
      description: 'Copper concentrate smelting and matte production',
      status: 'ACTIVE',
      priority: 'HIGH',
      version: '1.0',
      createdById: adminUser.id,
      enterpriseId: enterprise.id,
      facilityId: facility.id,
      businessUnitId: metallurgyBu?.id,
    },
    {
      name: 'Copper Refining',
      description: 'Copper anode refining and cathode production',
      status: 'ACTIVE',
      priority: 'HIGH',
      version: '1.0',
      createdById: adminUser.id,
      enterpriseId: enterprise.id,
      facilityId: facility.id,
      businessUnitId: metallurgyBu?.id,
    },
    
    // Uranium Stream
    {
      name: 'Uranium Leaching',
      description: 'Uranium leaching and extraction process',
      status: 'ACTIVE',
      priority: 'HIGH',
      version: '1.0',
      createdById: adminUser.id,
      enterpriseId: enterprise.id,
      facilityId: facility.id,
      businessUnitId: processingBu?.id,
    },
    {
      name: 'Uranium Solvent Extraction',
      description: 'Uranium solvent extraction and purification',
      status: 'ACTIVE',
      priority: 'HIGH',
      version: '1.0',
      createdById: adminUser.id,
      enterpriseId: enterprise.id,
      facilityId: facility.id,
      businessUnitId: processingBu?.id,
    },
    {
      name: 'Uranium Precipitation',
      description: 'Uranium concentrate precipitation and drying',
      status: 'ACTIVE',
      priority: 'HIGH',
      version: '1.0',
      createdById: adminUser.id,
      enterpriseId: enterprise.id,
      facilityId: facility.id,
      businessUnitId: processingBu?.id,
    },
    
    // Gold Stream
    {
      name: 'Gold Recovery from Copper',
      description: 'Gold recovery from copper concentrate',
      status: 'ACTIVE',
      priority: 'MEDIUM',
      version: '1.0',
      createdById: adminUser.id,
      enterpriseId: enterprise.id,
      facilityId: facility.id,
      businessUnitId: metallurgyBu?.id,
    },
    {
      name: 'Gold Refining',
      description: 'Gold refining and bullion production',
      status: 'ACTIVE',
      priority: 'MEDIUM',
      version: '1.0',
      createdById: adminUser.id,
      enterpriseId: enterprise.id,
      facilityId: facility.id,
      businessUnitId: metallurgyBu?.id,
    },
    
    // Silver Stream
    {
      name: 'Silver Recovery from Copper',
      description: 'Silver recovery from copper concentrate',
      status: 'ACTIVE',
      priority: 'MEDIUM',
      version: '1.0',
      createdById: adminUser.id,
      enterpriseId: enterprise.id,
      facilityId: facility.id,
      businessUnitId: metallurgyBu?.id,
    },
    {
      name: 'Silver Refining',
      description: 'Silver refining and bullion production',
      status: 'ACTIVE',
      priority: 'MEDIUM',
      version: '1.0',
      createdById: adminUser.id,
      enterpriseId: enterprise.id,
      facilityId: facility.id,
      businessUnitId: metallurgyBu?.id,
    }
  ]

  for (const process of operationalStreams) {
    // Check if process already exists
    const existing = await prisma.process.findFirst({
      where: { name: process.name }
    })
    
    if (!existing) {
      await prisma.process.create({
        data: process,
      })
    }
  }
  
  console.log('✅ Operational streams seeded')
  
  return {
    success: true,
    message: 'Operational streams seeded successfully',
    entitiesCreated: operationalStreams.length,
    entitiesUpdated: 0,
  }
} 