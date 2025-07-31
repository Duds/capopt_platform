# CapOpt Platform API Documentation

> **Related documentation:**
> - API Design: @docs/design/solution-architecture-design.md#api-design
> - Security: @docs/design/solution-architecture-design.md#security
> - User Roles: @docs/role-permissions.md
> - Architecture: @docs/design/reference-architecture.md
> - Technical Implementation: @docs/technical-implementation-details.md
> - Feature Requirements: @docs/design/product-backlog.md
> - Implementation Status: @docs/implementation-status.md

## Overview

The CapOpt Platform API provides comprehensive RESTful endpoints for managing operational capability optimisation across strategic, operational, and control & risk layers. All endpoints follow REST conventions and return JSON responses.

## Base URL

```
http://localhost:3000/api
```

## Authentication

The API uses JWT (JSON Web Token) authentication with HTTP-only cookies for security. All protected endpoints require a valid JWT token stored in the `capopt_jwt` cookie.

### Authentication Flow
1. **Login**: POST `/api/auth/login` - Returns JWT in HTTP-only cookie
2. **Logout**: POST `/api/auth/logout` - Clears JWT cookie
3. **Profile**: GET `/api/auth/profile` - Returns current user information

### User Roles
The platform supports the following user roles with different permission levels:

- **SUPERADMIN**: Super Administrator (highest access)
- **ADMIN**: Administrator (system administration)
- **SECURITY_OFFICER**: Security Officer (security oversight)
- **MANAGER**: Operations Manager (operational oversight)
- **DATA_STEWARD**: Data Steward (data governance)
- **PROCESS_OWNER**: Process Owner (process management)
- **CONTROL_OWNER**: Control Owner (control management)
- **DOCUMENTATION_SPECIALIST**: Documentation Specialist (documentation)
- **MAINTENANCE**: Maintenance Technician (asset maintenance)
- **AUDITOR**: Internal Auditor (audit and compliance)
- **EXTERNAL_AUDITOR**: External Auditor (external verification)
- **USER**: Standard User (general access)
- **VIEWER**: Read-Only User (limited access)

### Role-Based Access Control
Different endpoints require different user roles:
- User management: ADMIN, SUPERADMIN
- System configuration: ADMIN, SUPERADMIN
- Data management: Varies by role
- Process management: PROCESS_OWNER, MANAGER, ADMIN, SUPERADMIN
- Control management: CONTROL_OWNER, MANAGER, ADMIN, SUPERADMIN
- Asset management: MAINTENANCE, MANAGER, ADMIN, SUPERADMIN

## Common Response Format

### Success Response
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  // ... other fields
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

## Core Entities

### 1. Critical Controls

#### GET /api/controls
Retrieve all critical controls with optional filtering and includes.

**Query Parameters:**
- `riskCategoryId` (string): Filter by risk category
- `controlTypeId` (string): Filter by control type
- `priority` (string): Filter by priority (LOW, MEDIUM, HIGH, CRITICAL)
- `complianceStatus` (string): Filter by compliance status
- `include` (string): Comma-separated list of related entities to include

**Example:**
```bash
GET /api/controls?priority=CRITICAL&include=processes,assets,bowtieAnalyses
```

#### POST /api/controls
Create a new critical control.

**Request Body:**
```json
{
  "name": "Lockout/Tagout Procedures",
  "description": "Procedures to ensure equipment is properly isolated",
  "riskCategoryId": "category-id",
  "controlTypeId": "type-id",
  "effectivenessId": "effectiveness-id",
  "complianceStatus": "COMPLIANT",
  "priority": "CRITICAL"
}
```

#### GET /api/controls/[id]
Retrieve a specific critical control by ID.

#### PUT /api/controls/[id]
Update a specific critical control.

#### DELETE /api/controls/[id]
Delete a specific critical control and its relationships.

### 2. Processes

#### GET /api/processes
Retrieve all processes with optional filtering and includes.

