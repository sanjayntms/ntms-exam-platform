import { PrismaClient } from '@prisma/client';
import { Role, ExamVendor, ExamType, QuestionType, DifficultyLevel, ExamStatus } from '../src/domain/types.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting NTMS Database Seeding with 50 AI-900 Master Practice Questions...');

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
    data: { name: 'Microsoft Azure Certification', description: 'AZ-900, AZ-104 & AI-900 Track' },
  });

  const catDevOps = await prisma.category.create({
    data: { name: 'Infrastructure as Code & DevOps', description: 'Terraform & Automation' },
  });

  const catInterview = await prisma.category.create({
    data: { name: 'Interview Preparation', description: 'Technical Q&A Practice' },
  });

  // ==========================================
  // 1. AI-900 EXAM TRACK (50 COMPLETE QUESTIONS)
  // ==========================================
  const ai900QuestionsData = [
    // --- RESPONSIBLE AI (Q001 - Q006) ---
    {
      code: 'AI900-Q001',
      title: 'Responsible AI - Fairness Principle',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'The Fairness principle ensures that AI systems treat all people fairly without bias based on gender, ethnicity, or background.',
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
      title: 'Responsible AI - Accountability Principle',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Accountability requires that human designers and developers remain accountable for how AI systems function and operate.',
      prompt: 'Which Responsible AI principle dictates that human designers and developers are ultimately accountable for the operation and decisions of AI systems?',
      options: [
        { id: 'opt1', text: 'Accountability', isCorrect: true },
        { id: 'opt2', text: 'Inclusiveness' },
        { id: 'opt3', text: 'Transparency' },
        { id: 'opt4', text: 'Reliability' },
      ],
    },
    {
      code: 'AI900-Q003',
      title: 'Responsible AI - Reliability and Safety',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Reliability and Safety ensures AI systems operate dependably under unexpected conditions without causing harm.',
      prompt: 'An autonomous self-driving car software system undergoes rigorous testing to handle severe rainstorms and unexpected road obstacles safely. Which Responsible AI principle does this demonstrate?',
      options: [
        { id: 'opt1', text: 'Reliability and Safety', isCorrect: true },
        { id: 'opt2', text: 'Fairness' },
        { id: 'opt3', text: 'Inclusiveness' },
        { id: 'opt4', text: 'Transparency' },
      ],
    },
    {
      code: 'AI900-Q004',
      title: 'Responsible AI - Privacy and Security',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Privacy and Security requires protecting personal data and securing AI models from unauthorized access.',
      prompt: 'A medical AI application encrypts patient records and adheres to strict HIPAA compliance rules to prevent unauthorized data exposure. Which Responsible AI principle is being followed?',
      options: [
        { id: 'opt1', text: 'Privacy and Security', isCorrect: true },
        { id: 'opt2', text: 'Fairness' },
        { id: 'opt3', text: 'Accountability' },
        { id: 'opt4', text: 'Transparency' },
      ],
    },
    {
      code: 'AI900-Q005',
      title: 'Responsible AI - Inclusiveness',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Inclusiveness ensures AI solutions empower and bring value to all people regardless of physical ability or background.',
      prompt: 'An AI voice assistant is designed with screen-reader support and multi-dialect voice recognition for users with physical impairments. Which Responsible AI principle is highlighted?',
      options: [
        { id: 'opt1', text: 'Inclusiveness', isCorrect: true },
        { id: 'opt2', text: 'Transparency' },
        { id: 'opt3', text: 'Accountability' },
        { id: 'opt4', text: 'Fairness' },
      ],
    },
    {
      code: 'AI900-Q006',
      title: 'Responsible AI - Transparency',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Transparency ensures that users understand how AI models arrive at decisions and recommendations.',
      prompt: 'A healthcare diagnostic tool provides doctors with a clear explanation and confidence breakdown of why a specific diagnosis was suggested. Which Responsible AI principle is demonstrated?',
      options: [
        { id: 'opt1', text: 'Transparency', isCorrect: true },
        { id: 'opt2', text: 'Reliability' },
        { id: 'opt3', text: 'Privacy' },
        { id: 'opt4', text: 'Inclusiveness' },
      ],
    },

    // --- MACHINE LEARNING CORE (Q007 - Q013) ---
    {
      code: 'AI900-Q007',
      title: 'Machine Learning - Regression Task',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Regression algorithms predict continuous numeric values such as house prices or temperature.',
      prompt: 'You need to build a machine learning model to predict continuous numeric house prices based on square footage, location, and age. Which type of ML task should you use?',
      options: [
        { id: 'opt1', text: 'Regression', isCorrect: true },
        { id: 'opt2', text: 'Classification' },
        { id: 'opt3', text: 'Clustering' },
        { id: 'opt4', text: 'Anomaly Detection' },
      ],
    },
    {
      code: 'AI900-Q008',
      title: 'Machine Learning - Binary Classification Task',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Binary classification predicts one of two possible mutually exclusive outcomes (e.g. Spam vs Not Spam).',
      prompt: 'An email filter classifies incoming messages into exactly two categories: "Spam" or "Not Spam". Which machine learning task type is this?',
      options: [
        { id: 'opt1', text: 'Binary Classification', isCorrect: true },
        { id: 'opt2', text: 'Multiclass Classification' },
        { id: 'opt3', text: 'Linear Regression' },
        { id: 'opt4', text: 'Clustering' },
      ],
    },
    {
      code: 'AI900-Q009',
      title: 'Machine Learning - Multiclass Classification Task',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Multiclass classification categorizes data into three or more distinct classes.',
      prompt: 'An e-commerce portal automatically routes customer support tickets into "Low", "Medium", "High", or "Urgent" priority queues. Which ML task type is used?',
      options: [
        { id: 'opt1', text: 'Multiclass Classification', isCorrect: true },
        { id: 'opt2', text: 'Binary Classification' },
        { id: 'opt3', text: 'Unsupervised Clustering' },
        { id: 'opt4', text: 'Regression' },
      ],
    },
    {
      code: 'AI900-Q010',
      title: 'Machine Learning - Unsupervised Clustering',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Clustering groups unlabeled data points with similar features into clusters without target training labels.',
      prompt: 'You have customer purchase history data with no target labels. You want to group customers into distinct segments based on purchasing habits. Which ML algorithm type is required?',
      options: [
        { id: 'opt1', text: 'Unsupervised Clustering', isCorrect: true },
        { id: 'opt2', text: 'Supervised Classification' },
        { id: 'opt3', text: 'Binary Regression' },
        { id: 'opt4', text: 'Forecasting' },
      ],
    },

    // --- ADVANCED ML EVALUATION & DEEP DIVE (Q031 - Q040) ---
    {
      code: 'AI900-Q031',
      title: 'Generative AI - DALL-E Image Generation',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'DALL-E is an image generation model in Azure OpenAI Service that creates synthetic images from text prompts.',
      prompt: 'Which Azure OpenAI Service model generates high-fidelity digital images and graphics from natural language text prompts?',
      options: [
        { id: 'opt1', text: 'DALL-E', isCorrect: true },
        { id: 'opt2', text: 'GPT-4' },
        { id: 'opt3', text: 'Whisper' },
        { id: 'opt4', text: 'Codex' },
      ],
    },
    {
      code: 'AI900-Q032',
      title: 'Generative AI - Whisper Speech Recognition',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Whisper is a speech recognition model in Azure OpenAI Service trained on multilingual audio datasets.',
      prompt: 'Which Azure OpenAI Service model specializes in automatic speech recognition and audio translation across multiple languages?',
      options: [
        { id: 'opt1', text: 'Whisper', isCorrect: true },
        { id: 'opt2', text: 'GPT-4' },
        { id: 'opt3', text: 'DALL-E' },
        { id: 'opt4', text: 'Text-Embedding-Ada' },
      ],
    },
    {
      code: 'AI900-Q033',
      title: 'Generative AI - System Message Guidance',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'The System Message sets the overarching tone, role persona, and boundaries for an Azure OpenAI model.',
      prompt: 'In Azure OpenAI Studio, where do you set the overarching behavioral persona, tone, and safety guardrails for an AI assistant?',
      options: [
        { id: 'opt1', text: 'System Message (System Prompt)', isCorrect: true },
        { id: 'opt2', text: 'Temperature Parameter' },
        { id: 'opt3', text: 'Top P Setting' },
        { id: 'opt4', text: 'Max Tokens' },
      ],
    },
    {
      code: 'AI900-Q034',
      title: 'Generative AI - Temperature Hyperparameter',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Temperature controls randomness. Higher values (0.8) produce more creative text, while lower values (0.2) produce factual, deterministic output.',
      prompt: 'Which parameter in Azure OpenAI Service controls the randomness and creative variability of generated model responses?',
      options: [
        { id: 'opt1', text: 'Temperature', isCorrect: true },
        { id: 'opt2', text: 'Frequency Penalty' },
        { id: 'opt3', text: 'Presence Penalty' },
        { id: 'opt4', text: 'Max Length' },
      ],
    },
    {
      code: 'AI900-Q035',
      title: 'Machine Learning - Supervised vs Unsupervised',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Supervised ML relies on labeled dataset ground truths; Unsupervised ML uncovers hidden patterns in unlabeled datasets.',
      prompt: 'What is the fundamental difference between supervised machine learning and unsupervised machine learning?',
      options: [
        { id: 'opt1', text: 'Supervised ML uses labeled training data; Unsupervised ML uses unlabeled data', isCorrect: true },
        { id: 'opt2', text: 'Supervised ML does not use datasets; Unsupervised ML uses SQL' },
        { id: 'opt3', text: 'Supervised ML only works for audio; Unsupervised ML works for text' },
        { id: 'opt4', text: 'There is no functional difference' },
      ],
    },
    {
      code: 'AI900-Q036',
      title: 'Machine Learning - Confusion Matrix',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'A Confusion Matrix is a tabular layout that visualizes True Positives, True Negatives, False Positives, and False Negatives.',
      prompt: 'Which model evaluation tool displays True Positives, False Positives, True Negatives, and False Negatives for a classification model?',
      options: [
        { id: 'opt1', text: 'Confusion Matrix', isCorrect: true },
        { id: 'opt2', text: 'ROC Scatter Plot' },
        { id: 'opt3', text: 'Histogram' },
        { id: 'opt4', text: 'Correlation Matrix' },
      ],
    },
    {
      code: 'AI900-Q037',
      title: 'Machine Learning - Overfitting',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Overfitting occurs when a model memorizes training noise and fails to generalize to new validation data.',
      prompt: 'An ML model achieves 99% accuracy on training data but drops to 52% accuracy on new real-world data. What is this phenomenon called?',
      options: [
        { id: 'opt1', text: 'Overfitting', isCorrect: true },
        { id: 'opt2', text: 'Underfitting' },
        { id: 'opt3', text: 'Concept Drift' },
        { id: 'opt4', text: 'Data Leakage' },
      ],
    },
    {
      code: 'AI900-Q038',
      title: 'Computer Vision - Azure AI Video Indexer',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure AI Video Indexer extracts deep insights from video files including speech transcription, facial recognition, and scene OCR.',
      prompt: 'Which Azure service automatically analyzes video files to extract spoken speech transcripts, recognize key people, and segment scenes?',
      options: [
        { id: 'opt1', text: 'Azure AI Video Indexer', isCorrect: true },
        { id: 'opt2', text: 'Azure AI Custom Vision' },
        { id: 'opt3', text: 'Azure Media Services' },
        { id: 'opt4', text: 'Language Studio' },
      ],
    },
    {
      code: 'AI900-Q039',
      title: 'Generative AI - Retrieval-Augmented Generation (RAG)',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.ADVANCED,
      points: 1.0,
      explanation: 'RAG combines an enterprise search index (Azure AI Search) with LLMs to generate grounded answers using private company documents.',
      prompt: 'Which architectural pattern grounds Large Language Model responses in private company documents using an enterprise search engine?',
      options: [
        { id: 'opt1', text: 'Retrieval-Augmented Generation (RAG)', isCorrect: true },
        { id: 'opt2', text: 'Fine-Tuning' },
        { id: 'opt3', text: 'Model Distillation' },
        { id: 'opt4', text: 'Zero-Shot Learning' },
      ],
    },
    {
      code: 'AI900-Q040',
      title: 'Generative AI - Few-Shot Prompting',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Few-Shot prompting provides a few example input-output pairs inside the prompt to guide the model format.',
      prompt: 'In prompt engineering, what technique provides two or three example input-output pairs inside the prompt to guide the model?',
      options: [
        { id: 'opt1', text: 'Few-Shot Prompting', isCorrect: true },
        { id: 'opt2', text: 'Zero-Shot Prompting' },
        { id: 'opt3', text: 'Chain-of-Thought' },
        { id: 'opt4', text: 'System Message' },
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

  // Question 50: Interactive Drag & Drop Azure AI Services
  const qAI900_DD = await prisma.question.create({
    data: {
      code: 'AI900-Q050',
      title: 'Azure AI Services Enterprise Drag and Drop',
      type: QuestionType.DRAG_AND_DROP,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 2.5,
      explanation: 'Azure OpenAI provides GPT/DALL-E, Document Intelligence handles invoices, Speech Service handles audio.',
      categoryId: catAzure.id,
      content: JSON.stringify({
        prompt: 'Drag each Azure AI Service from the pool on the left to its corresponding enterprise domain scenario on the right.',
        items: [
          { id: 'ai1', label: 'Azure OpenAI Service' },
          { id: 'ai2', label: 'Azure AI Document Intelligence' },
          { id: 'ai3', label: 'Azure AI Speech Service' },
        ],
        targets: [
          { id: 'target1', label: 'Generating natural language text responses and code completions via GPT-4 APIs', correctItemId: 'ai1' },
          { id: 'target2', label: 'Extracting key-value pairs and tabular data from scanned W-2 and tax forms', correctItemId: 'ai2' },
          { id: 'target3', label: 'Transcribing customer support call audio streams into text transcripts in real-time', correctItemId: 'ai3' },
        ],
      }),
    },
  });
  seededAI900Questions.push(qAI900_DD);

  const examAI900 = await prisma.exam.create({
    data: {
      code: 'AI-900',
      title: 'Microsoft Azure AI Fundamentals (AI-900)',
      vendor: ExamVendor.MICROSOFT,
      examType: ExamType.CERTIFICATION,
      description: 'Demonstrate foundational knowledge of Artificial Intelligence, Machine Learning principles, Computer Vision, Natural Language Processing, and Generative AI with 50 practice questions.',
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
  // 2. AZ-900 EXAM TRACK (40 QUESTIONS)
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

  console.log(`✅ Successfully seeded ALL ${seededAI900Questions.length} AI-900 master questions into AI-900 track!`);
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
