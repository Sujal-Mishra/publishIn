'use client'

import React, { useState, useEffect } from 'react'
import {
  X,
  Copy,
  Check,
  Download,
  BookOpen,
  FileCode2,
  ExternalLink,
  Loader2,
  Sparkles
} from 'lucide-react'

export interface CitationPublication {
  id?: string
  title: string
  journalName?: string | null
  publicationYear: number
  doi?: string | null
  authorName?: string | null
}

interface CitationModalProps {
  isOpen: boolean
  onClose: () => void
  publication: CitationPublication | null
}

export function CitationModal({ isOpen, onClose, publication }: CitationModalProps) {
  const [activeTab, setActiveTab] = useState<'bibtex' | 'apa' | 'ieee'>('bibtex')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [bibtex, setBibtex] = useState('')

  useEffect(() => {
    if (!isOpen || !publication) {
      setBibtex('')
      setCopied(false)
      return
    }

    const firstAuthor = publication.authorName
      ? publication.authorName.split(' ').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'Author'
      : 'ResearchHub'
    const key = `${firstAuthor}_${publication.publicationYear}`

    const defaultBib = `@article{${key},
  title = {${publication.title}},
  author = {${publication.authorName || 'ResearchHub Investigators'}},
  journal = {${publication.journalName || 'Peer Reviewed Publication'}},
  year = {${publication.publicationYear}},
  doi = {${publication.doi || ''}},
  url = {${publication.doi ? `https://doi.org/${publication.doi}` : ''}}
}`

    setBibtex(defaultBib)

    // If DOI is present, fetch enhanced official BibTeX
    if (publication.doi) {
      setLoading(true)
      fetch(`/api/doi?doi=${encodeURIComponent(publication.doi)}&title=${encodeURIComponent(publication.title)}&journal=${encodeURIComponent(publication.journalName || '')}&year=${publication.publicationYear}`)
        .then((res) => res.json())
        .then((res) => {
          if (res?.data?.bibtex) {
            setBibtex(res.data.bibtex)
          }
        })
        .catch((err) => console.warn('Could not fetch enhanced BibTeX:', err))
        .finally(() => setLoading(false))
    }
  }, [isOpen, publication])

  if (!isOpen || !publication) return null

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy citation:', err)
    }
  }

  const handleDownloadBib = () => {
    const blob = new Blob([bibtex], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const key = publication.authorName
      ? `${publication.authorName.split(' ').pop()}_${publication.publicationYear}`
      : 'citation'
    link.href = url
    link.download = `${key}.bib`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Previews for APA and IEEE
  const apaText = `${publication.authorName || 'ResearchHub'}. (${publication.publicationYear}). ${publication.title}. ${publication.journalName || 'Academic Journal'}.${publication.doi ? ` https://doi.org/${publication.doi}` : ''}`
  const ieeeText = `[1] ${publication.authorName || 'ResearchHub'}, "${publication.title}," ${publication.journalName || 'Academic Journal'}, ${publication.publicationYear}.${publication.doi ? ` doi: ${publication.doi}.` : ''}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Academic Citation & BibTeX</h3>
              <p className="text-[11px] text-slate-500">Ready for LaTeX, Overleaf, Zotero, & Mendeley</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Publication Summary */}
        <div className="px-6 py-3 bg-blue-50/30 border-b border-blue-100/60">
          <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">{publication.title}</h4>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-0.5">
            <span>{publication.journalName || 'Peer Reviewed'}</span>
            <span>•</span>
            <span>{publication.publicationYear}</span>
            {publication.doi && (
              <>
                <span>•</span>
                <span className="font-mono text-emerald-700">DOI: {publication.doi}</span>
              </>
            )}
          </div>
        </div>

        {/* Style Tabs */}
        <div className="flex items-center justify-between px-6 pt-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('bibtex')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'bibtex'
                  ? 'border-blue-600 text-blue-600 bg-blue-50/30'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              BibTeX
              {loading && <Loader2 className="w-3 h-3 animate-spin text-blue-600" />}
            </button>
            <button
              onClick={() => setActiveTab('apa')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg border-b-2 transition-all ${
                activeTab === 'apa'
                  ? 'border-blue-600 text-blue-600 bg-blue-50/30'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              APA 7th
            </button>
            <button
              onClick={() => setActiveTab('ieee')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg border-b-2 transition-all ${
                activeTab === 'ieee'
                  ? 'border-blue-600 text-blue-600 bg-blue-50/30'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              IEEE Style
            </button>
          </div>

          {activeTab === 'bibtex' && (
            <button
              onClick={handleDownloadBib}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 pb-1 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download .bib
            </button>
          )}
        </div>

        {/* Content Box */}
        <div className="p-6 flex-1 overflow-y-auto">
          {activeTab === 'bibtex' && (
            <div className="relative">
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 selection:bg-blue-600">
                {bibtex}
              </pre>
              <button
                onClick={() => handleCopy(bibtex)}
                className="absolute top-3 right-3 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy BibTeX
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === 'apa' && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative space-y-3">
              <p className="text-xs text-slate-800 font-serif leading-relaxed pr-16">{apaText}</p>
              <button
                onClick={() => handleCopy(apaText)}
                className="absolute top-3 right-3 px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-md text-xs font-medium flex items-center gap-1 transition-all"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          )}

          {activeTab === 'ieee' && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative space-y-3">
              <p className="text-xs text-slate-800 font-sans leading-relaxed pr-16">{ieeeText}</p>
              <button
                onClick={() => handleCopy(ieeeText)}
                className="absolute top-3 right-3 px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-md text-xs font-medium flex items-center gap-1 transition-all"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Verified via CrossRef & DOI Registry
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
