import { getUniversities } from '@/services/university.service'
import { getCurrentUser } from '@/lib/auth'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'
import { GraduationCap, MapPin, Building2, FlaskConical, Award } from 'lucide-react'

export default async function UniversitiesPage() {
  const user = await getCurrentUser()
  const universities = await getUniversities()

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userName={user?.name} userRole={user?.role} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar userName={user?.name} userRole={user?.role} />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Partner Universities</h1>
            <p className="text-xs text-slate-500 mt-1">
              National institutes of technology, autonomous universities, and premier research centers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map((u) => (
              <div
                key={u.id}
                className="bg-white border border-slate-200 rounded-lg p-6 hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-sm border border-blue-100">
                      {u.abbreviation}
                    </div>
                    <Badge variant="outline">NIRF Rank #{u.ranking}</Badge>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base hover:text-blue-600 transition-colors">
                      <Link href={`/universities/${u.id}`}>{u.universityName}</Link>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{u.locations[0]?.location || 'India'}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span>{u._count.departments} Departments</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FlaskConical className="w-4 h-4 text-slate-400" />
                      <span>{u._count.laboratories} Labs</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400">Est. {u.establishedYear}</span>
                  <Link
                    href={`/universities/${u.id}`}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    View Departments &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
