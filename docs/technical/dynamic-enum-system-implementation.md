# Dynamic Enum System Implementation

## Overview

This document outlines the implementation of a dynamic enum system that replaces hardcoded selections in the Business Canvas add/edit form with database-driven, industry-aligned options.

## Problem Statement

### Issues Identified

1. **Hardcoded Selections**: The `CanvasEditor` component contained numerous hardcoded enum values:
   - Business Types: `CORPORATION`, `PARTNERSHIP`, `SOLE_TRADER`, etc.
   - Regional Classifications: `METROPOLITAN`, `REGIONAL`, `REMOTE`, etc.
   - Facility Types: `MINE`, `PROCESSING_PLANT`, `REFINERY`, etc.
   - Risk Profiles: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
   - Digital Maturity: `BASIC`, `INTERMEDIATE`, `ADVANCED`, `LEADING`

2. **Inconsistency Between Frontend and Database**:
   - Frontend used string literals
   - Database had proper enums defined
   - No validation against database enums
   - Risk of data inconsistency

3. **Poor Alignment with Industry/Sectors Framework**:
   - Hardcoded facility types didn't align with industry-specific requirements
   - No dynamic loading based on selected industry/sectors
   - Missing industry-specific operational streams and compliance requirements

4. **Maintenance Issues**:
   - Changes required code updates and redeployment
   - No centralized management of options
   - Difficult to add industry-specific options

## Solution Architecture

### 1. API Layer (`/api/enums/route.ts`)

**Purpose**: Centralized endpoint for serving enum values from database schema

**Features**:
- Dynamic enum type selection via query parameter
- Industry-specific filtering for sectors, operational streams, and compliance frameworks
- Proper error handling and validation
- Database-driven values for industries and sectors

**Supported Enum Types**:
- `business-types`: Business entity types
- `regional-classifications`: Geographic classifications
- `facility-types`: Facility and infrastructure types
- `risk-profiles`: Risk assessment levels
- `industries`: Active industries from database
- `sectors`: Industry-specific sectors
- `operational-streams`: Industry-specific operational streams
- `compliance-frameworks`: Industry-specific compliance requirements

### 2. React Hooks (`hooks/use-enum-values.ts`)

**Purpose**: Custom React hooks for managing enum values

**Features**:
- Generic `useEnumValues` hook for any enum type
- Industry-specific hooks for sectors, operational streams, and compliance
- Loading states and error handling
- Automatic refetch capabilities
- Convenience hooks for specific enum types

**Available Hooks**:
- `useBusinessTypes()`
- `useRegionalClassifications()`
- `useFacilityTypes()`
- `useRiskProfiles()`
- `useIndustries()`
- `useSectors(industryCode?)`
- `useOperationalStreams(industryCode?)`
- `useComplianceFrameworks(industryCode?)`

### 3. Reusable Component (`components/ui/dynamic-select.tsx`)

**Purpose**: Generic select component that loads options dynamically

**Features**:
- Dynamic option loading from API
- Loading states with skeleton placeholders
- Error handling with retry functionality
- Validation error display
- Industry-specific filtering
- Consistent styling and behavior

## Implementation Details

### Database Schema Alignment

The system leverages existing database enums:

```prisma
enum BusinessType {
  CORPORATION
  PARTNERSHIP
  SOLE_TRADER
  TRUST
  JOINT_VENTURE
  SUBSIDIARY
}

enum RegionalClassification {
  METROPOLITAN
  REGIONAL
  REMOTE
  RURAL
  COASTAL
  INLAND
}

enum FacilityType {
  MINE
  PROCESSING_PLANT
  REFINERY
  SMELTER
  WAREHOUSE
  OFFICE
  LABORATORY
  WORKSHOP
  POWER_STATION
  WATER_TREATMENT
  WASTE_MANAGEMENT
}

enum RiskProfile {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}
```

### Industry/Sectors Framework Integration

The system integrates with the existing industry/sectors framework:

1. **Industry Master Table**: Serves active industries dynamically
2. **Sector Relationships**: Filters sectors by selected industry
3. **Operational Streams**: Industry-specific operational requirements
4. **Compliance Frameworks**: Industry-specific compliance requirements

### Frontend Integration

**Before (Hardcoded)**:
```tsx
<Select value={formData.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
  <SelectTrigger>
    <SelectValue placeholder="Select business type" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="CORPORATION">Corporation</SelectItem>
    <SelectItem value="PARTNERSHIP">Partnership</SelectItem>
    // ... hardcoded options
  </SelectContent>
</Select>
```

