'use client'

import React, { useState } from 'react'
import {
  Users,
  GraduationCap,
  Sparkles,
  Send,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Network,
  BookOpen,
  FlaskConical
} from 'lucide-react'

interface CollaborationRequestModalProps {
  targetResearcher: {
    id: string
    name: string
    role: string
    position: string
    universityName: string
    departmentName: string
  }
  currentUserId?: string
  currentUserName?: string
  availableRequesters?: { id: string; name: string; role: string }[]
  onSuccess?: () => void
}

export function CollaborationRequestModal({
  targetResearcher,
  currentUserId,
  currentUserName,
  availableRequesters = [],
  onSuccess
}: CollaborationRequestModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [collaborationType, setCollaborationType] = useState('Ph.D. & Academic Mentorship')
  const [proposalNotes, setProposalNotes] = useState('')
  const [selectedRequesterId, setSelectedRequesterId] = useState(currentUserId || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const presetTypes = [
    {
      title: 'Ph.D. & Academic Mentorship',
      icon: GraduationCap,
      desc: 'Doctoral guidance, thesis supervision or graduate research advising'
    },
    {
      title: 'Inter-Institutional Joint R&D',
      icon: Network,
      desc: 'Collaborative grant proposal, cross-lab experiment or pilot study'
    },
    {
      title: 'Co-Authorship & Publication',
      icon: BookOpen,
      desc: 'Joint manuscript drafting, peer-review submission, or data analysis'
    },
    {
      title: 'Laboratory Equipment & Tech Sharing',
      icon: FlaskConical,
      desc: 'Cross-campus facility access or specialized analytical equipment sharing'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      const res = await fetch('/api/collaborations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetResearcherId: targetResearcher.id,
          requesterId: selectedRequesterId || currentUserId,
          collaborationType,
          notes: proposalNotes
        })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send collaboration request')
      }

      setSuccessMsg(`Collaboration request submitted to ${targetResearcher.name}! It is now pending their review.`)
      setTimeout(() => {
        if (onSuccess) onSuccess()
        setIsOpen(false)
        setSuccessMsg(null)
        setProposalNotes('')
      }, 2000)
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting request')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm flex items-center gap-2 transition-all"
      >
        <Network className="w-4 h-4" />
        Request Collaboration / Mentorship
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in duration-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Network className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Request Collaboration with {targetResearcher.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {targetResearcher.position} · {targetResearcher.universityName}
                  </p>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Switch Requester Persona (helpful for demo) */}
                {availableRequesters.length > 0 && (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Sending Request As:
                    </label>
                    <select
                      value={selectedRequesterId}
                      onChange={(e) => setSelectedRequesterId(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {availableRequesters.map((req) => (
                        <option key={req.id} value={req.id}>
                          {req.name} ({req.role})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Collaboration Type Selector */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Collaboration / Mentorship Mode:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {presetTypes.map((pt) => {
                      const Icon = pt.icon
                      const isSelected = collaborationType === pt.title
                      return (
                        <div
                          key={pt.title}
                          onClick={() => setCollaborationType(pt.title)}
                          className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-blue-50/70 border-blue-500 ring-1 ring-blue-500 text-blue-950'
                              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                            <span className="text-xs font-bold leading-tight">{pt.title}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1 leading-snug line-clamp-2">
                            {pt.desc}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Proposal Notes */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Proposal Statement / Research Objectives:
                  </label>
                  <textarea
                    rows={3}
                    value={proposalNotes}
                    onChange={(e) => setProposalNotes(e.target.value)}
                    placeholder="Briefly state your research alignment, dataset/lab interest, or mentorship goals..."
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Send Collaboration Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
