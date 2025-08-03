# Operational Canvas Data Architecture Review - CapOpt Platform

> **Related documentation:**
> - Operational Canvas Design: @docs/design/operational-canvas-design.md
> - Operational Canvas Implementation Plan: @docs/design/operational-canvas-implementation-plan.md
> - Solution Architecture: @docs/design/solution-architecture-design.md
> - Data Architecture Strategy: @docs/design/capopt-platform-data-architecture-strategy.md

## Executive Summary

After analyzing the proposed Operational Canvas plan against data architecture best practices and the new **Graph-Relational Hybrid** architecture strategy, several critical improvements are needed to ensure **efficient data relationships**, **extensibility**, **scalability**, and **minimized master data duplication**.

**New Architecture Alignment**: The operational canvas now leverages the Graph-Relational Hybrid pattern for complex operational relationships, flexible process mapping, and real-time risk propagation.

## Current Plan Analysis

### ❌ **Issues Identified**

#### 1. **Data Relationship Inefficiencies**
- **Problem**: Proposed separate `operational_canvas` table creates unnecessary duplication
- **Impact**: Breaks the established pattern of using existing business canvas data
- **Better Approach**: Extend existing `BusinessCanvas` model with operational attributes and graph relationships

#### 2. **Master Data Duplication**
- **Problem**: New master data tables (`process_templates`, `control_frameworks`, `asset_specifications`) duplicate existing patterns
- **Impact**: Inconsistent with established `IndustryFacilityTypes`, `IndustryOperationalStreams` patterns
- **Better Approach**: Extend existing industry-sector association tables with graph-based relationships

#### 3. **Scalability Concerns**
- **Problem**: JSONB fields for complex data structures limit querying and indexing
- **Impact**: Poor performance for large datasets and complex queries
- **Better Approach**: Normalized relational structures with graph relationships and proper indexing

#### 4. **Extensibility Limitations**
- **Problem**: Hard-coded stream types and process templates
- **Impact**: Difficult to add new industries, sectors, or operational patterns
- **Better Approach**: Flexible, configurable master data system with graph-based extensibility

## Improved Data Architecture

### ✅ **Optimized Approach: Graph-Relational Hybrid Pattern**

#### 1. **Leverage Existing Business Canvas Structure with Graph Integration**

Instead of creating a separate `operational_canvas` table, extend the existing `BusinessCanvas` model with graph relationships:

```sql
-- Extend BusinessCanvas with operational attributes
ALTER TABLE business_canvases ADD COLUMN operational_mode BOOLEAN DEFAULT false;
ALTER TABLE business_canvases ADD COLUMN operational_parent_id TEXT REFERENCES business_canvases(id);
ALTER TABLE business_canvases ADD COLUMN operational_status operational_status DEFAULT 'PLANNING';
ALTER TABLE business_canvases ADD COLUMN hierarchy_path LTREE;

-- Graph nodes for operational canvas elements
INSERT INTO nodes (id, type, label, metadata) VALUES
  (canvas_id, 'operational_canvas', canvas_name, {
    'operational_mode': true,
    'parent_canvas_id': parent_canvas_id,
    'status': 'active',
    'version': '1.0'
  });

-- Graph edges for operational relationships
INSERT INTO edges (from_id, to_id, relation_type, metadata) VALUES
  (operational_canvas_id, process_map_id, 'contains', {'component': 'process_map'}),
  (operational_canvas_id, control_framework_id, 'implements', {'framework': 'icmm'}),
  (process_map_id, process_step_id, 'consists_of', {'sequence': 1});
```

#### 2. **Extend Existing Master Data Patterns with Graph Relationships**

Follow the established pattern of industry-sector associations with graph integration:

```sql
-- Extend existing IndustryOperationalStreams for process templates
ALTER TABLE industry_operational_streams ADD COLUMN process_template_data JSONB;
ALTER TABLE industry_operational_streams ADD COLUMN control_framework_data JSONB;
ALTER TABLE industry_operational_streams ADD COLUMN asset_specification_data JSONB;
ALTER TABLE industry_operational_streams ADD COLUMN node_id UUID REFERENCES nodes(id);

-- Graph nodes for master data
INSERT INTO nodes (id, type, label, metadata) VALUES
  (stream_id, 'operational_stream', stream_name, {
    'industry': 'mining',
    'sector': 'copper',
    'process_templates': process_template_data,
    'control_frameworks': control_framework_data
  });

-- Graph edges for master data relationships
INSERT INTO edges (from_id, to_id, relation_type, metadata) VALUES
  (stream_id, process_template_id, 'includes', {'template_type': 'standard'}),
  (stream_id, control_framework_id, 'implements', {'framework': 'icmm'}),
  (process_template_id, control_id, 'requires', {'control_type': 'critical'});
```

