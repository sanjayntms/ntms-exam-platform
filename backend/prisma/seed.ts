import { PrismaClient } from '@prisma/client';
import { Role, ExamVendor, ExamType, QuestionType, DifficultyLevel, ExamStatus } from '../src/domain/types.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting NTMS Database Seeding with Deduplicated AZ-900 (30 Questions) & AI-900 (35 Questions)...');

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
    data: { name: 'Microsoft Azure Certification', description: 'AZ-900, AZ-104 & AI-900 Tracks' },
  });

  const catDevOps = await prisma.category.create({
    data: { name: 'Infrastructure as Code & DevOps', description: 'Terraform & Automation' },
  });

  const catInterview = await prisma.category.create({
    data: { name: 'Interview Preparation', description: 'Technical Q&A Practice' },
  });

  // ==========================================
  // 1. AI-900 EXAM TRACK (35 DEDUPLICATED QUESTIONS)
  // ==========================================
  const ai900QuestionsData = [
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
    {
      code: 'AI900-Q030',
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
      code: 'AI900-Q031',
      title: 'Generative AI - Whisper Speech Model',
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
      code: 'AI900-Q032',
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
      code: 'AI900-Q033',
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
      code: 'AI900-Q034',
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

  // Question 35: Interactive Drag & Drop Computer Vision Capabilities
  const qAI900_DD = await prisma.question.create({
    data: {
      code: 'AI900-Q035',
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
      description: 'Demonstrate foundational knowledge of Artificial Intelligence, Machine Learning principles, Computer Vision, Natural Language Processing, and Generative AI with 35 deduplicated practice questions.',
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
  // 2. AZ-900 EXAM TRACK (30 DEDUPLICATED QUESTIONS)
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
    {
      code: 'AZ900-Q004',
      title: 'Azure Functions Serverless Execution',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure Functions is a serverless compute service that executes event-driven code without managing underlying servers.',
      prompt: 'Your team needs to run code in response to events without managing any virtual machines or server infrastructure. Which service should you use?',
      options: [
        { id: 'opt1', text: 'Azure Functions', isCorrect: true },
        { id: 'opt2', text: 'Azure Virtual Machines' },
        { id: 'opt3', text: 'Azure Batch' },
        { id: 'opt4', text: 'Azure Virtual Machine Scale Sets' },
      ],
    },
    {
      code: 'AZ900-Q005',
      title: 'Azure Blob Storage Access Tiers',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Cool tier is optimized for storing data that is accessed infrequently and stored for at least 30 days.',
      prompt: 'Which Azure Blob Storage access tier is optimized for storing data that is accessed infrequently and stored for at least 30 days?',
      options: [
        { id: 'opt1', text: 'Cool Access Tier', isCorrect: true },
        { id: 'opt2', text: 'Hot Access Tier' },
        { id: 'opt3', text: 'Archive Access Tier' },
        { id: 'opt4', text: 'Premium Tier' },
      ],
    },
    {
      code: 'AZ900-Q006',
      title: 'Microsoft Entra ID Identity Management',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Microsoft Entra ID provides cloud-based identity, single sign-on (SSO), and multi-factor authentication (MFA).',
      prompt: 'Which Azure service provides cloud identity management, single sign-on (SSO), and multi-factor authentication (MFA)?',
      options: [
        { id: 'opt1', text: 'Microsoft Entra ID', isCorrect: true },
        { id: 'opt2', text: 'Azure Key Vault' },
        { id: 'opt3', text: 'Azure Firewall' },
        { id: 'opt4', text: 'Network Security Group' },
      ],
    },
    {
      code: 'AZ900-Q007',
      title: 'Azure Policy Governance Enforcements',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure Policy enforces organizational standards and assesses compliance across Azure resources.',
      prompt: 'You need to prevent developers from creating Virtual Machines of specific expensive SKU sizes in an Azure subscription. Which service should you use?',
      options: [
        { id: 'opt1', text: 'Azure Policy', isCorrect: true },
        { id: 'opt2', text: 'Role-Based Access Control (RBAC)' },
        { id: 'opt3', text: 'Resource Locks' },
        { id: 'opt4', text: 'Azure Monitor' },
      ],
    },
    {
      code: 'AZ900-Q008',
      title: 'Azure Advisor Cost & Security Optimization',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Azure Advisor analyzes resource configurations and telemetry to offer recommendations on cost, performance, and security.',
      prompt: 'Which Azure service provides personalized recommendations to optimize costs, enhance security, and improve performance?',
      options: [
        { id: 'opt1', text: 'Azure Advisor', isCorrect: true },
        { id: 'opt2', text: 'Azure Service Health' },
        { id: 'opt3', text: 'Azure Monitor' },
        { id: 'opt4', text: 'Azure Cost Management' },
      ],
    },
    {
      code: 'AZ900-Q009',
      title: 'Azure ExpressRoute Dedicated Connections',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'ExpressRoute extends on-premises networks into Microsoft cloud over a private connection without traversing public internet.',
      prompt: 'Which Azure service provides a dedicated private connection between your on-premises datacenter and Azure without using public internet?',
      options: [
        { id: 'opt1', text: 'Azure ExpressRoute', isCorrect: true },
        { id: 'opt2', text: 'Azure VPN Gateway' },
        { id: 'opt3', text: 'VNet Peering' },
        { id: 'opt4', text: 'Azure Traffic Manager' },
      ],
    },
    {
      code: 'AZ900-Q010',
      title: 'Azure Key Vault Secrets & Certificate Management',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Azure Key Vault securely stores secrets, passwords, database connection strings, and SSL certificates.',
      prompt: 'Which Azure service is designed to securely store and manage application API keys, connection strings, and certificates?',
      options: [
        { id: 'opt1', text: 'Azure Key Vault', isCorrect: true },
        { id: 'opt2', text: 'Azure Storage Account' },
        { id: 'opt3', text: 'Azure Security Center' },
        { id: 'opt4', text: 'Microsoft Entra ID' },
      ],
    },
    {
      code: 'AZ900-Q011',
      title: 'Azure Storage Redundancy (LRS vs ZRS vs GRS)',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Geo-Redundant Storage (GRS) replicates data synchronously three times within the primary region, then asynchronously to a secondary region hundreds of miles away.',
      prompt: 'Which Azure storage redundancy option replicates your data to a secondary region hundreds of miles away from the primary location to protect against regional disasters?',
      options: [
        { id: 'opt1', text: 'Geo-Redundant Storage (GRS)', isCorrect: true },
        { id: 'opt2', text: 'Locally Redundant Storage (LRS)' },
        { id: 'opt3', text: 'Zone-Redundant Storage (ZRS)' },
        { id: 'opt4', text: 'Read-Access Local Storage' },
      ],
    },
    {
      code: 'AZ900-Q012',
      title: 'Azure Resource Groups Containers',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'A Resource Group is a logical container that holds related resources for an Azure solution.',
      prompt: 'What is the logical container used in Azure to manage and group related resources for a single application deployment?',
      options: [
        { id: 'opt1', text: 'Resource Group', isCorrect: true },
        { id: 'opt2', text: 'Management Group' },
        { id: 'opt3', text: 'Azure Subscription' },
        { id: 'opt4', text: 'Availability Zone' },
      ],
    },
    {
      code: 'AZ900-Q013',
      title: 'Azure Subscriptions Billing Boundaries',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'An Azure Subscription acts as both an identity boundary and a billing boundary for Azure resource usage.',
      prompt: 'What serves as the primary billing boundary and access control container in Azure?',
      options: [
        { id: 'opt1', text: 'Azure Subscription', isCorrect: true },
        { id: 'opt2', text: 'Resource Group' },
        { id: 'opt3', text: 'Tenant ID' },
        { id: 'opt4', text: 'Management Group' },
      ],
    },
    {
      code: 'AZ900-Q014',
      title: 'Azure Management Groups Hierarchy',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Management Groups provide a governance scope above subscriptions to apply policies and compliance rules across multiple subscriptions.',
      prompt: 'Your enterprise has 20 Azure subscriptions. You need to apply a single security policy across all subscriptions. Which container hierarchy should you use?',
      options: [
        { id: 'opt1', text: 'Management Group', isCorrect: true },
        { id: 'opt2', text: 'Resource Group' },
        { id: 'opt3', text: 'Virtual Network' },
        { id: 'opt4', text: 'Azure App Service Plan' },
      ],
    },
    {
      code: 'AZ900-Q015',
      title: 'Azure Cosmos DB Globally Distributed NoSQL',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure Cosmos DB is a fully managed, globally distributed NoSQL database service offering single-digit millisecond latency worldwide.',
      prompt: 'Which Azure database service offers globally distributed, multi-model NoSQL capabilities with guaranteed single-digit millisecond latency?',
      options: [
        { id: 'opt1', text: 'Azure Cosmos DB', isCorrect: true },
        { id: 'opt2', text: 'Azure SQL Database' },
        { id: 'opt3', text: 'Azure Database for PostgreSQL' },
        { id: 'opt4', text: 'Azure Managed Instance' },
      ],
    },
    {
      code: 'AZ900-Q016',
      title: 'Azure Virtual Machines Infrastructure as a Service',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Azure Virtual Machines (VMs) provide IaaS compute resources on demand.',
      prompt: 'Which Azure compute service allows you to configure custom operating system patches, custom OS images, and full root administrative access?',
      options: [
        { id: 'opt1', text: 'Azure Virtual Machines', isCorrect: true },
        { id: 'opt2', text: 'Azure App Service' },
        { id: 'opt3', text: 'Azure Functions' },
        { id: 'opt4', text: 'Azure Static Web Apps' },
      ],
    },
    {
      code: 'AZ900-Q017',
      title: 'Azure Kubernetes Service (AKS) Container Orchestration',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'AKS is a managed Kubernetes container orchestration service in Azure.',
      prompt: 'Which Azure service simplifies deploying, managing, and scaling containerized microservices applications using Kubernetes?',
      options: [
        { id: 'opt1', text: 'Azure Kubernetes Service (AKS)', isCorrect: true },
        { id: 'opt2', text: 'Azure Container Instances (ACI)' },
        { id: 'opt3', text: 'Azure Service Fabric' },
        { id: 'opt4', text: 'Azure Batch' },
      ],
    },
    {
      code: 'AZ900-Q018',
      title: 'Azure Virtual Network (VNet) Isolation',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'An Azure Virtual Network (VNet) provides private IP address network isolation for Azure resources.',
      prompt: 'Which building block provides private IP network isolation for your Azure resources in the cloud?',
      options: [
        { id: 'opt1', text: 'Azure Virtual Network (VNet)', isCorrect: true },
        { id: 'opt2', text: 'Azure ExpressRoute' },
        { id: 'opt3', text: 'Azure Front Door' },
        { id: 'opt4', text: 'Azure Traffic Manager' },
      ],
    },
    {
      code: 'AZ900-Q019',
      title: 'Network Security Group (NSG) Stateful Filtering',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Network Security Groups (NSGs) filter network traffic to and from Azure resources in an Azure Virtual Network.',
      prompt: 'Which security feature allows you to filter network traffic to and from subnets or network interfaces (NICs) based on port and IP rules?',
      options: [
        { id: 'opt1', text: 'Network Security Group (NSG)', isCorrect: true },
        { id: 'opt2', text: 'Azure Application Gateway' },
        { id: 'opt3', text: 'Azure DDoS Protection' },
        { id: 'opt4', text: 'Azure DNS' },
      ],
    },
    {
      code: 'AZ900-Q020',
      title: 'Azure Firewall Cloud Native Security',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure Firewall is a managed, cloud-based network security service that protects your Azure Virtual Network resources.',
      prompt: 'Which service is a fully stateful, cloud-native firewall that provides high availability and threat intelligence across virtual networks?',
      options: [
        { id: 'opt1', text: 'Azure Firewall', isCorrect: true },
        { id: 'opt2', text: 'Network Security Group (NSG)' },
        { id: 'opt3', text: 'Azure WAF' },
        { id: 'opt4', text: 'Azure Bastion' },
      ],
    },
    {
      code: 'AZ900-Q021',
      title: 'Azure Resource Locks (CanNotDelete vs ReadOnly)',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'A CanNotDelete resource lock allows authorized users to read and modify a resource, but prevents them from deleting it.',
      prompt: 'What type of Azure Resource Lock allows administrators to modify and update resources, but prevents them from deleting the resource?',
      options: [
        { id: 'opt1', text: 'CanNotDelete (Delete lock)', isCorrect: true },
        { id: 'opt2', text: 'ReadOnly lock' },
        { id: 'opt3', text: 'Azure Policy Lock' },
        { id: 'opt4', text: 'Subscription Lock' },
      ],
    },
    {
      code: 'AZ900-Q022',
      title: 'Azure Cost Management & Budgets',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Azure Cost Management allows you to create spending budgets and receive alerts when spending exceeds thresholds.',
      prompt: 'Which tool allows you to monitor cloud spending, set automated budget thresholds, and trigger email alerts when costs exceed limits?',
      options: [
        { id: 'opt1', text: 'Azure Cost Management & Budgets', isCorrect: true },
        { id: 'opt2', text: 'Pricing Calculator' },
        { id: 'opt3', text: 'TCO Calculator' },
        { id: 'opt4', text: 'Azure Billing Invoice' },
      ],
    },
    {
      code: 'AZ900-Q023',
      title: 'Azure Service Health Outage Alerts',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Azure Service Health provides a personalized view of the health of your specific Azure services and region incidents.',
      prompt: 'Where should you check to view personalized notifications regarding Azure outages, planned maintenance, and health advisories affecting your specific resources?',
      options: [
        { id: 'opt1', text: 'Azure Service Health', isCorrect: true },
        { id: 'opt2', text: 'Azure Status Page' },
        { id: 'opt3', text: 'Azure Monitor' },
        { id: 'opt4', text: 'Azure Advisor' },
      ],
    },
    {
      code: 'AZ900-Q024',
      title: 'Azure Monitor Telemetry & Log Analytics',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure Monitor maximizes availability and performance of applications by collecting and analyzing telemetry data.',
      prompt: 'Which service acts as the central data collector for metrics, logs, and performance telemetry from Azure and hybrid resources?',
      options: [
        { id: 'opt1', text: 'Azure Monitor', isCorrect: true },
        { id: 'opt2', text: 'Azure Inspector' },
        { id: 'opt3', text: 'Azure Security Center' },
        { id: 'opt4', text: 'Azure Log Vault' },
      ],
    },
    {
      code: 'AZ900-Q025',
      title: 'Azure Arc Multicloud Governance',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.ADVANCED,
      points: 1.0,
      explanation: 'Azure Arc simplifies governance and management by extending Azure Resource Manager (ARM) to multicloud and on-premises servers.',
      prompt: 'Which Azure service allows you to manage and govern servers, Kubernetes clusters, and databases running on AWS, GCP, or on-premises using Azure Resource Manager?',
      options: [
        { id: 'opt1', text: 'Azure Arc', isCorrect: true },
        { id: 'opt2', text: 'Azure Sentinel' },
        { id: 'opt3', text: 'Azure ExpressRoute' },
        { id: 'opt4', text: 'Azure Stack' },
      ],
    },
    {
      code: 'AZ900-Q026',
      title: 'Azure Virtual Machine Scale Sets Auto-scaling',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Virtual Machine Scale Sets (VMSS) allow you to deploy and manage a group of identical, auto-scaling VMs.',
      prompt: 'Which Azure compute feature automatically scales the number of identical virtual machines up or down based on CPU load or schedule?',
      options: [
        { id: 'opt1', text: 'Virtual Machine Scale Sets (VMSS)', isCorrect: true },
        { id: 'opt2', text: 'Availability Sets' },
        { id: 'opt3', text: 'Availability Zones' },
        { id: 'opt4', text: 'Azure Batch' },
      ],
    },
    {
      code: 'AZ900-Q027',
      title: 'Azure Application Gateway & Web Application Firewall (WAF)',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.ADVANCED,
      points: 1.0,
      explanation: 'Application Gateway is a Layer 7 web traffic load balancer that includes Web Application Firewall (WAF) to block web attacks like SQLi & XSS.',
      prompt: 'Which Layer 7 web load balancer includes Web Application Firewall (WAF) to protect web applications from common exploits like SQL injection?',
      options: [
        { id: 'opt1', text: 'Azure Application Gateway', isCorrect: true },
        { id: 'opt2', text: 'Azure Load Balancer' },
        { id: 'opt3', text: 'Azure ExpressRoute' },
        { id: 'opt4', text: 'Azure NAT Gateway' },
      ],
    },
    {
      code: 'AZ900-Q028',
      title: 'Azure Bastion Secure RDP/SSH Access',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure Bastion provides secure, seamless RDP and SSH access to virtual machines directly through the Azure portal over TLS.',
      prompt: 'Which service provides secure RDP and SSH connectivity directly to your Virtual Machines through an HTML5 web browser without public IP addresses?',
      options: [
        { id: 'opt1', text: 'Azure Bastion', isCorrect: true },
        { id: 'opt2', text: 'Azure VPN Gateway' },
        { id: 'opt3', text: 'Azure Firewall' },
        { id: 'opt4', text: 'Network Security Group' },
      ],
    },
    {
      code: 'AZ900-Q029',
      title: 'Azure Data Box Offline Physical Data Transfer',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'Azure Data Box physical storage appliances allow offline transfer of petabytes of data to Azure over slow network connections.',
      prompt: 'Your organization needs to transfer 100 Terabytes of data to Azure Blob Storage over a congested network connection. Which physical hardware appliance service should you order?',
      options: [
        { id: 'opt1', text: 'Azure Data Box', isCorrect: true },
        { id: 'opt2', text: 'Azure Import/Export' },
        { id: 'opt3', text: 'Azure ExpressRoute' },
        { id: 'opt4', text: 'Azure Files' },
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

  // Question 30: Interactive SLA Drag & Drop Question
  const qAZ900_DD = await prisma.question.create({
    data: {
      code: 'AZ900-Q030',
      title: 'Azure SLA Availability Drag and Drop',
      type: QuestionType.DRAG_AND_DROP,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 2.5,
      explanation: 'Availability Zones offer 99.99% SLA, Availability Sets offer 99.95%, single Premium SSD VM offers 99.9%.',
      categoryId: catAzure.id,
      content: JSON.stringify({
        prompt: 'Drag each Azure SLA percentage from the left pool to its corresponding virtual machine deployment configuration on the right.',
        items: [
          { id: 'sla1', label: '99.99%' },
          { id: 'sla2', label: '99.9%' },
          { id: 'sla3', label: '99.95%' },
        ],
        targets: [
          { id: 'target1', label: 'Virtual Machines deployed across Availability Zones', correctItemId: 'sla1' },
          { id: 'target2', label: 'Single Virtual Machine with Premium SSD storage', correctItemId: 'sla2' },
          { id: 'target3', label: 'Virtual Machines deployed in an Availability Set', correctItemId: 'sla3' },
        ],
      }),
    },
  });
  seededAZ900Questions.push(qAZ900_DD);

  const examAZ900 = await prisma.exam.create({
    data: {
      code: 'AZ-900',
      title: 'Microsoft Azure Fundamentals (AZ-900)',
      vendor: ExamVendor.MICROSOFT,
      examType: ExamType.CERTIFICATION,
      description: 'Demonstrate foundational knowledge of cloud concepts, Azure architecture, services, security, privacy, pricing, and SLAs with 30 deduplicated practice questions.',
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

  console.log(`✅ Successfully seeded ALL ${seededAI900Questions.length} deduplicated AI-900 questions into AI-900 track!`);
  console.log(`✅ Successfully seeded ALL ${seededAZ900Questions.length} deduplicated AZ-900 questions into AZ-900 track!`);
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
