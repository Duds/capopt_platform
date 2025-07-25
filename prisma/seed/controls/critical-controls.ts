import { PrismaClient } from '@prisma/client'
import { SeedOptions } from '../config/types'
import { SEED_CONSTANTS } from '../config/constants'

export async function seedCriticalControls(prisma: PrismaClient, options?: SeedOptions) {
  // Get admin user for createdById
  const adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  })
  
  if (!adminUser) {
    throw new Error('Admin user not found. Please seed users first.')
  }
  
  // Get risk categories first
  const safetyCategory = await prisma.riskCategory.findFirst({
    where: { name: 'Safety' }
  })
  
  const environmentalCategory = await prisma.riskCategory.findFirst({
    where: { name: 'Environmental' }
  })
  
  const operationalCategory = await prisma.riskCategory.findFirst({
    where: { name: 'Operational' }
  })

  // Get control types
  const engineeringType = await prisma.controlType.findFirst({
    where: { name: 'Engineering' }
  })
  
  const administrativeType = await prisma.controlType.findFirst({
    where: { name: 'Administrative' }
  })

  // Get effectiveness ratings
  const effectiveRating = await prisma.controlEffectiveness.findFirst({
    where: { rating: 'Effective' }
  })

  const criticalControls = [
    {
      name: 'Emergency Shutdown System',
      description: 'Automated system to safely shut down operations in emergency situations',
      controlTypeId: engineeringType?.id,
      effectivenessId: effectiveRating?.id,
      riskCategoryId: safetyCategory?.id,
      createdById: adminUser.id,
    },
    {
      name: 'Personal Protective Equipment',
      description: 'Mandatory PPE requirements for all personnel in operational areas',
      controlTypeId: administrativeType?.id,
      effectivenessId: effectiveRating?.id,
      riskCategoryId: safetyCategory?.id,
      createdById: adminUser.id,
    },
    {
      name: 'Environmental Monitoring',
      description: 'Continuous monitoring of environmental parameters and emissions',
      controlTypeId: engineeringType?.id,
      effectivenessId: effectiveRating?.id,
      riskCategoryId: environmentalCategory?.id,
      createdById: adminUser.id,
    },
    {
      name: 'Maintenance Procedures',
      description: 'Standardized maintenance procedures and checklists',
      controlTypeId: administrativeType?.id,
      effectivenessId: effectiveRating?.id,
      riskCategoryId: operationalCategory?.id,
      createdById: adminUser.id,
    }
  ]

  for (const control of criticalControls) {
    // Check if control already exists
    const existing = await prisma.criticalControl.findFirst({
      where: { name: control.name }
    })
    
    if (!existing) {
      await prisma.criticalControl.create({
        data: control,
      })
    }
  }
  
  console.log('✅ Critical controls seeded')
} 