import { PrismaClient } from '@prisma/client';
import { Role, ExamVendor, ExamType, QuestionType, DifficultyLevel, ExamStatus } from '../src/domain/types.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting NTMS Database Seeding with Rich Interactive Question Types (Drag & Drop, Reorder/Sequence, Multi-Choice Checkboxes, Dropdown)...');

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
  // 1. AZ-104 EXAM TRACK (24 QUESTIONS WITH INTERACTIVE ENGINE TYPES)
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

  // Interactive Question 20: Drag and Drop Administrative Tools
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

  // Interactive Question 21: Reorder / Sequence VNet Peering Setup
  const qAZ104_REORDER = await prisma.question.create({
    data: {
      code: 'AZ104-Q021',
      title: 'Configure Global VNet Peering Sequence',
      type: QuestionType.REORDER,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 2.5,
      explanation: 'To establish VNet Peering, both VNet1 and VNet2 must be created, peering added from VNet1 to VNet2, peering added from VNet2 to VNet1, and status verified as Connected.',
      categoryId: catAzure.id,
      content: JSON.stringify({
        prompt: 'Arrange the following steps in the correct chronological sequence to establish operational Global VNet Peering between VNet1 and VNet2.',
        items: [
          { id: 'step1', text: 'Step 1: Create VNet1 in East US and VNet2 in West US' },
          { id: 'step2', text: 'Step 2: Add Peering configuration from VNet1 pointing to VNet2' },
          { id: 'step3', text: 'Step 3: Add Peering configuration from VNet2 pointing back to VNet1' },
          { id: 'step4', text: 'Step 4: Verify Peering Status changes to "Connected" on both VNets' },
        ],
      }),
    },
  });
  seededAZ104Questions.push(qAZ104_REORDER);

  // Interactive Question 22: Dropdown Tool Selection
  const qAZ104_DROPDOWN = await prisma.question.create({
    data: {
      code: 'AZ104-Q022',
      title: 'Azure Admin Tool Selection Dropdown',
      type: QuestionType.DROPDOWN,
      difficulty: DifficultyLevel.BEGINNER,
      points: 2.0,
      explanation: 'Bicep is for IaC templates, IP Flow Verify checks NSG rules, PowerShell automates administrative tasks.',
      categoryId: catAzure.id,
      content: JSON.stringify({
        prompt: 'Select the correct Azure tool for each administrative task from the dropdown options.',
        questions: [
          {
            id: 'q1',
            text: 'Declarative Infrastructure as Code (IaC) template language:',
            options: ['Bicep / ARM Templates', 'Azure CLI', 'Network Watcher'],
            correctAnswer: 'Bicep / ARM Templates',
          },
          {
            id: 'q2',
            text: 'Tool to verify if an NSG rule permits network traffic on Port 443:',
            options: ['IP Flow Verify', 'Azure Advisor', 'Pricing Calculator'],
            correctAnswer: 'IP Flow Verify',
          },
        ],
      }),
    },
  });
  seededAZ104Questions.push(qAZ104_DROPDOWN);

  // Interactive Question 23: Multiple Choice Multi-Redundancy
  const qAZ104_MULTI = await prisma.question.create({
    data: {
      code: 'AZ104-Q023',
      title: 'Storage Redundancy Regional Protection Options',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 2.0,
      explanation: 'GRS, RA-GRS, and GZRS all replicate data to a secondary region. LRS and ZRS keep data in a single region.',
      categoryId: catAzure.id,
      content: JSON.stringify({
        prompt: 'Which Azure Storage redundancy configurations replicate data to a secondary geographic region hundreds of miles away to protect against regional disasters? (Select all that apply)',
        options: [
          { id: 'opt1', text: 'Geo-Redundant Storage (GRS)', isCorrect: true },
          { id: 'opt2', text: 'Read-Access Geo-Redundant Storage (RA-GRS)', isCorrect: true },
          { id: 'opt3', text: 'Geo-Zone-Redundant Storage (GZRS)', isCorrect: true },
          { id: 'opt4', text: 'Locally Redundant Storage (LRS)' },
        ],
      }),
    },
  });
  seededAZ104Questions.push(qAZ104_MULTI);

  const examAZ104 = await prisma.exam.create({
    data: {
      code: 'AZ-104',
      title: 'Microsoft Azure Administrator (AZ-104)',
      vendor: ExamVendor.MICROSOFT,
      examType: ExamType.CERTIFICATION,
      description: 'Demonstrate domain expertise in managing Azure identities, governance, storage, compute, virtual networking, and resource monitoring with 23 practice items including Drag-and-Drop, Sequence Reordering, and Checkboxes.',
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
  // 2. AI-901 EXAM TRACK (18 QUESTIONS WITH INTERACTIVE ENGINE TYPES)
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
      title: 'Azure AI Content Safety Guards',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure AI Content Safety offers Prompt Shields (jailbreak detection) and text/image filters (hate speech, violence, self-harm).',
      prompt: 'Which capabilities are provided by Azure AI Content Safety to safeguard enterprise generative AI applications? (Select two)',
      options: [
        { id: 'opt1', text: 'Prompt Shield / Jailbreak Detection', isCorrect: true },
        { id: 'opt2', text: 'Hate Speech & Violence Moderation Filters', isCorrect: true },
        { id: 'opt3', text: 'VM Auto-Scaling Rules' },
        { id: 'opt4', text: 'DNS Routing' },
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

  // Interactive Question 16: Reorder / Sequence AI Agent Deployment
  const qAI901_REORDER = await prisma.question.create({
    data: {
      code: 'AI901-Q016',
      title: 'Sequence AI Agent Deployment in Azure AI Foundry',
      type: QuestionType.REORDER,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 2.5,
      explanation: 'Correct order: Select model from catalog -> Define system instructions -> Add tools & vector search -> Deploy to REST endpoint.',
      categoryId: catAzure.id,
      content: JSON.stringify({
        prompt: 'Arrange the following steps in the correct chronological sequence to build and deploy an AI Agent in Azure AI Foundry.',
        items: [
          { id: 'step1', text: 'Step 1: Select and benchmark a Foundation Model from the Model Catalog' },
          { id: 'step2', text: 'Step 2: Configure System Message persona and safety guardrails' },
          { id: 'step3', text: 'Step 3: Connect enterprise RAG vector index and custom Python tools' },
          { id: 'step4', text: 'Step 4: Evaluate Groundedness score and deploy agent to a live REST endpoint' },
        ],
      }),
    },
  });
  seededAI901Questions.push(qAI901_REORDER);

  // Interactive Question 17: RAG Evaluation Metrics Multi-Select
  const qAI901_MULTI = await prisma.question.create({
    data: {
      code: 'AI901-Q017',
      title: 'Azure AI Foundry RAG Evaluation Metrics',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 2.0,
      explanation: 'Groundedness and Relevance measure RAG response accuracy against reference context.',
      categoryId: catAzure.id,
      content: JSON.stringify({
        prompt: 'Which metrics in Azure AI Foundry specifically evaluate Retrieval-Augmented Generation (RAG) quality against reference context documents? (Select all that apply)',
        options: [
          { id: 'opt1', text: 'Groundedness Score', isCorrect: true },
          { id: 'opt2', text: 'Relevance Score', isCorrect: true },
          { id: 'opt3', text: 'Coherence Score', isCorrect: true },
          { id: 'opt4', text: 'VM CPU Utilization' },
        ],
      }),
    },
  });
  seededAI901Questions.push(qAI901_MULTI);

  const examAI901 = await prisma.exam.create({
    data: {
      code: 'AI-901',
      title: 'Microsoft Azure AI & AI Foundry Solutions (AI-901)',
      vendor: ExamVendor.MICROSOFT,
      examType: ExamType.CERTIFICATION,
      description: 'Demonstrate expertise in Azure AI Foundry, model evaluation, Prompt Flow DAG orchestration, RAG hybrid search, and AI safety with interactive Drag-and-Drop, Sequence Reordering, and Checkboxes.',
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
  // 3. AI-900 EXAM TRACK (38 QUESTIONS WITH INTERACTIVE ENGINE TYPES)
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
      title: 'Responsible AI - Principles Multi-Select',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Microsoft Responsible AI framework consists of 6 core principles: Fairness, Reliability & Safety, Privacy & Security, Inclusiveness, Transparency, and Accountability.',
      prompt: 'Which of the following are core principles of Microsoft Responsible AI framework? (Select all that apply)',
      options: [
        { id: 'opt1', text: 'Fairness', isCorrect: true },
        { id: 'opt2', text: 'Accountability', isCorrect: true },
        { id: 'opt3', text: 'Transparency', isCorrect: true },
        { id: 'opt4', text: 'Profit Optimization' },
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

  // Interactive Question 36: Reorder Automated ML Lifecycle Steps
  const qAI900_REORDER = await prisma.question.create({
    data: {
      code: 'AI900-Q036',
      title: 'Sequence Azure Machine Learning Lifecycle Steps',
      type: QuestionType.REORDER,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 2.5,
      explanation: 'Order: Upload dataset -> Select compute target -> Run Automated ML -> Deploy best model.',
      categoryId: catAzure.id,
      content: JSON.stringify({
        prompt: 'Arrange the following steps in the correct chronological sequence to build and deploy a machine learning model using Azure ML Studio.',
        items: [
          { id: 'step1', text: 'Step 1: Create a workspace and import the raw training dataset' },
          { id: 'step2', text: 'Step 2: Select a compute target and configure the target ML task type (e.g. Classification)' },
          { id: 'step3', text: 'Step 3: Execute an Automated ML experiment to evaluate multiple algorithms' },
          { id: 'step4', text: 'Step 4: Deploy the highest scoring model as a real-time web service endpoint' },
        ],
      }),
    },
  });
  seededAI900Questions.push(qAI900_REORDER);

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

  let orderAI = 1;
  for (const q of seededAI900Questions) {
    await prisma.sectionQuestion.create({ data: { sectionId: secAI900.id, questionId: q.id, orderIndex: orderAI++ } });
  }

  // ==========================================
  // 4. AZ-900 EXAM TRACK (43 QUESTIONS WITH INTERACTIVE ENGINE TYPES)
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
      code: 'AZ900-Q031',
      title: 'Azure Support Plans Ticket Entitlements Multi-Select',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Developer, Standard, and Professional Direct support plans allow submitting technical support requests.',
      prompt: 'Which Azure support plans grant users the entitlement to submit technical support tickets directly to Microsoft engineers? (Select all that apply)',
      options: [
        { id: 'opt1', text: 'Developer Support Plan', isCorrect: true },
        { id: 'opt2', text: 'Standard Support Plan', isCorrect: true },
        { id: 'opt3', text: 'Professional Direct Support Plan', isCorrect: true },
        { id: 'opt4', text: 'Basic Support Plan' },
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

  // Interactive Question 41: Reorder Azure CLI VM Deployment Sequence
  const qAZ900_REORDER = await prisma.question.create({
    data: {
      code: 'AZ900-Q041',
      title: 'Sequence Azure CLI VM Deployment Commands',
      type: QuestionType.REORDER,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 2.5,
      explanation: 'Chronological order: az login -> az group create -> az vm create -> az vm open-port.',
      categoryId: catAzure.id,
      content: JSON.stringify({
        prompt: 'Arrange the following Azure CLI commands in the correct sequence to authenticate, create a resource group, provision a Linux VM, and open HTTP port 80.',
        items: [
          { id: 'step1', text: 'Step 1: az login' },
          { id: 'step2', text: 'Step 2: az group create --name myRG --location eastus' },
          { id: 'step3', text: 'Step 3: az vm create --resource-group myRG --name myVM --image Ubuntu2204' },
          { id: 'step4', text: 'Step 4: az vm open-port --port 80 --resource-group myRG --name myVM' },
        ],
      }),
    },
  });
  seededAZ900Questions.push(qAZ900_REORDER);

  // Interactive Question 42: Cloud Benefits Multi-Select
  const qAZ900_MULTI = await prisma.question.create({
    data: {
      code: 'AZ900-Q042',
      title: 'Cloud Computing Key Benefits Multi-Select',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 2.0,
      explanation: 'High availability, scalability, elasticity, and disaster recovery are primary cloud benefits.',
      categoryId: catAzure.id,
      content: JSON.stringify({
        prompt: 'Which of the following are primary benefits of migrating workloads to public cloud computing? (Select all that apply)',
        options: [
          { id: 'opt1', text: 'High Availability & Fault Tolerance', isCorrect: true },
          { id: 'opt2', text: 'Elasticity & Dynamic Auto-scaling', isCorrect: true },
          { id: 'opt3', text: 'Global Reach & Low Latency', isCorrect: true },
          { id: 'opt4', text: 'Fixed mandatory 10-year physical hardware leases' },
        ],
      }),
    },
  });
  seededAZ900Questions.push(qAZ900_MULTI);

  const examAZ900 = await prisma.exam.create({
    data: {
      code: 'AZ-900',
      title: 'Microsoft Azure Fundamentals (AZ-900)',
      vendor: ExamVendor.MICROSOFT,
      examType: ExamType.CERTIFICATION,
      description: 'Demonstrate foundational knowledge of cloud concepts, Azure architecture, services, security, privacy, pricing, and SLAs with interactive Drag-and-Drop, Sequence Reordering, and Checkboxes.',
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
