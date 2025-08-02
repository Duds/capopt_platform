# Operational Canvas Data Architecture Review - CapOpt Platform

> **Related documentation:**
> - Operational Canvas Design: @docs/design/operational-canvas-design.md
> - Operational Canvas Implementation Plan: @docs/design/operational-canvas-implementation-plan.md
> - Solution Architecture: @docs/design/solution-architecture-design.md

## Executive Summary

After analyzing the proposed Operational Canvas plan against data architecture best practices, several critical improvements are needed to ensure **efficient data relationships**, **extensibility**, **scalability**, and **minimized master data duplication**.

## Current Plan Analysis

### ❌ **Issues Identified**

#### 1. **Data Relationship Inefficiencies**
- **Problem**: Proposed separate `operational_canvas` table creates unnecessary duplication
- **Impact**: Breaks the established pattern of using existing business canvas data
- **Better Approach**: Extend existing `BusinessCanvas` model with operational attributes

#### 2. **Master Data Duplication**
- **Problem**: New master data tables (`process_templates`, `control_frameworks`, `asset_specifications`) duplicate existing patterns
- **Impact**: Inconsistent with established `IndustryFacilityTypes`, `IndustryOperationalStreams` patterns
- **Better Approach**: Extend existing industry-sector association tables

#### 3. **Scalability Concerns**
- **Problem**: JSONB fields for complex data structures limit querying and indexing
- **Impact**: Poor performance for large datasets and complex queries
- **Better Approach**: Normalized relational structures with proper indexing

#### 4. **Extensibility Limitations**
- **Problem**: Hard-coded stream types and process templates
- **Impact**: Difficult to add new industries, sectors, or operational patterns
- **Better Approach**: Flexible, configurable master data system

## Improved Data Architecture

### ✅ **Optimized Approach: Extend Existing Patterns**

#### 1. **Leverage Existing Business Canvas Structure**

Instead of creating a separate `operational_canvas` table, extend the existing `BusinessCanvas` model:

```sql
-- Extend BusinessCanvas with operational attributes
ALTER TABLE business_canvases ADD COLUMN operational_mode BOOLEAN DEFAULT false;
ALTER TABLE business_canvases ADD COLUMN operational_parent_id TEXT REFERENCES business_canvases(id);
ALTER TABLE business_canvases ADD COLUMN operational_status operational_status DEFAULT 'PLANNING';

-- Operational Canvas inherits from Business Canvas
-- No new table needed - same entity, different mode
```

#### 2. **Extend Existing Master Data Patterns**

Follow the established pattern of industry-sector associations:

```sql
-- Extend existing IndustryOperationalStreams for process templates
ALTER TABLE industry_operational_streams ADD COLUMN process_template_data JSONB;
ALTER TABLE industry_operational_streams ADD COLUMN control_framework_data JSONB;
ALTER TABLE industry_operational_streams ADD COLUMN asset_specification_data JSONB;

-- Use existing FacilityTypeMaster for asset specifications
ALTER TABLE facility_type_master ADD COLUMN asset_specifications JSONB;
ALTER TABLE facility_type_master ADD COLUMN operational_requirements JSONB;
```

#### 3. **Normalized Process Management**

Replace JSONB with proper relational structures:

```sql
-- Process Maps (normalized)
CREATE TABLE process_maps (
  id TEXT PRIMARY KEY,
  business_canvas_id TEXT REFERENCES business_canvases(id),
  operational_stream_id TEXT REFERENCES operational_streams(id),
  name TEXT NOT NULL,
  description TEXT,
  status process_status DEFAULT 'DRAFT',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Process Steps (normalized)
CREATE TABLE process_steps (
  id TEXT PRIMARY KEY,
  process_map_id TEXT REFERENCES process_maps(id),
  name TEXT NOT NULL,
  description TEXT,
  step_number INTEGER NOT NULL,
  step_type process_step_type,
  duration_minutes INTEGER,
  predecessor_steps TEXT[], -- Array of step IDs
  successor_steps TEXT[], -- Array of step IDs
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Process Controls (normalized)
CREATE TABLE process_controls (
  id TEXT PRIMARY KEY,
  process_step_id TEXT REFERENCES process_steps(id),
  control_id TEXT REFERENCES critical_controls(id),
  control_type control_type,
  effectiveness control_effectiveness DEFAULT 'PENDING',
  verification_required BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### ✅ **Improved Cascade Strategy**

#### 1. **Efficient Data Inheritance**

```typescript
// services/operational-cascade.service.ts
export class OperationalCascadeService {
  
