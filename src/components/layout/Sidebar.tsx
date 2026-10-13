'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Compass,
  Users,
  FolderGit2,
  GraduationCap,
  FlaskConical,
  BookOpen,
  FileKey,
  Database,
  Banknote,
  Network,
  LogOut,
  User,
  DatabaseZap
} from 'lucide-react'

interface SidebarProps {
  userRole?: string
  userName?: string
}

export function Sidebar({ userRole = 'RESEARCHER', userName = 'User' }: SidebarProps) {
  const pathname = usePathname()

  const navGroups = [
    {
      title: 'RESEARCH',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Discover', href: '/discover', icon: Compass },
        { label: 'Researchers', href: '/researchers', icon: Users },
        { label: 'Projects', href: '/projects', icon: FolderGit2 },
        { label: 'Universities', href: '/universities', icon: GraduationCap },
        { label: 'Laboratories', href: '/laboratories', icon: FlaskConical }
      ]
    },
    {
      title: 'KNOWLEDGE',
      items: [
        { label: 'Publications', href: '/publications', icon: BookOpen },
        { label: 'Patents', href: '/patents', icon: FileKey },
        { label: 'Datasets', href: '/datasets', icon: Database }
      ]
    },
    {
      title: 'ECOSYSTEM',
      items: [
        { label: 'Funding Agencies', href: '/funding-agencies', icon: Banknote },
        { label: 'Collaborations', href: '/collaborations', icon: Network },
        { label: 'DBMS Analytics', href: '/db-analytics', icon: DatabaseZap }
      ]
    }
  ]

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none">
      <div>
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
            R
          </div>
          <div>
            <span className="font-bold text-slate-900 text-base tracking-tight block leading-none">ResearchHub</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">National Ecosystem</span>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="px-4 py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navGroups.map((group) => (
            <div key={group.title}>
              <div className="px-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase mb-2">
                {group.title}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 text-xs font-semibold shrink-0">
              {userName.charAt(0)}
            </div>
            <div className="truncate">
              <span className="text-xs font-semibold text-slate-800 block truncate">{userName}</span>
              <span className="text-[10px] text-slate-500 block capitalize">{userRole.toLowerCase()}</span>
            </div>
          </div>
          <Link
            href="/login"
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            title="Switch User / Logout"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  )
}
