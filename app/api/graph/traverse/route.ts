import { NextRequest, NextResponse } from 'next/server';
import { GraphService } from '@/lib/services/graph.service';

const graphService = new GraphService();

export async function POST(request: NextRequest) {
  try {
    const { nodeId, maxDepth = 3 } = await request.json();
    
    if (!nodeId) {
      return NextResponse.json(
        { error: 'nodeId is required' },
        { status: 400 }
      );
    }

    const traversal = await graphService.traverseGraph(nodeId, maxDepth);
    return NextResponse.json(traversal);
  } catch (error) {
    console.error('Error traversing graph:', error);
    return NextResponse.json(
      { error: 'Failed to traverse graph' },
      { status: 500 }
    );
  }
} 