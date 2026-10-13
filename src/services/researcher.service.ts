import { prisma } from '@/lib/prisma'

export async function getResearchers({
  query,
  role,
  departmentId,
  universityId,
  page = 1,
  limit = 12
}: {
  query?: string
  role?: string
  departmentId?: string
  universityId?: string
  page?: number
  limit?: number
}) {
  const where: any = {}

  if (query) {
    where.OR = [
      { fname: { contains: query } },
      { lname: { contains: query } },
      { email: { contains: query } },
      { currentPosition: { contains: query } },
      { biography: { contains: query } }
    ]
  }

  if (role) {
    where.role = role
  }

  if (departmentId) {
    where.departmentId = departmentId
  }

  if (universityId) {
    where.department = {
      universityId
    }
  }

  const total = await prisma.researcher.count({ where })

  const researchers = await prisma.researcher.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { lname: 'asc' },
    select: {
      id: true,
      fname: true,
      minit: true,
      lname: true,
      email: true,
      currentPosition: true,
      highestDegree: true,
      orcid: true,
      role: true,
      department: {
        select: {
          id: true,
          departmentName: true,
          university: {
            select: {
              id: true,
              universityName: true,
              abbreviation: true
            }
          }
        }
      },
      skills: {
        select: {
          skill: {
            select: { id: true, name: true, category: true }
          }
        }
      },
      domains: {
        select: {
          domain: {
            select: { id: true, name: true }
          }
        }
      },
      _count: {
        select: {
          ledProjects: true,
          collaborationsInitiated: true,
          collaborationsReceived: true
        }
      }
    }
  })

  return {
    researchers,
    total,
    totalPages: Math.ceil(total / limit),
    page
  }
}

export async function getResearcherById(id: string) {
  return prisma.researcher.findUnique({
    where: { id },
    include: {
      department: {
        include: {
          university: true
        }
      },
      studentProfile: {
        include: {
          advisor: true
        }
      },
      professorProfile: true,
      skills: {
        include: {
          skill: true
        }
      },
      domains: {
        include: {
          domain: true
        }
      },
      ledProjects: {
        include: {
          department: true,
          publications: true,
          milestones: true
        }
      },
      projectMembers: {
        include: {
          project: true
        }
      },
      collaborationsInitiated: {
        include: {
          researcher2: {
            include: {
              department: {
                include: { university: true }
              }
            }
          }
        }
      },
      collaborationsReceived: {
        include: {
          researcher1: {
            include: {
              department: {
                include: { university: true }
              }
            }
          }
        }
      }
    }
  })
}
