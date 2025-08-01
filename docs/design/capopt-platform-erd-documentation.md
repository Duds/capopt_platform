# CapOpt Platform - Entity Relationship Diagram (ERD) Documentation

## Overview

The CapOpt Platform database is designed around a layered architecture that embeds Critical Controls Theory (CCT) across all organisational layers. The database schema supports high-risk industries (mining, minerals, petrochemicals, defence) with comprehensive risk management and operational capability optimisation.

## Architecture Layers

The database is organized into four primary layers, each with specific responsibilities:

### 1. Enterprise Information System (Green)
**Purpose**: Core organisational structure and user management
**Color**: `#E8F5E8`

**Key Entities**:
- **Enterprise**: Top-level organisation (e.g., mining company)
- **Facility**: Physical locations (e.g., mine sites, processing plants)
- **BusinessUnit**: Operational divisions (e.g., Mining, Processing, Maintenance)
- **Department**: Functional units within business units
- **User**: System users with role-based access control

**Relationships**:
- Enterprise owns multiple Facilities
- Facilities contain BusinessUnits
- BusinessUnits contain Departments
- Users are employed by Enterprise and assigned to Departments

### 2. Strategic Layer (Blue)
**Purpose**: Business model canvas and strategic planning
**Color**: `#E3F2FD`

**Key Entities**:
- **BusinessCanvas**: Core business model canvas with enhanced metadata
- **OperatingModel**: Operating model canvas components
- **ValueProposition, CustomerSegment, RevenueStream**: Business model components
- **Partnership, Resource, Activity, CostStructure, Channel**: Supporting business model elements

**Enhanced Features**:
- Multi-sector support with industry classification
- Geographic and regional classifications
- Risk profile and compliance requirements
- Strategic objectives and competitive advantages
- Version control and collaboration features

### 3. Critical Control Theory Layer (Orange)
**Purpose**: Risk management and control assurance
**Color**: `#FFF3E0`

**Key Entities**:
- **CriticalControl**: Core control entities with categorization
- **RiskCategory, ControlType, ControlEffectiveness**: Control classification
- **VerificationLog**: Control verification tracking
- **BowtieModel**: Bowtie analysis for risk assessment
- **TopEvent, Threat, Consequence**: Bowtie model components
- **PreventiveControl, MitigatingControl**: Control types in bowtie analysis

**Risk Propagation Engine**:
- **RiskSignal**: Risk event detection
- **RiskPropagation**: Risk propagation tracking
- **RiskThreshold**: Risk threshold management
- **RiskAlert**: Risk alert generation and assignment

### 4. Operational Layer (Purple)
**Purpose**: Process management and operational execution
**Color**: `#F3E5F5`

**Key Entities**:
- **Process**: Operational processes with steps and metrics
- **ProcessStep, ProcessInput, ProcessOutput**: Process components
- **ProcessRisk**: Process-specific risk assessment
- **Playbook**: Operational procedures and best practices
- **Asset**: Physical and digital assets
- **AssetRisk, AssetProtection, AssetMonitor**: Asset management
- **MaturityAssessment**: Capability maturity assessment

## Key Relationships

### Cross-Layer Integration
The database design emphasizes cross-layer relationships to ensure risk and control are embedded throughout:

1. **Enterprise → Strategic**: Business canvases are linked to enterprise structure
2. **Strategic → Control**: Bowtie models link to business canvas elements
3. **Operational → Control**: Processes and assets are linked to critical controls
4. **Control → Risk**: Risk propagation engine monitors all layers

### Many-to-Many Relationships
Several cross-entity relationship tables enable flexible associations:

- **ProcessControl**: Links processes to critical controls
- **AssetControl**: Links assets to critical controls  
- **ProcessPlaybook**: Links processes to operational playbooks

## Database Design Principles

### 1. Critical Controls Theory Integration
- Every operational element can be linked to critical controls
- Risk assessment is embedded at all levels
- Verification and compliance tracking throughout

### 2. Hierarchical Organisation
- Enterprise → Facility → BusinessUnit → Department hierarchy
- Supports complex organisational structures
- Enables granular access control and reporting

### 3. Multi-Sector Support
- Industry and sector classification
- Industry-specific facility types and operational streams
- Compliance framework mapping

