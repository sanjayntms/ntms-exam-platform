import { PrismaClient } from '@prisma/client';
import { Role, ExamVendor, ExamType, QuestionType, DifficultyLevel, ExamStatus } from '../src/domain/types.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting NTMS Database Seeding with 25 AZ-900 Questions & Answers...');

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

  const entraUser = await prisma.user.create({
    data: {
      email: 'sanjay@ntmsentra.onmicrosoft.com',
      name: 'NTMS Admin (Sanjay Dubey)',
      role: Role.ADMINISTRATOR,
      entraId: 'entra-oid-1785128225225',
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
  // 2. AZ-900 EXAM TRACK (25 COMPREHENSIVE QUESTIONS)
  // ==========================================
  const az900QuestionsData = [
    {
      code: 'AZ900-Q001',
      title: 'Azure Cloud Service Models (IaaS / PaaS / SaaS)',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'IaaS gives maximum control over virtual network and operating system infrastructure.',
      prompt: 'Which Azure cloud service model offers the highest level of flexibility and management control over your hardware resources?',
      options: [
        { id: 'opt1', text: 'Software as a Service (SaaS)' },
        { id: 'opt2', text: 'Platform as a Service (PaaS)' },
        { id: 'opt3', text: 'Infrastructure as a Service (IaaS)', isCorrect: true },
        { id: 'opt4', text: 'Serverless Functions' },
      ],
    },
    {
      code: 'AZ900-Q002',
      title: 'CapEx vs OpEx in Cloud Computing',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Public cloud computing transforms capital expenditure (CapEx) into operating expenditure (OpEx) with pay-as-you-go pricing.',
      prompt: 'Which cloud computing model converts upfront capital expenditure (CapEx) into flexible operating expenditure (OpEx)?',
      options: [
        { id: 'opt1', text: 'Public Cloud', isCorrect: true },
        { id: 'opt2', text: 'On-Premises Datacenter' },
        { id: 'opt3', text: 'Private Cloud' },
        { id: 'opt4', text: 'Local SAN Infrastructure' },
      ],
    },
    {
      code: 'AZ900-Q003',
      title: 'Azure Availability Zones High Availability',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Availability Zones protect applications from physical datacenter failures within the same Azure region.',
      prompt: 'What is the primary purpose of deploying resources across multiple Availability Zones in an Azure region?',
      options: [
        { id: 'opt1', text: 'To protect applications from physical datacenter outages', isCorrect: true },
        { id: 'opt2', text: 'To decrease global network latency for international users' },
        { id: 'opt3', text: 'To automate subscription billing limits' },
        { id: 'opt4', text: 'To manage local DNS resolution' },
      ],
    },
    {
      code: 'AZ900-Q004',
      title: 'Azure Functions Serverless Execution',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure Functions is a serverless compute service that executes event-driven code without managing underlying servers.',
      prompt: 'Your team needs to run code in response to events without managing any virtual machines or server infrastructure. Which service should you use?',
      options: [
        { id: 'opt1', text: 'Azure Functions', isCorrect: true },
        { id: 'opt2', text: 'Azure Virtual Machines' },
        { id: 'opt3', text: 'Azure Batch' },
        { id: 'opt4', text: 'Azure Virtual Machine Scale Sets' },
      ],
    },
    {
      code: 'AZ900-Q005',
      title: 'Azure Blob Storage Access Tiers',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Cool tier is optimized for storing data that is accessed infrequently and stored for at least 30 days.',
      prompt: 'Which Azure Blob Storage access tier is optimized for storing data that is accessed infrequently and stored for at least 30 days?',
      options: [
        { id: 'opt1', text: 'Cool Access Tier', isCorrect: true },
        { id: 'opt2', text: 'Hot Access Tier' },
        { id: 'opt3', text: 'Archive Access Tier' },
        { id: 'opt4', text: 'Premium Tier' },
      ],
    },
    {
      code: 'AZ900-Q006',
      title: 'Microsoft Entra ID Identity Management',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Microsoft Entra ID provides cloud-based identity, single sign-on (SSO), and multi-factor authentication (MFA).',
      prompt: 'Which Azure service provides cloud identity management, single sign-on (SSO), and multi-factor authentication (MFA)?',
      options: [
        { id: 'opt1', text: 'Microsoft Entra ID', isCorrect: true },
        { id: 'opt2', text: 'Azure Key Vault' },
        { id: 'opt3', text: 'Azure Firewall' },
        { id: 'opt4', text: 'Network Security Group' },
      ],
    },
    {
      code: 'AZ900-Q007',
      title: 'Azure Policy Governance Enforcements',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure Policy enforces organizational standards and assesses compliance across Azure resources.',
      prompt: 'You need to prevent developers from creating Virtual Machines of specific expensive SKU sizes in an Azure subscription. Which service should you use?',
      options: [
        { id: 'opt1', text: 'Azure Policy', isCorrect: true },
        { id: 'opt2', text: 'Role-Based Access Control (RBAC)' },
        { id: 'opt3', text: 'Resource Locks' },
        { id: 'opt4', text: 'Azure Monitor' },
      ],
    },
    {
      code: 'AZ900-Q008',
      title: 'Azure Advisor Cost & Security Optimization',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Azure Advisor analyzes resource configurations and telemetry to offer recommendations on cost, performance, and security.',
      prompt: 'Which Azure service provides personalized recommendations to optimize costs, enhance security, and improve performance?',
      options: [
        { id: 'opt1', text: 'Azure Advisor', isCorrect: true },
        { id: 'opt2', text: 'Azure Service Health' },
        { id: 'opt3', text: 'Azure Monitor' },
        { id: 'opt4', text: 'Azure Cost Management' },
      ],
    },
    {
      code: 'AZ900-Q009',
      title: 'Azure ExpressRoute Dedicated Connections',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'ExpressRoute extends on-premises networks into Microsoft cloud over a private connection without traversing public internet.',
      prompt: 'Which Azure service provides a dedicated private connection between your on-premises datacenter and Azure without using public internet?',
      options: [
        { id: 'opt1', text: 'Azure ExpressRoute', isCorrect: true },
        { id: 'opt2', text: 'Azure VPN Gateway' },
        { id: 'opt3', text: 'VNet Peering' },
        { id: 'opt4', text: 'Azure Traffic Manager' },
      ],
    },
    {
      code: 'AZ900-Q010',
      title: 'Azure Key Vault Secrets & Certificate Management',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Azure Key Vault securely stores secrets, passwords, database connection strings, and SSL certificates.',
      prompt: 'Which Azure service is designed to securely store and manage application API keys, connection strings, and certificates?',
      options: [
        { id: 'opt1', text: 'Azure Key Vault', isCorrect: true },
        { id: 'opt2', text: 'Azure Storage Account' },
        { id: 'opt3', text: 'Azure Security Center' },
        { id: 'opt4', text: 'Microsoft Entra ID' },
      ],
    },
    {
      code: 'AZ900-Q011',
      title: 'Azure Storage Redundancy (LRS vs ZRS vs GRS)',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Geo-Redundant Storage (GRS) replicates data synchronously three times within the primary region, then asynchronously to a secondary region hundreds of miles away.',
      prompt: 'Which Azure storage redundancy option replicates your data to a secondary region hundreds of miles away from the primary location to protect against regional disasters?',
      options: [
        { id: 'opt1', text: 'Geo-Redundant Storage (GRS)', isCorrect: true },
        { id: 'opt2', text: 'Locally Redundant Storage (LRS)' },
        { id: 'opt3', text: 'Zone-Redundant Storage (ZRS)' },
        { id: 'opt4', text: 'Read-Access Local Storage' },
      ],
    },
    {
      code: 'AZ900-Q012',
      title: 'Azure Resource Groups Containers',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'A Resource Group is a logical container that holds related resources for an Azure solution.',
      prompt: 'What is the logical container used in Azure to manage and group related resources for a single application deployment?',
      options: [
        { id: 'opt1', text: 'Resource Group', isCorrect: true },
        { id: 'opt2', text: 'Management Group' },
        { id: 'opt3', text: 'Azure Subscription' },
        { id: 'opt4', text: 'Availability Zone' },
      ],
    },
    {
      code: 'AZ900-Q013',
      title: 'Azure Subscriptions Billing Boundaries',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'An Azure Subscription acts as both an identity boundary and a billing boundary for Azure resource usage.',
      prompt: 'What serves as the primary billing boundary and access control container in Azure?',
      options: [
        { id: 'opt1', text: 'Azure Subscription', isCorrect: true },
        { id: 'opt2', text: 'Resource Group' },
        { id: 'opt3', text: 'Tenant ID' },
        { id: 'opt4', text: 'Management Group' },
      ],
    },
    {
      code: 'AZ900-Q014',
      title: 'Azure Management Groups Hierarchy',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Management Groups provide a governance scope above subscriptions to apply policies and compliance rules across multiple subscriptions.',
      prompt: 'Your enterprise has 20 Azure subscriptions. You need to apply a single security policy across all subscriptions. Which container hierarchy should you use?',
      options: [
        { id: 'opt1', text: 'Management Group', isCorrect: true },
        { id: 'opt2', text: 'Resource Group' },
        { id: 'opt3', text: 'Virtual Network' },
        { id: 'opt4', text: 'Azure App Service Plan' },
      ],
    },
    {
      code: 'AZ900-Q015',
      title: 'Azure Cosmos DB Globally Distributed NoSQL',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure Cosmos DB is a fully managed, globally distributed NoSQL database service offering single-digit millisecond latency worldwide.',
      prompt: 'Which Azure database service offers globally distributed, multi-model NoSQL capabilities with guaranteed single-digit millisecond latency?',
      options: [
        { id: 'opt1', text: 'Azure Cosmos DB', isCorrect: true },
        { id: 'opt2', text: 'Azure SQL Database' },
        { id: 'opt3', text: 'Azure Database for PostgreSQL' },
        { id: 'opt4', text: 'Azure Managed Instance' },
      ],
    },
    {
      code: 'AZ900-Q016',
      title: 'Azure Virtual Machines Infrastructure as a Service',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Azure Virtual Machines (VMs) provide IaaS compute resources on demand.',
      prompt: 'Which Azure compute service allows you to configure custom operating system patches, custom OS images, and full root administrative access?',
      options: [
        { id: 'opt1', text: 'Azure Virtual Machines', isCorrect: true },
        { id: 'opt2', text: 'Azure App Service' },
        { id: 'opt3', text: 'Azure Functions' },
        { id: 'opt4', text: 'Azure Static Web Apps' },
      ],
    },
    {
      code: 'AZ900-Q017',
      title: 'Azure Kubernetes Service (AKS) Container Orchestration',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'AKS is a managed Kubernetes container orchestration service in Azure.',
      prompt: 'Which Azure service simplifies deploying, managing, and scaling containerized microservices applications using Kubernetes?',
      options: [
        { id: 'opt1', text: 'Azure Kubernetes Service (AKS)', isCorrect: true },
        { id: 'opt2', text: 'Azure Container Instances (ACI)' },
        { id: 'opt3', text: 'Azure Service Fabric' },
        { id: 'opt4', text: 'Azure Batch' },
      ],
    },
    {
      code: 'AZ900-Q018',
      title: 'Azure Virtual Network (VNet) Isolation',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'An Azure Virtual Network (VNet) provides private IP address network isolation for Azure resources.',
      prompt: 'Which building block provides private IP network isolation for your Azure resources in the cloud?',
      options: [
        { id: 'opt1', text: 'Azure Virtual Network (VNet)', isCorrect: true },
        { id: 'opt2', text: 'Azure ExpressRoute' },
        { id: 'opt3', text: 'Azure Front Door' },
        { id: 'opt4', text: 'Azure Traffic Manager' },
      ],
    },
    {
      code: 'AZ900-Q019',
      title: 'Network Security Group (NSG) Stateful Filtering',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Network Security Groups (NSGs) filter network traffic to and from Azure resources in an Azure Virtual Network.',
      prompt: 'Which security feature allows you to filter network traffic to and from subnets or network interfaces (NICs) based on port and IP rules?',
      options: [
        { id: 'opt1', text: 'Network Security Group (NSG)', isCorrect: true },
        { id: 'opt2', text: 'Azure Application Gateway' },
        { id: 'opt3', text: 'Azure DDoS Protection' },
        { id: 'opt4', text: 'Azure DNS' },
      ],
    },
    {
      code: 'AZ900-Q020',
      title: 'Azure Firewall Cloud Native Security',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure Firewall is a managed, cloud-based network security service that protects your Azure Virtual Network resources.',
      prompt: 'Which service is a fully stateful, cloud-native firewall that provides high availability and threat intelligence across virtual networks?',
      options: [
        { id: 'opt1', text: 'Azure Firewall', isCorrect: true },
        { id: 'opt2', text: 'Network Security Group (NSG)' },
        { id: 'opt3', text: 'Azure WAF' },
        { id: 'opt4', text: 'Azure Bastion' },
      ],
    },
    {
      code: 'AZ900-Q021',
      title: 'Azure Resource Locks (CanNotDelete vs ReadOnly)',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'A CanNotDelete resource lock allows authorized users to read and modify a resource, but prevents them from deleting it.',
      prompt: 'What type of Azure Resource Lock allows administrators to modify and update resources, but prevents them from deleting the resource?',
      options: [
        { id: 'opt1', text: 'CanNotDelete (Delete lock)', isCorrect: true },
        { id: 'opt2', text: 'ReadOnly lock' },
        { id: 'opt3', text: 'Azure Policy Lock' },
        { id: 'opt4', text: 'Subscription Lock' },
      ],
    },
    {
      code: 'AZ900-Q022',
      title: 'Azure Cost Management & Budgets',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Azure Cost Management allows you to create spending budgets and receive alerts when spending exceeds thresholds.',
      prompt: 'Which tool allows you to monitor cloud spending, set automated budget thresholds, and trigger email alerts when costs exceed limits?',
      options: [
        { id: 'opt1', text: 'Azure Cost Management & Budgets', isCorrect: true },
        { id: 'opt2', text: 'Pricing Calculator' },
        { id: 'opt3', text: 'TCO Calculator' },
        { id: 'opt4', text: 'Azure Billing Invoice' },
      ],
    },
    {
      code: 'AZ900-Q023',
      title: 'Azure Service Health Outage Alerts',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Azure Service Health provides a personalized view of the health of your specific Azure services and region incidents.',
      prompt: 'Where should you check to view personalized notifications regarding Azure outages, planned maintenance, and health advisories affecting your specific resources?',
      options: [
        { id: 'opt1', text: 'Azure Service Health', isCorrect: true },
        { id: 'opt2', text: 'Azure Status Page' },
        { id: 'opt3', text: 'Azure Monitor' },
        { id: 'opt4', text: 'Azure Advisor' },
      ],
    },
    {
      code: 'AZ900-Q024',
      title: 'Azure Monitor Telemetry & Log Analytics',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure Monitor maximizes availability and performance of applications by collecting and analyzing telemetry data.',
      prompt: 'Which service acts as the central data collector for metrics, logs, and performance telemetry from Azure and hybrid resources?',
      options: [
        { id: 'opt1', text: 'Azure Monitor', isCorrect: true },
        { id: 'opt2', text: 'Azure Inspector' },
        { id: 'opt3', text: 'Azure Security Center' },
        { id: 'opt4', text: 'Azure Log Vault' },
      ],
    },
  ];

  const seededAZ900Questions = [];
  for (const qData of az900QuestionsData) {
    const q = await prisma.question.create({
      data: {
        code: qData.code,
        title: qData.title,
        type: qData.type,
        difficulty: qData.difficulty,
        points: qData.points,
        explanation: qData.explanation,
        categoryId: catAzure.id,
        content: JSON.stringify({
          prompt: qData.prompt,
          options: qData.options,
        }),
      },
    });
    seededAZ900Questions.push(q);
  }

  // Question 25: Interactive Drag & Drop SLA Question
  const qAZ900_DD = await prisma.question.create({
    data: {
      code: 'AZ900-Q025',
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
  seededAZ900Questions.push(qAZ900_DD);

  const examAZ900 = await prisma.exam.create({
    data: {
      code: 'AZ-900',
      title: 'Microsoft Azure Fundamentals (AZ-900)',
      vendor: ExamVendor.MICROSOFT,
      examType: ExamType.CERTIFICATION,
      description: 'Demonstrate foundational knowledge of cloud concepts, Azure architecture, services, security, privacy, pricing, and SLAs with 25 practice questions.',
      timeLimitMinutes: 60,
      passingScore: 70.0,
      creatorId: creatorUser.id,
      status: ExamStatus.PUBLISHED,
    },
  });

  const secAZ900 = await prisma.examSection.create({
    data: { examId: examAZ900.id, title: 'Section 1: General Cloud Concepts & Azure Services', orderIndex: 1 },
  });

  let order = 1;
  for (const q of seededAZ900Questions) {
    await prisma.sectionQuestion.create({ data: { sectionId: secAZ900.id, questionId: q.id, orderIndex: order++ } });
  }

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

  console.log(`✅ Successfully seeded ALL ${seededAZ900Questions.length} AZ-900 practice questions into AZ-900 track!`);
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
