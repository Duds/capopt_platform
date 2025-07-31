# Business Canvas Naming Conventions - Quick Reference

## Component Names

### Main Components
- `CanvasVisualization` → `BusinessModelCanvas`
- `CanvasTreeView` → `CanvasHierarchyView`
- `CanvasForm` → `CanvasEditor`
- `StatusChangeDialog` → `CanvasStatusDialog`
- `SectorMultiSelect` → `IndustrySectorSelector`

### Section Components
- `ValuePropositionSection`
- `CustomerSegmentSection`
- `RevenueStreamSection`
- `PartnershipSection`
- `ResourceSection`
- `ActivitySection`
- `CostStructureSection`
- `ChannelSection`

### Item Components
- `CanvasItemCard`
- `CanvasItemEditor`
- `CanvasItemForm`
- `CanvasItemActions`

### Modal Components
- `CanvasCreateModal`
- `CanvasEditModal`
- `CanvasDeleteModal`
- `CanvasStatusModal`
- `CanvasExportModal`
- `CanvasShareModal`
- `ItemCreateModal`
- `ItemEditModal`
- `ItemDeleteModal`

## Interface Names

### Core Interfaces
```typescript
interface BusinessModelCanvas
interface CanvasSection
interface CanvasItem
interface CanvasMetadata
```

### Props Interfaces
```typescript
interface BusinessModelCanvasProps
interface CanvasHierarchyViewProps
interface CanvasEditorProps
interface CanvasItemProps
```

## Function Names

### Event Handlers
```typescript
handleCanvasSelect(canvasId: string)
handleCanvasCreate(data: CanvasFormData)
handleCanvasEdit(canvasId: string)
handleCanvasDelete(canvasId: string)
handleCanvasStatusChange(canvasId: string, status: CanvasStatus)
handleCanvasExport(format: ExportFormat)
handleCanvasShare(options: ShareOptions)

handleItemCreate(sectionKey: SectionKey, item: CanvasItem)
handleItemEdit(sectionKey: SectionKey, itemId: string)
handleItemDelete(sectionKey: SectionKey, itemId: string)
handleItemUpdate(sectionKey: SectionKey, itemId: string, updates: Partial<CanvasItem>)
```

### Utility Functions
```typescript
validateCanvasData(data: CanvasFormData): ValidationResult
convertCanvasToBusinessModel(canvas: BusinessModelCanvas): BusinessModel
convertBusinessModelToCanvas(model: BusinessModel): BusinessModelCanvas
generateCanvasId(): string
formatCanvasName(name: string): string
calculateCanvasProgress(canvas: BusinessModelCanvas): number
```

## State Variables

### Canvas State
```typescript
const [selectedCanvas, setSelectedCanvas] = useState<BusinessModelCanvas | null>(null)
const [isEditingCanvas, setIsEditingCanvas] = useState(false)
const [isCreatingCanvas, setIsCreatingCanvas] = useState(false)
const [canvasFormData, setCanvasFormData] = useState<CanvasFormData>({})
const [canvasValidationErrors, setCanvasValidationErrors] = useState<ValidationErrors>({})
```

### Modal State
```typescript
const [isCanvasCreateModalOpen, setIsCanvasCreateModalOpen] = useState(false)
const [isCanvasEditModalOpen, setIsCanvasEditModalOpen] = useState(false)
const [isCanvasDeleteModalOpen, setIsCanvasDeleteModalOpen] = useState(false)
const [isCanvasStatusModalOpen, setIsCanvasStatusModalOpen] = useState(false)
```

### Item State
```typescript
const [selectedItem, setSelectedItem] = useState<CanvasItem | null>(null)
const [isEditingItem, setIsEditingItem] = useState(false)
const [itemFormData, setItemFormData] = useState<ItemFormData>({})
```

## Enums

### Status Enums
```typescript
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

### Section Keys
```typescript
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

## CSS Classes

### Component Classes
```css
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

### State Classes
```css
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

## File Structure

```
components/business-canvas/
├── BusinessModelCanvas.tsx
├── CanvasHierarchyView.tsx
├── CanvasEditor.tsx
├── CanvasStatusDialog.tsx
├── IndustrySectorSelector.tsx
├── sections/
│   ├── ValuePropositionSection.tsx
│   ├── CustomerSegmentSection.tsx
│   ├── RevenueStreamSection.tsx
│   ├── PartnershipSection.tsx
│   ├── ResourceSection.tsx
│   ├── ActivitySection.tsx
│   ├── CostStructureSection.tsx
│   └── ChannelSection.tsx
├── items/
│   ├── CanvasItemCard.tsx
│   ├── CanvasItemEditor.tsx
│   ├── CanvasItemForm.tsx
│   └── CanvasItemActions.tsx
├── modals/
│   ├── CanvasCreateModal.tsx
│   ├── CanvasEditModal.tsx
│   ├── CanvasDeleteModal.tsx
│   ├── CanvasStatusModal.tsx
│   ├── CanvasExportModal.tsx
│   ├── CanvasShareModal.tsx
│   ├── ItemCreateModal.tsx
│   ├── ItemEditModal.tsx
│   └── ItemDeleteModal.tsx
├── forms/
│   ├── CanvasMetadataForm.tsx
│   ├── CanvasBusinessForm.tsx
│   ├── CanvasLocationForm.tsx
│   ├── CanvasStrategicForm.tsx
│   ├── ItemForm.tsx
│   └── SectionItemForm.tsx
├── types.ts
├── utils.ts
├── constants.ts
└── hooks/
    ├── useCanvasData.ts
    ├── useCanvasValidation.ts
    ├── useCanvasExport.ts
    └── useCanvasShare.ts
```

## Naming Patterns

### Component Naming
- Use PascalCase for component names
- Use descriptive, purpose-indicating names
- Include the main entity (Canvas, Item, Section) in the name
- Use suffixes like `Modal`, `Form`, `Card`, `Editor` to indicate component type

### Function Naming
- Use camelCase for function names
- Start with `handle` for event handlers
- Use descriptive verbs (create, edit, delete, update, validate, convert)
- Include the entity being acted upon (Canvas, Item, Section)

### State Naming
- Use camelCase for state variables
- Start with `is` for boolean states
- Use descriptive names that indicate the state's purpose
- Include the entity being managed (Canvas, Item, Modal)

### Interface Naming
- Use PascalCase for interface names
- Include the main entity in the name
- Use suffixes like `Props`, `Data`, `Result` to indicate interface purpose

### CSS Class Naming
- Use kebab-case for CSS classes
- Use BEM methodology (Block__Element--Modifier)
- Include the component name as the block
- Use descriptive modifiers for states

## Related Documentation

- **Full Naming Conventions:** @docs/design/business-canvas-naming-conventions.md
- **Component Architecture:** @docs/design/solution-architecture-design.md#business-canvas
- **UX Design Patterns:** @docs/design/ux-architecture-design.md#canvas-components 