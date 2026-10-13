# ResearchHub — National Research Collaboration Ecosystem
## Full-Stack Implementation Prompt

You are building a complete full-stack web application called:

**ResearchHub**
### National Research Collaboration Ecosystem

ResearchHub is a centralized research collaboration and management platform connecting:

- Students
- Professors
- Researchers
- Universities
- Departments
- Laboratories
- Research Projects
- Funding Agencies
- Industries
- Publications
- Patents
- Datasets
- Research Milestones
- Research Skills / Domains

The goal is to create a simple, modern, extremely user-friendly research ecosystem.

IMPORTANT:
This is a database-driven academic project.

The uploaded ER diagram is the APPROVED DATABASE SCHEMA.

DO NOT redesign, simplify, remove, rename, or arbitrarily modify the approved schema.

The ER diagram should be treated as the source of truth for the database entities and relationships.

If a UI decision conflicts with the database schema, preserve the database schema and adapt the UI around it.

---

# 1. CORE DESIGN PHILOSOPHY

The application must be:

- Minimal
- Clean
- Professional
- Extremely easy to navigate
- Lightweight
- Fast
- Responsive
- Academic but modern
- Not visually overloaded
- Not a social-media clone
- Not a heavy enterprise dashboard

Avoid:

- Excessive gradients
- Giant hero sections
- Excessive animations
- Glassmorphism everywhere
- Huge cards
- Too many charts
- Excessive shadows
- Neon colors
- Complex navigation
- Unnecessary UI elements

The interface should feel like:

"Google Scholar meets a modern university research portal"

rather than:

"LinkedIn + Jira + Bloomberg terminal"

The user should understand what to do within a few seconds of entering the application.

---

# 2. TECHNOLOGY STACK

Use:

Frontend:
- Next.js
- TypeScript
- React
- Tailwind CSS
- shadcn/ui
- Lucide icons

Backend:
- Next.js server actions / API routes
- TypeScript

Database:
- MySQL

ORM:
- Prisma ORM

Authentication:
- Auth.js / NextAuth
- Role-based authentication

Validation:
- Zod

Forms:
- React Hook Form

Charts:
- Recharts only where useful

Package manager:
- npm

Use a clean, modular architecture.

---

# 3. DATABASE

Connect the application to MySQL using Prisma ORM.

Create:

.env

with:

DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/researchhub"

Do NOT hardcode database credentials anywhere.

Create:

prisma/schema.prisma

The Prisma schema must faithfully represent the uploaded approved ER diagram.

Generate the Prisma client.

Use migrations.

Provide:

- prisma/schema.prisma
- migration setup
- seed script
- database setup instructions
- sample seed data

---

# 4. APPROVED DATABASE ENTITIES

The uploaded ER diagram contains the following major entities.

Preserve these entities and their relationships.

## UNIVERSITY

Attributes include:

- University_Name
- Abbreviation
- Name
- Established_Year
- Type
- Website
- Phone
- Email
- Ranking
- Locations

Locations is a multivalued attribute in the ER diagram.

Model it appropriately in the relational database while preserving the meaning of the approved schema.

University has departments.

Relationship:

UNIVERSITY
1 ---- N
HAS_DEPT
DEPARTMENT

---

# 5. DEPARTMENT

Attributes:

- Department_Name
- HOD
- Office

Relationship:

University has multiple departments.

Department is associated with researchers.

---

# 6. RESEARCHER

Attributes include:

- Fname
- Minit
- Lname
- Email
- Contact
- Address
- Gender
- DOB
- Citizenship
- Current_Position
- Highest_Degree
- ORCID
- Biography

Researchers participate in collaborations.

Researchers may be students or professors through the ISA relationship.

Researchers possess skills.

Researchers can participate in research projects.

---

# 7. STUDENT

Student is a specialization of RESEARCHER.

Attributes include:

- Program
- Year_of_Study
- CGPA

Students can be managed by professors.

Relationship:

MANAGED_BY_PROF

Students should be able to:

- Discover projects
- Discover professors
- Discover researchers
- Search skills
- Search research domains
- View laboratories
- Join/apply to projects
- View project milestones
- View publications
- View patents
- View datasets

---

# 8. PROFESSOR

Professor is a specialization of RESEARCHER.

Attributes include:

- Designation
- Experience

Professors can:

