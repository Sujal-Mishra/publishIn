import { getUniversityById } from '@/services/university.service'
import { getCurrentUser } from '@/lib/auth'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Badge } from '@/components/ui/Badge'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { GraduationCap, MapPin, Building2, FlaskConical, Users, Globe, ExternalLink } from 'lucide-react'

export default async function UniversityDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getCurrentUser()
  const resolvedParams = await params
  const university = await getUniversityById(resolvedParams.id)

  if (!university) {
    notFound()
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userName={user?.name} userRole={user?.role} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar userName={user?.name} userRole={user?.role} />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Top Banner Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xl shadow-xs">
                  {university.abbreviation}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {university.universityName}
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {university.type} University · Established {university.establishedYear}
                  </p>
                </div>
              </div>

              <Badge variant="outline">NIRF Rank #{university.ranking}</Badge>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 border-t border-slate-100 pt-4">
              {university.locations.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>Campus Locations: {university.locations.map(l => l.location).join('; ')}</span>
                </div>
              )}
              {university.website && (
                <a
                  href={university.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-blue-600 font-semibold hover:underline"
                >
                  <Globe className="w-4 h-4" />
                  Official Portal
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Departments Grid */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Academic Departments ({university.departments.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {university.departments.map((dept) => (
                <div key={dept.id} className="bg-white border border-slate-200 rounded-lg p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-base">{dept.departmentName}</h3>
                    <span className="text-[11px] font-mono text-slate-400">Office: {dept.office}</span>
                  </div>

                  {dept.hod && (
                    <p className="text-xs text-slate-600">
                      Head of Department: <span className="font-semibold text-slate-800">{dept.hod}</span>
                    </p>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {dept.researchers.length} Faculty Members
                    </span>
                    <Link
                      href={`/departments/${dept.id}`}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      Department R&D &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
