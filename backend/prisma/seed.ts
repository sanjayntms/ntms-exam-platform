import { PrismaClient, Role, ExamVendor, ExamType, QuestionType, DifficultyLevel, ExamStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting NTMS Exam Platform Database Seeding...');

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

  const guestUser = await prisma.user.create({
    data: {
      email: 'guest@ntms.com',
      name: 'Guest User',
      role: Role.GUEST,
      passwordHash: 'hashed_password_guest_123',
    },
  });

  console.log('✅ Users created successfully.');

  // Create Categories & Tags
  const cloudCategory = await prisma.category.create({
    data: {
      name: 'Cloud Computing & Infrastructure',
      description: 'Azure, AWS, and Hybrid Cloud Architecture',
    },
  });

  const networkingCategory = await prisma.category.create({
    data: {
      name: 'Enterprise Networking & Security',
      description: 'Routing, Switching, Firewalls, and Zero Trust Architecture',
    },
  });

  const tagAzure = await prisma.tag.create({ data: { name: 'Azure' } });
  const tagAWS = await prisma.tag.create({ data: { name: 'AWS' } });
  const tagSecurity = await prisma.tag.create({ data: { name: 'Security' } });
  const tagKubernetes = await prisma.tag.create({ data: { name: 'Kubernetes' } });

  // 1. Single Choice Question
  const qSingleChoice = await prisma.question.create({
    data: {
      code: 'AZ-900-Q001',
      title: 'Azure Cloud Service Models',
      type: QuestionType.SINGLE_CHOICE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Infrastructure as a Service (IaaS) provides maximum control over infrastructure.',
      categoryId: cloudCategory.id,
      content: JSON.stringify({
        prompt: 'Which Azure cloud service model offers the highest level of flexibility and management control over your hardware resources?',
        options: [
          { id: 'opt1', text: 'Software as a Service (SaaS)' },
          { id: 'opt2', text: 'Platform as a Service (PaaS)' },
          { id: 'opt3', text: 'Infrastructure as a Service (IaaS)', isCorrect: true },
          { id: 'opt4', text: 'Serverless Functions' },
        ],
      }),
    },
  });

  // 2. Multiple Choice Question
  const qMultipleChoice = await prisma.question.create({
    data: {
      code: 'AZ-900-Q002',
      title: 'Azure Storage Redundancy',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 2.0,
      explanation: 'LRS, ZRS, and GRS are standard Azure Blob Storage redundancy options.',
      categoryId: cloudCategory.id,
      content: JSON.stringify({
        prompt: 'Which of the following are valid Azure Blob Storage replication/redundancy options? (Select TWO)',
        options: [
          { id: 'opt1', text: 'Locally Redundant Storage (LRS)', isCorrect: true },
          { id: 'opt2', text: 'Zone-Redundant Storage (ZRS)', isCorrect: true },
          { id: 'opt3', text: 'Global Cache Replication (GCR)' },
          { id: 'opt4', text: 'Quantum Distributed Storage (QDS)' },
        ],
      }),
    },
  });

  // 3. True / False Question
  const qTrueFalse = await prisma.question.create({
    data: {
      code: 'AZ-900-Q003',
      title: 'Azure ExpressRoute Public Internet',
      type: QuestionType.TRUE_FALSE,
      difficulty: DifficultyLevel.BEGINNER,
      points: 1.0,
      explanation: 'Azure ExpressRoute connections do NOT go over the public Internet; they use a private connection.',
      categoryId: cloudCategory.id,
      content: JSON.stringify({
        prompt: 'Azure ExpressRoute traffic traverses the public internet by default.',
        isTrueCorrect: false,
      }),
    },
  });

  // 4. Dropdown Question
  const qDropdown = await prisma.question.create({
    data: {
      code: 'AZ-900-Q004',
      title: 'Azure Identity Management',
      type: QuestionType.DROPDOWN,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.5,
      explanation: 'Microsoft Entra ID is Microsoft cloud-based identity and access management service.',
      categoryId: cloudCategory.id,
      content: JSON.stringify({
        prompt: 'Select the correct Azure service for identity management: To manage enterprise user access and single sign-on, you should deploy [DROPDOWN_1]. For DDoS protection, use [DROPDOWN_2].',
        dropdowns: [
          {
            id: 'DROPDOWN_1',
            options: ['Azure Key Vault', 'Microsoft Entra ID', 'Azure Bastion'],
            correctAnswer: 'Microsoft Entra ID',
          },
          {
            id: 'DROPDOWN_2',
            options: ['Azure DDoS Protection', 'Azure Front Door', 'Azure Network Security Group'],
            correctAnswer: 'Azure DDoS Protection',
          },
        ],
      }),
    },
  });

  // 5. Fill in the Blank Question
  const qFillBlank = await prisma.question.create({
    data: {
      code: 'AZ-900-Q005',
      title: 'Azure CLI Command',
      type: QuestionType.FILL_IN_BLANK,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 1.0,
      explanation: 'az group create creates a new resource group in Azure CLI.',
      categoryId: cloudCategory.id,
      content: JSON.stringify({
        prompt: 'Complete the Azure CLI command to create a resource group named "rg-ntms" in region "eastus":\naz [BLANK_1] create --name rg-ntms --location eastus',
        blanks: [
          { id: 'BLANK_1', correctAnswers: ['group', 'group'] },
        ],
      }),
    },
  });

  // 6. Matching Question
  const qMatching = await prisma.question.create({
    data: {
      code: 'AZ-900-Q006',
      title: 'Azure Service Categories',
      type: QuestionType.MATCHING,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 2.0,
      explanation: 'Match each Azure service to its primary cloud architecture domain.',
      categoryId: cloudCategory.id,
      content: JSON.stringify({
        prompt: 'Match each Azure service on the left to its corresponding domain on the right.',
        pairs: [
          { item: 'Azure Virtual Machines', target: 'Compute' },
          { item: 'Azure SQL Database', target: 'Database' },
          { item: 'Azure Blob Storage', target: 'Storage' },
          { item: 'Azure Virtual Network', target: 'Networking' },
        ],
      }),
    },
  });

  // 7. Drag and Drop Question
  const qDragDrop = await prisma.question.create({
    data: {
      code: 'AZ-900-Q007',
      title: 'SLA Availability Guarantees',
      type: QuestionType.DRAG_AND_DROP,
      difficulty: DifficultyLevel.ADVANCED,
      points: 2.5,
      explanation: 'Availability Zones offer 99.99% SLA, single VM with SSD offers 99.9%.',
      categoryId: cloudCategory.id,
      content: JSON.stringify({
        prompt: 'Drag each Azure SLA percentage to its corresponding deployment configuration.',
        items: [
          { id: 'sla1', label: '99.99%' },
          { id: 'sla2', label: '99.9%' },
          { id: 'sla3', label: '99.95%' },
        ],
        targets: [
          { id: 'target1', label: 'Virtual Machines across Availability Zones', correctItemId: 'sla1' },
          { id: 'target2', label: 'Single VM with Premium SSD', correctItemId: 'sla2' },
          { id: 'target3', label: 'VMs in an Availability Set', correctItemId: 'sla3' },
        ],
      }),
    },
  });

  // 8. Reorder Question
  const qReorder = await prisma.question.create({
    data: {
      code: 'AZ-900-Q008',
      title: 'Azure Resource Deployment Order',
      type: QuestionType.REORDER,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 2.0,
      explanation: 'Resource Group -> VNet -> Subnet -> Network Interface -> VM.',
      categoryId: cloudCategory.id,
      content: JSON.stringify({
        prompt: 'Arrange the following steps in the correct order to deploy a custom Virtual Machine with a private VNet.',
        items: [
          { id: 's1', text: 'Create an Azure Resource Group', correctOrder: 1 },
          { id: 's2', text: 'Create an Azure Virtual Network (VNet)', correctOrder: 2 },
          { id: 's3', text: 'Create a Subnet within the VNet', correctOrder: 3 },
          { id: 's4', text: 'Provision the Virtual Machine attached to the Subnet', correctOrder: 4 },
        ],
      }),
    },
  });

  // 9. Build List Question
  const qBuildList = await prisma.question.create({
    data: {
      code: 'AZ-900-Q009',
      title: 'Zero Trust Security Pillars',
      type: QuestionType.BUILD_LIST,
      difficulty: DifficultyLevel.ADVANCED,
      points: 3.0,
      explanation: 'Zero Trust requires explicit verification, least privilege access, and assume breach.',
      categoryId: cloudCategory.id,
      content: JSON.stringify({
        prompt: 'From the pool of principles on the left, select and build the three core pillars of Microsoft Zero Trust security architecture in correct order.',
        pool: [
          'Verify Explicitly',
          'Use Least Privilege Access',
          'Assume Breach',
          'Trust All Internal Traffic',
          'Disable Multi-Factor Auth',
        ],
        correctSequence: ['Verify Explicitly', 'Use Least Privilege Access', 'Assume Breach'],
      }),
    },
  });

  // 10. Hotspot Question
  const qHotspot = await prisma.question.create({
    data: {
      code: 'AZ-900-Q010',
      title: 'Azure Portal Navigation Hotspot',
      type: QuestionType.HOTSPOT,
      difficulty: DifficultyLevel.INTERMEDIATE,
      points: 2.0,
      explanation: 'Click on the Subscriptions icon in the navigation panel.',
      categoryId: cloudCategory.id,
      content: JSON.stringify({
        prompt: 'Click on the area in the diagram that corresponds to Azure Cost Management & Billing.',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        hotspots: [
          { id: 'h1', label: 'Cost Management', x: 25, y: 40, radius: 15, isCorrect: true },
          { id: 'h2', label: 'Virtual Machines', x: 75, y: 20, radius: 15, isCorrect: false },
        ],
      }),
    },
  });

  // 11. Case Study Question
  const caseStudyData = await prisma.caseStudy.create({
    data: {
      title: 'Contoso Ltd. Enterprise Cloud Migration',
      overview: 'Contoso Ltd. is a global manufacturing company with 50,000 employees planning to migrate on-premises infrastructure to Azure.',
      businessRequirements: 'Ensure 99.99% uptime for core ERP. Maintain compliance with GDPR and HIPAA.',
      technicalRequirements: 'Hybrid connectivity via ExpressRoute. Azure Kubernetes Service (AKS) for microservices.',
      existingEnvironment: 'Active Directory domain contoso.local, 500 VMware ESXi hosts in Dallas datacenter.',
    },
  });

  const qCaseStudy = await prisma.question.create({
    data: {
      code: 'AZ-900-CS01',
      title: 'Contoso Hybrid Connectivity Architecture',
      type: QuestionType.CASE_STUDY,
      difficulty: DifficultyLevel.EXPERT,
      points: 4.0,
      explanation: 'ExpressRoute with VPN failover satisfies zero-latency private connection and disaster recovery.',
      caseStudyId: caseStudyData.id,
      categoryId: cloudCategory.id,
      content: JSON.stringify({
        prompt: 'Based on the Case Study tabs, which hybrid network topology best meets Contoso technical requirements for mission-critical database connectivity?',
        options: [
          { id: 'opt1', text: 'Azure ExpressRoute as primary connection with Site-to-Site VPN as backup', isCorrect: true },
          { id: 'opt2', text: 'Public IP endpoints protected by Basic NSG rules' },
          { id: 'opt3', text: 'Point-to-Site VPN tunnels on each developer machine' },
        ],
      }),
    },
  });

  // 12. Simulation Question
  const simulationData = await prisma.simulation.create({
    data: {
      title: 'Azure Portal: Create Virtual Machine & Configure Network Security Group',
      portalType: 'AZURE_PORTAL',
      instructions: '1. Navigate to Virtual Machines.\n2. Click + Create.\n3. Set Resource Group to "rg-prod".\n4. Enable HTTPS port 443 inbound rule.',
      initialState: JSON.stringify({ vmName: '', rg: '', inboundPorts: [] }),
      targetState: JSON.stringify({ vmName: 'vm-app-01', rg: 'rg-prod', inboundPorts: [80, 443] }),
    },
  });

  const qSimulation = await prisma.question.create({
    data: {
      code: 'AZ-900-SIM01',
      title: 'Interactive Azure Portal VM Provisioning',
      type: QuestionType.SIMULATION,
      difficulty: DifficultyLevel.ADVANCED,
      points: 5.0,
      explanation: 'Interactive task verified against target portal state configuration.',
      simulationId: simulationData.id,
      categoryId: cloudCategory.id,
      content: JSON.stringify({
        prompt: 'Use the interactive Azure Portal simulation below to provision VM "vm-app-01" under "rg-prod" and open port 443.',
      }),
    },
  });

  // 13. Lab Question
  const labData = await prisma.lab.create({
    data: {
      title: 'Hands-on Azure CLI & Bicep Deployment Lab',
      scenario: 'You are tasked with deploying a web app environment using Azure CLI.',
      checklists: JSON.stringify([
        { id: 't1', task: 'Create Resource Group "rg-lab-01"' },
        { id: 't2', task: 'Deploy App Service Plan "asp-lab"' },
        { id: 't3', task: 'Verify web app HTTP response 200' },
      ]),
      validation: JSON.stringify({ command: 'az webapp show --name app-lab --query state' }),
    },
  });

  const qLab = await prisma.question.create({
    data: {
      code: 'AZ-900-LAB01',
      title: 'Hands-on Web App Provisioning Lab',
      type: QuestionType.LAB,
      difficulty: DifficultyLevel.EXPERT,
      points: 5.0,
      explanation: 'Hands-on checklist task score evaluated against verification script results.',
      labId: labData.id,
      categoryId: cloudCategory.id,
      content: JSON.stringify({
        prompt: 'Complete the hands-on lab checklist items in the terminal environment provided.',
      }),
    },
  });

  // 14. Code Editor Question
  const qCodeEditor = await prisma.question.create({
    data: {
      code: 'AZ-900-CODE01',
      title: 'Azure Function Python Handler',
      type: QuestionType.CODE_EDITOR,
      difficulty: DifficultyLevel.ADVANCED,
      points: 3.0,
      explanation: 'func.HttpResponse with status_code=200 returns valid HTTP payload.',
      categoryId: cloudCategory.id,
      content: JSON.stringify({
        prompt: 'Write an Azure Functions Python HTTP trigger handler that reads query parameter "name" and returns a 200 OK JSON response `{"message": "Hello <name>"}`.',
        initialCode: 'import azure.functions as func\nimport json\n\ndef main(req: func.HttpRequest) -> func.HttpResponse:\n    # Write your code here\n    pass',
        language: 'python',
        expectedKeywordMatches: ['func.HttpResponse', 'req.params', 'json.dumps'],
      }),
    },
  });

  // 15. Essay Question
  const qEssay = await prisma.question.create({
    data: {
      code: 'AZ-900-ESSAY01',
      title: 'Disaster Recovery Strategy Essay',
      type: QuestionType.ESSAY,
      difficulty: DifficultyLevel.EXPERT,
      points: 5.0,
      explanation: 'Requires comprehensive evaluation of RTO, RPO, and multi-region failover design.',
      categoryId: cloudCategory.id,
      content: JSON.stringify({
        prompt: 'Explain the difference between Recovery Time Objective (RTO) and Recovery Point Objective (RPO) in Azure Disaster Recovery planning, and design a multi-region SQL database architecture that achieves RTO < 5 mins.',
        minWords: 100,
        maxWords: 500,
      }),
    },
  });

  console.log('✅ 15 Comprehensive Question Types created.');

  // Create Exam with Sections
  const examAZ900 = await prisma.exam.create({
    data: {
      code: 'AZ-900',
      title: 'Microsoft Azure Fundamentals Certification Exam',
      vendor: ExamVendor.MICROSOFT,
      examType: ExamType.CERTIFICATION,
      description: 'Demonstrate foundational knowledge of cloud concepts, Azure services, workloads, security, privacy, pricing, and support.',
      instructions: 'You have 60 minutes to complete this exam. There are 15 questions across 2 sections. You may flag questions for review, use the built-in scratchpad and calculator.',
      timeLimitMinutes: 60,
      passingScore: 70.0,
      isRandomized: true,
      shuffleAnswers: true,
      allowCalculator: true,
      allowNotes: true,
      creatorId: creatorUser.id,
      status: ExamStatus.PUBLISHED,
    },
  });

  const section1 = await prisma.examSection.create({
    data: {
      examId: examAZ900.id,
      title: 'Section 1: General Cloud Concepts & Core Azure Services',
      instructions: 'Answer all standard questions in this section.',
      orderIndex: 1,
    },
  });

  const section2 = await prisma.examSection.create({
    data: {
      examId: examAZ900.id,
      title: 'Section 2: Case Studies, Simulations & Practical Scenarios',
      instructions: 'Analyze the case study tabs and interact with the portal simulation.',
      orderIndex: 2,
    },
  });

  // Link questions to sections
  const allQuestions = [
    qSingleChoice, qMultipleChoice, qTrueFalse, qDropdown, qFillBlank,
    qMatching, qDragDrop, qReorder, qBuildList, qHotspot
  ];

  for (let i = 0; i < allQuestions.length; i++) {
    await prisma.sectionQuestion.create({
      data: {
        sectionId: section1.id,
        questionId: allQuestions[i].id,
        orderIndex: i + 1,
      },
    });
  }

  const advancedQuestions = [qCaseStudy, qSimulation, qLab, qCodeEditor, qEssay];
  for (let i = 0; i < advancedQuestions.length; i++) {
    await prisma.sectionQuestion.create({
      data: {
        sectionId: section2.id,
        questionId: advancedQuestions[i].id,
        orderIndex: i + 1,
      },
    });
  }

  // Also create AWS and Cisco exams
  await prisma.exam.create({
    data: {
      code: 'AWS-SAA-C03',
      title: 'AWS Certified Solutions Architect – Associate',
      vendor: ExamVendor.AWS,
      examType: ExamType.CERTIFICATION,
      description: 'Showcases knowledge of AWS services including compute, networking, storage, and database.',
      timeLimitMinutes: 130,
      passingScore: 72.0,
      creatorId: creatorUser.id,
      status: ExamStatus.PUBLISHED,
    },
  });

  await prisma.exam.create({
    data: {
      code: '200-301-CCNA',
      title: 'Cisco Certified Network Associate (CCNA)',
      vendor: ExamVendor.CISCO,
      examType: ExamType.CERTIFICATION,
      description: 'Covers network fundamentals, network access, IP connectivity, IP services, and security fundamentals.',
      timeLimitMinutes: 120,
      passingScore: 82.5,
      creatorId: creatorUser.id,
      status: ExamStatus.PUBLISHED,
    },
  });

  console.log('✅ Exams, Sections, and SectionQuestions seeded successfully!');
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
