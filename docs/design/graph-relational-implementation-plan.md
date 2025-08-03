# Graph-Relational Hybrid Implementation Plan

> **Related documentation:**
> - Data Architecture Strategy: @docs/design/capopt-platform-data-architecture-strategy.md
> - Solution Architecture: @docs/design/solution-architecture-design.md
> - Reference Architecture: @docs/design/reference-architecture.md
> - Product Backlog: @docs/design/product-backlog.md

## Executive Summary

This implementation plan provides a comprehensive roadmap for migrating the CapOpt Platform to the **Graph-Relational Hybrid** architecture. The plan includes database schema updates, master data migration, seed data population, API development, and UI enhancements.

**Timeline**: 8-10 weeks total implementation
**Risk Level**: Medium (requires careful data migration and testing)
**Dependencies**: PostgreSQL with graph extensions, Prisma ORM updates

---

## Phase 1: Database Foundation (Week 1-2)

### 1.1 Database Schema Updates

#### **Core Graph Tables**
```sql
-- Create core graph structure
CREATE EXTENSION IF NOT EXISTS ltree;

CREATE TABLE nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  label TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE edges (
  from_id UUID REFERENCES nodes(id) ON DELETE CASCADE,
  to_id UUID REFERENCES nodes(id) ON DELETE CASCADE,
  relation_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (from_id, to_id, relation_type)
);

-- Add hierarchical paths to existing tables
ALTER TABLE business_canvases ADD COLUMN hierarchy_path LTREE;
ALTER TABLE operating_models ADD COLUMN hierarchy_path LTREE;
ALTER TABLE processes ADD COLUMN hierarchy_path LTREE;
ALTER TABLE enterprises ADD COLUMN hierarchy_path LTREE;
ALTER TABLE facilities ADD COLUMN hierarchy_path LTREE;
ALTER TABLE business_units ADD COLUMN hierarchy_path LTREE;
ALTER TABLE departments ADD COLUMN hierarchy_path LTREE;
```

#### **Graph Indexes**
```sql
-- Graph indexes for efficient traversal
CREATE INDEX idx_nodes_type_label ON nodes USING GIN (type, label);
CREATE INDEX idx_edges_relation_type ON edges USING GIN (relation_type);
CREATE INDEX idx_edges_metadata ON edges USING GIN (metadata);

-- Hierarchical indexes for LTREE
CREATE INDEX idx_business_canvas_hierarchy ON business_canvases USING GIST (hierarchy_path);
CREATE INDEX idx_operating_model_hierarchy ON operating_models USING GIST (hierarchy_path);
CREATE INDEX idx_process_hierarchy ON processes USING GIST (hierarchy_path);
CREATE INDEX idx_enterprise_hierarchy ON enterprises USING GIST (hierarchy_path);
CREATE INDEX idx_facility_hierarchy ON facilities USING GIST (hierarchy_path);
CREATE INDEX idx_business_unit_hierarchy ON business_units USING GIST (hierarchy_path);
CREATE INDEX idx_department_hierarchy ON departments USING GIST (hierarchy_path);

-- JSONB indexes for metadata queries
CREATE INDEX idx_nodes_metadata ON nodes USING GIN (metadata);
CREATE INDEX idx_edges_metadata ON edges USING GIN (metadata);
```

### 1.2 Prisma Schema Updates

#### **Update schema.prisma**
```prisma
// Add graph models to existing schema
model Node {
  id        String   @id @default(cuid())
  type      String
  label     String
  metadata  Json     @default("{}")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relationships
  outgoingEdges Edge[] @relation("FromNode")
  incomingEdges Edge[] @relation("ToNode")

  @@map("nodes")
}

model Edge {
  fromId       String
  toId         String
  relationType String
  metadata     Json     @default("{}")
  createdAt    DateTime @default(now())

  // Relationships
  fromNode Node @relation("FromNode", fields: [fromId], references: [id], onDelete: Cascade)
  toNode   Node @relation("ToNode", fields: [toId], references: [id], onDelete: Cascade)

  @@id([fromId, toId, relationType])
  @@map("edges")
}

// Update existing models with hierarchy paths
model BusinessCanvas {
  // ... existing fields
  hierarchyPath String? // LTREE path
  graphNodeId   String? // Reference to graph node
}

model OperatingModel {
  // ... existing fields
  hierarchyPath String? // LTREE path
  graphNodeId   String? // Reference to graph node
}

model Process {
  // ... existing fields
  hierarchyPath String? // LTREE path
  graphNodeId   String? // Reference to graph node
}
```

