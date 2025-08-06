# BMC Enhanced Data Fields Implementation Plan

> **Related documentation:**
> - Solution Architecture: @docs/design/solution-architecture-design.md
> - UX Architecture: @docs/design/ux-architecture-design.md
> - Operational Canvas Design: @docs/design/operational-canvas-design.md
> - Product Backlog: @docs/design/product-backlog.md
> - Implementation Status: @docs/implementation-status.md

## Executive Summary

This implementation plan outlines the enhancement of the Business Model Canvas (BMC) with comprehensive data fields and seamless BMC → Operating Model Canvas (OMC) integration. The plan focuses on transforming the current basic BMC into a strategic planning tool that bridges the gap between business strategy and operational execution.

## Strategic Context

### Current State
- ✅ **BMC Basic Implementation**: 9-section canvas with basic CRUD operations
- ✅ **Database Schema**: Core BMC entities with basic fields
- ✅ **UI Components**: Interactive canvas with editing capabilities
- ⏳ **Data Field Enhancement**: Limited strategic and operational context
- ⏳ **BMC → OMC Integration**: No operational linkage
- ⏳ **Graph Relationships**: No relationship mapping between sections

### Target State
- **Strategic Planning Tool**: Rich data fields for comprehensive business modeling
- **Operational Bridge**: Seamless integration with Operating Model Canvas
- **Graph-Relational**: Enhanced relationship mapping between BMC sections
- **Australian Context**: Industry-specific fields for mining, minerals, petrochemicals
- **Risk Integration**: Critical Controls Theory embedded throughout

## Implementation Phases

### Phase 1: Database Schema Enhancement (Week 1-2)

#### 1.1 Enhanced BMC Section Models
**Priority**: CRITICAL
**Effort**: 3-4 days
**Description**: Extend existing BMC section models with comprehensive data fields

