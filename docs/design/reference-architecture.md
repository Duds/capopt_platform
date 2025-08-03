# CapOpt Platform Reference Architecture

## Executive Summary
The CapOpt Platform follows a layered architecture approach with the **Enterprise Information System** as the foundational layer, supporting multi-facility organizations with complex operational streams and organizational hierarchies.

**New Data Architecture**: The platform now implements a **Graph-Relational Hybrid** architecture that combines the integrity of relational databases with the flexibility of graph structures for complex interrelationships.

---

## Architecture Layers

### 0. Data Architecture Foundation 🆕
**Purpose**: Graph-relational hybrid data management for complex operational relationships

**Key Components:**
- **Graph Database Integration**: PostgreSQL with graph extensions for complex relationships
- **Relational Integrity**: Strong referential integrity for core business entities
- **JSONB Metadata**: Rich attribute storage for extensible entities
- **Hierarchical Modeling**: LTREE and recursive CTEs for deep hierarchies
- **Master Data Centralization**: Single source of truth for reusable concepts

**Technology Stack:**
- **Primary Database**: PostgreSQL with graph extensions
- **Alternative**: Apache AGE for complex graph queries
- **Hybrid Approach**: Relational for integrity, graph for flexibility
- **Indexing**: GIN indexes for JSONB, GIST indexes for LTREE
- **Caching**: Redis for graph traversal results and relationship caches

**Integration Points:**
- **Graph-Relational Bridge**: Seamless integration between relational and graph data
- **Master Data Management**: Centralized reference entities with graph relationships
- **Cross-Layer Relationships**: Graph-based connections between architecture layers
- **External System Integration**: Graph-based integration with ERP, MES, RCM systems

### 1. Enterprise Information System Layer
**Purpose**: Multi-facility enterprise management with organizational hierarchy

**Key Components:**
- **Enterprise Management**: Multi-facility enterprise data and relationships
- **Facility Management**: Individual facility operations and metrics
- **Business Unit Management**: Organizational structure and performance
- **Department Management**: Department-level operations and staffing
- **Operational Streams**: Multi-stream operational management (copper, uranium, gold, silver)
- **Address Management**: Multiple address types and locations

**Graph-Relational Integration:**
- **Hierarchical Paths**: LTREE for organizational hierarchy storage
- **Graph Nodes**: Enterprise elements as graph nodes for relationship mapping
- **Graph Edges**: Organizational relationships as graph edges
- **Metadata Storage**: JSONB for extensible enterprise attributes

**Technology Stack:**
- **Database**: PostgreSQL with Prisma ORM and graph extensions
- **API**: Next.js API Routes with TypeScript
- **Frontend**: React with TypeScript and Tailwind CSS
- **Authentication**: JWT with HTTP-only cookies
- **Graph Processing**: Custom graph traversal algorithms

**Integration Points:**
- **User Management**: Enterprise and department relationships with graph permissions
- **Process Management**: Enterprise, facility, business unit, department context with graph relationships
- **Asset Management**: Enterprise ownership and facility location with dependency graphs
- **Control Management**: Enterprise-wide control frameworks with graph-based mapping

### 2. Strategic Layer
**Purpose**: Strategic planning and business model management

**Key Components:**
- **Business Model Canvas**: Strategic business model visualization with graph relationships
- **Operating Model Canvas**: Operational strategy and design with graph-based components
- **Value Chain Management**: Value creation and delivery with graph flows
- **Service Model**: Service design and delivery with graph-based touchpoints
- **Experience Model**: User experience design with graph-based journeys
- **Capability Model**: Organizational capability assessment with graph dependencies

**Graph-Relational Integration:**
- **Canvas Elements**: Business canvas blocks as graph nodes
- **Canvas Relationships**: Inter-block relationships as graph edges
- **Strategic Flows**: Value flows and dependencies as graph paths
- **Version Control**: Graph-based versioning and change tracking

**Technology Stack:**
- **Frontend**: React components with interactive canvas and graph visualization
- **State Management**: React Context and hooks with graph state management
- **Data Persistence**: PostgreSQL via Prisma with graph extensions
- **Real-time Updates**: Optimistic UI updates with graph change propagation
- **Graph Visualization**: D3.js or React Flow for graph rendering

### 3. Value & Service Layer
**Purpose**: Value proposition and service delivery management

**Key Components:**
- **Value Proposition**: Customer value definition with graph-based customer mapping
- **Customer Segments**: Target market identification with graph-based segmentation
- **Revenue Streams**: Revenue generation models with graph-based flow analysis
- **Partnerships**: Strategic partnership management with graph-based relationship mapping
- **Resources**: Resource allocation and management with graph-based dependency tracking
- **Activities**: Core business activities with graph-based process flows
- **Cost Structures**: Cost management and optimization with graph-based cost analysis
- **Channels**: Distribution and delivery channels with graph-based flow optimization