- Create research projects
- Lead projects
- Manage students
- Define required skills
- Track milestones
- View collaborators
- View project publications
- View project patents
- View datasets
- Submit funding proposals

---

# 9. RESEARCH PROJECT

Attributes include:

- Project_Title
- Grant_Number
- Top_Date
- Funding_Agency
- Start_Number
- End_Date
- Budget
- Project_Status

A research project can:

- Be led by a professor
- Receive funding
- Have grants
- Have researchers/students associated with it
- Have milestones
- Produce publications
- Produce patents
- Collect datasets

Project status should be represented clearly in the UI.

Example statuses:

- Proposed
- Active
- Completed
- On Hold
- Cancelled

Do not invent database fields if the approved schema does not contain them. If status values are required, implement them as controlled values.

---

# 10. FUNDING AGENCY

Attributes:

- Agency_ID
- Name
- Website
- Email

Funding agencies can fund projects.

Relationship:

FUNDS

A funding agency may fund multiple projects.

---

# 11. INDUSTRY

The ER diagram contains INDUSTRY.

Industries should be represented as external research partners.

They can:

- Collaborate with researchers
- Participate in research projects
- Sponsor research
- Explore research expertise
- View suitable research partners

---

# 12. LABORATORY

Attributes include:

- Lab_ID
- Name

Laboratories can:

- Belong to research ecosystems
- Be associated with projects
- Provide research infrastructure
- Be connected with milestones/resources

Create a clean laboratory discovery interface.

---

# 13. PUBLICATION

Attributes include:

- Publication_ID
- Title

Publications are associated with research projects through:

PUBLISHES

The UI should support:

- Publication listing
- Publication details
- Project association
- Researchers/authors where supported by the approved schema

---

# 14. PATENT

Attributes include:

- Title
- DOI

Patents are associated with research projects through:

YIELDS

Provide a clean patent listing and detail view.

---

# 15. DATASET

Attributes include:

- Title
- Name
- Location

Datasets are associated with research projects through:

COLLECTS

Provide dataset discovery.

---

# 16. MILESTONE

The ER diagram contains:

MILESTONE

and:

HAS_MILESTONE

associated with research projects/laboratories according to the approved relationships.

Build milestone tracking without turning it into a huge project-management application.

Use a simple timeline/list interface.

Example:

✓ Literature Review
✓ Data Collection
→ Model Development
○ Publication Submission

Keep this visually minimal.

---

# 17. SKILL

Skills are associated with researchers and research domains.

Researchers should be discoverable based on:

- Skill
- Research domain
- Experience
- Current position
- Institution

Create a simple search/filter mechanism.

---

# 18. RESEARCH DOMAIN

Use research domains to categorize research expertise.

Examples for seed data:

- Artificial Intelligence
- Machine Learning
- Computer Vision
- Cybersecurity
- Blockchain
- Robotics
- Biotechnology
- Renewable Energy
- Materials Science
- Quantum Computing

These are only seed examples.

---

# 19. COLLABORATION

The ER diagram contains a collaboration relationship between researchers.

Important attributes include:

- Collaboration_Type
- Since_Date

Collaboration is a recursive researcher-to-researcher relationship.

Support:

Researcher A
        ↓
Collaborates with
        ↓
Researcher B

The UI should show:

"Collaborators"

on researcher profiles.

Example:

Collaborators
- Dr. A — AI
- Dr. B — Robotics
- Dr. C — Computer Vision

Do not make this look like a social media friend system.

---

# 20. RESEARCHER AUTHENTICATION

Implement authentication.

Users should be able to:

- Register
- Login
- Logout
- View profile
- Edit profile

Roles:

- STUDENT
- PROFESSOR
- RESEARCHER
- UNIVERSITY_ADMIN
- FUNDING_AGENCY
- INDUSTRY

Role-based access control must determine what users can create/edit/manage.

Do not allow unauthorized users to modify records.

---

# 21. AUTHORIZATION

Examples:

STUDENT:
- View researchers
- Search projects
- Search labs
- Apply/request participation where applicable
- View publications
- View patents
- View datasets
- View profile

PROFESSOR:
- Create projects
- Edit projects they own
- Manage project milestones
- Manage student/project participation
- View collaborators
- Manage research profile

RESEARCHER:
- Manage own profile
- Discover collaborators
- View projects
- Participate in collaborations

UNIVERSITY_ADMIN:
- Manage university
- Manage departments
- Manage laboratories
- View research statistics

