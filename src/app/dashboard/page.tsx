import { getCurrentUser } from '@/lib/auth'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { StatCard } from '@/components/ui/StatCard'
import { Badge } from '@/components/ui/Badge'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { FolderGit2, Users, BookOpen, Layers, ArrowRight, Compass, ShieldCheck, Plus } from 'lucide-react'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  const [activeProjectsCount, collaboratorsCount, publicationsCount, domainsCount, recentProjects, recentPublications] = await Promise.all([
    prisma.researchProject.count({ where: { projectStatus: 'Active' } }),
    prisma.collaboration.count(),
    prisma.publication.count(),
    prisma.researchDomain.count(),
    prisma.researchProject.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: {
        leadProfessor: true,
        department: { include: { university: true } }
      }
    }),
    prisma.publication.findMany({
      take: 3,
      orderBy: { publicationYear: 'desc' },
      include: { project: true }
    })
  ])

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userName={user?.name} userRole={user?.role} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar userName={user?.name} userRole={user?.role} />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Greeting Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Good day, {user?.name || 'Researcher'}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                What would you like to explore across the research ecosystem today?
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/discover"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <Compass className="w-4 h-4 text-blue-600" />
                Global Discovery
              </Link>
              {user?.role === 'PROFESSOR' && (
                <Link
                  href="/projects/create"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  New Project
                </Link>
              )}
            </div>
          </div>

          {/* Metric Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Active Projects"
              value={activeProjectsCount}
              subtitle="Grants & Collaborations"
              icon={FolderGit2}
            />
            <StatCard
              title="Collaborators"
              value={collaboratorsCount}
              subtitle="Across Universities"
              icon={Users}
            />
            <StatCard
              title="Publications"
              value={publicationsCount}
              subtitle="Indexed Outputs"
              icon={BookOpen}
            />
            <StatCard
              title="Research Domains"
              value={domainsCount}
              subtitle="Specialized Fields"
              icon={Layers}
            />
          </div>

          {/* Main Grid Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recommended Research Projects */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">Recommended Research Projects</h2>
                <Link href="/projects" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                  View All Projects <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={project.projectStatus === 'Active' ? 'success' : 'info'}>
                          {project.projectStatus}
                        </Badge>
                        <span className="text-[11px] text-slate-400 font-mono">{project.grantNumber || 'GRANT-PENDING'}</span>
                      </div>
                      <h3 className="font-semibold text-slate-900 text-sm hover:text-blue-600 transition-colors">
                        <Link href={`/projects/${project.id}`}>{project.projectTitle}</Link>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Lead: <span className="font-medium text-slate-700">{project.leadProfessor.fname} {project.leadProfessor.lname}</span> · {project.department.university.abbreviation}
                      </p>
                    </div>

                    <Link
                      href={`/projects/${project.id}`}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded-md text-xs font-medium self-start sm:self-center shrink-0 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Publications Sidebar */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">Recent Publications</h2>
                <Link href="/publications" className="text-xs font-semibold text-blue-600 hover:underline">
                  Explore
                </Link>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-4">
                {recentPublications.map((pub) => (
                  <div key={pub.id} className="border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                    <h4 className="text-xs font-semibold text-slate-900 line-clamp-2 hover:text-blue-600">
                      <Link href={`/publications`}>{pub.title}</Link>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {pub.journalName || 'Peer Reviewed'} · <span className="font-medium">{pub.publicationYear}</span>
                    </p>
                  </div>
                ))}
              </div>

              {/* Quick DB Info */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-900 font-semibold text-xs mb-1">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>SQL*Plus Live Instance</span>
                </div>
                <p className="text-[11px] text-blue-700 leading-relaxed">
                  Oracle 21c XE database schema synchronized. Execute views, procedures, and trigger verification via <code className="bg-blue-100 px-1 py-0.5 rounded">sqlplus</code>.
                </p>
                <Link
                  href="/db-analytics"
                  className="mt-2 inline-block text-[11px] font-semibold text-blue-700 hover:underline"
                >
                  Open DBMS Console &rarr;
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