---

## Phase 2: Master Data Migration (Week 2-3)

### 2.1 Master Data Centralization

#### **Create Master Data Tables**
```sql
-- Centralized master data tables
CREATE TABLE master_roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  metadata JSONB DEFAULT '{}',
  graph_node_id UUID REFERENCES nodes(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE master_systems (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  system_type TEXT,
  vendor TEXT,
  metadata JSONB DEFAULT '{}',
  graph_node_id UUID REFERENCES nodes(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE master_vendors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  contact_info JSONB,
  metadata JSONB DEFAULT '{}',
  graph_node_id UUID REFERENCES nodes(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE master_hazards (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  hazard_type TEXT,
  severity_level TEXT,
  metadata JSONB DEFAULT '{}',
  graph_node_id UUID REFERENCES nodes(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE master_controls (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  control_type TEXT,
  effectiveness_level TEXT,
  metadata JSONB DEFAULT '{}',
  graph_node_id UUID REFERENCES nodes(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Master Data Migration Script**
```typescript
// scripts/migrate-master-data.ts
import { PrismaClient } from '@prisma/client';
import { GraphService } from '../lib/services/graph.service';

const prisma = new PrismaClient();
const graphService = new GraphService();

export async function migrateMasterData() {
  console.log('Starting master data migration...');

  // Migrate roles
  const roles = await prisma.role.findMany();
  for (const role of roles) {
    // Create graph node
    const graphNode = await graphService.createNode({
      type: 'role',
      label: role.name,
      metadata: {
        description: role.description,
        category: role.category,
        originalId: role.id
      }
    });

    // Create master role
    await prisma.masterRole.create({
      data: {
        id: role.id,
        name: role.name,
        description: role.description,
        category: role.category,
        graphNodeId: graphNode.id
      }
    });
  }

  // Migrate systems (from existing data)
  const systems = await prisma.system.findMany();
  for (const system of systems) {
    const graphNode = await graphService.createNode({
      type: 'system',
      label: system.name,
      metadata: {
        description: system.description,
        systemType: system.systemType,
        vendor: system.vendor,
        originalId: system.id
      }
    });

    await prisma.masterSystem.create({
      data: {
        id: system.id,
        name: system.name,
        description: system.description,
        systemType: system.systemType,
        vendor: system.vendor,
        graphNodeId: graphNode.id
      }
    });
  }

  console.log('Master data migration completed');
}
```

### 2.2 Graph Node Creation for Existing Entities

#### **Entity to Graph Node Migration**
```typescript
// scripts/migrate-entities-to-graph.ts
export async function migrateEntitiesToGraph() {
  console.log('Migrating entities to graph nodes...');

  // Migrate enterprises
  const enterprises = await prisma.enterprise.findMany();
  for (const enterprise of enterprises) {
    const graphNode = await graphService.createNode({
      type: 'enterprise',
      label: enterprise.name,
      metadata: {
        legalName: enterprise.legalName,
        abn: enterprise.abn,
        industry: enterprise.industry,
        sector: enterprise.sector,
        originalId: enterprise.id
      }
    });

    // Update enterprise with graph node reference
    await prisma.enterprise.update({
      where: { id: enterprise.id },
      data: { graphNodeId: graphNode.id }
    });
  }

  // Migrate facilities
  const facilities = await prisma.facility.findMany();
  for (const facility of facilities) {
    const graphNode = await graphService.createNode({
      type: 'facility',
      label: facility.name,
      metadata: {
        code: facility.code,
        type: facility.type,
        status: facility.status,
        location: facility.location,
        capacity: facility.capacity,
        originalId: facility.id
      }
    });

    await prisma.facility.update({
      where: { id: facility.id },
      data: { graphNodeId: graphNode.id }
    });
  }

  // Migrate business canvases
  const canvases = await prisma.businessCanvas.findMany();
  for (const canvas of canvases) {
    const graphNode = await graphService.createNode({
      type: 'business_canvas',
      label: canvas.name,
      metadata: {
        description: canvas.description,
        industry: canvas.industry,
        sectors: canvas.sectors,
        status: canvas.status,
        originalId: canvas.id
      }
    });

    await prisma.businessCanvas.update({
      where: { id: canvas.id },
      data: { graphNodeId: graphNode.id }
    });
  }

  console.log('Entity to graph migration completed');
}
```

---

## Phase 3: Relationship Migration (Week 3-4)

### 3.1 Create Graph Relationships

#### **Organizational Hierarchy Relationships**
```typescript
// scripts/create-hierarchy-relationships.ts
export async function createHierarchyRelationships() {
  console.log('Creating hierarchy relationships...');

  // Enterprise -> Facility relationships
  const facilities = await prisma.facility.findMany({
    include: { enterprise: true }
  });

  for (const facility of facilities) {
    if (facility.enterprise?.graphNodeId && facility.graphNodeId) {
      await graphService.createEdge({
        fromId: facility.enterprise.graphNodeId,
        toId: facility.graphNodeId,
        relationType: 'operates',
        metadata: {
          relationshipType: 'ownership',
          capacity: facility.capacity,
          type: facility.type
        }
      });
    }
  }

  // Facility -> Business Unit relationships
  const businessUnits = await prisma.businessUnit.findMany({
    include: { facility: true }
  });

  for (const unit of businessUnits) {
    if (unit.facility?.graphNodeId && unit.graphNodeId) {
      await graphService.createEdge({
        fromId: unit.facility.graphNodeId,
        toId: unit.graphNodeId,
        relationType: 'contains',
        metadata: {
          relationshipType: 'operational',
          budget: unit.budget,
          type: unit.type
        }
      });
    }
  }

  // Business Unit -> Department relationships
  const departments = await prisma.department.findMany({
    include: { businessUnit: true }
  });

  for (const dept of departments) {
    if (dept.businessUnit?.graphNodeId && dept.graphNodeId) {
      await graphService.createEdge({
        fromId: dept.businessUnit.graphNodeId,
        toId: dept.graphNodeId,
        relationType: 'manages',
        metadata: {
          relationshipType: 'operational',
          employeeCount: dept.employeeCount,
          type: dept.type
        }
      });
    }
  }

  console.log('Hierarchy relationships created');
}
```

#### **Business Canvas Relationships**
```typescript
// scripts/create-canvas-relationships.ts
export async function createCanvasRelationships() {
  console.log('Creating canvas relationships...');

  const canvases = await prisma.businessCanvas.findMany({
    include: {
      valuePropositions: true,
      customerSegments: true,
      revenueStreams: true,
      partnerships: true,
      resources: true,
      activities: true,
      costStructures: true,
      channels: true
    }
  });

  for (const canvas of canvases) {
    if (!canvas.graphNodeId) continue;

    // Canvas -> Value Proposition relationships
    for (const vp of canvas.valuePropositions) {
      if (vp.graphNodeId) {
        await graphService.createEdge({
          fromId: canvas.graphNodeId,
          toId: vp.graphNodeId,
          relationType: 'contains',
          metadata: { block: 'value_proposition' }
        });
      }
    }

    // Value Proposition -> Customer Segment relationships
    for (const vp of canvas.valuePropositions) {
      for (const cs of canvas.customerSegments) {
        if (vp.graphNodeId && cs.graphNodeId) {
          await graphService.createEdge({
            fromId: vp.graphNodeId,
            toId: cs.graphNodeId,
            relationType: 'serves',
            metadata: { fitScore: 0.85 }
          });
        }
      }
    }

    // Add more canvas relationships...
  }

  console.log('Canvas relationships created');
}
```

### 3.2 Hierarchical Path Generation

#### **LTREE Path Generation**
```typescript
// scripts/generate-hierarchy-paths.ts
export async function generateHierarchyPaths() {
  console.log('Generating hierarchy paths...');

  // Generate enterprise hierarchy paths
  const enterprises = await prisma.enterprise.findMany();
  for (const enterprise of enterprises) {
    await prisma.enterprise.update({
      where: { id: enterprise.id },
      data: { hierarchyPath: enterprise.id }
    });
  }

  // Generate facility hierarchy paths
  const facilities = await prisma.facility.findMany({
    include: { enterprise: true }
  });
  for (const facility of facilities) {
    const path = `${facility.enterprise.id}.${facility.id}`;
    await prisma.facility.update({
      where: { id: facility.id },
      data: { hierarchyPath: path }
    });
  }

  // Generate business unit hierarchy paths
  const businessUnits = await prisma.businessUnit.findMany({
    include: { facility: true }
  });
  for (const unit of businessUnits) {
    const path = `${unit.facility.enterprise.id}.${unit.facility.id}.${unit.id}`;
    await prisma.businessUnit.update({
      where: { id: unit.id },
      data: { hierarchyPath: path }
    });
  }

  console.log('Hierarchy paths generated');
}
```

---

## Phase 4: API Development (Week 4-6)

### 4.1 Graph Service Layer

#### **Core Graph Service**
```typescript
// lib/services/graph.service.ts
export class GraphService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createNode(data: CreateNodeData): Promise<Node> {
    return await this.prisma.node.create({
      data: {
        type: data.type,
        label: data.label,
        metadata: data.metadata || {}
      }
    });
  }

  async createEdge(data: CreateEdgeData): Promise<Edge> {
    return await this.prisma.edge.create({
      data: {
        fromId: data.fromId,
        toId: data.toId,
        relationType: data.relationType,
        metadata: data.metadata || {}
      }
    });
  }

  async getNodeRelationships(nodeId: string, relationType?: string) {
    const where = relationType 
      ? { fromId: nodeId, relationType }
      : { fromId: nodeId };

    return await this.prisma.edge.findMany({
      where,
      include: {
        toNode: true
      }
    });
  }

  async traverseGraph(startNodeId: string, maxDepth: number = 3) {
    // Implement recursive graph traversal
    const visited = new Set<string>();
    const queue = [{ nodeId: startNodeId, depth: 0 }];
    const result: any[] = [];

    while (queue.length > 0) {
      const { nodeId, depth } = queue.shift()!;
      
      if (visited.has(nodeId) || depth > maxDepth) continue;
      visited.add(nodeId);

      const node = await this.prisma.node.findUnique({
        where: { id: nodeId }
      });

      if (node) {
        result.push({ node, depth });

        const edges = await this.prisma.edge.findMany({
          where: { fromId: nodeId }
        });

        for (const edge of edges) {
          queue.push({ nodeId: edge.toId, depth: depth + 1 });
        }
      }
    }

    return result;
  }
}
```

#### **Hybrid Query Service**
```typescript
// lib/services/hybrid-query.service.ts
export class HybridQueryService {
  private prisma: PrismaClient;
  private graphService: GraphService;

