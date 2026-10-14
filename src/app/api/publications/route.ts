import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cleanDoi } from '@/lib/doi'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || undefined
    const projectId = searchParams.get('projectId') || undefined

    const where: any = {}
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { journalName: { contains: query, mode: 'insensitive' } },
        { doi: { contains: query, mode: 'insensitive' } }
      ]
    }
    if (projectId) {
      where.projectId = projectId
    }

    const publications = await prisma.publication.findMany({
      where,
      orderBy: { publicationYear: 'desc' },
      include: {
        project: {
          include: {
            leadProfessor: true,
            department: { include: { university: true } }
          }
        }
      }
    })

    return NextResponse.json({ success: true, data: publications })
  } catch (error: any) {
    console.error('Error fetching publications:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch publications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, journalName, publicationYear, doi, projectId } = body

    if (!title || !projectId) {
      return NextResponse.json(
        { error: 'Title and Project ID are required' },
        { status: 400 }
      )
    }

    const cleanedDoi = doi ? cleanDoi(doi) : null

    // Check if DOI already exists if provided
    if (cleanedDoi) {
      const existing = await prisma.publication.findFirst({
        where: { doi: cleanedDoi }
      })
      if (existing) {
        return NextResponse.json(
          { error: `Publication with DOI ${cleanedDoi} already exists in project.` },
          { status: 409 }
        )
      }
    }

    const year = Number(publicationYear) || new Date().getFullYear()

    const publication = await prisma.publication.create({
      data: {
        title: title.trim(),
        journalName: journalName ? journalName.trim() : null,
        publicationYear: year,
        doi: cleanedDoi,
        projectId
      },
      include: {
        project: {
          include: {
            leadProfessor: true,
            department: { include: { university: true } }
          }
        }
      }
    })

    return NextResponse.json({ success: true, data: publication }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating publication:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to create publication' },
      { status: 500 }
    )
  }
}
