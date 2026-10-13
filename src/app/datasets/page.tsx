import { getDatasets } from '@/services/publication.service'
import { getCurrentUser } from '@/lib/auth'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'
import { Database, Download, ExternalLink } from 'lucide-react'

export default async function DatasetsPage() {
  const user = await getCurrentUser()
  const datasets = await getDatasets({})

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userName={user?.name} userRole={user?.role} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar userName={user?.name} userRole={user?.role} />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Open Research Datasets</h1>
            <p className="text-xs text-slate-500 mt-1">
              Curated telemetry datasets, experimental benchmarks, and open research data repositories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {datasets.map((ds) => (
              <div key={ds.id} className="bg-white border border-slate-200 rounded-lg p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{ds.title}</h3>
                    <p className="text-[11px] text-slate-500 font-mono">{ds.name}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-500">
                  Project: <Link href={`/projects/${ds.project.id}`} className="font-semibold text-slate-700 hover:text-blue-600">{ds.project.projectTitle}</Link>
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400 truncate max-w-[220px]">{ds.location}</span>
                  <a
                    href={ds.location}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold"
                  >
                    <Download className="w-3.5 h-3.5" /> Access Data
                  </a>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
