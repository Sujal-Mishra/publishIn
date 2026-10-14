import { NextRequest, NextResponse } from 'next/server'
import { fetchDoiMetadata, cleanDoi, generateFallbackBibtex } from '@/lib/doi'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const rawDoi = searchParams.get('doi')
    const fallbackTitle = searchParams.get('title') || ''
    const fallbackJournal = searchParams.get('journal') || ''
    const fallbackYear = searchParams.get('year') ? Number(searchParams.get('year')) : undefined

    if (!rawDoi) {
      return NextResponse.json({ error: 'DOI query parameter is required' }, { status: 400 })
    }

    const doi = cleanDoi(rawDoi)
    const metadata = await fetchDoiMetadata(doi)

    if (metadata) {
      return NextResponse.json({ success: true, data: metadata })
    }

    // Fallback if DOI is synthetic or not yet indexed in CrossRef
    const generatedBibtex = generateFallbackBibtex({
      title: fallbackTitle || `Publication (${doi})`,
      journalName: fallbackJournal || 'Indexed Academic Journal',
      publicationYear: fallbackYear || new Date().getFullYear(),
      authors: ['ResearchHub Investigator'],
      doi
    })

    return NextResponse.json({
      success: true,
      data: {
        title: fallbackTitle || '',
        journalName: fallbackJournal || '',
        publicationYear: fallbackYear || new Date().getFullYear(),
        authors: ['ResearchHub Investigator'],
        doi,
        url: `https://doi.org/${doi}`,
        bibtex: generatedBibtex,
        isFallback: true
      }
    })
  } catch (error: any) {
    console.error('DOI route error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to resolve DOI metadata' },
      { status: 500 }
    )
  }
}
