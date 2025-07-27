# CapOpt Platform Solution Architecture Design

## Executive Summary
The CapOpt platform is a comprehensive operational capability optimisation system designed to provide end-to-end visibility from strategic planning through operational execution, with integrated Critical Control Theory (CCT) and maturity-based improvement frameworks. The platform implements a "trickle-up" risk model where strategic risk insights are derived from frontline operational data rather than manually declared.

---

## 0. Enterprise Information System

### 0.1 Enterprise Management Module
**Purpose**: Multi-facility enterprise management with organizational hierarchy

**Key Entities:**
- Enterprise
- EnterpriseAddress
- Facility
- BusinessUnit
- Department

**ERD:**
```mermaid
erDiagram
    Enterprise {
        string id
        string name
        string legalName
        string abn
        string acn
        string industry
        string sector
    }
    EnterpriseAddress {
        string id
        enum type
        string street
        string suburb
        string city
        string state
        string postcode
        string country
    }
    Facility {
        string id
        string name
        string code
        enum type
        enum status
        string location
        string capacity
    }
    BusinessUnit {
        string id
        string name
        string code
        enum type
        enum status
        string manager
        decimal budget
    }
    Department {
        string id
        string name
        string code
        enum type
        enum status
        string manager
        int employeeCount
    }
    Enterprise ||--o{ EnterpriseAddress : has
    Enterprise ||--o{ Facility : operates
    Enterprise ||--o{ BusinessUnit : contains
    Facility ||--o{ BusinessUnit : hosts
    BusinessUnit ||--o{ Department : manages
    Enterprise ||--o{ User : employs
    Enterprise ||--o{ Process : executes
    Enterprise ||--o{ Asset : owns
```

### 0.2 Operational Streams
**Purpose**: Multi-stream operational management for complex mining operations

**Supported Streams:**
- **Copper Stream**: Flotation, smelting, refining processes
- **Uranium Stream**: Leaching, solvent extraction, precipitation
- **Gold Stream**: Recovery from copper, refining processes
- **Silver Stream**: Recovery from copper, refining processes

**Test Data Foundation:**
- **Enterprise**: Cracked Mountain Pty Ltd (CMP)
- **Facility**: Hercules Levee (HL001) - Based on Olympic Dam Mine
- **Location**: Roxby Downs, South Australia
- **Capacity**: 200,000 tonnes copper, 4,000 tonnes uranium, 80,000 oz gold, 800,000 oz silver annually

### 0.3 Organizational Hierarchy
**Purpose**: Comprehensive organizational structure management

**Business Units (12):**
- Mining Operations (MINING)
- Mineral Processing (PROCESSING)
- Metallurgy (METALLURGY)
- Maintenance (MAINTENANCE)
- Engineering (ENGINEERING)
- Safety & Health (SAFETY)
- Environmental (ENVIRONMENTAL)
- Finance (FINANCE)
- Human Resources (HR)
- Information Technology (IT)
- Logistics (LOGISTICS)
- Quality Assurance (QA)

**Departments (20+):**
Each business unit contains multiple departments with realistic staffing levels and management structures.

---

## 1. Strategic Layer

### 1.1 Business Model Canvas Module
**Purpose**: Strategic business model visualisation and management

**Key Entities:**
- BusinessCanvas
- ValueProposition
- CustomerSegment
- RevenueStream
- Partnership
- Resource
- Activity
- CostStructure
- Channel

**ERD:**
```mermaid
erDiagram
    BusinessCanvas {
        string id
        string name
    }
    ValueProposition {
        string id
        string description
    }
    CustomerSegment {
        string id
        string name
    }
    RevenueStream {
        string id
        string type
    }
    Partnership {
        string id
        string name
    }
    Resource {
        string id
        string name
    }
    Activity {
        string id
        string name
    }
    CostStructure {
        string id
        string description
    }
    Channel {
        string id
        string type
    }
    BusinessCanvas ||--o{ ValueProposition : has
    BusinessCanvas ||--o{ CustomerSegment : targets
    BusinessCanvas ||--o{ RevenueStream : generates
    BusinessCanvas ||--o{ Partnership : partners
    BusinessCanvas ||--o{ Resource : uses
    BusinessCanvas ||--o{ Activity : performs
    BusinessCanvas ||--o{ CostStructure : incurs
    BusinessCanvas ||--o{ Channel : delivers_via
```

