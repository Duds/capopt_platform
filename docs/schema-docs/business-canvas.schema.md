# Business Canvas Entity Schema Documentation

## Entity Overview
- **Test ID Prefix:** `test-canvas-`
- **Prisma Model:** `BusinessCanvas`
- **Seed File:** `/prisma/seed/strategic/canvas-templates.ts`
- **Linked ERD:** `/docs/design/solution-architecture-design.md#business-model-canvas`

## Schema Definition

### Core Fields
| Field | Type | Required | Test ID | Description |
|-------|------|----------|---------|-------------|
| `id` | String | ✅ | - | Unique identifier (CUID) |
| `name` | String | ✅ | `test-input-canvas-name` | Canvas name |
| `description` | String | ❌ | `test-input-canvas-description` | Canvas description |
| `version` | String | ❌ | `test-input-canvas-version` | Version number (default: "1.0") |
| `isActive` | Boolean | ❌ | - | Active status (default: true) |
| `status` | CanvasStatus | ❌ | `test-input-canvas-status` | Canvas status |
| `editMode` | EditMode | ❌ | `test-input-canvas-edit-mode` | Editing mode |
| `autoSave` | Boolean | ❌ | - | Auto-save enabled (default: true) |
| `lastSaved` | DateTime | ❌ | - | Last save timestamp |
| `createdAt` | DateTime | ❌ | - | Creation timestamp |
| `updatedAt` | DateTime | ❌ | - | Last update timestamp |

### Enterprise Context Fields
| Field | Type | Required | Test ID | Description |
|-------|------|----------|---------|-------------|
| `enterpriseId` | String | ❌ | - | Associated enterprise ID |
| `facilityId` | String | ❌ | - | Associated facility ID |
| `businessUnitId` | String | ❌ | - | Associated business unit ID |
| `parentCanvasId` | String | ❌ | - | Parent canvas ID for hierarchy |

### Enhanced Metadata Fields

#### Legal & Registration
| Field | Type | Required | Test ID | Description |
|-------|------|----------|---------|-------------|
| `legalName` | String | ❌ | `test-input-legal-name` | Legal business name |
| `abn` | String | ❌ | `test-input-abn` | Australian Business Number (11 digits) |
| `acn` | String | ❌ | `test-input-acn` | Australian Company Number (9 digits) |

#### Industry Classification
| Field | Type | Required | Test ID | Description |
|-------|------|----------|---------|-------------|
| `industry` | String | ❌ | `test-input-industry` | Primary industry (MANDATORY) |
| `sector` | String | ❌ | `test-input-sector` | Legacy single sector field |
| `sectors` | String[] | ❌ | `test-input-sectors` | Multi-sector support |
| `sectorTypes` | String[] | ❌ | `test-input-sector-types` | Sector type classifications |
| `primarySector` | String | ❌ | `test-input-primary-sector` | Primary sector code |
| `businessType` | BusinessType | ❌ | `test-input-business-type` | Legal business structure |

#### Geographic & Regional
| Field | Type | Required | Test ID | Description |
|-------|------|----------|---------|-------------|
| `regional` | RegionalClassification | ❌ | `test-input-regional` | Geographic classification |
| `primaryLocation` | String | ❌ | `test-input-primary-location` | Primary business location |
| `coordinates` | String | ❌ | `test-input-coordinates` | Geographic coordinates |

#### Facility & Operations
| Field | Type | Required | Test ID | Description |
|-------|------|----------|---------|-------------|
| `facilityType` | FacilityType | ❌ | `test-input-facility-type` | Type of facility |
| `operationalStreams` | String[] | ❌ | `test-input-operational-streams` | Operational activities |

#### Strategic & Financial
| Field | Type | Required | Test ID | Description |
|-------|------|----------|---------|-------------|
| `strategicObjective` | String | ❌ | `test-input-strategic-objective` | Strategic business objective |
| `valueProposition` | String | ❌ | `test-input-value-proposition` | Value proposition |
| `competitiveAdvantage` | String | ❌ | `test-input-competitive-advantage` | Competitive advantages |
| `annualRevenue` | Decimal | ❌ | `test-input-annual-revenue` | Annual revenue |
| `employeeCount` | Int | ❌ | `test-input-employee-count` | Number of employees |

