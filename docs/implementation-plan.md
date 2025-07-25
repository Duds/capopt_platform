# CapOpt Platform Implementation Plan

## Executive Summary

The CapOpt Platform is a comprehensive operational capability optimisation system designed for high-risk industries (mining, minerals, petrochemicals, defence). This implementation plan follows the **Phase 1: Functional PoC** priorities from the product backlog, with a 4-6 week timeline to demonstrate core functionality.

## Current State Analysis

### ✅ What's Already Scaffolded
- **Frontend Framework**: Next.js 15+ with React 19, TypeScript, Tailwind CSS
- **UI Components**: Complete shadcn/ui component library with 40+ components
- **Basic Structure**: Main dashboard with navigation and placeholder content
- **Design System**: Consistent styling with Tailwind CSS and rainbow shadow buttons
- **Project Structure**: Well-organized component hierarchy and documentation

### 🔍 Phase 1 Backlog Priorities
1. **Critical Control Management (Core)** - 3 User Stories
2. **Process Management and Documentation (Core)** - 3 User Stories  
3. **Basic Analytics and Reporting (Core)** - 3 User Stories

## Implementation Roadmap

### Phase 1: Functional PoC (4-6 weeks)

#### Week 1-2: Database & Backend Foundation

**Goal**: Establish solid backend foundation with database schema and core APIs

**Tasks**:
1. **Database Setup**
   - Install and configure PostgreSQL
   - Set up Prisma ORM with initial schema
   - Implement core entity models (Process, CriticalControl, Asset, etc.)
   - Create database migrations

2. **Backend API Development**
   - Set up Node.js/Express.js backend with TypeScript
   - Implement RESTful API endpoints for core entities
   - Add input validation with Zod schemas
   - Implement error handling and logging
   - Set up JWT authentication (basic)

3. **Database Schema Implementation**
   ```sql
   -- Core entities for Phase 1
   - Process (id, name, description, steps, metrics, risks, controls)
   - CriticalControl (id, name, description, riskCategory, controlType, effectiveness)
   - Asset (id, name, risks, protections, monitors)
   - RiskCategory (id, name, description)
   - ControlType (id, name, description)
   - ControlEffectiveness (id, rating, description)
   ```

**Deliverables**:
- Working PostgreSQL database with core schema
- RESTful API with CRUD operations for all core entities
- Basic authentication system
- API documentation

#### Week 3-4: Core Feature Implementation

**Goal**: Implement the three core features from Phase 1 backlog

**Task 1: Critical Control Management (Core)**
- **User Story 1**: Risk Manager conducts basic bowtie analysis
- **User Story 2**: Operations Manager sees controls protecting processes
- **User Story 3**: Risk Manager documents control effectiveness criteria

**Implementation**:
- Create Critical Control creation/editing interface
- Implement bowtie analysis visualization component
- Build control-to-process mapping functionality
- Add control effectiveness assessment forms
- Create control status dashboard

**Task 2: Process Management and Documentation (Core)**
- **User Story 1**: Process Engineer creates basic visual process maps
- **User Story 2**: Operations Manager tracks process documentation changes
- **User Story 3**: Process Engineer links processes to controls

**Implementation**:
- Build visual process mapping interface
- Implement process documentation system with version control
- Create process-to-control linking functionality
- Add process efficiency metrics tracking
- Build process overview dashboard

**Task 3: Basic Analytics and Reporting (Core)**
- **User Story 1**: Operations Manager views basic operational dashboards
- **User Story 2**: Risk Manager generates basic risk reports
- **User Story 3**: Operations Manager exports reports to PDF

**Implementation**:
- Create analytics dashboard with KPI cards
- Implement basic reporting engine
- Add data visualization components (charts, graphs)
- Build PDF export functionality
- Create automated report generation

**Deliverables**:
- Functional Critical Control Management module
- Working Process Management and Documentation system
- Basic Analytics and Reporting capabilities
- Integrated dashboard showing all three modules

#### Week 5-6: Integration & Testing

**Goal**: Integrate all components and ensure they work together seamlessly

**Tasks**:
1. **Cross-Module Integration**
   - Link processes to controls in the UI
   - Connect analytics to process and control data
   - Implement unified dashboard with all metrics
   - Create navigation between modules

2. **Data Flow Implementation**
   - Ensure data consistency across modules
   - Implement real-time updates
   - Add data validation and error handling
   - Create data import/export functionality

3. **Testing & Quality Assurance**
   - Unit tests for all core functionality
   - Integration tests for module interactions
   - User acceptance testing with sample data
   - Performance testing and optimization

4. **Documentation & Deployment Prep**
   - Update technical documentation
   - Create user guides for core features
   - Prepare deployment scripts
   - Set up monitoring and logging

**Deliverables**:
- Fully integrated platform with all Phase 1 features
- Comprehensive test suite
- Complete documentation
- Deployment-ready application

## Technical Implementation Details

### Database Schema (Phase 1)

