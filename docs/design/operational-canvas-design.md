# Operational Canvas Design - CapOpt Platform

> **Related documentation:**
> - Solution Architecture: @docs/design/solution-architecture-design.md
> - Reference Architecture: @docs/design/reference-architecture.md
> - Product Backlog: @docs/design/product-backlog.md
> - Implementation Status: @docs/implementation-status.md

## Executive Summary

The **Operational Canvas** is the pivotal leverage point in the CapOpt Platform that transforms strategic business models into executable operational frameworks. It bridges the gap between "what is our business" (Business Model Canvas) and "how do we deliver it" (Operational Execution).

## Strategic Context & Product Purpose

### Customer Value Proposition
- **High-Risk Industries**: Mining, minerals, petrochemicals, defence
- **Critical Need**: Operational capability optimisation with embedded Critical Controls Theory
- **Key Benefit**: End-to-end visibility from strategic planning through operational execution
- **Risk Model**: "Trickle-up" risk model where strategic insights derive from frontline operational data

### Framework Alignment
The Operational Canvas implements the **Operational Layer** of our reference architecture, providing:
- **Process Management**: Visual process mapping and execution
- **Playbooks**: Operational procedures and guidelines
- **Maturity Scoring**: Capability assessment and improvement
- **Critical Controls**: Risk-based control integration
- **Asset Management**: Asset lifecycle and optimization

## Operational Canvas Structure

### 1. Strategic Cascade Section
**Purpose**: Inherit and operationalize strategic elements from Business Model Canvas

#### 1.1 Value Chain Operationalization
```typescript
interface ValueChainOperationalization {
  strategicValueChain: string[] // From Business Canvas
  operationalValueStreams: OperationalStream[]
  valueDeliveryPoints: Process[]
  valueMetrics: ProcessMetric[]
  criticalPathAnalysis: CriticalPath[]
}
```

#### 1.2 Resource Allocation
```typescript
interface ResourceAllocation {
  strategicResources: Resource[] // From Business Canvas
  operationalAssets: Asset[]
  resourceCapacity: CapacityPlanning
  resourceUtilization: UtilizationMetrics
  resourceOptimization: OptimizationTargets
}
```

#### 1.3 Activity Execution
```typescript
interface ActivityExecution {
  strategicActivities: Activity[] // From Business Canvas
  operationalProcesses: Process[]
  processMaps: ProcessMap[]
  executionMetrics: ExecutionMetrics
  performanceTargets: PerformanceTargets
}
```

### 2. Operational Stream Management
**Purpose**: Multi-stream operational management for complex operations

#### 2.1 Stream Configuration
```typescript
interface OperationalStream {
  id: string
  name: string
  code: string
  type: StreamType // COPPER, URANIUM, GOLD, SILVER
  facilityId: string
  businessUnitId: string
  processes: Process[]
  assets: Asset[]
  controls: CriticalControl[]
  metrics: StreamMetrics
  status: StreamStatus
}
```

#### 2.2 Stream Integration
- **Copper Stream**: Flotation → Smelting → Refining
- **Uranium Stream**: Leaching → Solvent Extraction → Precipitation
- **Gold Stream**: Recovery from copper → Refining
- **Silver Stream**: Recovery from copper → Refining

### 3. Process Management Section
**Purpose**: Visual process mapping and execution management

#### 3.1 Process Maps
```typescript
interface ProcessMap {
  id: string
  name: string
  description: string
  streamId: string
  processSteps: ProcessStep[]
  inputs: ProcessInput[]
  outputs: ProcessOutput[]
  controls: ProcessControl[]
  risks: ProcessRisk[]
  metrics: ProcessMetric[]
  status: ProcessStatus
}
```

#### 3.2 Process Visualization
- **Flow Diagrams**: Visual process flow representation
- **Step Management**: Individual process step configuration
- **Integration Points**: Cross-process and cross-stream connections
- **Performance Monitoring**: Real-time process performance tracking

### 4. Playbook Management Section
**Purpose**: Operational procedures and knowledge management

#### 4.1 Playbook Structure
```typescript
interface Playbook {
  id: string
  name: string
  description: string
  processId: string
  procedures: Procedure[]
  trainingMaterials: TrainingMaterial[]
  bestPractices: BestPractice[]
  improvements: Improvement[]
  status: PlaybookStatus
}
```

