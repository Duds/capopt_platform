# CapOpt Platform - Entity Relationship Diagram (ERD) Documentation

## Overview

The CapOpt Platform database is designed around a layered architecture that embeds Critical Controls Theory (CCT) across all organisational layers. The database schema supports high-risk industries (mining, minerals, petrochemicals, defence) with comprehensive risk management and operational capability optimisation.

**New Data Architecture**: The platform now implements a **Graph-Relational Hybrid** architecture that combines the integrity of relational databases with the flexibility of graph structures for complex interrelationships.

## Architecture Layers

The database is organized into five primary layers, each with specific responsibilities:

### 0. Data Architecture Foundation (Graph-Relational) 🆕
**Purpose**: Graph-relational hybrid data management for complex operational relationships
**Color**: `#F0F8FF`

**Key Entities**:
- **Nodes**: Polymorphic entity storage for all canvas elements
- **Edges**: Flexible relationship mapping between entities
- **Master Data**: Centralized reference entities with graph relationships
- **Hierarchical Paths**: LTREE for deep organizational and operational hierarchies

**Graph-Relational Integration**:
- **Polymorphic Nodes**: All entities can be represented as graph nodes
- **Flexible Edges**: Dynamic relationship modeling without schema changes
- **Metadata Storage**: JSONB for rich, extensible attributes
- **Hierarchical Modeling**: LTREE and recursive CTEs for deep hierarchies

### 1. Enterprise Information System (Green)
**Purpose**: Core organisational structure and user management
**Color**: `#E8F5E8`

**Key Entities**:
- **Enterprise**: Top-level organisation (e.g., mining company)
- **Facility**: Physical locations (e.g., mine sites, processing plants)
- **BusinessUnit**: Operational divisions (e.g., Mining, Processing, Maintenance)
- **Department**: Functional units within business units
- **User**: System users with role-based access control

**Graph-Relational Integration**:
- **Hierarchical Paths**: LTREE for organizational hierarchy storage
- **Graph Nodes**: Enterprise elements as graph nodes for relationship mapping
- **Graph Edges**: Organizational relationships as graph edges
- **Metadata Storage**: JSONB for extensible enterprise attributes

**Relationships**:
- Enterprise owns multiple Facilities
- Facilities contain BusinessUnits
- BusinessUnits contain Departments
- Users are employed by Enterprise and assigned to Departments
- All entities have corresponding graph nodes and edges

### 2. Strategic Layer (Blue)
**Purpose**: Business model canvas and strategic planning
**Color**: `#E3F2FD`

**Key Entities**:
- **BusinessCanvas**: Core business model canvas with enhanced metadata and graph relationships
- **OperatingModel**: Operating model canvas components with graph-based relationships
- **ValueProposition, CustomerSegment, RevenueStream**: Business model components with graph mapping
- **Partnership, Resource, Activity, CostStructure, Channel**: Supporting business model elements with graph relationships

**Graph-Relational Integration**:
- **Canvas Elements**: Business canvas blocks as graph nodes
- **Canvas Relationships**: Inter-block relationships as graph edges
- **Strategic Flows**: Value flows and dependencies as graph paths
- **Version Control**: Graph-based versioning and change tracking

**Enhanced Features**:
- Multi-sector support with industry classification
- Geographic and regional classifications
- Risk profile and compliance requirements
- Strategic objectives and competitive advantages
- Version control and collaboration features
- Graph-based relationship mapping

### 3. Critical Control Theory Layer (Orange)
**Purpose**: Risk management and control assurance
**Color**: `#FFF3E0`

**Key Entities**:
- **CriticalControl**: Core control entities with categorization and graph relationships
- **RiskCategory, ControlType, ControlEffectiveness**: Control classification with graph analysis
- **VerificationLog**: Control verification tracking with graph-based audit trails
- **BowtieModel**: Bowtie analysis for risk assessment with graph-based models
- **TopEvent, Threat, Consequence**: Bowtie model components with graph relationships
- **PreventiveControl, MitigatingControl**: Control types in bowtie analysis with graph mapping

