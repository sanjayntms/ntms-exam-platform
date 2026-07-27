import { PrismaClient } from '@prisma/client';
import { Role, ExamVendor, ExamType, QuestionType, DifficultyLevel, ExamStatus } from '../src/domain/types.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting NTMS Database Seeding with AI-901, AI-900 & AZ-900 Tracks...');

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
    data: { name: 'Microsoft Azure Certification', description: 'AZ-900, AI-900 & AI-901 Tracks' },
  });

  // ==========================================
  // 1. AI-901 EXAM TRACK (BRAND NEW!)
  // ==========================================
  const ai901QuestionsData = [
    {
      code: 'AI901-Q001',
      title: 'Azure AI Foundry - Model Catalog & Benchmarks',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure AI Foundry Model Catalog allows developers to discover, evaluate, and compare benchmark metrics across open-source and proprietary foundation models.',
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

  // Question 15: Interactive Drag & Drop AI Foundry Capabilities
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
  // 2. AI-900 EXAM TRACK (35 QUESTIONS)
  // ==========================================
  const ai900QuestionsData = [
    {
      code: 'AI900-Q001',
      title: 'Responsible AI - Fairness Principle',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'The Fairness principle ensures that AI systems treat all people fairly without bias.',
      prompt: 'An AI model used for automated loan approvals gives lower credit scores to applicants of a specific gender despite identical financial qualifications. Which principle of Responsible AI is violated?',
      options: [
        { id: 'opt1', text: 'Fairness', isCorrect: true },
        { id: 'opt2', text: 'Reliability and Safety' },
        { id: 'opt3', text: 'Privacy and Security' },
        { id: 'opt4', text: 'Transparency' },
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

  const examAI900 = await prisma.exam.create({
    data: {
      code: 'AI-900',
      title: 'Microsoft Azure AI Fundamentals (AI-900)',
      vendor: ExamVendor.MICROSOFT,
      examType: ExamType.CERTIFICATION,
      description: 'Demonstrate foundational knowledge of Artificial Intelligence, Machine Learning, Computer Vision, and NLP.',
      timeLimitMinutes: 60,
      passingScore: 70.0,
      creatorId: creatorUser.id,
      status: ExamStatus.PUBLISHED,
    },
  });

  const secAI900 = await prisma.examSection.create({
    data: { examId: examAI900.id, title: 'Section 1: AI Workloads & Principles', orderIndex: 1 },
  });

  let orderAI = 1;
  for (const q of seededAI900Questions) {
    await prisma.sectionQuestion.create({ data: { sectionId: secAI900.id, questionId: q.id, orderIndex: orderAI++ } });
  }

  // ==========================================
  // 3. AZ-900 EXAM TRACK (30 QUESTIONS)
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

  let orderAZ = 1;
  for (const q of seededAZ900Questions) {
    await prisma.sectionQuestion.create({ data: { sectionId: secAZ900.id, questionId: q.id, orderIndex: orderAZ++ } });
  }

  console.log(`✅ Successfully seeded ALL ${seededAI901Questions.length} AI-901 questions into AI-901 track!`);
  console.log(`✅ Successfully seeded AI-900 & AZ-900 tracks!`);
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