**Query Parameters:**
- `status` (string): Filter by status (DRAFT, ACTIVE, DEPRECATED, ARCHIVED)
- `priority` (string): Filter by priority
- `createdById` (string): Filter by creator
- `include` (string): Comma-separated list of related entities

**Example:**
```bash
GET /api/processes?status=ACTIVE&include=steps,controls,metrics,risks
```

#### POST /api/processes
Create a new process with optional nested relationships.

**Request Body:**
```json
{
  "name": "Ore Processing",
  "description": "Main ore processing workflow",
  "version": "1.0",
  "status": "ACTIVE",
  "priority": "HIGH",
  "steps": [
    {
      "name": "Crushing",
      "description": "Crush ore to specified size",
      "orderIndex": 1,
      "duration": 30,
      "responsible": "Plant Operator"
    }
  ],
  "metrics": [
    {
      "name": "Throughput",
      "value": 1000,
      "unit": "tonnes/hour",
      "target": 1200,
      "frequency": "hourly"
    }
  ]
}
```

#### GET /api/processes/[id]
Retrieve a specific process by ID.

#### PUT /api/processes/[id]
Update a specific process.

#### DELETE /api/processes/[id]
Delete a specific process and all related entities.

### 3. Assets

#### GET /api/assets
Retrieve all assets with optional filtering and includes.

**Query Parameters:**
- `type` (string): Filter by asset type
- `status` (string): Filter by status
- `criticality` (string): Filter by criticality level
- `createdById` (string): Filter by creator
- `include` (string): Comma-separated list of related entities

**Example:**
```bash
GET /api/assets?type=EQUIPMENT&criticality=CRITICAL&include=risks,controls
```

#### POST /api/assets
Create a new asset with optional nested relationships.

**Request Body:**
```json
{
  "name": "Main Processing Plant",
  "description": "Primary ore processing facility",
  "type": "FACILITY",
  "location": "Site A",
  "status": "OPERATIONAL",
  "criticality": "CRITICAL",
  "risks": [
    {
      "name": "Equipment Failure",
      "description": "Risk of critical equipment failure",
      "severity": "HIGH",
      "likelihood": "MEDIUM",
      "mitigation": "Preventive maintenance program"
    }
  ]
}
```

#### GET /api/assets/[id]
Retrieve a specific asset by ID.

#### PUT /api/assets/[id]
Update a specific asset.

#### DELETE /api/assets/[id]
Delete a specific asset and all related entities.

### 4. Business Canvas

#### GET /api/business-canvas
Retrieve all business canvases with optional filtering and includes.

**Query Parameters:**
- `isActive` (boolean): Filter by active status
- `include` (string): Comma-separated list of related entities

**Example:**
```bash
GET /api/business-canvas?isActive=true&include=valuePropositions,customerSegments
```

#### POST /api/business-canvas
Create a new business canvas with optional nested relationships.

**Request Body:**
```json
{
  "name": "Mining Operations Canvas",
  "description": "Business model for mining operations",
  "version": "1.0",
  "isActive": true,
  "valuePropositions": [
    {
      "description": "Safe and efficient mineral extraction",
      "priority": "HIGH"
    }
  ],
  "customerSegments": [
    {
      "name": "Industrial Customers",
      "description": "Manufacturing and processing companies",
      "size": 1000,
      "priority": "HIGH"
    }
  ]
}
```

### 5. Playbooks

#### GET /api/playbooks
Retrieve all playbooks with optional filtering and includes.

**Query Parameters:**
- `status` (string): Filter by status
- `include` (string): Comma-separated list of related entities

**Example:**
```bash
GET /api/playbooks?status=ACTIVE&include=procedures,trainingMaterials
```

#### POST /api/playbooks
Create a new playbook with optional nested relationships.

