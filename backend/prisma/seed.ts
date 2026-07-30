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

  // Clean existing tables in correct dependency order
  await prisma.auditLog.deleteMany();
  await prisma.roomSession.deleteMany();
  await prisma.studentExamAccess.deleteMany();
  await prisma.examAttempt.deleteMany();
  await prisma.examRoom.deleteMany();
  await prisma.sectionQuestion.deleteMany();
  await prisma.examSection.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.questionOnTag.deleteMany();
  await prisma.question.deleteMany();
  await prisma.category.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const creatorUser = await prisma.user.create({
    data: {
      email: 'sanjay@ntmsentra.onmicrosoft.com',
      name: 'Sanjay Admin',
      role: 'ADMINISTRATOR',
      isActive: true,
    },
  });

  await prisma.user.create({
    data: {
      email: 'candidate@ntms.com',
      name: 'Standard Candidate',
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
  // AZURE BASICS - 50 QUESTIONS (PPTX DERIVED)
  // ==========================================
  const azureBasicsD1 = [{"code": "AZ-BASICS-Q001", "title": "Physical vs Logical Architecture Comparison", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Physical architecture represents tangible assets (buildings, servers, network cabling, power), while logical architecture represents management boundaries (Tenants, Management Groups, Subscriptions, Resource Groups).", "content": {"prompt": "According to Azure architectural principles, how is physical architecture distinguished from logical architecture?", "explanation": "Physical architecture represents tangible assets (buildings, servers, network cabling, power), while logical architecture represents management boundaries (Tenants, Management Groups, Subscriptions, Resource Groups).", "options": [{"id": "opt-1", "text": "Physical architecture defines where Azure exists physically (datacenters, land, power), while logical architecture defines how resources are organized and managed (subscriptions, resource groups).", "isCorrect": true}, {"id": "opt-2", "text": "Physical architecture manages user passwords, while logical architecture connects optical fiber cables between cities.", "isCorrect": false}, {"id": "opt-3", "text": "Physical architecture refers exclusively to virtual machine operating systems, while logical architecture refers to network security groups.", "isCorrect": false}, {"id": "opt-4", "text": "Physical architecture is configured via JSON templates, while logical architecture cannot be modified once created.", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q002", "title": "Azure Region Definition", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "An Azure Region is a set of datacenters deployed within a latency-defined perimeter and connected through a dedicated regional low-latency network.", "content": {"prompt": "What is the official definition of an Azure Region?", "explanation": "An Azure Region is a set of datacenters deployed within a latency-defined perimeter and connected through a dedicated regional low-latency network.", "options": [{"id": "opt-1", "text": "A geographical area containing one or more datacenters connected through a dedicated, latency-defined network perimeter.", "isCorrect": true}, {"id": "opt-2", "text": "A single standalone physical server rack located in a customer data center.", "isCorrect": false}, {"id": "opt-3", "text": "A collection of Entra ID user accounts spanning an entire country.", "isCorrect": false}, {"id": "opt-4", "text": "A software container hosting multiple Docker microservices.", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q003", "title": "Key Benefits of Azure Regions", "type": "MULTIPLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Azure Regions provide local data residency compliance and reduced network latency by placing cloud resources near users.", "content": {"prompt": "What are the main benefits of deploying workloads across Azure Regions? (Select TWO)", "explanation": "Azure Regions provide local data residency compliance and reduced network latency by placing cloud resources near users.", "options": [{"id": "opt-1", "text": "Data Residency and Compliance: Enables organizations to keep data close to users while adhering to local privacy laws.", "isCorrect": true}, {"id": "opt-2", "text": "Reduced Network Latency: Allows positioning applications physically closer to end users to improve response times.", "isCorrect": true}, {"id": "opt-3", "text": "Elimination of all Azure subscription billing charges.", "isCorrect": false}, {"id": "opt-4", "text": "Automatic conversion of Windows VMs into Linux containers without configuration.", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q004", "title": "Availability Zone Definition", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Availability Zones are unique physical locations within an Azure region. Each zone is made up of one or more datacenters with independent power, cooling, and networking.", "content": {"prompt": "Which statement accurately describes an Azure Availability Zone?", "explanation": "Availability Zones are unique physical locations within an Azure region. Each zone is made up of one or more datacenters with independent power, cooling, and networking.", "options": [{"id": "opt-1", "text": "A physically separate datacenter location within an Azure region equipped with independent power, cooling, and networking infrastructure.", "isCorrect": true}, {"id": "opt-2", "text": "A virtual subnet within an Azure Virtual Network used for database isolation.", "isCorrect": false}, {"id": "opt-3", "text": "A backup copy of data saved automatically in a secondary country.", "isCorrect": false}, {"id": "opt-4", "text": "A security group rule that blocks incoming HTTP requests.", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q005", "title": "Matching Azure Physical Infrastructure Components", "type": "DRAG_AND_DROP", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Azure Physical Architecture builds from Datacenters -> Availability Zones -> Regions -> Regional Pairs -> Geographies.", "content": {"prompt": "Match each Azure physical infrastructure component to its correct architectural description.", "explanation": "Azure Physical Architecture builds from Datacenters -> Availability Zones -> Regions -> Regional Pairs -> Geographies.", "items": [{"id": "item-1", "label": "Azure Region"}, {"id": "item-2", "label": "Availability Zone"}, {"id": "item-3", "label": "Regional Pair"}, {"id": "item-4", "label": "Geography"}], "targets": [{"id": "target-1", "label": "Latency-defined perimeter containing datacenters connected via dedicated low-latency fiber network.", "correctItemId": "item-1"}, {"id": "target-2", "label": "Physically isolated datacenter facility within a region with independent power, cooling, and networking.", "correctItemId": "item-2"}, {"id": "target-3", "label": "Two regions in the same geography paired at least 300 miles apart for disaster recovery.", "correctItemId": "item-3"}, {"id": "target-4", "label": "A discrete market (typically containing two or more regions) that preserves data residency and compliance boundaries.", "correctItemId": "item-4"}]}}, {"code": "AZ-BASICS-Q006", "title": "Azure Regional Pairs Distance & DR", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Regional Pairs are separated by at least 300 miles (where possible) to protect against regional disasters, power grid failures, or natural events.", "content": {"prompt": "How far apart are paired Azure Regions typically located, and why?", "explanation": "Regional Pairs are separated by at least 300 miles (where possible) to protect against regional disasters, power grid failures, or natural events.", "options": [{"id": "opt-1", "text": "At least 300 miles apart, to prevent a single natural disaster or regional outage from affecting both paired regions simultaneously.", "isCorrect": true}, {"id": "opt-2", "text": "10 meters apart, to maximize cable connection speeds between racks.", "isCorrect": false}, {"id": "opt-3", "text": "Always in different continents, to enforce international border security policies.", "isCorrect": false}, {"id": "opt-4", "text": "Exactly 5 miles apart, to allow wireless microwave synchronization.", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q007", "title": "Azure Entra ID Tenant Scope", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "An Entra ID Tenant represents a dedicated, isolated instance of Entra ID that an organization receives when signing up for Microsoft cloud services.", "content": {"prompt": "What represents the top-level logical boundary for organization identity, users, and authentication in Azure?", "explanation": "An Entra ID Tenant represents a dedicated, isolated instance of Entra ID that an organization receives when signing up for Microsoft cloud services.", "options": [{"id": "opt-1", "text": "Azure Entra ID (Azure AD) Tenant", "isCorrect": true}, {"id": "opt-2", "text": "Resource Group", "isCorrect": false}, {"id": "opt-3", "text": "Virtual Network Subnet", "isCorrect": false}, {"id": "opt-4", "text": "Storage Account Container", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q008", "title": "Management Group Capabilities", "type": "MULTIPLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Management Groups allow hierarchical organization of subscriptions (up to 6 levels deep) to apply Azure Policy and RBAC rules uniformly.", "content": {"prompt": "Which of the following statements regarding Azure Management Groups are true? (Select TWO)", "explanation": "Management Groups allow hierarchical organization of subscriptions (up to 6 levels deep) to apply Azure Policy and RBAC rules uniformly.", "options": [{"id": "opt-1", "text": "Management Groups provide a scope of governance above subscriptions, allowing policy assignments to inherit down the tree.", "isCorrect": true}, {"id": "opt-2", "text": "Management Group hierarchies can support up to 6 levels of depth for enterprise organizational modeling.", "isCorrect": true}, {"id": "opt-3", "text": "Management Groups store virtual machine OS hard drive disk files directly.", "isCorrect": false}, {"id": "opt-4", "text": "Deleting a Management Group permanently erases all underlying Virtual Machines instantly without recovery.", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q009", "title": "Azure Subscriptions as Boundaries", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Subscriptions serve as a billing container (where usage charges are grouped) and a management security boundary for RBAC and quotas.", "content": {"prompt": "An Azure Subscription acts as a fundamental logical boundary for which two key functions?", "explanation": "Subscriptions serve as a billing container (where usage charges are grouped) and a management security boundary for RBAC and quotas.", "options": [{"id": "opt-1", "text": "Billing Boundary (generating separate invoices/costs) and Access Control / Security Boundary.", "isCorrect": true}, {"id": "opt-2", "text": "Hardware RAM allocation and CPU clock speed regulation.", "isCorrect": false}, {"id": "opt-3", "text": "Physical fiber optic cable routing and diesel generator fueling schedules.", "isCorrect": false}, {"id": "opt-4", "text": "Web browser cookie storage and DNS domain registration.", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q010", "title": "Matching Azure Logical Hierarchy Levels", "type": "DRAG_AND_DROP", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Azure Logical Hierarchy: Management Groups -> Subscriptions -> Resource Groups -> Resources.", "content": {"prompt": "Match each Azure logical hierarchy scope to its correct management function.", "explanation": "Azure Logical Hierarchy: Management Groups -> Subscriptions -> Resource Groups -> Resources.", "items": [{"id": "item-1", "label": "Management Group"}, {"id": "item-2", "label": "Subscription"}, {"id": "item-3", "label": "Resource Group"}, {"id": "item-4", "label": "Resource"}], "targets": [{"id": "target-1", "label": "Highest organizational scope used to manage governance and policy compliance across multiple subscriptions.", "correctItemId": "item-1"}, {"id": "target-2", "label": "Logical container providing billing separation and top-level administration boundary.", "correctItemId": "item-2"}, {"id": "target-3", "label": "Logical container that holds related Azure assets deployed, managed, and deleted as a lifecycle unit.", "correctItemId": "item-3"}, {"id": "target-4", "label": "Individual manageable item in Azure, such as a Virtual Machine, Storage Account, or SQL Database.", "correctItemId": "item-4"}]}}, {"code": "AZ-BASICS-Q011", "title": "Resource Group Rules & Properties", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "A resource belongs to exactly one Resource Group. Note that resources inside a Resource Group can reside in different Azure Regions than the group itself.", "content": {"prompt": "Which rule applies to Azure Resource Groups?", "explanation": "A resource belongs to exactly one Resource Group. Note that resources inside a Resource Group can reside in different Azure Regions than the group itself.", "options": [{"id": "opt-1", "text": "A resource can exist in only one Resource Group at a time.", "isCorrect": true}, {"id": "opt-2", "text": "Deleting a Resource Group retains all child Virtual Machines running indefinitely.", "isCorrect": false}, {"id": "opt-3", "text": "All resources in a Resource Group must be located in the exact same physical region as the Resource Group itself.", "isCorrect": false}, {"id": "opt-4", "text": "Resource Groups can be nested inside other Resource Groups up to 10 levels deep.", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q012", "title": "Azure Geographies & Data Residency", "type": "MULTIPLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Geographies contain two or more regions and ensure data residency, sovereignty, compliance, and latency boundaries are preserved.", "content": {"prompt": "What is the purpose of an Azure Geography? (Select TWO)", "explanation": "Geographies contain two or more regions and ensure data residency, sovereignty, compliance, and latency boundaries are preserved.", "options": [{"id": "opt-1", "text": "To define a discrete market containing two or more Azure regions that preserve data residency and compliance boundaries.", "isCorrect": true}, {"id": "opt-2", "text": "To ensure that geopolitical boundaries are respected for tax, legal, and compliance regulations.", "isCorrect": true}, {"id": "opt-3", "text": "To force all virtual machines in the world to reboot simultaneously.", "isCorrect": false}, {"id": "opt-4", "text": "To automatically translate English source code into 50 languages.", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q013", "title": "Global vs Regional Azure Services", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Azure Entra ID, Traffic Manager, Azure Front Door, and Azure DNS are Global services, whereas VMs, VNets, and Disks are Regional services.", "content": {"prompt": "Which of the following is considered a Global Azure Service (not tied to a specific Azure Region)?", "explanation": "Azure Entra ID, Traffic Manager, Azure Front Door, and Azure DNS are Global services, whereas VMs, VNets, and Disks are Regional services.", "options": [{"id": "opt-1", "text": "Azure Entra ID (Azure AD)", "isCorrect": true}, {"id": "opt-2", "text": "Azure Virtual Machine (IaaS VM)", "isCorrect": false}, {"id": "opt-3", "text": "Azure VNet Subnet", "isCorrect": false}, {"id": "opt-4", "text": "Azure Managed Disk", "isCorrect": false}]}}];
  const azureBasicsD2 = [{"code": "AZ-BASICS-Q014", "title": "Fault Domains vs Update Domains", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Fault Domains share common power source and network switch (protecting against physical hardware failure). Update Domains group VMs that can be rebooted together during planned Azure maintenance.", "content": {"prompt": "In an Azure Availability Set, what is the difference between a Fault Domain (FD) and an Update Domain (UD)?", "explanation": "Fault Domains share common power source and network switch (protecting against physical hardware failure). Update Domains group VMs that can be rebooted together during planned Azure maintenance.", "options": [{"id": "opt-1", "text": "Fault Domains protect against physical hardware failures (power & network switches), while Update Domains protect against planned maintenance reboots.", "isCorrect": true}, {"id": "opt-2", "text": "Fault Domains manage software updates, while Update Domains protect against fiber optic cable cuts.", "isCorrect": false}, {"id": "opt-3", "text": "Fault Domains are located in different countries, while Update Domains exist inside user laptops.", "isCorrect": false}, {"id": "opt-4", "text": "Fault Domains require paid licensing, while Update Domains are free for Linux VMs only.", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q015", "title": "Availability Set SLA Guarantee", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Azure offers a 99.95% SLA for VMs deployed across an Availability Set (protecting against single datacenter rack failures).", "content": {"prompt": "What is the Financially Backed Service Level Agreement (SLA) uptime guarantee for Virtual Machines configured inside an Azure Availability Set?", "explanation": "Azure offers a 99.95% SLA for VMs deployed across an Availability Set (protecting against single datacenter rack failures).", "options": [{"id": "opt-1", "text": "99.95%", "isCorrect": true}, {"id": "opt-2", "text": "99.99%", "isCorrect": false}, {"id": "opt-3", "text": "99.90%", "isCorrect": false}, {"id": "opt-4", "text": "100.00%", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q016", "title": "Availability Zone SLA & Requirements", "type": "MULTIPLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Multi-zone VM deployments provide Azure's highest single-region SLA of 99.99% by guaranteeing isolation across physical datacenter buildings.", "content": {"prompt": "Which of the following statements about Availability Zone SLAs and requirements are correct? (Select TWO)", "explanation": "Multi-zone VM deployments provide Azure's highest single-region SLA of 99.99% by guaranteeing isolation across physical datacenter buildings.", "options": [{"id": "opt-1", "text": "Deploying VMs across two or more Availability Zones in the same Azure region provides a 99.99% SLA uptime guarantee.", "isCorrect": true}, {"id": "opt-2", "text": "Availability Zones protect applications from entire datacenter facility failures (power, cooling, flooding).", "isCorrect": true}, {"id": "opt-3", "text": "Availability Zones require connecting all servers to a 4G cellular dongle.", "isCorrect": false}, {"id": "opt-4", "text": "Availability Zones are only supported in single-core A-series Virtual Machines.", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q017", "title": "Matching Resiliency Options to SLA", "type": "DRAG_AND_DROP", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "SLA Levels: Availability Zones = 99.99%, Availability Sets = 99.95%, Single Premium SSD VM = 99.90%.", "content": {"prompt": "Match each Azure Virtual Machine deployment model to its corresponding Service Level Agreement (SLA) uptime guarantee.", "explanation": "SLA Levels: Availability Zones = 99.99%, Availability Sets = 99.95%, Single Premium SSD VM = 99.90%.", "items": [{"id": "item-1", "label": "99.99% SLA"}, {"id": "item-2", "label": "99.95% SLA"}, {"id": "item-3", "label": "99.90% SLA"}, {"id": "item-4", "label": "Multi-Region DR Deployment"}], "targets": [{"id": "target-1", "label": "Virtual Machines deployed across two or more Availability Zones in the same region.", "correctItemId": "item-1"}, {"id": "target-2", "label": "Two or more Virtual Machines deployed in an Availability Set (across Fault and Update Domains).", "correctItemId": "item-2"}, {"id": "target-3", "label": "A Single Virtual Machine utilizing Premium SSD or Ultra Disk storage for all OS and data disks.", "correctItemId": "item-3"}, {"id": "target-4", "label": "Application deployment replicated across paired Azure Regions for complete regional failover.", "correctItemId": "item-4"}]}}, {"code": "AZ-BASICS-Q018", "title": "Planned Maintenance in Update Domains", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Sequential patching of Update Domains ensures that at least one instance of your application remains running during platform maintenance.", "content": {"prompt": "During planned Azure host platform updates, how does Azure use Update Domains (UD) to prevent application downtime?", "explanation": "Sequential patching of Update Domains ensures that at least one instance of your application remains running during platform maintenance.", "options": [{"id": "opt-1", "text": "Azure updates only one Update Domain at a time, allowing remaining VMs in other UDs to continue servicing traffic.", "isCorrect": true}, {"id": "opt-2", "text": "Azure reboots all servers in the datacenter simultaneously at midnight.", "isCorrect": false}, {"id": "opt-3", "text": "Azure automatically emails end users to log off for 4 hours.", "isCorrect": false}, {"id": "opt-4", "text": "Azure converts all Virtual Machines into static HTML files.", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q019", "title": "Hardware Failures in Fault Domains", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Fault Domains separate VMs across different physical hardware racks, power units, and network switches.", "content": {"prompt": "If a top-of-rack network switch or power distribution unit (PDU) fails in an Azure datacenter, how does a Fault Domain (FD) configuration protect your workload?", "explanation": "Fault Domains separate VMs across different physical hardware racks, power units, and network switches.", "options": [{"id": "opt-1", "text": "VMs in the Availability Set are placed on separate hardware racks with redundant power and switches, ensuring unaffected VMs keep running.", "isCorrect": true}, {"id": "opt-2", "text": "The failed rack automatically downloads new RAM from the internet.", "isCorrect": false}, {"id": "opt-3", "text": "The Virtual Machines are instantly converted into Azure Functions.", "isCorrect": false}, {"id": "opt-4", "text": "The Azure subscription is transferred to a different billing account.", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q020", "title": "Resource Group Deletion & Lifecycle Rules", "type": "MULTIPLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Deleting a Resource Group deletes all child resources within it. This makes Resource Groups ideal lifecycle containers for environment management.", "content": {"prompt": "Which of the following actions happen when an administrator deletes an Azure Resource Group? (Select TWO)", "explanation": "Deleting a Resource Group deletes all child resources within it. This makes Resource Groups ideal lifecycle containers for environment management.", "options": [{"id": "opt-1", "text": "All child resources contained within the Resource Group are automatically deleted as part of the lifecycle cleanup.", "isCorrect": true}, {"id": "opt-2", "text": "Azure issues asynchronous REST API delete calls to remove all resources in parallel or proper dependency sequence.", "isCorrect": true}, {"id": "opt-3", "text": "The customer billing credit card is automatically charged  penalty.", "isCorrect": false}, {"id": "opt-4", "text": "The entire Entra ID Tenant directory is permanently erased.", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q021", "title": "Azure Resource Locks (CanNotDelete vs ReadOnly)", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "CanNotDelete lock allows authorized users to read and modify a resource, but prevents them from deleting it. ReadOnly lock prevents modifications as well.", "content": {"prompt": "An organization wants to prevent accidental deletion of a critical production database while still allowing authorized applications to read and write data. Which Azure Resource Lock should be applied?", "explanation": "CanNotDelete lock allows authorized users to read and modify a resource, but prevents them from deleting it. ReadOnly lock prevents modifications as well.", "options": [{"id": "opt-1", "text": "CanNotDelete (Delete Lock)", "isCorrect": true}, {"id": "opt-2", "text": "ReadOnly (Read-Only Lock)", "isCorrect": false}, {"id": "opt-3", "text": "System Lock", "isCorrect": false}, {"id": "opt-4", "text": "Subscription Lock", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q022", "title": "Matching Governance Mechanisms", "type": "DRAG_AND_DROP", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Azure Policy = Compliance rules; RBAC = Access control; Resource Locks = Accident protection; Blueprints = Deployment packages.", "content": {"prompt": "Match each Azure governance mechanism to its primary purpose.", "explanation": "Azure Policy = Compliance rules; RBAC = Access control; Resource Locks = Accident protection; Blueprints = Deployment packages.", "items": [{"id": "item-1", "label": "Azure Policy"}, {"id": "item-2", "label": "Azure RBAC"}, {"id": "item-3", "label": "Resource Lock (CanNotDelete)"}, {"id": "item-4", "label": "Azure Blueprints / Policy Initiatives"}], "targets": [{"id": "target-1", "label": "Enforces operational standards and compliance rules (e.g., restricting deployment regions or SKU sizes).", "correctItemId": "item-1"}, {"id": "target-2", "label": "Grants fine-grained user identity permissions (e.g., Owner, Contributor, Reader) based on job roles.", "correctItemId": "item-2"}, {"id": "target-3", "label": "Prevents accidental deletion of critical production infrastructure by administrators.", "correctItemId": "item-3"}, {"id": "target-4", "label": "Packages policies, RBAC roles, and ARM templates into repeatable subscription deployment standards.", "correctItemId": "item-4"}]}}, {"code": "AZ-BASICS-Q023", "title": "Cross-Region Replication with Regional Pairs", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "In the event of a broad multi-region outage, recovery of one region from every pair is prioritized to ensure at least one region is restored rapidly.", "content": {"prompt": "How do Azure Regional Pairs support business continuity during a widespread major disaster?", "explanation": "In the event of a broad multi-region outage, recovery of one region from every pair is prioritized to ensure at least one region is restored rapidly.", "options": [{"id": "opt-1", "text": "Azure prioritizes recovering at least one region out of every regional pair first to restore core services quickly.", "isCorrect": true}, {"id": "opt-2", "text": "Azure automatically moves physical server racks onto cargo trucks to relocate them.", "isCorrect": false}, {"id": "opt-3", "text": "Azure sends printed paper backups of all SQL tables via express postal mail.", "isCorrect": false}, {"id": "opt-4", "text": "Azure forces all subscriptions to downgrade to free trial mode.", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q024", "title": "Factors Influencing Region Selection", "type": "MULTIPLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Service availability, compliance/data sovereignty, latency to users, and regional pricing vary across Azure regions and must be evaluated.", "content": {"prompt": "Which key factors should an architect evaluate when selecting an Azure Region for deployment? (Select TWO)", "explanation": "Service availability, compliance/data sovereignty, latency to users, and regional pricing vary across Azure regions and must be evaluated.", "options": [{"id": "opt-1", "text": "Feature Availability: Ensuring required Azure services (e.g. specific VM series or AI services) are available in that region.", "isCorrect": true}, {"id": "opt-2", "text": "Data Sovereignty & Legal Compliance: Meeting local government regulatory requirements for data storage.", "isCorrect": true}, {"id": "opt-3", "text": "Color of the physical datacenter building exterior walls.", "isCorrect": false}, {"id": "opt-4", "text": "Number of employee parking spaces available at the local Microsoft office.", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q025", "title": "Azure Sovereign Clouds", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Azure Sovereign Clouds (e.g. Azure US Government, Azure China 21Vianet) operate independently with dedicated isolated networks and compliance validation.", "content": {"prompt": "What are Azure Sovereign Clouds (such as Azure Government and Azure China)?", "explanation": "Azure Sovereign Clouds (e.g. Azure US Government, Azure China 21Vianet) operate independently with dedicated isolated networks and compliance validation.", "options": [{"id": "opt-1", "text": "Physically and logically isolated instances of Azure designed to meet strict government security, compliance, and regulatory requirements.", "isCorrect": true}, {"id": "opt-2", "text": "Public Wi-Fi networks available at international airports.", "isCorrect": false}, {"id": "opt-3", "text": "Free trial Azure subscriptions provided to university students.", "isCorrect": false}, {"id": "opt-4", "text": "Gaming servers dedicated exclusively to Xbox Live multiplayer games.", "isCorrect": false}]}}];
  const azureBasicsD3 = [{"code": "AZ-BASICS-Q026", "title": "Role of Azure Resource Manager (ARM)", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "ARM is the management layer of Azure. Every request from the Azure Portal, CLI, PowerShell, or SDKs passes through ARM to be authenticated and executed.", "content": {"prompt": "What is Azure Resource Manager (ARM)?", "explanation": "ARM is the management layer of Azure. Every request from the Azure Portal, CLI, PowerShell, or SDKs passes through ARM to be authenticated and executed.", "options": [{"id": "opt-1", "text": "The central management and deployment service in Azure that provides a consistent management layer for creating, updating, and deleting resources via REST APIs.", "isCorrect": true}, {"id": "opt-2", "text": "A physical handheld device used by datacenter technicians to repair servers.", "isCorrect": false}, {"id": "opt-3", "text": "A desktop application installed on client PCs to play video games.", "isCorrect": false}, {"id": "opt-4", "text": "A third-party web browser for browsing external websites.", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q027", "title": "Behind the Scenes REST API Flow", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "The Azure Portal is a web GUI client. Behind the scenes, all Portal actions send REST API requests to ARM endpoints.", "content": {"prompt": "When an administrator clicks Create in the Azure Portal to deploy a Virtual Machine, what occurs behind the scenes?", "explanation": "The Azure Portal is a web GUI client. Behind the scenes, all Portal actions send REST API requests to ARM endpoints.", "options": [{"id": "opt-1", "text": "The Azure Portal converts the UI inputs into an HTTPS REST API request sent directly to Azure Resource Manager (ARM).", "isCorrect": true}, {"id": "opt-2", "text": "An email is automatically sent to Microsoft support staff to manually assemble a physical server.", "isCorrect": false}, {"id": "opt-3", "text": "The browser compiles C# source code and uploads a ZIP file to OneDrive.", "isCorrect": false}, {"id": "opt-4", "text": "The portal reboots the local client laptop to apply new Windows registry keys.", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q028", "title": "Characteristics of Azure Portal", "type": "MULTIPLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "The Azure Portal provides a web-based GUI for building, managing, and monitoring cloud infrastructure across devices.", "content": {"prompt": "Which of the following are key characteristics of the Azure Portal? (Select TWO)", "explanation": "The Azure Portal provides a web-based GUI for building, managing, and monitoring cloud infrastructure across devices.", "options": [{"id": "opt-1", "text": "Web-based graphical management console accessible from any modern browser.", "isCorrect": true}, {"id": "opt-2", "text": "Customizable dashboards allowing administrators to monitor and visually manage resources.", "isCorrect": true}, {"id": "opt-3", "text": "Requires installing a 50 GB local software package before opening.", "isCorrect": false}, {"id": "opt-4", "text": "Can only be accessed from computers connected directly to Microsoft headquarters Wi-Fi.", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q029", "title": "Azure PowerShell Syntax & Features", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "PowerShell cmdlets always follow the standard Verb-Noun format, prefixed with Az for Azure cmdlets (e.g., Get-AzVM, New-AzResourceGroup).", "content": {"prompt": "What naming convention does Azure PowerShell use for its cmdlets?", "explanation": "PowerShell cmdlets always follow the standard Verb-Noun format, prefixed with Az for Azure cmdlets (e.g., Get-AzVM, New-AzResourceGroup).", "options": [{"id": "opt-1", "text": "Verb-Noun syntax (e.g. New-AzVM, Get-AzResourceGroup, Remove-AzStorageAccount).", "isCorrect": true}, {"id": "opt-2", "text": "Python snake_case functions (e.g. create_azure_vm).", "isCorrect": false}, {"id": "opt-3", "text": "HTML tags (e.g. <create-vm>).", "isCorrect": false}, {"id": "opt-4", "text": "SQL query strings (e.g. SELECT * FROM AzureVMs).", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q030", "title": "Azure CLI Structure & Cross-Platform Support", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Azure CLI commands follow a clear command hierarchy: az + group + subgroup + action (e.g., az vm create).", "content": {"prompt": "How is an Azure CLI command structured?", "explanation": "Azure CLI commands follow a clear command hierarchy: az + group + subgroup + action (e.g., az vm create).", "options": [{"id": "opt-1", "text": "az <group> <subgroup> <action> (e.g., az vm create, az group list).", "isCorrect": true}, {"id": "opt-2", "text": "git commit -m create vm.", "isCorrect": false}, {"id": "opt-3", "text": "docker run -d azure-vm.", "isCorrect": false}, {"id": "opt-4", "text": "npm install azure-vm-latest.", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q031", "title": "Matching Azure Management Tools", "type": "DRAG_AND_DROP", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Management Tools: Portal (GUI), CLI (az commands), PowerShell (Verb-Noun cmdlets), ARM/Bicep (IaC files).", "content": {"prompt": "Match each Azure management tool to its core description and command structure.", "explanation": "Management Tools: Portal (GUI), CLI (az commands), PowerShell (Verb-Noun cmdlets), ARM/Bicep (IaC files).", "items": [{"id": "item-1", "label": "Azure Portal"}, {"id": "item-2", "label": "Azure CLI"}, {"id": "item-3", "label": "Azure PowerShell"}, {"id": "item-4", "label": "ARM Templates / Bicep"}], "targets": [{"id": "target-1", "label": "Web-based graphical user interface for visual resource creation and monitoring.", "correctItemId": "item-1"}, {"id": "target-2", "label": "Cross-platform command-line tool using az <group> <action> syntax (Bash, zsh, cmd).", "correctItemId": "item-2"}, {"id": "target-3", "label": "Task automation framework using Verb-Noun cmdlets (e.g., New-AzResourceGroup).", "correctItemId": "item-3"}, {"id": "target-4", "label": "Declarative Infrastructure as Code (IaC) files defining desired state deployments.", "correctItemId": "item-4"}]}}, {"code": "AZ-BASICS-Q032", "title": "Benefits of Infrastructure as Code (IaC)", "type": "MULTIPLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "IaC provides repeatable, automated, consistent deployments with version control support.", "content": {"prompt": "What are the main advantages of deploying Azure resources using Infrastructure as Code (IaC)? (Select TWO)", "explanation": "IaC provides repeatable, automated, consistent deployments with version control support.", "options": [{"id": "opt-1", "text": "Idempotency and Consistency: Ensures environments (dev, test, prod) are deployed identically without manual configuration drift.", "isCorrect": true}, {"id": "opt-2", "text": "Automation and Speed: Allows rapid, repeatable deployments integrated into CI/CD DevOps pipelines.", "isCorrect": true}, {"id": "opt-3", "text": "Automatically increases internet connection speed at home by 10x.", "isCorrect": false}, {"id": "opt-4", "text": "Guarantees that no passwords or security keys are needed in cloud computing.", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q033", "title": "ARM Templates Data Format", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Native ARM templates are written in JSON format containing schema, parameters, variables, resources, and outputs.", "content": {"prompt": "What data format is used to write native Azure Resource Manager (ARM) templates?", "explanation": "Native ARM templates are written in JSON format containing schema, parameters, variables, resources, and outputs.", "options": [{"id": "opt-1", "text": "JSON (JavaScript Object Notation)", "isCorrect": true}, {"id": "opt-2", "text": "XML (Extensible Markup Language)", "isCorrect": false}, {"id": "opt-3", "text": "CSV (Comma Separated Values)", "isCorrect": false}, {"id": "opt-4", "text": "INI file", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q034", "title": "Bicep Language Purpose", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Bicep is a transparent abstraction over ARM JSON that simplifies authoring experience with cleaner syntax and type safety.", "content": {"prompt": "What is Microsoft Bicep in relation to Azure ARM templates?", "explanation": "Bicep is a transparent abstraction over ARM JSON that simplifies authoring experience with cleaner syntax and type safety.", "options": [{"id": "opt-1", "text": "A domain-specific language (DSL) that uses cleaner, concise syntax to write Azure IaC, compiling directly into ARM JSON templates.", "isCorrect": true}, {"id": "opt-2", "text": "An antivirus program designed for Windows 11 PCs.", "isCorrect": false}, {"id": "opt-3", "text": "A database query language for querying MySQL tables.", "isCorrect": false}, {"id": "opt-4", "text": "A video editing software included in Microsoft Office.", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q035", "title": "Matching Azure CLI Command Groups", "type": "DRAG_AND_DROP", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "CLI command groups align with Azure resource types: az vm, az group, az network, az storage.", "content": {"prompt": "Match each Azure CLI command group prefix to the target resource category it manages.", "explanation": "CLI command groups align with Azure resource types: az vm, az group, az network, az storage.", "items": [{"id": "item-1", "label": "az vm"}, {"id": "item-2", "label": "az group"}, {"id": "item-3", "label": "az network vnet"}, {"id": "item-4", "label": "az storage account"}], "targets": [{"id": "target-1", "label": "Manage Azure Virtual Machine compute instances.", "correctItemId": "item-1"}, {"id": "target-2", "label": "Manage Azure Resource Groups containers.", "correctItemId": "item-2"}, {"id": "target-3", "label": "Manage Virtual Networks, subnets, and IP addressing.", "correctItemId": "item-3"}, {"id": "target-4", "label": "Manage Blob, File, Queue, and Table storage accounts.", "correctItemId": "item-4"}]}}, {"code": "AZ-BASICS-Q036", "title": "Azure Cloud Shell Capabilities", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Azure Cloud Shell is an authenticated, browser-accessible shell for managing Azure resources using either Bash or PowerShell.", "content": {"prompt": "What is Azure Cloud Shell?", "explanation": "Azure Cloud Shell is an authenticated, browser-accessible shell for managing Azure resources using either Bash or PowerShell.", "options": [{"id": "opt-1", "text": "An interactive, browser-accessible command-line shell pre-configured with Azure CLI, Azure PowerShell, and common developer tools.", "isCorrect": true}, {"id": "opt-2", "text": "A physical laptop handed out free at Microsoft stores.", "isCorrect": false}, {"id": "opt-3", "text": "A background virus scanner running on Azure datacenters.", "isCorrect": false}, {"id": "opt-4", "text": "A paid third-party plugin for Microsoft Word.", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q037", "title": "Azure CLI Authentication Methods", "type": "MULTIPLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Azure CLI supports interactive login (az login) for users, as well as Service Principal and Managed Identity logins for automated automation scripts.", "content": {"prompt": "Which of the following authentication methods can be used to log into Azure CLI? (Select TWO)", "explanation": "Azure CLI supports interactive login (az login) for users, as well as Service Principal and Managed Identity logins for automated automation scripts.", "options": [{"id": "opt-1", "text": "Interactive user login via browser using az login.", "isCorrect": true}, {"id": "opt-2", "text": "Automated non-interactive login using Service Principals or Managed Identity in CI/CD pipelines.", "isCorrect": true}, {"id": "opt-3", "text": "Scanning a paper barcode on a physical ID card into a webcam.", "isCorrect": false}, {"id": "opt-4", "text": "Sending a text message to a landline phone number.", "isCorrect": false}]}}];
  const azureBasicsD4 = [{"code": "AZ-BASICS-Q038", "title": "Burstable CPU B-Series VM Family", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "B-Series VMs accumulate CPU credits during baseline usage and burst up to 100% vCPU during high traffic periods.", "content": {"prompt": "Which Azure Virtual Machine family uses a CPU credit model that accumulates credits during low usage and bursts CPU performance to 100% during traffic spikes, making it ideal for web servers and development environments?", "explanation": "B-Series VMs accumulate CPU credits during baseline usage and burst up to 100% vCPU during high traffic periods.", "options": [{"id": "opt-1", "text": "B-Series (Burstable CPU)", "isCorrect": true}, {"id": "opt-2", "text": "M-Series (Memory Optimized)", "isCorrect": false}, {"id": "opt-3", "text": "F-Series (Compute Optimized)", "isCorrect": false}, {"id": "opt-4", "text": "H-Series (High Performance Computing)", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q039", "title": "General Purpose D-Series VM Family", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "D-Series offers balanced vCPU and RAM configuration for general-purpose server workloads.", "content": {"prompt": "Which Azure VM series provides a balanced CPU-to-memory ratio suitable for enterprise applications, relational databases, and medium-traffic web servers?", "explanation": "D-Series offers balanced vCPU and RAM configuration for general-purpose server workloads.", "options": [{"id": "opt-1", "text": "D-Series (General Purpose)", "isCorrect": true}, {"id": "opt-2", "text": "N-Series (GPU Enabled)", "isCorrect": false}, {"id": "opt-3", "text": "L-Series (Storage Optimized)", "isCorrect": false}, {"id": "opt-4", "text": "A-Series (Entry Level Basic)", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q040", "title": "Memory Optimized E-Series & M-Series VM Families", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "E-Series and M-Series VMs feature high memory-to-core ratios designed for heavy in-memory database engines like SAP HANA and enterprise SQL Server.", "content": {"prompt": "You are deploying a large in-memory SAP HANA or SQL Server database requiring up to 4 TB of RAM. Which VM series family should you select?", "explanation": "E-Series and M-Series VMs feature high memory-to-core ratios designed for heavy in-memory database engines like SAP HANA and enterprise SQL Server.", "options": [{"id": "opt-1", "text": "E-Series or M-Series (Memory Optimized)", "isCorrect": true}, {"id": "opt-2", "text": "F-Series (Compute Optimized)", "isCorrect": false}, {"id": "opt-3", "text": "B-Series (Burstable)", "isCorrect": false}, {"id": "opt-4", "text": "N-Series (GPU Enabled)", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q041", "title": "Compute Optimized F-Series VM Family", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "F-Series VMs have high CPU-to-memory ratios and high clock speed cores for CPU-bound computations.", "content": {"prompt": "Which Azure VM series features a high CPU-to-memory ratio with fast processor clock speeds, making it ideal for batch processing, web analytics, and gaming servers?", "explanation": "F-Series VMs have high CPU-to-memory ratios and high clock speed cores for CPU-bound computations.", "options": [{"id": "opt-1", "text": "F-Series (Compute Optimized)", "isCorrect": true}, {"id": "opt-2", "text": "L-Series (Storage Optimized)", "isCorrect": false}, {"id": "opt-3", "text": "E-Series (Memory Optimized)", "isCorrect": false}, {"id": "opt-4", "text": "B-Series (Burstable)", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q042", "title": "Storage Optimized L-Series VM Family", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Lsv2/Lsv3 Series VMs provide high-throughput, low latency, direct-mapped local NVMe storage.", "content": {"prompt": "Which Azure VM family includes direct-attached local NVMe storage providing high disk throughput and low latency for NoSQL databases (e.g. Cassandra, MongoDB) and data warehousing?", "explanation": "Lsv2/Lsv3 Series VMs provide high-throughput, low latency, direct-mapped local NVMe storage.", "options": [{"id": "opt-1", "text": "L-Series (Storage Optimized)", "isCorrect": true}, {"id": "opt-2", "text": "D-Series (General Purpose)", "isCorrect": false}, {"id": "opt-3", "text": "N-Series (GPU Enabled)", "isCorrect": false}, {"id": "opt-4", "text": "B-Series (Burstable)", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q043", "title": "High Performance Computing H-Series VM Family", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "H-Series VMs feature RDMA InfiniBand networking specifically engineered for complex parallel scientific and HPC simulations.", "content": {"prompt": "Which Azure VM series features InfiniBand networking for ultra-low latency inter-node communication required by High-Performance Computing (HPC) workloads, scientific simulations, and weather modeling?", "explanation": "H-Series VMs feature RDMA InfiniBand networking specifically engineered for complex parallel scientific and HPC simulations.", "options": [{"id": "opt-1", "text": "H-Series (HPC High Performance Computing)", "isCorrect": true}, {"id": "opt-2", "text": "A-Series (Basic Entry)", "isCorrect": false}, {"id": "opt-3", "text": "B-Series (Burstable)", "isCorrect": false}, {"id": "opt-4", "text": "D-Series (General Purpose)", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q044", "title": "GPU Enabled N-Series VM Family", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "N-Series (NC, ND, NV) VMs are equipped with NVIDIA GPUs for AI/ML model training, CAD rendering, and graphic acceleration.", "content": {"prompt": "Which Azure VM family provides NVIDIA GPU acceleration for deep learning, AI model training, graphic rendering, and video editing?", "explanation": "N-Series (NC, ND, NV) VMs are equipped with NVIDIA GPUs for AI/ML model training, CAD rendering, and graphic acceleration.", "options": [{"id": "opt-1", "text": "N-Series (GPU Enabled)", "isCorrect": true}, {"id": "opt-2", "text": "E-Series (Memory Optimized)", "isCorrect": false}, {"id": "opt-3", "text": "L-Series (Storage Optimized)", "isCorrect": false}, {"id": "opt-4", "text": "D-Series (General Purpose)", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q045", "title": "Matching Azure VM Series to Workload Requirement", "type": "DRAG_AND_DROP", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "VM Series: B = Burstable, E = Memory, F = Compute, H = HPC.", "content": {"prompt": "Match each Azure Virtual Machine family series to its intended workload optimization target.", "explanation": "VM Series: B = Burstable, E = Memory, F = Compute, H = HPC.", "items": [{"id": "item-1", "label": "B-Series"}, {"id": "item-2", "label": "E-Series"}, {"id": "item-3", "label": "F-Series"}, {"id": "item-4", "label": "H-Series"}], "targets": [{"id": "target-1", "label": "Burstable CPU workload (e.g. low-traffic web servers, dev/test environments).", "correctItemId": "item-1"}, {"id": "target-2", "label": "Memory-optimized workload (e.g. SAP HANA, heavy relational SQL databases).", "correctItemId": "item-2"}, {"id": "target-3", "label": "Compute-optimized workload (e.g. high-speed batch processing, web analytics).", "correctItemId": "item-3"}, {"id": "target-4", "label": "High-performance computing workload (e.g. InfiniBand scientific simulations).", "correctItemId": "item-4"}]}}, {"code": "AZ-BASICS-Q046", "title": "Components Created During VM Provisioning", "type": "MULTIPLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Deploying an Azure VM provisions underlying resources: Virtual Machine, Network Interface (NIC), OS Disk, Network Security Group (NSG), and optional Public IP.", "content": {"prompt": "When creating a Virtual Machine in Azure, which additional child resources are typically provisioned automatically alongside the VM compute instance? (Select TWO)", "explanation": "Deploying an Azure VM provisions underlying resources: Virtual Machine, Network Interface (NIC), OS Disk, Network Security Group (NSG), and optional Public IP.", "options": [{"id": "opt-1", "text": "Network Interface (NIC) connected to a Virtual Network Subnet.", "isCorrect": true}, {"id": "opt-2", "text": "Managed OS Disk (Premium SSD, Standard SSD, or HDD) storing the operating system.", "isCorrect": true}, {"id": "opt-3", "text": "A physical optical fiber cable delivered to the customer office.", "isCorrect": false}, {"id": "opt-4", "text": "An Azure Synapse Analytics dedicated SQL pool.", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q047", "title": "Managed Disks vs Unmanaged Disks", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Managed Disks are managed by Azure behind the scenes, eliminating storage account limits and ensuring disks for Availability Set VMs are placed on distinct storage Fault Domains.", "content": {"prompt": "What is the primary benefit of using Azure Managed Disks over legacy Unmanaged Disks?", "explanation": "Managed Disks are managed by Azure behind the scenes, eliminating storage account limits and ensuring disks for Availability Set VMs are placed on distinct storage Fault Domains.", "options": [{"id": "opt-1", "text": "Azure automatically handles storage account creation, scaling, and fault domain alignment without manual VHD file management.", "isCorrect": true}, {"id": "opt-2", "text": "Managed Disks eliminate the need to pay for any cloud storage usage.", "isCorrect": false}, {"id": "opt-3", "text": "Managed Disks convert all Windows VMs into Mac computers.", "isCorrect": false}, {"id": "opt-4", "text": "Managed Disks bypass all password requirements.", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q048", "title": "Matching Azure Disk Storage Tiers", "type": "DRAG_AND_DROP", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Disk Tiers: Ultra Disk (highest IOPS/sub-ms) -> Premium SSD (production) -> Standard SSD (dev/test) -> Standard HDD (backups).", "content": {"prompt": "Match each Azure Managed Disk storage tier to its performance and workload profile.", "explanation": "Disk Tiers: Ultra Disk (highest IOPS/sub-ms) -> Premium SSD (production) -> Standard SSD (dev/test) -> Standard HDD (backups).", "items": [{"id": "item-1", "label": "Ultra Disk"}, {"id": "item-2", "label": "Premium SSD"}, {"id": "item-3", "label": "Standard SSD"}, {"id": "item-4", "label": "Standard HDD"}], "targets": [{"id": "target-1", "label": "Top-tier sub-millisecond latency storage for mission-critical I/O intensive databases (up to 160,000 IOPS).", "correctItemId": "item-1"}, {"id": "target-2", "label": "High-performance SSD storage for production workloads and SQL databases requiring single-digit ms latency.", "correctItemId": "item-2"}, {"id": "target-3", "label": "Cost-effective SSD storage for entry-level web servers, light workloads, and dev/test environments.", "correctItemId": "item-3"}, {"id": "target-4", "label": "Magnetic platter storage suitable for non-critical backup data and infrequently accessed storage.", "correctItemId": "item-4"}]}}, {"code": "AZ-BASICS-Q049", "title": "Azure VM Scale Sets (VMSS) Purpose", "type": "SINGLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "VM Scale Sets allow auto-scaling identical VM instances up or down based on CPU, memory, or custom metrics, integrated with Load Balancers.", "content": {"prompt": "What is Azure Virtual Machine Scale Sets (VMSS)?", "explanation": "VM Scale Sets allow auto-scaling identical VM instances up or down based on CPU, memory, or custom metrics, integrated with Load Balancers.", "options": [{"id": "opt-1", "text": "An Azure compute resource that lets you create and manage a group of identical, load-balanced VMs that automatically scale in response to demand.", "isCorrect": true}, {"id": "opt-2", "text": "A physical scale used to weigh server racks inside datacenters.", "isCorrect": false}, {"id": "opt-3", "text": "A billing calculator for predicting Azure expenses.", "isCorrect": false}, {"id": "opt-4", "text": "A backup tool for printing hard copies of database tables.", "isCorrect": false}]}}, {"code": "AZ-BASICS-Q050", "title": "Azure VM Cost Optimization Strategies", "type": "MULTIPLE_CHOICE", "difficulty": "INTERMEDIATE", "points": 1.0, "explanation": "Reserved Instances (1-3 yr commitment) and Spot VMs (interruptible capacity) provide significant cost reductions for Azure compute.", "content": {"prompt": "Which of the following strategies can organizations implement to reduce Azure Virtual Machine compute costs? (Select TWO)", "explanation": "Reserved Instances (1-3 yr commitment) and Spot VMs (interruptible capacity) provide significant cost reductions for Azure compute.", "options": [{"id": "opt-1", "text": "Azure Reserved VM Instances (RI): Committing to 1-year or 3-year plans for up to 72% cost savings compared to pay-as-you-go pricing.", "isCorrect": true}, {"id": "opt-2", "text": "Azure Spot VMs: Utilizing unused Azure compute capacity at steep discounts for interruptible workloads.", "isCorrect": true}, {"id": "opt-3", "text": "Running all VMs at 100% CPU utilization 24 hours a day without stopping.", "isCorrect": false}, {"id": "opt-4", "text": "Deleting the billing address from the Azure portal user account.", "isCorrect": false}]}}];

  const seededAzureBasicsD1 = await seedQuestionList(azureBasicsD1, catAzure.id);
  const seededAzureBasicsD2 = await seedQuestionList(azureBasicsD2, catAzure.id);
  const seededAzureBasicsD3 = await seedQuestionList(azureBasicsD3, catAzure.id);
  const seededAzureBasicsD4 = await seedQuestionList(azureBasicsD4, catAzure.id);

  const azureBasicsExam = await prisma.exam.create({
    data: {
      code: 'AZURE-BASICS',
      title: 'Azure Basics',
      vendor: 'MICROSOFT',
      examType: 'CERTIFICATION',
      description: 'Comprehensive Azure Basics certification exam covering Physical and Logical Architecture, High Availability, Management Tools and IaC, and Compute and VM Families (50 Questions total derived from Azure Basics PPTX).',
      timeLimitMinutes: 60,
      passingScore: 70.0,
      totalQuestionsConfig: 50,
      creatorId: creatorUser.id,
      status: 'PUBLISHED',
      isGloballyUnlocked: true,
    },
  });

  await prisma.examRoom.create({
    data: {
      roomCode: 'HALL-AZURE-BASICS',
      title: 'Azure Basics Proctored Examination Hall',
      examId: azureBasicsExam.id,
      status: 'OPEN',
      allowReview: true,
      createdBy: creatorUser.email,
    },
  });

  const azureBasicsSections = [
    { title: '1. Azure Physical & Logical Architecture', weight: 26.0, questions: seededAzureBasicsD1 },
    { title: '2. Azure High Availability, Resiliency & Redundancy', weight: 24.0, questions: seededAzureBasicsD2 },
    { title: '3. Azure Resource Management, Tools & Infrastructure as Code', weight: 24.0, questions: seededAzureBasicsD3 },
    { title: '4. Azure Compute, Virtual Machine Families & Workloads', weight: 26.0, questions: seededAzureBasicsD4 },
  ];

  for (let sIdx = 0; sIdx < azureBasicsSections.length; sIdx++) {
    const sData = azureBasicsSections[sIdx];
    const sec = await prisma.examSection.create({
      data: {
        examId: azureBasicsExam.id,
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
    }
  }
  console.log('✅ Seeded AZURE-BASICS with 50 questions across 4 Objective Domain Sections & Room HALL-AZURE-BASICS!');


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