### 1.2 Operating Model Canvas Module
**Purpose**: Operational strategy and design framework

**Key Entities:**
- OperatingModel
- ValueChain
- ServiceModel
- ExperienceModel
- CapabilityModel
- OperatingPrinciple

**ERD:**
```mermaid
erDiagram
    OperatingModel {
        string id
        string name
    }
    ValueChain {
        string id
        string name
    }
    ServiceModel {
        string id
        string name
    }
    ExperienceModel {
        string id
        string name
    }
    CapabilityModel {
        string id
        string name
    }
    OperatingPrinciple {
        string id
        string description
    }
    OperatingModel ||--o{ ValueChain : defines
    OperatingModel ||--o{ ServiceModel : includes
    OperatingModel ||--o{ ExperienceModel : includes
    OperatingModel ||--o{ CapabilityModel : includes
    OperatingModel ||--o{ OperatingPrinciple : guided_by
```

---

## 2. Value & Service Layer

### 2.1 Value Chain Engine
**Purpose**: Core value creation steps and flow management

**Key Entities:**
- ValueChain
- ValueStep
- ValueFlow
- ValueMetric
- Bottleneck
- OptimisationOpportunity

**ERD:**
```mermaid
erDiagram
    ValueChain {
        string id
        string name
    }
    ValueStep {
        string id
        string name
    }
    ValueFlow {
        string id
        string description
    }
    ValueMetric {
        string id
        string metric
    }
    Bottleneck {
        string id
        string description
    }
    OptimisationOpportunity {
        string id
        string description
    }
    ValueChain ||--o{ ValueStep : consists_of
    ValueChain ||--o{ ValueFlow : flows
    ValueChain ||--o{ ValueMetric : measures
    ValueChain ||--o{ Bottleneck : has
    ValueChain ||--o{ OptimisationOpportunity : enables
    ValueStep ||--o{ ValueFlow : transitions
```

### 2.2 Service Model Framework
**Purpose**: Service design and delivery management

**Key Entities:**
- ServiceModel
- ServiceBlueprint
- Touchpoint
- QualityMetric
- ServiceImprovement
- CustomerJourney

**ERD:**
```mermaid
erDiagram
    ServiceModel {
        string id
        string name
    }
    ServiceBlueprint {
        string id
        string description
    }
    Touchpoint {
        string id
        string type
    }
    QualityMetric {
        string id
        string metric
    }
    ServiceImprovement {
        string id
        string description
    }
    CustomerJourney {
        string id
        string description
    }
    ServiceModel ||--o{ ServiceBlueprint : has
    ServiceModel ||--o{ Touchpoint : includes
    ServiceModel ||--o{ QualityMetric : measures
    ServiceModel ||--o{ ServiceImprovement : tracks
    ServiceModel ||--o{ CustomerJourney : maps
```

---

## 3. Operational Layer

### 3.1 Process Management System
**Purpose**: Process mapping, documentation, and optimisation

**Key Entities:**
- Process
- ProcessStep
- ProcessInput
- ProcessOutput
- ProcessMetric
- ProcessRisk
- ProcessControl

**ERD:**
```mermaid
erDiagram
    Process {
        string id
        string name
        string description
    }
    ProcessStep {
        string id
        string name
    }
    ProcessInput {
        string id
        string name
    }
    ProcessOutput {
        string id
        string name
    }
    ProcessMetric {
        string id
        string metric
    }
    ProcessRisk {
        string id
        string description
    }
    ProcessControl {
        string id
        string name
    }
    Process ||--o{ ProcessStep : consists_of
    Process ||--o{ ProcessInput : inputs
    Process ||--o{ ProcessOutput : outputs
    Process ||--o{ ProcessMetric : measures
    Process ||--o{ ProcessRisk : risks
    Process ||--o{ ProcessControl : controls
```

### 3.2 Playbook Management System
**Purpose**: Operational procedures and best practices

**Key Entities:**
- Playbook
- Procedure
- TrainingMaterial
- BestPractice
- Improvement

**ERD:**
```mermaid
erDiagram
    Playbook {
        string id
        string name
    }
    Procedure {
        string id
        string description
    }
    TrainingMaterial {
        string id
        string title
    }
    BestPractice {
        string id
        string description
    }
    Improvement {
        string id
        string description
    }
    Playbook ||--o{ Procedure : contains
    Playbook ||--o{ TrainingMaterial : includes
    Playbook ||--o{ BestPractice : documents
    Playbook ||--o{ Improvement : tracks
```

