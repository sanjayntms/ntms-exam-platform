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
    "title": "Azure Storage Replication Types (LRS vs ZRS vs GRS)",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Zone-Redundant Storage (ZRS) replicates your data synchronously across three Azure availability zones in the primary region, providing high availability against datacenter outages without requiring cross-region failover.",
    "content": {
      "prompt": "An enterprise requires a storage solution that synchronously replicates data across three separate availability zones within the primary Azure region. Which storage replication strategy should you select?",
      "explanation": "Zone-Redundant Storage (ZRS) replicates your data synchronously across three Azure availability zones in the primary region, providing high availability against datacenter outages without requiring cross-region failover.",
      "options": [
        {
          "id": "opt-1",
          "text": "Locally-Redundant Storage (LRS)",
          "isCorrect": false
        },
        {
          "id": "opt-2",
          "text": "Zone-Redundant Storage (ZRS)",
          "isCorrect": true
        },
        {
          "id": "opt-3",
          "text": "Geo-Redundant Storage (GRS)",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Read-Access Geo-Redundant Storage (RA-GRS)",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q002",
    "title": "Azure Blob Storage Access Tiers",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "The Archive tier offers the lowest storage cost but has higher data retrieval costs and requires several hours of rehydration latency before data can be accessed.",
    "content": {
      "prompt": "Which Azure Blob Storage access tier offers the lowest data storage cost for long-term compliance data that can tolerate several hours of retrieval latency?",
      "explanation": "The Archive tier offers the lowest storage cost but has higher data retrieval costs and requires several hours of rehydration latency before data can be accessed.",
      "options": [
        {
          "id": "opt-1",
          "text": "Hot Access Tier",
          "isCorrect": false
        },
        {
          "id": "opt-2",
          "text": "Cool Access Tier",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Cold Access Tier",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Archive Access Tier",
          "isCorrect": true
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q003",
    "title": "Azure Bastion RDP/SSH Secure Access",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Azure Bastion provides secure, seamless RDP/SSH connectivity to your virtual machines directly through the Azure portal over TLS/HTTPS (port 443) without exposing public IP addresses on the VMs.",
    "content": {
      "prompt": "You need to enable administrators to securely RDP and SSH into Azure Virtual Machines directly via an HTML5 browser without assigning public IP addresses to the VMs or exposing port 3389/22 to the public internet. Which service should you deploy?",
      "explanation": "Azure Bastion provides secure, seamless RDP/SSH connectivity to your virtual machines directly through the Azure portal over TLS/HTTPS (port 443) without exposing public IP addresses on the VMs.",
      "options": [
        {
          "id": "opt-1",
          "text": "Azure Bastion",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Azure VPN Gateway",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Azure ExpressRoute",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Azure Application Gateway",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q004",
    "title": "Network Security Groups (NSG) Rule Evaluation",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "NSG rules are processed in priority order from lowest number (100) to highest number (4096). Once a rule matches incoming or outgoing traffic, processing stops.",
    "content": {
      "prompt": "In an Azure Network Security Group (NSG), how are security rules evaluated against network traffic?",
      "explanation": "NSG rules are processed in priority order from lowest number (100) to highest number (4096). Once a rule matches incoming or outgoing traffic, processing stops.",
      "options": [
        {
          "id": "opt-1",
          "text": "In numerical order by rule priority, from lowest number (highest priority) to highest number, stopping at the first match.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "In alphabetical order by rule name.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "In reverse order of creation timestamp.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "All rules are evaluated simultaneously and deny rules always override allow rules regardless of priority.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q005",
    "title": "Azure User Defined Routes (UDR) & Route Tables",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "User Defined Routes (UDRs) override Azure's default system routing table to force subnet traffic through a Virtual Network Appliance (NVA) such as a third-party firewall.",
    "content": {
      "prompt": "You need to override Azure default system routes and force all outbound internet traffic from a backend database subnet through a virtual firewall appliance. What Azure component must you create and link to the subnet?",
      "explanation": "User Defined Routes (UDRs) override Azure's default system routing table to force subnet traffic through a Virtual Network Appliance (NVA) such as a third-party firewall.",
      "options": [
        {
          "id": "opt-1",
          "text": "Route Table with User Defined Routes (UDR)",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Network Security Group (NSG) Application Security Group link",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Azure NAT Gateway endpoint",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Azure Front Door routing rule",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q006",
    "title": "VPN Gateway vs ExpressRoute Hybrid Connectivity",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "ExpressRoute provides a dedicated, private connection to Azure that does not traverse the public internet, offering higher reliability, faster speeds, and lower latency than S2S VPN.",
    "content": {
      "prompt": "An enterprise requires a private, high-speed connection between its on-premises corporate datacenter and Azure that does NOT traverse the public internet. Which connectivity option satisfies this requirement?",
      "explanation": "ExpressRoute provides a dedicated, private connection to Azure that does not traverse the public internet, offering higher reliability, faster speeds, and lower latency than S2S VPN.",
      "options": [
        {
          "id": "opt-1",
          "text": "Site-to-Site (S2S) IPSec VPN",
          "isCorrect": false
        },
        {
          "id": "opt-2",
          "text": "Point-to-Site (P2S) VPN",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Azure ExpressRoute",
          "isCorrect": true
        },
        {
          "id": "opt-4",
          "text": "Azure Private Link Service",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q007",
    "title": "Azure Key Vault Capabilities",
    "type": "MULTIPLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Azure Key Vault manages three primary asset types: Secrets (passwords/API keys), Keys (cryptographic CMK encryption keys), and Certificates (SSL/TLS certs).",
    "content": {
      "prompt": "Which of the following sensitive assets can be securely stored and managed using Azure Key Vault? (Select TWO)",
      "explanation": "Azure Key Vault manages three primary asset types: Secrets (passwords/API keys), Keys (cryptographic CMK encryption keys), and Certificates (SSL/TLS certs).",
      "options": [
        {
          "id": "opt-1",
          "text": "Cryptographic Keys used for data encryption at rest (Customer-Managed Keys).",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Application database passwords and API connection secrets.",
          "isCorrect": true
        },
        {
          "id": "opt-3",
          "text": "Raw Virtual Machine disk VHD image files.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Uncompiled C# application source code repositories.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q008",
    "title": "Azure Cost Management & Budgets",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Azure Cost Management Budgets allow you to set spending thresholds and automatically trigger alert notifications via email or Action Groups when spending reaches a specified percentage.",
    "content": {
      "prompt": "How can an Azure subscription administrator prevent unexpected cloud spending by receiving automated notifications when monthly consumption exceeds $5,000?",
      "explanation": "Azure Cost Management Budgets allow you to set spending thresholds and automatically trigger alert notifications via email or Action Groups when spending reaches a specified percentage.",
      "options": [
        {
          "id": "opt-1",
          "text": "Configure an Azure Cost Management Budget with threshold alert conditions.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Apply a ReadOnly Resource Lock to the subscription.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Create an Azure Policy denying all VM deployments.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Set up an Azure Advisor recommendation rule.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q009",
    "title": "Azure Tags & Azure Resource Graph Querying",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Azure Tags consist of key-value pairs assigned to resources. Azure Resource Graph allows querying resources by tag across thousands of subscriptions using KQL.",
    "content": {
      "prompt": "Which Azure governance feature allows organizations to attach custom name-value metadata pairs (such as Environment=Production or CostCenter=1042) to resources for billing organization and search?",
      "explanation": "Azure Tags consist of key-value pairs assigned to resources. Azure Resource Graph allows querying resources by tag across thousands of subscriptions using KQL.",
      "options": [
        {
          "id": "opt-1",
          "text": "Azure Resource Tags",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Management Group Rules",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Entra ID Claims",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Network Security Group Labels",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q010",
    "title": "Azure Application Insights Telemetry",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Application Insights is a feature of Azure Monitor that provides Application Performance Monitoring (APM) to track web app request rates, response times, failure rates, and exceptions.",
    "content": {
      "prompt": "Which service should you implement to perform Application Performance Monitoring (APM) for a web application to diagnose slow HTTP requests, unhandled exceptions, and dependency response times?",
      "explanation": "Application Insights is a feature of Azure Monitor that provides Application Performance Monitoring (APM) to track web app request rates, response times, failure rates, and exceptions.",
      "options": [
        {
          "id": "opt-1",
          "text": "Azure Application Insights",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Azure Network Watcher",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Microsoft Defender for Cloud",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Azure Service Health",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q011",
    "title": "Microsoft Defender for Cloud Security Posture",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Microsoft Defender for Cloud provides Cloud Security Posture Management (CSPM) and calculates a Secure Score to help organizations remediate security vulnerabilities.",
    "content": {
      "prompt": "Which service evaluates your Azure infrastructure against security best practices and generates a unified Secure Score with actionable recommendations to harden resources?",
      "explanation": "Microsoft Defender for Cloud provides Cloud Security Posture Management (CSPM) and calculates a Secure Score to help organizations remediate security vulnerabilities.",
      "options": [
        {
          "id": "opt-1",
          "text": "Microsoft Defender for Cloud",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Azure Traffic Manager",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Azure Cost Management",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Azure ExpressRoute Direct",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q012",
    "title": "Azure Advisor Recommendations Categories",
    "type": "MULTIPLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Azure Advisor provides personalized recommendations across 5 pillars: Cost, Security, Reliability (High Availability), Operational Excellence, and Performance.",
    "content": {
      "prompt": "Which key operational pillars are evaluated by Azure Advisor to provide optimization recommendations? (Select TWO)",
      "explanation": "Azure Advisor provides personalized recommendations across 5 pillars: Cost, Security, Reliability (High Availability), Operational Excellence, and Performance.",
      "options": [
        {
          "id": "opt-1",
          "text": "Cost Optimization: Identifying underutilized or idle resources to reduce monthly spend.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Reliability & High Availability: Recommending multi-zone configurations and backup policies.",
          "isCorrect": true
        },
        {
          "id": "opt-3",
          "text": "Automatic physical replacement of client laptop batteries.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Guaranteed 100% discount on all third-party software licenses.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q013",
    "title": "Azure Service Health vs Status Page",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Azure Service Health provides a personalized view of the health of the specific Azure services and regions your resources are deployed in, including planned maintenance alerts.",
    "content": {
      "prompt": "What is the difference between the public Azure Status page and Azure Service Health?",
      "explanation": "Azure Service Health provides a personalized view of the health of the specific Azure services and regions your resources are deployed in, including planned maintenance alerts.",
      "options": [
        {
          "id": "opt-1",
          "text": "Azure Status shows global service availability worldwide, while Azure Service Health provides a personalized dashboard filtered to your specific subscriptions and deployed resources.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Azure Status requires a paid Enterprise Agreement, while Azure Service Health is only available for free trial accounts.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Azure Status monitors local client printers, while Azure Service Health monitors Linux VMs.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "There is no difference; both display identical public global RSS feeds.",
          "isCorrect": false
        }
      ]
    }
  }
];
  const azureBasicsD2 = [
  {
    "code": "AZ-BASICS-Q014",
    "title": "Azure Container Registry (ACR) Features",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Azure Container Registry (ACR) is a managed, private OCI container registry service based on open-source Docker Registry 2.0 to store and manage private container images.",
    "content": {
      "prompt": "Where should a development team store and manage private OCI/Docker container images securely within their Azure environment?",
      "explanation": "Azure Container Registry (ACR) is a managed, private OCI container registry service based on open-source Docker Registry 2.0 to store and manage private container images.",
      "options": [
        {
          "id": "opt-1",
          "text": "Azure Container Registry (ACR)",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Azure Blob Storage public container",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Azure Queue Storage",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Azure Key Vault Secret store",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q015",
    "title": "Azure Kubernetes Service (AKS) Architecture",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "In AKS, Microsoft manages the Kubernetes Control Plane (API server, etcd) at no extra charge, while the customer pays only for the agent worker node VMs that execute container pods.",
    "content": {
      "prompt": "Which statement accurately describes the responsibility split in Azure Kubernetes Service (AKS)?",
      "explanation": "In AKS, Microsoft manages the Kubernetes Control Plane (API server, etcd) at no extra charge, while the customer pays only for the agent worker node VMs that execute container pods.",
      "options": [
        {
          "id": "opt-1",
          "text": "Microsoft manages the Kubernetes Control Plane (API server and etcd), while the customer manages and pays for worker node pools.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "The customer must manually patch physical datacenter router firmware for AKS clusters.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "AKS does not support containerized workloads.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "The customer is responsible for maintaining etcd master database hardware.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q016",
    "title": "Azure Private Endpoints vs Service Endpoints",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Private Endpoints use a private IP address from your VNet to connect securely to Azure PaaS services via Azure Private Link, eliminating public IP exposure.",
    "content": {
      "prompt": "Which network feature assigns a private IP address from your Virtual Network subnet directly to an Azure PaaS service (such as Azure Storage or SQL Database)?",
      "explanation": "Private Endpoints use a private IP address from your VNet to connect securely to Azure PaaS services via Azure Private Link, eliminating public IP exposure.",
      "options": [
        {
          "id": "opt-1",
          "text": "Azure Private Endpoint",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Public IP Address",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "ExpressRoute FastPath",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Internet Gateway",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q017",
    "title": "Azure NAT Gateway Outbound Connectivity",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Azure NAT Gateway provides outbound-only internet connectivity for subnets inside a VNet, ensuring all outbound connections share static public IP addresses while blocking inbound connections.",
    "content": {
      "prompt": "You need to grant virtual machines in a private subnet outbound internet access to download software patches using a static public IP address, while strictly blocking all inbound connections. What service should you use?",
      "explanation": "Azure NAT Gateway provides outbound-only internet connectivity for subnets inside a VNet, ensuring all outbound connections share static public IP addresses while blocking inbound connections.",
      "options": [
        {
          "id": "opt-1",
          "text": "Azure NAT Gateway",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Azure Traffic Manager",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Point-to-Site VPN",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Azure Front Door",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q018",
    "title": "Application Gateway vs Azure Load Balancer",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Application Gateway is a Layer 7 (HTTP/HTTPS) load balancer that supports URL path-based routing and SSL termination, whereas Azure Load Balancer operates at Layer 4 (TCP/UDP).",
    "content": {
      "prompt": "Which Azure load balancing service operates at Layer 7 (Application Layer) and supports URL path-based routing (e.g. routing /images/* to one server pool and /video/* to another)?",
      "explanation": "Application Gateway is a Layer 7 (HTTP/HTTPS) load balancer that supports URL path-based routing and SSL termination, whereas Azure Load Balancer operates at Layer 4 (TCP/UDP).",
      "options": [
        {
          "id": "opt-1",
          "text": "Azure Application Gateway",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Azure Basic Load Balancer (Layer 4)",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Azure Traffic Manager (DNS)",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Virtual Network Peering",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q019",
    "title": "Azure Storage SAS Token Types",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Shared Access Signatures (SAS) grant limited time-bound access to storage resources with specified permissions (read/write) without sharing the account access key.",
    "content": {
      "prompt": "How can you grant a third-party vendor temporary, read-only access to a specific Azure Blob container for 4 hours without revealing your primary Storage Account Access Key?",
      "explanation": "Shared Access Signatures (SAS) grant limited time-bound access to storage resources with specified permissions (read/write) without sharing the account access key.",
      "options": [
        {
          "id": "opt-1",
          "text": "Generate a Shared Access Signature (SAS) token with Read permissions and a 4-hour expiration timestamp.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Send the vendor your primary Storage Account Connection String via email.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Make the storage account container completely public for 4 hours.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Create a new Azure Subscription for the vendor.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q020",
    "title": "App Service Deployment Slots",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "App Service Deployment Slots allow running staging environments with separate URLs. Swapping staging into production ensures zero-downtime deployments.",
    "content": {
      "prompt": "Which feature of Azure App Service enables web application teams to deploy new code into a staging environment and swap it into production with zero downtime?",
      "explanation": "App Service Deployment Slots allow running staging environments with separate URLs. Swapping staging into production ensures zero-downtime deployments.",
      "options": [
        {
          "id": "opt-1",
          "text": "Deployment Slots",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Resource Locks",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Scale Sets",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Availability Zones",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q021",
    "title": "Azure SQL Database Elastic Pools",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Elastic Pools allow multiple Azure SQL databases to share a single set of performance resources (eDTUs or vCores) to manage cost efficiently for unpredictable workloads.",
    "content": {
      "prompt": "A SaaS provider manages 100 individual Azure SQL databases for 100 different customers. Each database has unpredictable usage spikes at different times of day. How can the provider optimize database performance and cost?",
      "explanation": "Elastic Pools allow multiple Azure SQL databases to share a single set of performance resources (eDTUs or vCores) to manage cost efficiently for unpredictable workloads.",
      "options": [
        {
          "id": "opt-1",
          "text": "Provision an Azure SQL Elastic Pool to share a common pool of compute/DTU resources among all 100 databases.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Assign the maximum tier (Business Critical) to every database 24/7.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Convert all databases into CSV files stored on local USB drives.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Merge all 100 customer databases into a single unindexed table.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q022",
    "title": "Azure Dedicated Hosts for Compliance",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Azure Dedicated Host provides physical servers dedicated to your organization only, satisfying strict physical single-tenant isolation compliance requirements.",
    "content": {
      "prompt": "A financial enterprise requires that physical server hardware hosting its Virtual Machines is completely single-tenant and NOT shared with any other Azure customers. What service satisfies this compliance mandate?",
      "explanation": "Azure Dedicated Host provides physical servers dedicated to your organization only, satisfying strict physical single-tenant isolation compliance requirements.",
      "options": [
        {
          "id": "opt-1",
          "text": "Azure Dedicated Host",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Shared General Purpose VM",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "App Service Free Tier",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Azure Functions Consumption Plan",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q023",
    "title": "Azure Storage Immutable Storage (WORM)",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Immutable Blob Storage implements Write Once, Read Many (WORM) policies where data cannot be modified or deleted by any user, including subscription owners, during the retention period.",
    "content": {
      "prompt": "Which Azure Storage feature ensures financial compliance records are stored in a Write Once, Read Many (WORM) state where data cannot be overwritten or deleted by any user for a specified retention interval?",
      "explanation": "Immutable Blob Storage implements Write Once, Read Many (WORM) policies where data cannot be modified or deleted by any user, including subscription owners, during the retention period.",
      "options": [
        {
          "id": "opt-1",
          "text": "Azure Immutable Blob Storage with time-based retention policy",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Storage Account Shared Key",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Blob Soft Delete only",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Virtual Network NAT Gateway",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q024",
    "title": "Azure Functions Serverless Triggers",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Azure Functions is an event-driven serverless compute service that executes code automatically when triggered by events (e.g. Blob upload, Queue message, HTTP request).",
    "content": {
      "prompt": "You need to execute a small Python script to resize images automatically whenever a new image file is uploaded to an Azure Blob Storage container. Which event-driven serverless service should you use?",
      "explanation": "Azure Functions is an event-driven serverless compute service that executes code automatically when triggered by events (e.g. Blob upload, Queue message, HTTP request).",
      "options": [
        {
          "id": "opt-1",
          "text": "Azure Functions",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Azure Virtual Machine Scale Sets",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Azure ExpressRoute",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Azure Dedicated Host",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q025",
    "title": "Event Grid vs Event Hubs vs Service Bus",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Azure Event Hubs is a big data streaming platform capable of ingesting millions of telemetry events per second from IoT devices and logs.",
    "content": {
      "prompt": "An IoT application needs to stream and ingest 2 million telemetry events per second from connected vehicles into Azure for real-time analytics. Which service should you choose?",
      "explanation": "Azure Event Hubs is a big data streaming platform capable of ingesting millions of telemetry events per second from IoT devices and logs.",
      "options": [
        {
          "id": "opt-1",
          "text": "Azure Event Hubs",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Azure Service Bus Topics",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Azure Logic Apps",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Azure File Sync",
          "isCorrect": false
        }
      ]
    }
  }
];
  const azureBasicsD3 = [
  {
    "code": "AZ-BASICS-Q026",
    "title": "AzCopy Command-Line Tool Usage",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "AzCopy is a high-performance command-line utility designed for copying data to and from Azure Blob, File, and Table storage with optimized parallel throughput.",
    "content": {
      "prompt": "Which command-line utility provides optimal multi-threaded performance for transferring terabytes of data files into Azure Blob Storage over the network?",
      "explanation": "AzCopy is a high-performance command-line utility designed for copying data to and from Azure Blob, File, and Table storage with optimized parallel throughput.",
      "options": [
        {
          "id": "opt-1",
          "text": "AzCopy",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "robocopy /mir",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "ping -t",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "ipconfig /renew",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q027",
    "title": "Azure Migrate Discovery & Assessment",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Azure Migrate provides a centralized hub to discover, assess, and migrate on-premises VMware, Hyper-V, and physical servers to Azure.",
    "content": {
      "prompt": "An organization plans to migrate 200 physical and VMware servers to Azure. Which service provides an agentless appliance to discover on-premises servers, assess VM readiness, and estimate Azure costs?",
      "explanation": "Azure Migrate provides a centralized hub to discover, assess, and migrate on-premises VMware, Hyper-V, and physical servers to Azure.",
      "options": [
        {
          "id": "opt-1",
          "text": "Azure Migrate",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Azure Site Recovery (ASR)",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Azure Traffic Manager",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Azure Application Insights",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q028",
    "title": "Microsoft Sentinel SIEM Connectors",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Microsoft Sentinel uses built-in Data Connectors (CEF, Syslog, Microsoft 365, AWS) to ingest security logs from multi-cloud and on-premises sources.",
    "content": {
      "prompt": "How does Microsoft Sentinel ingest security events from third-party firewalls, Linux servers, and multi-cloud environments?",
      "explanation": "Microsoft Sentinel uses built-in Data Connectors (CEF, Syslog, Microsoft 365, AWS) to ingest security logs from multi-cloud and on-premises sources.",
      "options": [
        {
          "id": "opt-1",
          "text": "Via Data Connectors (such as Syslog, Common Event Format CEF, and API integrations).",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "By manually typing logs into Excel spreadsheets daily.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "By printing paper log files and scanning them into PDF files.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Using Windows Update KB patches only.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q029",
    "title": "Azure Private DNS Zones Resolution",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Azure Private DNS Zones provide name resolution for VMs within a VNet and across connected VNets without needing custom DNS server solutions.",
    "content": {
      "prompt": "What component is required to resolve internal custom domain names (such as app.internal.contoso.com) for Virtual Machines inside a Virtual Network without building custom DNS servers?",
      "explanation": "Azure Private DNS Zones provide name resolution for VMs within a VNet and across connected VNets without needing custom DNS server solutions.",
      "options": [
        {
          "id": "opt-1",
          "text": "Azure Private DNS Zone linked to the VNet",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Public DNS Registrar record",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Local client hosts file edit on every VM",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Azure ExpressRoute Circuit",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q030",
    "title": "Azure Monitor Action Groups Alerting",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Azure Monitor Action Groups define the notification preferences and automated actions (Email, SMS, Push, Webhook, Logic App, ITSM) triggered by alerts.",
    "content": {
      "prompt": "When an Azure Monitor alert fires, what component defines the list of receivers and automated actions (such as sending an SMS, triggering a Webhook, or invoking a Logic App)?",
      "explanation": "Azure Monitor Action Groups define the notification preferences and automated actions (Email, SMS, Push, Webhook, Logic App, ITSM) triggered by alerts.",
      "options": [
        {
          "id": "opt-1",
          "text": "Action Group",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Management Group",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Resource Group",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Availability Group",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q031",
    "title": "Azure Traffic Manager Routing Methods",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Azure Traffic Manager is a DNS-based traffic load balancer that uses routing methods such as Performance (lowest latency) to direct client requests to endpoints globally.",
    "content": {
      "prompt": "Which service uses DNS to route incoming user requests to the closest Azure datacenter endpoint based on lowest network latency?",
      "explanation": "Azure Traffic Manager is a DNS-based traffic load balancer that uses routing methods such as Performance (lowest latency) to direct client requests to endpoints globally.",
      "options": [
        {
          "id": "opt-1",
          "text": "Azure Traffic Manager with Performance routing method",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Azure Internal Load Balancer",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Azure NAT Gateway",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Azure Network Security Group",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q032",
    "title": "Azure Storage Managed Disks Snapshot vs Image",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "A Snapshot is a read-only point-in-time copy of a single disk. An Image is a generalized capture of both OS and data disks used to deploy new VM instances.",
    "content": {
      "prompt": "What is the difference between an Azure Managed Disk Snapshot and a Managed Image?",
      "explanation": "A Snapshot is a read-only point-in-time copy of a single disk. An Image is a generalized capture of both OS and data disks used to deploy new VM instances.",
      "options": [
        {
          "id": "opt-1",
          "text": "A Snapshot is a point-in-time backup copy of a single VHD disk, while an Image is a generalized template used to provision new VMs.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "A Snapshot requires an ExpressRoute connection, while an Image runs in client web browsers.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Snapshots can only store text files, while Images store MP3 audio.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "There is no difference; both terms are interchangeable.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q033",
    "title": "Azure Files AD DS SMB Authentication",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Azure Files supports identity-based authentication over SMB via Active Directory Domain Services (AD DS) or Entra ID Kerberos for hybrid file share access.",
    "content": {
      "prompt": "How can an enterprise migrate on-premises SMB file shares to Azure Files while preserving existing Active Directory (AD DS) user NTFS permission ACLs?",
      "explanation": "Azure Files supports identity-based authentication over SMB via Active Directory Domain Services (AD DS) or Entra ID Kerberos for hybrid file share access.",
      "options": [
        {
          "id": "opt-1",
          "text": "Enable Identity-based AD DS authentication for Azure Files SMB shares.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Convert all file shares into public HTTP websites.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Disable all user passwords on the local domain.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Hardcode storage account keys on every user desktop.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q034",
    "title": "Azure Load Balancer Health Probes",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Health Probes monitor the status of backend VM instances (via TCP or HTTP/HTTPS responses) to ensure traffic is only routed to healthy nodes.",
    "content": {
      "prompt": "How does Azure Load Balancer detect if a backend Virtual Machine instance has failed and stop sending network traffic to it?",
      "explanation": "Health Probes monitor the status of backend VM instances (via TCP or HTTP/HTTPS responses) to ensure traffic is only routed to healthy nodes.",
      "options": [
        {
          "id": "opt-1",
          "text": "By continuously monitoring backend instances using Health Probes (TCP/HTTP/HTTPS).",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "By checking client ping responses.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "By asking administrators to manually flag offline VMs in the portal.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "By inspecting Azure billing invoices.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q035",
    "title": "Azure Container Instances (ACI) Execution",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Azure Container Instances (ACI) provides the fastest and simplest way to run a single isolated container in Azure without managing virtual machines or cluster orchestrators.",
    "content": {
      "prompt": "Which Azure compute service is best suited for running a single isolated Docker container to completion in seconds without provisioning VMs or managing Kubernetes?",
      "explanation": "Azure Container Instances (ACI) provides the fastest and simplest way to run a single isolated container in Azure without managing virtual machines or cluster orchestrators.",
      "options": [
        {
          "id": "opt-1",
          "text": "Azure Container Instances (ACI)",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Azure Kubernetes Service (AKS)",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Azure Virtual Machine Scale Sets",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Azure Dedicated Host",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q036",
    "title": "Azure Firewall Premium Capabilities",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Azure Firewall Premium features Advanced Threat Protection including TLS Inspection, IDPS (Intrusion Detection and Prevention System), and Web Categories filtering.",
    "content": {
      "prompt": "Which tier of Azure Firewall introduces Intrusion Detection and Prevention System (IDPS) and TLS Inspection to analyze encrypted network traffic for malicious payloads?",
      "explanation": "Azure Firewall Premium features Advanced Threat Protection including TLS Inspection, IDPS (Intrusion Detection and Prevention System), and Web Categories filtering.",
      "options": [
        {
          "id": "opt-1",
          "text": "Azure Firewall Premium",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Azure Firewall Standard",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Azure Firewall Basic",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Network Security Group Basic",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q037",
    "title": "Azure Policy Remediation Tasks",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "DeployIfNotExists and Modify Azure Policies use Remediation Tasks to automatically bring existing non-compliant resources into compliance.",
    "content": {
      "prompt": "When an Azure Policy with a DeployIfNotExists effect is assigned, how can an administrator bring pre-existing non-compliant resources into compliance automatically?",
      "explanation": "DeployIfNotExists and Modify Azure Policies use Remediation Tasks to automatically bring existing non-compliant resources into compliance.",
      "options": [
        {
          "id": "opt-1",
          "text": "Create and trigger a Policy Remediation Task.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Manually delete the entire subscription.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Reboot all local client workstations.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Apply a ReadOnly Resource Lock.",
          "isCorrect": false
        }
      ]
    }
  }
];
  const azureBasicsD4 = [
  {
    "code": "AZ-BASICS-Q038",
    "title": "Azure Virtual WAN Global Interconnect",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Azure Virtual WAN brings networking, security, and routing functionalities together to provide a single operational hub-and-spoke interconnect for global branch offices.",
    "content": {
      "prompt": "An enterprise wants to interconnect 50 global branch offices, S2S VPNs, ExpressRoute circuits, and Azure VNets into a single automated networking hub. Which service should they choose?",
      "explanation": "Azure Virtual WAN brings networking, security, and routing functionalities together to provide a single operational hub-and-spoke interconnect for global branch offices.",
      "options": [
        {
          "id": "opt-1",
          "text": "Azure Virtual WAN",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Azure Traffic Manager",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Azure DNS Private Resolver",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Azure Content Delivery Network (CDN)",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q039",
    "title": "Azure Front Door WAF Edge Security",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Azure Front Door integrates Web Application Firewall (WAF) at the global edge to inspect and block SQL injection, cross-site scripting (XSS), and DDoS attacks before reaching web servers.",
    "content": {
      "prompt": "Where are Azure Front Door Web Application Firewall (WAF) rules evaluated to block malicious web attacks (such as SQL injection and XSS)?",
      "explanation": "Azure Front Door integrates Web Application Firewall (WAF) at the global edge to inspect and block SQL injection, cross-site scripting (XSS), and DDoS attacks before reaching web servers.",
      "options": [
        {
          "id": "opt-1",
          "text": "At Microsoft global edge PoP locations before traffic reaches your origin backend network.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Inside the OS of the target Virtual Machine.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "On client web browsers.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Inside the local SQL database engine.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q040",
    "title": "Azure Storage SSE 256-bit AES Encryption",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Azure Storage Service Encryption (SSE) automatically encrypts all data at rest using 256-bit AES encryption before persisting to disk, with zero cost or performance overhead.",
    "content": {
      "prompt": "How does Azure Storage protect data at rest across all storage accounts by default?",
      "explanation": "Azure Storage Service Encryption (SSE) automatically encrypts all data at rest using 256-bit AES encryption before persisting to disk, with zero cost or performance overhead.",
      "options": [
        {
          "id": "opt-1",
          "text": "All data written to Azure Storage is automatically encrypted at rest using 256-bit AES encryption.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Data is stored unencrypted unless a paid third-party tool is purchased.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Data is encrypted only if the storage account is deleted.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Encryption is only supported on Linux OS disks.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q041",
    "title": "Azure Logic Apps Low-Code Integration",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Azure Logic Apps provides a visual designer to automate workflows and integrate apps, data, services, and systems using over 500 pre-built connectors.",
    "content": {
      "prompt": "Which Azure PaaS service enables developers to build automated workflows visually using a low-code designer with hundreds of pre-built connectors (such as Salesforce, Office 365, and SQL)?",
      "explanation": "Azure Logic Apps provides a visual designer to automate workflows and integrate apps, data, services, and systems using over 500 pre-built connectors.",
      "options": [
        {
          "id": "opt-1",
          "text": "Azure Logic Apps",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Azure Virtual Machines",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Azure ExpressRoute",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Azure Bastion",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q042",
    "title": "Azure Confidential Computing Enclaves",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Azure Confidential Computing protects data in use by performing computations inside hardware-isolated Trusted Execution Environments (TEEs) or enclaves.",
    "content": {
      "prompt": "An organization requires protecting sensitive healthcare data while it is actively being processed in memory (data in use). Which technology achieves memory encryption inside hardware enclaves?",
      "explanation": "Azure Confidential Computing protects data in use by performing computations inside hardware-isolated Trusted Execution Environments (TEEs) or enclaves.",
      "options": [
        {
          "id": "opt-1",
          "text": "Azure Confidential Computing with hardware Trusted Execution Environments (TEEs)",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Standard TLS 1.3 transport encryption",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Azure Blob Cool Tier",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Public IP addresses",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q043",
    "title": "Azure Database for PostgreSQL Flexible Server",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "PostgreSQL Flexible Server offers zone-redundant high availability, granular compute scaling, and custom maintenance window controls.",
    "content": {
      "prompt": "Which Azure managed database deployment option for PostgreSQL offers zone-redundant high availability with automatic failover and user-controlled maintenance windows?",
      "explanation": "PostgreSQL Flexible Server offers zone-redundant high availability, granular compute scaling, and custom maintenance window controls.",
      "options": [
        {
          "id": "opt-1",
          "text": "Azure Database for PostgreSQL Flexible Server",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Azure SQL Basic Database",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Azure Table Storage",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Azure Cache for Redis Basic",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q044",
    "title": "Azure ExpressRoute FastPath Acceleration",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "ExpressRoute FastPath sends data path packets directly to virtual machines in the VNet, bypassing the virtual network gateway router to improve data transfer performance.",
    "content": {
      "prompt": "How does ExpressRoute FastPath improve data path performance for high-throughput enterprise workloads?",
      "explanation": "ExpressRoute FastPath sends data path packets directly to virtual machines in the VNet, bypassing the virtual network gateway router to improve data transfer performance.",
      "options": [
        {
          "id": "opt-1",
          "text": "It bypasses the virtual network gateway router and sends data packets directly to VMs in the VNet.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "It compresses files into ZIP archives automatically.",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "It routes traffic through public Wi-Fi hotspots.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "It converts all database queries into static text.",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q045",
    "title": "Azure Resource Graph Query Language (KQL)",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Azure Resource Graph uses Kusto Query Language (KQL) to query resource properties across thousands of subscriptions in seconds.",
    "content": {
      "prompt": "Which query language is used by Azure Resource Graph and Log Analytics to run high-performance queries across large Azure environments?",
      "explanation": "Azure Resource Graph uses Kusto Query Language (KQL) to query resource properties across thousands of subscriptions in seconds.",
      "options": [
        {
          "id": "opt-1",
          "text": "Kusto Query Language (KQL)",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "GraphQL",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Transact-SQL (T-SQL)",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "PL/SQL",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q046",
    "title": "Azure Automation State Configuration (DSC)",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Azure Automation State Configuration provides a PowerShell Desired State Configuration (DSC) pull server to maintain consistent OS configuration across Windows and Linux VMs.",
    "content": {
      "prompt": "Which management service provides a PowerShell Desired State Configuration (DSC) pull server to enforce consistent software configurations on Windows and Linux virtual machines?",
      "explanation": "Azure Automation State Configuration provides a PowerShell Desired State Configuration (DSC) pull server to maintain consistent OS configuration across Windows and Linux VMs.",
      "options": [
        {
          "id": "opt-1",
          "text": "Azure Automation State Configuration",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Azure ExpressRoute",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Azure Public IP",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Azure Key Vault",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q047",
    "title": "Azure Virtual Desktop Multi-Session Windows 11",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Azure Virtual Desktop (AVD) exclusive Windows 11/10 Enterprise Multi-session OS allows multiple concurrent users on a single VM to significantly lower licensing and infrastructure costs.",
    "content": {
      "prompt": "Which operating system edition is exclusive to Azure Virtual Desktop (AVD) and enables multiple concurrent interactive user sessions on a single Virtual Machine to optimize costs?",
      "explanation": "Azure Virtual Desktop (AVD) exclusive Windows 11/10 Enterprise Multi-session OS allows multiple concurrent users on a single VM to significantly lower licensing and infrastructure costs.",
      "options": [
        {
          "id": "opt-1",
          "text": "Windows 11 / 10 Enterprise Multi-session",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Windows Home Edition",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Windows MS-DOS 6.22",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Ubuntu Desktop 18.04",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q048",
    "title": "Azure Event Grid Reactive Event Routing",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Azure Event Grid uses a publish-subscribe model to route discrete events (e.g., resource created, blob uploaded) to event handlers instantly with high throughput.",
    "content": {
      "prompt": "Which service acts as a fully managed event routing service using a publish-subscribe model to reactively connect Azure event sources to event handlers (like Azure Functions or Logic Apps)?",
      "explanation": "Azure Event Grid uses a publish-subscribe model to route discrete events (e.g., resource created, blob uploaded) to event handlers instantly with high throughput.",
      "options": [
        {
          "id": "opt-1",
          "text": "Azure Event Grid",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Azure ExpressRoute",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Azure Traffic Manager",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Azure VPN Gateway",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q049",
    "title": "Azure DNS Alias Records Apex Resolution",
    "type": "SINGLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Azure DNS Alias Records allow pointing a zone apex domain (e.g., contoso.com) directly to Azure PaaS resources such as Traffic Manager profiles or Front Door endpoints.",
    "content": {
      "prompt": "How can an administrator configure a zone apex root domain (such as contoso.com without 'www') to point directly to an Azure Traffic Manager or Front Door profile?",
      "explanation": "Azure DNS Alias Records allow pointing a zone apex domain (e.g., contoso.com without 'www') to Azure PaaS resources such as Traffic Manager profiles or Front Door endpoints.",
      "options": [
        {
          "id": "opt-1",
          "text": "Use an Azure DNS Alias Record",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Create a TXT record with client IP address",
          "isCorrect": false
        },
        {
          "id": "opt-3",
          "text": "Apply a Resource Lock to the DNS zone",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Use a PTR reverse lookup record",
          "isCorrect": false
        }
      ]
    }
  },
  {
    "code": "AZ-BASICS-Q050",
    "title": "Azure Storage Private Endpoints vs Service Endpoints",
    "type": "MULTIPLE_CHOICE",
    "difficulty": "INTERMEDIATE",
    "points": 1.0,
    "explanation": "Service Endpoints secure PaaS endpoints to your VNet over the Azure backbone, while Private Endpoints assign a private IP directly into your subnet via Private Link.",
    "content": {
      "prompt": "Which of the following statements comparing Azure Service Endpoints and Private Endpoints are true? (Select TWO)",
      "explanation": "Service Endpoints secure PaaS endpoints to your VNet over the Azure backbone, while Private Endpoints assign a private IP directly into your subnet via Private Link.",
      "options": [
        {
          "id": "opt-1",
          "text": "Service Endpoints keep PaaS public IPs but restrict access to traffic originating from your VNet subnet.",
          "isCorrect": true
        },
        {
          "id": "opt-2",
          "text": "Private Endpoints project a private IP address directly inside your VNet subnet for private PaaS connectivity.",
          "isCorrect": true
        },
        {
          "id": "opt-3",
          "text": "Private Endpoints require turning off all firewalls in the world.",
          "isCorrect": false
        },
        {
          "id": "opt-4",
          "text": "Service Endpoints require physical fiber optic installation on user desks.",
          "isCorrect": false
        }
      ]
    }
  }
];

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

  // Update total questions config for Azure Basics exam
  await prisma.exam.update({
    where: { id: azureBasicsExam.id },
    data: { totalQuestionsConfig: 90 },
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
        isGloballyUnlocked: true,
      },
    });

    // Parent Room
    await prisma.examRoom.create({
      data: {
        roomCode: 'HALL-TERRAFORM',
        title: 'HashiCorp Terraform Complete Certification Hall',
        examId: parentTfExam.id,
        status: 'OPEN',
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
          isGloballyUnlocked: true,
        },
      });

      // 2. Create Sub-Exam Dedicated Room
      const roomCode = `HALL-TF-${domain_code}`;
      await prisma.examRoom.create({
        data: {
          roomCode,
          title: `HashiCorp Terraform ${domain_code} Proctored Hall`,
          examId: subExam.id,
          status: 'OPEN',
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
