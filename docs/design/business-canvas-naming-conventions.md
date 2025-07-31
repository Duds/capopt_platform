# Business Canvas Component Naming Conventions

## Overview

This document establishes standardized naming conventions for all Business Canvas components, ensuring consistency, maintainability, and clarity across the codebase. These conventions follow React and TypeScript best practices and align with the CapOpt Platform's design principles.

## Component Naming Standards

### 1. **Main Canvas Components**

#### Current → Standardized Names

| Current Name | Standardized Name | Purpose |
|--------------|-------------------|---------|
| `CanvasVisualization` | `BusinessModelCanvas` | Main canvas visualization component |
| `CanvasTreeView` | `CanvasHierarchyView` | Hierarchical tree view of canvases |
| `CanvasForm` | `CanvasEditor` | Canvas creation/editing form |
| `StatusChangeDialog` | `CanvasStatusDialog` | Status change modal |
| `SectorMultiSelect` | `IndustrySectorSelector` | Industry/sector selection |

### 2. **Canvas Section Components**

#### Canvas Sections (9-Section Model)
```typescript
// Standardized section names
interface CanvasSections {
  valuePropositions: CanvasSection
  customerSegments: CanvasSection
  revenueStreams: CanvasSection
  partnerships: CanvasSection
  resources: CanvasSection
  activities: CanvasSection
  costStructures: CanvasSection
  channels: CanvasSection
}
```

#### Section Component Names
```typescript
// Individual section components
ValuePropositionSection
CustomerSegmentSection
RevenueStreamSection
PartnershipSection
ResourceSection
ActivitySection
CostStructureSection
ChannelSection
```

### 3. **Canvas Item Components**

#### Item Types
```typescript
// Standardized item component names
CanvasItemCard          // Individual item display
CanvasItemEditor        // Item editing interface
CanvasItemForm          // Item creation/editing form
CanvasItemActions       // Item action buttons (edit, delete, etc.)
```

### 4. **Modal and Dialog Components**

#### Modal Names
```typescript
// Standardized modal names
CanvasCreateModal       // Canvas creation modal
CanvasEditModal         // Canvas editing modal
CanvasDeleteModal       // Canvas deletion confirmation
CanvasStatusModal       // Status change modal
CanvasExportModal       // Export options modal
CanvasShareModal        // Sharing options modal
ItemCreateModal         // Item creation modal
ItemEditModal           // Item editing modal
ItemDeleteModal         // Item deletion confirmation
```

### 5. **Form Components**

#### Form Names
```typescript
// Standardized form names
CanvasMetadataForm      // Basic canvas information
CanvasBusinessForm      // Business details form
CanvasLocationForm      // Location and facility form
CanvasStrategicForm     // Strategic objectives form
ItemForm                // Generic item form
SectionItemForm         // Section-specific item form
```

## Interface and Type Naming

### 1. **Core Interfaces**

```typescript
// Standardized interface names
interface BusinessModelCanvas {
  id: string
  name: string
  description: string
  sections: CanvasSections
  metadata: CanvasMetadata
  status: CanvasStatus
}

interface CanvasSection {
  key: SectionKey
  title: string
  description: string
  items: CanvasItem[]
  position: SectionPosition
  isImplemented: boolean
}

interface CanvasItem {
  id: string
  title: string
  description: string
  priority: ItemPriority
  status: ItemStatus
  metadata: ItemMetadata
}

interface CanvasMetadata {
  businessType: BusinessType
  industry: string
  sector: string
  location: Location
  strategicObjective: string
  valueProposition: string
}
```

### 2. **Component Props Interfaces**

```typescript
// Standardized props interfaces
interface BusinessModelCanvasProps {
  canvas: BusinessModelCanvas
  isEditing: boolean
  onUpdate: (canvas: BusinessModelCanvas) => void
  onEdit: () => void
  onDelete: () => void
}

interface CanvasHierarchyViewProps {
  canvases: BusinessModelCanvas[]
  selectedCanvasId?: string
  onSelectCanvas: (id: string) => void
  onAddCanvas: (parentId?: string) => void
  onEditCanvas: (id: string) => void
  onDeleteCanvas: (id: string) => void
}

interface CanvasEditorProps {
  mode: 'create' | 'edit'
  canvas?: BusinessModelCanvas
  onSubmit: (data: CanvasFormData) => void
  onCancel: () => void
}
```

## Function and Method Naming