**Implementation Tasks:**
```sql
-- Enhanced ValueProposition model
ALTER TABLE value_propositions ADD COLUMN strategic_objective TEXT;
ALTER TABLE value_propositions ADD COLUMN competitive_advantage TEXT;
ALTER TABLE value_propositions ADD COLUMN unique_selling_point TEXT;
ALTER TABLE value_propositions ADD COLUMN target_customer_segment TEXT;
ALTER TABLE value_propositions ADD COLUMN customer_pain_points TEXT[];
ALTER TABLE value_propositions ADD COLUMN solution_benefits TEXT[];
ALTER TABLE value_propositions ADD COLUMN value_quantification TEXT;
ALTER TABLE value_propositions ADD COLUMN measurable_outcomes TEXT[];
ALTER TABLE value_propositions ADD COLUMN success_criteria TEXT[];
ALTER TABLE value_propositions ADD COLUMN operational_delivery_points TEXT[];
ALTER TABLE value_propositions ADD COLUMN process_dependencies TEXT[];
ALTER TABLE value_propositions ADD COLUMN resource_requirements TEXT[];
ALTER TABLE value_propositions ADD COLUMN critical_controls TEXT[];
ALTER TABLE value_propositions ADD COLUMN risk_mitigation TEXT;
ALTER TABLE value_propositions ADD COLUMN compliance_requirements TEXT[];
ALTER TABLE value_propositions ADD COLUMN value_effectiveness TEXT;
ALTER TABLE value_propositions ADD COLUMN customer_satisfaction DECIMAL;
ALTER TABLE value_propositions ADD COLUMN market_position TEXT;

-- Enhanced CustomerSegment model
ALTER TABLE customer_segments ADD COLUMN customer_type TEXT;
ALTER TABLE customer_segments ADD COLUMN geographic_region TEXT;
ALTER TABLE customer_segments ADD COLUMN industry_sector TEXT;
ALTER TABLE customer_segments ADD COLUMN company_size TEXT;
ALTER TABLE customer_segments ADD COLUMN purchase_behavior TEXT;
ALTER TABLE customer_segments ADD COLUMN usage_patterns TEXT;
ALTER TABLE customer_segments ADD COLUMN decision_factors TEXT[];
ALTER TABLE customer_segments ADD COLUMN loyalty_level TEXT;
ALTER TABLE customer_segments ADD COLUMN revenue_potential DECIMAL;
ALTER TABLE customer_segments ADD COLUMN profitability DECIMAL;
ALTER TABLE customer_segments ADD COLUMN lifetime_value DECIMAL;
ALTER TABLE customer_segments ADD COLUMN acquisition_cost DECIMAL;
ALTER TABLE customer_segments ADD COLUMN service_delivery_channels TEXT[];
ALTER TABLE customer_segments ADD COLUMN support_processes TEXT[];
ALTER TABLE customer_segments ADD COLUMN relationship_management TEXT[];
ALTER TABLE customer_segments ADD COLUMN customer_risk_profile TEXT;
ALTER TABLE customer_segments ADD COLUMN compliance_requirements TEXT[];
ALTER TABLE customer_segments ADD COLUMN data_protection_needs TEXT[];
ALTER TABLE customer_segments ADD COLUMN customer_satisfaction DECIMAL;
ALTER TABLE customer_segments ADD COLUMN retention_rate DECIMAL;
ALTER TABLE customer_segments ADD COLUMN growth_potential TEXT;

-- Enhanced Channel model
ALTER TABLE channels ADD COLUMN channel_type TEXT; -- DIRECT/INDIRECT/PARTNER
ALTER TABLE channels ADD COLUMN reach TEXT;
ALTER TABLE channels ADD COLUMN coverage TEXT;
ALTER TABLE channels ADD COLUMN delivery_method TEXT;
ALTER TABLE channels ADD COLUMN service_level TEXT;
ALTER TABLE channels ADD COLUMN response_time TEXT;
ALTER TABLE channels ADD COLUMN availability TEXT;
ALTER TABLE channels ADD COLUMN channel_cost DECIMAL;
ALTER TABLE channels ADD COLUMN revenue_share DECIMAL;
ALTER TABLE channels ADD COLUMN profitability DECIMAL;
ALTER TABLE channels ADD COLUMN investment_required DECIMAL;
ALTER TABLE channels ADD COLUMN operational_processes TEXT[];
ALTER TABLE channels ADD COLUMN system_dependencies TEXT[];
ALTER TABLE channels ADD COLUMN resource_allocation TEXT[];
ALTER TABLE channels ADD COLUMN channel_risks TEXT[];
ALTER TABLE channels ADD COLUMN quality_controls TEXT[];
ALTER TABLE channels ADD COLUMN compliance_requirements TEXT[];
ALTER TABLE channels ADD COLUMN channel_effectiveness TEXT;
ALTER TABLE channels ADD COLUMN customer_satisfaction DECIMAL;
ALTER TABLE channels ADD COLUMN cost_efficiency DECIMAL;

-- Enhanced RevenueStream model
ALTER TABLE revenue_streams ADD COLUMN pricing_strategy TEXT;
ALTER TABLE revenue_streams ADD COLUMN revenue_model TEXT; -- SUBSCRIPTION/TRANSACTION/LICENSING
ALTER TABLE revenue_streams ADD COLUMN revenue_potential DECIMAL;
ALTER TABLE revenue_streams ADD COLUMN profit_margin DECIMAL;
ALTER TABLE revenue_streams ADD COLUMN cost_structure TEXT;
ALTER TABLE revenue_streams ADD COLUMN break_even_point DECIMAL;
ALTER TABLE revenue_streams ADD COLUMN market_size DECIMAL;
ALTER TABLE revenue_streams ADD COLUMN competitive_position TEXT;
ALTER TABLE revenue_streams ADD COLUMN growth_rate DECIMAL;
ALTER TABLE revenue_streams ADD COLUMN seasonality TEXT;
ALTER TABLE revenue_streams ADD COLUMN revenue_processes TEXT[];
ALTER TABLE revenue_streams ADD COLUMN billing_systems TEXT[];
ALTER TABLE revenue_streams ADD COLUMN collection_procedures TEXT[];
ALTER TABLE revenue_streams ADD COLUMN revenue_risks TEXT[];
ALTER TABLE revenue_streams ADD COLUMN financial_controls TEXT[];
ALTER TABLE revenue_streams ADD COLUMN compliance_requirements TEXT[];
ALTER TABLE revenue_streams ADD COLUMN revenue_growth DECIMAL;
ALTER TABLE revenue_streams ADD COLUMN profitability DECIMAL;
ALTER TABLE revenue_streams ADD COLUMN cash_flow DECIMAL;
ALTER TABLE revenue_streams ADD COLUMN forecast_accuracy DECIMAL;

-- Enhanced Resource model
ALTER TABLE resources ADD COLUMN resource_category TEXT;
ALTER TABLE resources ADD COLUMN criticality TEXT;
ALTER TABLE resources ADD COLUMN uniqueness TEXT;
ALTER TABLE resources ADD COLUMN scarcity TEXT;
ALTER TABLE resources ADD COLUMN capacity TEXT;
ALTER TABLE resources ADD COLUMN utilization DECIMAL;
ALTER TABLE resources ADD COLUMN scalability TEXT;
ALTER TABLE resources ADD COLUMN replacement_cost DECIMAL;
ALTER TABLE resources ADD COLUMN effectiveness TEXT;
ALTER TABLE resources ADD COLUMN efficiency DECIMAL;
ALTER TABLE resources ADD COLUMN reliability DECIMAL;
ALTER TABLE resources ADD COLUMN maintenance_requirements TEXT;
ALTER TABLE resources ADD COLUMN operational_assets TEXT[];
ALTER TABLE resources ADD COLUMN process_dependencies TEXT[];
ALTER TABLE resources ADD COLUMN skill_requirements TEXT[];
ALTER TABLE resources ADD COLUMN resource_risks TEXT[];
ALTER TABLE resources ADD COLUMN protection_measures TEXT[];
ALTER TABLE resources ADD COLUMN backup_plans TEXT[];
ALTER TABLE resources ADD COLUMN optimization_opportunities TEXT[];
ALTER TABLE resources ADD COLUMN improvement_targets TEXT[];
ALTER TABLE resources ADD COLUMN investment_priorities TEXT[];

-- Enhanced Activity model
ALTER TABLE activities ADD COLUMN activity_type TEXT; -- PRODUCTION/PROBLEM_SOLVING/PLATFORM
ALTER TABLE activities ADD COLUMN complexity TEXT;
ALTER TABLE activities ADD COLUMN process_steps TEXT[];
ALTER TABLE activities ADD COLUMN inputs TEXT[];
ALTER TABLE activities ADD COLUMN outputs TEXT[];
ALTER TABLE activities ADD COLUMN dependencies TEXT[];
ALTER TABLE activities ADD COLUMN efficiency DECIMAL;
ALTER TABLE activities ADD COLUMN effectiveness TEXT;
ALTER TABLE activities ADD COLUMN quality TEXT;
ALTER TABLE activities ADD COLUMN cycle_time TEXT;
ALTER TABLE activities ADD COLUMN operational_processes TEXT[];
ALTER TABLE activities ADD COLUMN workflow_mappings TEXT[];
ALTER TABLE activities ADD COLUMN system_integrations TEXT[];
ALTER TABLE activities ADD COLUMN activity_risks TEXT[];
ALTER TABLE activities ADD COLUMN safety_controls TEXT[];
ALTER TABLE activities ADD COLUMN quality_assurance TEXT[];
ALTER TABLE activities ADD COLUMN optimization_opportunities TEXT[];
ALTER TABLE activities ADD COLUMN automation_potential TEXT;
ALTER TABLE activities ADD COLUMN skill_requirements TEXT[];

-- Enhanced Partnership model
ALTER TABLE partnerships ADD COLUMN partnership_model TEXT; -- STRATEGIC/OPERATIONAL/COMPETITIVE
ALTER TABLE partnerships ADD COLUMN exclusivity TEXT;
ALTER TABLE partnerships ADD COLUMN contract_terms TEXT;
ALTER TABLE partnerships ADD COLUMN service_level TEXT;
ALTER TABLE partnerships ADD COLUMN performance_metrics TEXT[];
ALTER TABLE partnerships ADD COLUMN communication TEXT;
ALTER TABLE partnerships ADD COLUMN cost_structure TEXT;
ALTER TABLE partnerships ADD COLUMN revenue_share DECIMAL;
ALTER TABLE partnerships ADD COLUMN investment DECIMAL;
ALTER TABLE partnerships ADD COLUMN risk_sharing TEXT;
ALTER TABLE partnerships ADD COLUMN supplier_processes TEXT[];
ALTER TABLE partnerships ADD COLUMN quality_controls TEXT[];
ALTER TABLE partnerships ADD COLUMN logistics_management TEXT[];
ALTER TABLE partnerships ADD COLUMN supplier_risks TEXT[];
ALTER TABLE partnerships ADD COLUMN compliance_requirements TEXT[];
ALTER TABLE partnerships ADD COLUMN contingency_plans TEXT[];
ALTER TABLE partnerships ADD COLUMN supplier_performance TEXT;
ALTER TABLE partnerships ADD COLUMN relationship_strength TEXT;
ALTER TABLE partnerships ADD COLUMN value_delivery TEXT;

-- Enhanced CostStructure model
ALTER TABLE cost_structures ADD COLUMN cost_type TEXT; -- FIXED/VARIABLE
ALTER TABLE cost_structures ADD COLUMN cost_driver TEXT;
ALTER TABLE cost_structures ADD COLUMN allocation_method TEXT;
ALTER TABLE cost_structures ADD COLUMN budget DECIMAL;
ALTER TABLE cost_structures ADD COLUMN actual DECIMAL;
ALTER TABLE cost_structures ADD COLUMN variance DECIMAL;
ALTER TABLE cost_structures ADD COLUMN trend TEXT;
ALTER TABLE cost_structures ADD COLUMN forecast DECIMAL;
ALTER TABLE cost_structures ADD COLUMN cost_center TEXT;
ALTER TABLE cost_structures ADD COLUMN responsibility TEXT;
ALTER TABLE cost_structures ADD COLUMN controllability TEXT;
ALTER TABLE cost_structures ADD COLUMN efficiency DECIMAL;
ALTER TABLE cost_structures ADD COLUMN cost_processes TEXT[];
ALTER TABLE cost_structures ADD COLUMN budget_systems TEXT[];
ALTER TABLE cost_structures ADD COLUMN expense_controls TEXT[];
ALTER TABLE cost_structures ADD COLUMN cost_risks TEXT[];
ALTER TABLE cost_structures ADD COLUMN budget_controls TEXT[];
ALTER TABLE cost_structures ADD COLUMN approval_procedures TEXT[];
ALTER TABLE cost_structures ADD COLUMN cost_reduction_opportunities TEXT[];
ALTER TABLE cost_structures ADD COLUMN efficiency_targets TEXT[];
ALTER TABLE cost_structures ADD COLUMN investment_priorities TEXT[];
```

