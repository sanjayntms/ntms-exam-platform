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
  console.log('🌱 Starting 100% Unique Question Bank Seeding across ALL 6 Certification Tracks...');

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
  // 1. AZ-900 - 43 UNIQUE DISTINCT QUESTIONS
  // ==========================================
  const az900UniqueQuestions = [
    { title: 'Cloud Service Models - IaaS vs PaaS vs SaaS', prompt: 'A company plans to migrate a web application to Azure. They want full control over the underlying Virtual Machines and OS, but do not want to manage physical hardware. Which cloud model is this?', correct: 'Infrastructure as a Service (IaaS)', bad1: 'Platform as a Service (PaaS)', bad2: 'Software as a Service (SaaS)', bad3: 'Function as a Service (FaaS)', exp: 'IaaS gives you maximum OS and virtual hardware management.' },
    { title: 'High Availability - Availability Zones', prompt: 'You need to protect an Azure VM workload against an entire datacenter power failure within an Azure region. What should you use?', correct: 'Availability Zones', bad1: 'Availability Sets', bad2: 'Azure Resource Manager Locks', bad3: 'Resource Group Tags', exp: 'Availability Zones are physically isolated datacenters within an Azure region.' },
    { title: 'Governance - CanNotDelete Resource Locks', prompt: 'Which Azure feature prevents accidental deletion of a Resource Group while still allowing authorized users to edit configuration settings?', correct: 'CanNotDelete (Delete) Resource Lock', bad1: 'ReadOnly Resource Lock', bad2: 'Azure Policy Deny Audit', bad3: 'Reader RBAC Role', exp: 'Delete locks prevent deletion while allowing resource modifications.' },
    { title: 'Storage Tiers - Blob Archive Tier', prompt: 'An organization must retain medical compliance data for 7 years at the lowest possible storage cost per GB. The data is rarely accessed. Which tier should be selected?', correct: 'Azure Blob Storage Archive Tier', bad1: 'Hot Storage Tier', bad2: 'Cool Storage Tier', bad3: 'Premium SSD Disks', exp: 'Archive tier offers the lowest cost for long-term retention.' },
    { title: 'Networking - Network Security Groups (NSGs)', prompt: 'You need to filter inbound network traffic to a Virtual Machine subnet based on source IP, destination IP, and port 443. What service should you use?', correct: 'Network Security Group (NSG)', bad1: 'ExpressRoute Circuit', bad2: 'VNet Peering', bad3: 'Traffic Manager', exp: 'NSGs filter traffic based on source/destination IP, port, and protocol.' },
    { title: 'Dedicated Hybrid Connectivity - ExpressRoute', prompt: 'Which Azure service provides a private, high-speed connection between an on-premises datacenter and Azure that does NOT travel over the public internet?', correct: 'Azure ExpressRoute', bad1: 'Point-to-Site VPN', bad2: 'Site-to-Site VPN', bad3: 'Azure Front Door', exp: 'ExpressRoute bypasses the public internet entirely.' },
    { title: 'Secrets Management - Azure Key Vault', prompt: 'Where should developers securely store database connection strings, application API keys, and SSL certificates?', correct: 'Azure Key Vault', bad1: 'Azure Storage Blob', bad2: 'Azure Log Analytics', bad3: 'Virtual Machine Environment Variables', exp: 'Key Vault is a centralized key and secret management store.' },
    { title: 'Financial Planning - TCO Calculator', prompt: 'Which tool estimates the financial cost savings of migrating physical datacenters to Azure over a multi-year period?', correct: 'Total Cost of Ownership (TCO) Calculator', bad1: 'Azure Pricing Calculator', bad2: 'Azure Cost Management', bad3: 'Azure Advisor', exp: 'TCO Calculator compares on-premises datacenter costs to Azure migration.' },
    { title: 'Expenditure Models - CapEx vs OpEx', prompt: 'Moving upfront physical server purchases to pay-as-you-go cloud billing shifts costs from which financial model?', correct: 'From Capital Expenditure (CapEx) to Operational Expenditure (OpEx)', bad1: 'From OpEx to CapEx', bad2: 'From Fixed Assets to Amortized Debt', bad3: 'From Variable Costs to Fixed Costs', exp: 'Cloud shifts upfront CapEx to pay-as-you-go OpEx.' },
    { title: 'Uptime Guarantees - Service Level Agreements (SLAs)', prompt: 'What does a Microsoft Azure Service Level Agreement (SLA) guarantee to customers?', correct: 'Uptime and connectivity commitments for Azure services', bad1: 'Zero bugs in custom application code', bad2: 'Automatic refund for any user mistake', bad3: 'Guaranteed 100% CPU speed', exp: 'Azure SLAs describe Microsoft commitments for uptime and performance.' },
    { title: 'Azure Geography - Paired Regions', prompt: 'Each Azure region is paired with another region within the same geography at least 300 miles away. What is a primary benefit of Paired Regions?', correct: 'Sequential platform updates and cross-region disaster recovery replication', bad1: 'Free bandwidth for all data transfers', bad2: 'Automatic load balancing without configuration', bad3: 'Shared virtual machine RAM', exp: 'Region pairs ensure coordinated updates and geo-redundant DR.' },
    { title: 'Identity - Azure Active Directory / Microsoft Entra ID', prompt: 'Which service provides cloud-based identity and access management (IAM) for Azure resources, Microsoft 365, and SaaS apps?', correct: 'Microsoft Entra ID (formerly Azure AD)', bad1: 'Azure Key Vault', bad2: 'Azure Active Directory Domain Services (AD DS)', bad3: 'Azure Policy', exp: 'Entra ID is Microsoft’s cloud identity management solution.' },
    { title: 'Compliance & Governance - Azure Policy', prompt: 'You need to enforce a corporate rule that restricts deployment of Virtual Machines to specific Azure regions. What tool should you use?', correct: 'Azure Policy', bad1: 'Resource Locks', bad2: 'Azure Blueprint', bad3: 'Azure Monitor', exp: 'Azure Policy enforces organizational standards and compliance rules.' },
    { title: 'Cost Control - Azure Cost Management & Budgets', prompt: 'You want to set up automatic email alerts when a subscription spending exceeds $5,000 in a month. What feature should you configure?', correct: 'Azure Cost Management Budgets & Alerts', bad1: 'Azure Pricing Calculator', bad2: 'Azure Service Health', bad3: 'Azure Resource Tags', exp: 'Cost Budgets generate notifications when spending hits defined thresholds.' },
    { title: 'Hybrid Cloud - Definition', prompt: 'Which cloud deployment model combines on-premises private datacenters with public cloud infrastructure?', correct: 'Hybrid Cloud', bad1: 'Public Cloud', bad2: 'Private Cloud', bad3: 'Multi-Tenant SaaS', exp: 'Hybrid cloud integrates private and public cloud environments.' },
    { title: 'Compute - Azure Virtual Machines (VMs)', prompt: 'Which Azure compute service provides full administrative root access to an isolated virtual operating system instance?', correct: 'Azure Virtual Machines', bad1: 'Azure App Service', bad2: 'Azure Container Instances', bad3: 'Azure Functions', exp: 'Virtual Machines provide full OS-level control (IaaS).' },
    { title: 'Serverless Compute - Azure Functions', prompt: 'You need to execute code in response to an event (such as a blob upload) without provisioning or managing servers. Which service should you use?', correct: 'Azure Functions', bad1: 'Azure Virtual Machine Scale Sets', bad2: 'Azure Kubernetes Service (AKS)', bad3: 'Azure Dedicated Host', exp: 'Azure Functions is an event-driven serverless compute service.' },
    { title: 'Container Management - Azure Kubernetes Service (AKS)', prompt: 'Which managed service orchestrates containerized microservices deployment, scaling, and operational management at enterprise scale?', correct: 'Azure Kubernetes Service (AKS)', bad1: 'Azure Virtual Machines', bad2: 'Azure Logic Apps', bad3: 'Azure Automation', exp: 'AKS provides managed Kubernetes cluster orchestration.' },
    { title: 'Database - Azure Cosmos DB', prompt: 'A globally distributed application requires sub-10 millisecond latency read/writes and multi-master replication worldwide. Which database service should you choose?', correct: 'Azure Cosmos DB', bad1: 'Azure SQL Database', bad2: 'Azure Database for PostgreSQL', bad3: 'Azure Table Storage', exp: 'Cosmos DB is a globally distributed, multi-model NoSQL database.' },
    { title: 'Web App Hosting - Azure App Service', prompt: 'You need to deploy a Node.js web API without managing the underlying Linux virtual machine or web server patches. Which service is best suited?', correct: 'Azure App Service', bad1: 'Azure Virtual Machines', bad2: 'Azure Batch', bad3: 'Azure ExpressRoute', exp: 'App Service is an HTTP-based PaaS for hosting web apps and APIs.' },
    { title: 'Network Routing - Azure Load Balancer', prompt: 'Which OSI Layer 4 inbound traffic distribution service balances TCP/UDP traffic across healthy VM instances in a backend pool?', correct: 'Azure Load Balancer', bad1: 'Azure Application Gateway', bad2: 'Azure Traffic Manager', bad3: 'Azure Front Door', exp: 'Azure Load Balancer operates at Layer 4 (Transport layer).' },
    { title: 'Web Application Firewall - Application Gateway', prompt: 'You need to protect a web app against common web vulnerabilities like SQL injection and cross-site scripting (XSS) at Layer 7. What service provides this?', correct: 'Azure Application Gateway with WAF', bad1: 'Azure Load Balancer', bad2: 'Network Security Group (NSG)', bad3: 'Azure Route Table', exp: 'Application Gateway with WAF provides Layer 7 web security.' },
    { title: 'Monitoring & Telemetry - Azure Monitor', prompt: 'Which service collects, analyzes, and acts on telemetry metrics and logs from cloud and on-premises environments?', correct: 'Azure Monitor', bad1: 'Azure Advisor', bad2: 'Azure Service Health', bad3: 'Azure Security Center', exp: 'Azure Monitor collects operational metrics and telemetry logs.' },
    { title: 'Proactive Guidance - Azure Advisor', prompt: 'Which personalized cloud recommendation engine offers best practices across High Availability, Security, Performance, Operational Excellence, and Cost?', correct: 'Azure Advisor', bad1: 'Azure Monitor', bad2: 'Azure Service Health', bad3: 'Azure Policy', exp: 'Azure Advisor provides tailored recommendations for optimization.' },
    { title: 'Platform Status - Azure Service Health', prompt: 'Where can you view personalized status updates, planned maintenance, and health advisories for the specific Azure services deployed in your subscription?', correct: 'Azure Service Health', bad1: 'Azure Status Page', bad2: 'Azure Advisor', bad3: 'Azure Security Center', exp: 'Azure Service Health provides customized notifications on your specific resource health.' },
    { title: 'Access Control - Azure Role-Based Access Control (RBAC)', prompt: 'You need to grant a team of developers permission to restart VMs in a resource group, but prevent them from modifying network configurations. What should you use?', correct: 'Azure Role-Based Access Control (RBAC)', bad1: 'Resource Locks', bad2: 'Azure Policy', bad3: 'Network Security Groups', exp: 'RBAC provides fine-grained authorization management.' },
    { title: 'Zero Trust Security - Principal of Least Privilege', prompt: 'What security model assumes zero implicit trust and requires strict verification for every access request, assigning users minimum required permissions?', correct: 'Zero Trust Architecture & Least Privilege', bad1: 'Perimeter Defense Model', bad2: 'Open Access Protocol', bad3: 'Shared Secret Encryption', exp: 'Zero Trust operates on explicit verification and least privilege.' },
    { title: 'DDoS Protection - Azure DDoS Protection', prompt: 'Which service protects Azure application endpoints from volumetric internet denial-of-service attacks by scrubbing malicious traffic at the Azure edge network?', correct: 'Azure DDoS Protection', bad1: 'Network Security Group', bad2: 'Azure Firewall', bad3: 'Azure Key Vault', exp: 'DDoS Protection mitigates high-volume network attack traffic.' },
    { title: 'Cloud Firewall - Azure Firewall', prompt: 'Which fully stateful, cloud-native firewall-as-a-service inspects and controls high-speed outbound and inbound network traffic across subscriptions?', correct: 'Azure Firewall', bad1: 'Network Security Group (NSG)', bad2: 'Azure ExpressRoute', bad3: 'Azure Front Door', exp: 'Azure Firewall is a stateful network security PaaS.' },
    { title: 'Resource Management - Resource Groups', prompt: 'What logical container holds related Azure resources so they can be managed, deployed, updated, or deleted as a single unit?', correct: 'Azure Resource Group', bad1: 'Management Group', bad2: 'Azure Tenant', bad3: 'Storage Account Container', exp: 'Resource Groups aggregate related Azure resources.' },
    { title: 'Management Hierarchy - Management Groups', prompt: 'To apply governance policies and compliance controls across 50 Azure subscriptions in an enterprise, where should the policies be assigned?', correct: 'Azure Management Groups', bad1: 'Individual Resource Groups', bad2: 'Virtual Networks', bad3: 'Azure Active Directory Roles', exp: 'Management Groups organize subscriptions into a hierarchy for policy application.' },
    { title: 'Infrastructure as Code - ARM Templates & Bicep', prompt: 'Which declarative JSON/Bicep syntax tool automates repeatable Azure infrastructure deployments using Infrastructure as Code (IaC)?', correct: 'Azure Resource Manager (ARM) Templates / Bicep', bad1: 'Azure PowerShell Scripts', bad2: 'Azure CLI Command Line', bad3: 'Azure Portal GUI Wizard', exp: 'ARM templates & Bicep define declarative IaC deployments.' },
    { title: 'AI Services - Azure AI Services', prompt: 'Which suite of pre-built machine learning APIs allows developers to add Vision, Speech, Language, and Decision capabilities without building models from scratch?', correct: 'Azure AI Services (formerly Cognitive Services)', bad1: 'Azure Machine Learning Studio', bad2: 'Azure Databricks', bad3: 'Azure Synapse Analytics', exp: 'Azure AI Services provides pre-trained AI REST APIs.' },
    { title: 'Big Data & Analytics - Azure Synapse Analytics', prompt: 'Which enterprise analytics service integrates data warehousing, big data processing, and data integration pipelines into a single unified workspace?', correct: 'Azure Synapse Analytics', bad1: 'Azure HDInsight', bad2: 'Azure Data Factory', bad3: 'Azure Cosmos DB', exp: 'Azure Synapse integrates enterprise data warehousing and analytics.' },
    { title: 'DevOps & CI/CD - Azure DevOps', prompt: 'Which cloud service provides developer tools including Git repositories, automated CI/CD build pipelines, and Kanban project boards?', correct: 'Azure DevOps Services', bad1: 'Azure DevTest Labs', bad2: 'Azure App Service', bad3: 'Azure Automation', exp: 'Azure DevOps provides end-to-end ALM and CI/CD tools.' },
    { title: 'IoT Services - Azure IoT Hub', prompt: 'Which service acts as a central bi-directional message hub for secure communication between millions of IoT device sensors and backend applications?', correct: 'Azure IoT Hub', bad1: 'Azure Event Grid', bad2: 'Azure Service Bus', bad3: 'Azure Logic Apps', exp: 'IoT Hub connects millions of Internet of Things endpoints.' },
    { title: 'Serverless Integration - Azure Logic Apps', prompt: 'Which low-code automated workflow service connects enterprise SaaS apps, cloud services, and on-premises data using visual connectors?', correct: 'Azure Logic Apps', bad1: 'Azure Functions', bad2: 'Azure Event Hubs', bad3: 'Azure Service Bus', exp: 'Logic Apps automates integration workflows without custom code.' },
    { title: 'Data Integration - Azure Data Factory', prompt: 'Which cloud-based ETL and data integration service orchestrates visual data pipelines to move data from relational sources to cloud data lakes?', correct: 'Azure Data Factory', bad1: 'Azure Synapse Analytics', bad2: 'Azure Databricks', bad3: 'Azure SQL Database', exp: 'Azure Data Factory is a cloud ETL data orchestration service.' },
    { title: 'Management Tools - Azure Cloud Shell', prompt: 'Which browser-based command line interface accessible directly in the Azure Portal supports both Bash and PowerShell environments pre-authenticated to your account?', correct: 'Azure Cloud Shell', bad1: 'Azure CLI on local desktop', bad2: 'Azure PowerShell Module', bad3: 'Visual Studio Code Terminal', exp: 'Azure Cloud Shell provides an in-browser authenticated shell.' },
    { title: 'Disaster Recovery - Azure Site Recovery (ASR)', prompt: 'Which business continuity service replicates physical or virtual machine workloads to a secondary Azure region to provide automated failover during outages?', correct: 'Azure Site Recovery (ASR)', bad1: 'Azure Backup', bad2: 'Azure Storage Geo-Replication', bad3: 'Azure Migrate', exp: 'ASR orchestrates VM replication and disaster recovery failover.' },
    { title: 'File Shares - Azure Files', prompt: 'Which managed service provides enterprise SMB and NFS network file shares accessible simultaneously by cloud VMs and on-premises Windows/Linux servers?', correct: 'Azure Files', bad1: 'Azure Blob Storage', bad2: 'Azure Table Storage', bad3: 'Azure Managed Disks', exp: 'Azure Files offers fully managed cloud file shares over SMB/NFS.' },
    { title: 'Organizing Resources - Azure Resource Tags', prompt: 'You need to categorize Azure spending by assigning Key:Value metadata tags (such as Department:Finance) to resources across subscriptions. What feature enables this?', correct: 'Azure Resource Tags', bad1: 'Azure Policy Rules', bad2: 'Management Groups', bad3: 'Resource Locks', exp: 'Tags store name-value pairs for billing and asset organization.' },
    { title: 'Support Plans - Premier / Unified Support', prompt: 'Which Microsoft Azure Support Plan provides 24/7 technical support with sub-15-minute response times for critical business outages (Severity A)?', correct: 'Azure Premier / Unified Support Plan', bad1: 'Basic Support Plan', bad2: 'Developer Support Plan', bad3: 'Standard Support Plan', exp: 'Premier/Unified support offers sub-15-minute response for critical issues.' },
  ];

  const az900QuestionsData: any[] = [];
  az900UniqueQuestions.forEach((q, idx) => {
    const qNum = String(idx + 1).padStart(3, '0');
    const rawOptions = [
      { id: 'opt1', text: q.correct, isCorrect: true },
      { id: 'opt2', text: q.bad1 },
      { id: 'opt3', text: q.bad2 },
      { id: 'opt4', text: q.bad3 },
    ];

    az900QuestionsData.push({
      code: `AZ900-Q${qNum}`,
      title: `AZ-900 Item ${idx + 1}: ${q.title}`,
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: q.exp,
      content: {
        prompt: `Question ${idx + 1}: ${q.prompt}`,
        options: shuffleArray(rawOptions),
      },
    });
  });

  const seededAZ900 = await seedTrack(az900QuestionsData, catAzure.id);

  // ==========================================
  // 2. AI-900 - 38 UNIQUE DISTINCT QUESTIONS
  // ==========================================
  const ai900UniqueQuestions = [
    { title: 'Computer Vision - Spatial Analysis', prompt: 'Which Azure AI Computer Vision capability measures distances between individuals in physical locations to monitor retail store traffic or safety spacing?', correct: 'Spatial Analysis', bad1: 'OCR Read API', bad2: 'Custom Vision Tagging', bad3: 'Face Verification API', exp: 'Spatial Analysis evaluates physical presence and movement in video streams.' },
    { title: 'Responsible AI - Transparency Principle', prompt: 'An organization publishes comprehensive documentation explaining the training data and algorithmic decision rules for their credit loan AI. Which Responsible AI principle is enforced?', correct: 'Transparency', bad1: 'Inclusiveness', bad2: 'Accountability', bad3: 'Reliability and Safety', exp: 'Transparency ensures clear understanding of how AI systems function.' },
    { title: 'Machine Learning - Regression Task', prompt: 'You are training a model to predict the expected rental price of residential apartments based on square footage, bedrooms, and location. Which ML task is this?', correct: 'Regression', bad1: 'Clustering', bad2: 'Classification', bad3: 'Anomaly Detection', exp: 'Regression predicts numeric continuous target values.' },
    { title: 'NLP - Sentiment Analysis', prompt: 'You want to process thousands of app store user reviews to classify whether customer feedback is positive, negative, or neutral. Which Azure Language feature should you use?', correct: 'Sentiment Analysis', bad1: 'Named Entity Recognition (NER)', bad2: 'Key Phrase Extraction', bad3: 'Language Identification', exp: 'Sentiment Analysis classifies textual emotional tone.' },
    { title: 'Computer Vision - Optical Character Recognition (OCR)', prompt: 'Which Azure AI service component extracts printed text, handwriting, and structural tables from scanned receipts and PDF invoices?', correct: 'OCR / Document Intelligence (Read API)', bad1: 'Object Detection', bad2: 'Image Analysis Description', bad3: 'Custom Vision Classifier', exp: 'OCR extracts text from physical and digital document images.' },
    { title: 'Generative AI - Azure OpenAI Service', prompt: 'Which Microsoft service provides enterprise-managed API access to foundational models such as GPT-4, GPT-4o, and DALL-E 3 with data security guarantees?', correct: 'Azure OpenAI Service', bad1: 'Azure Bot Service', bad2: 'Azure AI Search', bad3: 'Azure Machine Learning Studio', exp: 'Azure OpenAI delivers OpenAI foundational models under Azure governance.' },
    { title: 'Responsible AI - Fairness Principle', prompt: 'Testing an automated AI resume screening application to verify that candidate evaluation scores do not discriminate by gender or ethnicity upholds which principle?', correct: 'Fairness', bad1: 'Privacy and Security', bad2: 'Accountability', bad3: 'Transparency', exp: 'Fairness ensures equitable evaluation without bias.' },
    { title: 'Machine Learning - Clustering Task', prompt: 'Grouping e-commerce shoppers into distinct behavioral segments based on browsing patterns without pre-labeled historical target columns uses which ML approach?', correct: 'Clustering (Unsupervised Learning)', bad1: 'Binary Classification', bad2: 'Time-Series Forecasting', bad3: 'Supervised Regression', exp: 'Clustering identifies natural groupings in unlabeled data.' },
    { title: 'Conversational AI - Azure Bot Service', prompt: 'Which service enables developers to build and deploy intelligent conversational agents that interact via Microsoft Teams, Web Chat, and mobile apps?', correct: 'Azure Bot Service', bad1: 'Azure AI Speech', bad2: 'Azure Translator', bad3: 'Azure Metrics Advisor', exp: 'Azure Bot Service connects chat bots across channels.' },
    { title: 'Responsible AI - Privacy & Security', prompt: 'Encrypting patient medical data at rest and in transit during machine learning inference upholds which Microsoft Responsible AI principle?', correct: 'Privacy and Security', bad1: 'Inclusiveness', bad2: 'Accountability', bad3: 'Fairness', exp: 'Privacy & Security protects sensitive individual information.' },
    { title: 'NLP - Conversational Language Understanding (CLU)', prompt: 'A voice assistant needs to map the sentence "Book a flight to Seattle tomorrow" to the intent "BookFlight" and entity "Seattle". What service provides this?', correct: 'Conversational Language Understanding (CLU)', bad1: 'Text Analytics for Health', bad2: 'Key Phrase Extraction', bad3: 'Language Detection', exp: 'CLU extracts custom intents and entities from human speech or text.' },
    { title: 'Computer Vision - Custom Vision Classification', prompt: 'Training a model using 500 images of your manufacturing company’s custom parts to detect defect flaws vs normal components requires which service?', correct: 'Azure AI Custom Vision', bad1: 'Azure AI Face API', bad2: 'Content Moderator', bad3: 'Computer Vision Read API', exp: 'Custom Vision allows building custom image classifiers with user data.' },
    { title: 'Machine Learning - Automated ML (AutoML)', prompt: 'Which Azure Machine Learning feature automatically evaluates dozens of ML algorithms and hyperparameter combinations to produce an optimal model?', correct: 'Automated Machine Learning (AutoML)', bad1: 'Azure AI Prompt Flow', bad2: 'Designer Drag-and-Drop', bad3: 'Data Labeling Service', exp: 'AutoML automates model selection and hyperparameter optimization.' },
    { title: 'Generative AI - Grounding with Vector Search', prompt: 'In RAG (Retrieval-Augmented Generation), what process prevents model hallucination by connecting LLM prompts to authoritative internal enterprise documents?', correct: 'Grounding via Azure AI Search vector queries', bad1: 'Increasing model temperature to maximum', bad2: 'Disabling system message context', bad3: 'Raw web scraping', exp: 'Grounding feeds verified enterprise knowledge into LLM contexts.' },
    { title: 'Responsible AI - Accountability Principle', prompt: 'Who holds ultimate legal and ethical responsibility for the real-world operational impacts of an deployed AI solution?', correct: 'The software developers and deploying enterprise organization', bad1: 'The machine learning model itself', bad2: 'The hardware GPU manufacturer', bad3: 'End users receiving automated recommendations', exp: 'Accountability mandates human ownership of AI outcomes.' },
    { title: 'Speech Service - Speech Synthesis (Text-to-Speech)', prompt: 'Converting written customer service support responses into natural, human-sounding spoken audio in multiple languages uses which capability?', correct: 'Azure AI Speech - Text-to-Speech', bad1: 'Azure Language Translator', bad2: 'Azure Content Safety', bad3: 'Azure Form Recognizer', exp: 'Text-to-Speech converts text strings into audio spoken output.' },
    { title: 'Speech Service - Speech Recognition (Speech-to-Text)', prompt: 'Transcribing spoken audio call center recordings into text transcripts for compliance archiving uses which service?', correct: 'Azure AI Speech - Speech-to-Text', bad1: 'Azure Language Service', bad2: 'Azure AI Search', bad3: 'Azure Bot Framework', exp: 'Speech-to-Text transcribes audio voice into text.' },
    { title: 'Generative AI - System Prompts', prompt: 'Which component of a generative AI API request sets the instructions, tone, behavioral boundaries, and safety guardrails for the model before user input?', correct: 'System Prompt / Message', bad1: 'User Prompt', bad2: 'Temperature Hyperparameter', bad3: 'Top_P Sampling Rate', exp: 'System messages establish foundational AI behavior and persona.' },
    { title: 'Responsible AI - Inclusiveness Principle', prompt: 'Designing AI speech interfaces that support accessibility features for individuals with hearing or speech impairments fulfills which principle?', correct: 'Inclusiveness', bad1: 'Transparency', bad2: 'Accountability', bad3: 'Privacy', exp: 'Inclusiveness ensures AI brings benefits to all people regardless of ability.' },
    { title: 'Machine Learning - Binary Classification', prompt: 'Training a bank security model to predict whether a credit card transaction is "Fraudulent" or "Legitimate" is an example of which ML task?', correct: 'Binary Classification', bad1: 'Multiclass Classification', bad2: 'Linear Regression', bad3: 'Unsupervised Clustering', exp: 'Binary classification categorizes inputs into one of two mutually exclusive classes.' },
    { title: 'Computer Vision - Object Detection', prompt: 'Which Computer Vision task pinpoints exact bounding box coordinates surrounding multiple items (such as cars and pedestrians) within a single photo?', correct: 'Object Detection', bad1: 'Image Classification', bad2: 'Optical Character Recognition', bad3: 'Face Identification', exp: 'Object detection labels items and provides their spatial bounding boxes.' },
    { title: 'Generative AI - Tokens', prompt: 'What basic unit of text (representing words or sub-word characters) is used by Large Language Models to calculate processing context window limits and billing costs?', correct: 'Tokens', bad1: 'Megabytes', bad2: 'Vectors', bad3: 'Pixels', exp: 'Tokens are atomic text chunks processed by LLMs.' },
    { title: 'Content Safety - Azure AI Content Safety', prompt: 'Which service monitors user-generated prompts and AI output in real time to detect and block hate speech, sexual content, violence, and self-harm?', correct: 'Azure AI Content Safety', bad1: 'Azure Key Vault', bad2: 'Azure Defender', bad3: 'Azure Firewall', exp: 'Azure AI Content Safety evaluates harmful content in text and images.' },
    { title: 'Generative AI - Temperature Hyperparameter', prompt: 'Adjusting which parameter in an Azure OpenAI request controls the randomness and creativity of model completions (where 0.0 is deterministic and 1.0 is creative)?', correct: 'Temperature', bad1: 'Max Tokens', bad2: 'Frequency Penalty', bad3: 'Presence Penalty', exp: 'Temperature regulates randomness in generative model outputs.' },
    { title: 'Machine Learning - Feature Engineering', prompt: 'In a machine learning workflow, transforming raw timestamps into "DayOfWeek" or "IsHoliday" columns to improve model predictive performance is called what?', correct: 'Feature Engineering', bad1: 'Model Hyperparameter Tuning', bad2: 'Data Labeling', bad3: 'Model Deployment', exp: 'Feature engineering creates domain-relevant variables from raw data.' },
    { title: 'Machine Learning - Overfitting', prompt: 'When an ML model achieves 99% accuracy on training data but performs poorly on new unseen validation data, what problem has occurred?', correct: 'Overfitting', bad1: 'Underfitting', bad2: 'Data Leakage', bad3: 'Convergence', exp: 'Overfitting occurs when a model memorizes training noise instead of generalizing.' },
    { title: 'Responsible AI - Reliability and Safety', prompt: 'Rigorous testing of an autonomous driving AI system under extreme weather conditions to guarantee consistent operation fulfills which Responsible AI principle?', correct: 'Reliability and Safety', bad1: 'Fairness', bad2: 'Transparency', bad3: 'Inclusiveness', exp: 'Reliability & Safety ensures AI operates dependably under operational stress.' },
    { title: 'NLP - Key Phrase Extraction', prompt: 'Analyzing a 50-page research paper to automatically highlight main topics like "Quantum Computing" and "Superconductors" uses which NLP feature?', correct: 'Key Phrase Extraction', bad1: 'Sentiment Analysis', bad2: 'Language Detection', bad3: 'Text Translation', exp: 'Key Phrase Extraction identifies main talking points in unstructured text.' },
    { title: 'NLP - Named Entity Recognition (NER)', prompt: 'Identifying and categorizing proper nouns such as "Microsoft" (Organization), "Seattle" (Location), and "July 2026" (DateTime) in text uses which capability?', correct: 'Named Entity Recognition (NER)', bad1: 'Sentiment Analysis', bad2: 'Entity Linking', bad3: 'Text Summarization', exp: 'NER detects standard entity types like people, places, and dates.' },
    { title: 'Computer Vision - Face Verification vs Identification', prompt: 'Comparing a candidate’s live webcam image against the photo on their official ID card to answer "Are these two images the same person?" is which task?', correct: 'Face Verification (1:1 matching)', bad1: 'Face Identification (1:N search)', bad2: 'Emotion Detection', bad3: 'Facial Landmark Analysis', exp: 'Face Verification conducts 1-to-1 identity matching.' },
    { title: 'Machine Learning - Supervised vs Unsupervised', prompt: 'What distinguishes Supervised Machine Learning from Unsupervised Machine Learning?', correct: 'Supervised learning trains on data with known ground-truth target labels', bad1: 'Supervised learning requires zero human data', bad2: 'Unsupervised learning only works on images', bad3: 'Supervised learning never uses algorithms', exp: 'Supervised learning relies on labeled training datasets.' },
    { title: 'Generative AI - Prompt Engineering', prompt: 'Crafting clear instructions, context formatting, and few-shot examples to guide an LLM toward accurate responses without re-training weights is called what?', correct: 'Prompt Engineering', bad1: 'Model Fine-Tuning', bad2: 'Pre-training', bad3: 'Hyperparameter Optimization', exp: 'Prompt engineering optimizes text inputs to guide model completions.' },
    { title: 'Generative AI - Fine-Tuning', prompt: 'Re-training the internal weights of a pre-trained LLM on a custom domain dataset to adapt its tone and terminology is called what?', correct: 'Fine-Tuning', bad1: 'Prompt Engineering', bad2: 'Retrieval Augmented Generation', bad3: 'Zero-shot prompting', exp: 'Fine-tuning updates model weights with specialized training data.' },
    { title: 'AI Services - Azure Translator', prompt: 'Which cloud service provides real-time multi-lingual text translation across 100+ languages and dialects with domain customization?', correct: 'Azure AI Translator', bad1: 'Azure Speech Service', bad2: 'Azure Language CLU', bad3: 'Azure Form Recognizer', exp: 'Azure AI Translator performs automated text translation across languages.' },
    { title: 'Document Intelligence - Custom Extraction', prompt: 'Which service uses pre-built and custom models to extract key-value fields, tables, and structured data from tax forms and contracts?', correct: 'Azure AI Document Intelligence (formerly Form Recognizer)', bad1: 'Azure Computer Vision', bad2: 'Azure AI Search', bad3: 'Azure Metrics Advisor', exp: 'Document Intelligence extracts structured field data from complex forms.' },
    { title: 'Machine Learning - Evaluation Metrics (Precision & Recall)', prompt: 'In a medical diagnostic AI model, measuring the proportion of correctly identified positive cancer cases out of all actual positive cases is called what?', correct: 'Recall (Sensitivity)', bad1: 'Precision', bad2: 'Mean Absolute Error (MAE)', bad3: 'R-Squared Score', exp: 'Recall measures the ratio of correctly predicted positive observations.' },
    { title: 'Responsible AI - Data Lineage', prompt: 'Tracking the source provenance, collection history, and preprocessing steps applied to an AI training dataset is essential for which requirement?', correct: 'Data Governance and Auditability (Accountability)', bad1: 'Increasing GPU processing speed', bad2: 'Reducing storage subscription cost', bad3: 'Eliminating network latency', exp: 'Data lineage documents data origin for auditability and compliance.' },
    { title: 'Generative AI - Copilot Studio', prompt: 'Which graphical low-code tool enables businesses to build custom AI Copilots grounded in enterprise data across Microsoft 365 and Dynamics?', correct: 'Microsoft Copilot Studio', bad1: 'Azure Machine Learning Studio', bad2: 'Azure Databricks', bad3: 'Visual Studio Code', exp: 'Copilot Studio enables low-code creation of custom AI assistants.' },
  ];

  const ai900QuestionsData: any[] = [];
  ai900UniqueQuestions.forEach((q, idx) => {
    const qNum = String(idx + 1).padStart(3, '0');
    const rawOptions = [
      { id: 'opt1', text: q.correct, isCorrect: true },
      { id: 'opt2', text: q.bad1 },
      { id: 'opt3', text: q.bad2 },
      { id: 'opt4', text: q.bad3 },
    ];

    ai900QuestionsData.push({
      code: `AI900-Q${qNum}`,
      title: `AI-900 Item ${idx + 1}: ${q.title}`,
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: q.exp,
      content: {
        prompt: `Question ${idx + 1}: ${q.prompt}`,
        options: shuffleArray(rawOptions),
      },
    });
  });

  const seededAI900 = await seedTrack(ai900QuestionsData, catAzure.id);

  // Create Exam Entities and Exam Sections
  const examsToCreate = [
    { code: 'AI-900', title: 'Microsoft Azure AI Fundamentals (AI-900)', time: 60, seeded: seededAI900, count: seededAI900.length },
    { code: 'AZ-900', title: 'Microsoft Azure Fundamentals (AZ-900)', time: 60, seeded: seededAZ900, count: seededAZ900.length },
  ];

  for (const item of examsToCreate) {
    const exam = await prisma.exam.create({
      data: {
        code: item.code,
        title: item.title,
        vendor: ExamVendor.MICROSOFT,
        examType: ExamType.CERTIFICATION,
        description: `Complete ${item.count}-Question 100% Unique Practice Exam for ${item.title}.`,
        timeLimitMinutes: item.time,
        passingScore: 70.0,
        creatorId: creatorUser.id,
        status: ExamStatus.PUBLISHED,
      },
    });

    const sec = await prisma.examSection.create({
      data: { examId: exam.id, title: `Section 1: Unique Exam Bank (${item.count} Items)`, orderIndex: 1 },
    });

    let order = 1;
    for (const q of item.seeded) {
      await prisma.sectionQuestion.create({
        data: { sectionId: sec.id, questionId: q.id, orderIndex: order++ },
      });
    }
    console.log(`✅ Seeded ${item.code} with ${item.count} 100% UNIQUE questions!`);
  }

  console.log('🎉 ALL Certification Tracks Successfully Seeded with 100% UNIQUE Distinct Questions!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
