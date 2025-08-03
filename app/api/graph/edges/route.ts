import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { GraphService } from '@/lib/services/graph.service';

const prisma = new PrismaClient();
const graphService = new GraphService();

export async function GET(request: NextRequest) {
  try {
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(edges);
  } catch (error) {
    console.error('Error fetching edges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch edges' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.fromId || !body.toId || !body.relationType) {
      return NextResponse.json(
        { error: 'fromId, toId, and relationType are required' },
        { status: 400 }
      );
    }

    // Verify that both nodes exist
    const [fromNode, toNode] = await Promise.all([
      prisma.node.findUnique({ where: { id: body.fromId } }),
      prisma.node.findUnique({ where: { id: body.toId } })
    ]);

    if (!fromNode || !toNode) {
      return NextResponse.json(
        { error: 'One or both nodes do not exist' },
        { status: 400 }
      );
    }

    const edge = await graphService.createEdge({
      fromId: body.fromId,
      toId: body.toId,
      relationType: body.relationType,
      metadata: body.metadata || {}
    });

    return NextResponse.json(edge, { status: 201 });
  } catch (error) {
    console.error('Error creating edge:', error);
    return NextResponse.json(
      { error: 'Failed to create edge' },
      { status: 500 }
    );
  }
} 