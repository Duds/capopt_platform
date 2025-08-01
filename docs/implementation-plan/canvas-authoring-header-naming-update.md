# CanvasAuthoringHeader Naming Convention Update

## Overview

This document outlines the renaming of the `BMCAuthoringHeader` component to `CanvasAuthoringHeader` to align with the established Business Canvas naming conventions.

## Changes Made

### 1. **Component Renaming**

#### File Renamed
- **From:** `components/business-canvas/bmc-authoring-header.tsx`
- **To:** `components/business-canvas/CanvasAuthoringHeader.tsx`

#### Component Renamed
- **From:** `BMCAuthoringHeader`
- **To:** `CanvasAuthoringHeader`

#### Interface Renamed
- **From:** `BMCAuthoringHeaderProps`
- **To:** `CanvasAuthoringHeaderProps`

### 2. **Documentation Updates**

#### Business Canvas Naming Conventions
- Added `CanvasAuthoringHeader` to the component naming standards table
- Added `CanvasAuthoringHeaderProps` interface to the component props interfaces section
- Added `CanvasAuthoringHeader.tsx` to the file structure documentation

#### Implementation Documentation
- Updated `business-canvas-naming-conventions-implementation.md` to reflect the new file name
- Updated `bmc-authoring-integration-plan.md` to use the new component name

### 3. **Component Purpose**

The `CanvasAuthoringHeader` component provides:

- **Canvas Selection**: Dropdown to select different business canvases
- **Template Management**: Access to canvas templates for quick setup
- **Authoring Controls**: Edit mode, collaboration indicators, auto-save settings
- **Version Control**: Version history and branching capabilities
- **Export/Share**: Multiple export formats and sharing options
- **Enterprise Context**: Display of enterprise, facility, and business unit information

### 4. **Interface Definition**

```typescript
interface CanvasAuthoringHeaderProps {
  currentCanvasId?: string
  onCanvasChange: (canvasId: string) => void
  onSave: () => void
  onExport: (format: string) => void
  onShare: (settings: any) => void
  onTemplateLoad: (templateId: string) => void
  onNewCanvas: () => void
  collaborationMode?: 'single' | 'multi'
  enterpriseContext?: EnterpriseContext
  collaborators?: CanvasCollaborator[]
  versions?: CanvasVersion[]
  templates?: CanvasTemplate[]
  hasUnsavedChanges?: boolean
  lastSaved?: string
  conflicts?: any[]
}
```

### 5. **Key Features**

#### Canvas Management
- Canvas selection dropdown with descriptions
- New canvas creation button
- Template loading functionality

#### Authoring Controls
- Edit mode selection (Draft, Review, Published)
- Collaboration indicators for multi-user editing
- Auto-save toggle with status indicators
- Version control with history

#### Export & Sharing
- Multiple export formats (PDF, PNG, SVG, JSON, CSV, Excel)
- Sharing options (Team, Public, Email, Enterprise)
- Permission management
- Expiration settings

#### Enterprise Integration
- Enterprise context display
- Facility and business unit information
- ABN/ACN display
- Hierarchical organization structure

### 6. **Usage Example**

```typescript
import { CanvasAuthoringHeader } from '@/components/business-canvas/CanvasAuthoringHeader'

function BusinessCanvasPage() {
  return (
    <div>
      <CanvasAuthoringHeader
        currentCanvasId={selectedCanvasId}
        onCanvasChange={handleCanvasChange}
        onSave={handleSave}
        onExport={handleExport}
        onShare={handleShare}
        onTemplateLoad={handleTemplateLoad}
        onNewCanvas={handleNewCanvas}
        collaborationMode="multi"
        enterpriseContext={enterpriseContext}
        collaborators={collaborators}
        versions={versions}
        templates={templates}
        hasUnsavedChanges={hasChanges}
        lastSaved={lastSavedTime}
        conflicts={conflicts}
      />
      {/* Canvas content */}
    </div>
  )
}
```

## Benefits of Renaming

1. **Consistency**: Aligns with established naming conventions
2. **Clarity**: More descriptive name that clearly indicates purpose
3. **Maintainability**: Easier to understand and locate in codebase
4. **Scalability**: Follows patterns for future component additions
5. **Documentation**: Better integration with naming convention documentation

## Related Documentation

- **Business Canvas Naming Conventions:** @docs/design/business-canvas-naming-conventions.md
- **BMC Authoring Integration Plan:** @docs/technical/bmc-authoring-integration-plan.md
- **Component Architecture:** @docs/design/solution-architecture-design.md#business-canvas 