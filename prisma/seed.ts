import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting ResearchHub Database Seeding...')

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

  const indTata = await prisma.industry.create({
    data: { name: 'Tata Consultancy Services Research', industryType: 'IT & AI Research', website: 'https://tcs.com/research', contactEmail: 'research@tcs.com', phone: '+91-22-6778-9999' }
  })
  const indReliance = await prisma.industry.create({
    data: { name: 'Reliance New Energy Ltd', industryType: 'Clean Tech & Energy Storage', website: 'https://ril.com', contactEmail: 'cleanenergy@ril.com' }
  })

  // 7. Researchers (Professors, Students, Researchers, Admins)

  // DEMO PROFESSOR 1
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

  // DEMO STUDENT 1
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

  // DEMO PROFESSOR 2 (IIT Delhi)
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

  // DEMO RESEARCHER (IISc)
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
      skills: { create: [{ skillId: skillCRISPR.id }] },
      domains: { create: [{ domainId: domainBiotech.id }] }
    }
  })

  // ADMIN USER
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

  // FUNDING AGENCY USER
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

  // INDUSTRY USER
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

  // 8. Research Projects
  const projAI = await prisma.researchProject.create({
    data: {
      projectTitle: 'Federated Edge-AI Systems for Post-Quantum Smart Grids',
      grantNumber: 'DST-CS-2025-089',
      topDate: new Date('2024-10-01'),
      startDate: new Date('2025-01-15'),
      endDate: new Date('2028-01-14'),
      budget: 18500000.0, // 1.85 Cr INR
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
          { title: 'Literature Review & Theoretical Architecture', status: 'Completed', dueDate: new Date('2025-04-30'), labId: labAI_IITB.id },
          { title: 'Post-Quantum Protocol Implementation', status: 'In Progress', dueDate: new Date('2025-11-30'), labId: labAI_IITB.id },
          { title: 'Hardware Simulation & Testbed Deployment', status: 'Pending', dueDate: new Date('2026-06-30') }
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
          { title: 'Quadrotor Flight Dynamics Simulation in Gazebo', status: 'Completed', dueDate: new Date('2024-12-15'), labId: labRobo_IITD.id },
          { title: 'LiDAR Terrain Mapping Field Trials', status: 'In Progress', dueDate: new Date('2025-09-15'), labId: labRobo_IITD.id }
        ]
      }
    }
  })

  const projBiotech = await prisma.researchProject.create({
    data: {
      projectTitle: 'Nanoparticle Encapulated CRISPR Therapeutics for Metabolic Disorders',
      grantNumber: 'DST-BIO-2025-331',
      startDate: new Date('2025-02-01'),
      endDate: new Date('2029-01-31'),
      budget: 24000000.0,
      projectStatus: 'Proposed',
      leadProfessorId: rResMeera.id,
      departmentId: dBio_IISc.id,
      fundingAgencyId: faDST.id,
      domains: { create: [{ domainId: domainBiotech.id }] },
      skills: { create: [{ skillId: skillCRISPR.id }] }
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

  // 10. Researcher Collaborations (Recursive)
  await prisma.collaboration.create({
    data: {
      researcherId1: rProfRahul.id,
      researcherId2: rProfVikram.id,
      collaborationType: 'Multi-institutional Joint R&D Project',
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

  console.log('✅ ResearchHub Seeding Complete!')
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