**After (Dynamic)**:
```tsx
<DynamicSelect
  label="Business Type"
  value={formData.businessType}
  onValueChange={(value) => handleInputChange('businessType', value)}
  enumType="business-types"
  required
  error={validationErrors.businessType}
  showError={!!validationErrors.businessType}
/>
```

## Benefits Achieved

### 1. **Data Consistency**
- Frontend and database use same enum values
- Validation against database schema
- Reduced risk of data corruption

### 2. **Maintainability**
- Centralized enum management
- No code changes required for new options
- Database-driven configuration

### 3. **Industry Alignment**
- Industry-specific facility types
- Dynamic operational streams
- Context-aware compliance requirements

### 4. **User Experience**
- Loading states for better UX
- Error handling with retry options
- Consistent validation feedback

### 5. **Scalability**
- Easy to add new enum types
- Industry-specific filtering
- Extensible architecture

## Usage Examples

### Basic Enum Usage
```tsx
const { values, loading, error } = useBusinessTypes()

if (loading) return <Skeleton className="h-10 w-full" />
if (error) return <Alert>Failed to load business types</Alert>

return (
  <Select value={selectedType} onValueChange={setSelectedType}>
    <SelectContent>
      {Object.entries(values).map(([key, displayName]) => (
        <SelectItem key={key} value={key}>{displayName}</SelectItem>
      ))}
    </SelectContent>
  </Select>
)
```

### Industry-Specific Usage
```tsx
const { values: sectors } = useSectors(selectedIndustry)

// Sectors will be filtered based on selected industry
```

### Dynamic Select Component
```tsx
<DynamicSelect
  label="Facility Type"
  value={facilityType}
  onValueChange={setFacilityType}
  enumType="facility-types"
  industryCode={selectedIndustry}
  required
/>
```

## API Endpoints

### Get Enum Values
```
GET /api/enums?type={enumType}
```

**Parameters**:
- `type`: Required. The enum type to retrieve
- `industry`: Optional. Industry code for industry-specific enums

**Response**:
```json
{
  "type": "business-types",
  "values": {
    "CORPORATION": "Corporation",
    "PARTNERSHIP": "Partnership",
    "SOLE_TRADER": "Sole Trader"
  },
  "count": 3
}
```

### Supported Enum Types

| Type | Description | Industry-Specific |
|------|-------------|-------------------|
| `business-types` | Business entity types | No |
| `regional-classifications` | Geographic classifications | No |
| `facility-types` | Facility and infrastructure types | No |
| `risk-profiles` | Risk assessment levels | No |
| `industries` | Active industries | No |
| `sectors` | Industry-specific sectors | Yes |
| `operational-streams` | Industry-specific operational streams | Yes |
| `compliance-frameworks` | Industry-specific compliance requirements | Yes |

## Future Enhancements

### Phase 2: Enhanced Framework

1. **Industry-Specific Facility Types**
   - Mining-specific facility types
   - Petrochemical-specific facility types
   - Defence-specific facility types

2. **Dynamic Operational Streams**
   - Industry-specific operational requirements
   - Sector-based filtering
   - Compliance-driven suggestions

3. **Compliance Framework Integration**
   - Regulatory requirement mapping
   - Industry-specific compliance checklists
   - Automated compliance validation

### Phase 3: Advanced Features

1. **Smart Defaults**
   - Industry-based default selections
   - Previous selection memory
   - Template-based defaults

2. **Validation Rules**
   - Cross-field validation
   - Industry-specific validation rules
   - Compliance requirement validation

3. **Analytics Integration**
   - Usage pattern tracking
   - Industry trend analysis
   - Compliance gap identification

## Testing

### API Testing
```bash
# Test business types
curl -X GET "http://localhost:3000/api/enums?type=business-types"

# Test industry-specific sectors
curl -X GET "http://localhost:3000/api/enums?type=sectors&industry=MINING_METALS"
```

### Component Testing
- Test loading states
- Test error handling
- Test industry-specific filtering
- Test validation error display

## Conclusion

The dynamic enum system successfully addresses the identified issues:

1. ✅ **Eliminated hardcoded selections**
2. ✅ **Achieved database consistency**
3. ✅ **Improved industry alignment**
4. ✅ **Enhanced maintainability**
5. ✅ **Better user experience**

The system provides a solid foundation for future enhancements while maintaining backward compatibility and following best practices for React and Next.js development. 