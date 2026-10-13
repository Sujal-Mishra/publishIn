import { getPatents } from '@/services/publication.service'
import { getCurrentUser } from '@/lib/auth'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'
import { FileKey, Award } from 'lucide-react'

export default async function PatentsPage() {
  const user = await getCurrentUser()
  const patents = await getPatents({})

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userName={user?.name} userRole={user?.role} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar userName={user?.name} userRole={user?.role} />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Granted & Filed Patents</h1>
            <p className="text-xs text-slate-500 mt-1">
              Intellectual property, technology disclosures, and patent filings across partner universities
            </p>
          </div>

          <div className="space-y-4">
            {patents.map((pat) => (
              <div key={pat.id} className="bg-white border border-purple-200 rounded-lg p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 text-xs font-semibold rounded">
                    Patent ID / DOI: {pat.doi || 'N/A'}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    Grant Date: {pat.grantDate ? new Date(pat.grantDate).toLocaleDateString() : 'Pending'}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base">{pat.title}</h3>

                <p className="text-xs text-slate-500">
                  Project:{' '}
                  <Link href={`/projects/${pat.project.id}`} className="font-semibold text-slate-800 hover:text-blue-600">
                    {pat.project.projectTitle}
                  </Link>{' '}
                  ({pat.project.department.university.abbreviation})
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
