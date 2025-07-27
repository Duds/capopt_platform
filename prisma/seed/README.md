# CapOps Platform - Seed Management Plan

## Overview
This document outlines the comprehensive seed management strategy for the CapOps platform, following modular organization principles and supporting the Critical Control Theory (CCT) implementation.

## Seed Architecture

### Directory Structure
```
prisma/
├── seed/
│   ├── index.ts                 # Main seed orchestrator
│   ├── config/
│   │   ├── environment.ts       # Environment-specific configs
│   │   ├── constants.ts         # Shared constants
│   │   └── types.ts            # TypeScript types
│   ├── enterprise/
│   │   ├── index.ts            # Enterprise seeding orchestrator
│   │   ├── enterprises.ts       # Enterprise data
│   │   ├── facilities.ts        # Facility data
│   │   ├── business-units.ts    # Business unit data
│   │   └── departments.ts       # Department data
│   ├── users/
│   │   ├── index.ts            # User seeding orchestrator
│   │   ├── admin-users.ts      # Admin user creation
│   │   ├── role-users.ts       # Role-specific users
│   │   └── test-users.ts       # Test user scenarios
│   ├── strategic/
│   │   ├── index.ts            # Strategic layer seeding
│   │   ├── business-canvas.ts  # Business canvas data
│   │   ├── operating-model.ts  # Operating model data
│   │   └── value-chain.ts      # Value chain data
│   ├── controls/
│   │   ├── index.ts            # Control layer seeding
│   │   ├── critical-controls.ts # Critical controls data
│   │   ├── risk-categories.ts  # Risk categories
│   │   ├── control-types.ts    # Control types
│   │   ├── bowtie-models.ts    # Bowtie analysis data
│   │   └── verification-logs.ts # Verification logs
│   ├── risk/
│   │   ├── index.ts            # Risk propagation seeding
│   │   ├── risk-signals.ts     # Risk signals
│   │   ├── risk-thresholds.ts  # Risk thresholds
│   │   └── risk-alerts.ts      # Risk alerts
│   ├── operational/
│   │   ├── index.ts            # Operational layer seeding
│   │   ├── processes.ts        # Process data
│   │   ├── playbooks.ts        # Playbook data
│   │   └── maturity.ts         # Maturity assessment data
│   ├── assets/
│   │   ├── index.ts            # Asset layer seeding
│   │   ├── equipment.ts        # Equipment data
│   │   ├── facilities.ts       # Facility data
│   │   └── monitoring.ts       # Asset monitoring data
│   └── utils/
│       ├── helpers.ts          # Common seeding utilities
│       ├── validators.ts       # Data validation helpers
│       └── cleanup.ts          # Cleanup utilities
├── seed.ts                     # Legacy main seed (deprecated)
└── schema.prisma
```

## Seed Configuration

### Environment Configuration
```typescript
// config/environment.ts
export interface SeedOptions {
  environment: 'development' | 'testing' | 'staging'
  includeTestData: boolean
  includeSampleData: boolean
  defaultPassword: string
  cleanupBeforeSeed: boolean
  seedSpecificModules?: string[]
  enterpriseId?: string
  facilityId?: string
}

export const getSeedConfig = (): SeedOptions => {
  const env = process.env.NODE_ENV || 'development'
  
  return {
    environment: env as 'development' | 'testing' | 'staging',
    includeTestData: env === 'development' || env === 'testing',
    includeSampleData: env === 'development',
    defaultPassword: process.env.SEED_DEFAULT_PASSWORD || 'admin123',
    cleanupBeforeSeed: env === 'testing',
    seedSpecificModules: process.env.SEED_MODULES?.split(',') || undefined,
    enterpriseId: process.env.SEED_ENTERPRISE_ID,
    facilityId: process.env.SEED_FACILITY_ID,
  }
}
```

