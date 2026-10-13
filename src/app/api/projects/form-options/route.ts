import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [professors, departments, fundingAgencies] = await Promise.all([
      prisma.researcher.findMany({
        where: { role: 'PROFESSOR' },
        include: { department: { include: { university: true } } }
      }),
      prisma.department.findMany({
        include: { university: true }
      }),
      prisma.fundingAgency.findMany()
    ])

    return NextResponse.json({ professors, departments, fundingAgencies })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch form options' }, { status: 500 })
  }
}
