# Sector Framework Improvements Implementation Plan

## Overview
This document outlines the implementation plan for improving the sector handling and framework relationships in the CapOpt Platform, addressing the issues identified by the user.

## Issues Identified

### 1. Sector Problems ✅ FIXED
- **Missing Silver**: Silver was not available as a selection option
- **Wrong sector grouping**: All sectors were mixed together instead of being filtered by industry
- **Too many sectors**: Value chain showed sectors from all industries instead of just the selected industry

### 2. Framework Relationship Issues 🔄 IN PROGRESS
- **No proper relationships**: Operational streams, compliance, and facilities are not properly linked to business canvases
- **Missing facility multi-select**: Facilities should be multi-select and auto-applied based on industry/sectors
- **No business canvas associations**: Framework selections are not recorded in the business canvas database

## Completed Fixes

### ✅ Phase 1: Sector Data and Filtering (COMPLETED)

#### 1.1 Updated Sector Seeding
- **File**: `prisma/seed/industries/index.ts`
- **Changes**:
  - Added missing `SILVER` sector
  - Added `GOLD_SILVER` combined sector (industry standard)
  - Reorganized sectors by proper categories (COMMODITY, VALUE_CHAIN, BUSINESS_MODEL, SUPPORT_SERVICES)
  - Made sectors industry-specific (no more cross-industry contamination)
  - Updated sector names to be more descriptive and industry-aligned

#### 1.2 Updated IndustrySectorSelector
- **File**: `components/business-canvas/IndustrySectorSelector.tsx`
- **Changes**:
  - Added `industryCode` prop to filter sectors by selected industry
  - Updated `categorizeSectors` function to filter by industry
  - Fixed sector selection logic to work with updated structure

#### 1.3 Updated CanvasEditor
- **File**: `components/business-canvas/CanvasEditor.tsx`
- **Changes**:
  - Added `industryCode` prop to `IndustrySectorSelector`
  - Passes `currentIndustryCode` to filter sectors properly

#### 1.4 Database Schema Updates
- **File**: `prisma/schema.prisma`
- **Changes**:
  - Added `BusinessCanvasOperationalStreams` model for tracking operational stream associations
  - Added `BusinessCanvasComplianceFrameworks` model for tracking compliance framework associations
  - Added `BusinessCanvasFacilityTypes` model for tracking facility type associations
  - Added proper relationships between business canvases and framework items

## Current Status

### ✅ Completed
- Sector filtering by industry
- Missing sectors (SILVER) added
- Sector categories properly organized
- Database schema for framework associations

### 🔄 In Progress
- Framework auto-population logic
- Facility multi-select implementation
- Business canvas association tracking

### ⏳ Pending
- Framework management interface
- Auto-application logic based on industry/sectors
- Manual addition/removal of framework items

## Next Steps

### Phase 2: Framework Auto-Population (NEXT)

#### 2.1 Update Operational Streams Auto-Population
- **Goal**: Auto-populate operational streams based on selected sectors
- **Implementation**:
  - Update `useSectorRecommendations` hook to fetch operational streams for selected sectors
  - Modify auto-population logic in `CanvasEditor` to use sector-based recommendations
  - Add business canvas association creation when operational streams are auto-applied

#### 2.2 Update Compliance Requirements Auto-Population
- **Goal**: Auto-populate compliance requirements based on selected sectors
- **Implementation**:
  - Update `useSectorRecommendations` hook to fetch compliance requirements for selected sectors
  - Modify auto-population logic in `CanvasEditor` to use sector-based recommendations
  - Add business canvas association creation when compliance requirements are auto-applied

#### 2.3 Update Regulatory Framework Auto-Population
- **Goal**: Auto-populate regulatory framework based on selected sectors
- **Implementation**:
  - Update `useSectorRecommendations` hook to fetch regulatory framework for selected sectors
  - Modify auto-population logic in `CanvasEditor` to use sector-based recommendations
  - Add business canvas association creation when regulatory framework is auto-applied

### Phase 3: Facility Multi-Select (NEXT)

#### 3.1 Create Facility Multi-Select Component
- **Goal**: Replace single facility type with multi-select facility types
- **Implementation**:
  - Create `FacilityTypeMultiSelect` component similar to `IndustrySectorSelector`
  - Update `BusinessInformation` interface to use `facilityTypes: string[]`
  - Update database schema to support multiple facility types per business canvas

#### 3.2 Auto-Populate Facility Types
- **Goal**: Auto-populate facility types based on industry and selected sectors
- **Implementation**:
  - Update `useSectorRecommendations` hook to fetch facility types for industry/sectors
  - Modify auto-population logic in `CanvasEditor` to use sector-based recommendations
  - Add business canvas association creation when facility types are auto-applied

### Phase 4: Framework Management Interface (FUTURE)