**Request Body:**
```json
{
  "name": "Critical Control Procedures",
  "description": "Standard procedures for critical controls",
  "version": "1.0",
  "status": "ACTIVE",
  "procedures": [
    {
      "name": "Lockout/Tagout Procedure",
      "description": "Step-by-step lockout/tagout process",
      "steps": "1. Identify energy sources\n2. Shut down equipment\n3. Apply locks and tags"
    }
  ],
  "trainingMaterials": [
    {
      "title": "Safety Training Manual",
      "type": "PDF",
      "content": "Comprehensive safety training guide",
      "url": "/training/safety-manual.pdf"
    }
  ]
}
```

### 6. Maturity Assessments

#### GET /api/maturity-assessments
Retrieve all maturity assessments with optional filtering and includes.

**Query Parameters:**
- `framework` (string): Filter by assessment framework
- `createdById` (string): Filter by creator
- `include` (string): Comma-separated list of related entities

**Example:**
```bash
GET /api/maturity-assessments?framework=CMMI&include=capabilityScores,improvementRoadmaps
```

#### POST /api/maturity-assessments
Create a new maturity assessment with optional nested relationships.

**Request Body:**
```json
{
  "name": "Process Maturity Assessment",
  "description": "Assessment of operational process maturity",
  "framework": "CMMI",
  "capabilityScores": [
    {
      "capability": "Process Management",
      "score": 3,
      "maxScore": 5,
      "description": "Defined and managed processes"
    }
  ],
  "improvementRoadmaps": [
    {
      "name": "Automation Initiative",
      "description": "Implement process automation",
      "priority": "HIGH",
      "targetDate": "2024-12-31",
      "status": "PLANNED"
    }
  ]
}
```

## Error Handling

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

### Common Error Scenarios

1. **Validation Errors (400)**
   ```json
   {
     "error": "Validation failed",
     "details": [
       {
         "field": "name",
         "message": "Name is required"
       }
     ]
   }
   ```

2. **Not Found (404)**
   ```json
   {
     "error": "Control not found"
   }
   ```

3. **Server Error (500)**
   ```json
   {
     "error": "Failed to fetch controls",
     "details": "Database connection error"
   }
   ```

## Query Parameters

### Include Parameter

The `include` parameter allows you to specify which related entities to include in the response. Use comma-separated values:

- `include=processes,assets` - Include both processes and assets
- `include=controls` - Include only controls
- No include parameter - Return only the main entity

### Filtering

Most endpoints support filtering by various fields:

- `priority` - Filter by priority level
- `status` - Filter by status
- `type` - Filter by type (for assets)
- `criticality` - Filter by criticality level
- `createdById` - Filter by creator

### Sorting

Results are automatically sorted by:
- Priority (descending)
- Name (ascending)
- Creation date (descending for assessments)

## Best Practices

1. **Use Includes Sparingly**: Only include related entities when needed to reduce response size
2. **Filter Results**: Use query parameters to filter large datasets
3. **Handle Errors**: Always check for error responses and handle them appropriately
4. **Validate Input**: Ensure all required fields are provided and valid
5. **Use Pagination**: For large datasets, consider implementing pagination

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## Security Considerations

1. **Input Validation**: All inputs are validated using Zod schemas
2. **SQL Injection Protection**: Using Prisma ORM prevents SQL injection
3. **Authentication**: Implement proper authentication for production
4. **Authorization**: Add role-based access control for sensitive operations

## Future Enhancements

1. **Pagination**: Add pagination support for large datasets
2. **Search**: Implement full-text search capabilities
3. **Bulk Operations**: Add bulk create/update/delete operations
4. **Real-time Updates**: Implement WebSocket support for real-time updates
5. **Audit Logging**: Add comprehensive audit logging
6. **API Versioning**: Implement API versioning for backward compatibility 

## Related Documentation

- **API Design Patterns:** @docs/design/solution-architecture-design.md#api-design
- **Security Standards:** @docs/design/solution-architecture-design.md#security
- **User Roles:** @docs/role-permissions.md
- **Reference Architecture:** @docs/design/reference-architecture.md
- **Technical Implementation:** @docs/technical-implementation-details.md
- **Feature Requirements:** @docs/design/product-backlog.md
- **Implementation Status:** @docs/implementation-status.md 