#### 3. **Normalized Process Management with Graph Relationships**

Replace JSONB with proper relational structures and graph relationships:

```sql
-- Process Maps (normalized with graph integration)
CREATE TABLE process_maps (
  id TEXT PRIMARY KEY,
  business_canvas_id TEXT REFERENCES business_canvases(id),
  operational_stream_id TEXT REFERENCES operational_streams(id),
  name TEXT NOT NULL,
  description TEXT,
  status process_status DEFAULT 'DRAFT',
  hierarchy_path LTREE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Process Steps (normalized with graph relationships)
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

-- Graph nodes for process elements
INSERT INTO nodes (id, type, label, metadata) VALUES
  (process_map_id, 'process_map', process_map_name, {
    'status': 'active',
    'stream_type': 'copper',
    'complexity': 'high'
  });

-- Graph edges for process relationships
INSERT INTO edges (from_id, to_id, relation_type, metadata) VALUES
  (process_map_id, process_step_id, 'consists_of', {'sequence': step_number}),
  (process_step_id, control_id, 'requires', {'control_type': 'critical'}),
  (process_step_id, asset_id, 'uses', {'asset_type': 'equipment'});
```

### ✅ **Graph-Relational Integration Patterns**

#### 1. **Operational Canvas Graph Structure**

```typescript
// Graph-based operational canvas structure
interface OperationalCanvas extends BusinessCanvas {
  operationalMode: true;
  operationalParentId: string; // Reference to business canvas
  processMaps: ProcessMap[]; // References to process maps
  graphNodeId: string; // Reference to graph node
  inheritedData: {
    industry: string; // Reference to existing
    sectors: string[]; // Reference to existing
    facilityTypes: string[]; // Reference to existing
  };
}

// Graph node for operational canvas
interface OperationalCanvasNode {
  id: string;
  type: 'operational_canvas';
  label: string;
  metadata: {
    operationalMode: true;
    parentCanvasId: string;
    status: string;
    version: string;
    industry: string;
    sectors: string[];
  };
}
```

#### 2. **Process Management Graph Integration**

```typescript
// Process map with graph relationships
interface ProcessMap {
  id: string;
  businessCanvasId: string;
  operationalStreamId: string;
  name: string;
  description: string;
  status: ProcessStatus;
  hierarchyPath: string; // LTREE path
  graphNodeId: string; // Reference to graph node
  steps: ProcessStep[];
  controls: CriticalControl[];
  assets: Asset[];
}

// Process step with graph relationships
interface ProcessStep {
  id: string;
  processMapId: string;
  name: string;
  description: string;
  stepNumber: number;
  stepType: ProcessStepType;
  durationMinutes: number;
  predecessorSteps: string[];
  successorSteps: string[];
  graphNodeId: string; // Reference to graph node
  controls: CriticalControl[];
  risks: RiskSignal[];
}
```

### ✅ **Scalable Query Patterns with Graph Integration**

#### 1. **Efficient Data Retrieval with Hybrid Queries**

```typescript
// services/operational-data.service.ts
export class OperationalDataService {
  
  // Get operational canvas with all related data using hybrid queries
  async getOperationalCanvas(canvasId: string) {
    // Relational query for core data
    const businessCanvas = await prisma.businessCanvas.findUnique({
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
    
    // Graph query for complex relationships
    const graphRelationships = await this.graphQuery(`
      MATCH (oc:OperationalCanvas {id: $canvasId})-[:contains]->(pm:ProcessMap)
      MATCH (pm)-[:consists_of]->(ps:ProcessStep)
      MATCH (ps)-[:requires]->(c:Control)
      RETURN pm, ps, c
    `);
    
    return { businessCanvas, graphRelationships };
  }
  
  // Efficient cascade query using hybrid patterns
  async getCascadeData(businessCanvasId: string) {
    // Relational query for master data
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
    
    // Graph query for complex relationships
    const graphData = await this.graphQuery(`
      MATCH (bc:BusinessCanvas {id: $businessCanvasId})-[:operational_mode]->(oc:OperationalCanvas)
      MATCH (oc)-[:contains]->(pm:ProcessMap)
      MATCH (pm)-[:implements]->(cf:ControlFramework)
      RETURN oc, pm, cf
    `);
    
    return { businessCanvas, operationalData, graphData };
  }
}
```

