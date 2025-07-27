# CapOpt Platform - Product Backlog

## Backlog Overview
This backlog reflects the current state of the CapOpt Platform with the completed Strategic Navigation Flow implementation and updated priorities. The platform is now positioned as "CapOps" - a comprehensive operational capability optimisation system with Critical Control Theory (CCT) at its core.

## Sprint 1: Enterprise Foundation ✅ **COMPLETED**

### ✅ Enterprise Information System
- **Enterprise Management**: Complete database schema and seed data
- **Multi-Facility Support**: Hercules Levee facility with full structure
- **Operational Streams**: Copper, uranium, gold, silver streams
- **Organizational Hierarchy**: 12 business units, 20+ departments
- **Address Management**: Multiple address types and locations
- **Modular Seed Management**: Comprehensive seed management system

### ✅ Authentication & Authorization System
- JWT-based authentication with HTTP-only cookies
- 13 custom user roles with RBAC
- User management interface
- Secure password hashing and session management

### ✅ Critical Controls Management
- Complete database schema for critical controls
- Control management interface with status tracking
- Risk category mapping and control type classification
- Effectiveness assessment capabilities

### ✅ Business Model Canvas
- Interactive 9-section business model canvas
- Real-time data persistence with database integration
- Full CRUD operations for canvas management

### ✅ Process Management (80% Complete)
- Process creation, editing, and deletion
- Process detail view with comprehensive display
- Process filtering and search functionality
- **Remaining**: Step management backend API

## Sprint 2: Strategic Navigation Foundation ✅ **COMPLETED**

### ✅ Strategic Navigation Flow Implementation
- **Enterprise Context Component**: Multi-facility enterprise context display
- **Strategic Context Component**: Strategic alignment metrics and objectives
- **Strategic Breadcrumbs Component**: Enterprise-aware navigation breadcrumbs
- **Strategic Navigation Flow Component**: Layer navigation with implementation status
- **Strategic Dashboard**: Comprehensive strategic overview page
- **UI Pattern Compliance**: Established pattern of greying out non-implemented features
- **Implementation Status Indicators**: Clear badges for real data vs mock data

### ✅ Enterprise Dashboard Enhancement
- **Strategic Navigation Integration**: Strategic components added to main dashboard
- **Enterprise Context Display**: Enterprise and facility information
- **Strategic Alignment Metrics**: Strategic context panels
- **Navigation Flow Visualization**: Strategic navigation flow components
- **Multi-Facility Support**: Enterprise context throughout application

### ✅ Facility Management Interface
- **Enterprise Context Integration**: Facility information in strategic components
- **Business Unit Display**: Business unit context in navigation
- **Department Structure**: Department information in enterprise context
- **Operational Stream Tracking**: Stream indicators in enterprise context
- **Address Management**: Address information in enterprise context

## Sprint 3: ControlOps Implementation ⏳ **PLANNED**

### ⏳ ControlOps Core Engine
- **Priority**: HIGH
- **Effort**: 3-4 weeks
- **Description**: Implement the core ControlOps module for critical control assurance
- **Acceptance Criteria**:
  - Critical Control Theory implementation
  - Control verification workflow
  - Control effectiveness tracking
  - Control-process-playbook linking
  - Real-time control status monitoring
  - Control failure escalation system
  - Database schema for control entities
  - API endpoints for control management

### ⏳ BowtieLab Implementation
- **Priority**: HIGH
- **Effort**: 2-3 weeks
- **Description**: Implement interactive bowtie risk modelling
- **Acceptance Criteria**:
  - Interactive bowtie diagram editor
  - Threat-consequence-control mapping
  - Bowtie model data persistence
  - Integration with ControlOps
  - Real-time bowtie status updates
  - Bowtie export for regulatory reporting
  - Database schema for bowtie entities
  - API endpoints for bowtie management

### ⏳ RiskMap Engine
- **Priority**: MEDIUM
- **Effort**: 2-3 weeks
- **Description**: Implement trickle-up risk propagation engine
- **Acceptance Criteria**:
  - Risk signal aggregation from frontline
  - Risk propagation calculations
  - Risk threshold management
  - Risk alert generation
  - Risk insight narratives
  - Integration with strategic layers
  - Database schema for risk entities
  - API endpoints for risk management

## Sprint 4: Strategic Layer Completion ⏳ **PLANNED**

### ⏳ Operating Model Canvas
- **Priority**: HIGH
- **Effort**: 3-4 weeks
- **Description**: Implement operating model canvas for operational strategy
- **Acceptance Criteria**:
  - Interactive operating model canvas
  - Value chain visualization
  - Service model mapping
  - Experience model design
  - Capability model assessment
  - Integration with strategic navigation flow
  - Real-time data persistence

