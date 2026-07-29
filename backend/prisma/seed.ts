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
        title: 'HashiCorp Certified: Terraform Associate (003)',
        vendor: 'HASHICORP',
        examType: 'CERTIFICATION',
        description: 'Complete HashiCorp Certified: Terraform Associate (003) parent certification exam covering all 7 official HashiCorp Terraform domains (170 Questions total).',
        timeLimitMinutes: 120,
        passingScore: 70.0,
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

    let domainIdx = 1;
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
          passingScore: 70.0,
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

      // 3. Create Sub-Exam Section & Parent Section
      const subSec = await prisma.examSection.create({
        data: {
          examId: subExam.id,
          title: domain_title,
          orderIndex: 1,
          weightPercentage: 100.0,
        },
      });

      const parentSec = await prisma.examSection.create({
        data: {
          examId: parentTfExam.id,
          title: domain_title,
          orderIndex: domainIdx++,
          weightPercentage: Number(((questions.length / 170) * 100).toFixed(1)),
        },
      });

      let qOrder = 1;
      for (const q of questions) {
        const question = await prisma.question.create({
          data: {
            code: q.code,
            title: q.prompt.substring(0, 120),
            type: q.type as any,
            difficulty: 'INTERMEDIATE',
            points: 1.0,
            categoryId: catHashiCorp.id,
            examId: subExam.id,
            sectionId: subSec.id,
            content: JSON.stringify({
              prompt: q.prompt,
              explanation: `Official HashiCorp Terraform explanation for ${q.code}.`,
            }),
            options: {
              create: q.options.map((o: any, oIdx: number) => ({
                text: o.text,
                isCorrect: o.isCorrect,
                orderIndex: oIdx + 1,
                key: o.key,
              })),
            },
          },
        });

        // Link question to sub-exam section
        await prisma.sectionQuestion.create({
          data: { sectionId: subSec.id, questionId: question.id, orderIndex: qOrder },
        });

        // Link question to parent exam section
        await prisma.sectionQuestion.create({
          data: { sectionId: parentSec.id, questionId: question.id, orderIndex: qOrder++ },
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