#### 1.2 BMC → OMC Integration Tables
**Priority**: CRITICAL
**Effort**: 2-3 days
**Description**: Create integration tables to link BMC sections with OMC components

**Implementation Tasks:**
```sql
-- BMC to OMC Integration Mapping
CREATE TABLE bmc_omc_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_canvas_id TEXT NOT NULL REFERENCES business_canvases(id),
  operating_model_id TEXT NOT NULL REFERENCES operating_models(id),
  bmc_section TEXT NOT NULL, -- value_propositions, customer_segments, etc.
  bmc_item_id TEXT NOT NULL,
  omc_section TEXT NOT NULL, -- suppliers, locations, value_chains, etc.
  omc_item_id TEXT NOT NULL,
  integration_type TEXT NOT NULL, -- DIRECT_MAPPING, DERIVED, INFLUENCES
  integration_strength DECIMAL DEFAULT 1.0, -- 0.0 to 1.0
  integration_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(business_canvas_id, bmc_item_id, omc_item_id)
);

-- BMC Graph Relationships
CREATE TABLE bmc_graph_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_canvas_id TEXT NOT NULL REFERENCES business_canvases(id),
  from_section TEXT NOT NULL,
  from_item_id TEXT NOT NULL,
  to_section TEXT NOT NULL,
  to_item_id TEXT NOT NULL,
  relationship_type TEXT NOT NULL, -- DELIVERS_TO, SUPPORTS, DEPENDS_ON, COMPETES_WITH
  relationship_strength DECIMAL DEFAULT 1.0,
  relationship_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(business_canvas_id, from_section, from_item_id, to_section, to_item_id)
);

-- BMC Critical Controls Integration
CREATE TABLE bmc_critical_controls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_canvas_id TEXT NOT NULL REFERENCES business_canvases(id),
  bmc_section TEXT NOT NULL,
  bmc_item_id TEXT NOT NULL,
  critical_control_id TEXT NOT NULL REFERENCES critical_controls(id),
  control_effectiveness DECIMAL DEFAULT 1.0,
  verification_status TEXT DEFAULT 'PENDING',
  risk_level TEXT DEFAULT 'MEDIUM',
  compliance_requirements TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(business_canvas_id, bmc_item_id, critical_control_id)
);
```