### ⏳ Value Chain Management
- **Priority**: HIGH
- **Effort**: 2-3 weeks
- **Description**: Implement value chain management and visualization
- **Acceptance Criteria**:
  - Value chain mapping and visualization
  - Value stream analysis
  - Value chain optimization tools
  - Integration with operational processes
  - Strategic navigation flow integration
  - Database schema and API endpoints

### ⏳ Service Model Implementation
- **Priority**: MEDIUM
- **Effort**: 2-3 weeks
- **Description**: Implement service model as connecting layer
- **Acceptance Criteria**:
  - Service model design and mapping
  - Service catalog management
  - Service performance tracking
  - Integration with process maps
  - Strategic navigation flow integration
  - Database schema and API endpoints

## Sprint 5: Enhanced Operational Layer ⏳ **PLANNED**

### ⏳ Process Maps Implementation
- **Priority**: HIGH
- **Effort**: 3-4 weeks
- **Description**: Implement comprehensive process mapping functionality
- **Acceptance Criteria**:
  - Visual process mapping interface
  - Process flow diagrams
  - Process step management
  - Process optimization tools
  - Integration with strategic navigation
  - Database schema for process maps
  - Real-time collaboration features

### ⏳ Process Step Management Backend
- **Priority**: HIGH
- **Effort**: 1-2 weeks
- **Description**: Complete the process step management backend API
- **Acceptance Criteria**:
  - Step creation, editing, and deletion
  - Step ordering and dependencies
  - Step assignment and responsibility
  - Step duration and resource allocation
  - Database schema for process steps
  - API endpoints for step management

### ⏳ PlayFlow Implementation
- **Priority**: MEDIUM
- **Effort**: 2-3 weeks
- **Description**: Implement playbook orchestration and management
- **Acceptance Criteria**:
  - Playbook creation interface
  - Procedure management
  - Training material integration
  - Best practice sharing
  - Version control and approval workflows
  - Database schema for playbooks
  - Integration with strategic navigation

## Sprint 6: Advanced Features ⏳ **PLANNED**

### ⏳ TraceLine Implementation
- **Priority**: MEDIUM
- **Effort**: 2-3 weeks
- **Description**: Implement strategic traceability engine
- **Acceptance Criteria**:
  - End-to-end traceability mapping
  - Strategic-operational linkage
  - Dependency visualization
  - Impact analysis tools
  - Database schema for traceability
  - API endpoints for traceability

### ⏳ AssureBoard Implementation
- **Priority**: MEDIUM
- **Effort**: 2-3 weeks
- **Description**: Implement executive and regulator reporting
- **Acceptance Criteria**:
  - Executive dashboards
  - Regulatory compliance reports
  - Control health summaries
  - Audit trail generation
  - Export functionality (PDF, CSV)
  - Database schema for reporting
  - API endpoints for reporting

### ⏳ PulseDeck Implementation
- **Priority**: LOW
- **Effort**: 2-3 weeks
- **Description**: Implement operational insight and early warning system
- **Acceptance Criteria**:
  - Real-time operational insights
  - Early warning indicators
  - Heatmap visualizations
  - Performance metrics
  - Database schema for insights
  - API endpoints for insights

## Updated Priority Matrix

### High Priority (Must Have)
1. **ControlOps Core Engine** - Critical Control Theory implementation
2. **BowtieLab Implementation** - Interactive risk modelling
3. **Operating Model Canvas** - Strategic layer completion
4. **Value Chain Management** - Strategic-operational alignment
5. **Process Maps Implementation** - Operational layer enhancement

### Medium Priority (Should Have)
1. **RiskMap Engine** - Risk propagation system
2. **Service Model Implementation** - Strategic layer completion
3. **PlayFlow Implementation** - Operational excellence
4. **TraceLine Implementation** - Strategic traceability
5. **AssureBoard Implementation** - Executive reporting

### Low Priority (Could Have)
1. **PulseDeck Implementation** - Advanced insights
2. **Search and Filtering** - User experience improvement
3. **Notification System** - User experience enhancement
4. **Theme Management** - User customization

## Epic Structure

### Epic 1: Enterprise Foundation ✅ **COMPLETED**
**Epic**: Establish enterprise information system foundation
**Features**:
- Enterprise Information System
- Authentication & Authorization System
- Critical Controls Management
- Business Model Canvas
- Process Management (80%)

**User Stories**:
- As a system administrator, I want to manage enterprise data so that I can configure multi-facility operations
- As a user, I want to authenticate securely so that I can access the platform safely
- As a risk manager, I want to manage critical controls so that I can ensure operational safety
- As a business analyst, I want to create business model canvases so that I can visualize strategic models
- As a process manager, I want to manage processes so that I can document operational procedures

### Epic 2: Strategic Navigation Foundation ✅ **COMPLETED**
**Epic**: Implement strategic navigation flow between operational and strategic layers
**Features**:
- Strategic Navigation Flow Implementation
- Enterprise Dashboard Enhancement
- Facility Management Interface

