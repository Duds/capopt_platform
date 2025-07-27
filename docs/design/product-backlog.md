# CapOpt Platform - Product Backlog

## Backlog Overview
This backlog reflects the current state of the CapOpt Platform with the completed application framework and Business Model Canvas implementation. The platform is now positioned as "CapOps" - a comprehensive operational capability optimisation system with Critical Control Theory (CCT) at its core.

## Sprint 1: Application Framework ✅ **COMPLETED**

### ✅ Application Framework
- **Next.js 15+**: React framework with SSR and API routes
- **React 18+**: Component-based UI development
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Component library for enterprise UI
- **Authentication System**: JWT-based authentication with HTTP-only cookies
- **Role-Based Access Control**: 13 custom user roles with granular permissions
- **Database Schema**: Complete Prisma schema with enterprise, facility, business unit, and department entities
- **Seed Data**: Comprehensive test data for Cracked Mountain Pty Ltd and Hercules Levee facility
- **Multi-Facility Support**: Full organizational hierarchy with 12 business units and 20+ departments

### ✅ Business Model Canvas
- **Interactive Canvas**: 9-section business model canvas with real-time editing
- **Database Integration**: Full CRUD operations with Prisma
- **Data Persistence**: Real-time saving and retrieval
- **Strategic Context**: Integration with enterprise context
- **Value Propositions**: Customer segment mapping
- **Revenue Streams**: Revenue model management
- **Partnerships**: Key partnership tracking
- **Resources**: Core resource management
- **Activities**: Key activity tracking
- **Cost Structures**: Cost model management
- **Channels**: Distribution channel management

## Sprint 2: Core Functionality Implementation ⏳ **PLANNED**

### ⏳ Real Dashboard Implementation
- **Priority**: HIGH
- **Effort**: 2-3 weeks
- **Description**: Replace mock data with real database queries and functional metrics
- **Acceptance Criteria**:
  - Real-time database queries for all metrics
  - Functional KPI calculations from actual data
  - Live enterprise context display
  - Real strategic alignment metrics
  - Functional navigation between sections
  - Database-driven progress indicators

### ⏳ Critical Controls UI Implementation
- **Priority**: HIGH
- **Effort**: 3-4 weeks
- **Description**: Implement actual control management interface with real functionality
- **Acceptance Criteria**:
  - Functional CRUD operations for controls
  - Real control status tracking
  - Control effectiveness monitoring
  - Risk category management
  - Control type classification
  - Control verification workflows
  - Real-time control health indicators

### ⏳ Process Management UI Implementation
- **Priority**: HIGH
- **Effort**: 3-4 weeks
- **Description**: Implement actual process management interface with real functionality
- **Acceptance Criteria**:
  - Functional CRUD operations for processes
  - Real process status tracking
  - Process step management
  - Process filtering and search
  - Process optimization tools
  - Process visualization
  - Real-time process health indicators

### ⏳ Strategic Navigation Implementation
- **Priority**: MEDIUM
- **Effort**: 2-3 weeks
- **Description**: Implement functional navigation between strategic and operational layers
- **Acceptance Criteria**:
  - Functional enterprise context display
  - Real strategic alignment metrics
  - Working navigation breadcrumbs
  - Layer navigation functionality
  - Strategic dashboard with real data
  - Context-aware navigation

## Sprint 3: Advanced Features Implementation ⏳ **PLANNED**

### ⏳ CCT Implementation
- **Priority**: HIGH
- **Effort**: 4-5 weeks
- **Description**: Build UI for Critical Control Theory with verification workflows
- **Acceptance Criteria**:
  - Control verification interface
  - Attestation workflows
  - Control effectiveness tracking
  - Verification status management
  - Control failure escalation
  - Real-time control monitoring
  - Control health dashboards

### ⏳ BowtieLab UI Implementation
- **Priority**: HIGH
- **Effort**: 4-5 weeks
- **Description**: Implement interactive bowtie diagram builder with real functionality
- **Acceptance Criteria**:
  - Interactive bowtie diagram editor
  - Threat-consequence-control mapping
  - Real-time bowtie model updates
  - Bowtie export functionality
  - Regulatory compliance reporting
  - Bowtie status management
  - Visual risk modelling

