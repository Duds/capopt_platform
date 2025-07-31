# Code Comment Templates - @docs/ References

This document provides standardized templates for adding @docs/ references to code comments, ensuring consistent cross-referencing between code and documentation.

---

## Component Documentation Templates

### React Component Template
```typescript
/**
 * Component Name
 * 
 * Implements the functionality described in @docs/design/product-backlog.md#feature-name
 * Follows UI patterns from @docs/design/ux-architecture-design.md#component-patterns
 * Technical implementation details in @docs/technical-implementation-details.md#component-name
 * 
 * @param props - Component props
 * @returns JSX element
 */
```

### Page Component Template
```typescript
/**
 * Page Name
 * 
 * Implements the page functionality described in @docs/design/product-backlog.md#page-feature
 * Follows navigation patterns from @docs/design/strategic-navigation-flow.md#page-flow
 * UI design follows patterns in @docs/design/ux-architecture-design.md#page-layouts
 * 
 * @returns JSX element
 */
```

### Hook Template
```typescript
/**
 * Hook Name
 * 
 * Implements the hook functionality described in @docs/design/product-backlog.md#hook-feature
 * Technical implementation details in @docs/technical-implementation-details.md#hook-name
 * Follows patterns established in @docs/design/solution-architecture-design.md#hooks
 * 
 * @param params - Hook parameters
 * @returns Hook return value
 */
```

---

## API Documentation Templates

### API Route Template
```typescript
/**
 * API Endpoint: [HTTP Method] /api/[endpoint-path]
 * 
 * Implements the API design patterns from @docs/design/solution-architecture-design.md#api-design
 * Authentication follows @docs/design/solution-architecture-design.md#authentication
 * User roles defined in @docs/role-permissions.md
 * Detailed API documentation at @docs/api-endpoints.md#endpoint-name
 * 
 * @param req - Next.js request object
 * @param res - Next.js response object
 * @returns Promise<void>
 */
```

### API Handler Template
```typescript
/**
 * API Handler Name
 * 
 * Implements the handler functionality described in @docs/design/product-backlog.md#api-feature
 * Technical implementation details in @docs/technical-implementation-details.md#handler-name
 * Follows security patterns in @docs/design/solution-architecture-design.md#security
 * 
 * @param req - Request object
 * @param res - Response object
 * @returns Promise<void>
 */
```

### Middleware Template
```typescript
/**
 * Middleware Name
 * 
 * Implements middleware functionality described in @docs/design/solution-architecture-design.md#middleware
 * Security implementation follows @docs/design/solution-architecture-design.md#security
 * Technical details in @docs/technical-implementation-details.md#middleware-name
 * 
 * @param req - Next.js request object
 * @param res - Next.js response object
 * @param next - Next function
 * @returns Promise<void>
 */
```

---

## Database Documentation Templates

### Model Template
```typescript
/**
 * Database Model: ModelName
 * 
 * Implements the database schema described in @docs/design/solution-architecture-design.md#database-schema
 * Technical implementation details in @docs/technical-implementation-details.md#model-name
 * Follows patterns established in @docs/design/reference-architecture.md#data-layer
 * 
 * @param data - Model data
 * @returns Model instance
 */
```

### Migration Template
```typescript
/**
 * Database Migration: MigrationName
 * 
 * Implements database changes described in @docs/design/product-backlog.md#database-feature
 * Schema changes documented in @docs/design/solution-architecture-design.md#database-schema
 * Technical implementation details in @docs/technical-implementation-details.md#migration-name
 * 
 * @param prisma - Prisma client instance
 * @returns Promise<void>
 */
```

### Seed Template
```typescript
/**
 * Database Seed: SeedName
 * 
 * Implements seed data described in @docs/design/product-backlog.md#seed-feature
 * Data structure follows patterns in @docs/design/solution-architecture-design.md#database-schema
 * Technical implementation details in @docs/technical-implementation-details.md#seed-name
 * 
 * @param prisma - Prisma client instance
 * @returns Promise<void>
 */
```

---

## Utility Documentation Templates

### Utility Function Template
```typescript
/**
 * Utility Function: functionName
 * 
 * Implements utility functionality described in @docs/design/product-backlog.md#utility-feature
 * Technical implementation details in @docs/technical-implementation-details.md#function-name
 * Follows patterns established in @docs/design/solution-architecture-design.md#utilities
 * 
 * @param params - Function parameters
 * @returns Function return value
 */
```

### Validation Template
```typescript
/**
 * Validation Schema: schemaName
 * 
 * Implements validation rules described in @docs/design/product-backlog.md#validation-feature
 * Technical implementation details in @docs/technical-implementation-details.md#schema-name
 * Follows validation patterns in @docs/design/solution-architecture-design.md#validation
 * 
 * @param data - Data to validate
 * @returns Validation result
 */
```

