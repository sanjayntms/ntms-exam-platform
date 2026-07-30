import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function main() {
  console.log('🌱 Starting Seeding for ALL 6 Certification Tracks with Objective Domains & Configurable Section Weights...');

  // Clean exam structure tables only (Preserving candidate attempts and user accounts)
  await prisma.auditLog.deleteMany();
  await prisma.sectionQuestion.deleteMany();
  await prisma.examSection.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.questionOnTag.deleteMany();
  await prisma.question.deleteMany();
  await prisma.category.deleteMany();
  await prisma.tag.deleteMany();

  // Create or update Admin User
  const creatorUser = await prisma.user.upsert({
    where: { email: 'sanjay@ntmsentra.onmicrosoft.com' },
    update: { name: 'Sanjay Admin', role: 'ADMINISTRATOR', isActive: true },
    create: {
      email: 'sanjay@ntmsentra.onmicrosoft.com',
      name: 'Sanjay Admin',
      role: 'ADMINISTRATOR',
      isActive: true,
    },
  });

  // Create or update Candidate User
  const candidateUser = await prisma.user.upsert({
    where: { email: 'candidate@ntms.com' },
    update: { name: 'Standard Candidate', role: 'CANDIDATE', isActive: true },
    create: {
      email: 'candidate@ntms.com',
      name: 'Standard Candidate',
      role: 'CANDIDATE',
      isActive: true,
    },
  });

  // Create or update User1 Candidate
  const user1Candidate = await prisma.user.upsert({
    where: { email: 'user1@ntmscloud.in' },
    update: { name: 'user1', role: 'CANDIDATE', isActive: true },
    create: {
      email: 'user1@ntmscloud.in',
      name: 'user1',
      role: 'CANDIDATE',
      isActive: true,
    },
  });

  const catAzure = await prisma.category.create({
    data: { name: 'Microsoft Azure', description: 'Cloud Computing Certification & Skill Domain Questions' },
  });

  async function seedQuestionList(questions: any[], categoryId: string) {
    const created: any[] = [];
    for (const q of questions) {
      const dbQ = await prisma.question.create({
        data: {
          code: q.code,
          title: q.title,
          type: q.type || 'SINGLE_CHOICE',
          difficulty: q.difficulty || 'INTERMEDIATE',
          points: q.points || 1.0,
          explanation: q.explanation,
          content: JSON.stringify(q.content),
          categoryId,
        },
      });
      created.push(dbQ);
    }
    return created;
  }

  // ==========================================
  // 1. AZ-305 - 25 UNIQUE QUESTIONS & 4 OBJECTIVE DOMAINS
  // ==========================================
  const az305Domain1 = [
    { title: 'Identity Architecture - Azure AD B2C vs B2B', prompt: 'You are designing an architecture for a public-facing e-commerce application that allows external consumers to register using social identity providers (Google, Facebook) or email accounts. Which identity solution should you recommend?', correct: 'Azure AD B2C (Business-to-Consumer)', bad1: 'Azure AD B2B Direct Federation', bad2: 'Azure AD Managed Identities', bad3: 'Active Directory Domain Services (AD DS)', exp: 'Azure AD B2C is built specifically for consumer-facing application identity management.' },
    { title: 'Governance - Custom Azure Policy Enforce Location', prompt: 'Your company requires that all new Azure resources are restricted to the East US and West US regions only. How should you design governance to automatically enforce this compliance policy?', correct: 'Assign a built-in Azure Policy Allowed locations definition to the target Management Group.', bad1: 'Configure Azure Network Security Group (NSG) outbound rules', bad2: 'Enable Defender for Cloud compliance alerts', bad3: 'Apply a Resource Lock to the subscription', exp: 'Azure Policy enforces resource deployment compliance across management groups.' },
    { title: 'Identity - Privileged Identity Management (PIM)', prompt: 'You need to minimize security risks for administrators managing Azure subscription resources by requiring multi-factor authentication (MFA) and ticket justification before granting temporary 4-hour elevation to the Contributor role. What solution should you design?', correct: 'Configure Azure AD Privileged Identity Management (PIM) with Just-In-Time (JIT) eligible role assignments.', bad1: 'Assign permanent Contributor role to administrator user accounts', bad2: 'Use Azure Automation Runbooks to toggle RBAC permissions', bad3: 'Create temporary Azure Service Principals daily', exp: 'Azure AD PIM enables just-in-time privileged access with MFA and audit justification.' },
    { title: 'Monitoring - Log Analytics Workspace Architecture', prompt: 'An enterprise has 50 Azure subscriptions across three geographic regions. You need a centralized monitoring design that allows cross-workspace queries while maintaining regional data residency compliance. What should you recommend?', correct: 'Deploy regional Log Analytics workspaces per region and query across them using workspace() function in KQL.', bad1: 'Export all logs to a single centralized US Storage Account', bad2: 'Disable log ingestion in non-US regions', bad3: 'Use Azure Event Grid to broadcast logs to local files', exp: 'Regional Log Analytics workspaces preserve data residency while KQL allows cross-workspace analysis.' },
    { title: 'Governance - Management Group Hierarchy', prompt: 'An enterprise needs to apply consistent RBAC role definitions and policy assignments across 20 Azure subscriptions belonging to different business units. What component should you design?', correct: 'Hierarchical Management Group structure aligned with Business Units and Environment tiers.', bad1: 'Individual Resource Group tags', bad2: 'Subscription-level local admin accounts', bad3: 'Azure ExpressRoute circuit policies', exp: 'Management Groups enable hierarchical governance and policy inheritance across multiple subscriptions.' },
    { title: 'Identity - Managed Identities for App Services', prompt: 'An Azure App Service web application needs to securely read database connection strings from Azure Key Vault without embedding credentials in code or configuration files. What identity option should you design?', correct: 'System-Assigned Managed Identity with Key Vault Secret User RBAC role.', bad1: 'Store database credentials in App Service application settings in plain text', bad2: 'Hardcode Key Vault client secret in web.config file', bad3: 'Use Azure Storage Account Shared Access Signature (SAS) key', exp: 'Managed Identities provide Azure AD tokens without credential maintenance in source code.' },
    { title: 'Monitoring - Microsoft Sentinel SIEM Integration', prompt: 'You need to aggregate security logs, audit events, and threat alerts across Azure subscriptions, AWS accounts, and on-premises firewalls into a single SIEM solution. Which service should you choose?', correct: 'Microsoft Sentinel Log Analytics workspace.', bad1: 'Azure Application Insights', bad2: 'Azure Monitor Network Watcher', bad3: 'Azure Metrics Explorer', exp: 'Microsoft Sentinel provides cloud-native SIEM and SOAR capability across multi-cloud environments.' },
  ];

  const az305Domain2 = [
    { title: 'Database Architecture - SQL Hyperscale', prompt: 'Designing an enterprise OLTP database requiring auto-scaling storage up to 100 TB and near-instantaneous storage backups regardless of database size uses which database tier?', correct: 'Azure SQL Database Hyperscale Tier', bad1: 'General Purpose Tier', bad2: 'Cosmos DB Table API', bad3: 'Basic SQL Database', exp: 'Hyperscale tier auto-scales storage up to 100 TB with rapid snapshot backups.' },
    { title: 'Data Architecture - Cosmos DB Multi-Region Write', prompt: 'You are designing a global mobile app requiring sub-10 millisecond latency for both read and write operations worldwide. What database configuration should you select?', correct: 'Azure Cosmos DB with Multi-Region Writes enabled', bad1: 'Azure SQL Database with Read Scale-Out', bad2: 'Azure Database for PostgreSQL Single Server', bad3: 'Azure Table Storage with LRS', exp: 'Cosmos DB multi-region writes deliver single-digit millisecond latency worldwide.' },
    { title: 'Storage Architecture - Data Lake Storage Gen2 Lifecycle', prompt: 'You need to design a storage strategy where parquet data files uploaded to container storage are automatically moved to Archive storage after 90 days and deleted after 365 days to reduce costs. What feature should you configure?', correct: 'Azure Blob Storage Lifecycle Management rules', bad1: 'Azure Data Factory Copy Activity scheduled pipeline', bad2: 'AzCopy command script in Azure Automation', bad3: 'Storage Account soft delete policy', exp: 'Lifecycle Management rules automate blob tier transitions and retention.' },
    { title: 'Database Architecture - SQL Managed Instance Isolation', prompt: 'An enterprise requires migrating on-premises SQL Server instances to Azure with full SQL Agent job compatibility and complete VNet private IP isolation. What solution should you design?', correct: 'Azure SQL Managed Instance deployed into a dedicated VNet subnet', bad1: 'Azure SQL Database Serverless Tier', bad2: 'Azure Cosmos DB Core SQL API', bad3: 'Azure Database for MySQL', exp: 'SQL Managed Instance provides near 100% SQL Server engine compatibility and native VNet integration.' },
    { title: 'Data Warehousing - Synapse Analytics Dedicated SQL Pools', prompt: 'You are designing a data warehouse processing multi-terabyte analytical queries daily using columnar storage and massively parallel processing (MPP). Which tier should you design?', correct: 'Azure Synapse Analytics Dedicated SQL Pool', bad1: 'Azure SQL Database Basic Tier', bad2: 'Azure Cache for Redis', bad3: 'Azure Stream Analytics job', exp: 'Synapse Dedicated SQL Pools use MPP architecture for large scale enterprise analytics.' },
    { title: 'Storage Security - Storage Encryption with CMK', prompt: 'A financial organization mandates storing data encrypted at rest where the encryption keys are owned, rotated, and managed in a dedicated Hardware Security Module (HSM). Which solution meets this requirement?', correct: 'Customer-Managed Keys (CMK) stored in Azure Key Vault Managed HSM', bad1: 'Platform-Managed Keys (PMK) in Microsoft Storage', bad2: 'BitLocker drive encryption on local client PC', bad3: 'Unencrypted Blob Storage with HTTPS transport', exp: 'Managed HSM provides FIPS 140-2 Level 3 validated single-tenant key storage for CMK.' },
    { title: 'Database Availability - Cosmos DB Consistency Levels', prompt: 'A banking application requires strict linearizability where reads are guaranteed to return the most recent committed write globally. Which Cosmos DB consistency level should you select?', correct: 'Strong Consistency Level', bad1: 'Eventual Consistency Level', bad2: 'Session Consistency Level', bad3: 'Consistent Prefix Level', exp: 'Strong consistency guarantees linearizability and zero staleness window.' },
  ];

  const az305Domain3 = [
    { title: 'Business Continuity - Auto-Failover Groups', prompt: 'An enterprise application requires RPO < 5 seconds and RTO < 30 seconds across two Azure regions for SQL workloads. What solution should you design?', correct: 'Azure SQL Database Active Geo-Replication with Auto-Failover Groups', bad1: 'Manual BACPAC restores', bad2: 'Geo-redundant storage read access', bad3: 'VM script failovers', exp: 'Auto-Failover Groups provide multi-region database failover with minimal RPO/RTO.' },
    { title: 'Disaster Recovery - Azure Site Recovery (ASR)', prompt: 'You need to design a disaster recovery solution for 50 IaaS virtual machines running in Azure East US to fail over to West US in case of a regional outage. Which service should you incorporate?', correct: 'Azure Site Recovery (ASR) with target region replication policies', bad1: 'Azure Backup Vault scheduled VM snapshots', bad2: 'Azure Traffic Manager DNS routing without replication', bad3: 'Azure ExpressRoute private peering', exp: 'ASR provides automated replication, orchestration, and failover for Azure VMs.' },
    { title: 'High Availability - Multi-Region Front Door Load Balancing', prompt: 'You need to route HTTP/HTTPS web traffic across web application instances deployed in US East and US West with automatic global SSL offloading, web application firewall (WAF), and instant failover. Which service should you choose?', correct: 'Azure Front Door', bad1: 'Azure Basic Load Balancer', bad2: 'Internal Application Gateway without public listener', bad3: 'Network Security Group flow logs', exp: 'Azure Front Door is a global, scalable entry-point that uses the Microsoft global edge network.' },
    { title: 'Backup Architecture - Azure Backup Vault Storage Tiering', prompt: 'You need to retain long-term compliance backups of Azure Virtual Machines for 7 years while minimizing monthly backup storage costs. What tiering strategy should you design?', correct: 'Azure Backup Vault with Vault-Archive Tier policy rules', bad1: 'Keep all daily recovery points in Vault-Standard tier for 7 years', bad2: 'Download backups to local USB drives', bad3: 'Disable backup retention after 30 days', exp: 'Vault-Archive tier reduces long-term backup storage costs significantly for multi-year retention.' },
  ];

  const az305Domain4 = [
    { title: 'Compute Architecture - Azure Container Apps vs AKS', prompt: 'A development team wants to deploy microservices running in Docker containers that automatically scale to zero when idle, without managing Kubernetes clusters or nodes. What compute service should you recommend?', correct: 'Azure Container Apps', bad1: 'Azure Kubernetes Service (AKS) bare-metal node pool', bad2: 'Azure Virtual Machines Scale Sets', bad3: 'Azure Batch Service', exp: 'Azure Container Apps enables serverless microservices built on KEDA and Envoy without cluster management.' },
    { title: 'Networking Architecture - Hub-and-Spoke VNet Topology', prompt: 'You are designing a secure network topology for 20 workload VNets. All internet-bound and inter-spoke traffic must pass through a centralized security inspect point. What topology should you design?', correct: 'Hub-and-Spoke network topology with Azure Firewall in the Hub VNet and VNet Peering to Spokes', bad1: 'Full Mesh VNet Peering between all 20 VNets without a hub', bad2: 'Single flat VNet containing all 20 subnets', bad3: 'Isolated VNets connected via public IPs only', exp: 'Hub-and-Spoke topology centralizes shared security services (Azure Firewall) efficiently.' },
    { title: 'Hybrid Connectivity - ExpressRoute Direct with VPN Backup', prompt: 'An enterprise requires 10 Gbps private connection between on-premises datacenters and Azure with automatic encrypted failover to internet-based S2S VPN if ExpressRoute fails. How should you design routing?', correct: 'ExpressRoute with S2S VPN configured as a backup path using BGP weight tuning', bad1: 'Two internet S2S VPN connections only', bad2: 'Point-to-Site VPN configured on every workstation', bad3: 'Manual DNS IP reassignment during outage', exp: 'Configuring S2S VPN as a backup path for ExpressRoute provides high-availability hybrid connectivity.' },
    { title: 'Compute Architecture - Scale Sets with Spot VMs', prompt: 'A batch processing workload runs stateless image rendering tasks for 6 hours daily and can tolerate interrupted node terminations. How can you minimize compute costs?', correct: 'Azure Virtual Machine Scale Sets using Azure Spot Virtual Machines', bad1: 'Dedicated Azure Dedicated Hosts', bad2: 'Standard D-series Reserved Instances for 3 years', bad3: 'Single large General Purpose VM running 24/7', exp: 'Azure Spot VMs offer unused compute capacity at up to 90% discount for fault-tolerant workloads.' },
    { title: 'Compute Architecture - App Service Auto-Scale', prompt: 'A web portal experiences predictable daily traffic spikes between 9 AM and 5 PM. How should you design compute auto-scaling to maintain performance while controlling costs?', correct: 'App Service Plan metric-based Autoscale rules combined with scheduled time-window scaling', bad1: 'Static maximum instance scale 24/7', bad2: 'Manual restart of App Service instance daily', bad3: 'Disable auto-scaling and throttle user requests', exp: 'Scheduled and metric-based autoscale optimizes app responsiveness and cost control.' },
    { title: 'Networking Architecture - Private Endpoints for PaaS', prompt: 'You need to ensure that corporate workload virtual machines connect to Azure Storage accounts and Azure SQL databases exclusively over private IP addresses within the VNet without exposing public endpoints. What component should you design?', correct: 'Azure Private Endpoints with Private DNS Zones', bad1: 'Public IP addresses with NSG open rules', bad2: 'User Defined Routes pointing to Internet Gateway', bad3: 'Virtual Network NAT Gateway', exp: 'Private Endpoints bring PaaS services into your VNet with private IP addresses.' },
    { title: 'Compute Architecture - AKS Node Pool Isolation', prompt: 'An enterprise AKS deployment requires isolating critical system daemon pods (CoreDNS, kube-proxy) from user workloads. How should you structure the node pool architecture?', correct: 'Separate System Node Pool (for cluster daemons) and User Node Pools with taints and tolerations', bad1: 'Single default node pool for all pods', bad2: 'Deploy 5 separate AKS clusters for each application', bad3: 'Run system pods on on-premises hypervisors', exp: 'AKS supports dedicated System and User node pools for workload isolation and stability.' },
  ];

  async function prepareDomainQuestions(domainList: any[], codePrefix: string) {
    const list: any[] = [];
    domainList.forEach((q, idx) => {
      const qNum = String(idx + 1).padStart(3, '0');
      list.push({
        code: `${codePrefix}-Q${qNum}`,
        title: q.title,
        type: 'SINGLE_CHOICE',
        difficulty: 'ADVANCED',
        points: 1.0,
        explanation: q.exp,
        content: {
          prompt: q.prompt,
          options: shuffleArray([
            { id: 'opt1', text: q.correct, isCorrect: true },
            { id: 'opt2', text: q.bad1 },
            { id: 'opt3', text: q.bad2 },
            { id: 'opt4', text: q.bad3 },
          ]),
        },
      });
    });
    return seedQuestionList(list, catAzure.id);
  }

  const seededAZ305_D1 = await prepareDomainQuestions(az305Domain1, 'AZ305-D1');
  const seededAZ305_D2 = await prepareDomainQuestions(az305Domain2, 'AZ305-D2');
  const seededAZ305_D3 = await prepareDomainQuestions(az305Domain3, 'AZ305-D3');
  const seededAZ305_D4 = await prepareDomainQuestions(az305Domain4, 'AZ305-D4');

  // Seed standard single-section questions for other tracks
  async function seedSimpleQuestions(prefix: string, items: any[]) {
    const list: any[] = [];
    items.forEach((q, idx) => {
      const qNum = String(idx + 1).padStart(3, '0');
      list.push({
        code: `${prefix}-Q${qNum}`,
        title: q.title || `Question ${idx + 1}`,
        type: 'SINGLE_CHOICE',
        difficulty: 'INTERMEDIATE',
        points: 1.0,
        explanation: q.exp || 'Refer to official Azure documentation.',
        content: {
          prompt: q.prompt,
          options: shuffleArray([
            { id: 'opt1', text: q.correct, isCorrect: true },
            { id: 'opt2', text: q.bad1 },
            { id: 'opt3', text: q.bad2 },
            { id: 'opt4', text: q.bad3 },
          ]),
        },
      });
    });
    return seedQuestionList(list, catAzure.id);
  }

  const seededAZ900 = await seedSimpleQuestions('AZ900', [
    { title: 'Cloud Concepts - Elasticity', prompt: 'Which cloud feature automatically increases or decreases compute capacity based on workload demand?', correct: 'Auto-Scaling / Elasticity', bad1: 'Fault Tolerance', bad2: 'Geo-Redundancy', bad3: 'High Latency', exp: 'Elasticity allows compute resources to scale dynamically.' },
    { title: 'Azure Governance - Locks', prompt: 'What prevents accidental deletion of critical production resources in Azure?', correct: 'CanNotDelete Resource Lock', bad1: 'Network Security Group', bad2: 'Azure Advisor', bad3: 'Role Assignment', exp: 'CanNotDelete lock blocks resource deletion.' },
  ]);

  const seededAI900 = await seedSimpleQuestions('AI900', [
    { title: 'Responsible AI - Fairness', prompt: 'Ensuring an AI model treats all demographics impartially aligns with which Responsible AI principle?', correct: 'Fairness', bad1: 'Reliability', bad2: 'Privacy', bad3: 'Transparency', exp: 'Fairness ensures equitable AI outcomes.' },
  ]);

  const seededSC200 = await seedSimpleQuestions('SC200', [
    { title: 'Defender for Endpoint - Live Response', prompt: 'Which Defender feature enables remote terminal access to an endpoint during incident investigation?', correct: 'Live Response Remote Shell', bad1: 'Tamper Protection', bad2: 'Network Inspection', bad3: 'Playbook', exp: 'Live Response allows remote interactive shell troubleshooting.' },
  ]);

  // Load AZ-104 Questions from JSON
  let seededAZ104: any[] = [];
  const az104JsonPath = path.join(__dirname, 'az104_questions.json');
  if (fs.existsSync(az104JsonPath)) {
    const rawAZ104 = JSON.parse(fs.readFileSync(az104JsonPath, 'utf-8'));
    const az104List = rawAZ104.map((q: any, idx: number) => ({
      code: `AZ104-Q${String(idx + 1).padStart(3, '0')}`,
      title: `Question ${idx + 1}`,
      type: 'SINGLE_CHOICE',
      difficulty: 'INTERMEDIATE',
      points: 1.0,
      explanation: q.explanation || 'Refer to official Microsoft Azure Documentation.',
      content: {
        prompt: q.prompt,
        options: shuffleArray(q.options.map((o: any, oIdx: number) => ({
          id: `opt_${oIdx + 1}`,
          text: o.text,
          isCorrect: o.isCorrect,
        }))),
      },
    }));
    seededAZ104 = await seedQuestionList(az104List, catAzure.id);
  }

  const seededAI901 = await seedSimpleQuestions('AI901', [
    { title: 'Model Benchmarks', prompt: 'Where do you compare accuracy across foundation LLM endpoints in Azure AI Foundry?', correct: 'Model Catalog & Benchmarks', bad1: 'Azure Monitor Logs', bad2: 'Blob Storage', bad3: 'DNS Manager', exp: 'Model Catalog provides evaluation benchmarks.' },
  ]);

  // ==========================================
  // CREATE EXAM ENTITIES WITH MULTI-SECTION OBJECTIVE DOMAINS
  // ==========================================

  // 1. AZ-305 EXAM WITH 4 OBJECTIVE DOMAIN SECTIONS
  const az305Exam = await prisma.exam.create({
    data: {
      code: 'AZ-305',
      title: 'Designing Microsoft Azure Infrastructure Solutions (AZ-305)',
      vendor: 'MICROSOFT',
      examType: 'CERTIFICATION',
      description: 'Official 50/70/90-Item Practice Exam for Azure Solutions Architect Expert (AZ-305) with Normalized 0-100% Objective Domain Score Reports.',
      timeLimitMinutes: 150,
      passingScore: 70.0,
      totalQuestionsConfig: 50,
      creatorId: creatorUser.id,
      status: 'PUBLISHED',
    },
  });

  const az305SectionsData = [
    { title: 'Design Identity, Governance, and Monitoring Solutions', weight: 27.5, questions: seededAZ305_D1 },
    { title: 'Design Data Storage Solutions', weight: 27.5, questions: seededAZ305_D2 },
    { title: 'Design Business Continuity & High Availability Solutions', weight: 15.0, questions: seededAZ305_D3 },
    { title: 'Design Infrastructure & Compute Solutions', weight: 30.0, questions: seededAZ305_D4 },
  ];

  let totalAZ305Qs = 0;
  for (let sIdx = 0; sIdx < az305SectionsData.length; sIdx++) {
    const sData = az305SectionsData[sIdx];
    const sec = await prisma.examSection.create({
      data: {
        examId: az305Exam.id,
        title: sData.title,
        orderIndex: sIdx + 1,
        weightPercentage: sData.weight,
      },
    });

    let qOrder = 1;
    for (const q of sData.questions) {
      await prisma.sectionQuestion.create({
        data: { sectionId: sec.id, questionId: q.id, orderIndex: qOrder++ },
      });
      totalAZ305Qs++;
    }
  }
  console.log(`✅ Seeded AZ-305 with ${totalAZ305Qs} items across 4 Official Objective Domain Sections!`);

  // 2. AZ-104 EXAM WITH 5 OBJECTIVE DOMAIN SECTIONS
  const az104Exam = await prisma.exam.create({
    data: {
      code: 'AZ-104',
      title: 'Microsoft Azure Administrator (AZ-104)',
      vendor: 'MICROSOFT',
      examType: 'CERTIFICATION',
      description: 'Official 50/70/90-Item Practice Exam for Microsoft Azure Administrator (AZ-104) with PDF Question Bank.',
      timeLimitMinutes: 90,
      passingScore: 70.0,
      totalQuestionsConfig: 50,
      creatorId: creatorUser.id,
      status: 'PUBLISHED',
    },
  });

  // Distribute AZ-104 questions into 5 sections
  const az104SectionsData = [
    { title: 'Manage Azure Identities and Governance Policies (15-20%)', weight: 17.5 },
    { title: 'Implement and Manage Azure Storage Accounts & Disks (15-20%)', weight: 17.5 },
    { title: 'Deploy and Manage Azure Compute Resources (20-25%)', weight: 22.5 },
    { title: 'Configure and Manage Virtual Networking & Routing (25-30%)', weight: 27.5 },
    { title: 'Monitor and Maintain Azure Workloads & Logs (10-15%)', weight: 15.0 },
  ];

  const chunkSize = Math.ceil(seededAZ104.length / 5);
  for (let sIdx = 0; sIdx < az104SectionsData.length; sIdx++) {
    const sData = az104SectionsData[sIdx];
    const sec = await prisma.examSection.create({
      data: {
        examId: az104Exam.id,
        title: sData.title,
        orderIndex: sIdx + 1,
        weightPercentage: sData.weight,
      },
    });

    const chunk = seededAZ104.slice(sIdx * chunkSize, (sIdx + 1) * chunkSize);
    let qOrder = 1;
    for (const q of chunk) {
      await prisma.sectionQuestion.create({
        data: { sectionId: sec.id, questionId: q.id, orderIndex: qOrder++ },
      });
    }
  }
  console.log(`✅ Seeded AZ-104 with ${seededAZ104.length} items across 5 Objective Domain Sections!`);

  // Other Exam Tracks (AZ-900, AI-900, SC-200, AI-901)
  const otherExams = [
    { code: 'AZ-900', title: 'Microsoft Azure Fundamentals (AZ-900)', time: 60, seeded: seededAZ900 },
    { code: 'AI-900', title: 'Microsoft Azure AI Fundamentals (AI-900)', time: 60, seeded: seededAI900 },
    { code: 'SC-200', title: 'Microsoft Security Operations Analyst (SC-200)', time: 150, seeded: seededSC200 },
    { code: 'AI-901', title: 'Microsoft Azure AI & AI Foundry Solutions (AI-901)', time: 60, seeded: seededAI901 },
  ];

  for (const item of otherExams) {
    const exam = await prisma.exam.create({
      data: {
        code: item.code,
        title: item.title,
        vendor: 'MICROSOFT',
        examType: 'CERTIFICATION',
        description: `Complete ${item.seeded.length}-Question Practice Exam for ${item.title}.`,
        timeLimitMinutes: item.time,
        passingScore: 70.0,
        totalQuestionsConfig: 50,
        creatorId: creatorUser.id,
        status: 'PUBLISHED',
      },
    });

    const sec = await prisma.examSection.create({
      data: { examId: exam.id, title: `Section 1: Objective Domain Core Skills`, orderIndex: 1, weightPercentage: 100.0 },
    });

    let order = 1;
    for (const q of item.seeded) {
      await prisma.sectionQuestion.create({
        data: { sectionId: sec.id, questionId: q.id, orderIndex: order++ },
      });
    }
    console.log(`✅ Seeded ${item.code} with ${item.seeded.length} questions!`);
  }


  // ==========================================
  // AZURE BASICS - 50 QUESTIONS (PPTX DERIVED & AUDITED - 100% UNIQUE NON-OVERLAPPING)
  const azureBasicsD1 = [
  {
    "code": "AZ-BASICS-Q001",
    "title": "PPTX Slide 2: Physical vs Logical Architecture",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "According to Slide 2 of the Azure Basics presentation, Physical Architecture represents where Azure exists physically (datacenters, land, power), while Logical Architecture represents how Azure resources are organized and managed (districts, maps, addresses).",
    "content": {
      "prompt": "According to Azure architecture fundamentals, which architectural concept describes how Azure resources are organized, grouped, and managed rather than their physical land and hardware locations?",
      "explanation": "According to Slide 2 of the Azure Basics presentation, Physical Architecture represents where Azure exists physically (datacenters, land, power), while Logical Architecture represents how Azure resources are organized and managed (districts, maps, addresses).",
      "options": [
        {
          "id": "opt-1",
          "text": "Logical Architecture",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Physical Architecture",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Datacenter Hardware Floor",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Fiber Optic Cabling Layout",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q002",
    "title": "PPTX Slide 3: Azure Physical Datacenters & Access",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "As stated in Slide 3, users cannot choose or physically access a specific Azure datacenter directly. Instead, Azure groups datacenters into Regions and Availability Zones.",
    "content": {
      "prompt": "Can an Azure customer select and physically access a specific individual Azure datacenter building to host their application?",
      "explanation": "As stated in Slide 3, users cannot choose or physically access a specific individual Azure datacenter directly. Instead, Azure groups datacenters into Regions and Availability Zones.",
      "options": [
        {
          "id": "opt-1",
          "text": "No, customers cannot choose or access a specific datacenter directly; Azure groups them into Regions and Availability Zones.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Yes, customers can request keycard access to any physical Microsoft datacenter building.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Yes, but only if they deploy Linux Virtual Machines.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Only if they purchase a physical server rack from Microsoft.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q003",
    "title": "PPTX Slides 4-5: Azure Geographies & Data Residency",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slides 4 and 5 explain that an Azure Geography is a large boundary containing one or more Azure Regions, created to satisfy data residency and legal compliance requirements.",
    "content": {
      "prompt": "What is the primary compliance reason for creating Azure Geographies (such as the India Geography or Europe Geography)?",
      "explanation": "Slides 4 and 5 explain that an Azure Geography is a large boundary containing one or more Azure Regions, created to satisfy data residency and legal compliance requirements.",
      "options": [
        {
          "id": "opt-1",
          "text": "Data Residency (ensuring customer data stays within a specific country or geographic legal boundary).",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "To increase internet downloading speeds on home Wi-Fi.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "To eliminate the need for Azure Active Directory passwords.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "To grant free cloud credits to all commercial users.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q004",
    "title": "PPTX Slide 7-11: Azure Region Definition",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slides 7-11 define an Azure Region as a set of datacenters deployed within a latency-defined perimeter and connected through a dedicated regional low-latency network.",
    "content": {
      "prompt": "What is an Azure Region as defined in the Azure Basics architecture overview?",
      "explanation": "Slides 7-11 define an Azure Region as a set of datacenters deployed within a latency-defined perimeter and connected through a dedicated regional low-latency network.",
      "options": [
        {
          "id": "opt-1",
          "text": "A set of datacenters deployed within a latency-defined perimeter, connected through a dedicated low-latency network.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "A single server rack inside an office server room.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "A software folder used to store user passwords.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "A global billing domain for corporate accounts.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q005",
    "title": "PPTX Slides 12-15: Azure Availability Zones",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slides 12-15 explain that Availability Zones are physically separate datacenter locations within an Azure region, each equipped with independent power, cooling, and networking.",
    "content": {
      "prompt": "What physical isolation guarantees do Azure Availability Zones provide inside an Azure region?",
      "explanation": "Slides 12-15 explain that Availability Zones are physically separate datacenter locations within an Azure region, each equipped with independent power, cooling, and networking.",
      "options": [
        {
          "id": "opt-1",
          "text": "Physically separate datacenters with independent power, cooling, and networking infrastructure.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Shared power supplies and shared cooling fans inside a single room.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Logical user groups inside Microsoft Office 365.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Virtual networks connected over satellite dish connections.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q006",
    "title": "PPTX Slide 16: Fault Domains (FD) Definition",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slide 16 defines a Fault Domain (FD) as a physical rack of servers that shares a single common power source and network switch inside a datacenter.",
    "content": {
      "prompt": "In Azure Availability Sets, what is a Fault Domain (FD)?",
      "explanation": "Slide 16 defines a Fault Domain (FD) as a physical rack of servers that shares a single common power source and network switch inside a datacenter.",
      "options": [
        {
          "id": "opt-1",
          "text": "A physical server rack sharing a single common power supply and network switch.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "A group of Virtual Machines rebooted at the exact same time during planned OS updates.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "A billing subscription tier for small businesses.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "A regional fiber optic undersea cable.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q007",
    "title": "PPTX Slide 16: Update Domains (UD) Definition",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slide 16 defines Update Domains (UD) as logical groups of VMs that can be rebooted sequentially during planned Microsoft host platform maintenance.",
    "content": {
      "prompt": "What is the purpose of Update Domains (UD) in Azure Availability Sets?",
      "explanation": "Slide 16 defines Update Domains (UD) as logical groups of VMs that can be rebooted sequentially during planned Microsoft host platform maintenance.",
      "options": [
        {
          "id": "opt-1",
          "text": "To ensure VMs are rebooted sequentially (one UD at a time) during planned host updates so remaining VMs service traffic.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "To reboot all servers in the datacenter simultaneously.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "To store encrypted database password keys.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "To manage physical datacenter security guards.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q008",
    "title": "PPTX Slide 19-22: Azure Tenant Concept",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slides 19-22 explain that a Tenant represents a single organization's dedicated identity instance in Microsoft Entra ID (Azure AD), serving as the top identity boundary.",
    "content": {
      "prompt": "According to the Azure logical hierarchy (Tenant -> Management Group -> Subscription -> Resource Group), what is an Azure Tenant?",
      "explanation": "Slides 19-22 explain that a Tenant represents a single organization's dedicated identity instance in Microsoft Entra ID (Azure AD), serving as the top identity boundary.",
      "options": [
        {
          "id": "opt-1",
          "text": "A dedicated identity instance of Microsoft Entra ID (Azure AD) representing an organization.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "A physical building rented inside a datacenter park.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "A single virtual hard disk file (.vhd).",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "A network security firewall rule.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q009",
    "title": "PPTX Slide 26-28: Azure Subscription Boundaries",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slides 26-28 emphasize that an Azure Subscription provides two primary boundaries: Billing Boundary and Access/Management Boundary.",
    "content": {
      "prompt": "An Azure Subscription provides which TWO fundamental boundaries for Azure resources?",
      "explanation": "Slides 26-28 emphasize that an Azure Subscription provides two primary boundaries: Billing Boundary and Access/Management Boundary.",
      "options": [
        {
          "id": "opt-1",
          "text": "Billing boundary and Access/Management boundary",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Physical server rack boundary and power cable length",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Monitor resolution and browser window size",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Wi-Fi signal strength and Bluetooth range",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q010",
    "title": "PPTX Slide 30-33: Azure Resource Groups Analogy",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slides 30-33 compare a Resource Group to a 'folder' that holds related Azure resources so they can be managed, monitored, and deleted together as a single unit.",
    "content": {
      "prompt": "Slide 30 compares a Resource Group to which familiar real-world concept?",
      "explanation": "Slides 30-33 compare a Resource Group to a 'folder' that holds related Azure resources so they can be managed, monitored, and deleted together as a single unit.",
      "options": [
        {
          "id": "opt-1",
          "text": "A folder that organizes related items so they can be managed together.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "A physical highway toll booth.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "A satellite dish on a roof.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "A USB flash drive plugged into a desktop.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q011",
    "title": "PPTX Slide 31-33: Azure Management Groups Inheritance",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slides 31-33 explain that Management Groups sit above Subscriptions and allow governance conditions (like Azure Policies and RBAC) to inherit down to all child subscriptions.",
    "content": {
      "prompt": "When an Azure Policy is assigned at a Management Group, what happens to the child Subscriptions underneath it?",
      "explanation": "Slides 31-33 explain that Management Groups sit above Subscriptions and allow governance conditions (like Azure Policies and RBAC) to inherit down to all child subscriptions.",
      "options": [
        {
          "id": "opt-1",
          "text": "All child Subscriptions automatically inherit the Azure Policy rules.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Child Subscriptions ignore the policy completely.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "The Azure Policy is deleted automatically after 24 hours.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Child Subscriptions are moved to a different region.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q012",
    "title": "PPTX Slide 39-42: Infrastructure as Code & ARM Templates",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slides 39-42 introduce native ARM templates, which use JSON (JavaScript Object Notation) format to define infrastructure declaratively.",
    "content": {
      "prompt": "What file format is used to author native Azure Resource Manager (ARM) templates as highlighted in Slides 39-42?",
      "explanation": "Slides 39-42 introduce native ARM templates, which use JSON (JavaScript Object Notation) format to define infrastructure declaratively.",
      "options": [
        {
          "id": "opt-1",
          "text": "JSON (JavaScript Object Notation)",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "HTML",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "XML",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "MP4",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q013",
    "title": "PPTX Slides 43-48: What is an API in Azure?",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slides 43-48 explain that an API (Application Programming Interface) acts as a 'messenger'. In Azure, every tool (Portal, CLI, PowerShell, ARM, Bicep, Terraform) calls Azure Resource Manager REST APIs behind the scenes.",
    "content": {
      "prompt": "According to Slides 44-48, what role do Azure Resource Manager (ARM) REST APIs play when you perform actions in Azure?",
      "explanation": "Slides 43-48 explain that an API (Application Programming Interface) acts as a 'messenger'. In Azure, every tool (Portal, CLI, PowerShell, ARM, Bicep, Terraform) calls Azure Resource Manager REST APIs behind the scenes.",
      "options": [
        {
          "id": "opt-1",
          "text": "Every tool (Portal, CLI, PowerShell, ARM templates) sends REST API calls to ARM to execute operations behind the scenes.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "REST APIs are only used by mobile phone apps, not Azure tools.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "REST APIs physically connect server cables inside datacenters.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "REST APIs are only active when servers are turned off.",
          "isCorrect": false
        }
      ]
    }
  }
];
  const azureBasicsD2 = [
  {
    "code": "AZ-BASICS-Q014",
    "title": "PPTX Slide 57-62: Azure Portal Interface",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slide 62 defines the Azure Portal as Microsoft's web-based graphical management interface (GUI) for creating, managing, and monitoring Azure resources.",
    "content": {
      "prompt": "What is the Azure Portal as described in Slide 62 of the Azure Basics presentation?",
      "explanation": "Slide 62 defines the Azure Portal as Microsoft's web-based graphical management interface (GUI) for creating, managing, and monitoring Azure resources.",
      "options": [
        {
          "id": "opt-1",
          "text": "Microsoft's web-based graphical management interface (GUI) for managing Azure resources.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "A command-line terminal window only accessible from Linux PCs.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "A physical retail store selling server hardware.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "An automated email notification service.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q015",
    "title": "PPTX Slide 63-66: Azure PowerShell & Cmdlet Syntax",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slides 63-66 explain that Azure PowerShell uses a distinct Verb-Noun cmdlet naming convention (e.g. New-AzVM, Get-AzResourceGroup).",
    "content": {
      "prompt": "Which command structure is characteristic of Azure PowerShell cmdlets (such as New-AzVM)?",
      "explanation": "Slides 63-66 explain that Azure PowerShell uses a distinct Verb-Noun cmdlet naming convention (e.g. New-AzVM, Get-AzResourceGroup).",
      "options": [
        {
          "id": "opt-1",
          "text": "Verb-Noun syntax (e.g. New-AzVM)",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "az <group> <action> syntax",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "SQL SELECT query statements",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "HTML tag syntax (<vm>new</vm>)",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q016",
    "title": "PPTX Slide 67-71: Azure CLI Syntax & Platforms",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slides 67-71 highlight that Azure CLI is a cross-platform command-line tool (Windows, macOS, Linux) that follows an 'az <group> <action>' command structure (e.g. az vm create).",
    "content": {
      "prompt": "What command structure is used by the cross-platform Azure CLI tool?",
      "explanation": "Slides 67-71 highlight that Azure CLI is a cross-platform command-line tool (Windows, macOS, Linux) that follows an 'az <group> <action>' command structure (e.g. az vm create).",
      "options": [
        {
          "id": "opt-1",
          "text": "az <group> <action> (e.g. az vm create)",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Verb-Noun syntax (e.g. New-AzVM)",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Docker container run syntax",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Git push origin main syntax",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q017",
    "title": "PPTX Slide 75: B-Series VM & Burst CPU Concept",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slide 75 explains Burst CPU: B-Series VMs run at a baseline CPU level, accumulate CPU credits when idle, and burst up to 100% CPU when traffic spikes.",
    "content": {
      "prompt": "According to Slide 75, what is Burst CPU in Azure B-Series Virtual Machines?",
      "explanation": "Slide 75 explains Burst CPU: B-Series VMs run at a baseline CPU level, accumulate CPU credits when idle, and burst up to 100% CPU when traffic spikes.",
      "options": [
        {
          "id": "opt-1",
          "text": "The ability of a VM to run at a baseline CPU, accumulate CPU credits while idle, and burst up to 100% CPU during traffic spikes.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "A hardware failure where CPU chips physically break inside the server.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Deleting virtual machines automatically after 1 hour.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Overclocking server RAM water cooling pumps.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q018",
    "title": "PPTX Slide 76: D-Series VM (General Purpose)",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slide 76 describes D-Series VMs as General Purpose virtual machines with balanced vCPU and memory, suitable for testing and small-to-medium web application servers.",
    "content": {
      "prompt": "Which Azure VM family series represents General Purpose compute with balanced vCPU and RAM ratio?",
      "explanation": "Slide 76 describes D-Series VMs as General Purpose virtual machines with balanced vCPU and memory, suitable for testing and small-to-medium web application servers.",
      "options": [
        {
          "id": "opt-1",
          "text": "D-Series (General Purpose)",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "N-Series (GPU-Enabled)",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "L-Series (Storage Optimized)",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "H-Series (High Performance Compute)",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q019",
    "title": "PPTX Slide 77 & 80: E-Series & M-Series VMs (Memory Optimized)",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slides 77 and 80 specify that E-Series and M-Series VMs offer high memory-to-CPU ratios ideal for large in-memory databases like SAP HANA and enterprise relational databases.",
    "content": {
      "prompt": "Which Azure VM series (E-Series and M-Series) should be chosen for hosting large in-memory databases like SAP HANA requiring high RAM-to-CPU ratios?",
      "explanation": "Slides 77 and 80 specify that E-Series and M-Series VMs offer high memory-to-CPU ratios ideal for large in-memory databases like SAP HANA and enterprise relational databases.",
      "options": [
        {
          "id": "opt-1",
          "text": "E-Series and M-Series (Memory Optimized)",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Fsv2-Series (Compute Optimized)",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "B-Series (Burstable)",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "A-Series (Basic Entry Level)",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q020",
    "title": "PPTX Slide 78: Fsv2-Series VM (Compute Optimized)",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slide 78 highlights Fsv2-Series VMs as Compute-Optimized instances featuring high CPU clock speeds for fast execution of batch processing and web analytics.",
    "content": {
      "prompt": "Which Azure VM series is Compute-Optimized with high CPU clock speeds for CPU-intensive batch calculation engines?",
      "explanation": "Slide 78 highlights Fsv2-Series VMs as Compute-Optimized instances featuring high CPU clock speeds for fast execution of batch processing and web analytics.",
      "options": [
        {
          "id": "opt-1",
          "text": "Fsv2-Series (Compute Optimized)",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "L-Series (Storage Optimized)",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "E-Series (Memory Optimized)",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "B-Series (Burstable)",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q021",
    "title": "PPTX Slide 81: L-Series VM (Storage Optimized)",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slide 81 defines L-Series VMs as Storage-Optimized compute instances featuring direct-attached local NVMe storage for high I/O NoSQL databases like Cassandra and MongoDB.",
    "content": {
      "prompt": "Which VM family provides direct-attached local NVMe disk storage designed for high I/O throughput NoSQL databases (e.g. Cassandra, MongoDB)?",
      "explanation": "Slide 81 defines L-Series VMs as Storage-Optimized compute instances featuring direct-attached local NVMe storage for high I/O NoSQL databases like Cassandra and MongoDB.",
      "options": [
        {
          "id": "opt-1",
          "text": "L-Series (Storage Optimized)",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "D-Series (General Purpose)",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "N-Series (GPU-Enabled)",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "M-Series (Large RAM)",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q022",
    "title": "PPTX Slides 84-86: H-Series VM (High Performance Computing - HPC)",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slides 84-86 explain High-Performance Computing (HPC) workloads (weather modeling, molecular simulations) requiring InfiniBand networking, served by H-Series VMs.",
    "content": {
      "prompt": "Which Azure VM series is built for High-Performance Computing (HPC) workloads requiring InfiniBand ultra-low latency interconnects?",
      "explanation": "Slides 84-86 explain High-Performance Computing (HPC) workloads (weather modeling, molecular simulations) requiring InfiniBand networking, served by H-Series VMs.",
      "options": [
        {
          "id": "opt-1",
          "text": "H-Series (High Performance Compute)",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "B-Series (Burstable)",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "A-Series (Entry Level)",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "D-Series (General Purpose)",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q023",
    "title": "PPTX Slide 90: Trusted Launch & Integrity Monitoring",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slide 90 compares Integrity Monitoring in VM Trusted Launch to a 'security guard who checks every time the VM starts' to ensure firmware and bootloader haven't been tampered with.",
    "content": {
      "prompt": "Slide 90 uses what analogy to explain Integrity Monitoring in Azure VM Trusted Launch?",
      "explanation": "Slide 90 compares Integrity Monitoring in VM Trusted Launch to a 'security guard who checks every time the VM starts' to ensure firmware and bootloader haven't been tampered with.",
      "options": [
        {
          "id": "opt-1",
          "text": "A security guard who checks boot integrity every time the VM starts.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "A cashier at a grocery store scanner.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "A delivery driver dropping off packages.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "A painter painting server chassis walls.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q024",
    "title": "PPTX Slide 91-92: Azure Spot Virtual Machines",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slides 91-92 explain that Azure Spot VMs allow you to take advantage of unused Azure compute capacity at steep discounts (up to 90%), but Microsoft can evict them when capacity is needed.",
    "content": {
      "prompt": "What is the key trade-off when using Azure Spot Virtual Machines?",
      "explanation": "Slides 91-92 explain that Azure Spot VMs allow you to take advantage of unused Azure compute capacity at steep discounts (up to 90%), but Microsoft can evict them when capacity is needed.",
      "options": [
        {
          "id": "opt-1",
          "text": "Significant cost savings (up to 90%), but VMs can be evicted/stopped by Azure at any time with short notice when capacity is needed.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Spot VMs are 100% free forever without any eviction risk.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Spot VMs only run on weekends.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Spot VMs do not support installing operating systems.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q025",
    "title": "PPTX Slide 88-89: VM Child Component Provisioning",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slides 88-89 illustrate that deploying an Azure VM provisions child resources including a Network Interface (NIC), Managed OS Disk, and IP configuration attached to a VNet subnet.",
    "content": {
      "prompt": "When creating an Azure Virtual Machine, which two mandatory underlying resources are automatically provisioned and attached to it?",
      "explanation": "Slides 88-89 illustrate that deploying an Azure VM provisions child resources including a Network Interface (NIC), Managed OS Disk, and IP configuration attached to a VNet subnet.",
      "options": [
        {
          "id": "opt-1",
          "text": "Network Interface (NIC) and Managed OS Disk",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Physical Fiber Cable and Land Deed",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Azure Key Vault and ExpressRoute Circuit",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "DNS Registrar and Domain Name",
          "isCorrect": false
        }
      ]
    }
  }
];
  const azureBasicsD3 = [
  {
    "code": "AZ-BASICS-Q026",
    "title": "PPTX Slide 2: City Analogy for Azure Architecture",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slide 2 compares Physical Architecture to the land/buildings/power and Logical Architecture to the city map showing districts and addresses.",
    "content": {
      "prompt": "In the Slide 2 city analogy, what corresponds to Azure Logical Architecture?",
      "explanation": "Slide 2 compares Physical Architecture to the land/buildings/power and Logical Architecture to the city map showing districts and addresses.",
      "options": [
        {
          "id": "opt-1",
          "text": "The city map showing districts, streets, and addresses.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "The physical land and soil beneath buildings.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "The electrical power grid wires.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "The concrete foundations of server rooms.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q027",
    "title": "PPTX Slide 4: Regions inside Geographies",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slide 4 emphasizes that Geography is the bigger boundary and Azure Regions (e.g. Central India, South India) are the smaller locations inside that Geography.",
    "content": {
      "prompt": "What is the relationship between an Azure Geography and an Azure Region?",
      "explanation": "Slide 4 emphasizes that Geography is the bigger boundary and Azure Regions (e.g. Central India, South India) are the smaller locations inside that Geography.",
      "options": [
        {
          "id": "opt-1",
          "text": "Geography is the larger boundary; multiple Azure Regions exist inside a Geography.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Region is larger; multiple Geographies exist inside a Region.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "They are identical words with no difference.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Regions are for databases only, while Geographies are for VMs only.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q028",
    "title": "PPTX Slide 10-11: Low-Latency Regional Fiber Network",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slides 10-11 highlight that all datacenters within an Azure Region are connected by a dedicated, high-speed, low-latency fiber optic network.",
    "content": {
      "prompt": "How are individual datacenters within an Azure Region interconnected to ensure rapid data communication?",
      "explanation": "Slides 10-11 highlight that all datacenters within an Azure Region are connected by a dedicated, high-speed, low-latency fiber optic network.",
      "options": [
        {
          "id": "opt-1",
          "text": "Through a dedicated, low-latency regional fiber optic network.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Over dial-up copper phone lines.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Using public Wi-Fi hotspots.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Via satellite signals bounced off the moon.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q029",
    "title": "PPTX Slide 17: Multi-Zone Availability Example",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slide 17 illustrates that deploying application VMs across multiple Availability Zones protects the application against entire datacenter facility failures.",
    "content": {
      "prompt": "What benefit is gained by deploying web application VM instances across two distinct Availability Zones within the same region?",
      "explanation": "Slide 17 illustrates that deploying application VMs across multiple Availability Zones protects the application against entire datacenter facility failures.",
      "options": [
        {
          "id": "opt-1",
          "text": "High Availability (if one datacenter building loses power or connectivity, the other zone continues running).",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Decreased network throughput speed.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Automatic cancellation of all monthly bills.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Forced server reboots every 10 minutes.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q030",
    "title": "PPTX Slide 22: Summary of Entra ID Tenant",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slide 22 summarizes that a Tenant houses user accounts, security groups, and enterprise applications for authentication.",
    "content": {
      "prompt": "Which Azure asset type is stored and managed at the Tenant level (Microsoft Entra ID)?",
      "explanation": "Slide 22 summarizes that a Tenant houses user accounts, security groups, and enterprise applications for authentication.",
      "options": [
        {
          "id": "opt-1",
          "text": "User accounts, security groups, and authentication credentials.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Raw virtual hard disk (.vhd) files.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Physical server rack power switches.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Undersea fiber optic cables.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q031",
    "title": "PPTX Slide 30: Folder Analogy for Resource Groups",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slide 30 states: 'Think of it like a folder. You put related files into a folder so you can manage them together.'",
    "content": {
      "prompt": "Why are Azure resources grouped into a Resource Group?",
      "explanation": "Slide 30 states: 'Think of it like a folder. You put related files into a folder so you can manage them together.'",
      "options": [
        {
          "id": "opt-1",
          "text": "To organize related resources so their lifecycle, monitoring, and permissions can be managed together.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Because Azure forces all VMs to share a single CPU chip.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "To encrypt user web browser search histories.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "To prevent users from opening the Azure Portal.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q032",
    "title": "PPTX Slide 38: Logical Hierarchy Scope Order",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slide 38 presents the full logical hierarchy from top to bottom: Tenant -> Management Group -> Subscription -> Resource Group -> Resource.",
    "content": {
      "prompt": "What is the correct top-to-bottom sequence of Azure logical management scopes?",
      "explanation": "Slide 38 presents the full logical hierarchy from top to bottom: Tenant -> Management Group -> Subscription -> Resource Group -> Resource.",
      "options": [
        {
          "id": "opt-1",
          "text": "Tenant -> Management Group -> Subscription -> Resource Group -> Resource",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Resource -> Resource Group -> Subscription -> Management Group -> Tenant",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Subscription -> Resource Group -> Tenant -> Management Group -> Resource",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Resource Group -> Tenant -> Management Group -> Resource -> Subscription",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q033",
    "title": "PPTX Slide 55: Maximum Depth of Management Groups",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slide 55 notes that Azure Management Groups can support up to 6 levels of depth in a single organizational tree.",
    "content": {
      "prompt": "Up to how many levels of depth can Azure Management Group hierarchies be structured?",
      "explanation": "Slide 55 notes that Azure Management Groups can support up to 6 levels of depth in a single organizational tree.",
      "options": [
        {
          "id": "opt-1",
          "text": "Up to 6 levels of depth",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Up to 1000 levels of depth",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Only 1 single level",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Unlimited levels without restriction",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q034",
    "title": "PPTX Slide 57: Global Search Box in Azure Portal",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slide 57 compares the Global Search box in the Azure Portal to 'Google's search box for Azure resources', allowing quick navigation to services and documentation.",
    "content": {
      "prompt": "What is the function of the top Search Bar in the Azure Portal GUI (Slide 57)?",
      "explanation": "Slide 57 compares the Global Search box in the Azure Portal to 'Google's search box for Azure resources', allowing quick navigation to services and documentation.",
      "options": [
        {
          "id": "opt-1",
          "text": "To quickly search for and navigate to any Azure service, resource, group, or documentation article.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "To stream live television sports games.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "To send text messages to personal cell phones.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "To order physical computer keyboards.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q035",
    "title": "PPTX Slide 61: Cloud Shell Icon in Azure Portal Header",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slide 61 highlights the Cloud Shell icon in the top-right header of the Azure Portal, which opens an embedded browser terminal.",
    "content": {
      "prompt": "Which icon in the Azure Portal top navigation bar launches an embedded Cloud Shell terminal window directly in your web browser?",
      "explanation": "Slide 61 highlights the Cloud Shell icon in the top-right header of the Azure Portal, which opens an embedded browser terminal.",
      "options": [
        {
          "id": "opt-1",
          "text": "The Cloud Shell (>_) icon in the top navigation bar",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "The Notification Bell icon",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "The Help & Support question mark (?) icon",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "The Settings gear icon",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q036",
    "title": "PPTX Slide 68: Azure CLI Operating System Support",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slide 68 states that Azure CLI is designed to run natively on Windows, macOS, and Linux.",
    "content": {
      "prompt": "On which operating systems can Azure CLI be installed and executed?",
      "explanation": "Slide 68 states that Azure CLI is designed to run natively on Windows, macOS, and Linux.",
      "options": [
        {
          "id": "opt-1",
          "text": "Windows, macOS, and Linux (Cross-Platform)",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Windows Server 2022 only",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Android mobile phones only",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "MS-DOS 6.22 only",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q037",
    "title": "PPTX Slide 70: Azure CLI vs Azure PowerShell Comparison",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slide 70 summarizes: Azure CLI uses az commands and is popular with Linux/DevOps engineers, whereas Azure PowerShell uses Verb-Noun cmdlets and is popular with Windows sysadmins.",
    "content": {
      "prompt": "According to Slide 70, which management tool is particularly favored by Linux and DevOps engineers familiar with bash environments?",
      "explanation": "Slide 70 summarizes: Azure CLI uses az commands and is popular with Linux/DevOps engineers, whereas Azure PowerShell uses Verb-Noun cmdlets and is popular with Windows sysadmins.",
      "options": [
        {
          "id": "opt-1",
          "text": "Azure CLI",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Azure PowerShell",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Internet Explorer 11",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Windows Notepad",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q038",
    "title": "PPTX Slide 83: One-Line Summary of VM Series",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slide 83 provides a one-line summary: Match your workload needs (RAM, CPU, Storage, GPU) to the appropriate Azure VM family series to optimize cost and performance.",
    "content": {
      "prompt": "What is the key takeaway when choosing an Azure Virtual Machine SKU family for your application?",
      "explanation": "Slide 83 provides a one-line summary: Match your workload needs (RAM, CPU, Storage, GPU) to the appropriate Azure VM family series to optimize cost and performance.",
      "options": [
        {
          "id": "opt-1",
          "text": "Select the VM series family that matches your specific resource bottleneck (RAM, CPU, NVMe, or GPU) to optimize performance and cost.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Always select the most expensive VM series regardless of workload.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "All Azure VM series have identical hardware specifications.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "VM series choice is chosen automatically by Microsoft and cannot be changed.",
          "isCorrect": false
        }
      ]
    }
  }
];
  const azureBasicsD4 = [
  {
    "code": "AZ-BASICS-Q039",
    "title": "PPTX Slide 84: High Performance Computing (HPC) Workloads",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slide 84 defines High Performance Computing (HPC) as using clusters of powerful servers working together to solve complex computational problems like weather forecasting.",
    "content": {
      "prompt": "Which real-world application is an example of High Performance Computing (HPC) as highlighted in Slide 84-85?",
      "explanation": "Slide 84 defines High Performance Computing (HPC) as using clusters of powerful servers working together to solve complex computational problems like weather forecasting.",
      "options": [
        {
          "id": "opt-1",
          "text": "Weather modeling, financial risk analysis, and crash simulation calculations.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Sending basic email messages to colleagues.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Editing text files in Windows Notepad.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Browsing simple static websites.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q040",
    "title": "PPTX Slide 91: Spot VM Savings Percentage",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slide 91 states that Azure Spot VMs provide up to a 90% discount compared to standard pay-as-you-go pricing.",
    "content": {
      "prompt": "Up to what cost discount can organizations receive by utilizing Azure Spot Virtual Machines over standard Pay-As-You-Go rates?",
      "explanation": "Slide 91 states that Azure Spot VMs provide up to a 90% discount compared to standard pay-as-you-go pricing.",
      "options": [
        {
          "id": "opt-1",
          "text": "Up to 90% discount",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Up to 5% discount",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Exactly 100% discount free forever",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "No discount at all",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q041",
    "title": "PPTX Slide 92: Spot VM Best Use Cases",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slide 92 identifies best use cases for Spot VMs: Interruptible workloads, batch processing jobs, and dev/test environments that can tolerate sudden shutdowns.",
    "content": {
      "prompt": "Which workload scenario is ideal for deploying on Azure Spot Virtual Machines?",
      "explanation": "Slide 92 identifies best use cases for Spot VMs: Interruptible workloads, batch processing jobs, and dev/test environments that can tolerate sudden shutdowns.",
      "options": [
        {
          "id": "opt-1",
          "text": "Interruptible batch processing jobs and stateless dev/test workloads that can handle sudden server evictions.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Production banking databases requiring 99.99% continuous availability.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Emergency healthcare medical call routing systems.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Primary Active Directory domain controllers.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q042",
    "title": "PPTX Slide 90: Trusted Launch Boot Security",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slide 90 explains that Azure Trusted Launch protects against rootkits and bootkits by verifying OS boot loader signatures and firmware integrity.",
    "content": {
      "prompt": "What security threat does Azure VM Trusted Launch protect against during server startup?",
      "explanation": "Slide 90 explains that Azure Trusted Launch protects against rootkits and bootkits by verifying OS boot loader signatures and firmware integrity.",
      "options": [
        {
          "id": "opt-1",
          "text": "Bootkits, rootkits, and unauthorized firmware modifications during system boot.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Phishing emails received in personal webmail.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Overcharging on credit card invoices.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Physical theft of monitor screens.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q043",
    "title": "PPTX Slide 49-53: Sequence of VM Creation behind the scenes",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slides 49-53 outline the sequence: User initiates request -> REST API sent to ARM -> ARM validates request & credentials -> ARM orchestrates Compute, Network, and Storage providers -> Resources allocated inside datacenter.",
    "content": {
      "prompt": "What is the first step that occurs behind the scenes when a user clicks 'Create' for a Virtual Machine in the Azure Portal?",
      "explanation": "Slides 49-53 outline the sequence: User initiates request -> REST API sent to ARM -> ARM validates request & credentials -> ARM orchestrates Compute, Network, and Storage providers -> Resources allocated inside datacenter.",
      "options": [
        {
          "id": "opt-1",
          "text": "An HTTPS REST API request is sent to Azure Resource Manager (ARM).",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "A physical datacenter technician manually plugs in a new computer power cable.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Microsoft sends a paper invoice by mail.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "The local web browser downloads the Linux operating system source code.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q044",
    "title": "PPTX Slide 64: Azure PowerShell Platform Requirements",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slide 64 clarifies that Azure PowerShell runs inside PowerShell Core on Windows, macOS, and Linux platforms.",
    "content": {
      "prompt": "Is Azure PowerShell restricted exclusively to Windows operating systems?",
      "explanation": "Slide 64 clarifies that Azure PowerShell runs inside PowerShell Core on Windows, macOS, and Linux platforms.",
      "options": [
        {
          "id": "opt-1",
          "text": "No, Azure PowerShell runs cross-platform on Windows, macOS, and Linux via PowerShell Core.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Yes, Azure PowerShell can only be installed on Windows 10/11.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Yes, Azure PowerShell requires MS-DOS.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Azure PowerShell only runs inside Apple iPhones.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q045",
    "title": "PPTX Slide 21: Tenant vs Subscription Relationship",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slide 21 illustrates that a single Microsoft Entra ID Tenant can manage and contain multiple Azure Subscriptions.",
    "content": {
      "prompt": "How many Azure Subscriptions can be associated with a single Microsoft Entra ID Tenant?",
      "explanation": "Slide 21 illustrates that a single Microsoft Entra ID Tenant can manage and contain multiple Azure Subscriptions.",
      "options": [
        {
          "id": "opt-1",
          "text": "Multiple Subscriptions can belong to a single Tenant.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Strictly only 1 Subscription per Tenant.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Zero Subscriptions; Tenants cannot hold Subscriptions.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Maximum 2 Subscriptions across the entire world.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q046",
    "title": "PPTX Slide 34-37: Resource Group Lifecycle Scope",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slides 34-37 emphasize that resources sharing the same lifecycle (deployed, updated, and deleted together) should be placed in the same Resource Group.",
    "content": {
      "prompt": "What recommendation is given in Slides 34-37 for deciding which resources belong in the same Resource Group?",
      "explanation": "Slides 34-37 emphasize that resources sharing the same lifecycle (deployed, updated, and deleted together) should be placed in the same Resource Group.",
      "options": [
        {
          "id": "opt-1",
          "text": "Place resources that share the same development lifecycle together in the same Resource Group.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Put all virtual machines in the world into one single Resource Group.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Create a new Resource Group every 5 minutes.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Never use Resource Groups for production resources.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q047",
    "title": "PPTX Slide 54: Cloud Adoption Journey Steps",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slide 54 outlines the Cloud Adoption Journey steps, including organizing subscriptions into Management Groups for governance scaling.",
    "content": {
      "prompt": "According to the Azure Cloud Adoption Journey (Slide 54-55), why do growing enterprises organize Subscriptions into Management Groups?",
      "explanation": "Slide 54 outlines the Cloud Adoption Journey steps, including organizing subscriptions into Management Groups for governance scaling.",
      "options": [
        {
          "id": "opt-1",
          "text": "To scale governance, policy enforcement, and access controls across multiple subscriptions efficiently.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "To bypass Microsoft Azure billing invoices.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "To automatically convert virtual machines into container apps.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "To change the color theme of the Azure Portal.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q048",
    "title": "PPTX Slide 87: Simple Explanation of VM Series Choice",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slide 87 provides a simple summary: Compute Optimized (F) = Fast CPU, Memory Optimized (E/M) = Huge RAM, Storage Optimized (L) = High NVMe Disk IOPS, GPU (N) = AI & Graphics, HPC (H) = InfiniBand Supercomputing.",
    "content": {
      "prompt": "Match the simple summary terms in Slide 87: Which VM series is designed for GPU-accelerated graphics rendering and AI machine learning?",
      "explanation": "Slide 87 provides a simple summary: Compute Optimized (F) = Fast CPU, Memory Optimized (E/M) = Huge RAM, Storage Optimized (L) = High NVMe Disk IOPS, GPU (N) = AI & Graphics, HPC (H) = InfiniBand Supercomputing.",
      "options": [
        {
          "id": "opt-1",
          "text": "N-Series (GPU Enabled)",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "B-Series (Burstable)",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "D-Series (General Purpose)",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Fsv2-Series (Compute)",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q049",
    "title": "PPTX Slide 94: Feature Comparison Table for VM Types",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slide 94 presents a feature comparison table emphasizing that Spot VMs provide maximum cost reduction for fault-tolerant batch workloads.",
    "content": {
      "prompt": "Based on the Slide 94 VM feature comparison matrix, which VM deployment type yields the lowest cost per hour for non-critical batch processing?",
      "explanation": "Slide 94 presents a feature comparison table emphasizing that Spot VMs provide maximum cost reduction for fault-tolerant batch workloads.",
      "options": [
        {
          "id": "opt-1",
          "text": "Azure Spot VMs",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Standard Pay-As-You-Go M-Series VMs",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Dedicated Host Instances",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Ultra Disk Storage Accounts",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q050",
    "title": "PPTX Slide 95: Final Takeaway Summary",
    "type": "SINGLE_CHOICE",
    "difficulty": "BEGINNER",
    "points": 1.0,
    "explanation": "Slide 95 concludes: Azure provides a comprehensive ecosystem where physical datacenters are structured into Regions and Availability Zones, governed by a logical hierarchy (Tenant -> Management Group -> Subscription -> Resource Group -> Resource), and orchestrated via ARM REST APIs.",
    "content": {
      "prompt": "What is the overarching conclusion of the Azure Basics presentation regarding Azure architecture and management?",
      "explanation": "Slide 95 concludes: Azure provides a comprehensive ecosystem where physical datacenters are structured into Regions and Availability Zones, governed by a logical hierarchy (Tenant -> Management Group -> Subscription -> Resource Group -> Resource), and orchestrated via ARM REST APIs.",
      "options": [
        {
          "id": "opt-1",
          "text": "Azure combines physical datacenter infrastructure (Regions, Zones) with a structured logical hierarchy and ARM REST API automation to deliver reliable cloud services.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Azure consists of a single server room located in Redmond, Washington.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Cloud computing eliminates all need for network security.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Virtual Machines cannot be created or deleted after they are deployed.",
          "isCorrect": false
        }
      ]
    }
  }
];

  const azureBasicsExam = await prisma.exam.create({
    data: {
      code: 'AZURE-BASICS',
      title: 'Azure Basics Certification Practice Exam',
      vendor: 'MICROSOFT',
      examType: 'CERTIFICATION',
      description: 'Comprehensive Azure Basics Certification Exam with 50 PPTX Domain questions and 40 Case Study questions derived from Azure basics for T.pptx.',
      timeLimitMinutes: 120,
      passingScore: 70.0,
      totalQuestionsConfig: 90,
      creatorId: creatorUser.id,
      status: 'PUBLISHED',
      isGloballyUnlocked: true,
    },
  });

  const secD1 = await prisma.examSection.create({
    data: { examId: azureBasicsExam.id, title: '1. Module 1: Physical vs Logical Architecture & Geographies (13 Items)', orderIndex: 1, weightPercentage: 15.0 },
  });
  let orderD1 = 1;
  for (const q of azureBasicsD1) {
    const dbQ = await prisma.question.create({
      data: {
        code: q.code, title: q.title, type: q.type as any, difficulty: 'INTERMEDIATE', points: 1.0,
        explanation: q.explanation, content: JSON.stringify(q.content), categoryId: catAzure.id,
      },
    });
    await prisma.sectionQuestion.create({
      data: { sectionId: secD1.id, questionId: dbQ.id, orderIndex: orderD1++ },
    });
  }

  const secD2 = await prisma.examSection.create({
    data: { examId: azureBasicsExam.id, title: '2. Module 2: Azure Portal, CLI, PowerShell & VM Families (12 Items)', orderIndex: 2, weightPercentage: 15.0 },
  });
  let orderD2 = 1;
  for (const q of azureBasicsD2) {
    const dbQ = await prisma.question.create({
      data: {
        code: q.code, title: q.title, type: q.type as any, difficulty: 'INTERMEDIATE', points: 1.0,
        explanation: q.explanation, content: JSON.stringify(q.content), categoryId: catAzure.id,
      },
    });
    await prisma.sectionQuestion.create({
      data: { sectionId: secD2.id, questionId: dbQ.id, orderIndex: orderD2++ },
    });
  }

  const secD3 = await prisma.examSection.create({
    data: { examId: azureBasicsExam.id, title: '3. Module 3: Management Groups, Subscriptions & Governance (13 Items)', orderIndex: 3, weightPercentage: 15.0 },
  });
  let orderD3 = 1;
  for (const q of azureBasicsD3) {
    const dbQ = await prisma.question.create({
      data: {
        code: q.code, title: q.title, type: q.type as any, difficulty: 'INTERMEDIATE', points: 1.0,
        explanation: q.explanation, content: JSON.stringify(q.content), categoryId: catAzure.id,
      },
    });
    await prisma.sectionQuestion.create({
      data: { sectionId: secD3.id, questionId: dbQ.id, orderIndex: orderD3++ },
    });
  }

  const secD4 = await prisma.examSection.create({
    data: { examId: azureBasicsExam.id, title: '4. Module 4: HPC, Spot VMs, Trusted Launch & REST APIs (12 Items)', orderIndex: 4, weightPercentage: 12.0 },
  });
  let orderD4 = 1;
  for (const q of azureBasicsD4) {
    const dbQ = await prisma.question.create({
      data: {
        code: q.code, title: q.title, type: q.type as any, difficulty: 'INTERMEDIATE', points: 1.0,
        explanation: q.explanation, content: JSON.stringify(q.content), categoryId: catAzure.id,
      },
    });
    await prisma.sectionQuestion.create({
      data: { sectionId: secD4.id, questionId: dbQ.id, orderIndex: orderD4++ },
    });
  }

  // CASE STUDY 1 & CASE STUDY 2 FOR AZURE BASICS
  // ==========================================
  const cs1Data = {"code": "CS-AZURE-01", "title": "Contoso Financial Services Multi-Region Migration", "overview": "Contoso Financial Services is a global banking organization migrating its core financial processing applications and databases from on-premises datacenters to Microsoft Azure. Contoso operates primarily in Europe and North America and must strictly comply with EU General Data Protection Regulation (GDPR) data sovereignty mandates.", "businessRequirements": "1. High Availability: Core transactional API gateways must maintain a 99.99% uptime SLA.\n2. Compliance & Sovereignty: All European customer PII data must remain strictly stored in EU Azure Regions.\n3. Cost Optimization: Non-production environments (dev/test) must utilize cost-reduced VM pricing models, while production infrastructure uses 3-year Reserved Instance commitments.\n4. Disaster Recovery: Business continuity plans require cross-region disaster recovery for all primary databases.", "technicalRequirements": "1. In-Memory SAP Databases: The core transactional database requires up to 2 TB of RAM.\n2. High-Speed Compute: Batch calculation engines require high CPU clock speeds for fast execution.\n3. Infrastructure as Code (IaC): All infrastructure deployments must be automated using Bicep templates integrated into CI/CD pipelines.\n4. Security & Governance: Governance policies must be uniformly inherited across all child subscriptions.", "existingEnvironment": "Current environment consists of on-premises VMware vSphere ESXi clusters, legacy Microsoft SQL Server clusters, and custom Bash deployment scripts."};
  const cs1Qs = [{"code": "AZ-CS1-Q001", "title": "CS1: Select VM Family for SAP HANA", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "E-Series and M-Series VMs provide high memory-to-CPU ratios ideal for large in-memory databases like SAP HANA.", "content": {"prompt": "Based on Contoso Technical Requirements, which Virtual Machine series should be selected to host the core in-memory SAP database requiring up to 2 TB of RAM?", "explanation": "E-Series and M-Series VMs provide high memory-to-CPU ratios ideal for large in-memory databases like SAP HANA.", "options": [{"id": "opt-3", "text": "B-Series (Burstable CPU)", "isCorrect": false}, {"id": "opt-2", "text": "F-Series (Compute-Optimized)", "isCorrect": false}, {"id": "opt-4", "text": "N-Series (GPU-Enabled)", "isCorrect": false}, {"id": "opt-1", "text": "E-Series or M-Series (Memory-Optimized)", "isCorrect": true}]}}, {"code": "AZ-CS1-Q002", "title": "CS1: SLA Model for 99.99%", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Multi-zone deployments across Availability Zones provide Azure 99.99% VM uptime SLA.", "content": {"prompt": "To satisfy Contoso Business Requirement for a 99.99% uptime SLA for core transactional API gateways, how should the Virtual Machines be deployed?", "explanation": "Multi-zone deployments across Availability Zones provide Azure 99.99% VM uptime SLA.", "options": [{"id": "opt-4", "text": "Inside an unmanaged storage account container.", "isCorrect": false}, {"id": "opt-3", "text": "As a single standalone VM using Standard SSD storage.", "isCorrect": false}, {"id": "opt-1", "text": "Across two or more Availability Zones in the same Azure region.", "isCorrect": true}, {"id": "opt-2", "text": "Inside a single Availability Set using Standard HDD disks.", "isCorrect": false}]}}, {"code": "AZ-CS1-Q003", "title": "CS1: Scope for Policy Inheritance", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Management Groups provide a scope of governance above subscriptions, allowing Azure Policy assignments to inherit down the hierarchy.", "content": {"prompt": "At which architectural level should Contoso apply Azure Policies to guarantee uniform inheritance across all European child subscriptions?", "explanation": "Management Groups provide a scope of governance above subscriptions, allowing Azure Policy assignments to inherit down the hierarchy.", "options": [{"id": "opt-2", "text": "Resource Group Level", "isCorrect": false}, {"id": "opt-4", "text": "Local Client Laptop Level", "isCorrect": false}, {"id": "opt-3", "text": "Subnet Level", "isCorrect": false}, {"id": "opt-1", "text": "Management Group Level", "isCorrect": true}]}}, {"code": "AZ-CS1-Q004", "title": "CS1: Declarative IaC Deployment Tool", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Bicep is Microsoft declarative domain-specific language (DSL) for authoring Azure infrastructure that compiles to ARM JSON.", "content": {"prompt": "Which Microsoft Infrastructure as Code (IaC) language meets Contoso requirement for automated, declarative environment deployments that compile into ARM templates?", "explanation": "Bicep is Microsoft declarative domain-specific language (DSL) for authoring Azure infrastructure that compiles to ARM JSON.", "options": [{"id": "opt-2", "text": "Python Scripting", "isCorrect": false}, {"id": "opt-3", "text": "Bash Shell", "isCorrect": false}, {"id": "opt-1", "text": "Bicep", "isCorrect": true}, {"id": "opt-4", "text": "HTML5 Web Forms", "isCorrect": false}]}}, {"code": "AZ-CS1-Q005", "title": "CS1: Regional Pairs Distance Requirement", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Azure Regional Pairs are separated by at least 300 miles where possible to protect against regional outages.", "content": {"prompt": "How far apart are paired Azure regions typically located to support Contoso cross-region disaster recovery requirements?", "explanation": "Azure Regional Pairs are separated by at least 300 miles where possible to protect against regional outages.", "options": [{"id": "opt-2", "text": "10 meters apart.", "isCorrect": false}, {"id": "opt-3", "text": "Always in different hemispheres.", "isCorrect": false}, {"id": "opt-4", "text": "Exactly 1 mile apart.", "isCorrect": false}, {"id": "opt-1", "text": "At least 300 miles apart.", "isCorrect": true}]}}, {"code": "AZ-CS1-Q006", "title": "CS1: Cost Optimization Strategies", "type": "MULTIPLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Reserved Instances offer up to 72% savings for production workloads, while Spot/B-Series optimize dev/test costs.", "content": {"prompt": "Which TWO cost optimization strategies align with Contoso requirements for non-production and production VM workloads? (Select TWO)", "explanation": "Reserved Instances offer up to 72% savings for production workloads, while Spot/B-Series optimize dev/test costs.", "options": [{"id": "opt-2", "text": "Using Azure Spot VMs or Burstable B-Series for dev/test environments.", "isCorrect": true}, {"id": "opt-4", "text": "Deleting the billing account from the Azure portal.", "isCorrect": false}, {"id": "opt-3", "text": "Running all VMs at 100% CPU utilization 24/7 without stopping.", "isCorrect": false}, {"id": "opt-1", "text": "Using Azure Reserved VM Instances (RI) for 1-year or 3-year production commitments.", "isCorrect": true}]}}, {"code": "AZ-CS1-Q007", "title": "CS1: VM Provisioning Child Components", "type": "MULTIPLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Deploying an Azure VM provisions underlying resources: Virtual Machine instance, NIC, and Managed OS Disk.", "content": {"prompt": "When Contoso provisions a new Virtual Machine compute instance, which TWO child resources are automatically created? (Select TWO)", "explanation": "Deploying an Azure VM provisions underlying resources: Virtual Machine instance, NIC, and Managed OS Disk.", "options": [{"id": "opt-3", "text": "Physical fiber optic cable delivered to the local office.", "isCorrect": false}, {"id": "opt-2", "text": "Managed OS Disk storing the operating system.", "isCorrect": true}, {"id": "opt-1", "text": "Network Interface (NIC) attached to a Virtual Network Subnet.", "isCorrect": true}, {"id": "opt-4", "text": "Azure Synapse Analytics dedicated SQL pool.", "isCorrect": false}]}}, {"code": "AZ-CS1-Q008", "title": "CS1: Azure Resource Manager Characteristics", "type": "MULTIPLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "ARM is the central management layer for authentication, access control, and declarative resource orchestration.", "content": {"prompt": "Which TWO statements correctly describe the central role of Azure Resource Manager (ARM) in Contoso deployment? (Select TWO)", "explanation": "ARM is the central management layer for authentication, access control, and declarative resource orchestration.", "options": [{"id": "opt-2", "text": "Authenticates and routes all requests initiated from Azure Portal, CLI, PowerShell, and Bicep.", "isCorrect": true}, {"id": "opt-4", "text": "Physically manufactures server chassis inside datacenters.", "isCorrect": false}, {"id": "opt-1", "text": "Provides a unified management REST API layer for creating, updating, and deleting resources.", "isCorrect": true}, {"id": "opt-3", "text": "Serves as an antivirus scanner installed on client laptops.", "isCorrect": false}]}}, {"code": "AZ-CS1-Q009", "title": "CS1: Availability Zone Features", "type": "MULTIPLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Availability Zones feature physically isolated datacenter buildings with redundant power and cooling.", "content": {"prompt": "Which TWO statements accurately describe the physical characteristics of Azure Availability Zones? (Select TWO)", "explanation": "Availability Zones feature physically isolated datacenter buildings with redundant power and cooling.", "options": [{"id": "opt-1", "text": "Each zone consists of physically separate datacenters with independent power, cooling, and networking.", "isCorrect": true}, {"id": "opt-3", "text": "Require connecting all servers to 4G cellular dongles.", "isCorrect": false}, {"id": "opt-2", "text": "Protect applications and data from datacenter facility failures.", "isCorrect": true}, {"id": "opt-4", "text": "Are only available inside A-series virtual machines.", "isCorrect": false}]}}, {"code": "AZ-CS1-Q010", "title": "CS1: Infrastructure as Code Benefits", "type": "MULTIPLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "IaC provides repeatable, automated, consistent environment deployments.", "content": {"prompt": "Which TWO benefits will Contoso gain by adopting Bicep Infrastructure as Code (IaC)? (Select TWO)", "explanation": "IaC provides repeatable, automated, consistent environment deployments.", "options": [{"id": "opt-3", "text": "Automatically increases home internet connection speed.", "isCorrect": false}, {"id": "opt-4", "text": "Eliminates the requirement for user authentication passwords.", "isCorrect": false}, {"id": "opt-1", "text": "Idempotency & Consistency: Ensures dev, test, and prod environments remain identical without configuration drift.", "isCorrect": true}, {"id": "opt-2", "text": "Automation & Speed: Enables rapid, repeatable deployments integrated into CI/CD DevOps pipelines.", "isCorrect": true}]}}, {"code": "AZ-CS1-Q011", "title": "CS1: Match Contoso Workloads to VM Series", "type": "DRAG_AND_DROP", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "E = Memory Optimized, F = Compute Optimized, B = Burstable, H = HPC.", "content": {"prompt": "Match each Contoso workload requirement to its optimal Azure Virtual Machine family series.", "explanation": "E = Memory Optimized, F = Compute Optimized, B = Burstable, H = HPC.", "items": [{"id": "item-3", "label": "B-Series"}, {"id": "item-2", "label": "F-Series"}, {"id": "item-4", "label": "H-Series"}, {"id": "item-1", "label": "E-Series"}], "targets": [{"id": "target-4", "label": "High-performance computing scientific simulations requiring InfiniBand networking.", "correctItemId": "item-4"}, {"id": "target-3", "label": "Dev/Test web environment with low baseline usage and periodic traffic bursts.", "correctItemId": "item-3"}, {"id": "target-2", "label": "High-speed batch calculation engine requiring fast clock speed CPUs.", "correctItemId": "item-2"}, {"id": "target-1", "label": "SAP HANA in-memory database requiring up to 2 TB of RAM.", "correctItemId": "item-1"}]}}, {"code": "AZ-CS1-Q012", "title": "CS1: Match Storage Tiers to Workloads", "type": "DRAG_AND_DROP", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Ultra Disk = sub-ms; Premium SSD = Production SQL; Standard SSD = Dev/Test; Standard HDD = Cold backup.", "content": {"prompt": "Match each Managed Disk storage tier to Contoso target database workload.", "explanation": "Ultra Disk = sub-ms; Premium SSD = Production SQL; Standard SSD = Dev/Test; Standard HDD = Cold backup.", "items": [{"id": "item-4", "label": "Standard HDD"}, {"id": "item-2", "label": "Premium SSD"}, {"id": "item-1", "label": "Ultra Disk"}, {"id": "item-3", "label": "Standard SSD"}], "targets": [{"id": "target-3", "label": "Light dev/test web server OS disks.", "correctItemId": "item-3"}, {"id": "target-4", "label": "Non-critical cold backup files and archive storage.", "correctItemId": "item-4"}, {"id": "target-2", "label": "Production SQL Server databases requiring high IOPS and single-digit ms latency.", "correctItemId": "item-2"}, {"id": "target-1", "label": "Sub-millisecond latency database storage for mission-critical transactional engines.", "correctItemId": "item-1"}]}}, {"code": "AZ-CS1-Q013", "title": "CS1: Match Management Tools to Use Cases", "type": "DRAG_AND_DROP", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Portal = GUI, CLI = az commands, PowerShell = Verb-Noun, Bicep = Declarative IaC.", "content": {"prompt": "Match each Azure management tool to Contoso usage scenario.", "explanation": "Portal = GUI, CLI = az commands, PowerShell = Verb-Noun, Bicep = Declarative IaC.", "items": [{"id": "item-1", "label": "Azure Portal"}, {"id": "item-2", "label": "Azure CLI"}, {"id": "item-4", "label": "Bicep Templates"}, {"id": "item-3", "label": "Azure PowerShell"}], "targets": [{"id": "target-4", "label": "Declarative IaC files integrated into CI/CD pipelines.", "correctItemId": "item-4"}, {"id": "target-1", "label": "Web-based GUI console for visual monitoring and dashboard customization.", "correctItemId": "item-1"}, {"id": "target-3", "label": "Task automation framework using Verb-Noun cmdlets (e.g. New-AzVM).", "correctItemId": "item-3"}, {"id": "target-2", "label": "Cross-platform CLI tool using az <group> <action> commands.", "correctItemId": "item-2"}]}}, {"code": "AZ-CS1-Q014", "title": "CS1: Match Physical Architecture Levels", "type": "DRAG_AND_DROP", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Region, Zone, Pair, Geography physical hierarchy.", "content": {"prompt": "Match each physical architecture boundary to its definition.", "explanation": "Region, Zone, Pair, Geography physical hierarchy.", "items": [{"id": "item-2", "label": "Availability Zone"}, {"id": "item-4", "label": "Geography"}, {"id": "item-3", "label": "Regional Pair"}, {"id": "item-1", "label": "Azure Region"}], "targets": [{"id": "target-2", "label": "Physically isolated datacenter with independent power, cooling, and networking.", "correctItemId": "item-2"}, {"id": "target-4", "label": "Discrete market containing regions that preserve data residency compliance.", "correctItemId": "item-4"}, {"id": "target-1", "label": "Latency-defined perimeter containing datacenters linked by a dedicated fiber network.", "correctItemId": "item-1"}, {"id": "target-3", "label": "Two regions in the same geography paired 300+ miles apart for DR.", "correctItemId": "item-3"}]}}, {"code": "AZ-CS1-Q015", "title": "CS1: Match Resource Lock Types", "type": "DRAG_AND_DROP", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "CanNotDelete allows edits but blocks deletion; ReadOnly blocks both edits and deletion.", "content": {"prompt": "Match each Azure Resource Lock type to its enforcement behavior.", "explanation": "CanNotDelete allows edits but blocks deletion; ReadOnly blocks both edits and deletion.", "items": [{"id": "item-4", "label": "Subscription Lock"}, {"id": "item-3", "label": "Management Group Lock"}, {"id": "item-2", "label": "ReadOnly Lock"}, {"id": "item-1", "label": "CanNotDelete Lock"}], "targets": [{"id": "target-1", "label": "Allows authorized users to read and modify a resource, but prevents deletion.", "correctItemId": "item-1"}, {"id": "target-2", "label": "Prevents authorized users from deleting or modifying a resource.", "correctItemId": "item-2"}, {"id": "target-3", "label": "Inherits lock protections down to all child subscriptions.", "correctItemId": "item-3"}, {"id": "target-4", "label": "Applies lock protections across all resource groups in a subscription.", "correctItemId": "item-4"}]}}, {"code": "AZ-CS1-Q016", "title": "CS1: TF - Resource Group Deletion", "type": "TRUE_FALSE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Deleting a Resource Group deletes all child resources contained within that group as part of lifecycle cleanup.", "content": {"prompt": "True or False: Deleting an Azure Resource Group in Contoso subscription automatically deletes all underlying virtual machines contained within it.", "explanation": "Deleting a Resource Group deletes all child resources contained within that group as part of lifecycle cleanup.", "isTrueCorrect": true}}, {"code": "AZ-CS1-Q017", "title": "CS1: TF - Resource Group Location", "type": "TRUE_FALSE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Resources inside a Resource Group do not have to reside in the same physical region as the Resource Group metadata location.", "content": {"prompt": "True or False: Contoso can deploy Virtual Machines physically located in Europe inside a Resource Group whose metadata location is set to East US.", "explanation": "Resources inside a Resource Group do not have to reside in the same physical region as the Resource Group metadata location.", "isTrueCorrect": true}}, {"code": "AZ-CS1-Q018", "title": "CS1: TF - Fault Domains vs Update Domains", "type": "TRUE_FALSE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "False. Update Domains (UD) manage planned platform reboots; Fault Domains (FD) protect against hardware/rack power failures.", "content": {"prompt": "True or False: Fault Domains (FD) group Virtual Machines together so they can be rebooted simultaneously during planned platform updates.", "explanation": "False. Update Domains (UD) manage planned platform reboots; Fault Domains (FD) protect against hardware/rack power failures.", "isTrueCorrect": false}}, {"code": "AZ-CS1-Q019", "title": "CS1: TF - Entra ID Global Scope", "type": "TRUE_FALSE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "False. Azure Entra ID is a Global service not bound to a single Azure region.", "content": {"prompt": "True or False: Azure Entra ID (Azure AD) is a Regional service tied to a single physical datacenter building.", "explanation": "False. Azure Entra ID is a Global service not bound to a single Azure region.", "isTrueCorrect": false}}, {"code": "AZ-CS1-Q020", "title": "CS1: TF - Bicep Compilation", "type": "TRUE_FALSE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "True. Bicep is a transparent syntax abstraction that transpiles into ARM JSON templates.", "content": {"prompt": "True or False: Microsoft Bicep files compile directly into native ARM JSON templates before deployment to Azure Resource Manager.", "explanation": "True. Bicep is a transparent syntax abstraction that transpiles into ARM JSON templates.", "isTrueCorrect": true}}];

  const dbCS1 = await prisma.caseStudy.create({
    data: {
      title: cs1Data.title,
      overview: cs1Data.overview,
      businessRequirements: cs1Data.businessRequirements,
      technicalRequirements: cs1Data.technicalRequirements,
      existingEnvironment: cs1Data.existingEnvironment,
    },
  });

  const seededCS1Questions: any[] = [];
  for (const q of cs1Qs) {
    const dbQ = await prisma.question.create({
      data: {
        code: q.code,
        title: q.title,
        type: q.type as any,
        difficulty: 'INTERMEDIATE',
        points: 1.0,
        explanation: q.explanation,
        content: JSON.stringify(q.content),
        categoryId: catAzure.id,
        caseStudyId: dbCS1.id,
      },
    });
    seededCS1Questions.push(dbQ);
  }

  const cs2Data = {"code": "CS-AZURE-02", "title": "Fabrikam Healthcare Global Telehealth Platform", "overview": "Fabrikam Healthcare is building a next-generation cloud-native Telehealth and diagnostic platform in Microsoft Azure. The platform hosts high-resolution medical imaging analysis, AI diagnostic inference models, and real-time telehealth video consultations for millions of global patients.", "businessRequirements": "1. Operational Availability: Web frontends must maintain at least 99.95% uptime SLA.\n2. Accidental Protection: Critical patient medical image storage accounts must be protected against accidental administrator deletion.\n3. High Performance: High-volume NoSQL Cassandra databases handling real-time vital metrics require direct NVMe storage throughput.\n4. Multi-Region DR: Prioritized recovery mechanisms must be established in the event of major regional power grid outages.", "technicalRequirements": "1. AI Diagnostic Models: Medical image inference requires GPU-accelerated computing.\n2. Dynamic Auto-scaling: Compute workloads must dynamically scale in response to CPU metrics using Virtual Machine Scale Sets (VMSS).\n3. CLI Management: Cloud engineering teams require browser-accessible, authenticated command-line management without local software installations.\n4. Unified Access Control: Enterprise permissions must follow fine-grained Role-Based Access Control (RBAC).", "existingEnvironment": "Fabrikam operates a hybrid cloud connected via Azure ExpressRoute to local hospital diagnostic imaging devices with legacy unmanaged VHD storage accounts."};
  const cs2Qs = [{"code": "AZ-CS2-Q021", "title": "CS2: Select VM Family for GPU Acceleration", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "N-Series VMs are equipped with NVIDIA GPUs for AI/ML inference and graphics rendering.", "content": {"prompt": "Which Virtual Machine series should Fabrikam select to run NVIDIA GPU-accelerated AI medical image diagnostic models?", "explanation": "N-Series VMs are equipped with NVIDIA GPUs for AI/ML inference and graphics rendering.", "options": [{"id": "opt-1", "text": "N-Series (GPU-Enabled)", "isCorrect": true}, {"id": "opt-3", "text": "L-Series (Storage-Optimized)", "isCorrect": false}, {"id": "opt-4", "text": "B-Series (Burstable CPU)", "isCorrect": false}, {"id": "opt-2", "text": "E-Series (Memory-Optimized)", "isCorrect": false}]}}, {"code": "AZ-CS2-Q022", "title": "CS2: Select VM Family for NoSQL NVMe Storage", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "L-Series VMs feature direct-attached local NVMe storage providing high I/O throughput for NoSQL databases.", "content": {"prompt": "Which Virtual Machine series family should Fabrikam choose for high-volume NoSQL Cassandra databases requiring direct-attached local NVMe storage?", "explanation": "L-Series VMs feature direct-attached local NVMe storage providing high I/O throughput for NoSQL databases.", "options": [{"id": "opt-1", "text": "L-Series (Storage-Optimized)", "isCorrect": true}, {"id": "opt-4", "text": "F-Series (Compute-Optimized)", "isCorrect": false}, {"id": "opt-3", "text": "N-Series (GPU-Enabled)", "isCorrect": false}, {"id": "opt-2", "text": "D-Series (General Purpose)", "isCorrect": false}]}}, {"code": "AZ-CS2-Q023", "title": "CS2: Prevent Accidental Storage Deletion", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "CanNotDelete lock permits reading and modifying resources while blocking accidental deletion.", "content": {"prompt": "Which Azure Resource Lock should Fabrikam apply to prevent accidental administrator deletion of critical patient medical image storage accounts?", "explanation": "CanNotDelete lock permits reading and modifying resources while blocking accidental deletion.", "options": [{"id": "opt-2", "text": "ReadOnly Lock", "isCorrect": false}, {"id": "opt-4", "text": "Subscription Lock", "isCorrect": false}, {"id": "opt-3", "text": "System Lock", "isCorrect": false}, {"id": "opt-1", "text": "CanNotDelete Lock", "isCorrect": true}]}}, {"code": "AZ-CS2-Q024", "title": "CS2: Auto-Scaling Compute Workloads", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "VMSS lets you manage and auto-scale a group of identical VMs integrated with load balancers.", "content": {"prompt": "Which Azure service meets Fabrikam technical requirement to automatically scale a load-balanced pool of identical web VMs in response to patient traffic spikes?", "explanation": "VMSS lets you manage and auto-scale a group of identical VMs integrated with load balancers.", "options": [{"id": "opt-3", "text": "Azure Entra ID Tenants", "isCorrect": false}, {"id": "opt-4", "text": "Azure Resource Locks", "isCorrect": false}, {"id": "opt-1", "text": "Azure Virtual Machine Scale Sets (VMSS)", "isCorrect": true}, {"id": "opt-2", "text": "Azure Storage Account Containers", "isCorrect": false}]}}, {"code": "AZ-CS2-Q025", "title": "CS2: Browser Command-Line Shell", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Azure Cloud Shell is an interactive, browser-accessible shell for managing Azure resources using Bash or PowerShell.", "content": {"prompt": "Which tool satisfies Fabrikam requirement for a browser-accessible, pre-authenticated command-line shell to run management scripts without local software installation?", "explanation": "Azure Cloud Shell is an interactive, browser-accessible shell for managing Azure resources using Bash or PowerShell.", "options": [{"id": "opt-3", "text": "Windows Notepad", "isCorrect": false}, {"id": "opt-1", "text": "Azure Cloud Shell", "isCorrect": true}, {"id": "opt-2", "text": "Visual Studio Code Desktop", "isCorrect": false}, {"id": "opt-4", "text": "Microsoft Outlook", "isCorrect": false}]}}, {"code": "AZ-CS2-Q026", "title": "CS2: Benefits of Managed Disks", "type": "MULTIPLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Managed Disks simplify storage management and align disks across distinct storage Fault Domains.", "content": {"prompt": "Which TWO advantages will Fabrikam gain by migrating legacy unmanaged VHD disks to Azure Managed Disks? (Select TWO)", "explanation": "Managed Disks simplify storage management and align disks across distinct storage Fault Domains.", "options": [{"id": "opt-2", "text": "High Availability Alignment: Ensures disks for Availability Set VMs are placed on distinct storage Fault Domains.", "isCorrect": true}, {"id": "opt-4", "text": "Automatically converts Linux VMs into Windows Server 2025.", "isCorrect": false}, {"id": "opt-1", "text": "Automatic Storage Management: Azure manages underlying storage accounts without VHD file limits.", "isCorrect": true}, {"id": "opt-3", "text": "Eliminates all charges for cloud storage.", "isCorrect": false}]}}, {"code": "AZ-CS2-Q027", "title": "CS2: Azure CLI Login Methods", "type": "MULTIPLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Azure CLI supports interactive browser logins and non-interactive Service Principal / Managed Identity logins.", "content": {"prompt": "Which TWO authentication mechanisms can Fabrikam engineers use to log into Azure CLI? (Select TWO)", "explanation": "Azure CLI supports interactive browser logins and non-interactive Service Principal / Managed Identity logins.", "options": [{"id": "opt-4", "text": "Sending an SMS text message to a landline phone.", "isCorrect": false}, {"id": "opt-3", "text": "Scanning a paper barcode on a physical employee badge into a webcam.", "isCorrect": false}, {"id": "opt-2", "text": "Automated non-interactive login using Service Principals or Managed Identity in automation scripts.", "isCorrect": true}, {"id": "opt-1", "text": "Interactive web browser authentication using \u0007z login.", "isCorrect": true}]}}, {"code": "AZ-CS2-Q028", "title": "CS2: Subscription Functions", "type": "MULTIPLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Subscriptions serve as billing containers and security administration boundaries.", "content": {"prompt": "Which TWO fundamental logical boundaries are provided by an Azure Subscription for Fabrikam environment? (Select TWO)", "explanation": "Subscriptions serve as billing containers and security administration boundaries.", "options": [{"id": "opt-2", "text": "Security & Access Boundary: Scope for applying RBAC permissions and access policies.", "isCorrect": true}, {"id": "opt-4", "text": "Web browser cookie storage boundary for client laptops.", "isCorrect": false}, {"id": "opt-1", "text": "Billing Boundary: Grouping usage metrics and issuing separate invoices.", "isCorrect": true}, {"id": "opt-3", "text": "Hardware RAM allocation boundary for physical datacenter racks.", "isCorrect": false}]}}, {"code": "AZ-CS2-Q029", "title": "CS2: Management Group Governance", "type": "MULTIPLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Management Groups support 6 levels of depth for policy inheritance across subscriptions.", "content": {"prompt": "Which TWO features of Azure Management Groups support Fabrikam multi-subscription governance? (Select TWO)", "explanation": "Management Groups support 6 levels of depth for policy inheritance across subscriptions.", "options": [{"id": "opt-4", "text": "Automatically format client PC hard drives.", "isCorrect": false}, {"id": "opt-2", "text": "Enable policy assignments and RBAC permissions to inherit down to all child subscriptions.", "isCorrect": true}, {"id": "opt-1", "text": "Support hierarchical organizational structures up to 6 levels of depth.", "isCorrect": true}, {"id": "opt-3", "text": "Store raw medical image DICOM files directly on physical disk drives.", "isCorrect": false}]}}, {"code": "AZ-CS2-Q030", "title": "CS2: Regional Pair DR Benefits", "type": "MULTIPLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Regional Pairs provide cross-region replication and prioritized recovery during disasters.", "content": {"prompt": "Which TWO capabilities do Azure Regional Pairs provide for Fabrikam global disaster recovery planning? (Select TWO)", "explanation": "Regional Pairs provide cross-region replication and prioritized recovery during disasters.", "options": [{"id": "opt-1", "text": "Prioritized Region Recovery: Azure prioritizes recovering at least one region out of every pair during widespread outages.", "isCorrect": true}, {"id": "opt-2", "text": "Cross-Region Replication: Paired regions separated by 300+ miles protect against localized natural disasters.", "isCorrect": true}, {"id": "opt-3", "text": "Automatic conversion of SQL tables into printed paper copies.", "isCorrect": false}, {"id": "opt-4", "text": "Free lifetime subscriptions for all hospital staff.", "isCorrect": false}]}}, {"code": "AZ-CS2-Q031", "title": "CS2: Match Compute Workloads to Series", "type": "DRAG_AND_DROP", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "N = GPU, L = NVMe NoSQL, D = General Purpose, B = Burstable.", "content": {"prompt": "Match each Fabrikam telehealth component to its appropriate Azure VM series.", "explanation": "N = GPU, L = NVMe NoSQL, D = General Purpose, B = Burstable.", "items": [{"id": "item-3", "label": "D-Series"}, {"id": "item-1", "label": "N-Series"}, {"id": "item-4", "label": "B-Series"}, {"id": "item-2", "label": "L-Series"}], "targets": [{"id": "target-1", "label": "NVIDIA GPU acceleration for AI diagnostic model inference.", "correctItemId": "item-1"}, {"id": "target-4", "label": "Internal developer sandbox environments with burstable CPU demand.", "correctItemId": "item-4"}, {"id": "target-3", "label": "General-purpose web API servers with balanced CPU and RAM.", "correctItemId": "item-3"}, {"id": "target-2", "label": "High-throughput NoSQL Cassandra storage handling real-time vital metrics.", "correctItemId": "item-2"}]}}, {"code": "AZ-CS2-Q032", "title": "CS2: Match Azure CLI Command Groups", "type": "DRAG_AND_DROP", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "CLI groups: az vm, az group, az network, az storage.", "content": {"prompt": "Match each Azure CLI command group to its target resource category.", "explanation": "CLI groups: az vm, az group, az network, az storage.", "items": [{"id": "item-1", "label": "az vm"}, {"id": "item-2", "label": "az group"}, {"id": "item-3", "label": "az network vnet"}, {"id": "item-4", "label": "az storage account"}], "targets": [{"id": "target-2", "label": "Manage resource group containers.", "correctItemId": "item-2"}, {"id": "target-4", "label": "Manage Blob, File, Queue, and Table storage accounts.", "correctItemId": "item-4"}, {"id": "target-1", "label": "Manage virtual machine compute instances.", "correctItemId": "item-1"}, {"id": "target-3", "label": "Manage virtual networks, subnets, and IP addressing.", "correctItemId": "item-3"}]}}, {"code": "AZ-CS2-Q033", "title": "CS2: Match Resiliency Models to SLA", "type": "DRAG_AND_DROP", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "AZ = 99.99%, AS = 99.95%, Single Premium SSD = 99.90%, Pair = Cross-Region DR.", "content": {"prompt": "Match each Fabrikam VM deployment model to its SLA uptime guarantee.", "explanation": "AZ = 99.99%, AS = 99.95%, Single Premium SSD = 99.90%, Pair = Cross-Region DR.", "items": [{"id": "item-2", "label": "99.95% SLA"}, {"id": "item-3", "label": "99.90% SLA"}, {"id": "item-1", "label": "99.99% SLA"}, {"id": "item-4", "label": "Cross-Region DR"}], "targets": [{"id": "target-2", "label": "Two or more Virtual Machines in an Availability Set.", "correctItemId": "item-2"}, {"id": "target-3", "label": "Single Virtual Machine with Premium SSD or Ultra Disk.", "correctItemId": "item-3"}, {"id": "target-4", "label": "Workload replicated across paired Azure regions 300+ miles apart.", "correctItemId": "item-4"}, {"id": "target-1", "label": "Virtual Machines deployed across two or more Availability Zones.", "correctItemId": "item-1"}]}}, {"code": "AZ-CS2-Q034", "title": "CS2: Match Governance Mechanisms", "type": "DRAG_AND_DROP", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Policy = Enforcement, RBAC = Roles, Lock = Protection, Blueprints = Packages.", "content": {"prompt": "Match each Azure governance tool to Fabrikam governance objective.", "explanation": "Policy = Enforcement, RBAC = Roles, Lock = Protection, Blueprints = Packages.", "items": [{"id": "item-2", "label": "Azure RBAC"}, {"id": "item-1", "label": "Azure Policy"}, {"id": "item-3", "label": "Resource Lock"}, {"id": "item-4", "label": "Azure Blueprints"}], "targets": [{"id": "target-1", "label": "Enforce compliance rules such as restricting allowed VM SKU families.", "correctItemId": "item-1"}, {"id": "target-3", "label": "Prevent accidental deletion of production medical image storage.", "correctItemId": "item-3"}, {"id": "target-2", "label": "Assign fine-grained role permissions (Owner, Contributor, Reader) to staff.", "correctItemId": "item-2"}, {"id": "target-4", "label": "Package policies, RBAC, and templates into repeatable subscription standards.", "correctItemId": "item-4"}]}}, {"code": "AZ-CS2-Q035", "title": "CS2: Match Infrastructure Concepts", "type": "DRAG_AND_DROP", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "FD = Rack hardware, UD = Maintenance patch group, RG = Lifecycle, Tenant = Identity.", "content": {"prompt": "Match each Azure infrastructure component to its architectural function.", "explanation": "FD = Rack hardware, UD = Maintenance patch group, RG = Lifecycle, Tenant = Identity.", "items": [{"id": "item-2", "label": "Update Domain"}, {"id": "item-1", "label": "Fault Domain"}, {"id": "item-4", "label": "Entra ID Tenant"}, {"id": "item-3", "label": "Resource Group"}], "targets": [{"id": "target-4", "label": "Dedicated identity boundary for user accounts and authentication.", "correctItemId": "item-4"}, {"id": "target-2", "label": "Group of VMs patched sequentially during planned maintenance.", "correctItemId": "item-2"}, {"id": "target-3", "label": "Logical container for assets managed as a single lifecycle unit.", "correctItemId": "item-3"}, {"id": "target-1", "label": "Hardware rack sharing common power supply and network switch.", "correctItemId": "item-1"}]}}, {"code": "AZ-CS2-Q036", "title": "CS2: TF - Update Domain Reboot Behavior", "type": "TRUE_FALSE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "False. Update Domains patch VMs sequentially (one UD at a time) so that remaining VMs continue servicing traffic.", "content": {"prompt": "True or False: Update Domains (UD) group Virtual Machines together so they can be rebooted simultaneously during planned platform maintenance.", "explanation": "False. Update Domains patch VMs sequentially (one UD at a time) so that remaining VMs continue servicing traffic.", "isTrueCorrect": false}}, {"code": "AZ-CS2-Q037", "title": "CS2: TF - Management Group Policy Inheritance", "type": "TRUE_FALSE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "True. Governance policies applied at a Management Group automatically inherit down the hierarchy to child subscriptions.", "content": {"prompt": "True or False: Fabrikam can assign an Azure Policy at the Management Group level, and all child subscriptions will automatically inherit the policy rules.", "explanation": "True. Governance policies applied at a Management Group automatically inherit down the hierarchy to child subscriptions.", "isTrueCorrect": true}}, {"code": "AZ-CS2-Q038", "title": "CS2: TF - Azure CLI Command Syntax", "type": "TRUE_FALSE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "False. Azure PowerShell uses Verb-Noun cmdlets (e.g. New-AzVM). Azure CLI uses az <group> <action> commands (e.g. az vm create).", "content": {"prompt": "True or False: Azure CLI commands use a Verb-Noun structure such as New-AzVM.", "explanation": "False. Azure PowerShell uses Verb-Noun cmdlets (e.g. New-AzVM). Azure CLI uses az <group> <action> commands (e.g. az vm create).", "isTrueCorrect": false}}, {"code": "AZ-CS2-Q039", "title": "CS2: TF - Standard HDD Performance", "type": "TRUE_FALSE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "False. Ultra Disk provides sub-millisecond latency. Standard HDD is magnetic storage designed for non-critical backups.", "content": {"prompt": "True or False: Standard HDD magnetic disks deliver sub-millisecond latency for mission-critical SQL databases.", "explanation": "False. Ultra Disk provides sub-millisecond latency. Standard HDD is magnetic storage designed for non-critical backups.", "isTrueCorrect": false}}, {"code": "AZ-CS2-Q040", "title": "CS2: TF - ARM Central API Layer", "type": "TRUE_FALSE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "True. ARM is the central deployment and management service endpoint for all Azure tools and SDKs.", "content": {"prompt": "True or False: Every management request initiated from the Azure Portal, Azure CLI, or Azure PowerShell passes through Azure Resource Manager (ARM).", "explanation": "True. ARM is the central deployment and management service endpoint for all Azure tools and SDKs.", "isTrueCorrect": true}}];

  const dbCS2 = await prisma.caseStudy.create({
    data: {
      title: cs2Data.title,
      overview: cs2Data.overview,
      businessRequirements: cs2Data.businessRequirements,
      technicalRequirements: cs2Data.technicalRequirements,
      existingEnvironment: cs2Data.existingEnvironment,
    },
  });

  const seededCS2Questions: any[] = [];
  for (const q of cs2Qs) {
    const dbQ = await prisma.question.create({
      data: {
        code: q.code,
        title: q.title,
        type: q.type as any,
        difficulty: 'INTERMEDIATE',
        points: 1.0,
        explanation: q.explanation,
        content: JSON.stringify(q.content),
        categoryId: catAzure.id,
        caseStudyId: dbCS2.id,
      },
    });
    seededCS2Questions.push(dbQ);
  }

  // Create Case Study Sections for Azure Basics Exam
  const secCS1 = await prisma.examSection.create({
    data: {
      examId: azureBasicsExam.id,
      title: '5. Case Study: Contoso Financial Services Multi-Region Migration (20 Items)',
      orderIndex: 5,
      weightPercentage: 20.0,
    },
  });

  let orderCS1 = 1;
  for (const q of seededCS1Questions) {
    await prisma.sectionQuestion.create({
      data: { sectionId: secCS1.id, questionId: q.id, orderIndex: orderCS1++ },
    });
  }

  const secCS2 = await prisma.examSection.create({
    data: {
      examId: azureBasicsExam.id,
      title: '6. Case Study: Fabrikam Healthcare Global Telehealth Platform (20 Items)',
      orderIndex: 6,
      weightPercentage: 20.0,
    },
  });

  let orderCS2 = 1;
  for (const q of seededCS2Questions) {
    await prisma.sectionQuestion.create({
      data: { sectionId: secCS2.id, questionId: q.id, orderIndex: orderCS2++ },
    });
  }

  // Update total questions config and unlock for Azure Basics exam
  await prisma.exam.update({
    where: { id: azureBasicsExam.id },
    data: { totalQuestionsConfig: 90, isGloballyUnlocked: true },
  });

  await prisma.examRoom.upsert({
    where: { roomCode: 'HALL-AZURE-BASICS' },
    update: { status: 'OPEN' },
    create: {
      roomCode: 'HALL-AZURE-BASICS',
      title: 'Azure Basics Certification Practice Hall',
      examId: azureBasicsExam.id,
      status: 'OPEN',
      allowReview: true,
      createdBy: creatorUser.email,
    },
  });

  console.log("✅ Seeded 2 Case Studies (CS-AZURE-01 & CS-AZURE-02) with 40 Case Questions attached to AZURE-BASICS!");
  // Seed HashiCorp Terraform 7 Domain Sub-Exams & Parent Exam Track
  const tfJsonPath = path.join(__dirname, 'terraform_parsed_all.json');
  if (fs.existsSync(tfJsonPath)) {
    console.log('📦 Seeding HashiCorp Terraform 7 Domain Sub-Exams & Parent Certification Track...');
    const tfDomains = JSON.parse(fs.readFileSync(tfJsonPath, 'utf-8'));

    const catHashiCorp = await prisma.category.create({
      data: { name: 'HashiCorp Certified', description: 'Infrastructure as Code Certification Questions' },
    });

    // Parent Terraform Exam Track
    const parentTfExam = await prisma.exam.create({
      data: {
        code: 'TERRAFORM',
        title: 'HashiCorp Certified: Terraform Associate (004)',
        vendor: 'HASHICORP',
        examType: 'CERTIFICATION',
        description: 'Complete HashiCorp Certified: Terraform Associate (004) parent certification exam covering all 9 official HashiCorp Terraform domains (170 Questions total).',
        timeLimitMinutes: 120,
        passingScore: 80.0,
        totalQuestionsConfig: 50,
        creatorId: creatorUser.id,
        status: 'PUBLISHED',
        isGloballyUnlocked: false,
      },
    });

    // Parent Room (CLOSED by default - candidates cannot see/launch unless allowed by Admin)
    await prisma.examRoom.create({
      data: {
        roomCode: 'HALL-TERRAFORM',
        title: 'HashiCorp Terraform Complete Certification Hall',
        examId: parentTfExam.id,
        status: 'CLOSED',
        allowReview: true,
        createdBy: creatorUser.email,
      },
    });

    // Pre-create the 9 official HashiCorp sections for the parent exam
    const hashiCorpOfficialSections = [
      { id: 'sec-tf-1', title: '1. Understand infrastructure as code (IaC) concepts', weightPercentage: 10.0, orderIndex: 1 },
      { id: 'sec-tf-2', title: '2. Understand the purpose of Terraform (vs other IaC)', weightPercentage: 10.0, orderIndex: 2 },
      { id: 'sec-tf-3', title: '3. Understand Terraform basics', weightPercentage: 15.0, orderIndex: 3 },
      { id: 'sec-tf-4', title: '4. Use Terraform outside the core workflow', weightPercentage: 10.0, orderIndex: 4 },
      { id: 'sec-tf-5', title: '5. Interact with Terraform modules', weightPercentage: 15.0, orderIndex: 5 },
      { id: 'sec-tf-6', title: '6. Use the core Terraform workflow', weightPercentage: 15.0, orderIndex: 6 },
      { id: 'sec-tf-7', title: '7. Implement and maintain state', weightPercentage: 10.0, orderIndex: 7 },
      { id: 'sec-tf-8', title: '8. Read, generate, and modify configuration', weightPercentage: 5.0, orderIndex: 8 },
      { id: 'sec-tf-9', title: '9. Understand Terraform Cloud capabilities', weightPercentage: 10.0, orderIndex: 9 },
    ];

    const parentSectionMap: Record<number, any> = {};
    for (const secDef of hashiCorpOfficialSections) {
      const createdSec = await prisma.examSection.create({
        data: {
          id: secDef.id,
          examId: parentTfExam.id,
          title: secDef.title,
          orderIndex: secDef.orderIndex,
          weightPercentage: secDef.weightPercentage,
        },
      });
      parentSectionMap[secDef.orderIndex] = createdSec;
    }

    for (const d of tfDomains) {
      const { domain_code, exam_code, domain_title, questions } = d;

      // 1. Create Sub-Exam Track with Lock/Unlock & Dedicated Room
      const subExam = await prisma.exam.create({
        data: {
          code: exam_code,
          title: `HashiCorp Terraform ${domain_code}: ${domain_title.split(':').pop()?.trim()}`,
          vendor: 'HASHICORP',
          examType: 'CERTIFICATION',
          description: `Dedicated domain sub-exam for HashiCorp Terraform ${domain_title} containing exactly ${questions.length} domain questions.`,
          timeLimitMinutes: 60,
          passingScore: 80.0,
          totalQuestionsConfig: questions.length,
          creatorId: creatorUser.id,
          status: 'PUBLISHED',
          isGloballyUnlocked: false,
        },
      });

      // 2. Create Sub-Exam Dedicated Room (CLOSED by default)
      const roomCode = `HALL-TF-${domain_code}`;
      await prisma.examRoom.create({
        data: {
          roomCode,
          title: `HashiCorp Terraform ${domain_code} Proctored Hall`,
          examId: subExam.id,
          status: 'CLOSED',
          allowReview: true,
          createdBy: creatorUser.email,
        },
      });

      // 3. Create Sub-Exam Section
      const subSec = await prisma.examSection.create({
        data: {
          examId: subExam.id,
          title: domain_title,
          orderIndex: 1,
          weightPercentage: 100.0,
        },
      });

      let qOrder = 1;
      for (let idx = 0; idx < questions.length; idx++) {
        const q = questions[idx];
        const question = await prisma.question.create({
          data: {
            code: q.code,
            title: q.prompt.substring(0, 120),
            type: q.type as any,
            difficulty: 'INTERMEDIATE',
            points: 1.0,
            explanation: `Official HashiCorp Terraform explanation for ${q.code}.`,
            content: JSON.stringify({
              prompt: q.prompt,
              explanation: `Official HashiCorp Terraform explanation for ${q.code}.`,
              options: q.options.map((o: any, oIdx: number) => ({
                id: `opt-${oIdx + 1}`,
                text: o.text,
                isCorrect: o.isCorrect,
                key: o.key,
              })),
            }),
          },
        });

        // Link question to sub-exam section
        await prisma.sectionQuestion.create({
          data: { sectionId: subSec.id, questionId: question.id, orderIndex: qOrder },
        });

        // Determine parent section based on domain & question index
        let targetParentSecId = parentSectionMap[1].id;
        if (domain_code === 'D-1') {
          targetParentSecId = idx < 7 ? parentSectionMap[1].id : parentSectionMap[2].id;
        } else if (domain_code === 'D-2') {
          targetParentSecId = parentSectionMap[3].id;
        } else if (domain_code === 'D-3') {
          targetParentSecId = idx < 25 ? parentSectionMap[6].id : parentSectionMap[4].id;
        } else if (domain_code === 'D-4') {
          targetParentSecId = parentSectionMap[5].id;
        } else if (domain_code === 'D-5') {
          targetParentSecId = parentSectionMap[7].id;
        } else if (domain_code === 'D-6') {
          targetParentSecId = parentSectionMap[9].id;
        } else if (domain_code === 'D-7') {
          targetParentSecId = parentSectionMap[8].id;
        }

        // Link question to parent exam section
        await prisma.sectionQuestion.create({
          data: { sectionId: targetParentSecId, questionId: question.id, orderIndex: qOrder++ },
        });
      }

      console.log(`✅ Seeded ${exam_code} (${domain_code}) with ${questions.length} questions & Room ${roomCode}`);
    }
  }

  // Ensure sample passed score report attempt 36828c16-52e2-40e6-9a80-8f3e3915c9b5 exists for AZ-305
  const sampleAz305 = await prisma.exam.findFirst({ where: { code: 'AZ-305' } });
  if (sampleAz305) {
    await prisma.examAttempt.upsert({
      where: { id: '36828c16-52e2-40e6-9a80-8f3e3915c9b5' },
      update: {
        candidateName: 'Standard Candidate',
        scorePercentage: 92.0,
        passed: true,
        totalQuestions: 25,
      },
      create: {
        id: '36828c16-52e2-40e6-9a80-8f3e3915c9b5',
        userId: candidateUser.id,
        examId: sampleAz305.id,
        candidateName: 'Standard Candidate',
        scorePercentage: 92.0,
        passed: true,
        totalQuestions: 25,
        answers: '{}',
        startedAt: new Date('2026-07-29T10:00:00.000Z'),
        completedAt: new Date('2026-07-29T11:15:00.000Z'),
      },
    });

    // Also link user1 candidate passed attempt
    await prisma.examAttempt.upsert({
      where: { id: '36828c16-52e2-40e6-9a80-8f3e3915c9b6' },
      update: {
        candidateName: 'user1',
        scorePercentage: 94.4,
        passed: true,
        totalQuestions: 25,
      },
      create: {
        id: '36828c16-52e2-40e6-9a80-8f3e3915c9b6',
        userId: user1Candidate.id,
        examId: sampleAz305.id,
        candidateName: 'user1',
        scorePercentage: 94.4,
        passed: true,
        totalQuestions: 25,
        answers: '{}',
        startedAt: new Date('2026-07-29T10:30:00.000Z'),
        completedAt: new Date('2026-07-29T11:45:00.000Z'),
      },
    });

    // Seed sample failed attempt for user1 so failed filter in Analytics shows records
    await prisma.examAttempt.upsert({
      where: { id: '36828c16-52e2-40e6-9a80-8f3e3915c9b7' },
      update: {
        candidateName: 'user1',
        scorePercentage: 58.0,
        passed: false,
        totalQuestions: 25,
      },
      create: {
        id: '36828c16-52e2-40e6-9a80-8f3e3915c9b7',
        userId: user1Candidate.id,
        examId: sampleAz305.id,
        candidateName: 'user1',
        scorePercentage: 58.0,
        passed: false,
        totalQuestions: 25,
        answers: '{}',
        startedAt: new Date('2026-07-28T14:00:00.000Z'),
        completedAt: new Date('2026-07-28T15:15:00.000Z'),
      },
    });
  }

  console.log('🎉 ALL Certification Tracks & HashiCorp Terraform 7 Domain Sub-Exams Successfully Seeded!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
