import { PrismaClient } from '@prisma/client';
import { Role, ExamVendor, ExamType, QuestionType, DifficultyLevel, ExamStatus } from '../src/domain/types.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting NTMS Database Seeding for Requested Exam Tracks...');

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

  const qInterview2 = await prisma.question.create({
    data: {
      code: 'INT-QA-Q002',
      title: 'Terraform State File Locking Interview Question',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: DifficultyLevel.ADVANCED,
      points: 2.0,
      explanation: 'State locking prevents concurrent execution from corrupting state file. DynamoDB (AWS) or Blob Lease (Azure) are used for remote backends.',
      categoryId: catInterview.id,
      content: JSON.stringify({
        prompt: 'Which mechanisms ensure Terraform state file locking during team execution? (Select TWO)',
        options: [
          { id: 'opt1', text: 'Azure Blob Storage with native Blob Lease locking', isCorrect: true },
          { id: 'opt2', text: 'AWS S3 bucket combined with DynamoDB state table locking', isCorrect: true },
          { id: 'opt3', text: 'Git commit lock on local master branch' },
          { id: 'opt4', text: 'HTTP 404 response header' },
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
      description: 'Technical interview practice questions covering Azure Architecture, Terraform, and DevOps principles.',
      timeLimitMinutes: 45,
      passingScore: 75.0,
      creatorId: creatorUser.id,
      status: ExamStatus.PUBLISHED,
    },
  });

  const secInt = await prisma.examSection.create({
    data: { examId: examInterviewQA.id, title: 'Section 1: Architectural Q&A', orderIndex: 1 },
  });
  await prisma.sectionQuestion.create({ data: { sectionId: secInt.id, questionId: qInterview1.id, orderIndex: 1 } });
  await prisma.sectionQuestion.create({ data: { sectionId: secInt.id, questionId: qInterview2.id, orderIndex: 2 } });

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

  const qAZ900_2 = await prisma.question.create({
    data: {
      code: 'AZ900-Q002',
      title: 'Azure SLA Guarantees',
      type: QuestionType.TRUE_FALSE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Azure ExpressRoute connections do not traverse the public internet.',
      categoryId: catAzure.id,
      content: JSON.stringify({
        prompt: 'Azure ExpressRoute traffic traverses the public internet by default.',
        isTrueCorrect: false,
      }),
    },
  });

  const examAZ900 = await prisma.exam.create({
    data: {
      code: 'AZ-900',
      title: 'Microsoft Azure Fundamentals (AZ-900)',
      vendor: ExamVendor.MICROSOFT,
      examType: ExamType.CERTIFICATION,
      description: 'Demonstrate foundational knowledge of cloud concepts, Azure services, security, privacy, pricing, and support.',
      timeLimitMinutes: 60,
      passingScore: 70.0,
      creatorId: creatorUser.id,
      status: ExamStatus.PUBLISHED,
    },
  });

  const secAZ900 = await prisma.examSection.create({
    data: { examId: examAZ900.id, title: 'Section 1: General Cloud Concepts', orderIndex: 1 },
  });
  await prisma.sectionQuestion.create({ data: { sectionId: secAZ900.id, questionId: qAZ900_1.id, orderIndex: 1 } });
  await prisma.sectionQuestion.create({ data: { sectionId: secAZ900.id, questionId: qAZ900_2.id, orderIndex: 2 } });

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

  const qAZ104_2 = await prisma.question.create({
    data: {
      code: 'AZ104-Q002',
      title: 'Azure RBAC Custom Role Definition',
      type: QuestionType.FILL_IN_BLANK,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.5,
      explanation: 'Microsoft.Storage/storageAccounts/read grants read permissions to storage accounts.',
      categoryId: catAzure.id,
      content: JSON.stringify({
        prompt: 'In Azure RBAC JSON role definition, to grant permission to list storage keys, add action: "Microsoft.Storage/storageAccounts/[BLANK_1]/action".',
        blanks: [
          { id: 'BLANK_1', correctAnswers: ['listkeys', 'listKeys'] },
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
      description: 'Validate expertise in implementing, managing, and monitoring identity, governance, storage, compute, and virtual networks in Azure.',
      timeLimitMinutes: 120,
      passingScore: 70.0,
      creatorId: creatorUser.id,
      status: ExamStatus.PUBLISHED,
    },
  });

  const secAZ104 = await prisma.examSection.create({
    data: { examId: examAZ104.id, title: 'Section 1: Networking & Identity Management', orderIndex: 1 },
  });
  await prisma.sectionQuestion.create({ data: { sectionId: secAZ104.id, questionId: qAZ104_1.id, orderIndex: 1 } });
  await prisma.sectionQuestion.create({ data: { sectionId: secAZ104.id, questionId: qAZ104_2.id, orderIndex: 2 } });

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

  const qTF2 = await prisma.question.create({
    data: {
      code: 'TF-Q002',
      title: 'Terraform State Management Command',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'terraform state mv renames resources in state without destroying infrastructure.',
      categoryId: catDevOps.id,
      content: JSON.stringify({
        prompt: 'Which command refactors a resource inside the Terraform state file without destroying or recreating real infrastructure?',
        options: [
          { id: 'opt1', text: 'terraform refresh' },
          { id: 'opt2', text: 'terraform state mv', isCorrect: true },
          { id: 'opt3', text: 'terraform destroy --force' },
          { id: 'opt4', text: 'terraform import --overwrite' },
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
      description: 'Validate understanding of Infrastructure as Code (IaC) concepts, Terraform CLI, state management, modules, and Terraform Cloud.',
      timeLimitMinutes: 60,
      passingScore: 70.0,
      creatorId: creatorUser.id,
      status: ExamStatus.PUBLISHED,
    },
  });

  const secTF = await prisma.examSection.create({
    data: { examId: examTerraform.id, title: 'Section 1: Terraform Fundamentals & CLI', orderIndex: 1 },
  });
  await prisma.sectionQuestion.create({ data: { sectionId: secTF.id, questionId: qTF1.id, orderIndex: 1 } });
  await prisma.sectionQuestion.create({ data: { sectionId: secTF.id, questionId: qTF2.id, orderIndex: 2 } });

  // ==========================================
  // 5. AZURE RESOURCE SPECIFIC (Storage & VNet)
  // ==========================================
  const qResSpec1 = await prisma.question.create({
    data: {
      code: 'AZ-RES-Q001',
      title: 'Azure Storage Account Access Tier Matching',
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

  const qResSpec2 = await prisma.question.create({
    data: {
      code: 'AZ-RES-Q002',
      title: 'Azure Storage Private Endpoint vs VNet Service Endpoint',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.ADVANCED,
      points: 1.5,
      explanation: 'Private Endpoints assign a private IP address from your VNet to Azure Storage Blob service.',
      categoryId: catAzure.id,
      content: JSON.stringify({
        prompt: 'Which feature secures Azure Storage Account access by assigning a dedicated private IP address from your subnet directly to the storage service?',
        options: [
          { id: 'opt1', text: 'Azure Service Endpoint' },
          { id: 'opt2', text: 'Azure Private Endpoint (Private Link)', isCorrect: true },
          { id: 'opt3', text: 'Azure Storage Shared Access Signature (SAS)' },
          { id: 'opt4', text: 'Azure Application Gateway v2' },
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
      description: 'Grouped resource specialization focusing strictly on Azure Storage Accounts, Private Endpoints, VNets, Subnets, and Network Security Groups.',
      timeLimitMinutes: 45,
      passingScore: 80.0,
      creatorId: creatorUser.id,
      status: ExamStatus.PUBLISHED,
    },
  });

  const secResSpec = await prisma.examSection.create({
    data: { examId: examAzureResource.id, title: 'Section 1: Storage Account & VNet Configuration', orderIndex: 1 },
  });
  await prisma.sectionQuestion.create({ data: { sectionId: secResSpec.id, questionId: qResSpec1.id, orderIndex: 1 } });
  await prisma.sectionQuestion.create({ data: { sectionId: secResSpec.id, questionId: qResSpec2.id, orderIndex: 2 } });

  console.log('✅ All 5 Requested Exam Tracks Seeded Successfully:');
  console.log('   1. INTERVIEW-QA (Cloud & DevOps Practice)');
  console.log('   2. AZ-900 (Microsoft Azure Fundamentals)');
  console.log('   3. AZ-104 (Microsoft Azure Administrator)');
  console.log('   4. TF-ASSOC-003 (HashiCorp Certified Terraform Associate)');
  console.log('   5. AZ-RES-SPEC-01 (Azure Resource Specific: Storage & VNets)');
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
