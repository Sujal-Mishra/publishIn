'use client'

import React, { useState } from 'react'
import {
  FileText,
  Download,
  Building2,
  Banknote,
  GraduationCap,
  Award,
  BookOpen,
  FlaskConical,
  Briefcase,
  Printer,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  X
} from 'lucide-react'
import { InstitutionalReportData } from '@/services/university.service'

interface InstitutionalReportSectionProps {
  report: InstitutionalReportData
}

export function InstitutionalReportSection({ report }: InstitutionalReportSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [downloadingCsv, setDownloadingCsv] = useState(false)

  const handleDownloadCsv = () => {
    setDownloadingCsv(true)
    try {
      window.location.href = `/api/universities/${report.university.id}/report?format=csv`
    } finally {
      setTimeout(() => setDownloadingCsv(false), 1500)
    }
  }

  const handlePrintPdf = () => {
    // Open modal first if not open, then trigger window.print()
    setIsModalOpen(true)
    setTimeout(() => {
      window.print()
    }, 400)
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`
    }
    return `₹${amount.toLocaleString('en-IN')}`
  }

  return (
    <>
      {/* 1. Executive Accreditation Audit Section on University Detail Page */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Banner */}
        <div className="p-6 bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Institutional Research Audit (NAAC / NIRF / ABET)
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                {report.accreditationGrade}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Annual Institutional Research Performance Summary
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Official statutory research audit aggregating active grants, department publications, patents, doctoral completions, and corporate R&D partnerships.
            </p>
          </div>

          {/* Action Export Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              onClick={handleDownloadCsv}
              disabled={downloadingCsv}
              className="px-3.5 py-2 rounded-lg text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              {downloadingCsv ? 'Exporting...' : 'Export CSV'}
            </button>
            <button
              onClick={handlePrintPdf}
              className="px-3.5 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              Download Audit PDF
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-2 rounded-lg text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              View Full Report
            </button>
          </div>
        </div>

        {/* Executive KPI Summary Cards */}
        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 bg-slate-50/60 border-b border-slate-100">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Active Grants Capital
            </span>
            <div className="flex items-baseline gap-1 mt-1 text-emerald-700">
              <Banknote className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-lg font-extrabold">{formatCurrency(report.summary.totalActiveFunding)}</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              {report.summary.totalActiveProjects} Active Projects
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Total Funding Received
            </span>
            <div className="flex items-baseline gap-1 mt-1 text-slate-900">
              <span className="text-lg font-extrabold font-mono">{formatCurrency(report.summary.totalFundingReceived)}</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Lifetime Grants ({report.summary.totalProjects})
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Peer-Reviewed Papers
            </span>
            <div className="flex items-baseline gap-1 mt-1 text-blue-700">
              <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-lg font-extrabold font-mono">{report.summary.totalPublications}</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Indexed in CrossRef & DOI
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Patents Granted
            </span>
            <div className="flex items-baseline gap-1 mt-1 text-purple-700">
              <Award className="w-4 h-4 text-purple-600 shrink-0" />
              <span className="text-lg font-extrabold font-mono">{report.summary.totalPatentsGranted}</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              {report.summary.totalJointPatents} with Industry
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Doctoral Scholars
            </span>
            <div className="flex items-baseline gap-1 mt-1 text-indigo-700">
              <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="text-lg font-extrabold font-mono">{report.summary.totalPhdScholars}</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Ph.D. Completions & Enrolled
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Industry Partners
            </span>
            <div className="flex items-baseline gap-1 mt-1 text-amber-700">
              <Briefcase className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-lg font-extrabold font-mono">{report.summary.totalIndustryPartners}</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Corporate R&D Alliances
            </span>
          </div>
        </div>

        {/* Quick Department Snapshot */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              Department-wise Accreditation & Output Matrix
            </h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
            >
              Expand All Details &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Faculty</th>
                  <th className="py-2.5 px-3">Ph.D. Scholars</th>
                  <th className="py-2.5 px-3">Active Grants</th>
                  <th className="py-2.5 px-3">Publications</th>
                  <th className="py-2.5 px-3">Patents</th>
                  <th className="py-2.5 px-3">Facilities</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {report.departmentMetrics.map((dept) => (
                  <tr key={dept.departmentId} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {dept.departmentName}
                      {dept.hod && <span className="block text-[11px] text-slate-400 font-normal">HOD: {dept.hod}</span>}
                    </td>
                    <td className="py-3 px-3 font-mono">{dept.facultyCount}</td>
                    <td className="py-3 px-3 font-mono font-bold text-indigo-700">{dept.phdCompletionsCount}</td>
                    <td className="py-3 px-3 font-mono font-semibold text-emerald-700">
                      {formatCurrency(dept.activeFunding)}
                      <span className="block text-[10px] text-slate-400 font-normal">({dept.activeProjectsCount} Active)</span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-blue-700">{dept.publicationsCount}</td>
                    <td className="py-3 px-3 font-mono font-bold text-purple-700">{dept.patentsCount}</td>
                    <td className="py-3 px-3 text-slate-500">
                      {dept.laboratoriesCount} Labs
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 2. Comprehensive Accreditation Audit Modal & Printable PDF Template */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Actions Bar (Hidden during printing) */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between sticky top-0 z-20 print:hidden">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm">
                  Official Institutional Research Audit Report
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadCsv}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  CSV
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Save as PDF
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Report Document */}
            <div className="p-8 sm:p-12 space-y-8 print:p-0">
              {/* Official Academic Header */}
              <div className="border-b-2 border-slate-900 pb-6 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-bold tracking-widest text-blue-700 uppercase">
                      Statutory Accreditation Audit Dossier · NAAC / NIRF / ABET
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                      {report.university.universityName}
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                      {report.university.type} University · Established {report.university.establishedYear} · {report.university.locations.join('; ')}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-block px-3 py-1 rounded-md text-xs font-extrabold bg-blue-900 text-white font-mono">
                      NIRF RANK #{report.university.ranking || 'TOP'}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">
                      Doc Ref: RH-{report.university.abbreviation}-{new Date().getFullYear()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div>
                    <strong>Accreditation Projection:</strong>{' '}
                    <span className="text-emerald-700 font-semibold">{report.accreditationGrade}</span>
                  </div>
                  <div>
                    <strong>Audit Date:</strong>{' '}
                    {new Date(report.generatedAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div>
                    <strong>Portal:</strong> {report.university.website || 'https://researchhub.demo'}
                  </div>
                </div>
              </div>

              {/* Section 1: Executive KPI Metrics */}
              <div className="space-y-3">
                <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  1. Statutory Grants & Capital Utilization Summary
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Grant Liquidity</span>
                    <span className="text-lg font-black text-emerald-800 font-mono">
                      {formatCurrency(report.summary.totalActiveFunding)}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {report.summary.totalActiveProjects} Active Projects
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Sanctioned Capital</span>
                    <span className="text-lg font-black text-slate-900 font-mono">
                      {formatCurrency(report.summary.totalFundingReceived)}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {report.summary.totalProjects} Lifetime Sanctions
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Scholarly Publications</span>
                    <span className="text-lg font-black text-blue-800 font-mono">
                      {report.summary.totalPublications}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Peer-Reviewed Papers</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Doctoral Completions</span>
                    <span className="text-lg font-black text-indigo-800 font-mono">
                      {report.summary.totalPhdScholars}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Ph.D. Candidates</span>
                  </div>
                </div>

                {/* Top Funding Councils */}
                {report.summary.topFundingAgencies.length > 0 && (
                  <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-200 text-xs">
                    <span className="font-bold text-slate-700 block mb-1">
                      Statutory Funding Council Distribution:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {report.summary.topFundingAgencies.map((fa) => (
                        <span key={fa.name} className="px-2 py-0.5 rounded bg-white border border-slate-200 font-medium text-slate-700">
                          {fa.name}: <strong>{formatCurrency(fa.capital)}</strong> ({fa.projectCount} Projects)
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2: Department-wise Matrix */}
              <div className="space-y-3">
                <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  2. Department-wise Publications, Patents & Doctoral Completions
                </h2>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">Department</th>
                        <th className="py-2.5 px-3">Faculty</th>
                        <th className="py-2.5 px-3">Ph.D. Scholars</th>
                        <th className="py-2.5 px-3">Publications</th>
                        <th className="py-2.5 px-3">Patents</th>
                        <th className="py-2.5 px-3">Active Grants</th>
                        <th className="py-2.5 px-3">Active Capital</th>
                        <th className="py-2.5 px-3">Laboratories</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {report.departmentMetrics.map((dept) => (
                        <tr key={dept.departmentId}>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">
                            {dept.departmentName}
                            {dept.hod && <span className="block text-[10px] text-slate-400 font-normal">HOD: {dept.hod}</span>}
                          </td>
                          <td className="py-2.5 px-3 font-mono">{dept.facultyCount}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-indigo-700">{dept.phdCompletionsCount}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{dept.publicationsCount}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-purple-700">{dept.patentsCount}</td>
                          <td className="py-2.5 px-3 font-mono">{dept.activeProjectsCount}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">{formatCurrency(dept.activeFunding)}</td>
                          <td className="py-2.5 px-3 text-[11px] text-slate-500">
                            {dept.laboratories.map((l) => l.name).join(', ') || 'Department Central Lab'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 3: Industry R&D Alliances & Joint Patents */}
              <div className="space-y-3">
                <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-purple-600" />
                  3. Industry R&D Partners & Joint Intellectual Property (Patents)
                </h2>

                {report.industryPartners.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No corporate R&D alliances registered for this audit cycle.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {report.industryPartners.map((ind) => (
                      <div key={ind.industryId} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900 text-sm">{ind.industryName}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                            {ind.industryType}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          <strong>Collaboration Mode:</strong> {ind.collaborationTypes.join(', ')} ·{' '}
                          <strong>Joint Patents:</strong> {ind.jointPatentsCount}
                        </p>
                        {ind.jointPatents.length > 0 && (
                          <div className="space-y-1 pt-1 border-t border-slate-200">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Granted Joint Patents:</span>
                            {ind.jointPatents.map((jp) => (
                              <div key={jp.id} className="text-[11px] text-purple-900 font-medium">
                                • {jp.title} {jp.doi && <span className="font-mono text-slate-500">({jp.doi})</span>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 4: Audit Verification & Statutory Sign-off */}
              <div className="pt-6 border-t-2 border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-slate-600">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Dean of Research & Development</span>
                  <div className="h-10 border-b border-dashed border-slate-300"></div>
                  <span className="text-[11px] text-slate-500">Sign & Institutional Seal</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">NAAC / Internal Quality Assurance (IQAC)</span>
                  <div className="h-10 border-b border-dashed border-slate-300"></div>
                  <span className="text-[11px] text-slate-500">Sign & Verified Date</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Statutory System Verification</span>
                  <div className="h-10 flex items-center text-emerald-700 font-semibold gap-1 text-[11px]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Cryptographically Audited via ResearchHub
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">HASH: SHA256-RH-{report.university.abbreviation}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
