-- ====================================================================
-- ResearchHub — National Research Collaboration Ecosystem
-- Oracle Database 21c XE / SQL*Plus Master Database Script
-- ====================================================================
-- File: scripts/oracle_setup.sql
-- Description: Complete DDL, Integrity Constraints, Indexes, Views,
--              PL/SQL Stored Procedures, Triggers, and Seed Data.
-- ====================================================================

SET DEFINE OFF;
SET SERVEROUTPUT ON;

PROMPT ================================================================;
PROMPT  CLEANING UP EXISTING OBJECTS IN ORACLE DATABASE
PROMPT ================================================================;

DECLARE
   PROCEDURE drop_table_if_exists(p_table_name VARCHAR2) IS
   BEGIN
      EXECUTE IMMEDIATE 'DROP TABLE ' || p_table_name || ' CASCADE CONSTRAINTS';
      DBMS_OUTPUT.PUT_LINE('Dropped table ' || p_table_name);
   EXCEPTION
      WHEN OTHERS THEN
         IF SQLCODE != -942 THEN NULL; END IF;
   END;
BEGIN
   drop_table_if_exists('PROJECT_AUDIT_LOG');
   drop_table_if_exists('INDUSTRY_COLLABORATIONS');
   drop_table_if_exists('COLLABORATION');
   drop_table_if_exists('PROJECT_DOMAINS');
   drop_table_if_exists('RESEARCHER_DOMAINS');
   drop_table_if_exists('PROJECT_SKILLS');
   drop_table_if_exists('RESEARCHER_SKILLS');
   drop_table_if_exists('RESEARCH_DOMAIN');
   drop_table_if_exists('SKILL');
   drop_table_if_exists('DATASET');
   drop_table_if_exists('PATENT');
   drop_table_if_exists('PUBLICATION');
   drop_table_if_exists('MILESTONE');
   drop_table_if_exists('LABORATORY');
   drop_table_if_exists('PROJECT_MEMBERS');
   drop_table_if_exists('RESEARCH_PROJECT');
   drop_table_if_exists('INDUSTRY');
   drop_table_if_exists('FUNDING_AGENCY');
   drop_table_if_exists('PROFESSOR');
   drop_table_if_exists('STUDENT');
   drop_table_if_exists('RESEARCHER');
   drop_table_if_exists('DEPARTMENT');
   drop_table_if_exists('UNIVERSITY_LOCATIONS');
   drop_table_if_exists('UNIVERSITY');
END;
/

PROMPT ================================================================;
PROMPT  CREATING ENTITY TABLES
PROMPT ================================================================;

