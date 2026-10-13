'use client'

import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts'
import { Banknote, TrendingUp, ShieldAlert, CheckCircle2, Clock } from 'lucide-react'

interface MilestoneItem {
  id: string
  title: string
  dueDate?: Date | string | null
  status: string
  lab?: {
    name: string
  } | null
}

interface BudgetUtilizationChartProps {
  totalBudget?: number | null
  milestones: MilestoneItem[]
}

export function BudgetUtilizationChart({
  totalBudget = 0,
  milestones = []
}: BudgetUtilizationChartProps) {
  const budget = totalBudget || 0
  const totalMilestones = milestones.length
  const completedMilestones = milestones.filter(
    (m) => m.status.toLowerCase() === 'completed'
  ).length
  const inProgressMilestones = milestones.filter(
    (m) => m.status.toLowerCase() === 'in progress' || m.status.toLowerCase() === 'in_progress'
  ).length
  const pendingMilestones = totalMilestones - completedMilestones - inProgressMilestones

  // Calculate proportional budget allocation per milestone
  const utilizationRate = totalMilestones > 0 ? completedMilestones / totalMilestones : 0
  const utilizedAmount = Math.round(budget * utilizationRate)
  const remainingAmount = Math.max(0, budget - utilizedAmount)
  const committedAmount =
    totalMilestones > 0 ? Math.round((budget * inProgressMilestones) / totalMilestones) : 0

  const pieData = [
    { name: 'Disbursed & Utilized', value: utilizedAmount, color: '#10b981' },
    { name: 'Committed (In-Progress)', value: committedAmount, color: '#3b82f6' },
    { name: 'Unallocated / Remaining', value: Math.max(0, remainingAmount - committedAmount), color: '#e2e8f0' }
  ].filter((d) => d.value > 0)

  // Format currency in Indian Lakhs/Crores or millions
  const formatINR = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakh`
    }
    return `₹${val.toLocaleString('en-IN')}`
  }

  // Bar breakdown by milestone
  const milestoneBarData = milestones.map((m, idx) => ({
    name: `M${idx + 1}: ${m.title.length > 18 ? m.title.slice(0, 15) + '...' : m.title}`,
    fullTitle: m.title,
    status: m.status,
    budgetShare: totalMilestones > 0 ? Math.round(budget / totalMilestones) : 0
  }))

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Financial Audit & Treasury
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-0.5">
            Grant Budget Utilization & Milestone Burn-Down
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
            <Banknote className="w-4 h-4 text-emerald-600" />
            Total Sanctioned: <span className="font-bold">{formatINR(budget)}</span>
          </div>
        </div>
      </div>

      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Expended Capital</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2">
            {formatINR(utilizedAmount)}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
            <TrendingUp className="w-3 h-3" />
            {Math.round(utilizationRate * 100)}% of grant expended
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Active Commitments</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2">
            {formatINR(committedAmount)}
          </div>
          <div className="mt-1 text-[11px] text-blue-600 font-medium">
            {inProgressMilestones} milestone(s) active in labs
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Remaining Liquidity</span>
            <ShieldAlert className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2">
            {formatINR(remainingAmount)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">
            Available for remaining deliverables
          </div>
        </div>
      </div>

      {/* Visual Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Donut Chart */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-50/50 rounded-xl border border-slate-200/80">
          <span className="text-xs font-bold text-slate-700 mb-2">Fund Allocation Breakdown</span>
          <div className="w-full h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData.length > 0 ? pieData : [{ name: 'Budget', value: 1, color: '#e2e8f0' }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => formatINR(Number(value))}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-slate-400 font-medium">Burn Rate</span>
              <span className="text-lg font-black text-slate-800">
                {Math.round(utilizationRate * 100)}%
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-600 mt-2">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Expended
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> In-Progress
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Remaining
            </span>
          </div>
        </div>

        {/* Milestone Allocation Bar Chart */}
        <div className="lg:col-span-2 p-4 bg-slate-50/50 rounded-xl border border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700">
              Deliverable Tranche Distribution
            </span>
            <span className="text-[11px] text-slate-500">
              {completedMilestones} of {totalMilestones} Milestones Cleared
            </span>
          </div>

          {milestones.length > 0 ? (
            <div className="w-full h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={milestoneBarData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    tickFormatter={(v) => (v >= 100000 ? `${(v / 100000).toFixed(0)}L` : `${v}`)}
                  />
                  <Tooltip
                    formatter={(val: any) => [formatINR(Number(val)), 'Tranche Value']}
                    labelFormatter={(_, payload: any) =>
                      payload?.[0]?.payload?.fullTitle || 'Milestone'
                    }
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '11px'
                    }}
                  />
                  <Bar dataKey="budgetShare" radius={[4, 4, 0, 0]}>
                    {milestoneBarData.map((entry, index) => {
                      const color =
                        entry.status.toLowerCase() === 'completed'
                          ? '#10b981'
                          : entry.status.toLowerCase() === 'in progress'
                          ? '#3b82f6'
                          : '#94a3b8'
                      return <Cell key={`bar-${index}`} fill={color} />
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-xs text-slate-400">
              No milestones defined for this research grant
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
