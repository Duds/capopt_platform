import { PrismaClient } from '@prisma/client'
import { SeedOptions } from '../config/types'
import { SEED_CONSTANTS } from '../config/constants'

export async function seedAdminUsers(prisma: PrismaClient, options?: SeedOptions) {
  const adminUsers = [
    {
      email: 'admin@capopt.com',
      name: 'System Administrator',
      role: 'ADMIN' as const,
    },
    {
      email: 'superadmin@capopt.com',
      name: 'Super Administrator',
      role: 'SUPERADMIN' as const,
    }
  ]

  for (const userData of adminUsers) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userData,
        password: SEED_CONSTANTS.DEFAULT_PASSWORD_HASH,
      },
    })
  }
  
  console.log('✅ Admin users seeded')
} 