FUNDING_AGENCY:
- Manage grants/funding
- View funded projects
- Monitor outcomes

INDUSTRY:
- Discover researchers
- Discover projects
- Establish collaborations where supported

Enforce authorization on the SERVER, not just the frontend.

---

# 22. APPLICATION STRUCTURE

Create the following major pages.

## PUBLIC PAGES

/

Landing page

/login

/register

/researchers

/researchers/[id]

/projects

/projects/[id]

/universities

/universities/[id]

/departments/[id]

/laboratories

/laboratories/[id]

/publications

/publications/[id]

/patents

/patents/[id]

/datasets

/datasets/[id]

/funding-agencies

/funding-agencies/[id]

---

# 23. LANDING PAGE

Keep it extremely minimal.

Hero:

ResearchHub

"Connect research. Share knowledge. Accelerate innovation."

Short description:

A unified ecosystem connecting researchers, universities, laboratories, industries and funding agencies.

Primary CTA:

Explore Research

Secondary CTA:

Join ResearchHub

Below hero, show only a few sections:

1. Discover Researchers
2. Explore Projects
3. Find Research Infrastructure
4. Connect Academia & Industry

Then a simple statistics section:

Researchers
Universities
Projects
Laboratories

Use real database counts if available.

Do NOT create a giant marketing website.

---

# 24. MAIN DASHBOARD

After login, show a simple dashboard.

Sidebar:

ResearchHub logo

- Dashboard
- Discover
- Projects
- Researchers
- Laboratories
- Publications
- Patents
- Datasets
- Funding
- Collaborations

Bottom:

- Profile
- Settings
- Logout

The sidebar should be compact.

On mobile, convert it into a clean mobile navigation/drawer.

---

# 25. DASHBOARD CONTENT

Use a clean layout.

Top:

Good morning, [Name]

"What would you like to explore?"

Search bar:

Search researchers, projects, skills, universities...

Below:

Small statistics cards.

Example:

Active Projects
12

Collaborators
8

Publications
21

Research Domains
4

Then:

Recommended Research

Show 3–5 clean cards.

Then:

Recent Activity

Keep this lightweight.

---

# 26. GLOBAL SEARCH

One of the most important features.

Create a global search bar.

Users can search:

- Researchers
- Universities
- Departments
- Projects
- Skills
- Laboratories
- Publications
- Patents
- Datasets

Search should provide categorized results.

Example:

SEARCH

"machine learning"

Researchers
12 results

Projects
8 results

Publications
24 results

Labs
3 results

Use database queries through Prisma.

Implement pagination.

Avoid fetching the entire database into the browser.

---

# 27. RESEARCHER DISCOVERY

Create:

/researchers

Layout:

Search bar

Filters:

- Research domain
- Skill
- University
- Department
- Current position
- Highest degree

Researcher cards should be very simple.

Example:

Dr. Rahul Sharma
Professor · Computer Science
Indian Institute of Technology

AI · Machine Learning · Computer Vision

12 Publications
4 Projects
8 Collaborators

[View Profile]

Do not use huge profile cards.

---

# 28. RESEARCHER PROFILE

Create a clean academic profile.

Header:

Name
Current Position
University
Department

Buttons:

Collaborate
View Projects

Sections:

About

Research Interests

Skills

Projects

Publications

Patents

Collaborators

Keep information hierarchy clear.

---

# 29. PROJECT DISCOVERY

Create:

/projects

Search and filters:

- Research domain
- University
- Status
- Funding agency
- Date
- Required skills

Project card:

Project Title

Professor / Lead Researcher

University

Research domain

Status

Start date

End date

[View Project]

---

# 30. PROJECT DETAILS

Project detail page should show:

Project title

Status badge

Lead professor

University

Department

Description

Research domains

Required skills

Researchers

Students

Funding

Budget

Milestones

Publications

Patents

Datasets

Collaborators

Use tabs if necessary.

Do not put everything into one massive page.

---

# 31. PROFESSOR PROJECT CREATION

Professors should have:

Create Project

Form fields should correspond to the database schema.

Use:

React Hook Form
+
Zod validation

Provide:

- Project title
- Grant number
- Start date
- End date
- Budget
- Funding agency
- Status
- Required skills
- Research domain

Validate:

- Required fields
- Dates
- Budget
- Relationships

After creation, redirect to project details.

---

# 32. LABORATORY DISCOVERY

