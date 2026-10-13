import { prisma } from '@/lib/prisma'

export async function performGlobalSearch(query: string) {
  if (!query || query.trim().length === 0) {
    return {
      researchers: [],
      projects: [],
      universities: [],
      laboratories: [],
      publications: [],
      patents: [],
      datasets: []
    }
  }

  const q = query.trim()

  const [researchers, projects, universities, laboratories, publications, patents, datasets] = await Promise.all([
    prisma.researcher.findMany({
      where: {
        OR: [
          { fname: { contains: q } },
          { lname: { contains: q } },
          { email: { contains: q } },
          { currentPosition: { contains: q } },
          { biography: { contains: q } }
        ]
      },
      take: 6,
      include: {
        department: { include: { university: true } },
        skills: { include: { skill: true } }
      }
    }),
    prisma.researchProject.findMany({
      where: {
        OR: [
          { projectTitle: { contains: q } },
          { grantNumber: { contains: q } }
        ]
      },
      take: 6,
      include: {
        leadProfessor: true,
        department: { include: { university: true } }
      }
    }),
    prisma.university.findMany({
      where: {
        OR: [
          { universityName: { contains: q } },
          { abbreviation: { contains: q } }
        ]
      },
      take: 4,
      include: { locations: true }
    }),
    prisma.laboratory.findMany({
      where: {
        name: { contains: q }
      },
      take: 4,
      include: { department: true, university: true }
    }),
    prisma.publication.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { doi: { contains: q } }
        ]
      },
      take: 4,
      include: { project: true }
    }),
    prisma.patent.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { doi: { contains: q } }
        ]
      },
      take: 4,
      include: { project: true }
    }),
    prisma.dataset.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { name: { contains: q } }
        ]
      },
      take: 4,
      include: { project: true }
    })
  ])

  return {
    researchers,
    projects,
    universities,
    laboratories,
    publications,
    patents,
    datasets
  }
}
