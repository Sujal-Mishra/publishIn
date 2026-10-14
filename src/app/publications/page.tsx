import { getPublications } from '@/services/publication.service'
import { getProjects } from '@/services/project.service'
import { getCurrentUser } from '@/lib/auth'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { PublicationsList } from '@/components/publications/PublicationsList'
import { BookOpen, Sparkles, FileText, Award } from 'lucide-react'

export default async function PublicationsPage() {
  const user = await getCurrentUser()
  const publications = await getPublications({})
  const { projects } = await getProjects({ limit: 100 })

  const projectOptions = projects.map((p) => ({
    id: p.id,
    projectTitle: p.projectTitle
  }))

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userName={user?.name} userRole={user?.role} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar userName={user?.name} userRole={user?.role} />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Scholarly Repository
              </span>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[11px] font-semibold rounded">
                CrossRef & DOI Indexed
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              National Research Publications & Citations
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Peer-reviewed journal articles, conference proceedings, and indexed publications with one-click BibTeX export
            </p>
          </div>

          <PublicationsList
            initialPublications={publications as any}
            projects={projectOptions}
          />
        </main>
      </div>
    </div>
  )
}