### Constants Management
```typescript
// config/constants.ts
export const SEED_CONSTANTS = {
  // User constants
  DEFAULT_PASSWORD_HASH: '$2b$12$AFRDpiSEF5eSylOdT7WsHunO49KQo/sMpWgRkB.hIpEqgvr5st79K',
  
  // Enterprise constants
  DEFAULT_ENTERPRISE: {
    name: 'Cracked Mountain Pty Ltd',
    legalName: 'Cracked Mountain Pty Ltd',
    abn: '12345678901',
    acn: '123456789',
    industry: 'Mining',
    sector: 'Metals and Minerals',
  },
  
  // Facility constants
  DEFAULT_FACILITY: {
    name: 'Hercules Levee',
    code: 'HL001',
    type: 'MINE',
    location: 'Roxby Downs, South Australia',
    capacity: '200,000 tonnes copper, 4,000 tonnes uranium, 80,000 oz gold, 800,000 oz silver annually',
  },
  
  // Control constants
  DEFAULT_CONTROL_STATUS: 'ACTIVE',
  DEFAULT_RISK_LEVEL: 'MEDIUM',
  DEFAULT_VERIFICATION_FREQUENCY: 'Weekly',
  
  // Process constants
  DEFAULT_PROCESS_STATUS: 'ACTIVE',
  DEFAULT_PROCESS_PRIORITY: 'MEDIUM',
  
  // Asset constants
  DEFAULT_ASSET_STATUS: 'OPERATIONAL',
  DEFAULT_MAINTENANCE_INTERVAL: 30, // days
} as const
```

## Seed Modules

### 1. Enterprise Module
**Purpose**: Seed enterprise information system foundation

**Dependencies**: None (foundation module)

**Data Structure**:
- Enterprise: Cracked Mountain Pty Ltd
- Facilities: Hercules Levee (HL001)
- Business Units: 12 units (MINING, PROCESSING, etc.)
- Departments: 20+ departments across business units

**Key Features**:
- Multi-facility enterprise structure
- Operational streams (Copper, Uranium, Gold, Silver)
- Organizational hierarchy with realistic staffing

### 2. Users Module
**Purpose**: Seed user management and authentication

**Dependencies**: Enterprise module

**Data Structure**:
- Admin users (System Administrator, Super Administrator)
- Role-specific users (13 custom roles)
- Test users for development scenarios

**Key Features**:
- Role-based access control (RBAC)
- Enterprise and department assignments
- Secure password hashing

### 3. Strategic Module
**Purpose**: Seed strategic layer components

**Dependencies**: Enterprise module

**Data Structure**:
- Business Model Canvas with 9 sections
- Operating Model Canvas
- Value Chain Management
- Service Model Framework

**Key Features**:
- Complete business model canvas
- Strategic navigation flow
- Value proposition mapping

### 4. Controls Module
**Purpose**: Seed Critical Control Theory implementation

**Dependencies**: Enterprise, Users modules

**Data Structure**:
- Critical controls with verification workflows
- Risk categories and control types
- Bowtie analysis models
- Verification logs and attestations

**Key Features**:
- CCT implementation with control verification
- Bowtie risk modelling
- Control effectiveness tracking

### 5. Risk Module
**Purpose**: Seed risk propagation engine

**Dependencies**: Controls, Operational modules

**Data Structure**:
- Risk signals from frontline operations
- Risk propagation calculations
- Risk thresholds and alerts
- Risk insights and narratives

**Key Features**:
- Trickle-up risk model
- Risk threshold management
- Automated risk alerts

### 6. Operational Module
**Purpose**: Seed operational layer components

**Dependencies**: Enterprise, Users modules

**Data Structure**:
- Process management with steps
- Playbook and procedure management
- Maturity assessments
- Process-control linkages

**Key Features**:
- Process mapping and documentation
- Playbook orchestration
- Maturity scoring

### 7. Assets Module
**Purpose**: Seed asset management system

**Dependencies**: Enterprise, Controls modules

**Data Structure**:
- Equipment and facility assets
- Asset risk assessments
- Asset protection measures
- Asset monitoring systems

**Key Features**:
- Asset lifecycle management
- Asset-control linkages
- Asset performance tracking

## Seeding Strategies

### Development Seeding
```typescript
// Quick development seeding
export async function seedDevelopment(prisma: PrismaClient) {
  const config = getSeedConfig()
  
  console.log('🚀 Starting development seed...')
  
  // Essential data only
  await seedEnterprise(prisma, { ...config, includeSampleData: true })
  await seedUsers(prisma, { ...config, includeTestData: false })
  await seedControls(prisma, { ...config, includeSampleData: true })
  await seedStrategic(prisma, { ...config, includeSampleData: true })
  
  console.log('✅ Development seed complete')
}
```

### Testing Seeding
```typescript
// Comprehensive testing seeding
export async function seedTesting(prisma: PrismaClient) {
  const config = getSeedConfig()
  
  console.log('🧪 Starting testing seed...')
  
  // Clean database first
  if (config.cleanupBeforeSeed) {
    await cleanupDatabase(prisma)
  }
  
  // All data including test scenarios
  await seedEnterprise(prisma, { ...config, includeSampleData: true })
  await seedUsers(prisma, { ...config, includeTestData: true })
  await seedControls(prisma, { ...config, includeSampleData: true })
  await seedRisk(prisma, { ...config, includeSampleData: true })
  await seedOperational(prisma, { ...config, includeSampleData: true })
  await seedAssets(prisma, { ...config, includeSampleData: true })
  await seedStrategic(prisma, { ...config, includeSampleData: true })
  
  console.log('✅ Testing seed complete')
}
```

