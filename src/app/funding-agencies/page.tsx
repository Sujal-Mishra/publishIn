import { getFundingAgencies, getIndustries } from '@/services/funding.service'
import { getCurrentUser } from '@/lib/auth'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'
import { Banknote, Building2, ExternalLink } from 'lucide-react'

export default async function FundingAgenciesPage() {
  const user = await getCurrentUser()
  const agencies = await getFundingAgencies()
  const industries = await getIndustries()

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userName={user?.name} userRole={user?.role} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar userName={user?.name} userRole={user?.role} />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Funding Agencies & Industry Partners</h1>
            <p className="text-xs text-slate-500 mt-1">
              National research councils, government grant providers, and industrial R&D collaborators
            </p>
          </div>

          {/* Funding Agencies Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Banknote className="w-5 h-5 text-emerald-600" />
              Government & National Funding Agencies ({agencies.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {agencies.map((agency) => (
                <div key={agency.id} className="bg-white border border-slate-200 rounded-lg p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-base">{agency.name}</h3>
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded">
                      {agency._count.projects} Grants Active
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">Official Contact: {agency.email || 'grants@agency.gov.in'}</p>

                  {agency.projects.length > 0 && (
                    <div className="pt-2 space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Funded Projects</span>
                      {agency.projects.map((p) => (
                        <div key={p.id} className="text-xs font-medium text-slate-800 hover:text-blue-600">
                          <Link href={`/projects/${p.id}`}>• {p.projectTitle}</Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Industry R&D Partners */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Industry R&D Partners ({industries.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {industries.map((ind) => (
                <div key={ind.id} className="bg-white border border-slate-200 rounded-lg p-6 space-y-2">
                  <h3 className="font-bold text-slate-900 text-base">{ind.name}</h3>
                  <p className="text-xs text-slate-500">{ind.industryType} · {ind.contactEmail}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
