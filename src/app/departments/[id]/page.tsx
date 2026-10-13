import { getDepartmentById } from '@/services/university.service'
import { getCurrentUser } from '@/lib/auth'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Badge } from '@/components/ui/Badge'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Building2, GraduationCap, Users, FolderGit2, FlaskConical } from 'lucide-react'

export default async function DepartmentDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getCurrentUser()
  const resolvedParams = await params
  const department = await getDepartmentById(resolvedParams.id)

  if (!department) {
    notFound()
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userName={user?.name} userRole={user?.role} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar userName={user?.name} userRole={user?.role} />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs space-y-3">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              {department.university.universityName}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {department.departmentName}
            </h1>
            <p className="text-xs text-slate-500">
              HOD: <span className="font-semibold text-slate-700">{department.hod}</span> · Office: {department.office}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Faculty Members */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Faculty & Researchers ({department.researchers.length})
              </h2>

              <div className="space-y-3">
                {department.researchers.map((r) => (
                  <div key={r.id} className="p-3 border border-slate-200 rounded-lg flex items-center justify-between">
                    <div>
                      <Link href={`/researchers/${r.id}`} className="font-semibold text-slate-900 text-xs hover:text-blue-600">
                        {r.fname} {r.lname}
                      </Link>
                      <p className="text-[11px] text-slate-500">{r.currentPosition}</p>
                    </div>
                    <Badge variant="outline">{r.role}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Department Projects */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-blue-600" />
                Active R&D Projects ({department.projects.length})
              </h2>

              <div className="space-y-3">
                {department.projects.map((p) => (
                  <div key={p.id} className="p-3 border border-slate-200 rounded-lg space-y-1">
                    <Link href={`/projects/${p.id}`} className="font-semibold text-slate-900 text-xs hover:text-blue-600">
                      {p.projectTitle}
                    </Link>
                    <p className="text-[11px] text-slate-500">
                      Lead: {p.leadProfessor.fname} {p.leadProfessor.lname}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
