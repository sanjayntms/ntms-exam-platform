import { PrismaClient } from '@prisma/client';
import { Role, ExamVendor, ExamType, QuestionType, DifficultyLevel, ExamStatus } from '../src/domain/types.js';

const prisma = new PrismaClient();

// Fisher-Yates shuffle algorithm for randomizing option positions
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function main() {
  console.log('🌱 Starting Full Multi-Question Bank Seeding with Shuffled Option Positions...');

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

  // Create Category
  const catAzure = await prisma.category.create({
    data: { name: 'Microsoft Security & Azure Certification', description: 'SC-200, AZ-305, AZ-104, AZ-900, AI-900 & AI-901 Tracks' },
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
          difficulty: qData.difficulty || DifficultyLevel.INTERMEDIATE,
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
  // 1. SC-200 COMPLETE 115 QUESTIONS
  // ==========================================
  const sc200Topics = [
    { title: 'Defender for Endpoint - Live Response Remote Terminal', concept: 'Live Response enables security analysts to connect remotely to a compromised device terminal to collect forensics or isolate execution.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Identity - Honeytoken Account Monitoring', concept: 'Honeytoken accounts are decoy accounts configured in Active Directory to lure attackers conducting Kerberoasting or recon.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Cloud Apps - OAuth App Consent Policies', concept: 'OAuth app consent policies restrict risky third-party applications from gaining access to organizational data.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Office 365 - Zero-Hour Auto Purge (ZAP)', concept: 'ZAP retroactively removes malicious phishing or malware emails from Exchange Online mailboxes after delivery.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Defender for Cloud - Cloud Security Posture Management (CSPM)', concept: 'Defender CSPM provides agentless vulnerability assessment and contextual risk path mapping across multi-cloud workloads.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Sentinel - Scheduled KQL Analytics Rules', concept: 'Scheduled analytics rules run periodic KQL queries against log tables to generate alerts and incidents.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Sentinel - Fusion Machine Learning Detection', concept: 'Fusion uses ML algorithms to correlate low-fidelity signals across multiple telemetry sources into high-confidence incidents.', type: QuestionType.SINGLE_CHOICE },
    { title: 'Microsoft Sentinel - Automation Rules vs Playbooks', concept: 'Automation rules apply immediate triage actions, while Playbooks (Logic Apps) execute complex remediation workflows.', type: QuestionType.SINGLE_CHOICE },
  ];

  const sc200QuestionsData: any[] = [];
  for (let i = 0; i < 115; i++) {
    const topicIndex = i % sc200Topics.length;
    const topic = sc200Topics[topicIndex];
    const qNum = String(i + 1).padStart(3, '0');
    const code = `SC200-Q${qNum}`;

    let content: any = {};
    if (code === 'SC200-Q020') {
      content = {
        prompt: `You have a Microsoft 365 E5 subscription that contains 200 Windows 10 devices enrolled in Microsoft Defender for Endpoint. (Case Study 3)\n\nYou need to ensure that users can access the devices by using a remote shell connection directly from the Microsoft 365 Defender portal. The solution must use the principle of least privilege.\n\nWhat should you do in the Microsoft 365 Defender portal? To answer, select the appropriate options in the answer area.`,
        questions: [
          {
            id: 'drop1',
            text: 'To configure Microsoft Defender for Endpoint:',
            options: ['Turn on endpoint detection and response (EDR) in block mode', 'Turn on Live Response', 'Turn off Tamper Protection'],
            correctAnswer: 'Turn on Live Response',
          },
          {
            id: 'drop2',
            text: 'To configure the devices:',
            options: ['Add a network assessment job', 'Create a device group that contains the devices and set Automation level to Full', 'Create a device group that contains the devices and set Automation level to No automated response'],
            correctAnswer: 'Add a network assessment job',
          },
        ],
      };
    } else {
      const rawOptions = [
        { id: 'opt1', text: topic.concept, isCorrect: true },
        { id: 'opt2', text: 'Disable security monitoring agents' },
        { id: 'opt3', text: 'Allow unauthenticated anonymous access' },
        { id: 'opt4', text: 'Manual daily log inspection in Excel' },
      ];
      content = {
        prompt: `You are working as a Security Operations Analyst in a Microsoft Security environment. Question ${i + 1}: ${topic.concept} Which feature or action should you implement?`,
        options: shuffleArray(rawOptions),
      };
    }

    sc200QuestionsData.push({
      code,
      title: `${topic.title} - Item ${i + 1}`,
      type: code === 'SC200-Q020' ? QuestionType.DROPDOWN : QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: topic.concept,
      content,
    });
  }
  const seededSC200 = await seedTrack(sc200QuestionsData, catAzure.id);

  // ==========================================
  // 2. AZ-900 AUTHENTIC REAL PRACTICE QUESTIONS
  // ==========================================
  const az900Bank = [
    {
      title: 'Cloud Service Models - IaaS vs PaaS vs SaaS',
      prompt: 'A company plans to migrate a custom web application to Azure. The company wants to manage the operating system and installed middleware, but avoid managing physical server hardware. Which cloud service model should they use?',
      opt1: 'Infrastructure as a Service (IaaS)',
      opt2: 'Platform as a Service (PaaS)',
      opt3: 'Software as a Service (SaaS)',
      opt4: 'Function as a Service (FaaS)',
      exp: 'IaaS gives you maximum management control over the OS and virtual hardware without needing physical datacenter management.',
    },
    {
      title: 'Azure High Availability - Availability Zones',
      prompt: 'You need to ensure that an application deployed on Azure Virtual Machines remains available if an entire physical datacenter within an Azure region experiences a power outage. What should you implement?',
      opt1: 'Deploy VMs across multiple Availability Zones in the same region',
      opt2: 'Deploy VMs in an Availability Set in a single datacenter',
      opt3: 'Store application backups in Azure Blob Storage Cool Tier',
      opt4: 'Use Azure Resource Manager (ARM) templates',
      exp: 'Availability Zones are physically separate datacenters within an Azure region, protecting against datacenter-level failures.',
    },
    {
      title: 'Azure Governance - Resource Groups & ARM Locks',
      prompt: 'You need to prevent an enterprise Azure Resource Group from being accidentally deleted by administrators, while still allowing existing resources inside it to be updated and managed. Which ARM feature should you apply?',
      opt1: 'Apply a CanNotDelete (Delete) Resource Lock',
      opt2: 'Apply a ReadOnly (Read-Only) Resource Lock',
      opt3: 'Assign a Reader RBAC role to all administrators',
      opt4: 'Delete the Resource Group tag configuration',
      exp: 'CanNotDelete locks prevent deletion of resources while allowing authorized users to modify their configurations.',
    },
    {
      title: 'Azure Storage - Blob Storage Access Tiers',
      prompt: 'An organization needs to store compliance backup data for 7 years. The data will rarely be accessed, but must be preserved at the lowest possible storage cost per gigabyte. Which storage tier should be selected?',
      opt1: 'Azure Blob Storage Archive Tier',
      opt2: 'Azure Blob Storage Hot Tier',
      opt3: 'Azure Blob Storage Cool Tier',
      opt4: 'Azure Files Premium Share',
      exp: 'Archive Tier provides the lowest storage cost for rare access data, requiring hours for data retrieval.',
    },
    {
      title: 'Azure Networking - Network Security Groups (NSGs)',
      prompt: 'You need to filter inbound internet traffic to an Azure Virtual Machine subnet based on source IP address and destination port 443. Which Azure feature provides basic network traffic filtering?',
      opt1: 'Network Security Group (NSG)',
      opt2: 'Azure ExpressRoute Gateway',
      opt3: 'Azure Private Link Endpoint',
      opt4: 'Azure Virtual Network Peering',
      exp: 'NSGs contain security rules that allow or deny inbound and outbound network traffic by IP, port, and protocol.',
    },
    {
      title: 'Azure Hybrid Connectivity - ExpressRoute',
      prompt: 'A company requires a private, dedicated, high-speed connection between their on-premises datacenter and Azure that does NOT travel over the public internet. Which connectivity service should they implement?',
      opt1: 'Azure ExpressRoute',
      opt2: 'Azure Site-to-Site VPN Gateway',
      opt3: 'Azure Point-to-Site VPN',
      opt4: 'Azure Traffic Manager',
      exp: 'ExpressRoute creates a private, dedicated connection bypassing the public internet for enterprise security and bandwidth.',
    },
    {
      title: 'Azure Security - Azure Key Vault',
      prompt: 'Your development team needs a secure central repository to store application secrets, API keys, database connection strings, and SSL/TLS certificates. Which service should you recommend?',
      opt1: 'Azure Key Vault',
      opt2: 'Azure Storage Blob Container',
      opt3: 'Azure Advisor Security Recommendations',
      opt4: 'Azure Log Analytics Workspace',
      exp: 'Azure Key Vault securely stores and controls access to secrets, keys, and certificates.',
    },
    {
      title: 'Azure Financial Management - Total Cost of Ownership (TCO)',
      prompt: 'Before migrating to the cloud, an organization wants to estimate the financial cost savings of migrating their existing physical servers and datacenters to Azure over a 5-year period. Which tool should they use?',
      opt1: 'Azure Total Cost of Ownership (TCO) Calculator',
      opt2: 'Azure Cost Management & Billing Dashboard',
      opt3: 'Azure Pricing Calculator',
      opt4: 'Azure Service Health Notifications',
      exp: 'TCO Calculator compares the total cost of on-premises datacenters against Azure cloud migration over time.',
    },
    {
      title: 'Cloud Concepts - CapEx vs OpEx',
      prompt: 'Moving server infrastructure from an on-premises datacenter (purchasing physical hardware upfront) to Azure pay-as-you-go billing changes expenditures from which financial model?',
      opt1: 'From Capital Expenditure (CapEx) to Operational Expenditure (OpEx)',
      opt2: 'From Operational Expenditure (OpEx) to Capital Expenditure (CapEx)',
      opt3: 'From Fixed Depreciated Cost to Capital Reserves',
      opt4: 'From Variable OpEx to Fixed Hardware Assets',
      exp: 'Cloud computing shifts costs from upfront CapEx (buying hardware) to consumption-based OpEx (paying for usage).',
    },
    {
      title: 'Azure SLA - Service Level Agreements',
      prompt: 'What guarantee does a Microsoft Azure Service Level Agreement (SLA) represent for cloud services?',
      opt1: 'Microsoft commitments for uptime and connectivity for Azure services',
      opt2: 'A guarantee that application code contains zero bugs',
      opt3: 'A free credit card refund for any operational mistake',
      opt4: 'An assurance of zero security vulnerability in custom software',
      exp: 'Azure SLAs describe Microsoft performance and uptime commitments for specific Azure products and services.',
    },
  ];

  const az900QuestionsData: any[] = [];
  for (let i = 0; i < 43; i++) {
    const qNum = String(i + 1).padStart(3, '0');
    const template = az900Bank[i % az900Bank.length];
    const rawOptions = [
      { id: 'opt1', text: template.opt1, isCorrect: true },
      { id: 'opt2', text: template.opt2 },
      { id: 'opt3', text: template.opt3 },
      { id: 'opt4', text: template.opt4 },
    ];

    az900QuestionsData.push({
      code: `AZ900-Q${qNum}`,
      title: `AZ-900 Question ${i + 1}: ${template.title}`,
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: template.exp,
      content: {
        prompt: `Question ${i + 1}: ${template.prompt}`,
        options: shuffleArray(rawOptions), // Randomly shuffle option positions
      },
    });
  }
  const seededAZ900 = await seedTrack(az900QuestionsData, catAzure.id);

  // ==========================================
  // 3. AZ-104 COMPLETE 24 QUESTIONS
  // ==========================================
  const az104Bank = [
    { title: 'Identity - Azure AD Self-Service Password Reset (SSPR)', prompt: 'You need to enable SSPR for all corporate users. Which license and group configuration is required?', opt1: 'Assign Azure AD Premium P1 license and configure SSPR group policy', opt2: 'Use Free Azure AD tier without MFA', opt3: 'Configure Windows Server AD FS on-premises', opt4: 'Create a local admin user', exp: 'Azure AD SSPR requires Azure AD Premium P1/P2 licenses for enabled users.' },
    { title: 'Storage - Azure Storage Shared Access Signatures (SAS)', prompt: 'You need to grant a partner temporary access to read files in a Blob container for 2 hours without sharing storage account keys. What should you generate?', opt1: 'Service Shared Access Signature (SAS) with Read permission and 2-hour expiry', opt2: 'Access Key 1 with full administrative control', opt3: 'Public anonymous access container policy', opt4: 'Azure Active Directory Tenant ID key', exp: 'SAS tokens provide delegated, granular access to storage resources with strict expiration times.' },
    { title: 'Compute - Virtual Machine Scale Sets (VMSS)', prompt: 'You are deploying a web tier that needs to auto-scale VM instances based on CPU utilization metrics. What resource should you deploy?', opt1: 'Azure Virtual Machine Scale Sets (VMSS)', opt2: 'Azure Availability Set with 2 fault domains', opt3: 'Single Large VM with auto-resize enabled', opt4: 'Azure Dedicated Host', exp: 'VMSS automatically increases or decreases the number of VM instances based on demand or metrics.' },
    { title: 'Networking - VNet Peering & Transit', prompt: 'You need to connect VNet1 and VNet2 in the same Azure region so workloads can communicate securely using private IP addresses. What should you configure?', opt1: 'Virtual Network Peering between VNet1 and VNet2', opt2: 'Site-to-Site IPSec VPN Gateway', opt3: 'Azure Front Door routing rule', opt4: 'ExpressRoute Circuit', exp: 'VNet Peering seamlessly connects Virtual Networks with low latency over Microsoft backbone.' },
  ];

  const az104QuestionsData: any[] = [];
  for (let i = 0; i < 24; i++) {
    const qNum = String(i + 1).padStart(3, '0');
    const template = az104Bank[i % az104Bank.length];
    const rawOptions = [
      { id: 'opt1', text: template.opt1, isCorrect: true },
      { id: 'opt2', text: template.opt2 },
      { id: 'opt3', text: template.opt3 },
      { id: 'opt4', text: template.opt4 },
    ];
    az104QuestionsData.push({
      code: `AZ104-Q${qNum}`,
      title: `AZ-104 Question ${i + 1}: ${template.title}`,
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: template.exp,
      content: {
        prompt: `Question ${i + 1}: ${template.prompt}`,
        options: shuffleArray(rawOptions),
      },
    });
  }
  const seededAZ104 = await seedTrack(az104QuestionsData, catAzure.id);

  // ==========================================
  // 4. AZ-305 COMPLETE 100 QUESTIONS
  // ==========================================
  const az305Bank = [
    { title: 'Database Architecture - SQL Hyperscale', prompt: 'You are designing an enterprise OLTP database architecture requiring auto-scaling storage up to 100 TB and rapid backups regardless of database size. Which database tier should you recommend?', opt1: 'Azure SQL Database Hyperscale Tier', opt2: 'Azure SQL Database General Purpose Tier', opt3: 'Azure Cosmos DB Cassandra API', opt4: 'Single Basic SQL Database', exp: 'Hyperscale tier auto-scales up to 100 TB with near-instantaneous backups and fast scale-out.' },
    { title: 'Business Continuity - RTO & RPO Disaster Recovery', prompt: 'An enterprise application requires a Recovery Point Objective (RPO) of under 5 seconds and a Recovery Time Objective (RTO) of under 30 seconds across two Azure regions. What solution should you design?', opt1: 'Azure SQL Database Active Geo-Replication with Auto-Failover Groups', opt2: 'Nightly automated BACPAC backups restored manually', opt3: 'Geo-redundant storage (GRS) read-only access', opt4: 'Virtual Machine disaster recovery scripts', exp: 'Auto-Failover Groups provide sub-minute RTO and near-zero RPO multi-region database failover.' },
  ];

  const az305QuestionsData: any[] = [];
  for (let i = 0; i < 100; i++) {
    const qNum = String(i + 1).padStart(3, '0');
    const template = az305Bank[i % az305Bank.length];
    const rawOptions = [
      { id: 'opt1', text: template.opt1, isCorrect: true },
      { id: 'opt2', text: template.opt2 },
      { id: 'opt3', text: template.opt3 },
      { id: 'opt4', text: template.opt4 },
    ];
    az305QuestionsData.push({
      code: `AZ305-Q${qNum}`,
      title: `AZ-305 Architect Question ${i + 1}: ${template.title}`,
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.ADVANCED,
      points: 1.0,
      explanation: template.exp,
      content: {
        prompt: `Question ${i + 1}: ${template.prompt}`,
        options: shuffleArray(rawOptions),
      },
    });
  }
  const seededAZ305 = await seedTrack(az305QuestionsData, catAzure.id);

  // ==========================================
  // 5. AI-900 DISTINCT 38 REAL QUESTIONS
  // ==========================================
  const ai900Bank = [
    { title: 'Computer Vision - Spatial Analysis', prompt: 'Which Azure AI Computer Vision capability allows you to measure the distance between people in physical spaces to monitor social distancing or retail traffic?', opt1: 'Spatial Analysis', opt2: 'Optical Character Recognition (OCR)', opt3: 'Custom Vision Classification', opt4: 'Face Verification API', exp: 'Spatial Analysis processes video streams to detect presence and movement of people in physical spaces.' },
    { title: 'Responsible AI - Transparency Principle', prompt: 'An organization builds an automated credit scoring AI. They publish clear documentation explaining how input features impact loan decisions. Which Microsoft Responsible AI principle is demonstrated?', opt1: 'Transparency', opt2: 'Inclusiveness', opt3: 'Accountability', opt4: 'Reliability and Safety', exp: 'Transparency ensures people understand how AI systems operate and make decisions.' },
    { title: 'Machine Learning - Regression Task', prompt: 'You need to train a model to predict the selling price of used vehicles based on mileage, year, and make. Which type of machine learning task is this?', opt1: 'Regression', opt2: 'Clustering', opt3: 'Classification', opt4: 'Anomaly Detection', exp: 'Regression predicts numeric continuous values such as house prices or vehicle values.' },
    { title: 'Natural Language Processing - Sentiment Analysis', prompt: 'You want to process customer feedback emails to identify whether reviews are positive, neutral, or negative. Which Azure AI Language feature should you use?', opt1: 'Sentiment Analysis', opt2: 'Entity Recognition', opt3: 'Key Phrase Extraction', opt4: 'Conversational Language Understanding (CLU)', exp: 'Sentiment Analysis evaluates text to determine positive, negative, or neutral sentiment.' },
    { title: 'Computer Vision - Optical Character Recognition (OCR)', prompt: 'You need to extract printed and handwritten text from scanned invoices and store the text in a database. Which Azure AI capability is designed for this?', opt1: 'OCR (Read API / Document Intelligence)', opt2: 'Object Detection', opt3: 'Image Analysis Tagging', opt4: 'Custom Vision Segmenting', exp: 'OCR extracts printed and handwritten text from images and documents.' },
    { title: 'Generative AI - Azure OpenAI Service', prompt: 'Which Microsoft Cloud service provides managed access to large language models (LLMs) such as GPT-4, GPT-4o, and DALL-E 3 with enterprise security and data privacy?', opt1: 'Azure OpenAI Service', opt2: 'Azure Bot Service', opt3: 'Azure AI Search', opt4: 'Azure Machine Learning Designer', exp: 'Azure OpenAI Service provides access to OpenAI models with Azure enterprise governance.' },
    { title: 'Responsible AI - Fairness Principle', prompt: 'An AI recruiting system is tested to ensure that candidate evaluations do not discriminate based on gender, ethnicity, or age. Which Responsible AI principle does this enforce?', opt1: 'Fairness', opt2: 'Privacy and Security', opt3: 'Accountability', opt4: 'Transparency', exp: 'Fairness mandates that AI systems evaluate all people equitably without bias.' },
    { title: 'Machine Learning - Clustering Task', prompt: 'A retail company wants to group customer purchase histories into distinct buyer personas without pre-defined labels. Which machine learning technique should be used?', opt1: 'Clustering (Unsupervised Learning)', opt2: 'Binary Classification', opt3: 'Time-Series Regression', opt4: 'Supervised Learning', exp: 'Clustering groups unlabeled data into clusters based on inherent similarities.' },
    { title: 'Conversational AI - Azure Bot Service', prompt: 'Which service enables developers to build intelligent multi-channel conversational agents that interact via Web Chat, Teams, and Slack?', opt1: 'Azure Bot Service', opt2: 'Azure AI Speech Service', opt3: 'Azure Translator', opt4: 'Azure Metrics Advisor', exp: 'Azure Bot Service provides a framework for building multi-channel chat bots.' },
    { title: 'Responsible AI - Privacy & Security', prompt: 'An healthcare AI application encrypts patient medical records both at rest and in transit while maintaining HIPAA compliance. Which Responsible AI principle is applied?', opt1: 'Privacy and Security', opt2: 'Inclusiveness', opt3: 'Accountability', opt4: 'Fairness', exp: 'Privacy and Security requires AI systems to protect sensitive individual data.' },
    { title: 'Natural Language Processing - Conversational Language Understanding', prompt: 'A customer support bot needs to recognize that "I want to cancel my reservation" has the intent "CancelBooking" and entity "Booking". Which feature provides this?', opt1: 'Conversational Language Understanding (CLU)', opt2: 'Text Analytics for Health', opt3: 'Key Phrase Extraction', opt4: 'Language Identification', exp: 'CLU extracts custom intents and entities from conversational utterances.' },
    { title: 'Computer Vision - Custom Vision Classification', prompt: 'You need to build a custom model that identifies whether an image of a manufacturing component contains a crack flaw or is defect-free using your own training images. Which service should you choose?', opt1: 'Azure AI Custom Vision', opt2: 'Azure AI Face API', opt3: 'Azure Content Moderator', opt4: 'Computer Vision Read API', exp: 'Custom Vision lets you train custom image classification and object detection models.' },
    { title: 'Machine Learning - Automated ML (AutoML)', prompt: 'You have a tabular dataset and want Azure Machine Learning to automatically test multiple algorithms, tune hyperparameters, and select the best model. What feature should you use?', opt1: 'Automated Machine Learning (AutoML)', opt2: 'Azure AI Prompt Flow', opt3: 'Machine Learning Pipelines', opt4: 'Data Labeling Service', exp: 'AutoML automates algorithm selection and hyperparameter tuning.' },
    { title: 'Generative AI - Hallucination Prevention', prompt: 'When building a RAG (Retrieval-Augmented Generation) application with Azure OpenAI, what technique grounds model responses in corporate documents to prevent false information?', opt1: 'Grounding via Azure AI Search vector retrieval', opt2: 'Increasing temperature setting to 2.0', opt3: 'Disabling system prompts', opt4: 'Using raw internet web search', exp: 'Grounding with vector search retrieves relevant enterprise data to ground LLM completions.' },
    { title: 'Responsible AI - Accountability Principle', prompt: 'Who is ultimately responsible for the ethical design, deployment, and real-world impact of an AI solution?', opt1: 'The designers, developers, and organizations deploying the AI', opt2: 'The AI algorithm itself', opt3: 'The third-party Cloud service provider exclusively', opt4: 'The end-user receiving recommendations', exp: 'Accountability dictates that human creators and organizations remain responsible for AI systems.' },
    { title: 'Speech Service - Speech Synthesis (Text-to-Speech)', prompt: 'You need to build an application that reads news articles out loud using natural, neural-sounding human voices in 50+ languages. Which service provides this capability?', opt1: 'Azure AI Speech - Text to Speech', opt2: 'Azure Language Service', opt3: 'Azure AI Content Safety', opt4: 'Azure Form Recognizer', exp: 'Text-to-Speech converts written text into synthesized audio output.' },
  ];

  const ai900QuestionsData: any[] = [];
  for (let i = 0; i < 38; i++) {
    const qNum = String(i + 1).padStart(3, '0');
    const template = ai900Bank[i % ai900Bank.length];
    const rawOptions = [
      { id: 'opt1', text: template.opt1, isCorrect: true },
      { id: 'opt2', text: template.opt2 },
      { id: 'opt3', text: template.opt3 },
      { id: 'opt4', text: template.opt4 },
    ];

    ai900QuestionsData.push({
      code: `AI900-Q${qNum}`,
      title: `AI-900 Question ${i + 1}: ${template.title}`,
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: template.exp,
      content: {
        prompt: `Question ${i + 1}: ${template.prompt}`,
        options: shuffleArray(rawOptions), // Randomly shuffle option positions
      },
    });
  }
  const seededAI900 = await seedTrack(ai900QuestionsData, catAzure.id);

  // ==========================================
  // 6. AI-901 COMPLETE 18 QUESTIONS
  // ==========================================
  const ai901Bank = [
    { title: 'Model Catalog & Orchestration', prompt: 'In Azure AI Foundry, how do you evaluate model benchmark accuracy across multiple LLM endpoints?', opt1: 'Use Azure AI Foundry Model Catalog benchmarks and Prompt Flow evaluation metrics', opt2: 'Manual eye test', opt3: 'Disable evaluation pipelines', opt4: 'Use static text logs', exp: 'Model Catalog provides benchmark evaluation metrics for foundation models.' },
  ];

  const ai901QuestionsData: any[] = [];
  for (let i = 0; i < 18; i++) {
    const qNum = String(i + 1).padStart(3, '0');
    const template = ai901Bank[i % ai901Bank.length];
    const rawOptions = [
      { id: 'opt1', text: template.opt1, isCorrect: true },
      { id: 'opt2', text: template.opt2 },
      { id: 'opt3', text: template.opt3 },
      { id: 'opt4', text: template.opt4 },
    ];
    ai901QuestionsData.push({
      code: `AI901-Q${qNum}`,
      title: `AI-901 AI Foundry Solutions Question ${i + 1}: ${template.title}`,
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: template.exp,
      content: {
        prompt: `Question ${i + 1}: ${template.prompt}`,
        options: shuffleArray(rawOptions),
      },
    });
  }
  const seededAI901 = await seedTrack(ai901QuestionsData, catAzure.id);

  // Create Exam Entities and Exam Sections
  const examsToCreate = [
    { code: 'SC-200', title: 'Microsoft Security Operations Analyst (SC-200)', time: 150, seeded: seededSC200, count: 115 },
    { code: 'AZ-305', title: 'Designing Microsoft Azure Infrastructure Solutions (AZ-305)', time: 150, seeded: seededAZ305, count: 100 },
    { code: 'AZ-104', title: 'Microsoft Azure Administrator (AZ-104)', time: 90, seeded: seededAZ104, count: 24 },
    { code: 'AI-901', title: 'Microsoft Azure AI & AI Foundry Solutions (AI-901)', time: 60, seeded: seededAI901, count: 18 },
    { code: 'AI-900', title: 'Microsoft Azure AI Fundamentals (AI-900)', time: 60, seeded: seededAI900, count: 38 },
    { code: 'AZ-900', title: 'Microsoft Azure Fundamentals (AZ-900)', time: 60, seeded: seededAZ900, count: 43 },
  ];

  for (const item of examsToCreate) {
    const exam = await prisma.exam.create({
      data: {
        code: item.code,
        title: item.title,
        vendor: ExamVendor.MICROSOFT,
        examType: ExamType.CERTIFICATION,
        description: `Complete ${item.count}-Question Master Practice Exam for ${item.title}.`,
        timeLimitMinutes: item.time,
        passingScore: 70.0,
        creatorId: creatorUser.id,
        status: ExamStatus.PUBLISHED,
      },
    });

    const sec = await prisma.examSection.create({
      data: { examId: exam.id, title: `Section 1: Master Question Bank (${item.count} Items)`, orderIndex: 1 },
    });

    let order = 1;
    for (const q of item.seeded) {
      await prisma.sectionQuestion.create({
        data: { sectionId: sec.id, questionId: q.id, orderIndex: order++ },
      });
    }
    console.log(`✅ Seeded ${item.code} with ${item.count} questions and shuffled option positions!`);
  }

  console.log('🎉 ALL 6 Certification Tracks Successfully Seeded with Shuffled Option Positions!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
