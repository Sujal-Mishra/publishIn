import { performGlobalSearch } from '@/services/search.service'
import { getCurrentUser } from '@/lib/auth'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { EmptyState } from '@/components/ui/EmptyState'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'
import { Search, Users, FolderGit2, GraduationCap, FlaskConical, BookOpen, FileKey, Database } from 'lucide-react'

export default async function DiscoverPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const user = await getCurrentUser()
  const resolvedParams = await searchParams
  const query = resolvedParams.q || ''

  const results = await performGlobalSearch(query)

  const totalResults =
    results.researchers.length +
    results.projects.length +
    results.universities.length +
    results.laboratories.length +
    results.publications.length +
    results.patents.length +
    results.datasets.length

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userName={user?.name} userRole={user?.role} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar userName={user?.name} userRole={user?.role} />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Global Research Discovery</h1>
            <p className="text-xs text-slate-500 mt-1">
              Search across faculty, projects, universities, core laboratories, and publications
            </p>
          </div>

          {/* Search Bar Input */}
          <form method="GET" action="/discover" className="relative max-w-2xl">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search by keywords, professor name, grant number, or university..."
              className="w-full pl-12 pr-28 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs"
            >
              Search
            </button>
          </form>

          {query && (
            <p className="text-xs text-slate-500 font-medium">
              Found <span className="font-bold text-slate-900">{totalResults}</span> results matching "{query}"
            </p>
          )}

          {totalResults === 0 && query ? (
            <EmptyState
              title="No results found"
              description={`We couldn't find any items matching "${query}". Try searching for keywords like 'AI', 'Quantum', 'Bombay', or 'Professor'.`}
            />
          ) : (
            <div className="space-y-8">
              {/* Researchers Section */}
              {results.researchers.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <h2 className="font-bold text-slate-900 text-sm">Researchers ({results.researchers.length})</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.researchers.map((r) => (
                      <Link
                        key={r.id}
                        href={`/researchers/${r.id}`}
                        className="bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-4 transition-all block"
                      >
                        <span className="text-xs font-bold text-slate-900 block">{r.fname} {r.lname}</span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">{r.currentPosition}</span>
                        <span className="text-[11px] font-medium text-blue-600 block mt-1">
                          {r.department.university.abbreviation} · {r.department.departmentName}
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Projects Section */}
              {results.projects.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <FolderGit2 className="w-4 h-4 text-blue-600" />
                    <h2 className="font-bold text-slate-900 text-sm">Research Projects ({results.projects.length})</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.projects.map((p) => (
                      <Link
                        key={p.id}
                        href={`/projects/${p.id}`}
                        className="bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-4 transition-all block space-y-1"
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="success">{p.projectStatus}</Badge>
                          <span className="text-[11px] text-slate-400 font-mono">{p.grantNumber}</span>
                        </div>
                        <h3 className="font-semibold text-slate-900 text-sm">{p.projectTitle}</h3>
                        <p className="text-xs text-slate-500">
                          Lead: {p.leadProfessor.fname} {p.leadProfessor.lname} · {p.department.university.abbreviation}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Universities Section */}
              {results.universities.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <h2 className="font-bold text-slate-900 text-sm">Universities ({results.universities.length})</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.universities.map((u) => (
                      <Link
                        key={u.id}
                        href={`/universities/${u.id}`}
                        className="bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-4 transition-all block"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-slate-900 text-sm">{u.universityName}</h3>
                          <Badge variant="outline">Rank #{u.ranking}</Badge>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{u.locations[0]?.location}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
