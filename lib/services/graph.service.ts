import { PrismaClient, Node, Edge } from '@prisma/client';

export interface CreateNodeData {
  type: string;
  label: string;
  metadata?: any;
}

export interface CreateEdgeData {
  fromId: string;
  toId: string;
  relationType: string;
  metadata?: any;
}

export interface GraphTraversalResult {
  node: Node;
  depth: number;
}

export class GraphService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Create a new graph node
   */
  async createNode(data: CreateNodeData): Promise<Node> {
    return await this.prisma.node.create({
      data: {
        type: data.type,
        label: data.label,
        metadata: data.metadata || {}
      }
    });
  }

  /**
   * Create a new graph edge (relationship)
   */
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

  /**
   * Get all relationships for a specific node
   */
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

  /**
   * Get incoming relationships for a specific node
   */
  async getIncomingRelationships(nodeId: string, relationType?: string) {
    const where = relationType 
      ? { toId: nodeId, relationType }
      : { toId: nodeId };

    return await this.prisma.edge.findMany({
      where,
      include: {
        fromNode: true
      }
    });
  }

  /**
   * Traverse the graph from a starting node with depth limit
   */
  async traverseGraph(startNodeId: string, maxDepth: number = 3): Promise<GraphTraversalResult[]> {
    const visited = new Set<string>();
    const queue: Array<{ nodeId: string; depth: number }> = [{ nodeId: startNodeId, depth: 0 }];
    const result: GraphTraversalResult[] = [];

    while (queue.length > 0) {
      const { nodeId, depth } = queue.shift()!;
      
      if (visited.has(nodeId) || depth > maxDepth) continue;
      visited.add(nodeId);

      const node = await this.prisma.node.findUnique({
        where: { id: nodeId }
      });

      if (node) {
        result.push({ node, depth });

        // Get outgoing edges for next level traversal
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

  /**
   * Find all nodes of a specific type
   */
  async findNodesByType(type: string, limit?: number) {
    return await this.prisma.node.findMany({
      where: { type },
      take: limit,
      include: {
        outgoingEdges: {
          include: { toNode: true }
        }
      }
    });
  }

  /**
   * Find nodes by label (with partial matching)
   */
  async findNodesByLabel(label: string, limit?: number) {
    return await this.prisma.node.findMany({
      where: {
        label: {
          contains: label,
          mode: 'insensitive'
        }
      },
      take: limit,
      include: {
        outgoingEdges: {
          include: { toNode: true }
        }
      }
    });
  }

  /**
   * Get relationship path between two nodes
   */
  async getRelationshipPath(fromNodeId: string, toNodeId: string, maxDepth: number = 5): Promise<Edge[]> {
    const visited = new Set<string>();
    const queue: Array<{ nodeId: string; path: Edge[] }> = [{ nodeId: fromNodeId, path: [] }];

    while (queue.length > 0) {
      const { nodeId, path } = queue.shift()!;
      
      if (visited.has(nodeId) || path.length > maxDepth) continue;
      visited.add(nodeId);

      if (nodeId === toNodeId) {
        return path;
      }

      const edges = await this.prisma.edge.findMany({
        where: { fromId: nodeId }
      });

      for (const edge of edges) {
        queue.push({ 
          nodeId: edge.toId, 
          path: [...path, edge] 
        });
      }
    }

    return [];
  }

  /**
   * Delete a node and all its relationships
   */
  async deleteNode(nodeId: string): Promise<void> {
    await this.prisma.edge.deleteMany({
      where: {
        OR: [
          { fromId: nodeId },
          { toId: nodeId }
        ]
      }
    });

    await this.prisma.node.delete({
      where: { id: nodeId }
    });
  }

  /**
   * Delete a specific relationship
   */
  async deleteEdge(fromId: string, toId: string, relationType: string): Promise<void> {
    await this.prisma.edge.delete({
      where: {
        fromId_toId_relationType: {
          fromId,
          toId,
          relationType
        }
      }
    });
  }

  /**
   * Update node metadata
   */
  async updateNodeMetadata(nodeId: string, metadata: any): Promise<Node> {
    return await this.prisma.node.update({
      where: { id: nodeId },
      data: { metadata }
    });
  }

  /**
   * Update edge metadata
   */
  async updateEdgeMetadata(fromId: string, toId: string, relationType: string, metadata: any): Promise<Edge> {
    return await this.prisma.edge.update({
      where: {
        fromId_toId_relationType: {
          fromId,
          toId,
          relationType
        }
      },
      data: { metadata }
    });
  }

  /**
   * Get graph statistics
   */
  async getGraphStats() {
    const [nodeCount, edgeCount, nodeTypes] = await Promise.all([
      this.prisma.node.count(),
      this.prisma.edge.count(),
      this.prisma.node.groupBy({
        by: ['type'],
        _count: {
          type: true
        }
      })
    ]);

    return {
      totalNodes: nodeCount,
      totalEdges: edgeCount,
      nodeTypes: nodeTypes.map(nt => ({
        type: nt.type,
        count: nt._count.type
      }))
    };
  }
} 