**Graph-Relational Integration:**
- **Value Flows**: Value creation and delivery as graph paths
- **Customer Journeys**: Customer touchpoints as graph nodes and flows
- **Resource Dependencies**: Resource relationships as graph edges
- **Cost Propagation**: Cost flow analysis through graph traversal

**Technology Stack:**
- **Frontend**: React with form management and graph-based visualization
- **Validation**: Zod schema validation with graph relationship validation
- **API**: RESTful endpoints with TypeScript and graph query support
- **Database**: PostgreSQL with relationships and graph extensions
- **Analytics**: Graph-based analytics for value chain optimization

### 4. Operational Layer
**Purpose**: Day-to-day operational management and execution

**Key Components:**
- **Process Management**: Process design and execution with graph-based flows
- **Process Maps**: Visual process mapping with graph-based relationships
- **Playbooks**: Operational procedures and guidelines with graph-based workflows
- **Procedures**: Standard operating procedures with graph-based task dependencies
- **Training Materials**: Training and development resources with graph-based learning paths
- **Best Practices**: Knowledge management and sharing with graph-based knowledge networks
- **Improvements**: Continuous improvement processes with graph-based impact analysis

**Graph-Relational Integration:**
- **Process Flows**: Process steps and dependencies as graph paths
- **Task Dependencies**: Task relationships as graph edges
- **Knowledge Networks**: Best practices and learning paths as graph structures
- **Improvement Impact**: Impact analysis through graph traversal

**Technology Stack:**
- **Frontend**: React with process visualization and graph-based workflow design
- **API**: RESTful process management endpoints with graph query capabilities
- **Database**: PostgreSQL with process relationships and graph extensions
- **File Management**: Document storage and retrieval with graph-based metadata
- **Workflow Engine**: Graph-based workflow execution engine

### 5. Control & Risk Layer
**Purpose**: Risk management and control assurance

**Key Components:**
- **Critical Controls**: Risk-based control management with graph-based control networks
- **Risk Categories**: Risk classification and assessment with graph-based risk mapping
- **Control Types**: Control categorization and effectiveness with graph-based analysis
- **Control Effectiveness**: Control performance measurement with graph-based metrics
- **Bowtie Analysis**: Risk assessment and barrier analysis with graph-based bowtie models
- **Threats**: Threat identification and assessment with graph-based threat networks
- **Consequences**: Consequence analysis and management with graph-based impact analysis
- **Barriers**: Control barrier implementation with graph-based barrier networks

**Graph-Relational Integration:**
- **Control Networks**: Control relationships and dependencies as graph structures
- **Risk Propagation**: Risk flow analysis through graph traversal
- **Bowtie Models**: Bowtie analysis as graph-based risk models
- **Barrier Networks**: Control barriers and their relationships as graph edges

**Technology Stack:**
- **Frontend**: React with risk visualization and graph-based control mapping
- **API**: RESTful control management endpoints with graph query support
- **Database**: PostgreSQL with control relationships and graph extensions
- **Risk Engine**: Graph-based risk propagation and analysis engine
- **Compliance Framework**: Graph-based compliance tracking and reporting

---

## Technology Stack

### Database Layer
- **Primary Database**: PostgreSQL 15+ with graph extensions
- **Graph Extensions**: Apache AGE or custom graph functions
- **Caching**: Redis for graph traversal results and relationship caches
- **Search**: Elasticsearch for full-text search across graph metadata
- **Backup**: Automated backup with point-in-time recovery

### Application Layer
- **Backend Framework**: Next.js 15+ with API routes
- **Runtime**: Node.js 18+ with TypeScript
- **ORM**: Prisma with graph query extensions
- **Authentication**: JWT with HTTP-only cookies
- **Authorization**: Role-based access control with graph-based permissions

### Frontend Layer
- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context and hooks with graph state
- **Graph Visualization**: D3.js or React Flow for interactive graphs
- **Forms**: React Hook Form with Zod validation

### Integration Layer
- **API Gateway**: Next.js API routes with rate limiting
- **Event Streaming**: Apache Kafka for real-time event processing
- **Message Queues**: Redis Bull for background job processing
- **External APIs**: RESTful APIs with OAuth2 authentication
- **Real-time Updates**: WebSocket connections for live graph updates

### Infrastructure Layer
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Kubernetes for container management
- **Cloud Platform**: Azure Cloud Services
- **Monitoring**: Azure Application Insights with custom graph metrics
- **Logging**: Structured logging with graph operation tracking

---

## Data Architecture Patterns

### Graph-Relational Hybrid Pattern
```sql
-- Core graph structure
CREATE TABLE nodes (
  id UUID PRIMARY KEY,
  type TEXT NOT NULL,
  label TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE edges (
  from_id UUID REFERENCES nodes(id),
  to_id UUID REFERENCES nodes(id),
  relation_type TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (from_id, to_id, relation_type)
);

-- Hierarchical structure with LTREE
ALTER TABLE business_canvases ADD COLUMN hierarchy_path LTREE;
ALTER TABLE operating_models ADD COLUMN hierarchy_path LTREE;
ALTER TABLE processes ADD COLUMN hierarchy_path LTREE;
```

