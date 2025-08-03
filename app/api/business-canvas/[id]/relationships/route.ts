import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const canvas = await prisma.businessCanvas.findUnique({
      where: { id: params.id }
    });

    if (!canvas) {
      return NextResponse.json(
        { error: 'Business canvas not found' },
        { status: 404 }
      );
    }

    if (!canvas.graphNodeId) {
      return NextResponse.json({ relationships: [] });
    }

    const relationships = await prisma.edge.findMany({
      where: { fromId: canvas.graphNodeId },
      include: {
        toNode: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ relationships });
  } catch (error) {
    console.error('Error fetching canvas relationships:', error);
    return NextResponse.json(
      { error: 'Failed to fetch canvas relationships' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { targetNodeId, relationType, metadata } = body;

    const canvas = await prisma.businessCanvas.findUnique({
      where: { id: params.id }
    });

    if (!canvas) {
      return NextResponse.json(
        { error: 'Business canvas not found' },
        { status: 404 }
      );
    }

    if (!canvas.graphNodeId) {
      return NextResponse.json(
        { error: 'Canvas does not have a graph node' },
        { status: 400 }
      );
    }

    // Create the relationship
    const edge = await prisma.edge.create({
      data: {
        fromId: canvas.graphNodeId,
        toId: targetNodeId,
        relationType,
        metadata: metadata || {}
      },
      include: {
        toNode: true
      }
    });

    return NextResponse.json(edge, { status: 201 });
  } catch (error) {
    console.error('Error creating canvas relationship:', error);
    return NextResponse.json(
      { error: 'Failed to create canvas relationship' },
      { status: 500 }
    );
  }
} 