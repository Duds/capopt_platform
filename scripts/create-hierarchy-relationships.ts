import { PrismaClient } from '@prisma/client';
import { GraphService } from '../lib/services/graph.service';

const prisma = new PrismaClient();
const graphService = new GraphService();

export async function createHierarchyRelationships() {
  console.log('Creating hierarchy relationships...');

  try {
    // Enterprise -> Facility relationships
    console.log('Creating Enterprise -> Facility relationships...');
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
    console.log('Creating Facility -> Business Unit relationships...');
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
    console.log('Creating Business Unit -> Department relationships...');
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

    // Enterprise -> Business Unit relationships (direct)
    console.log('Creating Enterprise -> Business Unit relationships...');
    for (const unit of businessUnits) {
      if (unit.enterprise?.graphNodeId && unit.graphNodeId) {
        await graphService.createEdge({
          fromId: unit.enterprise.graphNodeId,
          toId: unit.graphNodeId,
          relationType: 'owns',
          metadata: {
            relationshipType: 'ownership',
            budget: unit.budget,
            type: unit.type
          }
        });
      }
    }

    // Enterprise -> Business Canvas relationships
    console.log('Creating Enterprise -> Business Canvas relationships...');
    const canvases = await prisma.businessCanvas.findMany({
      include: { enterprise: true }
    });

    for (const canvas of canvases) {
      if (canvas.enterprise?.graphNodeId && canvas.graphNodeId) {
        await graphService.createEdge({
          fromId: canvas.enterprise.graphNodeId,
          toId: canvas.graphNodeId,
          relationType: 'strategizes',
          metadata: {
            relationshipType: 'strategic',
            industry: canvas.industry,
            status: canvas.status
          }
        });
      }
    }

    // Business Unit -> Process relationships
    console.log('Creating Business Unit -> Process relationships...');
    const processes = await prisma.process.findMany({
      include: { businessUnit: true }
    });

    for (const process of processes) {
      if (process.businessUnit?.graphNodeId && process.graphNodeId) {
        await graphService.createEdge({
          fromId: process.businessUnit.graphNodeId,
          toId: process.graphNodeId,
          relationType: 'executes',
          metadata: {
            relationshipType: 'operational',
            priority: process.priority,
            status: process.status
          }
        });
      }
    }

    // Department -> Process relationships
    console.log('Creating Department -> Process relationships...');
    for (const process of processes) {
      if (process.department?.graphNodeId && process.graphNodeId) {
        await graphService.createEdge({
          fromId: process.department.graphNodeId,
          toId: process.graphNodeId,
          relationType: 'implements',
          metadata: {
            relationshipType: 'operational',
            priority: process.priority,
            status: process.status
          }
        });
      }
    }

    // Process -> Control relationships (from existing ProcessControl table)
    console.log('Creating Process -> Control relationships...');
    const processControls = await prisma.processControl.findMany({
      include: {
        process: true,
        control: true
      }
    });

    for (const pc of processControls) {
      if (pc.process.graphNodeId) {
        // Find the control's graph node
        const controlNode = await prisma.node.findFirst({
          where: {
            type: 'critical_control',
            metadata: {
              path: ['originalId'],
              equals: pc.controlId
            }
          }
        });

        if (controlNode) {
          await graphService.createEdge({
            fromId: pc.process.graphNodeId,
            toId: controlNode.id,
            relationType: 'implements',
            metadata: {
              relationshipType: 'control',
              controlName: pc.control.name
            }
          });
        }
      }
    }

    // Business Canvas -> Process relationships (strategic to operational)
    console.log('Creating Business Canvas -> Process relationships...');
    for (const canvas of canvases) {
      if (canvas.graphNodeId) {
        for (const process of processes) {
          if (process.graphNodeId && canvas.enterpriseId === process.enterpriseId) {
            await graphService.createEdge({
              fromId: canvas.graphNodeId,
              toId: process.graphNodeId,
              relationType: 'enables',
              metadata: {
                relationshipType: 'strategic_to_operational',
                canvasStatus: canvas.status,
                processStatus: process.status
              }
            });
          }
        }
      }
    }

    console.log('Hierarchy relationships created successfully');
  } catch (error) {
    console.error('Error creating hierarchy relationships:', error);
    throw error;
  }
}

// Run migration if called directly
if (require.main === module) {
  createHierarchyRelationships()
    .then(() => {
      console.log('Relationship creation completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Relationship creation failed:', error);
      process.exit(1);
    });
} 