Create:

/laboratories

Show:

Lab name
Institution
Associated projects
Research domains

Search:

"robotics"

should find relevant laboratories.

Use a simple card/list layout.

---

# 33. PUBLICATIONS

Create:

/publications

Minimal table/list.

Columns:

Title
Project
Authors
Year

Add search.

Do not create fake citation metrics unless they exist in the database.

---

# 34. PATENTS

Create:

/patents

Minimal list.

Display:

Patent title
DOI
Associated project

---

# 35. DATASETS

Create:

/datasets

Display:

Dataset name
Title
Location
Associated project

Add search/filter.

---

# 36. FUNDING

Create:

/funding

Funding agencies

Show:

Agency
Website
Email
Projects funded

For authorized funding-agency users:

Create funding/grant records according to the approved schema.

---

# 37. COLLABORATION UI

On researcher profiles:

Collaborators

Show:

Name
Institution
Research domain
Collaboration type
Since date

Add:

"Find Collaborators"

button.

This should lead to researcher discovery with relevant filters.

---

# 38. UNIVERSITY PAGE

University page:

University Name

Abbreviation

Type

Ranking

Established Year

Website

Email

Phone

Locations

Departments

Researchers

Projects

Laboratories

Use tabs or sections.

Example:

Overview | Departments | Researchers | Projects | Labs

---

# 39. DEPARTMENT PAGE

Show:

Department Name

HOD

Office

University

Researchers

Professors

Students

Projects

---

# 40. ADMIN DASHBOARD

University administrators should get a slightly different dashboard.

Show:

Researchers
Projects
Departments
Laboratories

Research activity

Project distribution

Publications

Patents

Keep charts minimal.

Use Recharts only when a visualization adds real value.

Example:

Projects by Research Domain

A simple bar chart.

Publications over time

A simple line chart.

No dashboard-wall-of-charts nonsense.

---

# 41. DATABASE INTEGRITY

Use proper relational constraints.

Implement:

- Primary keys
- Foreign keys
- Unique constraints
- NOT NULL where appropriate
- Appropriate indexes
- Cascading rules where logically appropriate
- Referential integrity

Do NOT blindly use CASCADE everywhere.

Think about research records and historical data before deleting them.

---

# 42. INDEXING

Create indexes for frequently searched fields.

Examples:

Researcher:
- Email
- ORCID
- Current_Position

Project:
- Project_Title
- Project_Status
- Start date
- End date

University:
- University_Name
- Abbreviation

Publication:
- Publication_ID
- Title

Patent:
- DOI
- Title

Dataset:
- Name
- Title

Department:
- Department_Name

Use composite indexes where appropriate after analyzing query patterns.

---

# 43. ORM REQUIREMENTS

Use Prisma.

Do NOT write raw SQL for normal CRUD operations.

Raw SQL may only be used if Prisma cannot efficiently express a legitimate query.

Use:

- Prisma models
- Prisma relations
- Prisma transactions
- Prisma pagination
- Prisma filtering

Avoid N+1 queries.

Use proper includes/selects.

Only retrieve fields required by each page.

---

# 44. API / SERVER ARCHITECTURE

Create a clean service architecture.

Example:

src/
  app/
  components/
  lib/
  services/
  actions/
  hooks/
  types/

Database:

src/lib/prisma.ts

Services:

src/services/researcher.service.ts
src/services/project.service.ts
src/services/university.service.ts
src/services/publication.service.ts
src/services/laboratory.service.ts
src/services/funding.service.ts

Keep database logic out of UI components.

---

# 45. UI COMPONENTS

Create reusable components:

Button
Input
Select
Modal
Dialog
Dropdown
Badge
Card
Table
Tabs
Pagination
SearchBar
FilterPanel
EmptyState
LoadingState
ErrorState
Avatar
StatCard

Avoid duplicating UI code.

---

# 46. DESIGN SYSTEM

Use a restrained visual language.

Background:

Very light neutral.

Primary text:

Dark neutral.

Secondary text:

Muted gray.

Accent:

One professional academic blue/indigo accent.

Use color sparingly.

Typography:

Modern sans-serif.

Headings should be strong but not enormous.

Body text should be highly readable.

Borders should be subtle.

Cards should have light borders rather than dramatic shadows.

Border radius:

Moderate.

Do not make every element pill-shaped.

---

# 47. RESPONSIVENESS