### ⏳ RiskMap UI Implementation
- **Priority**: MEDIUM
- **Effort**: 3-4 weeks
- **Description**: Implement risk propagation visualization with real functionality
- **Acceptance Criteria**:
  - Risk signal visualization
  - Risk propagation calculations
  - Risk threshold management
  - Risk alert generation
  - Risk insight narratives
  - Real-time risk monitoring
  - Risk heatmaps

### ⏳ Operating Model Canvas
- **Priority**: HIGH
- **Effort**: 4-5 weeks
- **Description**: Implement operating model canvas for operational strategy
- **Acceptance Criteria**:
  - Interactive operating model canvas
  - Value chain visualization
  - Service model mapping
  - Experience model design
  - Capability model assessment
  - Integration with strategic navigation flow
  - Real-time data persistence

## Sprint 4: Strategic Layer Completion ⏳ **PLANNED**

### ⏳ Value Chain Management
- **Priority**: HIGH
- **Effort**: 3-4 weeks
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
- **Effort**: 3-4 weeks
- **Description**: Implement service model as connecting layer
- **Acceptance Criteria**:
  - Service model design and mapping
  - Service catalog management
  - Service performance tracking
  - Integration with process maps
  - Strategic navigation flow integration
  - Database schema and API endpoints

## Sprint 5: Enhanced Operational Layer ⏳ **PLANNED**

### ⏳ Process Maps Enhancement
- **Priority**: HIGH
- **Effort**: 4-5 weeks
- **Description**: Enhance process mapping with visual diagrams and advanced features
- **Acceptance Criteria**:
  - Visual process mapping interface
  - Process flow diagrams
  - Process step management
  - Process optimization tools
  - Integration with strategic navigation
  - Real-time collaboration features
  - Process health monitoring

### ⏳ PlayFlow Implementation
- **Priority**: MEDIUM
- **Effort**: 3-4 weeks
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
- **Effort**: 3-4 weeks
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
- **Effort**: 3-4 weeks
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
- **Effort**: 3-4 weeks
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
1. **Real Dashboard Implementation** - Replace mock data with real functionality
2. **Critical Controls UI Implementation** - Build actual control management
3. **Process Management UI Implementation** - Build actual process management
4. **CCT Implementation** - Critical Control Theory UI
5. **BowtieLab UI Implementation** - Interactive risk modelling
6. **Operating Model Canvas** - Strategic layer completion

### Medium Priority (Should Have)
1. **Strategic Navigation Implementation** - Functional navigation
2. **RiskMap UI Implementation** - Risk propagation visualization
3. **Value Chain Management** - Strategic-operational alignment
4. **Service Model Implementation** - Strategic layer completion
5. **Process Maps Enhancement** - Visual process mapping
6. **PlayFlow Implementation** - Operational excellence

### Low Priority (Could Have)
1. **TraceLine Implementation** - Strategic traceability
2. **AssureBoard Implementation** - Executive reporting
3. **PulseDeck Implementation** - Advanced insights
4. **Search and Filtering** - User experience improvement
5. **Notification System** - User experience enhancement
6. **Theme Management** - User customization

## Epic Structure

### Epic 1: Application Framework ✅ **COMPLETED**
**Epic**: Establish application framework and core infrastructure
**Features**:
- Application Framework
- Business Model Canvas

**User Stories**:
- As a developer, I want a solid application framework so that I can build features efficiently
- As a business analyst, I want to create business model canvases so that I can visualize strategic models
- As a user, I want to authenticate securely so that I can access the platform safely
- As a system administrator, I want to manage enterprise data so that I can configure multi-facility operations

### Epic 2: Core Functionality Implementation ⏳ **PLANNED**
**Epic**: Implement core functionality with real data and functionality
**Features**:
- Real Dashboard Implementation
- Critical Controls UI Implementation
- Process Management UI Implementation
- Strategic Navigation Implementation

**User Stories**:
- As a manager, I want to see real metrics so that I can make informed decisions
- As a risk manager, I want to manage critical controls so that I can ensure operational safety
- As a process manager, I want to manage processes so that I can document operational procedures
- As a user, I want to navigate between layers so that I can access different functionality

### Epic 3: Advanced Features Implementation ⏳ **PLANNED**
**Epic**: Implement advanced features with real functionality
**Features**:
- CCT Implementation
- BowtieLab UI Implementation
- RiskMap UI Implementation
- Operating Model Canvas

**User Stories**:
- As a safety manager, I want to track critical controls so that I can ensure operational safety
- As a risk analyst, I want to create bowtie models so that I can visualize risk scenarios
- As an operator, I want to verify controls so that I can ensure they are working
- As a strategic planner, I want to create operating models so that I can design operational strategy

