# @docs/ Reference System - Quick Reference Guide

## Overview
The `@docs/` reference system provides a standardized way to create maintainable links between documentation files and code.

## Quick Reference

### Basic Format
```
@docs/filename.md
@docs/category/filename.md
@docs/category/subcategory/filename.md
```

### Common Reference Categories

#### Design Documents
```
@docs/design/solution-architecture-design.md
@docs/design/ux-architecture-design.md
@docs/design/reference-architecture.md
@docs/design/product-backlog.md
@docs/design/strategic-navigation-flow.md
```

#### Technical Documentation
```
@docs/technical-implementation-details.md
@docs/api-endpoints.md
@docs/debugging-guide.md
@docs/technical/business-canvas-enhancement-summary.md
```

#### Implementation Status
```
@docs/implementation-status.md
@docs/implementation-status/canvas-status-management-implementation.md
```

#### User Documentation
```
@docs/api-endpoints.md
@docs/user-guides/business-canvas-usage.md
```

## Usage Examples

### In Code Comments
```typescript
/**
 * Business Canvas Management Component
 * 
 * Implements the business model canvas functionality as defined in
 * @docs/design/solution-architecture-design.md#business-canvas
 * 
 * User interface follows patterns established in
 * @docs/design/ux-architecture-design.md#canvas-components
 * 
 * Feature requirements documented in
 * @docs/design/product-backlog.md#business-canvas-management
 */
```

### In Documentation
```markdown
## Implementation Status

This feature implements the strategic navigation flow described in
@docs/design/strategic-navigation-flow.md#process-to-service-model

For technical details, see @docs/technical/business-canvas-enhancement-summary.md

User guide available at @docs/user-guides/business-canvas-usage.md
```

### In README Files
```markdown
## Architecture

This project follows the layered architecture described in @docs/design/reference-architecture.md

For implementation details, see @docs/technical-implementation-details.md

Current status available at @docs/implementation-status.md
```

## Best Practices

### ✅ Do
- Use descriptive filenames that clearly indicate content
- Keep references current when files are moved or renamed
- Include context when referencing specific sections
- Use consistent formatting for all @docs/ references
- Validate references during documentation reviews

### ❌ Don't
- Use relative paths or absolute URLs
- Reference non-existent files
- Use inconsistent formatting
- Forget to update references when files are moved
- Reference specific line numbers (use section anchors instead)

## Validation

### Manual Validation
- Check that referenced files exist
- Verify section anchors are correct
- Ensure references are still relevant
- Update references when files are moved

### Automated Validation (Future)
- Link checking in CI/CD pipeline
- Broken reference detection
- Cross-reference validation
- Reference usage reporting

## Common Patterns

### Feature Documentation
```markdown
## Feature Name

Based on requirements in @docs/design/product-backlog.md#feature-name

Technical implementation follows patterns in @docs/design/solution-architecture-design.md#feature-section

User interface design documented in @docs/design/ux-architecture-design.md#ui-patterns

Implementation status tracked in @docs/implementation-status.md#feature-name
```

### API Documentation
```markdown
## API Endpoint

Authentication follows patterns in @docs/design/solution-architecture-design.md#authentication

For detailed API reference, see @docs/api-endpoints.md#endpoint-name

Implementation status tracked in @docs/implementation-status.md#api-endpoints
```

### Component Documentation
```markdown
## Component Name

Implements UI patterns from @docs/design/ux-architecture-design.md#component-patterns

Follows architecture defined in @docs/design/solution-architecture-design.md#components

Technical details in @docs/technical-implementation-details.md#component-name
```

## Troubleshooting

### Broken References
1. Check if the referenced file exists
2. Verify the file path is correct
3. Update the reference to the new location
4. Update any dependent documentation

### Missing Context
1. Add section anchors to referenced files
2. Provide more context in the reference
3. Consider if the reference is still relevant
4. Update or remove outdated references

### Inconsistent Formatting
1. Use the standard `@docs/` format
2. Avoid mixing with other reference formats
3. Maintain consistent capitalization
4. Use descriptive filenames

## Tools and Automation

### Current Tools
- Manual validation during code reviews
- Documentation review process
- Link checking in markdown editors

### Future Tools (Planned)
- Automated link validation in CI/CD
- Reference usage analytics
- Broken link detection
- Cross-reference reporting

## Support

For questions about the @docs/ reference system:
1. Check this quick reference guide
2. Review the full documentation standards in @docs/documentation-standards.md
3. Consult the rules status document in @docs/rules-status.md
4. Ask the development team for guidance 