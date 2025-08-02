# Operational Canvas Implementation Plan - CapOpt Platform

> **Related documentation:**
> - Operational Canvas Design: @docs/design/operational-canvas-design.md
> - Solution Architecture: @docs/design/solution-architecture-design.md
> - Product Backlog: @docs/design/product-backlog.md

## Implementation Overview

The Operational Canvas implementation focuses on the **pivotal leverage point** that transforms strategic business models into executable operational frameworks. This implementation emphasizes:

1. **Strategic Data Cascade**: Automatic inheritance from Business Canvas
2. **Master Data Integration**: Industry-specific operational templates
3. **Critical Controls Theory**: Embedded risk management
4. **Multi-Stream Operations**: Complex operational stream management

## Phase 1: Foundation & Strategic Cascade (2-3 weeks)

### 1.1 Database Schema Extensions

#### Operational Canvas Core
```sql
-- Operational Canvas Entity
CREATE TABLE operational_canvas (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  business_canvas_id TEXT REFERENCES business_canvas(id),
  facility_id TEXT REFERENCES facility(id),
  business_unit_id TEXT REFERENCES business_unit(id),
  status canvas_status DEFAULT 'DRAFT',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Strategic Cascade Tracking
CREATE TABLE strategic_cascade (
  id TEXT PRIMARY KEY,
  operational_canvas_id TEXT REFERENCES operational_canvas(id),
  business_canvas_id TEXT REFERENCES business_canvas(id),
  cascade_type cascade_type, -- VALUE_CHAIN, RESOURCES, ACTIVITIES, CONTROLS
  source_data JSONB, -- Original strategic data
  operational_data JSONB, -- Transformed operational data
  cascade_status cascade_status DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Operational Stream Management
CREATE TABLE operational_streams (
  id TEXT PRIMARY KEY,
  operational_canvas_id TEXT REFERENCES operational_canvas(id),
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  type stream_type, -- COPPER, URANIUM, GOLD, SILVER
  facility_id TEXT REFERENCES facility(id),
  business_unit_id TEXT REFERENCES business_unit(id),
  status stream_status DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Master Data Extensions
```sql
-- Process Templates (Master Data)
CREATE TABLE process_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  industry_id TEXT REFERENCES industry(id),
  sector_id TEXT REFERENCES sector(id),
  stream_type stream_type,
  template_data JSONB, -- Process structure and steps
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Control Frameworks (Master Data)
CREATE TABLE control_frameworks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  industry_id TEXT REFERENCES industry(id),
  sector_id TEXT REFERENCES sector(id),
  framework_type control_framework_type, -- OPERATIONAL, COMPLIANCE, SAFETY
  framework_data JSONB, -- Control structure and requirements
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Asset Specifications (Master Data)
CREATE TABLE asset_specifications (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  asset_type asset_type,
  industry_id TEXT REFERENCES industry(id),
  sector_id TEXT REFERENCES sector(id),
  specification_data JSONB, -- Asset specifications and requirements
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 1.2 Strategic Cascade Implementation

#### Cascade Service
```typescript
// services/strategic-cascade.service.ts
export class StrategicCascadeService {
  
  // Cascade Business Canvas to Operational Canvas
  async cascadeBusinessCanvas(businessCanvasId: string, facilityId: string) {
    const businessCanvas = await this.getBusinessCanvas(businessCanvasId);
    const facility = await this.getFacility(facilityId);
    
    // 1. Create Operational Canvas
    const operationalCanvas = await this.createOperationalCanvas({
      businessCanvasId,
      facilityId,
      name: `${businessCanvas.name} - Operational`,
      description: `Operational implementation of ${businessCanvas.name}`
    });
    
    // 2. Cascade Industry/Sector to Operational Streams
    await this.cascadeOperationalStreams(operationalCanvas, businessCanvas);
    
    // 3. Cascade Facility Types to Asset Requirements
    await this.cascadeAssetRequirements(operationalCanvas, businessCanvas);
    
    // 4. Cascade Compliance to Control Frameworks
    await this.cascadeControlFrameworks(operationalCanvas, businessCanvas);
    
    // 5. Cascade Activities to Process Templates
    await this.cascadeProcessTemplates(operationalCanvas, businessCanvas);
    
    return operationalCanvas;
  }
  
  // Cascade Operational Streams based on Industry/Sector
  private async cascadeOperationalStreams(operationalCanvas: OperationalCanvas, businessCanvas: BusinessCanvas) {
    const industry = await this.getIndustry(businessCanvas.industry);
    const sectors = await this.getSectors(businessCanvas.sectors);
    
    // Get master data for operational streams
    const streamTemplates = await this.getStreamTemplates(industry.code, sectors.map(s => s.code));
    
    for (const template of streamTemplates) {
      await this.createOperationalStream({
        operationalCanvasId: operationalCanvas.id,
        name: template.name,
        code: template.code,
        type: template.streamType,
        facilityId: operationalCanvas.facilityId,
        businessUnitId: operationalCanvas.businessUnitId
      });
    }
  }
  
  // Cascade Asset Requirements based on Facility Types
  private async cascadeAssetRequirements(operationalCanvas: OperationalCanvas, businessCanvas: BusinessCanvas) {
    const facilityTypes = businessCanvas.facilityTypes;
    
    for (const facilityType of facilityTypes) {
      const assetSpecs = await this.getAssetSpecifications(facilityType);
      
      for (const spec of assetSpecs) {
        await this.createAssetRequirement({
          operationalCanvasId: operationalCanvas.id,
          specificationId: spec.id,
          name: spec.name,
          type: spec.assetType,
          requirements: spec.specificationData
        });
      }
    }
  }
}
```

### 1.3 Master Data Management

#### Master Data Service
```typescript
// services/master-data.service.ts
export class MasterDataService {
  
  // Get Process Templates for Industry/Sector
  async getProcessTemplates(industryCode: string, sectorCodes: string[]) {
    return await prisma.processTemplate.findMany({
      where: {
        industry: { code: industryCode },
        sector: { code: { in: sectorCodes } },
        isActive: true
      },
      include: {
        industry: true,
        sector: true
      }
    });
  }
  
  // Get Control Frameworks for Industry/Sector
  async getControlFrameworks(industryCode: string, sectorCodes: string[]) {
    return await prisma.controlFramework.findMany({
      where: {
        industry: { code: industryCode },
        sector: { code: { in: sectorCodes } },
        isActive: true
      },
      include: {
        industry: true,
        sector: true
      }
    });
  }
  
  // Get Asset Specifications for Facility Type
  async getAssetSpecifications(facilityType: string) {
    return await prisma.assetSpecification.findMany({
      where: {
        facilityTypes: { has: facilityType },
        isActive: true
      }
    });
  }
}
```

## Phase 2: Process Management (3-4 weeks)

### 2.1 Process Maps Implementation

#### Process Map Structure
```typescript
// types/process.ts
interface ProcessMap {
  id: string;
  name: string;
  description: string;
  operationalCanvasId: string;
  streamId: string;
  templateId?: string; // Reference to master data template
  steps: ProcessStep[];
  inputs: ProcessInput[];
  outputs: ProcessOutput[];
  controls: ProcessControl[];
  risks: ProcessRisk[];
  metrics: ProcessMetric[];
  status: ProcessStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface ProcessStep {
  id: string;
  processMapId: string;
  name: string;
  description: string;
  stepNumber: number;
  stepType: ProcessStepType; // OPERATION, DECISION, DELAY, TRANSPORT
  inputs: ProcessInput[];
  outputs: ProcessOutput[];
  controls: ProcessControl[];
  risks: ProcessRisk[];
  duration: number; // minutes
  resources: Resource[];
  predecessorSteps: string[]; // Step IDs
  successorSteps: string[]; // Step IDs
}
```

#### Process Map API
```typescript
// app/api/process-maps/route.ts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operationalCanvasId, templateId, name, description } = body;
    
    // If template provided, use master data
    if (templateId) {
      const template = await prisma.processTemplate.findUnique({
        where: { id: templateId }
      });
      
      // Create process map from template
      const processMap = await prisma.processMap.create({
        data: {
          operationalCanvasId,
          name: name || template.name,
          description: description || template.description,
          templateId,
          steps: template.templateData.steps,
          inputs: template.templateData.inputs,
          outputs: template.templateData.outputs,
          controls: template.templateData.controls,
          status: 'DRAFT'
        }
      });
      
      return NextResponse.json(processMap);
    }
    
    // Create empty process map
    const processMap = await prisma.processMap.create({
      data: {
        operationalCanvasId,
        name,
        description,
        status: 'DRAFT'
      }
    });
    
    return NextResponse.json(processMap);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create process map' },
      { status: 500 }
    );
  }
}
```

### 2.2 Process Visualization

#### Process Map Component
```typescript
// components/operational/ProcessMapViewer.tsx
export function ProcessMapViewer({ processMap }: { processMap: ProcessMap }) {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  
  return (
    <div className="space-y-6">
      {/* Process Flow Diagram */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Process Flow</h3>
        <ProcessFlowDiagram
          steps={processMap.steps}
          onStepSelect={setSelectedStep}
          selectedStep={selectedStep}
        />
      </div>
      
      {/* Step Details */}
      {selectedStep && (
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Step Details</h3>
          <ProcessStepDetails
            step={processMap.steps.find(s => s.id === selectedStep)!}
            onUpdate={handleStepUpdate}
          />
        </div>
      )}
      
      {/* Process Metrics */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Process Metrics</h3>
        <ProcessMetrics metrics={processMap.metrics} />
      </div>
    </div>
  );
}
```

## Phase 3: Critical Controls Integration (2-3 weeks)

### 3.1 Control Framework Implementation

#### Control Mapping Service
```typescript
// services/control-mapping.service.ts
export class ControlMappingService {
  
  // Map Controls to Process Steps
  async mapControlsToProcess(processMapId: string, controlFrameworkId: string) {
    const processMap = await this.getProcessMap(processMapId);
    const controlFramework = await this.getControlFramework(controlFrameworkId);
    
    // Map controls to appropriate process steps
    for (const control of controlFramework.frameworkData.controls) {
      const targetSteps = this.identifyTargetSteps(processMap.steps, control);
      
      for (const step of targetSteps) {
        await this.createProcessControl({
          processMapId,
          stepId: step.id,
          controlId: control.id,
          controlType: control.type,
          effectiveness: 'PENDING',
          verificationRequired: control.verificationRequired
        });
      }
    }
  }
  
  // Identify which process steps need specific controls
  private identifyTargetSteps(steps: ProcessStep[], control: Control) {
    return steps.filter(step => {
      // Logic to match control requirements with step characteristics
      return this.matchesControlRequirements(step, control);
    });
  }
}
```

### 3.2 Control Effectiveness Monitoring

#### Control Dashboard
```typescript
// components/operational/ControlDashboard.tsx
export function ControlDashboard({ operationalCanvas }: { operationalCanvas: OperationalCanvas }) {
  const [controlMetrics, setControlMetrics] = useState<ControlMetrics[]>([]);
  
  useEffect(() => {
    loadControlMetrics(operationalCanvas.id);
  }, [operationalCanvas.id]);
  
  return (
    <div className="space-y-6">
      {/* Control Effectiveness Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ControlEffectivenessCard
          title="Active Controls"
          count={controlMetrics.filter(c => c.status === 'ACTIVE').length}
          trend="+5%"
        />
        <ControlEffectivenessCard
          title="Effective Controls"
          count={controlMetrics.filter(c => c.effectiveness === 'EFFECTIVE').length}
          trend="+12%"
        />
        <ControlEffectivenessCard
          title="Controls Requiring Attention"
          count={controlMetrics.filter(c => c.effectiveness === 'INEFFECTIVE').length}
          trend="-8%"
        />
      </div>
      
      {/* Control by Process */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Controls by Process</h3>
        <ControlByProcessChart data={controlMetrics} />
      </div>
      
      {/* Risk Integration */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Risk Integration</h3>
        <RiskIntegrationView operationalCanvas={operationalCanvas} />
      </div>
    </div>
  );
}
```

## Phase 4: Asset Management Integration (2-3 weeks)

### 4.1 Asset Lifecycle Management

#### Asset Integration Service
```typescript
// services/asset-integration.service.ts
export class AssetIntegrationService {
  
  // Create Assets from Specifications
  async createAssetsFromSpecifications(operationalCanvasId: string) {
    const operationalCanvas = await this.getOperationalCanvas(operationalCanvasId);
    const assetRequirements = await this.getAssetRequirements(operationalCanvasId);
    
    for (const requirement of assetRequirements) {
      const asset = await this.createAsset({
        operationalCanvasId,
        name: requirement.name,
        type: requirement.type,
        specificationId: requirement.specificationId,
        processId: requirement.processId,
        streamId: requirement.streamId,
        status: 'PLANNED'
      });
      
      // Create asset-specific controls
      await this.createAssetControls(asset.id, requirement.requirements.controls);
      
      // Create asset monitoring setup
      await this.createAssetMonitoring(asset.id, requirement.requirements.monitoring);
    }
  }
  
  // Asset Performance Optimization
  async optimizeAssetPerformance(assetId: string) {
    const asset = await this.getAsset(assetId);
    const performanceData = await this.getAssetPerformance(assetId);
    
    // Analyze performance patterns
    const optimization = await this.analyzeOptimization(performanceData);
    
    // Apply optimization recommendations
    await this.applyOptimization(assetId, optimization);
    
    return optimization;
  }
}
```

## Phase 5: Advanced Features & Integration (3-4 weeks)

### 5.1 Real-time Monitoring

#### Operational Dashboard
```typescript
// components/operational/OperationalDashboard.tsx
export function OperationalDashboard({ operationalCanvas }: { operationalCanvas: OperationalCanvas }) {
  const [realTimeData, setRealTimeData] = useState<RealTimeData>({});
  
  useEffect(() => {
    const interval = setInterval(() => {
      loadRealTimeData(operationalCanvas.id);
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [operationalCanvas.id]);
  
  return (
    <div className="space-y-6">
      {/* Real-time Process Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProcessPerformanceCard data={realTimeData.processPerformance} />
        <AssetPerformanceCard data={realTimeData.assetPerformance} />
      </div>
      
      {/* Control Effectiveness */}
      <ControlEffectivenessCard data={realTimeData.controlEffectiveness} />
      
      {/* Risk Alerts */}
      <RiskAlertsCard alerts={realTimeData.riskAlerts} />
      
      {/* Compliance Status */}
      <ComplianceStatusCard status={realTimeData.complianceStatus} />
    </div>
  );
}
```

### 5.2 Predictive Analytics

#### Predictive Analytics Service
```typescript
// services/predictive-analytics.service.ts
export class PredictiveAnalyticsService {
  
  // Predict Process Performance
  async predictProcessPerformance(processMapId: string, timeframe: string) {
    const historicalData = await this.getHistoricalData(processMapId, timeframe);
    const predictions = await this.analyzeTrends(historicalData);
    
    return {
      predictedCycleTime: predictions.cycleTime,
      predictedEfficiency: predictions.efficiency,
      predictedRisks: predictions.risks,
      recommendations: predictions.recommendations
    };
  }
  
  // Predict Asset Failures
  async predictAssetFailures(assetId: string) {
    const assetData = await this.getAssetData(assetId);
    const failurePredictions = await this.analyzeFailurePatterns(assetData);
    
    return {
      failureProbability: failurePredictions.probability,
      predictedFailureDate: failurePredictions.date,
      recommendedActions: failurePredictions.actions
    };
  }
}
```

## Master Data Strategy Implementation

### 1. Master Data Templates

#### Process Templates
```typescript
// seed/operational/process-templates.ts
export const processTemplates = [
  {
    name: 'Copper Flotation Process',
    description: 'Standard copper flotation process for mining operations',
    industry: 'MINING',
    sector: 'COPPER',
    streamType: 'COPPER',
    templateData: {
      steps: [
        {
          name: 'Crushing & Grinding',
          stepType: 'OPERATION',
          duration: 120,
          inputs: ['Ore'],
          outputs: ['Ground Ore'],
          controls: ['Particle Size Control', 'Moisture Control'],
          risks: ['Equipment Failure', 'Over-grinding']
        },
        {
          name: 'Flotation',
          stepType: 'OPERATION',
          duration: 180,
          inputs: ['Ground Ore', 'Reagents'],
          outputs: ['Copper Concentrate', 'Tailings'],
          controls: ['pH Control', 'Reagent Dosage', 'Air Flow'],
          risks: ['Poor Recovery', 'High Reagent Consumption']
        }
      ],
      inputs: ['Copper Ore', 'Flotation Reagents', 'Water'],
      outputs: ['Copper Concentrate', 'Tailings'],
      controls: ['Process Control System', 'Quality Control', 'Environmental Controls'],
      metrics: ['Recovery Rate', 'Concentrate Grade', 'Processing Cost']
    }
  }
];
```

#### Control Frameworks
```typescript
// seed/operational/control-frameworks.ts
export const controlFrameworks = [
  {
    name: 'Mining Operational Controls',
    description: 'Comprehensive control framework for mining operations',
    industry: 'MINING',
    sector: 'COPPER',
    frameworkType: 'OPERATIONAL',
    frameworkData: {
      controls: [
        {
          name: 'Process Control System',
          type: 'ENGINEERING',
          category: 'PREVENTIVE',
          effectiveness: 'HIGH',
          verificationRequired: true,
          frequency: 'CONTINUOUS'
        },
        {
          name: 'Quality Control',
          type: 'ADMINISTRATIVE',
          category: 'DETECTIVE',
          effectiveness: 'MEDIUM',
          verificationRequired: true,
          frequency: 'DAILY'
        },
        {
          name: 'Environmental Controls',
          type: 'ENGINEERING',
          category: 'PREVENTIVE',
          effectiveness: 'HIGH',
          verificationRequired: true,
          frequency: 'CONTINUOUS'
        }
      ]
    }
  }
];
```

### 2. Data Cascade Implementation

#### Cascade Triggers
```typescript
// hooks/use-strategic-cascade.ts
export function useStrategicCascade() {
  const [cascadeStatus, setCascadeStatus] = useState<CascadeStatus>('IDLE');
  
  const triggerCascade = async (businessCanvasId: string, facilityId: string) => {
    setCascadeStatus('PROCESSING');
    
    try {
      const result = await strategicCascadeService.cascadeBusinessCanvas(businessCanvasId, facilityId);
      setCascadeStatus('COMPLETED');
      return result;
    } catch (error) {
      setCascadeStatus('FAILED');
      throw error;
    }
  };
  
  return {
    cascadeStatus,
    triggerCascade
  };
}
```

## Success Metrics & KPIs

### Operational Efficiency Metrics
- **Process Cycle Time**: Target 15% reduction
- **Resource Utilization**: Target 20% improvement
- **Error Reduction**: Target 25% decrease in operational errors
- **Compliance Rate**: Target 95% regulatory compliance

### Strategic Alignment Metrics
- **Strategic Execution**: 90% alignment between strategic plans and operational execution
- **Risk Management**: 80% improvement in risk identification and mitigation
- **Performance Visibility**: Real-time visibility into 100% of critical processes
- **Continuous Improvement**: 50% increase in improvement initiatives

### Customer Value Metrics
- **Operational Excellence**: 20% improvement in operational performance
- **Risk Reduction**: 30% reduction in operational risks
- **Compliance Assurance**: 100% audit readiness
- **Knowledge Management**: 40% improvement in knowledge sharing

## Next Steps

1. **Review and Approve Design**: Stakeholder review of operational canvas design
2. **Database Schema Implementation**: Create operational canvas database schema
3. **API Development**: Implement operational canvas API endpoints
4. **Frontend Development**: Build operational canvas UI components
5. **Master Data Population**: Populate master data templates
6. **Integration Testing**: Test strategic cascade and operational execution
7. **User Acceptance Testing**: Validate with end users and stakeholders

The Operational Canvas implementation represents a critical milestone in the CapOpt Platform, providing the pivotal leverage point that transforms strategic vision into operational reality while maintaining embedded Critical Controls Theory for comprehensive risk management. 