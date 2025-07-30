import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const shareSchema = z.object({
  type: z.enum(['EMAIL_INVITE', 'PUBLIC_LINK', 'TEAM_ACCESS']),
  email: z.string().email().optional(),
  permissions: z.enum(['VIEW', 'REVIEW', 'EDIT'])
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { type, email, permissions } = shareSchema.parse(body)

    // Verify canvas exists
    const canvas = await prisma.businessCanvas.findUnique({
      where: { id }
    })

    if (!canvas) {
      return NextResponse.json(
        { error: 'Canvas not found' },
        { status: 404 }
      )
    }

    // Create sharing setting
    const sharingSetting = await prisma.canvasSharingSetting.create({
      data: {
        businessCanvasId: id,
        type: type as any,
        value: type === 'EMAIL_INVITE' ? email! : 
               type === 'PUBLIC_LINK' ? `https://capopt.com/canvas/${id}/shared` :
               'team-access',
        permissions: {
          access: permissions,
          grantedAt: new Date().toISOString(),
          grantedBy: 'system' // TODO: Get from auth context - see issue #XXX
        }
      }
    })

    // If it's an email share, you might want to send an email notification
    if (type === 'EMAIL_INVITE' && email) {
      // TODO: Implement email sending service integration
      // TODO: Add email templates for canvas sharing
      // TODO: Add email tracking and delivery confirmation
      console.log(`Would send email to ${email} with canvas access`)
    }

    // If it's a team share, you might want to notify team members
    if (type === 'TEAM_ACCESS') {
      // TODO: Implement team notification system
      // TODO: Add team member discovery and validation
      // TODO: Add team-wide notification preferences
      console.log('Would notify team members of canvas access')
    }

    return NextResponse.json({
      success: true,
      sharingSetting: {
        id: sharingSetting.id,
        type: sharingSetting.type,
        value: sharingSetting.value,
        permissions: sharingSetting.permissions,
        expiresAt: sharingSetting.expiresAt
      },
      message: type === 'EMAIL_INVITE' 
        ? `Canvas shared with ${email}`
        : type === 'PUBLIC_LINK'
        ? 'Canvas shared via link'
        : 'Canvas shared with team'
    })

  } catch (error) {
    console.error('Share error:', error)
    return NextResponse.json(
      { error: 'Failed to share canvas' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get all sharing settings for this canvas
    const sharingSettings = await prisma.canvasSharingSetting.findMany({
      where: {
        businessCanvasId: id,
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      sharingSettings: sharingSettings.map(setting => ({
        id: setting.id,
        type: setting.type,
        value: setting.value,
        permissions: setting.permissions,
        expiresAt: setting.expiresAt,
        createdAt: setting.createdAt
      }))
    })

  } catch (error) {
    console.error('Get sharing settings error:', error)
    return NextResponse.json(
      { error: 'Failed to get sharing settings' },
      { status: 500 }
    )
  }
} 