# CapOpt Platform - Comprehensive Testing Strategy

> **Related documentation:**
> - Current Status: @docs/current-status-summary.md
> - Graph Implementation: @docs/implementation-status/graph-relational-implementation-summary.md
> - Testing Standards: @docs/testing-standards.md

## Testing Overview

This document outlines a comprehensive testing strategy for all currently implemented features of the CapOpt Platform, including:

1. **Authentication & Authorization System**
2. **Business Model Canvas**
3. **Critical Controls Management**
4. **Dashboard & Analytics**
5. **Graph-Relational Hybrid Architecture**
6. **Master Data Hierarchy**
7. **Process Management**
8. **Asset Management**

---

## 🧪 **Testing Pyramid**

```
                    E2E Tests (UI Integration)
                ┌─────────────────────────────────┐
                │                                 │
           ┌────┴────┐                    ┌──────┴──────┐
           │         │                    │             │
    Integration Tests              Graph-Relational Tests
    ┌───────────────┐              ┌─────────────────────┐
    │               │              │                     │
┌───┴───┐    ┌─────┴─────┐    ┌────┴────┐        ┌──────┴──────┐
│       │    │           │    │         │        │             │
Unit    │    │ API       │    │ Graph   │        │ Master Data │
Tests   │    │ Tests     │    │ Service │        │ Tests       │
│       │    │           │    │ Tests   │        │             │
└───────┘    └───────────┘    └─────────┘        └─────────────┘
```

---

## 📋 **Test Categories**

### **1. Unit Tests**
- **Purpose**: Test individual functions and components in isolation
- **Coverage**: 80%+ code coverage
- **Tools**: Jest, React Testing Library
- **Scope**: Services, utilities, hooks, components

### **2. Integration Tests**
- **Purpose**: Test interactions between components and services
- **Coverage**: API endpoints, database operations
- **Tools**: Jest, Supertest, Prisma
- **Scope**: API routes, database queries, service interactions

### **3. Graph-Relational Tests**
- **Purpose**: Test Graph-Relational Hybrid architecture
- **Coverage**: Graph operations, hybrid queries, traversal
- **Tools**: Jest, Prisma, Custom test utilities
- **Scope**: GraphService, HybridQueryService, graph APIs

### **4. Master Data Tests**
- **Purpose**: Test master data hierarchy and relationships
- **Coverage**: Industry → Sector → Facility Types → Operational Streams → Compliance → Regulatory Framework
- **Tools**: Jest, Prisma, Custom test utilities
- **Scope**: Master data CRUD, hierarchy validation, pattern assignments

### **5. E2E Tests**
- **Purpose**: Test complete user workflows
- **Coverage**: Critical user journeys
- **Tools**: Playwright
- **Scope**: Authentication, Business Canvas, Controls, Dashboard

---

## 🔧 **Testing Infrastructure Setup**

### **Test Environment Configuration**
```typescript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### **Test Database Setup**
```typescript
// tests/setup/test-database.ts
import { PrismaClient } from '@prisma/client';
import { GraphService } from '@/lib/services/graph.service';

export class TestDatabase {
  private prisma: PrismaClient;
  private graphService: GraphService;

