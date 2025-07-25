import { PrismaClient } from '@prisma/client'
import { SeedOptions, SeedResult } from '../config/types'
import { SEED_CONSTANTS } from '../config/constants'

export async function seedProcesses(prisma: PrismaClient, options?: SeedOptions): Promise<SeedResult> {
  // Get admin user for createdById
  const adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  })
  
  if (!adminUser) {
    throw new Error('Admin user not found. Please seed users first.')
  }

  const processes = [
    {
      name: 'Equipment Maintenance',
      description: 'Standard equipment maintenance and inspection procedures',
      status: SEED_CONSTANTS.DEFAULT_PROCESS_STATUS,
      priority: SEED_CONSTANTS.DEFAULT_PROCESS_PRIORITY,
      version: '1.0',
      createdById: adminUser.id,
    },
    {
      name: 'Safety Inspection',
      description: 'Comprehensive safety inspection and hazard identification process',
      status: SEED_CONSTANTS.DEFAULT_PROCESS_STATUS,
      priority: 'HIGH',
      version: '1.0',
      createdById: adminUser.id,
    },
    {
      name: 'Environmental Monitoring',
      description: 'Environmental parameter monitoring and reporting process',
      status: SEED_CONSTANTS.DEFAULT_PROCESS_STATUS,
      priority: SEED_CONSTANTS.DEFAULT_PROCESS_PRIORITY,
      version: '1.0',
      createdById: adminUser.id,
    },
    {
      name: 'Incident Response',
      description: 'Emergency incident response and escalation procedures',
      status: SEED_CONSTANTS.DEFAULT_PROCESS_STATUS,
      priority: 'HIGH',
      version: '1.0',
      createdById: adminUser.id,
    }
  ]

  let entitiesCreated = 0
  let entitiesUpdated = 0

  for (const process of processes) {
    // Check if process already exists
    const existing = await prisma.process.findFirst({
      where: { name: process.name }
    })
    
    if (!existing) {
      await prisma.process.create({
        data: process,
      })
      entitiesCreated++
    } else {
      entitiesUpdated++
    }
  }
  
  console.log('✅ Processes seeded')
  
  return {
    success: true,
    message: 'Processes seeded successfully',
    entitiesCreated,
    entitiesUpdated,
  }
} 