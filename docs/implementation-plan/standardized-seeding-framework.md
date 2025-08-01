# Standardized Seeding Framework Implementation Plan

## Overview

This document outlines the implementation plan for standardizing the CapOpt Platform seeding framework, addressing the issues identified in the seeding strategy audit and establishing enterprise-grade best practices.

## Implementation Phases

### Phase 1: Foundation Standardization (Week 1)

#### 1.1 Enhanced Configuration System

**File: `prisma/seed/config/types.ts`**
```typescript
export interface SeedOptions {
  // Environment
  environment: 'development' | 'testing' | 'staging' | 'production'
  
  // Data Control
  includeTestData: boolean
  includeSampleData: boolean
  cleanupBeforeSeed: boolean
  validateAfterSeed: boolean
  
  // Context
  enterpriseId?: string
  facilityId?: string
  businessUnitId?: string
  
  // Performance
  batchSize: number
  parallelSeeding: boolean
  timeout: number
  
  // Validation
  strictMode: boolean
  skipValidation: boolean
  
  // Rollback
  enableRollback: boolean
  rollbackOnError: boolean
  
  // Monitoring
  enableAudit: boolean
  logLevel: 'error' | 'warn' | 'info' | 'debug'
  
  // Modules
  seedSpecificModules?: string[]
  skipModules?: string[]
}

export interface SeedResult {
  success: boolean
  message: string
  entitiesCreated: number
  entitiesUpdated: number
  entitiesSkipped: number
  errors?: string[]
  warnings?: string[]
  duration: number
  dependencies?: string[]
}

export interface SeedModule {
  name: string
  dependencies: string[]
  seed: (prisma: PrismaClient, options?: SeedOptions) => Promise<SeedResult>
  validate?: (prisma: PrismaClient, options?: SeedOptions) => Promise<ValidationResult>
  rollback?: (prisma: PrismaClient, options?: SeedOptions) => Promise<RollbackResult>
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
  duration: number
}

export interface RollbackResult {
  success: boolean
  operationsRolledBack: number
  errors: string[]
  duration: number
}
```

**File: `prisma/seed/config/environment.ts`**
```typescript
import { SeedOptions } from './types'

export const getSeedConfig = (): SeedOptions => {
  const env = process.env.NODE_ENV || 'development'
  
  return {
    // Environment
    environment: env as 'development' | 'testing' | 'staging' | 'production',
    
    // Data Control
    includeTestData: env === 'development' || env === 'testing',
    includeSampleData: env === 'development',
    cleanupBeforeSeed: env === 'testing',
    validateAfterSeed: true,
    
    // Context
    enterpriseId: process.env.SEED_ENTERPRISE_ID,
    facilityId: process.env.SEED_FACILITY_ID,
    businessUnitId: process.env.SEED_BUSINESS_UNIT_ID,
    
    // Performance
    batchSize: parseInt(process.env.SEED_BATCH_SIZE || '100'),
    parallelSeeding: process.env.SEED_PARALLEL === 'true',
    timeout: parseInt(process.env.SEED_TIMEOUT || '300000'), // 5 minutes
    
    // Validation
    strictMode: process.env.SEED_STRICT_MODE === 'true',
    skipValidation: process.env.SEED_SKIP_VALIDATION === 'true',
    
    // Rollback
    enableRollback: process.env.SEED_ENABLE_ROLLBACK === 'true',
    rollbackOnError: process.env.SEED_ROLLBACK_ON_ERROR === 'true',
    
    // Monitoring
    enableAudit: process.env.SEED_ENABLE_AUDIT === 'true',
    logLevel: (process.env.SEED_LOG_LEVEL as 'error' | 'warn' | 'info' | 'debug') || 'info',
    
    // Modules
    seedSpecificModules: process.env.SEED_MODULES?.split(',') || undefined,
    skipModules: process.env.SEED_SKIP_MODULES?.split(',') || undefined,
    
    // Legacy support
    defaultPassword: process.env.SEED_DEFAULT_PASSWORD || 'admin123',
  }
}
```

