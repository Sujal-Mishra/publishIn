import { NextRequest, NextResponse } from 'next/server'
import { getInstitutionalResearchReport } from '@/services/university.service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const report = await getInstitutionalResearchReport(id)

    if (!report) {
      return NextResponse.json({ error: 'University not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format')

    if (format === 'csv') {
      const csvLines: string[] = []

      // 1. Header
      csvLines.push(`"INSTITUTIONAL RESEARCH PERFORMANCE & ACCREDITATION AUDIT REPORT"`)
      csvLines.push(`"Institution:","${report.university.universityName} (${report.university.abbreviation})"`)
      csvLines.push(`"NIRF Ranking:","Rank #${report.university.ranking || 'N/A'}"`)
      csvLines.push(`"Accreditation Projection:","${report.accreditationGrade}"`)
      csvLines.push(`"Tier Classification:","${report.nirfTier}"`)
      csvLines.push(`"Audit Generated At:","${new Date(report.generatedAt).toLocaleString('en-IN')}"`)
      csvLines.push(`"Campus Locations:","${report.university.locations.join('; ')}"`)
      csvLines.push(``)

      // 2. Executive Summary KPIs
      csvLines.push(`"SECTION 1: STATUTORY RESEARCH GRANTS & CAPITAL SUMMARY"`)
      csvLines.push(`"Metric","Value"`)
      csvLines.push(`"Total Funding Received (All Grants)","INR ${report.summary.totalFundingReceived.toLocaleString('en-IN')}"`)
      csvLines.push(`"Total Active Funding (In Execution)","INR ${report.summary.totalActiveFunding.toLocaleString('en-IN')}"`)
      csvLines.push(`"Total Projects Registered","${report.summary.totalProjects}"`)
      csvLines.push(`"Active Grants in Progress","${report.summary.totalActiveProjects}"`)
      csvLines.push(`"Academic Departments","${report.summary.totalDepartments}"`)
      csvLines.push(`"Specialized Research Laboratories","${report.summary.totalLaboratories}"`)
      csvLines.push(`"Full-time Research Faculty","${report.summary.totalFaculty}"`)
      csvLines.push(`"Enrolled / Completed Ph.D. Scholars","${report.summary.totalPhdScholars}"`)
      csvLines.push(`"Peer-Reviewed Publications","${report.summary.totalPublications}"`)
      csvLines.push(`"Patents Granted","${report.summary.totalPatentsGranted}"`)
      csvLines.push(`"Industry R&D Partners","${report.summary.totalIndustryPartners}"`)
      csvLines.push(`"Joint Corporate Patents","${report.summary.totalJointPatents}"`)
      csvLines.push(``)

      // 3. Department-wise Breakdown
      csvLines.push(`"SECTION 2: DEPARTMENT-WISE RESEARCH PERFORMANCE MATRIX"`)
      csvLines.push(
        `"Department Name","HOD","Faculty Count","Ph.D. Scholars","Active Projects","Total Projects","Active Funding (INR)","Total Funding (INR)","Publications","Patents Granted","Laboratories"`
      )

      for (const dept of report.departmentMetrics) {
        csvLines.push(
          `"${dept.departmentName}","${dept.hod || 'N/A'}",${dept.facultyCount},${dept.phdCompletionsCount},${dept.activeProjectsCount},${dept.projectsCount},${dept.activeFunding},${dept.totalFunding},${dept.publicationsCount},${dept.patentsCount},"${dept.laboratories.map((l) => l.name).join('; ')}"`
        )
      }
      csvLines.push(``)

      // 4. Industry Collaborations & Joint Patents
      csvLines.push(`"SECTION 3: CORPORATE R&D PARTNERSHIPS & JOINT PATENTS"`)
      csvLines.push(`"Industry Partner","Sector / Domain","Collaboration Type(s)","Sponsored Projects","Joint Patents Count"`)

      for (const ind of report.industryPartners) {
        csvLines.push(
          `"${ind.industryName}","${ind.industryType}","${ind.collaborationTypes.join(', ')}",${ind.sponsoredProjectsCount},${ind.jointPatentsCount}`
        )
      }
      csvLines.push(``)

      // 5. Joint Patents Detailed
      if (report.jointPatents.length > 0) {
        csvLines.push(`"SECTION 4: JOINT PATENTS DETAIL"`)
        csvLines.push(`"Patent Title","Corporate Co-Assignee","Project Title","DOI / Filing ID","Grant Date"`)
        for (const jp of report.jointPatents) {
          csvLines.push(
            `"${jp.title}","${jp.industryPartner}","${jp.projectTitle}","${jp.doi || 'Pending'}","${jp.grantDate ? new Date(jp.grantDate).toLocaleDateString() : 'Pending'}"`
          )
        }
      }

      const csvContent = csvLines.join('\r\n')
      const fileName = `institutional-research-report-${report.university.abbreviation.toLowerCase()}.csv`

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${fileName}"`
        }
      })
    }

    return NextResponse.json(report)
  } catch (err: any) {
    console.error('Error in institutional report API:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
