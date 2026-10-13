'use client'

import Link from 'next/link'
import { Search, Bell, PlusCircle, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function Navbar({ userName, userRole }: { userName?: string; userRole?: string }) {
  const [search, setSearch] = useState('')
  const router = useRouter()

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/discover?q=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Global Quick Search */}
      <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search researchers, projects, skills, universities..."
          className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        />
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {userRole === 'PROFESSOR' && (
          <Link
            href="/projects/create"
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-sm transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            New Project
          </Link>
        )}

        <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>SQL*Plus Connected</span>
          </div>
        </div>
      </div>
    </header>
  )
}