  constructor() {
    this.prisma = new PrismaClient();
    this.graphService = new GraphService();
  }

  async getBusinessCanvasWithRelationships(canvasId: string) {
    // Relational query for core data
    const canvas = await this.prisma.businessCanvas.findUnique({
      where: { id: canvasId },
      include: {
        valuePropositions: true,
        customerSegments: true,
        revenueStreams: true,
        partnerships: true,
        resources: true,
        activities: true,
        costStructures: true,
        channels: true
      }
    });

    if (!canvas?.graphNodeId) return canvas;

    // Graph query for relationships
    const relationships = await this.graphService.getNodeRelationships(canvas.graphNodeId);

    return {
      ...canvas,
      relationships
    };
  }

  async getProcessWithControls(processId: string) {
    // Relational query
    const process = await this.prisma.process.findUnique({
      where: { id: processId },
      include: {
        steps: true,
        metrics: true
      }
    });

    if (!process?.graphNodeId) return process;

    // Graph query for controls
    const controlRelationships = await this.prisma.edge.findMany({
      where: {
        fromId: process.graphNodeId,
        relationType: 'controls'
      },
      include: {
        toNode: true
      }
    });

    return {
      ...process,
      controls: controlRelationships.map(r => r.toNode)
    };
  }

  async getRiskPropagationPath(riskId: string) {
    // Graph traversal for risk propagation
    return await this.graphService.traverseGraph(riskId, 5);
  }
}
```

### 4.2 API Endpoints

#### **Graph API Routes**
```typescript
// app/api/graph/nodes/route.ts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const label = searchParams.get('label');

  const where: any = {};
  if (type) where.type = type;
  if (label) where.label = { contains: label, mode: 'insensitive' };

  const nodes = await prisma.node.findMany({
    where,
    include: {
      outgoingEdges: {
        include: { toNode: true }
      }
    }
  });

  return NextResponse.json(nodes);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const graphService = new GraphService();

  const node = await graphService.createNode(body);
  return NextResponse.json(node);
}