#### 1.2 Dependency Management System

**File: `prisma/seed/utils/dependency-manager.ts`**
```typescript
import { SeedModule } from '../config/types'

export interface DependencyGraph {
  nodes: SeedModule[]
  edges: DependencyEdge[]
  cycles: string[][]
  order: string[]
}

export interface DependencyEdge {
  from: string
  to: string
  type: 'required' | 'optional' | 'conditional'
}

export class DependencyManager {
  private modules: Map<string, SeedModule> = new Map()
  private edges: DependencyEdge[] = []
  
  addModule(module: SeedModule): void {
    this.modules.set(module.name, module)
  }
  
  addDependency(from: string, to: string, type: 'required' | 'optional' | 'conditional' = 'required'): void {
    this.edges.push({ from, to, type })
  }
  
  buildGraph(): DependencyGraph {
    const nodes = Array.from(this.modules.values())
    const cycles = this.detectCycles()
    const order = this.topologicalSort()
    
    return {
      nodes,
      edges: this.edges,
      cycles,
      order
    }
  }
  
  private detectCycles(): string[][] {
    // Implementation for cycle detection
    return []
  }
  
  private topologicalSort(): string[] {
    // Implementation for topological sorting
    return []
  }
  
  validateDependencies(): { valid: boolean; errors: string[] } {
    const cycles = this.detectCycles()
    const errors: string[] = []
    
    if (cycles.length > 0) {
      errors.push(`Circular dependencies detected: ${cycles.map(c => c.join(' -> ')).join(', ')}`)
    }
    
    // Check for missing dependencies
    for (const [moduleName, module] of this.modules) {
      for (const dep of module.dependencies) {
        if (!this.modules.has(dep)) {
          errors.push(`Module '${moduleName}' depends on missing module '${dep}'`)
        }
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }
}
```

#### 1.3 Validation Framework

**File: `prisma/seed/utils/validation.ts`**
```typescript
import { PrismaClient } from '@prisma/client'
import { SeedOptions, ValidationResult } from '../config/types'

export interface ValidationRule {
  name: string
  description: string
  validate: (data: any, context: ValidationContext) => Promise<ValidationResult>
  severity: 'error' | 'warning' | 'info'
}

export interface ValidationContext {
  prisma: PrismaClient
  options: SeedOptions
  module: string
}

export interface ValidationError {
  rule: string
  message: string
  data?: any
  severity: 'error' | 'warning' | 'info'
}

export interface ValidationWarning {
  rule: string
  message: string
  data?: any
}

export class ValidationFramework {
  private rules: Map<string, ValidationRule> = new Map()
  
  addRule(rule: ValidationRule): void {
    this.rules.set(rule.name, rule)
  }
  
  async validate(data: any, context: ValidationContext): Promise<ValidationResult> {
    const startTime = Date.now()
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []
    
    for (const [ruleName, rule] of this.rules) {
      try {
        const result = await rule.validate(data, context)
        if (!result.valid) {
          errors.push(...result.errors)
          warnings.push(...result.warnings)
        }
      } catch (error) {
        errors.push({
          rule: ruleName,
          message: `Validation rule '${ruleName}' failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          severity: 'error'
        })
      }
    }
    
    return {
      valid: errors.filter(e => e.severity === 'error').length === 0,
      errors,
      warnings,
      duration: Date.now() - startTime
    }
  }
}

