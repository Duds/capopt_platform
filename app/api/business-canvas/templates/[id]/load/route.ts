import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const templateId = params.id
    
    // Get the template
    const template = await prisma.canvasTemplate.findUnique({
      where: { id: templateId },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Parse the template canvas data
    const templateCanvas = template.canvas as any

    // Create a new canvas from the template
    const newCanvas = await prisma.businessCanvas.create({
      data: {
        name: `${template.name} - Copy`,
        description: `Created from template: ${template.name}`,
        version: '1.0',
        status: 'DRAFT',
        editMode: 'SINGLE_USER',
        autoSave: true,
        templateId: template.id,
        // Create the canvas content from template
        valuePropositions: {
          create: templateCanvas.valuePropositions || []
        },
        customerSegments: {
          create: templateCanvas.customerSegments || []
        },
        revenueStreams: {
          create: templateCanvas.revenueStreams || []
        },
        partnerships: {
          create: templateCanvas.partnerships || []
        },
        resources: {
          create: templateCanvas.resources || []
        },
        activities: {
          create: templateCanvas.activities || []
        },
        costStructures: {
          create: templateCanvas.costStructures || []
        },
        channels: {
          create: templateCanvas.channels || []
        }
      },
      include: {
        valuePropositions: true,
        customerSegments: true,
        revenueStreams: true,
        partnerships: true,
        resources: true,
        activities: true,
        costStructures: true,
        channels: true,
        templateSource: {
          include: {
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    // Update template usage count
    await prisma.canvasTemplate.update({
      where: { id: templateId },
      data: {
        usageCount: {
          increment: 1
        }
      }
    })

    return NextResponse.json(newCanvas, { status: 201 })
  } catch (error) {
    console.error('Error loading template:', error)
    return NextResponse.json(
      { error: 'Failed to load template', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 