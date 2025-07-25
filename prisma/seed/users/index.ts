import { PrismaClient } from '@prisma/client'
import { SeedOptions, SeedResult } from '../config/types'
import { seedAdminUsers } from './admin-users'
import { seedRoleUsers } from './role-users'

export async function seedUsers(prisma: PrismaClient, options?: SeedOptions): Promise<SeedResult> {
  console.log('👥 Seeding users...')
  
  try {
    let entitiesCreated = 0
    let entitiesUpdated = 0
    
    // Seed admin users first
    await seedAdminUsers(prisma, options)
    entitiesCreated += 2 // admin + superadmin
    
    // Seed role users
    await seedRoleUsers(prisma, options)
    entitiesCreated += 9 // all role users
    
    console.log('✅ Users seeded successfully')
    
    return {
      success: true,
      message: 'Users seeded successfully',
      entitiesCreated,
      entitiesUpdated,
    }
  } catch (error) {
    console.error('❌ Error seeding users:', error)
    return {
      success: false,
      message: 'Failed to seed users',
      entitiesCreated: 0,
      entitiesUpdated: 0,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    }
  }
} 