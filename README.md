# ResearchHub — National Research Collaboration Ecosystem

> A centralized full-stack research management and collaboration platform connecting universities, faculty, students, national funding councils, and industrial R&D partners.

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=flat&logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-Neon_PostgreSQL-336791?style=flat&logo=postgresql)](https://neon.tech/)
[![Oracle Database](https://img.shields.io/badge/Enterprise_DBMS-Oracle_21c_XE-F80000?style=flat&logo=oracle)](https://www.oracle.com/database/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma_6-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript_5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)

---

## 🏛️ System Overview

**ResearchHub** is an academic research ecosystem built to streamline statutory grant tracking, interdisciplinary faculty collaboration, graduate research matching, and scholarly output publication.

### Core Ecosystem Entities
- **Academic Institutions:** Universities (IIT Bombay, IIT Delhi, IISc Bangalore), Departments, and Specialized Research Laboratories.
- **Researchers & Personnel:** Professors, PhD/M.Tech Students, Research Fellows, Deans, and Statutory Grant Officers.
- **Research Projects:** Lifecycle tracking from grant proposal to final repository submission.
- **Funding Councils & Industry:** Statutory bodies (DST, SERB, DRDO, MNRE) and Corporate R&D sponsors (TCS Research, Reliance New Energy).
- **Scholarly Outputs:** Peer-reviewed publications with DOI indexing, granted patents, and open datasets.

---

## 🚀 Key Features & Upgrades

### 1. 📈 National Grant Lifecycle Pipeline
A 5-phase statutory stepper tracking research grants from inception to closure:
- **Proposal Submitted (`Proposed`):** Captures proposal date (`topDate`) and review committee submission.
- **Peer Review (`Under Review`):** Technical and ethics evaluation.
- **Grant Sanctioned (`Sanctioned`):** Formal sanction, `grantNumber` issuance, and budget lock.
- **Active Research (`Active`):** Experimental execution and deliverable milestone tracking.
- **Grant Closed (`Completed`):** Final publications, patents, datasets, and audits archived.

### 2. 💰 Financial Treasury & Milestone Burn-Down Tracker
- **Real-Time Financial KPIs:** Tracks Expended Capital, Active Lab Commitments, and Remaining Liquidity.
- **Visual Analytics:** Interactive Recharts Donut burn-rate visualizer and deliverable tranche bar charts.
- **Real-Time Recalculation:** Completing project milestones recalculates grant utilization rates instantly in the database.

### 3. 📄 Automated DOI Metadata Fetcher & BibTeX Citation Exporter
- **CrossRef API Integration:** Type or paste any DOI (e.g., `10.1038/nature12373`) to autofill paper title, journal, year, and authors in milliseconds.
- **One-Click Citation Engine:** Instant BibTeX generation with syntax highlighting.
- **Multi-Format Previews:** Export citations in BibTeX (for LaTeX/Overleaf/Zotero), APA 7th Edition, and IEEE styles.
- **Direct `.bib` Download:** Download ready-to-use `.bib` citation files directly to your device.

### 4. 🗄️ Enterprise Dual-Database Architecture
- **Neon Cloud PostgreSQL:** Powers the Next.js Prisma ORM data layer with automatic connection pooling and SSL encryption.
- **Oracle Database 21c XE / SQL\*Plus:** Provides direct PL/SQL stored procedure execution, database triggers, views, and an in-app interactive SQL\*Plus terminal console (`/db-analytics`).

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/) + React 19
- **Languages:** TypeScript, SQL, PL/SQL
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Charts:** [Recharts](https://recharts.org/)
- **ORM & Data Layer:** [Prisma ORM](https://www.prisma.io/)
- **Cloud Database:** [Neon PostgreSQL](https://neon.tech/)
- **On-Premises Relational DB:** [Oracle Database 21c XE](https://www.oracle.com/database/technologies/xe-downloads.html) + `node-oracledb`
- **External Scholarly APIs:** [CrossRef REST API](https://www.crossref.org/documentation/retrieve-metadata/rest-api/) & DOI.org Content Negotiation

---

## ⚡ Quick Start

### 1. Clone & Install Dependencies
```powershell
git clone https://github.com/Sujal-Mishra/publishIn.git
cd publishIn
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@YOUR_NEON_HOST/neondb?sslmode=require"
AUTH_SECRET="your-production-secret-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional: Local Oracle XE Connection
ORACLE_USER="researchhub"
ORACLE_PASSWORD="researchhub"
ORACLE_CONNECT_STRING="localhost:1521/XEPDB1"
```

### 3. Synchronize & Seed Database
```powershell
npx prisma db push
npm run prisma:seed
```

### 4. Run Development Server
```powershell
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Login Accounts

All accounts in the seed database are initialized with the password: `password123`

| Role | Email | Password | Access Highlights |
|---|---|---|---|
| **Senior Professor** | `professor@researchhub.demo` | `password123` | Project leadership, grant milestones, publications |
| **Ph.D. Scholar** | `student@researchhub.demo` | `password123` | Research project membership, skill matching |
| **Principal Scientist** | `researcher@researchhub.demo` | `password123` | Interdisciplinary collaboration, lab facilities |
| **University Admin** | `admin@researchhub.demo` | `password123` | Institutional oversight, department metrics |
| **Funding Agency Officer** | `funding@researchhub.demo` | `password123` | Grant sanctions, statutory capital monitoring |
| **Industry R&D Partner** | `industry@researchhub.demo` | `password123` | Corporate sponsorships, joint patents |

---

## 📜 Database Schema (24 Relational Entities)

The database schema strictly adheres to academic relational DBMS standards:
- `University`, `UniversityLocation`, `Department`, `Laboratory`
- `Researcher`, `Professor`, `Student`, `Collaboration`
- `ResearchProject`, `ProjectMember`, `Milestone`
- `FundingAgency`, `Industry`, `IndustryCollaboration`
- `Publication`, `Patent`, `Dataset`
- `Skill`, `ResearchDomain`, `ResearcherSkill`, `ResearcherDomain`, `ProjectSkill`, `ProjectDomain`

---

## 📄 License
This project is licensed under the MIT License.
