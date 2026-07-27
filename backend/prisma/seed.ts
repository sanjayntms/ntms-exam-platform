import { PrismaClient } from '@prisma/client';
import { Role, ExamVendor, ExamType, QuestionType, DifficultyLevel, ExamStatus } from '../src/domain/types.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting NTMS Database Seeding with Drag & Drop Question Types...');

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.examAttempt.deleteMany();
  await prisma.sectionQuestion.deleteMany();
  await prisma.examSection.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.questionOnTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.question.deleteMany();
  await prisma.category.deleteMany();
  await prisma.caseStudy.deleteMany();
  await prisma.simulation.deleteMany();
  await prisma.lab.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@ntms.com',
      name: 'System Administrator',
      role: Role.ADMINISTRATOR,
      passwordHash: 'hashed_password_admin_123',
    },
  });

  const creatorUser = await prisma.user.create({
    data: {
      email: 'creator@ntms.com',
      name: 'Sarah Connor (Exam Author)',
      role: Role.EXAM_CREATOR,
      passwordHash: 'hashed_password_creator_123',
    },
  });

  const candidateUser = await prisma.user.create({
    data: {
      email: 'candidate@ntms.com',
      name: 'Alex Mercer (Candidate)',
      role: Role.CANDIDATE,
      passwordHash: 'hashed_password_candidate_123',
    },
  });

  const guestUser = await prisma.user.create({
    data: {
      email: 'guest@ntms.com',
      name: 'Guest User',
      role: Role.GUEST,
      passwordHash: 'hashed_password_guest_123',
    },
  });

  console.log('✅ Users created successfully.');

  // Create Categories
  const catAzure = await prisma.category.create({
    data: { name: 'Microsoft Azure Certification', description: 'AZ-900, AZ-104 & Resource Specifics' },
  });

  const catDevOps = await prisma.category.create({
    data: { name: 'Infrastructure as Code & DevOps', description: 'Terraform & Automation' },
  });

  const catInterview = await prisma.category.create({
    data: { name: 'Interview Preparation', description: 'Technical Q&A Practice' },
  });

  // ==========================================
  // 1. INTERVIEW QA EXAM TRACK
  // ==========================================
  const qInterview1 = await prisma.question.create({
    data: {
      code: 'INT-QA-Q001',
      title: 'Azure Active Directory vs Entra ID',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Microsoft renamed Azure AD to Microsoft Entra ID to encompass unified multicloud identity management.',
      categoryId: catInterview.id,
      content: JSON.stringify({
        prompt: 'In a Cloud Architect interview, you are asked: What is the primary architectural purpose of Microsoft Entra ID?',
        options: [
          { id: 'opt1', text: 'To manage hardware hypervisors in Azure datacenters' },
          { id: 'opt2', text: 'To provide cloud-based identity, single sign-on (SSO), and access management', isCorrect: true },
          { id: 'opt3', text: 'To act as a physical DNS server for local desktop clients' },
          { id: 'opt4', text: 'To encrypt Azure SQL Database backups automatically' },
        ],
      }),
    },
  });

  const qInterviewDD = await prisma.question.create({
    data: {
      code: 'INT-QA-DD01',
      title: 'DevOps & Architecture Drag and Drop',
      type: QuestionType.DRAG_AND_DROP,
      difficulty: DifficultyLevel.ADVANCED,
      points: 3.0,
      explanation: 'Drag each DevOps concept to its architectural definition.',
      categoryId: catInterview.id,
      content: JSON.stringify({
        prompt: 'Drag each DevOps concept from the pool on the left to its corresponding architectural definition on the right.',
        items: [
          { id: 'item1', label: 'CI/CD Pipeline' },
          { id: 'item2', label: 'Infrastructure as Code' },
          { id: 'item3', label: 'Blue-Green Deployment' },
        ],
        targets: [
          { id: 'target1', label: 'Declarative automated provisioning of cloud environments', correctItemId: 'item2' },
          { id: 'target2', label: 'Zero-downtime release switching between staging and production', correctItemId: 'item3' },
          { id: 'target3', label: 'Automated build, test, and software deployment workflow', correctItemId: 'item1' },
        ],
      }),
    },
  });

  const examInterviewQA = await prisma.exam.create({
    data: {
      code: 'INTERVIEW-QA',
      title: 'Interview QA: Cloud & DevOps Technical Practice',
      vendor: ExamVendor.CUSTOM,
      examType: ExamType.PRACTICE,
      description: 'Technical interview practice questions covering Azure Architecture, Terraform, and DevOps principles with Drag & Drop items.',
      timeLimitMinutes: 45,
      passingScore: 75.0,
      creatorId: creatorUser.id,
      status: ExamStatus.PUBLISHED,
    },
  });

  const secInt = await prisma.examSection.create({
    data: { examId: examInterviewQA.id, title: 'Section 1: Architectural Q&A & Drag & Drop', orderIndex: 1 },
  });
  await prisma.sectionQuestion.create({ data: { sectionId: secInt.id, questionId: qInterview1.id, orderIndex: 1 } });
  await prisma.sectionQuestion.create({ data: { sectionId: secInt.id, questionId: qInterviewDD.id, orderIndex: 2 } });

  // ==========================================
  // 2. AZ-900 EXAM TRACK
  // ==========================================
  const qAZ900_1 = await prisma.question.create({
    data: {
      code: 'AZ900-Q001',
      title: 'Azure Cloud Service Models (IaaS / PaaS / SaaS)',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'IaaS gives maximum control over virtual network and operating system infrastructure.',
      categoryId: catAzure.id,
      content: JSON.stringify({
        prompt: 'Which Azure cloud service model offers the highest level of flexibility and management control over your hardware resources?',
        options: [
          { id: 'opt1', text: 'Software as a Service (SaaS)' },
          { id: 'opt2', text: 'Platform as a Service (PaaS)' },
          { id: 'opt3', text: 'Infrastructure as a Service (IaaS)', isCorrect: true },
          { id: 'opt4', text: 'Serverless Functions' },
        ],
      }),
    },
  });

  const qAZ900_DD = await prisma.question.create({
    data: {
      code: 'AZ900-DD01',
      title: 'Azure SLA Availability Drag and Drop',
      type: QuestionType.DRAG_AND_DROP,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 2.5,
      explanation: 'Availability Zones offer 99.99% SLA, Availability Sets offer 99.95%, single Premium SSD VM offers 99.9%.',
      categoryId: catAzure.id,
      content: JSON.stringify({
        prompt: 'Drag each Azure SLA percentage from the left pool to its corresponding virtual machine deployment configuration on the right.',
        items: [
          { id: 'sla1', label: '99.99%' },
          { id: 'sla2', label: '99.9%' },
          { id: 'sla3', label: '99.95%' },
        ],
        targets: [
          { id: 'target1', label: 'Virtual Machines deployed across Availability Zones', correctItemId: 'sla1' },
          { id: 'target2', label: 'Single Virtual Machine with Premium SSD storage', correctItemId: 'sla2' },
          { id: 'target3', label: 'Virtual Machines deployed in an Availability Set', correctItemId: 'sla3' },
        ],
      }),
    },
  });

  const examAZ900 = await prisma.exam.create({
    data: {
      code: 'AZ-900',
      title: 'Microsoft Azure Fundamentals (AZ-900)',
      vendor: ExamVendor.MICROSOFT,
      examType: ExamType.CERTIFICATION,
      description: 'Demonstrate foundational knowledge of cloud concepts, Azure services, security, privacy, pricing, and SLA Drag & Drop items.',
      timeLimitMinutes: 60,
      passingScore: 70.0,
      creatorId: creatorUser.id,
      status: ExamStatus.PUBLISHED,
    },
  });

  const secAZ900 = await prisma.examSection.create({
    data: { examId: examAZ900.id, title: 'Section 1: General Cloud Concepts & SLAs', orderIndex: 1 },
  });
  await prisma.sectionQuestion.create({ data: { sectionId: secAZ900.id, questionId: qAZ900_1.id, orderIndex: 1 } });
  await prisma.sectionQuestion.create({ data: { sectionId: secAZ900.id, questionId: qAZ900_DD.id, orderIndex: 2 } });

  // ==========================================
  // 3. AZ-104 EXAM TRACK
  // ==========================================
  const qAZ104_1 = await prisma.question.create({
    data: {
      code: 'AZ104-Q001',
      title: 'Azure VNet Peering & Routing',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: DifficultyLevel.ADVANCED,
      points: 2.0,
      explanation: 'VNet peering links VNets directly via Azure backbone. Gateway transit allows spoke VNets to use hub VPN/ExpressRoute gateway.',
      categoryId: catAzure.id,
      content: JSON.stringify({
        prompt: 'You configure VNet Peering between VNetA and VNetB. Which settings must be enabled to allow VNetB resources to reach your on-premises network via VNetA VPN Gateway? (Select TWO)',
        options: [
          { id: 'opt1', text: 'Allow gateway transit on VNetA', isCorrect: true },
          { id: 'opt2', text: 'Use remote gateways on VNetB', isCorrect: true },
          { id: 'opt3', text: 'Enable DDoS Protection Network Plan on VNetB' },
          { id: 'opt4', text: 'Create an Public IP address on VNetB' },
        ],
      }),
    },
  });

  const qAZ104_DD = await prisma.question.create({
    data: {
      code: 'AZ104-DD01',
      title: 'Azure Networking Components Drag and Drop',
      type: QuestionType.DRAG_AND_DROP,
      difficulty: DifficultyLevel.ADVANCED,
      points: 3.0,
      explanation: 'UDR overrides system routes, Peering connects VNets, NSG filters ports.',
      categoryId: catAzure.id,
      content: JSON.stringify({
        prompt: 'Drag each Azure Networking component from the pool to its corresponding functional description on the right.',
        items: [
          { id: 'net1', label: 'User Defined Route (UDR)' },
          { id: 'net2', label: 'VNet Peering' },
          { id: 'net3', label: 'Network Security Group (NSG)' },
        ],
        targets: [
          { id: 'target1', label: 'Custom route table used to override default system routing', correctItemId: 'net1' },
          { id: 'target2', label: 'Private low-latency interconnection between two Virtual Networks', correctItemId: 'net2' },
          { id: 'target3', label: 'Stateful firewall rules filtering traffic at subnet or NIC level', correctItemId: 'net3' },
        ],
      }),
    },
  });

  const examAZ104 = await prisma.exam.create({
    data: {
      code: 'AZ-104',
      title: 'Microsoft Azure Administrator (AZ-104)',
      vendor: ExamVendor.MICROSOFT,
      examType: ExamType.CERTIFICATION,
      description: 'Validate expertise in implementing, managing, and monitoring identity, governance, storage, compute, and virtual networks with Drag & Drop items.',
      timeLimitMinutes: 120,
      passingScore: 70.0,
      creatorId: creatorUser.id,
      status: ExamStatus.PUBLISHED,
    },
  });

  const secAZ104 = await prisma.examSection.create({
    data: { examId: examAZ104.id, title: 'Section 1: Networking & Routing Drag & Drop', orderIndex: 1 },
  });
  await prisma.sectionQuestion.create({ data: { sectionId: secAZ104.id, questionId: qAZ104_1.id, orderIndex: 1 } });
  await prisma.sectionQuestion.create({ data: { sectionId: secAZ104.id, questionId: qAZ104_DD.id, orderIndex: 2 } });

  // ==========================================
  // 4. TERRAFORM ASSOCIATE EXAM TRACK
  // ==========================================
  const qTF1 = await prisma.question.create({
    data: {
      code: 'TF-Q001',
      title: 'Terraform Core Workflow Command Order',
      type: QuestionType.REORDER,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 2.0,
      explanation: 'Terraform core workflow: Write HCL -> terraform init -> terraform plan -> terraform apply.',
      categoryId: catDevOps.id,
      content: JSON.stringify({
        prompt: 'Arrange the core Terraform execution steps in the correct deployment sequence.',
        items: [
          { id: 's1', text: 'Write HCL configuration files (.tf)', correctOrder: 1 },
          { id: 's2', text: 'Run `terraform init` to download provider plugins', correctOrder: 2 },
          { id: 's3', text: 'Run `terraform plan` to create execution graph', correctOrder: 3 },
          { id: 's4', text: 'Run `terraform apply` to provision infrastructure', correctOrder: 4 },
        ],
      }),
    },
  });

  const qTF_DD = await prisma.question.create({
    data: {
      code: 'TF-DD01',
      title: 'Terraform HCL Blocks Drag and Drop',
      type: QuestionType.DRAG_AND_DROP,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 2.5,
      explanation: 'provider configures plugin, resource creates infrastructure, data queries existing infrastructure.',
      categoryId: catDevOps.id,
      content: JSON.stringify({
        prompt: 'Drag each Terraform block type from the left pool to its configuration purpose on the right.',
        items: [
          { id: 'block1', label: 'provider' },
          { id: 'block2', label: 'resource' },
          { id: 'block3', label: 'data' },
        ],
        targets: [
          { id: 'target1', label: 'Configures target platform API authentication and plugin binaries', correctItemId: 'block1' },
          { id: 'target2', label: 'Declares an infrastructure component to be created and managed', correctItemId: 'block2' },
          { id: 'target3', label: 'Queries an existing external infrastructure component for read-only attributes', correctItemId: 'block3' },
        ],
      }),
    },
  });

  const examTerraform = await prisma.exam.create({
    data: {
      code: 'TF-ASSOC-003',
      title: 'HashiCorp Certified: Terraform Associate',
      vendor: ExamVendor.CUSTOM,
      examType: ExamType.CERTIFICATION,
      description: 'Validate understanding of Infrastructure as Code (IaC) concepts, CLI commands, HCL blocks, and Drag & Drop items.',
      timeLimitMinutes: 60,
      passingScore: 70.0,
      creatorId: creatorUser.id,
      status: ExamStatus.PUBLISHED,
    },
  });

  const secTF = await prisma.examSection.create({
    data: { examId: examTerraform.id, title: 'Section 1: Terraform HCL & Core Workflow', orderIndex: 1 },
  });
  await prisma.sectionQuestion.create({ data: { sectionId: secTF.id, questionId: qTF1.id, orderIndex: 1 } });
  await prisma.sectionQuestion.create({ data: { sectionId: secTF.id, questionId: qTF_DD.id, orderIndex: 2 } });

  // ==========================================
  // 5. AZURE RESOURCE SPECIFIC (Storage & VNet)
  // ==========================================
  const qResSpec1 = await prisma.question.create({
    data: {
      code: 'AZ-RES-Q001',
      title: 'Azure Storage Access Tier Matching',
      type: QuestionType.MATCHING,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 2.0,
      explanation: 'Hot tier for active data, Cool for >30 days, Cold for >90 days, Archive for >180 days.',
      categoryId: catAzure.id,
      content: JSON.stringify({
        prompt: 'Match each Azure Storage Access Tier on the left to its optimal retention requirement on the right.',
        pairs: [
          { item: 'Hot Access Tier', target: 'Frequently accessed data' },
          { item: 'Cool Access Tier', target: 'Infrequently accessed data (stored min 30 days)' },
          { item: 'Cold Access Tier', target: 'Rarely accessed data (stored min 90 days)' },
          { item: 'Archive Access Tier', target: 'Offline data (stored min 180 days)' },
        ],
      }),
    },
  });

  const qResSpec_DD = await prisma.question.create({
    data: {
      code: 'AZ-RES-DD01',
      title: 'Azure Storage Account Performance Drag and Drop',
      type: QuestionType.DRAG_AND_DROP,
      difficulty: DifficultyLevel.ADVANCED,
      points: 3.0,
      explanation: 'Drag storage account types to performance tier requirements.',
      categoryId: catAzure.id,
      content: JSON.stringify({
        prompt: 'Drag each Azure Storage Account type from the pool on the left to its performance tier requirement on the right.',
        items: [
          { id: 'stg1', label: 'Standard General Purpose v2' },
          { id: 'stg2', label: 'Premium Block Blobs' },
          { id: 'stg3', label: 'Premium File Shares' },
        ],
        targets: [
          { id: 'target1', label: 'Ultra low-latency SSD storage for high transaction rates', correctItemId: 'stg2' },
          { id: 'target2', label: 'High-performance SMB/NFS enterprise file storage', correctItemId: 'stg3' },
          { id: 'target3', label: 'Cost-effective storage for blobs, tables, queues, and disks', correctItemId: 'stg1' },
        ],
      }),
    },
  });

  const examAzureResource = await prisma.exam.create({
    data: {
      code: 'AZ-RES-SPEC-01',
      title: 'Azure Resource Specific: Storage Accounts & Virtual Networks (VNets)',
      vendor: ExamVendor.MICROSOFT,
      examType: ExamType.PRACTICE,
      description: 'Grouped resource specialization focusing strictly on Azure Storage Accounts, Private Endpoints, VNets, Subnets, and Drag & Drop items.',
      timeLimitMinutes: 45,
      passingScore: 80.0,
      creatorId: creatorUser.id,
      status: ExamStatus.PUBLISHED,
    },
  });

  const secResSpec = await prisma.examSection.create({
    data: { examId: examAzureResource.id, title: 'Section 1: Storage & Network Drag and Drop Specialization', orderIndex: 1 },
  });
  await prisma.sectionQuestion.create({ data: { sectionId: secResSpec.id, questionId: qResSpec1.id, orderIndex: 1 } });
  await prisma.sectionQuestion.create({ data: { sectionId: secResSpec.id, questionId: qResSpec_DD.id, orderIndex: 2 } });

  console.log('✅ All 5 Exam Tracks updated with Drag & Drop Question Types:');
  console.log('   1. INTERVIEW-QA (INT-QA-DD01: DevOps Architecture Drag & Drop)');
  console.log('   2. AZ-900 (AZ900-DD01: Azure SLA Availability Drag & Drop)');
  console.log('   3. AZ-104 (AZ104-DD01: Azure Networking Drag & Drop)');
  console.log('   4. TF-ASSOC-003 (TF-DD01: Terraform HCL Blocks Drag & Drop)');
  console.log('   5. AZ-RES-SPEC-01 (AZ-RES-DD01: Azure Storage Performance Drag & Drop)');
  console.log('🎉 NTMS Database Seeding Complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
