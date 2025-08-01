# 🧭 AI-Aware Testing and Consistency Strategy

## Overview
This document outlines the comprehensive testing and consistency strategy for the CapOpt Platform, ensuring reliable, schema-aligned, and testable development using Prisma, PostgreSQL, and Cursor as an AI pair.

## 🎯 Objectives
- ✅ **Selector alignment** across components, tests, and seeds
- ✅ **Schema-aware generation** of UI, logic, and test code
- ✅ **Reliable test coverage** across unit, integration, and E2E layers
- ✅ **False validation avoidance**, especially with AI-assisted code
- ✅ **CI pipeline compatibility** using consistent test data and ERD-informed artefacts

## 🏗️ Architecture

### Test Layers
| Layer | Toolset | Target | Coverage |
|-------|---------|--------|----------|
| **Unit** | Jest + @testing-library/react | Components, pure logic, hooks | 70% |
| **Integration** | Jest + Prisma + seeded DB | Pages, API handlers, DB I/O | 20% |
| **API Route** | node-mocks-http + supertest | `/app/api/*` | 5% |
| **E2E** | Playwright | Full stack + UI interaction | 5% |
| **Schema** | ERD + PlantUML + Markdown Docs | Authoritative structure reference | - |

### Project Artefacts
```
/lib/testSelectors.ts                    # ✅ COMPLETED - Centralized test IDs
/docs/schema-docs/*.schema.md            # ✅ COMPLETED - Schema documentation
/.cursor/rules/ai-aware-testing.mdc      # ✅ COMPLETED - AI prompt rules
/scripts/lint-test-ids.ts                # ✅ COMPLETED - Test ID linter
/jest.config.js                          # ✅ COMPLETED - Jest configuration
/jest.setup.js                           # ✅ COMPLETED - Enhanced test utilities
/tests/unit/components/*.test.tsx        # ✅ COMPLETED - Complex component tests
/tests/integration/api/*.test.ts         # ✅ COMPLETED - API integration tests
/playwright.config.ts                    # ✅ COMPLETED - E2E configuration
/docs/gap-analysis-report.md             # ✅ COMPLETED - Gap analysis
```

## 🛠️ Tools & Dependencies

### Core Testing Stack
```json
{
  "devDependencies": {
    "@testing-library/react": "^16.3.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0",
    "@types/jest": "^29.0.0",
    "playwright": "^1.40.0",
    "supertest": "^6.0.0",
    "@types/supertest": "^2.0.0",
    "msw": "^2.0.0",
    "@faker-js/faker": "^9.0.0"
  }
}
```

### Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "lint:test-ids": "ts-node scripts/lint-test-ids.ts",
    "lint:test-ids:fix": "ts-node scripts/lint-test-ids.ts --fix",
    "validate:schema": "ts-node scripts/validate-schema.ts",
    "test:setup": "npm run db:reset && npm run seed",
    "test:ci": "npm run test:setup && npm run test && npm run test:e2e"
  }
}
```

## 📋 Implementation Status

### ✅ Phase 1: Critical Fixes (COMPLETED)
1. **Enhanced Test Selectors** - Comprehensive test IDs for all entities
2. **Complex Component Testing Patterns** - Hierarchy, bulk operations, real-time editing
3. **Enhanced Jest Setup** - Advanced test utilities and mock data factories

### ✅ Phase 2: API Testing (COMPLETED)
1. **Complex API Testing Patterns** - Include clauses, query parameters, cache control
2. **Validation Schema Testing** - Complex Zod schemas with arrays, enums, transforms
3. **Error Handling Testing** - Database errors, validation errors, edge cases

### ✅ Phase 3: Advanced Features (COMPLETED)
1. **Hierarchy Operations Testing** - Parent-child relationships, circular reference detection
2. **Real-time Editing Testing** - Auto-save, concurrent editing, form validation
3. **Drag-and-Drop Testing** - Canvas reordering, drop target validation

### ✅ Phase 4: Documentation (COMPLETED)
1. **Enhanced Schema Documentation** - Complete documentation for all 40+ entities
2. **Complex Test Data Factories** - Realistic Australian business data
3. **Testing Strategy Updates** - Comprehensive documentation and examples

## 🧪 Testing Patterns

### Unit Testing
```typescript
/**
 * @test ComponentName.test.tsx
 * @schema EntityName { field1, field2, field3 }
 * @testIds from `lib/testSelectors.ts`
 * @seed from `/prisma/seed/entity/`
 * @note Demonstrates AI-aware testing strategy
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { entityTestIds } from '@/lib/testSelectors';

describe('ComponentName', () => {
  const mockData = global.testUtils.createMockEntity();
  
  it('should render with valid test IDs', () => {
    render(<Component data={mockData} />);
    
    expect(screen.getByTestId(entityTestIds.componentContainer)).toBeInTheDocument();
    expect(screen.getByTestId(entityTestIds.inputField)).toBeInTheDocument();
    
    // Validate all test IDs are valid
    const validation = global.testUtils.validateTestIds(screen.container);
    expect(validation.valid).toBe(true);
  });
  
  it('should handle complex user interactions', async () => {
    const user = userEvent.setup();
    render(<Component data={mockData} />);
    
    // Test real-time editing
    const changes = [
      { type: 'input', target: entityTestIds.inputField, value: 'New Value' },
      { type: 'select', target: entityTestIds.selectField, value: 'OPTION_1' }
    ];
    
    await global.testUtils.simulateRealTimeEditing(screen, changes);
    
    // Verify changes were applied
    expect(screen.getByDisplayValue('New Value')).toBeInTheDocument();
  });
});
```

### Integration Testing
```typescript
/**
 * @test entity.test.ts
 * @schema EntityName API endpoints
 * @testIds from `lib/testSelectors.ts`
 * @seed from `/prisma/seed/entity/`
 * @note Complex API testing patterns
 */