**Graph-Relational Integration**:
- **Control Networks**: Control relationships and dependencies as graph structures
- **Risk Propagation**: Risk flow analysis through graph traversal
- **Bowtie Models**: Bowtie analysis as graph-based risk models
- **Barrier Networks**: Control barriers and their relationships as graph edges

**Risk Propagation Engine**:
- **RiskSignal**: Risk event detection with graph-based signal propagation
- **RiskPropagation**: Risk propagation tracking with graph-based path analysis
- **RiskThreshold**: Risk threshold management with graph-based threshold networks
- **RiskAlert**: Risk alert generation and assignment with graph-based alert routing

### 4. Operational Layer (Purple)
**Purpose**: Process management and operational execution
**Color**: `#F3E5F5`

**Key Entities**:
- **Process**: Operational processes with steps, metrics, and graph-based flows
- **ProcessStep, ProcessInput, ProcessOutput**: Process components with graph relationships
- **ProcessRisk**: Process-specific risk assessment with graph-based risk mapping
- **Playbook**: Operational procedures and best practices with graph-based workflows
- **Asset**: Physical and digital assets with graph-based dependency networks
- **AssetRisk, AssetProtection, AssetMonitor**: Asset management with graph-based monitoring
- **MaturityAssessment**: Capability maturity assessment with graph-based maturity networks

**Graph-Relational Integration**:
- **Process Flows**: Process steps and dependencies as graph paths
- **Task Dependencies**: Task relationships as graph edges
- **Knowledge Networks**: Best practices and learning paths as graph structures
- **Improvement Impact**: Impact analysis through graph traversal

## Graph-Relational Core Entities

### Nodes Table (Polymorphic Entity Storage)
```sql
CREATE TABLE nodes (
  id UUID PRIMARY KEY,
  type TEXT NOT NULL, -- 'activity', 'canvas_card', 'control', 'process', 'asset'
  label TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Node Types**:
- **Enterprise Nodes**: Enterprise, facility, business unit, department
- **Strategic Nodes**: Business canvas, operating model, value proposition
- **Operational Nodes**: Process, playbook, asset, procedure
- **Control Nodes**: Critical control, risk category, bowtie model
- **Risk Nodes**: Risk signal, threat, consequence, risk propagation

### Edges Table (Flexible Relationship Mapping)
```sql
CREATE TABLE edges (
  from_id UUID REFERENCES nodes(id),
  to_id UUID REFERENCES nodes(id),
  relation_type TEXT NOT NULL, -- 'delivers', 'mitigates', 'depends_on', 'controls'
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (from_id, to_id, relation_type)
);
```

**Relationship Types**:
- **Operational Relationships**: 'consists_of', 'depends_on', 'produces', 'consumes'
- **Control Relationships**: 'controls', 'mitigates', 'prevents', 'monitors'
- **Risk Relationships**: 'causes', 'results_in', 'propagates_to', 'triggers'
- **Strategic Relationships**: 'delivers', 'enables', 'supports', 'aligns_with'

### Hierarchical Paths (LTREE)
```sql
-- Hierarchical structure with LTREE
ALTER TABLE business_canvases ADD COLUMN hierarchy_path LTREE;
ALTER TABLE operating_models ADD COLUMN hierarchy_path LTREE;
ALTER TABLE processes ADD COLUMN hierarchy_path LTREE;
ALTER TABLE enterprises ADD COLUMN hierarchy_path LTREE;
ALTER TABLE facilities ADD COLUMN hierarchy_path LTREE;
ALTER TABLE business_units ADD COLUMN hierarchy_path LTREE;
ALTER TABLE departments ADD COLUMN hierarchy_path LTREE;
```

## Key Relationships

### Cross-Layer Integration
The database design emphasizes cross-layer relationships to ensure risk and control are embedded throughout:

1. **Enterprise → Strategic**: Business canvases are linked to enterprise structure with graph relationships
2. **Strategic → Control**: Bowtie models link to business canvas elements with graph-based mapping
3. **Operational → Control**: Processes and assets are linked to critical controls with graph relationships
4. **Control → Risk**: Risk propagation engine monitors all layers with graph-based analysis

### Graph-Relational Relationships
Several cross-entity relationship patterns enable flexible associations:

- **ProcessControl**: Links processes to critical controls with graph edges
- **AssetControl**: Links assets to critical controls with graph relationships
- **ProcessPlaybook**: Links processes to operational playbooks with graph flows
- **RiskPropagation**: Links risk signals across layers with graph-based propagation paths

### Many-to-Many Relationships
Traditional many-to-many relationships are enhanced with graph capabilities:

- **ProcessControl**: Enhanced with graph-based effectiveness tracking
- **AssetControl**: Enhanced with graph-based protection mapping
- **ProcessPlaybook**: Enhanced with graph-based workflow execution
- **UserRole**: Enhanced with graph-based permission inheritance

## Database Design Principles

### 1. Graph-Relational Hybrid Integration
- Every operational element can be linked to critical controls via graph relationships
- Risk assessment is embedded at all levels with graph-based propagation
- Verification and compliance tracking throughout with graph-based audit trails
- Flexible relationship modeling without schema changes

### 2. Hierarchical Organisation
- **LTREE Extension**: For PostgreSQL hierarchical path storage
- **Recursive CTEs**: For complex hierarchical queries
- **Graph Traversal**: For relationship path analysis
- **Hybrid Queries**: Combining relational and graph patterns

### 3. Master Data Centralization
- **Centralized Master Data**: Single source of truth for roles, systems, vendors, hazards, controls
- **Reference-Based Relationships**: Use ID references across all layers to avoid duplication
- **Template Inheritance**: Allow entities to inherit and extend master templates
- **Graph-Based Master Data**: Master data entities with graph relationship capabilities

### 4. Metadata-Rich Entities
- **JSONB Storage**: Rich attribute storage for extensible entities
- **Schema Flexibility**: Industry-specific requirements without schema changes
- **Performance Optimization**: GIN indexing for metadata queries
- **Version Control**: Metadata evolution with backward compatibility

## Graph-Relational Query Patterns

### Hybrid Queries
```sql
-- Find all processes that control a specific risk
SELECT n2.label as process_name, e.metadata as control_details
FROM nodes n1
JOIN edges e ON n1.id = e.from_id
JOIN nodes n2 ON e.to_id = n2.id
WHERE n1.type = 'risk' 
  AND n1.label = 'Equipment Failure'
  AND e.relation_type = 'controls'
  AND n2.type = 'process';

