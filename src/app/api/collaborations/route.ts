import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const researcherId = searchParams.get('researcherId')

    const where: any = {}
    if (status) {
      where.status = status
    }
    if (researcherId) {
      where.OR = [
        { researcherId1: researcherId },
        { researcherId2: researcherId }
      ]
    }

    const collaborations = await prisma.collaboration.findMany({
      where,
      orderBy: { sinceDate: 'desc' },
      include: {
        researcher1: {
          include: {
            department: { include: { university: true } }
          }
        },
        researcher2: {
          include: {
            department: { include: { university: true } }
          }
        }
      }
    })

    return NextResponse.json({ success: true, collaborations })
  } catch (error: any) {
    console.error('Error fetching collaborations:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    const body = await request.json()
    const { targetResearcherId, requesterId, collaborationType, notes } = body

    const senderId = requesterId || user?.id
    if (!senderId || !targetResearcherId) {
      return NextResponse.json(
        { error: 'Both requester and target researcher IDs are required' },
        { status: 400 }
      )
    }

    if (senderId === targetResearcherId) {
      return NextResponse.json(
        { error: 'Cannot request collaboration with yourself' },
        { status: 400 }
      )
    }

    // Check if collaboration already exists
    const existing = await prisma.collaboration.findFirst({
      where: {
        OR: [
          { researcherId1: senderId, researcherId2: targetResearcherId },
          { researcherId1: targetResearcherId, researcherId2: senderId }
        ]
      }
    })

    if (existing) {
      if (existing.status === 'Declined') {
        // Re-open declined request as pending
        const updated = await prisma.collaboration.update({
          where: { id: existing.id },
          data: {
            collaborationType: collaborationType || existing.collaborationType,
            status: 'Pending',
            sinceDate: new Date()
          }
        })
        return NextResponse.json({ success: true, collaboration: updated, message: 'Collaboration request renewed' })
      }
      return NextResponse.json(
        { error: `A collaboration between these researchers is already ${existing.status.toLowerCase()}` },
        { status: 409 }
      )
    }

    const collaboration = await prisma.collaboration.create({
      data: {
        researcherId1: senderId,
        researcherId2: targetResearcherId,
        collaborationType: collaborationType || 'Joint Research & Academic Collaboration',
        status: 'Pending',
        sinceDate: new Date()
      },
      include: {
        researcher1: { select: { fname: true, lname: true } },
        researcher2: { select: { fname: true, lname: true } }
      }
    })

    return NextResponse.json({ success: true, collaboration, message: 'Collaboration request submitted successfully' })
  } catch (error: any) {
    console.error('Error submitting collaboration request:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
