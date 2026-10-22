import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const collaborations = await prisma.industryCollaboration.findMany({
      orderBy: { sinceDate: 'desc' },
      include: {
        industry: true,
        project: {
          select: {
            id: true,
            projectTitle: true,
            budget: true,
            leadProfessor: { select: { fname: true, lname: true } }
          }
        },
        researcher: {
          select: {
            id: true,
            fname: true,
            lname: true,
            currentPosition: true,
            department: { include: { university: true } }
          }
        }
      }
    })

    return NextResponse.json({ success: true, collaborations })
  } catch (error: any) {
    console.error('Error fetching industry collaborations:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { industryId, industryName, industryType, projectId, researcherId, collaborationType, notes } = body

    let resolvedIndustryId = industryId

    // If no existing industry ID provided, find or create
    if (!resolvedIndustryId && industryName) {
      let ind = await prisma.industry.findUnique({
        where: { name: industryName }
      })

      if (!ind) {
        ind = await prisma.industry.create({
          data: {
            name: industryName,
            industryType: industryType || 'Technology R&D'
          }
        })
      }
      resolvedIndustryId = ind.id
    }

    if (!resolvedIndustryId) {
      // Fallback to first industry partner in DB
      const firstInd = await prisma.industry.findFirst()
      if (firstInd) {
        resolvedIndustryId = firstInd.id
      } else {
        return NextResponse.json({ error: 'Valid industry partner is required' }, { status: 400 })
      }
    }

    const colType = collaborationType || 'R&D Sponsorship Inquiry: Corporate Research Fellowship'

    const industryCollab = await prisma.industryCollaboration.create({
      data: {
        industryId: resolvedIndustryId,
        projectId: projectId || null,
        researcherId: researcherId || null,
        collaborationType: colType,
        sinceDate: new Date()
      },
      include: {
        industry: true,
        project: { select: { projectTitle: true } },
        researcher: { select: { fname: true, lname: true } }
      }
    })

    return NextResponse.json({
      success: true,
      collaboration: industryCollab,
      message: 'Corporate R&D Sponsorship Inquiry registered successfully'
    })
  } catch (error: any) {
    console.error('Error creating industry collaboration:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
