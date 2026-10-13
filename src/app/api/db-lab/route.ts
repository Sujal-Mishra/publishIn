import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  checkOracleConnection,
  runOracleQuery,
  runOracleProcedure
} from '@/lib/oracle'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')

  try {
    // 0. Status Check: Test live Oracle connection
    if (action === 'status') {
      const oracleStatus = await checkOracleConnection()
      return NextResponse.json({
        success: true,
        oracle: oracleStatus,
        driver: 'oracledb',
        service: 'Oracle 21c XE / SQL*Plus'
      })
    }

    // 1. View: Query Oracle's V_ACTIVE_RESEARCH_PROJECTS or full details table
    if (action === 'view' || action === 'all') {
      try {
        const oracleRows = await runOracleQuery(`
          SELECT 
            p.project_id AS "id",
            p.project_title AS "projectTitle",
            p.grant_number AS "grantNumber",
            p.budget AS "budget",
            p.project_status AS "projectStatus",
            p.start_date AS "startDate",
            p.end_date AS "endDate",
            r.fname AS "profFname",
            r.lname AS "profLname",
            r.current_position AS "profPosition",
            r.email AS "profEmail",
            d.department_name AS "deptName",
            u.university_name AS "univName",
            u.abbreviation AS "univAbbr",
            f.name AS "fundingName"
          FROM RESEARCH_PROJECT p
          JOIN RESEARCHER r ON p.lead_professor_id = r.researcher_id
          JOIN DEPARTMENT d ON p.department_id = d.department_id
          JOIN UNIVERSITY u ON d.university_id = u.university_id
          LEFT JOIN FUNDING_AGENCY f ON p.funding_agency_id = f.agency_id
          ORDER BY p.project_id DESC
        `)

        const formatted = oracleRows.map((r: any) => ({
          id: String(r.id),
          projectTitle: r.projectTitle,
          grantNumber: r.grantNumber,
          budget: r.budget,
          projectStatus: r.projectStatus || 'Active',
          startDate: r.startDate,
          endDate: r.endDate,
          leadProfessor: {
            fname: r.profFname,
            lname: r.profLname,
            currentPosition: r.profPosition,
            email: r.profEmail
          },
          department: {
            departmentName: r.deptName,
            university: {
              universityName: r.univName,
              abbreviation: r.univAbbr
            }
          },
          fundingAgency: r.fundingName ? { name: r.fundingName } : null,
          _source: 'Oracle Database 21c XE (SQL*Plus)'
        }))

        // Also fetch the Oracle view V_ACTIVE_RESEARCH_PROJECTS
        const oracleViewRows = await runOracleQuery(`SELECT * FROM V_ACTIVE_RESEARCH_PROJECTS`)

        return NextResponse.json({
          success: true,
          type: 'FETCH_ALL_DETAILS_FROM_ORACLE',
          source: 'Oracle 21c XE',
          data: formatted,
          oracleViewData: oracleViewRows
        })
      } catch (oracleErr: any) {
        // Fallback to Prisma if Oracle is temporarily not running
        console.warn('Oracle query failed, falling back to Prisma:', oracleErr.message)
        const data = await prisma.researchProject.findMany({
          include: {
            leadProfessor: {
              select: { fname: true, lname: true, currentPosition: true, email: true }
            },
            department: {
              include: {
                university: { select: { universityName: true, abbreviation: true } }
              }
            },
            fundingAgency: { select: { name: true } }
          },
          orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json({
          success: true,
          type: 'FETCH_ALL_DETAILS_PRISMA_FALLBACK',
          data,
          warning: `Oracle fallback: ${oracleErr.message}`
        })
      }
    }

    // 2. Group By with Having (3 Tables)
    if (action === 'groupby') {
      try {
        const querySql = `
          SELECT 
            u.university_name AS "universityName",
            u.abbreviation AS "abbreviation",
            COUNT(p.project_id) AS "activeProjectCount",
            SUM(p.budget) AS "totalGrantBudget"
          FROM UNIVERSITY u
          JOIN DEPARTMENT d ON u.university_id = d.university_id
          JOIN RESEARCH_PROJECT p ON d.department_id = p.department_id
          WHERE p.project_status = 'Active'
          GROUP BY u.university_name, u.abbreviation
          HAVING SUM(p.budget) >= 5000000
        `
        const rows = await runOracleQuery(querySql)
        return NextResponse.json({
          success: true,
          type: 'ORACLE_GROUP_BY_HAVING',
          source: 'Oracle 21c XE',
          sql: querySql.trim(),
          data: rows
        })
      } catch (oracleErr: any) {
        // Fallback to Prisma
        const universities = await prisma.university.findMany({
          include: {
            departments: {
              include: { projects: true }
            }
          }
        })
        const result = universities.map(u => {
          const activeProjects = u.departments.flatMap(d => d.projects).filter(p => p.projectStatus === 'Active')
          const totalBudget = activeProjects.reduce((acc, p) => acc + (p.budget || 0), 0)
          return {
            universityName: u.universityName,
            abbreviation: u.abbreviation,
            activeProjectCount: activeProjects.length,
            totalGrantBudget: totalBudget
          }
        }).filter(u => u.totalGrantBudget >= 5000000)

        return NextResponse.json({ success: true, type: 'GROUP_BY_HAVING_FALLBACK', data: result })
      }
    }

    // 3. Nested Query (3 Tables)
    if (action === 'nested') {
      try {
        const querySql = `
          SELECT 
            r.researcher_id AS "id",
            r.fname AS "fname",
            r.lname AS "lname",
            r.email AS "email",
            r.current_position AS "currentPosition",
            d.department_name AS "departmentName",
            u.university_name AS "universityName",
            u.type AS "universityType",
            u.ranking AS "universityRanking"
          FROM RESEARCHER r
          JOIN DEPARTMENT d ON r.department_id = d.department_id
          JOIN UNIVERSITY u ON d.university_id = u.university_id
          WHERE u.university_id IN (
            SELECT university_id FROM UNIVERSITY WHERE type = 'Public' AND ranking <= 5
          )
          ORDER BY r.researcher_id
        `
        const rows = await runOracleQuery(querySql)
        return NextResponse.json({
          success: true,
          type: 'ORACLE_NESTED_QUERY',
          source: 'Oracle 21c XE',
          sql: querySql.trim(),
          data: rows
        })
      } catch (oracleErr: any) {
        const researchers = await prisma.researcher.findMany({
          where: {
            department: {
              university: {
                type: 'Public',
                ranking: { lte: 5 }
              }
            }
          },
          include: {
            department: {
              include: { university: true }
            }
          }
        })
        return NextResponse.json({ success: true, type: 'NESTED_QUERY_FALLBACK', data: researchers })
      }
    }

    // 4. Stored Procedure: Execute GET_UNIVERSITY_STATS(1) in Oracle
    if (action === 'procedure') {
      try {
        const lines = await runOracleProcedure('BEGIN GET_UNIVERSITY_STATS(1); END;')
        return NextResponse.json({
          success: true,
          type: 'ORACLE_PLSQL_PROCEDURE',
          source: 'Oracle 21c XE (SQL*Plus)',
          procedure: 'GET_UNIVERSITY_STATS(1)',
          output: lines
        })
      } catch (oracleErr: any) {
        return NextResponse.json({
          success: false,
          error: `Oracle PL/SQL execution error: ${oracleErr.message}`
        }, { status: 500 })
      }
    }

    return NextResponse.json({ success: false, error: 'Invalid action parameter' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

/**
 * POST /api/db-lab
 * Run ANY custom SQL or PL/SQL query directly against local Oracle Database!
 */
export async function POST(req: Request) {
  try {
    const { sql } = await req.json()
    if (!sql || typeof sql !== 'string') {
      return NextResponse.json({ success: false, error: 'SQL query string is required' }, { status: 400 })
    }

    const trimmed = sql.trim().replace(/;$/, '')

    // Check if it's a PL/SQL block
    if (trimmed.toUpperCase().startsWith('BEGIN') || trimmed.toUpperCase().startsWith('DECLARE')) {
      const output = await runOracleProcedure(trimmed)
      return NextResponse.json({
        success: true,
        type: 'PLSQL_BLOCK_EXECUTED',
        source: 'Oracle 21c XE',
        output
      })
    }

    // Standard SELECT / query
    const rows = await runOracleQuery(trimmed)
    return NextResponse.json({
      success: true,
      type: 'ORACLE_SQL_RESULT',
      source: 'Oracle 21c XE',
      rowCount: rows.length,
      data: rows
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Error executing Oracle SQL query'
    }, { status: 500 })
  }
}
