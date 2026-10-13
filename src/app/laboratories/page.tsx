import { getLaboratories } from '@/services/laboratory.service'
import { getCurrentUser } from '@/lib/auth'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'
import { FlaskConical, Building2, GraduationCap, CheckCircle2 } from 'lucide-react'

export default async function LaboratoriesPage() {
  const user = await getCurrentUser()
  const laboratories = await getLaboratories({})

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userName={user?.name} userRole={user?.role} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar userName={user?.name} userRole={user?.role} />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Research Infrastructure & Laboratories</h1>
            <p className="text-xs text-slate-500 mt-1">
              State-of-the-art laboratory facilities, high-performance computing centers, and core instruments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {laboratories.map((lab) => (
              <div
                key={lab.id}
                className="bg-white border border-slate-200 rounded-lg p-6 hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                      <FlaskConical className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{lab.name}</h3>
                      <p className="text-[11px] text-slate-500">{lab.university.abbreviation}</p>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-slate-500 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{lab.department.departmentName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                      <span>{lab.university.universityName}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Operational
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {lab.milestones.length} Associated Milestones
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
