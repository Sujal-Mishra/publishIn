import { prisma } from '@/lib/prisma'

export async function getPublications({ query }: { query?: string }) {
  const where: any = {}
  if (query) {
    where.OR = [
      { title: { contains: query } },
      { journalName: { contains: query } },
      { doi: { contains: query } }
    ]
  }

  return prisma.publication.findMany({
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
}

export async function getPatents({ query }: { query?: string }) {
  const where: any = {}
  if (query) {
    where.OR = [
      { title: { contains: query } },
      { doi: { contains: query } }
    ]
  }

  return prisma.patent.findMany({
    where,
    orderBy: { grantDate: 'desc' },
    include: {
      project: {
        include: {
          leadProfessor: true,
          department: { include: { university: true } }
        }
      }
    }
  })
}

export async function getDatasets({ query }: { query?: string }) {
  const where: any = {}
  if (query) {
    where.OR = [
      { title: { contains: query } },
      { name: { contains: query } }
    ]
  }

  return prisma.dataset.findMany({
    where,
    include: {
      project: {
        include: {
          leadProfessor: true,
          department: { include: { university: true } }
        }
      }
    }
  })
}