  constructor() {
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.TEST_DATABASE_URL,
        },
      },
    });
    this.graphService = new GraphService();
  }

  async setup() {
    // Clean database
    await this.cleanDatabase();
    
    // Seed test data
    await this.seedTestData();
    
    // Setup graph nodes
    await this.setupGraphNodes();
  }

  async teardown() {
    await this.cleanDatabase();
    await this.prisma.$disconnect();
  }

  private async cleanDatabase() {
    // Clean in reverse dependency order
    const tables = [
      'edges', 'nodes',
      'business_canvas_facility_types', 'business_canvas_compliance_frameworks', 'business_canvas_operational_streams',
      'pattern_applications', 'assignment_patterns',
      'canvas_exports', 'canvas_sharing_settings', 'canvas_collaborators', 'canvas_versions',
      'value_propositions', 'customer_segments', 'revenue_streams', 'partnerships', 'resources', 'activities', 'cost_structures', 'channels',
      'business_canvases',
      'process_controls', 'process_risks', 'process_metrics', 'process_outputs', 'process_inputs', 'process_steps', 'processes',
      'departments', 'business_units', 'facilities', 'enterprises',
      'master_controls', 'master_hazards', 'master_vendors', 'master_systems', 'master_roles',
      'industry_regulatory_framework_associations', 'industry_compliance_requirement_associations',
      'industry_operational_stream_associations', 'industry_facility_type_associations',
      'industry_compliance_frameworks', 'industry_operational_streams',
      'sectors', 'industry_facility_types', 'industries',
      'operational_streams', 'facility_types', 'compliance_requirements', 'regulatory_frameworks',
      'users',
    ];

    for (const table of tables) {
      await this.prisma.$executeRaw`TRUNCATE TABLE "${table}" CASCADE`;
    }
  }

  private async seedTestData() {
    // Seed master data hierarchy
    await this.seedMasterDataHierarchy();
    
    // Seed enterprise data
    await this.seedEnterpriseData();
    
    // Seed business canvas data
    await this.seedBusinessCanvasData();
    
    // Seed process data
    await this.seedProcessData();
  }

  private async setupGraphNodes() {
    // Create graph nodes for all entities
    await this.createGraphNodes();
    
    // Create graph relationships
    await this.createGraphRelationships();
  }
}
```

---

## 🧪 **Test Suites**

### **1. Authentication & Authorization Tests**

#### **Unit Tests**
```typescript
// tests/unit/auth/auth.service.test.ts
describe('Authentication Service', () => {
  describe('login', () => {
    it('should authenticate valid user credentials', async () => {
      // Test valid login
    });

    it('should reject invalid credentials', async () => {
      // Test invalid login
    });

    it('should handle locked accounts', async () => {
      // Test account lockout
    });
  });

  describe('authorization', () => {
    it('should enforce role-based access control', async () => {
      // Test RBAC
    });

    it('should handle permission inheritance', async () => {
      // Test permission hierarchy
    });
  });
});
```

#### **Integration Tests**
```typescript
// tests/integration/auth/auth.api.test.ts
describe('Authentication API', () => {
  describe('POST /api/auth/login', () => {
    it('should return JWT token for valid credentials', async () => {
      // Test login endpoint
    });

    it('should set secure HTTP-only cookies', async () => {
      // Test cookie security
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should return user profile for authenticated user', async () => {
      // Test profile endpoint
    });

    it('should reject unauthenticated requests', async () => {
      // Test authentication requirement
    });
  });
});
```

### **2. Business Model Canvas Tests**

#### **Unit Tests**
```typescript
// tests/unit/business-canvas/canvas.service.test.ts
describe('Business Canvas Service', () => {
  describe('CRUD operations', () => {
    it('should create new canvas', async () => {
      // Test canvas creation
    });

    it('should update canvas sections', async () => {
      // Test section updates
    });

    it('should delete canvas', async () => {
      // Test canvas deletion
    });
  });

  describe('validation', () => {
    it('should validate required fields', async () => {
      // Test field validation
    });

    it('should enforce business rules', async () => {
      // Test business logic
    });
  });
});
```

#### **Integration Tests**
```typescript
// tests/integration/business-canvas/canvas.api.test.ts
describe('Business Canvas API', () => {
  describe('GET /api/business-canvas', () => {
    it('should return user canvases', async () => {
      // Test canvas listing
    });

    it('should filter by enterprise', async () => {
      // Test enterprise filtering
    });
  });

  describe('POST /api/business-canvas', () => {
    it('should create new canvas', async () => {
      // Test canvas creation
    });

    it('should validate input data', async () => {
      // Test input validation
    });
  });

  describe('GET /api/business-canvas/[id]', () => {
    it('should return canvas with all sections', async () => {
      // Test canvas retrieval
    });

    it('should include graph relationships', async () => {
      // Test hybrid query
    });
  });
});
```

### **3. Graph-Relational Tests**

#### **Graph Service Tests**
```typescript
// tests/unit/graph/graph.service.test.ts
describe('Graph Service', () => {
  describe('node operations', () => {
    it('should create graph nodes', async () => {
      // Test node creation
    });

    it('should update node metadata', async () => {
      // Test metadata updates
    });

    it('should delete nodes and relationships', async () => {
      // Test node deletion
    });
  });

  describe('edge operations', () => {
    it('should create relationships', async () => {
      // Test edge creation
    });

    it('should validate relationship types', async () => {
      // Test relationship validation
    });
  });

  describe('graph traversal', () => {
    it('should traverse graph with depth limit', async () => {
      // Test BFS traversal
    });

    it('should find relationship paths', async () => {
      // Test path finding
    });
  });
});
```

#### **Hybrid Query Tests**
```typescript
// tests/unit/graph/hybrid-query.service.test.ts
describe('Hybrid Query Service', () => {
  describe('business canvas queries', () => {
    it('should combine relational and graph data', async () => {
      // Test hybrid queries
    });

    it('should include relationship analytics', async () => {
      // Test relationship data
    });
  });

  describe('process queries', () => {
    it('should include control relationships', async () => {
      // Test process-control relationships
    });

    it('should show organizational hierarchy', async () => {
      // Test hierarchy queries
    });
  });
});
```

### **4. Master Data Hierarchy Tests**

#### **Industry → Sector → Facility Types Tests**
```typescript
// tests/unit/master-data/industry-hierarchy.test.ts
describe('Industry Hierarchy', () => {
  describe('industry operations', () => {
    it('should create industry with sectors', async () => {
      // Test industry creation
    });

    it('should validate industry codes', async () => {
      // Test code validation
    });
  });

  describe('sector operations', () => {
    it('should create sectors under industry', async () => {
      // Test sector creation
    });

    it('should enforce sector uniqueness', async () => {
      // Test uniqueness constraints
    });
  });

  describe('facility type associations', () => {
    it('should associate facility types with industries', async () => {
      // Test facility type associations
    });

    it('should validate risk profiles', async () => {
      // Test risk profile validation
    });
  });
});
```

#### **Operational Streams Tests**
```typescript
// tests/unit/master-data/operational-streams.test.ts
describe('Operational Streams', () => {
  describe('stream creation', () => {
    it('should create operational streams', async () => {
      // Test stream creation
    });

    it('should categorize streams correctly', async () => {
      // Test categorization
    });
  });

  describe('industry associations', () => {
    it('should associate streams with industries', async () => {
      // Test industry associations
    });

    it('should support sector-specific streams', async () => {
      // Test sector associations
    });
  });
});
```

#### **Compliance & Regulatory Tests**
```typescript
// tests/unit/master-data/compliance-regulatory.test.ts
describe('Compliance & Regulatory Framework', () => {
  describe('compliance requirements', () => {
    it('should create compliance requirements', async () => {
      // Test requirement creation
    });

    it('should map to regulatory frameworks', async () => {
      // Test framework mapping
    });
  });

  describe('regulatory frameworks', () => {
    it('should support multiple standards', async () => {
      // Test standards support
    });

    it('should validate framework associations', async () => {
      // Test association validation
    });
  });
});
```

### **5. Pattern Assignment Tests**

#### **Assignment Pattern Tests**
```typescript
// tests/unit/patterns/assignment-patterns.test.ts
describe('Assignment Patterns', () => {
  describe('pattern creation', () => {
    it('should create assignment patterns', async () => {
      // Test pattern creation
    });

    it('should validate pattern rules', async () => {
      // Test rule validation
    });
  });

  describe('pattern application', () => {
    it('should apply patterns to business canvases', async () => {
      // Test pattern application
    });

    it('should handle pattern conflicts', async () => {
      // Test conflict resolution
    });
  });
});
```

### **6. E2E Tests**

#### **Authentication Flow**
```typescript
// tests/e2e/auth-flow.test.ts
describe('Authentication Flow', () => {
  it('should allow user to login and access dashboard', async () => {
    // Test complete login flow
  });

  it('should enforce role-based access', async () => {
    // Test RBAC enforcement
  });

  it('should handle session management', async () => {
    // Test session handling
  });
});
```

#### **Business Canvas Flow**
```typescript
// tests/e2e/business-canvas-flow.test.ts
describe('Business Canvas Flow', () => {
  it('should create and edit business canvas', async () => {
    // Test canvas creation and editing
  });

  it('should save and load canvas data', async () => {
    // Test data persistence
  });

  it('should show graph relationships', async () => {
    // Test graph visualization
  });
});
```

#### **Master Data Flow**
```typescript
// tests/e2e/master-data-flow.test.ts
describe('Master Data Flow', () => {
  it('should navigate industry hierarchy', async () => {
    // Test hierarchy navigation
  });

  it('should select facility types and streams', async () => {
    // Test selection workflows
  });

  it('should apply compliance frameworks', async () => {
    // Test framework application
  });
});
```

---

## 🚀 **Test Execution Strategy**

### **Local Development**
```bash
# Run all tests
npm test

