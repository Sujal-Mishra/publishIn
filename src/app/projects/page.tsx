import { getProjects } from '@/services/project.service'
import { getCurrentUser } from '@/lib/auth'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import Link from 'next/link'
import { FolderGit2, Search, PlusCircle, Banknote, Calendar, Layers } from 'lucide-react'

export default async function ProjectsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; status?: string }>
}) {
  const user = await getCurrentUser()
  const resolvedParams = await searchParams
  const query = resolvedParams.q || ''
  const status = resolvedParams.status || ''

  const { projects, total } = await getProjects({ query, status })

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userName={user?.name} userRole={user?.role} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar userName={user?.name} userRole={user?.role} />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Research Projects</h1>
              <p className="text-xs text-slate-500 mt-1">
                Explore active research initiatives, grant budgets, and milestone progress ({total} Total)
              </p>
            </div>

            {user?.role === 'PROFESSOR' && (
              <Link
                href="/projects/create"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                Create New Project
              </Link>
            )}
          </div>

          {/* Filter Form */}
          <form method="GET" action="/projects" className="flex flex-wrap items-center gap-3 bg-white p-4 border border-slate-200 rounded-lg shadow-xs">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search by project title or grant number..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              name="status"
              defaultValue={status}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Proposed">Proposed</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>

            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs"
            >
              Filter
            </button>
          </form>

          {projects.length === 0 ? (
            <EmptyState title="No research projects found" description="Try resetting your filters." />
          ) : (
            <div className="space-y-4">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-6 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={p.projectStatus === 'Active' ? 'success' : 'info'}>
                        {p.projectStatus}
                      </Badge>
                      {p.grantNumber && (
                        <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {p.grantNumber}
                        </span>
                      )}
                      {p.fundingAgency && (
                        <span className="text-xs font-medium text-slate-500">
                          Funded by {p.fundingAgency.name}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/projects/${p.id}`}
                      className="text-xs font-semibold text-blue-600 hover:underline self-start sm:self-auto"
                    >
                      View Full Details &rarr;
                    </Link>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base hover:text-blue-600 transition-colors">
                      <Link href={`/projects/${p.id}`}>{p.projectTitle}</Link>
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Lead Investigator:{' '}
                      <span className="font-semibold text-slate-800">
                        {p.leadProfessor.fname} {p.leadProfessor.lname}
                      </span>{' '}
                      ({p.department.university.abbreviation} - {p.department.departmentName})
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-100 text-xs text-slate-500">
                    {p.budget && (
                      <div className="flex items-center gap-1.5">
                        <Banknote className="w-4 h-4 text-emerald-600" />
                        <span>Budget: <strong className="text-slate-800">₹{p.budget.toLocaleString('en-IN')}</strong></span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>Start: {new Date(p.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-slate-400" />
                      <span>{p._count.milestones} Milestones · {p._count.publications} Publications</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