#### 4.2 Knowledge Management
- **Standard Operating Procedures**: Step-by-step operational procedures
- **Training Materials**: Learning resources and competency development
- **Best Practices**: Knowledge sharing and continuous improvement
- **Improvement Tracking**: Kaizen and optimization initiatives

### 5. Critical Controls Integration
**Purpose**: Embed Critical Controls Theory into operational execution

#### 5.1 Control Mapping
```typescript
interface OperationalControl {
  id: string
  name: string
  description: string
  processId: string
  controlType: ControlType
  effectiveness: ControlEffectiveness
  verificationLogs: VerificationLog[]
  riskCategory: RiskCategory
  status: ComplianceStatus
}
```

#### 5.2 Risk Integration
- **Process-Specific Controls**: Controls mapped to specific process steps
- **Risk Assessment**: Bowtie analysis integration
- **Control Effectiveness**: Real-time control performance monitoring
- **Compliance Tracking**: Regulatory and internal compliance management

### 6. Asset Management Section
**Purpose**: Asset lifecycle management and optimization

#### 6.1 Asset Integration
```typescript
interface OperationalAsset {
  id: string
  name: string
  type: AssetType
  processId: string
  streamId: string
  risks: AssetRisk[]
  protection: AssetProtection[]
  monitoring: AssetMonitor[]
  optimization: AssetOptimisation[]
  status: AssetStatus
}
```

#### 6.2 Asset Optimization
- **Performance Monitoring**: Real-time asset performance tracking
- **Risk Assessment**: Asset-specific risk analysis
- **Protection Measures**: Asset protection and security
- **Optimization Strategies**: Asset performance optimization

## Master Data Integration Strategy

### 1. Strategic Master Data Cascade
**From Business Canvas:**
- **Industry/Sector**: Determines operational streams and processes
- **Facility Types**: Defines asset requirements and configurations
- **Compliance Requirements**: Establishes control frameworks
- **Regulatory Frameworks**: Sets compliance boundaries

### 2. Operational Master Data
**New Operational Master Data:**
- **Process Templates**: Industry-standard process templates
- **Control Frameworks**: Industry-specific control frameworks
- **Asset Specifications**: Standard asset specifications
- **Training Curricula**: Industry-standard training programs

### 3. Master Data Relationships
```typescript
interface MasterDataRelationships {
  industry: Industry
  sectors: Sector[]
  facilityTypes: FacilityTypeMaster[]
  operationalStreams: OperationalStream[]
  complianceRequirements: ComplianceRequirement[]
  regulatoryFrameworks: RegulatoryFramework[]
  processTemplates: ProcessTemplate[]
  controlFrameworks: ControlFramework[]
  assetSpecifications: AssetSpecification[]
  trainingCurricula: TrainingCurriculum[]
}
```

## Data Cascade Strategy

### 1. Business Canvas → Operational Canvas
**Automatic Cascade:**
- **Industry/Sector Selection**: Automatically populates operational streams
- **Facility Types**: Determines asset requirements and process configurations
- **Compliance Requirements**: Establishes control frameworks and procedures
- **Regulatory Frameworks**: Sets compliance boundaries and reporting requirements

### 2. Operational Canvas → Process Execution
**Operational Cascade:**
- **Process Maps**: Define specific operational procedures
- **Playbooks**: Provide detailed execution guidelines
- **Critical Controls**: Ensure risk management integration
- **Asset Management**: Optimize asset utilization and performance

### 3. Process Execution → Strategic Insights
**Trickle-Up Cascade:**
- **Performance Metrics**: Feed back to strategic planning
- **Risk Signals**: Inform strategic risk management
- **Efficiency Gains**: Drive strategic optimization
- **Compliance Status**: Ensure strategic compliance

## Implementation Phases

### Phase 1: Foundation (2-3 weeks)
- **Operational Canvas UI**: Basic canvas structure and navigation
- **Strategic Cascade**: Business Canvas data inheritance
- **Operational Streams**: Multi-stream management interface
- **Database Schema**: Operational canvas entities and relationships

### Phase 2: Process Management (3-4 weeks)
- **Process Maps**: Visual process mapping interface
- **Process Steps**: Individual step management
- **Process Metrics**: Performance tracking and monitoring
- **Process Controls**: Critical controls integration