# Run specific test categories
npm run test:unit
npm run test:integration
npm run test:graph
npm run test:master-data
npm run test:e2e

# Run with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### **CI/CD Pipeline**
```yaml
# .github/workflows/test.yml
name: Comprehensive Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run test:graph
      - run: npm run test:master-data
      - run: npm run test:e2e
      - run: npm run test:coverage
```

---

## 📊 **Test Coverage Requirements**

### **Code Coverage Targets**
- **Unit Tests**: 80%+ coverage
- **Integration Tests**: 70%+ coverage
- **Graph-Relational Tests**: 90%+ coverage
- **Master Data Tests**: 85%+ coverage
- **E2E Tests**: Critical path coverage

### **Coverage Reports**
```typescript
// jest.config.js
collectCoverageFrom: [
  'app/**/*.{ts,tsx}',
  'components/**/*.{ts,tsx}',
  'lib/**/*.{ts,tsx}',
  'hooks/**/*.{ts,tsx}',
  '!**/*.d.ts',
  '!**/node_modules/**',
  '!**/tests/**',
],
coverageReporters: ['text', 'lcov', 'html'],
coverageDirectory: 'coverage',
```

---

## 🔍 **Test Data Management**

### **Test Data Factories**
```typescript
// tests/factories/index.ts
export class TestDataFactory {
  static createIndustry(data?: Partial<Industry>) {
    return {
      code: 'MINING_METALS',
      name: 'Mining & Metals',
      description: 'Extractive industries',
      category: 'EXTRACTIVE',
      ...data,
    };
  }

  static createSector(data?: Partial<Sector>) {
    return {
      code: 'COPPER',
      name: 'Copper Mining',
      description: 'Copper extraction and processing',
      category: 'COMMODITY',
      riskProfile: 'HIGH',
      ...data,
    };
  }

  static createFacilityType(data?: Partial<IndustryFacilityTypes>) {
    return {
      facilityTypeCode: 'OPEN_PIT_MINE',
      facilityTypeName: 'Open Pit Mine',
      description: 'Surface mining operations',
      category: 'EXTRACTION',
      riskProfile: 'HIGH',
      ...data,
    };
  }
}
```