### Service Template
```typescript
/**
 * Service: serviceName
 * 
 * Implements service functionality described in @docs/design/product-backlog.md#service-feature
 * Technical implementation details in @docs/technical-implementation-details.md#service-name
 * Follows service patterns in @docs/design/solution-architecture-design.md#services
 * 
 * @param params - Service parameters
 * @returns Service result
 */
```

---

## Configuration Documentation Templates

### Configuration Template
```typescript
/**
 * Configuration: configName
 * 
 * Implements configuration described in @docs/design/solution-architecture-design.md#configuration
 * Technical implementation details in @docs/technical-implementation-details.md#config-name
 * Follows patterns established in @docs/design/reference-architecture.md#configuration-layer
 * 
 * @param env - Environment variables
 * @returns Configuration object
 */
```

### Environment Template
```typescript
/**
 * Environment Configuration
 * 
 * Implements environment setup described in @docs/design/solution-architecture-design.md#environment
 * Technical implementation details in @docs/technical-implementation-details.md#environment
 * Follows security patterns in @docs/design/solution-architecture-design.md#security
 * 
 * @returns Environment configuration
 */
```

---

## Testing Documentation Templates

### Test Template
```typescript
/**
 * Test: testName
 * 
 * Implements test functionality described in @docs/testing-standards.md#test-patterns
 * Tests feature described in @docs/design/product-backlog.md#feature-name
 * Technical implementation details in @docs/technical-implementation-details.md#test-name
 * 
 * @param params - Test parameters
 * @returns Test result
 */
```

### Test Suite Template
```typescript
/**
 * Test Suite: suiteName
 * 
 * Implements test suite described in @docs/testing-standards.md#test-suites
 * Tests features described in @docs/design/product-backlog.md#feature-group
 * Technical implementation details in @docs/technical-implementation-details.md#suite-name
 * 
 * @param params - Suite parameters
 * @returns Suite result
 */
```

---

## Usage Examples

### Component with Multiple References
```typescript
/**
 * Business Canvas Component
 * 
 * Implements the business model canvas functionality as defined in
 * @docs/design/product-backlog.md#business-canvas-management
 * 
 * User interface follows patterns established in
 * @docs/design/ux-architecture-design.md#canvas-components
 * 
 * Technical implementation details in
 * @docs/technical-implementation-details.md#business-canvas
 * 
 * API integration follows patterns in
 * @docs/design/solution-architecture-design.md#api-design
 * 
 * @param props - Component props
 * @returns JSX element
 */
export function BusinessCanvas(props: BusinessCanvasProps) {
  // Component implementation
}
```

### API Route with Security References
```typescript
/**
 * User Management API
 * 
 * Implements user management functionality described in
 * @docs/design/product-backlog.md#user-management
 * 
 * Authentication follows security standards in
 * @docs/design/solution-architecture-design.md#security
 * 
 * User roles and permissions defined in
 * @docs/role-permissions.md
 * 
 * Technical implementation details in
 * @docs/technical-implementation-details.md#user-api
 * 
 * @param req - Next.js request object
 * @param res - Next.js response object
 * @returns Promise<void>
 */
export async function POST(req: NextRequest, res: NextResponse) {
  // API implementation
}
```

---

## Best Practices

### Do's
- ✅ **Reference specific sections** using `#section-name` anchors
- ✅ **Use consistent formatting** for all @docs/ references
- ✅ **Include multiple relevant references** when appropriate
- ✅ **Update references** when documentation changes
- ✅ **Use descriptive section names** in references

### Don'ts
- ❌ **Don't reference non-existent files** or sections
- ❌ **Don't use generic references** without specific sections
- ❌ **Don't forget to update references** when files move
- ❌ **Don't use inconsistent formatting** for references
- ❌ **Don't reference outdated documentation**

---

## Validation

### Manual Validation
1. **Check file existence** - Ensure referenced files exist
2. **Verify section anchors** - Ensure referenced sections exist
3. **Test reference formatting** - Ensure consistent format
4. **Update broken references** - Fix any broken links

### Automated Validation
Use the validation script to check @docs/ references:
```bash
npm run docs:validate
npm run docs:validate:report
npm run docs:validate:anchors
```

---

## Related Documentation

- **@docs/ Reference Guide:** @docs/@docs-reference-guide.md
- **Documentation Standards:** @docs/documentation-standards.md
- **Testing Standards:** @docs/testing-standards.md
- **Frontend Standards:** @docs/frontend-standards.md
- **API Documentation:** @docs/api-endpoints.md

---

*This template follows the documentation standards defined in @docs/documentation-standards.md
and uses the @docs/ reference system for cross-referencing.* 