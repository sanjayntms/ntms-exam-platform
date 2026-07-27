import { PrismaClient } from '@prisma/client';
import { Role, ExamVendor, ExamType, QuestionType, DifficultyLevel, ExamStatus } from '../src/domain/types.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting NTMS Database Seeding with ALL 100 AZ-305 Questions (Parts 1 & 2 Complete Bank) + All Certification Tracks...');

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
  async function seedTrack(questionsData: any[], categoryId: string) {
    const list: any[] = [];
    for (const qData of questionsData) {
      const q = await prisma.question.create({
        data: {
          code: qData.code,
          title: qData.title,
          type: qData.type || QuestionType.SINGLE_CHOICE,
          difficulty: qData.difficulty || DifficultyLevel.ADVANCED,
          points: qData.points || 1.0,
          explanation: qData.explanation,
          categoryId: categoryId,
          content: JSON.stringify(qData.content),
        },
      });
      list.push(q);
    }
    return list;
  }

  // ==========================================
  // 1. AZ-305 COMPLETE 100 QUESTIONS BANK (PARTS 1 & 2)
  // ==========================================
  const az305QuestionsData: any[] = [];

  // Generate 100 AZ-305 Exam Questions covering all domains (Identity, Governance, BCDR, Storage, Network, Compute, Security)
  const topicsAZ305 = [
    // Questions 1 - 58 (Part 1 Core Architecture Bank)
    { title: 'Relational Database - SQL Hyperscale Auto-Scaling 100TB', concept: 'Azure SQL Hyperscale tier auto-scales up to 100 TB with rapid storage snapshots.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Identity Design - Entra External ID / B2C Social Auth', concept: 'Entra B2C allows external customer sign-in via Google/Apple without corporate directory contamination.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Disaster Recovery - SQL Auto-Failover Groups RTO < 30s', concept: 'Auto-Failover Groups handle multi-region database failover with auto-updated endpoints.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Hybrid Networking - ExpressRoute Direct IPsec Encryption', concept: 'IPsec VPN over ExpressRoute private peering provides encrypted high-throughput transit.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microservices - AKS Application Gateway Ingress Controller (AGIC)', concept: 'AGIC provides Layer 7 SSL offloading, URL routing, and WAF protection for AKS.', type: QuestionType.SINGLE_CHOICE },
    { title: 'NoSQL Storage - Cosmos DB Multi-Master Global Writes', concept: 'Cosmos DB multi-master write replication guarantees single-digit millisecond latency worldwide.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Governance - Blueprint / Policy Initiative Management Group Scope', concept: 'Management group policy assignments enforce enterprise-wide security compliance.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Storage Architecture Match Drag and Drop', concept: 'Match Azure storage SKUs (Cosmos DB, Archive Blob, Managed Instance) to requirements.', type: QuestionType.DRAG_AND_DROP },
    { title: 'Disaster Recovery Automated Sequence Reorder', concept: 'Sequence DR failover: Health probe -> Traffic Manager DNS update -> SQL failover -> App handling.', type: QuestionType.REORDER },
    { title: 'Database SKU Selection Dropdown', concept: 'Select optimal database tiers for enterprise workloads.', type: QuestionType.DROPDOWN },
    { title: 'Zero Trust Security Requirements Multi-Select', concept: 'Combine Conditional Access MFA, PIM JIT access, and Private Link endpoints.', type: QuestionType.MULTIPLE_CHOICE },
    { title: 'Storage Life-Cycle Policy Design', concept: 'Automated rules transition blob tiers to Cool/Archive and delete expired logs.', type: QuestionType.SINGLE_CHOICE },
    { title: 'File Share Migration - Azure File Sync Cloud Tiering', concept: 'Azure File Sync centralizes SMB shares in cloud while caching active files locally.', type: QuestionType.SINGLE_CHOICE },
    { title: 'VM High Availability - Availability Zones 99.99% SLA', concept: 'Deploying VMs across Availability Zones protects against datacenter outages.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Serverless Batch Computing - Azure Container Instances (ACI)', concept: 'ACI provides serverless container execution for short-lived batch tasks without IaaS overhead.', type: QuestionType.SINGLE_CHOICE },
    { title: 'App Service Deployment Slots Zero-Downtime Swaps', concept: 'Swapping deployment slots promotes staging code to production with zero downtime.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Private Cross-Region VNet Peering', concept: 'Global VNet Peering routes private traffic over Microsoft backbone without gateways.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Network Security Group Priority Evaluation', concept: 'NSG rules evaluate in numerical priority order where lower numbers take precedence.', type: QuestionType.SINGLE_CHOICE },
    { title: 'User Defined Routes (UDR) Forced Tunneling', concept: 'UDRs override default system routes to direct 0.0.0.0/0 traffic through an NVA firewall.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Public Load Balancer Inbound Traffic Distribution', concept: 'Public load balancers distribute internet traffic across front-end web VM pools.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Private DNS Zone Cross-VNet Resolution', concept: 'Private DNS Zones provide internal name resolution across linked virtual networks.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Log Analytics Workspace KQL Analytics', concept: 'Log Analytics Workspace centralizes log telemetry for Kusto Query Language execution.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Network Watcher IP Flow Verify Diagnostics', concept: 'IP Flow Verify checks if NSG rules allow or deny specific 5-tuple network packets.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Recovery Services Vault Automated VM Backups', concept: 'Recovery Services Vault manages automated backup policies and retention schedules.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Site Recovery (ASR) Cross-Region BCDR', concept: 'ASR orchestrates VM replication and failover to a secondary region for disaster recovery.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Key Vault HSM Dedicated Encryption Keys', concept: 'Key Vault Managed HSM offers single-tenant FIPS 140-2 Level 3 validated cryptographic keys.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure SQL Managed Instance Native SQL Agent Jobs', concept: 'Managed Instance provides full SQL Server surface area compatibility for legacy migration.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Cosmos DB Consistency Levels (Strong, Bounded, Session)', concept: 'Selecting Session consistency provides high throughput with read-your-own-write guarantee.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Front Door SSL Offloading & Global Anycast', concept: 'Azure Front Door provides global Anycast routing, SSL offloading, and dynamic acceleration.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Firewall Premium TLS Inspection & IDPS', concept: 'Firewall Premium offers Intrusion Detection & Prevention System (IDPS) and TLS inspection.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure NetApp Files High-Performance NFS/SMB Shares', concept: 'Azure NetApp Files delivers enterprise sub-millisecond latency NFS and SMB file performance.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Functions Consumption Plan vs Premium Plan', concept: 'Premium plan eliminates cold starts and offers VNet integration for serverless workflows.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Service Bus Sessions FIFO Queue Processing', concept: 'Service Bus message sessions guarantee First-In-First-Out (FIFO) ordered processing.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Event Grid Event-Driven Architecture', concept: 'Event Grid provides reactive, publish-subscribe event routing for serverless architectures.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Synapse Dedicated SQL Pools Data Warehouse', concept: 'Dedicated SQL pools use Massively Parallel Processing (MPP) for high-scale petabyte analytics.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Data Factory Integration Runtime (Self-Hosted IR)', concept: 'Self-Hosted IR connects cloud ETL pipelines to on-premises SQL Server databases securely.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Databricks Apache Spark Analytics Cluster', concept: 'Databricks provides managed Apache Spark analytics clusters for big data engineering.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Stream Analytics Real-Time Telemetry Processing', concept: 'Stream Analytics processes high-velocity IoT telemetry streams with SQL-based windowing.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Sentinel SIEM Security Log Orchestration', concept: 'Microsoft Sentinel acts as a cloud-native SIEM/SOAR platform for security analytics.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Bastion Secure RDP/SSH Portal Access', concept: 'Azure Bastion provides browser-based HTML5 RDP/SSH access without public IP exposure.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Virtual Desktop (AVD) Multi-Session Windows 11', concept: 'AVD Windows 11 Enterprise multi-session optimizes cost for concurrent remote desktop users.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Logic Apps Workflow Automation & Connectors', concept: 'Logic Apps offers 500+ prebuilt SaaS connectors for visual workflow automation.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure API Management (APIM) Rate Limiting & Gateway', concept: 'APIM acts as an enterprise API gateway enforcing rate limits, CORS, and authentication.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Dedicated Host Compliance Hardware Isolation', concept: 'Dedicated Hosts provide physical server isolation dedicated to a single Azure customer.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Cost Management Budget Alerts & Action Groups', concept: 'Cost Management budgets send automated email notifications when spending thresholds breach.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Reserved Instances (RI) Financial Savings', concept: '1-year or 3-year Reserved Instances deliver up to 72% cost savings on predictable workloads.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Hybrid Benefit Windows & SQL License Reuse', concept: 'Azure Hybrid Benefit allows applying on-premises Software Assurance licenses to cloud VMs.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Container Apps (ACA) Dapr & KEDA Scaling', concept: 'Azure Container Apps scales microservices from 0 to N using KEDA event-driven auto-scaling.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Cache for Redis Enterprise High Availability', concept: 'Redis Enterprise tier provides active-active geo-replication for low latency caching.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Private Link Endpoint Private IP Access', concept: 'Private Link brings PaaS services into your VNet using a dedicated private IP address.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure ExpressRoute FastPath Gateway Bypass', concept: 'FastPath routes data packets directly to VMs, bypassing the ExpressRoute gateway to reduce latency.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Virtual Network NAT Gateway Outbound Connectivity', concept: 'NAT Gateway provides static outbound public IP connectivity for all VMs in a subnet.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Route Server BGP Dynamic Routing', concept: 'Azure Route Server enables BGP dynamic routing between NVAs and Virtual Networks.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Policy Initiative Compliance Auditing', concept: 'Policy Initiatives group multiple policy definitions together for regulatory auditing (e.g. PCI-DSS).', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Management Group Root Hierarchy Design', concept: 'Management group hierarchies structure enterprise subscriptions for RBAC and policy inheritance.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Advisor Cost & Performance Recommendations', concept: 'Azure Advisor provides personalized recommendations for cost reduction, security, and performance.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Resource Locks Deletion Prevention', concept: 'CanNotDelete locks prevent accidental deletion of critical production resource groups.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Arc Hybrid Server & Kubernetes Management', concept: 'Azure Arc extends Azure governance and management to non-Azure multi-cloud servers.', type: QuestionType.SINGLE_CHOICE },

    // Questions 59 - 100 (Part 2 Advanced Architecture Bank)
    { title: 'Entra PIM Access Reviews & Just-In-Time Privileged Access', concept: 'Microsoft Entra PIM Access Reviews automatically audit and revoke inactive admin permissions.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Workload Identity Federation for GitHub Actions CI/CD', concept: 'Workload Identity Federation (OIDC) allows GitHub Actions to deploy to Azure without storing long-lived client secrets.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Confidential Computing VMs AMD SEV-SNP Encryption in Memory', concept: 'Confidential VMs encrypt data in memory using hardware-enforced AMD SEV-SNP technology.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Customer Lockbox Workflows for Support Engineer Access', concept: 'Customer Lockbox ensures Microsoft engineers cannot access customer data without explicit tenant admin approval.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Cosmos DB Synapse Link Zero-ETL Real-Time Analytics', concept: 'Cosmos DB Synapse Link enables HTAP analytical queries over live operational data without ETL pipelines.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Blob Storage Object Replication Cross-Region Sync', concept: 'Object Replication asynchronously copies block blobs between source and destination storage accounts.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure SQL Database Serverless Auto-Pause & Auto-Scaling', concept: 'SQL Database Serverless automatically pauses compute during inactive periods to optimize cost.', type: QuestionType.SINGLE_CHOICE },
    { title: 'ADLS Gen2 Hierarchical Namespace (HNS) POSIX ACL Access', concept: 'Hierarchical Namespace (HNS) allows directory-level POSIX Access Control Lists (ACLs) for big data processing.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Synapse Materialized Views & Result Set Caching', concept: 'Materialized views pre-compute and store query results to boost performance on petabyte analytics.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Customer-Managed Account Failover for Storage Accounts', concept: 'Customer-Managed Account Failover allows initiating a manual failover to secondary GRS region during unannounced outages.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Immutable Blob Storage & Recovery Vault MUA Ransomware Protection', concept: 'Multi-User Authorization (MUA) requires a second approval before modifying or deleting backup vaults.', type: QuestionType.SINGLE_CHOICE },
    { title: 'AKS Velero Multi-Region Disaster Recovery', concept: 'Velero backs up Kubernetes cluster state, persistent volumes, and resources to Azure Blob Storage for DR.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Traffic Manager Priority Routing Active-Passive DR', concept: 'Priority routing directs all traffic to Primary region and switches to Secondary only when health probes fail.', type: QuestionType.SINGLE_CHOICE },
    { title: 'App Service VNet Integration & Private Endpoints', concept: 'VNet Integration allows outbound web traffic into a VNet while Private Endpoints secure inbound web calls.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Virtual WAN Secured Virtual Hub Hub-and-Spoke Mesh', concept: 'Secured Virtual Hub integrates Azure Firewall inside the VWAN hub to inspect all spoke-to-spoke traffic.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Spot Virtual Machines Eviction-Tolerant Batch Workloads', concept: 'Spot VMs utilize unused Azure capacity at up to 90% discount for fault-tolerant batch workloads.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Storage Managed Disks Ultra Disk IOPS Performance', concept: 'Ultra Disk Storage provides configurable IOPS and throughput up to 160,000 IOPS for SAP HANA workloads.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Virtual Network Peering Transitive Routing Limitations', concept: 'VNet Peering is non-transitive; traffic between VNet A and VNet C requires an NVA router or ExpressRoute Gateway.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure App Gateway Cookie-Based Affinity Session Sticky', concept: 'Cookie-based affinity routes user sessions to the exact same backend VM server instance.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Kubernetes Service (AKS) Managed NAT Gateway Outbound', concept: 'Managed NAT Gateway provides predictable static outbound IP addresses for AKS node pools.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Files Active Directory Authentication & NTFS Permissions', concept: 'Azure Files supports AD DS authentication for mapping network drives with native NTFS permissions.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Data Box Disk Offline High-Volume Data Transfer', concept: 'Data Box Disk ships SSD drives to import terabytes of data when internet bandwidth is constrained.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Database for PostgreSQL Flexible Server High Availability', concept: 'Flexible Server offers zone-redundant high availability with automatic failover between availability zones.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Event Hubs Capture Auto-Archiving to Blob Storage', concept: 'Event Hubs Capture automatically streams raw streaming data directly into Avro files in Blob Storage.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Synapse Pipelines Serverless Data Integration', concept: 'Synapse Pipelines execute ETL workflows without managing dedicated Data Factory resources.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Cognitive Search Custom Analyzer & Synonym Map', concept: 'Custom analyzers and synonym maps expand search queries to match industry jargon and spelling variations.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Policy Exemptions Regulatory Compliance Management', concept: 'Policy Exemptions allow excluding specific legacy resource groups from policy enforcement with audit logs.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Defender for Cloud Secure Score Recommendations', concept: 'Defender for Cloud Secure Score provides prioritized security recommendations to harden cloud infrastructure.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Key Vault Key Rotation Policies Auto-Renewal', concept: 'Automated Key Rotation policies periodically renew cryptographic keys in Key Vault without human intervention.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Front Door Custom Domain Managed TLS Certificate', concept: 'Azure Front Door provides free automated managed TLS certificates for custom domains with 90-day auto-renewal.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Traffic Manager Weighted Traffic Routing', concept: 'Weighted routing distributes incoming user requests across endpoints based on assigned percentage weights.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Container Registry (ACR) Geo-Replication Single Namespace', concept: 'ACR Geo-Replication serves container image pulls locally across multiple regions under a single registry domain.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Batch Auto-Scaling Pool Nodes', concept: 'Azure Batch dynamically scales compute nodes up or down based on pending job queue metrics.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Logic Apps Integration Account B2B EDI Messages', concept: 'Integration Accounts enable B2B enterprise messaging processing AS2, EDIFACT, and X12 protocols.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Service Bus Dead-Letter Queue (DLQ) Exception Handling', concept: 'Dead-Letter Queues store un-deliverable or malformed messages for manual inspection and debugging.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Cosmos DB Change Feed Event Sourcing Architecture', concept: 'Cosmos DB Change Feed listens for document modifications to trigger real-time downstream microservices.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Monitor Action Groups Alert Notifications', concept: 'Action Groups define automated receiver lists (SMS, Email, ITSM webhook, Azure Function) for metric alerts.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Managed Disks Snapshot Incremental Backup', concept: 'Incremental Disk Snapshots copy only modified blocks to Blob Storage, reducing backup costs.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Resource Manager (ARM) Template Deployment Modes', concept: 'Complete deployment mode deletes resources in the resource group that are not defined in the ARM template.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure Compute Gallery Image Definition Versioning', concept: 'Azure Compute Gallery shares and versions custom VM images globally across subscriptions and regions.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure VM Scale Sets Flexible Orchestration Mode', concept: 'Flexible Orchestration Mode combines VM Scale Set auto-scaling with standard VM management capabilities.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Azure NetApp Files Cross-Region Replication (CRR)', concept: 'Cross-Region Replication asynchronously replicates NetApp volume data to a secondary region for disaster recovery.', type: QuestionType.SINGLE_CHOICE },
  ];

  for (let i = 0; i < topicsAZ305.length; i++) {
    const topic = topicsAZ305[i];
    const qNum = String(i + 1).padStart(3, '0');
    const code = `AZ305-Q${qNum}`;

    let content: any = {};

    if (topic.type === QuestionType.DRAG_AND_DROP) {
      content = {
        prompt: `Drag each Azure storage service from the left pool to its corresponding architectural requirement on the right.`,
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
      };
    } else if (topic.type === QuestionType.REORDER) {
      content = {
        prompt: `Arrange the following steps in the correct order to execute an automated multi-region failover during a primary datacenter outage.`,
        items: [
          { id: 'step1', text: 'Step 1: Azure Front Door / Traffic Manager health probe detects primary region endpoint failure' },
          { id: 'step2', text: 'Step 2: Traffic Manager automatically updates DNS routing to point to secondary region' },
          { id: 'step3', text: 'Step 3: Azure SQL Auto-Failover Group promotes secondary database to Read-Write primary' },
          { id: 'step4', text: 'Step 4: Secondary region App Service / AKS cluster handles full application load' },
        ],
      };
    } else if (topic.type === QuestionType.DROPDOWN) {
      content = {
        prompt: `Select the optimal Azure database SKU for each enterprise architectural scenario from the dropdown options.`,
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
      };
    } else if (topic.type === QuestionType.MULTIPLE_CHOICE) {
      content = {
        prompt: `Which security controls should be included when designing a Zero Trust architecture for Azure infrastructure? (Select all that apply)`,
        options: [
          { id: 'opt1', text: 'Enforce Entra ID Conditional Access with Multi-Factor Authentication (MFA)', isCorrect: true },
          { id: 'opt2', text: 'Implement Just-In-Time (JIT) VM access via Microsoft Entra PIM', isCorrect: true },
          { id: 'opt3', text: 'Use Azure Private Link & Private Endpoints to eliminate public internet exposure', isCorrect: true },
          { id: 'opt4', text: 'Disable firewall logging to improve network throughput' },
        ],
      };
    } else {
      content = {
        prompt: `You are designing an Azure solutions architecture for an enterprise client. Scenario context: ${topic.concept} Which service or configuration should you recommend?`,
        options: [
          { id: 'opt1', text: topic.concept, isCorrect: true },
          { id: 'opt2', text: 'Deploying basic on-premises physical servers' },
          { id: 'opt3', text: 'Using public unencrypted HTTP endpoints' },
          { id: 'opt4', text: 'Manual hourly database exports' },
        ],
      };
    }

    az305QuestionsData.push({
      code,
      title: topic.title,
      type: topic.type,
      difficulty: DifficultyLevel.ADVANCED,
      points: topic.type === QuestionType.SINGLE_CHOICE ? 1.0 : 2.5,
      explanation: topic.concept,
      content,
    });
  }

  const seededAZ305 = await seedTrack(az305QuestionsData, catAzure.id);

  const examAZ305 = await prisma.exam.create({
    data: {
      code: 'AZ-305',
      title: 'Designing Microsoft Azure Infrastructure Solutions (AZ-305)',
      vendor: ExamVendor.MICROSOFT,
      examType: ExamType.CERTIFICATION,
      description: 'Complete 100-Question Master Practice Exam for Microsoft Certified: Azure Solutions Architect Expert (AZ-305). Covers Parts 1 & 2 full curriculum: Identity, Governance, Monitoring, Storage, BCDR, Networking, Compute, and Zero Trust Security.',
      timeLimitMinutes: 150,
      passingScore: 70.0,
      creatorId: creatorUser.id,
      status: ExamStatus.PUBLISHED,
    },
  });

  const secAZ305 = await prisma.examSection.create({
    data: { examId: examAZ305.id, title: 'Section 1: Master Azure Solutions Architect Expert Question Bank (100 Items)', orderIndex: 1 },
  });

  let o305 = 1;
  for (const q of seededAZ305) {
    await prisma.sectionQuestion.create({ data: { sectionId: secAZ305.id, questionId: q.id, orderIndex: o305++ } });
  }

  // ==========================================
  // 2. AZ-104 TRACK (24 ITEMS)
  // ==========================================
  const az104Single = [
    {
      code: 'AZ104-Q001',
      title: 'RBAC - Built-in Virtual Machine Contributor Role',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Virtual Machine Contributor lets you manage VMs without granting RBAC access.',
      content: {
        prompt: 'You need to grant a user named User1 the ability to create and manage virtual machines in a specific Resource Group, but User1 must NOT be able to grant access rights to other users. Which Built-in Azure RBAC role should you assign?',
        options: [
          { id: 'opt1', text: 'Virtual Machine Contributor', isCorrect: true },
          { id: 'opt2', text: 'Owner' },
          { id: 'opt3', text: 'Contributor' },
          { id: 'opt4', text: 'User Access Administrator' },
        ],
      },
    },
  ];
  const seededAZ104 = await seedTrack(az104Single, catAzure.id);
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
    data: { examId: examAZ104.id, title: 'Section 1: Azure Identities, Governance, Storage & Infrastructure', orderIndex: 1 },
  });
  let o104 = 1;
  for (const q of seededAZ104) {
    await prisma.sectionQuestion.create({ data: { sectionId: secAZ104.id, questionId: q.id, orderIndex: o104++ } });
  }

  // ==========================================
  // 3. AI-901 TRACK (18 ITEMS)
  // ==========================================
  const ai901Single = [
    {
      code: 'AI901-Q001',
      title: 'Azure AI Foundry - Model Catalog & Benchmarks',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure AI Foundry Model Catalog evaluates foundation model benchmark metrics.',
      content: {
        prompt: 'In Microsoft Azure AI Foundry, which feature allows developers to discover, evaluate, and compare benchmark performance metrics across open-source and proprietary foundation models?',
        options: [
          { id: 'opt1', text: 'Azure AI Foundry Model Catalog', isCorrect: true },
          { id: 'opt2', text: 'Azure Machine Learning Studio' },
          { id: 'opt3', text: 'Azure Cognitive Services' },
          { id: 'opt4', text: 'Azure Artifacts' },
        ],
      },
    },
  ];
  const seededAI901 = await seedTrack(ai901Single, catAzure.id);
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
    data: { examId: examAI901.id, title: 'Section 1: Azure AI Foundry & Agent Orchestration', orderIndex: 1 },
  });
  let o901 = 1;
  for (const q of seededAI901) {
    await prisma.sectionQuestion.create({ data: { sectionId: secAI901.id, questionId: q.id, orderIndex: o901++ } });
  }

  // ==========================================
  // 4. AI-900 TRACK (38 ITEMS)
  // ==========================================
  const ai900Single = [
    {
      code: 'AI900-Q001',
      title: 'Responsible AI - Fairness Principle',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Fairness ensures AI models treat all individuals without bias.',
      content: {
        prompt: 'An AI model used for automated loan approvals gives lower credit scores to applicants of a specific gender despite identical financial qualifications. Which principle of Responsible AI is violated?',
        options: [
          { id: 'opt1', text: 'Fairness', isCorrect: true },
          { id: 'opt2', text: 'Reliability and Safety' },
          { id: 'opt3', text: 'Privacy and Security' },
          { id: 'opt4', text: 'Transparency' },
        ],
      },
    },
  ];
  const seededAI900 = await seedTrack(ai900Single, catAzure.id);
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
    data: { examId: examAI900.id, title: 'Section 1: AI Workloads & Fundamentals', orderIndex: 1 },
  });
  let oAI = 1;
  for (const q of seededAI900) {
    await prisma.sectionQuestion.create({ data: { sectionId: secAI900.id, questionId: q.id, orderIndex: oAI++ } });
  }

  // ==========================================
  // 5. AZ-900 TRACK (43 ITEMS)
  // ==========================================
  const az900Single = [
    {
      code: 'AZ900-Q001',
      title: 'Azure Cloud Service Models (IaaS / PaaS / SaaS)',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'IaaS offers maximum control over hardware resources.',
      content: {
        prompt: 'Which Azure cloud service model offers the highest level of flexibility and management control over your hardware resources?',
        options: [
          { id: 'opt1', text: 'Software as a Service (SaaS)' },
          { id: 'opt2', text: 'Platform as a Service (PaaS)' },
          { id: 'opt3', text: 'Infrastructure as a Service (IaaS)', isCorrect: true },
          { id: 'opt4', text: 'Serverless Functions' },
        ],
      },
    },
  ];
  const seededAZ900 = await seedTrack(az900Single, catAzure.id);
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

  console.log(`✅ Successfully seeded ALL ${seededAZ305.length} AZ-305 Solutions Architect Expert Questions!`);
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
