import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { action } = body // 'accept' | 'decline'

    if (action !== 'accept' && action !== 'decline') {
      return NextResponse.json(
        { error: "Action must be either 'accept' or 'decline'" },
        { status: 400 }
      )
    }

    const nextStatus = action === 'accept' ? 'Active' : 'Declined'

    const updated = await prisma.collaboration.update({
      where: { id },
      data: {
        status: nextStatus,
        sinceDate: action === 'accept' ? new Date() : undefined
      },
      include: {
        researcher1: { select: { fname: true, lname: true } },
        researcher2: { select: { fname: true, lname: true } }
      }
    })

    return NextResponse.json({
      success: true,
      collaboration: updated,
      message: `Collaboration request successfully ${action === 'accept' ? 'accepted' : 'declined'}`
    })
  } catch (error: any) {
    console.error('Error updating collaboration status:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