### 4. Version Control and Collaboration
- Canvas versioning with change tracking
- Collaboration features with role-based permissions
- Export and sharing capabilities

### 5. Audit and Traceability
- Comprehensive audit logging
- User action tracking
- Change history preservation

## Entity Details

### Business Canvas Enhancements
The BusinessCanvas entity includes extensive metadata:

```sql
-- Enhanced metadata fields
industry: String?           -- Industry classification
sector: String?            -- Legacy single sector
sectors: String[]          -- Multi-sector support
primarySector: String?     -- Primary sector code
strategicObjective: String? -- Strategic objectives
valueProposition: String?  -- Value proposition
competitiveAdvantage: String? -- Competitive advantages
annualRevenue: Decimal?    -- Financial metrics
employeeCount: Int?        -- Organisational metrics
riskProfile: RiskProfile?  -- Risk classification
complianceRequirements: String[] -- Compliance needs
regulatoryFramework: String[] -- Regulatory frameworks
```

### Critical Control Classification
Critical controls are classified using multiple dimensions:

```sql
-- Control classification
controlCategory: ControlCategory  -- CRITICAL, SUPPORTING, etc.
isCritical: Boolean              -- Critical control flag
complianceStatus: ComplianceStatus -- COMPLIANT, NON_COMPLIANT, etc.
priority: Priority               -- LOW, MEDIUM, HIGH, CRITICAL
riskCategoryId: String?          -- Risk category association
controlTypeId: String?           -- Control type classification
effectivenessId: String?         -- Effectiveness rating
```

### Risk Propagation Engine
The risk propagation system provides real-time risk monitoring:

```sql
-- Risk signal detection
sourceType: String        -- "control", "process", "asset", "verification"
sourceId: String          -- Entity identifier
severity: RiskSeverity    -- Risk severity level
description: String       -- Risk description
detectedAt: DateTime      -- Detection timestamp
isResolved: Boolean       -- Resolution status
```

## Usage Patterns

### 1. Enterprise Setup
1. Create Enterprise with industry/sector classification
2. Add Facilities with type and location
3. Create BusinessUnits within facilities
4. Add Departments to business units
5. Assign Users to departments with appropriate roles

### 2. Strategic Planning
1. Create BusinessCanvas with enterprise context
2. Populate business model components
3. Add industry-specific metadata
4. Link to operating models and value chains
5. Enable collaboration and version control

### 3. Control Implementation
1. Define CriticalControls with appropriate categorization
2. Link controls to processes and assets
3. Set up verification schedules and requirements
4. Create BowtieModels for risk analysis
5. Configure risk propagation thresholds

### 4. Operational Management
1. Define Processes with steps and metrics
2. Create Playbooks with procedures and training
3. Register Assets with risk assessments
4. Link operational elements to controls
5. Conduct maturity assessments

## Security Considerations

### 1. Role-Based Access Control
- User roles determine access to different layers
- Enterprise hierarchy affects data visibility
- Department-level access controls

### 2. Data Classification
- Sensitive data protection
- Audit logging for all changes
- Compliance with industry regulations

### 3. Multi-Tenancy
- Enterprise isolation
- Cross-enterprise sharing controls
- Template and framework sharing

## Performance Considerations

### 1. Indexing Strategy
- Primary keys on all entities
- Foreign key indexes for relationships
- Composite indexes for common queries

### 2. Query Optimization
- Efficient relationship traversal
- Pagination for large datasets
- Caching for frequently accessed data

### 3. Scalability
- Horizontal scaling capabilities
- Partitioning strategies
- Read/write optimization

## Future Enhancements

### 1. Advanced Analytics
- Machine learning integration
- Predictive risk modeling
- Performance optimization recommendations

### 2. Integration Capabilities
- External system integration
- API-first design
- Real-time data synchronization

### 3. Mobile Support
- Offline capability
- Mobile-optimized interfaces
- Field data collection

## Conclusion

The CapOpt Platform database design provides a comprehensive foundation for operational capability optimisation in high-risk industries. The layered architecture ensures that Critical Controls Theory is embedded throughout all organisational levels, while the flexible relationship model supports complex organisational structures and evolving business needs.

The ERD serves as a blueprint for understanding the system's data architecture and can be used for:
- Database implementation and migration
- Application development and integration
- System administration and maintenance
- Training and documentation
- Compliance and audit activities 