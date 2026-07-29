import sqlite3
import json
import uuid
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

db_path = 'backend/prisma/dev.db'
if not os.path.exists(db_path):
    print(f'Error: {db_path} not found!')
    sys.exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

with open('backend/prisma/terraform_parsed_all.json', 'r', encoding='utf-8') as f:
    domains_data = json.load(f)

# 1. Create or Update Parent Exam Track
parent_exam_id = 'terraform-associate-parent'
cursor.execute("SELECT id FROM Exam WHERE id = ?", (parent_exam_id,))
if not cursor.fetchone():
    cursor.execute("""
        INSERT INTO Exam (id, code, title, description, vendor, isGloballyUnlocked, timeLimitMinutes, passingScore, totalQuestionsConfig, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    """, (
        parent_exam_id,
        'TERRAFORM',
        'HashiCorp Certified: Terraform Associate (003)',
        'HashiCorp Certified: Terraform Associate (003) parent certification exam covering all 7 official HashiCorp Terraform domains.',
        'HASHICORP',
        1, # Unlocked
        120,
        70,
        50
    ))
    print('Created parent exam TERRAFORM')
else:
    cursor.execute("""
        UPDATE Exam SET isGloballyUnlocked = 1, totalQuestionsConfig = 50 WHERE id = ?
    """, (parent_exam_id,))
    print('Updated parent exam TERRAFORM')

# Create Parent Room
parent_room_code = 'HALL-TERRAFORM'
cursor.execute("SELECT id FROM ExamRoom WHERE roomCode = ?", (parent_room_code,))
if not cursor.fetchone():
    cursor.execute("""
        INSERT INTO ExamRoom (id, roomCode, title, examId, status, allowReview, createdBy, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    """, (
        str(uuid.uuid4()),
        parent_room_code,
        'HashiCorp Terraform Complete Certification Hall',
        parent_exam_id,
        'OPEN',
        1,
        'admin'
    ))
    print(f'Created parent room {parent_room_code}')

total_questions_count = 0

for d in domains_data:
    dcode = d['domain_code'] # e.g. D-1
    exam_code = d['exam_code'] # e.g. TERRAFORM-D1
    dtitle = d['domain_title']
    questions = d['questions']
    q_len = len(questions)

    # 2. Create Sub-Exam Track
    sub_exam_id = f'exam-{exam_code.lower()}'
    cursor.execute("SELECT id FROM Exam WHERE code = ?", (exam_code,))
    row = cursor.fetchone()
    if not row:
        cursor.execute("""
            INSERT INTO Exam (id, code, title, description, vendor, isGloballyUnlocked, timeLimitMinutes, passingScore, totalQuestionsConfig, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        """, (
            sub_exam_id,
            exam_code,
            f'HashiCorp Terraform {dcode}: {dtitle.split(":", 1)[-1].strip()}',
            f'Dedicated domain sub-exam for HashiCorp Terraform {dtitle} containing exactly {q_len} domain questions.',
            'HASHICORP',
            1, # Unlocked by default
            60,
            70,
            q_len
        ))
        print(f'Created Sub-Exam {exam_code}')
    else:
        sub_exam_id = row[0]
        cursor.execute("UPDATE Exam SET totalQuestionsConfig = ? WHERE id = ?", (q_len, sub_exam_id))
        print(f'Updated Sub-Exam {exam_code}')

    # 3. Create Dedicated Exam Section under Parent Exam & Sub Exam
    section_id_parent = f'section-parent-{exam_code.lower()}'
    cursor.execute("SELECT id FROM ExamSection WHERE id = ?", (section_id_parent,))
    if not cursor.fetchone():
        cursor.execute("""
            INSERT INTO ExamSection (id, examId, title, orderIndex, weightPercentage, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        """, (section_id_parent, parent_exam_id, dtitle, int(dcode.split('-')[-1]), round((q_len / 170.0) * 100, 1)))

    section_id_sub = f'section-sub-{exam_code.lower()}'
    cursor.execute("SELECT id FROM ExamSection WHERE id = ?", (section_id_sub,))
    if not cursor.fetchone():
        cursor.execute("""
            INSERT INTO ExamSection (id, examId, title, orderIndex, weightPercentage, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        """, (section_id_sub, sub_exam_id, dtitle, 1, 100.0))

    # 4. Create Dedicated Proctored Room Code for Sub-Exam
    room_code = f'HALL-TF-{dcode}'
    cursor.execute("SELECT id FROM ExamRoom WHERE roomCode = ?", (room_code,))
    if not cursor.fetchone():
        cursor.execute("""
            INSERT INTO ExamRoom (id, roomCode, title, examId, status, allowReview, createdBy, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        """, (
            str(uuid.uuid4()),
            room_code,
            f'HashiCorp Terraform {dcode} Proctored Hall',
            sub_exam_id,
            'OPEN',
            1,
            'admin'
        ))
        print(f'Created Room {room_code} for {exam_code}')

    # 5. Insert Questions and Options
    for q in questions:
        q_code = q['code']
        q_prompt = q['prompt']
        q_type = q['type']
        options = q['options']

        cursor.execute("SELECT id FROM Question WHERE code = ?", (q_code,))
        q_row = cursor.fetchone()
        if not q_row:
            q_id = str(uuid.uuid4())
            content_json = json.dumps({
                'prompt': q_prompt,
                'explanation': f'Official answer key for HashiCorp Terraform {dtitle} question {q_code}.'
            }, ensure_ascii=False)

            cursor.execute("""
                INSERT INTO Question (id, code, title, type, difficulty, points, status, examId, sectionId, content, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
            """, (
                q_id,
                q_code,
                q_prompt[:120],
                q_type,
                'INTERMEDIATE',
                1.0,
                'PUBLISHED',
                sub_exam_id,
                section_id_sub,
                content_json
            ))

            # Insert Options
            for idx, opt in enumerate(options):
                opt_id = str(uuid.uuid4())
                cursor.execute("""
                    INSERT INTO Option (id, questionId, text, isCorrect, orderIndex, key)
                    VALUES (?, ?, ?, ?, ?, ?)
                """, (
                    opt_id,
                    q_id,
                    opt['text'],
                    1 if opt['isCorrect'] else 0,
                    idx + 1,
                    opt['key']
                ))

            # Duplicate question linking to parent exam section so full bank is available on parent exam
            parent_q_id = str(uuid.uuid4())
            cursor.execute("""
                INSERT INTO Question (id, code, title, type, difficulty, points, status, examId, sectionId, content, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
            """, (
                parent_q_id,
                f'P-{q_code}',
                q_prompt[:120],
                q_type,
                'INTERMEDIATE',
                1.0,
                'PUBLISHED',
                parent_exam_id,
                section_id_parent,
                content_json
            ))

            for idx, opt in enumerate(options):
                cursor.execute("""
                    INSERT INTO Option (id, questionId, text, isCorrect, orderIndex, key)
                    VALUES (?, ?, ?, ?, ?, ?)
                """, (
                    str(uuid.uuid4()),
                    parent_q_id,
                    opt['text'],
                    1 if opt['isCorrect'] else 0,
                    idx + 1,
                    opt['key']
                ))

            total_questions_count += 1

conn.commit()
conn.close()
print(f'=== SEEDED TOTAL {total_questions_count} TERRAFORM QUESTIONS INTO DATABASE ===')
