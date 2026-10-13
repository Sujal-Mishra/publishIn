# Grant Lifecycle & Budget Utilization Tracker

## Goal
Implement a research grant lifecycle pipeline (Proposed -> Under Review -> Sanctioned -> Active -> Completed) and an interactive financial burn-down / budget utilization tracker for ResearchHub.

## Tasks
- [x] Task 1: Initialize plan and verify Neon database connectivity -> Verify: Neon query test passes
- [x] Task 2: Create GrantLifecycleStepper UI component -> Verify: Component renders 5 lifecycle states with timestamps
- [x] Task 3: Create BudgetUtilizationChart component with Recharts -> Verify: Component visualizes total budget, utilized amount, and milestone progression
- [x] Task 4: Create MilestoneManager interactive component and API -> Verify: PATCH /api/projects/[id]/milestones updates status in Neon and recalculates budget
- [x] Task 5: Integrate into Project Details Page (`src/app/projects/[id]/page.tsx`) -> Verify: Page displays lifecycle stepper, budget chart, and milestone controls
- [x] Task 6: Upgrade Funding Agencies Page (`src/app/funding-agencies/page.tsx`) -> Verify: Page shows total grant capital and active grant distribution
- [x] Task 7: End-to-end testing and verification -> Verify: `npx tsc --noEmit` passes with 0 errors

## Done When
- Professors/Reviewers can see the exact grant stage and budget burn rate for research projects.
- Milestone status updates reflect dynamically with live recalculation.
- Build passes cleanly with complete type safety.