### 1. **Event Handlers**

```typescript
// Standardized event handler names
const handleCanvasSelect = (canvasId: string) => void
const handleCanvasCreate = (data: CanvasFormData) => void
const handleCanvasEdit = (canvasId: string) => void
const handleCanvasDelete = (canvasId: string) => void
const handleCanvasStatusChange = (canvasId: string, status: CanvasStatus) => void
const handleCanvasExport = (format: ExportFormat) => void
const handleCanvasShare = (options: ShareOptions) => void

const handleItemCreate = (sectionKey: SectionKey, item: CanvasItem) => void
const handleItemEdit = (sectionKey: SectionKey, itemId: string) => void
const handleItemDelete = (sectionKey: SectionKey, itemId: string) => void
const handleItemUpdate = (sectionKey: SectionKey, itemId: string, updates: Partial<CanvasItem>) => void
```

### 2. **Utility Functions**

```typescript
// Standardized utility function names
const validateCanvasData = (data: CanvasFormData): ValidationResult
const convertCanvasToBusinessModel = (canvas: BusinessModelCanvas): BusinessModel
const convertBusinessModelToCanvas = (model: BusinessModel): BusinessModelCanvas
const generateCanvasId = (): string
const formatCanvasName = (name: string): string
const calculateCanvasProgress = (canvas: BusinessModelCanvas): number
```

### 3. **Data Transformation Functions**

```typescript
// Standardized transformation function names
const transformCanvasData = (rawData: any): BusinessModelCanvas
const transformItemData = (rawData: any): CanvasItem
const transformSectionData = (rawData: any): CanvasSection
const serializeCanvasForExport = (canvas: BusinessModelCanvas): ExportData
const deserializeCanvasFromImport = (data: ImportData): BusinessModelCanvas
```

## State Management Naming

### 1. **State Variables**

```typescript
// Standardized state variable names
const [selectedCanvas, setSelectedCanvas] = useState<BusinessModelCanvas | null>(null)
const [isEditingCanvas, setIsEditingCanvas] = useState(false)
const [isCreatingCanvas, setIsCreatingCanvas] = useState(false)
const [canvasFormData, setCanvasFormData] = useState<CanvasFormData>({})
const [canvasValidationErrors, setCanvasValidationErrors] = useState<ValidationErrors>({})
const [canvasExportFormat, setCanvasExportFormat] = useState<ExportFormat>('pdf')
const [canvasShareOptions, setCanvasShareOptions] = useState<ShareOptions>({})

const [selectedItem, setSelectedItem] = useState<CanvasItem | null>(null)
const [isEditingItem, setIsEditingItem] = useState(false)
const [itemFormData, setItemFormData] = useState<ItemFormData>({})
```

### 2. **Modal State**

```typescript
// Standardized modal state names
const [isCanvasCreateModalOpen, setIsCanvasCreateModalOpen] = useState(false)
const [isCanvasEditModalOpen, setIsCanvasEditModalOpen] = useState(false)
const [isCanvasDeleteModalOpen, setIsCanvasDeleteModalOpen] = useState(false)
const [isCanvasStatusModalOpen, setIsCanvasStatusModalOpen] = useState(false)
const [isCanvasExportModalOpen, setIsCanvasExportModalOpen] = useState(false)
const [isCanvasShareModalOpen, setIsCanvasShareModalOpen] = useState(false)
```

## CSS Class and Style Naming

### 1. **Component Classes**

```css
/* Standardized CSS class names */
.business-model-canvas
.business-model-canvas__section
.business-model-canvas__item
.business-model-canvas__item-card
.business-model-canvas__item-editor

.canvas-hierarchy-view
.canvas-hierarchy-view__node
.canvas-hierarchy-view__node--selected
.canvas-hierarchy-view__node--expanded

.canvas-editor
.canvas-editor__form
.canvas-editor__form-step
.canvas-editor__form-field

.canvas-status-dialog
.canvas-status-dialog__content
.canvas-status-dialog__actions
```

### 2. **State Classes**

```css
/* Standardized state class names */
.business-model-canvas--editing
.business-model-canvas--viewing
.business-model-canvas--loading
.business-model-canvas--error

.canvas-item--selected
.canvas-item--editing
.canvas-item--dragging
.canvas-item--disabled

.canvas-section--implemented
.canvas-section--not-implemented
.canvas-section--in-progress
```

## File and Directory Naming

