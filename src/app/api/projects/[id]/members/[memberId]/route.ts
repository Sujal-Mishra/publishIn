import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const { id: projectId, memberId } = await params
    const body = await request.json()
    const { action, role } = body // action: 'accept' | 'decline'

    const existing = await prisma.projectMember.findUnique({
      where: { id: memberId },
      include: {
        researcher: { select: { fname: true, lname: true } }
      }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Project membership application not found' }, { status: 404 })
    }

    if (action === 'decline') {
      await prisma.projectMember.delete({
        where: { id: memberId }
      })
      return NextResponse.json({
        success: true,
        message: `Application for ${existing.researcher.fname} ${existing.researcher.lname} declined`
      })
    }

    if (action === 'accept') {
      // Determine final active role
      let finalRole = role
      if (!finalRole) {
        if (existing.role.includes('Co-Investigator')) {
          finalRole = 'Co-Investigator'
        } else if (existing.role.includes('Student Member')) {
          finalRole = 'Student Member'
        } else {
          finalRole = 'Member'
        }
      }

      const updated = await prisma.projectMember.update({
        where: { id: memberId },
        data: {
          role: finalRole,
          joinedAt: new Date()
        },
        include: {
          researcher: {
            select: { fname: true, lname: true, email: true, currentPosition: true }
          }
        }
      })

      return NextResponse.json({
        success: true,
        member: updated,
        message: `${existing.researcher.fname} ${existing.researcher.lname} successfully accepted as ${finalRole}`
      })
    }

    return NextResponse.json({ error: "Invalid action. Use 'accept' or 'decline'" }, { status: 400 })
  } catch (error: any) {
    console.error('Error updating project member:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