-- Find risk propagation paths
WITH RECURSIVE risk_paths AS (
  SELECT from_id, to_id, relation_type, 1 as depth
  FROM edges 
  WHERE from_id = (SELECT id FROM nodes WHERE type = 'risk' AND label = 'Equipment Failure')
  UNION ALL
  SELECT e.from_id, e.to_id, e.relation_type, rp.depth + 1
  FROM edges e
  JOIN risk_paths rp ON e.from_id = rp.to_id
  WHERE rp.depth < 5
)
SELECT * FROM risk_paths;
```

### Hierarchical Queries
```sql
-- Find all business units under a facility
SELECT * FROM business_units 
WHERE hierarchy_path <@ (SELECT hierarchy_path FROM facilities WHERE id = 'facility_id');

-- Find all processes in a business unit hierarchy
SELECT * FROM processes 
WHERE hierarchy_path <@ (SELECT hierarchy_path FROM business_units WHERE id = 'business_unit_id');
```

### Metadata Queries
```sql
-- Find all controls with high effectiveness
SELECT * FROM nodes 
WHERE type = 'critical_control' 
  AND metadata->>'effectiveness'::numeric > 0.8;

-- Find all processes with specific risk level
SELECT * FROM nodes 
WHERE type = 'process' 
  AND metadata->>'risk_level' = 'high';
