import json
import re

with open('scripts/azure_basics_50_questions_shuffled.json', 'r', encoding='utf-8') as f:
    qs = json.load(f)

d1 = qs[0:13]
d2 = qs[13:25]
d3 = qs[25:37]
d4 = qs[37:50]

def convert_q(q):
    q_type = q['type']
    content = {'prompt': q['prompt'], 'explanation': q['explanation']}
    if q_type in ['SINGLE_CHOICE', 'MULTIPLE_CHOICE']:
        content['options'] = q['options']
    elif q_type == 'DRAG_AND_DROP':
        content['items'] = q['items']
        content['targets'] = q['targets']
    
    return {
        'code': q['code'],
        'title': q['title'],
        'type': q_type,
        'difficulty': 'INTERMEDIATE',
        'points': 1.0,
        'explanation': q['explanation'],
        'content': content
    }

c_d1 = [convert_q(q) for q in d1]
c_d2 = [convert_q(q) for q in d2]
c_d3 = [convert_q(q) for q in d3]
c_d4 = [convert_q(q) for q in d4]

with open('scripts/az_basics_converted.json', 'w', encoding='utf-8') as f:
    json.dump({'d1': c_d1, 'd2': c_d2, 'd3': c_d3, 'd4': c_d4}, f, indent=2)

d1_str = json.dumps(c_d1)
d2_str = json.dumps(c_d2)
d3_str = json.dumps(c_d3)
d4_str = json.dumps(c_d4)

snippet = f'''  // ==========================================
  // AZURE BASICS - 50 QUESTIONS (PPTX DERIVED & AUDITED)
  // ==========================================
  const azureBasicsD1 = {d1_str};
  const azureBasicsD2 = {d2_str};
  const azureBasicsD3 = {d3_str};
  const azureBasicsD4 = {d4_str};

  const seededAzureBasicsD1 = await seedQuestionList(azureBasicsD1, catAzure.id);
  const seededAzureBasicsD2 = await seedQuestionList(azureBasicsD2, catAzure.id);
  const seededAzureBasicsD3 = await seedQuestionList(azureBasicsD3, catAzure.id);
  const seededAzureBasicsD4 = await seedQuestionList(azureBasicsD4, catAzure.id);

  const azureBasicsExam = await prisma.exam.create({{
    data: {{
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
    }},
  }});

  await prisma.examRoom.create({{
    data: {{
      roomCode: 'HALL-AZURE-BASICS',
      title: 'Azure Basics Proctored Examination Hall',
      examId: azureBasicsExam.id,
      status: 'OPEN',
      allowReview: true,
      createdBy: creatorUser.email,
    }},
  }});

  const azureBasicsSections = [
    {{ title: '1. Azure Physical & Logical Architecture', weight: 26.0, questions: seededAzureBasicsD1 }},
    {{ title: '2. Azure High Availability, Resiliency & Redundancy', weight: 24.0, questions: seededAzureBasicsD2 }},
    {{ title: '3. Azure Resource Management, Tools & Infrastructure as Code', weight: 24.0, questions: seededAzureBasicsD3 }},
    {{ title: '4. Azure Compute, Virtual Machine Families & Workloads', weight: 26.0, questions: seededAzureBasicsD4 }},
  ];

  for (let sIdx = 0; sIdx < azureBasicsSections.length; sIdx++) {{
    const sData = azureBasicsSections[sIdx];
    const sec = await prisma.examSection.create({{
      data: {{
        examId: azureBasicsExam.id,
        title: sData.title,
        orderIndex: sIdx + 1,
        weightPercentage: sData.weight,
      }},
    }});

    let qOrder = 1;
    for (const q of sData.questions) {{
      await prisma.sectionQuestion.create({{
        data: {{ sectionId: sec.id, questionId: q.id, orderIndex: qOrder++ }},
      }});
    }}
  }}
  console.log('✅ Seeded AZURE-BASICS with 50 questions across 4 Objective Domain Sections & Room HALL-AZURE-BASICS!');'''

with open('backend/prisma/seed.ts', 'r', encoding='utf-8') as f:
    seed_content = f.read()

pattern = r'  // ==========================================\s*// AZURE BASICS - 50 QUESTIONS.*?(?=\n  // Seed HashiCorp Terraform)'
if re.search(pattern, seed_content, flags=re.DOTALL):
    new_content = re.sub(pattern, snippet, seed_content, flags=re.DOTALL)
    with open('backend/prisma/seed.ts', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('Updated backend/prisma/seed.ts with audited Q009!')
