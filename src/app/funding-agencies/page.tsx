import { getFundingAgencies, getIndustries } from '@/services/funding.service'
import { getCurrentUser } from '@/lib/auth'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'
import {
  Banknote,
  Building2,
  ExternalLink,
  Award,
  TrendingUp,
  FileCheck2,
  Landmark,
  ShieldCheck
} from 'lucide-react'

export default async function FundingAgenciesPage() {
  const user = await getCurrentUser()
  const agencies = await getFundingAgencies()
  const industries = await getIndustries()

  // Compute National Aggregate Metrics
  const totalGrants = agencies.reduce((acc, a) => acc + (a._count?.projects || 0), 0)
  const totalFundingPool = agencies.reduce(
    (acc, a) =>
      acc +
      a.projects.reduce((pAcc, p) => pAcc + (Number(p.budget) || 0), 0),
    0
  )

  const formatINR = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakh`
    }
    return `₹${val.toLocaleString('en-IN')}`
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userName={user?.name} userRole={user?.role} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar userName={user?.name} userRole={user?.role} />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              National Research Finance
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Funding Agencies & Statutory Grant Councils
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Statutory government councils, scientific research foundations, and industrial R&D sponsors
            </p>
          </div>

          {/* National Grant Metrics Header */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium block">Total Sanctioned Capital</span>
                <span className="text-xl font-extrabold text-emerald-700 mt-1 block">
                  {formatINR(totalFundingPool)}
                </span>
                <span className="text-[11px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Live active commitments
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Banknote className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium block">Sanctioned Research Grants</span>
                <span className="text-xl font-extrabold text-blue-700 mt-1 block">
                  {totalGrants} Active Programs
                </span>
                <span className="text-[11px] text-blue-600 font-medium mt-0.5 flex items-center gap-1">
                  <FileCheck2 className="w-3 h-3" /> Under monitoring
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium block">Statutory Bodies & Industry</span>
                <span className="text-xl font-extrabold text-purple-700 mt-1 block">
                  {agencies.length + industries.length} Partners
                </span>
                <span className="text-[11px] text-purple-600 font-medium mt-0.5 flex items-center gap-1">
                  <Landmark className="w-3 h-3" /> National accreditation
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Funding Agencies Section */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-emerald-600" />
              Government & Statutory Funding Councils ({agencies.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {agencies.map((agency) => {
                const agencyBudget = agency.projects.reduce(
                  (sum, p) => sum + (Number(p.budget) || 0),
                  0
                )

                return (
                  <div
                    key={agency.id}
                    className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{agency.name}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {agency.email || 'grants@agency.gov.in'}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg shrink-0">
                        {agency._count.projects} Active Grants
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-[11px] text-slate-400 font-medium block">
                          Committed Capital
                        </span>
                        <span className="font-bold text-slate-800 text-sm">
                          {formatINR(agencyBudget)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 font-medium block">
                          Portal Portal
                        </span>
                        {agency.website ? (
                          <a
                            href={agency.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1 font-medium truncate"
                          >
                            Visit Portal <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ) : (
                          <span className="text-slate-400">Direct Notification</span>
                        )}
                      </div>
                    </div>

                    {agency.projects.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          Active Sanctioned Programs
                        </span>
                        <div className="space-y-2">
                          {agency.projects.map((p) => (
                            <Link
                              key={p.id}
                              href={`/projects/${p.id}`}
                              className="group block p-2.5 bg-slate-50/50 hover:bg-blue-50/50 border border-slate-200/80 rounded-lg transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 truncate max-w-xs">
                                  {p.projectTitle}
                                </span>
                                {p.budget && (
                                  <span className="text-[11px] font-mono font-bold text-emerald-700 shrink-0">
                                    {formatINR(p.budget)}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                                <span>PI: {p.leadProfessor?.fname} {p.leadProfessor?.lname}</span>
                                <span>•</span>
                                <span>{p.department?.university?.abbreviation || 'IIT'}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Industry Partners Section */}
          <div className="space-y-4 pt-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-purple-600" />
              Corporate R&D Sponsorship & Industry Collaborations ({industries.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {industries.map((ind) => (
                <div
                  key={ind.id}
                  className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{ind.name}</h3>
                      <span className="text-xs text-purple-700 font-medium">
                        Sector: {ind.industryType}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 text-xs font-semibold rounded">
                      {ind.collaborations.length} Active Joint R&D
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">Contact: {ind.contactEmail || 'research@industry.com'}</p>

                  {ind.collaborations.length > 0 && (
                    <div className="pt-2 space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Sponsored Initiatives
                      </span>
                      {ind.collaborations.map((c) => (
                        <div key={c.id} className="text-xs font-medium text-slate-700">
                          • {c.collaborationType} {c.project ? `(${c.project.projectTitle})` : ''}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
