'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Network,
  Users,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  Loader2,
  Sparkles,
  Inbox,
  Filter,
  Check,
  X
} from 'lucide-react'

export interface CollaborationItem {
  id: string
  researcherId1: string
  researcherId2: string
  collaborationType: string
  status: string
  sinceDate: Date | string
  researcher1: {
    id: string
    fname: string
    lname: string
    currentPosition: string
    role: string
    department: {
      departmentName: string
      university: { universityName: string; abbreviation: string }
    }
  }
  researcher2: {
    id: string
    fname: string
    lname: string
    currentPosition: string
    role: string
    department: {
      departmentName: string
      university: { universityName: string; abbreviation: string }
    }
  }
}

export interface PendingProjectMemberItem {
  id: string
  projectId: string
  researcherId: string
  role: string
  joinedAt: Date | string
  project: {
    id: string
    projectTitle: string
    grantNumber?: string | null
    leadProfessor: { id: string; fname: string; lname: string }
  }
  researcher: {
    id: string
    fname: string
    lname: string
    email: string
    role: string
    currentPosition: string
    department: {
      departmentName: string
      university: { abbreviation: string }
    }
  }
}

export interface IndustryCollabItem {
  id: string
  industryId: string
  projectId?: string | null
  researcherId?: string | null
  collaborationType: string
  sinceDate: Date | string
  industry: {
    id: string
    name: string
    industryType: string
    website?: string | null
  }
  project?: {
    id: string
    projectTitle: string
    budget?: number | null
  } | null
  researcher?: {
    id: string
    fname: string
    lname: string
    currentPosition: string
  } | null
}

interface CollaborationsDashboardProps {
  initialCollaborations: CollaborationItem[]
  initialPendingMembers: PendingProjectMemberItem[]
  initialIndustryCollaborations: IndustryCollabItem[]
  currentUserId?: string
}

