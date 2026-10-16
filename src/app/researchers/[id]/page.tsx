import { getResearcherById } from '@/services/researcher.service'
import { getCurrentUser } from '@/lib/auth'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Badge } from '@/components/ui/Badge'
import { CollaborationRequestModal } from '@/components/collaborations/CollaborationRequestModal'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { GraduationCap, Mail, Phone, MapPin, Award, BookOpen, FolderGit2, Network } from 'lucide-react'

export default async function ResearcherDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getCurrentUser()
  const resolvedParams = await params
  const [researcher, otherResearchers] = await Promise.all([
    getResearcherById(resolvedParams.id),
    prisma.researcher.findMany({
      where: { id: { not: resolvedParams.id } },
      take: 6,
      select: { id: true, fname: true, lname: true, role: true }
    })
  ])

  if (!researcher) {
    notFound()
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userName={user?.name} userRole={user?.role} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar userName={user?.name} userRole={user?.role} />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Top Profile Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {researcher.fname} {researcher.minit ? `${researcher.minit}. ` : ''}{researcher.lname}
                  </h1>
                  <Badge variant={researcher.role === 'PROFESSOR' ? 'info' : 'purple'}>
                    {researcher.role}
                  </Badge>
                </div>

                <p className="text-sm font-semibold text-slate-700">
                  {researcher.currentPosition} {researcher.highestDegree ? `(${researcher.highestDegree})` : ''}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <span>{researcher.department.university.universityName} ({researcher.department.departmentName})</span>
                  </div>
                  {researcher.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span>{researcher.email}</span>
                    </div>
                  )}
                  {researcher.contact && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span>{researcher.contact}</span>
                    </div>
                  )}
                </div>

                {researcher.orcid && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-xs font-mono">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>ORCID iD: https://orcid.org/{researcher.orcid}</span>
                  </div>
                )}
              </div>

              {/* Action Button: Request Collaboration / Mentorship */}
              <div className="shrink-0">
                <CollaborationRequestModal
                  targetResearcher={{
                    id: researcher.id,
                    name: `${researcher.fname} ${researcher.lname}`,
                    role: researcher.role,
                    position: researcher.currentPosition,
                    universityName: researcher.department.university.universityName,
                    departmentName: researcher.department.departmentName
                  }}
                  currentUserId={user?.id}
                  currentUserName={user?.name}
                  availableRequesters={otherResearchers.map((r) => ({
                    id: r.id,
                    name: `${r.fname} ${r.lname}`,
                    role: r.role
                  }))}
                />
              </div>
            </div>

            {/* Biography */}
            {researcher.biography && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Academic Biography</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">{researcher.biography}</p>
              </div>
            )}

            {/* Skills & Domains */}
            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-6">
              {researcher.skills.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Technical Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {researcher.skills.map((s) => (
                      <span key={s.skill.id} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                        {s.skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {researcher.domains.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Research Domains</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {researcher.domains.map((d) => (
                      <span key={d.domain.id} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                        {d.domain.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Research Projects Led */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <FolderGit2 className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-slate-900 text-base">Projects Led as Principal Investigator ({researcher.ledProjects.length})</h2>
            </div>

            {researcher.ledProjects.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">No projects currently led.</p>
            ) : (
              <div className="space-y-3">
                {researcher.ledProjects.map((p) => (
                  <div key={p.id} className="border border-slate-200 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="success">{p.projectStatus}</Badge>
                        <span className="text-[11px] text-slate-400 font-mono">{p.grantNumber}</span>
                      </div>
                      <h3 className="font-semibold text-slate-900 text-sm mt-1">
                        <Link href={`/projects/${p.id}`} className="hover:text-blue-600">
                          {p.projectTitle}
                        </Link>
                      </h3>
                      {p.budget && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          Grant Budget: <span className="font-semibold text-slate-700">₹{p.budget.toLocaleString('en-IN')}</span>
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/projects/${p.id}`}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded-md text-xs font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
