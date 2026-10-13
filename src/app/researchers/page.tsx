import { getResearchers } from '@/services/researcher.service'
import { getCurrentUser } from '@/lib/auth'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import Link from 'next/link'
import { Users, Search, GraduationCap, Award, Mail } from 'lucide-react'

export default async function ResearchersPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; role?: string }>
}) {
  const user = await getCurrentUser()
  const resolvedParams = await searchParams
  const query = resolvedParams.q || ''
  const role = resolvedParams.role || ''

  const { researchers, total } = await getResearchers({
    query,
    role
  })

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userName={user?.name} userRole={user?.role} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar userName={user?.name} userRole={user?.role} />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Researchers Directory</h1>
              <p className="text-xs text-slate-500 mt-1">
                Explore faculty members, research scholars, and academic experts ({total} Total)
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <form method="GET" action="/researchers" className="flex flex-wrap items-center gap-3 bg-white p-4 border border-slate-200 rounded-lg shadow-xs">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search by researcher name, email, or position..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              name="role"
              defaultValue={role}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Academic Roles</option>
              <option value="PROFESSOR">Professors</option>
              <option value="STUDENT">Ph.D. / Student Scholars</option>
              <option value="RESEARCHER">Principal Scientists</option>
            </select>

            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs"
            >
              Filter
            </button>
          </form>

          {researchers.length === 0 ? (
            <EmptyState title="No researchers found" description="Try resetting your filters or search query." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {researchers.map((r) => (
                <div
                  key={r.id}
                  className="bg-white border border-slate-200 rounded-lg p-5 hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors">
                          <Link href={`/researchers/${r.id}`}>{r.fname} {r.minit ? `${r.minit}. ` : ''}{r.lname}</Link>
                        </h3>
                        <p className="text-xs font-medium text-slate-600 mt-0.5">{r.currentPosition}</p>
                      </div>
                      <Badge variant={r.role === 'PROFESSOR' ? 'info' : 'default'}>
                        {r.role}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{r.department.university.abbreviation} · {r.department.departmentName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{r.email}</span>
                      </div>
                      {r.orcid && (
                        <div className="flex items-center gap-2 text-emerald-700 font-mono text-[11px]">
                          <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>ORCID: {r.orcid}</span>
                        </div>
                      )}
                    </div>

                    {r.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {r.skills.slice(0, 3).map((s) => (
                          <span
                            key={s.skill.id}
                            className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-medium"
                          >
                            {s.skill.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">
                      {r._count.ledProjects} Led Projects
                    </span>
                    <Link
                      href={`/researchers/${r.id}`}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      View Profile &rarr;
                    </Link>
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
