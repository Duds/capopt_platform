# Strategic Navigation Flow

## Overview
The Strategic Navigation Flow enables seamless navigation between operational and strategic layers, providing context-aware transitions and alignment visibility throughout the CapOpt Platform.

## Enterprise Information System Integration

### Enterprise Context in Navigation
**Purpose**: Provide enterprise context throughout all navigation flows

**Key Features:**
- **Enterprise Header**: Always visible enterprise and facility context
- **Organizational Breadcrumbs**: Show user's position in organizational hierarchy
- **Multi-Facility Navigation**: Switch between facilities and business units
- **Operational Stream Indicators**: Visual distinction between operational streams

**Navigation Patterns:**
```
Enterprise → Facility → Business Unit → Department → Process/Asset/Control
```

### Enterprise-Aware Strategic Flow
**Enhanced Flow**: Enterprise context enriches the strategic navigation

**Operational to Strategic:**
1. **Process Maps** (Enterprise Context) → **Service Model** (Enterprise Services)
2. **Service Model** (Enterprise Services) → **Value Chain** (Enterprise Value)
3. **Value Chain** (Enterprise Value) → **Operating Model** (Enterprise Operations)
4. **Operating Model** (Enterprise Operations) → **Business Canvas** (Enterprise Strategy)

**Strategic to Operational:**
1. **Business Canvas** (Enterprise Strategy) → **Operating Model** (Enterprise Operations)
2. **Operating Model** (Enterprise Operations) → **Value Chain** (Enterprise Value)
3. **Value Chain** (Enterprise Value) → **Service Model** (Enterprise Services)
4. **Service Model** (Enterprise Services) → **Process Maps** (Enterprise Context)

## Current Implementation Status

### Enterprise Information System: ✅ **Fully Implemented**
- **Enterprise Management**: Complete database schema and seed data
- **Multi-Facility Support**: Hercules Levee facility with full structure
- **Operational Streams**: Copper, uranium, gold, silver streams
- **Organizational Hierarchy**: 12 business units, 20+ departments
- **Address Management**: Multiple address types and locations

### Strategic Layer: 🔄 **Partially Implemented**
- **Business Model Canvas**: ✅ Fully implemented
- **Operating Model Canvas**: ⏳ Not implemented
- **Value Chain Management**: ⏳ Not implemented
- **Service Model**: ⏳ Not implemented
- **Experience Model**: ⏳ Not implemented
- **Capability Model**: ⏳ Not implemented

### Operational Layer: 🔄 **Partially Implemented**
- **Process Management**: ✅ 80% complete (Process Detail View implemented)
- **Process Maps**: ⏳ Not implemented
- **Playbooks**: ⏳ Not implemented
- **Procedures**: ⏳ Not implemented
- **Training Materials**: ⏳ Not implemented
- **Best Practices**: ⏳ Not implemented
- **Improvements**: ⏳ Not implemented

### Control & Risk Layer: ✅ **Fully Implemented**
- **Critical Controls**: ✅ Fully implemented
- **Risk Categories**: ✅ Fully implemented
- **Control Types**: ✅ Fully implemented
- **Control Effectiveness**: ✅ Fully implemented
- **Bowtie Analysis**: ✅ Fully implemented

### Asset Management: 🔄 **Partially Implemented**
- **Asset Tracking**: ✅ Basic implementation
- **Asset Risks**: ⏳ Not implemented
- **Asset Protection**: ⏳ Not implemented
- **Asset Monitoring**: ⏳ Not implemented
- **Asset Optimization**: ⏳ Not implemented

## Navigation Flow Components

### Enterprise Context Panel
**Purpose**: Provide enterprise context throughout navigation

**Components:**
```typescript
interface EnterpriseContext {
  enterprise: EnterpriseInfo;
  facility: FacilityInfo;
  businessUnit: BusinessUnitInfo;
  department: DepartmentInfo;
  operationalStream: StreamInfo;
}
```

### Enhanced Breadcrumb Navigation
**Purpose**: Show enterprise hierarchy in navigation

**Structure:**
```
Enterprise > Facility > Business Unit > Department > Current Page
```

### Strategic Context Panel
**Purpose**: Show strategic alignment for current operational context

**Components:**
```typescript
interface StrategicContext {
  businessCanvasAlignment: AlignmentScore;
  valueChainConnection: ValueChainLink[];
  operatingModelFit: OperatingModelFit;
  strategicObjectives: StrategicObjective[];
}
```

## Implementation Priority

### Phase 1: Enterprise Foundation ✅ **Complete**
- Enterprise information system
- Multi-facility support
- Operational streams
- Organizational hierarchy

### Phase 2: Strategic Navigation Foundation 🔄 **In Progress**
- Strategic context panels
- Enterprise-aware breadcrumbs
- Navigation flow components
- Alignment indicators

### Phase 3: Full Strategic Layer ⏳ **Planned**
- Operating Model Canvas
- Value Chain Management
- Service Model
- Experience Model
- Capability Model

### Phase 4: Enhanced Operational Layer ⏳ **Planned**
- Process Maps
- Playbooks
- Procedures
- Training Materials
- Best Practices
- Improvements

### Phase 5: Advanced Asset Management ⏳ **Planned**
- Asset Risks
- Asset Protection
- Asset Monitoring
- Asset Optimization

## Success Metrics

### Navigation Effectiveness
- **Context Retention**: Users maintain enterprise context across navigation
- **Strategic Alignment**: Clear visibility of strategic-operational alignment
- **Operational Stream Awareness**: Users understand multi-stream operations
- **Organizational Navigation**: Efficient navigation through organizational hierarchy

### Enterprise Integration
- **Multi-Facility Support**: Seamless switching between facilities
- **Business Unit Alignment**: Clear business unit context and metrics
- **Department Visibility**: Proper department-level navigation and management
- **Operational Stream Performance**: Stream-specific performance tracking 