import { getProjectById } from '@/services/project.service'
import { getCurrentUser } from '@/lib/auth'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Badge } from '@/components/ui/Badge'
import { ProjectGrantSection } from '@/components/projects/ProjectGrantSection'
import { ProjectPublicationsSection } from '@/components/publications/ProjectPublicationsSection'
import { ProjectApplicationModal } from '@/components/projects/ProjectApplicationModal'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  FolderGit2,
  Users,
  Banknote,
  Calendar,
  BookOpen,
  FileKey,
  Database,
  Building2,
  FlaskConical,
  Award
} from 'lucide-react'

export default async function ProjectDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getCurrentUser()
  const resolvedParams = await params
  const [project, otherResearchers, industries] = await Promise.all([
    getProjectById(resolvedParams.id),
    prisma.researcher.findMany({
      take: 6,
      select: { id: true, fname: true, lname: true, role: true }
    }),
    prisma.industry.findMany({
      select: { id: true, name: true, industryType: true }
    })
  ])

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
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-3 max-w-3xl">
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
              </div>

              {/* Action Buttons: Apply to Join & Corporate Sponsorship */}
              <div className="shrink-0">
                <ProjectApplicationModal
                  projectId={project.id}
                  projectTitle={project.projectTitle}
                  leadProfessorName={`${project.leadProfessor.fname} ${project.leadProfessor.lname}`}
                  currentUserId={user?.id}
                  availableApplicants={otherResearchers.map((r) => ({
                    id: r.id,
                    name: `${r.fname} ${r.lname}`,
                    role: r.role
                  }))}
                  availableIndustries={industries.map((ind) => ({
                    id: ind.id,
                    name: ind.name,
                    industryType: ind.industryType
                  }))}
                />
              </div>
            </div>

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

          {/* National Grant Lifecycle & Budget Tracker Section */}
          <ProjectGrantSection
            projectId={project.id}
            status={project.projectStatus}
            proposalDate={project.topDate}
            startDate={project.startDate}
            endDate={project.endDate}
            budget={project.budget}
            grantNumber={project.grantNumber}
            fundingAgencyName={project.fundingAgency?.name}
            initialMilestones={project.milestones}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Research Outputs: Publications, Patents, Datasets */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Publications, Patents & Datasets ({project.publications.length + project.patents.length + project.datasets.length})
                </h2>

                {/* Interactive Publications with One-Click Citation & DOI Autofill */}
                <ProjectPublicationsSection
                  projectId={project.id}
                  projectTitle={project.projectTitle}
                  initialPublications={project.publications}
                  leadAuthorName={`${project.leadProfessor.fname} ${project.leadProfessor.lname}`}
                />

                {project.patents.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Patents Granted</h3>
                    {project.patents.map((pat) => (
                      <div key={pat.id} className="p-3 bg-purple-50/50 rounded-lg border border-purple-200 text-purple-950">
                        <p className="text-xs font-semibold">{pat.title}</p>
                        <p className="text-[11px] text-purple-700 mt-0.5">
                          Grant Date: {pat.grantDate ? new Date(pat.grantDate).toLocaleDateString() : 'Pending'} · DOI: {pat.doi || 'N/A'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {project.datasets.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Research Datasets</h3>
                    {project.datasets.map((ds) => (
                      <div key={ds.id} className="p-3 bg-emerald-50/40 rounded-lg border border-emerald-200">
                        <p className="text-xs font-semibold text-emerald-950">{ds.title}</p>
                        <p className="text-[11px] text-emerald-700 mt-0.5 font-mono">{ds.location}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Team & Members */}
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Project Team Members ({project.members.length})
                  </h2>
                </div>

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
                        {m.role.startsWith('Pending:') ? (
                          <span className="text-[10px] text-amber-600 font-bold block">
                            {m.role} (Review Pending)
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 block">{m.role}</span>
                        )}
                      </div>
                      <Badge variant={m.role.startsWith('Pending:') ? 'warning' : 'outline'}>
                        {m.role.startsWith('Pending:') ? 'Applicant' : m.researcher.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Domains and Skills */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  Research Focus & Technologies
                </h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Domains
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.domains.map((d) => (
                        <span key={d.domain.id} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-md">
                          {d.domain.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Skills & Stacks
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.skills.map((s) => (
                        <span key={s.skill.id} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded-md">
                          {s.skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