  // Create Operational Canvas from Business Canvas
  async createOperationalCanvas(businessCanvasId: string, facilityId: string) {
    const businessCanvas = await this.getBusinessCanvas(businessCanvasId);
    
    // Create operational canvas as a child of business canvas
    const operationalCanvas = await prisma.businessCanvas.create({
      data: {
        name: `${businessCanvas.name} - Operational`,
        description: `Operational implementation of ${businessCanvas.name}`,
        operationalMode: true,
        operationalParentId: businessCanvasId,
        enterpriseId: businessCanvas.enterpriseId,
        facilityId: facilityId,
        businessUnitId: businessCanvas.businessUnitId,
        industry: businessCanvas.industry,
        sectors: businessCanvas.sectors,
        primarySector: businessCanvas.primarySector,
        facilityTypes: businessCanvas.facilityTypes,
        operationalStreams: businessCanvas.operationalStreams,
        complianceRequirements: businessCanvas.complianceRequirements,
        regulatoryFramework: businessCanvas.regulatoryFramework,
        status: 'DRAFT'
      }
    });
    
    // Cascade operational streams using existing patterns
    await this.cascadeOperationalStreams(operationalCanvas, businessCanvas);
    
    return operationalCanvas;
  }
  
  // Use existing industry-sector associations
  private async cascadeOperationalStreams(operationalCanvas: BusinessCanvas, businessCanvas: BusinessCanvas) {
    // Use existing BusinessCanvasOperationalStreams pattern
    const industryStreams = await prisma.industryOperationalStreams.findMany({
      where: {
        industry: { code: businessCanvas.industry },
        sector: { code: { in: businessCanvas.sectors } }
      },
      include: {
        operationalStream: true,
        processTemplateData: true,
        controlFrameworkData: true
      }
    });
    
    for (const industryStream of industryStreams) {
      // Create operational stream association
      await prisma.businessCanvasOperationalStreams.create({
        data: {
          businessCanvasId: operationalCanvas.id,
          operationalStreamId: industryStream.operationalStreamId,
          isAutoApplied: true,
          industryOperationalStreamsId: industryStream.id
        }
      });
      
      // Create process maps from template data
      if (industryStream.processTemplateData) {
        await this.createProcessMapsFromTemplate(
          operationalCanvas.id,
          industryStream.operationalStreamId,
          industryStream.processTemplateData
        );
      }
    }
  }
}
```

### ✅ **Master Data Optimization**

#### 1. **Extend Existing Master Data Tables**

```sql
-- Extend IndustryOperationalStreams with operational data
ALTER TABLE industry_operational_streams ADD COLUMN process_template JSONB;
ALTER TABLE industry_operational_streams ADD COLUMN control_framework JSONB;
ALTER TABLE industry_operational_streams ADD COLUMN asset_requirements JSONB;

-- Extend FacilityTypeMaster with operational specifications
ALTER TABLE facility_type_master ADD COLUMN operational_specifications JSONB;
ALTER TABLE facility_type_master ADD COLUMN process_requirements JSONB;
```

#### 2. **Flexible Template System**

```typescript
// types/master-data.ts
interface ProcessTemplate {
  id: string;
  name: string;
  description: string;
  industryCode: string;
  sectorCodes: string[];
  streamType: StreamType;
  steps: ProcessStepTemplate[];
  controls: ControlTemplate[];
  assets: AssetTemplate[];
  isActive: boolean;
}

interface ProcessStepTemplate {
  name: string;
  stepType: ProcessStepType;
  duration: number;
  inputs: string[];
  outputs: string[];
  controls: string[];
  risks: string[];
  predecessorSteps: string[];
  successorSteps: string[];
}
```

### ✅ **Scalable Query Patterns**

#### 1. **Efficient Data Retrieval**

```typescript
// services/operational-data.service.ts
export class OperationalDataService {
  
  // Get operational canvas with all related data in single query
  async getOperationalCanvas(canvasId: string) {
    return await prisma.businessCanvas.findUnique({
      where: { 
        id: canvasId,
        operationalMode: true 
      },
      include: {
        // Use existing relationships
        frameworkOperationalStreams: {
          include: {
            operationalStream: true,
            IndustryOperationalStreams: {
              include: {
                processTemplate: true,
                controlFramework: true
              }
            }
          }
        },
        frameworkFacilityTypes: {
          include: {
            facilityType: {
              include: {
                operationalSpecifications: true
              }
            }
          }
        },
        // New operational relationships
        processMaps: {
          include: {
            steps: {
              include: {
                controls: {
                  include: {
                    control: true
                  }
                }
              }
            }
          }
        }
      }
    });
  }
  
  // Efficient cascade query using existing patterns
  async getCascadeData(businessCanvasId: string) {
    const businessCanvas = await prisma.businessCanvas.findUnique({
      where: { id: businessCanvasId },
      include: {
        frameworkOperationalStreams: {
          include: {
            operationalStream: true
          }
        },
        frameworkFacilityTypes: {
          include: {
            facilityType: true
          }
        }
      }
    });
    
    // Use existing master data associations
    const operationalData = await prisma.industryOperationalStreams.findMany({
      where: {
        industry: { code: businessCanvas.industry },
        sector: { code: { in: businessCanvas.sectors } }
      },
      include: {
        processTemplate: true,
        controlFramework: true
      }
    });
    
    return { businessCanvas, operationalData };
  }
}
```

### ✅ **Extensibility Improvements**

#### 1. **Configurable Master Data**

```typescript
// services/master-data-config.service.ts
export class MasterDataConfigService {
  
