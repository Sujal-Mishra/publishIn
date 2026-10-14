export interface DoiMetadata {
  title: string
  journalName: string
  publicationYear: number
  authors: string[]
  doi: string
  url: string
  bibtex: string
}

export function cleanDoi(input: string): string {
  if (!input) return ''
  let cleaned = input.trim()
  cleaned = cleaned.replace(/^https?:\/\/(dx\.)?doi\.org\//i, '')
  cleaned = cleaned.replace(/^\/+|\/+$/g, '')
  return cleaned.trim()
}

export function generateFallbackBibtex(data: {
  title: string
  journalName?: string
  publicationYear?: number
  authors?: string[]
  doi?: string
}): string {
  const firstAuthor =
    data.authors && data.authors.length > 0
      ? data.authors[0].split(' ').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'Author'
      : 'ResearchHub'
  const year = data.publicationYear || new Date().getFullYear()
  const key = `${firstAuthor}_${year}`

  const authorString =
    data.authors && data.authors.length > 0
      ? data.authors.join(' and ')
      : 'Unknown'

  return `@article{${key},
  title = {${data.title || 'Untitled Publication'}},
  author = {${authorString}},
  journal = {${data.journalName || 'Peer Reviewed Publication'}},
  year = {${year}},
  doi = {${data.doi || ''}},
  url = {${data.doi ? `https://doi.org/${data.doi}` : ''}}
}`
}

export async function fetchDoiMetadata(rawDoi: string): Promise<DoiMetadata | null> {
  const doi = cleanDoi(rawDoi)
  if (!doi) return null

  let metadata: Partial<DoiMetadata> = { doi, url: `https://doi.org/${doi}` }

  // 1. Fetch BibTeX via content negotiation
  try {
    const bibtexRes = await fetch(`https://doi.org/${encodeURIComponent(doi)}`, {
      headers: {
        Accept: 'application/x-bibtex',
        'User-Agent': 'ResearchHub/1.0 (mailto:admin@researchhub.ac.in)'
      },
      next: { revalidate: 3600 }
    })
    if (bibtexRes.ok) {
      const bibText = await bibtexRes.text()
      if (bibText && bibText.trim().startsWith('@')) {
        metadata.bibtex = bibText.trim()
      }
    }
  } catch (err) {
    console.warn('Could not fetch remote BibTeX from doi.org:', err)
  }

  // 2. Query CrossRef API for structured metadata
  try {
    const crossRefRes = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, {
      headers: {
        'User-Agent': 'ResearchHub/1.0 (mailto:admin@researchhub.ac.in)'
      },
      next: { revalidate: 3600 }
    })

    if (crossRefRes.ok) {
      const json = await crossRefRes.json()
      const msg = json.message

      const title = Array.isArray(msg?.title) && msg.title.length > 0 ? msg.title[0] : (msg?.title || '')
      const journalName =
        Array.isArray(msg?.['container-title']) && msg['container-title'].length > 0
          ? msg['container-title'][0]
          : msg?.publisher || 'Academic Journal'

      const dateParts =
        msg?.['published-print']?.['date-parts']?.[0] ||
        msg?.['published-online']?.['date-parts']?.[0] ||
        msg?.created?.['date-parts']?.[0]

      const publicationYear = dateParts ? Number(dateParts[0]) : new Date().getFullYear()

      const authors: string[] = []
      if (Array.isArray(msg?.author)) {
        msg.author.forEach((a: any) => {
          if (a.name) {
            authors.push(a.name)
          } else {
            const name = [a.given, a.family].filter(Boolean).join(' ')
            if (name) authors.push(name)
          }
        })
      }

      metadata.title = title
      metadata.journalName = journalName
      metadata.publicationYear = publicationYear
      metadata.authors = authors

      if (!metadata.bibtex) {
        metadata.bibtex = generateFallbackBibtex({
          title,
          journalName,
          publicationYear,
          authors,
          doi
        })
      }

      return metadata as DoiMetadata
    }
  } catch (err) {
    console.error('CrossRef fetch failed:', err)
  }

  if (metadata.bibtex) {
    return {
      title: metadata.title || 'Publication from DOI',
      journalName: metadata.journalName || 'Indexed Journal',
      publicationYear: metadata.publicationYear || new Date().getFullYear(),
      authors: metadata.authors || ['Researcher'],
      doi,
      url: `https://doi.org/${doi}`,
      bibtex: metadata.bibtex
    }
  }

  return null
}
