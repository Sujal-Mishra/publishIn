import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const projectId = resolvedParams.id
    const body = await request.json()
    const { milestoneId, status } = body

    if (!milestoneId || !status) {
      return NextResponse.json(
        { error: 'milestoneId and status are required' },
        { status: 400 }
      )
    }

    const existing = await prisma.milestone.findFirst({
      where: {
        id: milestoneId,
        projectId: projectId
      }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Milestone not found for this project' },
        { status: 404 }
      )
    }

    const updated = await prisma.milestone.update({
      where: { id: milestoneId },
      data: { status }
    })

    return NextResponse.json({
      success: true,
      milestone: updated
    })
  } catch (error: any) {
    console.error('Failed to update milestone:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
