import { PrismaClient } from '@prisma/client';
import { GraphService } from '../lib/services/graph.service';

const prisma = new PrismaClient();
const graphService = new GraphService();

export async function migrateEntitiesToGraph() {
  console.log('Starting entity to graph migration...');

  try {
    // Migrate enterprises
    console.log('Migrating enterprises...');
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
        data: { 
          graphNodeId: graphNode.id,
          hierarchyPath: enterprise.id
        }
      });
    }

    // Migrate facilities
    console.log('Migrating facilities...');
    const facilities = await prisma.facility.findMany({
      include: { enterprise: true }
    });
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

      const hierarchyPath = facility.enterprise 
        ? `${facility.enterprise.id}.${facility.id}`
        : facility.id;

      await prisma.facility.update({
        where: { id: facility.id },
        data: { 
          graphNodeId: graphNode.id,
          hierarchyPath
        }
      });
    }

    // Migrate business units
    console.log('Migrating business units...');
    const businessUnits = await prisma.businessUnit.findMany({
      include: { 
        enterprise: true,
        facility: true
      }
    });
    for (const unit of businessUnits) {
      const graphNode = await graphService.createNode({
        type: 'business_unit',
        label: unit.name,
        metadata: {
          code: unit.code,
          type: unit.type,
          status: unit.status,
          budget: unit.budget,
          originalId: unit.id
        }
      });

      let hierarchyPath = unit.enterprise.id;
      if (unit.facility) {
        hierarchyPath += `.${unit.facility.id}`;
      }
      hierarchyPath += `.${unit.id}`;

      await prisma.businessUnit.update({
        where: { id: unit.id },
        data: { 
          graphNodeId: graphNode.id,
          hierarchyPath
        }
      });
    }

    // Migrate departments
    console.log('Migrating departments...');
    const departments = await prisma.department.findMany({
      include: { 
        businessUnit: {
          include: {
            enterprise: true,
            facility: true
          }
        }
      }
    });
    for (const dept of departments) {
      const graphNode = await graphService.createNode({
        type: 'department',
        label: dept.name,
        metadata: {
          code: dept.code,
          type: dept.type,
          status: dept.status,
          employeeCount: dept.employeeCount,
          originalId: dept.id
        }
      });

      let hierarchyPath = dept.businessUnit.enterprise.id;
      if (dept.businessUnit.facility) {
        hierarchyPath += `.${dept.businessUnit.facility.id}`;
      }
      hierarchyPath += `.${dept.businessUnit.id}.${dept.id}`;

      await prisma.department.update({
        where: { id: dept.id },
        data: { 
          graphNodeId: graphNode.id,
          hierarchyPath
        }
      });
    }

    // Migrate business canvases
    console.log('Migrating business canvases...');
    const canvases = await prisma.businessCanvas.findMany({
      include: {
        enterprise: true,
        facility: true,
        businessUnit: true
      }
    });
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

      let hierarchyPath = '';
      if (canvas.enterprise) {
        hierarchyPath = canvas.enterprise.id;
        if (canvas.facility) {
          hierarchyPath += `.${canvas.facility.id}`;
        }
        if (canvas.businessUnit) {
          hierarchyPath += `.${canvas.businessUnit.id}`;
        }
      }
      hierarchyPath += `.${canvas.id}`;

      await prisma.businessCanvas.update({
        where: { id: canvas.id },
        data: { 
          graphNodeId: graphNode.id,
          hierarchyPath
        }
      });
    }

    // Migrate processes
    console.log('Migrating processes...');
    const processes = await prisma.process.findMany({
      include: {
        enterprise: true,
        facility: true,
        businessUnit: true,
        department: true
      }
    });
    for (const process of processes) {
      const graphNode = await graphService.createNode({
        type: 'process',
        label: process.name,
        metadata: {
          description: process.description,
          version: process.version,
          status: process.status,
          priority: process.priority,
          originalId: process.id
        }
      });

      let hierarchyPath = '';
      if (process.enterprise) {
        hierarchyPath = process.enterprise.id;
        if (process.facility) {
          hierarchyPath += `.${process.facility.id}`;
        }
        if (process.businessUnit) {
          hierarchyPath += `.${process.businessUnit.id}`;
        }
        if (process.department) {
          hierarchyPath += `.${process.department.id}`;
        }
      }
      hierarchyPath += `.${process.id}`;

      await prisma.process.update({
        where: { id: process.id },
        data: { 
          graphNodeId: graphNode.id,
          hierarchyPath
        }
      });
    }

    // Migrate critical controls
    console.log('Migrating critical controls...');
    const controls = await prisma.criticalControl.findMany({
      include: {
        riskCategory: true,
        controlType: true,
        effectiveness: true
      }
    });
    for (const control of controls) {
      const graphNode = await graphService.createNode({
        type: 'critical_control',
        label: control.name,
        metadata: {
          description: control.description,
          riskCategory: control.riskCategory?.name,
          controlType: control.controlType?.name,
          effectiveness: control.effectiveness?.rating,
          originalId: control.id
        }
      });

      // Note: Controls don't have hierarchy paths as they're master data
      // We'll update the control to reference the graph node
      await prisma.criticalControl.update({
        where: { id: control.id },
        data: { 
          // Add graphNodeId field to CriticalControl if needed
        }
      });
    }

    console.log('Entity to graph migration completed successfully');
  } catch (error) {
    console.error('Error during entity to graph migration:', error);
    throw error;
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateEntitiesToGraph()
    .then(() => {
      console.log('Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
} 