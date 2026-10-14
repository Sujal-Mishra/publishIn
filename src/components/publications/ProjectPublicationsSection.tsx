'use client'

import React, { useState } from 'react'
import { BookOpen, Quote, Award, ExternalLink, Plus } from 'lucide-react'
import { CitationModal, CitationPublication } from './CitationModal'
import { AddPublicationModal } from './AddPublicationModal'

interface PublicationItem {
  id: string
  title: string
  journalName?: string | null
  publicationYear: number
  doi?: string | null
}

interface ProjectPublicationsSectionProps {
  projectId: string
  projectTitle: string
  initialPublications: PublicationItem[]
  leadAuthorName?: string
}

export function ProjectPublicationsSection({
  projectId,
  projectTitle,
  initialPublications,
  leadAuthorName
}: ProjectPublicationsSectionProps) {
  const [publications, setPublications] = useState<PublicationItem[]>(initialPublications)
  const [selectedCitation, setSelectedCitation] = useState<CitationPublication | null>(null)
  const [isCitationOpen, setIsCitationOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)

  const openCitation = (pub: PublicationItem) => {
    setSelectedCitation({
      id: pub.id,
      title: pub.title,
      journalName: pub.journalName,
      publicationYear: pub.publicationYear,
      doi: pub.doi,
      authorName: leadAuthorName || 'Principal Investigator'
    })
    setIsCitationOpen(true)
  }

  const handleAdded = (newPub: any) => {
    setPublications([...publications, newPub])
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Peer-Reviewed Publications ({publications.length})
        </h3>
        <button
          onClick={() => setIsAddOpen(true)}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add via DOI
        </button>
      </div>

      {publications.length === 0 ? (
        <p className="text-xs text-slate-400 py-2 italic">
          No publications recorded yet. Add one using its DOI.
        </p>
      ) : (
        <div className="space-y-2">
          {publications.map((pub) => (
            <div
              key={pub.id}
              className="p-3 bg-slate-50 hover:bg-slate-50/80 rounded-lg border border-slate-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-0.5 min-w-0">
                <p className="text-xs font-semibold text-slate-900 leading-snug">{pub.title}</p>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                  <span>{pub.journalName || 'Indexed Journal'}</span>
                  <span>•</span>
                  <span>{pub.publicationYear}</span>
                  {pub.doi && (
                    <>
                      <span>•</span>
                      <a
                        href={`https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-emerald-700 hover:underline flex items-center gap-0.5"
                      >
                        DOI: {pub.doi}
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={() => openCitation(pub)}
                className="px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 rounded-md text-xs font-semibold flex items-center gap-1 transition-all shrink-0 self-start sm:self-auto shadow-2xs"
              >
                <Quote className="w-3 h-3 text-blue-600" />
                Cite
              </button>
            </div>
          ))}
        </div>
      )}

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
        projects={[{ id: projectId, projectTitle }]}
        defaultProjectId={projectId}
        onPublicationAdded={handleAdded}
      />
    </div>
  )
}