### Epic 4: Strategic Layer Completion ⏳ **PLANNED**
**Epic**: Complete strategic layer with value chain and service model
**Features**:
- Value Chain Management
- Service Model Implementation

**User Stories**:
- As a business analyst, I want to map value chains so that I can optimize value creation
- As a service manager, I want to design service models so that I can improve service delivery
- As a manager, I want to see strategic-operational alignment so that I can ensure strategic execution

### Epic 5: Enhanced Operational Layer ⏳ **PLANNED**
**Epic**: Enhance operational layer with visual process mapping and playbooks
**Features**:
- Process Maps Enhancement
- PlayFlow Implementation

**User Stories**:
- As a process manager, I want to create visual process maps so that I can document workflows
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

### Phase 1 Completion: ✅ **17% (2/12 features)**
- Application Framework ✅
- Business Model Canvas ✅

### Phase 2 Target: **50% (6/12 features)**
- Real Dashboard Implementation ⏳
- Critical Controls UI Implementation ⏳
- Process Management UI Implementation ⏳
- Strategic Navigation Implementation ⏳

### Phase 3 Target: **100% (12/12 features)**
- CCT Implementation ⏳
- BowtieLab UI Implementation ⏳
- RiskMap UI Implementation ⏳
- Operating Model Canvas ⏳
- Value Chain Management ⏳
- Process Maps Enhancement ⏳
- Service Model Implementation ⏳
- PlayFlow Implementation ⏳
- TraceLine Implementation ⏳
- AssureBoard Implementation ⏳
- PulseDeck Implementation ⏳

## Implementation Status Summary

### ✅ **Completed Features (2/12)**
1. **Application Framework** - Complete Next.js/React/TypeScript setup with authentication and database
2. **Business Model Canvas** - Fully functional interactive business model canvas

### 🔄 **In Progress Features (0/12)**
- All planned features are either completed or not started

### ⏳ **Planned Features (10/12)**
1. **Real Dashboard Implementation** - Replace mock data with real functionality
2. **Critical Controls UI Implementation** - Build actual control management
3. **Process Management UI Implementation** - Build actual process management
4. **Strategic Navigation Implementation** - Functional navigation between layers
5. **CCT Implementation** - Critical Control Theory UI
6. **BowtieLab UI Implementation** - Interactive risk modelling
7. **RiskMap UI Implementation** - Risk propagation visualization
8. **Operating Model Canvas** - Strategic layer completion
9. **Value Chain Management** - Strategic-operational alignment
10. **Process Maps Enhancement** - Visual process mapping
11. **Service Model Implementation** - Strategic layer completion
12. **PlayFlow Implementation** - Operational excellence
13. **TraceLine Implementation** - Strategic traceability
14. **AssureBoard Implementation** - Executive reporting
15. **PulseDeck Implementation** - Advanced insights

The platform has achieved 17% completion with a solid foundation of application framework and Business Model Canvas. The next phase focuses on implementing core functionality with real data and functionality, followed by advanced features and strategic layer completion.

## Current Reality Check

### **What's Actually Working**
- ✅ **Application Framework**: Complete Next.js/React/TypeScript setup
- ✅ **Authentication**: JWT-based auth with role management
- ✅ **Database**: PostgreSQL with Prisma ORM
- ✅ **Business Model Canvas**: Fully functional interactive canvas
- ✅ **Seed Data**: Comprehensive test data loaded

### **What's Wireframe/Mock Data**
- ⏳ **Dashboard**: All metrics are mock data
- ⏳ **Critical Controls**: Interface exists but no real functionality
- ⏳ **Process Management**: Interface exists but no real functionality
- ⏳ **Strategic Navigation**: Visual only, not functional
- ⏳ **Enterprise Context**: Mock data display only

### **What's Database Schema Only**
- ⏳ **CCT Implementation**: Schema exists but no UI
- ⏳ **Bowtie Analysis**: Schema exists but no UI
- ⏳ **Risk Propagation**: Schema exists but no UI

### **What's Not Started**
- ⏳ **Operating Model Canvas**: Not implemented
- ⏳ **Value Chain Management**: Not implemented
- ⏳ **Service Model**: Not implemented
- ⏳ **Playbooks**: Not implemented
- ⏳ **Advanced Features**: Not implemented 