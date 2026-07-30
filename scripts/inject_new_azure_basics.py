import json

with open("scripts/new_azure_basics_50.json", "r", encoding="utf-8") as f:
    data = json.load(f)

d1_str = json.dumps(data["d1"], indent=2)
d2_str = json.dumps(data["d2"], indent=2)
d3_str = json.dumps(data["d3"], indent=2)
d4_str = json.dumps(data["d4"], indent=2)

with open("backend/prisma/seed.ts", "r", encoding="utf-8") as f:
    seed_content = f.read()

m1 = "// AZURE BASICS - 50 QUESTIONS (PPTX DERIVED & AUDITED"
m6 = "// CASE STUDY 1 & CASE STUDY 2 FOR AZURE BASICS"

idx1 = seed_content.find(m1)
idx6 = seed_content.find(m6)

if idx1 != -1 and idx6 != -1:
    new_block = f"""// AZURE BASICS - 50 QUESTIONS (PPTX DERIVED & AUDITED - 100% UNIQUE NON-OVERLAPPING)
  const azureBasicsD1 = {d1_str};
  const azureBasicsD2 = {d2_str};
  const azureBasicsD3 = {d3_str};
  const azureBasicsD4 = {d4_str};

  const azureBasicsExam = await prisma.exam.create({{
    data: {{
      code: 'AZURE-BASICS',
      title: 'Azure Basics Certification Practice Exam',
      vendor: 'MICROSOFT',
      examType: 'CERTIFICATION',
      description: 'Comprehensive Azure Basics Certification Exam with 50 Domain questions and 40 Case Study questions.',
      timeLimitMinutes: 120,
      passingScore: 70.0,
      totalQuestionsConfig: 90,
      creatorId: creatorUser.id,
      status: 'PUBLISHED',
    }},
  }});

  const secD1 = await prisma.examSection.create({{
    data: {{ examId: azureBasicsExam.id, title: '1. Domain 1: Cloud Concepts & Architecture (13 Items)', orderIndex: 1, weightPercentage: 15.0 }},
  }});
  let orderD1 = 1;
  for (const q of azureBasicsD1) {{
    const dbQ = await prisma.question.create({{
      data: {{
        code: q.code, title: q.title, type: q.type as any, difficulty: 'INTERMEDIATE', points: 1.0,
        explanation: q.explanation, content: JSON.stringify(q.content), categoryId: catAzure.id,
      }},
    }});
    await prisma.sectionQuestion.create({{
      data: {{ sectionId: secD1.id, questionId: dbQ.id, orderIndex: orderD1++ }},
    }});
  }}

  const secD2 = await prisma.examSection.create({{
    data: {{ examId: azureBasicsExam.id, title: '2. Domain 2: Core Infrastructure & Compute (12 Items)', orderIndex: 2, weightPercentage: 15.0 }},
  }});
  let orderD2 = 1;
  for (const q of azureBasicsD2) {{
    const dbQ = await prisma.question.create({{
      data: {{
        code: q.code, title: q.title, type: q.type as any, difficulty: 'INTERMEDIATE', points: 1.0,
        explanation: q.explanation, content: JSON.stringify(q.content), categoryId: catAzure.id,
      }},
    }});
    await prisma.sectionQuestion.create({{
      data: {{ sectionId: secD2.id, questionId: dbQ.id, orderIndex: orderD2++ }},
    }});
  }}

  const secD3 = await prisma.examSection.create({{
    data: {{ examId: azureBasicsExam.id, title: '3. Domain 3: Storage, Networking & Data Services (12 Items)', orderIndex: 3, weightPercentage: 15.0 }},
  }});
  let orderD3 = 1;
  for (const q of azureBasicsD3) {{
    const dbQ = await prisma.question.create({{
      data: {{
        code: q.code, title: q.title, type: q.type as any, difficulty: 'INTERMEDIATE', points: 1.0,
        explanation: q.explanation, content: JSON.stringify(q.content), categoryId: catAzure.id,
      }},
    }});
    await prisma.sectionQuestion.create({{
      data: {{ sectionId: secD3.id, questionId: dbQ.id, orderIndex: orderD3++ }},
    }});
  }}

  const secD4 = await prisma.examSection.create({{
    data: {{ examId: azureBasicsExam.id, title: '4. Domain 4: Security, Compliance & Governance (13 Items)', orderIndex: 4, weightPercentage: 15.0 }},
  }});
  let orderD4 = 1;
  for (const q of azureBasicsD4) {{
    const dbQ = await prisma.question.create({{
      data: {{
        code: q.code, title: q.title, type: q.type as any, difficulty: 'INTERMEDIATE', points: 1.0,
        explanation: q.explanation, content: JSON.stringify(q.content), categoryId: catAzure.id,
      }},
    }});
    await prisma.sectionQuestion.create({{
      data: {{ sectionId: secD4.id, questionId: dbQ.id, orderIndex: orderD4++ }},
    }});
  }}

  """
    seed_content = seed_content[:idx1] + new_block + seed_content[idx6:]

    with open("backend/prisma/seed.ts", "w", encoding="utf-8") as f:
        f.write(seed_content)
    print("Successfully updated seed.ts with azureBasicsExam creation & questions!")
else:
    print(f"Error: idx1={idx1}, idx6={idx6}")
