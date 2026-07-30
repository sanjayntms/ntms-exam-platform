import json
import re

with open('scripts/cs1_data.json', 'r', encoding='utf-8') as f:
    d1 = json.load(f)

with open('scripts/cs2_data.json', 'r', encoding='utf-8') as f:
    d2 = json.load(f)

def format_q(q):
    content = {'prompt': q['prompt'], 'explanation': q['explanation']}
    if q['type'] in ['SINGLE_CHOICE', 'MULTIPLE_CHOICE']:
        content['options'] = q['options']
    elif q['type'] == 'DRAG_AND_DROP':
        content['items'] = q['items']
        content['targets'] = q['targets']
    elif q['type'] == 'TRUE_FALSE':
        content['isTrueCorrect'] = q['isTrueCorrect']

    return {
        'code': q['code'],
        'title': q['title'],
        'type': q['type'],
        'difficulty': 'INTERMEDIATE',
        'points': 1.0,
        'explanation': q['explanation'],
        'content': content
    }

cs1_obj = d1['cs']
cs1_qs = [format_q(q) for q in d1['questions']]

cs2_obj = d2['cs']
cs2_qs = [format_q(q) for q in d2['questions']]

cs1_str = json.dumps(cs1_obj)
cs1_qs_str = json.dumps(cs1_qs)

cs2_str = json.dumps(cs2_obj)
cs2_qs_str = json.dumps(cs2_qs)

snippet = f'''  // ==========================================
  // CASE STUDY 1 & CASE STUDY 2 FOR AZURE BASICS
  // ==========================================
  const cs1Data = {cs1_str};
  const cs1Qs = {cs1_qs_str};

  const dbCS1 = await prisma.caseStudy.create({{
    data: {{
      title: cs1Data.title,
      overview: cs1Data.overview,
      businessRequirements: cs1Data.businessRequirements,
      technicalRequirements: cs1Data.technicalRequirements,
      existingEnvironment: cs1Data.existingEnvironment,
    }},
  }});

  const seededCS1Questions: any[] = [];
  for (const q of cs1Qs) {{
    const dbQ = await prisma.question.create({{
      data: {{
        code: q.code,
        title: q.title,
        type: q.type as any,
        difficulty: 'INTERMEDIATE',
        points: 1.0,
        explanation: q.explanation,
        content: JSON.stringify(q.content),
        categoryId: catAzure.id,
        caseStudyId: dbCS1.id,
      }},
    }});
    seededCS1Questions.push(dbQ);
  }}

  const cs2Data = {cs2_str};
  const cs2Qs = {cs2_qs_str};

  const dbCS2 = await prisma.caseStudy.create({{
    data: {{
      title: cs2Data.title,
      overview: cs2Data.overview,
      businessRequirements: cs2Data.businessRequirements,
      technicalRequirements: cs2Data.technicalRequirements,
      existingEnvironment: cs2Data.existingEnvironment,
    }},
  }});

  const seededCS2Questions: any[] = [];
  for (const q of cs2Qs) {{
    const dbQ = await prisma.question.create({{
      data: {{
        code: q.code,
        title: q.title,
        type: q.type as any,
        difficulty: 'INTERMEDIATE',
        points: 1.0,
        explanation: q.explanation,
        content: JSON.stringify(q.content),
        categoryId: catAzure.id,
        caseStudyId: dbCS2.id,
      }},
    }});
    seededCS2Questions.push(dbQ);
  }}

  // Create Case Study Sections for Azure Basics Exam
  const secCS1 = await prisma.examSection.create({{
    data: {{
      examId: azureBasicsExam.id,
      title: '5. Case Study: Contoso Financial Services Multi-Region Migration (20 Items)',
      orderIndex: 5,
      weightPercentage: 20.0,
    }},
  }});

  let orderCS1 = 1;
  for (const q of seededCS1Questions) {{
    await prisma.sectionQuestion.create({{
      data: {{ sectionId: secCS1.id, questionId: q.id, orderIndex: orderCS1++ }},
    }});
  }}

  const secCS2 = await prisma.examSection.create({{
    data: {{
      examId: azureBasicsExam.id,
      title: '6. Case Study: Fabrikam Healthcare Global Telehealth Platform (20 Items)',
      orderIndex: 6,
      weightPercentage: 20.0,
    }},
  }});

  let orderCS2 = 1;
  for (const q of seededCS2Questions) {{
    await prisma.sectionQuestion.create({{
      data: {{ sectionId: secCS2.id, questionId: q.id, orderIndex: orderCS2++ }},
    }});
  }}

  // Update total questions config for Azure Basics exam
  await prisma.exam.update({{
    where: {{ id: azureBasicsExam.id }},
    data: {{ totalQuestionsConfig: 90 }},
  }});

  console.log("✅ Seeded 2 Case Studies (CS-AZURE-01 & CS-AZURE-02) with 40 Case Questions attached to AZURE-BASICS!");'''

with open('backend/prisma/seed.ts', 'r', encoding='utf-8') as f:
    seed_content = f.read()

m1 = '  // ==========================================\n  // CASE STUDY 1 & CASE STUDY 2 FOR AZURE BASICS'
m2 = '  console.log("✅ Seeded 2 Case Studies (CS-AZURE-01 & CS-AZURE-02) with 40 Case Questions attached to AZURE-BASICS!");'

if m1 in seed_content and m2 in seed_content:
    p1 = seed_content.find(m1)
    p2 = seed_content.find(m2) + len(m2)
    new_content = seed_content[:p1] + snippet + seed_content[p2:]
elif '✅ Seeded AZURE-BASICS with 50 questions' in seed_content:
    target = '  console.log(\'✅ Seeded AZURE-BASICS with 50 questions across 4 Objective Domain Sections & Room HALL-AZURE-BASICS!\');'
    new_content = seed_content.replace(target, target + '\n\n' + snippet)
else:
    new_content = seed_content

with open('backend/prisma/seed.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)
print('Successfully injected Case Studies into backend/prisma/seed.ts!')
