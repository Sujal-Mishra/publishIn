'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { ArrowLeft, FolderPlus, ShieldAlert } from 'lucide-react'
import Link from 'next/link'

export default function CreateProjectPage() {
  const router = useRouter()
  const [professors, setProfessors] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [fundingAgencies, setFundingAgencies] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    projectTitle: '',
    grantNumber: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    budget: '',
    leadProfessorId: '',
    departmentId: '',
    fundingAgencyId: ''
  })

  useEffect(() => {
    async function loadFormData() {
      const res = await fetch('/api/projects/form-options')
      if (res.ok) {
        const data = await res.json()
        setProfessors(data.professors || [])
        setDepartments(data.departments || [])
        setFundingAgencies(data.fundingAgencies || [])
        if (data.professors?.length > 0) {
          setFormData((prev) => ({
            ...prev,
            leadProfessorId: data.professors[0].id,
            departmentId: data.professors[0].departmentId
          }))
        }
      }
    }
    loadFormData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (data.success) {
        router.push(`/projects/${data.project.id}`)
      } else {
        setError(data.error || 'Failed to create project')
      }
    } catch (err) {
      setError('An error occurred while creating project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="p-8 max-w-4xl mx-auto w-full space-y-6">
          <Link href="/projects" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" /> Back to Projects
          </Link>

          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <FolderPlus className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create Research Project</h1>
                <p className="text-xs text-slate-500">Initiate a new research grant or institutional project</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-md mb-6 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Constraint Violation:</span> {error}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.projectTitle}
                    onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                    placeholder="e.g. Federated Edge-AI Systems for Post-Quantum Smart Grids"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Grant Number / Reference ID
                    </label>
                    <input
                      type="text"
                      value={formData.grantNumber}
                      onChange={(e) => setFormData({ ...formData, grantNumber: e.target.value })}
                      placeholder="e.g. DST-CS-2026-089"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Total Grant Budget (INR ₹)
                    </label>
                    <input
                      type="number"
                      step="10000"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="e.g. 18500000"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Lead Investigator (Must be Professor) *
                    </label>
                    <select
                      required
                      value={formData.leadProfessorId}
                      onChange={(e) => {
                        const selectedProf = professors.find((p) => p.id === e.target.value)
                        setFormData({
                          ...formData,
                          leadProfessorId: e.target.value,
                          departmentId: selectedProf?.departmentId || formData.departmentId
                        })
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {professors.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.fname} {p.lname} ({p.department?.university?.abbreviation || 'Prof'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Host Department *
                    </label>
                    <select
                      required
                      value={formData.departmentId}
                      onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.university.abbreviation} — {d.departmentName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Funding Agency
                    </label>
                    <select
                      value={formData.fundingAgencyId}
                      onChange={(e) => setFormData({ ...formData, fundingAgencyId: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">None / Internal University Grant</option>
                      {fundingAgencies.map((fa) => (
                        <option key={fa.id} value={fa.id}>
                          {fa.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <Link href="/projects" className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900">
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs"
                >
                  {loading ? 'Creating Project...' : 'Save & Publish Project'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
