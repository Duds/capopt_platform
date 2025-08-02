# Operating Model Canvas Refactor - Campbell, Lancelott, Gutierrez Framework

## Overview

The Operating Model Canvas has been completely refactored to follow the framework developed by Andrew Campbell, Mark Lancelott, and Mikel Gutierrez. This framework provides a comprehensive approach to operational strategy design with six key components that work together to create a complete operating model.

## Framework Components

### 1. Suppliers
**Purpose**: External partners and vendors that support operations

**Key Elements**:
- **Supplier Types**: Material suppliers, service providers, technology partners, logistics providers, consultants, equipment suppliers, financial partners, regulatory partners
- **Criticality Levels**: Critical, High, Medium, Low
- **Performance Metrics**: Excellent, Good, Average, Poor, Unacceptable
- **Contract Management**: Long-term, medium-term, short-term, project-based, on-demand, framework
- **Risk Assessment**: Low, Medium, High, Critical
- **Compliance Status**: Compliant, Non-compliant, Partially compliant, Under review, Not applicable

**BMC Integration**: Links to Partnerships to avoid data duplication

### 2. Locations
**Purpose**: Physical and virtual locations where operations occur

**Key Elements**:
- **Location Types**: Headquarters, production facilities, warehouses, distribution centers, offices, laboratories, workshops, field offices, remote sites
- **Status Management**: Active, Inactive, Planned, Under construction, Decommissioned
- **Criticality Assessment**: Critical, High, Medium, Low
- **Capacity Planning**: Utilization tracking, employee counts, operational hours
- **Geographic Information**: Addresses, coordinates, timezones

**BMC Integration**: Links to Resources and Activities to avoid data duplication

### 3. Value Chains
**Purpose**: Core business processes that create value

**Key Elements**:
- **Value Chain Types**: Primary, Support, Enabling, Customer-facing, Internal
- **Complexity Assessment**: Simple, Moderate, Complex, Very complex
- **Status Tracking**: Active, Inactive, Planned, Under development, Optimizing
- **Activities**: Primary, Support, Enabling, Decision, Control activities
- **Inputs/Outputs**: Material, Information, Capital, Human, Energy, Technology
- **Metrics**: Efficiency, Effectiveness, Quality, Cost, Time, Satisfaction

**BMC Integration**: Links to Activities and Resources to avoid data duplication

### 4. Organisation
**Purpose**: Structure and people that execute operations

**Key Elements**:
- **Organisation Types**: Functional, Divisional, Matrix, Network, Team-based, Project-based
- **Levels**: Executive, Senior management, Middle management, Supervisory, Operational
- **Status Management**: Active, Inactive, Planned, Restructuring
- **Performance Tracking**: Employee counts, budgets, cost centers, maturity levels
- **Hierarchical Structure**: Parent-child relationships for organizational hierarchy

**BMC Integration**: Links to Resources and Activities to avoid data duplication

### 5. Information
**Purpose**: Data and knowledge management systems

**Key Elements**:
- **Information Types**: Operational, Strategic, Tactical, Financial, Technical, Regulatory, Customer, Supplier
- **Accessibility Levels**: Public, Internal, Restricted, Confidential, Classified
- **Security Levels**: Basic, Standard, Enhanced, High, Maximum
- **Frequency**: Real-time, Hourly, Daily, Weekly, Monthly, Quarterly, On-demand
- **Quality Metrics**: Data quality percentages, retention policies, ownership

**BMC Integration**: Links to Resources and Activities to avoid data duplication

### 6. Management Systems
**Purpose**: Technology and tools that enable operations

**Key Elements**:
- **System Types**: ERP, CRM, SCM, HRM, Finance, Quality, Safety, Environmental, Asset, Project, Analytics, Collaboration
- **Status Management**: Active, Inactive, Planned, Under implementation, Upgrading, Decommissioning
- **Implementation Status**: Not started, Planning, In progress, Testing, Live, Optimizing
- **Performance Metrics**: ROI, user counts, performance percentages, reliability
- **Integration Management**: Connected systems, features, risk assessments

**BMC Integration**: Links to Resources and Activities to avoid data duplication

## Database Schema Changes

### New Models Created

