import { prisma } from '@/lib/prisma'

export async function getFundingAgencies() {
  return prisma.fundingAgency.findMany({
    orderBy: { name: 'asc' },
    include: {
      projects: {
        include: {
          leadProfessor: true,
          department: { include: { university: true } }
        }
      },
      _count: {
        select: { projects: true }
      }
    }
  })
}

export async function getIndustries() {
  return prisma.industry.findMany({
    orderBy: { name: 'asc' },
    include: {
      collaborations: {
        include: {
          project: true,
          researcher: true
        }
      }
    }
  })
}