The application must work on:

- Desktop
- Laptop
- Tablet
- Mobile

Desktop:

Sidebar + content.

Mobile:

Top bar + drawer/bottom navigation.

Tables should become responsive cards where necessary.

Forms should work comfortably on mobile.

---

# 48. UX PRINCIPLES

Every page must have:

- Clear page title
- Clear primary action
- Search where relevant
- Empty state
- Loading state
- Error state

Example empty state:

"No research projects found."

"Try changing your filters or search terms."

Do not leave blank white screens.

---

# 49. LOADING

Use skeleton loaders.

Avoid excessive spinners.

For data-heavy pages, load data progressively.

---

# 50. ERROR HANDLING

Create friendly error messages.

Never show raw database errors to users.

Bad:

PrismaClientKnownRequestError...

Good:

"Unable to load this project. Please try again."

Log technical details server-side.

---

# 51. SECURITY

Implement:

- Password hashing
- Secure authentication
- Server-side authorization
- Input validation
- SQL injection protection through Prisma
- CSRF protection where applicable
- Secure environment variables
- No secrets in frontend
- No database credentials in client code

Never trust role information coming from the browser.

---

# 52. SEED DATABASE

Create realistic seed data.

Seed:

5–10 universities

Each university:
- departments
- researchers
- students
- professors
- laboratories

Create:

15–30 researchers

10+ projects

Multiple research domains

Multiple skills

Several publications

Several patents

Several datasets

Multiple funding agencies

Several industries

Multiple collaborations

Several milestones

Make the relationships realistic.

Do not create random disconnected records.

---

# 53. DEMO ACCOUNTS

Create demo users.

Example:

student@researchhub.demo
professor@researchhub.demo
researcher@researchhub.demo
admin@researchhub.demo
industry@researchhub.demo
funding@researchhub.demo

Use a clearly documented development password.

Do NOT use these credentials in production.

---

# 54. PERFORMANCE

The application should feel fast.

Requirements:

- Server-side data fetching where appropriate
- Pagination
- Database indexes
- Lazy loading
- Avoid unnecessary client components
- Avoid fetching large datasets
- Avoid unnecessary re-renders
- Use caching where appropriate

Do not make the entire application a client-side React application.

Prefer server components where appropriate.

---

# 55. ACCESSIBILITY

Follow good accessibility practices.

Use:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Proper labels
- ARIA attributes when necessary
- Accessible contrast
- Screen-reader friendly forms

Do not rely only on color to communicate state.

---

# 56. MOBILE UX

On mobile:

The researcher profile should remain easy to scan.

The project page should stack sections vertically.

Filters should open inside a drawer.

Search should remain easily accessible.

Do not simply shrink desktop UI.

Actually adapt the layout.

---

# 57. ANIMATIONS

Keep animations extremely subtle.

Use animation only for:

- Page transitions
- Dropdowns
- Dialogs
- Hover states
- Loading states

Avoid:

- Parallax
- Huge entrance animations
- Constant moving elements
- Excessive Framer Motion

The product should feel calm and professional.

---

# 58. DASHBOARD NAVIGATION

Sidebar structure:

RESEARCH

Dashboard
Discover
Researchers
Projects
Universities
Laboratories

KNOWLEDGE

Publications
Patents
Datasets

FUNDING

Funding Agencies

NETWORK

Collaborations

ACCOUNT

Profile
Settings

Logout

Only show options relevant to the user's role.

---

# 59. DISCOVER PAGE

Create one central:

/discover

page.

This can act as the main research discovery engine.

At the top:

"What are you looking for?"

Search input.

Below:

Quick filters:

Researchers
Projects
Labs
Publications
Universities
Datasets

Then categorized results.

This should become one of the strongest parts of the product.

---

# 60. NO OVERENGINEERING

IMPORTANT.

Do not implement features that are not required.

Do NOT add:

- Chat system
- Social feed
- Likes
- Followers
- Stories
- Messaging
- Notifications center
- Complex recommendation AI
- AI chatbot
- Video calls
- Payment system

unless explicitly requested later.

The project is primarily:

RESEARCH DISCOVERY
+
RESEARCH MANAGEMENT
+
COLLABORATION
+
DATABASE MANAGEMENT

Keep the scope disciplined.

---

# 61. DATABASE MANAGEMENT FEATURES

Because this is also an academic DBMS project, expose meaningful database functionality through the application.

