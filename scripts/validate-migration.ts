import { PrismaClient } from '@prisma/client';
import { GraphService } from '../lib/services/graph.service';

const prisma = new PrismaClient();
const graphService = new GraphService();

export async function validateMigration() {
  console.log('Validating Graph-Relational migration...');

  try {
    // Validate graph nodes
    const nodeCount = await prisma.node.count();
    console.log(`✅ Total graph nodes: ${nodeCount}`);

    // Validate graph edges
    const edgeCount = await prisma.edge.count();
    console.log(`✅ Total graph edges: ${edgeCount}`);

    // Validate entity references
    const entitiesWithGraphNodes = await prisma.businessCanvas.count({
      where: { graphNodeId: { not: null } }
    });
    console.log(`✅ Business canvases with graph nodes: ${entitiesWithGraphNodes}`);

    const enterprisesWithGraphNodes = await prisma.enterprise.count({
      where: { graphNodeId: { not: null } }
    });
    console.log(`✅ Enterprises with graph nodes: ${enterprisesWithGraphNodes}`);

    const facilitiesWithGraphNodes = await prisma.facility.count({
      where: { graphNodeId: { not: null } }
    });
    console.log(`✅ Facilities with graph nodes: ${facilitiesWithGraphNodes}`);

    const businessUnitsWithGraphNodes = await prisma.businessUnit.count({
      where: { graphNodeId: { not: null } }
    });
    console.log(`✅ Business units with graph nodes: ${businessUnitsWithGraphNodes}`);

    const departmentsWithGraphNodes = await prisma.department.count({
      where: { graphNodeId: { not: null } }
    });
    console.log(`✅ Departments with graph nodes: ${departmentsWithGraphNodes}`);

    const processesWithGraphNodes = await prisma.process.count({
      where: { graphNodeId: { not: null } }
    });
    console.log(`✅ Processes with graph nodes: ${processesWithGraphNodes}`);

    // Validate hierarchy paths
    const entitiesWithHierarchy = await prisma.businessCanvas.count({
      where: { hierarchyPath: { not: null } }
    });
    console.log(`✅ Business canvases with hierarchy paths: ${entitiesWithHierarchy}`);

    // Test graph queries
    const testNode = await prisma.node.findFirst();
    if (testNode) {
      const relationships = await prisma.edge.findMany({
        where: { fromId: testNode.id }
      });
      console.log(`✅ Test node relationships: ${relationships.length}`);
    }

    // Test graph traversal
    const enterpriseNode = await prisma.node.findFirst({
      where: { type: 'enterprise' }
    });
    if (enterpriseNode) {
      const traversal = await graphService.traverseGraph(enterpriseNode.id, 2);
      console.log(`✅ Graph traversal test: ${traversal.length} nodes reached`);
    }

    // Test hybrid queries
    const hybridService = new (await import('../lib/services/hybrid-query.service')).HybridQueryService();
    const canvases = await prisma.businessCanvas.findMany({ take: 1 });
    if (canvases.length > 0) {
      const canvasWithRelationships = await hybridService.getBusinessCanvasWithRelationships(canvases[0].id);
      console.log(`✅ Hybrid query test: Canvas has ${canvasWithRelationships.relationships?.length || 0} relationships`);
    }

    // Get graph statistics
    const stats = await graphService.getGraphStats();
    console.log('\n📊 Graph Statistics:');
    console.log(`   Total Nodes: ${stats.totalNodes}`);
    console.log(`   Total Edges: ${stats.totalEdges}`);
    console.log(`   Node Types: ${stats.nodeTypes.length}`);

    console.log('\n📋 Node Type Distribution:');
    stats.nodeTypes.forEach(nt => {
      console.log(`   ${nt.type}: ${nt.count}`);
    });

    console.log('\n✅ Migration validation completed successfully!');
  } catch (error) {
    console.error('❌ Error during migration validation:', error);
    throw error;
  }
}

// Run validation if called directly
if (require.main === module) {
  validateMigration()
    .then(() => {
      console.log('Validation completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Validation failed:', error);
      process.exit(1);
    });
} 