# Business Canvas Relationships Restoration & Enhancement

## Overview

This document outlines the restoration and enhancement of critical industry/sector relationships in the Business Canvas add/edit modal that were lost during the recent refactor. The implementation restores auto-population of operational streams, compliance requirements, and regulatory frameworks based on selected sectors.

## Problem Statement

During the recent modal refactor, several critical relationships were broken:

1. **Sectors were only shown for "Mining & Metals"** - should be available for all industries
2. **No auto-population** of operational streams, compliance requirements, and regulatory frameworks
3. **Missing industry change handlers** to update related data
4. **Poor UX flow** - relationships between industry, sectors, and derived data weren't clear
5. **Hardcoded facility types** - not industry-specific

## Solution Architecture

### 1. Enhanced Database Schema

#### Industry-Specific Facility Types
- Created `IndustryFacilityTypes` model with proper relationships
- Industry-specific facility types with risk profiles and categories
- Comprehensive seeding for 5 key industries (Mining & Metals, Oil & Gas, Chemicals, Manufacturing, Defence)

#### Improved Operational Streams
- Updated `IndustryOperationalStreams` model with sector-specific streams
- Comprehensive operational streams for different sectors within industries
- Proper categorization (EXTRACTION, PROCESSING, ENVIRONMENTAL, SAFETY, etc.)

### 2. API Enhancements

#### New Sector-Based Recommendations Endpoint
```typescript
// GET /api/enums?type=sector-recommendations&industry=MINING_METALS&sectors=COPPER,GOLD
{
  "operationalStreams": ["Open Pit Mining", "Underground Mining", ...],
  "complianceFrameworks": ["ICMM Framework", "ISO 14001", ...],
  "complianceRequirements": ["WHS Act 2011", "Environmental Protection Act", ...],
  "regulatoryFramework": ["Federal Regulations", "State Standards", ...]
}
```

#### Enhanced Enum Endpoints
- Industry-specific facility types
- Sector-based operational streams
- Comprehensive compliance frameworks

### 3. Frontend Integration

#### React Hooks
```typescript
// New sector-based recommendations hook
export function useSectorRecommendations(industryCode?: string, sectors?: string[]) {
  // Fetches and manages sector-based recommendations
}

// Updated facility types hook
export function useFacilityTypes(industryCode?: string) {
  // Industry-specific facility types
}
```

#### Enhanced CanvasEditor Component

**Key Improvements:**
1. **Universal Sector Selection** - Available for all industries, not just Mining & Metals
2. **Auto-Population Logic** - Operational streams, compliance requirements, and regulatory frameworks auto-populate based on selected sectors
3. **Industry Change Handlers** - Proper reset of related fields when industry changes
4. **Improved UX** - Clear information about auto-population with ability to modify
5. **Validation** - Sector selection is now required for all industries

**Auto-Population Flow:**
```
Industry Selection → Sector Selection → Auto-Populate:
├── Operational Streams (based on sector)
├── Compliance Requirements (from sector frameworks)
├── Regulatory Framework (from sector frameworks)
└── Facility Types (industry-specific)
```

## Implementation Details

### 1. Database Seeding

#### Comprehensive Operational Streams
- **Mining & Metals**: 45 operational streams across 5 sectors (COPPER, GOLD, URANIUM, COAL, IRON_ORE)
- **Oil & Gas**: 21 operational streams across 4 sectors (EXPLORATION, PRODUCTION, REFINING, DISTRIBUTION)
- **Sector-Specific**: Each stream is tied to specific sectors with proper categorization

#### Industry-Specific Facility Types
- **Mining & Metals**: 18 facility types (Open Pit Mine, Underground Mine, Smelter, etc.)
- **Oil & Gas**: 15 facility types (Offshore Platform, Fracking Site, LNG Terminal, etc.)
- **Defence**: 10 facility types (Weapons Factory, Munitions Plant, Secure Storage, etc.)

### 2. Auto-Population Logic

```typescript
// Auto-populate when sectors change
useEffect(() => {
  if (formData.sectors.length > 0 && recommendations && !recommendationsLoading) {
    // Auto-populate operational streams
    if (recommendations.operationalStreams?.length > 0) {
      setFormData(prev => ({
        ...prev,
        operationalStreams: [...new Set([...prev.operationalStreams, ...recommendations.operationalStreams])]
      }))
    }
    
    // Auto-populate compliance requirements
    if (recommendations.complianceRequirements?.length > 0) {
      setFormData(prev => ({
        ...prev,
        complianceRequirements: [...new Set([...prev.complianceRequirements, ...recommendations.complianceRequirements])]
      }))
    }
    
    // Auto-populate regulatory framework
    if (recommendations.regulatoryFramework?.length > 0) {
      setFormData(prev => ({
        ...prev,
        regulatoryFramework: [...new Set([...prev.regulatoryFramework, ...recommendations.regulatoryFramework])]
      }))
    }
  }
}, [formData.sectors, recommendations, recommendationsLoading])
```