```sql
-- Core Process Management
CREATE TABLE processes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE process_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    process_id UUID REFERENCES processes(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Critical Control Management
CREATE TABLE critical_controls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    risk_category_id UUID REFERENCES risk_categories(id),
    control_type_id UUID REFERENCES control_types(id),
    effectiveness_id UUID REFERENCES control_effectiveness(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE risk_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE control_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE control_effectiveness (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rating VARCHAR(50) NOT NULL,
    description TEXT
);

-- Asset Management
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Cross-Entity Relationships
CREATE TABLE process_controls (
    process_id UUID REFERENCES processes(id),
    control_id UUID REFERENCES critical_controls(id),
    PRIMARY KEY (process_id, control_id)
);

CREATE TABLE asset_controls (
    asset_id UUID REFERENCES assets(id),
    control_id UUID REFERENCES critical_controls(id),
    PRIMARY KEY (asset_id, control_id)
);
```

### API Endpoints (Phase 1)

```typescript
// Process Management
GET    /api/processes              // List all processes
POST   /api/processes              // Create new process
GET    /api/processes/:id          // Get process details
PUT    /api/processes/:id          // Update process
DELETE /api/processes/:id          // Delete process
GET    /api/processes/:id/steps    // Get process steps
POST   /api/processes/:id/steps    // Add process step

// Critical Control Management
GET    /api/controls               // List all controls
POST   /api/controls               // Create new control
GET    /api/controls/:id           // Get control details
PUT    /api/controls/:id           // Update control
DELETE /api/controls/:id           // Delete control
GET    /api/controls/:id/analysis  // Get bowtie analysis

// Asset Management
GET    /api/assets                 // List all assets
POST   /api/assets                 // Create new asset
GET    /api/assets/:id             // Get asset details
PUT    /api/assets/:id             // Update asset
DELETE /api/assets/:id             // Delete asset

// Analytics & Reporting
GET    /api/analytics/dashboard    // Get dashboard metrics
GET    /api/analytics/reports      // Generate reports
POST   /api/analytics/export       // Export to PDF
```

### Frontend Component Structure

```
components/
├── controls/
│   ├── control-card.tsx          // Individual control display
│   ├── control-form.tsx          // Control creation/editing
│   ├── bowtie-analysis.tsx       // Bowtie analysis visualization
│   └── control-dashboard.tsx     // Control overview dashboard
├── processes/
│   ├── process-map.tsx           // Visual process mapping
│   ├── process-form.tsx          // Process creation/editing
│   ├── process-steps.tsx         // Process step management
│   └── process-dashboard.tsx     // Process overview dashboard
├── analytics/
│   ├── dashboard.tsx             // Main analytics dashboard
│   ├── kpi-cards.tsx             // KPI metric cards
│   ├── charts.tsx                // Data visualization components
│   └── reports.tsx               // Report generation interface
└── shared/
    ├── navigation.tsx            // Main navigation component
    ├── layout.tsx                // Page layout wrapper
    └── utils.ts                  // Shared utilities
```

## Success Criteria for Phase 1

### Functional Requirements
- ✅ Database properly plumbed with core entities
- ✅ All CRUD operations working for processes, controls, and assets
- ✅ Basic bowtie analysis functionality implemented
- ✅ Visual process mapping capability
- ✅ Basic analytics dashboard with KPI tracking
- ✅ Cross-entity relationships working (processes linked to controls)
- ✅ Basic authentication and user management

### Technical Requirements
- ✅ All components properly typed with TypeScript
- ✅ Responsive design working on desktop and mobile
- ✅ Rainbow shadow buttons implemented as per user preferences
- ✅ Standard Tailwind CSS classes used throughout
- ✅ Comprehensive error handling and validation
- ✅ API documentation complete
- ✅ Test coverage for core functionality

### User Experience Requirements
- ✅ Intuitive navigation between modules
- ✅ Clear data visualization and reporting
- ✅ Consistent design language across all components
- ✅ Accessibility compliance (WCAG 2.1)
- ✅ Mobile-responsive interface
- ✅ Fast loading times and smooth interactions

## Risk Mitigation

### Technical Risks
- **Database Performance**: Implement proper indexing and query optimization
- **API Scalability**: Use connection pooling and caching strategies
- **Frontend Performance**: Implement code splitting and lazy loading
- **Data Integrity**: Add comprehensive validation and error handling

### Timeline Risks
- **Scope Creep**: Strictly adhere to Phase 1 backlog items only
- **Technical Debt**: Maintain code quality standards throughout
- **Integration Issues**: Regular integration testing and validation
- **User Acceptance**: Regular demos and feedback sessions

## Next Steps After Phase 1

### Phase 2 Preparation
- Begin planning for RBAC implementation
- Design Azure deployment architecture
- Plan for enhanced UI/UX improvements
- Prepare for customer-facing features

### Phase 2 Features (8-12 weeks)
- Role-Based Access Control (RBAC)
- Enhanced Critical Control Management
- Advanced Process Management
- Comprehensive Analytics
- Business Model Canvas Management
- Azure deployment and CI/CD pipeline

## Conclusion

This implementation plan provides a clear roadmap for delivering the CapOpt Platform Phase 1 Functional PoC within the 4-6 week timeline. The plan focuses on the three core features identified in the product backlog while establishing a solid foundation for future phases.

The approach prioritizes:
1. **Solid backend foundation** with proper database design
2. **Core functionality implementation** following the exact user stories
3. **Integration and testing** to ensure everything works together
4. **Quality and maintainability** for future development

By following this plan, we'll deliver a functional proof of concept that demonstrates the platform's core value proposition while setting up for successful Phase 2 development. 