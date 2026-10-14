'use client'

import React from 'react'
import { CheckCircle2, Clock, FileText, Award, PlayCircle } from 'lucide-react'

interface GrantLifecycleStepperProps {
  status: string
  proposalDate?: Date | string | null
  startDate?: Date | string | null
  endDate?: Date | string | null
  grantNumber?: string | null
  fundingAgencyName?: string | null
}

const STAGES = [
  {
    key: 'Proposed',
    title: 'Proposal Submitted',
    description: 'Grant application lodged with review committee',
    icon: FileText
  },
  {
    key: 'Under Review',
    title: 'Peer Review',
    description: 'Technical evaluation and ethics clearance',
    icon: Clock
  },
  {
    key: 'Sanctioned',
    title: 'Grant Sanctioned',
    description: 'Budget committed & grant number issued',
    icon: Award
  },
  {
    key: 'Active',
    title: 'Active Research',
    description: 'Experimental execution & milestone tracking',
    icon: PlayCircle
  },
  {
    key: 'Completed',
    title: 'Grant Closed',
    description: 'Final publications, patents & dataset archive',
    icon: CheckCircle2
  }
]

export function GrantLifecycleStepper({
  status,
  proposalDate,
  startDate,
  endDate,
  grantNumber,
  fundingAgencyName
}: GrantLifecycleStepperProps) {
  const normalizedStatus = status?.trim() || 'Active'

  const getActiveIndex = (st: string) => {
    switch (st.toLowerCase()) {
      case 'proposed':
        return 0
      case 'under review':
      case 'under_review':
        return 1
      case 'sanctioned':
        return 2
      case 'active':
        return 3
      case 'completed':
        return 4
      default:
        return 3
    }
  }

  const currentIndex = getActiveIndex(normalizedStatus)

  const formatDate = (d?: Date | string | null) => {
    if (!d) return null
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Grant Lifecycle Protocol
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                currentIndex === 4
                  ? 'bg-emerald-100 text-emerald-800'
                  : currentIndex === 3
                  ? 'bg-blue-100 text-blue-800'
                  : currentIndex === 2
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              Current: {normalizedStatus}
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-1">
            National Research Sanction Pipeline
          </h3>
        </div>

        {grantNumber && (
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-medium">Grant Registration No.</span>
            <span className="font-mono text-xs font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded border border-slate-200 inline-block mt-0.5">
              {grantNumber}
            </span>
          </div>
        )}
      </div>

      {/* Progress Track: Line runs strictly through the circular icon centers (top-8 = 32px) */}
      <div className="relative">
        {/* Background track line */}
        <div className="hidden md:block absolute top-[32px] left-[10%] right-[10%] h-0.5 bg-slate-200 z-0" />
        {/* Active progress track line */}
        <div
          className="hidden md:block absolute top-[32px] left-[10%] h-0.5 bg-blue-600 z-0 transition-all duration-500"
          style={{ width: `${(currentIndex / (STAGES.length - 1)) * 80}%` }}
        />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon
            const isCompleted = idx < currentIndex
            const isCurrent = idx === currentIndex

            let stateClasses = 'bg-white border-slate-300 text-slate-400'
            let ringClasses = ''
            if (isCompleted) {
              stateClasses = 'bg-emerald-600 border-emerald-600 text-white'
            } else if (isCurrent) {
              stateClasses = 'bg-blue-600 border-blue-600 text-white'
              ringClasses = 'ring-4 ring-blue-100'
            }

            return (
              <div
                key={stage.key}
                className={`flex flex-row md:flex-col items-center md:items-center text-left md:text-center p-3 rounded-xl transition-all ${
                  isCurrent ? 'bg-blue-50/60 border border-blue-200' : 'bg-transparent'
                }`}
              >
                {/* Circular Badge: has solid background & z-10 to sit cleanly on top of the line */}
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 mb-0 md:mb-3 mr-3 md:mr-0 transition-transform relative z-10 ${stateClasses} ${ringClasses}`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-800 flex items-center md:justify-center gap-1">
                    {stage.title}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 hidden md:block">
                    {stage.description}
                  </p>

                  {idx === 0 && proposalDate && (
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                      {formatDate(proposalDate)}
                    </span>
                  )}
                  {idx === 3 && startDate && (
                    <span className="text-[10px] text-blue-600 font-mono mt-1 block font-semibold">
                      Started {formatDate(startDate)}
                    </span>
                  )}
                  {idx === 4 && endDate && (
                    <span className="text-[10px] text-emerald-600 font-mono mt-1 block font-semibold">
                      Target {formatDate(endDate)}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {fundingAgencyName && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <Award className="w-4 h-4 text-amber-500" />
            Sanctioned under statutory guidelines by <strong className="text-slate-800">{fundingAgencyName}</strong>
          </span>
          <span className="text-[11px] text-slate-500 font-mono">Status Audited</span>
        </div>
      )}
    </div>
  )
}
