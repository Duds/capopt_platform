import { PrismaClient } from '@prisma/client'
import { SeedOptions, SeedResult } from '../config/types'
import { SEED_CONSTANTS } from '../config/constants'

export async function seedPlaybooks(prisma: PrismaClient, options?: SeedOptions): Promise<SeedResult> {
  // Get admin user for createdById
  const adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  })
  
  if (!adminUser) {
    throw new Error('Admin user not found. Please seed users first.')
  }

  const playbooks = [
    {
      name: 'Emergency Response Playbook',
      description: 'Comprehensive emergency response procedures for critical incidents',
      status: SEED_CONSTANTS.DEFAULT_PLAYBOOK_STATUS,
      version: '1.0',
    },
    {
      name: 'Safety Management Playbook',
      description: 'Safety management procedures and best practices',
      status: SEED_CONSTANTS.DEFAULT_PLAYBOOK_STATUS,
      version: '1.0',
    },
    {
      name: 'Control Room Operations Playbook',
      description: 'Standard operating procedures for control room operations',
      status: SEED_CONSTANTS.DEFAULT_PLAYBOOK_STATUS,
      version: '1.0',
    },
    {
      name: 'Environmental Compliance Playbook',
      description: 'Environmental monitoring and compliance procedures',
      status: SEED_CONSTANTS.DEFAULT_PLAYBOOK_STATUS,
      version: '1.0',
    }
  ]

  let entitiesCreated = 0
  let entitiesUpdated = 0

  for (const playbook of playbooks) {
    // Check if playbook already exists
    const existing = await prisma.playbook.findFirst({
      where: { name: playbook.name }
    })
    
    if (!existing) {
      await prisma.playbook.create({
        data: playbook,
      })
      entitiesCreated++
    } else {
      entitiesUpdated++
    }
  }
  
  console.log('✅ Playbooks seeded')
  
  return {
    success: true,
    message: 'Playbooks seeded successfully',
    entitiesCreated,
    entitiesUpdated,
  }
} 