// app/api/graph/edges/route.ts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fromId = searchParams.get('fromId');
  const toId = searchParams.get('toId');
  const relationType = searchParams.get('relationType');

  const where: any = {};
  if (fromId) where.fromId = fromId;
  if (toId) where.toId = toId;
  if (relationType) where.relationType = relationType;

  const edges = await prisma.edge.findMany({
    where,
    include: {
      fromNode: true,
      toNode: true
    }
  });

  return NextResponse.json(edges);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const graphService = new GraphService();

  const edge = await graphService.createEdge(body);
  return NextResponse.json(edge);
}

// app/api/graph/traverse/route.ts
export async function POST(request: NextRequest) {
  const { nodeId, maxDepth } = await request.json();
  const graphService = new GraphService();

  const traversal = await graphService.traverseGraph(nodeId, maxDepth);
  return NextResponse.json(traversal);
}
```

#### **Enhanced Business Canvas API**
```typescript
// app/api/business-canvas/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const hybridService = new HybridQueryService();
  const canvas = await hybridService.getBusinessCanvasWithRelationships(params.id);
  
  return NextResponse.json(canvas);
}

// app/api/business-canvas/[id]/relationships/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const canvas = await prisma.businessCanvas.findUnique({
    where: { id: params.id }
  });

  if (!canvas?.graphNodeId) {
    return NextResponse.json({ relationships: [] });
  }

  const relationships = await prisma.edge.findMany({
    where: { fromId: canvas.graphNodeId },
    include: {
      toNode: true
    }
  });

  return NextResponse.json({ relationships });
}
```

---

## Phase 5: UI Development (Week 6-8)

### 5.1 Graph Visualization Components

#### **Graph Visualization Component**
```typescript
// components/graph/GraphVisualization.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface GraphNode {
  id: string;
  type: string;
  label: string;
  metadata: any;
}

