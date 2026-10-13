import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Search, Compass, Users, FolderGit2, FlaskConical, ArrowRight, ShieldCheck, DatabaseZap } from 'lucide-react'

export default async function LandingPage() {
  const [researcherCount, universityCount, projectCount, labCount] = await Promise.all([
    prisma.researcher.count(),
    prisma.university.count(),
    prisma.researchProject.count(),
    prisma.laboratory.count()
  ])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Header Bar */}
      <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
            R
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">ResearchHub</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
          >
            Join ResearchHub
          </Link>
        </div>
      </header>

      {/* Main Hero */}
      <main className="max-w-5xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-medium mb-6">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Oracle SQL*Plus & Prisma Database Ecosystem</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Connect research. Share knowledge.<br />
          <span className="text-blue-600">Accelerate innovation.</span>
        </h1>

        <p className="text-base text-slate-600 max-w-2xl mx-auto mt-4 leading-relaxed">
          A unified ecosystem connecting students, professors, researchers, universities, laboratories, industries, and funding agencies across national domains.
        </p>

        <div className="flex items-center justify-center gap-4 mt-8">
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold text-sm shadow-sm transition-colors"
          >
            <Compass className="w-4 h-4" />
            Explore Research
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-md font-semibold text-sm shadow-xs transition-colors"
          >
            Enter Portal
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Database Real Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 text-left">
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Researchers</span>
            <span className="text-3xl font-bold text-slate-900 mt-1 block">{researcherCount}</span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Faculty & Scholars</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Universities</span>
            <span className="text-3xl font-bold text-slate-900 mt-1 block">{universityCount}</span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Partner Institutes</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Projects</span>
            <span className="text-3xl font-bold text-slate-900 mt-1 block">{projectCount}</span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Active R&D Grants</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Laboratories</span>
            <span className="text-3xl font-bold text-slate-900 mt-1 block">{labCount}</span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Core Facilities</span>
          </div>
        </div>

        {/* 4 Feature Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12 text-left">
          <Link href="/researchers" className="bg-white border border-slate-200 hover:border-blue-400 rounded-lg p-5 transition-all group">
            <Users className="w-6 h-6 text-blue-600 mb-2 group-hover:scale-105 transition-transform" />
            <h3 className="font-semibold text-slate-900 text-sm">Discover Researchers</h3>
            <p className="text-xs text-slate-500 mt-1">Search faculty, scholars, ORCID records, and research domains.</p>
          </Link>
          <Link href="/projects" className="bg-white border border-slate-200 hover:border-blue-400 rounded-lg p-5 transition-all group">
            <FolderGit2 className="w-6 h-6 text-blue-600 mb-2 group-hover:scale-105 transition-transform" />
            <h3 className="font-semibold text-slate-900 text-sm">Explore Projects</h3>
            <p className="text-xs text-slate-500 mt-1">Track milestone progress, funding agencies, and project deliverables.</p>
          </Link>
          <Link href="/laboratories" className="bg-white border border-slate-200 hover:border-blue-400 rounded-lg p-5 transition-all group">
            <FlaskConical className="w-6 h-6 text-blue-600 mb-2 group-hover:scale-105 transition-transform" />
            <h3 className="font-semibold text-slate-900 text-sm">Research Infrastructure</h3>
            <p className="text-xs text-slate-500 mt-1">Locate state-of-the-art laboratory facilities and instrumentation.</p>
          </Link>
          <Link href="/db-analytics" className="bg-white border border-slate-200 hover:border-blue-400 rounded-lg p-5 transition-all group">
            <DatabaseZap className="w-6 h-6 text-blue-600 mb-2 group-hover:scale-105 transition-transform" />
            <h3 className="font-semibold text-slate-900 text-sm">DBMS & SQL*Plus</h3>
            <p className="text-xs text-slate-500 mt-1">Access database views, stored procedures, and execution scripts.</p>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>ResearchHub — National Research Collaboration Ecosystem &copy; 2026. Built with Next.js, Prisma & Oracle SQL*Plus.</p>
      </footer>
    </div>
  )
}
