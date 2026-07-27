import { PrismaClient } from '@prisma/client';
import { Role, ExamVendor, ExamType, QuestionType, DifficultyLevel, ExamStatus } from '../src/domain/types.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting NTMS Database Seeding with ALL Tracks (AZ-104, AI-901, AI-900, AZ-900)...');

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
    data: { name: 'Microsoft Azure Certification', description: 'AZ-104, AZ-900, AI-900 & AI-901 Tracks' },
  });

  // ==========================================
  // 1. AZ-104 EXAM TRACK (BRAND NEW! 20 QUESTIONS)
  // ==========================================
  const az104QuestionsData = [
    {
      code: 'AZ104-Q001',
      title: 'RBAC - Built-in Virtual Machine Contributor Role',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Virtual Machine Contributor lets you manage VMs, but not access to them or the virtual network/storage account they connect to, nor grant RBAC permissions.',
      prompt: 'You need to grant a user named User1 the ability to create and manage virtual machines in a specific Resource Group, but User1 must NOT be able to grant access rights to other users. Which Built-in Azure RBAC role should you assign?',
      options: [
        { id: 'opt1', text: 'Virtual Machine Contributor', isCorrect: true },
        { id: 'opt2', text: 'Owner' },
        { id: 'opt3', text: 'Contributor' },
        { id: 'opt4', text: 'User Access Administrator' },
      ],
    },
    {
      code: 'AZ104-Q002',
      title: 'Entra ID - Self-Service Password Reset (SSPR) Verification',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'SSPR supports Mobile App Notification, Mobile App Code, Email, Office Phone, and Mobile Phone.',
      prompt: 'You plan to enable Self-Service Password Reset (SSPR) for 500 users in your Entra ID tenant. Which authentication methods can be enabled for SSPR verification? (Select two)',
      options: [
        { id: 'opt1', text: 'Mobile App Notification', isCorrect: true },
        { id: 'opt2', text: 'Email', isCorrect: true },
        { id: 'opt3', text: 'Security Questions only' },
        { id: 'opt4', text: 'MAC Address Verification' },
      ],
    },
    {
      code: 'AZ104-Q003',
      title: 'Management Groups - Azure Policy Assignment Scope',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Assigning a policy to a Root Management Group enforces compliance inherited by all underlying subscriptions.',
      prompt: 'Your organization has 15 Azure subscriptions across 3 departments. You need to enforce a custom Azure Policy requiring all storage accounts to use HTTPS only across all subscriptions. Where should you assign the Azure Policy definition?',
      options: [
        { id: 'opt1', text: 'Root Management Group', isCorrect: true },
        { id: 'opt2', text: 'Resource Group level' },
        { id: 'opt3', text: 'Individual Subscriptions' },
        { id: 'opt4', text: 'Virtual Network level' },
      ],
    },
    {
      code: 'AZ104-Q004',
      title: 'Storage Account Security - VNet Service Endpoints & Firewalls',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Storage Firewalls & VNet Service Endpoints / Private Endpoints restrict storage access to specific subnets.',
      prompt: 'You have an Azure Storage Account named store1. You need to ensure that store1 accepts network connections ONLY from a specific subnet named Subnet1 in VNet1. Which features should you configure? (Select two)',
      options: [
        { id: 'opt1', text: 'Virtual Network Service Endpoints / Private Endpoints', isCorrect: true },
        { id: 'opt2', text: 'Storage Account Firewalls & Virtual Networks configuration', isCorrect: true },
        { id: 'opt3', text: 'Shared Access Signatures (SAS)' },
        { id: 'opt4', text: 'Access Keys' },
      ],
    },
    {
      code: 'AZ104-Q005',
      title: 'Blob Storage - Lifecycle Management Automation',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Lifecycle management rules automatically transition blobs to cool/archive tiers or delete them after a specified number of days.',
      prompt: 'You have 10 TB of log files in an Azure Blob Storage container. You need to configure a rule that automatically moves logs to Cool Storage after 30 days of un-modification and deletes them after 365 days. Which feature provides this automation?',
      options: [
        { id: 'opt1', text: 'Blob Lifecycle Management', isCorrect: true },
        { id: 'opt2', text: 'Storage Sync Service' },
        { id: 'opt3', text: 'Azure Backup' },
        { id: 'opt4', text: 'Storage Explorer' },
      ],
    },
    {
      code: 'AZ104-Q006',
      title: 'Azure File Sync - Local Caching & Cloud Tiering',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure File Sync centralizes file shares in Azure Files while keeping local caches on Windows Servers.',
      prompt: 'You have an on-premises Windows File Server named Server1. You want to sync its SMB file shares to an Azure File Share while caching frequently accessed files locally on Server1. Which service should you deploy?',
      options: [
        { id: 'opt1', text: 'Azure File Sync', isCorrect: true },
        { id: 'opt2', text: 'Azure Data Box' },
        { id: 'opt3', text: 'AzCopy' },
        { id: 'opt4', text: 'Azure Site Recovery' },
      ],
    },
    {
      code: 'AZ104-Q007',
      title: 'Virtual Machines - Availability Sets Fault Domains SLA',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Availability Sets distribute VMs across multiple physical fault domains (racks) to guarantee a 99.95% SLA.',
      prompt: 'You are deploying two Virtual Machines (VM1 and VM2) running a web cluster. You need to guarantee an SLA of 99.95% by ensuring the VMs are placed on different physical hardware racks with separate power supplies within a single datacenter. What configuration should you use?',
      options: [
        { id: 'opt1', text: 'Availability Set with Fault Domains', isCorrect: true },
        { id: 'opt2', text: 'Availability Zones' },
        { id: 'opt3', text: 'Proximity Placement Group' },
        { id: 'opt4', text: 'VM Scale Set' },
      ],
    },
    {
      code: 'AZ104-Q008',
      title: 'VM Automation - Custom Script Extension',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Custom Script Extension downloads and executes scripts on Azure virtual machines post-provisioning.',
      prompt: 'You need to automatically execute a PowerShell script that installs IIS web server software on a Windows Server VM immediately after the VM is provisioned. What should you use?',
      options: [
        { id: 'opt1', text: 'Custom Script Extension', isCorrect: true },
        { id: 'opt2', text: 'Azure Policy' },
        { id: 'opt3', text: 'Desired State Configuration (DSC) Agent' },
        { id: 'opt4', text: 'Run Command' },
      ],
    },
    {
      code: 'AZ104-Q009',
      title: 'Azure Container Instances (ACI) Serverless Containers',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Azure Container Instances (ACI) is a fast, serverless container execution environment for short-lived or batch jobs.',
      prompt: 'You need to run a standalone Docker containerized microservice task that executes for 20 minutes once every night without deploying a full Kubernetes cluster or virtual machines. Which service is cost-optimal?',
      options: [
        { id: 'opt1', text: 'Azure Container Instances (ACI)', isCorrect: true },
        { id: 'opt2', text: 'Azure Kubernetes Service (AKS)' },
        { id: 'opt3', text: 'Azure App Service' },
        { id: 'opt4', text: 'Virtual Machine Scale Sets' },
      ],
    },
    {
      code: 'AZ104-Q010',
      title: 'Azure App Service - Deployment Slots Zero-Downtime Swaps',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Deployment slots are live apps with their own host names. Swapping slots moves staging to production with zero downtime.',
      prompt: 'You host a web app in Azure App Service. You need to test a new version of the app in production without downtime, and instantly swap traffic back if bugs are detected. What feature should you configure?',
      options: [
        { id: 'opt1', text: 'Deployment Slots', isCorrect: true },
        { id: 'opt2', text: 'Auto-scale Rules' },
        { id: 'opt3', text: 'App Service Environment (ASE)' },
        { id: 'opt4', text: 'Traffic Manager' },
      ],
    },
    {
      code: 'AZ104-Q011',
      title: 'Virtual Networking - Global VNet Peering Routing',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'VNet Peering routes traffic securely across Azure private backbone network without VPN gateways or public IPs.',
      prompt: 'You have two Virtual Networks (VNet1 in East US and VNet2 in West US). You configure Global VNet Peering between them. VMs in VNet1 must communicate with VMs in VNet2. Do you need an Azure VPN Gateway or public IP addresses for this communication?',
      options: [
        { id: 'opt1', text: 'No, VNet Peering routes traffic securely over Microsoft private backbone network without gateways or public IPs', isCorrect: true },
        { id: 'opt2', text: 'Yes, VPN Gateway is mandatory for cross-region traffic' },
        { id: 'opt3', text: 'Yes, Public IPs are required on all NICs' },
        { id: 'opt4', text: 'Yes, ExpressRoute is required' },
      ],
    },
    {
      code: 'AZ104-Q012',
      title: 'Network Security Groups - Rule Priority Processing',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'NSG rules are processed in priority order from lowest number to highest. Lower numbers take precedence.',
      prompt: 'An NSG has an inbound rule Rule1 with Priority 100 allowing Port 80, and another inbound rule Rule2 with Priority 200 denying Port 80. Will HTTP traffic on Port 80 be allowed or denied?',
      options: [
        { id: 'opt1', text: 'Allowed, because lower numerical priority values (100) are processed first and take precedence', isCorrect: true },
        { id: 'opt2', text: 'Denied, because Deny rules always override Allow rules' },
        { id: 'opt3', text: 'Denied, because Priority 200 is evaluated first' },
        { id: 'opt4', text: 'Blocked by default Azure rules' },
      ],
    },
    {
      code: 'AZ104-Q013',
      title: 'Networking - User Defined Routes (UDR) Forced Tunneling',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.ADVANCED,
      points: 1.0,
      explanation: 'User Defined Routes (UDRs) override Azure default system routes to route 0.0.0.0/0 to a Virtual Appliance.',
      prompt: 'You need to force all outbound internet traffic from VMs in Subnet1 to route through a central Network Virtual Appliance (NVA) firewall VM at 10.0.1.4. What should you create and associate with Subnet1?',
      options: [
        { id: 'opt1', text: 'Route Table with a User Defined Route (UDR) pointing 0.0.0.0/0 to 10.0.1.4', isCorrect: true },
        { id: 'opt2', text: 'Network Security Group (NSG)' },
        { id: 'opt3', text: 'Azure NAT Gateway' },
        { id: 'opt4', text: 'Application Gateway' },
      ],
    },
    {
      code: 'AZ104-Q014',
      title: 'Azure Load Balancer - Public Load Balancer Distribution',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'A public load balancer maps the public IP address and port number of incoming traffic to the private IP and port of the VM.',
      prompt: 'You have a 3-tier application (Web, App, DB). You need to balance incoming HTTP requests from public internet clients across 4 Web tier VMs. Which type of load balancer should you deploy?',
      options: [
        { id: 'opt1', text: 'Public Azure Load Balancer', isCorrect: true },
        { id: 'opt2', text: 'Internal Load Balancer' },
        { id: 'opt3', text: 'Azure Traffic Manager' },
        { id: 'opt4', text: 'Azure DNS' },
      ],
    },
    {
      code: 'AZ104-Q015',
      title: 'Azure DNS - Private DNS Zones VNet Links',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure Private DNS Zones provide name resolution for VMs within a VNet and across linked VNets.',
      prompt: 'You need to configure name resolution so that virtual machines in VNet1 can resolve internal hostnames of VMs in VNet2 (e.g. vm1.internal.contoso.com) without deploying custom IaaS DNS servers. What should you configure?',
      options: [
        { id: 'opt1', text: 'Azure Private DNS Zone linked to both VNets', isCorrect: true },
        { id: 'opt2', text: 'Public Azure DNS Zone' },
        { id: 'opt3', text: 'Hosts file on each VM' },
        { id: 'opt4', text: 'Azure ExpressRoute Private Peering' },
      ],
    },
    {
      code: 'AZ104-Q016',
      title: 'Monitoring - Log Analytics Workspace KQL Analytics',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Log Analytics Workspace stores log telemetry and enables querying via Kusto Query Language (KQL).',
      prompt: 'You need to write Kusto Query Language (KQL) queries to analyze diagnostic logs collected from 50 Virtual Machines, Azure Firewalls, and Storage Accounts in a single dashboard. Where should diagnostic logs be sent?',
      options: [
        { id: 'opt1', text: 'Log Analytics Workspace', isCorrect: true },
        { id: 'opt2', text: 'Azure Blob Storage' },
        { id: 'opt3', text: 'Azure Event Hubs' },
        { id: 'opt4', text: 'Azure Key Vault' },
      ],
    },
    {
      code: 'AZ104-Q017',
      title: 'Network Watcher - IP Flow Verify Diagnostic Tool',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'IP Flow Verify checks if a packet is allowed or denied based on 5-tuple security group rules.',
      prompt: 'A Virtual Machine VM1 cannot communicate with VM2 over Port 443. You suspect a Network Security Group rule is blocking the traffic. Which feature in Azure Network Watcher should you use to test if a packet is allowed or denied?',
      options: [
        { id: 'opt1', text: 'IP Flow Verify', isCorrect: true },
        { id: 'opt2', text: 'Connection Monitor' },
        { id: 'opt3', text: 'Packet Capture' },
        { id: 'opt4', text: 'Next Hop' },
      ],
    },
    {
      code: 'AZ104-Q018',
      title: 'Backup & Recovery - Recovery Services Vault Management',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'A Recovery Services Vault is a management entity that stores backup data and policies for Azure VMs.',
      prompt: 'You need to configure daily automated backup policies and retention schedules for 10 Azure Virtual Machines. Which Azure resource container must you deploy to manage VM backups?',
      options: [
        { id: 'opt1', text: 'Recovery Services Vault', isCorrect: true },
        { id: 'opt2', text: 'Storage Account Blob Container' },
        { id: 'opt3', text: 'Azure Key Vault' },
        { id: 'opt4', text: 'Management Group' },
      ],
    },
    {
      code: 'AZ104-Q019',
      title: 'Disaster Recovery - Azure Site Recovery (ASR) Cross-Region',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure Site Recovery (ASR) handles disaster recovery by replicating workloads to a secondary Azure region.',
      prompt: 'You need to orchestrate business continuity and disaster recovery (BCDR) for Azure VMs by replicating them from the East US region to the West US region. Which service should you configure?',
      options: [
        { id: 'opt1', text: 'Azure Site Recovery (ASR)', isCorrect: true },
        { id: 'opt2', text: 'Azure Backup' },
        { id: 'opt3', text: 'Azure Import/Export' },
        { id: 'opt4', text: 'Virtual Machine Scale Sets' },
      ],
    },
  ];

  const seededAZ104Questions = [];
  for (const qData of az104QuestionsData) {
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
    seededAZ104Questions.push(q);
  }

  // Question 20: Drag and Drop Administrative Tools
  const qAZ104_DD = await prisma.question.create({
    data: {
      code: 'AZ104-Q020',
      title: 'Azure Administrator Core Services Drag and Drop',
      type: QuestionType.DRAG_AND_DROP,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 2.5,
      explanation: 'Log Analytics Workspace runs KQL, ASR handles Disaster Recovery, VNet Peering links networks.',
      categoryId: catAzure.id,
      content: JSON.stringify({
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
      }),
    },
  });
  seededAZ104Questions.push(qAZ104_DD);

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

  let order104 = 1;
  for (const q of seededAZ104Questions) {
    await prisma.sectionQuestion.create({ data: { sectionId: secAZ104.id, questionId: q.id, orderIndex: order104++ } });
  }

  // ==========================================
  // 2. AI-901 EXAM TRACK (15 QUESTIONS)
  // ==========================================
  const ai901QuestionsData = [
    {
      code: 'AI901-Q001',
      title: 'Azure AI Foundry - Model Catalog & Benchmarks',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure AI Foundry Model Catalog allows developers to discover, evaluate, and compare benchmark metrics across foundation models.',
      prompt: 'In Microsoft Azure AI Foundry, which feature allows developers to discover, evaluate, and compare benchmark performance metrics across open-source (Llama 3, Mistral) and proprietary (GPT-4o) foundation models?',
      options: [
        { id: 'opt1', text: 'Azure AI Foundry Model Catalog', isCorrect: true },
        { id: 'opt2', text: 'Azure Machine Learning Studio' },
        { id: 'opt3', text: 'Azure Cognitive Services' },
        { id: 'opt4', text: 'Azure Artifacts' },
      ],
    },
    {
      code: 'AI901-Q002',
      title: 'Azure AI Foundry - Agent Service & SDK',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure AI Agent Service allows developers to build enterprise AI agents capable of calling custom functions, accessing databases, and managing state.',
      prompt: 'You are building an enterprise AI agent in Azure AI Foundry. Which component allows the agent to execute custom code functions, access external database APIs, and maintain multi-turn memory state?',
      options: [
        { id: 'opt1', text: 'Azure AI Agent Service', isCorrect: true },
        { id: 'opt2', text: 'Azure Functions' },
        { id: 'opt3', text: 'Azure Key Vault' },
        { id: 'opt4', text: 'Azure Event Grid' },
      ],
    },
    {
      code: 'AI901-Q003',
      title: 'Azure AI Foundry - Groundedness Evaluation Metric',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Groundedness measures how well the generated answer is supported by the retrieved reference documents.',
      prompt: 'When testing a Retrieval-Augmented Generation (RAG) agent in Azure AI Foundry, which evaluation metric measures whether the model\'s generated answer is strictly derived from the retrieved context documents without hallucination?',
      options: [
        { id: 'opt1', text: 'Groundedness Score', isCorrect: true },
        { id: 'opt2', text: 'BLEU Score' },
        { id: 'opt3', text: 'Perplexity' },
        { id: 'opt4', text: 'F1 Score' },
      ],
    },
    {
      code: 'AI901-Q004',
      title: 'Azure AI Foundry - Prompt Flow Orchestration',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Prompt Flow allows developers to orchestrate LLMs, Python code, and search tools into executable DAG pipelines.',
      prompt: 'Which feature in Azure AI Foundry enables developers to orchestrate LLM prompts, Python code snippets, and vector search queries into a Directed Acyclic Graph (DAG) for testing and deployment?',
      options: [
        { id: 'opt1', text: 'Azure AI Prompt Flow', isCorrect: true },
        { id: 'opt2', text: 'Azure Data Factory' },
        { id: 'opt3', text: 'Azure Pipelines' },
        { id: 'opt4', text: 'Azure Logic Apps' },
      ],
    },
    {
      code: 'AI901-Q005',
      title: 'Azure AI Foundry - Provisioned Throughput Units (PTU)',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.ADVANCED,
      points: 1.0,
      explanation: 'Provisioned Throughput Units (PTUs) reserve dedicated processing capacity for Azure OpenAI model deployments.',
      prompt: 'Your enterprise application requires guaranteed low latency and dedicated computing capacity for GPT-4o model deployments during peak traffic spikes. Which deployment model should you purchase in Azure AI Foundry?',
      options: [
        { id: 'opt1', text: 'Provisioned Throughput Units (PTU)', isCorrect: true },
        { id: 'opt2', text: 'Pay-as-you-go Consumption' },
        { id: 'opt3', text: 'Serverless Instance' },
        { id: 'opt4', text: 'Reserved VM Instances' },
      ],
    },
    {
      code: 'AI901-Q006',
      title: 'Azure AI Search - Hybrid Search with Semantic Re-ranking',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.ADVANCED,
      points: 1.0,
      explanation: 'Hybrid search combines keyword search (BM25) and dense vector search, improved by a semantic re-ranker model.',
      prompt: 'To improve search accuracy for a domain-specific knowledge base, you combine BM25 keyword search with dense vector similarity search and a semantic re-ranker model. What search architecture is this?',
      options: [
        { id: 'opt1', text: 'Hybrid Search with Semantic Re-ranking', isCorrect: true },
        { id: 'opt2', text: 'Pure Vector Search' },
        { id: 'opt3', text: 'Full-Text Lexical Search' },
        { id: 'opt4', text: 'Graph Database Query' },
      ],
    },
    {
      code: 'AI901-Q007',
      title: 'Azure AI Content Safety - Jailbreak Detection (Prompt Shield)',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Prompt Shields in Azure AI Content Safety detect and block jailbreak attacks designed to bypass model guardrails.',
      prompt: 'Which capability of Azure AI Content Safety specifically detects user prompt attacks designed to bypass system prompts and safety guardrails (such as DAN prompts)?',
      options: [
        { id: 'opt1', text: 'Prompt Shield / Jailbreak Detection', isCorrect: true },
        { id: 'opt2', text: 'Hate Speech Filter' },
        { id: 'opt3', text: 'Image Content Filter' },
        { id: 'opt4', text: 'Text Moderation' },
      ],
    },
    {
      code: 'AI901-Q008',
      title: 'Azure AI Document Intelligence - Layout Model',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'The Layout model extracts text, tables, selection marks, and document structure coordinates.',
      prompt: 'You need to extract tables, selection marks (checkboxes), and document structure coordinates from complex financial PDF reports. Which prebuilt Azure AI Document Intelligence model is best suited?',
      options: [
        { id: 'opt1', text: 'Layout Model', isCorrect: true },
        { id: 'opt2', text: 'Read Model' },
        { id: 'opt3', text: 'General Document Model' },
        { id: 'opt4', text: 'Invoice Model' },
      ],
    },
    {
      code: 'AI901-Q009',
      title: 'Azure OpenAI Service - Model Fine-Tuning',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Fine-tuning customizes the model on specific domain examples to adopt a specific tone or output format.',
      prompt: 'An organization needs an AI assistant to speak in a specific niche corporate voice and tone without needing daily knowledge updates. Which customization approach is recommended?',
      options: [
        { id: 'opt1', text: 'Model Fine-Tuning', isCorrect: true },
        { id: 'opt2', text: 'Retrieval-Augmented Generation (RAG)' },
        { id: 'opt3', text: 'Zero-Shot Prompting' },
        { id: 'opt4', text: 'System Message' },
      ],
    },
    {
      code: 'AI901-Q010',
      title: 'Azure AI Speech - Custom Neural Voice',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Custom Neural Voice allows organizations to build a unique synthetic voice for their brand using human voice recordings.',
      prompt: 'A media company wants to generate branded synthetic voice audio that matches their official brand spokesperson\'s unique voice timbre and intonation. Which service feature enables this?',
      options: [
        { id: 'opt1', text: 'Custom Neural Voice', isCorrect: true },
        { id: 'opt2', text: 'Standard Text-to-Speech' },
        { id: 'opt3', text: 'Speech Translation' },
        { id: 'opt4', text: 'Speaker Verification' },
      ],
    },
    {
      code: 'AI901-Q011',
      title: 'Azure AI Vision - Image Analysis 4.0 Captioning',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Image Analysis 4.0 generates human-readable captions and dense image descriptions.',
      prompt: 'Which Azure AI Vision feature generates natural language descriptive captions and dense captioning tags for uploaded images?',
      options: [
        { id: 'opt1', text: 'Image Analysis Captioning', isCorrect: true },
        { id: 'opt2', text: 'Custom Vision' },
        { id: 'opt3', text: 'Optical Character Recognition (OCR)' },
        { id: 'opt4', text: 'Spatial Analysis' },
      ],
    },
    {
      code: 'AI901-Q012',
      title: 'Responsible AI - Adversarial Red Teaming',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'AI Red Teaming systematically tests AI applications for safety, security, and jailbreak vulnerabilities.',
      prompt: 'What is the term for adversarial testing where a specialized security team deliberately attempts to exploit, bypass, and prompt-inject an AI model to discover vulnerabilities before production launch?',
      options: [
        { id: 'opt1', text: 'AI Red Teaming', isCorrect: true },
        { id: 'opt2', text: 'Blue Team Auditing' },
        { id: 'opt3', text: 'Penetration Testing' },
        { id: 'opt4', text: 'Model Validation' },
      ],
    },
    {
      code: 'AI901-Q013',
      title: 'Python SDK - Azure AI Projects Package',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'The azure-ai-projects Python package connects programmatically to Azure AI Foundry projects.',
      prompt: 'In Python, which SDK package is used to connect to an Azure AI Foundry project and initialize model deployments programmatically (`from azure.ai.projects import AIProjectClient`)?',
      options: [
        { id: 'opt1', text: 'azure-ai-projects', isCorrect: true },
        { id: 'opt2', text: 'azure-ai-textanalytics' },
        { id: 'opt3', text: 'azure-storage-blob' },
        { id: 'opt4', text: 'azure-mgmt-resource' },
      ],
    },
    {
      code: 'AI901-Q014',
      title: 'Azure AI Vision - Spatial Analysis',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Spatial Analysis processes physical camera feeds to measure people movement, dwell time, and space occupancy.',
      prompt: 'A smart store monitors queue lengths and customer dwell times in checkout aisles using real-time video streams. Which feature of Azure AI Vision provides this?',
      options: [
        { id: 'opt1', text: 'Spatial Analysis', isCorrect: true },
        { id: 'opt2', text: 'Face API' },
        { id: 'opt3', text: 'Read API' },
        { id: 'opt4', text: 'Image Classification' },
      ],
    },
  ];

  const seededAI901Questions = [];
  for (const qData of ai901QuestionsData) {
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
    seededAI901Questions.push(q);
  }

  const qAI901_DD = await prisma.question.create({
    data: {
      code: 'AI901-Q015',
      title: 'Azure AI Foundry Capabilities Drag and Drop',
      type: QuestionType.DRAG_AND_DROP,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 2.5,
      explanation: 'Prompt Flow orchestrates DAGs, Model Catalog compares benchmarks, Content Safety blocks jailbreaks.',
      categoryId: catAzure.id,
      content: JSON.stringify({
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
      }),
    },
  });
  seededAI901Questions.push(qAI901_DD);

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

  let order901 = 1;
  for (const q of seededAI901Questions) {
    await prisma.sectionQuestion.create({ data: { sectionId: secAI901.id, questionId: q.id, orderIndex: order901++ } });
  }

  // ==========================================
  // 3. AI-900 EXAM TRACK (35 COMPLETE QUESTIONS)
  // ==========================================
  const ai900QuestionsData = [
    {
      code: 'AI900-Q001',
      title: 'Responsible AI - Fairness Principle',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Fairness ensures that AI systems treat all people fairly without bias based on gender or background.',
      prompt: 'An AI model used for automated loan approvals gives lower credit scores to applicants of a specific gender despite identical financial qualifications. Which principle of Responsible AI is violated?',
      options: [
        { id: 'opt1', text: 'Fairness', isCorrect: true },
        { id: 'opt2', text: 'Reliability and Safety' },
        { id: 'opt3', text: 'Privacy and Security' },
        { id: 'opt4', text: 'Transparency' },
      ],
    },
    {
      code: 'AI900-Q002',
      title: 'Responsible AI - Accountability Principle',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Accountability requires human designers and developers to remain accountable for AI outcomes.',
      prompt: 'Which Responsible AI principle dictates that human designers and developers are ultimately accountable for the operation and decisions of AI systems?',
      options: [
        { id: 'opt1', text: 'Accountability', isCorrect: true },
        { id: 'opt2', text: 'Inclusiveness' },
        { id: 'opt3', text: 'Transparency' },
        { id: 'opt4', text: 'Reliability' },
      ],
    },
    {
      code: 'AI900-Q003',
      title: 'Responsible AI - Reliability and Safety',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Reliability and Safety ensures AI operates dependably under unexpected conditions.',
      prompt: 'An autonomous self-driving car software system undergoes rigorous testing to handle severe rainstorms and unexpected road obstacles safely. Which Responsible AI principle does this demonstrate?',
      options: [
        { id: 'opt1', text: 'Reliability and Safety', isCorrect: true },
        { id: 'opt2', text: 'Fairness' },
        { id: 'opt3', text: 'Inclusiveness' },
        { id: 'opt4', text: 'Transparency' },
      ],
    },
    {
      code: 'AI900-Q004',
      title: 'Responsible AI - Privacy and Security',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Privacy and Security requires protecting personal data and securing AI models.',
      prompt: 'A medical AI application encrypts patient records and adheres to strict HIPAA compliance rules to prevent unauthorized data exposure. Which Responsible AI principle is being followed?',
      options: [
        { id: 'opt1', text: 'Privacy and Security', isCorrect: true },
        { id: 'opt2', text: 'Fairness' },
        { id: 'opt3', text: 'Accountability' },
        { id: 'opt4', text: 'Transparency' },
      ],
    },
    {
      code: 'AI900-Q005',
      title: 'Responsible AI - Inclusiveness',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Inclusiveness ensures AI solutions empower all people regardless of ability.',
      prompt: 'An AI voice assistant is designed with screen-reader support and multi-dialect voice recognition for users with physical impairments. Which Responsible AI principle is highlighted?',
      options: [
        { id: 'opt1', text: 'Inclusiveness', isCorrect: true },
        { id: 'opt2', text: 'Transparency' },
        { id: 'opt3', text: 'Accountability' },
        { id: 'opt4', text: 'Fairness' },
      ],
    },
    {
      code: 'AI900-Q006',
      title: 'Responsible AI - Transparency',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Transparency ensures users understand how AI models arrive at decisions.',
      prompt: 'A healthcare diagnostic tool provides doctors with a clear explanation and confidence breakdown of why a specific diagnosis was suggested. Which Responsible AI principle is demonstrated?',
      options: [
        { id: 'opt1', text: 'Transparency', isCorrect: true },
        { id: 'opt2', text: 'Reliability' },
        { id: 'opt3', text: 'Privacy' },
        { id: 'opt4', text: 'Inclusiveness' },
      ],
    },
    {
      code: 'AI900-Q007',
      title: 'Machine Learning - Regression Task',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Regression algorithms predict continuous numeric values.',
      prompt: 'You need to build a machine learning model to predict continuous numeric house prices based on square footage, location, and age. Which type of ML task should you use?',
      options: [
        { id: 'opt1', text: 'Regression', isCorrect: true },
        { id: 'opt2', text: 'Classification' },
        { id: 'opt3', text: 'Clustering' },
        { id: 'opt4', text: 'Anomaly Detection' },
      ],
    },
    {
      code: 'AI900-Q008',
      title: 'Machine Learning - Binary Classification Task',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Binary classification predicts one of two mutually exclusive outcomes.',
      prompt: 'An email filter classifies incoming messages into exactly two categories: "Spam" or "Not Spam". Which machine learning task type is this?',
      options: [
        { id: 'opt1', text: 'Binary Classification', isCorrect: true },
        { id: 'opt2', text: 'Multiclass Classification' },
        { id: 'opt3', text: 'Linear Regression' },
        { id: 'opt4', text: 'Clustering' },
      ],
    },
    {
      code: 'AI900-Q009',
      title: 'Machine Learning - Multiclass Classification Task',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Multiclass classification categorizes data into three or more distinct classes.',
      prompt: 'An e-commerce portal automatically routes customer support tickets into "Low", "Medium", "High", or "Urgent" priority queues. Which ML task type is used?',
      options: [
        { id: 'opt1', text: 'Multiclass Classification', isCorrect: true },
        { id: 'opt2', text: 'Binary Classification' },
        { id: 'opt3', text: 'Unsupervised Clustering' },
        { id: 'opt4', text: 'Regression' },
      ],
    },
    {
      code: 'AI900-Q010',
      title: 'Machine Learning - Unsupervised Clustering',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Clustering groups unlabeled data points with similar features into clusters.',
      prompt: 'You have customer purchase history data with no target labels. You want to group customers into distinct segments based on purchasing habits. Which ML algorithm type is required?',
      options: [
        { id: 'opt1', text: 'Unsupervised Clustering', isCorrect: true },
        { id: 'opt2', text: 'Supervised Classification' },
        { id: 'opt3', text: 'Binary Regression' },
        { id: 'opt4', text: 'Forecasting' },
      ],
    },
    {
      code: 'AI900-Q011',
      title: 'Machine Learning - Anomaly Detection',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Anomaly detection identifies unusual events or patterns.',
      prompt: 'A bank monitors credit card transactions in real-time to flag unusual spending activity that deviates from typical customer behavior. Which ML capability is used?',
      options: [
        { id: 'opt1', text: 'Anomaly Detection', isCorrect: true },
        { id: 'opt2', text: 'Image Classification' },
        { id: 'opt3', text: 'Linear Regression' },
        { id: 'opt4', text: 'Speech Synthesis' },
      ],
    },
    {
      code: 'AI900-Q012',
      title: 'Azure Automated Machine Learning (AutoML)',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'AutoML automates model development by systematically training multiple algorithms.',
      prompt: 'You want to train an optimal machine learning model without writing custom code by letting Azure automatically test multiple algorithms and hyperparameters. Which feature should you use?',
      options: [
        { id: 'opt1', text: 'Automated Machine Learning (AutoML)', isCorrect: true },
        { id: 'opt2', text: 'Azure Machine Learning Designer' },
        { id: 'opt3', text: 'Jupyter Notebooks' },
        { id: 'opt4', text: 'Azure Batch' },
      ],
    },
    {
      code: 'AI900-Q013',
      title: 'Azure Machine Learning Designer Visual Canvas',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure ML Designer provides a drag-and-drop visual interface.',
      prompt: 'A data science team wants to construct an end-to-end machine learning workflow using a drag-and-drop visual interface. Which tool in Azure ML Studio should they use?',
      options: [
        { id: 'opt1', text: 'Azure Machine Learning Designer', isCorrect: true },
        { id: 'opt2', text: 'Automated ML' },
        { id: 'opt3', text: 'VS Code Extension' },
        { id: 'opt4', text: 'Azure Data Factory' },
      ],
    },
    {
      code: 'AI900-Q014',
      title: 'Computer Vision - Image Classification',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Image classification assigns a main category to an entire image.',
      prompt: 'A wildlife app categorizes an uploaded photo into a single general species label such as "Elephant" or "Giraffe". Which computer vision task is performed?',
      options: [
        { id: 'opt1', text: 'Image Classification', isCorrect: true },
        { id: 'opt2', text: 'Object Detection' },
        { id: 'opt3', text: 'OCR' },
        { id: 'opt4', text: 'Semantic Segmentation' },
      ],
    },
    {
      code: 'AI900-Q015',
      title: 'Computer Vision - Object Detection',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Object Detection locates objects within an image with bounding boxes.',
      prompt: 'You need to analyze traffic camera footage to locate each vehicle and pedestrian with bounding boxes and coordinates. Which computer vision task is this?',
      options: [
        { id: 'opt1', text: 'Object Detection', isCorrect: true },
        { id: 'opt2', text: 'Image Classification' },
        { id: 'opt3', text: 'Optical Character Recognition (OCR)' },
        { id: 'opt4', text: 'Face Verification' },
      ],
    },
    {
      code: 'AI900-Q016',
      title: 'Computer Vision - Semantic Segmentation',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.ADVANCED,
      points: 1.0,
      explanation: 'Semantic segmentation classifies individual pixels in an image.',
      prompt: 'An autonomous vehicle camera system classifies every individual pixel in a camera feed to distinguish road surface pixels from sidewalk and obstacle pixels. Which vision technique is this?',
      options: [
        { id: 'opt1', text: 'Semantic Segmentation', isCorrect: true },
        { id: 'opt2', text: 'Image Classification' },
        { id: 'opt3', text: 'Optical Character Recognition' },
        { id: 'opt4', text: 'Key Phrase Extraction' },
      ],
    },
    {
      code: 'AI900-Q017',
      title: 'Computer Vision - Optical Character Recognition (OCR)',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'OCR extracts printed or handwritten text from images and documents.',
      prompt: 'An invoice processing application needs to extract printed text, handwritten notes, and tabular data from scanned PDF documents. Which service feature should you use?',
      options: [
        { id: 'opt1', text: 'Optical Character Recognition (OCR)', isCorrect: true },
        { id: 'opt2', text: 'Custom Vision' },
        { id: 'opt3', text: 'Face API' },
        { id: 'opt4', text: 'Spatial Analysis' },
      ],
    },
    {
      code: 'AI900-Q018',
      title: 'Computer Vision - Azure AI Face API',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Face API provides facial detection and verification.',
      prompt: 'A security turnstile application analyzes camera feeds to verify employee identity by matching facial features against authorized employee photos. Which Azure service should you use?',
      options: [
        { id: 'opt1', text: 'Azure AI Face API', isCorrect: true },
        { id: 'opt2', text: 'Custom Vision' },
        { id: 'opt3', text: 'Azure Form Recognizer' },
        { id: 'opt4', text: 'Language Studio' },
      ],
    },
    {
      code: 'AI900-Q019',
      title: 'Computer Vision - Azure AI Custom Vision',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Custom Vision allows building custom image classification models.',
      prompt: 'A manufacturing plant needs an AI model to detect defective circuit boards using a custom dataset of 200 labeled images. Which service allows training custom image classification models easily?',
      options: [
        { id: 'opt1', text: 'Azure AI Custom Vision', isCorrect: true },
        { id: 'opt2', text: 'Azure AI Speech' },
        { id: 'opt3', text: 'Language Studio' },
        { id: 'opt4', text: 'Azure Bot Service' },
      ],
    },
    {
      code: 'AI900-Q020',
      title: 'NLP - Key Phrase Extraction',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Key Phrase Extraction identifies main concepts in unformatted text.',
      prompt: 'An organization needs to process thousands of customer survey responses and extract the main topic phrases discussed in each response. Which NLP feature should be used?',
      options: [
        { id: 'opt1', text: 'Key Phrase Extraction', isCorrect: true },
        { id: 'opt2', text: 'Entity Recognition' },
        { id: 'opt3', text: 'Sentiment Analysis' },
        { id: 'opt4', text: 'Language Translation' },
      ],
    },
    {
      code: 'AI900-Q021',
      title: 'NLP - Named Entity Recognition (NER)',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'NER identifies entities such as people, locations, dates, and organizations.',
      prompt: 'A news aggregation platform analyzes articles to identify and tag specific company names, executive names, and dates mentioned in the text. Which NLP feature does this?',
      options: [
        { id: 'opt1', text: 'Named Entity Recognition (NER)', isCorrect: true },
        { id: 'opt2', text: 'Key Phrase Extraction' },
        { id: 'opt3', text: 'Language Detection' },
        { id: 'opt4', text: 'Speech Recognition' },
      ],
    },
    {
      code: 'AI900-Q022',
      title: 'NLP - Sentiment Analysis',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Sentiment Analysis evaluates text sentiment (positive, negative, neutral).',
      prompt: 'A restaurant chain wants to analyze social media mentions to determine whether customer sentiment is overwhelmingly positive or negative. Which NLP feature should they use?',
      options: [
        { id: 'opt1', text: 'Sentiment Analysis', isCorrect: true },
        { id: 'opt2', text: 'Key Phrase Extraction' },
        { id: 'opt3', text: 'Named Entity Recognition (NER)' },
        { id: 'opt4', text: 'Language Detection' },
      ],
    },
    {
      code: 'AI900-Q023',
      title: 'NLP - Azure AI Translator Service',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Azure AI Translator translates text in real-time across languages.',
      prompt: 'A global website needs to automatically translate user comments from French and Spanish into English in real-time. Which Azure AI service should be implemented?',
      options: [
        { id: 'opt1', text: 'Azure AI Translator', isCorrect: true },
        { id: 'opt2', text: 'Azure AI Speech' },
        { id: 'opt3', text: 'Language Studio' },
        { id: 'opt4', text: 'Azure Bot Service' },
      ],
    },
    {
      code: 'AI900-Q024',
      title: 'Speech Service - Speech-to-Text Recognition',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Speech Recognition transcribes spoken audio streams into text.',
      prompt: 'A call center application transcribes live phone call audio into text transcripts for compliance auditing. Which feature of the Speech service is used?',
      options: [
        { id: 'opt1', text: 'Speech-to-Text (Speech Recognition)', isCorrect: true },
        { id: 'opt2', text: 'Text-to-Speech (Speech Synthesis)' },
        { id: 'opt3', text: 'Speaker Recognition' },
        { id: 'opt4', text: 'Language Translation' },
      ],
    },
    {
      code: 'AI900-Q025',
      title: 'Speech Service - Text-to-Speech Synthesis',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Speech Synthesis converts text into synthetic human speech.',
      prompt: 'You need to build a mobile application feature that reads news articles out loud using natural-sounding synthetic human voices. Which Azure AI service feature is required?',
      options: [
        { id: 'opt1', text: 'Speech Synthesis (Text-to-Speech)', isCorrect: true },
        { id: 'opt2', text: 'Speech Recognition (Speech-to-Text)' },
        { id: 'opt3', text: 'Language Translation' },
        { id: 'opt4', text: 'Conversational AI' },
      ],
    },
    {
      code: 'AI900-Q026',
      title: 'Conversational AI - Azure Bot Service',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Azure Bot Service provides an environment for building conversational bots.',
      prompt: 'A customer service portal needs an interactive conversational bot to handle common customer inquiries 24/7. Which service provides the infrastructure for building chatbots?',
      options: [
        { id: 'opt1', text: 'Azure Bot Service', isCorrect: true },
        { id: 'opt2', text: 'Azure AI Content Safety' },
        { id: 'opt3', text: 'Azure Metrics Advisor' },
        { id: 'opt4', text: 'Azure Personalizer' },
      ],
    },
    {
      code: 'AI900-Q027',
      title: 'Generative AI - Azure OpenAI Service',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure OpenAI Service provides access to OpenAI models (GPT-4, DALL-E) with enterprise security.',
      prompt: 'Which Azure service provides REST API access to advanced large language models (LLMs) such as GPT-4 for text generation, summarization, and code completion?',
      options: [
        { id: 'opt1', text: 'Azure OpenAI Service', isCorrect: true },
        { id: 'opt2', text: 'Azure Machine Learning' },
        { id: 'opt3', text: 'Azure Video Indexer' },
        { id: 'opt4', text: 'Azure Immersive Reader' },
      ],
    },
    {
      code: 'AI900-Q028',
      title: 'Generative AI - Prompt Engineering',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Prompt Engineering structures text prompts to guide LLMs effectively.',
      prompt: 'What is the term for crafting precise input instructions, context, and constraints to guide Large Language Models (LLMs) toward producing desired outputs?',
      options: [
        { id: 'opt1', text: 'Prompt Engineering', isCorrect: true },
        { id: 'opt2', text: 'Fine-Tuning' },
        { id: 'opt3', text: 'Hyperparameter Tuning' },
        { id: 'opt4', text: 'Supervised Training' },
      ],
    },
    {
      code: 'AI900-Q029',
      title: 'Generative AI - Azure AI Content Safety',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure AI Content Safety blocks harmful text and images.',
      prompt: 'An online platform uses generative AI. You need an automated safeguard to detect and block hate speech, violence, and harmful content in real-time prompts and responses. Which service should you integrate?',
      options: [
        { id: 'opt1', text: 'Azure AI Content Safety', isCorrect: true },
        { id: 'opt2', text: 'Azure Key Vault' },
        { id: 'opt3', text: 'Azure Firewall' },
        { id: 'opt4', text: 'Azure Monitor' },
      ],
    },
    {
      code: 'AI900-Q030',
      title: 'Generative AI - DALL-E Image Generation',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'DALL-E creates synthetic images from text prompts.',
      prompt: 'Which Azure OpenAI Service model generates high-fidelity digital images and graphics from natural language text prompts?',
      options: [
        { id: 'opt1', text: 'DALL-E', isCorrect: true },
        { id: 'opt2', text: 'GPT-4' },
        { id: 'opt3', text: 'Whisper' },
        { id: 'opt4', text: 'Codex' },
      ],
    },
    {
      code: 'AI900-Q031',
      title: 'Generative AI - Whisper Speech Model',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Whisper specializes in speech recognition and translation.',
      prompt: 'Which Azure OpenAI Service model specializes in automatic speech recognition and audio translation across multiple languages?',
      options: [
        { id: 'opt1', text: 'Whisper', isCorrect: true },
        { id: 'opt2', text: 'GPT-4' },
        { id: 'opt3', text: 'DALL-E' },
        { id: 'opt4', text: 'Text-Embedding-Ada' },
      ],
    },
    {
      code: 'AI900-Q032',
      title: 'Generative AI - System Message Guidance',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'System Messages set overarching behavioral persona and guardrails.',
      prompt: 'In Azure OpenAI Studio, where do you set the overarching behavioral persona, tone, and safety guardrails for an AI assistant?',
      options: [
        { id: 'opt1', text: 'System Message (System Prompt)', isCorrect: true },
        { id: 'opt2', text: 'Temperature Parameter' },
        { id: 'opt3', text: 'Top P Setting' },
        { id: 'opt4', text: 'Max Tokens' },
      ],
    },
    {
      code: 'AI900-Q033',
      title: 'Generative AI - Temperature Hyperparameter',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Temperature controls randomness in model responses.',
      prompt: 'Which parameter in Azure OpenAI Service controls the randomness and creative variability of generated model responses?',
      options: [
        { id: 'opt1', text: 'Temperature', isCorrect: true },
        { id: 'opt2', text: 'Frequency Penalty' },
        { id: 'opt3', text: 'Presence Penalty' },
        { id: 'opt4', text: 'Max Length' },
      ],
    },
    {
      code: 'AI900-Q034',
      title: 'Generative AI - Retrieval-Augmented Generation (RAG)',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.ADVANCED,
      points: 1.0,
      explanation: 'RAG grounds LLM responses using private company document search indexes.',
      prompt: 'Which architectural pattern grounds Large Language Model responses in private company documents using an enterprise search engine?',
      options: [
        { id: 'opt1', text: 'Retrieval-Augmented Generation (RAG)', isCorrect: true },
        { id: 'opt2', text: 'Fine-Tuning' },
        { id: 'opt3', text: 'Model Distillation' },
        { id: 'opt4', text: 'Zero-Shot Learning' },
      ],
    },
  ];

  const seededAI900Questions = [];
  for (const qData of ai900QuestionsData) {
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
    seededAI900Questions.push(q);
  }

  const qAI900_DD = await prisma.question.create({
    data: {
      code: 'AI900-Q035',
      title: 'Computer Vision Capabilities Drag and Drop',
      type: QuestionType.DRAG_AND_DROP,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 2.5,
      explanation: 'Image classification labels an entire image, object detection identifies bounding boxes, OCR extracts text.',
      categoryId: catAzure.id,
      content: JSON.stringify({
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
      }),
    },
  });
  seededAI900Questions.push(qAI900_DD);

  const examAI900 = await prisma.exam.create({
    data: {
      code: 'AI-900',
      title: 'Microsoft Azure AI Fundamentals (AI-900)',
      vendor: ExamVendor.MICROSOFT,
      examType: ExamType.CERTIFICATION,
      description: 'Demonstrate foundational knowledge of Artificial Intelligence, Machine Learning principles, Computer Vision, Natural Language Processing, and Generative AI with 35 deduplicated practice questions.',
      timeLimitMinutes: 60,
      passingScore: 70.0,
      creatorId: creatorUser.id,
      status: ExamStatus.PUBLISHED,
    },
  });

  const secAI900 = await prisma.examSection.create({
    data: { examId: examAI900.id, title: 'Section 1: AI Workloads, Computer Vision, NLP & Generative AI', orderIndex: 1 },
  });

  let orderAI = 1;
  for (const q of seededAI900Questions) {
    await prisma.sectionQuestion.create({ data: { sectionId: secAI900.id, questionId: q.id, orderIndex: orderAI++ } });
  }

  // ==========================================
  // 4. AZ-900 EXAM TRACK (40 QUESTIONS)
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
      explanation: 'Geo-Redundant Storage (GRS) replicates data synchronously three times within the primary region, then asynchronously to a secondary region.',
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
    {
      code: 'AZ900-Q025',
      title: 'Azure Arc Multicloud Governance',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.ADVANCED,
      points: 1.0,
      explanation: 'Azure Arc simplifies governance and management by extending Azure Resource Manager (ARM) to multicloud and on-premises servers.',
      prompt: 'Which Azure service allows you to manage and govern servers, Kubernetes clusters, and databases running on AWS, GCP, or on-premises using Azure Resource Manager?',
      options: [
        { id: 'opt1', text: 'Azure Arc', isCorrect: true },
        { id: 'opt2', text: 'Azure Sentinel' },
        { id: 'opt3', text: 'Azure ExpressRoute' },
        { id: 'opt4', text: 'Azure Stack' },
      ],
    },
    {
      code: 'AZ900-Q026',
      title: 'Azure Virtual Machine Scale Sets Auto-scaling',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Virtual Machine Scale Sets (VMSS) allow you to deploy and manage a group of identical, auto-scaling VMs.',
      prompt: 'Which Azure compute feature automatically scales the number of identical virtual machines up or down based on CPU load or schedule?',
      options: [
        { id: 'opt1', text: 'Virtual Machine Scale Sets (VMSS)', isCorrect: true },
        { id: 'opt2', text: 'Availability Sets' },
        { id: 'opt3', text: 'Availability Zones' },
        { id: 'opt4', text: 'Azure Batch' },
      ],
    },
    {
      code: 'AZ900-Q027',
      title: 'Azure Application Gateway & Web Application Firewall (WAF)',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.ADVANCED,
      points: 1.0,
      explanation: 'Application Gateway is a Layer 7 web traffic load balancer that includes Web Application Firewall (WAF) to block web attacks like SQLi & XSS.',
      prompt: 'Which Layer 7 web load balancer includes Web Application Firewall (WAF) to protect web applications from common exploits like SQL injection?',
      options: [
        { id: 'opt1', text: 'Azure Application Gateway', isCorrect: true },
        { id: 'opt2', text: 'Azure Load Balancer' },
        { id: 'opt3', text: 'Azure ExpressRoute' },
        { id: 'opt4', text: 'Azure NAT Gateway' },
      ],
    },
    {
      code: 'AZ900-Q028',
      title: 'Azure Bastion Secure RDP/SSH Access',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure Bastion provides secure, seamless RDP and SSH access to virtual machines directly through the Azure portal over TLS.',
      prompt: 'Which service provides secure RDP and SSH connectivity directly to your Virtual Machines through an HTML5 web browser without public IP addresses?',
      options: [
        { id: 'opt1', text: 'Azure Bastion', isCorrect: true },
        { id: 'opt2', text: 'Azure VPN Gateway' },
        { id: 'opt3', text: 'Azure Firewall' },
        { id: 'opt4', text: 'Network Security Group' },
      ],
    },
    {
      code: 'AZ900-Q029',
      title: 'Azure Data Box Offline Physical Data Transfer',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure Data Box physical storage appliances allow offline transfer of petabytes of data to Azure over slow network connections.',
      prompt: 'Your organization needs to transfer 100 Terabytes of data to Azure Blob Storage over a congested network connection. Which physical hardware appliance service should you order?',
      options: [
        { id: 'opt1', text: 'Azure Data Box', isCorrect: true },
        { id: 'opt2', text: 'Azure Import/Export' },
        { id: 'opt3', text: 'Azure ExpressRoute' },
        { id: 'opt4', text: 'Azure Files' },
      ],
    },
    {
      code: 'AZ900-Q031',
      title: 'ExamHeist - Azure Support Plans Ticket Entitlements',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Developer, Standard, and Professional Direct support plans allow submitting technical support requests. Basic plan only covers billing & account support.',
      prompt: 'Which Azure support plans grant users the entitlement to submit technical support tickets directly to Microsoft engineers? (Select all that apply)',
      options: [
        { id: 'opt1', text: 'Developer Support Plan', isCorrect: true },
        { id: 'opt2', text: 'Standard Support Plan', isCorrect: true },
        { id: 'opt3', text: 'Professional Direct Support Plan', isCorrect: true },
        { id: 'opt4', text: 'Basic Support Plan' },
      ],
    },
    {
      code: 'AZ900-Q032',
      title: 'ExamHeist - Read-Access Geo-Redundant Storage (RA-GRS)',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'RA-GRS replicates data to a secondary geographic location and provides read-only access to secondary endpoints even when primary is healthy.',
      prompt: 'Your organization has datacenters in New York and London. You require a storage solution that replicates data to a secondary geographic region while providing read-only access to the secondary location. Which storage option should you choose?',
      options: [
        { id: 'opt1', text: 'Read-Access Geo-Redundant Storage (RA-GRS)', isCorrect: true },
        { id: 'opt2', text: 'Locally Redundant Storage (LRS)' },
        { id: 'opt3', text: 'Zone-Redundant Storage (ZRS)' },
        { id: 'opt4', text: 'Geo-Redundant Storage (GRS)' },
      ],
    },
    {
      code: 'AZ900-Q033',
      title: 'ExamHeist - Azure Synapse Analytics Data Warehouse',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure Synapse Analytics brings together enterprise data warehousing and big data analytics.',
      prompt: 'Which Azure analytics service brings together enterprise data warehousing and big data analytics for high-scale query processing over petabytes of data?',
      options: [
        { id: 'opt1', text: 'Azure Synapse Analytics', isCorrect: true },
        { id: 'opt2', text: 'Azure Data Lake Storage' },
        { id: 'opt3', text: 'Azure HDInsight' },
        { id: 'opt4', text: 'Azure Stream Analytics' },
      ],
    },
    {
      code: 'AZ900-Q034',
      title: 'ExamHeist - Azure TCO Calculator Savings Estimation',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'The TCO Calculator compares on-premises datacenter operational costs against cloud deployment costs.',
      prompt: 'Before migrating on-premises physical servers to Azure, your finance team wants to estimate total financial savings over a 5-year period compared to running on-premises infrastructure. Which tool should you use?',
      options: [
        { id: 'opt1', text: 'Azure TCO Calculator', isCorrect: true },
        { id: 'opt2', text: 'Azure Pricing Calculator' },
        { id: 'opt3', text: 'Azure Cost Management' },
        { id: 'opt4', text: 'Azure Advisor' },
      ],
    },
    {
      code: 'AZ900-Q035',
      title: 'ExamHeist - Azure SLA Violation Financial Credits',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'If an Azure service fails to meet guaranteed SLA uptime, Microsoft issues service billing credits.',
      prompt: 'What happens if an Azure service experiences downtime that breaches Microsoft\'s published Service Level Agreement (SLA)?',
      options: [
        { id: 'opt1', text: 'Microsoft provides financial credits applied to your billing invoice', isCorrect: true },
        { id: 'opt2', text: 'Microsoft automatically upgrades your support tier to Professional Direct' },
        { id: 'opt3', text: 'Microsoft refunds all historical charges in cash' },
        { id: 'opt4', text: 'Microsoft grants free virtual machine instances' },
      ],
    },
    {
      code: 'AZ900-Q036',
      title: 'ExamHeist - Azure Marketplace Deployable Assets',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Azure Marketplace is an online store containing thousands of pre-configured software applications and images ready to deploy.',
      prompt: 'Where can developers and IT administrators browse, purchase, and deploy thousands of pre-configured third-party software applications, VM images, and solution templates directly into Azure?',
      options: [
        { id: 'opt1', text: 'Azure Marketplace', isCorrect: true },
        { id: 'opt2', text: 'Azure Artifacts' },
        { id: 'opt3', text: 'Microsoft Store' },
        { id: 'opt4', text: 'Azure App Service Plan' },
      ],
    },
    {
      code: 'AZ900-Q037',
      title: 'ExamHeist - ARM Templates Declarative Automation',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'ARM templates & Bicep allow declaring infrastructure as code for consistent deployments.',
      prompt: 'Which Azure feature allows you to define application infrastructure declaratively using JSON or Bicep code files for repeatable automated deployments?',
      options: [
        { id: 'opt1', text: 'ARM Templates / Bicep', isCorrect: true },
        { id: 'opt2', text: 'Azure Automation Runbooks' },
        { id: 'opt3', text: 'Azure Functions' },
        { id: 'opt4', text: 'Azure Policy' },
      ],
    },
    {
      code: 'AZ900-Q038',
      title: 'ExamHeist - Azure Cloud Shell Browser Terminal',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Azure Cloud Shell is an interactive, browser-accessible terminal for managing Azure resources.',
      prompt: 'Which browser-accessible, pre-configured terminal environment available directly within the Azure Portal allows you to run Azure CLI and PowerShell scripts without local setup?',
      options: [
        { id: 'opt1', text: 'Azure Cloud Shell', isCorrect: true },
        { id: 'opt2', text: 'Azure Command Prompt' },
        { id: 'opt3', text: 'Windows Terminal Server' },
        { id: 'opt4', text: 'Azure Bastion' },
      ],
    },
    {
      code: 'AZ900-Q039',
      title: 'ExamHeist - Azure DevTest Labs Auto-Shutdown Controls',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure DevTest Labs provides self-service test environments with automated auto-shutdown rules to control costs.',
      prompt: 'A development team needs to quickly spin up disposable Virtual Machine testing environments on-demand with automated auto-shutdown rules to prevent unnecessary overnight billing. Which service is best suited?',
      options: [
        { id: 'opt1', text: 'Azure DevTest Labs', isCorrect: true },
        { id: 'opt2', text: 'Azure Batch' },
        { id: 'opt3', text: 'Virtual Machine Scale Sets' },
        { id: 'opt4', text: 'Azure Automation' },
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

  const qAZ900_DD = await prisma.question.create({
    data: {
      code: 'AZ900-Q030',
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

  const qAZ900_40 = await prisma.question.create({
    data: {
      code: 'AZ900-Q040',
      title: 'ExamHeist - Azure Storage Explorer Desktop GUI Tool',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Azure Storage Explorer is a standalone GUI desktop app for Windows, macOS, and Linux to manage Azure Storage items.',
      categoryId: catAzure.id,
      content: JSON.stringify({
        prompt: 'Which standalone graphical desktop application allows administrators to easily inspect, upload, download, and manage Azure Blobs, Files, Queues, and Tables across Windows, macOS, and Linux?',
        options: [
          { id: 'opt1', text: 'Azure Storage Explorer', isCorrect: true },
          { id: 'opt2', text: 'Azure Data Factory' },
          { id: 'opt3', text: 'Azure Storage Sync' },
          { id: 'opt4', text: 'AzCopy CLI' },
        ],
      }),
    },
  });
  seededAZ900Questions.push(qAZ900_40);

  const examAZ900 = await prisma.exam.create({
    data: {
      code: 'AZ-900',
      title: 'Microsoft Azure Fundamentals (AZ-900)',
      vendor: ExamVendor.MICROSOFT,
      examType: ExamType.CERTIFICATION,
      description: 'Demonstrate foundational knowledge of cloud concepts, Azure architecture, services, security, privacy, pricing, and SLAs with 40 comprehensive practice questions.',
      timeLimitMinutes: 60,
      passingScore: 70.0,
      creatorId: creatorUser.id,
      status: ExamStatus.PUBLISHED,
    },
  });

  const secAZ900 = await prisma.examSection.create({
    data: { examId: examAZ900.id, title: 'Section 1: General Cloud Concepts & Azure Services', orderIndex: 1 },
  });

  let orderAZ = 1;
  for (const q of seededAZ900Questions) {
    await prisma.sectionQuestion.create({ data: { sectionId: secAZ900.id, questionId: q.id, orderIndex: orderAZ++ } });
  }

  console.log(`✅ Successfully seeded ALL ${seededAZ104Questions.length} AZ-104 questions into AZ-104 track!`);
  console.log(`✅ Successfully seeded ALL ${seededAI901Questions.length} AI-901 questions into AI-901 track!`);
  console.log(`✅ Successfully seeded ALL ${seededAI900Questions.length} AI-900 questions into AI-900 track!`);
  console.log(`✅ Successfully seeded ALL ${seededAZ900Questions.length} AZ-900 questions into AZ-900 track!`);
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