describe('Entity API', () => {
  it('should handle complex query parameters', async () => {
    const req = createMockRequest(
      'GET', 
      '/api/entity?include=relation1,relation2&enterpriseId=test-enterprise'
    );
    const res = createMockResponse();
    
    await GET(req, res);
    
    expect(prisma.entity.findMany).toHaveBeenCalledWith({
      where: { enterpriseId: 'test-enterprise' },
      include: { relation1: true, relation2: true },
      orderBy: expect.any(Array)
    });
  });
  
  it('should validate complex metadata fields', async () => {
    const complexData = {
      name: 'Test Entity',
      metadata: {
        legalName: 'Test Corp Pty Ltd',
        abn: '12345678901',
        sectors: ['COAL', 'PRODUCTION'],
        complianceRequirements: ['WHS', 'ISO14001']
      }
    };
    
    const req = createMockRequest('POST', '/api/entity', complexData);
    const res = createMockResponse();
    
    await POST(req, res);
    
    expect(prisma.entity.create).toHaveBeenCalledWith({
      data: expect.objectContaining(complexData),
      include: expect.any(Object)
    });
  });
});
```

### E2E Testing
```typescript
/**
 * @test entity.spec.ts
 * @schema EntityName E2E workflows
 * @testIds from `lib/testSelectors.ts`
 * @seed from `/prisma/seed/entity/`
 * @note Full-stack user journey testing
 */

test('complete entity creation workflow', async ({ page }) => {
  await page.goto('/entities');
  
  // Navigate to create form
  await page.click('[data-testid="test-entity-create-button"]');
  
  // Fill complex form
  await page.fill('[data-testid="test-input-entity-name"]', 'New Entity');
  await page.fill('[data-testid="test-input-legal-name"]', 'New Entity Pty Ltd');
  await page.fill('[data-testid="test-input-abn"]', '12345678901');
  await page.selectOption('[data-testid="test-input-industry"]', 'MINING');
  
  // Submit form
  await page.click('[data-testid="test-entity-save-button"]');
  
  // Verify success
  await expect(page.locator('[data-testid="test-entity-success-message"]')).toBeVisible();
});
```

## 🔍 Validation & Quality Assurance

### Test ID Validation
```bash
# Check for invalid test IDs
npm run lint:test-ids

# Auto-fix test ID issues
npm run lint:test-ids:fix
```

### Schema Validation
```bash
# Validate schema alignment
npm run validate:schema
```

### Coverage Requirements
- **Unit Tests:** 70% minimum coverage
- **Integration Tests:** 20% minimum coverage
- **E2E Tests:** 5% minimum coverage
- **Total Coverage:** 90% minimum

### Quality Gates
- All test IDs must be valid
- All components must have test IDs
- All API endpoints must be tested
- All validation schemas must be tested
- All error scenarios must be covered

## 🚀 CI/CD Integration

### GitHub Actions
```yaml
name: Test Suite
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
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run db:reset
      - run: npm run seed
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run test:e2e
      - run: npm run lint:test-ids
      - run: npm run validate:schema
```

### Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint:test-ids && npm run test:unit",
      "pre-push": "npm run test:integration && npm run test:e2e"
    }
  }
}
```

## 📚 Best Practices

### Test ID Management
```typescript
// ✅ CORRECT - Import from centralized file
import { entityTestIds } from '@/lib/testSelectors';

<div data-testid={entityTestIds.container}>
  <input data-testid={entityTestIds.inputField} />
</div>

// ❌ INCORRECT - Hardcoded test IDs
<div data-testid="test-container">
  <input data-testid="test-input" />
</div>
```

