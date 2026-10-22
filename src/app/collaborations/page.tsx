import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { CollaborationsDashboard } from '@/components/collaborations/CollaborationsDashboard'

export default async function CollaborationsPage() {
  const user = await getCurrentUser()

  const [collaborations, pendingMembers, industryCollaborations] = await Promise.all([
    prisma.collaboration.findMany({
      orderBy: { sinceDate: 'desc' },
      include: {
        researcher1: { include: { department: { include: { university: true } } } },
        researcher2: { include: { department: { include: { university: true } } } }
      }
    }),
    prisma.projectMember.findMany({
      where: {
        role: { startsWith: 'Pending:' }
      },
      orderBy: { joinedAt: 'desc' },
      include: {
        project: {
          select: {
            id: true,
            projectTitle: true,
            grantNumber: true,
            leadProfessor: { select: { id: true, fname: true, lname: true } }
          }
        },
        researcher: {
          select: {
            id: true,
            fname: true,
            lname: true,
            email: true,
            role: true,
            currentPosition: true,
            department: {
              select: {
                departmentName: true,
                university: { select: { abbreviation: true } }
              }
            }
          }
        }
      }
    }),
    prisma.industryCollaboration.findMany({
      orderBy: { sinceDate: 'desc' },
      include: {
        industry: true,
        project: {
          select: {
            id: true,
            projectTitle: true,
            budget: true
          }
        },
        researcher: {
          select: {
            id: true,
            fname: true,
            lname: true,
            currentPosition: true
          }
        }
      }
    })
  ])

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userName={user?.name} userRole={user?.role} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar userName={user?.name} userRole={user?.role} />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Interactive Collaboration & Mentorship Network
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Active researcher partnerships, mentorship requests, project membership reviews, and corporate R&D sponsorships.
            </p>
          </div>

          <CollaborationsDashboard
            initialCollaborations={collaborations}
            initialPendingMembers={pendingMembers}
            initialIndustryCollaborations={industryCollaborations}
            currentUserId={user?.id}
          />
        </main>
      </div>
    </div>
  )
}
