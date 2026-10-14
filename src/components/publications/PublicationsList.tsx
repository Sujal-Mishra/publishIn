'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  ExternalLink,
  Award,
  Search,
  Plus,
  Quote,
  Sparkles,
  FileText
} from 'lucide-react'
import { CitationModal, CitationPublication } from './CitationModal'
import { AddPublicationModal } from './AddPublicationModal'

interface PublicationItem {
  id: string
  title: string
  journalName?: string | null
  publicationYear: number
  doi?: string | null
  project: {
    id: string
    projectTitle: string
    leadProfessor: {
      id: string
      fname: string
      lname: string
    }
    department: {
      university: {
        abbreviation: string
      }
    }
  }
}

interface PublicationsListProps {
  initialPublications: PublicationItem[]
  projects: Array<{ id: string; projectTitle: string }>
}

export function PublicationsList({
  initialPublications,
  projects
}: PublicationsListProps) {
  const [publications, setPublications] = useState<PublicationItem[]>(initialPublications)
  const [search, setSearch] = useState('')
  const [selectedCitation, setSelectedCitation] = useState<CitationPublication | null>(null)
  const [isCitationOpen, setIsCitationOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)

  const filteredPublications = publications.filter((pub) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      pub.title.toLowerCase().includes(q) ||
      (pub.journalName && pub.journalName.toLowerCase().includes(q)) ||
      (pub.doi && pub.doi.toLowerCase().includes(q)) ||
      pub.project.projectTitle.toLowerCase().includes(q)
    )
  })

  const openCitation = (pub: PublicationItem) => {
    setSelectedCitation({
      id: pub.id,
      title: pub.title,
      journalName: pub.journalName,
      publicationYear: pub.publicationYear,
      doi: pub.doi,
      authorName: `${pub.project.leadProfessor.fname} ${pub.project.leadProfessor.lname}`
    })
    setIsCitationOpen(true)
  }

  const handlePublicationAdded = (newPub: any) => {
    setPublications([newPub, ...publications])
  }

  return (
    <div className="space-y-6">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search publications by title, journal, DOI..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs"
          />
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Publication via DOI
        </button>
      </div>

      {/* Publications Listing */}
      <div className="space-y-4">
        {filteredPublications.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-xl space-y-2">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-sm font-semibold text-slate-700">No publications found</h4>
            <p className="text-xs text-slate-400">
              Try adjusting your search terms or add a new publication using its DOI.
            </p>
          </div>
        ) : (
          filteredPublications.map((pub) => (
            <div
              key={pub.id}
              className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-xs hover:border-slate-300 transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-md">
                    {pub.publicationYear}
                  </span>
                  <span className="text-xs font-medium text-slate-600">
                    {pub.journalName || 'Peer Reviewed Publication'}
                  </span>
                </div>

                {/* Cite Action Button */}
                <button
                  onClick={() => openCitation(pub)}
                  className="px-3 py-1 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-auto"
                >
                  <Quote className="w-3.5 h-3.5 text-blue-600" />
                  Cite / BibTeX
                </button>
              </div>

              <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-blue-600 transition-colors">
                {pub.title}
              </h3>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1 border-t border-slate-50">
                <div>
                  Research Project:{' '}
                  <Link
                    href={`/projects/${pub.project.id}`}
                    className="font-semibold text-slate-800 hover:text-blue-600 underline"
                  >
                    {pub.project.projectTitle}
                  </Link>
                </div>

                <div>
                  Lead PI:{' '}
                  <span className="font-medium text-slate-700">
                    {pub.project.leadProfessor.fname} {pub.project.leadProfessor.lname} (
                    {pub.project.department.university.abbreviation})
                  </span>
                </div>

                {pub.doi && (
                  <div className="flex items-center gap-1 font-mono text-[11px] text-emerald-700 font-medium">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    <a
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-0.5"
                    >
                      DOI: {pub.doi}
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Citation Modal */}
      <CitationModal
        isOpen={isCitationOpen}
        onClose={() => setIsCitationOpen(false)}
        publication={selectedCitation}
      />

      {/* Add Publication Modal */}
      <AddPublicationModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        projects={projects}
        onPublicationAdded={handlePublicationAdded}
      />
    </div>
  )
}