#### Risk & Compliance
| Field | Type | Required | Test ID | Description |
|-------|------|----------|---------|-------------|
| `riskProfile` | RiskProfile | ❌ | `test-input-risk-profile` | Risk profile level |
| `complianceRequirements` | String[] | ❌ | `test-input-compliance-requirements` | Compliance requirements |
| `regulatoryFramework` | String[] | ❌ | `test-input-regulatory-framework` | Regulatory framework |

## Enum Values

### CanvasStatus
- `DRAFT` - Canvas is in draft state
- `REVIEW` - Canvas is under review
- `PUBLISHED` - Canvas is published
- `ARCHIVED` - Canvas is archived

### EditMode
- `SINGLE_USER` - Single user editing
- `MULTI_USER` - Multi-user collaborative editing
- `READ_ONLY` - Read-only mode

### BusinessType
- `CORPORATION` - Corporation
- `PARTNERSHIP` - Partnership
- `SOLE_TRADER` - Sole trader
- `TRUST` - Trust
- `JOINT_VENTURE` - Joint venture
- `SUBSIDIARY` - Subsidiary

### RegionalClassification
- `METROPOLITAN` - Metropolitan area
- `REGIONAL` - Regional area
- `REMOTE` - Remote area
- `RURAL` - Rural area
- `COASTAL` - Coastal area
- `INLAND` - Inland area

### FacilityType
- `MINE` - Mining facility
- `PROCESSING_PLANT` - Processing plant
- `REFINERY` - Refinery
- `SMELTER` - Smelter
- `WAREHOUSE` - Warehouse
- `OFFICE` - Office
- `LABORATORY` - Laboratory
- `WORKSHOP` - Workshop
- `POWER_STATION` - Power station
- `WATER_TREATMENT` - Water treatment
- `WASTE_MANAGEMENT` - Waste management

### RiskProfile
- `LOW` - Low risk profile
- `MEDIUM` - Medium risk profile
- `HIGH` - High risk profile
- `CRITICAL` - Critical risk profile

## Testing Guidelines

