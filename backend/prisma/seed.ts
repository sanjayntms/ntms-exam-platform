import { PrismaClient } from '@prisma/client';
import { Role, ExamVendor, ExamType, QuestionType, DifficultyLevel, ExamStatus } from '../src/domain/types.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting NTMS Database Seeding with Full Question Banks across ALL 4 Exam Tracks (AZ-104, AI-901, AI-900, AZ-900)...');

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

  // Helper for bulk question creation
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
          difficulty: ddData.difficulty || DifficultyLevel.INTERMEDIATE,
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
          difficulty: rData.difficulty || DifficultyLevel.INTERMEDIATE,
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
          difficulty: dData.difficulty || DifficultyLevel.BEGINNER,
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
          difficulty: mData.difficulty || DifficultyLevel.INTERMEDIATE,
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
  // 1. AZ-104 TRACK (24 RICH INTERACTIVE ITEMS)
  // ==========================================
  const az104Single = [
    {
      code: 'AZ104-Q001',
      title: 'RBAC - Built-in Virtual Machine Contributor Role',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Virtual Machine Contributor lets you manage VMs, but not access to them or the virtual network/storage account, nor grant RBAC permissions.',
      prompt: 'You need to grant a user named User1 the ability to create and manage virtual machines in a specific Resource Group, but User1 must NOT be able to grant access rights to other users. Which Built-in Azure RBAC role should you assign?',
      options: [
        { id: 'opt1', text: 'Virtual Machine Contributor', isCorrect: true },
        { id: 'opt2', text: 'Owner' },
        { id: 'opt3', text: 'Contributor' },
        { id: 'opt4', text: 'User Access Administrator' },
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
      code: 'AZ104-Q005',
      title: 'Blob Storage - Lifecycle Management Automation',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Lifecycle management rules automatically transition blobs to cool/archive tiers or delete them.',
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
      explanation: 'Availability Sets distribute VMs across multiple physical fault domains to guarantee a 99.95% SLA.',
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
      explanation: 'ACI provides serverless container execution for short-lived batch jobs.',
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
      explanation: 'NSG rules are processed in priority order from lowest number to highest.',
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
      explanation: 'UDRs override Azure default routes to force 0.0.0.0/0 to a Virtual Appliance.',
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
      explanation: 'A public load balancer maps the public IP address and port number of incoming traffic to private IPs.',
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
      explanation: 'Azure Private DNS Zones provide name resolution for VMs across linked VNets.',
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
      explanation: 'Log Analytics Workspace stores log telemetry and enables KQL queries.',
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
      explanation: 'A Recovery Services Vault stores backup data and policies for Azure VMs.',
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
      explanation: 'Azure Site Recovery (ASR) handles disaster recovery by replicating workloads to a secondary region.',
      prompt: 'You need to orchestrate business continuity and disaster recovery (BCDR) for Azure VMs by replicating them from the East US region to the West US region. Which service should you configure?',
      options: [
        { id: 'opt1', text: 'Azure Site Recovery (ASR)', isCorrect: true },
        { id: 'opt2', text: 'Azure Backup' },
        { id: 'opt3', text: 'Azure Import/Export' },
        { id: 'opt4', text: 'Virtual Machine Scale Sets' },
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

  const az104Reorder = [
    {
      code: 'AZ104-Q021',
      title: 'Configure Global VNet Peering Sequence',
      prompt: 'Arrange the following steps in the correct chronological sequence to establish operational Global VNet Peering between VNet1 and VNet2.',
      items: [
        { id: 'step1', text: 'Step 1: Create VNet1 in East US and VNet2 in West US' },
        { id: 'step2', text: 'Step 2: Add Peering configuration from VNet1 pointing to VNet2' },
        { id: 'step3', text: 'Step 3: Add Peering configuration from VNet2 pointing back to VNet1' },
        { id: 'step4', text: 'Step 4: Verify Peering Status changes to "Connected" on both VNets' },
      ],
    },
  ];

  const az104Dropdown = [
    {
      code: 'AZ104-Q022',
      title: 'Azure Admin Tool Selection Dropdown',
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
    },
  ];

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
    {
      code: 'AZ104-Q004',
      title: 'Storage Account Security - VNet Service Endpoints & Firewalls',
      prompt: 'You have an Azure Storage Account named store1. You need to ensure that store1 accepts network connections ONLY from a specific subnet named Subnet1 in VNet1. Which features should you configure? (Select two)',
      options: [
        { id: 'opt1', text: 'Virtual Network Service Endpoints / Private Endpoints', isCorrect: true },
        { id: 'opt2', text: 'Storage Account Firewalls & Virtual Networks configuration', isCorrect: true },
        { id: 'opt3', text: 'Shared Access Signatures (SAS)' },
        { id: 'opt4', text: 'Access Keys' },
      ],
    },
    {
      code: 'AZ104-Q023',
      title: 'Storage Redundancy Regional Protection Options',
      prompt: 'Which Azure Storage redundancy configurations replicate data to a secondary geographic region hundreds of miles away to protect against regional disasters? (Select all that apply)',
      options: [
        { id: 'opt1', text: 'Geo-Redundant Storage (GRS)', isCorrect: true },
        { id: 'opt2', text: 'Read-Access Geo-Redundant Storage (RA-GRS)', isCorrect: true },
        { id: 'opt3', text: 'Geo-Zone-Redundant Storage (GZRS)', isCorrect: true },
        { id: 'opt4', text: 'Locally Redundant Storage (LRS)' },
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
      description: 'Demonstrate domain expertise in managing Azure identities, governance, storage, compute, virtual networking, and resource monitoring with 24 items (Drag-and-Drop, Sequence Reordering, Multi-Choice Checkboxes, and Dropdowns).',
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
  // 2. AI-901 TRACK (18 RICH INTERACTIVE ITEMS)
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
    {
      code: 'AI901-Q002',
      title: 'Azure AI Foundry - Agent Service & SDK',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure AI Agent Service allows developers to build enterprise AI agents capable of calling custom functions.',
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
      explanation: 'Groundedness measures how well the generated answer is supported by reference documents.',
      prompt: 'When testing a Retrieval-Augmented Generation (RAG) agent in Azure AI Foundry, which evaluation metric measures whether the model\'s generated answer is strictly derived from retrieved context documents without hallucination?',
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
      explanation: 'Prompt Flow allows developers to orchestrate LLMs, Python code, and search tools into DAG pipelines.',
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
      explanation: 'Provisioned Throughput Units reserve dedicated processing capacity for Azure OpenAI model deployments.',
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
      explanation: 'Hybrid search combines BM25 keyword search and dense vector search, improved by a semantic re-ranker model.',
      prompt: 'To improve search accuracy for a domain-specific knowledge base, you combine BM25 keyword search with dense vector similarity search and a semantic re-ranker model. What search architecture is this?',
      options: [
        { id: 'opt1', text: 'Hybrid Search with Semantic Re-ranking', isCorrect: true },
        { id: 'opt2', text: 'Pure Vector Search' },
        { id: 'opt3', text: 'Full-Text Lexical Search' },
        { id: 'opt4', text: 'Graph Database Query' },
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

  const ai901Reorder = [
    {
      code: 'AI901-Q016',
      title: 'Sequence AI Agent Deployment in Azure AI Foundry',
      prompt: 'Arrange the following steps in the correct chronological sequence to build and deploy an AI Agent in Azure AI Foundry.',
      items: [
        { id: 'step1', text: 'Step 1: Select and benchmark a Foundation Model from the Model Catalog' },
        { id: 'step2', text: 'Step 2: Configure System Message persona and safety guardrails' },
        { id: 'step3', text: 'Step 3: Connect enterprise RAG vector index and custom Python tools' },
        { id: 'step4', text: 'Step 4: Evaluate Groundedness score and deploy agent to a live REST endpoint' },
      ],
    },
  ];

  const ai901Dropdown = [
    {
      code: 'AI901-Q018',
      title: 'Azure AI Solution Models Dropdown',
      prompt: 'Select the appropriate Azure AI service model for each enterprise scenario.',
      questions: [
        {
          id: 'q1',
          text: 'Prebuilt model to extract tables and selection marks from financial PDFs:',
          options: ['Layout Model', 'Read Model', 'Custom Vision'],
          correctAnswer: 'Layout Model',
        },
        {
          id: 'q2',
          text: 'Feature to generate synthetic brand voice matching a spokesperson:',
          options: ['Custom Neural Voice', 'Standard Text-to-Speech', 'Speaker Identification'],
          correctAnswer: 'Custom Neural Voice',
        },
      ],
    },
  ];

  const ai901Multi = [
    {
      code: 'AI901-Q007',
      title: 'Azure AI Content Safety Guards Multi-Select',
      prompt: 'Which capabilities are provided by Azure AI Content Safety to safeguard enterprise generative AI applications? (Select two)',
      options: [
        { id: 'opt1', text: 'Prompt Shield / Jailbreak Detection', isCorrect: true },
        { id: 'opt2', text: 'Hate Speech & Violence Moderation Filters', isCorrect: true },
        { id: 'opt3', text: 'VM Auto-Scaling Rules' },
        { id: 'opt4', text: 'DNS Routing' },
      ],
    },
    {
      code: 'AI901-Q017',
      title: 'Azure AI Foundry RAG Evaluation Metrics Multi-Select',
      prompt: 'Which metrics in Azure AI Foundry specifically evaluate Retrieval-Augmented Generation (RAG) quality against reference context documents? (Select all that apply)',
      options: [
        { id: 'opt1', text: 'Groundedness Score', isCorrect: true },
        { id: 'opt2', text: 'Relevance Score', isCorrect: true },
        { id: 'opt3', text: 'Coherence Score', isCorrect: true },
        { id: 'opt4', text: 'VM CPU Utilization' },
      ],
    },
  ];

  const seededAI901 = await seedTrack(ai901Single, ai901DragDrop, ai901Reorder, ai901Dropdown, ai901Multi, catAzure.id);

  const examAI901 = await prisma.exam.create({
    data: {
      code: 'AI-901',
      title: 'Microsoft Azure AI & AI Foundry Solutions (AI-901)',
      vendor: ExamVendor.MICROSOFT,
      examType: ExamType.CERTIFICATION,
      description: 'Demonstrate expertise in Azure AI Foundry, model evaluation, Prompt Flow DAG orchestration, RAG hybrid search, and AI safety with interactive Drag-and-Drop, Sequence Reordering, Multi-Choice Checkboxes, and Dropdowns.',
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
  // 3. AI-900 TRACK (38 RICH INTERACTIVE ITEMS)
  // ==========================================
  const ai900Single = [
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

  const ai900Reorder = [
    {
      code: 'AI900-Q036',
      title: 'Sequence Azure Machine Learning Lifecycle Steps',
      prompt: 'Arrange the following steps in the correct chronological sequence to build and deploy a machine learning model using Azure ML Studio.',
      items: [
        { id: 'step1', text: 'Step 1: Create a workspace and import the raw training dataset' },
        { id: 'step2', text: 'Step 2: Select a compute target and configure the target ML task type (e.g. Classification)' },
        { id: 'step3', text: 'Step 3: Execute an Automated ML experiment to evaluate multiple algorithms' },
        { id: 'step4', text: 'Step 4: Deploy the highest scoring model as a real-time web service endpoint' },
      ],
    },
  ];

  const ai900Dropdown = [
    {
      code: 'AI900-Q039',
      title: 'NLP Services Function Dropdown',
      prompt: 'Select the correct Natural Language Processing feature for each scenario.',
      questions: [
        {
          id: 'q1',
          text: 'Identify positive or negative customer tone in social media posts:',
          options: ['Sentiment Analysis', 'Key Phrase Extraction', 'Language Detection'],
          correctAnswer: 'Sentiment Analysis',
        },
        {
          id: 'q2',
          text: 'Infrastructure for building interactive conversational 24/7 chatbots:',
          options: ['Azure Bot Service', 'Azure AI Content Safety', 'Custom Vision'],
          correctAnswer: 'Azure Bot Service',
        },
      ],
    },
  ];

  const ai900Multi = [
    {
      code: 'AI900-Q002',
      title: 'Responsible AI Principles Multi-Select',
      prompt: 'Which of the following are core principles of Microsoft Responsible AI framework? (Select all that apply)',
      options: [
        { id: 'opt1', text: 'Fairness', isCorrect: true },
        { id: 'opt2', text: 'Accountability', isCorrect: true },
        { id: 'opt3', text: 'Transparency', isCorrect: true },
        { id: 'opt4', text: 'Profit Optimization' },
      ],
    },
    {
      code: 'AI900-Q038',
      title: 'Azure Computer Vision Capabilities Multi-Select',
      prompt: 'Which of the following services are capabilities provided by Azure AI Vision? (Select two)',
      options: [
        { id: 'opt1', text: 'Spatial Analysis for camera feeds', isCorrect: true },
        { id: 'opt2', text: 'Optical Character Recognition (OCR)', isCorrect: true },
        { id: 'opt3', text: 'ExpressRoute Circuit Peering' },
        { id: 'opt4', text: 'SQL Data Warehousing' },
      ],
    },
  ];

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
  // 4. AZ-900 TRACK (43 RICH INTERACTIVE ITEMS)
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
    {
      code: 'AZ900-Q002',
      title: 'CapEx vs OpEx in Cloud Computing',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Public cloud computing transforms capital expenditure (CapEx) into operating expenditure (OpEx).',
      prompt: 'Which cloud computing model converts upfront capital expenditure (CapEx) into flexible operating expenditure (OpEx)?',
      options: [
        { id: 'opt1', text: 'Public Cloud', isCorrect: true },
        { id: 'opt2', text: 'On-Premises Datacenter' },
        { id: 'opt3', text: 'Private Cloud' },
        { id: 'opt4', text: 'Local SAN Infrastructure' },
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

  const az900Reorder = [
    {
      code: 'AZ900-Q041',
      title: 'Sequence Azure CLI VM Deployment Commands',
      prompt: 'Arrange the following Azure CLI commands in the correct sequence to authenticate, create a resource group, provision a Linux VM, and open HTTP port 80.',
      items: [
        { id: 'step1', text: 'Step 1: az login' },
        { id: 'step2', text: 'Step 2: az group create --name myRG --location eastus' },
        { id: 'step3', text: 'Step 3: az vm create --resource-group myRG --name myVM --image Ubuntu2204' },
        { id: 'step4', text: 'Step 4: az vm open-port --port 80 --resource-group myRG --name myVM' },
      ],
    },
  ];

  const az900Dropdown = [
    {
      code: 'AZ900-Q043',
      title: 'Azure Cloud Service Models Responsibility Dropdown',
      prompt: 'Select the correct cloud service model for each management responsibility scenario.',
      questions: [
        {
          id: 'q1',
          text: 'Vendor manages hardware, networking, and OS; customer manages code and data:',
          options: ['Platform as a Service (PaaS)', 'Infrastructure as a Service (IaaS)', 'Software as a Service (SaaS)'],
          correctAnswer: 'Platform as a Service (PaaS)',
        },
        {
          id: 'q2',
          text: 'Customer has full root access and configures OS patching:',
          options: ['Infrastructure as a Service (IaaS)', 'Platform as a Service (PaaS)', 'SaaS'],
          correctAnswer: 'Infrastructure as a Service (IaaS)',
        },
      ],
    },
  ];

  const az900Multi = [
    {
      code: 'AZ900-Q031',
      title: 'Azure Support Plans Ticket Entitlements Multi-Select',
      prompt: 'Which Azure support plans grant users the entitlement to submit technical support tickets directly to Microsoft engineers? (Select all that apply)',
      options: [
        { id: 'opt1', text: 'Developer Support Plan', isCorrect: true },
        { id: 'opt2', text: 'Standard Support Plan', isCorrect: true },
        { id: 'opt3', text: 'Professional Direct Support Plan', isCorrect: true },
        { id: 'opt4', text: 'Basic Support Plan' },
      ],
    },
    {
      code: 'AZ900-Q042',
      title: 'Cloud Computing Key Benefits Multi-Select',
      prompt: 'Which of the following are primary benefits of migrating workloads to public cloud computing? (Select all that apply)',
      options: [
        { id: 'opt1', text: 'High Availability & Fault Tolerance', isCorrect: true },
        { id: 'opt2', text: 'Elasticity & Dynamic Auto-scaling', isCorrect: true },
        { id: 'opt3', text: 'Global Reach & Low Latency', isCorrect: true },
        { id: 'opt4', text: 'Fixed mandatory 10-year physical hardware leases' },
      ],
    },
  ];

  const seededAZ900 = await seedTrack(az900Single, az900DragDrop, az900Reorder, az900Dropdown, az900Multi, catAzure.id);

  const examAZ900 = await prisma.exam.create({
    data: {
      code: 'AZ-900',
      title: 'Microsoft Azure Fundamentals (AZ-900)',
      vendor: ExamVendor.MICROSOFT,
      examType: ExamType.CERTIFICATION,
      description: 'Demonstrate foundational knowledge of cloud concepts, Azure architecture, services, security, privacy, pricing, and SLAs with interactive Drag-and-Drop, Sequence Reordering, Multi-Choice Checkboxes, and Dropdowns.',
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

  console.log(`✅ Successfully seeded ${seededAZ104.length} items in AZ-104!`);
  console.log(`✅ Successfully seeded ${seededAI901.length} items in AI-901!`);
  console.log(`✅ Successfully seeded ${seededAI900.length} items in AI-900!`);
  console.log(`✅ Successfully seeded ${seededAZ900.length} items in AZ-900!`);
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