### Hybrid Query Patterns
```typescript
// Service layer for hybrid queries
export class GraphRelationalService {
  async getProcessWithControls(processId: string) {
    // Relational query for core data
    const process = await prisma.process.findUnique({
      where: { id: processId },
      include: { steps: true, metrics: true }
    });
    
    // Graph query for relationships
    const controls = await this.graphQuery(`
      MATCH (p:Process {id: $processId})-[:controls]->(c:Control)
      RETURN c
    `);
    
    return { ...process, controls };
  }
  
  async getRiskPropagationPath(riskId: string) {
    // Graph traversal for risk propagation
    return await this.graphQuery(`
      WITH RECURSIVE risk_paths AS (
        SELECT from_id, to_id, relation_type, 1 as depth
        FROM edges 
        WHERE from_id = $riskId
        UNION ALL
        SELECT e.from_id, e.to_id, e.relation_type, rp.depth + 1
        FROM edges e
        JOIN risk_paths rp ON e.from_id = rp.to_id
        WHERE rp.depth < 5
      )
      SELECT * FROM risk_paths
    `);
  }
}
```

### Master Data Integration
```typescript
// Centralized master data with graph relationships
interface MasterDataNode {
  id: string;
  type: 'role' | 'system' | 'vendor' | 'hazard' | 'control' | 'standard';
  label: string;
  metadata: Record<string, any>;
  graphNodeId?: string; // Reference to graph node
}

// Reference-based relationships
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

---

## Performance and Scalability

### Query Optimization
```sql
-- Graph indexes for efficient traversal
CREATE INDEX idx_nodes_type_label ON nodes USING GIN (type, label);
CREATE INDEX idx_edges_relation_type ON edges USING GIN (relation_type);
CREATE INDEX idx_edges_metadata ON edges USING GIN (metadata);

-- Hierarchical indexes for LTREE
CREATE INDEX idx_business_canvas_hierarchy ON business_canvases USING GIST (hierarchy_path);
CREATE INDEX idx_operating_model_hierarchy ON operating_models USING GIST (hierarchy_path);
CREATE INDEX idx_process_hierarchy ON processes USING GIST (hierarchy_path);

-- JSONB indexes for metadata queries
CREATE INDEX idx_nodes_metadata ON nodes USING GIN (metadata);
CREATE INDEX idx_edges_metadata ON edges USING GIN (metadata);
```

### Caching Strategy
- **Redis**: Graph traversal results and relationship caches
- **Application Cache**: Frequently accessed master data
- **Database Cache**: Query result caching for complex joins
- **CDN**: Static content and documentation

### Scaling Patterns
- **Horizontal Scaling**: Partition by enterprise or facility
- **Vertical Scaling**: Optimize database performance and indexing
- **Read Replicas**: Separate read and write operations
- **Sharding**: Distribute data across multiple databases

---

## Security and Compliance

### Data Security
- **Encryption**: At rest and in transit
- **Access Control**: Role-based access with graph-based permissions
- **Audit Logging**: Comprehensive audit trails for all operations
- **Data Classification**: Sensitive data handling and protection

### Compliance Framework
- **WHS Act & Regulations**: Australian workplace health and safety
- **ISO Standards**: Quality, environmental, and information security
- **ICMM Critical Control Management**: Mining industry standards
- **Defence Industry Security**: Defence industry requirements

---

## Integration Architecture

### External System Integration
| System | Interface | Data Types | Graph Integration |
|--------|-----------|------------|-------------------|
| ERP | API / ETL | Budget, resourcing, procurement | Cost center relationships |
| MES | OPC-UA / Kafka | Operational metrics, equipment state | Real-time process flows |
| RCM | API / shared tables | Maintenance, reliability, schedules | Asset dependency graphs |
| BI | Materialised views | Reporting, compliance, visualisation | Risk propagation paths |

### Data Flow Architecture
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

---

## Implementation Roadmap

### Phase 1: Foundation (2-3 weeks)
- **Database Schema Updates**: Add graph-relational structures
- **Master Data Migration**: Centralize existing master data
- **Basic Graph Integration**: Implement core nodes and edges

### Phase 2: Graph Integration (3-4 weeks)
- **Process Management**: Convert to graph-based relationships
- **Risk Management**: Implement graph-based risk propagation
- **Control Mapping**: Add control-to-process relationships

### Phase 3: Advanced Features (4-6 weeks)
- **Analytics Integration**: Graph-based performance analytics
- **System Integration**: ERP/MES/RCM graph integration
- **Real-time Updates**: Live graph relationship updates

---

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