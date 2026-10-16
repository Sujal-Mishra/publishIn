'use client'

import React, { useState } from 'react'
import { GrantLifecycleStepper } from './GrantLifecycleStepper'
import { BudgetUtilizationChart } from './BudgetUtilizationChart'
import { ProjectGanttRoadmap, MilestoneItem } from './ProjectGanttRoadmap'

interface ProjectGrantSectionProps {
  projectId: string
  status: string
  proposalDate?: Date | string | null
  startDate?: Date | string | null
  endDate?: Date | string | null
  budget?: number | null
  grantNumber?: string | null
  fundingAgencyName?: string | null
  initialMilestones: MilestoneItem[]
}

export function ProjectGrantSection({
  projectId,
  status,
  proposalDate,
  startDate,
  endDate,
  budget,
  grantNumber,
  fundingAgencyName,
  initialMilestones
}: ProjectGrantSectionProps) {
  const [milestones, setMilestones] = useState<MilestoneItem[]>(initialMilestones)

  return (
    <div className="space-y-6">
      {/* 1. National Grant Lifecycle Pipeline */}
      <GrantLifecycleStepper
        status={status}
        proposalDate={proposalDate}
        startDate={startDate}
        endDate={endDate}
        grantNumber={grantNumber}
        fundingAgencyName={fundingAgencyName}
      />

      {/* 2. Visual Budget Utilization & Burn-Down Chart */}
      <BudgetUtilizationChart totalBudget={budget} milestones={milestones} />

      {/* 3. Interactive Research Project Gantt & Milestone Timeline Roadmap */}
      <ProjectGanttRoadmap
        projectId={projectId}
        startDate={startDate}
        endDate={endDate}
        initialMilestones={initialMilestones}
        onMilestoneChange={(updated) => setMilestones(updated)}
      />
    </div>
  )
}