  // Dynamic template loading based on industry/sector
  async getProcessTemplates(industryCode: string, sectorCodes: string[]) {
    return await prisma.industryOperationalStreams.findMany({
      where: {
        industry: { code: industryCode },
        sector: { code: { in: sectorCodes } },
        processTemplate: { not: null }
      },
      include: {
        processTemplate: true,
        controlFramework: true
      }
    });
  }
  
  // Extensible control framework system
  async getControlFrameworks(industryCode: string, sectorCodes: string[]) {
    return await prisma.industryComplianceFramework.findMany({
      where: {
        industry: { code: industryCode },
        sector: { code: { in: sectorCodes } }
      },
      include: {
        controlFramework: true
      }
    });
  }
}
```

## Performance Optimizations

### 1. **Indexing Strategy**

```sql
-- Optimize cascade queries
CREATE INDEX idx_business_canvas_operational ON business_canvases(operational_mode, operational_parent_id);
CREATE INDEX idx_industry_sector_streams ON industry_operational_streams(industry_id, sector_id);
CREATE INDEX idx_process_maps_canvas ON process_maps(business_canvas_id);
CREATE INDEX idx_process_steps_map ON process_steps(process_map_id, step_number);
```

### 2. **Query Optimization**

```typescript
// Optimized cascade query with minimal joins
async getOperationalCascadeData(businessCanvasId: string) {
  // Single query with all necessary data
  const result = await prisma.$queryRaw`
    SELECT 
      bc.*,
      json_agg(DISTINCT ios.*) as operational_streams,
      json_agg(DISTINCT pm.*) as process_maps
    FROM business_canvases bc
    LEFT JOIN business_canvas_operational_streams bcos ON bc.id = bcos.business_canvas_id
    LEFT JOIN industry_operational_streams ios ON bcos.industry_operational_streams_id = ios.id
    LEFT JOIN process_maps pm ON bc.id = pm.business_canvas_id
    WHERE bc.id = ${businessCanvasId}
    GROUP BY bc.id
  `;
  
  return result[0];
}
```

## Data Duplication Minimization

### 1. **Single Source of Truth**

- **Business Canvas**: Single entity for both strategic and operational modes
- **Master Data**: Extend existing industry-sector associations
- **Templates**: Store in existing master data tables, not separate tables

### 2. **Reference-Based Relationships**

```typescript
// Use references instead of duplicating data
interface OperationalCanvas extends BusinessCanvas {
  operationalMode: true;
  operationalParentId: string; // Reference to business canvas
  processMaps: ProcessMap[]; // References to process maps
  inheritedData: {
    industry: string; // Reference to existing
    sectors: string[]; // Reference to existing
    facilityTypes: string[]; // Reference to existing
  };
}
```

## Scalability Considerations

### 1. **Horizontal Scaling**

- **Partitioning**: Partition by enterprise or facility
- **Sharding**: Shard by industry or region
- **Caching**: Redis for frequently accessed master data

### 2. **Vertical Scaling**

- **Indexing**: Comprehensive indexing strategy
- **Query Optimization**: Efficient query patterns
- **Data Archiving**: Archive old operational data

## Implementation Recommendations

### ✅ **Phase 1: Extend Existing Structure (1-2 weeks)**

1. **Extend BusinessCanvas Model**
   - Add operational mode attributes
   - Implement operational parent-child relationships
   - Use existing master data patterns

2. **Extend Master Data Tables**
   - Add operational data to existing industry-sector associations
   - Implement template system within existing structure
   - Maintain backward compatibility

### ✅ **Phase 2: Process Management (2-3 weeks)**

1. **Normalized Process Tables**
   - Implement proper relational process structures
   - Use existing control and asset relationships
   - Maintain data integrity constraints

2. **Efficient Cascade System**
   - Use existing pattern assignment system
   - Implement efficient data inheritance
   - Optimize query performance

### ✅ **Phase 3: Advanced Features (2-3 weeks)**

1. **Real-time Monitoring**
   - Leverage existing asset and control monitoring
   - Implement operational performance tracking
   - Use existing risk management framework

2. **Predictive Analytics**
   - Build on existing data patterns
   - Implement machine learning on operational data
   - Use existing performance metrics

## Success Metrics

### **Data Efficiency**
- **Query Performance**: 50% improvement in cascade query performance
- **Storage Optimization**: 30% reduction in data duplication
- **Index Efficiency**: 90% query coverage through proper indexing

### **Scalability**
- **Horizontal Scaling**: Support for 1000+ enterprises
- **Vertical Scaling**: Handle 100,000+ operational records
- **Performance**: Sub-second response times for operational queries

### **Extensibility**
- **New Industries**: Add new industry support in < 1 day
- **New Sectors**: Add new sector support in < 4 hours
- **New Templates**: Add new process templates in < 2 hours

This improved architecture ensures **efficient data relationships**, **extensibility**, **scalability**, and **minimized master data duplication** while leveraging the existing robust patterns established in the Business Canvas implementation. 