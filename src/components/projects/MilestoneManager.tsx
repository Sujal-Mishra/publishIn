'use client'

import React, { useState } from 'react'
import { CheckCircle2, Clock, AlertCircle, FlaskConical, Calendar, ArrowRight, Loader2 } from 'lucide-react'

export interface MilestoneItem {
  id: string
  title: string
  description?: string | null
  dueDate?: Date | string | null
  status: string
  lab?: {
    id?: string
    name: string
  } | null
}

interface MilestoneManagerProps {
  projectId: string
  initialMilestones: MilestoneItem[]
  onMilestoneChange?: (updated: MilestoneItem[]) => void
}

export function MilestoneManager({
  projectId,
  initialMilestones,
  onMilestoneChange
}: MilestoneManagerProps) {
  const [milestones, setMilestones] = useState<MilestoneItem[]>(initialMilestones)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleStatusChange = async (milestoneId: string, newStatus: string) => {
    setUpdatingId(milestoneId)
    try {
      const res = await fetch(`/api/projects/${projectId}/milestones`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId, status: newStatus })
      })

      if (!res.ok) {
        throw new Error('Failed to update milestone status')
      }

      const nextMilestones = milestones.map((m) =>
        m.id === milestoneId ? { ...m, status: newStatus } : m
      )
      setMilestones(nextMilestones)
      if (onMilestoneChange) {
        onMilestoneChange(nextMilestones)
      }
    } catch (err) {
      console.error(err)
      alert('Could not update milestone status. Please try again.')
    } finally {
      setUpdatingId(null)
    }
  }

  const formatDate = (d?: Date | string | null) => {
    if (!d) return 'No deadline'
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Research Deliverables
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-0.5">
            Milestones & Laboratory Commitments ({milestones.length})
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Click status to transition tranche
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {milestones.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No milestones added yet.</p>
        ) : (
          milestones.map((milestone, idx) => {
            const isCompleted = milestone.status.toLowerCase() === 'completed'
            const isInProgress =
              milestone.status.toLowerCase() === 'in progress' ||
              milestone.status.toLowerCase() === 'in_progress'
            const isPending = !isCompleted && !isInProgress
            const isUpdating = updatingId === milestone.id

            return (
              <div
                key={milestone.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 font-mono">
                      #{idx + 1}
                    </span>
                    <h4
                      className={`text-sm font-semibold ${
                        isCompleted ? 'text-slate-500 line-through' : 'text-slate-900'
                      }`}
                    >
                      {milestone.title}
                    </h4>
                  </div>
                  {milestone.description && (
                    <p className="text-xs text-slate-500">{milestone.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Due: {formatDate(milestone.dueDate)}
                    </span>
                    {milestone.lab && (
                      <span className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        <FlaskConical className="w-3.5 h-3.5 text-indigo-500" />
                        {milestone.lab.name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isUpdating ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Updating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200">
                      <button
                        onClick={() => handleStatusChange(milestone.id, 'Pending')}
                        className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                          isPending
                            ? 'bg-amber-100 text-amber-800 shadow-2xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Pending
                      </button>
                      <button
                        onClick={() => handleStatusChange(milestone.id, 'In Progress')}
                        className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                          isInProgress
                            ? 'bg-blue-100 text-blue-800 shadow-2xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => handleStatusChange(milestone.id, 'Completed')}
                        className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                          isCompleted
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'text-slate-500 hover:text-emerald-700'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