1. **OperatingModelSupplier** - External partner management
2. **OperatingModelLocation** - Location and facility management
3. **OperatingModelValueChain** - Enhanced value chain management
4. **OperatingModelOrganisation** - Organizational structure management
5. **OperatingModelInformation** - Information and data management
6. **OperatingModelManagementSystem** - Technology system management

### Enhanced Relationships

- **BMC Integration**: All components link to Business Model Canvas entities to avoid data duplication
- **Tree Structure**: Hierarchical navigation for detailed expansion
- **Cross-Component Links**: Relationships between different operating model components

## User Interface Features

### Canvas View
- **6-Section Layout**: Visual representation of all framework components
- **Color-Coded Sections**: Each component has distinct visual identity
- **Progress Tracking**: Completeness indicators for each section
- **Real-time Updates**: Live editing and collaboration capabilities

### Tree View
- **Hierarchical Navigation**: Expandable tree structure for detailed exploration
- **Component Relationships**: Visual representation of connections between components
- **Quick Access**: Fast navigation to specific items and sections
- **Context Preservation**: Maintains user context during navigation

### List View
- **Tabular Display**: Structured view of all components
- **Filtering and Sorting**: Advanced data management capabilities
- **Bulk Operations**: Efficient management of multiple items
- **Export Capabilities**: Data export in multiple formats

## Integration with Business Model Canvas

### Data Avoidance Strategy
- **Partnership Links**: Suppliers link to BMC Partnerships
- **Resource Links**: Locations, Value Chains, Organisation, Information, and Management Systems link to BMC Resources
- **Activity Links**: Value Chains, Organisation, Information, and Management Systems link to BMC Activities

### Benefits
- **No Duplication**: Single source of truth for shared data
- **Consistency**: Changes in BMC automatically reflect in OMC
- **Efficiency**: Reduced data entry and maintenance overhead
- **Alignment**: Strategic and operational layers remain synchronized

## Implementation Status

### ✅ Completed
- Database schema refactoring
- Type definitions and interfaces
- Utility functions and helpers
- Basic component structure
- API endpoints for CRUD operations

### 🚧 In Progress
- Advanced tree navigation features
- Detailed item views
- BMC integration workflows
- Export and sharing capabilities

### ⏳ Planned
- Advanced filtering and search
- Collaboration features
- Template system
- Analytics and reporting
- Mobile responsiveness

## Migration Strategy

### Legacy Data Handling
- **Backward Compatibility**: Legacy components preserved for existing data
- **Gradual Migration**: Tools for migrating from old to new structure
- **Data Preservation**: No data loss during transition
- **Rollback Capability**: Ability to revert if needed

### New Data Structure
- **Enhanced Capabilities**: More detailed and structured data capture
- **Better Relationships**: Improved cross-component connections
- **Scalability**: Support for complex organizational structures
- **Flexibility**: Adaptable to different industry requirements

## Benefits of the New Framework

### Strategic Alignment
- **Clear Structure**: Six well-defined components for comprehensive coverage
- **Strategic Integration**: Direct links to business model canvas
- **Operational Clarity**: Clear separation of concerns and responsibilities

### Operational Excellence
- **Process Optimization**: Detailed value chain management
- **Resource Efficiency**: Better location and supplier management
- **Technology Alignment**: Comprehensive management system oversight

### Risk Management
- **Supplier Risk**: Comprehensive supplier assessment and monitoring
- **Operational Risk**: Location and process risk evaluation
- **Technology Risk**: System performance and security monitoring

### Compliance and Governance
- **Regulatory Compliance**: Built-in compliance tracking
- **Information Governance**: Structured data management
- **Organizational Governance**: Clear accountability and responsibility

## Next Steps

1. **Complete UI Implementation**: Finish advanced features and polish user experience
2. **BMC Integration Testing**: Verify seamless integration with business model canvas
3. **User Training**: Develop training materials for the new framework
4. **Performance Optimization**: Optimize for large-scale deployments
5. **Advanced Analytics**: Implement reporting and analytics capabilities

## Conclusion

The refactored Operating Model Canvas provides a comprehensive, structured approach to operational strategy design that aligns with proven frameworks while maintaining integration with the existing business model canvas. This creates a unified platform for strategic and operational planning that supports the complex needs of high-risk industries. 