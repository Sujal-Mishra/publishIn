import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET (Fetch Existing Single Record)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const project = await prisma.researchProject.findUnique({
      where: { id },
      include: {
        leadProfessor: true,
        department: { include: { university: true } }
      }
    })

    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, project })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// PUT (Update Record)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { projectTitle, projectStatus, budget } = body

    const updated = await prisma.researchProject.update({
      where: { id },
      data: {
        projectTitle: projectTitle || undefined,
        projectStatus: projectStatus || undefined,
        budget: budget ? parseFloat(budget) : undefined
      }
    })

    return NextResponse.json({ success: true, project: updated })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// DELETE (Delete Record)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.researchProject.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Project record deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