#### 1.3 Australian Business Context Fields
**Priority**: HIGH
**Effort**: 1-2 days
**Description**: Add industry-specific fields for Australian mining and high-risk industries

**Implementation Tasks:**
```sql
-- Enhanced BusinessCanvas with Australian context
ALTER TABLE business_canvases ADD COLUMN whs_requirements TEXT[];
ALTER TABLE business_canvases ADD COLUMN iso_standards TEXT[];
ALTER TABLE business_canvases ADD COLUMN icmm_guidelines TEXT[];
ALTER TABLE business_canvases ADD COLUMN mining_regulations TEXT[];
ALTER TABLE business_canvases ADD COLUMN environmental_compliance TEXT[];
ALTER TABLE business_canvases ADD COLUMN safety_standards TEXT[];
ALTER TABLE business_canvases ADD COLUMN operational_streams TEXT[];
ALTER TABLE business_canvases ADD COLUMN geographic_regions TEXT[];

-- Australian Industry Enums
CREATE TYPE AUSTRALIAN_INDUSTRY_TYPE AS ENUM (
  'MINING_COAL',
  'MINING_METALS',
  'MINING_MINERALS',
  'OIL_GAS',
  'PETROCHEMICALS',
  'DEFENCE',
  'CONSTRUCTION',
  'MANUFACTURING'
);

CREATE TYPE AUSTRALIAN_REGION AS ENUM (
  'NSW',
  'VIC',
  'QLD',
  'WA',
  'SA',
  'TAS',
  'NT',
  'ACT'
);

ALTER TABLE business_canvases ADD COLUMN australian_industry_type AUSTRALIAN_INDUSTRY_TYPE;
ALTER TABLE business_canvases ADD COLUMN australian_regions AUSTRALIAN_REGION[];
```

### Phase 2: TypeScript Type Definitions (Week 2)

#### 2.1 Enhanced BMC Types
**Priority**: CRITICAL
**Effort**: 2-3 days
**Description**: Update TypeScript interfaces to match enhanced database schema

