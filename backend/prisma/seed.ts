import { PrismaClient } from '@prisma/client';
import { Role, ExamVendor, ExamType, QuestionType, DifficultyLevel, ExamStatus } from '../src/domain/types.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting NTMS Database Seeding with 30 AI-900 Practice Questions...');

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
  // 1. AI-900 EXAM TRACK (30 COMPLETE QUESTIONS)
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

    // --- MACHINE LEARNING FUNDAMENTALS (Q007 - Q013) ---
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
    {
      code: 'AI900-Q011',
      title: 'Machine Learning - Anomaly Detection',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Anomaly detection identifies unusual events or patterns that deviate significantly from expected normal behavior.',
      prompt: 'A bank monitors credit card transactions in real-time to flag unusual spending activity that deviates from typical customer behavior. Which ML capability is used?',
      options: [
        { id: 'opt1', text: 'Anomaly Detection', isCorrect: true },
        { id: 'opt2', text: 'Image Classification' },
        { id: 'opt3', text: 'Linear Regression' },
        { id: 'opt4', text: 'Speech Synthesis' },
      ],
    },
    {
      code: 'AI900-Q012',
      title: 'Azure Automated Machine Learning (AutoML)',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'AutoML automates model development by systematically training and tuning multiple algorithms simultaneously.',
      prompt: 'You want to train an optimal machine learning model without writing custom code by letting Azure automatically test multiple algorithms and hyperparameters. Which feature should you use?',
      options: [
        { id: 'opt1', text: 'Automated Machine Learning (AutoML)', isCorrect: true },
        { id: 'opt2', text: 'Azure Machine Learning Designer' },
        { id: 'opt3', text: 'Jupyter Notebooks' },
        { id: 'opt4', text: 'Azure Batch' },
      ],
    },
    {
      code: 'AI900-Q013',
      title: 'Azure Machine Learning Designer Visual Canvas',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure ML Designer provides a drag-and-drop visual interactive canvas to build, test, and deploy machine learning models.',
      prompt: 'A data science team wants to construct an end-to-end machine learning workflow using a drag-and-drop visual interface. Which tool in Azure ML Studio should they use?',
      options: [
        { id: 'opt1', text: 'Azure Machine Learning Designer', isCorrect: true },
        { id: 'opt2', text: 'Automated ML' },
        { id: 'opt3', text: 'VS Code Extension' },
        { id: 'opt4', text: 'Azure Data Factory' },
      ],
    },

    // --- COMPUTER VISION (Q014 - Q019) ---
    {
      code: 'AI900-Q014',
      title: 'Computer Vision - Image Classification',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Image classification assigns a main category or label to an entire image.',
      prompt: 'A wildlife app categorizes an uploaded photo into a single general species label such as "Elephant" or "Giraffe". Which computer vision task is performed?',
      options: [
        { id: 'opt1', text: 'Image Classification', isCorrect: true },
        { id: 'opt2', text: 'Object Detection' },
        { id: 'opt3', text: 'OCR' },
        { id: 'opt4', text: 'Semantic Segmentation' },
      ],
    },
    {
      code: 'AI900-Q015',
      title: 'Computer Vision - Object Detection',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Object Detection locates objects within an image and returns bounding box coordinates along with class labels.',
      prompt: 'You need to analyze traffic camera footage to locate each vehicle and pedestrian with bounding boxes and coordinates. Which computer vision task is this?',
      options: [
        { id: 'opt1', text: 'Object Detection', isCorrect: true },
        { id: 'opt2', text: 'Image Classification' },
        { id: 'opt3', text: 'Optical Character Recognition (OCR)' },
        { id: 'opt4', text: 'Face Verification' },
      ],
    },
    {
      code: 'AI900-Q016',
      title: 'Computer Vision - Semantic Segmentation',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.ADVANCED,
      points: 1.0,
      explanation: 'Semantic segmentation classifies individual pixels in an image to delineate precise object boundaries.',
      prompt: 'An autonomous vehicle camera system classifies every individual pixel in a camera feed to distinguish road surface pixels from sidewalk and obstacle pixels. Which vision technique is this?',
      options: [
        { id: 'opt1', text: 'Semantic Segmentation', isCorrect: true },
        { id: 'opt2', text: 'Image Classification' },
        { id: 'opt3', text: 'Optical Character Recognition' },
        { id: 'opt4', text: 'Key Phrase Extraction' },
      ],
    },
    {
      code: 'AI900-Q017',
      title: 'Computer Vision - Optical Character Recognition (OCR)',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'OCR extracts printed or handwritten text from images, scanned documents, and PDFs.',
      prompt: 'An invoice processing application needs to extract printed text, handwritten notes, and tabular data from scanned PDF documents. Which service feature should you use?',
      options: [
        { id: 'opt1', text: 'Optical Character Recognition (OCR)', isCorrect: true },
        { id: 'opt2', text: 'Custom Vision' },
        { id: 'opt3', text: 'Face API' },
        { id: 'opt4', text: 'Spatial Analysis' },
      ],
    },
    {
      code: 'AI900-Q018',
      title: 'Computer Vision - Azure AI Face API',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'The Face service provides facial detection, facial landmark location, and face verification capabilities.',
      prompt: 'A security turnstile application analyzes camera feeds to verify employee identity by matching facial features against authorized employee photos. Which Azure service should you use?',
      options: [
        { id: 'opt1', text: 'Azure AI Face API', isCorrect: true },
        { id: 'opt2', text: 'Custom Vision' },
        { id: 'opt3', text: 'Azure Form Recognizer' },
        { id: 'opt4', text: 'Language Studio' },
      ],
    },
    {
      code: 'AI900-Q019',
      title: 'Computer Vision - Azure AI Custom Vision',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Custom Vision allows users to build, deploy, and refine custom image classification and object detection models.',
      prompt: 'A manufacturing plant needs an AI model to detect defective circuit boards using a custom dataset of 200 labeled images. Which service allows training custom image classification models easily?',
      options: [
        { id: 'opt1', text: 'Azure AI Custom Vision', isCorrect: true },
        { id: 'opt2', text: 'Azure AI Speech' },
        { id: 'opt3', text: 'Language Studio' },
        { id: 'opt4', text: 'Azure Bot Service' },
      ],
    },

    // --- NATURAL LANGUAGE PROCESSING & SPEECH (Q020 - Q026) ---
    {
      code: 'AI900-Q020',
      title: 'NLP - Key Phrase Extraction',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Key Phrase Extraction identifies the main concepts and talking points in unformatted text.',
      prompt: 'An organization needs to process thousands of customer survey responses and extract the main topic phrases discussed in each response. Which NLP feature should be used?',
      options: [
        { id: 'opt1', text: 'Key Phrase Extraction', isCorrect: true },
        { id: 'opt2', text: 'Entity Recognition' },
        { id: 'opt3', text: 'Sentiment Analysis' },
        { id: 'opt4', text: 'Language Translation' },
      ],
    },
    {
      code: 'AI900-Q021',
      title: 'NLP - Named Entity Recognition (NER)',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Named Entity Recognition identifies entities such as people, locations, dates, and organizations in text.',
      prompt: 'A news aggregation platform analyzes articles to identify and tag specific company names, executive names, and dates mentioned in the text. Which NLP feature does this?',
      options: [
        { id: 'opt1', text: 'Named Entity Recognition (NER)', isCorrect: true },
        { id: 'opt2', text: 'Key Phrase Extraction' },
        { id: 'opt3', text: 'Language Detection' },
        { id: 'opt4', text: 'Speech Recognition' },
      ],
    },
    {
      code: 'AI900-Q022',
      title: 'NLP - Sentiment Analysis',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Sentiment Analysis evaluates text to determine whether customer sentiment is positive, negative, or neutral.',
      prompt: 'A restaurant chain wants to analyze social media mentions to determine whether customer sentiment is overwhelmingly positive or negative. Which NLP feature should they use?',
      options: [
        { id: 'opt1', text: 'Sentiment Analysis', isCorrect: true },
        { id: 'opt2', text: 'Key Phrase Extraction' },
        { id: 'opt3', text: 'Named Entity Recognition (NER)' },
        { id: 'opt4', text: 'Language Detection' },
      ],
    },
    {
      code: 'AI900-Q023',
      title: 'NLP - Azure AI Translator Service',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Azure AI Translator translates text in real-time across more than 100 supported languages.',
      prompt: 'A global website needs to automatically translate user comments from French and Spanish into English in real-time. Which Azure AI service should be implemented?',
      options: [
        { id: 'opt1', text: 'Azure AI Translator', isCorrect: true },
        { id: 'opt2', text: 'Azure AI Speech' },
        { id: 'opt3', text: 'Language Studio' },
        { id: 'opt4', text: 'Azure Bot Service' },
      ],
    },
    {
      code: 'AI900-Q024',
      title: 'Speech Service - Speech-to-Text Recognition',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Speech Recognition transcribes spoken audio streams into real-time written text.',
      prompt: 'A call center application transcribes live phone call audio into text transcripts for compliance auditing. Which feature of the Speech service is used?',
      options: [
        { id: 'opt1', text: 'Speech-to-Text (Speech Recognition)', isCorrect: true },
        { id: 'opt2', text: 'Text-to-Speech (Speech Synthesis)' },
        { id: 'opt3', text: 'Speaker Recognition' },
        { id: 'opt4', text: 'Language Translation' },
      ],
    },
    {
      code: 'AI900-Q025',
      title: 'Speech Service - Text-to-Speech Synthesis',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Speech Synthesis converts text into natural-sounding synthetic human speech.',
      prompt: 'You need to build a mobile application feature that reads news articles out loud using natural-sounding synthetic human voices. Which Azure AI service feature is required?',
      options: [
        { id: 'opt1', text: 'Speech Synthesis (Text-to-Speech)', isCorrect: true },
        { id: 'opt2', text: 'Speech Recognition (Speech-to-Text)' },
        { id: 'opt3', text: 'Language Translation' },
        { id: 'opt4', text: 'Conversational AI' },
      ],
    },
    {
      code: 'AI900-Q026',
      title: 'Conversational AI - Azure Bot Service',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Azure Bot Service provides an integrated environment for building, connecting, and managing intelligent conversational bots.',
      prompt: 'A customer service portal needs an interactive conversational bot to handle common customer inquiries 24/7. Which service provides the infrastructure for building chatbots?',
      options: [
        { id: 'opt1', text: 'Azure Bot Service', isCorrect: true },
        { id: 'opt2', text: 'Azure AI Content Safety' },
        { id: 'opt3', text: 'Azure Metrics Advisor' },
        { id: 'opt4', text: 'Azure Personalizer' },
      ],
    },

    // --- GENERATIVE AI & SAFETY (Q027 - Q030) ---
    {
      code: 'AI900-Q027',
      title: 'Generative AI - Azure OpenAI Service',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure OpenAI Service provides access to OpenAI models (GPT-4, DALL-E, Embeddings) with Azure security and enterprise capabilities.',
      prompt: 'Which Azure service provides REST API access to advanced large language models (LLMs) such as GPT-4 for text generation, summarization, and code completion?',
      options: [
        { id: 'opt1', text: 'Azure OpenAI Service', isCorrect: true },
        { id: 'opt2', text: 'Azure Machine Learning' },
        { id: 'opt3', text: 'Azure Video Indexer' },
        { id: 'opt4', text: 'Azure Immersive Reader' },
      ],
    },
    {
      code: 'AI900-Q028',
      title: 'Generative AI - Prompt Engineering',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Prompt Engineering is the practice of structuring text prompts to effectively guide Large Language Models (LLMs).',
      prompt: 'What is the term for crafting precise input instructions, context, and constraints to guide Large Language Models (LLMs) toward producing desired outputs?',
      options: [
        { id: 'opt1', text: 'Prompt Engineering', isCorrect: true },
        { id: 'opt2', text: 'Fine-Tuning' },
        { id: 'opt3', text: 'Hyperparameter Tuning' },
        { id: 'opt4', text: 'Supervised Training' },
      ],
    },
    {
      code: 'AI900-Q029',
      title: 'Generative AI - Azure AI Content Safety',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure AI Content Safety detects and blocks harmful user-generated and AI-generated content (hate speech, violence, self-harm).',
      prompt: 'An online platform uses generative AI. You need an automated safeguard to detect and block hate speech, violence, and harmful content in real-time prompts and responses. Which service should you integrate?',
      options: [
        { id: 'opt1', text: 'Azure AI Content Safety', isCorrect: true },
        { id: 'opt2', text: 'Azure Key Vault' },
        { id: 'opt3', text: 'Azure Firewall' },
        { id: 'opt4', text: 'Azure Monitor' },
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

  // Question 30: Interactive Drag & Drop Computer Vision Capability Question
  const qAI900_DD = await prisma.question.create({
    data: {
      code: 'AI900-Q030',
      title: 'Computer Vision Capabilities Drag and Drop',
      type: QuestionType.DRAG_AND_DROP,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 2.5,
      explanation: 'Image classification labels an entire image, object detection identifies bounding boxes, OCR extracts text.',
      categoryId: catAzure.id,
      content: JSON.stringify({
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
      description: 'Demonstrate foundational knowledge of Artificial Intelligence, Machine Learning principles, Computer Vision, Natural Language Processing, and Generative AI with 30 practice questions.',
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
    {
      code: 'AZ900-Q002',
      title: 'CapEx vs OpEx in Cloud Computing',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Public cloud computing transforms capital expenditure (CapEx) into operating expenditure (OpEx) with pay-as-you-go pricing.',
      prompt: 'Which cloud computing model converts upfront capital expenditure (CapEx) into flexible operating expenditure (OpEx)?',
      options: [
        { id: 'opt1', text: 'Public Cloud', isCorrect: true },
        { id: 'opt2', text: 'On-Premises Datacenter' },
        { id: 'opt3', text: 'Private Cloud' },
        { id: 'opt4', text: 'Local SAN Infrastructure' },
      ],
    },
    {
      code: 'AZ900-Q003',
      title: 'Azure Availability Zones High Availability',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Availability Zones protect applications from physical datacenter failures within the same Azure region.',
      prompt: 'What is the primary purpose of deploying resources across multiple Availability Zones in an Azure region?',
      options: [
        { id: 'opt1', text: 'To protect applications from physical datacenter outages', isCorrect: true },
        { id: 'opt2', text: 'To decrease global network latency for international users' },
        { id: 'opt3', text: 'To automate subscription billing limits' },
        { id: 'opt4', text: 'To manage local DNS resolution' },
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

  console.log(`✅ Successfully seeded ALL ${seededAI900Questions.length} AI-900 practice questions into AI-900 track!`);
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