### ✅ **Extensibility Improvements with Graph Integration**

#### 1. **Configurable Master Data with Graph Relationships**

```typescript
// services/master-data-config.service.ts
export class MasterDataConfigService {
  
  // Dynamic template loading based on industry/sector with graph relationships
  async getProcessTemplates(industryCode: string, sectorCodes: string[]) {
    // Relational query for templates
    const templates = await prisma.industryOperationalStreams.findMany({
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
    
    // Graph query for template relationships
    const templateRelationships = await this.graphQuery(`
      MATCH (ios:IndustryOperationalStream)-[:includes]->(pt:ProcessTemplate)
      WHERE ios.industry_code = $industryCode AND ios.sector_code IN $sectorCodes
      MATCH (pt)-[:requires]->(c:Control)
      RETURN pt, c
    `);
    
    return { templates, templateRelationships };
  }
  
  // Extensible control framework system with graph relationships
  async getControlFrameworks(industryCode: string, sectorCodes: string[]) {
    // Relational query for frameworks
    const frameworks = await prisma.industryComplianceFramework.findMany({
      where: {
        industry: { code: industryCode },
        sector: { code: { in: sectorCodes } }
      },
      include: {
        controlFramework: true
      }
    });
    
    // Graph query for framework relationships
    const frameworkRelationships = await this.graphQuery(`
      MATCH (icf:IndustryComplianceFramework)-[:implements]->(cf:ControlFramework)
      WHERE icf.industry_code = $industryCode AND icf.sector_code IN $sectorCodes
      MATCH (cf)-[:contains]->(c:Control)
      RETURN cf, c
    `);
    
    return { frameworks, frameworkRelationships };
  }
}
```

## Performance Optimizations with Graph Integration

### 1. **Hybrid Indexing Strategy**

```sql
-- Optimize cascade queries with graph integration
CREATE INDEX idx_business_canvas_operational ON business_canvases(operational_mode, operational_parent_id);
CREATE INDEX idx_industry_sector_streams ON industry_operational_streams(industry_id, sector_id);
CREATE INDEX idx_process_maps_canvas ON process_maps(business_canvas_id);
CREATE INDEX idx_process_steps_map ON process_steps(process_map_id, step_number);

-- Graph indexes for efficient traversal
CREATE INDEX idx_nodes_type_label ON nodes USING GIN (type, label);
CREATE INDEX idx_edges_relation_type ON edges USING GIN (relation_type);
CREATE INDEX idx_edges_metadata ON edges USING GIN (metadata);

-- Hierarchical indexes for LTREE
CREATE INDEX idx_business_canvas_hierarchy ON business_canvases USING GIST (hierarchy_path);
CREATE INDEX idx_process_maps_hierarchy ON process_maps USING GIST (hierarchy_path);

-- JSONB indexes for metadata queries
CREATE INDEX idx_nodes_metadata ON nodes USING GIN (metadata);
CREATE INDEX idx_edges_metadata ON edges USING GIN (metadata);
```

### 2. **Hybrid Query Optimization**

```typescript
// Optimized cascade query with graph integration
async getOperationalCascadeData(businessCanvasId: string) {
  // Single relational query with all necessary data
  const relationalData = await prisma.$queryRaw`
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
  
  // Graph query for complex relationships
  const graphData = await this.graphQuery(`
    MATCH (bc:BusinessCanvas {id: $businessCanvasId})-[:operational_mode]->(oc:OperationalCanvas)
    MATCH (oc)-[:contains]->(pm:ProcessMap)
    MATCH (pm)-[:consists_of]->(ps:ProcessStep)
    MATCH (ps)-[:requires]->(c:Control)
    RETURN oc, pm, ps, c
  `);
  
  return { relationalData: relationalData[0], graphData };
}
```

## Data Duplication Minimization with Graph Integration

### 1. **Single Source of Truth with Graph Relationships**

- **Business Canvas**: Single entity for both strategic and operational modes with graph relationships
- **Master Data**: Extend existing industry-sector associations with graph nodes and edges
- **Templates**: Store in existing master data tables with graph relationships, not separate tables
- **Graph Integration**: Use graph nodes and edges for complex relationships without duplicating data

### 2. **Reference-Based Relationships with Graph Integration**

```typescript
// Use references instead of duplicating data with graph relationships
interface OperationalCanvas extends BusinessCanvas {
  operationalMode: true;
  operationalParentId: string; // Reference to business canvas
  processMaps: ProcessMap[]; // References to process maps
  graphNodeId: string; // Reference to graph node
  inheritedData: {
    industry: string; // Reference to existing
    sectors: string[]; // Reference to existing
    facilityTypes: string[]; // Reference to existing
  };
}