**Implementation Tasks:**
```typescript
// Enhanced CanvasItem interface
export interface EnhancedCanvasItem extends CanvasItem {
  // Strategic Context
  strategicObjective?: string;
  competitiveAdvantage?: string;
  uniqueSellingPoint?: string;
  
  // Operational Integration
  operationalDeliveryPoints?: string[];
  processDependencies?: string[];
  resourceRequirements?: string[];
  
  // Risk & Control
  criticalControls?: string[];
  riskMitigation?: string;
  complianceRequirements?: string[];
  
  // Performance Metrics
  effectiveness?: string;
  efficiency?: number;
  satisfaction?: number;
  
  // Australian Context
  whsRequirements?: string[];
  isoStandards?: string[];
  icmmGuidelines?: string[];
}

// Section-specific interfaces
export interface EnhancedValueProposition extends EnhancedCanvasItem {
  targetCustomerSegment?: string;
  customerPainPoints?: string[];
  solutionBenefits?: string[];
  valueQuantification?: string;
  measurableOutcomes?: string[];
  successCriteria?: string[];
  valueEffectiveness?: string;
  customerSatisfaction?: number;
  marketPosition?: string;
}

export interface EnhancedCustomerSegment extends EnhancedCanvasItem {
  customerType?: string;
  geographicRegion?: string;
  industrySector?: string;
  companySize?: string;
  purchaseBehavior?: string;
  usagePatterns?: string;
  decisionFactors?: string[];
  loyaltyLevel?: string;
  revenuePotential?: number;
  profitability?: number;
  lifetimeValue?: number;
  acquisitionCost?: number;
  serviceDeliveryChannels?: string[];
  supportProcesses?: string[];
  relationshipManagement?: string[];
  customerRiskProfile?: string;
  dataProtectionNeeds?: string[];
  retentionRate?: number;
  growthPotential?: string;
}

// BMC → OMC Integration Types
export interface BMCOMCIntegration {
  id: string;
  businessCanvasId: string;
  operatingModelId: string;
  bmcSection: keyof BusinessModel;
  bmcItemId: string;
  omcSection: keyof OperatingModel;
  omcItemId: string;
  integrationType: 'DIRECT_MAPPING' | 'DERIVED' | 'INFLUENCES';
  integrationStrength: number;
  integrationNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BMCGraphRelationship {
  id: string;
  businessCanvasId: string;
  fromSection: keyof BusinessModel;
  fromItemId: string;
  toSection: keyof BusinessModel;
  toItemId: string;
  relationshipType: 'DELIVERS_TO' | 'SUPPORTS' | 'DEPENDS_ON' | 'COMPETES_WITH';
  relationshipStrength: number;
  relationshipNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BMCCriticalControl {
  id: string;
  businessCanvasId: string;
  bmcSection: keyof BusinessModel;
  bmcItemId: string;
  criticalControlId: string;
  controlEffectiveness: number;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'FAILED' | 'NOT_APPLICABLE';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  complianceRequirements?: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Phase 3: API Endpoints Enhancement (Week 3)

#### 3.1 Enhanced BMC API Routes
**Priority**: CRITICAL
**Effort**: 3-4 days
**Description**: Update API endpoints to handle enhanced data fields and BMC → OMC integration

**Implementation Tasks:**

**Enhanced BMC Section Routes:**
```typescript
// Enhanced value propositions route
// app/api/business-canvas/[id]/value-propositions/route.ts
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  
  const enhancedValueProposition = await prisma.valueProposition.create({
    data: {
      businessCanvasId: params.id,
      description: body.description,
      priority: body.priority,
      // Enhanced fields
      strategicObjective: body.strategicObjective,
      competitiveAdvantage: body.competitiveAdvantage,
      uniqueSellingPoint: body.uniqueSellingPoint,
      targetCustomerSegment: body.targetCustomerSegment,
      customerPainPoints: body.customerPainPoints,
      solutionBenefits: body.solutionBenefits,
      valueQuantification: body.valueQuantification,
      measurableOutcomes: body.measurableOutcomes,
      successCriteria: body.successCriteria,
      operationalDeliveryPoints: body.operationalDeliveryPoints,
      processDependencies: body.processDependencies,
      resourceRequirements: body.resourceRequirements,
      criticalControls: body.criticalControls,
      riskMitigation: body.riskMitigation,
      complianceRequirements: body.complianceRequirements,
      valueEffectiveness: body.valueEffectiveness,
      customerSatisfaction: body.customerSatisfaction,
      marketPosition: body.marketPosition,
    }
  });
  
  return NextResponse.json(enhancedValueProposition);
}
```

**BMC → OMC Integration Routes:**
```typescript
// BMC → OMC Integration API
// app/api/business-canvas/[id]/omc-integrations/route.ts
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  
  const integration = await prisma.bmcOmcIntegration.create({
    data: {
      businessCanvasId: params.id,
      operatingModelId: body.operatingModelId,
      bmcSection: body.bmcSection,
      bmcItemId: body.bmcItemId,
      omcSection: body.omcSection,
      omcItemId: body.omcItemId,
      integrationType: body.integrationType,
      integrationStrength: body.integrationStrength,
      integrationNotes: body.integrationNotes,
    }
  });
  
  return NextResponse.json(integration);
}

// Graph Relationships API
// app/api/business-canvas/[id]/graph-relationships/route.ts
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  
  const relationship = await prisma.bmcGraphRelationship.create({
    data: {
      businessCanvasId: params.id,
      fromSection: body.fromSection,
      fromItemId: body.fromItemId,
      toSection: body.toSection,
      toItemId: body.toItemId,
      relationshipType: body.relationshipType,
      relationshipStrength: body.relationshipStrength,
      relationshipNotes: body.relationshipNotes,
    }
  });
  
  return NextResponse.json(relationship);
}
```

### Phase 4: UI Component Enhancement (Week 4-5)

#### 4.1 Enhanced BMC Section Cards
**Priority**: CRITICAL
**Effort**: 4-5 days
**Description**: Update BMC section cards to display and edit enhanced data fields

**Implementation Tasks:**

**Enhanced Section Card Component:**
```typescript
// Enhanced BMC Section Card
// components/business-canvas/EnhancedSectionCard.tsx
interface EnhancedSectionCardProps {
  section: keyof BusinessModel;
  items: EnhancedCanvasItem[];
  isEditing: boolean;
  onUpdate: (section: keyof BusinessModel, itemId: string, updates: Partial<EnhancedCanvasItem>) => void;
  onDelete: (section: keyof BusinessModel, itemId: string) => void;
  onAdd: (section: keyof BusinessModel, item: Omit<EnhancedCanvasItem, 'id'>) => void;
}

