# Automated DOI Metadata Fetcher & BibTeX Citation Exporter

## Goal
Enable automatic publication metadata extraction via DOI (using CrossRef API) and one-click BibTeX citation generation and download for students and researchers across ResearchHub.

## Tasks
- [x] Task 1: Verify CrossRef API and DOI content-negotiation endpoints -> Verify: curl/fetch tests return title, container, and BibTeX
- [x] Task 2: Create DOI resolution backend service & API route (`src/app/api/doi/route.ts`) -> Verify: GET /api/doi?doi=... returns structured metadata & bibtex string
- [x] Task 3: Create BibTeX Citation modal & Copy/Download component (`src/components/publications/CitationModal.tsx`) -> Verify: Modal displays formatted BibTeX with "Copy to Clipboard" and "Download .bib"
- [x] Task 4: Create DOI Autofill Publication modal (`src/components/publications/AddPublicationModal.tsx`) -> Verify: Typing DOI automatically fills title, journal, and year
- [x] Task 5: Integrate Citation Export and Add Publication into Publications Page (`src/app/publications/page.tsx`) -> Verify: "Cite" button exists on each publication card; "Add Publication" button in header
- [x] Task 6: Add Citation Export button to Project Details Publications Section (`src/app/projects/[id]/page.tsx`) -> Verify: Publications in project view can be cited directly
- [x] Task 7: End-to-end verification -> Verify: `npx tsc --noEmit` passes with 0 errors

## Done When
- Researchers can add publications by pasting a DOI with automatic field completion.
- Students can copy or download BibTeX citations directly with a single click.
- Zero schema changes required (extends `Publication.doi` directly).