```

## Performance Optimization

### Graph Indexes
```sql
-- Graph indexes for efficient traversal
CREATE INDEX idx_nodes_type_label ON nodes USING GIN (type, label);
CREATE INDEX idx_edges_relation_type ON edges USING GIN (relation_type);
CREATE INDEX idx_edges_metadata ON edges USING GIN (metadata);
```

### Hierarchical Indexes
```sql
-- Hierarchical indexes for LTREE
CREATE INDEX idx_business_canvas_hierarchy ON business_canvases USING GIST (hierarchy_path);
CREATE INDEX idx_operating_model_hierarchy ON operating_models USING GIST (hierarchy_path);
CREATE INDEX idx_process_hierarchy ON processes USING GIST (hierarchy_path);
CREATE INDEX idx_enterprise_hierarchy ON enterprises USING GIST (hierarchy_path);
CREATE INDEX idx_facility_hierarchy ON facilities USING GIST (hierarchy_path);
CREATE INDEX idx_business_unit_hierarchy ON business_units USING GIST (hierarchy_path);
CREATE INDEX idx_department_hierarchy ON departments USING GIST (hierarchy_path);
```

### JSONB Indexes
```sql
-- JSONB indexes for metadata queries
CREATE INDEX idx_nodes_metadata ON nodes USING GIN (metadata);
CREATE INDEX idx_edges_metadata ON edges USING GIN (metadata);
```

## Integration Readiness

### External System Integration
| System | Interface | Data Types | Graph Integration |
|--------|-----------|------------|-------------------|
| ERP | API / ETL | Budget, resourcing, procurement | Cost center relationships |
| MES | OPC-UA / Kafka | Operational metrics, equipment state | Real-time process flows |
| RCM | API / shared tables | Maintenance, reliability, schedules | Asset dependency graphs |
| BI | Materialised views | Reporting, compliance, visualisation | Risk propagation paths |

### Graph-Relational Integration Patterns
```sql
-- Integration nodes for external systems
INSERT INTO nodes (id, type, label, metadata) VALUES
  (erp_id, 'external_system', 'SAP_ERP', {
    'system_type': 'erp',
    'integration_type': 'api_etl',
    'sync_frequency': 'hourly'
  });

-- Integration relationships
INSERT INTO edges (from_id, to_id, relation_type, metadata) VALUES
  (erp_id, cost_center_id, 'provides_data', {'data_type': 'budget'}),
  (mes_id, process_id, 'monitors', {'frequency': 'real_time'}),
  (rcm_id, asset_id, 'maintains', {'maintenance_type': 'preventive'});
```

## Data Flow Architecture

### Graph-Relational Data Flow
```sql
-- Data flow nodes
INSERT INTO nodes (id, type, label, metadata) VALUES
  (data_flow_id, 'data_flow', 'operational_to_strategic', {
    'source_layer': 'operational',
    'target_layer': 'strategic',
    'flow_type': 'risk_propagation'
  });

-- Data flow relationships
INSERT INTO edges (from_id, to_id, relation_type, metadata) VALUES
  (operational_data_id, tactical_data_id, 'flows_to', {'delay': '1_hour'}),
  (tactical_data_id, strategic_data_id, 'flows_to', {'delay': '24_hours'}),
  (external_system_id, operational_data_id, 'provides', {'frequency': 'real_time'});
```

## Implementation Considerations

### Migration Strategy
1. **Phase 1**: Add graph-relational structures to existing schema
2. **Phase 2**: Migrate existing relationships to graph edges
3. **Phase 3**: Implement hierarchical paths with LTREE
4. **Phase 4**: Add metadata storage with JSONB

### Performance Considerations
- **Query Optimization**: Use hybrid queries for complex relationship analysis
- **Indexing Strategy**: Implement comprehensive indexing for graph and hierarchical queries
- **Caching**: Use Redis for frequently accessed graph traversal results
- **Partitioning**: Consider partitioning by enterprise or facility for large datasets

### Scalability Patterns
- **Horizontal Scaling**: Partition by enterprise or facility
- **Vertical Scaling**: Optimize database performance and indexing
- **Read Replicas**: Separate read and write operations for graph queries
- **Sharding**: Distribute data across multiple databases for very large datasets

## Success Metrics

### Performance Metrics
- **Query Performance**: 60% improvement in complex relationship queries
- **Scalability**: Support for 10,000+ nodes and 100,000+ edges
- **Response Time**: Sub-second response for operational queries

### Business Metrics
- **Risk Visibility**: Real-time risk propagation across all layers
- **Process Optimization**: Graph-based bottleneck identification
- **Control Effectiveness**: Visual control-to-process mapping

### Technical Metrics
- **Data Quality**: 100% single source of truth for master data
- **Extensibility**: New relationship types without schema changes
- **Integration**: Seamless connection with external systems 