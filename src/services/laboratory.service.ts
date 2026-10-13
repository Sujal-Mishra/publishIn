import { prisma } from '@/lib/prisma'

export async function getLaboratories({ query }: { query?: string }) {
  const where: any = {}
  if (query) {
    where.OR = [
      { name: { contains: query } },
      { department: { departmentName: { contains: query } } },
      { university: { universityName: { contains: query } } }
    ]
  }

  return prisma.laboratory.findMany({
    where,
    include: {
      department: true,
      university: true,
      milestones: {
        include: { project: true }
      }
    }
  })
}

export async function getLaboratoryById(id: string) {
  return prisma.laboratory.findUnique({
    where: { id },
    include: {
      department: true,
      university: true,
      milestones: {
        include: {
          project: {
            include: { leadProfessor: true }
          }
        }
      }
    }
  })
}
