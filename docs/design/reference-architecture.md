# CapOpt Platform Reference Architecture

## Executive Summary
The CapOpt Platform follows a layered architecture approach with the **Enterprise Information System** as the foundational layer, supporting multi-facility organizations with complex operational streams and organizational hierarchies.

---

## Architecture Layers

### 0. Enterprise Information System Layer 🆕
**Purpose**: Multi-facility enterprise management with organizational hierarchy

**Key Components:**
- **Enterprise Management**: Multi-facility enterprise data and relationships
- **Facility Management**: Individual facility operations and metrics
- **Business Unit Management**: Organizational structure and performance
- **Department Management**: Department-level operations and staffing
- **Operational Streams**: Multi-stream operational management (copper, uranium, gold, silver)
- **Address Management**: Multiple address types and locations

**Technology Stack:**
- **Database**: PostgreSQL with Prisma ORM
- **API**: Next.js API Routes with TypeScript
- **Frontend**: React with TypeScript and Tailwind CSS
- **Authentication**: JWT with HTTP-only cookies

**Integration Points:**
- **User Management**: Enterprise and department relationships
- **Process Management**: Enterprise, facility, business unit, department context
- **Asset Management**: Enterprise ownership and facility location
- **Control Management**: Enterprise-wide control frameworks

### 1. Strategic Layer
**Purpose**: Strategic planning and business model management

**Key Components:**
- **Business Model Canvas**: Strategic business model visualization
- **Operating Model Canvas**: Operational strategy and design
- **Value Chain Management**: Value creation and delivery
- **Service Model**: Service design and delivery
- **Experience Model**: User experience design
- **Capability Model**: Organizational capability assessment

**Technology Stack:**
- **Frontend**: React components with interactive canvas
- **State Management**: React Context and hooks
- **Data Persistence**: PostgreSQL via Prisma
- **Real-time Updates**: Optimistic UI updates

### 2. Value & Service Layer
**Purpose**: Value proposition and service delivery management

**Key Components:**
- **Value Proposition**: Customer value definition
- **Customer Segments**: Target market identification
- **Revenue Streams**: Revenue generation models
- **Partnerships**: Strategic partnership management
- **Resources**: Resource allocation and management
- **Activities**: Core business activities
- **Cost Structures**: Cost management and optimization
- **Channels**: Distribution and delivery channels

**Technology Stack:**
- **Frontend**: React with form management
- **Validation**: Zod schema validation
- **API**: RESTful endpoints with TypeScript
- **Database**: PostgreSQL with relationships

### 3. Operational Layer
**Purpose**: Day-to-day operational management and execution

**Key Components:**
- **Process Management**: Process design and execution
- **Process Maps**: Visual process mapping
- **Playbooks**: Operational procedures and guidelines
- **Procedures**: Standard operating procedures
- **Training Materials**: Training and development resources
- **Best Practices**: Knowledge management and sharing
- **Improvements**: Continuous improvement processes

**Technology Stack:**
- **Frontend**: React with process visualization
- **API**: RESTful process management endpoints
- **Database**: PostgreSQL with process relationships
- **File Management**: Document storage and retrieval

### 4. Control & Risk Layer
**Purpose**: Risk management and control assurance

**Key Components:**
- **Critical Controls**: Risk-based control management
- **Risk Categories**: Risk classification and assessment
- **Control Types**: Control categorization and effectiveness
- **Control Effectiveness**: Control performance measurement
- **Bowtie Analysis**: Risk assessment and barrier analysis
- **Threats**: Threat identification and assessment
- **Consequences**: Consequence analysis and management
- **Barriers**: Control barrier implementation

**Technology Stack:**
- **Frontend**: React with risk visualization
- **API**: RESTful control management endpoints
- **Database**: PostgreSQL with risk relationships
- **Analytics**: Risk assessment and scoring

### 5. Asset Management Layer
**Purpose**: Asset lifecycle management and optimization