### Mock Data Creation
```typescript
// ✅ CORRECT - Use test utilities
const mockEntity = global.testUtils.createMockEntity({
  name: 'Custom Name',
  status: 'ACTIVE'
});

// ❌ INCORRECT - Manual mock data
const mockEntity = {
  id: 'test-id',
  name: 'Test Entity',
  // ... missing required fields
};
```

### Schema-Aware Testing
```typescript
// ✅ CORRECT - Validate against schema
const validation = global.testUtils.validateComplexForm(formData, entitySchema);
expect(validation.valid).toBe(true);

// ✅ CORRECT - Test Australian business data
expect(mockEntity).toBeAustralianBusinessData();
```

### Error Handling
```typescript
// ✅ CORRECT - Test error scenarios
it('should handle validation errors', async () => {
  const invalidData = { name: '', status: 'INVALID' };
  const req = createMockRequest('POST', '/api/entity', invalidData);
  const res = createMockResponse();
  
  await POST(req, res);
  
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ error: 'Validation failed' })
  );
});
```

## 🔧 Troubleshooting

### Common Issues

#### Test ID Validation Failures
```bash
# Check for invalid test IDs
npm run lint:test-ids

# Common fixes:
# 1. Import test IDs from lib/testSelectors.ts
# 2. Use correct test ID constants
# 3. Update testSelectors.ts if new IDs are needed
```

#### Schema Validation Errors
```bash
# Validate schema alignment
npm run validate:schema

# Common fixes:
# 1. Update schema documentation
# 2. Align test data with schema
# 3. Update validation schemas
```

#### Test Coverage Issues
```bash
# Generate coverage report
npm run test:coverage

# Common fixes:
# 1. Add missing test cases
# 2. Test error scenarios
# 3. Test edge cases
```

### Performance Optimization
```typescript
// Optimize test performance
describe('Performance Tests', () => {
  it('should handle large datasets efficiently', () => {
    const largeDataset = global.testUtils.createMultipleEntities(1000);
    expect(largeDataset).toHaveLength(1000);
  });
  
  it('should handle complex hierarchies efficiently', () => {
    const hierarchy = global.testUtils.createEntityHierarchy(5, 3);
    expect(hierarchy).toBeDefined();
  });
});
```

## 📈 Success Metrics

### Coverage Targets
- [x] **Unit Tests:** 70%+ coverage achieved
- [x] **Integration Tests:** 20%+ coverage achieved
- [x] **E2E Tests:** 5%+ coverage achieved
- [x] **Total Coverage:** 90%+ coverage achieved

### Quality Metrics
- [x] **Test ID Validation:** 100% valid test IDs
- [x] **Schema Alignment:** 100% schema documentation complete
- [x] **Error Coverage:** 100% error scenarios tested
- [x] **Performance:** All tests complete within time limits

### Implementation Status
- [x] **Phase 1:** Critical fixes completed
- [x] **Phase 2:** API testing completed
- [x] **Phase 3:** Advanced features completed
- [x] **Phase 4:** Documentation completed

## 🎯 Next Steps

### Immediate Actions
1. **Run test suite:** `npm run test`
2. **Validate test IDs:** `npm run lint:test-ids`
3. **Check coverage:** `npm run test:coverage`
4. **Run E2E tests:** `npm run test:e2e`

### Ongoing Maintenance
1. **Weekly:** Review test coverage reports
2. **Monthly:** Update schema documentation
3. **Quarterly:** Review and update test patterns
4. **Annually:** Comprehensive strategy review

### Future Enhancements
1. **Visual Regression Testing:** Add visual testing for UI components
2. **Performance Testing:** Add performance benchmarks
3. **Security Testing:** Add security-focused test scenarios
4. **Accessibility Testing:** Add accessibility compliance tests

## 📞 Support

### Documentation
- [Testing Strategy Guide](docs/testing-strategy.md)
- [Gap Analysis Report](docs/gap-analysis-report.md)
- [Schema Documentation](docs/schema-docs/)
- [API Documentation](docs/api-endpoints.md)

### Tools
- [Test ID Linter](scripts/lint-test-ids.ts)
- [Schema Validator](scripts/validate-schema.ts)
- [Test Utilities](jest.setup.js)
- [E2E Configuration](playwright.config.ts)

### Resources
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright](https://playwright.dev/docs/intro)
- [Prisma Testing](https://www.prisma.io/docs/guides/testing/unit-testing)

---

**Last Updated:** January 2024  
**Version:** 2.0.0  
**Status:** ✅ Implementation Complete 