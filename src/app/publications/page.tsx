import { getPublications } from '@/services/publication.service'
import { getCurrentUser } from '@/lib/auth'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'
import { BookOpen, ExternalLink, Award } from 'lucide-react'

export default async function PublicationsPage() {
  const user = await getCurrentUser()
  const publications = await getPublications({})

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userName={user?.name} userRole={user?.role} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar userName={user?.name} userRole={user?.role} />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Publications</h1>
            <p className="text-xs text-slate-500 mt-1">
              Peer-reviewed journal articles, conference proceedings, and indexed publications
            </p>
          </div>

          <div className="space-y-4">
            {publications.map((pub) => (
              <div key={pub.id} className="bg-white border border-slate-200 rounded-lg p-6 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded">
                    {pub.publicationYear}
                  </span>
                  <span className="text-xs font-medium text-slate-500">{pub.journalName || 'Peer Reviewed'}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-base">{pub.title}</h3>

                <p className="text-xs text-slate-500">
                  Project:{' '}
                  <Link href={`/projects/${pub.project.id}`} className="font-semibold text-slate-800 hover:text-blue-600">
                    {pub.project.projectTitle}
                  </Link>{' '}
                  · Lead: {pub.project.leadProfessor.fname} {pub.project.leadProfessor.lname} ({pub.project.department.university.abbreviation})
                </p>

                {pub.doi && (
                  <div className="pt-2 flex items-center gap-1.5 text-xs text-emerald-700 font-mono">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    <span>DOI: https://doi.org/{pub.doi}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