### **Test Database Seeding**
```typescript
// tests/setup/seed-test-data.ts
export async function seedTestData() {
  // Seed master data hierarchy
  await seedIndustryHierarchy();
  
  // Seed enterprise data
  await seedEnterpriseData();
  
  // Seed business canvas data
  await seedBusinessCanvasData();
  
  // Seed process data
  await seedProcessData();
  
  // Create graph nodes and relationships
  await createGraphStructure();
}
```

---

## 🎯 **Success Criteria**

### **Test Quality Metrics**
- ✅ All critical user journeys covered by E2E tests
- ✅ 80%+ code coverage across all test types
- ✅ < 5 second test execution time for unit tests
- ✅ < 30 second test execution time for integration tests
- ✅ < 2 minute test execution time for E2E tests

### **Test Reliability**
- ✅ Flaky test rate < 1%
- ✅ Test data isolation between test runs
- ✅ Consistent test results across environments
- ✅ Proper cleanup of test data

### **Test Maintainability**
- ✅ Clear test organization and naming
- ✅ Reusable test utilities and factories
- ✅ Comprehensive test documentation
- ✅ Regular test maintenance and updates

This comprehensive testing strategy ensures that all implemented features are thoroughly tested from UI to database, including the complex Graph-Relational Hybrid architecture and master data hierarchy. 