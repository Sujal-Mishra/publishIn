import { prisma } from '@/lib/prisma'

export async function getUniversities() {
  return prisma.university.findMany({
    orderBy: { ranking: 'asc' },
    include: {
      locations: true,
      departments: {
        select: {
          id: true,
          departmentName: true,
          hod: true,
          _count: {
            select: { researchers: true, projects: true }
          }
        }
      },
      laboratories: true,
      _count: {
        select: {
          departments: true,
          laboratories: true
        }
      }
    }
  })
}

export async function getUniversityById(id: string) {
  return prisma.university.findUnique({
    where: { id },
    include: {
      locations: true,
      departments: {
        include: {
          researchers: {
            take: 5,
            select: { id: true, fname: true, lname: true, currentPosition: true, role: true }
          },
          projects: {
            take: 5,
            select: { id: true, projectTitle: true, projectStatus: true, budget: true }
          }
        }
      },
      laboratories: {
        include: {
          department: true
        }
      }
    }
  })
}

export async function getDepartmentById(id: string) {
  return prisma.department.findUnique({
    where: { id },
    include: {
      university: true,
      researchers: {
        include: {
          skills: { include: { skill: true } },
          domains: { include: { domain: true } }
        }
      },
      projects: {
        include: {
          leadProfessor: true,
          fundingAgency: true
        }
      },
      laboratories: true
    }
  })
}