### Phase 3: Playbook Management (2-3 weeks)
- **Playbook Interface**: Playbook creation and management
- **Procedure Management**: Standard operating procedures
- **Training Materials**: Learning resource management
- **Best Practices**: Knowledge sharing platform

### Phase 4: Asset Integration (2-3 weeks)
- **Asset Management**: Asset lifecycle management
- **Asset Monitoring**: Real-time asset performance
- **Asset Optimization**: Performance optimization tools
- **Asset Controls**: Asset-specific risk management

### Phase 5: Advanced Features (3-4 weeks)
- **Real-time Monitoring**: Live operational performance tracking
- **Predictive Analytics**: Performance prediction and optimization
- **Advanced Reporting**: Comprehensive operational reporting
- **Integration APIs**: External system integration

## Technical Implementation

### Database Schema Extensions
```sql
-- Operational Canvas
CREATE TABLE operational_canvas (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  business_canvas_id TEXT REFERENCES business_canvas(id),
  facility_id TEXT REFERENCES facility(id),
  status canvas_status DEFAULT 'DRAFT',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Process Maps
CREATE TABLE process_maps (
  id TEXT PRIMARY KEY,
  operational_canvas_id TEXT REFERENCES operational_canvas(id),
  name TEXT NOT NULL,
  description TEXT,
  stream_id TEXT REFERENCES operational_stream(id),
  status process_status DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Playbooks
CREATE TABLE playbooks (
  id TEXT PRIMARY KEY,
  process_map_id TEXT REFERENCES process_maps(id),
  name TEXT NOT NULL,
  description TEXT,
  status playbook_status DEFAULT 'DRAFT',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints
```typescript
// Operational Canvas Management
GET    /api/operational-canvas
POST   /api/operational-canvas
GET    /api/operational-canvas/[id]
PATCH  /api/operational-canvas/[id]
DELETE /api/operational-canvas/[id]

// Process Management
GET    /api/process-maps
POST   /api/process-maps
GET    /api/process-maps/[id]
PATCH  /api/process-maps/[id]
DELETE /api/process-maps/[id]

// Playbook Management
GET    /api/playbooks
POST   /api/playbooks
GET    /api/playbooks/[id]
PATCH  /api/playbooks/[id]
DELETE /api/playbooks/[id]
```

### Frontend Components
```typescript
// Main Operational Canvas Component
<OperationalCanvas
  businessCanvas={businessCanvas}
  facility={facility}
  onSave={handleSave}
  onUpdate={handleUpdate}
/>

// Process Management Components
<ProcessMapViewer
  processMap={processMap}
  onStepUpdate={handleStepUpdate}
  onControlAdd={handleControlAdd}
/>

// Playbook Management Components
<PlaybookEditor
  playbook={playbook}
  onProcedureAdd={handleProcedureAdd}
  onTrainingAdd={handleTrainingAdd}
/>
```

## Success Metrics

### Operational Efficiency
- **Process Cycle Time**: Reduction in process execution time
- **Resource Utilization**: Improved asset and resource utilization
- **Error Reduction**: Decrease in operational errors and incidents
- **Compliance Rate**: Improved regulatory compliance performance

### Strategic Alignment
- **Strategic Execution**: Alignment between strategic plans and operational execution
- **Risk Management**: Improved risk identification and mitigation
- **Performance Visibility**: Enhanced operational performance visibility
- **Continuous Improvement**: Increased improvement initiatives and outcomes

### Customer Value
- **Operational Excellence**: Improved operational performance and reliability
- **Risk Reduction**: Enhanced risk management and control effectiveness
- **Compliance Assurance**: Better regulatory compliance and audit readiness
- **Knowledge Management**: Improved knowledge sharing and competency development

## Next Steps

1. **Detailed Design Review**: Review and refine the operational canvas design
2. **Database Schema**: Implement operational canvas database schema
3. **API Development**: Create operational canvas API endpoints
4. **Frontend Development**: Build operational canvas UI components
5. **Integration Testing**: Test strategic cascade and operational execution
6. **User Acceptance Testing**: Validate with end users and stakeholders

The Operational Canvas represents a critical milestone in the CapOpt Platform, transforming strategic vision into operational reality while maintaining the embedded Critical Controls Theory that ensures risk management at every level. 