### 1. **Component Files**

```
components/business-canvas/
├── BusinessModelCanvas.tsx          # Main canvas component
├── CanvasHierarchyView.tsx          # Tree view component
├── CanvasEditor.tsx                 # Canvas editing form
├── CanvasStatusDialog.tsx           # Status change dialog
├── IndustrySectorSelector.tsx       # Sector selection
├── sections/                        # Section components
│   ├── ValuePropositionSection.tsx
│   ├── CustomerSegmentSection.tsx
│   ├── RevenueStreamSection.tsx
│   ├── PartnershipSection.tsx
│   ├── ResourceSection.tsx
│   ├── ActivitySection.tsx
│   ├── CostStructureSection.tsx
│   └── ChannelSection.tsx
├── items/                           # Item components
│   ├── CanvasItemCard.tsx
│   ├── CanvasItemEditor.tsx
│   ├── CanvasItemForm.tsx
│   └── CanvasItemActions.tsx
├── modals/                          # Modal components
│   ├── CanvasCreateModal.tsx
│   ├── CanvasEditModal.tsx
│   ├── CanvasDeleteModal.tsx
│   ├── CanvasStatusModal.tsx
│   ├── CanvasExportModal.tsx
│   ├── CanvasShareModal.tsx
│   ├── ItemCreateModal.tsx
│   ├── ItemEditModal.tsx
│   └── ItemDeleteModal.tsx
├── forms/                           # Form components
│   ├── CanvasMetadataForm.tsx
│   ├── CanvasBusinessForm.tsx
│   ├── CanvasLocationForm.tsx
│   ├── CanvasStrategicForm.tsx
│   ├── ItemForm.tsx
│   └── SectionItemForm.tsx
├── types.ts                         # Type definitions
├── utils.ts                         # Utility functions
├── constants.ts                     # Constants and enums
└── hooks/                           # Custom hooks
    ├── useCanvasData.ts
    ├── useCanvasValidation.ts
    ├── useCanvasExport.ts
    └── useCanvasShare.ts
```

### 2. **Type Definition Files**

```
types/business-canvas/
├── index.ts                         # Main type exports
├── canvas.ts                        # Canvas-related types
├── sections.ts                      # Section-related types
├── items.ts                         # Item-related types
├── forms.ts                         # Form-related types
├── modals.ts                        # Modal-related types
└── api.ts                           # API-related types
```

## Constants and Enums

### 1. **Canvas Status Enums**

```typescript
// Standardized enum names
enum CanvasStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  DEPRECATED = 'DEPRECATED'
}

enum ItemStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DEPRECATED = 'DEPRECATED'
}

enum ItemPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}
```

### 2. **Section Keys**

```typescript
// Standardized section keys
enum SectionKey {
  VALUE_PROPOSITIONS = 'valuePropositions',
  CUSTOMER_SEGMENTS = 'customerSegments',
  REVENUE_STREAMS = 'revenueStreams',
  PARTNERSHIPS = 'partnerships',
  RESOURCES = 'resources',
  ACTIVITIES = 'activities',
  COST_STRUCTURES = 'costStructures',
  CHANNELS = 'channels'
}
```

## Migration Plan

### Phase 1: Component Renaming
1. Rename main components following the new conventions
2. Update import statements across the codebase
3. Update component references in parent components

### Phase 2: Interface and Type Updates
1. Rename interfaces and types following the new conventions
2. Update type references throughout the codebase
3. Update API response handling

### Phase 3: Function and Method Updates
1. Rename event handlers and utility functions
2. Update function calls throughout the codebase
3. Update documentation and comments

### Phase 4: File Structure Reorganization
1. Reorganize files into the new directory structure
2. Update import paths
3. Update build configuration if needed

## Benefits of Standardized Naming

1. **Consistency**: All components follow the same naming patterns
2. **Maintainability**: Easier to understand and modify code
3. **Scalability**: Clear patterns for adding new components
4. **Team Collaboration**: Reduced confusion and improved communication
5. **Code Quality**: Better readability and reduced errors
6. **Documentation**: Easier to document and explain components

## Related Documentation

- **Component Architecture:** @docs/design/solution-architecture-design.md#business-canvas
- **UX Design Patterns:** @docs/design/ux-architecture-design.md#canvas-components
- **API Design:** @docs/design/solution-architecture-design.md#api-design
- **Implementation Status:** @docs/implementation-status.md 