### Component Test IDs
```typescript
// Canvas containers
canvasContainer: 'test-canvas-container'
canvasEditor: 'test-canvas-editor'
canvasViewer: 'test-canvas-viewer'
canvasList: 'test-canvas-list'
canvasCard: 'test-canvas-card'
canvasHierarchy: 'test-canvas-hierarchy'
canvasTreeView: 'test-canvas-tree-view'
canvasListView: 'test-canvas-list-view'

// Canvas forms
canvasForm: 'test-canvas-form'
canvasCreateForm: 'test-canvas-create-form'
canvasEditForm: 'test-canvas-edit-form'
canvasMetadataForm: 'test-canvas-metadata-form'

// Basic inputs
inputCanvasName: 'test-input-canvas-name'
inputCanvasDescription: 'test-input-canvas-description'
inputCanvasVersion: 'test-input-canvas-version'
inputCanvasStatus: 'test-input-canvas-status'
inputCanvasEditMode: 'test-input-canvas-edit-mode'

// Enhanced metadata inputs
inputLegalName: 'test-input-legal-name'
inputABN: 'test-input-abn'
inputACN: 'test-input-acn'
inputIndustry: 'test-input-industry'
inputSector: 'test-input-sector'
inputSectors: 'test-input-sectors'
inputSectorTypes: 'test-input-sector-types'
inputPrimarySector: 'test-input-primary-sector'
inputBusinessType: 'test-input-business-type'
inputRegional: 'test-input-regional'
inputPrimaryLocation: 'test-input-primary-location'
inputCoordinates: 'test-input-coordinates'
inputFacilityType: 'test-input-facility-type'
inputOperationalStreams: 'test-input-operational-streams'
inputStrategicObjective: 'test-input-strategic-objective'
inputValueProposition: 'test-input-value-proposition'
inputCompetitiveAdvantage: 'test-input-competitive-advantage'
inputAnnualRevenue: 'test-input-annual-revenue'
inputEmployeeCount: 'test-input-employee-count'
inputRiskProfile: 'test-input-risk-profile'
inputComplianceRequirements: 'test-input-compliance-requirements'
inputRegulatoryFramework: 'test-input-regulatory-framework'

// Canvas actions
canvasSaveButton: 'test-canvas-save-button'
canvasDeleteButton: 'test-canvas-delete-button'
canvasEditButton: 'test-canvas-edit-button'
canvasShareButton: 'test-canvas-share-button'
canvasExportButton: 'test-canvas-export-button'
canvasTemplateButton: 'test-canvas-template-button'
canvasAddChildButton: 'test-canvas-add-child-button'
canvasCloneButton: 'test-canvas-clone-button'
canvasArchiveButton: 'test-canvas-archive-button'
canvasMoveButton: 'test-canvas-move-button'
canvasBulkSelectButton: 'test-canvas-bulk-select-button'
canvasBulkDeleteButton: 'test-canvas-bulk-delete-button'
canvasBulkArchiveButton: 'test-canvas-bulk-archive-button'

// Canvas sections
valuePropositionSection: 'test-value-proposition-section'
customerSegmentSection: 'test-customer-segment-section'
revenueStreamSection: 'test-revenue-stream-section'
partnershipSection: 'test-partnership-section'
resourceSection: 'test-resource-section'
activitySection: 'test-activity-section'
costStructureSection: 'test-cost-structure-section'
channelSection: 'test-channel-section'

// Canvas items
canvasItem: 'test-canvas-item'
canvasItemAdd: 'test-canvas-item-add'
canvasItemEdit: 'test-canvas-item-edit'
canvasItemDelete: 'test-canvas-item-delete'

// Canvas status
canvasStatusDraft: 'test-canvas-status-draft'
canvasStatusPublished: 'test-canvas-status-published'
canvasStatusArchived: 'test-canvas-status-archived'
canvasStatusReview: 'test-canvas-status-review'
canvasStatusApproved: 'test-canvas-status-approved'

// Canvas hierarchy
canvasParent: 'test-canvas-parent'
canvasChild: 'test-canvas-child'
canvasBreadcrumb: 'test-canvas-breadcrumb'
canvasTreeItem: 'test-canvas-tree-item'
canvasTreeExpand: 'test-canvas-tree-expand'
canvasTreeCollapse: 'test-canvas-tree-collapse'

// Canvas selection
canvasCheckbox: 'test-canvas-checkbox'
canvasSelectAll: 'test-canvas-select-all'
canvasDeselectAll: 'test-canvas-deselect-all'

// Canvas dialogs
canvasDeleteDialog: 'test-canvas-delete-dialog'
canvasArchiveDialog: 'test-canvas-archive-dialog'
canvasMoveDialog: 'test-canvas-move-dialog'
canvasBulkDeleteDialog: 'test-canvas-bulk-delete-dialog'
canvasStatusDialog: 'test-canvas-status-dialog'
```

### Data Requirements
```typescript
// Required for all tests
const mockCanvas = {
  id: 'test-canvas-id',
  name: 'Strategic Business Model',
  description: 'Comprehensive business model for mining operations',
  version: '1.0.0',
  isActive: true,
  status: 'DRAFT',
  editMode: 'SINGLE_USER',
  autoSave: true,
  parentCanvasId: null,
  
  // Enhanced metadata
  legalName: 'Cracked Mountain Mining Pty Ltd',
  abn: '12345678901',
  acn: '123456789',
  industry: 'MINING',
  sectors: ['COAL', 'PRODUCTION'],
  sectorTypes: ['EXTRACTIVE', 'PROCESSING'],
  primarySector: 'COAL',
  businessType: 'CORPORATION',
  regional: 'REGIONAL',
  primaryLocation: 'Queensland, Australia',
  coordinates: '-23.5505,146.8250',
  facilityType: 'OPEN_PIT_MINE',
  operationalStreams: ['EXTRACTION', 'PROCESSING', 'TRANSPORT'],
  strategicObjective: 'Sustainable mining operations',
  valueProposition: 'High-quality coal for energy production',
  competitiveAdvantage: 'Advanced extraction technology',
  annualRevenue: 50000000.00,
  employeeCount: 250,
  riskProfile: 'HIGH',
  complianceRequirements: ['WHS', 'ISO14001', 'ICMM'],
  regulatoryFramework: ['Mining Act', 'Environmental Protection'],
  
  createdAt: new Date('2024-01-01T09:00:00Z'),
  updatedAt: new Date('2024-01-15T10:30:00Z'),
};
```