interface GraphEdge {
  fromId: string;
  toId: string;
  relationType: string;
  metadata: any;
}

interface GraphVisualizationProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  width?: number;
  height?: number;
  onNodeClick?: (node: GraphNode) => void;
  onEdgeClick?: (edge: GraphEdge) => void;
}

export function GraphVisualization({
  nodes,
  edges,
  width = 800,
  height = 600,
  onNodeClick,
  onEdgeClick
}: GraphVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !nodes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges).id((d: any) => d.id))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Create links
    const link = svg.append('g')
      .selectAll('line')
      .data(edges)
      .enter().append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2)
      .on('click', (event, d) => onEdgeClick?.(d));

    // Create nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('r', 8)
      .attr('fill', (d: any) => getNodeColor(d.type))
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      .on('click', (event, d) => onNodeClick?.(d));

    // Add labels
    const label = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .enter().append('text')
      .text((d: any) => d.label)
      .attr('font-size', '12px')
      .attr('dx', 12)
      .attr('dy', 4);

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      label
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    function getNodeColor(type: string): string {
      const colors: Record<string, string> = {
        enterprise: '#3b82f6',
        facility: '#10b981',
        business_canvas: '#f59e0b',
        process: '#ef4444',
        control: '#8b5cf6',
        risk: '#f97316'
      };
      return colors[type] || '#6b7280';
    }

    return () => {
      simulation.stop();
    };
  }, [nodes, edges, width, height, onNodeClick, onEdgeClick]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="border border-gray-200 rounded-lg"
    />
  );
}
```

#### **Relationship Panel Component**
```typescript
// components/graph/RelationshipPanel.tsx
interface RelationshipPanelProps {
  node: GraphNode | null;
  relationships: GraphEdge[];
  onRelationshipClick: (edge: GraphEdge) => void;
}