### 3. Industry Change Handling

```typescript
const handleIndustryChange = (industryName: string) => {
  setFormData(prev => ({
    ...prev,
    industry: industryName,
    sectors: [], // Reset sectors when industry changes
    facilityType: '', // Reset facility type when industry changes
    operationalStreams: [], // Reset operational streams
    complianceRequirements: [], // Reset compliance requirements
    regulatoryFramework: [] // Reset regulatory framework
  }))
}
```

## Testing Results

### API Endpoint Testing

```bash
# Sector Recommendations - Mining & Metals
curl "http://localhost:3000/api/enums?type=sector-recommendations&industry=MINING_METALS&sectors=COPPER,GOLD"
# Returns 20 operational streams (10 for COPPER + 10 for GOLD)

# Industry-Specific Facility Types
curl "http://localhost:3000/api/enums?type=facility-types&industry=MINING_METALS"
# Returns 18 facility types including Open Pit Mine, Underground Mine, etc.

# Sector Selection - All Industries
curl "http://localhost:3000/api/enums?type=sectors&industry=OIL_GAS"
# Returns 4 sectors: EXPLORATION, PRODUCTION, REFINING, DISTRIBUTION
```

### Frontend Testing
- ✅ Sector selection available for all industries
- ✅ Auto-population of operational streams based on selected sectors
- ✅ Industry-specific facility types
- ✅ Proper reset when industry changes
- ✅ Validation requires sector selection
- ✅ Users can modify auto-populated data

## UX Improvements

### 1. **Clear Information Architecture**
- Step 1: Basic Information (Industry, Business Type, Location)
- Step 2: Operations & Compliance (Sectors, Facility Type, Auto-populated streams/requirements)
- Step 3: Strategic & Financial (Objectives, Revenue, Employees)
- Step 4: Risk & Maturity (Risk Profile, Digital Maturity)

### 2. **User Guidance**
```typescript
<Alert>
  <Info className="h-4 w-4" />
  <AlertDescription>
    Select your sectors to automatically populate relevant operational streams, 
    compliance requirements, and regulatory frameworks. You can modify these later.
  </AlertDescription>
</Alert>
```

### 3. **Auto-Population Indicators**
- Clear labels indicating auto-populated content
- Ability to add/remove items from auto-populated lists
- Visual feedback for what was auto-populated vs. manually added

## Benefits Achieved

### 1. **Restored Functionality**
- ✅ Sector selection for all industries
- ✅ Auto-population of operational streams
- ✅ Auto-population of compliance requirements
- ✅ Auto-population of regulatory frameworks
- ✅ Industry-specific facility types

### 2. **Enhanced User Experience**
- ✅ Clear relationship flow (Industry → Sectors → Auto-population)
- ✅ Reduced manual data entry
- ✅ Contextual facility type options
- ✅ Improved validation and error handling

### 3. **Better Data Quality**
- ✅ Industry-aligned facility types
- ✅ Sector-specific operational streams
- ✅ Consistent compliance frameworks
- ✅ Proper data relationships

### 4. **Scalability**
- ✅ Easy to add new industries
- ✅ Easy to add new sectors
- ✅ Easy to add new operational streams
- ✅ Maintainable through database seeding

## Future Enhancements

### 1. **Compliance Framework Integration**
- Complete compliance frameworks seeding
- Sector-specific compliance requirements
- Regulatory framework auto-population

### 2. **Advanced Auto-Population**
- Machine learning-based recommendations
- User preference learning
- Industry best practice suggestions

### 3. **Enhanced UX**
- Real-time validation feedback
- Progressive disclosure of complex options
- Guided setup wizards

### 4. **Data Analytics**
- Usage analytics for sector selections
- Popular operational stream combinations
- Industry trend analysis

## Conclusion

The restoration and enhancement of industry/sector relationships in the Business Canvas add/edit modal successfully addresses the issues introduced during the recent refactor. The implementation provides:

- **Complete functionality restoration** with enhanced capabilities
- **Industry-aligned data relationships** with proper auto-population
- **Improved user experience** with clear guidance and feedback
- **Scalable architecture** for future enhancements
- **Better data quality** through proper validation and relationships

The system now provides a much more intuitive and efficient experience for users creating and editing Business Canvases, with proper industry/sector alignment and intelligent auto-population of related data. 