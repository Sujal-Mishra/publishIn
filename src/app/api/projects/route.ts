import { NextResponse } from 'next/server'
import { createProject } from '@/services/project.service'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { projectTitle, grantNumber, startDate, endDate, budget, leadProfessorId, departmentId, fundingAgencyId } = body

    if (!projectTitle || !startDate || !leadProfessorId || !departmentId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    // Verify lead professor role constraint
    const leadUser = await prisma.researcher.findUnique({
      where: { id: leadProfessorId }
    })

    if (!leadUser || (leadUser.role !== 'PROFESSOR' && leadUser.role !== 'UNIVERSITY_ADMIN')) {
      return NextResponse.json(
        { success: false, error: 'Integrity Constraint Error: Lead Investigator MUST be a registered Professor.' },
        { status: 400 }
      )
    }

    const project = await createProject({
      projectTitle,
      grantNumber,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      budget: budget ? parseFloat(budget) : undefined,
      projectStatus: 'Active',
      leadProfessorId,
      departmentId,
      fundingAgencyId
    })

    return NextResponse.json({ success: true, project })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to create project' }, { status: 500 })
  }
}