// Common validation rules
export const commonValidationRules: ValidationRule[] = [
  {
    name: 'required-fields',
    description: 'Check that required fields are present',
    severity: 'error',
    validate: async (data: any, context: ValidationContext) => {
      const errors: ValidationError[] = []
      
      if (!data.name || typeof data.name !== 'string') {
        errors.push({
          rule: 'required-fields',
          message: 'Name field is required and must be a string',
          data: data.name,
          severity: 'error'
        })
      }
      
      return {
        valid: errors.length === 0,
        errors,
        warnings: [],
        duration: 0
      }
    }
  },
  {
    name: 'foreign-key-validity',
    description: 'Check that foreign key references are valid',
    severity: 'error',
    validate: async (data: any, context: ValidationContext) => {
      const errors: ValidationError[] = []
      
      // Implementation for foreign key validation
      
      return {
        valid: errors.length === 0,
        errors,
        warnings: [],
        duration: 0
      }
    }
  }
]
```

### Phase 2: Module Standardization (Week 2)

#### 2.1 Standardized Module Template

**File: `prisma/seed/templates/module-template.ts`**
```typescript
import { PrismaClient } from '@prisma/client'
import { SeedModule, SeedOptions, SeedResult, ValidationResult, RollbackResult } from '../config/types'
import { ValidationFramework, commonValidationRules } from '../utils/validation'

export abstract class BaseSeedModule implements SeedModule {
  abstract name: string
  abstract dependencies: string[]
  
  protected prisma: PrismaClient
  protected options: SeedOptions
  protected validationFramework: ValidationFramework
  
  constructor(prisma: PrismaClient, options: SeedOptions) {
    this.prisma = prisma
    this.options = options
    this.validationFramework = new ValidationFramework()
    
    // Add common validation rules
    commonValidationRules.forEach(rule => this.validationFramework.addRule(rule))
  }
  
  async seed(): Promise<SeedResult> {
    const startTime = Date.now()
    let entitiesCreated = 0
    let entitiesUpdated = 0
    let entitiesSkipped = 0
    const errors: string[] = []
    const warnings: string[] = []
    
    try {
      console.log(`🌱 Starting ${this.name} seeding...`)
      
      // Pre-validation
      if (this.options.validateAfterSeed) {
        const validation = await this.validate()
        if (!validation.valid && this.options.strictMode) {
          throw new Error(`Validation failed for ${this.name}: ${validation.errors.map(e => e.message).join(', ')}`)
        }
        warnings.push(...validation.warnings.map(w => w.message))
      }
      
      // Execute seeding
      const result = await this.executeSeed()
      entitiesCreated = result.entitiesCreated
      entitiesUpdated = result.entitiesUpdated
      entitiesSkipped = result.entitiesSkipped
      
      // Post-validation
      if (this.options.validateAfterSeed) {
        const validation = await this.validate()
        if (!validation.valid) {
          warnings.push(...validation.warnings.map(w => w.message))
        }
      }
      
      console.log(`✅ ${this.name} seeding completed successfully`)
      
      return {
        success: true,
        message: `${this.name} seeded successfully`,
        entitiesCreated,
        entitiesUpdated,
        entitiesSkipped,
        errors,
        warnings,
        duration: Date.now() - startTime,
        dependencies: this.dependencies
      }
      
    } catch (error) {
      console.error(`❌ Error seeding ${this.name}:`, error)
      
      // Rollback on error if enabled
      if (this.options.rollbackOnError && this.options.enableRollback) {
        try {
          await this.rollback()
          console.log(`🔄 Rolled back ${this.name} due to error`)
        } catch (rollbackError) {
          console.error(`❌ Rollback failed for ${this.name}:`, rollbackError)
        }
      }
      
      return {
        success: false,
        message: `Failed to seed ${this.name}`,
        entitiesCreated,
        entitiesUpdated,
        entitiesSkipped,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        warnings,
        duration: Date.now() - startTime,
        dependencies: this.dependencies
      }
    }
  }
  
  async validate(): Promise<ValidationResult> {
    const data = await this.getDataForValidation()
    return this.validationFramework.validate(data, {
      prisma: this.prisma,
      options: this.options,
      module: this.name
    })
  }
  
