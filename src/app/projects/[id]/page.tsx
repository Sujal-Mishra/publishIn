import { getProjectById } from '@/services/project.service'
import { getCurrentUser } from '@/lib/auth'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Badge } from '@/components/ui/Badge'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  FolderGit2,
  Users,
  Banknote,
  Calendar,
  CheckCircle2,
  Clock,
  BookOpen,
  FileKey,
  Database,
  Building2,
  FlaskConical
} from 'lucide-react'

export default async function ProjectDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getCurrentUser()
  const resolvedParams = await params
  const project = await getProjectById(resolvedParams.id)

  if (!project) {
    notFound()
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userName={user?.name} userRole={user?.role} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar userName={user?.name} userRole={user?.role} />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Header Banner */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={project.projectStatus === 'Active' ? 'success' : 'info'}>
                {project.projectStatus}
              </Badge>
              {project.grantNumber && (
                <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded border border-slate-200">
                  {project.grantNumber}
                </span>
              )}
              {project.fundingAgency && (
                <span className="text-xs font-medium text-slate-500">
                  Funded by {project.fundingAgency.name}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {project.projectTitle}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 border-t border-slate-100 pt-4">
              <div>
                Lead Investigator:{' '}
                <Link
                  href={`/researchers/${project.leadProfessor.id}`}
                  className="font-bold text-slate-900 hover:text-blue-600 underline"
                >
                  {project.leadProfessor.fname} {project.leadProfessor.lname}
                </Link>
              </div>

              <div>
                University:{' '}
                <Link
                  href={`/universities/${project.department.university.id}`}
                  className="font-bold text-slate-900 hover:text-blue-600"
                >
                  {project.department.university.universityName}
                </Link>{' '}
                ({project.department.departmentName})
              </div>

              {project.budget && (
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  <span>Budget: ₹{project.budget.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Milestones & Progress */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Project Milestones ({project.milestones.length})
                </h2>

                {project.milestones.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No milestones currently defined.</p>
                ) : (
                  <div className="space-y-3">
                    {project.milestones.map((m) => (
                      <div key={m.id} className="border border-slate-200 rounded-lg p-4 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {m.status === 'Completed' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Clock className="w-4 h-4 text-amber-500" />
                            )}
                            <h3 className="font-semibold text-slate-900 text-sm">{m.title}</h3>
                          </div>
                          {m.description && <p className="text-xs text-slate-500">{m.description}</p>}
                          {m.lab && (
                            <p className="text-[11px] text-blue-600 font-medium">
                              Lab Facility: {m.lab.name}
                            </p>
                          )}
                        </div>
                        <Badge variant={m.status === 'Completed' ? 'success' : 'warning'}>
                          {m.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Research Outputs */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Publications, Patents & Datasets
                </h2>

                {project.publications.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Publications</h3>
                    {project.publications.map((pub) => (
                      <div key={pub.id} className="p-3 bg-slate-50 rounded-md border border-slate-200">
                        <p className="text-xs font-semibold text-slate-900">{pub.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {pub.journalName} ({pub.publicationYear}) · DOI: {pub.doi || 'N/A'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {project.patents.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Patents Granted</h3>
                    {project.patents.map((pat) => (
                      <div key={pat.id} className="p-3 bg-purple-50/50 rounded-md border border-purple-200 text-purple-950">
                        <p className="text-xs font-semibold">{pat.title}</p>
                        <p className="text-[11px] text-purple-700 mt-0.5">Grant Date: {pat.grantDate ? new Date(pat.grantDate).toLocaleDateString() : 'Pending'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Team & Members */}
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Project Team Members ({project.members.length})
                </h2>

                <div className="space-y-3">
                  {project.members.map((m) => (
                    <div key={m.id} className="flex items-center justify-between border-b border-slate-100 last:border-0 pb-2">
                      <div>
                        <Link
                          href={`/researchers/${m.researcher.id}`}
                          className="text-xs font-semibold text-slate-900 hover:text-blue-600 block"
                        >
                          {m.researcher.fname} {m.researcher.lname}
                        </Link>
                        <span className="text-[10px] text-slate-500 block">{m.role}</span>
                      </div>
                      <Badge variant="outline">{m.researcher.role}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
