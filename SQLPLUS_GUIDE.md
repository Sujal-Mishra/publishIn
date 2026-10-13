# ResearchHub — Oracle SQL*Plus Execution & Integration Guide

This guide explains how to connect to your local **Oracle Database 21c XE** instance using **SQL*Plus** and execute the complete ResearchHub database schema, views, stored procedures, and query verification scripts.

---

## 1. Quick Connection to SQL*Plus

Open your Terminal or PowerShell prompt and run:

```powershell
sqlplus / as sysdba
```

Or connect with user credentials:

```powershell
sqlplus system/password@localhost:1521/XE
```

---

## 2. Setting Up the Database Schema in SQL*Plus

Once logged into SQL*Plus, run the master setup script:

```sql
@scripts/oracle_setup.sql
```

This single command will:
1. Drop old tables cleanly (if re-running).
2. Create all **23 Entity & Junction Tables** with Primary Keys, Foreign Keys, `CHECK` constraints, and default values.
3. Create optimized **B-Tree Indexes** (`idx_project_title`, `idx_univ_name`, etc.).
4. Create **3 Database Views**:
   - `V_ACTIVE_RESEARCH_PROJECTS`
   - `V_RESEARCHER_STATS`
   - `V_UNIVERSITY_SUMMARY`
5. Create **PL/SQL Stored Procedure**:
   - `GET_UNIVERSITY_STATS(p_univ_id)`
6. Populate realistic academic seed data (`UNIVERSITY`, `DEPARTMENT`, `RESEARCHER`, `STUDENT`, `PROFESSOR`, `RESEARCH_PROJECT`, `MILESTONE`, `PUBLICATION`, `PATENT`, `DATASET`, `COLLABORATION`, etc.).
7. Automatically execute `COMMIT;`.

---

## 3. Handy Queries to Run in SQL*Plus

### A. Query Active Research Projects
```sql
SELECT project_id, project_title, budget, lead_professor_name, university_name
FROM V_ACTIVE_RESEARCH_PROJECTS;
```

### B. Query Researcher Profiles & Statistics
```sql
SELECT researcher_name, current_position, university, total_led_projects, total_collaborators
FROM V_RESEARCHER_STATS;
```

### C. Query University Research Summary
```sql
SELECT university_name, abbreviation, total_departments, total_researchers, total_projects, total_research_funding
FROM V_UNIVERSITY_SUMMARY;
```

### D. Execute PL/SQL Stored Procedure
Enable output and execute procedure for IIT Bombay (ID: 1):

```sql
SET SERVEROUTPUT ON;
EXEC GET_UNIVERSITY_STATS(1);
```

**Expected Output:**
```
----------------------------------------------------
UNIVERSITY RESEARCH REPORT FOR: Indian Institute of Technology Bombay
Total Departments: 2
Total Projects:    1
Total Budget:      INR    1,85,000,00.00
----------------------------------------------------
```

---

## 4. Web Application Sync

The Next.js ResearchHub web application runs seamlessly alongside this Oracle database schema. When running `npm run dev`, you can log into the web UI with the demo accounts pre-populated in both the Prisma ORM and Oracle database scripts:

- **Professor**: `professor@researchhub.demo` / `password123`
- **Student**: `student@researchhub.demo` / `password123`
- **Researcher**: `researcher@researchhub.demo` / `password123`
- **Admin**: `admin@researchhub.demo` / `password123`
- **Funding Agency**: `funding@researchhub.demo` / `password123`
- **Industry Partner**: `industry@researchhub.demo` / `password123`
