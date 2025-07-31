# Audit Reports

This directory contains audit reports and scripts for various aspects of the CapOpt Platform.

## Available Reports

### Business Canvas Metadata Audit
- **Report:** [business-canvas-metadata-audit-report.md](./business-canvas-metadata-audit-report.md)
- **Status:** ✅ COMPLETED
- **Date:** 31 July 2024
- **Scope:** All business canvases in the database
- **Result:** 100% metadata completion rate

## Audit Scripts

### Business Canvas Metadata
- **Audit Script:** `scripts/audit-canvas-metadata.js`
- **Population Script:** `scripts/populate-canvas-metadata.js`
- **NPM Commands:**
  - `npm run canvas:audit` - Run metadata audit
  - `npm run canvas:populate` - Populate missing metadata

### Documentation References
- **Validation Script:** `scripts/validate-docs-references.js`
- **NPM Commands:**
  - `npm run docs:validate` - Validate @docs/ references
  - `npm run docs:validate:report` - Generate detailed report
  - `npm run docs:validate:anchors` - Check section anchors
  - `npm run docs:validate:fix` - Fix broken references

## Audit Process

### 1. Business Canvas Metadata Audit
1. **Initial Scan:** Identify all business canvases and missing metadata
2. **Issue Analysis:** Categorize missing fields by type and priority
3. **Data Population:** Generate synthetic data based on enterprise context
4. **Verification:** Re-audit to confirm completion

### 2. Documentation Reference Audit
1. **Reference Scan:** Find all @docs/ references in documentation
2. **Validation:** Check for broken links and invalid formats
3. **Fix Application:** Automatically fix common issues
4. **Report Generation:** Create detailed audit reports

## Usage

### Running Audits
```bash
# Business Canvas Metadata
npm run canvas:audit
npm run canvas:populate

# Documentation References
npm run docs:validate
npm run docs:validate:report
```

### Manual Script Execution
```bash
# Direct script execution
node scripts/audit-canvas-metadata.js
node scripts/populate-canvas-metadata.js
node scripts/validate-docs-references.js
```

## Audit Standards

### Metadata Completeness
- All required fields must be populated
- Enum values must match defined options
- Array fields must contain at least one item
- Relationships must be properly established

### Documentation Quality
- All @docs/ references must be valid
- File paths must exist
- Section anchors must be present
- Format must follow conventions

## Related Documentation

- **Business Canvas Design:** @docs/design/solution-architecture-design.md#business-canvas
- **Documentation Standards:** @docs/documentation-standards.md
- **Implementation Status:** @docs/implementation-status.md 