export function CollaborationsDashboard({
  initialCollaborations,
  initialPendingMembers,
  initialIndustryCollaborations,
  currentUserId
}: CollaborationsDashboardProps) {
  const [collaborations, setCollaborations] = useState<CollaborationItem[]>(initialCollaborations)
  const [pendingMembers, setPendingMembers] = useState<PendingProjectMemberItem[]>(initialPendingMembers)
  const [industryCollabs, setIndustryCollabs] = useState<IndustryCollabItem[]>(initialIndustryCollaborations)

  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'industry'>('pending')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  // Counts
  const pendingCollabs = collaborations.filter((c) => c.status === 'Pending')
  const activeCollabs = collaborations.filter((c) => c.status === 'Active')
  const totalPendingCount = pendingCollabs.length + pendingMembers.length

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ text, type })
    setTimeout(() => setFeedbackMsg(null), 3000)
  }

  // Handle Collaboration Accept / Decline
  const handleCollabAction = async (collabId: string, action: 'accept' | 'decline') => {
    setUpdatingId(collabId)
    try {
      const res = await fetch(`/api/collaborations/${collabId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update request')

      setCollaborations((prev) =>
        prev.map((c) => (c.id === collabId ? { ...c, status: action === 'accept' ? 'Active' : 'Declined' } : c))
      )
      showFeedback(`Collaboration request successfully ${action === 'accept' ? 'accepted' : 'declined'}!`)
    } catch (err: any) {
      showFeedback(err.message || 'Action failed', 'error')
    } finally {
      setUpdatingId(null)
    }
  }

  // Handle Project Member Accept / Decline
  const handleMemberAction = async (member: PendingProjectMemberItem, action: 'accept' | 'decline', roleOverride?: string) => {
    setUpdatingId(member.id)
    try {
      const res = await fetch(`/api/projects/${member.projectId}/members/${member.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, role: roleOverride })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update member application')

      setPendingMembers((prev) => prev.filter((m) => m.id !== member.id))
      showFeedback(data.message || 'Application processed!')
    } catch (err: any) {
      showFeedback(err.message || 'Action failed', 'error')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Feedback Banner */}
      {feedbackMsg && (
        <div
          className={`p-3 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'pending'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Inbox className="w-4 h-4" />
            Pending Action Inbox
            {totalPendingCount > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                activeTab === 'pending' ? 'bg-white text-blue-700' : 'bg-amber-100 text-amber-800'
              }`}>
                {totalPendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'active'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Network className="w-4 h-4" />
            Active Academic Alliances ({activeCollabs.length})
          </button>

          <button
            onClick={() => setActiveTab('industry')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'industry'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Corporate R&D Sponsorships ({industryCollabs.length})
          </button>
        </div>

        <span className="text-xs text-slate-400 font-mono hidden sm:inline">
          Live Collaboration Hub
        </span>
      </div>

      {/* TAB 1: Pending Action Inbox */}
      {activeTab === 'pending' && (
        <div className="space-y-6">
          {/* Sub-section 1A: Mentorship & Collaboration Requests */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Mentorship & Research Collaboration Requests ({pendingCollabs.length})
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                Awaiting faculty review
              </span>
            </div>

            {pendingCollabs.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No pending mentorship requests in your queue.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingCollabs.map((collab) => {
                  const isUpdating = updatingId === collab.id
                  return (
                    <div
                      key={collab.id}
                      className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            Pending Review
                          </span>
                          <span className="text-xs font-bold text-slate-900">
                            {collab.collaborationType}
                          </span>
                        </div>

                        <div className="text-xs text-slate-600 pt-0.5">
                          From:{' '}
                          <Link
                            href={`/researchers/${collab.researcher1.id}`}
                            className="font-bold text-slate-900 hover:text-blue-600 underline"
                          >
                            {collab.researcher1.fname} {collab.researcher1.lname}
                          </Link>{' '}
                          <span className="text-slate-400">
                            ({collab.researcher1.department.university.abbreviation} · {collab.researcher1.currentPosition})
                          </span>
                          {' '}&rarr; Directed to:{' '}
                          <Link
                            href={`/researchers/${collab.researcher2.id}`}
                            className="font-semibold text-slate-800 hover:text-blue-600"
                          >
                            {collab.researcher2.fname} {collab.researcher2.lname}
                          </Link>
                        </div>

                        <span className="text-[11px] text-slate-400 font-mono block">
                          Submitted: {new Date(collab.sinceDate).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        {isUpdating ? (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Updating...
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => handleCollabAction(collab.id, 'accept')}
                              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs flex items-center gap-1 transition-all"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Accept Mentorship
                            </button>
                            <button
                              onClick={() => handleCollabAction(collab.id, 'decline')}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-700 transition-all"
                            >
                              Decline
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Sub-section 1B: Pending Project Membership Applications */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Project Membership Applications ({pendingMembers.length})
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                Candidates applying to join research projects
              </span>
            </div>

            {pendingMembers.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No candidate membership applications pending review.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingMembers.map((member) => {
                  const isUpdating = updatingId === member.id
                  const requestedRole = member.role.replace('Pending:', '').trim()

                  return (
                    <div
                      key={member.id}
                      className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                            Applied: {requestedRole}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900">
                            Project:{' '}
                            <Link href={`/projects/${member.projectId}`} className="hover:text-blue-600 underline">
                              {member.project.projectTitle}
                            </Link>
                          </h4>
                        </div>

                        <p className="text-xs text-slate-600">
                          Candidate:{' '}
                          <Link
                            href={`/researchers/${member.researcher.id}`}
                            className="font-bold text-slate-900 hover:text-blue-600"
                          >
                            {member.researcher.fname} {member.researcher.lname}
                          </Link>{' '}
                          ({member.researcher.department.university.abbreviation} · {member.researcher.currentPosition})
                        </p>

                        <span className="text-[11px] text-slate-400 font-mono block">
                          Applied: {new Date(member.joinedAt).toLocaleDateString()} · PI: {member.project.leadProfessor.fname} {member.project.leadProfessor.lname}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isUpdating ? (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Updating...
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => handleMemberAction(member, 'accept', requestedRole)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs flex items-center gap-1 transition-all"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Accept as {requestedRole}
                            </button>
                            <button
                              onClick={() => handleMemberAction(member, 'decline')}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-700 transition-all"
                            >
                              Decline
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Active Academic Alliances */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Network className="w-5 h-5 text-blue-600" />
              Active Inter-Institutional Research & Mentorship Partnerships ({activeCollabs.length})
            </h3>

            {activeCollabs.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No active collaborations found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeCollabs.map((col) => (
                  <div
                    key={col.id}
                    className="p-5 rounded-xl border border-slate-200 bg-white hover:shadow-xs transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Active Alliance
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Since {new Date(col.sinceDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {col.collaborationType}
                    </h4>

                    {/* Researchers Bridge */}
                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                      <div>
                        <Link
                          href={`/researchers/${col.researcher1.id}`}
                          className="font-bold text-slate-900 hover:text-blue-600 block"
                        >
                          {col.researcher1.fname} {col.researcher1.lname}
                        </Link>
                        <span className="text-[10px] text-slate-500 block">
                          {col.researcher1.department.university.abbreviation}
                        </span>
                      </div>

                      <div className="px-2 text-slate-400 text-xs font-bold">&harr;</div>

                      <div className="text-right">
                        <Link
                          href={`/researchers/${col.researcher2.id}`}
                          className="font-bold text-slate-900 hover:text-blue-600 block"
                        >
                          {col.researcher2.fname} {col.researcher2.lname}
                        </Link>
                        <span className="text-[10px] text-slate-500 block">
                          {col.researcher2.department.university.abbreviation}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Corporate R&D Sponsorships */}
      {activeTab === 'industry' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-600" />
              Corporate R&D Sponsorship Registry & Industry Collaborations ({industryCollabs.length})
            </h3>

            {industryCollabs.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No corporate R&D sponsorships registered.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {industryCollabs.map((collab) => (
                  <div key={collab.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{collab.industry.name}</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-800">
                          {collab.industry.industryType}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-700">{collab.collaborationType}</p>
                      {collab.project && (
                        <p className="text-xs text-slate-500">
                          Project:{' '}
                          <Link href={`/projects/${collab.project.id}`} className="font-semibold text-blue-600 hover:underline">
                            {collab.project.projectTitle}
                          </Link>
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block">
                        Active Corporate Sponsorship
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono block mt-1">
                        Registered: {new Date(collab.sinceDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
