import { prisma } from '@/lib/prisma'

export async function getProjects({
  query,
  status,
  departmentId,
  universityId,
  domainId,
  page = 1,
  limit = 10
}: {
  query?: string
  status?: string
  departmentId?: string
  universityId?: string
  domainId?: string
  page?: number
  limit?: number
}) {
  const where: any = {}

  if (query) {
    where.OR = [
      { projectTitle: { contains: query } },
      { grantNumber: { contains: query } }
    ]
  }

  if (status) {
    where.projectStatus = status
  }

  if (departmentId) {
    where.departmentId = departmentId
  }

  if (universityId) {
    where.department = {
      universityId
    }
  }

  if (domainId) {
    where.domains = {
      some: {
        domainId
      }
    }
  }

  const total = await prisma.researchProject.count({ where })

  const projects = await prisma.researchProject.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      leadProfessor: {
        select: {
          id: true,
          fname: true,
          lname: true,
          email: true,
          currentPosition: true
        }
      },
      department: {
        include: {
          university: {
            select: {
              id: true,
              universityName: true,
              abbreviation: true
            }
          }
        }
      },
      fundingAgency: {
        select: {
          id: true,
          name: true
        }
      },
      domains: {
        include: {
          domain: true
        }
      },
      skills: {
        include: {
          skill: true
        }
      },
      _count: {
        select: {
          milestones: true,
          publications: true,
          patents: true,
          members: true
        }
      }
    }
  })

  return {
    projects,
    total,
    totalPages: Math.ceil(total / limit),
    page
  }
}

export async function getProjectById(id: string) {
  return prisma.researchProject.findUnique({
    where: { id },
    include: {
      leadProfessor: {
        include: {
          department: {
            include: { university: true }
          }
        }
      },
      department: {
        include: {
          university: true
        }
      },
      fundingAgency: true,
      milestones: {
        include: {
          lab: true
        },
        orderBy: { dueDate: 'asc' }
      },
      publications: true,
      patents: true,
      datasets: true,
      domains: {
        include: { domain: true }
      },
      skills: {
        include: { skill: true }
      },
      members: {
        include: {
          researcher: {
            include: {
              department: {
                include: { university: true }
              }
            }
          }
        }
      },
      industryCollaborations: {
        include: {
          industry: true
        }
      }
    }
  })
}

export async function createProject(data: {
  projectTitle: string
  grantNumber?: string
  startDate: Date
  endDate?: Date
  budget?: number
  projectStatus: string
  leadProfessorId: string
  departmentId: string
  fundingAgencyId?: string
  domainIds?: string[]
  skillIds?: string[]
}) {
  return prisma.researchProject.create({
    data: {
      projectTitle: data.projectTitle,
      grantNumber: data.grantNumber || undefined,
      startDate: data.startDate,
      endDate: data.endDate,
      budget: data.budget,
      projectStatus: data.projectStatus,
      leadProfessorId: data.leadProfessorId,
      departmentId: data.departmentId,
      fundingAgencyId: data.fundingAgencyId || undefined,
      domains: data.domainIds && data.domainIds.length > 0 ? {
        create: data.domainIds.map(id => ({ domainId: id }))
      } : undefined,
      skills: data.skillIds && data.skillIds.length > 0 ? {
        create: data.skillIds.map(id => ({ skillId: id }))
      } : undefined
    }
  })
}