---

## 4. Critical Control Theory (CCT) Layer

### 4.1 Critical Control Management
**Purpose**: Identify, monitor, and assure critical controls using Critical Control Theory

**Key Entities:**
- CriticalControl
- ControlType
- ControlEffectiveness
- RiskCategory
- ControlProcess
- VerificationLog

**ERD:**
```mermaid
erDiagram
    CriticalControl {
        string id
        string name
        string description
        string priority
        string status
        enum controlType
        boolean isCritical
        string verificationFrequency
    }
    ControlType {
        string id
        string name
        string category
    }
    ControlEffectiveness {
        string id
        string controlId
        number effectiveness
        date assessedAt
    }
    RiskCategory {
        string id
        string name
        string description
    }
    ControlProcess {
        string id
        string controlId
        string processId
        string relationship
    }
    VerificationLog {
        string id
        string controlId
        string status
        string submittedBy
        datetime submittedAt
        text notes
    }
    CriticalControl ||--o{ ControlType : has
    CriticalControl ||--o{ ControlEffectiveness : measures
    CriticalControl ||--o{ RiskCategory : addresses
    CriticalControl ||--o{ ControlProcess : links
    CriticalControl ||--o{ VerificationLog : verified_by
```

### 4.2 Bowtie Analysis System
**Purpose**: Risk analysis and control mapping using bowtie methodology

**Key Entities:**
- BowtieModel
- TopEvent
- Threat
- Consequence
- PreventiveControl
- MitigatingControl
- BowtieNode

**ERD:**
```mermaid
erDiagram
    BowtieModel {
        string id
        string name
        string description
        string topEventId
        string linkedRiskId
        string capabilityId
        string createdBy
        enum status
    }
    TopEvent {
        string id
        string title
        string description
        enum severity
        enum likelihood
    }
    Threat {
        string id
        string title
        string description
        string topEventId
    }
    Consequence {
        string id
        string title
        string linkedBmcBlock
        string topEventId
    }
    PreventiveControl {
        string id
        string title
        string description
        enum type
        string linkedProcessId
        string linkedPlaybookId
        string linkedCapabilityId
        enum verificationStatus
        datetime verificationDate
        string threatId
    }
    MitigatingControl {
        string id
        string title
        string description
        enum type
        string linkedProcessId
        string linkedPlaybookId
        string linkedCapabilityId
        enum verificationStatus
        datetime verificationDate
        string consequenceId
    }
    BowtieNode {
        string id
        string bowtieModelId
        enum type
        string refId
        int x
        int y
        enum status
    }
    BowtieModel ||--o{ TopEvent : focuses
    BowtieModel ||--o{ Threat : identifies
    BowtieModel ||--o{ Consequence : maps
    BowtieModel ||--o{ PreventiveControl : uses
    BowtieModel ||--o{ MitigatingControl : uses
    BowtieModel ||--o{ BowtieNode : contains
```

---

## 5. Risk Propagation Engine

### 5.1 Trickle-Up Risk Model
**Purpose**: Calculate strategic risk from frontline operational data

**Key Entities:**
- RiskSignal
- RiskPropagation
- RiskThreshold
- RiskAlert
- RiskInsight

**ERD:**
```mermaid
erDiagram
    RiskSignal {
        string id
        string sourceType
        string sourceId
        enum severity
        string description
        datetime detectedAt
        string location
    }
    RiskPropagation {
        string id
        string sourceEntityId
        string targetEntityId
        number propagationScore
        string propagationPath
        datetime calculatedAt
    }
    RiskThreshold {
        string id
        string entityType
        string thresholdType
        number thresholdValue
        string alertMessage
    }
    RiskAlert {
        string id
        string riskSignalId
        string thresholdId
        enum status
        string assignedTo
        datetime createdAt
        datetime resolvedAt
    }
    RiskInsight {
        string id
        string entityId
        string entityType
        number riskScore
        string insightType
        string narrative
        datetime generatedAt
    }
    RiskSignal ||--o{ RiskPropagation : triggers
    RiskPropagation ||--o{ RiskThreshold : evaluated_against
    RiskThreshold ||--o{ RiskAlert : generates
    RiskSignal ||--o{ RiskInsight : creates
```

