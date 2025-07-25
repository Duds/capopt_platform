import { SeedOptions } from './types'

export const getSeedConfig = (): SeedOptions => {
  const env = process.env.NODE_ENV || 'development'
  
  return {
    environment: env as 'development' | 'testing' | 'staging',
    includeTestData: env === 'development' || env === 'testing',
    includeSampleData: env === 'development',
    defaultPassword: process.env.SEED_DEFAULT_PASSWORD || 'admin123',
    cleanupBeforeSeed: env === 'testing',
    seedSpecificModules: process.env.SEED_MODULES?.split(',') || undefined,
  }
} 