  async rollback(): Promise<RollbackResult> {
    const startTime = Date.now()
    let operationsRolledBack = 0
    const errors: string[] = []
    
    try {
      console.log(`🔄 Rolling back ${this.name}...`)
      
      const result = await this.executeRollback()
      operationsRolledBack = result.operationsRolledBack
      
      console.log(`✅ ${this.name} rollback completed successfully`)
      
      return {
        success: true,
        operationsRolledBack,
        errors,
        duration: Date.now() - startTime
      }
      
    } catch (error) {
      console.error(`❌ Error rolling back ${this.name}:`, error)
      
      return {
        success: false,
        operationsRolledBack,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        duration: Date.now() - startTime
      }
    }
  }
  
  // Abstract methods to be implemented by concrete modules
  protected abstract executeSeed(): Promise<{
    entitiesCreated: number
    entitiesUpdated: number
    entitiesSkipped: number
  }>
  
  protected abstract executeRollback(): Promise<{
    operationsRolledBack: number
  }>
  
  protected abstract getDataForValidation(): Promise<any>
}
```

#### 2.2 Updated Main Orchestrator

**File: `prisma/seed/index.ts`**
```typescript
import { PrismaClient } from '@prisma/client'
import { getSeedConfig } from './config/environment'
import { DependencyManager } from './utils/dependency-manager'
import { ValidationFramework } from './utils/validation'
import { SeedOptions, SeedResult } from './config/types'