### 5.2 Risk Calculation Framework
**Scoring Model (Bottom-Up):**
- **Control Level**: Status (OK, At Risk, Failed) × Criticality × Weight
- **Process Level**: Weighted sum of control statuses
- **Capability Level**: Average adjusted for interdependence and maturity
- **Strategic Level**: Mapped based on declared dependencies

**Threshold Alerts:**
- Control failures in high-severity processes
- Capability load exceeding thresholds
- Multiple controls linked to strategic channels inactive

**Narrative Risk Indicators:**
- Human-readable risk narratives from operational data
- Automated risk briefing generation
- Regulatory compliance reporting

---

## 6. CapOps Platform Architecture

### 6.1 Module Structure
**Core Modules:**
- **ControlOps**: Control assurance & verification engine
- **RiskMap**: Live risk propagation engine
- **PlayFlow**: Playbook orchestration
- **TraceLine**: Strategic traceability engine
- **AssureBoard**: Executive and regulator reporting
- **BowtieLab**: Interactive bowtie modeller
- **PulseDeck**: Operational insight & early warning
- **CapFrame**: Capability modelling layer

### 6.2 Application Model Architecture
```mermaid
flowchart TD
  %% Strategic Layer
  A[BMC<br>Business Model Canvas]
  B[OMC<br>Operating Model Canvas]

  %% Capability & Process Layer
  C[CapFrame<br>Enterprise Capabilities]
  D[Processes<br>Process Maps]

  %% Playbooks and Execution
  E[PlayFlow<br>Playbooks & SOPs]
  G[FieldActions<br>Frontline Tasks & Verifications]

  %% Controls & Assurance
  F[ControlOps<br>Critical & Supporting Controls]
  J[Verification<br>Control Attestation Workflow]
  K[BowtieLab<br>Embedded Bowtie Risk Scenarios]

  %% Risk & Traceability
  H[RiskMap<br>Live Risk Propagation Engine]
  L[TraceLine<br>Strategic Traceability Engine]
  I[AssureBoard<br>Executive & Regulator Dashboards]

  %% Relationships
  A -->|Strategic Intent| B
  B -->|Executes via| C
  C -->|Depends on| D
  D -->|Task-steps in| E
  E -->|Has embedded| F
  F -->|Verified through| J
  J -->|Data from| G

  %% Bowtie & Risk Connections
  F -->|Mapped in| K
  D -->|Includes threat nodes in| K
  K -->|Feeds critical controls to| F
  J -->|Verification outcomes| H
  G -->|Real-world task signals| H
  F -->|Effectiveness updates| H
  H -->|Inferred risk signals to| A

  %% Traceability & Assurance
  L -->|Traces links| A
  L -->|Maps dependencies| C
  H -->|Feeds dashboards| I
  J -->|Feeds assurance status| I
  K -->|Scenario impact overlays| I
```

---

## 7. Integration Architecture

### 7.1 Layer Integration Patterns

#### **Strategic Navigation Integration**
- **Bidirectional Flow**: Enable navigation between all layers
- **Context Preservation**: Maintain context when navigating between layers
- **Alignment Tracking**: Track strategic alignment across layers
- **Impact Traceability**: Trace operational impact on strategic objectives

#### **Control Integration**
- **Cross-Layer Controls**: Apply controls across all layers
- **Risk Alignment**: Align risk management with strategic objectives
- **Compliance Tracking**: Track compliance across all layers
- **Assurance Integration**: Integrate assurance activities across layers

### 7.2 API Integration Patterns

#### **RESTful API Design**
- **Consistent Endpoints**: Standardized API patterns across all modules
- **Resource-Based URLs**: Clear resource identification in URLs
- **HTTP Status Codes**: Proper status code usage for responses
- **Error Handling**: Consistent error response formats

#### **GraphQL Integration**
- **Flexible Queries**: Allow clients to request specific data
- **Real-time Updates**: Subscription-based real-time updates
- **Schema Evolution**: Backward-compatible schema changes
- **Performance Optimization**: Efficient data fetching

### 7.3 Data Integration Patterns

#### **Event-Driven Architecture**
- **Domain Events**: Capture business events across all layers
- **Event Sourcing**: Maintain event history for audit and replay
- **CQRS Pattern**: Separate read and write operations
- **Event Streaming**: Real-time event processing