### Validation Rules
```typescript
// Zod validation schema
const businessCanvasSchema = z.object({
  name: z.string().min(1, 'Canvas name is required').max(255),
  description: z.string().optional(),
  version: z.string().optional(),
  isActive: z.boolean().optional(),
  status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED']).optional(),
  editMode: z.enum(['SINGLE_USER', 'MULTI_USER', 'READ_ONLY']).optional(),
  autoSave: z.boolean().optional(),
  enterpriseId: z.string().optional(),
  facilityId: z.string().optional(),
  businessUnitId: z.string().optional(),
  parentCanvasId: z.string().nullable().optional().transform(val => 
    val === '' || (typeof val === 'string' && val.trim() === '') ? null : val
  ),
  templateId: z.string().optional(),
  
  // Enhanced metadata fields
  legalName: z.string().optional(),
  abn: z.string().optional(),
  acn: z.string().optional(),
  industry: z.string().optional(),
  sector: z.string().optional(),
  sectors: z.array(z.string()).optional(),
  sectorTypes: z.array(z.string()).optional(),
  businessType: z.enum(['CORPORATION', 'PARTNERSHIP', 'SOLE_TRADER', 'TRUST', 'JOINT_VENTURE', 'SUBSIDIARY']).optional(),
  regional: z.enum(['METROPOLITAN', 'REGIONAL', 'REMOTE', 'RURAL', 'COASTAL', 'INLAND']).optional(),
  primaryLocation: z.string().optional(),
  coordinates: z.string().optional(),
  facilityType: z.enum(['MINE', 'PROCESSING_PLANT', 'REFINERY', 'SMELTER', 'WAREHOUSE', 'OFFICE', 'LABORATORY', 'WORKSHOP', 'POWER_STATION', 'WATER_TREATMENT', 'WASTE_MANAGEMENT']).optional(),
  operationalStreams: z.array(z.string()).optional(),
  strategicObjective: z.string().optional(),
  valueProposition: z.string().optional(),
  competitiveAdvantage: z.string().optional(),
  annualRevenue: z.number().optional(),
  employeeCount: z.number().optional(),
  riskProfile: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  complianceRequirements: z.array(z.string()).optional(),
  regulatoryFramework: z.array(z.string()).optional(),
});
```

## Seed Data Alignment
```typescript
// Seed data structure
const canvasTemplates = [
  {
    name: 'Cracked Mountain Strategic Model',
    description: 'Comprehensive business model for mining operations',
    legalName: 'Cracked Mountain Mining Pty Ltd',
    abn: '12345678901',
    acn: '123456789',
    industry: 'MINING',
    sectors: ['COAL', 'PRODUCTION'],
    primarySector: 'COAL',
    businessType: 'CORPORATION',
    regional: 'REGIONAL',
    primaryLocation: 'Queensland, Australia',
    facilityType: 'OPEN_PIT_MINE',
    operationalStreams: ['EXTRACTION', 'PROCESSING', 'TRANSPORT'],
    strategicObjective: 'Sustainable mining operations',
    valueProposition: 'High-quality coal for energy production',
    competitiveAdvantage: 'Advanced extraction technology',
    annualRevenue: 50000000.00,
    employeeCount: 250,
    riskProfile: 'HIGH',
    complianceRequirements: ['WHS', 'ISO14001', 'ICMM'],
    regulatoryFramework: ['Mining Act', 'Environmental Protection'],
  },
  // ... more templates
];
```

## Related Entities

### Direct Relationships
- **Enterprise** (`enterpriseId`) - Associated enterprise
- **Facility** (`facilityId`) - Associated facility
- **BusinessUnit** (`businessUnitId`) - Associated business unit
- **BusinessCanvas** (`parentCanvasId`) - Parent canvas for hierarchy
- **CanvasTemplate** (`templateId`) - Source template

