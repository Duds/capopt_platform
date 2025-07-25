import { PrismaClient } from '@prisma/client'
import { SeedOptions } from '../config/types'

export async function seedRiskCategories(prisma: PrismaClient, options?: SeedOptions) {
  const riskCategories = [
    {
      name: 'Safety',
      description: 'Safety-related risks including personal injury and equipment damage',
      color: '#FF4444',
    },
    {
      name: 'Environmental',
      description: 'Environmental risks including pollution and resource depletion',
      color: '#44FF44',
    },
    {
      name: 'Operational',
      description: 'Operational risks affecting business continuity and efficiency',
      color: '#4444FF',
    },
    {
      name: 'Financial',
      description: 'Financial risks including cost overruns and budget impacts',
      color: '#FFFF44',
    },
    {
      name: 'Regulatory',
      description: 'Regulatory compliance risks and legal requirements',
      color: '#FF44FF',
    },
    {
      name: 'Technical',
      description: 'Technical risks including system failures and data loss',
      color: '#44FFFF',
    }
  ]

  for (const category of riskCategories) {
    // Check if category already exists
    const existing = await prisma.riskCategory.findFirst({
      where: { name: category.name }
    })
    
    if (!existing) {
      await prisma.riskCategory.create({
        data: category,
      })
    }
  }
  
  console.log('✅ Risk categories seeded')
} 