**Key Components:**
- **Asset Tracking**: Asset identification and tracking
- **Asset Risks**: Asset-specific risk assessment
- **Asset Protection**: Asset protection measures
- **Asset Monitoring**: Real-time asset monitoring
- **Asset Optimization**: Asset performance optimization

**Technology Stack:**
- **Frontend**: React with asset visualization
- **API**: RESTful asset management endpoints
- **Database**: PostgreSQL with asset relationships
- **Monitoring**: Real-time monitoring and alerts

## Enterprise Integration Architecture

### Multi-Facility Support
```
Enterprise (Cracked Mountain Pty Ltd)
├── Facility 1 (Hercules Levee - HL001)
│   ├── Business Unit 1 (Mining Operations)
│   │   ├── Department 1 (Underground Mining)
│   │   ├── Department 2 (Open Pit Mining)
│   │   └── Department 3 (Mining Planning)
│   ├── Business Unit 2 (Processing Operations)
│   │   ├── Department 1 (Crushing & Grinding)
│   │   ├── Department 2 (Flotation)
│   │   └── Department 3 (Solvent Extraction)
│   └── Business Unit 3 (Metallurgy)
│       ├── Department 1 (Smelting)
│       ├── Department 2 (Refining)
│       └── Department 3 (Uranium Processing)
└── Facility 2 (Future Expansion)
    └── Business Units...
```

### Operational Streams Integration
```
Operational Streams
├── Copper Stream
│   ├── Flotation Process
│   ├── Smelting Process
│   └── Refining Process
├── Uranium Stream
│   ├── Leaching Process
│   ├── Solvent Extraction
│   └── Precipitation Process
├── Gold Stream
│   ├── Recovery Process
│   └── Refining Process
└── Silver Stream
    ├── Recovery Process
    └── Refining Process
```

## Technology Architecture

### Frontend Architecture
- **Framework**: Next.js 15+ with React 18+
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for utility-first styling
- **Components**: shadcn/ui component library
- **State Management**: React Context and hooks
- **Routing**: Next.js App Router
- **Authentication**: JWT with HTTP-only cookies

### Backend Architecture
- **Framework**: Next.js API Routes
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: Zod schema validation
- **Error Handling**: Structured error responses

### Database Architecture
- **Primary Database**: PostgreSQL
- **ORM**: Prisma for type-safe database access
- **Migrations**: Prisma migrations for schema changes
- **Seeding**: Modular seed management system
- **Relationships**: Comprehensive foreign key relationships

### Security Architecture
- **Authentication**: JWT-based authentication
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: HTTP-only cookies for JWT storage
- **Input Validation**: Zod schema validation
- **Error Handling**: Secure error messages
- **Audit Logging**: Comprehensive audit trail

## Deployment Architecture

### Development Environment
- **Database**: Local PostgreSQL instance
- **Frontend**: Next.js development server
- **API**: Next.js API routes
- **Seeding**: Modular seed management with test data

### Production Environment
- **Platform**: Azure Cloud Services
- **Database**: Azure PostgreSQL
- **Frontend**: Azure Static Web Apps or Vercel
- **API**: Azure Functions or Vercel Serverless Functions
- **Authentication**: Azure Active Directory integration
- **Monitoring**: Azure Application Insights

## Integration Patterns

### Enterprise Context Integration
- **User Context**: Enterprise and department relationships
- **Process Context**: Enterprise, facility, business unit, department context
- **Asset Context**: Enterprise ownership and facility location
- **Control Context**: Enterprise-wide control frameworks

### Strategic Navigation Integration
- **Operational to Strategic**: Process maps → Service model → Value chain → Operating model → Business canvas
- **Strategic to Operational**: Business canvas → Operating model → Value chain → Service model → Process maps
- **Context Preservation**: Enterprise context maintained throughout navigation
- **Alignment Indicators**: Strategic-operational alignment visibility

### Data Flow Integration
- **Enterprise Data**: Foundation for all other data relationships
- **User Data**: Enterprise and department context
- **Process Data**: Enterprise, facility, business unit, department context
- **Asset Data**: Enterprise ownership and facility location
- **Control Data**: Enterprise-wide control frameworks 