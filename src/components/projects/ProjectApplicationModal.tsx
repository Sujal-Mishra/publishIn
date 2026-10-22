'use client'

import React, { useState } from 'react'
import {
  UserPlus,
  Briefcase,
  GraduationCap,
  Sparkles,
  Send,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building2,
  FlaskConical,
  Banknote
} from 'lucide-react'

interface ProjectApplicationModalProps {
  projectId: string
  projectTitle: string
  leadProfessorName: string
  currentUserId?: string
  availableApplicants?: { id: string; name: string; role: string }[]
  availableIndustries?: { id: string; name: string; industryType: string }[]
  onSuccess?: () => void
}

export function ProjectApplicationModal({
  projectId,
  projectTitle,
  leadProfessorName,
  currentUserId,
  availableApplicants = [],
  availableIndustries = [],
  onSuccess
}: ProjectApplicationModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<'member' | 'industry'>('member')
  const [requestedRole, setRequestedRole] = useState('Student Member')
  const [selectedApplicantId, setSelectedApplicantId] = useState(currentUserId || '')
  const [statement, setStatement] = useState('')

  // Industry Form State
  const [selectedIndustryId, setSelectedIndustryId] = useState(
    availableIndustries.length > 0 ? availableIndustries[0].id : ''
  )
  const [industryInquiryType, setIndustryInquiryType] = useState('Joint R&D & Tech Commercialization')
  const [sponsorshipBudget, setSponsorshipBudget] = useState('5000000')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      const res = await fetch(`/api/projects/${projectId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          researcherId: selectedApplicantId || currentUserId,
          role: requestedRole,
          statement
        })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application')
      }

      setSuccessMsg(`Application to join as ${requestedRole} submitted to Lead Investigator ${leadProfessorName}!`)
      setTimeout(() => {
        if (onSuccess) onSuccess()
        setIsOpen(false)
        setSuccessMsg(null)
        setStatement('')
      }, 2000)
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting application')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleIndustrySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      const res = await fetch('/api/industry-collaborations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industryId: selectedIndustryId,
          projectId,
          collaborationType: `R&D Sponsorship Inquiry: ${industryInquiryType}`,
          budgetEstimate: parseFloat(sponsorshipBudget) || 0
        })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit sponsorship inquiry')
      }

      setSuccessMsg('Corporate R&D Sponsorship Inquiry submitted to University Laboratory & Project Lead!')
      setTimeout(() => {
        if (onSuccess) onSuccess()
        setIsOpen(false)
        setSuccessMsg(null)
      }, 2000)
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting inquiry')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setMode('member')
            setIsOpen(true)
          }}
          className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm flex items-center gap-1.5 transition-all"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Apply to Join Team
        </button>

        <button
          onClick={() => {
            setMode('industry')
            setIsOpen(true)
          }}
          className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100 flex items-center gap-1.5 transition-all"
        >
          <Briefcase className="w-3.5 h-3.5 text-purple-700" />
          Industry Sponsorship Inquiry
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in duration-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Mode Switcher */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <button
                type="button"
                onClick={() => setMode('member')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  mode === 'member'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                Join Research Team
              </button>
              <button
                type="button"
                onClick={() => setMode('industry')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  mode === 'industry'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                Corporate R&D Sponsorship
              </button>
            </div>

            <div className="space-y-1 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {mode === 'member' ? 'Apply for Project Membership' : 'Corporate R&D Sponsorship Inquiry'}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-1">
                Project: <strong className="text-slate-700">{projectTitle}</strong> (PI: {leadProfessorName})
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 mb-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Mode 1: Join Team Form */}
            {mode === 'member' ? (
              <form onSubmit={handleMemberSubmit} className="space-y-4">
                {availableApplicants.length > 0 && (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Applying Candidate:
                    </label>
                    <select
                      value={selectedApplicantId}
                      onChange={(e) => setSelectedApplicantId(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {availableApplicants.map((app) => (
                        <option key={app.id} value={app.id}>
                          {app.name} ({app.role})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Target Project Role:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div
                      onClick={() => setRequestedRole('Student Member')}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        requestedRole === 'Student Member'
                          ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                        <GraduationCap className="w-4 h-4 text-blue-600" />
                        Student Member
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Ph.D. / M.Tech Research Fellow
                      </p>
                    </div>

                    <div
                      onClick={() => setRequestedRole('Co-Investigator')}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        requestedRole === 'Co-Investigator'
                          ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        Co-Investigator
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Faculty / Senior Scientist
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Statement of Interest & Technical Fit:
                  </label>
                  <textarea
                    rows={3}
                    value={statement}
                    onChange={(e) => setStatement(e.target.value)}
                    placeholder="Describe your technical background, domain synergy, or relevant lab experience..."
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
                        Submit Application
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Mode 2: Industry Sponsorship Form */
              <form onSubmit={handleIndustrySubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Corporate Partner Organization:
                  </label>
                  <select
                    value={selectedIndustryId}
                    onChange={(e) => setSelectedIndustryId(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    {availableIndustries.map((ind) => (
                      <option key={ind.id} value={ind.id}>
                        {ind.name} ({ind.industryType})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Sponsorship / Partnership Model:
                  </label>
                  <select
                    value={industryInquiryType}
                    onChange={(e) => setIndustryInquiryType(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Joint R&D & Tech Commercialization">Joint R&D & Tech Commercialization</option>
                    <option value="Corporate Research Fellowship & Ph.D. Endowment">Corporate Research Fellowship & Ph.D. Endowment</option>
                    <option value="Lab Equipment Grant & Industrial Testing Pilot">Lab Equipment Grant & Industrial Testing Pilot</option>
                    <option value="Exclusive IP Licensing & Co-Patent Venture">Exclusive IP Licensing & Co-Patent Venture</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Indicative Sponsorship Budget (INR):
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      step="500000"
                      value={sponsorshipBudget}
                      onChange={(e) => setSponsorshipBudget(e.target.value)}
                      className="w-full text-xs pl-7 p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:bg-white font-mono"
                    />
                  </div>
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
                    className="px-4 py-2 text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Submit R&D Inquiry
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
