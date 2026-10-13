import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'
import { Network, ArrowRight } from 'lucide-react'

export default async function CollaborationsPage() {
  const user = await getCurrentUser()
  const collaborations = await prisma.collaboration.findMany({
    include: {
      researcher1: { include: { department: { include: { university: true } } } },
      researcher2: { include: { department: { include: { university: true } } } }
    }
  })

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userName={user?.name} userRole={user?.role} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar userName={user?.name} userRole={user?.role} />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inter-Institutional Collaborations</h1>
            <p className="text-xs text-slate-500 mt-1">
              Active recursive researcher-to-researcher partnerships and joint academic ventures
            </p>
          </div>

          <div className="space-y-4">
            {collaborations.map((col) => (
              <div key={col.id} className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4 flex-1">
                  <div className="space-y-0.5 text-left">
                    <Link href={`/researchers/${col.researcher1.id}`} className="font-bold text-slate-900 text-sm hover:text-blue-600">
                      {col.researcher1.fname} {col.researcher1.lname}
                    </Link>
                    <span className="text-xs text-slate-500 block">
                      {col.researcher1.department.university.abbreviation} ({col.researcher1.currentPosition})
                    </span>
                  </div>

                  <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold shrink-0 flex items-center gap-1">
                    <Network className="w-3.5 h-3.5" />
                    <span>Joint R&D</span>
                  </div>

                  <div className="space-y-0.5 text-left">
                    <Link href={`/researchers/${col.researcher2.id}`} className="font-bold text-slate-900 text-sm hover:text-blue-600">
                      {col.researcher2.fname} {col.researcher2.lname}
                    </Link>
                    <span className="text-xs text-slate-500 block">
                      {col.researcher2.department.university.abbreviation} ({col.researcher2.currentPosition})
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-medium text-slate-600 block">{col.collaborationType}</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Active since {new Date(col.sinceDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
