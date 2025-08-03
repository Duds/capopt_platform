import { PrismaClient } from '@prisma/client';
import { GraphService } from './graph.service';

export class HybridQueryService {
  private prisma: PrismaClient;
  private graphService: GraphService;

  constructor() {
    this.prisma = new PrismaClient();
    this.graphService = new GraphService();
  }

  /**
   * Get Business Canvas with graph relationships
   */
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
        channels: true,
        enterprise: true,
        facility: true,
        businessUnit: true
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

  /**
   * Get Process with controls and graph relationships
   */
  async getProcessWithControls(processId: string) {
    // Relational query
    const process = await this.prisma.process.findUnique({
      where: { id: processId },
      include: {
        steps: true,
        inputs: true,
        outputs: true,
        metrics: true,
        risks: true,
        controls: {
          include: {
            control: true
          }
        },
        createdBy: true,
        enterprise: true,
        facility: true,
        businessUnit: true,
        department: true
      }
    });

    if (!process?.graphNodeId) return process;

    // Graph query for additional relationships
    const graphRelationships = await this.prisma.edge.findMany({
      where: {
        fromId: process.graphNodeId
      },
      include: {
        toNode: true
      }
    });

    return {
      ...process,
      graphRelationships
    };
  }

  /**
   * Get Enterprise with full hierarchy and relationships
   */
  async getEnterpriseWithHierarchy(enterpriseId: string) {
    // Relational query
    const enterprise = await this.prisma.enterprise.findUnique({
      where: { id: enterpriseId },
      include: {
        facilities: {
          include: {
            businessUnits: {
              include: {
                departments: true
              }
            }
          }
        },
        businessUnits: {
          include: {
            departments: true
          }
        },
        users: true,
        businessCanvases: true,
        operatingModels: true
      }
    });

    if (!enterprise?.graphNodeId) return enterprise;

    // Graph query for relationships
    const relationships = await this.graphService.getNodeRelationships(enterprise.graphNodeId);

    return {
      ...enterprise,
      relationships
    };
  }

  /**
   * Get Risk propagation path using graph traversal
   */
  async getRiskPropagationPath(riskId: string) {
    // Graph traversal for risk propagation
    return await this.graphService.traverseGraph(riskId, 5);
  }

  /**
   * Get Control effectiveness mapping
   */
  async getControlEffectivenessMapping(controlId: string) {
    // Find the control
    const control = await this.prisma.criticalControl.findUnique({
      where: { id: controlId },
      include: {
        processes: {
          include: {
            process: true
          }
        },
        assets: {
          include: {
            asset: true
          }
        }
      }
    });

    if (!control) return null;

    // Get graph relationships for the control
    const graphNode = await this.prisma.node.findFirst({
      where: {
        type: 'control',
        metadata: {
          path: ['originalId'],
          equals: controlId
        }
      }
    });

    if (!graphNode) return control;

    const relationships = await this.graphService.getNodeRelationships(graphNode.id);

    return {
      ...control,
      graphRelationships: relationships
    };
  }

  /**
   * Search across both relational and graph data
   */
  async searchEntities(query: string, types?: string[]) {
    const results = {
      relational: [] as any[],
      graph: [] as any[]
    };

    // Relational search
    if (!types || types.includes('enterprise')) {
      const enterprises = await this.prisma.enterprise.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 10
      });
      results.relational.push(...enterprises.map(e => ({ ...e, type: 'enterprise' })));
    }

    if (!types || types.includes('business_canvas')) {
      const canvases = await this.prisma.businessCanvas.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 10
      });
      results.relational.push(...canvases.map(c => ({ ...c, type: 'business_canvas' })));
    }

    if (!types || types.includes('process')) {
      const processes = await this.prisma.process.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 10
      });
      results.relational.push(...processes.map(p => ({ ...p, type: 'process' })));
    }

    // Graph search
    const graphNodes = await this.graphService.findNodesByLabel(query, 20);
    results.graph = graphNodes.map(node => ({
      id: node.id,
      type: node.type,
      label: node.label,
      metadata: node.metadata
    }));

    return results;
  }

  /**
   * Get hierarchical data using LTREE paths
   */
  async getHierarchicalData(entityType: string, parentId?: string) {
    switch (entityType) {
      case 'enterprise':
        return await this.prisma.enterprise.findMany({
          where: parentId ? {
            hierarchyPath: {
              startsWith: parentId
            }
          } : undefined,
          orderBy: {
            hierarchyPath: 'asc'
          }
        });

      case 'business_canvas':
        return await this.prisma.businessCanvas.findMany({
          where: parentId ? {
            hierarchyPath: {
              startsWith: parentId
            }
          } : undefined,
          orderBy: {
            hierarchyPath: 'asc'
          }
        });

      case 'process':
        return await this.prisma.process.findMany({
          where: parentId ? {
            hierarchyPath: {
              startsWith: parentId
            }
          } : undefined,
          orderBy: {
            hierarchyPath: 'asc'
          }
        });

      default:
        return [];
    }
  }

  /**
   * Get master data with graph relationships
   */
  async getMasterDataWithRelationships(masterType: string) {
    switch (masterType) {
      case 'roles':
        return await this.prisma.masterRole.findMany({
          include: {
            graphNode: {
              include: {
                outgoingEdges: {
                  include: { toNode: true }
                }
              }
            }
          }
        });

      case 'systems':
        return await this.prisma.masterSystem.findMany({
          include: {
            graphNode: {
              include: {
                outgoingEdges: {
                  include: { toNode: true }
                }
              }
            }
          }
        });

      case 'vendors':
        return await this.prisma.masterVendor.findMany({
          include: {
            graphNode: {
              include: {
                outgoingEdges: {
                  include: { toNode: true }
                }
              }
            }
          }
        });

      case 'hazards':
        return await this.prisma.masterHazard.findMany({
          include: {
            graphNode: {
              include: {
                outgoingEdges: {
                  include: { toNode: true }
                }
              }
            }
          }
        });

      case 'controls':
        return await this.prisma.masterControl.findMany({
          include: {
            graphNode: {
              include: {
                outgoingEdges: {
                  include: { toNode: true }
                }
              }
            }
          }
        });

      default:
        return [];
    }
  }

  /**
   * Get relationship analytics
   */
  async getRelationshipAnalytics() {
    const stats = await this.graphService.getGraphStats();
    
    // Get most connected nodes
    const mostConnectedNodes = await this.prisma.node.findMany({
      include: {
        _count: {
          select: {
            outgoingEdges: true,
            incomingEdges: true
          }
        }
      },
      orderBy: {
        outgoingEdges: {
          _count: 'desc'
        }
      },
      take: 10
    });

    // Get relationship types distribution
    const relationshipTypes = await this.prisma.edge.groupBy({
      by: ['relationType'],
      _count: {
        relationType: true
      },
      orderBy: {
        _count: {
          relationType: 'desc'
        }
      }
    });

    return {
      stats,
      mostConnectedNodes: mostConnectedNodes.map(node => ({
        id: node.id,
        type: node.type,
        label: node.label,
        totalConnections: node._count.outgoingEdges + node._count.incomingEdges
      })),
      relationshipTypes: relationshipTypes.map(rt => ({
        type: rt.relationType,
        count: rt._count.relationType
      }))
    };
  }
} 