// Graph relationships for operational canvas
interface OperationalCanvasGraphRelationships {
  canvasNode: GraphNode;
  processMapNodes: GraphNode[];
  controlNodes: GraphNode[];
  assetNodes: GraphNode[];
  relationships: GraphEdge[];
}
```

## Scalability Considerations with Graph Integration

### 1. **Horizontal Scaling with Graph Integration**

- **Partitioning**: Partition by enterprise or facility with graph relationship preservation
- **Sharding**: Shard by industry or region with graph relationship routing
- **Caching**: Redis for frequently accessed master data and graph traversal results

### 2. **Vertical Scaling with Graph Integration**

- **Indexing**: Comprehensive indexing strategy for both relational and graph queries
- **Query Optimization**: Efficient hybrid query patterns combining relational and graph data
- **Data Archiving**: Archive old operational data with graph relationship preservation

## Implementation Recommendations with Graph Integration

### ✅ **Phase 1: Extend Existing Structure with Graph Integration (2-3 weeks)**

1. **Extend BusinessCanvas Model with Graph Relationships**
   - Add operational mode attributes
   - Implement operational parent-child relationships
   - Use existing master data patterns
   - Add graph nodes and edges for operational relationships

2. **Extend Master Data Tables with Graph Integration**
   - Add operational data to existing industry-sector associations
   - Implement template system within existing structure
   - Maintain backward compatibility
   - Add graph relationships for master data

### ✅ **Phase 2: Process Management with Graph Integration (3-4 weeks)**

1. **Normalized Process Tables with Graph Relationships**
   - Implement proper relational process structures
   - Use existing control and asset relationships
   - Maintain data integrity constraints
   - Add graph nodes and edges for process relationships

2. **Efficient Cascade System with Graph Integration**
   - Use existing pattern assignment system
   - Implement efficient data inheritance
   - Optimize query performance
   - Add graph-based relationship traversal

### ✅ **Phase 3: Advanced Features with Graph Integration (4-6 weeks)**

1. **Real-time Monitoring with Graph Relationships**
   - Leverage existing asset and control monitoring
   - Implement operational performance tracking
   - Use existing risk management framework
   - Add graph-based real-time relationship updates

2. **Predictive Analytics with Graph Integration**
   - Build on existing data patterns
   - Implement machine learning on operational data
   - Use existing performance metrics
   - Add graph-based predictive analytics

## Success Metrics with Graph Integration

### **Data Efficiency with Graph Integration**
- **Query Performance**: 70% improvement in complex relationship queries with graph integration
- **Storage Optimization**: 40% reduction in data duplication with graph relationships
- **Index Efficiency**: 95% query coverage through proper indexing and graph traversal

### **Scalability with Graph Integration**
- **Horizontal Scaling**: Support for 1000+ enterprises with graph relationship preservation
- **Vertical Scaling**: Handle 100,000+ operational records with graph traversal optimization
- **Performance**: Sub-second response times for operational queries with graph integration

### **Extensibility with Graph Integration**
- **New Industries**: Add new industry support in < 1 day with graph relationship templates
- **New Sectors**: Add new sector support in < 4 hours with graph relationship inheritance
- **New Templates**: Add new process templates in < 2 hours with graph relationship mapping
- **New Relationships**: Add new relationship types without schema changes using graph edges

This improved architecture ensures **efficient data relationships**, **extensibility**, **scalability**, and **minimized master data duplication** while leveraging the existing robust patterns established in the Business Canvas implementation and the new Graph-Relational Hybrid architecture strategy. 