Implement examples of:

## Views

Create useful database views where appropriate.

Examples:

- Active research projects
- Researchers with their project counts
- University research statistics
- Funding summary
- Publication/project summary

Expose some of these through admin analytics.

---

# 62. STORED PROCEDURES

Where appropriate, implement a small number of meaningful stored procedures.

Examples:

- Get university research statistics
- Get project funding summary
- Get researcher project summary

Do not create stored procedures just for the sake of having them.

---

# 63. TRIGGERS

Implement meaningful triggers where appropriate.

Examples:

- Maintain audit/history information
- Validate important state changes
- Maintain derived counts if genuinely required

Do not use triggers where application-level logic is cleaner.

Document every trigger.

---

# 64. NORMALIZATION

Preserve normalized relational design.

Avoid:

- Repeating groups
- Storing comma-separated IDs
- Storing arrays in random text columns
- Duplicating researcher information across projects
- Duplicating university information

Respect the approved ER model.

---

# 65. AUDITABILITY

For important modifications, consider maintaining created/updated timestamps.

Where the approved schema permits it, use:

createdAt
updatedAt

Do not alter core approved entities unnecessarily.

If adding technical metadata is required for implementation, clearly document it as an implementation-level addition.

---

# 66. FILE STRUCTURE

Use something similar to:

researchhub/
│
├── app/
│   ├── page.tsx
│   ├── login/
│   ├── register/
│   ├── dashboard/
│   ├── researchers/
│   ├── projects/
│   ├── universities/
│   ├── departments/
│   ├── laboratories/
│   ├── publications/
│   ├── patents/
│   ├── datasets/
│   ├── funding/
│   └── discover/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── researcher/
│   ├── project/
│   ├── university/
│   └── discovery/
│
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── validations/
│   └── utils.ts
│
├── services/
│   ├── researcher.service.ts
│   ├── project.service.ts
│   ├── university.service.ts
│   ├── laboratory.service.ts
│   └── publication.service.ts
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── public/
│
├── .env.example
│
└── README.md

Adapt this structure if Next.js conventions require it.

---

# 67. README

Create a detailed README explaining:

1. Project overview
2. Tech stack
3. Requirements
4. MySQL setup
5. Environment variables
6. Prisma setup
7. Migration commands
8. Seed commands
9. Development commands
10. Demo accounts
11. Database architecture
12. Authentication
13. Role permissions
14. API architecture
15. Important design decisions

Include commands such as:

npm install

npx prisma generate

npx prisma migrate dev

npx prisma db seed

npm run dev

---

# 68. ENVIRONMENT

Create:

.env.example

Example:

DATABASE_URL="mysql://root:password@localhost:3306/researchhub"

AUTH_SECRET="replace-with-secure-secret"

Never commit the real .env file.

---

# 69. FRONTEND DATA FLOW

The frontend must communicate with the database through server-side application logic.

Preferred flow:

UI
↓
Server Action / API
↓
Service Layer
↓
Prisma
↓
MySQL

Do not:

UI
↓
Direct MySQL

Never expose database credentials to the browser.

---

# 70. SEARCH IMPLEMENTATION

For researcher/project discovery:

Use database-level filtering.

Support:

- Partial matching
- Multiple filters
- Pagination
- Sorting

Example:

Search:
"machine learning"

Filters:

University:
IIT Delhi

Skill:
Python

Domain:
Artificial Intelligence

Status:
Active

Results should update cleanly.

---

# 71. PROJECT DASHBOARD

Professor project dashboard:

Project title

Status

Progress

Milestones

Researchers

Students

Funding

Publications

Patents

Datasets

Collaborators

Keep it simple.

A project timeline is preferred over a complicated Gantt chart.

---

# 72. VISUAL HIERARCHY

Important information should visually dominate.

Example project page:

PROJECT TITLE
Lead researcher
Status

Description

Research domains

Project team

Milestones

Outputs

Funding

Do not give equal visual weight to every database field.

The UI should translate database complexity into human-friendly information.

---

# 73. EMPTY STATES

Examples:

No collaborators:

"No collaborators yet.
Explore researchers working in related domains."

No projects:

"No research projects found."

No publications:

"No publications have been linked to this project yet."

Make empty states useful rather than just saying "No data."

---

# 74. FINAL UI FEEL

The final application should feel:

Clean
Quiet
Smart
Academic
Trustworthy
Modern
Fast

