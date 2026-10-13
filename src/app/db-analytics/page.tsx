'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Badge } from '@/components/ui/Badge'
import {
  Database,
  Play,
  Layers,
  Code,
  Search,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  Terminal,
  ShieldCheck,
  AlertCircle,
  Building2,
  UserCheck,
  Calendar,
  Banknote,
  GraduationCap,
  Sparkles
} from 'lucide-react'

export default function DbAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'part_a' | 'part_b' | 'part_c' | 'sql_console'>('part_c')
  const [queryOutput, setQueryOutput] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Oracle Status
  const [oracleStatus, setOracleStatus] = useState<{
    connected: boolean
    info?: any
    error?: string
  } | null>(null)

  // SQL Console State
  const [customSql, setCustomSql] = useState('SELECT * FROM V_ACTIVE_RESEARCH_PROJECTS')
  const [consoleLoading, setConsoleLoading] = useState(false)
  const [consoleResult, setConsoleResult] = useState<any>(null)

  // Part c CRUD State
  const [projects, setProjects] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [professors, setProfessors] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])

  // Form State for Add New
  const [newTitle, setNewTitle] = useState('')
  const [newGrant, setNewGrant] = useState('')
  const [newBudget, setNewBudget] = useState('12000000')
  const [leadProfId, setLeadProfId] = useState('')
  const [deptId, setDeptId] = useState('')
  const [formMsg, setFormMsg] = useState('')

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editBudget, setEditBudget] = useState('')
  const [editStatus, setEditStatus] = useState('Active')

  // Load Initial Data for CRUD with ALL DETAILS & Oracle Status
  const fetchProjects = async () => {
    try {
      // 1. Check Oracle status
      const statusRes = await fetch('/api/db-lab?action=status')
      if (statusRes.ok) {
        const sData = await statusRes.json()
        setOracleStatus(sData.oracle)
      }

      // 2. Fetch form options
      const res = await fetch('/api/projects/form-options')
      if (res.ok) {
        const data = await res.json()
        setProfessors(data.professors || [])
        setDepartments(data.departments || [])
        if (data.professors?.length > 0) {
          setLeadProfId(data.professors[0].id)
          setDeptId(data.professors[0].departmentId)
        }
      }

      // 3. Fetch active list with ALL details (from Oracle)
      const res2 = await fetch('/api/db-lab?action=view')
      if (res2.ok) {
        const d = await res2.json()
        setProjects(d.data || [])
      }
    } catch (e) {}
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  // Run Query API (Part A & B)
  const runLabAction = async (action: string) => {
    setLoading(true)
    setQueryOutput(null)
    try {
      const res = await fetch(`/api/db-lab?action=${action}`)
      const data = await res.json()
      setQueryOutput(data)
    } catch (err) {
      setQueryOutput({ error: 'Failed to execute query' })
    } finally {
      setLoading(false)
    }
  }

  // Run Custom SQL Console Query
  const handleExecuteSql = async (sqlToRun?: string) => {
    const query = sqlToRun || customSql
    if (!query.trim()) return

    setConsoleLoading(true)
    setConsoleResult(null)
    try {
      const res = await fetch('/api/db-lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: query })
      })
      const data = await res.json()
      setConsoleResult(data)
    } catch (err: any) {
      setConsoleResult({ success: false, error: err.message || 'Execution error' })
    } finally {
      setConsoleLoading(false)
    }
  }

  // Part c: 1. Add New Record
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormMsg('')
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectTitle: newTitle,
          grantNumber: newGrant || 'GRANT-' + Math.floor(Math.random() * 10000),
          startDate: new Date().toISOString().split('T')[0],
          budget: newBudget,
          leadProfessorId: leadProfId,
          departmentId: deptId
        })
      })

      const data = await res.json()
      if (data.success) {
        setFormMsg('✅ Record added successfully!')
        setNewTitle('')
        setNewGrant('')
        fetchProjects()
      } else {
        setFormMsg(`❌ Error: ${data.error}`)
      }
    } catch (err) {
      setFormMsg('❌ Failed to add record.')
    }
  }

  // Part c: 4. Update Record
  const handleUpdate = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectTitle: editTitle,
          budget: editBudget,
          projectStatus: editStatus
        })
      })

      const data = await res.json()
      if (data.success) {
        setEditingId(null)
        fetchProjects()
      } else {
        alert(data.error || 'Failed to update')
      }
    } catch (err) {
      alert('Error updating record')
    }
  }

  // Part c: 5. Delete Record
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record from the database?')) return
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        fetchProjects()
      } else {
        alert(data.error || 'Failed to delete')
      }
    } catch (err) {
      alert('Error deleting record')
    }
  }

  // Part c: 3. Traverse / Search Filter across ALL fields
  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase()
    const profName = p.leadProfessor ? `${p.leadProfessor.fname} ${p.leadProfessor.lname}` : ''
    const univName = p.department?.university?.universityName || ''
    const deptName = p.department?.departmentName || ''

    return (
      p.projectTitle?.toLowerCase().includes(q) ||
      (p.grantNumber && p.grantNumber.toLowerCase().includes(q)) ||
      profName.toLowerCase().includes(q) ||
      univName.toLowerCase().includes(q) ||
      deptName.toLowerCase().includes(q)
    )
  })

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Header */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">DBMS Lab Exercise No: 5 Console</h1>
                <p className="text-xs text-slate-500">
                  Interactive execution panel for Views, Indexes, Stored Procedures, 3-Table Queries & Front-End CRUD
                </p>
              </div>
            </div>

            {/* Oracle SQL*Plus Connection Status Indicator */}
            {oracleStatus?.connected ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Oracle 21c XE Connected ({oracleStatus.info?.CON_NAME} / {oracleStatus.info?.CURRENT_USER})
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-xs font-semibold">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Oracle Connecting... (Fallback Active)</span>
              </div>
            )}
          </div>

          {/* Navigation Tabs for Ex No 5 */}
          <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('part_c')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all border-t border-x whitespace-nowrap ${
                activeTab === 'part_c'
                  ? 'bg-white border-slate-200 text-blue-700 border-b-transparent'
                  : 'bg-slate-100 border-transparent text-slate-600 hover:bg-slate-200'
              }`}
            >
              Ex 5(c) — Fetch ALL Details & CRUD Form
            </button>
            <button
              onClick={() => setActiveTab('part_a')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all border-t border-x whitespace-nowrap ${
                activeTab === 'part_a'
                  ? 'bg-white border-slate-200 text-blue-700 border-b-transparent'
                  : 'bg-slate-100 border-transparent text-slate-600 hover:bg-slate-200'
              }`}
            >
              Ex 5(a) — VIEW, INDEX & Stored Procedure
            </button>
            <button
              onClick={() => setActiveTab('part_b')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all border-t border-x whitespace-nowrap ${
                activeTab === 'part_b'
                  ? 'bg-white border-slate-200 text-blue-700 border-b-transparent'
                  : 'bg-slate-100 border-transparent text-slate-600 hover:bg-slate-200'
              }`}
            >
              Ex 5(b) — Group By - Having & Nested Queries
            </button>
            <button
              onClick={() => setActiveTab('sql_console')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all border-t border-x whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'sql_console'
                  ? 'bg-white border-slate-200 text-purple-700 border-b-transparent'
                  : 'bg-slate-100 border-transparent text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Live SQL*Plus / Oracle Console
            </button>
          </div>

          {/* ========================================================= */}
          {/* TAB 1: EX 5(c) FRONT-END FORM WITH ALL DETAILS FETCHED */}
          {/* ========================================================= */}
          {activeTab === 'part_c' && (
            <div className="space-y-8">
              {/* Add New Form */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <PlusCircle className="w-5 h-5 text-blue-600" />
                  <h2 className="font-bold text-slate-900 text-base">1. Add New Record Form</h2>
                </div>

                {formMsg && (
                  <div className="p-3 bg-slate-100 text-slate-800 text-xs rounded-md font-semibold">
                    {formMsg}
                  </div>
                )}

                <form onSubmit={handleAddProject} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Autonomous Swarm Robotics Grid"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Grant Number</label>
                    <input
                      type="text"
                      value={newGrant}
                      onChange={(e) => setNewGrant(e.target.value)}
                      placeholder="e.g. SERB-2026-88"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Grant Budget (₹)</label>
                    <input
                      type="number"
                      value={newBudget}
                      onChange={(e) => setNewBudget(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Lead Professor *</label>
                    <select
                      value={leadProfId}
                      onChange={(e) => setLeadProfId(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900"
                    >
                      {professors.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.fname} {p.lname} ({p.department?.university?.abbreviation})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department *</label>
                    <select
                      value={deptId}
                      onChange={(e) => setDeptId(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.university?.abbreviation} - {d.departmentName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-xs transition-colors"
                    >
                      Add New Record
                    </button>
                  </div>
                </form>
              </div>

              {/* Fetch Existing Table with ALL Details */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                      <Database className="w-5 h-5 text-blue-600" />
                      Fetched Existing Records ({filteredProjects.length} Items with Full Relational Details)
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Live data from Oracle 21c XE: Project Title, Grant #, Budget, Status, Lead Investigator, Department & University
                    </p>
                  </div>

                  {/* Traverse/Search Input */}
                  <div className="relative w-full max-w-xs">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Traverse/Search all details..."
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Table containing ALL fetched details */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-100 uppercase text-[10px] text-slate-600 font-bold border-y border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Project & Grant Info</th>
                        <th className="px-4 py-3">Budget (₹)</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Lead Investigator (Professor)</th>
                        <th className="px-4 py-3">Host Department & University</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProjects.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3 max-w-xs">
                            {editingId === p.id ? (
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="px-2 py-1 bg-white border border-slate-300 rounded w-full"
                              />
                            ) : (
                              <div>
                                <div className="font-bold text-slate-900 text-xs">{p.projectTitle}</div>
                                <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                                  Grant #: {p.grantNumber || 'N/A'}
                                </div>
                              </div>
                            )}
                          </td>

                          <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">
                            {editingId === p.id ? (
                              <input
                                type="number"
                                value={editBudget}
                                onChange={(e) => setEditBudget(e.target.value)}
                                className="px-2 py-1 bg-white border border-slate-300 rounded w-28"
                              />
                            ) : (
                              `₹${(p.budget || 0).toLocaleString('en-IN')}`
                            )}
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap">
                            {editingId === p.id ? (
                              <select
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value)}
                                className="px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                              >
                                <option value="Active">Active</option>
                                <option value="Under Review">Under Review</option>
                                <option value="Completed">Completed</option>
                              </select>
                            ) : (
                              <Badge variant={p.projectStatus === 'Active' ? 'success' : 'info'}>
                                {p.projectStatus}
                              </Badge>
                            )}
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap">
                            {p.leadProfessor ? (
                              <div>
                                <div className="font-semibold text-slate-900 text-xs flex items-center gap-1">
                                  <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                  {p.leadProfessor.fname} {p.leadProfessor.lname}
                                </div>
                                <div className="text-[11px] text-slate-500">
                                  {p.leadProfessor.currentPosition || 'Professor'}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  {p.leadProfessor.email}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">Not assigned</span>
                            )}
                          </td>

                          <td className="px-4 py-3">
                            {p.department ? (
                              <div>
                                <div className="font-semibold text-slate-900 text-xs flex items-center gap-1">
                                  <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  {p.department.departmentName}
                                </div>
                                <div className="text-[11px] font-bold text-slate-600 mt-0.5">
                                  {p.department.university?.universityName} ({p.department.university?.abbreviation})
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">No department</span>
                            )}
                          </td>

                          <td className="px-4 py-3 text-right whitespace-nowrap space-x-2">
                            {editingId === p.id ? (
                              <button
                                onClick={() => handleUpdate(p.id)}
                                className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[11px] font-semibold"
                              >
                                Save
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingId(p.id)
                                  setEditTitle(p.projectTitle)
                                  setEditBudget(p.budget || '0')
                                  setEditStatus(p.projectStatus)
                                }}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold"
                              >
                                <Edit2 className="w-3.5 h-3.5 inline mr-1" /> Update
                              </button>
                            )}

                            <button
                              onClick={() => handleDelete(p.id)}
                              className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded text-[11px] font-semibold"
                            >
                              <Trash2 className="w-3.5 h-3.5 inline mr-1" /> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EX 5(a) VIEW, PROCEDURE & INDEX */}
          {activeTab === 'part_a' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => runLabAction('view')}
                  className="bg-white border border-slate-200 hover:border-blue-500 rounded-xl p-5 text-left transition-all shadow-xs group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-600 uppercase">1. VIEW Concept</span>
                    <Play className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">V_ACTIVE_RESEARCH_PROJECTS</h3>
                  <p className="text-xs text-slate-500 mt-1">Queries Oracle virtual table view joining 4 underlying tables.</p>
                </button>

                <button
                  onClick={() => runLabAction('procedure')}
                  className="bg-white border border-slate-200 hover:border-blue-500 rounded-xl p-5 text-left transition-all shadow-xs group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-600 uppercase">2. Stored Procedure</span>
                    <Play className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">GET_UNIVERSITY_STATS(1)</h3>
                  <p className="text-xs text-slate-500 mt-1">Executes server-side PL/SQL procedure & captures DBMS_OUTPUT.</p>
                </button>

                <div className="bg-white border border-slate-200 rounded-xl p-5 text-left shadow-xs">
                  <span className="text-xs font-bold text-purple-600 uppercase block mb-1">3. B-Tree INDEX</span>
                  <h3 className="font-bold text-slate-900 text-sm">idx_project_title & idx_univ_name</h3>
                  <p className="text-xs text-slate-500 mt-1">Active Oracle B-Tree Indexes optimize lookup time from O(N) to O(log N).</p>
                </div>
              </div>

              {loading && <p className="text-xs text-slate-500 italic">Executing query on Oracle 21c XE...</p>}

              {queryOutput && (
                <div className="bg-slate-900 text-slate-100 rounded-xl p-6 shadow-md font-mono text-xs overflow-x-auto space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-emerald-400 font-bold flex items-center gap-2">
                      <Terminal className="w-4 h-4" /> Oracle Query Output ({queryOutput.type})
                    </span>
                    <button onClick={() => setQueryOutput(null)} className="text-slate-400 hover:text-white text-xs">Clear</button>
                  </div>
                  <pre className="text-xs text-slate-300 leading-relaxed">
                    {JSON.stringify(queryOutput.output || queryOutput.oracleViewData || queryOutput.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: EX 5(b) GROUP BY & NESTED QUERIES */}
          {activeTab === 'part_b' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => runLabAction('groupby')}
                  className="bg-white border border-slate-200 hover:border-blue-500 rounded-xl p-6 text-left transition-all shadow-xs group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-600 uppercase">1. GROUP BY with HAVING (3 Tables)</span>
                    <Play className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Universities with Grant Budget &ge; ₹5,000,000</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Joins <code className="bg-slate-100 px-1">UNIVERSITY</code>, <code className="bg-slate-100 px-1">DEPARTMENT</code>, and <code className="bg-slate-100 px-1">RESEARCH_PROJECT</code> on Oracle, groups by university and filters using <code className="bg-slate-100 px-1 font-bold">HAVING SUM(budget) &ge; 5M</code>.
                  </p>
                </button>

                <button
                  onClick={() => runLabAction('nested')}
                  className="bg-white border border-slate-200 hover:border-blue-500 rounded-xl p-6 text-left transition-all shadow-xs group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-purple-600 uppercase">2. Nested Subquery (3 Tables)</span>
                    <Play className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Researchers in Top 5 Public Universities</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Executes Oracle 3-table nested subquery filtering on <code className="bg-slate-100 px-1 font-bold">WHERE u.university_id IN (SELECT ...)</code>.
                  </p>
                </button>
              </div>

              {loading && <p className="text-xs text-slate-500 italic">Running 3-table query on Oracle 21c XE...</p>}

              {queryOutput && (
                <div className="bg-slate-900 text-slate-100 rounded-xl p-6 shadow-md font-mono text-xs overflow-x-auto space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-emerald-400 font-bold flex items-center gap-2">
                      <Terminal className="w-4 h-4" /> Oracle Result ({queryOutput.type})
                    </span>
                    <button onClick={() => setQueryOutput(null)} className="text-slate-400 hover:text-white text-xs">Clear</button>
                  </div>
                  {queryOutput.sql && (
                    <div className="p-2 bg-slate-800/60 rounded text-[11px] text-slate-400 font-mono">
                      {queryOutput.sql}
                    </div>
                  )}
                  <pre className="text-xs text-slate-300 leading-relaxed">
                    {JSON.stringify(queryOutput.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: LIVE ORACLE SQL*PLUS CONSOLE */}
          {activeTab === 'sql_console' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-purple-600" />
                    <div>
                      <h2 className="font-bold text-slate-900 text-base">Live Oracle SQL*Plus Interactive Query Terminal</h2>
                      <p className="text-xs text-slate-500">
                        Type any Oracle SQL or PL/SQL command to execute live on your local database instance (XEPDB1).
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
                    User: RESEARCHHUB @ localhost:1521/XEPDB1
                  </span>
                </div>

                {/* Quick Templates */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Quick Sample Queries:</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'View 1: Active Projects', sql: 'SELECT * FROM V_ACTIVE_RESEARCH_PROJECTS' },
                      { label: 'View 2: Researcher Stats', sql: 'SELECT * FROM V_RESEARCHER_STATS' },
                      { label: 'View 3: University Summary', sql: 'SELECT * FROM V_UNIVERSITY_SUMMARY' },
                      { label: 'Procedure: Stats for IIT Bombay', sql: 'BEGIN GET_UNIVERSITY_STATS(1); END;' },
                      { label: 'Table: Universities', sql: 'SELECT university_id, university_name, abbreviation, type, ranking FROM UNIVERSITY' },
                      { label: 'Table: Researchers', sql: 'SELECT researcher_id, fname, lname, email, current_position FROM RESEARCHER' },
                      { label: 'Audit Log', sql: 'SELECT * FROM PROJECT_AUDIT_LOG' }
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCustomSql(item.sql)
                          handleExecuteSql(item.sql)
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-purple-100 hover:text-purple-800 text-slate-700 text-xs rounded transition-colors font-mono"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SQL Input Area */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase">SQL Statement / PL-SQL Block:</label>
                  <textarea
                    rows={4}
                    value={customSql}
                    onChange={(e) => setCustomSql(e.target.value)}
                    placeholder="e.g. SELECT * FROM UNIVERSITY WHERE ranking <= 5;"
                    className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-300 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setCustomSql('')}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => handleExecuteSql()}
                      disabled={consoleLoading}
                      className="px-5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      {consoleLoading ? 'Executing on Oracle...' : 'Execute in Oracle SQL*Plus'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Execution Results */}
              {consoleResult && (
                <div className="bg-slate-900 text-slate-100 rounded-xl p-6 shadow-md font-mono text-xs overflow-x-auto space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-purple-400 font-bold flex items-center gap-2">
                      <Terminal className="w-4 h-4" /> Oracle Execution Result ({consoleResult.type || (consoleResult.success ? 'SUCCESS' : 'FAILED')})
                    </span>
                    <button onClick={() => setConsoleResult(null)} className="text-slate-400 hover:text-white text-xs">Clear</button>
                  </div>

                  {consoleResult.error ? (
                    <div className="p-3 bg-red-950/50 border border-red-800 rounded text-red-300">
                      ❌ {consoleResult.error}
                    </div>
                  ) : consoleResult.output ? (
                    <pre className="text-xs text-emerald-300 leading-relaxed">
                      {Array.isArray(consoleResult.output) ? consoleResult.output.join('\n') : consoleResult.output}
                    </pre>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-[11px] text-slate-400">
                        Rows returned: <span className="text-emerald-400 font-bold">{consoleResult.rowCount || consoleResult.data?.length || 0}</span>
                      </div>
                      <pre className="text-xs text-slate-300 leading-relaxed max-h-96 overflow-y-auto">
                        {JSON.stringify(consoleResult.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
