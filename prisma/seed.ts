import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting ResearchHub Database Seeding with Rich Synthetic Data...')

  // Clean existing tables in reverse order
  await prisma.collaboration.deleteMany()
  await prisma.industryCollaboration.deleteMany()
  await prisma.projectMember.deleteMany()
  await prisma.projectSkill.deleteMany()
  await prisma.projectDomain.deleteMany()
  await prisma.researcherSkill.deleteMany()
  await prisma.researcherDomain.deleteMany()
  await prisma.milestone.deleteMany()
  await prisma.publication.deleteMany()
  await prisma.patent.deleteMany()
  await prisma.dataset.deleteMany()
  await prisma.researchProject.deleteMany()
  await prisma.laboratory.deleteMany()
  await prisma.student.deleteMany()
  await prisma.professor.deleteMany()
  await prisma.researcher.deleteMany()
  await prisma.department.deleteMany()
  await prisma.universityLocation.deleteMany()
  await prisma.university.deleteMany()
  await prisma.fundingAgency.deleteMany()
  await prisma.industry.deleteMany()
  await prisma.skill.deleteMany()
  await prisma.researchDomain.deleteMany()

  const passwordHash = await bcrypt.hash('password123', 10)

  // 1. Research Domains
  const domainAI = await prisma.researchDomain.create({
    data: { name: 'Artificial Intelligence', description: 'Machine Learning, Neural Networks, Deep Learning & LLMs' }
  })
  const domainRobotics = await prisma.researchDomain.create({
    data: { name: 'Robotics & Control', description: 'Autonomous systems, drones, kinematic manipulation & spatial AI' }
  })
  const domainBiotech = await prisma.researchDomain.create({
    data: { name: 'Biotechnology', description: 'Genomics, CRISPR, molecular bio-sensors, precision healthcare' }
  })
  const domainCyber = await prisma.researchDomain.create({
    data: { name: 'Cybersecurity & Cryptography', description: 'Quantum cryptography, network security, zero-trust systems' }
  })
  const domainCleanEnergy = await prisma.researchDomain.create({
    data: { name: 'Renewable Energy', description: 'Perovskite solar, solid-state batteries, hydrogen fuel cells' }
  })

  // 2. Skills
  const skillPy = await prisma.skill.create({ data: { name: 'Python', category: 'Programming' } })
  const skillPyTorch = await prisma.skill.create({ data: { name: 'PyTorch', category: 'AI & Data Science' } })
  const skillROS = await prisma.skill.create({ data: { name: 'ROS 2 (Robot OS)', category: 'Robotics' } })
  const skillCRISPR = await prisma.skill.create({ data: { name: 'CRISPR Gene Editing', category: 'Laboratory' } })
  const skillCrypto = await prisma.skill.create({ data: { name: 'Post-Quantum Crypto', category: 'Security' } })
  const skillMATLAB = await prisma.skill.create({ data: { name: 'MATLAB / Simulink', category: 'Engineering' } })
  const skillElectrochemical = await prisma.skill.create({ data: { name: 'Electrochemical Impedance', category: 'Energy' } })
  const skillNanoparticles = await prisma.skill.create({ data: { name: 'Lipid Nanoparticle Synthesis', category: 'Biotech' } })

  // 3. Universities
  const uIITB = await prisma.university.create({
    data: {
      universityName: 'Indian Institute of Technology Bombay',
      abbreviation: 'IITB',
      establishedYear: 1958,
      type: 'Public',
      website: 'https://www.iitb.ac.in',
      phone: '+91-22-2572-2545',
      email: 'contact@iitb.ac.in',
      ranking: 1,
      locations: {
        create: [
          { location: 'Powai, Mumbai, Maharashtra' },
          { location: 'Monash Research Academy, Mumbai' }
        ]
      }
    }
  })

  const uIITD = await prisma.university.create({
    data: {
      universityName: 'Indian Institute of Technology Delhi',
      abbreviation: 'IITD',
      establishedYear: 1961,
      type: 'Public',
      website: 'https://home.iitd.ac.in',
      phone: '+91-11-2659-7135',
      email: 'info@iitd.ac.in',
      ranking: 2,
      locations: {
        create: [{ location: 'Hauz Khas, New Delhi' }]
      }
    }
  })

  const uIISc = await prisma.university.create({
    data: {
      universityName: 'Indian Institute of Science Bangalore',
      abbreviation: 'IISc',
      establishedYear: 1909,
      type: 'Public',
      website: 'https://iisc.ac.in',
      phone: '+91-80-2293-2004',
      email: 'registrar@iisc.ac.in',
      ranking: 3,
      locations: {
        create: [{ location: 'CV Raman Rd, Bengaluru, Karnataka' }]
      }
    }
  })

  // 4. Departments
  const dCS_IITB = await prisma.department.create({
    data: { departmentName: 'Computer Science & Engineering', hod: 'Prof. Umesh Bellur', office: 'KReSIT Bldg, Room 204', universityId: uIITB.id }
  })
  const dEE_IITB = await prisma.department.create({
    data: { departmentName: 'Electrical Engineering', hod: 'Prof. B.G. Fernandes', office: 'EE Main Bldg', universityId: uIITB.id }
  })
  const dCS_IITD = await prisma.department.create({
    data: { departmentName: 'Computer Science & Automation', hod: 'Prof. Prem Kalra', office: 'Bharti Bldg, Room 402', universityId: uIITD.id }
  })
  const dBio_IISc = await prisma.department.create({
    data: { departmentName: 'Department of Bioengineering', hod: 'Prof. G.K. Ananthasuresh', office: 'BioEng Block 3', universityId: uIISc.id }
  })

  // 5. Laboratories
  const labAI_IITB = await prisma.laboratory.create({
    data: { name: 'Mindspire AI & Vision Lab', departmentId: dCS_IITB.id, universityId: uIITB.id }
  })
  const labEnergy_IITB = await prisma.laboratory.create({
    data: { name: 'Advanced Photovoltaic & Energy Storage Facility', departmentId: dEE_IITB.id, universityId: uIITB.id }
  })
  const labRobo_IITD = await prisma.laboratory.create({
    data: { name: 'Autonomous Systems & Drone Lab', departmentId: dCS_IITD.id, universityId: uIITD.id }
  })
  const labBio_IISc = await prisma.laboratory.create({
    data: { name: 'Molecular Dynamics & Genomics Facility', departmentId: dBio_IISc.id, universityId: uIISc.id }
  })

  // 6. Funding Agencies & Industries
  const faDST = await prisma.fundingAgency.create({
    data: { name: 'Department of Science and Technology (DST)', website: 'https://dst.gov.in', email: 'grants@dst.gov.in' }
  })
  const faSERB = await prisma.fundingAgency.create({
    data: { name: 'Science and Engineering Research Board (SERB)', website: 'https://serb.gov.in', email: 'proposals@serb.gov.in' }
  })
  const faDRDO = await prisma.fundingAgency.create({
    data: { name: 'Defence Research and Development Organisation (DRDO)', website: 'https://drdo.gov.in', email: 'director.research@drdo.gov.in' }
  })
  const faMNRE = await prisma.fundingAgency.create({
    data: { name: 'Ministry of New and Renewable Energy (MNRE)', website: 'https://mnre.gov.in', email: 'greenhydrogen@mnre.gov.in' }
  })

  const indTata = await prisma.industry.create({
    data: { name: 'Tata Consultancy Services Research', industryType: 'IT & AI Research', website: 'https://tcs.com/research', contactEmail: 'research@tcs.com', phone: '+91-22-6778-9999' }
  })
  const indReliance = await prisma.industry.create({
    data: { name: 'Reliance New Energy Ltd', industryType: 'Clean Tech & Energy Storage', website: 'https://ril.com', contactEmail: 'cleanenergy@ril.com' }
  })

  // 7. Researchers
  const rProfRahul = await prisma.researcher.create({
    data: {
      fname: 'Rahul',
      minit: 'K',
      lname: 'Sharma',
      email: 'professor@researchhub.demo',
      contact: '+91-9876543210',
      address: 'Faculty Housing B-12, IIT Bombay, Mumbai',
      gender: 'Male',
      dob: new Date('1978-05-14'),
      citizenship: 'Indian',
      currentPosition: 'Senior Professor',
      highestDegree: 'Ph.D. in Computer Science (CMU)',
      orcid: '0000-0002-1825-0097',
      biography: 'Leading researcher in multi-modal LLMs, vision-language models, and decentralized AI coordination.',
      departmentId: dCS_IITB.id,
      role: 'PROFESSOR',
      passwordHash: passwordHash,
      professorProfile: {
        create: { designation: 'Professor', experience: 18 }
      },
      skills: { create: [{ skillId: skillPy.id }, { skillId: skillPyTorch.id }] },
      domains: { create: [{ domainId: domainAI.id }, { domainId: domainCyber.id }] }
    }
  })

  const rStudAnanya = await prisma.researcher.create({
    data: {
      fname: 'Ananya',
      minit: 'R',
      lname: 'Iyer',
      email: 'student@researchhub.demo',
      contact: '+91-9123456789',
      address: 'Hostel 15, IIT Bombay, Mumbai',
      gender: 'Female',
      dob: new Date('2001-09-22'),
      citizenship: 'Indian',
      currentPosition: 'Ph.D. Scholar',
      highestDegree: 'M.Tech in CS',
      orcid: '0000-0003-9011-442X',
      biography: 'Ph.D. candidate focusing on post-quantum secure federated learning architecture.',
      departmentId: dCS_IITB.id,
      role: 'STUDENT',
      passwordHash: passwordHash,
      studentProfile: {
        create: { program: 'Ph.D.', yearOfStudy: 3, cgpa: 9.6, advisorId: rProfRahul.id }
      },
      skills: { create: [{ skillId: skillPyTorch.id }, { skillId: skillCrypto.id }] },
      domains: { create: [{ domainId: domainAI.id }, { domainId: domainCyber.id }] }
    }
  })

  const rProfVikram = await prisma.researcher.create({
    data: {
      fname: 'Vikramaditya',
      minit: 'S',
      lname: 'Sen',
      email: 'vikram.sen@iitd.ac.in',
      contact: '+91-9988776655',
      address: 'Faculty Qtrs 4A, IIT Delhi',
      gender: 'Male',
      dob: new Date('1982-11-03'),
      citizenship: 'Indian',
      currentPosition: 'Associate Professor',
      highestDegree: 'Ph.D. in Mechanical Robotics (ETH Zurich)',
      orcid: '0000-0001-5544-3321',
      biography: 'Pioneer in aerial swarm robotics, obstacle negotiation, and real-time ROS 2 simulation.',
      departmentId: dCS_IITD.id,
      role: 'PROFESSOR',
      passwordHash: passwordHash,
      professorProfile: {
        create: { designation: 'Associate Professor', experience: 12 }
      },
      skills: { create: [{ skillId: skillROS.id }, { skillId: skillMATLAB.id }] },
      domains: { create: [{ domainId: domainRobotics.id }] }
    }
  })

  const rResMeera = await prisma.researcher.create({
    data: {
      fname: 'Meera',
      minit: 'P',
      lname: 'Nair',
      email: 'researcher@researchhub.demo',
      contact: '+91-9445566778',
      address: 'IISc Campus, Bengaluru',
      gender: 'Female',
      dob: new Date('1987-03-30'),
      citizenship: 'Indian',
      currentPosition: 'Principal Scientist',
      highestDegree: 'Ph.D. in Molecular Biology (Harvard)',
      orcid: '0000-0004-7788-9900',
      biography: 'Bioengineering scientist developing targeted CRISPR delivery nanomotors for localized therapies.',
      departmentId: dBio_IISc.id,
      role: 'RESEARCHER',
      passwordHash: passwordHash,
      skills: { create: [{ skillId: skillCRISPR.id }, { skillId: skillNanoparticles.id }] },
      domains: { create: [{ domainId: domainBiotech.id }] }
    }
  })

  const rProfArjun = await prisma.researcher.create({
    data: {
      fname: 'Arjun',
      minit: 'V',
      lname: 'Deshmukh',
      email: 'arjun.deshmukh@iitb.ac.in',
      contact: '+91-9822001122',
      address: 'Staff Quarters C-4, IIT Bombay',
      gender: 'Male',
      dob: new Date('1975-08-19'),
      citizenship: 'Indian',
      currentPosition: 'Chair Professor of Energy Science',
      highestDegree: 'Ph.D. in Chemical Physics (Imperial College)',
      orcid: '0000-0002-4411-8899',
      biography: 'Specializes in perovskite tandem photovoltaic cells and photoelectrochemical hydrogen catalysts.',
      departmentId: dEE_IITB.id,
      role: 'PROFESSOR',
      passwordHash: passwordHash,
      professorProfile: {
        create: { designation: 'Professor', experience: 22 }
      },
      skills: { create: [{ skillId: skillElectrochemical.id }] },
      domains: { create: [{ domainId: domainCleanEnergy.id }] }
    }
  })

  const rAdmin = await prisma.researcher.create({
    data: {
      fname: 'Academic',
      minit: 'A',
      lname: 'Administrator',
      email: 'admin@researchhub.demo',
      contact: '+91-22-2576-7000',
      address: 'Dean Office, IIT Bombay',
      gender: 'Other',
      currentPosition: 'Dean of R&D',
      highestDegree: 'Ph.D.',
      departmentId: dCS_IITB.id,
      role: 'UNIVERSITY_ADMIN',
      passwordHash: passwordHash
    }
  })

  const rFunding = await prisma.researcher.create({
    data: {
      fname: 'DST',
      lname: 'Grant Officer',
      email: 'funding@researchhub.demo',
      contact: '+91-11-2656-7373',
      address: 'Technology Bhavan, New Delhi',
      currentPosition: 'Director of National Research Grants',
      departmentId: dCS_IITD.id,
      role: 'FUNDING_AGENCY',
      passwordHash: passwordHash
    }
  })

  const rIndustry = await prisma.researcher.create({
    data: {
      fname: 'TCS',
      lname: 'R&D Director',
      email: 'industry@researchhub.demo',
      contact: '+91-22-6778-0000',
      address: 'TCS Innovation Labs, Thane',
      currentPosition: 'Head of External Academic Alliances',
      departmentId: dCS_IITB.id,
      role: 'INDUSTRY',
      passwordHash: passwordHash
    }
  })

  // 8. Research Projects Across Diverse Lifecycle Stages

  // PROJECT 1: ACTIVE (AI & Cyber, DST Grant, ₹1.85 Cr)
  const projAI = await prisma.researchProject.create({
    data: {
      projectTitle: 'Federated Edge-AI Systems for Post-Quantum Smart Grids',
      grantNumber: 'DST-CS-2025-089',
      topDate: new Date('2024-10-01'),
      startDate: new Date('2025-01-15'),
      endDate: new Date('2028-01-14'),
      budget: 18500000.0,
      projectStatus: 'Active',
      leadProfessorId: rProfRahul.id,
      departmentId: dCS_IITB.id,
      fundingAgencyId: faDST.id,
      domains: { create: [{ domainId: domainAI.id }, { domainId: domainCyber.id }] },
      skills: { create: [{ skillId: skillPyTorch.id }, { skillId: skillCrypto.id }] },
      members: {
        create: [
          { researcherId: rStudAnanya.id, role: 'Lead Ph.D. Researcher' },
          { researcherId: rProfVikram.id, role: 'Co-Investigator (Swarm Security)' }
        ]
      },
      milestones: {
        create: [
          { title: 'Tranche 1: Literature Review & Post-Quantum Protocol Spec', status: 'Completed', dueDate: new Date('2025-04-30'), labId: labAI_IITB.id, description: 'Formal mathematical proofs and lattice cryptosystem selection.' },
          { title: 'Tranche 2: Decentralized Federated Model Training Prototype', status: 'In Progress', dueDate: new Date('2025-11-30'), labId: labAI_IITB.id, description: 'Local training across 64 simulated grid edge nodes.' },
          { title: 'Tranche 3: Physical Hardware-in-the-Loop Testbed Validation', status: 'Pending', dueDate: new Date('2026-06-30'), description: 'Deployment on real embedded smart grid micro-controllers.' },
          { title: 'Tranche 4: Final Demonstration & Open-Source Security Audit', status: 'Pending', dueDate: new Date('2027-12-15'), description: 'Public benchmark suite and CERT-In security audit clearance.' }
        ]
      },
      publications: {
        create: [
          {
            title: 'Lattice-Based Zero Knowledge Proofs for Distributed Edge Intelligence',
            journalName: 'IEEE Transactions on Information Forensics and Security',
            publicationYear: 2025,
            doi: '10.1109/TIFS.2025.3409812'
          }
        ]
      },
      patents: {
        create: [
          {
            title: 'System and Method for Asynchronous Privacy-Preserving Neural Aggregation',
            doi: '10.48550/patent.in.2025.10982',
            grantDate: new Date('2025-08-10')
          }
        ]
      },
      datasets: {
        create: [
          {
            title: 'GridPower-Edge 100K Security Telemetry Dataset',
            name: 'gridpower_telemetry_v1.zip',
            location: 'https://datasets.researchhub.ac.in/gridpower-100k'
          }
        ]
      }
    }
  })

  // PROJECT 2: ACTIVE (Robotics, SERB Grant, ₹1.20 Cr)
  const projRobotics = await prisma.researchProject.create({
    data: {
      projectTitle: 'Autonomous Aerial Drones for Precision Agriculture in Hilly Terrain',
      grantNumber: 'SERB-EMR-2024-0041',
      topDate: new Date('2024-06-01'),
      startDate: new Date('2024-09-01'),
      endDate: new Date('2027-08-31'),
      budget: 12000000.0,
      projectStatus: 'Active',
      leadProfessorId: rProfVikram.id,
      departmentId: dCS_IITD.id,
      fundingAgencyId: faSERB.id,
      domains: { create: [{ domainId: domainRobotics.id }] },
      skills: { create: [{ skillId: skillROS.id }, { skillId: skillMATLAB.id }] },
      milestones: {
        create: [
          { title: 'Tranche 1: Quadrotor Flight Dynamics Simulation in Gazebo', status: 'Completed', dueDate: new Date('2024-12-15'), labId: labRobo_IITD.id, description: 'Wind shear and steep gradient kinematic validation.' },
          { title: 'Tranche 2: Dual LiDAR-Visual SLAM Payload Integration', status: 'Completed', dueDate: new Date('2025-05-20'), labId: labRobo_IITD.id, description: 'Sensor fusion board layout and flight controller firmware.' },
          { title: 'Tranche 3: Field Trials in Himachal Orchard Slopes', status: 'In Progress', dueDate: new Date('2025-11-15'), labId: labRobo_IITD.id, description: 'Real-world canopy penetration testing and crop health telemetry.' },
          { title: 'Tranche 4: Autonomous Fleet Collision Avoidance Demonstration', status: 'Pending', dueDate: new Date('2026-08-30'), description: 'Multi-UAV decentralized swarm coordination.' }
        ]
      },
      publications: {
        create: [
          {
            title: 'Adaptive Nonlinear Guidance for VTOL UAVs in Steep Terrains',
            journalName: 'IEEE Robotics and Automation Letters (RA-L)',
            publicationYear: 2024,
            doi: '10.1109/LRA.2024.3398110'
          }
        ]
      }
    }
  })

  // PROJECT 3: PROPOSED -> (Biotech / CRISPR, DST Grant, ₹2.40 Cr) - RICH SYNTHETIC DATA!
  const projBiotech = await prisma.researchProject.create({
    data: {
      projectTitle: 'Nanoparticle Encapsulated CRISPR Therapeutics for Metabolic Disorders',
      grantNumber: 'DST-BIO-2025-331',
      topDate: new Date('2024-11-15'),
      startDate: new Date('2025-02-01'),
      endDate: new Date('2029-01-31'),
      budget: 24000000.0,
      projectStatus: 'Proposed',
      leadProfessorId: rResMeera.id,
      departmentId: dBio_IISc.id,
      fundingAgencyId: faDST.id,
      domains: { create: [{ domainId: domainBiotech.id }] },
      skills: { create: [{ skillId: skillCRISPR.id }, { skillId: skillNanoparticles.id }] },
      milestones: {
        create: [
          {
            title: 'Tranche 1: Lipid Nanoparticle Synthesis & Encapsulation Assay',
            status: 'Completed',
            dueDate: new Date('2025-06-30'),
            labId: labBio_IISc.id,
            description: 'Microfluidic formulation of ionizable cationic liposomes with >92% mRNA loading efficiency.'
          },
          {
            title: 'Tranche 2: In-Vitro Cas9-gRNA Target Cleavage Kinetics',
            status: 'In Progress',
            dueDate: new Date('2025-12-15'),
            labId: labBio_IISc.id,
            description: 'Evaluation of genomic on-target indel frequencies vs off-target deep sequencing.'
          },
          {
            title: 'Tranche 3: Pre-Clinical Murine Pharmacokinetics & Biodistribution',
            status: 'Pending',
            dueDate: new Date('2026-10-30'),
            labId: labBio_IISc.id,
            description: 'Organ biodistribution, liver accumulation clearance, and serum cytokine profiling.'
          },
          {
            title: 'Tranche 4: GLP Toxicology Filing & Regulatory IND Dossier',
            status: 'Pending',
            dueDate: new Date('2028-06-30'),
            description: 'Final submission package to the Review Committee on Genetic Manipulation (RCGM).'
          }
        ]
      },
      publications: {
        create: [
          {
            title: 'Targeted Non-Viral Delivery of Ribonucleoprotein Complexes to Hepatocytes',
            journalName: 'Nature Biomedical Engineering',
            publicationYear: 2025,
            doi: '10.1038/s41551-025-01290-x'
          }
        ]
      },
      patents: {
        create: [
          {
            title: 'Novel Biodegradable Ionizable Lipids for In Vivo Nucleotide Transport',
            doi: '10.48550/patent.in.2025.99281',
            grantDate: new Date('2025-09-14')
          }
        ]
      },
      datasets: {
        create: [
          {
            title: 'CRISPR-Cas9 Indel Frequency Deep-Seq Profile Matrix',
            name: 'crispr_cleavage_matrix_v2.tar.gz',
            location: 'https://datasets.researchhub.ac.in/iisc-crispr-2025'
          }
        ]
      }
    }
  })

  // PROJECT 4: COMPLETED (Clean Energy, MNRE Grant, ₹1.95 Cr, 100% Expended)
  const projCleanEnergy = await prisma.researchProject.create({
    data: {
      projectTitle: 'Zero-Carbon Green Hydrogen via Tandem Perovskite Photoelectrochemical Cells',
      grantNumber: 'MNRE-HYDRO-2023-112',
      topDate: new Date('2023-01-15'),
      startDate: new Date('2023-04-01'),
      endDate: new Date('2025-09-30'),
      budget: 19500000.0,
      projectStatus: 'Completed',
      leadProfessorId: rProfArjun.id,
      departmentId: dEE_IITB.id,
      fundingAgencyId: faMNRE.id,
      domains: { create: [{ domainId: domainCleanEnergy.id }] },
      skills: { create: [{ skillId: skillElectrochemical.id }] },
      milestones: {
        create: [
          { title: 'Tranche 1: Perovskite Absorber Layer Optimization', status: 'Completed', dueDate: new Date('2023-10-31'), labId: labEnergy_IITB.id, description: 'Bandgap tuning for solar-to-hydrogen conversion efficiency >16%.' },
          { title: 'Tranche 2: Earth-Abundant Oxygen Evolution Catalysts', status: 'Completed', dueDate: new Date('2024-04-30'), labId: labEnergy_IITB.id, description: 'Nickel-iron layered double hydroxide catalyst coating.' },
          { title: 'Tranche 3: 1 kW Modular Photoelectrochemical Reactor Pilot', status: 'Completed', dueDate: new Date('2024-12-15'), labId: labEnergy_IITB.id, description: 'Continuous solar water splitting operation under outdoor natural sunlight.' },
          { title: 'Tranche 4: Final Technoeconomic Analysis & Ministry Handover', status: 'Completed', dueDate: new Date('2025-09-15'), description: 'Submission of LCOH (Levelized Cost of Hydrogen) benchmarking report to MNRE.' }
        ]
      },
      publications: {
        create: [
          {
            title: 'Unassisted Solar Water Splitting Exceeding 18% Efficiency Using Graded Perovskites',
            journalName: 'Energy & Environmental Science (RSC)',
            publicationYear: 2024,
            doi: '10.1039/D4EE01889K'
          },
          {
            title: 'Long-Term Durability Protocols for Sealed Photoelectrochemical Tandems',
            journalName: 'Advanced Energy Materials',
            publicationYear: 2025,
            doi: '10.1002/aenm.202404123'
          }
        ]
      },
      patents: {
        create: [
          {
            title: 'Tandem Photoelectrode Architecture with Corrosion-Resistant Metal Oxide Barrier',
            doi: '10.48550/patent.in.2024.44910',
            grantDate: new Date('2024-11-12')
          }
        ]
      },
      datasets: {
        create: [
          {
            title: '1,000-Hour Continuous Solar Hydrogen Production Telemetry',
            name: 'pec_hydrogen_1000hr_data.csv',
            location: 'https://datasets.researchhub.ac.in/mnre-hydro-iitb'
          }
        ]
      }
    }
  })

  // PROJECT 5: SANCTIONED (DRDO Grant, ₹4.50 Cr)
  const projDRDO = await prisma.researchProject.create({
    data: {
      projectTitle: 'Autonomous Deep-Sea Swarm Sonar for Continental Shelf Bathymetry',
      grantNumber: 'DRDO-CAR-2025-884',
      topDate: new Date('2024-08-10'),
      startDate: new Date('2025-06-01'),
      endDate: new Date('2028-05-31'),
      budget: 45000000.0,
      projectStatus: 'Sanctioned',
      leadProfessorId: rProfVikram.id,
      departmentId: dCS_IITD.id,
      fundingAgencyId: faDRDO.id,
      domains: { create: [{ domainId: domainRobotics.id }, { domainId: domainCyber.id }] },
      skills: { create: [{ skillId: skillROS.id }] },
      milestones: {
        create: [
          { title: 'Tranche 1: Hydrodynamic Pressure Hull & Propulsion Architecture', status: 'Completed', dueDate: new Date('2025-10-31'), labId: labRobo_IITD.id, description: 'Deep-submergence pressure vessel testing up to 1,500 meters depth.' },
          { title: 'Tranche 2: Acoustic Transceiver Array Signal Processing FPGA', status: 'In Progress', dueDate: new Date('2026-05-31'), labId: labRobo_IITD.id, description: 'Real-time beamforming algorithms for turbid underwater imaging.' },
          { title: 'Tranche 3: Cooperative Swarm Localization & Bathymetric Fusion', status: 'Pending', dueDate: new Date('2027-04-30'), description: 'Decentralized consensus protocol without GPS availability.' },
          { title: 'Tranche 4: Bay of Bengal Deep-Sea Sea-Trial Trials', status: 'Pending', dueDate: new Date('2028-03-31'), description: 'Deployment from Indian naval research vessel.' }
        ]
      }
    }
  })

  // PROJECT 6: UNDER REVIEW (SERB Grant, ₹3.20 Cr)
  const projSERBReview = await prisma.researchProject.create({
    data: {
      projectTitle: 'Solid-State Sodium-Ion Battery Architecture for Extreme-Temperature Grid Storage',
      grantNumber: 'SERB-CRG-2026-0412',
      topDate: new Date('2025-08-20'),
      startDate: new Date('2026-01-01'),
      endDate: new Date('2028-12-31'),
      budget: 32000000.0,
      projectStatus: 'Under Review',
      leadProfessorId: rProfArjun.id,
      departmentId: dEE_IITB.id,
      fundingAgencyId: faSERB.id,
      domains: { create: [{ domainId: domainCleanEnergy.id }] },
      skills: { create: [{ skillId: skillElectrochemical.id }] },
      milestones: {
        create: [
          { title: 'Tranche 1: Polymer-Ceramic Composite Electrolyte Synthesis', status: 'Pending', dueDate: new Date('2026-06-30'), labId: labEnergy_IITB.id, description: 'Synthesis of ionic conductors stable between -20°C and +70°C.' },
          { title: 'Tranche 2: High-Voltage Cathode Doping & Interface Passivation', status: 'Pending', dueDate: new Date('2027-02-28'), labId: labEnergy_IITB.id, description: 'Mitigation of dendrite growth across 2,000 charge cycles.' },
          { title: 'Tranche 3: Pouch-Cell Prototype Fabrication & Abuse Testing', status: 'Pending', dueDate: new Date('2028-08-31'), description: 'Overcharge, nail penetration, and thermal runaway testing.' }
        ]
      }
    }
  })

  // 9. Industry Collaborations
  await prisma.industryCollaboration.create({
    data: {
      industryId: indTata.id,
      projectId: projAI.id,
      researcherId: rProfRahul.id,
      collaborationType: 'Joint AI Lab Sponsorship & Ph.D. Fellowship',
      sinceDate: new Date('2025-01-20')
    }
  })

  await prisma.industryCollaboration.create({
    data: {
      industryId: indReliance.id,
      projectId: projCleanEnergy.id,
      researcherId: rProfArjun.id,
      collaborationType: 'Clean Tech Commercial Pilot License & Hydrogen Sponsoring',
      sinceDate: new Date('2024-05-10')
    }
  })

  // 10. Researcher Cross Collaborations
  await prisma.collaboration.create({
    data: {
      researcherId1: rProfRahul.id,
      researcherId2: rProfVikram.id,
      collaborationType: 'Multi-institutional Joint Autonomous Systems',
      sinceDate: new Date('2024-11-01')
    }
  })

  await prisma.collaboration.create({
    data: {
      researcherId1: rProfRahul.id,
      researcherId2: rResMeera.id,
      collaborationType: 'Interdisciplinary AI-Bio Informatics',
      sinceDate: new Date('2025-03-01')
    }
  })

  await prisma.collaboration.create({
    data: {
      researcherId1: rProfArjun.id,
      researcherId2: rProfRahul.id,
      collaborationType: 'Smart Grid AI Optimization & Renewable Forecasts',
      sinceDate: new Date('2024-08-15')
    }
  })

  console.log('✅ ResearchHub Seeding Complete with 6 Full Lifecycle Projects!')
  console.log('----------------------------------------------------')
  console.log('PROJECT STATUS PORTFOLIO:')
  console.log('1. Proposed:     Nanoparticle Encapsulated CRISPR (₹2.40 Cr - 4 Milestones, 1 Completed)')
  console.log('2. Under Review: Solid-State Sodium-Ion Battery (₹3.20 Cr - 3 Milestones)')
  console.log('3. Sanctioned:   Deep-Sea Swarm Sonar DRDO (₹4.50 Cr - 4 Milestones, 1 Completed)')
  console.log('4. Active:       Federated Edge-AI Systems (₹1.85 Cr - 4 Milestones, 1 Completed)')
  console.log('5. Active:       Autonomous Aerial Drones (₹1.20 Cr - 4 Milestones, 2 Completed)')
  console.log('6. Completed:    Zero-Carbon Green Hydrogen (₹1.95 Cr - 4 Milestones, 100% Completed)')
  console.log('----------------------------------------------------')
  console.log('DEMO ACCOUNTS READY:')
  console.log('1. Professor:        professor@researchhub.demo   / password123')
  console.log('2. Student:          student@researchhub.demo     / password123')
  console.log('3. Researcher:       researcher@researchhub.demo  / password123')
  console.log('4. Admin:            admin@researchhub.demo       / password123')
  console.log('5. Funding Agency:   funding@researchhub.demo     / password123')
  console.log('6. Industry Partner: industry@researchhub.demo    / password123')
  console.log('----------------------------------------------------')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
