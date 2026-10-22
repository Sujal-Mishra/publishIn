import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const user = await getCurrentUser()
    const body = await request.json()
    const { researcherId, role, statement } = body

    const applicantId = researcherId || user?.id
    if (!applicantId) {
      return NextResponse.json({ error: 'Applicant researcher ID is required' }, { status: 400 })
    }

    // Verify project exists
    const project = await prisma.researchProject.findUnique({
      where: { id: projectId },
      select: { id: true, projectTitle: true, leadProfessorId: true }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    if (project.leadProfessorId === applicantId) {
      return NextResponse.json(
        { error: 'You are the Lead Investigator of this project' },
        { status: 400 }
      )
    }

    const requestedRole = role || 'Student Member'
    const pendingRoleString = `Pending: ${requestedRole}`

    // Check if already a member or pending
    const existing = await prisma.projectMember.findUnique({
      where: {
        projectId_researcherId: {
          projectId,
          researcherId: applicantId
        }
      }
    })

    if (existing) {
      if (existing.role.startsWith('Pending:')) {
        return NextResponse.json(
          { error: `You already have an active application (${existing.role}) pending review` },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { error: `You are already an active member of this project (${existing.role})` },
        { status: 409 }
      )
    }

    const membership = await prisma.projectMember.create({
      data: {
        projectId,
        researcherId: applicantId,
        role: pendingRoleString,
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
      membership,
      message: `Application submitted to Lead Investigator for review as ${requestedRole}`
    })
  } catch (error: any) {
    console.error('Error applying to project:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
