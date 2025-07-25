export interface SeedOptions {
  environment: 'development' | 'testing' | 'staging'
  includeTestData: boolean
  includeSampleData: boolean
  defaultPassword: string
  cleanupBeforeSeed: boolean
  seedSpecificModules?: string[]
}

export interface SeedResult {
  success: boolean
  message: string
  entitiesCreated: number
  entitiesUpdated: number
  errors?: string[]
}

export interface SeedModule {
  name: string
  dependencies: string[]
  seed: (prisma: any, options?: SeedOptions) => Promise<SeedResult>
} 