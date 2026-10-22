'use client'

import React, { useState, useMemo } from 'react'
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  Layers,
  BarChart3,
  ListTodo,
  Sparkles,
  ArrowRight,
  Loader2,
  Building2,
  ChevronRight,
  TrendingUp,
  Info
} from 'lucide-react'

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

interface ProjectGanttRoadmapProps {
  projectId: string
  startDate?: Date | string | null
  endDate?: Date | string | null
  initialMilestones: MilestoneItem[]
  onMilestoneChange?: (updated: MilestoneItem[]) => void
}

export function ProjectGanttRoadmap({
  projectId,
  startDate,
  endDate,
  initialMilestones,
  onMilestoneChange
}: ProjectGanttRoadmapProps) {
  const [milestones, setMilestones] = useState<MilestoneItem[]>(initialMilestones)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'gantt' | 'list' | 'split'>('split')
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(
    initialMilestones.length > 0 ? initialMilestones[0].id : null
  )

  // Recalculate stats
  const total = milestones.length
  const completedCount = milestones.filter(
    (m) => m.status.toLowerCase() === 'completed'
  ).length
  const inProgressCount = milestones.filter(
    (m) =>
      m.status.toLowerCase() === 'in progress' ||
      m.status.toLowerCase() === 'in_progress'
  ).length
  const pendingCount = total - completedCount - inProgressCount
  const completionPercentage = total > 0 ? Math.round((completedCount / total) * 100) : 0

  // Assigned laboratories distinct list
  const assignedLabs = useMemo(() => {
    const map = new Map<string, string>()
    milestones.forEach((m) => {
      if (m.lab?.name) {
        map.set(m.lab.name, m.lab.name)
      }
    })
    return Array.from(map.values())
  }, [milestones])

  // Handle status update
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

  // Format date helper
  const formatDate = (d?: Date | string | null) => {
    if (!d) return 'TBD'
    const dateObj = new Date(d)
    return isNaN(dateObj.getTime())
      ? 'TBD'
      : dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
  }

  const formatShortDate = (d?: Date | string | null) => {
    if (!d) return 'TBD'
    const dateObj = new Date(d)
    return isNaN(dateObj.getTime())
      ? 'TBD'
      : dateObj.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric'
        })
  }

  // Normalize milestone statuses
  const getStatusType = (statusStr: string) => {
    const s = statusStr.toLowerCase()
    if (s === 'completed') return 'completed'
    if (s === 'in progress' || s === 'in_progress') return 'in_progress'
    return 'pending'
  }

  // Gantt timeline calculation
  const timelineDates = useMemo(() => {
    const now = new Date()
    const pStart = startDate ? new Date(startDate) : new Date(now.getFullYear(), 0, 1)
    let pEnd = endDate ? new Date(endDate) : new Date(now.getFullYear() + 2, 11, 31)

    // ensure pEnd is after latest milestone dueDate
    milestones.forEach((m) => {
      if (m.dueDate) {
        const d = new Date(m.dueDate)
        if (d > pEnd) pEnd = d
      }
    })

    const startTime = pStart.getTime()
    const endTime = Math.max(pEnd.getTime(), startTime + 1000 * 60 * 60 * 24 * 30)
    const duration = endTime - startTime

    return { pStart, pEnd, startTime, endTime, duration }
  }, [startDate, endDate, milestones])

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* 1. Executive Timeline Header */}
      <div className="p-6 border-b border-slate-100 bg-linear-to-r from-slate-900 via-slate-800 to-indigo-950 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Interactive Gantt & Milestone Roadmap
              </span>
              <span className="text-xs text-slate-300 flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                {formatShortDate(timelineDates.pStart)} – {formatShortDate(timelineDates.pEnd)}
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Research Milestone Phases & Laboratory Commitments
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Visual project roadmap mapping milestone deliverables to assigned university laboratories. Click any phase to transition status in real-time.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 self-start md:self-auto">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'split'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Split View: Gantt Timeline + Deliverables"
            >
              <Layers className="w-3.5 h-3.5" />
              Dashboard
            </button>
            <button
              onClick={() => setViewMode('gantt')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'gantt'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Gantt Chart Roadmap View"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Gantt Roadmap
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Deliverables List View"
            >
              <ListTodo className="w-3.5 h-3.5" />
              Deliverables List
            </button>
          </div>
        </div>

        {/* Executive KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-700/60">
          <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/40">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
              Completion Rate
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold text-white font-mono">{completionPercentage}%</span>
              <span className="text-[11px] text-slate-300">
                ({completedCount}/{total})
              </span>
            </div>
            <div className="w-full bg-slate-700/60 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/40">
            <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider block flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Completed
            </span>
            <span className="text-xl font-bold text-emerald-300 font-mono mt-0.5 block">
              {completedCount} <span className="text-xs text-emerald-400 font-normal">Tranches</span>
            </span>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/40">
            <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider block flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-400" />
              In Progress
            </span>
            <span className="text-xl font-bold text-blue-300 font-mono mt-0.5 block">
              {inProgressCount} <span className="text-xs text-blue-400 font-normal">Active</span>
            </span>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/40">
            <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider block flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-400" />
              Pending
            </span>
            <span className="text-xl font-bold text-amber-300 font-mono mt-0.5 block">
              {pendingCount} <span className="text-xs text-amber-400 font-normal">Upcoming</span>
            </span>
          </div>
        </div>

        {/* Assigned Labs Badge row */}
        {assignedLabs.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-800 text-xs">
            <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
              <FlaskConical className="w-3.5 h-3.5 text-indigo-400" />
              Participating Facilities ({assignedLabs.length}):
            </span>
            {assignedLabs.map((labName) => (
              <span
                key={labName}
                className="px-2 py-0.5 rounded text-[11px] bg-indigo-900/60 text-indigo-200 border border-indigo-700/40 font-medium"
              >
                {labName}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 2. Interactive Gantt Roadmap View */}
      {(viewMode === 'gantt' || viewMode === 'split') && (
        <div className="p-6 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-800">
                Phase Roadmap Timeline & Laboratory Scheduling
              </h3>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="font-semibold text-[11px]">Completed (Emerald)</span>
              </div>
              <div className="flex items-center gap-1 text-blue-700">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span className="font-semibold text-[11px]">In Progress (Blue)</span>
              </div>
              <div className="flex items-center gap-1 text-amber-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="font-semibold text-[11px]">Pending (Amber)</span>
              </div>
            </div>
          </div>

          {milestones.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No milestones added to project yet.</p>
          ) : (
            <div className="space-y-3">
              {/* Gantt Phase Bars */}
              {milestones.map((milestone, idx) => {
                const statusType = getStatusType(milestone.status)
                const isSelected = selectedMilestoneId === milestone.id
                const isUpdating = updatingId === milestone.id

                // Calculate progress position along project timeline
                const mDueDate = milestone.dueDate ? new Date(milestone.dueDate) : null
                let pctStart = (idx / total) * 100
                let pctEnd = ((idx + 1) / total) * 100

                if (mDueDate && timelineDates.duration > 0) {
                  const mTime = mDueDate.getTime()
                  const calculatedPct = Math.min(
                    100,
                    Math.max(0, ((mTime - timelineDates.startTime) / timelineDates.duration) * 100)
                  )
                  pctEnd = Math.max(calculatedPct, 15)
                  pctStart = Math.max(0, pctEnd - (100 / total))
                }

                // Color configuration
                let barColor = 'bg-amber-500'
                let barBgLight = 'bg-amber-50/60'
                let borderColor = 'border-amber-300'
                let textColor = 'text-amber-900'
                let badgeBg = 'bg-amber-100 text-amber-800 border-amber-200'

                if (statusType === 'completed') {
                  barColor = 'bg-emerald-600'
                  barBgLight = 'bg-emerald-50/60'
                  borderColor = 'border-emerald-300'
                  textColor = 'text-emerald-950'
                  badgeBg = 'bg-emerald-100 text-emerald-800 border-emerald-200'
                } else if (statusType === 'in_progress') {
                  barColor = 'bg-blue-600'
                  barBgLight = 'bg-blue-50/60'
                  borderColor = 'border-blue-300'
                  textColor = 'text-blue-950'
                  badgeBg = 'bg-blue-100 text-blue-800 border-blue-200'
                }

                return (
                  <div
                    key={milestone.id}
                    onClick={() => setSelectedMilestoneId(milestone.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? `ring-2 ring-blue-500 shadow-md ${barBgLight} ${borderColor}`
                        : `bg-white hover:bg-slate-50 border-slate-200`
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-slate-400">
                          Phase #{idx + 1}
                        </span>
                        <h4 className={`text-xs font-bold ${textColor}`}>
                          {milestone.title}
                        </h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeBg}`}>
                          {milestone.status}
                        </span>
                      </div>

                      {/* Laboratory Attribution */}
                      <div className="flex items-center gap-2 shrink-0">
                        {milestone.lab ? (
                          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs">
                            <FlaskConical className="w-3.5 h-3.5 text-indigo-600" />
                            {milestone.lab.name}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            Central Secretariat
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {formatDate(milestone.dueDate)}
                        </span>
                      </div>
                    </div>

                    {/* Gantt Bar Visualization Track */}
                    <div className="w-full bg-slate-200/80 rounded-full h-3 relative overflow-hidden my-2 shadow-inner">
                      {/* Grid tick marks */}
                      <div className="absolute inset-0 flex justify-between px-2 pointer-events-none opacity-30">
                        <div className="w-px h-full bg-slate-400" />
                        <div className="w-px h-full bg-slate-400" />
                        <div className="w-px h-full bg-slate-400" />
                        <div className="w-px h-full bg-slate-400" />
                      </div>

                      {/* Active Phase Bar */}
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barColor} shadow-xs relative`}
                        style={{
                          marginLeft: `${pctStart}%`,
                          width: `${Math.max(12, pctEnd - pctStart)}%`
                        }}
                      >
                        {statusType === 'in_progress' && (
                          <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                        )}
                      </div>
                    </div>

                    {/* Inline Quick Action Controls */}
                    <div className="flex items-center justify-between pt-1">
                      <p className="text-[11px] text-slate-500 line-clamp-1 max-w-lg">
                        {milestone.description || 'Milestone phase deliverable for research tranche.'}
                      </p>

                      <div className="flex items-center gap-1 shrink-0">
                        {isUpdating ? (
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                            Saving...
                          </span>
                        ) : (
                          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStatusChange(milestone.id, 'Pending')
                              }}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                                statusType === 'pending'
                                  ? 'bg-amber-400 text-amber-950 shadow-2xs'
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              Pending
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStatusChange(milestone.id, 'In Progress')
                              }}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                                statusType === 'in_progress'
                                  ? 'bg-blue-600 text-white shadow-2xs'
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              In Progress
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStatusChange(milestone.id, 'Completed')
                              }}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                                statusType === 'completed'
                                  ? 'bg-emerald-600 text-white shadow-2xs'
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              Completed
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. Detailed Deliverables & Lab Commitments Matrix */}
      {(viewMode === 'list' || viewMode === 'split') && (
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Deliverable Details
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Research Deliverables & Laboratory Phase Commitments
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Click status to advance deliverable phase
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {milestones.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No deliverables recorded.</p>
            ) : (
              milestones.map((milestone, idx) => {
                const statusType = getStatusType(milestone.status)
                const isCompleted = statusType === 'completed'
                const isInProgress = statusType === 'in_progress'
                const isPending = statusType === 'pending'
                const isUpdating = updatingId === milestone.id
                const isSelected = selectedMilestoneId === milestone.id

                return (
                  <div
                    key={milestone.id}
                    onClick={() => setSelectedMilestoneId(milestone.id)}
                    className={`py-4 px-3 rounded-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer ${
                      isSelected ? 'bg-slate-50/80 ring-1 ring-slate-200' : 'hover:bg-slate-50/40'
                    }`}
                  >
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 font-mono">
                          Phase #{idx + 1}
                        </span>
                        <h4
                          className={`text-sm font-semibold ${
                            isCompleted ? 'text-slate-500 line-through' : 'text-slate-900'
                          }`}
                        >
                          {milestone.title}
                        </h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            isCompleted
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : isInProgress
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {milestone.status}
                        </span>
                      </div>

                      {milestone.description && (
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {milestone.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Target Due: {formatDate(milestone.dueDate)}
                        </span>

                        {/* Assigned Laboratory Badge */}
                        {milestone.lab ? (
                          <span className="flex items-center gap-1 text-indigo-700 bg-indigo-50/80 px-2.5 py-0.5 rounded border border-indigo-200/60 font-medium">
                            <FlaskConical className="w-3.5 h-3.5 text-indigo-600" />
                            Assigned Lab: <strong className="font-semibold">{milestone.lab.name}</strong>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            Central Department Facility
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Toggle Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isUpdating ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                          Updating...
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleStatusChange(milestone.id, 'Pending')
                            }}
                            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                              isPending
                                ? 'bg-amber-100 text-amber-800 shadow-2xs font-bold border border-amber-300'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            Pending
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleStatusChange(milestone.id, 'In Progress')
                            }}
                            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                              isInProgress
                                ? 'bg-blue-600 text-white shadow-2xs font-bold'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            In Progress
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleStatusChange(milestone.id, 'Completed')
                            }}
                            className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                              isCompleted
                                ? 'bg-emerald-600 text-white shadow-2xs font-bold'
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
      )}
    </div>
  )
}