-- 1. UNIVERSITY
CREATE TABLE UNIVERSITY (
    university_id     NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    university_name   VARCHAR2(150) NOT NULL,
    abbreviation      VARCHAR2(20) NOT NULL,
    established_year  NUMBER(4),
    type              VARCHAR2(20) CHECK (type IN ('Public', 'Private', 'Autonomous')),
    website           VARCHAR2(255),
    phone             VARCHAR2(50),
    email             VARCHAR2(100),
    ranking           NUMBER(5),
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Multivalued Attribute Location
CREATE TABLE UNIVERSITY_LOCATIONS (
    location_id     NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    university_id   NUMBER REFERENCES UNIVERSITY(university_id) ON DELETE CASCADE,
    location        VARCHAR2(255) NOT NULL
);

-- 2. DEPARTMENT
CREATE TABLE DEPARTMENT (
    department_id   NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    department_name VARCHAR2(120) NOT NULL,
    hod             VARCHAR2(100),
    office          VARCHAR2(100),
    university_id   NUMBER NOT NULL REFERENCES UNIVERSITY(university_id) ON DELETE CASCADE
);

-- 3. RESEARCHER
CREATE TABLE RESEARCHER (
    researcher_id    NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fname            VARCHAR2(50) NOT NULL,
    minit            VARCHAR2(10),
    lname            VARCHAR2(50) NOT NULL,
    email            VARCHAR2(100) UNIQUE NOT NULL,
    contact          VARCHAR2(30),
    address          VARCHAR2(255),
    gender           VARCHAR2(15),
    dob              DATE,
    citizenship      VARCHAR2(50),
    current_position VARCHAR2(100) NOT NULL,
    highest_degree   VARCHAR2(100),
    orcid            VARCHAR2(50) UNIQUE,
    biography        CLOB,
    department_id    NUMBER NOT NULL REFERENCES DEPARTMENT(department_id),
    user_role        VARCHAR2(30) DEFAULT 'RESEARCHER' CHECK (user_role IN ('STUDENT', 'PROFESSOR', 'RESEARCHER', 'UNIVERSITY_ADMIN', 'FUNDING_AGENCY', 'INDUSTRY')),
    password_hash    VARCHAR2(255) DEFAULT '$2a$10$wE8wY01234567890abcdefuO8qK4ePq8Z6x7y8z9a0b1c2d3e4f5',
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. STUDENT (ISA Specialization of RESEARCHER)
CREATE TABLE STUDENT (
    student_id      NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    researcher_id   NUMBER UNIQUE NOT NULL REFERENCES RESEARCHER(researcher_id) ON DELETE CASCADE,
    program         VARCHAR2(50) NOT NULL,
    year_of_study   NUMBER(2),
    cgpa            NUMBER(4,2),
    advisor_id      NUMBER REFERENCES RESEARCHER(researcher_id)
);

-- 5. PROFESSOR (ISA Specialization of RESEARCHER)
CREATE TABLE PROFESSOR (
    professor_id    NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    researcher_id   NUMBER UNIQUE NOT NULL REFERENCES RESEARCHER(researcher_id) ON DELETE CASCADE,
    designation     VARCHAR2(50) NOT NULL,
    experience      NUMBER(3)
);

-- 6. FUNDING AGENCY
CREATE TABLE FUNDING_AGENCY (
    agency_id       NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name            VARCHAR2(150) UNIQUE NOT NULL,
    website         VARCHAR2(255),
    email           VARCHAR2(100)
);

-- 7. INDUSTRY
CREATE TABLE INDUSTRY (
    industry_id     NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name            VARCHAR2(150) UNIQUE NOT NULL,
    industry_type   VARCHAR2(100),
    website         VARCHAR2(255),
    contact_email   VARCHAR2(100),
    phone           VARCHAR2(30)
);

-- 8. RESEARCH PROJECT
CREATE TABLE RESEARCH_PROJECT (
    project_id        NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_title     VARCHAR2(255) NOT NULL,
    grant_number      VARCHAR2(50) UNIQUE,
    top_date          DATE,
    start_date        DATE NOT NULL,
    end_date          DATE,
    budget            NUMBER(15,2),
    project_status    VARCHAR2(20) DEFAULT 'Active' CHECK (project_status IN ('Proposed', 'Active', 'Completed', 'On Hold', 'Cancelled')),
    lead_professor_id NUMBER NOT NULL REFERENCES RESEARCHER(researcher_id),
    department_id     NUMBER NOT NULL REFERENCES DEPARTMENT(department_id),
    funding_agency_id NUMBER REFERENCES FUNDING_AGENCY(agency_id),
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. PROJECT MEMBERS
CREATE TABLE PROJECT_MEMBERS (
    member_id     NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id    NUMBER NOT NULL REFERENCES RESEARCH_PROJECT(project_id) ON DELETE CASCADE,
    researcher_id NUMBER NOT NULL REFERENCES RESEARCHER(researcher_id) ON DELETE CASCADE,
    role          VARCHAR2(50) DEFAULT 'Member',
    joined_at     DATE DEFAULT SYSDATE,
    CONSTRAINT unique_proj_member UNIQUE(project_id, researcher_id)
);

-- 10. LABORATORY
CREATE TABLE LABORATORY (
    lab_id          NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name            VARCHAR2(150) NOT NULL,
    department_id   NUMBER NOT NULL REFERENCES DEPARTMENT(department_id),
    university_id   NUMBER NOT NULL REFERENCES UNIVERSITY(university_id)
);

-- 11. MILESTONE
CREATE TABLE MILESTONE (
    milestone_id    NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title           VARCHAR2(200) NOT NULL,
    description     VARCHAR2(500),
    due_date        DATE,
    status          VARCHAR2(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed')),
    project_id      NUMBER NOT NULL REFERENCES RESEARCH_PROJECT(project_id) ON DELETE CASCADE,
    lab_id          NUMBER REFERENCES LABORATORY(lab_id)
);

-- 12. PUBLICATION
CREATE TABLE PUBLICATION (
    publication_id   NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title            VARCHAR2(255) NOT NULL,
    journal_name     VARCHAR2(150),
    publication_year NUMBER(4),
    doi              VARCHAR2(100) UNIQUE,
    project_id       NUMBER NOT NULL REFERENCES RESEARCH_PROJECT(project_id) ON DELETE CASCADE
);

-- 13. PATENT
CREATE TABLE PATENT (
    patent_id       NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title           VARCHAR2(255) NOT NULL,
    doi             VARCHAR2(100) UNIQUE,
    grant_date      DATE,
    project_id      NUMBER NOT NULL REFERENCES RESEARCH_PROJECT(project_id) ON DELETE CASCADE
);

-- 14. DATASET
CREATE TABLE DATASET (
    dataset_id      NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title           VARCHAR2(200) NOT NULL,
    name            VARCHAR2(150) NOT NULL,
    location        VARCHAR2(255) NOT NULL,
    project_id      NUMBER NOT NULL REFERENCES RESEARCH_PROJECT(project_id) ON DELETE CASCADE
);

-- 15. SKILL
CREATE TABLE SKILL (
    skill_id        NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name            VARCHAR2(100) UNIQUE NOT NULL,
    category        VARCHAR2(50)
);

-- 16. RESEARCH DOMAIN
CREATE TABLE RESEARCH_DOMAIN (
    domain_id       NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name            VARCHAR2(100) UNIQUE NOT NULL,
    description     VARCHAR2(255)
);

-- 17. RESEARCHER SKILLS (M:N)
CREATE TABLE RESEARCHER_SKILLS (
    researcher_id   NUMBER NOT NULL REFERENCES RESEARCHER(researcher_id) ON DELETE CASCADE,
    skill_id        NUMBER NOT NULL REFERENCES SKILL(skill_id) ON DELETE CASCADE,
    PRIMARY KEY (researcher_id, skill_id)
);

-- 18. PROJECT SKILLS (M:N)
CREATE TABLE PROJECT_SKILLS (
    project_id      NUMBER NOT NULL REFERENCES RESEARCH_PROJECT(project_id) ON DELETE CASCADE,
    skill_id        NUMBER NOT NULL REFERENCES SKILL(skill_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, skill_id)
);

-- 19. RESEARCHER DOMAINS (M:N)
CREATE TABLE RESEARCHER_DOMAINS (
    researcher_id   NUMBER NOT NULL REFERENCES RESEARCHER(researcher_id) ON DELETE CASCADE,
    domain_id       NUMBER NOT NULL REFERENCES RESEARCH_DOMAIN(domain_id) ON DELETE CASCADE,
    PRIMARY KEY (researcher_id, domain_id)
);

-- 20. PROJECT DOMAINS (M:N)
CREATE TABLE PROJECT_DOMAINS (
    project_id      NUMBER NOT NULL REFERENCES RESEARCH_PROJECT(project_id) ON DELETE CASCADE,
    domain_id       NUMBER NOT NULL REFERENCES RESEARCH_DOMAIN(domain_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, domain_id)
);

-- 21. COLLABORATION (Recursive Researcher-to-Researcher)
CREATE TABLE COLLABORATION (
    collaboration_id   NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    researcher_id_1    NUMBER NOT NULL REFERENCES RESEARCHER(researcher_id) ON DELETE CASCADE,
    researcher_id_2    NUMBER NOT NULL REFERENCES RESEARCHER(researcher_id) ON DELETE CASCADE,
    collaboration_type VARCHAR2(100),
    since_date         DATE DEFAULT SYSDATE,
    status             VARCHAR2(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Concluded')),
    CONSTRAINT unique_collaboration UNIQUE (researcher_id_1, researcher_id_2)
);

-- 22. INDUSTRY COLLABORATIONS
CREATE TABLE INDUSTRY_COLLABORATIONS (
    ind_collab_id     NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    industry_id       NUMBER NOT NULL REFERENCES INDUSTRY(industry_id) ON DELETE CASCADE,
    project_id        NUMBER REFERENCES RESEARCH_PROJECT(project_id),
    researcher_id     NUMBER REFERENCES RESEARCHER(researcher_id),
    collaboration_type VARCHAR2(100),
    since_date        DATE DEFAULT SYSDATE
);

-- 23. AUDIT LOG TABLE
CREATE TABLE PROJECT_AUDIT_LOG (
    audit_id     NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id   NUMBER,
    action       VARCHAR2(50),
    old_status   VARCHAR2(20),
    new_status   VARCHAR2(20),
    changed_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

PROMPT ================================================================;
PROMPT  CREATING INDEXES FOR QUERY OPTIMIZATION
PROMPT ================================================================;

CREATE INDEX idx_project_title ON RESEARCH_PROJECT(project_title);
CREATE INDEX idx_project_status ON RESEARCH_PROJECT(project_status);
CREATE INDEX idx_univ_name ON UNIVERSITY(university_name);
CREATE INDEX idx_pub_title ON PUBLICATION(title);

PROMPT ================================================================;
PROMPT  CREATING DATABASE VIEWS
PROMPT ================================================================;

-- View 1: Active Research Projects with Lead Professor & University
CREATE OR REPLACE VIEW V_ACTIVE_RESEARCH_PROJECTS AS
SELECT 
    p.project_id,
    p.project_title,
    p.grant_number,
    p.budget,
    p.start_date,
    p.end_date,
    r.fname || ' ' || r.lname AS lead_professor_name,
    d.department_name,
    u.university_name,
    f.name AS funding_agency_name
FROM RESEARCH_PROJECT p
JOIN RESEARCHER r ON p.lead_professor_id = r.researcher_id
JOIN DEPARTMENT d ON p.department_id = d.department_id
JOIN UNIVERSITY u ON d.university_id = u.university_id
LEFT JOIN FUNDING_AGENCY f ON p.funding_agency_id = f.agency_id
WHERE p.project_status = 'Active';

-- View 2: Researcher Statistics (Publications, Projects & Collaborations)
CREATE OR REPLACE VIEW V_RESEARCHER_STATS AS
SELECT 
    r.researcher_id,
    r.fname || ' ' || r.lname AS researcher_name,
    r.email,
    r.current_position,
    d.department_name,
    u.abbreviation AS university,
    (SELECT COUNT(*) FROM RESEARCH_PROJECT p WHERE p.lead_professor_id = r.researcher_id) AS total_led_projects,
    (SELECT COUNT(*) FROM COLLABORATION c WHERE c.researcher_id_1 = r.researcher_id OR c.researcher_id_2 = r.researcher_id) AS total_collaborators
FROM RESEARCHER r
JOIN DEPARTMENT d ON r.department_id = d.department_id
JOIN UNIVERSITY u ON d.university_id = u.university_id;

-- View 3: University Research Summary
CREATE OR REPLACE VIEW V_UNIVERSITY_SUMMARY AS
SELECT 
    u.university_id,
    u.university_name,
    u.abbreviation,
    u.type,
    COUNT(DISTINCT d.department_id) AS total_departments,
    COUNT(DISTINCT r.researcher_id) AS total_researchers,
    COUNT(DISTINCT p.project_id) AS total_projects,
    NVL(SUM(p.budget), 0) AS total_research_funding
FROM UNIVERSITY u
LEFT JOIN DEPARTMENT d ON u.university_id = d.university_id
LEFT JOIN RESEARCHER r ON d.department_id = r.department_id
LEFT JOIN RESEARCH_PROJECT p ON d.department_id = p.department_id
GROUP BY u.university_id, u.university_name, u.abbreviation, u.type;

PROMPT ================================================================;
PROMPT  CREATING PL/SQL STORED PROCEDURES
PROMPT ================================================================;

CREATE OR REPLACE PROCEDURE GET_UNIVERSITY_STATS (
    p_univ_id IN NUMBER
) IS
    v_name VARCHAR2(150);
    v_depts NUMBER;
    v_projs NUMBER;
    v_budget NUMBER;
BEGIN
    SELECT university_name INTO v_name FROM UNIVERSITY WHERE university_id = p_univ_id;
    SELECT COUNT(*) INTO v_depts FROM DEPARTMENT WHERE university_id = p_univ_id;
    SELECT COUNT(p.project_id), NVL(SUM(p.budget), 0)
    INTO v_projs, v_budget
    FROM RESEARCH_PROJECT p
    JOIN DEPARTMENT d ON p.department_id = d.department_id
    WHERE d.university_id = p_univ_id;

    DBMS_OUTPUT.PUT_LINE('----------------------------------------------------');
    DBMS_OUTPUT.PUT_LINE('UNIVERSITY RESEARCH REPORT FOR: ' || v_name);
    DBMS_OUTPUT.PUT_LINE('Total Departments: ' || v_depts);
    DBMS_OUTPUT.PUT_LINE('Total Projects:    ' || v_projs);
    DBMS_OUTPUT.PUT_LINE('Total Budget:      INR ' || TO_CHAR(v_budget, '99,99,99,999.00'));
    DBMS_OUTPUT.PUT_LINE('----------------------------------------------------');
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Error: University ID ' || p_univ_id || ' not found.');
END;
/

PROMPT ================================================================;
PROMPT  INSERTING SEED DATA FOR ORACLE SQL*PLUS
PROMPT ================================================================;

-- Universities
INSERT INTO UNIVERSITY (university_name, abbreviation, established_year, type, website, email, ranking)
VALUES ('Indian Institute of Technology Bombay', 'IITB', 1958, 'Public', 'https://www.iitb.ac.in', 'contact@iitb.ac.in', 1);

INSERT INTO UNIVERSITY (university_name, abbreviation, established_year, type, website, email, ranking)
VALUES ('Indian Institute of Technology Delhi', 'IITD', 1961, 'Public', 'https://home.iitd.ac.in', 'info@iitd.ac.in', 2);

INSERT INTO UNIVERSITY (university_name, abbreviation, established_year, type, website, email, ranking)
VALUES ('Indian Institute of Science Bangalore', 'IISc', 1909, 'Public', 'https://iisc.ac.in', 'registrar@iisc.ac.in', 3);

-- Locations
INSERT INTO UNIVERSITY_LOCATIONS (university_id, location) VALUES (1, 'Powai, Mumbai, Maharashtra');
INSERT INTO UNIVERSITY_LOCATIONS (university_id, location) VALUES (2, 'Hauz Khas, New Delhi');
INSERT INTO UNIVERSITY_LOCATIONS (university_id, location) VALUES (3, 'Bengaluru, Karnataka');

-- Departments
INSERT INTO DEPARTMENT (department_name, hod, office, university_id) VALUES ('Computer Science & Engineering', 'Prof. Umesh Bellur', 'KReSIT 204', 1);
INSERT INTO DEPARTMENT (department_name, hod, office, university_id) VALUES ('Electrical Engineering', 'Prof. B.G. Fernandes', 'EE Main', 1);
INSERT INTO DEPARTMENT (department_name, hod, office, university_id) VALUES ('Computer Science & Automation', 'Prof. Prem Kalra', 'Bharti 402', 2);
INSERT INTO DEPARTMENT (department_name, hod, office, university_id) VALUES ('Department of Bioengineering', 'Prof. G.K. Ananthasuresh', 'BioEng 3', 3);

-- Funding Agencies
INSERT INTO FUNDING_AGENCY (name, website, email) VALUES ('Department of Science and Technology (DST)', 'https://dst.gov.in', 'grants@dst.gov.in');
INSERT INTO FUNDING_AGENCY (name, website, email) VALUES ('Science and Engineering Research Board (SERB)', 'https://serb.gov.in', 'proposals@serb.gov.in');

-- Industries
INSERT INTO INDUSTRY (name, industry_type, website, contact_email) VALUES ('Tata Consultancy Services Research', 'IT & AI Research', 'https://tcs.com', 'research@tcs.com');
INSERT INTO INDUSTRY (name, industry_type, website, contact_email) VALUES ('Reliance New Energy Ltd', 'Clean Tech', 'https://ril.com', 'cleanenergy@ril.com');

-- Researchers
INSERT INTO RESEARCHER (fname, minit, lname, email, contact, address, gender, current_position, highest_degree, orcid, department_id, user_role)
VALUES ('Rahul', 'K', 'Sharma', 'professor@researchhub.demo', '+91-9876543210', 'Powai, Mumbai', 'Male', 'Senior Professor', 'Ph.D. in CS (CMU)', '0000-0002-1825-0097', 1, 'PROFESSOR');

INSERT INTO RESEARCHER (fname, minit, lname, email, contact, address, gender, current_position, highest_degree, orcid, department_id, user_role)
VALUES ('Ananya', 'R', 'Iyer', 'student@researchhub.demo', '+91-9123456789', 'Powai, Mumbai', 'Female', 'Ph.D. Scholar', 'M.Tech in CS', '0000-0003-9011-442X', 1, 'STUDENT');

INSERT INTO RESEARCHER (fname, minit, lname, email, contact, address, gender, current_position, highest_degree, orcid, department_id, user_role)
VALUES ('Vikramaditya', 'S', 'Sen', 'vikram.sen@iitd.ac.in', '+91-9988776655', 'Hauz Khas, Delhi', 'Male', 'Associate Professor', 'Ph.D. (ETH Zurich)', '0000-0001-5544-3321', 3, 'PROFESSOR');

INSERT INTO RESEARCHER (fname, minit, lname, email, contact, address, gender, current_position, highest_degree, orcid, department_id, user_role)
VALUES ('Meera', 'P', 'Nair', 'researcher@researchhub.demo', '+91-9445566778', 'Bengaluru, KA', 'Female', 'Principal Scientist', 'Ph.D. (Harvard)', '0000-0004-7788-9900', 4, 'RESEARCHER');

-- Student & Professor details
INSERT INTO PROFESSOR (researcher_id, designation, experience) VALUES (1, 'Professor', 18);
INSERT INTO STUDENT (researcher_id, program, year_of_study, cgpa, advisor_id) VALUES (2, 'Ph.D.', 3, 9.60, 1);
INSERT INTO PROFESSOR (researcher_id, designation, experience) VALUES (3, 'Associate Professor', 12);

-- Laboratories
INSERT INTO LABORATORY (name, department_id, university_id) VALUES ('Mindspire AI & Vision Lab', 1, 1);
INSERT INTO LABORATORY (name, department_id, university_id) VALUES ('Autonomous Systems & Drone Lab', 3, 2);
INSERT INTO LABORATORY (name, department_id, university_id) VALUES ('Genomics & Bio-Nanotech Facility', 4, 3);

-- Research Projects
INSERT INTO RESEARCH_PROJECT (project_title, grant_number, start_date, end_date, budget, project_status, lead_professor_id, department_id, funding_agency_id)
VALUES ('Federated Edge-AI Systems for Post-Quantum Smart Grids', 'DST-CS-2025-089', TO_DATE('2025-01-15', 'YYYY-MM-DD'), TO_DATE('2028-01-14', 'YYYY-MM-DD'), 18500000.00, 'Active', 1, 1, 1);

INSERT INTO RESEARCH_PROJECT (project_title, grant_number, start_date, end_date, budget, project_status, lead_professor_id, department_id, funding_agency_id)
VALUES ('Autonomous Aerial Drones for Precision Agriculture', 'SERB-EMR-2024-0041', TO_DATE('2024-09-01', 'YYYY-MM-DD'), TO_DATE('2027-08-31', 'YYYY-MM-DD'), 12000000.00, 'Active', 3, 3, 2);

-- Project Members
INSERT INTO PROJECT_MEMBERS (project_id, researcher_id, role) VALUES (1, 2, 'Lead Ph.D. Researcher');
INSERT INTO PROJECT_MEMBERS (project_id, researcher_id, role) VALUES (1, 3, 'Co-Investigator');

-- Milestones
INSERT INTO MILESTONE (title, description, due_date, status, project_id, lab_id)
VALUES ('Literature Review & Architecture Design', 'Comprehensive study of lattice crypto', TO_DATE('2025-04-30', 'YYYY-MM-DD'), 'Completed', 1, 1);

INSERT INTO MILESTONE (title, description, due_date, status, project_id, lab_id)
VALUES ('Post-Quantum Protocol Implementation', 'Implementation on ARM edge nodes', TO_DATE('2025-11-30', 'YYYY-MM-DD'), 'In Progress', 1, 1);

-- Publications & Patents
INSERT INTO PUBLICATION (title, journal_name, publication_year, doi, project_id)
VALUES ('Lattice-Based Zero Knowledge Proofs for Edge Intelligence', 'IEEE TIFS', 2025, '10.1109/TIFS.2025.3409812', 1);

INSERT INTO PATENT (title, doi, grant_date, project_id)
VALUES ('System and Method for Asynchronous Neural Aggregation', '10.48550/patent.in.2025.10982', TO_DATE('2025-08-10', 'YYYY-MM-DD'), 1);

-- Datasets
INSERT INTO DATASET (title, name, location, project_id)
VALUES ('GridPower-Edge 100K Security Telemetry Dataset', 'gridpower_telemetry_v1.zip', 'https://datasets.researchhub.ac.in/gridpower-100k', 1);

-- Collaborations
INSERT INTO COLLABORATION (researcher_id_1, researcher_id_2, collaboration_type, since_date)
VALUES (1, 3, 'Multi-institutional Joint R&D Project', TO_DATE('2024-11-01', 'YYYY-MM-DD'));

INSERT INTO COLLABORATION (researcher_id_1, researcher_id_2, collaboration_type, since_date)
VALUES (1, 4, 'Interdisciplinary AI-Bio Informatics', TO_DATE('2025-03-01', 'YYYY-MM-DD'));

COMMIT;

PROMPT ================================================================;
PROMPT  ORACLE SQL*PLUS SETUP COMPLETE! ALL OBJECTS AND SEED DATA READY.
PROMPT ================================================================;