export function EnhancedSectionCard({
  section,
  items,
  isEditing,
  onUpdate,
  onDelete,
  onAdd
}: EnhancedSectionCardProps) {
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const [showOMCIntegration, setShowOMCIntegration] = useState(false);
  
  return (
    <Card className={`${getSectionColor(section)} border-2`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getSectionIcon(section)}
            <CardTitle>{getSectionTitle(section)}</CardTitle>
            <Badge variant="secondary">{items.length}</Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvancedFields(!showAdvancedFields)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOMCIntegration(!showOMCIntegration)}
            >
              <Link className="h-4 w-4" />
            </Button>
            {isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAdd(section, createEmptyItem(section))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {items.map((item) => (
            <EnhancedItemCard
              key={item.id}
              item={item}
              section={section}
              isEditing={isEditing}
              showAdvancedFields={showAdvancedFields}
              showOMCIntegration={showOMCIntegration}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

**Enhanced Item Card Component:**
```typescript
// Enhanced Item Card with Advanced Fields
// components/business-canvas/EnhancedItemCard.tsx
interface EnhancedItemCardProps {
  item: EnhancedCanvasItem;
  section: keyof BusinessModel;
  isEditing: boolean;
  showAdvancedFields: boolean;
  showOMCIntegration: boolean;
  onUpdate: (section: keyof BusinessModel, itemId: string, updates: Partial<EnhancedCanvasItem>) => void;
  onDelete: (section: keyof BusinessModel, itemId: string) => void;
}

export function EnhancedItemCard({
  item,
  section,
  isEditing,
  showAdvancedFields,
  showOMCIntegration,
  onUpdate,
  onDelete
}: EnhancedItemCardProps) {
  return (
    <div className="group relative p-3 bg-white/50 rounded-lg border border-white/20 hover:bg-white/70 transition-colors">
      {/* Basic Information */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-medium text-sm truncate">{item.name || item.title}</h4>
            <Badge variant="outline" className="text-xs">
              {item.priority}
            </Badge>
            {item.criticalControls?.length > 0 && (
              <Badge variant="outline" className="text-xs bg-red-50 text-red-700">
                <Shield className="h-3 w-3 mr-1" />
                {item.criticalControls.length} Controls
              </Badge>
            )}
          </div>
          
          {item.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {item.description}
            </p>
          )}
          
          {/* Strategic Context */}
          {showAdvancedFields && item.strategicObjective && (
            <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
              <div className="font-medium text-blue-800">Strategic Objective</div>
              <div className="text-blue-700">{item.strategicObjective}</div>
            </div>
          )}
          
          {/* OMC Integration Indicators */}
          {showOMCIntegration && (
            <div className="mt-2 flex items-center space-x-2">
              {item.operationalDeliveryPoints?.length > 0 && (
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                  <ArrowRight className="h-3 w-3 mr-1" />
                  {item.operationalDeliveryPoints.length} OMC Links
                </Badge>
              )}
              {item.processDependencies?.length > 0 && (
                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                  <Workflow className="h-3 w-3 mr-1" />
                  {item.processDependencies.length} Processes
                </Badge>
              )}
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {isEditing && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUpdate(section, item.id, {})}
                className="h-6 w-6 p-0"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(section, item.id)}
                className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
```

#### 4.2 BMC → OMC Integration UI
**Priority**: HIGH
**Effort**: 3-4 days
**Description**: Create UI components for BMC → OMC integration management

**Implementation Tasks:**

**Integration Management Panel:**
```typescript
// BMC → OMC Integration Panel
// components/business-canvas/BMCOMCIntegrationPanel.tsx
interface BMCOMCIntegrationPanelProps {
  businessCanvasId: string;
  operatingModelId?: string;
  integrations: BMCOMCIntegration[];
  onIntegrationCreate: (integration: Omit<BMCOMCIntegration, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onIntegrationUpdate: (id: string, updates: Partial<BMCOMCIntegration>) => void;
  onIntegrationDelete: (id: string) => void;
}

export function BMCOMCIntegrationPanel({
  businessCanvasId,
  operatingModelId,
  integrations,
  onIntegrationCreate,
  onIntegrationUpdate,
  onIntegrationDelete
}: BMCOMCIntegrationPanelProps) {
  const [showIntegrationDialog, setShowIntegrationDialog] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<BMCOMCIntegration | null>(null);
  
  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg font-semibold text-blue-900">
              BMC → OMC Integration
            </CardTitle>
            <Badge variant="outline" className="bg-blue-100 text-blue-700">
              {integrations.length} Integrations
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowIntegrationDialog(true)}
            className="border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Integration
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {integrations.map((integration) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              onEdit={() => {
                setSelectedIntegration(integration);
                setShowIntegrationDialog(true);
              }}
              onDelete={() => onIntegrationDelete(integration.id)}
            />
          ))}
        </div>
      </CardContent>
      
      {/* Integration Dialog */}
      <IntegrationDialog
        open={showIntegrationDialog}
        onOpenChange={setShowIntegrationDialog}
        integration={selectedIntegration}
        businessCanvasId={businessCanvasId}
        operatingModelId={operatingModelId}
        onSave={(integration) => {
          if (selectedIntegration) {
            onIntegrationUpdate(selectedIntegration.id, integration);
          } else {
            onIntegrationCreate(integration);
          }
          setShowIntegrationDialog(false);
          setSelectedIntegration(null);
        }}
      />
    </Card>
  );
}
```

### Phase 5: Graph Relationship Visualization (Week 6)

#### 5.1 BMC Graph Relationship UI
**Priority**: HIGH
**Effort**: 3-4 days
**Description**: Create interactive graph visualization for BMC section relationships

**Implementation Tasks:**

**Graph Relationship Component:**
```typescript
// BMC Graph Relationship Visualization
// components/business-canvas/BMCRelationshipGraph.tsx
interface BMCRelationshipGraphProps {
  businessCanvasId: string;
  relationships: BMCGraphRelationship[];
  items: Record<keyof BusinessModel, EnhancedCanvasItem[]>;
  onRelationshipCreate: (relationship: Omit<BMCGraphRelationship, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onRelationshipUpdate: (id: string, updates: Partial<BMCGraphRelationship>) => void;
  onRelationshipDelete: (id: string) => void;
}

export function BMCRelationshipGraph({
  businessCanvasId,
  relationships,
  items,
  onRelationshipCreate,
  onRelationshipUpdate,
  onRelationshipDelete
}: BMCRelationshipGraphProps) {
  const [selectedRelationship, setSelectedRelationship] = useState<BMCGraphRelationship | null>(null);
  const [showRelationshipDialog, setShowRelationshipDialog] = useState(false);
  
  // Build graph data for visualization
  const graphData = useMemo(() => {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    
    // Add nodes for all items
    Object.entries(items).forEach(([section, sectionItems]) => {
      sectionItems.forEach((item) => {
        nodes.push({
          id: `${section}-${item.id}`,
          label: item.name || item.title || 'Untitled',
          type: section,
          data: item
        });
      });
    });
    
    // Add edges for relationships
    relationships.forEach((relationship) => {
      edges.push({
        id: relationship.id,
        source: `${relationship.fromSection}-${relationship.fromItemId}`,
        target: `${relationship.toSection}-${relationship.toItemId}`,
        label: relationship.relationshipType,
        data: relationship
      });
    });
    
    return { nodes, edges };
  }, [items, relationships]);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Network className="h-5 w-5" />
            <CardTitle>BMC Relationships</CardTitle>
            <Badge variant="secondary">{relationships.length} Relationships</Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRelationshipDialog(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Relationship
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-96 border rounded-lg">
          <GraphVisualization
            nodes={graphData.nodes}
            edges={graphData.edges}
            onNodeClick={(node) => {
              // Handle node click
            }}
            onEdgeClick={(edge) => {
              setSelectedRelationship(edge.data);
              setShowRelationshipDialog(true);
            }}
            onEdgeCreate={(source, target) => {
              // Handle edge creation
            }}
          />
        </div>
      </CardContent>
      
      {/* Relationship Dialog */}
      <RelationshipDialog
        open={showRelationshipDialog}
        onOpenChange={setShowRelationshipDialog}
        relationship={selectedRelationship}
        items={items}
        onSave={(relationship) => {
          if (selectedRelationship) {
            onRelationshipUpdate(selectedRelationship.id, relationship);
          } else {
            onRelationshipCreate(relationship);
          }
          setShowRelationshipDialog(false);
          setSelectedRelationship(null);
        }}
      />
    </Card>
  );
}
```

### Phase 6: Critical Controls Integration (Week 7)

#### 6.1 BMC Critical Controls UI
**Priority**: HIGH
**Effort**: 2-3 days
**Description**: Create UI components for BMC → Critical Controls integration

**Implementation Tasks:**

**Critical Controls Integration Component:**
```typescript
// BMC Critical Controls Integration
// components/business-canvas/BMCCriticalControlsPanel.tsx
interface BMCCriticalControlsPanelProps {
  businessCanvasId: string;
  criticalControls: BMCCriticalControl[];
  onControlAssign: (control: Omit<BMCCriticalControl, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onControlUpdate: (id: string, updates: Partial<BMCCriticalControl>) => void;
  onControlRemove: (id: string) => void;
}

export function BMCCriticalControlsPanel({
  businessCanvasId,
  criticalControls,
  onControlAssign,
  onControlUpdate,
  onControlRemove
}: BMCCriticalControlsPanelProps) {
  return (
    <Card className="border-red-200 bg-red-50/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-red-600" />
            <CardTitle className="text-lg font-semibold text-red-900">
              Critical Controls Integration
            </CardTitle>
            <Badge variant="outline" className="bg-red-100 text-red-700">
              {criticalControls.length} Controls
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {criticalControls.map((control) => (
            <CriticalControlCard
              key={control.id}
              control={control}
              onUpdate={(updates) => onControlUpdate(control.id, updates)}
              onRemove={() => onControlRemove(control.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

### Phase 7: Testing and Validation (Week 8)

#### 7.1 Comprehensive Testing
**Priority**: CRITICAL
**Effort**: 3-4 days
**Description**: Implement comprehensive testing for enhanced BMC functionality

**Implementation Tasks:**

**Unit Tests:**
```typescript
// Enhanced BMC Component Tests
// tests/unit/components/EnhancedBMCSectionCard.test.tsx
describe('EnhancedBMCSectionCard', () => {
  it('should render enhanced data fields when showAdvancedFields is true', () => {
    const mockItem: EnhancedValueProposition = {
      id: '1',
      description: 'Test value proposition',
      priority: 'HIGH',
      strategicObjective: 'Test strategic objective',
      competitiveAdvantage: 'Test competitive advantage',
      targetCustomerSegment: 'Test customer segment',
      customerPainPoints: ['Pain point 1', 'Pain point 2'],
      solutionBenefits: ['Benefit 1', 'Benefit 2'],
      criticalControls: ['Control 1', 'Control 2'],
      operationalDeliveryPoints: ['Delivery point 1'],
      processDependencies: ['Process 1'],
    };
    
    render(
      <EnhancedSectionCard
        section="valuePropositions"
        items={[mockItem]}
        isEditing={true}
        showAdvancedFields={true}
        showOMCIntegration={true}
        onUpdate={jest.fn()}
        onDelete={jest.fn()}
        onAdd={jest.fn()}
      />
    );
    
    expect(screen.getByText('Strategic Objective')).toBeInTheDocument();
    expect(screen.getByText('Test strategic objective')).toBeInTheDocument();
    expect(screen.getByText('2 Controls')).toBeInTheDocument();
    expect(screen.getByText('1 OMC Links')).toBeInTheDocument();
  });
});
```

**Integration Tests:**
```typescript
// BMC → OMC Integration Tests
// tests/integration/bmc-omc-integration.test.ts
describe('BMC → OMC Integration', () => {
  it('should create integration between BMC and OMC items', async () => {
    const integration = {
      businessCanvasId: 'bmc-1',
      operatingModelId: 'omc-1',
      bmcSection: 'valuePropositions',
      bmcItemId: 'vp-1',
      omcSection: 'suppliers',
      omcItemId: 'supplier-1',
      integrationType: 'DIRECT_MAPPING',
      integrationStrength: 0.8,
      integrationNotes: 'Test integration'
    };
    
    const response = await request(app)
      .post('/api/business-canvas/bmc-1/omc-integrations')
      .send(integration);
    
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(integration);
  });
});
```

#### 7.2 Performance Optimization
**Priority**: HIGH
**Effort**: 2-3 days
**Description**: Optimize performance for enhanced BMC with large datasets

**Implementation Tasks:**
- Implement pagination for large BMC datasets
- Add database indexing for enhanced fields
- Optimize graph relationship queries
- Implement caching for frequently accessed data
- Add lazy loading for advanced fields

## Success Criteria

### Functional Requirements
- ✅ All 9 BMC sections have enhanced data fields
- ✅ BMC → OMC integration is fully functional
- ✅ Graph relationships are visualized and manageable
- ✅ Critical Controls integration is operational
- ✅ Australian business context is supported
- ✅ Performance meets enterprise standards

### Technical Requirements
- ✅ Database schema supports all enhanced fields
- ✅ TypeScript types are comprehensive and type-safe
- ✅ API endpoints handle all enhanced operations
- ✅ UI components are responsive and accessible
- ✅ Testing coverage exceeds 80%
- ✅ Performance benchmarks are met

### Business Requirements
- ✅ Strategic planning capabilities are enhanced
- ✅ Operational integration is seamless
- ✅ Risk management is embedded throughout
- ✅ Australian industry compliance is supported
- ✅ User experience is intuitive and efficient

## Risk Mitigation

### Technical Risks
- **Database Migration Complexity**: Use incremental migrations with rollback plans
- **Performance Impact**: Implement performance monitoring and optimization
- **Type Safety**: Comprehensive TypeScript testing and validation
- **API Compatibility**: Maintain backward compatibility during transition

### Business Risks
- **User Adoption**: Provide comprehensive training and documentation
- **Data Migration**: Implement data validation and integrity checks
- **Feature Complexity**: Progressive disclosure of advanced features
- **Compliance**: Regular compliance audits and validation

## Timeline Summary

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| Phase 1 | Week 1-2 | Enhanced database schema, integration tables |
| Phase 2 | Week 2 | TypeScript type definitions |
| Phase 3 | Week 3 | Enhanced API endpoints |
| Phase 4 | Week 4-5 | Enhanced UI components |
| Phase 5 | Week 6 | Graph relationship visualization |
| Phase 6 | Week 7 | Critical Controls integration |
| Phase 7 | Week 8 | Testing and validation |

**Total Duration**: 8 weeks
**Total Effort**: 40-50 developer days

## Next Steps

1. **Review and Approval**: Stakeholder review of implementation plan
2. **Resource Allocation**: Assign development team and resources
3. **Environment Setup**: Prepare development and testing environments
4. **Phase 1 Kickoff**: Begin database schema enhancement
5. **Regular Reviews**: Weekly progress reviews and milestone validation

This implementation plan provides a comprehensive roadmap for transforming the Business Model Canvas into a strategic planning tool that seamlessly integrates with the Operating Model Canvas and supports the complex needs of high-risk industries in the Australian context. 