### Child Relationships
- **BusinessCanvas[]** (`childCanvases`) - Child canvases in hierarchy
- **ValueProposition[]** (`valuePropositions`) - Canvas value propositions
- **CustomerSegment[]** (`customerSegments`) - Canvas customer segments
- **RevenueStream[]** (`revenueStreams`) - Canvas revenue streams
- **Partnership[]** (`partnerships`) - Canvas partnerships
- **Resource[]** (`resources`) - Canvas resources
- **Activity[]** (`activities`) - Canvas activities
- **CostStructure[]** (`costStructures`) - Canvas cost structures
- **Channel[]** (`channels`) - Canvas channels
- **CanvasVersion[]** (`versions`) - Canvas versions
- **CanvasCollaborator[]** (`collaborators`) - Canvas collaborators
- **CanvasSharingSetting[]** (`sharingSettings`) - Canvas sharing settings
- **CanvasExport[]** (`exportHistory`) - Canvas export history

## API Endpoints

### GET /api/business-canvas
- **Purpose:** Fetch business canvases
- **Query Parameters:**
  - `isActive` - Filter by active status
  - `include` - Include related entities (comma-separated)
  - `enterpriseId` - Filter by enterprise
  - `facilityId` - Filter by facility
  - `businessUnitId` - Filter by business unit
- **Response:** Array of BusinessCanvas objects
- **Headers:** Cache control headers set

### POST /api/business-canvas
- **Purpose:** Create new business canvas
- **Body:** BusinessCanvas input data
- **Validation:** Zod schema validation
- **Response:** Created BusinessCanvas object
- **Error Handling:** Validation errors, database errors

### PATCH /api/business-canvas
- **Purpose:** Update existing business canvas
- **Body:** Partial BusinessCanvas data
- **Validation:** Zod schema validation
- **Response:** Updated BusinessCanvas object
- **Error Handling:** Validation errors, not found errors

### DELETE /api/business-canvas/[id]
- **Purpose:** Delete business canvas
- **Parameters:** Canvas ID
- **Response:** Success/error message
- **Error Handling:** Not found errors, constraint violations

## Security Considerations

### Authentication
- All endpoints require authentication
- User must have appropriate permissions

### Authorization
- Users can only access canvases within their enterprise context
- Role-based access control for canvas operations
- Hierarchy-based access control for parent-child relationships

### Data Validation
- Input sanitization for all fields
- Enum validation for status fields
- Array validation for multi-value fields
- Transform functions for empty string handling

### Audit Trail
- All canvas operations are logged
- Version history maintained
- Export history tracked
- Collaboration history recorded

## Performance Considerations

### Database Optimization
- Indexes on frequently queried fields
- Composite indexes for enterprise context queries
- Pagination for large result sets
- Efficient include clause handling

### Caching Strategy
- Cache control headers for API responses
- No caching for dynamic canvas data
- Cache invalidation on updates

### Query Optimization
- Efficient relationship loading
- Selective field inclusion
- Optimized ordering and filtering
- Bulk operation support

## Testing Scenarios

### Unit Tests
- Component rendering with all metadata fields
- Form validation for complex fields
- Hierarchy operations (parent-child relationships)
- Bulk operations (multi-select, bulk actions)
- Real-time editing scenarios
- Status management and transitions

### Integration Tests
- API endpoint testing with complex queries
- Include clause validation
- Enterprise context filtering
- Cache control header testing
- Error handling scenarios
- Large dataset performance

### E2E Tests
- Complete canvas creation workflow
- Hierarchy management operations
- Bulk operations workflow
- Real-time collaboration scenarios
- Export and sharing functionality
- Cross-browser compatibility

## Migration Notes

### Schema Changes
- Enhanced metadata fields added incrementally
- Backward compatibility maintained
- Default values provided for new fields
- Migration scripts handle data transformation

### Data Migration
- Existing canvases updated with default values
- Legacy field mapping maintained
- Data validation during migration
- Rollback procedures available

### API Versioning
- API versioning for breaking changes
- Deprecation notices for old endpoints
- Migration guides for API consumers
- Backward compatibility maintained where possible 