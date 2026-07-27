import { PrismaClient } from '@prisma/client';
import { Role, ExamVendor, ExamType, QuestionType, DifficultyLevel, ExamStatus } from '../src/domain/types.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting NTMS Database Seeding with ALL 5 Certification Tracks (AZ-305, AZ-104, AI-901, AI-900, AZ-900)...');

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
    data: { name: 'Microsoft Azure Certification', description: 'AZ-305, AZ-104, AZ-900, AI-900 & AI-901 Tracks' },
  });

  // Helper function for bulk track seeding
  async function seedTrack(questionsData: any[], dragDropData: any[], reorderData: any[], dropdownData: any[], multiData: any[], categoryId: string) {
    const list: any[] = [];
    for (const qData of questionsData) {
      const q = await prisma.question.create({
        data: {
          code: qData.code,
          title: qData.title,
          type: qData.type,
          difficulty: qData.difficulty,
          points: qData.points,
          explanation: qData.explanation,
          categoryId: categoryId,
          content: JSON.stringify({
            prompt: qData.prompt,
            options: qData.options,
          }),
        },
      });
      list.push(q);
    }
    for (const ddData of dragDropData) {
      const q = await prisma.question.create({
        data: {
          code: ddData.code,
          title: ddData.title,
          type: QuestionType.DRAG_AND_DROP,
          difficulty: ddData.difficulty || DifficultyLevel.ADVANCED,
          points: ddData.points || 2.5,
          explanation: ddData.explanation,
          categoryId: categoryId,
          content: JSON.stringify({
            prompt: ddData.prompt,
            items: ddData.items,
            targets: ddData.targets,
          }),
        },
      });
      list.push(q);
    }
    for (const rData of reorderData) {
      const q = await prisma.question.create({
        data: {
          code: rData.code,
          title: rData.title,
          type: QuestionType.REORDER,
          difficulty: rData.difficulty || DifficultyLevel.ADVANCED,
          points: rData.points || 2.5,
          explanation: rData.explanation,
          categoryId: categoryId,
          content: JSON.stringify({
            prompt: rData.prompt,
            items: rData.items,
          }),
        },
      });
      list.push(q);
    }
    for (const dData of dropdownData) {
      const q = await prisma.question.create({
        data: {
          code: dData.code,
          title: dData.title,
          type: QuestionType.DROPDOWN,
          difficulty: dData.difficulty || DifficultyLevel.INTERMEDIATE,
          points: dData.points || 2.0,
          explanation: dData.explanation,
          categoryId: categoryId,
          content: JSON.stringify({
            prompt: dData.prompt,
            questions: dData.questions,
          }),
        },
      });
      list.push(q);
    }
    for (const mData of multiData) {
      const q = await prisma.question.create({
        data: {
          code: mData.code,
          title: mData.title,
          type: QuestionType.MULTIPLE_CHOICE,
          difficulty: mData.difficulty || DifficultyLevel.ADVANCED,
          points: mData.points || 2.0,
          explanation: mData.explanation,
          categoryId: categoryId,
          content: JSON.stringify({
            prompt: mData.prompt,
            options: mData.options,
          }),
        },
      });
      list.push(q);
    }
    return list;
  }

  // ==========================================
  // 1. AZ-305 EXAM TRACK (BRAND NEW SOLUTIONS ARCHITECT EXPERT)
  // ==========================================
  const az305Single = [
    {
      code: 'AZ305-Q001',
      title: 'Architectural Data Design - High-Scale OLTP Database Selection',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.ADVANCED,
      points: 1.0,
      explanation: 'Azure SQL Database Hyperscale tier supports database sizes up to 100 TB with rapid auto-scaling and fast storage snapshots.',
      prompt: 'You are designing an enterprise relational database architecture. The application requires an OLTP database that can auto-scale up to 100 TB without performance degradation or manual sharding. Which database service tier should you recommend?',
      options: [
        { id: 'opt1', text: 'Azure SQL Database Hyperscale Tier', isCorrect: true },
        { id: 'opt2', text: 'Azure SQL Database General Purpose Tier' },
        { id: 'opt3', text: 'Azure Database for PostgreSQL Single Server' },
        { id: 'opt4', text: 'Azure Cosmos DB Core SQL API' },
      ],
    },
    {
      code: 'AZ305-Q002',
      title: 'Identity Architecture - B2B vs External Tenant Design',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.ADVANCED,
      points: 1.0,
      explanation: 'Entra External ID / B2C allows external customer authentication via social identity providers (Google, Facebook, Apple) without polluting internal corporate directory.',
      prompt: 'You are designing an authentication solution for a new customer-facing mobile portal. The solution must allow external consumer users to sign up using Google or Apple IDs while ensuring external users cannot access internal corporate Microsoft Entra tenant resources. Which service should you recommend?',
      options: [
        { id: 'opt1', text: 'Microsoft Entra External ID / Azure AD B2C', isCorrect: true },
        { id: 'opt2', text: 'Microsoft Entra ID B2B Direct Collaboration' },
        { id: 'opt3', text: 'Managed Identity for Azure Resources' },
        { id: 'opt4', text: 'Azure Key Vault Certificates' },
      ],
    },
    {
      code: 'AZ305-Q003',
      title: 'Disaster Recovery Design - Multi-Region Active-Active SQL Failover',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.ADVANCED,
      points: 1.0,
      explanation: 'Auto-Failover Groups support multi-region database failover with read-write endpoints automatically updated by Azure.',
      prompt: 'You are designing a high availability database architecture for an e-commerce platform across East US and West US regions. In the event of a regional datacenter disaster, the database failover must occur automatically with an RTO of under 30 seconds and minimal RPO. What feature should you include in the design?',
      options: [
        { id: 'opt1', text: 'Azure SQL Database Auto-Failover Groups', isCorrect: true },
        { id: 'opt2', text: 'Geo-Redundant Backup Restoration' },
        { id: 'opt3', text: 'Azure Site Recovery VM Failover' },
        { id: 'opt4', text: 'Azure Blob Storage Read-Access Replication' },
      ],
    },
    {
      code: 'AZ305-Q004',
      title: 'Hybrid Network Architecture - Encrypted ExpressRoute Design',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.ADVANCED,
      points: 1.0,
      explanation: 'ExpressRoute Direct with MACsec or IPsec VPN over ExpressRoute private peering provides high-throughput end-to-end encryption.',
      prompt: 'Your organization requires a dedicated 10 Gbps private connection between your on-premises datacenter and Azure. All data in transit must be encrypted using IPsec encryption over the private link to meet strict financial compliance. Which network architecture meets the requirement?',
      options: [
        { id: 'opt1', text: 'An IPsec VPN connection configured over an ExpressRoute Private Peering connection', isCorrect: true },
        { id: 'opt2', text: 'Standard Azure ExpressRoute without VPN Gateway' },
        { id: 'opt3', text: 'Azure Front Door with Custom SSL certificates' },
        { id: 'opt4', text: 'VNet-to-VNet Peering' },
      ],
    },
    {
      code: 'AZ305-Q005',
      title: 'Application Architecture - AKS Microservices Ingress Design',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.ADVANCED,
      points: 1.0,
      explanation: 'Azure Application Gateway Ingress Controller (AGIC) provides Layer 7 load balancing, SSL offloading, and WAF protection for AKS microservices.',
      prompt: 'You are designing a containerized microservices platform on Azure Kubernetes Service (AKS). You need to implement URL-based routing, SSL termination, and Web Application Firewall (WAF) protection for external incoming HTTP traffic directly at the ingress level. What should you recommend?',
      options: [
        { id: 'opt1', text: 'Application Gateway Ingress Controller (AGIC)', isCorrect: true },
        { id: 'opt2', text: 'Azure Internal Load Balancer' },
        { id: 'opt3', text: 'Azure Traffic Manager' },
        { id: 'opt4', text: 'Azure Network Security Group' },
      ],
    },
  ];

  const az305DragDrop = [
    {
      code: 'AZ305-Q020',
      title: 'AZ-305 Storage Architecture Match Drag and Drop',
      prompt: 'Drag each Azure storage service from the left pool to its corresponding architectural requirement on the right.',
      items: [
        { id: 's1', label: 'Azure Cosmos DB' },
        { id: 's2', label: 'Azure Blob Storage Archive Tier' },
        { id: 's3', label: 'Azure SQL Managed Instance' },
      ],
      targets: [
        { id: 'target1', label: 'Globally distributed NoSQL database with single-digit millisecond latency guarantees', correctItemId: 's1' },
        { id: 'target2', label: 'Lowest cost storage for long-term compliance backups stored offline for 7 years', correctItemId: 's2' },
        { id: 'target3', label: 'Near 100% SQL Server engine compatibility for migrating legacy SQL Server workloads', correctItemId: 's3' },
      ],
    },
  ];

  const az305Reorder = [
    {
      code: 'AZ305-Q021',
      title: 'Sequence Azure Regional Disaster Recovery Failover Architecture',
      prompt: 'Arrange the following steps in the correct order to execute an automated multi-region failover during a primary datacenter outage.',
      items: [
        { id: 'step1', text: 'Step 1: Azure Front Door / Traffic Manager health probe detects primary region endpoint failure' },
        { id: 'step2', text: 'Step 2: Traffic Manager automatically updates DNS routing to point to secondary region' },
        { id: 'step3', text: 'Step 3: Azure SQL Auto-Failover Group promotes secondary database to Read-Write primary' },
        { id: 'step4', text: 'Step 4: Secondary region App Service / AKS cluster handles full application load' },
      ],
    },
  ];

  const az305Dropdown = [
    {
      code: 'AZ305-Q022',
      title: 'Azure Solutions Architect Database Selection Dropdown',
      prompt: 'Select the optimal Azure database SKU for each enterprise architectural scenario.',
      questions: [
        {
          id: 'q1',
          text: 'Global NoSQL multi-master write workload:',
          options: ['Azure Cosmos DB', 'Azure SQL Database', 'Azure Cache for Redis'],
          correctAnswer: 'Azure Cosmos DB',
        },
        {
          id: 'q2',
          text: 'Lift-and-shift legacy SQL Server database with SQL Agent jobs:',
          options: ['Azure SQL Managed Instance', 'Azure SQL Database Single', 'Azure Synapse'],
          correctAnswer: 'Azure SQL Managed Instance',
        },
      ],
    },
  ];

  const az305Multi = [
    {
      code: 'AZ305-Q023',
      title: 'Architectural Security - Zero Trust Identity Requirements Multi-Select',
      prompt: 'Which security controls should be included when designing a Zero Trust architecture for Azure infrastructure? (Select three)',
      options: [
        { id: 'opt1', text: 'Enforce Entra ID Conditional Access with Multi-Factor Authentication (MFA)', isCorrect: true },
        { id: 'opt2', text: 'Implement Just-In-Time (JIT) VM access via Microsoft Entra PIM', isCorrect: true },
        { id: 'opt3', text: 'Use Azure Private Link & Private Endpoints to eliminate public internet exposure', isCorrect: true },
        { id: 'opt4', text: 'Disable firewall logging to improve network throughput' },
      ],
    },
  ];

  const seededAZ305 = await seedTrack(az305Single, az305DragDrop, az305Reorder, az305Dropdown, az305Multi, catAzure.id);

  const examAZ305 = await prisma.exam.create({
    data: {
      code: 'AZ-305',
      title: 'Designing Microsoft Azure Infrastructure Solutions (AZ-305)',
      vendor: ExamVendor.MICROSOFT,
      examType: ExamType.CERTIFICATION,
      description: 'Demonstrate expert-level proficiency in designing identity, governance, monitoring, data storage, business continuity, and infrastructure solutions with interactive architecture items.',
      timeLimitMinutes: 120,
      passingScore: 70.0,
      creatorId: creatorUser.id,
      status: ExamStatus.PUBLISHED,
    },
  });

  const secAZ305 = await prisma.examSection.create({
    data: { examId: examAZ305.id, title: 'Section 1: Architecture Design - Identity, Governance, Storage & Infrastructure', orderIndex: 1 },
  });

  let o305 = 1;
  for (const q of seededAZ305) {
    await prisma.sectionQuestion.create({ data: { sectionId: secAZ305.id, questionId: q.id, orderIndex: o305++ } });
  }

  // ==========================================
  // 2. AZ-104 TRACK
  // ==========================================
  const az104Single = [
    {
      code: 'AZ104-Q001',
      title: 'RBAC - Built-in Virtual Machine Contributor Role',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Virtual Machine Contributor lets you manage VMs, but not grant RBAC permissions.',
      prompt: 'You need to grant a user named User1 the ability to create and manage virtual machines in a specific Resource Group, but User1 must NOT be able to grant access rights to other users. Which Built-in Azure RBAC role should you assign?',
      options: [
        { id: 'opt1', text: 'Virtual Machine Contributor', isCorrect: true },
        { id: 'opt2', text: 'Owner' },
        { id: 'opt3', text: 'Contributor' },
        { id: 'opt4', text: 'User Access Administrator' },
      ],
    },
  ];
  const az104DragDrop = [
    {
      code: 'AZ104-Q020',
      title: 'Azure Administrator Core Services Drag and Drop',
      prompt: 'Drag each Azure administrative service from the left pool to its corresponding description on the right.',
      items: [
        { id: 'ad1', label: 'Log Analytics Workspace' },
        { id: 'ad2', label: 'Azure Site Recovery (ASR)' },
        { id: 'ad3', label: 'VNet Peering' },
      ],
      targets: [
        { id: 'target1', label: 'Centralizes diagnostic logs and executes KQL queries across resources', correctItemId: 'ad1' },
        { id: 'target2', label: 'Orchestrates cross-region disaster recovery VM replication and failover', correctItemId: 'ad2' },
        { id: 'target3', label: 'Connects virtual networks securely over Microsoft private network without public IPs', correctItemId: 'ad3' },
      ],
    },
  ];
  const az104Reorder: any[] = [];
  const az104Dropdown: any[] = [];
  const az104Multi = [
    {
      code: 'AZ104-Q002',
      title: 'Entra ID - Self-Service Password Reset (SSPR) Verification',
      prompt: 'You plan to enable Self-Service Password Reset (SSPR) for 500 users in your Entra ID tenant. Which authentication methods can be enabled for SSPR verification? (Select two)',
      options: [
        { id: 'opt1', text: 'Mobile App Notification', isCorrect: true },
        { id: 'opt2', text: 'Email', isCorrect: true },
        { id: 'opt3', text: 'Security Questions only' },
        { id: 'opt4', text: 'MAC Address Verification' },
      ],
    },
  ];

  const seededAZ104 = await seedTrack(az104Single, az104DragDrop, az104Reorder, az104Dropdown, az104Multi, catAzure.id);

  const examAZ104 = await prisma.exam.create({
    data: {
      code: 'AZ-104',
      title: 'Microsoft Azure Administrator (AZ-104)',
      vendor: ExamVendor.MICROSOFT,
      examType: ExamType.CERTIFICATION,
      description: 'Demonstrate domain expertise in managing Azure identities, governance, storage, compute, virtual networking, and resource monitoring.',
      timeLimitMinutes: 90,
      passingScore: 70.0,
      creatorId: creatorUser.id,
      status: ExamStatus.PUBLISHED,
    },
  });

  const secAZ104 = await prisma.examSection.create({
    data: { examId: examAZ104.id, title: 'Section 1: Azure Identities, Governance, Storage, Compute & Virtual Networks', orderIndex: 1 },
  });

  let o104 = 1;
  for (const q of seededAZ104) {
    await prisma.sectionQuestion.create({ data: { sectionId: secAZ104.id, questionId: q.id, orderIndex: o104++ } });
  }

  // ==========================================
  // 3. AI-901 TRACK
  // ==========================================
  const ai901Single = [
    {
      code: 'AI901-Q001',
      title: 'Azure AI Foundry - Model Catalog & Benchmarks',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure AI Foundry Model Catalog allows developers to discover, evaluate, and compare benchmark metrics.',
      prompt: 'In Microsoft Azure AI Foundry, which feature allows developers to discover, evaluate, and compare benchmark performance metrics across open-source (Llama 3, Mistral) and proprietary (GPT-4o) foundation models?',
      options: [
        { id: 'opt1', text: 'Azure AI Foundry Model Catalog', isCorrect: true },
        { id: 'opt2', text: 'Azure Machine Learning Studio' },
        { id: 'opt3', text: 'Azure Cognitive Services' },
        { id: 'opt4', text: 'Azure Artifacts' },
      ],
    },
  ];
  const ai901DragDrop = [
    {
      code: 'AI901-Q015',
      title: 'Azure AI Foundry Capabilities Drag and Drop',
      prompt: 'Drag each Azure AI Foundry component from the left pool to its corresponding description on the right.',
      items: [
        { id: 'f1', label: 'Prompt Flow' },
        { id: 'f2', label: 'Model Catalog' },
        { id: 'f3', label: 'Prompt Shield' },
      ],
      targets: [
        { id: 'target1', label: 'Orchestrates LLM prompts, Python code, and search tools into DAG pipelines', correctItemId: 'f1' },
        { id: 'target2', label: 'Evaluates and compares benchmark performance across Llama 3, Mistral & GPT-4o', correctItemId: 'f2' },
        { id: 'target3', label: 'Detects and blocks adversarial prompt attacks designed to bypass system guardrails', correctItemId: 'f3' },
      ],
    },
  ];
  const ai901Reorder: any[] = [];
  const ai901Dropdown: any[] = [];
  const ai901Multi: any[] = [];

  const seededAI901 = await seedTrack(ai901Single, ai901DragDrop, ai901Reorder, ai901Dropdown, ai901Multi, catAzure.id);

  const examAI901 = await prisma.exam.create({
    data: {
      code: 'AI-901',
      title: 'Microsoft Azure AI & AI Foundry Solutions (AI-901)',
      vendor: ExamVendor.MICROSOFT,
      examType: ExamType.CERTIFICATION,
      description: 'Demonstrate expertise in Azure AI Foundry, model evaluation, Prompt Flow DAG orchestration, RAG hybrid search, and AI safety.',
      timeLimitMinutes: 60,
      passingScore: 70.0,
      creatorId: creatorUser.id,
      status: ExamStatus.PUBLISHED,
    },
  });

  const secAI901 = await prisma.examSection.create({
    data: { examId: examAI901.id, title: 'Section 1: Azure AI Foundry, RAG Architecture & Agent Orchestration', orderIndex: 1 },
  });

  let o901 = 1;
  for (const q of seededAI901) {
    await prisma.sectionQuestion.create({ data: { sectionId: secAI901.id, questionId: q.id, orderIndex: o901++ } });
  }

  // ==========================================
  // 4. AI-900 TRACK
  // ==========================================
  const ai900Single = [
    {
      code: 'AI900-Q001',
      title: 'Responsible AI - Fairness Principle',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Fairness ensures that AI systems treat all people fairly without bias.',
      prompt: 'An AI model used for automated loan approvals gives lower credit scores to applicants of a specific gender despite identical financial qualifications. Which principle of Responsible AI is violated?',
      options: [
        { id: 'opt1', text: 'Fairness', isCorrect: true },
        { id: 'opt2', text: 'Reliability and Safety' },
        { id: 'opt3', text: 'Privacy and Security' },
        { id: 'opt4', text: 'Transparency' },
      ],
    },
  ];
  const ai900DragDrop = [
    {
      code: 'AI900-Q035',
      title: 'Computer Vision Capabilities Drag and Drop',
      prompt: 'Drag each Computer Vision capability from the pool on the left to its corresponding practical scenario on the right.',
      items: [
        { id: 'cv1', label: 'Image Classification' },
        { id: 'cv2', label: 'Object Detection' },
        { id: 'cv3', label: 'Optical Character Recognition (OCR)' },
      ],
      targets: [
        { id: 'target1', label: 'Categorizing an entire input image as a "Cat" or "Dog"', correctItemId: 'cv1' },
        { id: 'target2', label: 'Locating multiple cars and pedestrians with bounding box coordinates', correctItemId: 'cv2' },
        { id: 'target3', label: 'Extracting text and tabular data from scanned paper receipts', correctItemId: 'cv3' },
      ],
    },
  ];
  const ai900Reorder: any[] = [];
  const ai900Dropdown: any[] = [];
  const ai900Multi: any[] = [];

  const seededAI900 = await seedTrack(ai900Single, ai900DragDrop, ai900Reorder, ai900Dropdown, ai900Multi, catAzure.id);

  const examAI900 = await prisma.exam.create({
    data: {
      code: 'AI-900',
      title: 'Microsoft Azure AI Fundamentals (AI-900)',
      vendor: ExamVendor.MICROSOFT,
      examType: ExamType.CERTIFICATION,
      description: 'Demonstrate foundational knowledge of Artificial Intelligence, Machine Learning principles, Computer Vision, Natural Language Processing, and Generative AI.',
      timeLimitMinutes: 60,
      passingScore: 70.0,
      creatorId: creatorUser.id,
      status: ExamStatus.PUBLISHED,
    },
  });

  const secAI900 = await prisma.examSection.create({
    data: { examId: examAI900.id, title: 'Section 1: AI Workloads, Computer Vision, NLP & Generative AI', orderIndex: 1 },
  });

  let oAI = 1;
  for (const q of seededAI900) {
    await prisma.sectionQuestion.create({ data: { sectionId: secAI900.id, questionId: q.id, orderIndex: oAI++ } });
  }

  // ==========================================
  // 5. AZ-900 TRACK
  // ==========================================
  const az900Single = [
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
  ];
  const az900DragDrop = [
    {
      code: 'AZ900-Q030',
      title: 'Azure SLA Availability Drag and Drop',
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
    },
  ];
  const az900Reorder: any[] = [];
  const az900Dropdown: any[] = [];
  const az900Multi: any[] = [];

  const seededAZ900 = await seedTrack(az900Single, az900DragDrop, az900Reorder, az900Dropdown, az900Multi, catAzure.id);

  const examAZ900 = await prisma.exam.create({
    data: {
      code: 'AZ-900',
      title: 'Microsoft Azure Fundamentals (AZ-900)',
      vendor: ExamVendor.MICROSOFT,
      examType: ExamType.CERTIFICATION,
      description: 'Demonstrate foundational knowledge of cloud concepts, Azure architecture, services, security, privacy, pricing, and SLAs.',
      timeLimitMinutes: 60,
      passingScore: 70.0,
      creatorId: creatorUser.id,
      status: ExamStatus.PUBLISHED,
    },
  });

  const secAZ900 = await prisma.examSection.create({
    data: { examId: examAZ900.id, title: 'Section 1: General Cloud Concepts & Azure Services', orderIndex: 1 },
  });

  let oAZ = 1;
  for (const q of seededAZ900) {
    await prisma.sectionQuestion.create({ data: { sectionId: secAZ900.id, questionId: q.id, orderIndex: oAZ++ } });
  }

  console.log(`✅ Successfully seeded AZ-305 Solutions Architect Expert Track (${seededAZ305.length} items)!`);
  console.log(`✅ Successfully seeded AZ-104 Track!`);
  console.log(`✅ Successfully seeded AI-901 Track!`);
  console.log(`✅ Successfully seeded AI-900 Track!`);
  console.log(`✅ Successfully seeded AZ-900 Track!`);
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