**User Stories**:
- As a user, I want to see enterprise context so that I understand my organizational position
- As a manager, I want to navigate between strategic and operational views so that I can align activities
- As a strategic planner, I want to see strategic alignment so that I can track strategic objectives
- As a facility manager, I want to manage facility information so that I can oversee operations
- As a user, I want to see implementation status so that I know what features are fully functional

### Epic 3: ControlOps Implementation ⏳ **PLANNED**
**Epic**: Implement Critical Control Theory and operational assurance engine
**Features**:
- ControlOps Core Engine
- BowtieLab Implementation
- RiskMap Engine

**User Stories**:
- As a safety manager, I want to track critical controls so that I can ensure operational safety
- As a risk analyst, I want to create bowtie models so that I can visualize risk scenarios
- As an operator, I want to verify controls so that I can ensure they are working
- As a manager, I want to see risk propagation so that I can understand strategic impacts
- As a regulator, I want to see control effectiveness so that I can verify compliance

### Epic 4: Strategic Layer Completion ⏳ **PLANNED**
**Epic**: Complete strategic layer with operating model and value chain management
**Features**:
- Operating Model Canvas
- Value Chain Management
- Service Model Implementation

**User Stories**:
- As a strategic planner, I want to create operating models so that I can design operational strategy
- As a business analyst, I want to map value chains so that I can optimize value creation
- As a service manager, I want to design service models so that I can improve service delivery
- As a manager, I want to see strategic-operational alignment so that I can ensure strategic execution

### Epic 5: Enhanced Operational Layer ⏳ **PLANNED**
**Epic**: Enhance operational layer with comprehensive process management
**Features**:
- Process Maps Implementation
- Process Step Management Backend
- PlayFlow Implementation

**User Stories**:
- As a process manager, I want to create visual process maps so that I can document workflows
- As a team leader, I want to manage process steps so that I can optimize procedures
- As a trainer, I want to create playbooks so that I can standardize operations
- As a worker, I want to follow documented procedures so that I can perform tasks correctly

### Epic 6: Advanced Features ⏳ **PLANNED**
**Epic**: Implement advanced traceability, reporting, and insight features
**Features**:
- TraceLine Implementation
- AssureBoard Implementation
- PulseDeck Implementation

**User Stories**:
- As a manager, I want to trace strategic impacts so that I can understand dependencies
- As an executive, I want to see assurance reports so that I can verify operational health
- As an operator, I want to see operational insights so that I can make better decisions
- As a regulator, I want to export compliance reports so that I can verify regulatory compliance

## Success Metrics

### Phase 1 Completion: ✅ **50% (6/12 features)**
- Enterprise Information System ✅
- Authentication & Authorization ✅
- Critical Controls Management ✅
- Business Model Canvas ✅
- Strategic Navigation Flow ✅
- Enterprise Dashboard Enhancement ✅

### Phase 2 Target: **75% (9/12 features)**
- ControlOps Core Engine ⏳
- BowtieLab Implementation ⏳
- Operating Model Canvas ⏳

### Phase 3 Target: **100% (12/12 features)**
- RiskMap Engine ⏳
- Value Chain Management ⏳
- Process Maps Implementation ⏳
- Service Model Implementation ⏳
- PlayFlow Implementation ⏳
- TraceLine Implementation ⏳
- AssureBoard Implementation ⏳
- PulseDeck Implementation ⏳

## Implementation Status Summary

### ✅ **Completed Features (6/12)**
1. **Enterprise Information System** - Complete database schema and seed data
2. **Authentication & Authorization System** - JWT-based authentication with RBAC
3. **Critical Controls Management** - Complete control management system
4. **Business Model Canvas** - Interactive strategic business model canvas
5. **Strategic Navigation Flow** - Complete strategic navigation implementation
6. **Enterprise Dashboard Enhancement** - Strategic components integrated

### 🔄 **In Progress Features (0/12)**
- All planned features are either completed or not started

### ⏳ **Planned Features (6/12)**
1. **ControlOps Core Engine** - Critical Control Theory implementation
2. **BowtieLab Implementation** - Interactive risk modelling
3. **RiskMap Engine** - Risk propagation system
4. **Operating Model Canvas** - Strategic layer completion
5. **Value Chain Management** - Strategic-operational alignment
6. **Process Maps Implementation** - Operational layer enhancement
7. **Service Model Implementation** - Strategic layer completion
8. **PlayFlow Implementation** - Operational excellence
9. **TraceLine Implementation** - Strategic traceability
10. **AssureBoard Implementation** - Executive reporting
11. **PulseDeck Implementation** - Advanced insights

The platform has achieved 50% completion with a solid foundation of enterprise information system and strategic navigation flow. The next phase focuses on implementing ControlOps as the core operational assurance engine, followed by completing the strategic layer and enhancing the operational layer. 