#### **Data Consistency**
- **Eventual Consistency**: Accept eventual consistency for better performance
- **Saga Pattern**: Handle distributed transactions across layers
- **Compensation Logic**: Handle rollback scenarios
- **Data Validation**: Ensure data integrity across layers

---

## 8. Security Architecture

### 8.1 Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Role-Based Access Control**: Granular permission management
- **Multi-Factor Authentication**: Enhanced security for sensitive operations
- **Session Management**: Secure session handling

### 8.2 Data Protection
- **Encryption at Rest**: Encrypt sensitive data in storage
- **Encryption in Transit**: Secure data transmission
- **Data Classification**: Classify data by sensitivity level
- **Access Logging**: Comprehensive access audit trails

### 8.3 Compliance & Governance
- **Regulatory Compliance**: Meet industry-specific regulations
- **Audit Trails**: Complete audit trail for all operations
- **Data Retention**: Implement data retention policies
- **Privacy Protection**: Protect user privacy and data

---

## 9. Performance & Scalability

### 9.1 Performance Optimization
- **Caching Strategy**: Implement multi-level caching
- **Database Optimization**: Optimize database queries and indexing
- **CDN Integration**: Use CDN for static content delivery
- **Load Balancing**: Distribute load across multiple servers

### 9.2 Scalability Patterns
- **Horizontal Scaling**: Scale by adding more servers
- **Vertical Scaling**: Scale by increasing server resources
- **Microservices Architecture**: Decompose into microservices
- **Container Orchestration**: Use Kubernetes for container management

### 9.3 Monitoring & Observability
- **Application Monitoring**: Monitor application performance
- **Infrastructure Monitoring**: Monitor infrastructure health
- **Log Aggregation**: Centralized log management
- **Alerting**: Proactive alerting for issues

---

## 10. Deployment Architecture

### 10.1 Cloud Infrastructure
- **Azure Cloud Services**: Leverage Azure cloud capabilities
- **Container Deployment**: Deploy using Docker containers
- **Kubernetes Orchestration**: Use Kubernetes for container orchestration
- **Auto-scaling**: Implement automatic scaling based on demand

### 10.2 CI/CD Pipeline
- **Automated Testing**: Comprehensive automated testing
- **Continuous Integration**: Automated build and test process
- **Continuous Deployment**: Automated deployment to production
- **Environment Management**: Manage multiple deployment environments

### 10.3 Disaster Recovery
- **Backup Strategy**: Regular automated backups
- **Recovery Procedures**: Documented recovery procedures
- **High Availability**: Implement high availability patterns
- **Business Continuity**: Ensure business continuity during outages

---

## 11. Technology Stack

### 11.1 Frontend Stack
- **Next.js 15+**: React framework with SSR and API routes
- **React 18+**: Component-based UI development
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Component library for enterprise UI
- **React Flow**: Interactive diagrams and flows
- **DNDKit**: Drag and drop functionality
- **Tremor**: Dashboard components

### 11.2 Backend Stack
- **Node.js**: JavaScript runtime
- **Prisma**: Type-safe database ORM
- **PostgreSQL**: Primary database
- **Redis**: Caching and session storage
- **JWT**: Authentication tokens

### 11.3 Development Tools
- **Docker**: Containerization
- **Kubernetes**: Container orchestration
- **Azure**: Cloud platform
- **GitHub**: Version control and CI/CD

---

## 12. Future Enhancements

### 12.1 AI/ML Integration
- **Predictive Analytics**: Predict operational issues and opportunities
- **Automated Optimization**: Automatically optimize processes and controls
- **Intelligent Recommendations**: Provide intelligent recommendations
- **Natural Language Processing**: Enable natural language interactions

### 12.2 Advanced Analytics
- **Real-time Analytics**: Real-time operational analytics
- **Advanced Reporting**: Advanced reporting and visualization
- **Data Mining**: Discover patterns and insights in data
- **Business Intelligence**: Comprehensive business intelligence capabilities

### 12.3 External Integrations
- **ERP Integration**: Integrate with enterprise resource planning systems
- **MES Integration**: Integrate with manufacturing execution systems
- **IoT Integration**: Integrate with Internet of Things devices
- **Third-party APIs**: Integrate with third-party services and APIs 