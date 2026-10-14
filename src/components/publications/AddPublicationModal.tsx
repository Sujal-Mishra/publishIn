'use client'

import React, { useState } from 'react'
import {
  X,
  Sparkles,
  BookOpen,
  FolderGit2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search
} from 'lucide-react'

interface ProjectOption {
  id: string
  projectTitle: string
}

interface AddPublicationModalProps {
  isOpen: boolean
  onClose: () => void
  projects: ProjectOption[]
  defaultProjectId?: string
  onPublicationAdded?: (newPub: any) => void
}

export function AddPublicationModal({
  isOpen,
  onClose,
  projects,
  defaultProjectId,
  onPublicationAdded
}: AddPublicationModalProps) {
  const [doi, setDoi] = useState('')
  const [title, setTitle] = useState('')
  const [journalName, setJournalName] = useState('')
  const [publicationYear, setPublicationYear] = useState<number>(new Date().getFullYear())
  const [projectId, setProjectId] = useState<string>(defaultProjectId || (projects[0]?.id || ''))
  const [fetchingDoi, setFetchingDoi] = useState(false)
  const [saving, setSaving] = useState(false)
  const [autofilled, setAutofilled] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleFetchDoi = async () => {
    if (!doi.trim()) {
      setError('Please enter a DOI string to fetch metadata.')
      return
    }

    setError(null)
    setFetchingDoi(true)
    setAutofilled(false)

    try {
      const res = await fetch(`/api/doi?doi=${encodeURIComponent(doi.trim())}`)
      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Could not fetch DOI metadata')
      }

      const meta = json.data
      if (meta.title) setTitle(meta.title)
      if (meta.journalName) setJournalName(meta.journalName)
      if (meta.publicationYear) setPublicationYear(meta.publicationYear)
      setAutofilled(true)
    } catch (err: any) {
      console.error(err)
      setError(err?.message || 'Could not resolve DOI. You can still enter fields manually.')
    } finally {
      setFetchingDoi(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Publication title is required.')
      return
    }
    if (!projectId) {
      setError('Please assign this publication to a research project.')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const res = await fetch('/api/publications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          journalName: journalName.trim() || undefined,
          publicationYear: Number(publicationYear),
          doi: doi.trim() || undefined,
          projectId
        })
      })

      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to save publication')
      }

      if (onPublicationAdded) {
        onPublicationAdded(json.data)
      }

      onClose()
    } catch (err: any) {
      setError(err?.message || 'Failed to record publication.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Add Academic Publication</h3>
              <p className="text-[11px] text-slate-500">Auto-fill details instantly using digital object identifier (DOI)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* DOI Input with Autofill Button */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Digital Object Identifier (DOI)</span>
              <span className="text-[10px] text-slate-400 font-normal">Optional for manual entry</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g., 10.1038/nature12373"
                value={doi}
                onChange={(e) => setDoi(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
              />
              <button
                type="button"
                onClick={handleFetchDoi}
                disabled={fetchingDoi || !doi.trim()}
                className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                {fetchingDoi ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Autofill via DOI
                  </>
                )}
              </button>
            </div>
            {autofilled && (
              <p className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium pt-0.5">
                <CheckCircle2 className="w-3 h-3" /> Metadata successfully fetched from CrossRef!
              </p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Publication Title *</label>
            <textarea
              rows={2}
              required
              placeholder="Full title of the paper or proceedings"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Journal and Year Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Journal / Conference</label>
              <input
                type="text"
                placeholder="e.g., Nature, IEEE TIFS, CVPR"
                value={journalName}
                onChange={(e) => setJournalName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Year *</label>
              <input
                type="number"
                required
                min={1950}
                max={2030}
                value={publicationYear}
                onChange={(e) => setPublicationYear(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Project Affiliation */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Associated Research Project *</label>
            <select
              required
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="" disabled>Select a research project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.projectTitle}
                </option>
              ))}
            </select>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving to Neon DB...
                </>
              ) : (
                'Save Publication'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