### Production Seeding
```typescript
// Production-safe seeding
export async function seedProduction(prisma: PrismaClient) {
  const config = getSeedConfig()
  
  console.log('🏭 Starting production seed...')
  
  // Essential data only, no test data
  await seedEnterprise(prisma, { ...config, includeSampleData: false })
  await seedUsers(prisma, { ...config, includeTestData: false })
  await seedControls(prisma, { ...config, includeSampleData: false })
  
  console.log('✅ Production seed complete')
}
```

## Package.json Scripts

### Seed Scripts
```json
{
  "scripts": {
    "seed": "tsx prisma/seed/index.ts",
    "seed:dev": "NODE_ENV=development tsx prisma/seed/index.ts",
    "seed:test": "NODE_ENV=testing tsx prisma/seed/index.ts",
    "seed:prod": "NODE_ENV=production tsx prisma/seed/index.ts",
    "seed:enterprise": "tsx prisma/seed/index.ts --modules=enterprise",
    "seed:users": "tsx prisma/seed/index.ts --modules=users",
    "seed:controls": "tsx prisma/seed/index.ts --modules=controls",
    "seed:risk": "tsx prisma/seed/index.ts --modules=risk",
    "seed:operational": "tsx prisma/seed/index.ts --modules=operational",
    "seed:assets": "tsx prisma/seed/index.ts --modules=assets",
    "seed:strategic": "tsx prisma/seed/index.ts --modules=strategic",
    "seed:clean": "tsx prisma/seed/utils/cleanup.ts",
    "db:reset": "prisma migrate reset --force && npm run seed:test"
  }
}
```

## Migration Strategy

### Phase 1: Foundation (Week 1)
1. **Enterprise Module**: Complete enterprise information system
2. **Users Module**: User management and authentication
3. **Basic Controls**: Critical control foundation

### Phase 2: Core CapOps (Week 2)
1. **Controls Module**: Complete CCT implementation
2. **Risk Module**: Risk propagation engine
3. **Strategic Module**: Business canvas and operating model

### Phase 3: Operational Layer (Week 3)
1. **Operational Module**: Process and playbook management
2. **Assets Module**: Asset lifecycle management
3. **Integration**: Cross-module relationships

### Phase 4: Advanced Features (Week 4)
1. **Bowtie Models**: Interactive risk modelling
2. **Verification Workflows**: Control attestation
3. **Risk Insights**: Advanced risk analytics

## Quality Assurance

### Data Validation
- **Schema Validation**: All data conforms to Prisma schema
- **Relationship Integrity**: Foreign key constraints maintained
- **Business Logic**: Data reflects real-world scenarios
- **Performance**: Efficient seeding for large datasets

### Testing Strategy
- **Unit Tests**: Individual seed module testing
- **Integration Tests**: Cross-module relationship testing
- **End-to-End Tests**: Complete platform functionality
- **Performance Tests**: Large dataset seeding performance

### Documentation
- **Seed Data Documentation**: Clear documentation of all seed data
- **Relationship Maps**: Visual representation of data relationships
- **Business Context**: Real-world scenarios and use cases
- **Maintenance Guide**: Procedures for updating seed data

## Success Metrics

### Technical Metrics
- **Seed Completion Time**: < 30 seconds for full seed
- **Data Integrity**: 100% foreign key constraint compliance
- **Memory Usage**: < 500MB peak memory usage
- **Error Rate**: 0% seed failures

### Business Metrics
- **Test Coverage**: 100% of platform features covered
- **Scenario Coverage**: All business scenarios represented
- **Data Quality**: Realistic and comprehensive test data
- **Maintainability**: Easy to update and extend seed data

## Next Steps

1. **Implement Modular Structure**: Create the directory structure and base files
2. **Migrate Existing Data**: Move current seed data to modular structure
3. **Add New Modules**: Implement CCT and risk propagation modules
4. **Update Documentation**: Complete seed data documentation
5. **Performance Optimization**: Optimize seeding for large datasets
6. **Testing Implementation**: Add comprehensive testing strategy

This seed management plan provides a comprehensive foundation for the CapOps platform, ensuring organized, maintainable, and scalable database seeding with proper separation of concerns and clear management strategies. 