#### 4.1 Create Framework Management Component
- **Goal**: Allow users to manually add/remove framework items
- **Implementation**:
  - Create `FrameworkManagement` component for operational streams, compliance, and facilities
  - Add "Add/Remove" functionality for each framework type
  - Show auto-applied vs manually added items

#### 4.2 Business Canvas Association Tracking
- **Goal**: Track which framework items are auto-applied vs manually added
- **Implementation**:
  - Use `isAutoApplied` field in framework association models
  - Update UI to show auto-applied vs manual items
  - Allow users to convert auto-applied items to manual (and vice versa)

## Technical Implementation Details

### Database Models
```sql
-- Business Canvas Framework Associations
BusinessCanvasOperationalStreams {
  id: String
  businessCanvasId: String
  operationalStreamId: String
  isAutoApplied: Boolean
  createdAt: DateTime
  updatedAt: DateTime
}

BusinessCanvasComplianceFrameworks {
  id: String
  businessCanvasId: String
  complianceFrameworkId: String
  isAutoApplied: Boolean
  createdAt: DateTime
  updatedAt: DateTime
}

BusinessCanvasFacilityTypes {
  id: String
  businessCanvasId: String
  facilityTypeId: String
  isAutoApplied: Boolean
  createdAt: DateTime
  updatedAt: DateTime
}
```

### API Endpoints Needed
- `GET /api/business-canvas/{id}/framework-associations` - Get framework associations for a business canvas
- `POST /api/business-canvas/{id}/framework-associations` - Add framework associations
- `DELETE /api/business-canvas/{id}/framework-associations/{associationId}` - Remove framework associations
- `PUT /api/business-canvas/{id}/framework-associations/{associationId}` - Update framework association (auto-applied status)

### Component Structure
```
components/business-canvas/
├── IndustrySectorSelector.tsx ✅ (Updated)
├── FacilityTypeMultiSelect.tsx ⏳ (To be created)
├── FrameworkManagement.tsx ⏳ (To be created)
└── CanvasEditor.tsx ✅ (Updated)
```

## Testing Strategy

### Unit Tests
- Test sector filtering by industry
- Test framework auto-population logic
- Test business canvas association creation

### Integration Tests
- Test end-to-end framework selection and association
- Test auto-population based on sector changes
- Test manual addition/removal of framework items

### E2E Tests
- Test complete business canvas creation with framework associations
- Test editing existing business canvas with framework changes
- Test framework management interface

## Success Criteria

### Phase 1 ✅ COMPLETED
- [x] Sectors are filtered by selected industry
- [x] SILVER sector is available for selection
- [x] Sector categories are properly organized
- [x] No cross-industry sector contamination

### Phase 2 ⏳ PENDING
- [ ] Operational streams auto-populate based on selected sectors
- [ ] Compliance requirements auto-populate based on selected sectors
- [ ] Regulatory framework auto-populates based on selected sectors
- [ ] Business canvas associations are created for auto-applied items

### Phase 3 ⏳ PENDING
- [ ] Facility types are multi-select
- [ ] Facility types auto-populate based on industry/sectors
- [ ] Business canvas associations are created for facility types

### Phase 4 ⏳ PENDING
- [ ] Framework management interface allows manual addition/removal
- [ ] Auto-applied vs manual items are clearly distinguished
- [ ] Users can convert between auto-applied and manual items

## Migration Strategy

### Database Migration
- New framework association tables are already created
- Existing business canvases will need migration to populate framework associations
- Migration script needed to backfill existing data

### Frontend Migration
- Gradual rollout of new components
- Backward compatibility with existing single facility type
- Feature flags for new framework management interface

## Timeline

### Week 1: Phase 2 Implementation
- Update operational streams auto-population
- Update compliance requirements auto-population
- Update regulatory framework auto-population

### Week 2: Phase 3 Implementation
- Create facility multi-select component
- Implement facility type auto-population
- Update business canvas associations

### Week 3: Phase 4 Implementation
- Create framework management interface
- Implement manual addition/removal functionality
- Add auto-applied vs manual item distinction

### Week 4: Testing and Refinement
- Comprehensive testing of all features
- Bug fixes and performance optimization
- Documentation updates

## Risk Mitigation

### Technical Risks
- **Database Performance**: Monitor query performance with new associations
- **Data Consistency**: Ensure framework associations stay in sync with sector changes
- **Migration Complexity**: Test migration scripts thoroughly before deployment

### User Experience Risks
- **Interface Complexity**: Keep framework management interface intuitive
- **Data Loss**: Ensure no data is lost during auto-population changes
- **Performance**: Maintain responsive UI with new framework features

## Conclusion

The sector framework improvements will significantly enhance the CapOpt Platform by:
1. Providing industry-specific sector filtering
2. Auto-populating framework items based on sector selection
3. Allowing flexible framework management
4. Maintaining proper business canvas associations

This implementation will address all the issues identified by the user and provide a more robust and user-friendly framework management system. 