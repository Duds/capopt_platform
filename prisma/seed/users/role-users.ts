import { PrismaClient } from '@prisma/client'
import { SeedOptions } from '../config/types'
import { SEED_CONSTANTS } from '../config/constants'

export async function seedRoleUsers(prisma: PrismaClient, options?: SeedOptions) {
  const roleUsers = [
    {
      email: 'manager@capopt.com',
      name: 'Operations Manager',
      role: 'MANAGER' as const,
    },
    {
      email: 'security@capopt.com',
      name: 'Security Officer',
      role: 'SECURITY_OFFICER' as const,
    },
    {
      email: 'steward@capopt.com',
      name: 'Data Steward',
      role: 'DATA_STEWARD' as const,
    },
    {
      email: 'process@capopt.com',
      name: 'Process Owner',
      role: 'PROCESS_OWNER' as const,
    },
    {
      email: 'control@capopt.com',
      name: 'Control Owner',
      role: 'CONTROL_OWNER' as const,
    },
    {
      email: 'viewer@capopt.com',
      name: 'Read-Only Viewer',
      role: 'VIEWER' as const,
    },
    {
      email: 'maintenance@capopt.com',
      name: 'Maintenance Technician',
      role: 'MAINTENANCE' as const,
    },
    {
      email: 'auditor@capopt.com',
      name: 'External Auditor',
      role: 'EXTERNAL_AUDITOR' as const,
    },
    {
      email: 'writer@capopt.com',
      name: 'Documentation Specialist',
      role: 'DOCUMENTATION_SPECIALIST' as const,
    }
  ]

  for (const userData of roleUsers) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userData,
        password: SEED_CONSTANTS.DEFAULT_PASSWORD_HASH,
      },
    })
  }
  
  console.log('✅ Role users seeded')
} 