// Import all modules
import { UsersSeedModule } from './users'
import { IndustriesSeedModule } from './industries'
import { EnterpriseSeedModule } from './enterprise'
import { ControlsSeedModule } from './controls'
import { OperationalSeedModule } from './operational'
import { FrameworksSeedModule } from './frameworks'
import { StrategicSeedModule } from './strategic'
import { TemplatesSeedModule } from './templates'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting CapOpt Platform database seeding...')
  
  const options = getSeedConfig()
  const dependencyManager = new DependencyManager()
  const validationFramework = new ValidationFramework()
  
  try {
    // Register all modules
    const modules = [
      new UsersSeedModule(prisma, options),
      new IndustriesSeedModule(prisma, options),
      new EnterpriseSeedModule(prisma, options),
      new ControlsSeedModule(prisma, options),
      new OperationalSeedModule(prisma, options),
      new FrameworksSeedModule(prisma, options),
      new StrategicSeedModule(prisma, options),
      new TemplatesSeedModule(prisma, options)
    ]
    
    modules.forEach(module => {
      dependencyManager.addModule(module)
      module.dependencies.forEach(dep => {
        dependencyManager.addDependency(module.name, dep)
      })
    })
    
    // Validate dependencies
    const dependencyValidation = dependencyManager.validateDependencies()
    if (!dependencyValidation.valid) {
      throw new Error(`Dependency validation failed: ${dependencyValidation.errors.join(', ')}`)
    }
    
    // Build execution order
    const graph = dependencyManager.buildGraph()
    console.log(`📋 Execution order: ${graph.order.join(' → ')}`)
    
    // Execute seeding
    const results: Map<string, SeedResult> = new Map()
    
    for (const moduleName of graph.order) {
      const module = modules.find(m => m.name === moduleName)
      if (!module) continue
      
      // Skip if not in specific modules list
      if (options.seedSpecificModules && !options.seedSpecificModules.includes(moduleName)) {
        console.log(`⏭️ Skipping ${moduleName} (not in specific modules list)`)
        continue
      }
      
      // Skip if in skip modules list
      if (options.skipModules && options.skipModules.includes(moduleName)) {
        console.log(`⏭️ Skipping ${moduleName} (in skip modules list)`)
        continue
      }
      
      const result = await module.seed()
      results.set(moduleName, result)
      
      if (!result.success && options.rollbackOnError) {
        console.error(`❌ Seeding failed for ${moduleName}, stopping execution`)
        break
      }
    }
    
    // Generate summary
    const summary = generateSummary(results)
    console.log('📊 Seeding Summary:', summary)
    
    console.log('✅ Database seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

function generateSummary(results: Map<string, SeedResult>) {
  let totalCreated = 0
  let totalUpdated = 0
  let totalSkipped = 0
  let totalErrors = 0
  let totalWarnings = 0
  let totalDuration = 0
  
  for (const result of results.values()) {
    totalCreated += result.entitiesCreated
    totalUpdated += result.entitiesUpdated
    totalSkipped += result.entitiesSkipped
    totalErrors += result.errors?.length || 0
    totalWarnings += result.warnings?.length || 0
    totalDuration += result.duration
  }
  
  return {
    modules: results.size,
    entitiesCreated: totalCreated,
    entitiesUpdated: totalUpdated,
    entitiesSkipped: totalSkipped,
    totalErrors,
    totalWarnings,
    totalDuration: `${(totalDuration / 1000).toFixed(2)}s`
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### Phase 3: Enhanced Scripts and Documentation (Week 3)

#### 3.1 Updated Package.json Scripts

```json
{
  "scripts": {
    "db:seed": "tsx prisma/seed/index.ts",
    "db:seed:dev": "NODE_ENV=development tsx prisma/seed/index.ts",
    "db:seed:test": "NODE_ENV=testing tsx prisma/seed/index.ts",
    "db:seed:staging": "NODE_ENV=staging tsx prisma/seed/index.ts",
    "db:seed:production": "NODE_ENV=production tsx prisma/seed/index.ts",
    
    "db:seed:validate": "SEED_SKIP_VALIDATION=false tsx prisma/seed/index.ts",
    "db:seed:strict": "SEED_STRICT_MODE=true tsx prisma/seed/index.ts",
    "db:seed:parallel": "SEED_PARALLEL=true tsx prisma/seed/index.ts",
    
    "db:seed:users": "SEED_MODULES=users tsx prisma/seed/index.ts",
    "db:seed:enterprise": "SEED_MODULES=enterprise tsx prisma/seed/index.ts",
    "db:seed:controls": "SEED_MODULES=controls tsx prisma/seed/index.ts",
    "db:seed:operational": "SEED_MODULES=operational tsx prisma/seed/index.ts",
    "db:seed:strategic": "SEED_MODULES=strategic tsx prisma/seed/index.ts",
    "db:seed:frameworks": "SEED_MODULES=frameworks tsx prisma/seed/index.ts",
    
    "db:seed:audit": "SEED_ENABLE_AUDIT=true tsx prisma/seed/index.ts",
    "db:seed:rollback": "SEED_ENABLE_ROLLBACK=true tsx prisma/seed/index.ts",
    
    "db:clean": "tsx prisma/seed/utils/cleanup.ts",
    "db:reset": "npx prisma migrate reset --force && npm run db:seed:test",
    "db:validate": "tsx prisma/seed/utils/validate-dependencies.ts"
  }
}
```

## Migration Strategy

### Step 1: Gradual Migration
1. Create new standardized modules alongside existing ones
2. Test new modules thoroughly
3. Gradually replace old modules
4. Remove old modules once migration is complete

### Step 2: Backward Compatibility
1. Maintain existing function signatures during transition
2. Provide migration utilities for existing data
3. Update documentation with migration guides

### Step 3: Testing Strategy
1. Unit tests for each module
2. Integration tests for dependency management
3. End-to-end tests for complete seeding process
4. Performance tests for large datasets

## Success Criteria

1. **Consistency**: All modules use standardized interfaces
2. **Reliability**: 99%+ successful seeding operations
3. **Performance**: 50% reduction in seeding time
4. **Maintainability**: 80% reduction in seeding-related bugs
5. **Usability**: Clear error messages and recovery options

## Risk Mitigation

1. **Data Loss**: Comprehensive rollback testing
2. **Performance**: Performance monitoring and optimization
3. **Dependencies**: Automated dependency validation
4. **Configuration**: Configuration validation and defaults

This implementation plan provides a roadmap for transforming the seeding system into an enterprise-grade solution that supports the platform's critical control theory implementation and operational requirements. 