Think:

Google Scholar
+
Notion
+
modern university portal

NOT:

LinkedIn
+
Jira
+
Salesforce

---

# 75. IMPLEMENTATION ORDER

Build the application in this order.

PHASE 1
Project setup

- Next.js
- TypeScript
- Tailwind
- shadcn
- Prisma
- MySQL
- Auth

PHASE 2
Database

- Prisma schema
- Relationships
- Constraints
- Indexes
- Migrations
- Seed data

PHASE 3
Authentication

- Login
- Register
- Sessions
- Roles
- Authorization

PHASE 4
Core layout

- Sidebar
- Header
- Mobile navigation
- Dashboard

PHASE 5
Discovery

- Global search
- Researchers
- Projects
- Universities
- Labs

PHASE 6
Research management

- Create project
- Edit project
- Project details
- Milestones
- Team

PHASE 7
Research outputs

- Publications
- Patents
- Datasets

PHASE 8
Funding

- Funding agencies
- Project funding

PHASE 9
Collaboration

- Researcher collaboration
- Collaboration discovery

PHASE 10
Admin

- University dashboard
- Research analytics

PHASE 11
Polish

- Responsive design
- Accessibility
- Loading states
- Empty states
- Error states
- Performance optimization

---

# 76. IMPORTANT DEVELOPMENT RULE

Before writing code:

1. Inspect the uploaded ER diagram carefully.
2. Identify every entity.
3. Identify every relationship.
4. Identify cardinalities.
5. Identify primary keys.
6. Identify multivalued attributes.
7. Identify specialization/generalization.
8. Translate the ER diagram into a normalized Prisma schema.
9. Compare the Prisma schema against the uploaded diagram.
10. Only then begin implementation.

Do not silently change relationships.

If an ER relationship is ambiguous, preserve its semantic meaning and document the implementation decision.

---

# 77. DO NOT MOCK THE DATABASE

This is critical.

Do NOT build a frontend that uses hardcoded arrays as its primary data source.

The application must actually connect to MySQL.

The UI should read and write real data through Prisma.

Seed data is acceptable for development.

But all core pages must ultimately use the database.

---

# 78. CRUD REQUIREMENTS

Implement real CRUD operations for appropriate entities.

At minimum:

Researchers:
- Read
- Update own profile

Projects:
- Create
- Read
- Update
- Delete where authorized

Universities:
- Read
- Admin management

Departments:
- Read
- Admin management

Laboratories:
- Create/read/update where authorized

Publications:
- Create/read/update where authorized

Patents:
- Create/read/update where authorized

Datasets:
- Create/read/update where authorized

Funding:
- Create/read/update where authorized

Collaborations:
- Create/read/manage where authorized

---

# 79. FINAL QUALITY CHECK

Before considering the project complete, verify:

DATABASE

[ ] MySQL connection works
[ ] Prisma works
[ ] Migrations work
[ ] Seed works
[ ] Foreign keys work
[ ] Indexes exist
[ ] Relationships match ER diagram

AUTH

[ ] Login works
[ ] Registration works
[ ] Logout works
[ ] Roles work
[ ] Server authorization works

FRONTEND

[ ] Landing page works
[ ] Dashboard works
[ ] Search works
[ ] Researcher discovery works
[ ] Project discovery works
[ ] Project creation works
[ ] University pages work
[ ] Lab pages work
[ ] Publications work
[ ] Patents work
[ ] Datasets work
[ ] Funding works
[ ] Collaboration works

UX

[ ] Mobile responsive
[ ] Loading states
[ ] Empty states
[ ] Error states
[ ] Accessible forms
[ ] Keyboard navigation

PERFORMANCE

[ ] Pagination
[ ] No N+1 queries
[ ] Proper indexes
[ ] Server-side data fetching
[ ] No unnecessary client-side fetching

---

# 80. MOST IMPORTANT INSTRUCTION

Do not make the application visually complicated just because the database is complicated.

The database can be highly relational and sophisticated while the frontend remains extremely simple.

The user should see:

SEARCH
DISCOVER
CONNECT
MANAGE

The complexity should live underneath the interface.

Build the product so that a first-time student can open ResearchHub and immediately understand:

"Where do I find a project?"

"Who works in my field?"

"Which labs can I access?"

"Which researchers should I contact?"

"Which projects are currently active?"

That is the core UX goal.

Build the complete working application now.