export function RelationshipPanel({
  node,
  relationships,
  onRelationshipClick
}: RelationshipPanelProps) {
  if (!node) {
    return (
      <div className="p-4 border border-gray-200 rounded-lg">
        <p className="text-gray-500">Select a node to view relationships</p>
      </div>
    );
  }

  const groupedRelationships = relationships.reduce((acc, edge) => {
    if (!acc[edge.relationType]) {
      acc[edge.relationType] = [];
    }
    acc[edge.relationType].push(edge);
    return acc;
  }, {} as Record<string, GraphEdge[]>);

  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">
        Relationships for {node.label}
      </h3>
      
      {Object.entries(groupedRelationships).map(([type, edges]) => (
        <div key={type} className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2 capitalize">
            {type.replace(/_/g, ' ')} ({edges.length})
          </h4>
          <div className="space-y-2">
            {edges.map((edge) => (
              <div
                key={`${edge.fromId}-${edge.toId}-${edge.relationType}`}
                className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                onClick={() => onRelationshipClick(edge)}
              >
                <div className="text-sm font-medium">
                  {edge.toNode?.label || 'Unknown Node'}
                </div>
                <div className="text-xs text-gray-500">
                  {edge.metadata?.description || 'No description'}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### 5.2 Enhanced Business Canvas with Graph Integration

#### **Updated Business Canvas Component**
```typescript
// components/business-canvas/BusinessModelCanvas.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { GraphVisualization } from '../graph/GraphVisualization';
import { RelationshipPanel } from '../graph/RelationshipPanel';

interface BusinessModelCanvasProps {
  canvasId: string;
}

export function BusinessModelCanvas({ canvasId }: BusinessModelCanvasProps) {
  const [canvas, setCanvas] = useState<any>(null);
  const [relationships, setRelationships] = useState<any[]>([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [showGraph, setShowGraph] = useState(false);

  useEffect(() => {
    fetchCanvasData();
  }, [canvasId]);

  const fetchCanvasData = async () => {
    try {
      const response = await fetch(`/api/business-canvas/${canvasId}`);
      const data = await response.json();
      setCanvas(data);
    } catch (error) {
      console.error('Error fetching canvas:', error);
    }
  };

  const fetchRelationships = async () => {
    try {
      const response = await fetch(`/api/business-canvas/${canvasId}/relationships`);
      const data = await response.json();
      setRelationships(data.relationships);
    } catch (error) {
      console.error('Error fetching relationships:', error);
    }
  };

  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
  };

  const handleRelationshipClick = (edge: any) => {
    // Navigate to related node or show details
    console.log('Relationship clicked:', edge);
  };

  const toggleGraphView = () => {
    setShowGraph(!showGraph);
    if (!showGraph) {
      fetchRelationships();
    }
  };

  if (!canvas) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Canvas Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{canvas.name}</h1>
        <button
          onClick={toggleGraphView}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showGraph ? 'Show Canvas' : 'Show Graph'}
        </button>
      </div>

      {showGraph ? (
        /* Graph View */
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <GraphVisualization
              nodes={relationships.map(r => r.toNode).filter(Boolean)}
              edges={relationships}
              onNodeClick={handleNodeClick}
              onEdgeClick={handleRelationshipClick}
              width={600}
              height={400}
            />
          </div>
          <div>
            <RelationshipPanel
              node={selectedNode}
              relationships={relationships.filter(r => 
                selectedNode ? r.fromId === selectedNode.id : false
              )}
              onRelationshipClick={handleRelationshipClick}
            />
          </div>
        </div>
      ) : (
        /* Traditional Canvas View */
        <div className="grid grid-cols-3 gap-4">
          {/* Existing canvas blocks */}
          <div className="col-span-1 bg-blue-50 p-4 rounded">
            <h3 className="font-semibold mb-2">Value Propositions</h3>
            {canvas.valuePropositions?.map((vp: any) => (
              <div key={vp.id} className="mb-2 p-2 bg-white rounded">
                {vp.name}
              </div>
            ))}
          </div>
          {/* Add other canvas blocks... */}
        </div>
      )}
    </div>
  );
}
```

---

## Phase 6: Testing & Validation (Week 8-9)

### 6.1 Data Migration Testing

#### **Migration Validation Script**
```typescript
// scripts/validate-migration.ts
export async function validateMigration() {
  console.log('Validating migration...');

  // Validate graph nodes
  const nodeCount = await prisma.node.count();
  console.log(`Total graph nodes: ${nodeCount}`);

  // Validate graph edges
  const edgeCount = await prisma.edge.count();
  console.log(`Total graph edges: ${edgeCount}`);

  // Validate entity references
  const entitiesWithGraphNodes = await prisma.businessCanvas.count({
    where: { graphNodeId: { not: null } }
  });
  console.log(`Business canvases with graph nodes: ${entitiesWithGraphNodes}`);

  // Validate hierarchy paths
  const entitiesWithHierarchy = await prisma.businessCanvas.count({
    where: { hierarchyPath: { not: null } }
  });
  console.log(`Business canvases with hierarchy paths: ${entitiesWithHierarchy}`);

  // Test graph queries
  const testNode = await prisma.node.findFirst();
  if (testNode) {
    const relationships = await prisma.edge.findMany({
      where: { fromId: testNode.id }
    });
    console.log(`Test node relationships: ${relationships.length}`);
  }

  console.log('Migration validation completed');
}
```

### 6.2 Performance Testing

#### **Graph Query Performance Tests**
```typescript
// scripts/performance-test.ts
export async function performanceTest() {
  console.log('Running performance tests...');

  const startTime = Date.now();

  // Test graph traversal
  const testNode = await prisma.node.findFirst();
  if (testNode) {
    const traversalStart = Date.now();
    const graphService = new GraphService();
    await graphService.traverseGraph(testNode.id, 3);
    const traversalTime = Date.now() - traversalStart;
    console.log(`Graph traversal time: ${traversalTime}ms`);
  }

  // Test hybrid queries
  const hybridStart = Date.now();
  const hybridService = new HybridQueryService();
  const canvases = await prisma.businessCanvas.findMany({ take: 10 });
  for (const canvas of canvases) {
    await hybridService.getBusinessCanvasWithRelationships(canvas.id);
  }
  const hybridTime = Date.now() - hybridStart;
  console.log(`Hybrid queries time: ${hybridTime}ms`);

  const totalTime = Date.now() - startTime;
  console.log(`Total performance test time: ${totalTime}ms`);
}
```

---

## Phase 7: Deployment & Monitoring (Week 9-10)

### 7.1 Production Deployment

#### **Database Migration Script**
```bash
#!/bin/bash
# deploy-graph-migration.sh

echo "Starting Graph-Relational migration..."

# Backup existing database
echo "Creating database backup..."
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy

# Run graph migration scripts
echo "Running graph migration scripts..."
npm run migrate:master-data
npm run migrate:entities-to-graph
npm run migrate:create-relationships
npm run migrate:generate-hierarchy-paths

# Validate migration
echo "Validating migration..."
npm run validate:migration

# Run performance tests
echo "Running performance tests..."
npm run test:performance

echo "Graph-Relational migration completed successfully!"
```

### 7.2 Monitoring Setup

#### **Graph Performance Monitoring**
```typescript
// lib/monitoring/graph-monitor.ts
export class GraphMonitor {
  async monitorGraphPerformance() {
    const metrics = {
      nodeCount: await prisma.node.count(),
      edgeCount: await prisma.edge.count(),
      averageQueryTime: await this.getAverageQueryTime(),
      cacheHitRate: await this.getCacheHitRate(),
      errorRate: await this.getErrorRate()
    };

    // Send metrics to monitoring service
    await this.sendMetrics(metrics);
  }

  async getAverageQueryTime() {
    // Implement query time monitoring
    return 0;
  }

  async getCacheHitRate() {
    // Implement cache monitoring
    return 0;
  }

  async getErrorRate() {
    // Implement error rate monitoring
    return 0;
  }

  async sendMetrics(metrics: any) {
    // Send to monitoring service (e.g., DataDog, New Relic)
    console.log('Graph metrics:', metrics);
  }
}
```

---

## Success Criteria & Validation

### **Technical Success Criteria**
- ✅ All existing data successfully migrated to graph structure
- ✅ Graph queries perform within 100ms for 95% of requests
- ✅ No data loss during migration
- ✅ All API endpoints return correct graph-enhanced data
- ✅ UI components render graph visualizations correctly

### **Business Success Criteria**
- ✅ Users can explore relationships between entities
- ✅ Risk propagation analysis works in real-time
- ✅ Process optimization insights are available
- ✅ Control effectiveness mapping is functional
- ✅ Strategic navigation flow includes graph relationships

### **Performance Benchmarks**
- **Graph Traversal**: < 50ms for 3-hop traversals
- **Hybrid Queries**: < 100ms for complex queries
- **UI Rendering**: < 200ms for graph visualizations
- **Data Migration**: < 30 minutes for full dataset
- **Memory Usage**: < 2GB for 10,000 nodes

This implementation plan provides a comprehensive roadmap for successfully migrating to the Graph-Relational Hybrid architecture while maintaining system stability and performance. 